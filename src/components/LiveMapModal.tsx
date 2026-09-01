import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { LiveBusSession } from '../types';
import {
  formatBanglaTimeAgo,
  toBanglaNumber,
  buildRouteDirection
} from '../data/bangladeshRoutes';
import {
  X,
  Navigation,
  Gauge,
  Clock,
  MapPin,
  Locate,
  Layers,
  ArrowRight,
  Maximize2,
  Radio,
  ShieldCheck,
  Compass,
  Share2
} from 'lucide-react';
import { ShareModal } from './ShareModal';

interface LiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBus: LiveBusSession | null;
  allBuses: LiveBusSession[];
  onSelectBus: (bus: LiveBusSession) => void;
}

type TileLayerType = 'osm' | 'dark' | 'satellite';

const TILE_LAYERS = {
  osm: {
    name: 'OpenStreetMap',
    nameBn: 'ওপেন-স্ট্রিট ম্যাপ',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors • Nazmul IT',
    maxZoom: 19
  },
  dark: {
    name: 'CartoDB Dark',
    nameBn: 'কার্টো ডার্ক মোড',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/" target="_blank">CARTO</a> • Nazmul IT',
    maxZoom: 19
  },
  satellite: {
    name: 'Esri Satellite',
    nameBn: 'স্যাটেলাইট ভিউ',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP • Nazmul IT',
    maxZoom: 18
  }
};

