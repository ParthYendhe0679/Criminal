'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setRole } from '@/store/slices/uiSlice';
import type { UserRole } from '@/store/slices/uiSlice';
import { toast } from 'sonner';
import { ShieldCheck, UserCircle2, Settings2, ArrowRight, Lock } from 'lucide-react';

interface RoleCard {
  role: UserRole;
  label: string;
  subtitle: string;
  description: string;
  credential: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bg: string;
  features: string[];
}

const roles: RoleCard[] = [
  {
    role: 'citizen',
    label: 'Citizen Portal',
    subtitle: 'Public Complaint Portal',
    description: 'File and track complaints, view status updates, and communicate with authorities.',
    credential: 'citizen@kritagas.gov.in',
    icon: UserCircle2,
    color: '#16A34A',
    bg: 'rgba(22, 163, 74, 0.08)',
    features: ['File a Complaint', 'Track Complaint Status', 'Upload Documents', 'View Notifications'],
  },
  {
    role: 'police',
    label: 'Police / Investigator',
    subtitle: 'Intelligence Platform',
    description: 'AI-powered criminal network analysis, case management, evidence intelligence, and more.',
    credential: 'DCP/MUM/0456',
    icon: ShieldCheck,
    color: '#4F46E5',
    bg: 'rgba(79, 70, 229, 0.08)',
    features: ['Criminal Network Graph', 'Case Management', 'Evidence Hub', 'Live Investigation Feed'],
  },
  {
    role: 'admin',
    label: 'Administration',
    subtitle: 'System Management',
    description: 'Manage users, roles, permissions, view audit logs and security events.',
    credential: 'admin@kritagas.gov.in',
    icon: Settings2,
    color: '#D97706',
    bg: 'rgba(217, 119, 6, 0.08)',
    features: ['User Management', 'Role & Permissions', 'Audit Logs', 'Security Events'],
  },
];

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<UserRole | null>(null);

  const handleSelect = (role: UserRole) => {
    setLoading(role);
    dispatch(setRole(role));
    setTimeout(() => {
      setLoading(null);
      const label = roles.find(r => r.role === role)?.label ?? role;
      toast.success(`Welcome to KRITAGAS — ${label}`);
      if (role === 'citizen') router.push('/citizen');
      else if (role === 'admin') router.push('/admin');
      else router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--surface-0)] animate-fade-in"
      style={{ backgroundImage: 'var(--ambient-gradient)', backgroundAttachment: 'fixed' }}>

      {/* Brand Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-[26px] shadow-lg"
            style={{ background: 'var(--accent)' }}
          >
            K
          </div>
        </div>
        <h1 className="text-[32px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
          KRITAGAS
        </h1>
        <p className="text-[15px] mt-1" style={{ color: 'var(--ink-secondary)' }}>
          AI-Powered Criminal Network Intelligence & Investigation Platform
        </p>
        <div
          className="inline-flex items-center gap-1.5 mt-3 text-[12px] font-semibold px-3 py-1 rounded-full tracking-wide"
          style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}
        >
          <Lock size={11} />
          DEMO PROTOTYPE — SYNTHETIC DATA ONLY
        </div>
      </div>

      {/* Role Selector */}
      <div className="w-full max-w-[960px]">
        <p className="text-center text-[14px] font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--ink-tertiary)' }}>
          Select Demo Portal
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((r) => {
            const Icon = r.icon;
            const isLoading = loading === r.role;
            return (
              <button
                key={r.role}
                onClick={() => handleSelect(r.role)}
                disabled={loading !== null}
                className="group relative text-left p-7 rounded-2xl border-2 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: isLoading ? r.color : 'var(--border)',
                  boxShadow: isLoading ? `0 0 0 3px ${r.bg}` : undefined,
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ background: r.bg, color: r.color }}
                >
                  <Icon size={24} />
                </div>

                {/* Labels */}
                <div className="mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: r.color }}>
                    {r.subtitle}
                  </span>
                </div>
                <h2 className="text-[19px] font-bold mb-2" style={{ color: 'var(--ink-primary)' }}>
                  {r.label}
                </h2>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--ink-secondary)' }}>
                  {r.description}
                </p>

                {/* Feature list */}
                <ul className="space-y-1.5 mb-6">
                  {r.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--ink-secondary)' }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: r.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Credential */}
                <div className="mb-5 px-3 py-2 rounded-lg text-[12px] font-mono-id" style={{ background: 'var(--surface-2)' }}>
                  <span style={{ color: 'var(--ink-tertiary)' }}>Demo ID: </span>
                  <span style={{ color: 'var(--ink-primary)' }}>{r.credential}</span>
                </div>

                {/* CTA */}
                <div
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[14px] font-semibold text-white transition-all group-hover:opacity-95"
                  style={{ background: isLoading ? r.color : r.color, opacity: isLoading ? 0.85 : 1 }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Entering...
                    </>
                  ) : (
                    <>
                      Enter Portal
                      <ArrowRight size={16} />
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-10 text-[12px]" style={{ color: 'var(--ink-tertiary)' }}>
        KRITAGAS v2.0 • Smart India Hackathon • All data is synthetic and for demonstration only
      </p>
    </div>
  );
}
