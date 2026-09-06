'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { openInspector } from '@/store/slices/uiSlice';
import {
  FolderOpen, AlertTriangle, Network,
  FileCheck, History, Activity, ArrowRight, ChevronRight,
  Shield, Radio, TrendingUp, Zap, Brain, Clock,
  Users, Package, Map, BarChart3, CheckCircle, AlertCircle
} from 'lucide-react';
import {
  mockCaseService, mockAlertService,
  mockHistoricalService, mockAnalyticsService
} from '@/services/mockServices';
import type { Case, Alert, HotspotData, CrimeTrendData } from '@/types';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// Live feed events — realistic investigation activity
const liveFeedData = [
  { time: '15:42', type: 'network', color: '#4F46E5', event: 'New connection detected between PERSON-014 and PERSON-033', case: 'CASE-102', severity: 'high' },
  { time: '15:38', type: 'fir', color: '#16A34A', event: 'FIR processed and entities extracted — 4 persons, 2 vehicles', case: 'CASE-117', severity: 'info' },
  { time: '15:31', type: 'ai', color: '#7C3AED', event: 'AI identified 87% similarity with CASE-2019-042 (historical)', case: 'CASE-102', severity: 'high' },
  { time: '15:24', type: 'evidence', color: '#D97706', event: 'Evidence integrity verified — SHA-256 hash confirmed', case: 'CASE-108', severity: 'info' },
  { time: '15:18', type: 'alert', color: '#DC2626', event: 'Anomaly: Entity PERSON-021 detected at restricted geofence', case: 'CASE-102', severity: 'critical' },
  { time: '15:09', type: 'network', color: '#4F46E5', event: 'ORG-014 linked to 3 additional shell accounts', case: 'CASE-102', severity: 'high' },
  { time: '15:01', type: 'fir', color: '#16A34A', event: 'Citizen complaint CMP-2026-0103 converted to FIR and queued', case: 'CASE-119', severity: 'info' },
  { time: '14:52', type: 'ai', color: '#7C3AED', event: 'Centrality analysis complete — PERSON-014 identified as hub node', case: 'CASE-102', severity: 'high' },
];

