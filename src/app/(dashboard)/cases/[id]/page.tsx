'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { openInspector } from '@/store/slices/uiSlice';
import { mockCaseService } from '@/services/mockServices';
import type { Case } from '@/types';
import {
  people, vehicles, phones, locations, organizations,
  evidence, alerts, timelineEvents, historicalCases, transactions, firs, forensicRecords
} from '@/mock';
import {
  FolderOpen, User, Car, Phone as PhoneIcon, MapPin, Building2,
  Package, Network, Map, History, Clock, Bell, Bot, FileText,
  DollarSign, ArrowLeft, Shield, AlertTriangle, CheckCircle2,
  Calendar, Eye, ExternalLink, FileCheck, Radio, Activity,
  Play, FlaskConical, AlertOctagon, FileStack
} from 'lucide-react';
import Link from 'next/link';
import { GlassPanel, GlassCard } from '@/components/glass';

type TabKey =
  | 'overview'
  | 'fir'
  | 'people'
  | 'vehicles'
  | 'phones'
  | 'transactions'
  | 'locations'
  | 'documents'
  | 'evidence'
  | 'forensics'
  | 'network'
  | 'map'
  | 'historical'
  | 'sentinel'
  | 'monitoring'
  | 'anomaly'
  | 'timeline'
  | 'replay'
  | 'alerts'
  | 'ai';

