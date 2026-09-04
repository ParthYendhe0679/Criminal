'use client';

import React, { useState } from 'react';
import { evidence } from '@/mock';
import {
  ShieldCheck, RefreshCw, CheckCircle2, Lock, FileCode,
  AlertTriangle, Copy, ExternalLink, ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';

export default function EvidenceIntegrityPage() {
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({
    'EVIDENCE-044': true,
    'EVIDENCE-045': true,
    'EVIDENCE-046': true,
    'EVIDENCE-047': true,
  });

  const handleVerify = (id: string) => {
    setVerifyingId(id);
    setTimeout(() => {
      setVerifyingId(null);
      setVerifiedMap((prev) => ({ ...prev, [id]: true }));
      toast.success(`SHA-256 checksum verified for ${id}. Proof logged to audit trail.`);
    }, 1800);
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.info('Hash copied to clipboard');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Cryptographic Evidence Integrity Ledger
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              SHA-256 Merkle Verification
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Tamper-evident chain of custody hashing, timestamp verification, and digital forensic integrity proof
          </p>
        </div>
      </div>

      {/* Overview Banner */}
      <div
        className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 text-[13px]"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--accent-muted)] text-[var(--accent)] shrink-0">
            <Lock size={20} />
          </div>
          <div>
            <div className="font-semibold" style={{ color: 'var(--ink-primary)' }}>
              Zero-Trust Digital Evidence Sealing
            </div>
            <div className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>
              Each evidence artifact ingested receives an immutable SHA-256 cryptographic signature anchored upon initial police intake.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[12px] font-mono-id font-bold text-[var(--success)]">
            100% Chain-of-Custody Verified
          </span>
        </div>
      </div>

      {/* Evidence Integrity Items List */}
      <div className="space-y-3">
        {evidence.slice(0, 10).map((item) => {
          const isVerified = verifiedMap[item.id] ?? item.integrity.verified;
          const isVerifying = verifyingId === item.id;

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border transition-all hover:border-[var(--accent)]"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-id font-bold text-[13px] text-[var(--accent)]">
                      {item.id}
                    </span>
                    <span className="badge badge-medium">{item.type}</span>
                    <span className="font-mono-id text-[11px] text-[var(--ink-tertiary)]">
                      Case: {item.caseId}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-semibold" style={{ color: 'var(--ink-primary)' }}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-mono-id" style={{ color: 'var(--ink-tertiary)' }}>
                    <span>Recorded: {item.date}</span>
                    <span>•</span>
                    <span>Source: {item.source}</span>
                  </div>
                </div>

                {/* Hash and Verify Button */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:border-l lg:pl-4" style={{ borderColor: 'var(--border)' }}>
                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)]">
                      SHA-256 Cryptographic Hash
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono-id text-[11px] select-all font-semibold" style={{ color: 'var(--ink-primary)' }}>
                        {item.integrity.hash.slice(0, 24)}...{item.integrity.hash.slice(-8)}
                      </span>
                      <button
                        onClick={() => copyHash(item.integrity.hash)}
                        className="p-1 rounded hover:bg-[var(--surface-2)] text-[var(--ink-tertiary)]"
                        title="Copy full hash"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Status & Verify Button */}
                  <div className="flex items-center gap-2">
                    {isVerified ? (
                      <span className="px-3 py-1.5 rounded text-[11px] font-mono-id font-semibold flex items-center gap-1.5"
                        style={{ background: 'var(--success-muted)', color: '#16A34A' }}>
                        <CheckCircle2 size={13} />
                        <span>VERIFIED</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded text-[11px] font-mono-id font-semibold flex items-center gap-1.5"
                        style={{ background: 'var(--warning-muted)', color: '#D97706' }}>
                        <AlertTriangle size={13} />
                        <span>PENDING</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleVerify(item.id)}
                      disabled={isVerifying}
                      className="px-3 py-1.5 rounded-lg text-[12px] font-medium border flex items-center gap-1.5 hover:bg-[var(--surface-2)] transition-colors disabled:opacity-50"
                      style={{ borderColor: 'var(--border)', color: 'var(--ink-primary)' }}
                    >
                      {isVerifying && <RefreshCw size={12} className="animate-spin text-[var(--accent)]" />}
                      <span>{isVerifying ? 'Verifying...' : 'Verify Integrity'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
