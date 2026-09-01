import React, { useState, useEffect, useRef } from 'react';
import {
  BUS_COMPANIES,
  BUS_ROUTES,
  geocodeLocation,
  buildRouteDirection,
  toBanglaNumber,
  formatBanglaTimeAgo
} from '../data/bangladeshRoutes';
import { searchPlaceLocations, PlaceLocation } from '../data/bangladeshPlaces';
import { LiveBusSession } from '../types';
import {
  startBroadcastSession,
  updateBroadcastLocation,
  stopBroadcastSession
} from '../services/busService';
import {
  X,
  Radio,
  MapPin,
  Compass,
  AlertCircle,
  CheckCircle2,
  Gauge,
  Clock,
  Shield,
  Square,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Search,
  ChevronDown,
  ArrowRight,
  Navigation,
  Sparkles,
  Smartphone,
  AlertTriangle
} from 'lucide-react';

interface LiveBroadcasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSession: LiveBusSession | null;
  onSessionStart: (session: LiveBusSession) => void;
  onSessionStop: () => void;
}

export const LiveBroadcasterModal: React.FC<LiveBroadcasterModalProps> = ({
  isOpen,
  onClose,
  activeSession,
  onSessionStart,
  onSessionStop
}) => {
  // 1. Bus Company State
  const [companySearch, setCompanySearch] = useState<string>('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [showCompanySuggestions, setShowCompanySuggestions] = useState<boolean>(false);

  // 2. Bus Number State
  const [busNumber, setBusNumber] = useState<string>('');

  // 3. Origin & Destination Counter / Stop States (Empty defaults as requested)
  const [originSearch, setOriginSearch] = useState<string>('');
  const [destinationSearch, setDestinationSearch] = useState<string>('');
  const [showOriginSuggestions, setShowOriginSuggestions] = useState<boolean>(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState<boolean>(false);

  // Route Color Picker
  const [routeColor, setRouteColor] = useState<string>('#E11D48'); // Rose Red default

  const [isStarting, setIsStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [chatHeadWarning, setChatHeadWarning] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string>('standby');
  const [liveLocationData, setLiveLocationData] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    speed: number;
    lastUpdateMs: number;
  } | null>(null);

  const companyDropdownRef = useRef<HTMLDivElement | null>(null);
  const originDropdownRef = useRef<HTMLDivElement | null>(null);
  const destinationDropdownRef = useRef<HTMLDivElement | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const heartbeatIntervalRef = useRef<any>(null);
  const wakeLockRef = useRef<any>(null);

  const deviceSessionIdRef = useRef<string>(() => {
    let id = localStorage.getItem('bbl_device_session_id');
    if (!id) {
      id = 'dev-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
      localStorage.setItem('bbl_device_session_id', id);
    }
    return id;
  });

  // Acquire Screen WakeLock so device doesn't sleep while broadcasting live
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch (e) {
      console.warn('Wake Lock not supported or permission denied', e);
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      try {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (e) {
        console.warn('Wake Lock release error', e);
      }
    }
  };

  // Re-acquire WakeLock on visibility change if session is active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && activeSession) {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeSession]);

  // Track active session timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let interval: any;
    if (activeSession) {
      interval = setInterval(() => {
        setSecondsElapsed(Math.floor((Date.now() - activeSession.startedAt) / 1000));
      }, 1000);
    } else {
      setSecondsElapsed(0);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  // Clean up geolocation watch, interval, and wakelock on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      releaseWakeLock();
    };
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(e.target as Node)) {
        setShowCompanySuggestions(false);
      }
      if (originDropdownRef.current && !originDropdownRef.current.contains(e.target as Node)) {
        setShowOriginSuggestions(false);
      }
      if (destinationDropdownRef.current && !destinationDropdownRef.current.contains(e.target as Node)) {
        setShowDestinationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Filter Company Suggestions
  const filteredCompanies = companySearch.trim()
    ? BUS_COMPANIES.filter((c) => {
        const query = companySearch.toLowerCase().trim();
        return (
          c.nameBn.toLowerCase().includes(query) ||
          c.name.toLowerCase().includes(query) ||
          c.id.toLowerCase().includes(query)
        );
      })
    : [];

  // Comprehensive Search for All 64 Districts, Upazilas & Bus Stands
  const filteredOrigins = originSearch.trim() ? searchPlaceLocations(originSearch, 12) : [];
  const filteredDestinations = destinationSearch.trim() ? searchPlaceLocations(destinationSearch, 12) : [];

  // Calculate live route direction preview
  const directionPreview = buildRouteDirection(
    originSearch.trim() || 'শুরুর স্থান',
    destinationSearch.trim() || 'গন্তব্য'
  );

  const handleSelectCompany = (company: typeof BUS_COMPANIES[0]) => {
    setCompanySearch(company.nameBn);
    setSelectedCompanyId(company.id);
    setShowCompanySuggestions(false);
  };

  const handleSelectOrigin = (place: PlaceLocation) => {
    setOriginSearch(place.nameBn);
    setShowOriginSuggestions(false);
  };

  const handleSelectDestination = (place: PlaceLocation) => {
    setDestinationSearch(place.nameBn);
    setShowDestinationSuggestions(false);
  };

  // Resilient Geolocation Acquisition (Solving Chat Head / Overlay blocking issues)
  const acquirePositionWithFallback = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('আপনার ব্রাউজারে জিপিএস সাপোর্ট করে না।'));
      }

      let hasTimedOut = false;
      const timeoutId = setTimeout(() => {
        hasTimedOut = true;
      }, 7000);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timeoutId);
          resolve(pos);
        },
        (err) => {
          clearTimeout(timeoutId);
          console.warn('GPS attempt 1 failed, retrying with adaptive fallback...', err.message);

          navigator.geolocation.getCurrentPosition(
            (fallbackPos) => {
              resolve(fallbackPos);
            },
            (finalErr) => {
              if (
                finalErr.code === finalErr.PERMISSION_DENIED ||
                finalErr.code === finalErr.POSITION_UNAVAILABLE ||
                hasTimedOut
              ) {
                setChatHeadWarning(true);
              }
              reject(finalErr);
            },
            {
              enableHighAccuracy: false,
              timeout: 8000,
              maximumAge: 120000
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 5000
        }
      );
    });
  };

  // Launch broadcast using coordinates
  const executeBroadcastLaunch = async (
    lat: number,
    lng: number,
    accuracy: number = 15,
    speed: number = 0,
    heading: number = 0
  ) => {
    const finalCompanyName = companySearch.trim();
    const finalBusNum = busNumber.trim();
    const finalOrigin = originSearch.trim() || 'ঢাকা (গাবতলী)';
    const finalDestination = destinationSearch.trim() || 'সিরাজগঞ্জ';

    // Calculate smart direction
    const directionData = buildRouteDirection(finalOrigin, finalDestination);

    const matchedCompany = BUS_COMPANIES.find(
      (c) =>
        c.nameBn.toLowerCase() === finalCompanyName.toLowerCase() ||
        c.name.toLowerCase() === finalCompanyName.toLowerCase()
    );
    const resolvedCompanyId = matchedCompany ? matchedCompany.id : finalCompanyName;

    const deviceId =
      typeof deviceSessionIdRef.current === 'function'
        ? deviceSessionIdRef.current()
        : deviceSessionIdRef.current;

    try {
      const newSession = await startBroadcastSession({
        companyId: resolvedCompanyId,
        companyName: finalCompanyName,
        busNumber: finalBusNum,
        routeId: directionData.routeId,
        customRouteName: directionData.routeNameBn,
        originBn: directionData.originBn,
        destinationBn: directionData.destinationBn,
        originLat: directionData.originGeo.lat,
        originLng: directionData.originGeo.lng,
        destinationLat: directionData.destinationGeo.lat,
        destinationLng: directionData.destinationGeo.lng,
        routeCoordinates: directionData.pathCoordinates,
        routeColor: routeColor || '#E11D48',
        deviceSessionId: deviceId,
        initialLat: lat,
        initialLng: lng,
        accuracy: Math.round(accuracy),
        speed: speed || 0,
        heading: heading || 0
      });

      onSessionStart(newSession);
      setIsStarting(false);
      setGpsStatus('active');
      setChatHeadWarning(false);

      // Start continuous Geolocation Watch
      startContinuousWatch(newSession.id);
    } catch (err: any) {
      setErrorMsg('লাইভ ট্র্যাকিং শুরু করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      setIsStarting(false);
      setGpsStatus('error');
    }
  };

  // Handle GPS Start button
  const handleStartLive = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setChatHeadWarning(false);

    const finalCompanyName = companySearch.trim();
    if (!finalCompanyName) {
      setErrorMsg('অনুগ্রহ করে বাস কোম্পানির নাম লিখুন বা নির্বাচন করুন।');
      return;
    }

    if (!busNumber.trim()) {
      setErrorMsg('অনুগ্রহ করে বাসের নম্বর (যেমন: ঢাকা মেট্রো ব-১২-৩৪৫৬) প্রদান করুন।');
      return;
    }

    if (!originSearch.trim() || !destinationSearch.trim()) {
      setErrorMsg('অনুগ্রহ করে বাসের শুরু কাউন্টার এবং শেষ কাউন্টার উভয় নাম লিখুন বা সিলেক্ট করুন।');
      return;
    }

    setIsStarting(true);
    setGpsStatus('requesting_permission');

    try {
      const position = await acquirePositionWithFallback();
      const { latitude, longitude, accuracy, speed, heading } = position.coords;
      const currentSpeed = speed !== null && !isNaN(speed) ? Math.round(speed * 3.6) : 0;

      setLiveLocationData({
        lat: latitude,
        lng: longitude,
        accuracy: Math.round(accuracy),
        speed: currentSpeed,
        lastUpdateMs: Date.now()
      });

      await executeBroadcastLaunch(latitude, longitude, accuracy, currentSpeed, heading || 0);
    } catch (err: any) {
      setIsStarting(false);
      setGpsStatus('error');

      // Check if chat head overlay caused the lock
      setChatHeadWarning(true);
      if (err?.code === 1) {
        setErrorMsg(
          'জিপিএস লোকেশন পারমিশন ডিনাই হয়েছে। মোবাইলে মেসেঞ্জার চ্যাট হেড বা ফ্লোটিং বাবল থাকলে পারমিশন ব্লক হয়, বাবলটি সরিয়ে আবার চেষ্টা করুন।'
        );
      } else {
        setErrorMsg(
          `জিপিএস সিগন্যাল পেতে সমস্যা হয়েছে (${err?.message || 'টাইমআউট'})। নিচে বিকল্প কাউন্টার লোকেশন দিয়ে শুরু করতে পারেন।`
        );
      }
    }
  };

  // Fallback: Start immediately using Origin Counter Geocoded Position if native GPS is blocked
  const handleStartWithCounterLocation = async () => {
    setErrorMsg(null);
    setIsStarting(true);

    const originGeo = directionPreview.originGeo;
    setLiveLocationData({
      lat: originGeo.lat,
      lng: originGeo.lng,
      accuracy: 25,
      speed: 0,
      lastUpdateMs: Date.now()
    });

    try {
      await executeBroadcastLaunch(originGeo.lat, originGeo.lng, 25, 0, 0);
    } catch (err: any) {
      setIsStarting(false);
      setErrorMsg('কাউন্টার লোকেশন থেকে ব্রডকাস্ট শুরু করা যায়নি।');
    }
  };

  // Continuous background GPS monitor with dual-engine fallback (Watches + Heartbeat Polling)
  const startContinuousWatch = (sessionId: string) => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    // Keep screen awake
    requestWakeLock();

    const deviceId =
      typeof deviceSessionIdRef.current === 'function'
        ? deviceSessionIdRef.current()
        : deviceSessionIdRef.current;

    if (!navigator.geolocation) return;

    // Helper to push location
    const pushLocation = async (pos: GeolocationPosition) => {
      const { latitude, longitude, accuracy, speed, heading } = pos.coords;
      const currentSpeed =
        speed !== null && !isNaN(speed) && speed > 0 ? Math.round(speed * 3.6) : 0;

      setLiveLocationData({
        lat: latitude,
        lng: longitude,
        accuracy: Math.round(accuracy),
        speed: currentSpeed,
        lastUpdateMs: Date.now()
      });

      try {
        await updateBroadcastLocation({
          sessionId,
          deviceSessionId: deviceId,
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          speed: currentSpeed,
          heading: heading || 0,
          timestamp: Date.now()
        });
      } catch (e) {
        console.error('Failed to sync location', e);
      }
    };

    // 1. Native Geolocation Watch
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => pushLocation(pos),
      (err) => {
        console.warn('Continuous GPS watch warning:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000
      }
    );

    // 2. Periodic Heartbeat Poller (Guarantees location continues even when chat heads or bubbles are touched)
    heartbeatIntervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => pushLocation(pos),
        () => {
          // Fallback to low-accuracy network position
          navigator.geolocation.getCurrentPosition(
            (fallbackPos) => pushLocation(fallbackPos),
            () => {},
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 4000, maximumAge: 5000 }
      );
    }, 4000);
  };

  // Stop Live Broadcast
  const handleStopLive = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    releaseWakeLock();

    if (activeSession) {
      try {
        const deviceId =
          typeof deviceSessionIdRef.current === 'function'
            ? deviceSessionIdRef.current()
            : deviceSessionIdRef.current;

        await stopBroadcastSession(activeSession.id, deviceId);
      } catch (e) {
        console.error('Stop broadcast error:', e);
      }
    }

    onSessionStop();
    setGpsStatus('standby');
    setLiveLocationData(null);
    setChatHeadWarning(false);
  };

  const handleCopyLink = () => {
    if (!activeSession) return;
    const url = `${window.location.origin}/?bus=${activeSession.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      style={{ touchAction: 'manipulation' }}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col"
        id="live-broadcaster-modal"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-700 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-xs">
              📡
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight">
                {activeSession ? 'লাইভ জিপিএস চলছে' : 'বাস লাইভ ট্র্যাকিং শুরু করুন'}
              </h3>
              <p className="text-xs text-emerald-100">
                {activeSession
                  ? 'আপনার মোবাইল জিপিএস থেকে লোকেশন শেয়ার হচ্ছে'
                  : 'যাত্রী বা বাসের স্টাফ ফোন দিয়ে লাইভ লোকেশন সম্প্রচার করুন'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            id="btn-close-broadcaster-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Floating Bubble / Chat Head Helper Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <Smartphone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">📱 চ্যাট হেড (Chat Head) বা বাবল নোটিস:</span>
              <p className="text-amber-800 mt-0.5">
                ফোনে মেসেঞ্জার বা অন্যান্য অ্যাপের ফ্লোটিং বাবল / চ্যাট হেড থাকলে জিপিএস পারমিশন ডায়ালগ ব্লক হতে পারে। লাইভ শুরু করার আগে চ্যাট হেডটি স্ক্রিনের নিচে টেনে ড্র্যাগ করে সরিয়ে নিন।
              </p>
            </div>
          </div>

          {activeSession ? (
            /* ACTIVE BROADCAST VIEW */
            <div className="space-y-5 animate-in fade-in">
              {/* Live Signal Pulse Card */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-6 shadow-lg shadow-emerald-500/20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-9xl font-bold">
                  LIVE
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                  <span>অন-এয়ার লাইভ লোকেশন সম্প্রচার</span>
                </div>

                <h2 className="text-2xl font-extrabold mb-1">{activeSession.companyNameBn}</h2>
                <div className="font-mono text-base font-bold text-emerald-100 mb-2">
                  {activeSession.busNumber}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/20 rounded-xl text-xs font-medium text-white mb-4">
                  <span>{activeSession.originBn}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{activeSession.destinationBn}</span>
                </div>

                {/* Live Stats */}
                <div className="grid grid-cols-3 gap-2 bg-black/20 backdrop-blur-md rounded-2xl p-3 text-center">
                  <div>
                    <div className="text-[10px] text-emerald-200 uppercase font-semibold">গতি</div>
                    <div className="text-base font-extrabold font-mono mt-0.5">
                      {toBanglaNumber(liveLocationData?.speed || activeSession.speed || 0)} কিমি/ঘণ্টা
                    </div>
                  </div>
                  <div className="border-x border-white/10">
                    <div className="text-[10px] text-emerald-200 uppercase font-semibold">সময়কাল</div>
                    <div className="text-base font-extrabold font-mono mt-0.5">
                      {formatTimer(secondsElapsed)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-200 uppercase font-semibold">জিপিএস একুরেসি</div>
                    <div className="text-base font-extrabold font-mono mt-0.5">
                      ±{toBanglaNumber(liveLocationData?.accuracy || activeSession.accuracy || 12)} মিটার
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-bold py-3 px-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                  id="btn-copy-live-link"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">লিঙ্ক কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-slate-600" />
                      <span>যাত্রীদের জন্য বাসের লাইভ লিঙ্ক শেয়ার করুন</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStopLive}
                  className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-stop-broadcast"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>লাইভ সম্প্রচার বন্ধ করুন</span>
                </button>
              </div>
            </div>
          ) : (
            /* START BROADCAST FORM */
            <form onSubmit={handleStartLive} className="space-y-4" id="form-start-broadcast">
              {/* Error Message */}
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold">ত্রুটি:</span> {errorMsg}
                  </div>
                </div>
              )}

              {/* Chat Head / Overlay Detected Recovery Box */}
              {chatHeadWarning && (
                <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs text-amber-900 space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-bold text-sm text-amber-900">
                        চ্যাট হেড বা বাবল পারমিশন বাধাগ্রস্ত করছে?
                      </span>
                      <p className="text-amber-800 mt-1">
                        মেসেঞ্জার চ্যাট হেড সরিয়ে আবার চেষ্টা করতে পারেন, অথবা ফোনের জিপিএস যদি লক থাকে তবে নিচের বাটনে ক্লিক করে সরাসরি কাউন্টার লোকেশন দিয়ে ব্রডকাস্ট চালু করতে পারেন।
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleStartLive}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>পুনরায় জিপিএস চেষ্টা করুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleStartWithCounterLocation}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>কাউন্টার লোকেশন থেকে শুরু করুন</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 1. BUS COMPANY INPUT */}
              <div className="space-y-1 relative" ref={companyDropdownRef}>
                <label className="block text-xs font-bold text-slate-700">
                  ১. বাস কোম্পানির নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={companySearch}
                    onChange={(e) => {
                      setCompanySearch(e.target.value);
                      setShowCompanySuggestions(true);
                      setSelectedCompanyId('');
                    }}
                    onFocus={() => {
                      if (companySearch.trim().length > 0) {
                        setShowCompanySuggestions(true);
                      }
                    }}
                    placeholder="যেমন: হানিফ, শ্যামলী, সৌদিয়া, এনা, গ্রীন লাইন..."
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-slate-800 placeholder-slate-400 transition-all"
                    id="input-company-search"
                    autoComplete="off"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  {companySearch ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCompanySearch('');
                        setShowCompanySuggestions(false);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>

                {/* Company Suggestions Dropdown */}
                {showCompanySuggestions && companySearch.trim().length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-60 overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-100">
                    <div className="p-2 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between sticky top-0">
                      <span>কোম্পানি সাজেশন ({toBanglaNumber(filteredCompanies.length)} টি)</span>
                    </div>

                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectCompany(c)}
                          className="w-full px-4 py-2.5 text-left hover:bg-emerald-50/80 transition-colors flex items-center justify-between gap-2 cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                              {c.nameBn.charAt(0)}
                            </span>
                            <div>
                              <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                                {c.nameBn}
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium">
                                {c.name}
                              </div>
                            </div>
                          </div>
                          {c.hotline && (
                            <span className="text-[10px] bg-slate-100 group-hover:bg-emerald-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                              📞 {c.hotline}
                            </span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-500">
                        <span>সরাসরি কোম্পানি নাম হিসেবে যুক্ত হবে</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. BUS NUMBER INPUT */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  ২. বাস নম্বর / প্লেট নম্বর <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    placeholder="যেমন: ঢাকা মেট্রো ব-১২-৩৪৫৬"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-mono text-slate-800 placeholder-slate-400 transition-all"
                    id="input-bus-number"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="text-sm">🚌</span>
                  </div>
                </div>
              </div>

              {/* 3. ORIGIN & DESTINATION COUNTER/STOP INPUTS */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    ৩. বাসের রুট (শুরু কাউন্টার ও শেষ কাউন্টার) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>গুগল ম্যাপ Direction সক্রিয়</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Origin Counter Input */}
                  <div className="space-y-1 relative" ref={originDropdownRef}>
                    <label className="block text-[11px] font-semibold text-slate-600">
                      🟢 শুরুর কাউন্টার / স্টপ:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={originSearch}
                        onChange={(e) => {
                          setOriginSearch(e.target.value);
                          setShowOriginSuggestions(true);
                        }}
                        onFocus={() => {
                          if (originSearch.trim().length > 0) {
                            setShowOriginSuggestions(true);
                          }
                        }}
                        placeholder="যেমন: ঢাকা (গাবতলী/মহাখালী/সায়েদাবাদ)..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800"
                        id="input-origin-stop"
                        autoComplete="off"
                      />
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-emerald-600">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Origin Suggestions */}
                    {showOriginSuggestions && originSearch.trim().length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-40 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-56 overflow-y-auto divide-y divide-slate-100 animate-in fade-in">
                        {filteredOrigins.slice(0, 10).map((s, idx) => (
                          <button
                            key={`${s.nameBn}-${idx}`}
                            type="button"
                            onClick={() => handleSelectOrigin(s)}
                            className="w-full px-3.5 py-2.5 text-left hover:bg-emerald-50 flex items-center justify-between text-xs cursor-pointer group transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                              <span className="font-bold text-slate-800 group-hover:text-emerald-700">{s.nameBn}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">{s.districtBn}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Destination Counter Input */}
                  <div className="space-y-1 relative" ref={destinationDropdownRef}>
                    <label className="block text-[11px] font-semibold text-slate-600">
                      🔴 গন্তব্য / শেষ কাউন্টার:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={destinationSearch}
                        onChange={(e) => {
                          setDestinationSearch(e.target.value);
                          setShowDestinationSuggestions(true);
                        }}
                        onFocus={() => {
                          if (destinationSearch.trim().length > 0) {
                            setShowDestinationSuggestions(true);
                          }
                        }}
                        placeholder="যেমন: চট্টগ্রাম, দিনাজপুর, ঢাকা (দোহার)..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800"
                        id="input-destination-stop"
                        autoComplete="off"
                      />
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-red-500">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Destination Suggestions */}
                    {showDestinationSuggestions && destinationSearch.trim().length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-40 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-56 overflow-y-auto divide-y divide-slate-100 animate-in fade-in">
                        {filteredDestinations.slice(0, 10).map((s, idx) => (
                          <button
                            key={`${s.nameBn}-${idx}`}
                            type="button"
                            onClick={() => handleSelectDestination(s)}
                            className="w-full px-3.5 py-2.5 text-left hover:bg-red-50 flex items-center justify-between text-xs cursor-pointer group transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                              <span className="font-bold text-slate-800 group-hover:text-red-700">{s.nameBn}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">{s.districtBn}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Direction Preview & Route Color Badge */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: routeColor }}></span>
                      <span>{directionPreview.originBn}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span>{directionPreview.destinationBn}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>দূরত্ব: ~{toBanglaNumber(directionPreview.totalDistanceKm)} কিমি</span>
                    <span>•</span>
                    <span>সময়: ~{toBanglaNumber(directionPreview.estimatedMinutes)} মিনিট</span>
                  </div>
                </div>

                {/* Route Color Choice */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-slate-500 font-medium">ম্যাপে রুট কালার:</span>
                  {[
                    { color: '#E11D48', label: 'লাল' },
                    { color: '#2563EB', label: 'নীল' },
                    { color: '#059669', label: 'সবুজ' },
                    { color: '#7C3AED', label: 'বেগুনী' },
                    { color: '#D97706', label: 'কমলা' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setRouteColor(c.color)}
                      style={{ backgroundColor: c.color }}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                        routeColor === c.color ? 'ring-2 ring-slate-900 ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isStarting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-98 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-2xl text-base transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-start-broadcast"
                >
                  {isStarting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>জিপিএস সংযোগ করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-5 h-5 animate-pulse" />
                      <span>লাইভ লোকেশন শেয়ার শুরু করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
