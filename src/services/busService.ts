import { LiveBusSession } from '../types';
import {
  BUS_COMPANIES,
  resolveLocationAndETA
} from '../data/bangladeshRoutes';

const LOCAL_STORAGE_KEY = 'bbl_active_live_buses';
const BROADCAST_CHANNEL_NAME = 'bbl_bus_live_channel';

// Helper for multi-tab / local synchronization
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported');
}

export function getLocalLiveBuses(): LiveBusSession[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const list: LiveBusSession[] = JSON.parse(raw);
    const now = Date.now();
    // Filter out sessions older than 30 minutes
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
 * Safely starts a broadcast session.
 * Tries server API first; if server returns HTML (e.g. Vercel static) or fails,
 * creates a fully functional client-side session seamlessly.
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

  const fallbackSession: LiveBusSession = {
    id: `live-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
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

  try {
    const response = await fetch('/api/buses/start-broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const result = await response.json();
      if (result.session) {
        upsertLocalBusSession(result.session);
        return result.session;
      }
    }
  } catch (err) {
    console.warn('Server API unavailable, falling back to local live broadcast mode:', err);
  }

  // Save to local store so it appears in UI immediately
  upsertLocalBusSession(fallbackSession);
  return fallbackSession;
}

/**
 * Updates a live broadcast session location.
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
  // Update local session
  const localBuses = getLocalLiveBuses();
  const existing = localBuses.find((b) => b.id === payload.sessionId);
  if (existing) {
    const resolved = resolveLocationAndETA(
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

  try {
    const res = await fetch('/api/buses/update-location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // Safely ignore non-JSON or HTML
    if (res.ok && (res.headers.get('content-type') || '').includes('application/json')) {
      await res.json();
    }
  } catch (e) {
    // Expected on static hosting
  }
}

/**
 * Stops a live broadcast session.
 */
export async function stopBroadcastSession(sessionId: string, deviceSessionId: string) {
  removeLocalBusSession(sessionId);

  try {
    await fetch('/api/buses/stop-broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, deviceSessionId })
    });
  } catch (e) {
    // Expected on static hosting
  }
}

/**
 * Fetches all live buses from server and merges with local live buses.
 */
export async function fetchLiveBuses(): Promise<LiveBusSession[]> {
  const localBuses = getLocalLiveBuses();
  let serverBuses: LiveBusSession[] = [];

  try {
    const res = await fetch('/api/buses/live');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.buses && Array.isArray(data.buses)) {
        serverBuses = data.buses;
      }
    }
  } catch {
    // Network or static hosting fallback
  }

  // Merge server & local buses (local takes precedence if matching id)
  const map = new Map<string, LiveBusSession>();
  serverBuses.forEach((b) => map.set(b.id, b));
  localBuses.forEach((b) => map.set(b.id, b));

  return Array.from(map.values());
}
