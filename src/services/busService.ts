import { LiveBusSession } from '../types';
import {
  BUS_COMPANIES,
  resolveLocationAndETA
} from '../data/bangladeshRoutes';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs
} from 'firebase/firestore';

const COLLECTION_NAME = 'live_buses';
const LOCAL_STORAGE_KEY = 'bbl_active_live_buses';
const BROADCAST_CHANNEL_NAME = 'bbl_bus_live_channel';

// Helper for multi-tab synchronization
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported');
}

/**
 * Strips undefined properties so Firestore doesn't reject document writes
 */
function sanitizeForFirestore(obj: any): any {
  const result: any = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function getLocalLiveBuses(): LiveBusSession[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const list: LiveBusSession[] = JSON.parse(raw);
    const now = Date.now();
    return list.filter((b) => now - b.lastUpdated < 30 * 60 * 1000);
  } catch {
    return [];
  }
}

export function saveLocalLiveBuses(buses: LiveBusSession[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(buses));
    broadcastChannel?.postMessage({ type: 'BUSES_UPDATED', buses });
    window.dispatchEvent(new CustomEvent('bbl_local_buses_updated', { detail: buses }));
  } catch (e) {
    console.error('Failed to save local live buses', e);
  }
}

export function upsertLocalBusSession(session: LiveBusSession) {
  const current = getLocalLiveBuses();
  const index = current.findIndex((b) => b.id === session.id);
  let updated: LiveBusSession[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = session;
  } else {
    updated = [session, ...current];
  }
  saveLocalLiveBuses(updated);
}

export function removeLocalBusSession(sessionId: string) {
  const current = getLocalLiveBuses();
  const updated = current.filter((b) => b.id !== sessionId);
  saveLocalLiveBuses(updated);
}

/**
 * Starts a live broadcast session and saves it to Firestore Cloud DB + Local Cache
 */
