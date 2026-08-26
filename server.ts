import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { BUS_COMPANIES, BUS_ROUTES, resolveLocationAndETA } from './src/data/bangladeshRoutes';
import { LiveBusSession, StartBroadcastPayload, UpdateLocationPayload } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for Live Bus Sessions
const liveSessions = new Map<string, LiveBusSession>();

// SSE connected clients
const sseClients: Response[] = [];

// Broadcast helper for Real-Time SSE
function broadcastSSE(type: string, data: any) {
  const message = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    const client = sseClients[i];
    try {
      client.write(message);
    } catch {
      sseClients.splice(i, 1);
    }
  }
}

// Cleanup stale sessions that haven't updated for over 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of liveSessions.entries()) {
    if (now - session.lastUpdated > 15 * 60 * 1000) {
      liveSessions.delete(id);
      broadcastSSE('bus_stopped', { sessionId: id, busNumber: session.busNumber });
    }
  }
}, 30000);

// Helper to compute status based on lastUpdated time
function getEnrichedActiveBuses(): LiveBusSession[] {
  const now = Date.now();
  const buses: LiveBusSession[] = [];

  for (const session of liveSessions.values()) {
    const ageMs = now - session.lastUpdated;
    let status: 'live' | 'idle' | 'offline' = 'live';

    if (ageMs <= 60000) {
      status = 'live';
    } else if (ageMs <= 300000) {
      status = 'idle'; // Last seen within 5 minutes
    } else {
      status = 'offline'; // Tracking unavailable
    }

    buses.push({
      ...session,
      status
    });
  }

  // Sort: Passenger live broadcasts first, then most recently updated
  return buses.sort((a, b) => {
    if (a.isPassengerBroadcast && !b.isPassengerBroadcast) return -1;
    if (!a.isPassengerBroadcast && b.isPassengerBroadcast) return 1;
    return b.lastUpdated - a.lastUpdated;
  });
}

// ----------------- API ROUTES -----------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Bangladesh Bus Live API',
    brand: 'Nazmul IT',
    timestamp: Date.now(),
    activeCount: liveSessions.size
  });
});

// Get Companies
app.get('/api/companies', (req: Request, res: Response) => {
  res.json(BUS_COMPANIES);
});

// Get Routes
app.get('/api/routes', (req: Request, res: Response) => {
  res.json(BUS_ROUTES);
});

// Get Active Live Buses
app.get('/api/buses/live', (req: Request, res: Response) => {
  const companyFilter = req.query.company as string | undefined;
  const routeFilter = req.query.route as string | undefined;

  let activeBuses = getEnrichedActiveBuses();

  if (companyFilter && companyFilter !== 'all') {
    activeBuses = activeBuses.filter(
      (b) => b.companyId.toLowerCase() === companyFilter.toLowerCase() || b.companyName.toLowerCase() === companyFilter.toLowerCase()
    );
  }

  if (routeFilter && routeFilter !== 'all') {
    activeBuses = activeBuses.filter((b) => b.routeId === routeFilter);
  }

  res.json({
    success: true,
    total: activeBuses.length,
    buses: activeBuses
  });
});

