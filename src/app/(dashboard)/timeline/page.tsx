'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { openInspector } from '@/store/slices/uiSlice';
import { timelineEvents } from '@/mock';
import type { TimelineEvent } from '@/types';
import {
  Clock, FileText, FileCheck, Scan, User, Car, Building2,
  Network, Camera, FileStack, BarChart3, Phone, History,
  AlertTriangle, ShieldAlert, Dna, Banknote, Users, ClipboardCheck,
  ChevronRight, Filter
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  FileText, FileCheck, Scan, User, Car, Building2,
  Network, Camera, FileStack, BarChart3, Phone, History,
  AlertTriangle, ShieldAlert, Dna, Banknote, Users, ClipboardCheck,
};

export default function TimelinePage() {
  const dispatch = useAppDispatch();
  const case102Events = timelineEvents.filter((t) => t.caseId === 'CASE-102');

  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(case102Events[0]);

  const handleEventClick = (ev: TimelineEvent) => {
    setSelectedEvent(ev);
    if (ev.entityId && ev.entityType) {
      dispatch(openInspector({ id: ev.entityId, type: ev.entityType }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Investigation Chronology Ledger
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              CASE-102 Stream ({case102Events.length} events)
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Auditable minute-by-minute sequential log of intelligence ingestion, forensic updates, and analytical discoveries
          </p>
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vertical Timeline Track (8 cols) */}
        <div
          className="lg:col-span-8 p-6 rounded-xl border relative"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="relative border-l-2 ml-4 pl-6 space-y-6" style={{ borderColor: 'var(--border)' }}>
            {case102Events.map((ev, idx) => {
              const IconComponent = iconMap[ev.icon] || Clock;
              const isSelected = selectedEvent?.id === ev.id;

              return (
                <div
                  key={ev.id}
                  onClick={() => handleEventClick(ev)}
                  className="relative group cursor-pointer transition-all"
                >
                  {/* Circle dot on track */}
                  <span
                    className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-2 transition-transform group-hover:scale-125 flex items-center justify-center"
                    style={{
                      background: isSelected ? 'var(--accent)' : 'var(--surface-1)',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border-strong)',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>

                  <div
                    className="p-3.5 rounded-xl border transition-all"
                    style={{
                      background: isSelected ? 'var(--accent-muted)' : 'var(--surface-2)',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent size={14} className="text-[var(--accent)]" />
                        <span className="font-mono-id text-[12px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                          {ev.timestamp.replace('T', ' ')}
                        </span>
                        <span className="text-[10px] font-mono-id px-1.5 py-0.2 rounded bg-[var(--surface-1)] text-[var(--ink-tertiary)]">
                          {ev.type}
                        </span>
                      </div>
                      {ev.entityId && (
                        <span className="font-mono-id text-[11px] font-semibold text-[var(--accent)] hover:underline">
                          {ev.entityId} →
                        </span>
                      )}
                    </div>

                    <h3 className="text-[14px] font-semibold mt-1" style={{ color: 'var(--ink-primary)' }}>
                      {ev.title}
                    </h3>
                    <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                      {ev.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Event Inspector & Case Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedEvent && (
            <div
              className="p-5 rounded-xl border space-y-4 sticky top-[68px]"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
                  Selected Timeline Milestone
                </span>
                <span className="font-mono-id text-[12px] font-bold text-[var(--accent)]">
                  {selectedEvent.id}
                </span>
              </div>

              <div>
                <span className="font-mono-id text-[12px] text-[var(--ink-tertiary)]">
                  {selectedEvent.timestamp.replace('T', ' ')} IST
                </span>
                <h3 className="text-[16px] font-bold mt-1" style={{ color: 'var(--ink-primary)' }}>
                  {selectedEvent.title}
                </h3>
                <p className="text-[13px] mt-2 leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                  {selectedEvent.description}
                </p>
              </div>

              {selectedEvent.entityId && (
                <div className="p-3 rounded-lg border space-y-1 bg-[var(--surface-2)]" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)]">
                    Linked Intelligence Entity
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-id font-bold text-[var(--accent)]">
                      {selectedEvent.entityId}
                    </span>
                    <span className="text-[11px] font-medium" style={{ color: 'var(--ink-secondary)' }}>
                      {selectedEvent.entityType || 'Record'}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (selectedEvent.entityId && selectedEvent.entityType) {
                      dispatch(openInspector({ id: selectedEvent.entityId, type: selectedEvent.entityType }));
                    }
                  }}
                  className="w-full py-2 rounded-lg text-[13px] font-medium border flex items-center justify-center gap-1.5 hover:bg-[var(--surface-2)] transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--ink-primary)' }}
                >
                  <span>Open Linked Entity Context</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
