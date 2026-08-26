export interface BusCompany {
  id: string;
  name: string;
  nameBn: string;
  logoText?: string;
  color: string;
  hotline?: string;
}

export interface RouteCheckpoint {
  id: string;
  name: string;
  nameBn: string;
  lat: number;
  lng: number;
  sequence: number;
  distanceKmFromOrigin: number;
}

export interface BusRoute {
  id: string;
  name: string;
  nameBn: string;
  origin: string;
  destination: string;
  originBn: string;
  destinationBn: string;
  highwayCode: string;
  totalDistanceKm: number;
  estimatedMinutes: number;
  checkpoints: RouteCheckpoint[];
  pathCoordinates: [number, number][]; // [lat, lng]
}

export interface NextCheckpointETA {
  nameBn: string;
  nameEn: string;
  distanceKm: number;
  etaMinutesMin: number;
  etaMinutesMax: number;
}

export interface LiveBusSession {
  id: string;
  busNumber: string;
  companyId: string;
  companyName: string;
  companyNameBn: string;
  routeId: string;
  routeName: string;
  routeNameBn: string;
  originBn: string;
  destinationBn: string;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  routeCoordinates?: [number, number][];
  routeColor?: string;
  currentLat: number;
  currentLng: number;
  accuracy: number; // in meters
  speed: number; // in km/h
  heading: number; // in degrees 0-360
  currentLocationName: string;
  currentLocationNameBn: string;
  lastUpdated: number; // timestamp in ms
  startedAt: number; // timestamp in ms
  status: 'live' | 'idle' | 'offline'; // live <= 60s, idle <= 300s, offline > 300s
  deviceSessionId: string;
  isPassengerBroadcast?: boolean;
  nextCheckpoint?: NextCheckpointETA;
  destinationEta?: NextCheckpointETA;
}

export interface StartBroadcastPayload {
  companyId: string;
  companyName?: string;
  busNumber: string;
  routeId: string;
  customRouteName?: string;
  originBn?: string;
  destinationBn?: string;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  routeCoordinates?: [number, number][];
  routeColor?: string;
  deviceSessionId: string;
  initialLat: number;
  initialLng: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
}

export interface UpdateLocationPayload {
  sessionId: string;
  deviceSessionId: string;
  lat: number;
  lng: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp?: number;
}

