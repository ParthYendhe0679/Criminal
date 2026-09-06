'use client';

import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandPalette from './CommandPalette';
import EntityInspector from '@/components/shared/EntityInspector';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setRole, getStoredRole } from '@/store/slices/uiSlice';
import { usePathname } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const isAuthPage = pathname === '/login' || pathname === '/auth' || pathname === '/';

  // Hydrate role from localStorage on client
  useEffect(() => {
    const stored = getStoredRole();
    dispatch(setRole(stored));
  }, [dispatch]);

  if (isAuthPage) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  const sidebarWidth = collapsed ? 'var(--sidebar-collapsed-width, 68px)' : 'var(--sidebar-width, 272px)';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-0)] text-[var(--ink-primary)]">
      <Sidebar />
      <Topbar />
      <CommandPalette />
      <EntityInspector />

      {/* Main content area */}
      <main
        className="flex-1 transition-all duration-200 ease-out"
        style={{
          marginLeft: collapsed ? 'var(--sidebar-collapsed-width, 68px)' : 'var(--sidebar-width, 272px)',
          paddingTop: 'var(--topbar-height, 60px)',
        }}
      >
        <div className="min-h-full px-6 py-6 max-w-[1680px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
