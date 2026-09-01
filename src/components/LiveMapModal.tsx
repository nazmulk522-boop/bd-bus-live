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
          <div class="relative flex flex-col items-center group -translate-x-1/2 -translate-y-full">
            <div class="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border-2 border-white shadow-xl flex items-center gap-1.5 whitespace-nowrap transition-transform">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>🟢 শুরু: ${calculatedDirection.originGeo.nameBn}</span>
            </div>
            <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-emerald-600"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const originMarker = L.marker(
        [calculatedDirection.originGeo.lat, calculatedDirection.originGeo.lng],
        { icon: originIcon, title: `শুরু গন্তব্য: ${calculatedDirection.originGeo.nameBn}` }
      );

      originMarker.bindPopup(`
        <div class="p-3 text-slate-900 font-['Hind_Siliguri',sans-serif] min-w-[190px]">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            <strong class="text-sm font-bold text-emerald-800">যাত্রার শুরু কাউন্টার</strong>
          </div>
          <div class="text-xs text-slate-700 font-semibold">${calculatedDirection.originGeo.nameBn}</div>
          <div class="text-[11px] text-slate-500 mt-1">রুট: ${selectedBus.originBn} ➔ ${selectedBus.destinationBn}</div>
        </div>
      `);

      markersLayer.addLayer(originMarker);
    }

    // 2. Destination Stop Marker (🔴 শেষ গন্তব্য)
    if (calculatedDirection.destinationGeo) {
      const destIcon = L.divIcon({
        className: 'custom-destination-marker',
        html: `
          <div class="relative flex flex-col items-center group -translate-x-1/2 -translate-y-full">
            <div class="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border-2 border-white shadow-xl flex items-center gap-1.5 whitespace-nowrap transition-transform">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>🔴 শেষ: ${calculatedDirection.destinationGeo.nameBn}</span>
            </div>
            <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-red-600"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const destMarker = L.marker(
        [calculatedDirection.destinationGeo.lat, calculatedDirection.destinationGeo.lng],
        { icon: destIcon, title: `শেষ গন্তব্য: ${calculatedDirection.destinationGeo.nameBn}` }
      );

      destMarker.bindPopup(`
        <div class="p-3 text-slate-900 font-['Hind_Siliguri',sans-serif] min-w-[190px]">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-3 h-3 rounded-full bg-red-500"></span>
            <strong class="text-sm font-bold text-red-800">যাত্রার শেষ গন্তব্য</strong>
          </div>
          <div class="text-xs text-slate-700 font-semibold">${calculatedDirection.destinationGeo.nameBn}</div>
          <div class="text-[11px] text-slate-500 mt-1">পৌঁছানোর স্থান</div>
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

    // 4. Render All Active Buses (Highlighting Selected Bus)
    allBuses.forEach((bus) => {
      const isSelected = bus.id === selectedBus.id;
      const speedBn = toBanglaNumber(bus.speed || 0);

      const busIcon = L.divIcon({
        className: 'custom-bus-marker',
        html: `
          <div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
            <!-- Pulsing radar glow for selected bus -->
            ${
              isSelected
                ? '<div class="absolute inset-0 w-12 h-12 -left-1.5 -top-1.5 bg-emerald-500/30 rounded-2xl bus-pulse-animation pointer-events-none"></div>'
                : ''
            }

            <!-- Main Bus Pill -->
            <div class="relative flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl shadow-2xl transition-all border-2 ${
              isSelected
                ? 'bg-slate-900 text-white border-emerald-400 scale-110 ring-4 ring-emerald-500/30 z-30'
                : 'bg-white text-slate-800 border-slate-300 hover:scale-105 z-10'
            }">
              <span class="text-lg">🚌</span>
              <div class="text-left">
                <div class="text-[10px] font-bold ${isSelected ? 'text-emerald-300' : 'text-slate-600'} leading-none">
                  ${bus.companyNameBn}
                </div>
                <div class="text-[11px] font-mono font-extrabold ${isSelected ? 'text-white' : 'text-slate-900'} leading-tight">
                  ${speedBn} কিমি/ঘ
                </div>
              </div>

              <!-- Direction Indicator Arrow -->
              ${
                bus.speed > 0
                  ? `<div class="w-3 h-3 bg-emerald-400 rounded-full flex items-center justify-center border border-white" style="transform: rotate(${bus.heading || 0}deg)">
                      <span class="text-[8px] font-black text-slate-950">▲</span>
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
        {/* Top Header Bar */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Bus Info & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
              🚌
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {selectedBus.companyNameBn}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>OpenStreetMap Live</span>
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
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

          {/* Action & Layer Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Tile Layer Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveLayer('osm')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
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

            {/* Share Live Location Button */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="লাইভ ট্র্যাকিং লিংক শেয়ার করুন (WhatsApp, Messenger, Copy Link)"
              id="btn-share-live-map"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>লাইভ শেয়ার</span>
            </button>

            {/* Fit View (All 3 Points) */}
            <button
              type="button"
              onClick={handleFitBounds}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
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

            {/* Close Button */}
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
          {/* Top Floating Status Badge */}
          <div className="absolute top-3.5 left-3.5 z-400 pointer-events-none flex flex-col gap-2">
            <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-3 max-w-md pointer-events-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <div className="space-y-0.5 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-emerald-300 font-bold">🟢 শুরু: {selectedBus.originBn}</span>
                  <span className="text-slate-400">➔</span>
                  <span className="text-red-300 font-bold">🔴 গন্তব্য: {selectedBus.destinationBn}</span>
                </div>
                <div className="text-slate-200 font-medium flex items-center gap-1">
                  <span>🚌 বাসের বর্তমান অবস্থান:</span>
                  <span className="font-bold text-amber-300">
                    {selectedBus.currentLocationNameBn || selectedBus.currentLocationName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Leaflet DOM Container */}
          <div
            ref={mapContainerRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%', zIndex: 1 }}
          />

          {/* Bottom Floating Telemetry & Nazmul IT Branding HUD */}
          <div className="absolute bottom-4 left-4 right-4 z-400 max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200 pointer-events-auto">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
                  📍
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">বাসের বর্তমান অবস্থান:</div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {selectedBus.currentLocationNameBn || selectedBus.currentLocationName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">চলমান গতি:</div>
                  <div className="text-sm font-mono font-extrabold text-emerald-700">
                    {selectedBus.speed > 0 ? `${toBanglaNumber(selectedBus.speed)} কিমি/ঘণ্টা` : 'থেমে আছে'}
                  </div>
                </div>

                <div className="border-l border-slate-200 pl-4">
                  <div className="text-[11px] text-slate-500 font-medium">জিপিএস একুরেসি:</div>
                  <div className="text-sm font-mono font-bold text-slate-800">
                    ±{toBanglaNumber(selectedBus.accuracy || 12)} মিটার
                  </div>
                </div>

                <div className="border-l border-slate-200 pl-4">
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>শেয়ার</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Credits & Open-Source Attribution */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ওপেন-সোর্স OpenStreetMap ও Leaflet দ্বারা চালিত (আনলিমিটেড ও ফ্রি)</span>
              </div>
              <div className="font-medium text-slate-600">
                Developed by <strong className="text-emerald-700 font-bold uppercase">Nazmul IT</strong>
              </div>
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
