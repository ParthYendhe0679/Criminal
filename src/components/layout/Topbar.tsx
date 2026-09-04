'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleTheme, setCommandPaletteOpen } from '@/store/slices/uiSlice';
import { Search, Bell, Bot, Sun, Moon, Command, Radio, Shield, ChevronRight } from 'lucide-react';
import { mockAlertService } from '@/services/mockServices';
import NotificationsDrawer from './NotificationsDrawer';
import Link from 'next/link';

export default function Topbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const theme = useAppSelector((s) => s.ui.theme);
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);

  const [unreadAlerts, setUnreadAlerts] = useState(3);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('18:42:03');
  const [eventCount, setEventCount] = useState(1248);

  const isLiveMonitoring = pathname === '/monitoring';

  useEffect(() => {
    mockAlertService.getUnreadCount().then((cnt) => setUnreadAlerts(cnt > 0 ? cnt : 3));
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toTimeString().slice(0, 8));
      setEventCount((prev) => prev + Math.floor(Math.random() * 2));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = useCallback(() => {
    dispatch(setCommandPaletteOpen(true));
  }, [dispatch]);

  return (
    <>
      <header
        className="fixed top-0 right-0 z-30 h-[48px] flex items-center justify-between px-3.5 border-b transition-all duration-200 glass-panel"
        style={{
          left: collapsed ? '56px' : '240px',
          borderColor: 'var(--border)',
        }}
      >
        {/* Left Side: Search & Case Context */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-[12px] transition-colors hover:bg-[var(--glass-2)]"
            style={{ color: 'var(--ink-secondary)', border: '1px solid var(--border)' }}
          >
            <Search size={13} strokeWidth={1.7} />
            <span className="hidden sm:inline">Search intelligence, cases, entities...</span>
            <span className="sm:hidden">Search...</span>
            <span
              className="flex items-center gap-0.5 ml-2 text-[10px] font-mono-id px-1 py-0.2 rounded bg-[var(--surface-2)]"
              style={{ color: 'var(--ink-tertiary)' }}
            >
              <Command size={9} /> K
            </span>
          </button>

          {/* Active Flagship Case Link */}
          <Link
            href="/cases/CASE-102"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border hover:border-[var(--accent)] transition-colors"
            style={{
              background: 'var(--accent-muted)',
              borderColor: 'var(--accent-subtle)',
              color: 'var(--accent)',
            }}
          >
            <span className="font-mono-id font-bold">CASE-102</span>
            <span className="text-[var(--ink-tertiary)]">•</span>
            <span className="truncate max-w-[140px]" style={{ color: 'var(--ink-primary)' }}>
              XYZ Network
            </span>
          </Link>
        </div>

        {/* Right Side: Global Live Ticker, Notifications, Theme, User */}
        <div className="flex items-center gap-1.5">
          {/* Global Live System Status (Section 36 & 6) */}
          <Link
            href="/monitoring"
            className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg text-[11px] font-mono-id border transition-colors hover:bg-[var(--glass-2)]"
            style={{
              borderColor: isLiveMonitoring ? 'var(--accent)' : 'var(--border)',
              background: isLiveMonitoring ? 'var(--accent-muted)' : 'var(--glass-1)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[var(--success)] live-pulse-dot" />
            <span className="font-bold text-[var(--success)]">LIVE</span>
            <span className="text-[var(--ink-tertiary)]">|</span>
            <span style={{ color: 'var(--ink-secondary)' }}>Synthetic Stream</span>
            <span className="text-[var(--ink-tertiary)]">|</span>
            <span style={{ color: 'var(--ink-primary)' }}>{eventCount.toLocaleString()} events</span>
            <span className="text-[var(--ink-tertiary)]">{currentTime}</span>
          </Link>

          {/* Prototype Badge */}
          <div
            className="hidden lg:flex items-center px-2 py-0.5 rounded text-[10px] font-mono-id font-bold tracking-wider mr-1"
            style={{ background: 'var(--warning-muted)', color: '#D97706' }}
          >
            SYNTHETIC DATA
          </div>

          {/* Notifications Drawer Toggle */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--glass-2)] transition-colors"
            style={{ color: 'var(--ink-secondary)' }}
            title="Operational Notifications"
          >
            <Bell size={15} strokeWidth={1.8} />
            {unreadAlerts > 0 && (
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: 'var(--error)' }}
              />
            )}
          </button>

          {/* KRITAGAS AI Shortcut */}
          <button
            onClick={() => router.push('/ai')}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--glass-2)] transition-colors"
            style={{ color: 'var(--accent)' }}
            title="KRITAGAS AI Assistant"
          >
            <Bot size={16} strokeWidth={1.8} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--glass-2)] transition-colors"
            style={{ color: 'var(--ink-secondary)' }}
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={15} strokeWidth={1.8} /> : <Sun size={15} strokeWidth={1.8} />}
          </button>

          {/* Officer Profile Badge */}
          <div className="flex items-center gap-1.5 ml-1 pl-2 border-l" style={{ borderColor: 'var(--border)' }}>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
              style={{ background: 'var(--accent)' }}
            >
              RS
            </div>
            <span className="hidden xl:inline text-[11px] font-medium" style={{ color: 'var(--ink-secondary)' }}>
              DCP R. Sharma
            </span>
          </div>
        </div>
      </header>

      {/* Notifications Drawer Component */}
      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}
