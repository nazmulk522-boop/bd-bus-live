import React, { useState } from 'react';
import { LiveBusSession } from '../types';
import { Share2, Copy, Check, MessageCircle, Send, X, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  bus: LiveBusSession | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, bus }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !bus) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const shareUrl = `${currentOrigin}${currentPath}?bus=${encodeURIComponent(bus.id)}`;

  const shareText = `🚌 ${bus.companyNameBn} (${bus.busNumber}) বাসের লাইভ লোকেশন দেখুন!\n📍 রুট: ${bus.originBn} ➔ ${bus.destinationBn}\n📍 বর্তমান অবস্থান: ${bus.currentLocationNameBn || bus.currentLocationName}\n🔗 লাইভ ট্র্যাকিং লিংক:`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${bus.companyNameBn} - লাইভ বাস ট্র্যাকিং`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User canceled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
  const messengerUrl = `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`;
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl shrink-0">
            <Share2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              লাইভ লোকেশন শেয়ার করুন
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {bus.companyNameBn} ({bus.busNumber})
            </p>
          </div>
        </div>

        {/* Bus Summary Banner */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-medium text-slate-500">রুট:</span>
            <span className="font-bold text-slate-900">{bus.originBn} ➔ {bus.destinationBn}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-medium text-slate-500">বর্তমান অবস্থান:</span>
            <span className="font-bold text-emerald-700">📍 {bus.currentLocationNameBn || bus.currentLocationName}</span>
          </div>
        </div>

        {/* Quick Share Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-bold text-xs transition-all active:scale-98"
          >
            <div className="w-7 h-7 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span>হোয়াটসঅ্যাপ (WhatsApp)</span>
          </a>

          {/* Facebook / Messenger */}
          <a
            href={fbShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] font-bold text-xs transition-all active:scale-98"
          >
            <div className="w-7 h-7 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <span>ফেসবুক / মেসেঞ্জার</span>
          </a>

          {/* Telegram */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#0088cc] font-bold text-xs transition-all active:scale-98"
          >
            <div className="w-7 h-7 rounded-xl bg-[#229ED9] text-white flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <span>টেলিগ্রাম (Telegram)</span>
          </a>

          {/* Native Device Share Sheet (Mobile) */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs transition-all active:scale-98 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <span>অন্যান্য অ্যাপে শেয়ার</span>
          </button>
        </div>

        {/* Copy Direct Link Section */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            সরাসরি ট্র্যাকিং লিংক কপি করুন:
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono truncate select-all">
              {shareUrl}
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>কপি লিংক</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            এই লিংকে ক্লিক করলে যে কেউ কোনো লগইন ছাড়াই সরাসরি এই বাসের লাইভ ম্যাপ দেখতে পারবে।
          </p>
        </div>
      </div>
    </div>
  );
};
