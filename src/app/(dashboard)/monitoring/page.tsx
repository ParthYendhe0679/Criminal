'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  toggleLive,
  setSpeed,
  clearEvents,
  setSelectedEvent,
  setFilterSeverity,
  setFilterType,
  addLiveEvent,
  updateSubjectLocation,
} from '@/store/slices/liveMonitoringSlice';
import { openInspector } from '@/store/slices/uiSlice';
import type { LiveEvent } from '@/types';
import {
  Radio, Play, Pause, RotateCcw, Filter, Eye, Camera, Car,
  MapPin, AlertTriangle, Shield, Clock, ExternalLink, Activity,
  Users, CheckCircle2, Navigation
} from 'lucide-react';
import { toast } from 'sonner';

const syntheticEventTemplates = [
  {
    type: 'CCTV Observation' as const,
    entityId: 'PERSON-014',
    entityType: 'Person' as const,
    title: 'Facial Recognition Verification: Aarav Mehta',
    details: 'Subject observed exiting commercial elevator lobby at Versova Business Centre. Facial confidence 96.2%.',
    location: 'Versova Business Centre, Andheri West',
    city: 'Mumbai',
    coordinates: [19.1319, 72.8258] as [number, number],
    severity: 'warning' as const,
  },
  {
    type: 'Vehicle Detected' as const,
    entityId: 'VEHICLE-044',
    entityType: 'Vehicle' as const,
    title: 'ANPR Sighting: MH-02-CD-4411 (Fortuner)',
    details: 'Vehicle entered Bandra-Worli Sea Link northbound carriageway. Speed 64 km/h.',
    location: 'Sea Link Toll Plaza, Bandra',
    city: 'Mumbai',
    coordinates: [19.0434, 72.8188] as [number, number],
    severity: 'info' as const,
  },
  {
    type: 'Anomaly Detected' as const,
    entityId: 'PERSON-014',
    entityType: 'Person' as const,
    title: 'Off-Pattern Geofence Deviation',
    details: 'Movement recorded outside calibrated residential perimeter. Anomaly index adjusted to 0.88.',
    location: 'Bandra Reclamation, Mumbai',
    city: 'Mumbai',
    coordinates: [19.0489, 72.8250] as [number, number],
    severity: 'critical' as const,
  },
  {
    type: 'Location Change' as const,
    entityId: 'PERSON-021',
    entityType: 'Person' as const,
    title: 'Cell Site Handover: Vikram Sharma',
    details: 'Phone terminal connected to Khar West Sector 3 cellular node.',
    location: '14th Road, Khar West',
    city: 'Mumbai',
    coordinates: [19.0712, 72.8335] as [number, number],
    severity: 'info' as const,
  },
  {
    type: 'New Relationship' as const,
    entityId: 'CASE-102',
    entityType: 'Case' as const,
    title: 'Telecom CDR Clustered Link Detected',
    details: 'Simultaneous cell sector registration detected between PHONE-014 and PHONE-021.',
    location: 'Andheri West Substation',
    city: 'Mumbai',
    coordinates: [19.1245, 72.8310] as [number, number],
    severity: 'warning' as const,
  },
];

