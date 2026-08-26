import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { LiveBusSession } from '../types';
import {
  BUS_ROUTES,
  formatBanglaTimeAgo,
  toBanglaNumber,
  buildRouteDirection,
  getHighwayTrafficConditions
} from '../data/bangladeshRoutes';
import {
  X,
  Navigation,
  Gauge,
  Clock,
  Compass,
  MapPin,
  Locate,
  Layers,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Radio
} from 'lucide-react';

interface LiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBus: LiveBusSession | null;
  allBuses: LiveBusSession[];
  onSelectBus: (bus: LiveBusSession) => void;
}

// Subcomponent to draw real Google Maps Driving Route (Turn-by-turn road curves), Traffic Layer and handle pan/center
function RouteRenderer({
  origin,
  destination,
  routeCoordinates,
  routeColor = '#E11D48',
  busLat,
  busLng,
  autoCenter,
  showTraffic,
  onRouteCalculated
}: {
  origin: { lat: number; lng: number } | string;
  destination: { lat: number; lng: number } | string;
  routeCoordinates?: [number, number][];
  routeColor?: string;
  busLat: number;
  busLng: number;
  autoCenter: boolean;
  showTraffic: boolean;
  onRouteCalculated?: (data: { distanceText: string; durationText: string; distanceKm: number; durationMin: number }) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const [roadPath, setRoadPath] = useState<{ lat: number; lng: number }[]>([]);

  // 1. Auto center on moving bus
  useEffect(() => {
    if (!map) return;
    if (autoCenter) {
      map.panTo({ lat: busLat, lng: busLng });
    }
  }, [map, busLat, busLng, autoCenter]);

  // 2. Google Maps Native Traffic Layer Integration
  useEffect(() => {
    if (!map) return;

    const trafficLayer = new google.maps.TrafficLayer();
    if (showTraffic) {
      trafficLayer.setMap(map);
    } else {
      trafficLayer.setMap(null);
    }

    return () => {
      trafficLayer.setMap(null);
    };
  }, [map, showTraffic]);

  // 3. Compute authentic Google Maps driving route that curves along real Bangladesh roads & highways
  useEffect(() => {
    if (!map || !routesLib || !origin || !destination) {
      if (routeCoordinates && routeCoordinates.length > 0) {
        setRoadPath(routeCoordinates.map(([lat, lng]) => ({ lat, lng })));
      }
      return;
    }

    const directionsService = new routesLib.DirectionsService();

    const originParam =
      typeof origin === 'string'
        ? origin
        : new google.maps.LatLng(origin.lat, origin.lng);

    const destParam =
      typeof destination === 'string'
        ? destination
        : new google.maps.LatLng(destination.lat, destination.lng);

    directionsService.route(
      {
        origin: originParam,
        destination: destParam,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result && result.routes[0]) {
          const firstRoute = result.routes[0];
          const pathPoints = firstRoute.overview_path.map((p) => ({
            lat: p.lat(),
            lng: p.lng()
          }));

          setRoadPath(pathPoints);

          const leg = firstRoute.legs[0];
          if (leg && onRouteCalculated) {
            onRouteCalculated({
              distanceText: leg.distance?.text || '',
              durationText: leg.duration?.text || '',
              distanceKm: leg.distance ? Math.round(leg.distance.value / 1000) : 0,
              durationMin: leg.duration ? Math.round(leg.duration.value / 60) : 0
            });
          }
        } else {
          console.warn('DirectionsService failed or unavailable, using coordinate fallback:', status);
          if (routeCoordinates && routeCoordinates.length > 0) {
            setRoadPath(routeCoordinates.map(([lat, lng]) => ({ lat, lng })));
          }
        }
      }
    );
  }, [map, routesLib, origin, destination, routeCoordinates]);

  // 4. Draw dual-layered Google Maps Polyline hugging every road curve
  useEffect(() => {
    if (!map || roadPath.length === 0) return;

    // High-visibility white casing/border
    const outerPolyline = new google.maps.Polyline({
      path: roadPath,
      geodesic: true,
      strokeColor: '#FFFFFF',
      strokeOpacity: 0.95,
      strokeWeight: 7,
      zIndex: 10,
      map
    });

    // Primary route color line
    const innerPolyline = new google.maps.Polyline({
      path: roadPath,
      geodesic: true,
      strokeColor: routeColor || '#E11D48',
      strokeOpacity: 0.95,
      strokeWeight: 4.5,
      zIndex: 11,
      map
    });

    return () => {
      outerPolyline.setMap(null);
      innerPolyline.setMap(null);
    };
  }, [map, roadPath, routeColor]);

  return null;
}

