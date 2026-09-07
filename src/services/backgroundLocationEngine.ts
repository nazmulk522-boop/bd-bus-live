/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Advanced Background Geolocation & Audio Keep-Alive Engine
 * Keeps geolocation tracking active on mobile devices even when:
 * 1. The phone screen is turned off / locked (using HTML5 Background MediaSession & inaudible loop)
 * 2. The browser tab is backgrounded
 * 3. The device is mounted on a dashboard (using Screen WakeLock API)
 */

import { LiveBusSession } from '../types';
import { updateBroadcastLocation } from './busService';
import { calculateDynamicSpeed } from '../data/bangladeshRoutes';

// 1 second base64 silent WAV audio loop
// RIFF header + WAVE fmt + data with zero PCM samples
const SILENT_WAV_BASE64 =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAP8A';

class BackgroundLocationEngine {
  private audioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private worker: Worker | null = null;
  private wakeLock: any = null;
  private watchId: number | null = null;
  private isRunning: boolean = false;
  private currentSession: LiveBusSession | null = null;
  private deviceSessionId: string = '';
  private prevCoord: { lat: number; lng: number; time: number } | null = null;
  private fallbackInterval: any = null;
  private lastSuccessTime: number = 0;

  constructor() {
    try {
      this.deviceSessionId = localStorage.getItem('bbl_device_session_id') || 'dev-bg-' + Date.now();
    } catch {
      this.deviceSessionId = 'dev-bg-' + Date.now();
    }
  }

  /**
   * Initializes background audio keep-alive and registers MediaSession
   * Must be called inside a user gesture (e.g. click on Start Live or Resume)
   */
  public async start(session: LiveBusSession): Promise<boolean> {
    this.currentSession = session;
    this.isRunning = true;

    // 1. Initialize Screen WakeLock (prevents auto-lock while mounted)
    await this.acquireWakeLock();

    // 2. Start Silent Audio Loop (forces mobile OS to keep browser alive when screen locked)
    this.startBackgroundAudio(session);

    // 3. Start Web Worker background ticker (unaffected by main thread timer throttling)
    this.startWorkerTicker();

    // 4. Start Native Geolocation Watch
    this.startGpsWatch();

    // 5. Register visibility & focus listeners for instant recovery
    this.attachEventListeners();

    console.log('[BackgroundEngine] Started successfully for session:', session.id);
    return true;
  }

