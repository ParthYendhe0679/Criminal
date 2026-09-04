'use client';

import React, { useState } from 'react';
import { auditLogs } from '@/mock';
import {
  Settings, Users, Shield, Lock, Activity, Clock,
  FileCheck, Database, CheckCircle2, UserCheck, Search
} from 'lucide-react';
import { toast } from 'sonner';

const mockUsers = [
  { id: 'USR-001', name: 'DCP R. Sharma', role: 'Supervisory Officer', dept: 'Economic Offences Wing', status: 'Active', badge: 'DCP/MUM/0456' },
  { id: 'USR-002', name: 'ACP V. Patil', role: 'Lead Investigator', dept: 'Crime Branch Unit 3', status: 'Active', badge: 'ACP/MUM/0891' },
  { id: 'USR-003', name: 'SI M. Khan', role: 'Field Intelligence Officer', dept: 'Cyber & Technical Cell', status: 'Active', badge: 'SI/MUM/1423' },
  { id: 'USR-004', name: 'DI P. Reddy', role: 'Forensic Analyst', dept: 'Digital Evidence Laboratory', status: 'Active', badge: 'DI/MUM/0912' },
  { id: 'USR-005', name: 'CI A. Nair', role: 'Intelligence Officer', dept: 'Anti-Narcotics Cell', status: 'Active', badge: 'CI/MUM/0334' },
];

const mockRoles = [
  { name: 'Supervisory Officer', permissions: 'Full Read/Write, Approve FIRs, Sign-off Evidence, Audit Logs, AI Synthesis' },
  { name: 'Lead Investigator', permissions: 'Read/Write Cases, Add Evidence, Update Network Relationships, Dispatch Alerts' },
  { name: 'Field Intelligence Officer', permissions: 'Read Cases, Log Field Observations, ANPR Tracking, Watchlist Review' },
  { name: 'Forensic Analyst', permissions: 'Upload Forensic Lab Reports, Verify Hashes, Document Examination' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'audit' | 'users' | 'roles' | 'system'>('audit');
  const [searchLog, setSearchLog] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    if (!searchLog) return true;
    const q = searchLog.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.userName.toLowerCase().includes(q) ||
      log.target.toLowerCase().includes(q) ||
      log.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              System Administration &amp; Security Compliance
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              Audited Environment
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Role-based access control, cryptographic user authorization, and immutable forensic activity audit logs
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg border bg-[var(--surface-1)]" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setActiveTab('audit')}
            className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
            style={{
              background: activeTab === 'audit' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'audit' ? '#FFFFFF' : 'var(--ink-secondary)',
            }}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
            style={{
              background: activeTab === 'users' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'users' ? '#FFFFFF' : 'var(--ink-secondary)',
            }}
          >
            Users &amp; Roles
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
            style={{
              background: activeTab === 'system' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'system' ? '#FFFFFF' : 'var(--ink-secondary)',
            }}
          >
            System Activity
          </button>
        </div>
      </div>

      {/* VIEW 1: AUDIT LOGS (Section 38) */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div
            className="p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-[13px]"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
          >
            <div className="relative flex-1 max-w-[360px]">
              <Search size={14} className="absolute left-3 top-2.5 text-[var(--ink-tertiary)]" />
              <input
                type="text"
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                placeholder="Search audit trail by user, action, target..."
                className="w-full h-8 pl-8 pr-3 rounded text-[12px] border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
            <span className="font-mono-id text-[11px] text-[var(--ink-tertiary)]">
              {filteredLogs.length} immutable events recorded
            </span>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            <table className="w-full border-collapse table-dense text-left">
              <thead>
                <tr>
                  <th className="w-24">Log ID</th>
                  <th>Action Event</th>
                  <th>Target Entity / Record</th>
                  <th>Officer</th>
                  <th>IP Address</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.slice(0, 15).map((log) => (
                  <tr key={log.id}>
                    <td className="font-mono-id font-semibold text-[var(--accent)]">{log.id}</td>
                    <td>
                      <span className="font-medium text-[var(--ink-primary)]">{log.action}</span>
                    </td>
                    <td className="font-mono-id text-[12px] text-[var(--ink-secondary)]">{log.target}</td>
                    <td>
                      <span className="font-medium text-[var(--ink-primary)]">{log.userName}</span>
                    </td>
                    <td className="font-mono-id text-[11px] text-[var(--ink-tertiary)]">{log.ipAddress}</td>
                    <td className="font-mono-id text-[11px] text-[var(--ink-secondary)]">
                      {log.timestamp.replace('T', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: USERS & ROLES */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Users Table */}
          <div className="p-5 rounded-xl border space-y-4" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--ink-primary)' }}>
              Authorized Investigation Personnel
            </h3>
            <div className="divide-y border rounded-lg overflow-hidden text-[12px]" style={{ borderColor: 'var(--border)' }}>
              {mockUsers.map((u) => (
                <div key={u.id} className="p-3 flex items-center justify-between hover:bg-[var(--surface-2)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-[11px]" style={{ background: 'var(--accent)' }}>
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-[13px]" style={{ color: 'var(--ink-primary)' }}>
                        {u.name}
                      </div>
                      <div className="text-[11px] text-[var(--ink-tertiary)]">
                        {u.badge} • {u.dept}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-active">{u.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roles & Permissions */}
          <div className="p-5 rounded-xl border space-y-4" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--ink-primary)' }}>
              Role-Based Access Control (RBAC) Permissions
            </h3>
            <div className="space-y-2">
              {mockRoles.map((r) => (
                <div key={r.name} className="p-3 rounded-lg border bg-[var(--surface-2)] space-y-1" style={{ borderColor: 'var(--border)' }}>
                  <div className="font-semibold text-[13px] text-[var(--accent)]">{r.name}</div>
                  <div className="text-[12px] text-[var(--ink-secondary)]">{r.permissions}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SYSTEM ACTIVITY */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border space-y-2" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
              System Ingestion Throughput
            </span>
            <div className="text-[26px] font-bold font-mono-id text-[var(--accent)]">42,190 rec/s</div>
            <p className="text-[12px] text-[var(--ink-secondary)]">Simulated OCR, ANPR &amp; CDR pipeline indexing status.</p>
          </div>
          <div className="p-5 rounded-xl border space-y-2" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
              Graph Clustering Node Capacity
            </span>
            <div className="text-[26px] font-bold font-mono-id text-[var(--success)]">1,000,000 max</div>
            <p className="text-[12px] text-[var(--ink-secondary)]">Cytoscape layout scaling engine running locally in browser memory.</p>
          </div>
          <div className="p-5 rounded-xl border space-y-2" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
              Cryptographic Seal Verification
            </span>
            <div className="text-[26px] font-bold font-mono-id text-[var(--accent)]">100% OK</div>
            <p className="text-[12px] text-[var(--ink-secondary)]">Zero tampered evidence artifacts detected in synthetic state.</p>
          </div>
        </div>
      )}
    </div>
  );
}
