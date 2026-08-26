import React from 'react';
import { Smartphone, Radio, Users, CheckCircle2, Shield, MapPin } from 'lucide-react';

interface HeroIntroProps {
  onStartLive: () => void;
}

export const HeroIntro: React.FC<HeroIntroProps> = ({ onStartLive }) => {
  return (
    <div className="bg-emerald-50/80 border-b border-emerald-100 px-4 sm:px-8 py-6 sm:py-7">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2.5">
            <Radio className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
            <span>স্মার্টফোন জিপিএস ভিত্তিক লাইভ ট্র্যাকিং</span>
          </div>
          <p className="text-base sm:text-lg text-emerald-950 font-medium leading-relaxed">
            বাংলাদেশের বিভিন্ন রুটে চলাচলকারী বাসের লাইভ অবস্থান দেখুন। বাসে থাকা যেকোনো ব্যক্তি তার স্মার্টফোনের GPS Location ব্যবহার করে বাসের অবস্থান লাইভ করতে পারবেন। কোনো অ্যাপ ইনস্টল করার প্রয়োজন নেই।
          </p>
        </div>

        {/* Quick feature callout / steps */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs font-semibold text-emerald-900">
            <div className="bg-white/90 border border-emerald-200/80 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span>বাসে বসুন</span>
            </div>
            <div className="bg-white/90 border border-emerald-200/80 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span>GPS অন করুন</span>
            </div>
            <div className="bg-white/90 border border-emerald-200/80 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span>লাইভ শেয়ার</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
