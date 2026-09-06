'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { crimeTrendData, hotspotData, predictiveData } from '@/mock';
import type { HotspotData } from '@/types';
import {
  BarChart3, MapPin, BrainCircuit, TrendingUp, TrendingDown,
  ChevronRight, Flame, AlertTriangle, Shield, Minus
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

type TabKey = 'trends' | 'hotspots' | 'patterns';

const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { key: 'trends', label: 'Crime Trends', icon: BarChart3 },
  { key: 'hotspots', label: 'Crime Hotspots', icon: Flame },
  { key: 'patterns', label: 'Emerging Patterns', icon: BrainCircuit },
];

const growthMetrics = [
  { crime: 'Robbery', change: '+18%', direction: 'up', color: '#DC2626' },
  { crime: 'Fraud / Cheating', change: '+11%', direction: 'up', color: '#D97706' },
  { crime: 'Cybercrime', change: '+26%', direction: 'up', color: '#7C3AED' },
  { crime: 'Vehicle Theft', change: '-4%', direction: 'down', color: '#16A34A' },
  { crime: 'Extortion', change: '+2%', direction: 'up', color: '#B45309' },
];

const categoryDistribution = [
  { name: 'Fraud / PMLA', value: 38, color: '#4F46E5' },
  { name: 'Robbery', value: 24, color: '#F59E0B' },
  { name: 'Cybercrime', value: 18, color: '#10B981' },
  { name: 'Vehicle Theft', value: 12, color: '#EC4899' },
  { name: 'Others', value: 8, color: '#6B7280' },
];

const peakHoursData = [
  { hour: '00-04', incidents: 14 },
  { hour: '04-08', incidents: 8 },
  { hour: '08-12', incidents: 38 },
  { hour: '12-16', incidents: 42 },
  { hour: '16-20', incidents: 68 },
  { hour: '20-24', incidents: 54 },
];

const cityData = [
  { city: 'Delhi', count: 168 },
  { city: 'Mumbai', count: 142 },
  { city: 'Bengaluru', count: 86 },
  { city: 'Pune', count: 74 },
  { city: 'Hyderabad', count: 62 },
  { city: 'Kolkata', count: 58 },
];

