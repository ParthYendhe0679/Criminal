'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { openInspector } from '@/store/slices/uiSlice';
import { forensicRecords, contradictions } from '@/mock';
import type { ForensicRecord, Contradiction } from '@/types';
import {
  FlaskConical, Dna, Fingerprint, Crosshair, ShieldAlert,
  Binary, CheckCircle2, AlertTriangle, ArrowRight, Eye, Check,
  X, Filter, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function ForensicsPage() {
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<'forensics' | 'correlation' | 'contradictions'>('forensics');
  const [contraList, setContraList] = useState<Contradiction[]>(contradictions);

  const resolveContradiction = (id: string) => {
    setContraList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Resolved' as const } : c))
    );
    toast.success(`Inconsistency ${id} marked as Resolved by Investigator.`);
  };

  const dismissContradiction = (id: string) => {
    setContraList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Dismissed' as const } : c))
    );
    toast.info(`Inconsistency ${id} dismissed.`);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'DNA': return <Dna size={16} className="text-[#EC4899]" />;
      case 'Fingerprint': return <Fingerprint size={16} className="text-[#3B82F6]" />;
      case 'Ballistics': return <Crosshair size={16} className="text-[#EF4444]" />;
      case 'Toxicology': return <FlaskConical size={16} className="text-[#8B5CF6]" />;
      case 'Digital Forensics': return <Binary size={16} className="text-[#10B981]" />;
      default: return <FlaskConical size={16} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Forensics &amp; Evidence Correlation Engine
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              Lab Link v2.8
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Multi-discipline forensic matching, automated evidentiary contradiction detection, and corroboration matrices
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg border bg-[var(--surface-1)]" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setActiveTab('forensics')}
            className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
            style={{
              background: activeTab === 'forensics' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'forensics' ? '#FFFFFF' : 'var(--ink-secondary)',
            }}
          >
            Forensic Match Laboratory
          </button>
          <button
            onClick={() => setActiveTab('correlation')}
            className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
            style={{
              background: activeTab === 'correlation' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'correlation' ? '#FFFFFF' : 'var(--ink-secondary)',
            }}
          >
            Correlation Workspace
          </button>
          <button
            onClick={() => setActiveTab('contradictions')}
            className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors relative"
            style={{
              background: activeTab === 'contradictions' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'contradictions' ? '#FFFFFF' : 'var(--ink-secondary)',
            }}
          >
            Contradiction Engine
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-[var(--error)] text-white">
              {contraList.filter((c) => c.status === 'Open').length}
            </span>
          </button>
        </div>
      </div>

      {/* VIEW 1: FORENSIC RECORDS */}
      {activeTab === 'forensics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forensicRecords.map((record) => (
            <div
              key={record.id}
              className="p-4 rounded-xl border flex flex-col justify-between hover:border-[var(--accent)] transition-all"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(record.category)}
                    <span className="text-[12px] font-semibold" style={{ color: 'var(--ink-primary)' }}>
                      {record.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-id font-bold text-[var(--accent)]">
                    {record.id}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>Candidate POI:</span>
                  <button
                    onClick={() => dispatch(openInspector({ id: record.candidatePersonId, type: 'Person' }))}
                    className="font-mono-id font-semibold text-[var(--accent)] hover:underline"
                  >
                    {record.candidatePersonId}
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>Match Correlation:</span>
                  <span className="text-[16px] font-mono-id font-bold text-[var(--accent)]">
                    {record.matchPercentage.toFixed(1)}%
                  </span>
                </div>

                <div className="mt-3 p-2.5 rounded-lg border text-[11px] leading-relaxed"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--ink-primary)' }}>
                  {record.details}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px]" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded uppercase"
                  style={{
                    background: record.status.includes('Requires') ? 'var(--warning-muted)' : 'var(--success-muted)',
                    color: record.status.includes('Requires') ? '#D97706' : '#16A34A',
                  }}>
                  {record.status}
                </span>
                <span className="text-[var(--ink-tertiary)]">{record.analyst}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: EVIDENCE CORRELATION WORKSPACE (Section 24) */}
      {activeTab === 'correlation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-[13px]">
            {/* Corroborating */}
            <div className="p-4 rounded-xl border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3 text-[var(--success)] font-semibold text-[12px] uppercase">
                <CheckCircle2 size={15} />
                <span>Corroborating Evidence (4)</span>
              </div>
              <div className="space-y-2 text-[12px]">
                <div className="p-2 rounded border bg-[var(--surface-2)]" style={{ borderColor: 'var(--border)' }}>
                  <div className="font-mono-id font-medium text-[var(--accent)]">EVIDENCE-045 ↔ EVIDENCE-049</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
                    Company directorship matches forensic bank signatory flow.
                  </div>
                </div>
                <div className="p-2 rounded border bg-[var(--surface-2)]" style={{ borderColor: 'var(--border)' }}>
                  <div className="font-mono-id font-medium text-[var(--accent)]">EVIDENCE-047 ↔ EVIDENCE-056</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
                    CCTV entry timestamps coincide with cell tower location pings.
                  </div>
                </div>
              </div>
            </div>

            {/* Potential Conflict */}
            <div className="p-4 rounded-xl border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3 text-[var(--error)] font-semibold text-[12px] uppercase">
                <AlertTriangle size={15} />
                <span>Potential Conflict (2)</span>
              </div>
              <div className="space-y-2 text-[12px]">
                <div className="p-2 rounded border bg-[var(--surface-2)]" style={{ borderColor: 'var(--border)' }}>
                  <div className="font-mono-id font-medium text-[var(--error)]">EVIDENCE-047 vs EVIDENCE-053</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
                    15-minute window travel time conflict between Juhu &amp; Khalapur Toll.
                  </div>
                </div>
              </div>
            </div>

            {/* Missing Evidence */}
            <div className="p-4 rounded-xl border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3 text-[var(--warning)] font-semibold text-[12px] uppercase">
                <AlertCircle size={15} />
                <span>Missing Evidence Gaps (3)</span>
              </div>
              <div className="space-y-2 text-[12px]">
                <div className="p-2 rounded border bg-[var(--surface-2)]" style={{ borderColor: 'var(--border)' }}>
                  <div className="font-medium">Sub-Registrar Versova Deeds</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
                    Original stamp paper for second resale not yet requisitioned.
                  </div>
                </div>
                <div className="p-2 rounded border bg-[var(--surface-2)]" style={{ borderColor: 'var(--border)' }}>
                  <div className="font-medium">Foreign Remittance Invoices</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
                    Cross-border intermediary invoices pending bank reply.
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Consistency */}
            <div className="p-4 rounded-xl border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3 text-[var(--accent)] font-semibold text-[12px] uppercase">
                <Binary size={15} />
                <span>Timeline Consistency (94%)</span>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                18 of 20 timeline milestones are corroboratively anchored by independent digital forensics, bank records, or CCTV footage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CONTRADICTION ENGINE (Section 25) */}
      {activeTab === 'contradictions' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-lg border flex items-center justify-between text-[12px]"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
            <span style={{ color: 'var(--ink-primary)' }}>
              <strong>Automated Cross-Source Conflict Detection:</strong> Compares conflicting timestamps, locations, registrations, and identities between independent evidence sources.
            </span>
            <span className="font-mono-id text-[var(--ink-tertiary)]">Engine v2.1</span>
          </div>

          <div className="space-y-3">
            {contraList.map((contra) => (
              <div
                key={contra.id}
                className="p-5 rounded-xl border space-y-3"
                style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-id font-bold text-[13px] text-[var(--error)]">
                      {contra.id}
                    </span>
                    <span className="font-semibold text-[14px]" style={{ color: 'var(--ink-primary)' }}>
                      {contra.type}
                    </span>
                    <span className="badge badge-critical">{contra.severity} Severity</span>
                  </div>
                  <span className="text-[11px] font-mono-id font-medium uppercase px-2 py-0.5 rounded"
                    style={{
                      background: contra.status === 'Resolved' ? 'var(--success-muted)' : 'var(--warning-muted)',
                      color: contra.status === 'Resolved' ? '#16A34A' : '#B45309',
                    }}>
                    Status: {contra.status}
                  </span>
                </div>

                {/* Source A vs Source B Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
                  {/* SOURCE A */}
                  <div className="p-3 rounded-lg border space-y-1 bg-[var(--surface-2)]" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[11px] uppercase tracking-wider text-[var(--ink-tertiary)]">SOURCE A</span>
                      <span className="font-mono-id text-[var(--accent)]">{contra.sourceA.id} ({contra.sourceA.type})</span>
                    </div>
                    <div className="font-medium text-[13px]" style={{ color: 'var(--ink-primary)' }}>
                      {contra.sourceA.value}
                    </div>
                    <div className="text-[11px] font-mono-id text-[var(--ink-tertiary)]">
                      Recorded: {contra.sourceA.date}
                    </div>
                  </div>

                  {/* SOURCE B */}
                  <div className="p-3 rounded-lg border space-y-1 bg-[var(--surface-2)]" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[11px] uppercase tracking-wider text-[var(--ink-tertiary)]">SOURCE B</span>
                      <span className="font-mono-id text-[var(--accent)]">{contra.sourceB.id} ({contra.sourceB.type})</span>
                    </div>
                    <div className="font-medium text-[13px]" style={{ color: 'var(--ink-primary)' }}>
                      {contra.sourceB.value}
                    </div>
                    <div className="text-[11px] font-mono-id text-[var(--ink-tertiary)]">
                      Recorded: {contra.sourceB.date}
                    </div>
                  </div>
                </div>

                {/* Narrative description */}
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                  {contra.description}
                </p>

                {/* Action buttons */}
                {contra.status === 'Open' && (
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => dismissContradiction(contra.id)}
                      className="px-3 py-1.5 rounded-md text-[12px] font-medium border hover:bg-[var(--surface-2)] transition-colors"
                      style={{ borderColor: 'var(--border)', color: 'var(--ink-secondary)' }}
                    >
                      Dismiss (Acceptable Deviation)
                    </button>
                    <button
                      onClick={() => resolveContradiction(contra.id)}
                      className="px-3 py-1.5 rounded-md text-[12px] font-medium text-white shadow-sm transition-all hover:opacity-90"
                      style={{ background: 'var(--accent)' }}
                    >
                      Mark Reviewed &amp; Resolved
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
