import React, { useState } from 'react';
import { LiveBusSession } from '../types';
import { formatBanglaTimeAgo, toBanglaNumber } from '../data/bangladeshRoutes';
import { MapPin, Navigation, Gauge, Clock, Radio, ChevronRight, Share2, Check, Copy } from 'lucide-react';

interface BusCardProps {
  bus: LiveBusSession;
  onOpenMap: (bus: LiveBusSession) => void;
  onShare?: (bus: LiveBusSession) => void;
  isMyBroadcast?: boolean;
  onOpenBroadcaster?: () => void;
}

export const BusCard: React.FC<BusCardProps> = ({
  bus,
  onOpenMap,
  onShare,
  isMyBroadcast,
  onOpenBroadcaster
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const isStale = bus.status === 'live' && (Date.now() - bus.lastUpdated > 2.5 * 60 * 1000); // Signal hasn't updated for > 2.5 mins

  const handleQuickCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(bus);
      return;
    }

    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const shareUrl = `${currentOrigin}${currentPath}?bus=${encodeURIComponent(bus.id)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${bus.companyNameBn} - লাইভ বাস ট্র্যাকিং`,
          text: `🚌 ${bus.companyNameBn} (${bus.busNumber}) বাসের লাইভ লোকেশন দেখুন:\n📍 রুট: ${bus.originBn} ➔ ${bus.destinationBn}\n📍 বর্তমান অবস্থান: ${bus.currentLocationNameBn || bus.currentLocationName}`,
          url: shareUrl
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Status Badge Logic
  const renderStatusBadge = () => {
    if (bus.status === 'live') {
      if (isStale) {
        return (
          <div className="flex flex-col items-end">
            <span
              className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider mb-1 flex items-center gap-1 border border-amber-200"
              title="মোবাইল ফোনের স্ক্রিন লক থাকায় বা ব্যাকগ্রাউন্ডে চলায় জিপিএস সিগন্যাল সাময়িক থেমে আছে"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
              ● সিগন্যাল বিরতি
            </span>
            <span className="text-[10px] text-amber-700 font-medium">
              {formatBanglaTimeAgo(bus.lastUpdated)}
            </span>
          </div>
        );
      }

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
              {bus.speed > 0
                ? `${toBanglaNumber(bus.speed)} কিমি/ঘণ্টা`
                : isStale
                ? 'থেমে আছে (সিগন্যাল সাময়িক বন্ধ)'
                : 'থেমে আছে'}
            </span>
          </div>

          {bus.destinationEta && typeof bus.destinationEta === 'object' && bus.destinationEta.etaMinutesMin !== undefined && (
            <div className="flex items-center">
              <span className="w-20 text-slate-400 text-xs sm:text-sm font-medium">গন্তব্য ETA:</span>
              <span className="text-emerald-800 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                ⏱️ ~{toBanglaNumber(bus.destinationEta.etaMinutesMin)}–{toBanglaNumber(bus.destinationEta.etaMinutesMax)} মিনিট
              </span>
            </div>
          )}
        </div>

        {/* My broadcast stale warning banner */}
        {isMyBroadcast && isStale && (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="text-base">⚠️</span>
              <span>আপনার ফোনের জিপিএস ডাটা পাঠানো বন্ধ রয়েছে (স্ক্রিন অন রাখুন)</span>
            </div>
            {onOpenBroadcaster && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenBroadcaster();
                }}
                className="shrink-0 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold rounded-lg text-[11px] cursor-pointer shadow-xs"
              >
                জিপিএস চালু
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons: View on Map & Share Live Location */}
      <div className="grid grid-cols-5 gap-2">
        <button
          onClick={() => onOpenMap(bus)}
          className="col-span-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          id={`btn-view-map-${bus.id}`}
        >
          <span>🗺️ লোকেশন দেখুন</span>
        </button>

        <button
          onClick={handleQuickCopy}
          className="col-span-2 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-bold py-2.5 px-2 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
          id={`btn-share-live-${bus.id}`}
          title="লাইভ লোকেশন শেয়ার করুন (WhatsApp, Messenger, কপি লিংক)"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 text-xs">কপি হয়েছে!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-xs">শেয়ার করুন</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