export async function startBroadcastSession(payload: {
  companyId: string;
  companyName: string;
  busNumber: string;
  routeId: string;
  customRouteName?: string;
  originBn: string;
  destinationBn: string;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  routeCoordinates?: [number, number][];
  routeColor?: string;
  deviceSessionId: string;
  initialLat: number;
  initialLng: number;
  accuracy: number;
  speed: number;
  heading: number;
}): Promise<LiveBusSession> {
  const matchedCompany = BUS_COMPANIES.find(
    (c) =>
      c.id === payload.companyId ||
      c.nameBn.toLowerCase() === payload.companyName.toLowerCase() ||
      c.name.toLowerCase() === payload.companyName.toLowerCase()
  );

  const companyNameBn = matchedCompany ? matchedCompany.nameBn : payload.companyName;
  const companyColor = matchedCompany ? matchedCompany.color : payload.routeColor || '#E11D48';

  const resolved = resolveLocationAndETA(
    payload.initialLat,
    payload.initialLng,
    payload.routeId,
    payload.speed
  );

  const sessionId = `bus-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const newSession: LiveBusSession = {
    id: sessionId,
    busNumber: payload.busNumber,
    companyId: payload.companyId,
    companyName: payload.companyName,
    companyNameBn,
    routeId: payload.routeId,
    routeName: payload.customRouteName || `${payload.originBn} - ${payload.destinationBn}`,
    routeNameBn: payload.customRouteName || `${payload.originBn} ➔ ${payload.destinationBn}`,
    originBn: payload.originBn,
    destinationBn: payload.destinationBn,
    originLat: payload.originLat,
    originLng: payload.originLng,
    destinationLat: payload.destinationLat,
    destinationLng: payload.destinationLng,
    routeCoordinates: payload.routeCoordinates,
    routeColor: companyColor,
    currentLat: payload.initialLat,
    currentLng: payload.initialLng,
    accuracy: payload.accuracy,
    speed: payload.speed,
    heading: payload.heading,
    currentLocationName: resolved.locationNameEn,
    currentLocationNameBn: resolved.locationNameBn,
    nextCheckpoint: resolved.nextCheckpoint,
    destinationEta: resolved.destinationEta,
    status: 'live',
    startedAt: Date.now(),
    lastUpdated: Date.now(),
    deviceSessionId: payload.deviceSessionId
  };

  // 1. Immediately store in local cache so current user sees it without delay
  upsertLocalBusSession(newSession);

  // 2. Publish to Firebase Firestore cloud database (visible to all users across all browsers & devices)
  try {
    const docRef = doc(db, COLLECTION_NAME, sessionId);
    const sanitized = sanitizeForFirestore(newSession);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (err) {
    console.error('Firestore cloud broadcast error:', err);
  }

  // 3. Also notify Express backend if running in fullstack mode
  try {
    await fetch('/api/buses/start-broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, sessionId })
    });
  } catch {
    // Expected on static hosting
  }

  return newSession;
}

/**
 * Updates a live broadcast session location across Cloud & Local
 */
export async function updateBroadcastLocation(payload: {
  sessionId: string;
  deviceSessionId: string;
  lat: number;
  lng: number;
  accuracy: number;
  speed: number;
  heading: number;
  timestamp: number;
}) {
  const localBuses = getLocalLiveBuses();
  const existing = localBuses.find((b) => b.id === payload.sessionId);
  
  let resolved: any = { locationNameEn: '', locationNameBn: '', nextCheckpoint: '', destinationEta: '' };
  if (existing) {
    resolved = resolveLocationAndETA(
      payload.lat,
      payload.lng,
      existing.routeId,
      payload.speed
    );

    const updated: LiveBusSession = {
      ...existing,
      currentLat: payload.lat,
      currentLng: payload.lng,
      accuracy: payload.accuracy,
      speed: payload.speed,
      heading: payload.heading,
      currentLocationName: resolved.locationNameEn || existing.currentLocationName,
      currentLocationNameBn: resolved.locationNameBn || existing.currentLocationNameBn,
      nextCheckpoint: resolved.nextCheckpoint || existing.nextCheckpoint,
      destinationEta: resolved.destinationEta || existing.destinationEta,
      status: 'live',
      lastUpdated: payload.timestamp || Date.now()
    };
    upsertLocalBusSession(updated);
  }

  // Sync to Firestore Cloud DB
  try {
    const docRef = doc(db, COLLECTION_NAME, payload.sessionId);
    const updateData = sanitizeForFirestore({
      currentLat: payload.lat,
      currentLng: payload.lng,
      accuracy: payload.accuracy,
      speed: payload.speed,
      heading: payload.heading,
      currentLocationName: resolved.locationNameEn,
      currentLocationNameBn: resolved.locationNameBn,
      nextCheckpoint: resolved.nextCheckpoint,
      destinationEta: resolved.destinationEta,
      status: 'live',
      lastUpdated: payload.timestamp || Date.now()
    });
    await setDoc(docRef, updateData, { merge: true });
  } catch (err) {
    console.error('Firestore location sync error:', err);
  }

  // Also sync to backend API if available
  try {
    await fetch('/api/buses/update-location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    // Expected on static hosting
  }
}

/**
 * Stops a live broadcast session
 */
export async function stopBroadcastSession(sessionId: string, deviceSessionId: string) {
  removeLocalBusSession(sessionId);

  // Remove / Mark offline in Firestore Cloud DB
  try {
    const docRef = doc(db, COLLECTION_NAME, sessionId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Firestore stop session error:', err);
  }

  try {
    await fetch('/api/buses/stop-broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, deviceSessionId })
    });
  } catch {
    // Expected on static hosting
  }
}

/**
 * Subscribes to real-time live bus updates from Firebase Cloud Firestore.
 * Automatically triggers callback whenever any bus in the world is added, updated, or stopped!
 */
export function subscribeToLiveBuses(onUpdate: (buses: LiveBusSession[]) => void): () => void {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const now = Date.now();
        const firestoreBuses: LiveBusSession[] = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as LiveBusSession;
          // Filter out stale sessions older than 25 minutes
          if (data && now - (data.lastUpdated || 0) < 25 * 60 * 1000) {
            firestoreBuses.push({
              ...data,
              id: docSnap.id
            });
          }
        });

        // Merge with local buses
        const localBuses = getLocalLiveBuses();
        const map = new Map<string, LiveBusSession>();
        firestoreBuses.forEach((b) => map.set(b.id, b));
        localBuses.forEach((b) => {
          if (!map.has(b.id)) {
            map.set(b.id, b);
          }
        });

        const merged = Array.from(map.values()).sort((a, b) => b.lastUpdated - a.lastUpdated);
        onUpdate(merged);
      },
      (error) => {
        console.warn('Firestore real-time subscription error, using local/polling fallback:', error);
        // Fallback to local buses
        onUpdate(getLocalLiveBuses());
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Could not establish Firestore subscription:', err);
    onUpdate(getLocalLiveBuses());
    return () => {};
  }
}

/**
 * Fetches all live buses (One-time fetch)
 */
export async function fetchLiveBuses(): Promise<LiveBusSession[]> {
  const localBuses = getLocalLiveBuses();
  let firestoreBuses: LiveBusSession[] = [];

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    const now = Date.now();
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as LiveBusSession;
      if (data && now - (data.lastUpdated || 0) < 25 * 60 * 1000) {
        firestoreBuses.push({
          ...data,
          id: docSnap.id
        });
      }
    });
  } catch (err) {
    console.warn('Firestore fetch fallback:', err);
  }

  const map = new Map<string, LiveBusSession>();
  firestoreBuses.forEach((b) => map.set(b.id, b));
  localBuses.forEach((b) => {
    if (!map.has(b.id)) {
      map.set(b.id, b);
    }
  });

  return Array.from(map.values()).sort((a, b) => b.lastUpdated - a.lastUpdated);
}