const aiInsights = [
  {
    id: 'AI-001',
    title: '3 Hidden Connections Detected',
    body: 'PERSON-014 has indirect links to PERSON-033 through 2 intermediary organizations not previously flagged.',
    confidence: 91,
    caseId: 'CASE-102',
    type: 'network',
  },
  {
    id: 'AI-002',
    title: 'Entity P-104 has High Network Centrality',
    body: 'ORG-014 (Nexus Trading Corp) acts as a financial hub node with 14 connected entities and ₹4.7Cr traced flow.',
    confidence: 87,
    caseId: 'CASE-102',
    type: 'centrality',
  },
  {
    id: 'AI-003',
    title: 'Historical Match: 87% Similarity',
    body: 'Current case pattern closely matches CASE-2019-042 — same crime type, overlapping location cluster, similar MO.',
    confidence: 87,
    caseId: 'CASE-102',
    type: 'historical',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [topHotspots, setTopHotspots] = useState<HotspotData[]>([]);
  const [trends, setTrends] = useState<CrimeTrendData[]>([]);

  useEffect(() => {
    mockCaseService.getCases().then((c) => setRecentCases(c.slice(0, 6)));
    mockAlertService.getAlerts().then((a) => setRecentAlerts(a.slice(0, 4)));
    mockAnalyticsService.getHotspots().then((h) => setTopHotspots(h.slice(0, 3)));
    mockAnalyticsService.getCrimeTrends().then((t) => setTrends(t));
  }, []);

  const topMetrics = [
    { label: 'Active Cases', value: '128', sub: '+4 this week', icon: FolderOpen, href: '/cases', color: 'var(--accent)', bg: 'var(--accent-muted)' },
    { label: 'New FIRs', value: '23', sub: '8 pending review', icon: FileCheck, href: '/fir', color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
    { label: 'Network Alerts', value: '17', sub: '5 high priority', icon: Network, href: '/alerts', color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
    { label: 'High Priority Entities', value: '41', sub: '12 under watch', icon: Users, href: '/cases/CASE-102?tab=entities', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
    { label: 'Historical Matches', value: '31', sub: '89% top match', icon: History, href: '/historical', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
    { label: 'Evidence Reviews', value: '12', sub: 'SHA-256 sealed', icon: Package, href: '/evidence', color: '#0369A1', bg: 'rgba(3,105,161,0.08)' },
    { label: 'Anomalies Detected', value: '9', sub: 'Sentinel active', icon: Activity, href: '/anomaly', color: '#0891B2', bg: 'rgba(8,145,178,0.08)' },
    { label: 'Open Alerts', value: '34', sub: '6 unread', icon: AlertTriangle, href: '/alerts', color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  ];

  const topEntities = [
    { id: 'PERSON-019', name: 'Karan Verma', role: 'Key POI / Operator', connections: 18, caseId: 'CASE-102', centrality: 0.52 },
    { id: 'PERSON-016', name: 'Rahul Thakur', role: 'Key Associate', connections: 12, caseId: 'CASE-102', centrality: 0.44 },
    { id: 'PERSON-015', name: 'Nisha Kapoor', role: 'Person of Interest', connections: 11, caseId: 'CASE-102', centrality: 0.41 },
    { id: 'ORG-014', name: 'Nexus Trading Corp', role: 'Shell Company', connections: 14, caseId: 'CASE-102', centrality: 0.45 },
  ];

  return (
    <div className="space-y-7 animate-fade-in">

      {/* ── Flagship Case Banner ─────────────────────────────── */}
      <div
        className="p-6 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-5"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--accent-subtle)', boxShadow: 'var(--glass-shadow-sm)' }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <Shield size={24} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}>
                Flagship Investigation
              </span>
              <span className="badge badge-critical text-[10px] font-bold">CRITICAL PRIORITY</span>
              <span className="text-[12px] font-mono-id" style={{ color: 'var(--ink-tertiary)' }}>
                Assigned: DCP R. Sharma
              </span>
            </div>
            <h2 className="text-[22px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              CASE-102: Organized Financial Fraud Investigation
            </h2>
            <p className="text-[13.5px] mt-0.5 max-w-2xl" style={{ color: 'var(--ink-secondary)' }}>
              Multi-jurisdictional money laundering network through shell entities • 14 correlated POIs (Karan Verma, Rahul Thakur) • ₹4.70 Cr traced fund flow
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/monitoring"
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold border flex items-center gap-2 hover:bg-[var(--surface-2)] transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--ink-primary)' }}
          >
            <span className="w-2 h-2 rounded-full bg-[var(--success)] live-pulse-dot" />
            Live Feed
          </Link>
          <button
            onClick={() => router.push('/cases/CASE-102')}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white flex items-center gap-2 transition-all hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            Open Workspace
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 8 Metric Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4">
        {topMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.label}
              onClick={() => router.push(m.href)}
              className="p-4 rounded-2xl border text-left hover:-translate-y-0.5 transition-all hover:shadow-md group"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
                style={{ background: m.bg, color: m.color }}>
                <Icon size={18} />
              </div>
              <div className="text-[26px] font-bold leading-none mb-1" style={{ color: m.color }}>{m.value}</div>
              <div className="text-[12px] font-semibold" style={{ color: 'var(--ink-primary)' }}>{m.label}</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--ink-tertiary)' }}>{m.sub}</div>
            </button>
          );
        })}
      </div>

      {/* ── Main Grid: Trends + Live Feed ───────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Crime Trends Chart (8 cols) */}
        <div className="xl:col-span-8 p-6 rounded-2xl border"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[17px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                Metropolitan Crime Trends
              </h3>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
                Monthly caseload across jurisdictions
              </p>
            </div>
            <Link href="/analytics" className="text-[13px] font-semibold text-[var(--accent)] hover:underline flex items-center gap-1">
              Full Analytics <ChevronRight size={14} />
            </Link>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="cFraud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="cRobbery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--ink-tertiary)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--ink-tertiary)' }} />
                <Tooltip contentStyle={{ background: 'var(--surface-1)', border: '1px solid var(--border)', fontSize: '13px', borderRadius: '10px' }} />
                <Area type="monotone" dataKey="fraud" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#cFraud)" name="Fraud" />
                <Area type="monotone" dataKey="robbery" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#cRobbery)" name="Robbery" />
                <Area type="monotone" dataKey="cybercrime" stroke="#10B981" strokeWidth={2} fill="transparent" name="Cybercrime" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-5 text-[12px] pt-3 border-t mt-2" style={{ borderColor: 'var(--border)' }}>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#4F46E5]" /> Fraud (+11%)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#F59E0B]" /> Robbery (+18%)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#10B981]" /> Cybercrime (+26%)</span>
          </div>
        </div>

        {/* Live Investigation Feed (4 cols) */}
        <div className="xl:col-span-4 p-6 rounded-2xl border flex flex-col"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)] live-pulse-dot" />
              <h3 className="text-[17px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                Live Investigation Feed
              </h3>
            </div>
            <Link href="/monitoring" className="text-[12px] font-semibold text-[var(--accent)] hover:underline flex items-center gap-1">
              View all <ChevronRight size={13} />
            </Link>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[340px] pr-1">
            {liveFeedData.map((ev, i) => (
              <div key={i} className="flex gap-3 text-[13px]">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: ev.color }} />
                  {i < liveFeedData.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ background: 'var(--border)' }} />}
                </div>
                <div className="pb-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono-id text-[11px] font-bold" style={{ color: 'var(--ink-tertiary)' }}>{ev.time}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded font-mono-id" style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}>{ev.case}</span>
                  </div>
                  <p className="text-[12.5px] leading-snug" style={{ color: 'var(--ink-primary)' }}>{ev.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Grid: Cases, Entities, AI Insights ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Investigations */}
        <div className="p-6 rounded-2xl border flex flex-col"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold" style={{ color: 'var(--ink-primary)' }}>Active Investigations</h3>
            <Link href="/cases" className="text-[13px] text-[var(--accent)] font-semibold hover:underline flex items-center gap-0.5">
              All Cases <ChevronRight size={13} />
            </Link>
          </div>
          <div className="space-y-2.5 flex-1">
            {recentCases.map((c) => (
              <div
                key={c.id}
                onClick={() => router.push(`/cases/${c.id}`)}
                className="p-3.5 rounded-xl border cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] transition-all"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-mono-id font-bold" style={{ color: 'var(--accent)' }}>{c.id}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded font-medium"
                    style={{
                      background: c.priority === 'Critical' ? 'var(--error-muted)' : 'var(--warning-muted)',
                      color: c.priority === 'Critical' ? '#DC2626' : '#B45309',
                    }}>
                    {c.priority}
                  </span>
                </div>
                <div className="text-[13.5px] font-semibold truncate mt-1" style={{ color: 'var(--ink-primary)' }}>{c.title}</div>
                <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--ink-tertiary)' }}>{c.city} • {c.crime}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Network Entities */}
        <div className="p-6 rounded-2xl border flex flex-col"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-bold" style={{ color: 'var(--ink-primary)' }}>Top Network Entities</h3>
              <p className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>Highest graph centrality</p>
            </div>
            <Link href="/network" className="text-[13px] text-[var(--accent)] font-semibold hover:underline flex items-center gap-0.5">
              Graph <ChevronRight size={13} />
            </Link>
          </div>
          <div className="space-y-3 flex-1">
            {topEntities.map((ent) => (
              <div
                key={ent.id}
                onClick={() => dispatch(openInspector({ id: ent.id, type: ent.id.startsWith('PERSON') ? 'Person' : 'Organization' }))}
                className="p-3.5 rounded-xl border cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] transition-all flex items-center justify-between"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
              >
                <div>
                  <div className="text-[13.5px] font-semibold" style={{ color: 'var(--ink-primary)' }}>{ent.name}</div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>{ent.role} • {ent.caseId}</div>
                </div>
                <div className="text-right">
                  <div className="text-[16px] font-bold font-mono-id" style={{ color: 'var(--accent)' }}>{ent.connections}</div>
                  <div className="text-[10.5px] font-mono-id" style={{ color: 'var(--ink-tertiary)' }}>links</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="p-6 rounded-2xl border flex flex-col"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}>
                <Brain size={15} />
              </div>
              <h3 className="text-[16px] font-bold" style={{ color: 'var(--ink-primary)' }}>AI Insights</h3>
            </div>
            <Link href="/ai" className="text-[13px] text-[var(--accent)] font-semibold hover:underline flex items-center gap-0.5">
              Ask AI <ChevronRight size={13} />
            </Link>
          </div>
          <div className="space-y-3 flex-1">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className="p-4 rounded-xl border"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-[13px] font-bold leading-tight" style={{ color: 'var(--ink-primary)' }}>
                    {insight.title}
                  </h4>
                </div>
                <p className="text-[12px] leading-relaxed mb-2.5" style={{ color: 'var(--ink-secondary)' }}>
                  {insight.body}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-20 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                      <div className="h-full rounded-full" style={{ width: `${insight.confidence}%`, background: '#7C3AED' }} />
                    </div>
                    <span className="text-[11px] font-semibold font-mono-id" style={{ color: '#7C3AED' }}>{insight.confidence}%</span>
                  </div>
                  <span className="text-[10.5px] font-mono-id" style={{ color: 'var(--ink-tertiary)' }}>{insight.caseId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
