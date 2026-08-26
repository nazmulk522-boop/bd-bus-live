import React from 'react';
import { ShieldCheck, Heart, Radio, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          {/* Brand & Mission */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2 rounded-xl text-lg font-bold shadow-xs">
              🚌
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">
                Bangladesh Bus Live
              </div>
              <div className="text-xs text-slate-400">
                স্মার্টফোন জিপিএস ভিত্তিক লাইভ ট্র্যাকিং প্ল্যাটফর্ম
              </div>
            </div>
          </div>

          {/* Operational Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>২৪/৭ লাইভ জিপিএস সিস্টেম সচল</span>
          </div>
        </div>

        {/* Developer Attribution & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-slate-600 font-medium">
            © ২০২৬ বাংলাদেশ বাস লাইভ — Developed by{' '}
            <strong className="font-bold text-emerald-700 tracking-wide uppercase">
              Nazmul IT
            </strong>
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>গোপনীয়তা নীতি</span>
            <span>•</span>
            <span>শর্তাবলী</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">Nazmul IT Official</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
