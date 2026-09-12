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
import { calculateDynamicSpeed, resolveLocationAndETA } from '../data/bangladeshRoutes';

export interface BroadcastTelemetry {
  isRunning: boolean;
  sessionId: string;
  companyNameBn: string;
  busNumber: string;
  originBn: string;
  destinationBn: string;
  pingsSentCount: number;
  lastPingTimestamp: number;
  isTransmitting: boolean;
  gpsActive: boolean;
  currentLat: number;
  currentLng: number;
  accuracy: number;
  speed: number;
  heading: number;
  currentLocationNameBn: string;
}

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
  private pingsSentCount: number = 0;
  private isTransmitting: boolean = false;
  private isRequestPending: boolean = false;
  private lastRequestStartTime: number = 0;
  private latestCoords: { lat: number; lng: number; accuracy: number; speed: number; heading: number } | null = null;
  private latestLocationNameBn: string = '';
  private listeners: Set<(state: BroadcastTelemetry) => void> = new Set();

  constructor() {
    try {
      let saved = localStorage.getItem('bbl_device_session_id');
      if (!saved) {
        saved = 'dev-bg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
        localStorage.setItem('bbl_device_session_id', saved);
      }
      this.deviceSessionId = saved;
    } catch {
      this.deviceSessionId = 'dev-bg-' + Date.now();
    }
  }

  /**
   * Subscribe to live broadcaster telemetry (GPS coordinates, pings count, transmission pulse)
   */
  public subscribe(listener: (state: BroadcastTelemetry) => void): () => void {
    this.listeners.add(listener);
    // Emit immediate current state
    listener(this.getTelemetry());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getTelemetry(): BroadcastTelemetry {
    return {
      isRunning: this.isRunning,
      sessionId: this.currentSession?.id || '',
      companyNameBn: this.currentSession?.companyNameBn || '',
      busNumber: this.currentSession?.busNumber || '',
      originBn: this.currentSession?.originBn || '',
      destinationBn: this.currentSession?.destinationBn || '',
      pingsSentCount: this.pingsSentCount,
      lastPingTimestamp: this.lastSuccessTime,
      isTransmitting: this.isTransmitting,
      gpsActive: !!this.latestCoords,
      currentLat: this.latestCoords?.lat || this.currentSession?.currentLat || 0,
      currentLng: this.latestCoords?.lng || this.currentSession?.currentLng || 0,
      accuracy: this.latestCoords?.accuracy || this.currentSession?.accuracy || 0,
      speed: this.latestCoords?.speed || this.currentSession?.speed || 0,
      heading: this.latestCoords?.heading || this.currentSession?.heading || 0,
      currentLocationNameBn: this.latestLocationNameBn || this.currentSession?.currentLocationNameBn || ''
    };
  }

  private notifyListeners() {
    const telemetry = this.getTelemetry();
    for (const listener of this.listeners) {
      try {
        listener(telemetry);
      } catch (err) {
        console.error('[BackgroundEngine] listener error', err);
      }
    }
  }

  /**
   * Initializes background audio keep-alive, auto-refresh ticker, and GPS sensor
   * Must be called inside a user gesture or upon session initialization
   */
  public async start(session: LiveBusSession): Promise<boolean> {
    // If already running for this exact session, just ensure session metadata is synced
    if (this.isRunning && this.currentSession?.id === session.id) {
      this.currentSession = session;
      this.forcePushLocation();
      this.notifyListeners();
      return true;
    }

    // Clean up any previous session state
    if (this.isRunning) {
      this.stop();
    }

    this.currentSession = session;
    this.isRunning = true;
    this.pingsSentCount = 0;
    this.lastSuccessTime = Date.now();
    this.latestCoords = {
      lat: session.currentLat,
      lng: session.currentLng,
      accuracy: session.accuracy || 15,
      speed: session.speed || 0,
      heading: session.heading || 0
    };
    this.latestLocationNameBn = session.currentLocationNameBn || '';

    // 1. Initialize Screen WakeLock (keeps display on if phone mounted on dashboard)
    await this.acquireWakeLock();

    // 2. Start Silent Audio Loop & Lock Screen MediaSession (prevents OS from killing tab on screen lock)
    this.startBackgroundAudio(session);

    // 3. Start Web Worker background ticker (ticks every 2.5 seconds to force GPS auto-refresh)
    this.startWorkerTicker();

    // 4. Start Continuous Native Geolocation Watch
    this.startGpsWatch();

    // 5. Register visibility & focus listeners for instant recovery
    this.attachEventListeners();

    // 6. Trigger immediate initial high-accuracy position query
    this.forcePushLocation();

    this.notifyListeners();
    console.log('[BackgroundEngine] Continuous auto-refresh GPS engine started for:', session.id);
    return true;
  }

  /**
   * Stops background broadcasting and releases all resources
   */
  public stop() {
    this.isRunning = false;
    this.currentSession = null;
    this.prevCoord = null;
    this.isRequestPending = false;
    this.isTransmitting = false;

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
    this.notifyListeners();
    console.log('[BackgroundEngine] Stopped');
  }

  /**
   * Sends immediate fresh GPS update on demand (forces maximumAge: 0)
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
        () => {
          // Low accuracy fallback if high accuracy times out
          navigator.geolocation.getCurrentPosition(
            async (fallbackPos) => {
              await this.handleNewPosition(fallbackPos);
              resolve(true);
            },
            () => resolve(false),
            { enableHighAccuracy: false, timeout: 4000, maximumAge: 5000 }
          );
        },
        { enableHighAccuracy: true, timeout: 4000, maximumAge: 0 }
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
      console.warn('[BackgroundEngine] WakeLock notice:', e);
    }
  }

  /**
   * Silent audio loop + MediaSession metadata
   * Core mechanism that keeps Android/iOS from suspending JS when screen is locked
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

      // Android / iOS Lock Screen Media Notification
      if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `🚌 ${session.companyNameBn} (${session.busNumber})`,
          artist: 'বাংলাদেশ বাস লাইভ - স্ক্রিন অফ ব্যাকগ্রাউন্ড জিপিএস চলছে',
          album: `রুট: ${session.originBn} ➔ ${session.destinationBn}`
        });

        navigator.mediaSession.playbackState = 'playing';

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
   * Start a dedicated Web Worker timer (runs every 2500ms) unaffected by main thread timer throttling
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
            }, 2500);
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
      }, 2500);
    }
  }

  /**
   * Periodic active location tick from worker or interval (forces maximumAge: 0)
   */
  private tickLocation() {
    if (!this.isRunning || !this.currentSession) return;
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    // Prevent duplicate overlapping requests if hardware lock is still pending
    if (this.isRequestPending) {
      if (Date.now() - this.lastRequestStartTime > 5000) {
        this.isRequestPending = false;
      } else {
        return;
      }
    }

    this.isRequestPending = true;
    this.lastRequestStartTime = Date.now();

    // Actively query device GPS sensor without using any cached position (maximumAge: 0)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.isRequestPending = false;
        this.handleNewPosition(pos);
      },
      (err) => {
        // High accuracy timed out; immediately fall back to network location
        navigator.geolocation.getCurrentPosition(
          (fallbackPos) => {
            this.isRequestPending = false;
            this.handleNewPosition(fallbackPos);
          },
          () => {
            this.isRequestPending = false;
          },
          { enableHighAccuracy: false, timeout: 3500, maximumAge: 4000 }
        );
      },
      { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
    );
  }

  /**
   * Continuous Geolocation Watch (hardware push listener)
   */
  private startGpsWatch() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => this.handleNewPosition(pos),
      (err) => {
        console.warn('[BackgroundEngine] watchPosition notice:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 8000
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
    this.latestCoords = {
      lat: latitude,
      lng: longitude,
      accuracy: Math.round(accuracy || 15),
      speed: dynamicSpeed,
      heading: heading || 0
    };

    // Immediate landmark resolution
    const routeId = this.currentSession.routeId || '';
    const resolved = resolveLocationAndETA(latitude, longitude, routeId, dynamicSpeed);
    if (resolved.locationNameBn) {
      this.latestLocationNameBn = resolved.locationNameBn;
    }

    this.isTransmitting = true;
    this.notifyListeners();

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
      this.pingsSentCount++;
    } catch (err) {
      console.warn('[BackgroundEngine] updateBroadcastLocation error:', err);
    } finally {
      this.isTransmitting = false;
      this.notifyListeners();
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

  public getPingsCount(): number {
    return this.pingsSentCount;
  }
}

// Export singleton instance
export const backgroundLocationEngine = new BackgroundLocationEngine();