const severityColor: Record<string, string> = {
  Critical: '#DC2626',
  High: '#D97706',
  Medium: '#2563EB',
  Low: '#16A34A',
};

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as TabKey | null;
  const [activeTab, setActiveTab] = useState<TabKey>(
    tabParam && ['trends', 'hotspots', 'patterns'].includes(tabParam) ? tabParam : 'trends'
  );
  const [selectedState, setSelectedState] = useState('all');
  const [selectedArea, setSelectedArea] = useState<HotspotData | null>(hotspotData[0] || null);

  const filteredHotspots = hotspotData.filter((h) => selectedState === 'all' || h.state === selectedState);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
            Analytics Hub
          </h1>
          <p className="text-[14px] mt-1" style={{ color: 'var(--ink-secondary)' }}>
            Crime trends, geographic hotspots, and emerging pattern intelligence
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium border"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--ink-secondary)' }}>
          <Shield size={13} />
          Synthetic data — research use only
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 p-1 rounded-xl border w-fit" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all"
              style={{
                background: isActive ? 'var(--surface-1)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--ink-secondary)',
                boxShadow: isActive ? 'var(--glass-shadow-sm)' : 'none',
              }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Crime Trends Tab ─────────────────────────────────── */}
      {activeTab === 'trends' && (
        <div className="space-y-6 animate-fade-in">
          {/* YoY Growth Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {growthMetrics.map((m) => (
              <div key={m.crime} className="p-5 rounded-2xl border text-center"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
                <div className="text-[24px] font-bold font-mono-id mb-1" style={{ color: m.color }}>{m.change}</div>
                <div className="text-[12.5px] font-medium" style={{ color: 'var(--ink-secondary)' }}>{m.crime}</div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--ink-tertiary)' }}>YoY change</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Monthly Trend Line */}
            <div className="lg:col-span-8 p-6 rounded-2xl border"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <h3 className="text-[16px] font-bold mb-4" style={{ color: 'var(--ink-primary)' }}>Monthly FIR Volume Trends</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crimeTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--ink-tertiary)' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--ink-tertiary)' }} />
                    <Tooltip contentStyle={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="fraud" stroke="#4F46E5" strokeWidth={2.5} dot={false} name="Fraud" />
                    <Line type="monotone" dataKey="robbery" stroke="#F59E0B" strokeWidth={2.5} dot={false} name="Robbery" />
                    <Line type="monotone" dataKey="cybercrime" stroke="#10B981" strokeWidth={2} dot={false} name="Cybercrime" />
                    <Line type="monotone" dataKey="kidnapping" stroke="#EC4899" strokeWidth={2} dot={false} name="Kidnapping" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category distribution */}
            <div className="lg:col-span-4 p-6 rounded-2xl border"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <h3 className="text-[16px] font-bold mb-4" style={{ color: 'var(--ink-primary)' }}>Crime Type Distribution</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {categoryDistribution.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-[12.5px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span style={{ color: 'var(--ink-secondary)' }}>{d.name}</span>
                    </div>
                    <span className="font-semibold font-mono-id" style={{ color: 'var(--ink-primary)' }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Peak hours and city breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <h3 className="text-[16px] font-bold mb-4" style={{ color: 'var(--ink-primary)' }}>Peak Crime Hours</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHoursData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="hour" tick={{ fontSize: 12, fill: 'var(--ink-tertiary)' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--ink-tertiary)' }} />
                    <Tooltip contentStyle={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px' }} />
                    <Bar dataKey="incidents" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Incidents" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="p-6 rounded-2xl border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <h3 className="text-[16px] font-bold mb-4" style={{ color: 'var(--ink-primary)' }}>City-wise FIR Count</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityData} layout="vertical" margin={{ top: 0, right: 10, left: 30, bottom: 0 }}>
                    <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--ink-tertiary)' }} />
                    <YAxis type="category" dataKey="city" tick={{ fontSize: 12, fill: 'var(--ink-tertiary)' }} />
                    <Tooltip contentStyle={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px' }} />
                    <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]} name="FIRs" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Crime Hotspots Tab ───────────────────────────────── */}
      {activeTab === 'hotspots' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl border"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            <span className="text-[13px] font-semibold" style={{ color: 'var(--ink-primary)' }}>Jurisdiction:</span>
            <span className="text-[13px] font-bold" style={{ color: 'var(--accent)' }}>India</span>
            <ChevronRight size={14} style={{ color: 'var(--ink-tertiary)' }} />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="h-9 px-3 rounded-lg border text-[13px] bg-[var(--surface-2)] outline-none"
              style={{ borderColor: 'var(--border)', color: 'var(--ink-primary)' }}
            >
              <option value="all">All States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hotspot list */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-[15px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                Top Hotspot Areas ({filteredHotspots.length})
              </h3>
              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {filteredHotspots.map((hs) => (
                  <div
                    key={hs.id}
                    onClick={() => setSelectedArea(hs)}
                    className="p-4 rounded-xl border cursor-pointer transition-all"
                    style={{
                      background: selectedArea?.id === hs.id ? 'var(--accent-muted)' : 'var(--surface-1)',
                      borderColor: selectedArea?.id === hs.id ? 'var(--accent-subtle)' : 'var(--border)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[14px] font-bold" style={{ color: 'var(--ink-primary)' }}>{hs.area}</div>
                        <div className="text-[12px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>{hs.city}, {hs.state}</div>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-1 rounded-lg"
                        style={{
                          background: `${severityColor[hs.severity] ?? '#6B7280'}18`,
                          color: severityColor[hs.severity] ?? '#6B7280',
                        }}>
                        {hs.severity}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-2 text-[12px]" style={{ color: 'var(--ink-tertiary)' }}>
                      <span>{hs.crimeCount} total</span>
                      <span>•</span>
                      <span>{hs.recentFIRs} recent FIRs</span>
                      <span>•</span>
                      <span>{hs.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Panel */}
            {selectedArea && (
              <div className="lg:col-span-2 p-6 rounded-2xl border"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-[20px] font-bold" style={{ color: 'var(--ink-primary)' }}>{selectedArea.area}</h3>
                    <p className="text-[13px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
                      {selectedArea.city}, {selectedArea.state} • {selectedArea.coordinates[0]}°N, {selectedArea.coordinates[1]}°E
                    </p>
                  </div>
                  <span className="text-[12px] font-bold px-3 py-1.5 rounded-xl"
                    style={{
                      background: `${severityColor[selectedArea.severity] ?? '#6B7280'}18`,
                      color: severityColor[selectedArea.severity] ?? '#6B7280',
                    }}>
                    {selectedArea.severity} Risk
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { label: 'Total Incidents', value: selectedArea.crimeCount },
                    { label: 'Recent FIRs', value: selectedArea.recentFIRs },
                    { label: 'Trend', value: selectedArea.trend },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl border text-center"
                      style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                      <div className="text-[22px] font-bold font-mono-id" style={{ color: 'var(--accent)' }}>{stat.value}</div>
                      <div className="text-[12px] mt-1" style={{ color: 'var(--ink-secondary)' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="text-[13px] font-bold mb-3" style={{ color: 'var(--ink-primary)' }}>Common Crime Types</h4>
                  <div className="space-y-2">
                    {selectedArea.crimeTypes.map((ct, i) => (
                      <div key={i} className="flex items-center justify-between text-[13px]">
                        <span style={{ color: 'var(--ink-secondary)' }}>{ct.type}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 rounded-full w-24 overflow-hidden" style={{ background: 'var(--border)' }}>
                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, ct.count * 4)}%`, background: 'var(--accent)' }} />
                          </div>
                          <span className="text-[11px] font-mono-id w-14 text-right" style={{ color: 'var(--ink-tertiary)' }}>{ct.count} cases</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Emerging Patterns Tab ───────────────────────────── */}
      {activeTab === 'patterns' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-xl border flex items-center gap-3 text-[13px]"
            style={{ background: 'rgba(79,70,229,0.06)', borderColor: 'var(--accent-subtle)' }}>
            <Shield size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <p style={{ color: 'var(--ink-primary)' }}>
              <strong>Ethical AI Notice:</strong> KRITAGAS identifies spatial and temporal crime patterns — not individual criminality.
              All outputs recommend investigator review before action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {predictiveData.map((pred, i) => {
              const isUp = pred.trend === 'Increasing';
              const isDown = pred.trend === 'Decreasing';
              const riskPct = Math.round(pred.probability * 100);
              return (
                <div key={i} className="p-5 rounded-2xl border"
                  style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide"
                      style={{
                        background: isUp ? 'var(--error-muted)' : isDown ? 'var(--success-muted)' : 'var(--surface-2)',
                        color: isUp ? '#DC2626' : isDown ? '#16A34A' : 'var(--ink-tertiary)',
                      }}>
                      {isUp ? '↑ Increasing' : isDown ? '↓ Decreasing' : '→ Stable'}
                    </span>
                    <span className="text-[12px] font-semibold font-mono-id" style={{ color: 'var(--accent)' }}>
                      {riskPct}% risk
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold mb-1" style={{ color: 'var(--ink-primary)' }}>{pred.area}, {pred.city}</h3>
                  <p className="text-[12px] mb-2 font-medium" style={{ color: 'var(--ink-secondary)' }}>
                    {pred.crimeType} • <span className="font-mono-id text-[11px]" style={{ color: 'var(--ink-tertiary)' }}>Peak: {pred.peakPeriod}</span>
                  </p>
                  <p className="text-[12px] leading-relaxed mb-3" style={{ color: 'var(--ink-secondary)' }}>
                    {pred.recommendation}
                  </p>
                  <div className="mt-3 pt-3 border-t text-[11.5px] font-semibold"
                    style={{ borderColor: 'var(--border)', color: 'var(--warning)' }}>
                    ⚠ Investigator review recommended
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[14px]" style={{ color: 'var(--ink-secondary)' }}>Loading Analytics Hub...</div>}>
      <AnalyticsContent />
    </Suspense>
  );
}