// Start Live Broadcast from Passenger Device
app.post('/api/buses/start-broadcast', (req: Request, res: Response) => {
  try {
    const {
      companyId,
      companyName,
      busNumber,
      routeId,
      customRouteName,
      originBn: customOriginBn,
      destinationBn: customDestinationBn,
      originLat,
      originLng,
      destinationLat,
      destinationLng,
      routeCoordinates,
      routeColor,
      deviceSessionId,
      initialLat,
      initialLng,
      accuracy = 10,
      speed = 0,
      heading = 0
    }: StartBroadcastPayload = req.body;

    if (!busNumber || !companyId || initialLat === undefined || initialLng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'কোম্পানি, বাস নম্বর এবং প্রাথমিক জিপিএস লোকেশন আবশ্যক।'
      });
    }

    const normalizedBusNumber = busNumber.trim();
    const now = Date.now();

    // DUPLICATE TRACKING PREVENTION:
    // Check if another active session already exists for this exact bus number within 90 seconds
    for (const [existingId, existingSession] of liveSessions.entries()) {
      if (
        existingSession.busNumber.toLowerCase() === normalizedBusNumber.toLowerCase() &&
        existingSession.deviceSessionId !== deviceSessionId &&
        now - existingSession.lastUpdated < 90000
      ) {
        return res.status(409).json({
          success: false,
          code: 'DUPLICATE_ACTIVE_TRACKER',
          message: `এই বাসটি (${normalizedBusNumber}) ইতোমধ্যে অন্য একটি ডিভাইস থেকে লাইভ ট্র্যাকিং করছে।`,
          existingSessionId: existingId,
          lastUpdated: existingSession.lastUpdated
        });
      }
    }

    const company = BUS_COMPANIES.find(
      (c) =>
        c.id.toLowerCase() === (companyId || '').toLowerCase() ||
        c.nameBn.toLowerCase() === (companyId || '').toLowerCase() ||
        c.name.toLowerCase() === (companyId || '').toLowerCase()
    );
    const companyNameEn = company ? company.name : companyName || companyId || 'Bus Transport';
    const companyNameBn = company ? company.nameBn : companyName || companyId || 'বাস পরিবহন';

    const route = BUS_ROUTES.find(
      (r) =>
        r.id.toLowerCase() === (routeId || '').toLowerCase() ||
        r.nameBn.toLowerCase() === (routeId || '').toLowerCase() ||
        r.name.toLowerCase() === (routeId || '').toLowerCase()
    );
    const routeNameEn = route ? route.name : customRouteName || routeId || 'Custom Route';
    const routeNameBn = route ? route.nameBn : customRouteName || routeId || 'কাস্টম রুট';
    const originBn = customOriginBn || (route ? route.originBn : 'যাত্রার স্থান');
    const destinationBn = customDestinationBn || (route ? route.destinationBn : 'গন্তব্য');

    const enriched = resolveLocationAndETA(initialLat, initialLng, routeId, speed);

    const sessionId = `live-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newSession: LiveBusSession = {
      id: sessionId,
      busNumber: normalizedBusNumber,
      companyId,
      companyName: companyNameEn,
      companyNameBn,
      routeId: routeId || 'custom',
      routeName: routeNameEn,
      routeNameBn,
      originBn,
      destinationBn,
      originLat,
      originLng,
      destinationLat,
      destinationLng,
      routeCoordinates: routeCoordinates || (route ? route.pathCoordinates : undefined),
      routeColor: routeColor || '#E11D48',
      currentLat: initialLat,
      currentLng: initialLng,
      accuracy,
      speed,
      heading,
      currentLocationName: enriched.locationNameEn,
      currentLocationNameBn: enriched.locationNameBn,
      lastUpdated: now,
      startedAt: now,
      status: 'live',
      deviceSessionId,
      isPassengerBroadcast: true,
      nextCheckpoint: enriched.nextCheckpoint,
      destinationEta: enriched.destinationEta
    };

    liveSessions.set(sessionId, newSession);

    // Broadcast to SSE clients
    broadcastSSE('bus_started', newSession);

    res.status(201).json({
      success: true,
      message: 'লাইভ ট্র্যাকিং সফলভাবে শুরু হয়েছে!',
      session: newSession
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'সার্ভার ত্রুটি'
    });
  }
});

// Update Location from Phone GPS
app.post('/api/buses/update-location', (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      deviceSessionId,
      lat,
      lng,
      accuracy = 10,
      speed = 0,
      heading = 0
    }: UpdateLocationPayload = req.body;

    if (!sessionId || lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: 'সেশন আইডি ও জিপিএস কোঅর্ডিনেট আবশ্যক।' });
    }

    const session = liveSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'লাইভ সেশন পাওয়া যায়নি।' });
    }

    // Security & integrity check
    if (session.deviceSessionId && deviceSessionId && session.deviceSessionId !== deviceSessionId) {
      return res.status(403).json({ success: false, message: 'অননুমোদিত ডিভাইস রিকোয়েস্ট।' });
    }

    // Bangladesh coordinate validation (Lat ~20.5-26.7, Lng ~88.0-92.7)
    if (lat < 20.0 || lat > 27.0 || lng < 87.5 || lng > 93.0) {
      return res.status(422).json({ success: false, message: 'জিপিএস লোকেশন বাংলাদেশের সীমানার বাইরে।' });
    }

    const now = Date.now();
    const currentSpeedKmH = typeof speed === 'number' && !isNaN(speed) && speed > 0 ? Math.round(speed * 3.6) : (speed || 0);

    const enriched = resolveLocationAndETA(lat, lng, session.routeId, currentSpeedKmH);

    session.currentLat = lat;
    session.currentLng = lng;
    session.accuracy = accuracy;
    session.speed = currentSpeedKmH;
    session.heading = heading || session.heading || 0;
    session.lastUpdated = now;
    session.currentLocationName = enriched.locationNameEn;
    session.currentLocationNameBn = enriched.locationNameBn;
    session.nextCheckpoint = enriched.nextCheckpoint;
    session.destinationEta = enriched.destinationEta;
    session.status = 'live';

    liveSessions.set(sessionId, session);

    // Broadcast update to real-time clients
    broadcastSSE('bus_location_update', session);

    res.json({
      success: true,
      updatedAt: now,
      session
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'সার্ভার ত্রুটি'
    });
  }
});

// Stop Broadcast
app.post('/api/buses/stop-broadcast', (req: Request, res: Response) => {
  try {
    const { sessionId, deviceSessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'সেশন আইডি আবশ্যক।' });
    }

    const session = liveSessions.get(sessionId);
    if (session) {
      if (session.deviceSessionId && deviceSessionId && session.deviceSessionId !== deviceSessionId) {
        return res.status(403).json({ success: false, message: 'অননুমোদিত ডিভাইস।' });
      }
      liveSessions.delete(sessionId);
      broadcastSSE('bus_stopped', { sessionId, busNumber: session.busNumber });
    }

    res.json({
      success: true,
      message: 'লাইভ ট্র্যাকিং বন্ধ করা হয়েছে।'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'সার্ভার ত্রুটি'
    });
  }
});

// Real-Time Server-Sent Events (SSE) endpoint
app.get('/api/buses/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  // Send initial active fleet immediately
  const initialData = getEnrichedActiveBuses();
  res.write(`event: initial_fleet\ndata: ${JSON.stringify(initialData)}\n\n`);

  sseClients.push(res);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) {
      sseClients.splice(idx, 1);
    }
  });
});

// ----------------- VITE & STATIC SERVING -----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚌 Bangladesh Bus Live Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
