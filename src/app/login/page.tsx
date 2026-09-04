'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [badgeNumber, setBadgeNumber] = useState('DCP/MUM/0456');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Authenticated as DCP R. Sharma. Welcome to KRITAGAS.');
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--surface-0)] animate-fade-in">
      <div
        className="w-full max-w-[420px] rounded-2xl border p-8 space-y-6 shadow-xl"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
      >
        {/* Logo and branding */}
        <div className="text-center space-y-2">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto text-white font-bold text-[20px] shadow-sm"
            style={{ background: 'var(--accent)' }}
          >
            K
          </div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
            KRITAGAS
          </h1>
          <p className="text-[12px] text-[var(--ink-secondary)]">
            AI-Powered Criminal Network Intelligence &amp; Investigation Platform
          </p>
          <div
            className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase mt-1"
            style={{ background: 'var(--warning-muted)', color: '#D97706' }}
          >
            DEMO PROTOTYPE • SYNTHETIC DATA
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-[13px]">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] mb-1">
              Officer Badge ID / Service Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none font-mono-id"
                style={{ borderColor: 'var(--border)' }}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] mb-1">
              Security Token / Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none font-mono-id"
                style={{ borderColor: 'var(--border)' }}
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg text-[13px] font-semibold text-white shadow-sm flex items-center justify-center gap-1.5 transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              <span>{loading ? 'Authenticating...' : 'Access Intelligence Workstation'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>

        <div className="pt-2 border-t text-center text-[11px]" style={{ borderColor: 'var(--border)', color: 'var(--ink-tertiary)' }}>
          Quick Demo Credentials: DCP R. Sharma (Pre-filled)
        </div>
      </div>
    </div>
  );
}
