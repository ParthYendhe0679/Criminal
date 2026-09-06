'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateComplaintStatus } from '@/store/slices/citizenPortalSlice';
import type { ComplaintStatus } from '@/types';
import {
  CheckCircle2, XCircle, HelpCircle,
  Upload, Sparkles, RefreshCw, FolderPlus
} from 'lucide-react';
import { toast } from 'sonner';

export default function PolicePortalPage() {
  const dispatch = useAppDispatch();
  const complaints = useAppSelector((s) => s.citizenPortal.complaints);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const [activeTab, setActiveTab] = useState<'queue' | 'upload' | 'investigation'>('queue');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>(complaints[0]?.id || '');

  // FIR upload simulation
  const [uploading, setUploading] = useState(false);
  const [ocrStep, setOcrStep] = useState(0);
  const [firNumber, setFirNumber] = useState('FIR-2026-0891');
  const [station, setStation] = useState('Andheri East Police Station');

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId) || complaints[0];

  const handleAction = (
    action: 'approve' | 'reject' | 'request' | 'convert',
    complaintId: string
  ) => {
    let nextStatus: ComplaintStatus = 'Under Verification';
    let note = '';
    let firId: string | undefined = undefined;

    switch (action) {
      case 'approve':
        nextStatus = 'Verified';
        note = 'Complaint verified by Duty Officer. Prima facie cognizable offence established.';
        toast.success(`Complaint ${complaintId} marked as Verified`);
        break;
      case 'request':
        nextStatus = 'Under Verification';
        note = 'Requisition dispatched to citizen requesting bank statement certification.';
        toast.info(`Additional info requested for ${complaintId}`);
        break;
      case 'reject':
        nextStatus = 'Closed';
        note = 'Complaint dismissed after preliminary inquiry. Civil dispute nature.';
        toast.error(`Complaint ${complaintId} closed`);
        break;
      case 'convert':
        nextStatus = 'Converted to FIR';
        firId = `FIR-2026-0${Math.floor(100 + Math.random() * 900)}`;
        note = `Substantive offences charged under IPC. Registered as official Police FIR: ${firId}.`;
        toast.success(`Complaint ${complaintId} converted to ${firId}!`);
        break;
    }

    dispatch(
      updateComplaintStatus({
        id: complaintId,
        status: nextStatus,
        officer: 'DCP R. Sharma',
        note,
        convertedFirId: firId,
      })
    );
  };

  const handleSimulateOCR = () => {
    setUploading(true);
    setOcrStep(1);

    timersRef.current.push(setTimeout(() => setOcrStep(2), 700));
    timersRef.current.push(setTimeout(() => setOcrStep(3), 1400));
    timersRef.current.push(setTimeout(() => {
      setOcrStep(4);
      setUploading(false);
      toast.success(`FIR ${firNumber} scanned and ingested into KRITAGAS intelligence index.`);
    }, 2200));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Police Intake &amp; Case Verification Console
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              Law Enforcement Desk
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Complaint triage, investigation review, and digital FIR registration gateway
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg border glass-panel" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setActiveTab('queue')}
            className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
            style={{
              background: activeTab === 'queue' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'queue' ? '#FFFFFF' : 'var(--ink-secondary)',
            }}
          >
            Complaint Triage ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
            style={{
              background: activeTab === 'upload' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'upload' ? '#FFFFFF' : 'var(--ink-secondary)',
            }}
          >
            Upload FIR (OCR)
          </button>
        </div>
      </div>

      {/* VIEW 1: COMPLAINT TRIAGE & VERIFICATION QUEUE */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Complaints List (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            {complaints.map((comp) => {
              const isSelected = selectedComplaint?.id === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComplaintId(comp.id)}
                  className="p-4 rounded-xl border cursor-pointer transition-all hover:border-[var(--accent)] space-y-1 glass-panel"
                  style={{
                    borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                    background: isSelected ? 'var(--glass-2)' : 'var(--glass-1)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-id font-bold text-[13px] text-[var(--accent)]">
                      {comp.id}
                    </span>
                    <span className="badge badge-review text-[10px]">
                      {comp.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-[13px]" style={{ color: 'var(--ink-primary)' }}>
                    {comp.complainantName} • {comp.crimeType}
                  </h3>

                  <div className="text-[11px] text-[var(--ink-secondary)] truncate">
                    {comp.location} • Filed {comp.date}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Console (7 cols) */}
          <div className="lg:col-span-7">
            {selectedComplaint && (
              <div
                className="p-6 rounded-2xl border space-y-5 glass-panel-elevated"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <span className="font-mono-id font-bold text-[14px] text-[var(--accent)]">
                      {selectedComplaint.id}
                    </span>
                    <h3 className="text-[17px] font-bold mt-0.5" style={{ color: 'var(--ink-primary)' }}>
                      {selectedComplaint.complainantName}
                    </h3>
                  </div>
                  <span className="badge badge-active">{selectedComplaint.status}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
                    Reported Allegation
                  </span>
                  <p className="text-[13px] leading-relaxed p-3 rounded-lg border bg-[var(--glass-1)]" style={{ borderColor: 'var(--border)', color: 'var(--ink-primary)' }}>
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  <div className="p-2.5 rounded-lg border bg-[var(--surface-0)]" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-[10px] text-[var(--ink-tertiary)] uppercase font-semibold block">Contact Phone</span>
                    <span className="font-mono-id font-medium">{selectedComplaint.phone}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border bg-[var(--surface-0)]" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-[10px] text-[var(--ink-tertiary)] uppercase font-semibold block">Location</span>
                    <span className="font-medium truncate block">{selectedComplaint.location}</span>
                  </div>
                </div>

                {/* Desk Verification Actions */}
                <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] block">
                    Investigative Action Gate
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => handleAction('approve', selectedComplaint.id)}
                      className="p-2 rounded-lg border text-[12px] font-semibold flex items-center justify-center gap-1 hover:bg-[var(--surface-2)] text-[var(--success)]"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Verify</span>
                    </button>

                    <button
                      onClick={() => handleAction('request', selectedComplaint.id)}
                      className="p-2 rounded-lg border text-[12px] font-semibold flex items-center justify-center gap-1 hover:bg-[var(--surface-2)] text-[var(--warning)]"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <HelpCircle size={14} />
                      <span>Request Info</span>
                    </button>

                    <button
                      onClick={() => handleAction('convert', selectedComplaint.id)}
                      className="p-2 rounded-lg text-[12px] font-semibold text-white shadow-sm flex items-center justify-center gap-1 hover:opacity-90 transition-all col-span-2 sm:col-span-1"
                      style={{ background: 'var(--accent)' }}
                    >
                      <FolderPlus size={14} />
                      <span>Convert to FIR</span>
                    </button>

                    <button
                      onClick={() => handleAction('reject', selectedComplaint.id)}
                      className="p-2 rounded-lg border text-[12px] font-semibold flex items-center justify-center gap-1 hover:bg-[var(--surface-2)] text-[var(--error)]"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <XCircle size={14} />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: MANUAL FIR UPLOAD WITH OCR PIPELINE */}
      {activeTab === 'upload' && (
        <div className="p-6 rounded-2xl border space-y-6 glass-panel-elevated" style={{ borderColor: 'var(--border)' }}>
          <div className="border-b pb-3" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-[16px] font-bold" style={{ color: 'var(--ink-primary)' }}>
              Manual FIR Digital Ingestion (OCR Simulation)
            </h3>
            <p className="text-[12px] text-[var(--ink-secondary)]">
              Scan physical FIR police copy and execute automated Named Entity Recognition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] mb-1">
                FIR Number
              </label>
              <input
                type="text"
                value={firNumber}
                onChange={(e) => setFirNumber(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border bg-[var(--surface-0)] text-[var(--ink-primary)] font-mono-id outline-none"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] mb-1">
                Issuing Police Station
              </label>
              <input
                type="text"
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
          </div>

          {/* Stepper Pipeline */}
          {ocrStep > 0 && (
            <div className="p-4 rounded-xl border space-y-3 bg-[var(--surface-0)]" style={{ borderColor: 'var(--accent)' }}>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[var(--accent)]" />
                <span className="font-semibold text-[13px]" style={{ color: 'var(--ink-primary)' }}>
                  Optical Character Recognition Pipeline
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                {['Uploading PDF Scan', 'Extracting Text Vectors', 'NER Entity Correlation', 'Ingestion Complete'].map(
                  (stepName, i) => (
                    <div
                      key={stepName}
                      className="p-2 rounded border text-center font-mono-id"
                      style={{
                        background: ocrStep > i ? 'var(--accent-muted)' : 'var(--surface-2)',
                        color: ocrStep > i ? 'var(--accent)' : 'var(--ink-tertiary)',
                        borderColor: ocrStep > i ? 'var(--accent)' : 'var(--border)',
                      }}
                    >
                      {ocrStep > i ? '✓ ' + stepName : stepName}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSimulateOCR}
              disabled={uploading}
              className="px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white shadow-sm flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
              <span>{uploading ? 'Processing OCR & NER...' : 'Ingest FIR Document'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