  /**
   * Stops background broadcasting and releases all resources
   */
  public stop() {
    this.isRunning = false;
    this.currentSession = null;

    // Release WakeLock
    if (this.wakeLock) {
      try {
        this.wakeLock.release();
      } catch {}
      this.wakeLock = null;
    }

    // Stop Audio Loop
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.src = '';
      } catch {}
      this.audioElement = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }

    // Terminate Web Worker
    if (this.worker) {
      try {
        this.worker.postMessage('stop');
        this.worker.terminate();
      } catch {}
      this.worker = null;
    }

    // Clear GPS Watch
    if (this.watchId !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    // Clear interval fallback
    if (this.fallbackInterval) {
      clearInterval(this.fallbackInterval);
      this.fallbackInterval = null;
    }

    // Clear MediaSession
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = 'none';
      } catch {}
    }

    this.detachEventListeners();
    console.log('[BackgroundEngine] Stopped');
  }

  /**
   * Sends immediate GPS update on demand
   */
  public async forcePushLocation(): Promise<boolean> {
    if (!this.isRunning || !this.currentSession) return false;

    return new Promise((resolve) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await this.handleNewPosition(pos);
          resolve(true);
        },
        () => resolve(false),
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 3000 }
      );
    });
  }

  /**
   * Request screen wakelock so screen doesn't turn off automatically
   */
  private async acquireWakeLock() {
    try {
      if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
        });
      }
    } catch (e) {
      console.warn('[BackgroundEngine] WakeLock not supported or denied', e);
    }
  }

  /**
   * Silent audio loop + MediaSession metadata
   * This is the core mechanism that keeps Android/iOS from killing the tab when the power button is pressed!
   */
  private startBackgroundAudio(session: LiveBusSession) {
    try {
      if (!this.audioElement) {
        const audio = document.createElement('audio');
        audio.src = SILENT_WAV_BASE64;
        audio.loop = true;
        audio.setAttribute('playsinline', 'true');
        audio.setAttribute('webkit-playsinline', 'true');
        audio.volume = 0.01; // Inaudible
        audio.style.display = 'none';
        document.body.appendChild(audio);
        this.audioElement = audio;
      }

      this.audioElement.play().catch((err) => {
        console.warn('[BackgroundEngine] Audio autoplay notice:', err);
      });

      // Web Audio API heartbeat oscillator as extra layer of background protection
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx && !this.audioContext) {
          this.audioContext = new AudioCtx();
          if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
          }
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          gain.gain.value = 0.0001; // completely silent
          osc.connect(gain);
          gain.connect(this.audioContext.destination);
          osc.start();
        }
      } catch {}

      // Android Lock Screen Media Notification
      if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `🚌 ${session.companyNameBn} (${session.busNumber})`,
          artist: 'বাংলাদেশ বাস লাইভ - স্ক্রিন অফ ব্যাকগ্রাউন্ড জিপিএস চলছে',
          album: `রুট: ${session.originBn} ➔ ${session.destinationBn}`
        });

        navigator.mediaSession.playbackState = 'playing';

        // Keep session active on play/pause events from lock screen
        navigator.mediaSession.setActionHandler('play', () => {
          if (this.audioElement) {
            this.audioElement.play().catch(() => {});
          }
          if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
          }
          this.forcePushLocation();
        });

        navigator.mediaSession.setActionHandler('pause', () => {
          // Do not pause the audio so tracking is not accidentally interrupted
          if (this.audioElement) {
            this.audioElement.play().catch(() => {});
          }
        });
      }
    } catch (err) {
      console.warn('[BackgroundEngine] Background audio setup notice:', err);
    }
  }

  /**
   * Start a dedicated Web Worker timer that is not throttled like DOM window.setInterval
   */
  private startWorkerTicker() {
    try {
      const workerCode = `
        let timer = null;
        self.onmessage = function(e) {
          if (e.data === 'start') {
            if (timer) clearInterval(timer);
            timer = setInterval(function() {
              self.postMessage('tick');
            }, 3500);
          } else if (e.data === 'stop') {
            if (timer) clearInterval(timer);
            timer = null;
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      this.worker = new Worker(workerUrl);

      this.worker.onmessage = (e) => {
        if (e.data === 'tick' && this.isRunning) {
          this.tickLocation();
        }
      };

      this.worker.postMessage('start');
    } catch (e) {
      console.warn('[BackgroundEngine] Web Worker creation failed, using fallback timer', e);
      // Fallback to standard interval
      this.fallbackInterval = setInterval(() => {
        if (this.isRunning) {
          this.tickLocation();
        }
      }, 3500);
    }
  }

  /**
   * Periodic location tick from worker or interval
   */
  private tickLocation() {
    if (!this.isRunning || !this.currentSession) return;
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    // Check if watchPosition hasn't fired in the last 6 seconds
    const timeSinceLastSuccess = Date.now() - this.lastSuccessTime;
    if (timeSinceLastSuccess > 5000) {
      navigator.geolocation.getCurrentPosition(
        (pos) => this.handleNewPosition(pos),
        () => {
          // Fallback to network location if high accuracy GPS times out
          navigator.geolocation.getCurrentPosition(
            (pos) => this.handleNewPosition(pos),
            () => {},
            { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 4000 }
      );
    }
  }

  /**
   * Continuous Geolocation Watch
   */
  private startGpsWatch() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => this.handleNewPosition(pos),
      (err) => {
        console.warn('[BackgroundEngine] watchPosition warning:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2500,
        timeout: 10000
      }
    );
  }

  /**
   * Handles new GPS coordinate, computes accurate dynamic speed, and transmits to Firestore & Server
   */
  private async handleNewPosition(pos: GeolocationPosition) {
    if (!this.isRunning || !this.currentSession) return;

    const { latitude, longitude, accuracy, speed, heading } = pos.coords;
    const now = Date.now();
    this.lastSuccessTime = now;

    // Dynamic speed calculation: guarantees moving speed even if mobile coords.speed is null/0
    const dynamicSpeed = calculateDynamicSpeed(
      this.prevCoord,
      { lat: latitude, lng: longitude, time: now },
      speed
    );

    this.prevCoord = { lat: latitude, lng: longitude, time: now };

    try {
      await updateBroadcastLocation({
        sessionId: this.currentSession.id,
        deviceSessionId: this.deviceSessionId,
        lat: latitude,
        lng: longitude,
        accuracy: Math.round(accuracy || 15),
        speed: dynamicSpeed,
        heading: heading || 0,
        timestamp: now
      });
    } catch (err) {
      console.warn('[BackgroundEngine] updateBroadcastLocation error:', err);
    }
  }

  private handleVisibilityOrFocus = () => {
    if (this.isRunning && document.visibilityState === 'visible') {
      this.acquireWakeLock();
      if (this.audioElement && this.audioElement.paused) {
        this.audioElement.play().catch(() => {});
      }
      this.forcePushLocation();
    }
  };

  private attachEventListeners() {
    document.addEventListener('visibilitychange', this.handleVisibilityOrFocus);
    window.addEventListener('focus', this.handleVisibilityOrFocus);
    window.addEventListener('online', this.handleVisibilityOrFocus);
  }

  private detachEventListeners() {
    document.removeEventListener('visibilitychange', this.handleVisibilityOrFocus);
    window.removeEventListener('focus', this.handleVisibilityOrFocus);
    window.removeEventListener('online', this.handleVisibilityOrFocus);
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

// Export singleton instance
export const backgroundLocationEngine = new BackgroundLocationEngine();
