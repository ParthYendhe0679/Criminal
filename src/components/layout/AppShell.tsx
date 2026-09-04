'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandPalette from './CommandPalette';
import EntityInspector from '@/components/shared/EntityInspector';
import { useAppSelector } from '@/store/hooks';
import { usePathname } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/auth';

  if (isAuthPage) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-0)] text-[var(--ink-primary)]">
      <Sidebar />
      <Topbar />
      <CommandPalette />
      <EntityInspector />

      {/* Main content container with dynamic left margin matching sidebar */}
      <main
        className="flex-1 transition-all duration-200 ease-out pt-[48px]"
        style={{
          marginLeft: collapsed ? '56px' : '240px',
        }}
      >
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
