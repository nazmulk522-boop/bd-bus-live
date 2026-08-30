/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroIntro } from './components/HeroIntro';
import { CompanyFilter } from './components/CompanyFilter';
import { BusCard } from './components/BusCard';
import { LiveBroadcasterModal } from './components/LiveBroadcasterModal';
import { LiveMapModal } from './components/LiveMapModal';
import { Footer } from './components/Footer';
import { LiveBusSession } from './types';
import { fetchLiveBuses } from './services/busService';
import { Radio, RefreshCw, Bus, AlertCircle, Sparkles, MapPin } from 'lucide-react';

export default function App() {
  const [buses, setBuses] = useState<LiveBusSession[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [selectedBusForMap, setSelectedBusForMap] = useState<LiveBusSession | null>(null);

  // Active user's own broadcast session
  const [myBroadcastSession, setMyBroadcastSession] = useState<LiveBusSession | null>(() => {
    try {
      const saved = localStorage.getItem('bbl_active_my_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Fetch all active buses
  const fetchActiveBuses = async () => {
    try {
      const activeBuses = await fetchLiveBuses();
      setBuses(activeBuses);
    } catch (e) {
      console.warn('Live API sync notice.');
    } finally {
      setLoading(false);
    }
  };

  // Real-time updates via SSE + local event listeners
  useEffect(() => {
    fetchActiveBuses();

    const handleLocalUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setBuses(e.detail);
      }
    };

    window.addEventListener('bbl_local_buses_updated', handleLocalUpdate);

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/buses/events');

      eventSource.addEventListener('initial_fleet', (event: any) => {
        try {
          const fleet = JSON.parse(event.data);
          setBuses(fleet);
          setLoading(false);
        } catch (err) {
          console.error('SSE initial_fleet parse error', err);
        }
      });

      eventSource.addEventListener('bus_update_all', (event: any) => {
        try {
          const updatedFleet = JSON.parse(event.data);
          setBuses(updatedFleet);
        } catch (err) {
          console.error('SSE bus_update_all parse error', err);
        }
      });

      eventSource.addEventListener('bus_location_update', (event: any) => {
        try {
          const updatedBus: LiveBusSession = JSON.parse(event.data);
          setBuses((prev) => {
            const exists = prev.some((b) => b.id === updatedBus.id);
            if (exists) {
              return prev.map((b) => (b.id === updatedBus.id ? updatedBus : b));
            } else {
              return [updatedBus, ...prev];
            }
          });

          // If this is currently displayed on the map, update selectedBus reference
          setSelectedBusForMap((prev) => (prev && prev.id === updatedBus.id ? updatedBus : prev));
        } catch (err) {
          console.error('SSE bus_location_update parse error', err);
        }
      });

      eventSource.addEventListener('bus_started', (event: any) => {
        try {
          const newBus: LiveBusSession = JSON.parse(event.data);
          setBuses((prev) => [newBus, ...prev.filter((b) => b.id !== newBus.id)]);
        } catch (err) {
          console.error('SSE bus_started parse error', err);
        }
      });

      eventSource.addEventListener('bus_stopped', (event: any) => {
        try {
          const { sessionId } = JSON.parse(event.data);
          setBuses((prev) => prev.filter((b) => b.id !== sessionId));
        } catch (err) {
          console.error('SSE bus_stopped parse error', err);
        }
      });

      eventSource.onerror = () => {
        // Fallback to polling if SSE fails
        eventSource?.close();
      };
    } catch (e) {
      console.warn('SSE not supported or failed to connect, falling back to interval polling');
    }

    // Interval fallback poll every 5 seconds
    const interval = setInterval(fetchActiveBuses, 5000);

    return () => {
      window.removeEventListener('bbl_local_buses_updated', handleLocalUpdate);
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(interval);
    };
  }, []);

  // Filter buses by company, route, search query
  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
      // Company match
      if (selectedCompany !== 'all' && bus.companyId !== selectedCompany) {
        return false;
      }

      // Route match
      if (selectedRoute !== 'all' && bus.routeId !== selectedRoute) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = bus.companyName.toLowerCase().includes(q) || bus.companyNameBn.includes(q);
        const matchNumber = bus.busNumber.toLowerCase().includes(q);
        const matchRoute = bus.routeName.toLowerCase().includes(q) || bus.routeNameBn.includes(q);
        const matchLoc =
          bus.currentLocationName.toLowerCase().includes(q) ||
          bus.currentLocationNameBn.includes(q);

        if (!matchName && !matchNumber && !matchRoute && !matchLoc) {
          return false;
        }
      }

      return true;
    });
  }, [buses, selectedCompany, selectedRoute, searchQuery]);

  const handleOpenMap = (bus: LiveBusSession) => {
    setSelectedBusForMap(bus);
    setIsMapModalOpen(true);
  };

  const handleSessionStart = (session: LiveBusSession) => {
    setMyBroadcastSession(session);
    try {
      localStorage.setItem('bbl_active_my_session', JSON.stringify(session));
    } catch {}
    // Add to buses list immediately
    setBuses((prev) => [session, ...prev.filter((b) => b.id !== session.id)]);
  };

  const handleSessionStop = () => {
    if (myBroadcastSession) {
      setBuses((prev) => prev.filter((b) => b.id !== myBroadcastSession.id));
    }
    setMyBroadcastSession(null);
    try {
      localStorage.removeItem('bbl_active_my_session');
    } catch {}
    setIsBroadcastModalOpen(false);
  };

  const liveActiveCount = buses.filter((b) => b.status === 'live').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Hind_Siliguri',sans-serif]">
      {/* 1. Header */}
      <Header
        onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
        activeCount={buses.length}
        isBroadcasting={!!myBroadcastSession}
        onOpenBroadcasterHUD={() => setIsBroadcastModalOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Introduction Section */}
        <HeroIntro onStartLive={() => setIsBroadcastModalOpen(true)} />

        {/* 3. Main Live Bus Tracking Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12" id="live-buses-section">
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-sm">
                🚌
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <span>বাসের লাইভ লোকেশন</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {liveActiveCount} Live Active
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  রিয়েল-টাইমে চলাচলরত বাসের অবস্থান ও আপডেট দেখুন
                </p>
              </div>
            </div>

            {/* Quick Refresh Status */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={fetchActiveBuses}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="তাত্ক্ষণিক রিফ্রেশ করুন"
                id="btn-refresh-buses"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>রিফ্রেশ</span>
              </button>
            </div>
          </div>

          {/* 4. Company & Route Filter */}
          <CompanyFilter
            selectedCompany={selectedCompany}
            onSelectCompany={setSelectedCompany}
            selectedRoute={selectedRoute}
            onSelectRoute={setSelectedRoute}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalFiltered={filteredBuses.length}
          />

          {/* 5. Bus Cards Grid */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">বাসের লাইভ লোকেশন লোড হচ্ছে...</p>
              <p className="text-xs text-slate-400 mt-1">জিপিএস সংযোগ যাচাই করা হচ্ছে</p>
            </div>
          ) : filteredBuses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-100">
                🚌
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">কোনো লাইভ বাস পাওয়া যায়নি</h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                আপনার নির্বাচিত ফিল্টারে বর্তমানে কোনো সক্রিয় বাস নেই। বাসে বসে থাকলে আপনি নিজেই লাইভ লোকেশন চালু করতে পারেন!
              </p>
              <button
                onClick={() => setIsBroadcastModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                id="btn-empty-start-live"
              >
                <span>📍 লোকেশন লাইভ করুন</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBuses.map((bus) => (
                <BusCard
                  key={bus.id}
                  bus={bus}
                  onOpenMap={handleOpenMap}
                  isMyBroadcast={myBroadcastSession?.id === bus.id}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Live Location Broadcaster Modal */}
      <LiveBroadcasterModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        activeSession={myBroadcastSession}
        onSessionStart={handleSessionStart}
        onSessionStop={handleSessionStop}
      />

      {/* Live Map Modal */}
      <LiveMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        selectedBus={selectedBusForMap}
        allBuses={buses}
        onSelectBus={setSelectedBusForMap}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
