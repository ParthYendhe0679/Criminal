'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addComplaint, setSelectedComplaint } from '@/store/slices/citizenPortalSlice';
import type { CrimeType, ComplaintStatus } from '@/types';
import {
  UserCheck, Plus, FileText, CheckCircle2, Clock, Shield,
  Upload, AlertTriangle, ChevronRight, FileCheck, ArrowRight,
  Send, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const statusSteps: ComplaintStatus[] = [
  'Submitted',
  'Under Verification',
  'Verified',
  'Converted to FIR',
  'Investigation',
  'Closed',
];

export default function CitizenPortalPage() {
  const dispatch = useAppDispatch();
  const { complaints, selectedComplaintId } = useAppSelector((s) => s.citizenPortal);

  const [formOpen, setFormOpen] = useState(false);
  const [complainantName, setComplainantName] = useState('Vikramaditya Rao');
  const [phone, setPhone] = useState('+91 98201 55667');
  const [email, setEmail] = useState('v.rao@cloudmail.com');
  const [crimeType, setCrimeType] = useState<CrimeType>('Fraud');
  const [description, setDescription] = useState(
    'Received unauthorized transaction alerts totaling Rs 1,45,000 via forged cheque clearance at local branch.'
  );
  const [location, setLocation] = useState('Bandra West, Mumbai');
  const [city, setCity] = useState('Mumbai');
  const [date, setDate] = useState('2026-09-03');
  const [time, setTime] = useState('11:30');
  const [evidenceName, setEvidenceName] = useState('cheque_scan_copy.pdf');

  const selectedComplaint =
    complaints.find((c) => c.id === selectedComplaintId) || complaints[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complainantName || !description) {
      toast.error('Please complete mandatory fields');
      return;
    }
    dispatch(
      addComplaint({
        complainantName,
        phone,
        email,
        crimeType,
        description,
        location,
        city,
        date,
        time,
        evidenceFiles: evidenceName ? [evidenceName] : [],
      })
    );
    toast.success('Complaint successfully filed! Acknowledgement generated.');
    setFormOpen(false);
  };

  const getStatusIndex = (st: ComplaintStatus) => statusSteps.indexOf(st);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Citizen Incident Reporting Portal
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              Public Redressal Service
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Transparent e-complaint lodging, real-time verification progression, and legal FIR conversion tracking
          </p>
        </div>

        <button
          onClick={() => setFormOpen(!formOpen)}
          className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          <Plus size={15} />
          <span>{formOpen ? 'Cancel Filing' : 'Lodge New Complaint'}</span>
        </button>
      </div>

      {/* New Complaint Form Panel (Section 17) */}
      {formOpen && (
        <div
          className="p-6 rounded-2xl border shadow-xl space-y-4 glass-panel-elevated animate-slide-in-down"
          style={{ borderColor: 'var(--border-strong)' }}
        >
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[var(--accent)]" />
              <h3 className="font-bold text-[16px]" style={{ color: 'var(--ink-primary)' }}>
                Citizen Incident Registration Form
              </h3>
            </div>
            <span className="text-[11px] font-mono-id text-[var(--ink-tertiary)]">
              Digital E-Declaration
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] mb-1">
                  Complainant Full Name
                </label>
                <input
                  type="text"
                  value={complainantName}
                  onChange={(e) => setComplainantName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none"
                  style={{ borderColor: 'var(--border)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] mb-1">
                  Contact Mobile Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none font-mono-id"
                  style={{ borderColor: 'var(--border)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] mb-1">
                  Crime Classification
                </label>
                <select
                  value={crimeType}
                  onChange={(e) => setCrimeType(e.target.value as CrimeType)}
                  className="w-full h-9 px-3 rounded-lg border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <option value="Fraud">Financial Fraud / Cheating</option>
                  <option value="Cybercrime">Cybercrime / Online Scams</option>
                  <option value="Vehicle Theft">Vehicle Theft</option>
                  <option value="Robbery">Armed Robbery</option>
                  <option value="Extortion">Extortion &amp; Threats</option>
                  <option value="Assault">Assault</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] mb-1">
                  Incident Location &amp; Landmark
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none"
                  style={{ borderColor: 'var(--border)' }}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] mb-1">
                  Metropolitan Jurisdiction
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] mb-1">
                  Date of Incident
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none font-mono-id"
                  style={{ borderColor: 'var(--border)' }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] mb-1">
                Factual Narrative of Incident
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-lg border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none"
                style={{ borderColor: 'var(--border)' }}
                required
              />
            </div>

            {/* Mock Evidence Upload */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] mb-1">
                Supporting Evidence Artifact (PDF / Image / Video)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={evidenceName}
                  onChange={(e) => setEvidenceName(e.target.value)}
                  placeholder="e.g. proof_bank_statement.pdf"
                  className="flex-1 h-9 px-3 rounded-lg border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none font-mono-id text-[12px]"
                  style={{ borderColor: 'var(--border)' }}
                />
                <button
                  type="button"
                  onClick={() => toast.info('Simulated file attached')}
                  className="px-3 h-9 rounded-lg border flex items-center gap-1.5 hover:bg-[var(--surface-2)] text-[var(--ink-secondary)]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Upload size={14} />
                  <span>Attach</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 rounded-lg border text-[13px] hover:bg-[var(--surface-2)]"
                style={{ borderColor: 'var(--border)', color: 'var(--ink-secondary)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg font-semibold text-white shadow-sm flex items-center gap-1.5 hover:opacity-90 transition-all"
                style={{ background: 'var(--accent)' }}
              >
                <Send size={14} />
                <span>Submit Complaint</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Split View: Complaints Master List (4 cols) & Selected Tracking Journey (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Complaints List */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] px-1">
            Registered Citizen Claims ({complaints.length})
          </span>

          <div className="space-y-2">
            {complaints.map((comp) => {
              const isSelected = selectedComplaint?.id === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => dispatch(setSelectedComplaint(comp.id))}
                  className="p-4 rounded-xl border cursor-pointer transition-all hover:border-[var(--accent)] space-y-1.5 glass-panel"
                  style={{
                    borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                    background: isSelected ? 'var(--glass-2)' : 'var(--glass-1)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-id font-bold text-[13px] text-[var(--accent)]">
                      {comp.id}
                    </span>
                    <span className="badge badge-investigation text-[10px]">
                      {comp.status}
                    </span>
                  </div>

                  <div className="font-semibold text-[13px]" style={{ color: 'var(--ink-primary)' }}>
                    {comp.complainantName} • {comp.crimeType}
                  </div>

                  <p className="text-[11px] line-clamp-1 text-[var(--ink-secondary)]">
                    {comp.description}
                  </p>

                  <div className="text-[10px] font-mono-id text-[var(--ink-tertiary)] pt-1 flex justify-between">
                    <span>{comp.date}</span>
                    <span>{comp.city}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Complaint Lifecycle & Progression Inspector */}
        <div className="lg:col-span-8">
          {selectedComplaint && (
            <div
              className="p-6 rounded-2xl border space-y-6 glass-panel-elevated"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-id font-bold text-[15px] text-[var(--accent)]">
                      {selectedComplaint.id}
                    </span>
                    <span className="badge badge-active">{selectedComplaint.status}</span>
                  </div>
                  <h3 className="text-[18px] font-bold mt-1" style={{ color: 'var(--ink-primary)' }}>
                    {selectedComplaint.complainantName} — {selectedComplaint.crimeType} Case
                  </h3>
                  <p className="text-[12px] text-[var(--ink-secondary)]">
                    Assigned: {selectedComplaint.assignedStation} • Lodged: {selectedComplaint.date} {selectedComplaint.time}
                  </p>
                </div>

                {selectedComplaint.convertedFirId && (
                  <div className="p-2.5 rounded-lg border text-right bg-[var(--surface-2)]" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)] block">
                      Converted Police FIR
                    </span>
                    <span className="font-mono-id font-bold text-[13px] text-[var(--accent)]">
                      {selectedComplaint.convertedFirId}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Progression Lifecycle Stepper */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] block">
                  Judicial Progression Lifecycle
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {statusSteps.map((step, idx) => {
                    const currentIndex = getStatusIndex(selectedComplaint.status);
                    const isDone = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div
                        key={step}
                        className="p-2.5 rounded-lg border text-center text-[11px] transition-all"
                        style={{
                          background: isCurrent ? 'var(--accent-muted)' : isDone ? 'var(--glass-2)' : 'var(--surface-0)',
                          borderColor: isCurrent ? 'var(--accent)' : 'var(--border)',
                          color: isCurrent ? 'var(--accent)' : isDone ? 'var(--success)' : 'var(--ink-tertiary)',
                        }}
                      >
                        <div className="font-mono-id text-[10px] font-bold mb-0.5">
                          {isDone ? '✓ Stage ' + (idx + 1) : 'Stage ' + (idx + 1)}
                        </div>
                        <div className="truncate font-semibold">{step}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Complaint Statement Narrative */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] block mb-1">
                  Complainant Factual Deposition
                </span>
                <div
                  className="p-3.5 rounded-lg border text-[13px] leading-relaxed bg-[var(--glass-1)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--ink-primary)' }}
                >
                  {selectedComplaint.description}
                </div>
              </div>

              {/* Police Station Audit Trail & Officer Notes */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] block mb-2">
                  Investigating Officer Action Log
                </span>
                <div className="space-y-2">
                  {selectedComplaint.investigatorNotes.map((n, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border text-[12px] bg-[var(--glass-1)] space-y-1"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono-id">
                        <span className="font-semibold text-[var(--accent)]">{n.officer}</span>
                        <span style={{ color: 'var(--ink-tertiary)' }}>{n.date}</span>
                      </div>
                      <p style={{ color: 'var(--ink-primary)' }}>{n.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Artifacts */}
              {selectedComplaint.evidenceFiles.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] block mb-1.5">
                    Attached Evidence Submissions
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedComplaint.evidenceFiles.map((f) => (
                      <span
                        key={f}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono-id border bg-[var(--glass-2)] text-[var(--accent)] font-semibold flex items-center gap-1.5"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <FileCheck size={13} />
                        <span>{f}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
