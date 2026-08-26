import React from 'react';
import { Radio, MapPin, Bus } from 'lucide-react';

interface HeaderProps {
  onOpenBroadcastModal: () => void;
  activeCount: number;
  isBroadcasting: boolean;
  onOpenBroadcasterHUD: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBroadcastModal,
  activeCount,
  isBroadcasting,
  onOpenBroadcasterHUD
}) => {
  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 sm:py-4 flex justify-between items-center shadow-xs">
      {/* Brand Logo & Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-sm flex items-center justify-center">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span>🚌 বাংলাদেশ বাস লাইভ</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
            রিয়েল-টাইম জিপিএস ট্র্যাকিং নেটওয়ার্ক
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center gap-3">
        {isBroadcasting ? (
          <button
            onClick={onOpenBroadcasterHUD}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 sm:py-2.5 px-4 sm:px-6 rounded-full flex items-center text-xs sm:text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer"
            id="active-broadcast-status-btn"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>লাইভ সচল আছে</span>
          </button>
        ) : (
          <button
            onClick={onOpenBroadcastModal}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-2 sm:py-2.5 px-4 sm:px-6 rounded-full flex items-center text-xs sm:text-sm shadow-lg shadow-emerald-200/80 transition-all cursor-pointer"
            id="btn-header-start-live"
          >
            <span className="mr-1.5 sm:mr-2">📍</span>
            <span>লোকেশন লাইভ করুন</span>
          </button>
        )}
      </div>
    </nav>
  );
};
