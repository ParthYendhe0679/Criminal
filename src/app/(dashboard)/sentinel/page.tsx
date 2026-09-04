'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { openInspector } from '@/store/slices/uiSlice';
import { sentinelSubjects } from '@/mock';
import type { SentinelSubject } from '@/types';
import {
  Eye, AlertTriangle, Shield, Clock, MapPin, Car, Activity,
  CheckCircle2, ArrowRight, ShieldAlert, User
} from 'lucide-react';
import { toast } from 'sonner';

export default function SentinelPage() {
  const dispatch = useAppDispatch();
  const [selectedSubject, setSelectedSubject] = useState<SentinelSubject>(sentinelSubjects[0]); // PERSON-014

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              KRITAGAS SENTINEL
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              Surveillance Intelligence Simulation
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Continuous behavioral baseline tracking, deviation anomaly detection, and movement pattern alerts
          </p>
        </div>

        {/* Subject switcher */}
        <div className="flex items-center gap-2">
          {sentinelSubjects.map((s) => (
            <button
              key={s.personId}
              onClick={() => setSelectedSubject(s)}
              className="px-3 py-1.5 rounded-md text-[12px] font-medium border transition-colors"
              style={{
                borderColor: selectedSubject.personId === s.personId ? 'var(--accent)' : 'var(--border)',
                background: selectedSubject.personId === s.personId ? 'var(--accent-muted)' : 'var(--surface-1)',
                color: selectedSubject.personId === s.personId ? 'var(--accent)' : 'var(--ink-secondary)',
              }}
            >
              {s.name} ({s.personId})
            </button>
          ))}
        </div>
      </div>

      {/* Primary Subject Status Hero */}
      <div
        className="p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-[15px] shrink-0"
            style={{ background: 'var(--accent)' }}>
            {selectedSubject.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-id font-bold text-[13px] text-[var(--accent)]">
                {selectedSubject.personId}
              </span>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded uppercase"
                style={{
                  background: selectedSubject.status === 'Anomaly Detected' ? 'var(--error-muted)' : 'var(--success-muted)',
                  color: selectedSubject.status === 'Anomaly Detected' ? '#DC2626' : '#16A34A',
                }}
              >
                {selectedSubject.status}
              </span>
            </div>
            <h2 className="text-[18px] font-bold mt-0.5" style={{ color: 'var(--ink-primary)' }}>
              Subject: {selectedSubject.name}
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
              Monitored in connection with active multi-jurisdictional inquiry CASE-102
            </p>
          </div>
        </div>

        {/* Anomaly Gauge */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-6" style={{ borderColor: 'var(--border)' }}>
          <div className="text-right">
            <span className="text-[11px] block uppercase font-semibold text-[var(--ink-tertiary)]">
              Composite Anomaly Score
            </span>
            <span className="text-[26px] font-bold font-mono-id text-[var(--error)]">
              {selectedSubject.anomalyScore.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => dispatch(openInspector({ id: selectedSubject.personId, type: 'Person' }))}
            className="px-3.5 py-2 rounded-lg text-[12px] font-medium border hover:bg-[var(--surface-2)] transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--ink-primary)' }}
          >
            Full Profile
          </button>
        </div>
      </div>

      {/* 2-Column Split: Baseline Profile vs Recent Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Baseline Profile (4 cols) */}
        <div
          className="lg:col-span-4 p-5 rounded-xl border space-y-4"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
              Established Behavioral Baseline
            </span>
            <CheckCircle2 size={15} className="text-[var(--success)]" />
          </div>

          <div className="space-y-3 text-[13px]">
            <div>
              <span className="text-[11px] block text-[var(--ink-tertiary)]">Normal Operational Hours</span>
              <span className="font-mono-id font-bold text-[var(--ink-primary)]">
                {String(selectedSubject.baselineActivity.startHour).padStart(2, '0')}:00 – {String(selectedSubject.baselineActivity.endHour).padStart(2, '0')}:00
              </span>
            </div>

            <div>
              <span className="text-[11px] block text-[var(--ink-tertiary)]">Frequent Core Locations</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {selectedSubject.baselineActivity.typicalLocations.map((loc) => (
                  <span key={loc} className="px-2 py-0.5 rounded text-[11px] bg-[var(--surface-2)] text-[var(--ink-secondary)]">
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] block text-[var(--ink-tertiary)]">Primary Transport Asset</span>
              <div className="flex flex-wrap gap-1.5 mt-1 font-mono-id text-[11px]">
                {selectedSubject.baselineActivity.typicalVehicles.map((v) => (
                  <span key={v} className="px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--accent)] font-semibold">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg border text-[11px] leading-relaxed bg-[var(--surface-2)]" style={{ borderColor: 'var(--border)', color: 'var(--ink-secondary)' }}>
            Baseline derived from 90-day historical mobility metrics, CDR cell tower registrations, and ANPR camera passes.
          </div>
        </div>

        {/* Recent Activity Timeline & Detected Anomalies (8 cols) */}
        <div
          className="lg:col-span-8 p-5 rounded-xl border space-y-4"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
              Surveillance Observations &amp; Anomaly Stream
            </span>
            <span className="text-[11px] font-mono-id text-[var(--error)] font-medium">
              {selectedSubject.recentActivity.filter((a) => a.isAnomaly).length} Anomalies Flagged
            </span>
          </div>

          <div className="space-y-3">
            {selectedSubject.recentActivity.map((obs, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border transition-colors flex items-start justify-between gap-3"
                style={{
                  background: obs.isAnomaly ? 'rgba(239,68,68,0.04)' : 'var(--surface-2)',
                  borderColor: obs.isAnomaly ? 'rgba(239,68,68,0.3)' : 'var(--border)',
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-id text-[12px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                      {obs.date} • {obs.time}
                    </span>
                    {obs.isAnomaly && (
                      <span className="badge badge-critical text-[10px]">
                        ANOMALY DETECTED
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] font-medium" style={{ color: 'var(--ink-primary)' }}>
                    {obs.activity} at <span className="font-semibold text-[var(--accent)]">{obs.location}</span>
                  </div>
                  {obs.anomalyReason && (
                    <div className="text-[11px] text-[var(--error)] font-medium mt-0.5">
                      ⚠️ {obs.anomalyReason}
                    </div>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[10px] font-mono-id text-[var(--ink-tertiary)]">
                    GPS Ref #{idx + 101}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recommended investigative action */}
          <div className="p-3 rounded-lg border flex items-center justify-between text-[12px]"
            style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <ShieldAlert size={15} className="text-[var(--warning)]" />
              <span className="font-semibold text-[var(--ink-primary)]">Recommendation:</span>
              <span style={{ color: 'var(--ink-secondary)' }}>
                Field surveillance review recommended for nocturnal departure window.
              </span>
            </div>
            <button
              onClick={() => toast.success('Surveillance alert dispatched to duty officer')}
              className="px-3 py-1 rounded bg-[var(--accent)] text-white text-[11px] font-medium"
            >
              Dispatch Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
