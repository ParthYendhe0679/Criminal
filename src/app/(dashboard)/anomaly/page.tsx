'use client';

import React from 'react';
import { useAppDispatch } from '@/store/hooks';
import { openInspector } from '@/store/slices/uiSlice';
import {
  ActivitySquare, AlertTriangle, ShieldAlert, Clock,
  Calendar, CheckCircle2, ArrowRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line, ReferenceLine
} from 'recharts';

const hourlyActivityData = [
  { hour: '00:00', baseline: 0.05, current: 0.02, anomaly: false },
  { hour: '02:00', baseline: 0.02, current: 0.01, anomaly: false },
  { hour: '03:14', baseline: 0.01, current: 0.92, anomaly: true }, // Peak anomaly!
  { hour: '04:00', baseline: 0.02, current: 0.45, anomaly: true },
  { hour: '06:00', baseline: 0.10, current: 0.12, anomaly: false },
  { hour: '08:00', baseline: 0.65, current: 0.70, anomaly: false },
  { hour: '10:00', baseline: 0.88, current: 0.85, anomaly: false },
  { hour: '12:00', baseline: 0.95, current: 0.90, anomaly: false },
  { hour: '14:00', baseline: 0.80, current: 0.78, anomaly: false },
  { hour: '16:00', baseline: 0.85, current: 0.82, anomaly: false },
  { hour: '18:00', baseline: 0.70, current: 0.65, anomaly: false },
  { hour: '20:00', baseline: 0.25, current: 0.20, anomaly: false },
  { hour: '22:45', baseline: 0.08, current: 0.64, anomaly: true }, // Late-night communication anomaly!
];

const anomalyHistoryData = [
  { day: '28 Aug', score: 0.12 },
  { day: '29 Aug', score: 0.18 },
  { day: '30 Aug', score: 0.15 },
  { day: '31 Aug', score: 0.22 },
  { day: '01 Sep', score: 0.64 },
  { day: '02 Sep', score: 0.87 }, // Current peak
  { day: '03 Sep', score: 0.76 },
];

export default function BehaviourAnomalyPage() {
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Behavioural Anomaly &amp; Temporal Deviations
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--error-muted)', color: '#DC2626' }}
            >
              High Deviation Flagged
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Temporal activity modeling comparing established historical circadian baselines against real-time observations
          </p>
        </div>
      </div>

      {/* Hero Anomaly Banner (Section 27 example) */}
      <div
        className="p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, var(--surface-1) 100%)',
          borderColor: 'rgba(239,68,68,0.3)',
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono-id font-bold text-[12px] text-[var(--accent)]">
              PERSON-014 (Aarav Mehta)
            </span>
            <span className="badge badge-critical font-bold">
              ANOMALY DETECTED
            </span>
          </div>
          <h2 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
            Circadian Inversion: Nocturnal Communication Sighting at 03:14 AM
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[12px]">
            <div className="p-2.5 rounded-lg border bg-[var(--surface-1)]" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)]">Typical Baseline Activity</span>
              <div className="font-mono-id font-bold text-[14px] mt-0.5" style={{ color: 'var(--ink-primary)' }}>
                08:00 – 19:00 IST
              </div>
            </div>
            <div className="p-2.5 rounded-lg border bg-[var(--surface-1)]" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] uppercase font-semibold text-[var(--error)]">New Deviant Observation</span>
              <div className="font-mono-id font-bold text-[14px] text-[var(--error)] mt-0.5">
                03:14 AM (Off-hours)
              </div>
            </div>
            <div className="p-2.5 rounded-lg border bg-[var(--surface-1)]" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)]">Statistical Significance</span>
              <div className="font-mono-id font-bold text-[14px] text-[var(--accent)] mt-0.5">
                p &lt; 0.001 (z = 4.2)
              </div>
            </div>
          </div>
        </div>

        {/* Anomaly score callout */}
        <div className="border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-8 text-center md:text-right shrink-0" style={{ borderColor: 'var(--border)' }}>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] block">
            Anomaly Score
          </span>
          <span className="text-[44px] font-black font-mono-id text-[var(--error)] leading-none">
            0.87
          </span>
          <div className="text-[11px] font-semibold text-[var(--error)] mt-1">
            CRITICAL THRESHOLD EXCEEDED
          </div>
        </div>
      </div>

      {/* Interactive Charts: Hourly Deviation and Historical Anomaly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Distribution vs Baseline Chart (8 cols) */}
        <div
          className="lg:col-span-8 p-5 rounded-xl border flex flex-col justify-between"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-semibold" style={{ color: 'var(--ink-primary)' }}>
                Circadian Mobility Probability: Baseline vs Current Observed
              </h3>
              <p className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>
                Blue bars indicate 90-day baseline envelope; Red line highlights unexpected spike at 03:14 AM
              </p>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: 'var(--ink-tertiary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ink-tertiary)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-strong)',
                    fontSize: '12px',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="baseline" fill="#5B5BD6" opacity={0.3} name="Baseline Probability" />
                <Bar dataKey="current" fill="#EF4444" name="Observed Activity" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-4 text-[11px] pt-3 border-t mt-2" style={{ borderColor: 'var(--border)' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#5B5BD6] opacity-40" /> Normal Circadian Profile (08:00 - 19:00)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#EF4444]" /> Nocturnal Anomaly Activity
            </span>
          </div>
        </div>

        {/* 7-Day Anomaly Score Trend (4 cols) */}
        <div
          className="lg:col-span-4 p-5 rounded-xl border flex flex-col justify-between"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="mb-4">
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--ink-primary)' }}>
              7-Day Anomaly Trajectory
            </h3>
            <p className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>
              Evolution of behavioral deviation index
            </p>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anomalyHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--ink-tertiary)' }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: 'var(--ink-tertiary)' }} />
                <ReferenceLine y={0.5} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Warning 0.5', fill: '#F59E0B', fontSize: 10 }} />
                <ReferenceLine y={0.8} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Critical 0.8', fill: '#EF4444', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-strong)',
                    fontSize: '12px',
                    borderRadius: '6px',
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 4, fill: '#EF4444' }} name="Anomaly Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t mt-2 text-[11px] text-[var(--ink-secondary)]" style={{ borderColor: 'var(--border)' }}>
            Elevated deviation trajectory initiated 01-Sep coinciding with increased fund movements in CASE-102.
          </div>
        </div>
      </div>
    </div>
  );
}
