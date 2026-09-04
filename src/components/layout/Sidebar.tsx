'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleSidebar } from '@/store/slices/uiSlice';
import {
  LayoutDashboard, FolderOpen, FileText, Network, Map, History,
  Search, Radio, Eye, ActivitySquare, Bell, Package, FlaskConical,
  GitCompare, AlertOctagon, ShieldCheck, BrainCircuit, MapPin,
  TrendingUp, BookmarkCheck, Clock, Play, UserCheck, ShieldAlert,
  Bot, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';

const navSections = [
  {
    label: 'OVERVIEW',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'INVESTIGATION',
    items: [
      { href: '/cases', label: 'Cases', icon: FolderOpen },
      { href: '/cases/search', label: 'Case Search', icon: Search },
      { href: '/fir', label: 'FIR Intelligence', icon: FileText },
      { href: '/network', label: 'Network Intelligence', icon: Network },
      { href: '/map', label: 'Map Intelligence', icon: Map },
      { href: '/historical', label: 'Historical Intelligence', icon: History },
    ],
  },
  {
    label: 'MONITORING',
    items: [
      { href: '/monitoring', label: 'Live Monitoring', icon: Radio, pulse: true },
      { href: '/sentinel', label: 'Sentinel', icon: Eye },
      { href: '/anomaly', label: 'Behaviour Anomaly', icon: ActivitySquare },
      { href: '/alerts', label: 'Live Alerts', icon: Bell },
    ],
  },
  {
    label: 'EVIDENCE',
    items: [
      { href: '/evidence', label: 'Evidence Intelligence', icon: Package },
      { href: '/forensics', label: 'Forensics', icon: FlaskConical },
      { href: '/forensics?tab=correlation', label: 'Evidence Correlation', icon: GitCompare },
      { href: '/forensics?tab=contradictions', label: 'Contradictions', icon: AlertOctagon },
      { href: '/integrity', label: 'Evidence Integrity', icon: ShieldCheck },
    ],
  },
  {
    label: 'ANALYTICS',
    items: [
      { href: '/predictive', label: 'Predictive Intelligence', icon: BrainCircuit },
      { href: '/hotspots', label: 'Crime Hotspots', icon: MapPin },
      { href: '/trends', label: 'Crime Trends', icon: TrendingUp },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { href: '/watchlist', label: 'Watchlist', icon: BookmarkCheck },
      { href: '/timeline', label: 'Timeline', icon: Clock },
      { href: '/replay', label: 'Investigation Replay', icon: Play },
    ],
  },
  {
    label: 'PORTALS',
    items: [
      { href: '/citizen', label: 'Citizen Portal', icon: UserCheck },
      { href: '/police', label: 'Police Portal', icon: ShieldAlert },
    ],
  },
  {
    label: 'AI',
    items: [
      { href: '/ai', label: 'KRITAGAS AI', icon: Bot },
    ],
  },
  {
    label: 'ADMIN',
    items: [
      { href: '/admin', label: 'Admin', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full z-40 flex flex-col border-r transition-all duration-200 ease-out glass-panel',
        collapsed ? 'w-[56px]' : 'w-[240px]'
      )}
      style={{
        borderColor: 'var(--border)',
      }}
    >
      {/* Brand Header */}
      <div className="flex items-center h-[48px] px-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
              style={{ background: 'var(--accent)' }}
            >
              K
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[14px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
                KRITAGAS
              </span>
              <span className="text-[9px] font-mono-id px-1 py-0.2 rounded font-semibold text-[var(--accent)] bg-[var(--accent-muted)]">
                INTEL
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/dashboard" className="flex items-center justify-center w-full">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
              style={{ background: 'var(--accent)' }}
            >
              K
            </div>
          </Link>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {navSections.map((section) => (
          <div key={section.label} className="mb-2">
            {!collapsed && (
              <div
                className="px-2 py-1 text-[10px] font-semibold tracking-wider"
                style={{ color: 'var(--ink-tertiary)' }}
              >
                {section.label}
              </div>
            )}
            {section.items.map((item) => {
              const isActive =
                item.href === '/cases/search'
                  ? pathname === '/cases/search'
                  : item.href.includes('?')
                  ? pathname + (typeof window !== 'undefined' ? window.location.search : '') === item.href
                  : pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href) && !pathname?.startsWith('/cases/search'));

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12.5px] font-medium transition-all duration-120 relative',
                    collapsed && 'justify-center px-0',
                    isActive
                      ? 'text-[var(--accent)] font-semibold shadow-sm'
                      : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--glass-1)]'
                  )}
                  style={
                    isActive
                      ? {
                          background: 'var(--glass-2)',
                          border: '1px solid var(--accent-subtle)',
                        }
                      : {}
                  }
                >
                  <Icon size={15} strokeWidth={isActive ? 2 : 1.6} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {item.pulse && !collapsed && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[var(--success)] live-pulse-dot" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="flex items-center justify-center w-full py-1.5 rounded-md text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] hover:bg-[var(--surface-2)] transition-colors"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>
    </aside>
  );
}
