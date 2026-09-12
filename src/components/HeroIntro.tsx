import React from 'react';
import { Radio, MapPin } from 'lucide-react';

interface HeroIntroProps {
  onStartLive: () => void;
}

export const HeroIntro: React.FC<HeroIntroProps> = ({ onStartLive }) => {
  return (
    <div className="bg-emerald-50/80 border-b border-emerald-100 px-4 sm:px-8 py-5 sm:py-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
            <span>স্মার্টফোন জিপিএস ভিত্তিক লাইভ ট্র্যাকিং</span>
          </div>
          <p className="text-sm sm:text-base text-emerald-950 font-medium leading-relaxed">
            বাংলাদেশের বিভিন্ন রুটে চলাচলকারী বাসের লাইভ অবস্থান দেখুন। বাসে থাকা যেকোনো ব্যক্তি তার স্মার্টফোনের GPS Location ব্যবহার করে বাসের অবস্থান লাইভ করতে পারবেন। কোনো অ্যাপ ইনস্টল করার প্রয়োজন নেই।
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={onStartLive}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-emerald-600/20 transition-all cursor-pointer active:scale-98"
            id="hero-btn-start-live"
          >
            <MapPin className="w-4 h-4" />
            <span>বাসের অবস্থান লাইভ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