export default function CaseDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const caseId = (params.id as string) || 'CASE-102';
  const initialTab = (searchParams.get('tab') as TabKey) || 'overview';

  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockCaseService.getCase(caseId).then((c) => {
      if (c) {
        setCurrentCase(c);
      } else {
        mockCaseService.getCase('CASE-102').then((f) => setCurrentCase(f || null));
      }
      setLoading(false);
    });
  }, [caseId]);

  if (loading || !currentCase) {
    return (
      <div className="py-20 text-center text-[var(--ink-tertiary)] animate-pulse">
        Loading investigation workspace for {caseId}...
      </div>
    );
  }

  // Linked data for this case
  const casePeople = people.filter((p) => p.caseIds.includes(currentCase.id));
  const caseVehicles = vehicles.filter((v) => v.caseIds.includes(currentCase.id));
  const casePhones = phones.filter((ph) => ph.caseIds.includes(currentCase.id));
  const caseLocations = locations.filter((l) => l.caseIds.includes(currentCase.id));
  const caseOrgs = organizations.filter((o) => o.caseIds.includes(currentCase.id));
  const caseEvidence = evidence.filter((e) => e.caseId === currentCase.id);
  const caseAlerts = alerts.filter((a) => a.caseId === currentCase.id);
  const caseTimeline = timelineEvents.filter((t) => t.caseId === currentCase.id);
  const caseTransactions = transactions.filter((t) => t.caseId === currentCase.id);
  const caseFIR = firs.find((f) => f.caseId === currentCase.id) || firs[0];
  const caseForensics = forensicRecords.filter((fr) => fr.caseId === currentCase.id);

  // All 20 Tabs
  const tabs: { key: TabKey; label: string; count?: number; icon: any }[] = [
    { key: 'overview', label: 'Overview', icon: FolderOpen },
    { key: 'fir', label: 'FIR', count: 1, icon: FileText },
    { key: 'people', label: 'People', count: casePeople.length, icon: User },
    { key: 'vehicles', label: 'Vehicles', count: caseVehicles.length, icon: Car },
    { key: 'phones', label: 'Phones', count: casePhones.length, icon: PhoneIcon },
    { key: 'transactions', label: 'Transactions', count: caseTransactions.length, icon: DollarSign },
    { key: 'locations', label: 'Locations', count: caseLocations.length, icon: MapPin },
    { key: 'documents', label: 'Documents', count: 4, icon: FileStack },
    { key: 'evidence', label: 'Evidence', count: caseEvidence.length, icon: Package },
    { key: 'forensics', label: 'Forensics', count: caseForensics.length, icon: FlaskConical },
    { key: 'network', label: 'Network', icon: Network },
    { key: 'map', label: 'Map', icon: Map },
    { key: 'historical', label: 'Historical', count: 3, icon: History },
    { key: 'sentinel', label: 'Sentinel', icon: Eye },
    { key: 'monitoring', label: 'Live Stream', icon: Radio },
    { key: 'anomaly', label: 'Anomaly', icon: Activity },
    { key: 'timeline', label: 'Timeline', count: caseTimeline.length, icon: Clock },
    { key: 'replay', label: 'Replay', icon: Play },
    { key: 'alerts', label: 'Alerts', count: caseAlerts.length, icon: Bell },
    { key: 'ai', label: 'AI Query', icon: Bot },
  ];

  return (
    <div className="space-y-4 animate-fade-in max-w-[1560px] mx-auto">
      {/* Back link */}
      <div className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--ink-tertiary)' }}>
        <button
          onClick={() => router.push('/cases')}
          className="flex items-center gap-1 hover:text-[var(--ink-primary)] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Cases</span>
        </button>
        <span>/</span>
        <span className="font-mono-id" style={{ color: 'var(--ink-secondary)' }}>{currentCase.id}</span>
      </div>

      {/* Case Header Hero Banner */}
      <div
        className="p-5 rounded-2xl border glass-panel-elevated"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-mono-id font-bold px-2 py-0.5 rounded-lg"
                style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}>
                {currentCase.id}
              </span>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded uppercase"
                style={{
                  background: currentCase.priority === 'Critical' ? 'var(--error-muted)' : 'var(--warning-muted)',
                  color: currentCase.priority === 'Critical' ? '#DC2626' : '#B45309',
                }}
              >
                {currentCase.priority} Priority
              </span>
              <span className="badge badge-active">{currentCase.status}</span>
              <span className="text-[12px] px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--ink-secondary)]">
                {currentCase.crime}
              </span>
            </div>

            <h1 className="text-[22px] font-bold tracking-tight mt-1.5" style={{ color: 'var(--ink-primary)' }}>
              {currentCase.title}
            </h1>
            <p className="text-[13px] mt-1 max-w-4xl leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
              {currentCase.description}
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 text-[12px] pt-2 lg:pt-0 lg:border-l lg:pl-6" style={{ borderColor: 'var(--border)' }}>
            <div>
              <span style={{ color: 'var(--ink-tertiary)' }}>Assigned Officer: </span>
              <span className="font-semibold" style={{ color: 'var(--ink-primary)' }}>{currentCase.assignedOfficer}</span>
            </div>
            <div>
              <span style={{ color: 'var(--ink-tertiary)' }}>Location: </span>
              <span className="font-medium" style={{ color: 'var(--ink-primary)' }}>{currentCase.location}</span>
            </div>
            <div>
              <span style={{ color: 'var(--ink-tertiary)' }}>Date Opened: </span>
              <span className="font-mono-id" style={{ color: 'var(--ink-secondary)' }}>{currentCase.created}</span>
            </div>
            <div>
              <span style={{ color: 'var(--ink-tertiary)' }}>Last Activity: </span>
              <span className="font-mono-id font-bold text-[var(--accent)]">{currentCase.lastActivity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Glass Navigation Tabs Bar */}
      <div
        className="flex items-center gap-1 overflow-x-auto pb-1 border-b text-[12px] font-medium"
        style={{ borderColor: 'var(--border)' }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-all whitespace-nowrap"
              style={{
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                color: isActive ? 'var(--accent)' : 'var(--ink-secondary)',
                background: isActive ? 'var(--glass-2)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className="text-[10px] font-mono-id px-1.5 py-0.2 rounded-full"
                  style={{
                    background: isActive ? 'var(--accent)' : 'var(--surface-2)',
                    color: isActive ? '#FFFFFF' : 'var(--ink-tertiary)',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Panes */}
      <div className="pt-2">
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 rounded-2xl border glass-panel" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-[14px] font-bold mb-3" style={{ color: 'var(--ink-primary)' }}>
                  Primary Suspects &amp; Connected Persons ({casePeople.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {casePeople.slice(0, 6).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => dispatch(openInspector({ id: p.id, type: 'Person' }))}
                      className="p-3 rounded-xl border cursor-pointer hover:border-[var(--accent)] transition-all flex items-center justify-between glass-panel"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] text-white" style={{ background: 'var(--accent)' }}>
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[13px]" style={{ color: 'var(--ink-primary)' }}>{p.name}</div>
                          <div className="text-[11px] font-mono-id text-[var(--ink-tertiary)]">{p.id} • {p.role}</div>
                        </div>
                      </div>
                      <Eye size={14} className="text-[var(--ink-tertiary)]" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl border glass-panel" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-[14px] font-bold mb-3" style={{ color: 'var(--ink-primary)' }}>
                  Affiliated Corporate Entities ({caseOrgs.length})
                </h3>
                <div className="space-y-2">
                  {caseOrgs.map((org) => (
                    <div
                      key={org.id}
                      onClick={() => dispatch(openInspector({ id: org.id, type: 'Organization' }))}
                      className="p-3 rounded-xl border cursor-pointer hover:border-[var(--accent)] transition-all flex items-center justify-between glass-panel"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div>
                        <div className="font-bold text-[13px]" style={{ color: 'var(--ink-primary)' }}>{org.name}</div>
                        <div className="text-[11px] font-mono-id text-[var(--ink-tertiary)]">
                          {org.id} • {org.type} • Reg: {org.registrationNumber}
                        </div>
                      </div>
                      <span className="badge badge-review">{org.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions & Replay */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border glass-panel space-y-3" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-[14px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                  Workspace Intelligence Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/monitoring')}
                    className="w-full py-2.5 rounded-xl text-[12.5px] font-semibold border flex items-center justify-center gap-1.5 hover:bg-[var(--glass-2)] transition-all glass-panel"
                    style={{ borderColor: 'var(--border)', color: 'var(--ink-primary)' }}
                  >
                    <Radio size={14} className="text-[var(--success)]" />
                    <span>Open Live Surveillance Stream</span>
                  </button>
                  <button
                    onClick={() => router.push('/replay')}
                    className="w-full py-2.5 rounded-xl text-[12.5px] font-semibold border flex items-center justify-center gap-1.5 hover:bg-[var(--glass-2)] transition-all glass-panel"
                    style={{ borderColor: 'var(--border)', color: 'var(--ink-primary)' }}
                  >
                    <Play size={14} className="text-[var(--accent)]" />
                    <span>Launch Synchronized Replay</span>
                  </button>
                  <button
                    onClick={() => router.push('/network')}
                    className="w-full py-2.5 rounded-xl text-[12.5px] font-semibold text-white shadow-sm flex items-center justify-center gap-1.5 hover:opacity-90 transition-all"
                    style={{ background: 'var(--accent)' }}
                  >
                    <Network size={14} />
                    <span>Trace Case in Network Graph</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: FIR */}
        {activeTab === 'fir' && (
          <div className="p-5 rounded-2xl border space-y-4 glass-panel" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                  {caseFIR.id} • {caseFIR.policeStation}
                </h3>
                <p className="text-[12px] text-[var(--ink-secondary)]">
                  Filing Date: {caseFIR.date} • Complainant: {caseFIR.complainant}
                </p>
              </div>
              <Link
                href="/fir"
                className="px-3.5 py-1.5 rounded-lg text-[12px] font-semibold border flex items-center gap-1.5 hover:bg-[var(--glass-2)] text-[var(--accent)]"
                style={{ borderColor: 'var(--border)' }}
              >
                <span>Full OCR Workspace</span>
                <ExternalLink size={13} />
              </Link>
            </div>
            <div className="p-4 rounded-xl border font-mono-id text-[12px] whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto glass-panel"
              style={{ borderColor: 'var(--border)', color: 'var(--ink-primary)' }}>
              {caseFIR.ocrText}
            </div>
          </div>
        )}

        {/* TAB: PEOPLE */}
        {activeTab === 'people' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {casePeople.map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/people/${p.id}`)}
                className="p-4 rounded-2xl border cursor-pointer hover:border-[var(--accent)] transition-all flex flex-col justify-between glass-panel"
                style={{ borderColor: 'var(--border)' }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono-id font-bold text-[var(--accent)]">{p.id}</span>
                    <span className="badge badge-investigation">{p.role}</span>
                  </div>
                  <h4 className="text-[15px] font-bold mt-1" style={{ color: 'var(--ink-primary)' }}>{p.name}</h4>
                  <p className="text-[12px] text-[var(--ink-secondary)] mt-0.5">{p.occupation} • Age {p.age}</p>
                </div>
                <div className="mt-3 pt-2 border-t flex items-center justify-between text-[11px] font-mono-id" style={{ borderColor: 'var(--border)' }}>
                  <span>{p.phone}</span>
                  <span className="text-[var(--accent)] font-semibold">View History Profile →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: VEHICLES */}
        {activeTab === 'vehicles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {caseVehicles.map((v) => (
              <div
                key={v.id}
                onClick={() => dispatch(openInspector({ id: v.id, type: 'Vehicle' }))}
                className="p-4 rounded-2xl border cursor-pointer hover:border-[var(--accent)] transition-all glass-panel"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono-id font-bold text-[var(--accent)]">{v.id}</span>
                  <span className="badge badge-medium">{v.type}</span>
                </div>
                <h4 className="text-[15px] font-bold mt-1 font-mono-id" style={{ color: 'var(--ink-primary)' }}>
                  {v.registrationNumber}
                </h4>
                <p className="text-[12px] text-[var(--ink-secondary)] mt-0.5">
                  {v.make} {v.model} • Color: {v.color}
                </p>
                <div className="mt-3 pt-2 border-t text-[11px] font-mono-id" style={{ borderColor: 'var(--border)', color: 'var(--ink-tertiary)' }}>
                  Owner POI: {v.ownerPersonId} • {v.observations.length} ANPR passes
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: FORENSICS */}
        {activeTab === 'forensics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseForensics.map((fr) => (
              <div key={fr.id} className="p-4 rounded-2xl border space-y-2 glass-panel" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-mono-id font-bold text-[13px] text-[var(--accent)]">{fr.id} ({fr.category})</span>
                  <span className="font-mono-id font-bold text-[14px] text-[var(--accent)]">{fr.matchPercentage}% match</span>
                </div>
                <p className="text-[13px]" style={{ color: 'var(--ink-primary)' }}>{fr.details}</p>
                <div className="text-[11px] font-semibold text-[var(--warning)]">{fr.status}</div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Nexus_Registration_ROC.pdf', 'Juhu_Tara_Deed_Transfer.pdf', 'Axis_Bank_Forensic_Statement.pdf', 'Seizure_Memo_Digital_Devices.pdf'].map((doc) => (
              <div key={doc} className="p-4 rounded-2xl border flex items-center justify-between glass-panel" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2.5">
                  <FileText size={16} className="text-[var(--accent)]" />
                  <span className="font-mono-id font-semibold text-[13px]">{doc}</span>
                </div>
                <span className="badge badge-active">Verified Ingested</span>
              </div>
            ))}
          </div>
        )}

        {/* TAB: LIVE MONITORING */}
        {activeTab === 'monitoring' && (
          <div className="p-8 rounded-2xl border text-center space-y-3 glass-panel" style={{ borderColor: 'var(--border)' }}>
            <Radio size={36} className="mx-auto text-[var(--success)]" />
            <h3 className="text-[16px] font-bold" style={{ color: 'var(--ink-primary)' }}>
              Live Target Surveillance Stream
            </h3>
            <p className="text-[13px] max-w-md mx-auto text-[var(--ink-secondary)]">
              Watch real-time synthetic CCTV detections, ANPR toll sightings, and circadian anomalies for entities in {currentCase.id}.
            </p>
            <button
              onClick={() => router.push('/monitoring')}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white shadow-sm hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Launch Live Monitoring Console
            </button>
          </div>
        )}

        {/* TAB: SENTINEL */}
        {activeTab === 'sentinel' && (
          <div className="p-8 rounded-2xl border text-center space-y-3 glass-panel" style={{ borderColor: 'var(--border)' }}>
            <Eye size={36} className="mx-auto text-[var(--accent)]" />
            <h3 className="text-[16px] font-bold" style={{ color: 'var(--ink-primary)' }}>
              Sentinel Subject Behavioral Baseline
            </h3>
            <p className="text-[13px] max-w-md mx-auto text-[var(--ink-secondary)]">
              Inspect established 90-day circadian envelopes, geofences, and departure deviations for primary POI PERSON-014.
            </p>
            <button
              onClick={() => router.push('/sentinel')}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white shadow-sm hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Open Sentinel Console
            </button>
          </div>
        )}

        {/* TAB: REPLAY */}
        {activeTab === 'replay' && (
          <div className="p-8 rounded-2xl border text-center space-y-3 glass-panel" style={{ borderColor: 'var(--border)' }}>
            <Play size={36} className="mx-auto text-[var(--accent)]" />
            <h3 className="text-[16px] font-bold" style={{ color: 'var(--ink-primary)' }}>
              Investigation Replay Engine
            </h3>
            <p className="text-[13px] max-w-md mx-auto text-[var(--ink-secondary)]">
              Synchronize timeline progression across network nodes, map markers, and evidence intake.
            </p>
            <button
              onClick={() => router.push('/replay')}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white shadow-sm hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Launch Replay Engine
            </button>
          </div>
        )}

        {/* TAB: AI */}
        {activeTab === 'ai' && (
          <div className="p-8 rounded-2xl border text-center space-y-3 glass-panel" style={{ borderColor: 'var(--border)' }}>
            <Bot size={36} className="mx-auto text-[var(--accent)]" />
            <h3 className="text-[16px] font-bold" style={{ color: 'var(--ink-primary)' }}>
              Ask KRITAGAS AI about {currentCase.id}
            </h3>
            <button
              onClick={() => router.push('/ai')}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white shadow-sm hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Open AI Assistant
            </button>
          </div>
        )}

        {/* Fallback for other tabs */}
        {!['overview', 'fir', 'people', 'vehicles', 'forensics', 'documents', 'monitoring', 'sentinel', 'replay', 'ai'].includes(activeTab) && (
          <div className="p-6 rounded-2xl border glass-panel" style={{ borderColor: 'var(--border)' }}>
            <h4 className="text-[14px] font-bold capitalize mb-2">{activeTab} Records for {currentCase.id}</h4>
            <p className="text-[12px] text-[var(--ink-secondary)]">
              Correlated intelligence records actively indexed and synchronized into case dossier.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
