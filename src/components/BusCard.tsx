import React from 'react';
import { LiveBusSession } from '../types';
import { formatBanglaTimeAgo, toBanglaNumber } from '../data/bangladeshRoutes';
import { MapPin, Navigation, Gauge, Clock, Radio, ChevronRight } from 'lucide-react';

interface BusCardProps {
  bus: LiveBusSession;
  onOpenMap: (bus: LiveBusSession) => void;
  isMyBroadcast?: boolean;
}

export const BusCard: React.FC<BusCardProps> = ({ bus, onOpenMap, isMyBroadcast }) => {
  // Status Badge Logic
  const renderStatusBadge = () => {
    if (bus.status === 'live') {
      return (
        <div className="flex flex-col items-end">
          <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase tracking-wider mb-1 flex items-center gap-1 border border-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping inline-block"></span>
            ● Live
          </span>
          <span className="text-[10px] text-slate-400">
            {formatBanglaTimeAgo(bus.lastUpdated)}
          </span>
        </div>
      );
    } else if (bus.status === 'idle') {
      return (
        <div className="flex flex-col items-end">
          <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider mb-1 border border-amber-100">
            ● 2m ago
          </span>
          <span className="text-[10px] text-slate-400">
            {formatBanglaTimeAgo(bus.lastUpdated)}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-end">
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider mb-1">
            ● Offline
          </span>
          <span className="text-[10px] text-slate-400">অনুসন্ধান বন্ধ</span>
        </div>
      );
    }
  };

  return (
    <div
      className={`relative bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        isMyBroadcast
          ? 'border-emerald-400 ring-2 ring-emerald-500/20'
          : 'border-slate-200'
      }`}
      id={`bus-card-${bus.id}`}
    >
      {/* Passenger Broadcast Tag */}
      {bus.isPassengerBroadcast && (
        <div className="absolute -top-2.5 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>{isMyBroadcast ? 'আপনার ডিভাইস লাইভ' : 'যাত্রীর ফোন থেকে লাইভ'}</span>
        </div>
      )}

      <div>
        {/* Header: Company Name & Status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-lg font-bold text-slate-800 leading-tight">
              🚌 {bus.companyNameBn}
            </h4>
            <p className="text-sm text-slate-500 font-mono font-medium mt-0.5">
              {bus.busNumber}
            </p>
          </div>
          <div>{renderStatusBadge()}</div>
        </div>

        {/* Key-Value Details */}
        <div className="space-y-2.5 mb-5 text-sm">
          <div className="flex items-center">
            <span className="w-20 text-slate-400 text-xs sm:text-sm font-medium">রুট:</span>
            <span className="font-semibold text-slate-800 text-xs sm:text-sm">
              {bus.routeNameBn}
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-20 text-slate-400 text-xs sm:text-sm font-medium">বর্তমানে:</span>
            <span className="text-emerald-600 font-bold text-xs sm:text-sm flex items-center gap-1">
              <span>📍 {bus.currentLocationNameBn || bus.currentLocationName}</span>
            </span>
          </div>

          <div className="flex items-center">
            <span className="w-20 text-slate-400 text-xs sm:text-sm font-medium">গতি:</span>
            <span className="font-mono text-slate-700 text-xs sm:text-sm font-medium">
              {bus.speed > 0 ? `${toBanglaNumber(bus.speed)} কিমি/ঘণ্টা` : 'থেমে আছে'}
            </span>
          </div>

          {bus.destinationEta && (
            <div className="flex items-center">
              <span className="w-20 text-slate-400 text-xs sm:text-sm font-medium">গন্তব্য ETA:</span>
              <span className="text-emerald-800 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                ⏱️ ~{toBanglaNumber(bus.destinationEta.etaMinutesMin)}–{toBanglaNumber(bus.destinationEta.etaMinutesMax)} মিনিট
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button: View on Map */}
      <button
        onClick={() => onOpenMap(bus)}
        className="w-full bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        id={`btn-view-map-${bus.id}`}
      >
        <span>🗺️ লোকেশন দেখুন</span>
      </button>
    </div>
  );
};
