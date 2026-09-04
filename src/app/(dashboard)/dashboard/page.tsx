'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { openInspector } from '@/store/slices/uiSlice';
import {
  FolderOpen, AlertTriangle, CheckCircle2, Network,
  FileCheck, History, Activity, TrendingUp, ArrowRight,
  Shield, MapPin, Package, Clock, ExternalLink, ChevronRight,
  Radio, UserCheck, Flame, Zap
} from 'lucide-react';
import {
  mockCaseService, mockAlertService, mockEvidenceService,
  mockHistoricalService, mockAnalyticsService
} from '@/services/mockServices';
import type { Case, Alert, Evidence, HistoricalCase, HotspotData, CrimeTrendData } from '@/types';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { GlassCard, GlassPanel, GlassMetric } from '@/components/glass';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [recentEvidence, setRecentEvidence] = useState<Evidence[]>([]);
  const [topHotspots, setTopHotspots] = useState<HotspotData[]>([]);
  const [trends, setTrends] = useState<CrimeTrendData[]>([]);
  const [historical, setHistorical] = useState<HistoricalCase[]>([]);

  useEffect(() => {
    mockCaseService.getCases().then((c) => setRecentCases(c.slice(0, 5)));
    mockAlertService.getAlerts().then((a) => setRecentAlerts(a.slice(0, 5)));
    mockEvidenceService.getEvidence().then((e) => setRecentEvidence(e.slice(0, 5)));
    mockAnalyticsService.getHotspots().then((h) => setTopHotspots(h.slice(0, 4)));
    mockAnalyticsService.getCrimeTrends().then((t) => setTrends(t));
    mockHistoricalService.getAllHistorical().then((h) => setHistorical(h.slice(0, 4)));
  }, []);

  const topMetrics = [
    { label: 'Active Cases', value: '128', icon: FolderOpen, change: '+4 this week', href: '/cases' },
    { label: 'Cases Attention', value: '23', icon: AlertTriangle, change: '3 critical', color: 'var(--error)', href: '/cases' },
    { label: 'Verified Claims', value: '64', icon: CheckCircle2, change: '100% indexed', href: '/fir' },
    { label: 'Network Alerts', value: '17', icon: Network, change: '5 high priority', color: 'var(--accent)', href: '/alerts' },
    { label: 'Evidence Reviews', value: '12', icon: FileCheck, change: 'SHA-256 sealed', href: '/evidence' },
    { label: 'Historical Matches', value: '31', icon: History, change: '89% top match', href: '/historical' },
    { label: 'Live Anomalies', value: '9', icon: Activity, change: 'Sentinel active', color: 'var(--warning)', href: '/anomaly' },
  ];

  const topEntities = [
    { id: 'PERSON-014', name: 'Aarav Mehta', role: 'Person of Interest', connections: 15, caseId: 'CASE-102', centrality: '0.48' },
    { id: 'PERSON-021', name: 'Vikram Sharma', role: 'Person of Interest', connections: 12, caseId: 'CASE-102', centrality: '0.42' },
    { id: 'ORG-014', name: 'Nexus Trading Corp', role: 'Shell Company', connections: 14, caseId: 'CASE-102', centrality: '0.45' },
    { id: 'PERSON-010', name: 'Sanjay Gupta', role: 'Suspect', connections: 9, caseId: 'CASE-009', centrality: '0.34' },
    { id: 'ORG-016', name: 'GlobalProp Realty', role: 'Business', connections: 8, caseId: 'CASE-102', centrality: '0.29' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-[1560px] mx-auto">
      {/* Flagship Case Hero Banner */}
      <div
        className="p-5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-panel-elevated"
        style={{
          borderColor: 'var(--accent-subtle)',
        }}
      >
        <div className="flex items-start gap-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: 'var(--accent)', color: '#FFFFFF' }}
          >
            <Shield size={22} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-bold uppercase"
                style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
              >
                FLAGSHIP INVESTIGATION WORKSPACE
              </span>
              <span className="badge badge-critical font-bold text-[10px]">
                PRIORITY: CRITICAL
              </span>
              <span className="text-[11px] font-mono-id text-[var(--ink-tertiary)]">
                Assigned: DCP R. Sharma
              </span>
            </div>
            <h2 className="text-[19px] font-bold tracking-tight mt-1" style={{ color: 'var(--ink-primary)' }}>
              CASE-102: XYZ Network Investigation
            </h2>
            <p className="text-[12px] mt-0.5 max-w-3xl" style={{ color: 'var(--ink-secondary)' }}>
              Multi-jurisdictional money laundering network through shell entities • 11 correlated POIs • ₹4.70 Cr traced fund flow
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/monitoring"
            className="px-3.5 py-2 rounded-xl text-[12.5px] font-semibold border flex items-center gap-1.5 hover:bg-[var(--glass-2)] transition-all glass-panel"
            style={{ borderColor: 'var(--border)', color: 'var(--ink-primary)' }}
          >
            <span className="w-2 h-2 rounded-full bg-[var(--success)] live-pulse-dot" />
            <span>Live Surveillance</span>
          </Link>

          <button
            onClick={() => router.push('/cases/CASE-102')}
            className="px-4 py-2 rounded-xl text-[12.5px] font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            <span>Open Flagship Workspace</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 7 Top Metric Cards in Precision UI Glass */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {topMetrics.map((m) => (
          <GlassMetric
            key={m.label}
            label={m.label}
            value={m.value}
            change={m.change}
            icon={m.icon}
            color={m.color}
            onClick={() => router.push(m.href)}
          />
        ))}
      </div>

      {/* 2-Column Grid: Crime Trends Area Chart & Operational Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Metropolitan Crime Trends Chart (8 cols) */}
        <div
          className="lg:col-span-8 p-5 rounded-2xl border flex flex-col justify-between glass-panel"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[15px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                Metropolitan Crime Trends Analysis
              </h3>
              <p className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>
                Multi-jurisdictional monthly caseload velocity across police commissionerates
              </p>
            </div>
            <Link
              href="/trends"
              className="text-[12px] font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B5BD6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#5B5BD6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRobbery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--ink-tertiary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ink-tertiary)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--glass-3)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--border-strong)',
                    fontSize: '12px',
                    borderRadius: '8px',
                  }}
                />
                <Area type="monotone" dataKey="fraud" stroke="#5B5BD6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFraud)" name="Fraud" />
                <Area type="monotone" dataKey="robbery" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRobbery)" name="Robbery" />
                <Area type="monotone" dataKey="cybercrime" stroke="#10B981" strokeWidth={2} fill="transparent" name="Cybercrime" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-4 text-[11px] pt-2.5 border-t mt-2" style={{ borderColor: 'var(--border)' }}>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#5B5BD6]" /> Fraud (+11%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Robbery (+18%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Cybercrime (+26%)</span>
          </div>
        </div>

        {/* Live Operational Alerts (4 cols) */}
        <div
          className="lg:col-span-4 p-5 rounded-2xl border flex flex-col glass-panel"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[15px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                Critical Operational Alerts
              </h3>
              <p className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>
                Real-time automated flags
              </p>
            </div>
            <Link href="/alerts" className="text-[12px] font-semibold text-[var(--accent)] hover:underline flex items-center gap-0.5">
              <span>View all</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px] pr-1">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => dispatch(openInspector({ id: alert.id, type: 'Alert' }))}
                className="p-3 rounded-xl border text-left cursor-pointer transition-colors hover:border-[var(--accent)] glass-panel"
                style={{
                  background: alert.severity === 'High Priority' ? 'rgba(220,38,38,0.04)' : 'var(--glass-1)',
                  borderColor: alert.severity === 'High Priority' ? 'rgba(220,38,38,0.25)' : 'var(--border)',
                }}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.2 rounded uppercase"
                    style={{
                      background: alert.severity === 'High Priority' ? 'var(--error-muted)' : 'var(--warning-muted)',
                      color: alert.severity === 'High Priority' ? '#DC2626' : '#D97706',
                    }}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-[10px] font-mono-id" style={{ color: 'var(--ink-tertiary)' }}>
                    {alert.date.slice(11, 16)} IST
                  </span>
                </div>
                <h4 className="text-[12.5px] font-bold mt-1 truncate" style={{ color: 'var(--ink-primary)' }}>
                  {alert.title}
                </h4>
                <p className="text-[11px] line-clamp-2 mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
                  {alert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Column Grid: Active Investigations, Top Connected Entities, Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Investigations */}
        <div className="p-5 rounded-2xl border flex flex-col glass-panel" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold" style={{ color: 'var(--ink-primary)' }}>
              Active Investigations
            </h3>
            <Link href="/cases" className="text-[12px] text-[var(--accent)] font-semibold hover:underline flex items-center gap-0.5">
              <span>All Cases</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="space-y-2 flex-1">
            {recentCases.map((c) => (
              <div
                key={c.id}
                onClick={() => router.push(`/cases/${c.id}`)}
                className="p-3 rounded-xl border cursor-pointer hover:border-[var(--accent)] transition-all flex items-center justify-between glass-panel"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono-id font-bold text-[var(--accent)]">
                      {c.id}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--surface-2)] text-[var(--ink-secondary)]">
                      {c.crime}
                    </span>
                  </div>
                  <div className="text-[13px] font-bold truncate mt-0.5" style={{ color: 'var(--ink-primary)' }}>
                    {c.title}
                  </div>
                  <div className="text-[11px] font-mono-id text-[var(--ink-tertiary)]">
                    {c.city} • {c.assignedOfficer}
                  </div>
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap"
                  style={{
                    background: c.priority === 'Critical' ? 'var(--error-muted)' : 'var(--warning-muted)',
                    color: c.priority === 'Critical' ? '#DC2626' : '#B45309',
                  }}
                >
                  {c.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Connected Entities */}
        <div className="p-5 rounded-2xl border flex flex-col glass-panel" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[15px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                Top Network Entities
              </h3>
              <p className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>
                High graph centrality &amp; cluster hubs
              </p>
            </div>
            <Link href="/network" className="text-[12px] text-[var(--accent)] font-semibold hover:underline flex items-center gap-0.5">
              <span>Graph</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="space-y-2 flex-1">
            {topEntities.map((ent) => (
              <div
                key={ent.id}
                onClick={() => dispatch(openInspector({ id: ent.id, type: ent.id.startsWith('PERSON') ? 'Person' : 'Organization' }))}
                className="p-3 rounded-xl border cursor-pointer hover:border-[var(--accent)] transition-all flex items-center justify-between glass-panel"
                style={{ borderColor: 'var(--border)' }}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                      {ent.name}
                    </span>
                    <span className="text-[10px] font-mono-id text-[var(--ink-tertiary)]">
                      {ent.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--ink-secondary)] mt-0.5">
                    {ent.role} • Linked to {ent.caseId}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-mono-id font-bold text-[var(--accent)]">
                    {ent.connections} links
                  </div>
                  <div className="text-[10px] font-mono-id text-[var(--ink-tertiary)]">
                    Score: {ent.centrality}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crime Hotspot Clusters */}
        <div className="p-5 rounded-2xl border flex flex-col glass-panel" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[15px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                Crime Hotspot Clusters
              </h3>
              <p className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>
                Density analysis &amp; FIR concentration
              </p>
            </div>
            <Link href="/hotspots" className="text-[12px] text-[var(--accent)] font-semibold hover:underline flex items-center gap-0.5">
              <span>Heatmap</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="space-y-2 flex-1">
            {topHotspots.map((hs) => (
              <div
                key={hs.id}
                onClick={() => router.push('/hotspots')}
                className="p-3 rounded-xl border cursor-pointer hover:border-[var(--accent)] transition-all flex items-center justify-between glass-panel"
                style={{ borderColor: 'var(--border)' }}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                      {hs.area}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--ink-secondary)' }}>
                      ({hs.city})
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--ink-tertiary)] mt-0.5">
                    {hs.recentFIRs} recent FIRs • Trend: {hs.trend}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded uppercase font-mono-id"
                    style={{
                      background: hs.severity === 'Critical' ? 'var(--error-muted)' : 'var(--warning-muted)',
                      color: hs.severity === 'Critical' ? '#DC2626' : '#B45309',
                    }}
                  >
                    {hs.crimeCount} incidents
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
