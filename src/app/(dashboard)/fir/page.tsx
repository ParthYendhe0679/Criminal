'use client';

import React, { useState } from 'react';
import { firs } from '@/mock';
import { useAppDispatch } from '@/store/hooks';
import { openInspector } from '@/store/slices/uiSlice';
import {
  FileText, Sparkles, CheckCircle2, RefreshCw, Eye, Shield,
  ArrowRight, User, Car, Phone, MapPin, Building2, Calendar,
  DollarSign, Check, ChevronRight, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const ocrSteps = [
  'Uploading FIR document...',
  'OCR processing high-resolution scan...',
  'Extracting legal and factual text...',
  'Extracting Named Entities (NER)...',
  'Correlating multi-agency relationships...',
  'Analysis Complete',
];

export default function FIRIntelligencePage() {
  const dispatch = useAppDispatch();
  const fir = firs[0]; // FIR-2026-0102 for CASE-102

  const [analyzing, setAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [analysisComplete, setAnalysisComplete] = useState(true); // default true for immediate inspection

  const startAnalysis = () => {
    setAnalyzing(true);
    setAnalysisComplete(false);
    setCurrentStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < ocrSteps.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setAnalyzing(false);
        setAnalysisComplete(true);
        toast.success('FIR analysis completed: 96% OCR confidence, 91% NER extraction');
      }
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              FIR Intelligence &amp; Neural Extraction
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              OCR Engine v4.2
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Automated legal document ingestion, optical character recognition, and entity extraction pipeline
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startAnalysis}
            disabled={analyzing}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-white flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
            style={{ background: 'var(--accent)' }}
          >
            {analyzing ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            <span>{analyzing ? 'Processing Analysis...' : 'Re-Analyze FIR Document'}</span>
          </button>
        </div>
      </div>

      {/* FIR Metadata Header Bar */}
      <div
        className="p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 text-[13px]"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span className="text-[11px] block" style={{ color: 'var(--ink-tertiary)' }}>FIR Number</span>
            <span className="font-mono-id font-bold text-[14px]" style={{ color: 'var(--accent)' }}>
              {fir.id}
            </span>
          </div>
          <div className="border-l pl-4" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[11px] block" style={{ color: 'var(--ink-tertiary)' }}>Case Association</span>
            <span className="font-mono-id font-semibold" style={{ color: 'var(--ink-primary)' }}>
              {fir.caseId}
            </span>
          </div>
          <div className="border-l pl-4" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[11px] block" style={{ color: 'var(--ink-tertiary)' }}>Police Station</span>
            <span className="font-medium" style={{ color: 'var(--ink-primary)' }}>{fir.policeStation}</span>
          </div>
          <div className="border-l pl-4" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[11px] block" style={{ color: 'var(--ink-tertiary)' }}>Crime Category</span>
            <span className="badge badge-active">{fir.crimeType}</span>
          </div>
          <div className="border-l pl-4" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[11px] block" style={{ color: 'var(--ink-tertiary)' }}>Registration Date</span>
            <span className="font-mono-id" style={{ color: 'var(--ink-secondary)' }}>{fir.date}</span>
          </div>
        </div>

        {/* Confidence metrics */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] block" style={{ color: 'var(--ink-tertiary)' }}>OCR Accuracy</span>
            <span className="font-mono-id font-bold text-[13px] text-[var(--success)]">96.4%</span>
          </div>
          <div className="text-right border-l pl-3" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[11px] block" style={{ color: 'var(--ink-tertiary)' }}>NER Confidence</span>
            <span className="font-mono-id font-bold text-[13px] text-[var(--accent)]">91.2%</span>
          </div>
        </div>
      </div>

      {/* Processing Stepper modal/banner if active */}
      {analyzing && (
        <div
          className="p-4 rounded-xl border animate-fade-in"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--accent)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw size={16} className="animate-spin text-[var(--accent)]" />
            <h4 className="text-[14px] font-semibold" style={{ color: 'var(--ink-primary)' }}>
              Optical Character Recognition &amp; Intelligence Ingestion Pipeline
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {ocrSteps.map((step, idx) => {
              const isPast = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;
              return (
                <div
                  key={step}
                  className="p-2.5 rounded-lg border text-[11px] transition-all"
                  style={{
                    background: isCurrent ? 'var(--accent-muted)' : 'var(--surface-2)',
                    borderColor: isCurrent ? 'var(--accent)' : 'var(--border)',
                    color: isCurrent ? 'var(--accent)' : isPast ? 'var(--success)' : 'var(--ink-tertiary)',
                  }}
                >
                  <div className="flex items-center gap-1 font-semibold mb-1">
                    {isPast ? <Check size={12} /> : <span>Step {idx + 1}</span>}
                  </div>
                  <div className="truncate">{step}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3-Column Split Layout: LEFT (Document Preview), CENTER (OCR Text), RIGHT (Extracted Entities) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT: FIR Document Preview (3 cols) */}
        <div
          className="lg:col-span-3 p-4 rounded-xl border flex flex-col"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-tertiary)' }}>
              1. Document Preview
            </h3>
            <span className="text-[10px] font-mono-id px-1.5 py-0.2 rounded bg-[var(--surface-2)]">Scan #0102</span>
          </div>

          <div
            className="flex-1 min-h-[440px] rounded-lg border p-4 flex flex-col justify-between shadow-inner relative overflow-hidden"
            style={{ background: '#FFFDF9', borderColor: '#E4E2DC', color: '#2B2927' }}
          >
            {/* Simulated legal paper header */}
            <div className="border-b pb-2 text-center" style={{ borderColor: '#D0CDC5' }}>
              <div className="text-[10px] uppercase font-serif tracking-widest font-bold">Government of Maharashtra</div>
              <div className="text-[12px] font-serif font-bold mt-0.5">MUMBAI POLICE DEPARTMENT</div>
              <div className="text-[9px] font-serif tracking-tight mt-0.5">CRIMINAL INVESTIGATION RECORD (FIRST INFORMATION REPORT)</div>
            </div>

            {/* Stamp simulation */}
            <div className="absolute right-4 top-14 w-20 h-20 rounded-full border-2 border-red-500/40 rotate-12 flex items-center justify-center text-[9px] text-red-600/50 uppercase font-mono text-center leading-tight pointer-events-none">
              JUHU POLICE<br />RECEIVED<br />15-AUG-2026
            </div>

            <div className="space-y-2 py-4 text-[10px] font-mono opacity-80 leading-relaxed">
              <p>District: Mumbai Suburban | P.S.: Juhu</p>
              <p>FIR No.: 0102/2026 | Date: 15-08-2026</p>
              <p>Complainant: Shri Manoj Tiwari</p>
              <p>Accused: Aarav Mehta &amp; Associates</p>
              <p>IPC: 420, 467, 468, 471 r/w 120(B)</p>
              <p className="border-t pt-2 mt-2" style={{ borderColor: '#E0DDD4' }}>
                Alleged loss: Rs. 4,70,00,000/-
              </p>
            </div>

            <div className="border-t pt-2 flex justify-between items-center text-[9px] font-mono opacity-70" style={{ borderColor: '#D0CDC5' }}>
              <span>Page 1 of 4</span>
              <span>EOW Verified</span>
            </div>
          </div>
        </div>

        {/* CENTER: OCR Text (5 cols) */}
        <div
          className="lg:col-span-5 p-4 rounded-xl border flex flex-col"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-tertiary)' }}>
              2. Digital OCR Text Stream
            </h3>
            <span className="text-[11px] font-mono-id text-[var(--success)] flex items-center gap-1 font-medium">
              <CheckCircle2 size={12} /> OCR Validated
            </span>
          </div>

          <div
            className="flex-1 p-3.5 rounded-lg border font-mono-id text-[12px] whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[440px]"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--ink-primary)' }}
          >
            {fir.ocrText}
          </div>
        </div>

        {/* RIGHT: Extracted Entities (4 cols) */}
        <div
          className="lg:col-span-4 p-4 rounded-xl border flex flex-col"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-tertiary)' }}>
              3. Extracted Named Entities
            </h3>
            <span className="text-[11px] font-mono-id text-[var(--accent)] font-medium">
              {fir.extractedEntities.people.length + fir.extractedEntities.vehicles.length + fir.extractedEntities.organizations.length} entities
            </span>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[440px] pr-1">
            {/* People */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--ink-secondary)] mb-1.5">
                <User size={12} /> People of Interest
              </div>
              <div className="space-y-1">
                {fir.extractedEntities.people.map((p) => (
                  <div
                    key={p.name}
                    onClick={() => dispatch(openInspector({ id: 'PERSON-014', type: 'Person' }))}
                    className="p-2 rounded border flex items-center justify-between text-[12px] cursor-pointer hover:bg-[var(--accent-muted)] transition-colors"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
                  >
                    <div>
                      <span className="font-medium" style={{ color: 'var(--ink-primary)' }}>{p.name}</span>
                      <span className="text-[10px] block" style={{ color: 'var(--ink-tertiary)' }}>{p.role}</span>
                    </div>
                    <span className="text-[10px] font-mono-id font-semibold text-[var(--accent)]">
                      {p.confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizations */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--ink-secondary)] mb-1.5">
                <Building2 size={12} /> Organizations &amp; Shell Companies
              </div>
              <div className="space-y-1">
                {fir.extractedEntities.organizations.map((org) => (
                  <div
                    key={org.name}
                    onClick={() => dispatch(openInspector({ id: 'ORG-014', type: 'Organization' }))}
                    className="p-2 rounded border flex items-center justify-between text-[12px] cursor-pointer hover:bg-[var(--accent-muted)] transition-colors"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
                  >
                    <div>
                      <span className="font-medium" style={{ color: 'var(--ink-primary)' }}>{org.name}</span>
                      <span className="text-[10px] block" style={{ color: 'var(--ink-tertiary)' }}>{org.type}</span>
                    </div>
                    <span className="text-[10px] font-mono-id font-semibold text-[var(--accent)]">
                      {org.confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicles */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--ink-secondary)] mb-1.5">
                <Car size={12} /> Identified Vehicles
              </div>
              <div className="space-y-1">
                {fir.extractedEntities.vehicles.map((v) => (
                  <div
                    key={v.registration}
                    onClick={() => dispatch(openInspector({ id: 'VEHICLE-044', type: 'Vehicle' }))}
                    className="p-2 rounded border flex items-center justify-between text-[12px] cursor-pointer hover:bg-[var(--accent-muted)] transition-colors"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
                  >
                    <div>
                      <span className="font-medium font-mono-id" style={{ color: 'var(--ink-primary)' }}>{v.registration}</span>
                      <span className="text-[10px] block" style={{ color: 'var(--ink-tertiary)' }}>{v.description}</span>
                    </div>
                    <span className="text-[10px] font-mono-id font-semibold text-[var(--accent)]">
                      {v.confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: AI FIR Analysis Panel (Section 15) */}
      <div
        className="p-5 rounded-xl border space-y-4"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--accent)]" />
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--ink-primary)' }}>
              AI FIR Intelligence Assessment &amp; Classification
            </h3>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded font-mono-id bg-[var(--surface-2)] text-[var(--ink-secondary)]">
            Model: KRITAGAS-LegalBERT
          </span>
        </div>

        {/* Incident Summary */}
        <div className="p-3.5 rounded-lg border text-[13px] leading-relaxed"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--ink-primary)' }}>
          <span className="font-semibold block mb-1 text-[11px] uppercase tracking-wider" style={{ color: 'var(--ink-tertiary)' }}>
            Incident Summary
          </span>
          {fir.aiAnalysis.summary}
        </div>

        {/* 4-column AI Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-[12px]">
          {/* Crime Classification */}
          <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
            <h4 className="font-semibold text-[11px] uppercase tracking-wider mb-2" style={{ color: 'var(--ink-tertiary)' }}>
              Crime Classification
            </h4>
            <div className="space-y-1.5">
              {fir.aiAnalysis.crimeClassification.map((cc) => (
                <div key={cc.type} className="flex justify-between items-center">
                  <span style={{ color: 'var(--ink-primary)' }}>{cc.type}</span>
                  <span className="font-mono-id text-[var(--accent)] font-semibold">{cc.confidence}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern Indicators */}
          <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
            <h4 className="font-semibold text-[11px] uppercase tracking-wider mb-2" style={{ color: 'var(--ink-tertiary)' }}>
              Pattern Indicators
            </h4>
            <div className="space-y-1.5">
              {fir.aiAnalysis.patternIndicators.map((pi) => (
                <div key={pi.pattern} className="border-b pb-1 last:border-b-0">
                  <div className="flex justify-between font-medium" style={{ color: 'var(--ink-primary)' }}>
                    <span>{pi.pattern}</span>
                    <span className="font-mono-id text-[var(--warning)]">{pi.confidence}%</span>
                  </div>
                  <div className="text-[10px] line-clamp-1 mt-0.5" style={{ color: 'var(--ink-tertiary)' }}>
                    {pi.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Matches */}
          <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
            <h4 className="font-semibold text-[11px] uppercase tracking-wider mb-2" style={{ color: 'var(--ink-tertiary)' }}>
              Historical Case Similarities
            </h4>
            <div className="space-y-2">
              {fir.aiAnalysis.historicalMatches.map((hm) => (
                <div key={hm.caseId} className="border-b pb-1 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <span className="font-mono-id font-bold text-[var(--accent)]">{hm.caseId}</span>
                    <span className="font-mono-id font-semibold text-[var(--accent)]">{hm.similarity}% match</span>
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
                    {hm.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Potential Relationships */}
          <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
            <h4 className="font-semibold text-[11px] uppercase tracking-wider mb-2" style={{ color: 'var(--ink-tertiary)' }}>
              Potential Relationships
            </h4>
            <div className="space-y-2">
              {fir.aiAnalysis.potentialRelationships.map((pr, i) => (
                <div key={i} className="border-b pb-1 last:border-b-0">
                  <div className="flex justify-between items-center font-medium" style={{ color: 'var(--ink-primary)' }}>
                    <span className="truncate">{pr.entity1} ↔ {pr.entity2}</span>
                    <span className="font-mono-id text-[var(--accent)]">{pr.confidence}%</span>
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
                    {pr.basis}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer on AI analysis */}
        <div className="p-2.5 rounded text-[11px] border flex items-center gap-2"
          style={{ background: 'var(--warning-muted)', borderColor: 'rgba(245,158,11,0.2)', color: '#B45309' }}>
          <AlertCircle size={14} className="shrink-0" />
          <span>
            Automated intelligence lead. The above patterns and relationships represent statistical extraction confidence and investigative leads; judicial review and officer verification required.
          </span>
        </div>
      </div>
    </div>
  );
}