export const LiveMapModal: React.FC<LiveMapModalProps> = ({
  isOpen,
  onClose,
  selectedBus,
  allBuses,
  onSelectBus
}) => {
  const [activeInfoWindowBus, setActiveInfoWindowBus] = useState<LiveBusSession | null>(selectedBus);
  const [autoCenter, setAutoCenter] = useState(true);
  const [showTraffic, setShowTraffic] = useState(true); // Traffic layer ON by default
  const [googleRouteInfo, setGoogleRouteInfo] = useState<{
    distanceText: string;
    durationText: string;
    distanceKm: number;
    durationMin: number;
  } | null>(null);

  useEffect(() => {
    if (selectedBus) {
      setActiveInfoWindowBus(selectedBus);
    }
  }, [selectedBus]);

  if (!isOpen || !selectedBus) return null;

  // Resolve direction coordinates
  const calculatedDirection = buildRouteDirection(
    selectedBus.originBn || 'ঢাকা (গাবতলী)',
    selectedBus.destinationBn || 'সিরাজগঞ্জ'
  );

  const routeCoords = selectedBus.routeCoordinates || calculatedDirection.pathCoordinates;
  const routeColor = selectedBus.routeColor || '#E11D48';
  const trafficConditions = getHighwayTrafficConditions(selectedBus.routeId);

  const originLocation = calculatedDirection.originGeo
    ? { lat: calculatedDirection.originGeo.lat, lng: calculatedDirection.originGeo.lng }
    : selectedBus.originBn || 'ঢাকা (গাবতলী)';

  const destLocation = calculatedDirection.destinationGeo
    ? { lat: calculatedDirection.destinationGeo.lat, lng: calculatedDirection.destinationGeo.lng }
    : selectedBus.destinationBn || 'সিরাজগঞ্জ';

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const initialCenter = {
    lat: selectedBus.currentLat,
    lng: selectedBus.currentLng
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      style={{ touchAction: 'manipulation' }}
    >
      <div className="relative w-full max-w-6xl h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top Action Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-xs">
              🚌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {selectedBus.companyNameBn}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Live GPS</span>
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="font-mono font-bold text-slate-800">{selectedBus.busNumber}</span>
                <span>•</span>
                <span className="text-slate-700 font-semibold flex items-center gap-1">
                  <span>{selectedBus.originBn}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span>{selectedBus.destinationBn}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Traffic Layer Toggle Button */}
            <button
              type="button"
              onClick={() => setShowTraffic(!showTraffic)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                showTraffic
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-400/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
              id="btn-toggle-traffic-layer"
            >
              <span>🚦 ট্রাফিক ও জ্যাম: {showTraffic ? 'অন (ON)' : 'অফ (OFF)'}</span>
            </button>

            {/* Auto Focus Toggle */}
            <button
              type="button"
              onClick={() => setAutoCenter(!autoCenter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                autoCenter
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
              title="বাসের সাথে অটো ফোকাস"
              id="btn-toggle-autocenter"
            >
              <Locate className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">অটো ফোকাস</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              id="btn-close-map-modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Container Area */}
        <div className="relative flex-1 w-full h-full bg-slate-100 overflow-hidden">
          {/* Top Floating Google Maps Driving Route Status Badge */}
          <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none flex flex-col gap-2">
            <div className="bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-lg border border-slate-700/80 flex items-center gap-2.5 max-w-sm pointer-events-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <div>
                <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                  <span>🛣️ গুগল ম্যাপ ড্রাইভিং রুট (রাস্তা অনুসারে বাঁকানো)</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">
                  {googleRouteInfo ? (
                    <span>
                      মোট দূরত্ব: {toBanglaNumber(googleRouteInfo.distanceKm)} কিমি • সময়: {toBanglaNumber(googleRouteInfo.durationMin)} মিনিট
                    </span>
                  ) : (
                    <span>
                      {selectedBus.originBn} ➔ {selectedBus.destinationBn}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {apiKey ? (
            /* Google Maps Platform JS Provider */
            <APIProvider apiKey={apiKey} language="bn" region="BD">
              <Map
                mapId="DEMO_MAP_ID"
                defaultCenter={initialCenter}
                defaultZoom={11}
                gestureHandling="greedy"
                disableDefaultUI={false}
                style={{ width: '100%', height: '100%' }}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              >
                <RouteRenderer
                  origin={originLocation}
                  destination={destLocation}
                  routeCoordinates={routeCoords}
                  routeColor={routeColor}
                  busLat={selectedBus.currentLat}
                  busLng={selectedBus.currentLng}
                  autoCenter={autoCenter}
                  showTraffic={showTraffic}
                  onRouteCalculated={(info) => setGoogleRouteInfo(info)}
                />

                {/* Origin Stop Flag Marker */}
                {calculatedDirection.originGeo && (
                  <AdvancedMarker
                    position={{
                      lat: calculatedDirection.originGeo.lat,
                      lng: calculatedDirection.originGeo.lng
                    }}
                    title={`শুরু কাউন্টার: ${calculatedDirection.originGeo.nameBn}`}
                  >
                    <div className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border-2 border-white shadow-md flex items-center gap-1">
                      <span>🟢 শুরু: {calculatedDirection.originGeo.nameBn}</span>
                    </div>
                  </AdvancedMarker>
                )}

                {/* Destination Stop Flag Marker */}
                {calculatedDirection.destinationGeo && (
                  <AdvancedMarker
                    position={{
                      lat: calculatedDirection.destinationGeo.lat,
                      lng: calculatedDirection.destinationGeo.lng
                    }}
                    title={`গন্তব্য কাউন্টার: ${calculatedDirection.destinationGeo.nameBn}`}
                  >
                    <div className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border-2 border-white shadow-md flex items-center gap-1">
                      <span>🔴 গন্তব্য: {calculatedDirection.destinationGeo.nameBn}</span>
                    </div>
                  </AdvancedMarker>
                )}

                {/* Intermediate Checkpoints */}
                {calculatedDirection.checkpoints.map((cp) => (
                  <AdvancedMarker
                    key={cp.id}
                    position={{ lat: cp.lat, lng: cp.lng }}
                    title={cp.nameBn}
                  >
                    <div className="bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-300 shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      <span>{cp.nameBn}</span>
                    </div>
                  </AdvancedMarker>
                ))}

                {/* All Active Buses Markers */}
                {allBuses.map((bus) => {
                  const isSelected = bus.id === selectedBus.id;
                  return (
                    <AdvancedMarker
                      key={bus.id}
                      position={{ lat: bus.currentLat, lng: bus.currentLng }}
                      onClick={() => {
                        onSelectBus(bus);
                        setActiveInfoWindowBus(bus);
                      }}
                      title={`${bus.companyNameBn} (${bus.busNumber})`}
                    >
                      <div
                        className={`relative flex items-center justify-center p-2.5 rounded-2xl shadow-lg transition-transform cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white scale-125 ring-4 ring-emerald-500/30 z-30'
                            : 'bg-slate-900 text-white hover:scale-110 z-10'
                        }`}
                      >
                        <span className="text-lg">🚌</span>
                        {bus.speed > 0 && (
                          <div
                            className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white"
                            style={{ transform: `rotate(${bus.heading || 0}deg)` }}
                          />
                        )}
                      </div>
                    </AdvancedMarker>
                  );
                })}

                {/* Info Window */}
                {activeInfoWindowBus && (
                  <InfoWindow
                    position={{
                      lat: activeInfoWindowBus.currentLat,
                      lng: activeInfoWindowBus.currentLng
                    }}
                    onCloseClick={() => setActiveInfoWindowBus(null)}
                  >
                    <div className="p-1 min-w-[210px] text-slate-900 font-['Hind_Siliguri',sans-serif]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-base">🚌</span>
                        <strong className="text-sm font-bold text-slate-900">
                          {activeInfoWindowBus.companyNameBn}
                        </strong>
                      </div>
                      <p className="text-xs font-mono font-bold text-slate-600 mb-1.5">
                        বাস: {activeInfoWindowBus.busNumber}
                      </p>

                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs space-y-1 mb-2">
                        <p className="flex items-center gap-1 font-semibold text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            {activeInfoWindowBus.currentLocationNameBn || activeInfoWindowBus.currentLocationName}
                          </span>
                        </p>
                        <p className="flex items-center gap-1 text-slate-600">
                          <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>গতি: {toBanglaNumber(activeInfoWindowBus.speed)} কিমি/ঘণ্টা</span>
                        </p>
                        <p className="flex items-center gap-1 text-emerald-700 font-medium">
                          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>🟢 Live • {formatBanglaTimeAgo(activeInfoWindowBus.lastUpdated)}</span>
                        </p>
                      </div>

                      {activeInfoWindowBus.destinationEta && (
                        <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                          ⏱️ {activeInfoWindowBus.destinationEta.nameBn}: ~{toBanglaNumber(activeInfoWindowBus.destinationEta.etaMinutesMin)}–{toBanglaNumber(activeInfoWindowBus.destinationEta.etaMinutesMax)} মিনিট
                        </div>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          ) : (
            /* Interactive Live Radar & Vector Highway Map Fallback */
            <div className="relative w-full h-full flex flex-col bg-slate-900 text-white p-4 sm:p-6 overflow-hidden">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

              {/* Highway Radar View Header */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-xl">
                    🛰️
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      হাইওয়ে লাইভ ট্র্যাকিং রাডার
                    </h4>
                    <p className="text-xs text-slate-400">
                      রুট: {selectedBus.originBn} ➔ {selectedBus.destinationBn} ({selectedBus.companyNameBn})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>রিয়েল-টাইম জিপিএস সক্রিয়</span>
                  </span>
                </div>
              </div>

              {/* Highway Linear Map Visualization */}
              <div className="relative z-10 flex-1 my-4 flex flex-col justify-center max-w-4xl mx-auto w-full">
                <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-6">
                  {/* Route Progress Tracker */}
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span>যাত্রা: {selectedBus.originBn}</span>
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {selectedBus.currentLocationNameBn}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span>গন্তব্য: {selectedBus.destinationBn}</span>
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    </span>
                  </div>

                  {/* Highway Line with Checkpoints */}
                  <div className="relative py-6">
                    <div className="h-3 bg-slate-700 rounded-full w-full relative overflow-hidden border border-slate-600">
                      <div
                        className="absolute inset-0 opacity-85"
                        style={{
                          background: `linear-gradient(to right, ${routeColor}, #10B981)`
                        }}
                      />
                    </div>

                    {/* Checkpoint Dots */}
                    <div className="relative flex justify-between -mt-3">
                      {calculatedDirection.checkpoints.map((cp) => (
                        <div key={cp.id} className="flex flex-col items-center group">
                          <div className="w-3 h-3 rounded-full bg-white border-2 border-slate-800 shadow-sm" />
                          <span className="text-[10px] text-slate-400 mt-2 font-medium hidden sm:block">
                            {cp.nameBn}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Active Bus Radar Icon */}
                    <div className="mt-4 flex items-center justify-center">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-400 animate-bounce">
                        <span className="text-2xl">🚌</span>
                        <div className="text-left">
                          <div className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                            চলন্ত অবস্থান
                          </div>
                          <div className="text-sm font-extrabold">{selectedBus.busNumber}</div>
                          <div className="text-xs text-emerald-100">
                            📍 {selectedBus.currentLocationNameBn} • 🚀 {toBanglaNumber(selectedBus.speed)} কিমি/ঘণ্টা
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Box */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                      <div className="text-xs text-slate-400">অক্ষাংশ (Lat)</div>
                      <div className="text-sm font-mono font-bold text-white mt-0.5">
                        {selectedBus.currentLat.toFixed(5)}
                      </div>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                      <div className="text-xs text-slate-400">দ্রাঘিমাংশ (Lng)</div>
                      <div className="text-sm font-mono font-bold text-white mt-0.5">
                        {selectedBus.currentLng.toFixed(5)}
                      </div>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                      <div className="text-xs text-slate-400">সর্বশেষ সিগন্যাল</div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">
                        {formatBanglaTimeAgo(selectedBus.lastUpdated)}
                      </div>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                      <div className="text-xs text-slate-400">পৌঁছানোর সময়</div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">
                        ~{toBanglaNumber(selectedBus.destinationEta?.etaMinutesMin || 35)}–{toBanglaNumber(selectedBus.destinationEta?.etaMinutesMax || 45)} মিনিট
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Floating Traffic and Bus Details HUD at bottom of Map */}
          <div className="absolute bottom-4 left-4 right-4 z-20 max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📍</span>
                <div>
                  <div className="text-xs text-slate-500 font-medium">বর্তমান অবস্থান:</div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {selectedBus.currentLocationNameBn || selectedBus.currentLocationName}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">গতিবেগ:</div>
                <div className="text-sm font-extrabold text-slate-900">
                  {selectedBus.speed > 0 ? `${toBanglaNumber(selectedBus.speed)} কিমি/ঘণ্টা` : 'থেমে আছে'}
                </div>
              </div>
            </div>

            {/* Traffic status legend */}
            {showTraffic && (
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-bold flex items-center gap-1 text-slate-800">
                  <span>🚦 লাইভ ট্রাফিক ইনডিকেটর:</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    স্বাভাবিক গতি
                  </span>
                  <span className="flex items-center gap-1 text-amber-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    ধীরগতি
                  </span>
                  <span className="flex items-center gap-1 text-red-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    যানজট (Jam)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