export const LiveMapModal: React.FC<LiveMapModalProps> = ({
  isOpen,
  onClose,
  selectedBus,
  allBuses,
  onSelectBus
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);

  const [activeLayer, setActiveLayer] = useState<TileLayerType>('osm');
  const [autoCenter, setAutoCenter] = useState<boolean>(true);
  const [showCheckpoints, setShowCheckpoints] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Initialize or Destroy Leaflet Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || !selectedBus) return;

    // Fix default marker icon issues in Leaflet if any default icons used
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedBus.currentLat, selectedBus.currentLng],
        zoom: 12,
        zoomControl: false,
        attributionControl: true
      });

      // Add Zoom control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add Scale control to bottom-left
      L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

      // Create base tile layer
      const cfg = TILE_LAYERS[activeLayer];
      const baseTileLayer = L.tileLayer(cfg.url, {
        attribution: cfg.attribution,
        maxZoom: cfg.maxZoom
      }).addTo(map);

      tileLayerRef.current = baseTileLayer;

      // Layer group for all markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = markersLayer;

      mapInstanceRef.current = map;

      // Invalidate size once modal animation completes
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
        markersLayerGroupRef.current = null;
        accuracyCircleRef.current = null;
      }
    };
  }, [isOpen]);

  // Handle Base Tile Layer Switch (OSM / CartoDB Dark / Esri Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const cfg = TILE_LAYERS[activeLayer];
    const newTileLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [activeLayer]);

  // Update Markers & Overlays when Bus data, selectedBus, or options change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current || !selectedBus) return;

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerGroupRef.current;
    markersLayer.clearLayers();

    const calculatedDirection = buildRouteDirection(
      selectedBus.originBn || 'ঢাকা (গাবতলী)',
      selectedBus.destinationBn || 'সিরাজগঞ্জ'
    );

    // 1. Origin Stop Marker (🟢 শুরু গন্তব্য)
    if (calculatedDirection.originGeo) {
      const originIcon = L.divIcon({
        className: 'custom-origin-marker',
        html: `
          <div class="relative flex flex-col items-center group -translate-x-1/2 -translate-y-1/2">
            <div class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-xs text-white">
              🟢
            </div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const originMarker = L.marker(
        [calculatedDirection.originGeo.lat, calculatedDirection.originGeo.lng],
        { icon: originIcon, title: `শুরু: ${calculatedDirection.originGeo.nameBn}` }
      );

      originMarker.bindPopup(`
        <div class="p-2.5 text-slate-900 font-['Hind_Siliguri',sans-serif] min-w-[160px]">
          <strong class="text-xs font-bold text-emerald-800">🟢 শুরু কাউন্টার</strong>
          <div class="text-xs text-slate-800 font-semibold mt-0.5">${calculatedDirection.originGeo.nameBn}</div>
        </div>
      `);

      markersLayer.addLayer(originMarker);
    }

    // 2. Destination Stop Marker (🔴 শেষ গন্তব্য)
    if (calculatedDirection.destinationGeo) {
      const destIcon = L.divIcon({
        className: 'custom-destination-marker',
        html: `
          <div class="relative flex flex-col items-center group -translate-x-1/2 -translate-y-1/2">
            <div class="w-6 h-6 rounded-full bg-rose-600 border-2 border-white shadow-md flex items-center justify-center text-xs text-white">
              🔴
            </div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const destMarker = L.marker(
        [calculatedDirection.destinationGeo.lat, calculatedDirection.destinationGeo.lng],
        { icon: destIcon, title: `শেষ: ${calculatedDirection.destinationGeo.nameBn}` }
      );

      destMarker.bindPopup(`
        <div class="p-2.5 text-slate-900 font-['Hind_Siliguri',sans-serif] min-w-[160px]">
          <strong class="text-xs font-bold text-rose-800">🔴 শেষ গন্তব্য</strong>
          <div class="text-xs text-slate-800 font-semibold mt-0.5">${calculatedDirection.destinationGeo.nameBn}</div>
        </div>
      `);

      markersLayer.addLayer(destMarker);
    }

    // Optional: Intermediate Checkpoints
    if (showCheckpoints && calculatedDirection.checkpoints.length > 0) {
      calculatedDirection.checkpoints.forEach((cp) => {
        const cpIcon = L.divIcon({
          className: 'custom-cp-marker',
          html: `
            <div class="bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-300 shadow-md flex items-center gap-1 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              <span>${cp.nameBn}</span>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        const cpMarker = L.marker([cp.lat, cp.lng], { icon: cpIcon });
        markersLayer.addLayer(cpMarker);
      });
    }

    // 3. GPS Accuracy Range Ring (±মিটার) for Selected Bus
    const accuracy = selectedBus.accuracy || 15;
    const accuracyCircle = L.circle([selectedBus.currentLat, selectedBus.currentLng], {
      radius: Math.max(accuracy, 20),
      color: '#10B981',
      fillColor: '#10B981',
      fillOpacity: 0.15,
      weight: 1.5,
      dashArray: '4, 4'
    });
    markersLayer.addLayer(accuracyCircle);
    accuracyCircleRef.current = accuracyCircle;

    // 4. Render All Active Buses (Small Clean Bus Icon Marker)
    allBuses.forEach((bus) => {
      const isSelected = bus.id === selectedBus.id;
      const speedBn = toBanglaNumber(bus.speed || 0);

      const busIcon = L.divIcon({
        className: 'custom-bus-marker',
        html: `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
            <!-- Pulsing radar glow for selected bus -->
            ${
              isSelected
                ? '<div class="absolute w-12 h-12 bg-emerald-500/30 rounded-full animate-ping pointer-events-none"></div>'
                : ''
            }

            <!-- Compact Bus Icon Circle -->
            <div class="relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform border-2 ${
              isSelected
                ? 'bg-slate-950 border-emerald-400 ring-4 ring-emerald-500/30 scale-110 z-30 text-white'
                : 'bg-white border-slate-300 hover:scale-110 z-10 text-slate-800'
            }">
              <span class="text-sm">🚌</span>

              <!-- Direction Indicator Arrow -->
              ${
                bus.speed > 0
                  ? `<div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center border border-white" style="transform: rotate(${bus.heading || 0}deg)">
                      <span class="text-[7px] font-black text-white leading-none">▲</span>
                     </div>`
                  : ''
              }
            </div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const busMarker = L.marker([bus.currentLat, bus.currentLng], {
        icon: busIcon,
        zIndexOffset: isSelected ? 1000 : 100
      });

      // Rich Telemetry Popup
      const popupHtml = `
        <div class="p-3 text-slate-900 font-['Hind_Siliguri',sans-serif] min-w-[230px]">
          <div class="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100">
            <div class="flex items-center gap-1.5">
              <span class="text-base">🚌</span>
              <strong class="text-sm font-extrabold text-slate-900">${bus.companyNameBn}</strong>
            </div>
            <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
              ● Live
            </span>
          </div>

          <div class="text-xs font-mono font-bold text-slate-700 mb-2">
            নম্বর: ${bus.busNumber}
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 mb-2.5">
            <p class="font-bold text-emerald-800 flex items-center gap-1">
              <span>📍 বর্তমান স্থান:</span>
              <span class="text-slate-900">${bus.currentLocationNameBn || bus.currentLocationName}</span>
            </p>
            <p class="text-slate-700 flex items-center gap-1">
              <span>⚡ গতিবেগ:</span>
              <span class="font-mono font-bold text-slate-900">${speedBn} কিমি/ঘণ্টা</span>
            </p>
            <p class="text-slate-500 text-[11px] flex items-center gap-1">
              <span>🎯 জিপিএস একুরেসি:</span>
              <span>±${toBanglaNumber(bus.accuracy || 12)} মিটার</span>
            </p>
            <p class="text-emerald-700 text-[11px] font-medium">
              <span>🟢 আপডেট: ${formatBanglaTimeAgo(bus.lastUpdated)}</span>
            </p>
          </div>

          <div class="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            ওপেন-সোর্স OpenStreetMap • Developed by <strong class="text-emerald-700">Nazmul IT</strong>
          </div>
        </div>
      `;

      busMarker.bindPopup(popupHtml);

      busMarker.on('click', () => {
        onSelectBus(bus);
      });

      markersLayer.addLayer(busMarker);

      if (isSelected) {
        // Auto open popup for selected bus if not autoCenter-dragged
        setTimeout(() => {
          busMarker.openPopup();
        }, 100);
      }
    });

    // Handle Auto-Center smoothly
    if (autoCenter) {
      map.panTo([selectedBus.currentLat, selectedBus.currentLng], { animate: true, duration: 0.8 });
    }
  }, [selectedBus, allBuses, autoCenter, showCheckpoints]);

  // Fit all 3 Points (Origin, Bus, Destination) in View
  const handleFitBounds = () => {
    if (!mapInstanceRef.current || !selectedBus) return;
    const map = mapInstanceRef.current;

    const calculatedDirection = buildRouteDirection(
      selectedBus.originBn || 'ঢাকা (গাবতলী)',
      selectedBus.destinationBn || 'সিরাজগঞ্জ'
    );

    const points: [number, number][] = [[selectedBus.currentLat, selectedBus.currentLng]];

    if (calculatedDirection.originGeo) {
      points.push([calculatedDirection.originGeo.lat, calculatedDirection.originGeo.lng]);
    }
    if (calculatedDirection.destinationGeo) {
      points.push([calculatedDirection.destinationGeo.lat, calculatedDirection.destinationGeo.lng]);
    }

    if (points.length > 1) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    } else {
      map.setView([selectedBus.currentLat, selectedBus.currentLng], 13);
    }
  };

  if (!isOpen || !selectedBus) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      style={{ touchAction: 'manipulation' }}
    >
      <div className="relative w-full max-w-6xl h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top Header Bar (Clean & Compact) */}
        <div className="px-3 sm:px-4 py-2.5 border-b border-slate-200 bg-white flex items-center justify-between gap-2 shrink-0">
          {/* Action & Layer Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Tile Layer Selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveLayer('osm')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  activeLayer === 'osm'
                    ? 'bg-white text-emerald-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="ওপেন-স্ট্রিট ম্যাপ ভিউ"
                id="btn-layer-osm"
              >
                🗺️ সাধারণ
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer('dark')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  activeLayer === 'dark'
                    ? 'bg-slate-900 text-emerald-300 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="কার্টো ডার্ক মোড"
                id="btn-layer-dark"
              >
                🌙 ডার্ক
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer('satellite')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  activeLayer === 'satellite'
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="স্যাটেলাইট ইমেজারি"
                id="btn-layer-satellite"
              >
                🛰️ স্যাটেলাইট
              </button>
            </div>

            {/* Fit View (All 3 Points) */}
            <button
              type="button"
              onClick={handleFitBounds}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 flex items-center gap-1 transition-all cursor-pointer"
              title="শুরু, বাস এবং গন্তব্য একসাথে দেখুন"
              id="btn-fit-bounds"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">সম্পূর্ণ ভিউ</span>
            </button>

            {/* Auto Focus Toggle */}
            <button
              type="button"
              onClick={() => setAutoCenter(!autoCenter)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                autoCenter
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
              title="বাসের সাথে অটো ফোকাস"
              id="btn-toggle-autocenter"
            >
              <Locate className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">অটো ফোকাস: {autoCenter ? 'অন' : 'অফ'}</span>
            </button>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            id="btn-close-map-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map Container Area */}
        <div className="relative flex-1 w-full h-full bg-slate-100 overflow-hidden">
          {/* Left Speed HUD (বামে ছোট করে শুধু স্পিড দেখাবে) */}
          <div className="absolute top-3.5 left-3.5 z-400 pointer-events-auto">
            <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-xl border border-slate-700/80 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-mono font-extrabold text-emerald-400">
                {selectedBus.speed > 0 ? `${toBanglaNumber(selectedBus.speed)} কিমি/ঘ` : '০ কিমি/ঘ'}
              </span>
            </div>
          </div>

          {/* Leaflet DOM Container */}
          <div
            ref={mapContainerRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%', zIndex: 1 }}
          />

          {/* Bottom Floating Info Pill (নিচে বাসের নাম ও শুরু ও শেষ গন্তব্য ছোট করে লেখা) */}
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:max-w-md z-400 pointer-events-auto">
            <div className="bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3">
              <div className="min-w-0 flex items-center gap-2">
                <span className="text-base shrink-0">🚌</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {selectedBus.companyNameBn} {selectedBus.busNumber ? `(${selectedBus.busNumber})` : ''}
                  </div>
                  <div className="text-[11px] text-emerald-300 font-medium truncate flex items-center gap-1">
                    <span>{selectedBus.originBn}</span>
                    <span className="text-slate-400">➔</span>
                    <span className="text-rose-300">{selectedBus.destinationBn}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-xs"
                title="লাইভ ট্র্যাকিং শেয়ার করুন"
                id="btn-share-live-map"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>শেয়ার</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        bus={selectedBus}
      />
    </div>
  );
};