export default function LiveMonitoringPage() {
  const dispatch = useAppDispatch();
  const {
    events,
    isLive,
    speed,
    currentSubject,
    selectedEventId,
    filterSeverity,
    filterType,
  } = useAppSelector((s) => s.liveMonitoring);

  const [activeMarkerId, setActiveMarkerId] = useState<string>('PERSON-014');

  // Synthetic Live Event Stream Generator Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      const delayMs = 6000 / speed;
      interval = setInterval(() => {
        const template =
          syntheticEventTemplates[
            Math.floor(Math.random() * syntheticEventTemplates.length)
          ];
        const now = new Date();
        const timeStr = now.toTimeString().slice(0, 8);
        const newEvent: LiveEvent = {
          ...template,
          id: `LIVE-${Date.now().toString().slice(-4)}`,
          timestamp: timeStr,
        };
        dispatch(addLiveEvent(newEvent));

        if (template.entityId === 'PERSON-014') {
          dispatch(
            updateSubjectLocation({
              location: template.location,
              time: `${timeStr} IST`,
              anomalyScore: template.severity === 'critical' ? 0.88 : 0.86,
            })
          );
        }
      }, delayMs);
    }
    return () => clearInterval(interval);
  }, [isLive, speed, dispatch]);

  const filteredEvents = events.filter((ev) => {
    if (filterSeverity !== 'all' && ev.severity !== filterSeverity) return false;
    if (filterType !== 'all' && ev.type !== filterType) return false;
    return true;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'CCTV Observation': return <Camera size={14} className="text-[#3B82F6]" />;
      case 'Vehicle Detected': return <Car size={14} className="text-[#10B981]" />;
      case 'Anomaly Detected': return <AlertTriangle size={14} className="text-[var(--error)]" />;
      case 'Location Change': return <MapPin size={14} className="text-[#F59E0B]" />;
      default: return <Activity size={14} className="text-[var(--accent)]" />;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header & Streaming Controls Bar */}
      <div
        className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel"
        style={{ borderColor: 'var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[18px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Live Surveillance &amp; Operations Center
            </h1>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono-id font-bold uppercase"
              style={{
                background: isLive ? 'var(--success-muted)' : 'var(--warning-muted)',
                color: isLive ? '#16A34A' : '#D97706',
              }}
            >
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[var(--success)] live-pulse-dot' : 'bg-[var(--warning)]'}`} />
              <span>{isLive ? 'LIVE STREAM ACTIVE' : 'STREAM PAUSED'}</span>
            </span>
          </div>
          <p className="text-[12px] text-[var(--ink-secondary)] mt-0.5">
            Synthetic real-time CCTV optical matches, ANPR toll sightings, cell tower triangulations, and circadian deviations
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={() => {
              dispatch(toggleLive());
              toast.info(isLive ? 'Simulated stream paused' : 'Simulated stream resumed');
            }}
            className="px-3.5 py-1.5 rounded-lg text-[12px] font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90"
            style={{ background: isLive ? 'var(--warning)' : 'var(--accent)' }}
          >
            {isLive ? <Pause size={14} /> : <Play size={14} />}
            <span>{isLive ? 'Pause Feed' : 'Resume Live'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center rounded-lg border p-0.5 glass-panel" style={{ borderColor: 'var(--border)' }}>
            {([1, 2, 4] as const).map((sp) => (
              <button
                key={sp}
                onClick={() => dispatch(setSpeed(sp))}
                className="px-2 py-1 rounded text-[11px] font-mono-id font-bold transition-colors"
                style={{
                  background: speed === sp ? 'var(--accent)' : 'transparent',
                  color: speed === sp ? '#FFFFFF' : 'var(--ink-secondary)',
                }}
              >
                {sp}x
              </button>
            ))}
          </div>

          {/* Clear Button */}
          <button
            onClick={() => {
              dispatch(clearEvents());
              toast.info('Live event buffer cleared');
            }}
            className="p-1.5 rounded-lg border hover:bg-[var(--surface-2)] text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)]"
            title="Clear Event Feed"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* 3-Column Main Monitoring Layout: LEFT (Map), CENTER (Live Feed), RIGHT (Subject View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT: Live Map with Animated Markers (5 cols) */}
        <div
          className="lg:col-span-5 p-4 rounded-xl border flex flex-col justify-between h-[560px] glass-panel relative overflow-hidden"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] flex items-center gap-1.5">
              <Navigation size={13} className="text-[var(--accent)]" /> Live Tactical Map
            </span>
            <span className="text-[10px] font-mono-id text-[var(--ink-tertiary)]">
              Suburban Mumbai Grid
            </span>
          </div>

          {/* Simulated Tactical Map Canvas with Pulsing Markers */}
          <div
            className="flex-1 rounded-lg border relative overflow-hidden flex items-center justify-center select-none"
            style={{ background: '#0F1014', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <svg className="w-full h-full">
              <defs>
                <pattern id="liveGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#liveGrid)" />

              {/* Highway corridors */}
              <path d="M 40 460 Q 180 340 220 180 T 260 40" fill="none" stroke="rgba(91,91,214,0.3)" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M 220 180 L 380 260 L 440 380" fill="none" stroke="rgba(91,91,214,0.3)" strokeWidth="2" strokeDasharray="3 3" />

              {/* Marker 1: PERSON-014 (Versova / Andheri) */}
              <g className="cursor-pointer" onClick={() => setActiveMarkerId('PERSON-014')}>
                <circle cx="210" cy="190" r="16" fill="rgba(239,68,68,0.25)" className="animate-ping" />
                <circle cx="210" cy="190" r="7" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                <text x="210" y="174" fill="#FAFAFA" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  PERSON-014 (Mehta)
                </text>
              </g>

              {/* Marker 2: VEHICLE-044 (Fortuner on Sea Link / Toll) */}
              <g className="cursor-pointer" onClick={() => setActiveMarkerId('VEHICLE-044')}>
                <circle cx="170" cy="310" r="14" fill="rgba(16,185,129,0.25)" className="animate-ping" />
                <circle cx="170" cy="310" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                <text x="170" y="296" fill="#FAFAFA" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  VEHICLE-044
                </text>
              </g>

              {/* Marker 3: PERSON-021 (Bandra) */}
              <g className="cursor-pointer" onClick={() => setActiveMarkerId('PERSON-021')}>
                <circle cx="190" cy="270" r="6" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="190" y="258" fill="#FAFAFA" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  PERSON-021
                </text>
              </g>

              {/* Marker 4: Nexus Trading Office (LOC-087) */}
              <g className="cursor-pointer" onClick={() => setActiveMarkerId('LOC-087')}>
                <rect x="230" y="210" width="10" height="10" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="235" y="234" fill="#A1A1AA" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  Nexus Office
                </text>
              </g>
            </svg>

            {/* Floating Glass Coordinates Overlay */}
            <div
              className="absolute bottom-2.5 left-2.5 p-2 rounded-lg text-[10px] font-mono-id border glass-panel text-[var(--ink-secondary)]"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
              Active Sector: 19.1319° N, 72.8258° E
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
            <span>Target Focused: <strong>{activeMarkerId}</strong></span>
            <button
              onClick={() => dispatch(openInspector({ id: activeMarkerId, type: activeMarkerId.startsWith('PERSON') ? 'Person' : 'Vehicle' }))}
              className="text-[var(--accent)] font-semibold hover:underline"
            >
              Inspect Target →
            </button>
          </div>
        </div>

        {/* CENTER: Live Activity Feed (4 cols) */}
        <div
          className="lg:col-span-4 p-4 rounded-xl border flex flex-col justify-between h-[560px] glass-panel"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
                Live Activity Feed
              </span>
              <span className="text-[10px] font-mono-id px-1.5 py-0.2 rounded bg-[var(--accent-muted)] text-[var(--accent)] font-bold">
                {filteredEvents.length} events
              </span>
            </div>

            {/* Severity Filter */}
            <select
              value={filterSeverity}
              onChange={(e) => dispatch(setFilterSeverity(e.target.value))}
              className="h-6 px-1.5 text-[10px] font-medium rounded border bg-[var(--glass-2)] text-[var(--ink-secondary)] outline-none"
              style={{ borderColor: 'var(--border)' }}
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warning Only</option>
              <option value="info">Info Only</option>
            </select>
          </div>

          {/* Scrolling Feed Area */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => {
                  dispatch(setSelectedEvent(ev.id));
                  dispatch(openInspector({ id: ev.entityId, type: ev.entityType }));
                }}
                className="p-3 rounded-lg border cursor-pointer hover:border-[var(--accent)] transition-all space-y-1"
                style={{
                  background: ev.severity === 'critical' ? 'rgba(220,38,38,0.06)' : 'var(--glass-1)',
                  borderColor: ev.severity === 'critical' ? 'rgba(220,38,38,0.3)' : 'var(--border)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {getEventIcon(ev.type)}
                    <span className="font-semibold text-[12px] truncate max-w-[170px]" style={{ color: 'var(--ink-primary)' }}>
                      {ev.type}
                    </span>
                  </div>
                  <span className="font-mono-id text-[10px] text-[var(--ink-tertiary)]">
                    {ev.timestamp}
                  </span>
                </div>

                <div className="text-[12px] font-medium" style={{ color: 'var(--ink-primary)' }}>
                  {ev.title}
                </div>

                <div className="text-[11px] leading-relaxed line-clamp-2" style={{ color: 'var(--ink-secondary)' }}>
                  {ev.details}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono-id pt-1 border-t" style={{ borderColor: 'var(--border)', color: 'var(--ink-tertiary)' }}>
                  <span className="text-[var(--accent)] font-semibold">{ev.entityId}</span>
                  <span className="truncate max-w-[140px]">{ev.location}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center text-[10px] font-mono-id" style={{ color: 'var(--ink-tertiary)' }}>
            Auto-refreshing live surveillance queue
          </div>
        </div>

        {/* RIGHT: Live Subject View (PERSON-014) (3 cols) */}
        <div
          className="lg:col-span-3 p-4 rounded-xl border flex flex-col justify-between h-[560px] glass-panel overflow-y-auto"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
                Live Subject Focus
              </span>
              <span className="badge badge-critical font-bold">
                {currentSubject.status}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-[12px]" style={{ background: 'var(--accent)' }}>
                  AM
                </div>
                <div>
                  <h3 className="font-bold text-[15px]" style={{ color: 'var(--ink-primary)' }}>
                    {currentSubject.name}
                  </h3>
                  <div className="text-[11px] font-mono-id text-[var(--accent)] font-semibold">
                    {currentSubject.personId}
                  </div>
                </div>
              </div>
            </div>

            {/* Anomaly Gauge */}
            <div className="p-3 rounded-lg border text-[12px] space-y-1.5" style={{ background: 'var(--glass-2)', borderColor: 'var(--border)' }}>
              <div className="flex justify-between items-baseline">
                <span style={{ color: 'var(--ink-secondary)' }}>Circadian Anomaly:</span>
                <span className="text-[18px] font-black font-mono-id text-[var(--error)]">
                  {currentSubject.anomalyScore.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-[var(--surface-3)] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--error)]" style={{ width: `${currentSubject.anomalyScore * 100}%` }} />
              </div>
            </div>

            {/* Last Observation Metadata */}
            <div className="space-y-2 text-[12px]">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)] block">
                  Current Observed Location
                </span>
                <span className="font-medium text-[var(--ink-primary)] leading-snug block mt-0.5">
                  {currentSubject.currentLocation}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)] block">
                  Last Telemetry Timestamp
                </span>
                <span className="font-mono-id text-[var(--accent)] font-semibold block mt-0.5">
                  {currentSubject.lastObservationTime}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)] block">
                  Registered Vehicle
                </span>
                <span className="font-mono-id font-medium text-[var(--ink-primary)] block mt-0.5">
                  {currentSubject.vehicleId}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)] block">
                  Connected Investigation
                </span>
                <span className="font-mono-id font-bold text-[var(--accent)] block mt-0.5">
                  {currentSubject.caseId}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => dispatch(openInspector({ id: currentSubject.personId, type: 'Person' }))}
              className="w-full py-2 rounded-lg text-[12px] font-semibold border flex items-center justify-center gap-1.5 hover:bg-[var(--surface-2)] transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--ink-primary)' }}
            >
              <span>Full Subject Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
