'use client';

import React, { useState } from 'react';
import { hotspotData } from '@/mock';
import type { HotspotData } from '@/types';
import {
  MapPin, Flame, Filter, ChevronRight, Layers, Shield,
  ArrowUpRight, AlertTriangle, Eye, X
} from 'lucide-react';
import { toast } from 'sonner';

export default function CrimeHotspotsPage() {
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCrime, setSelectedCrime] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<HotspotData | null>(hotspotData[0]);

  const filteredHotspots = hotspotData.filter((h) => {
    if (selectedState !== 'all' && h.state !== selectedState) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Crime Hotspot Clusters &amp; Territorial Density
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              KDE Density Matrix
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Geographic incident clustering hierarchy: National → State → City → Area
          </p>
        </div>
      </div>

      {/* Jurisdictional Hierarchy Breadcrumbs */}
      <div
        className="p-3 rounded-xl border flex flex-wrap items-center gap-2 text-[12px] font-medium"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
      >
        <span className="font-semibold" style={{ color: 'var(--ink-primary)' }}>Jurisdiction Hierarchy:</span>
        <span className="text-[var(--accent)] font-bold">India</span>
        <ChevronRight size={14} className="text-[var(--ink-tertiary)]" />
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="h-7 px-2 rounded border bg-[var(--surface-2)] text-[var(--ink-primary)] outline-none"
          style={{ borderColor: 'var(--border)' }}
        >
          <option value="all">All States</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Delhi">Delhi NCR</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Telangana">Telangana</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
        </select>
        <ChevronRight size={14} className="text-[var(--ink-tertiary)]" />
        <span style={{ color: 'var(--ink-secondary)' }}>All Municipal Precincts</span>
      </div>

      {/* Main Grid: Hotspot Cards List & Selected Area Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hotspots List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredHotspots.map((hs) => {
            const isSelected = selectedArea?.id === hs.id;
            return (
              <div
                key={hs.id}
                onClick={() => setSelectedArea(hs)}
                className="p-4 rounded-xl border cursor-pointer transition-all hover:border-[var(--accent)]"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-id font-bold text-[13px] text-[var(--accent)]">
                        {hs.id}
                      </span>
                      <span className="text-[11px]" style={{ color: 'var(--ink-tertiary)' }}>
                        {hs.city}, {hs.state}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.2 rounded uppercase"
                        style={{
                          background: hs.severity === 'Critical' ? 'var(--error-muted)' : 'var(--warning-muted)',
                          color: hs.severity === 'Critical' ? '#DC2626' : '#B45309',
                        }}
                      >
                        {hs.severity} Hotspot
                      </span>
                    </div>

                    <h3 className="text-[16px] font-bold mt-1" style={{ color: 'var(--ink-primary)' }}>
                      {hs.area}
                    </h3>
                    <div className="text-[12px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
                      {hs.recentFIRs} recent FIR registrations • 30-day trend: {hs.trend}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[22px] font-bold font-mono-id text-[var(--error)]">
                      {hs.crimeCount}
                    </div>
                    <div className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)]">
                      Logged Incidents
                    </div>
                  </div>
                </div>

                {/* Crime Breakdown Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  {hs.crimeTypes.map((ct) => (
                    <span
                      key={ct.type}
                      className="px-2 py-0.5 rounded text-[11px] font-mono-id bg-[var(--surface-2)] text-[var(--ink-secondary)]"
                    >
                      {ct.type}: {ct.count}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Area Intelligence Inspector (5 cols) */}
        <div className="lg:col-span-5">
          {selectedArea && (
            <div
              className="p-5 rounded-xl border space-y-4 sticky top-[68px]"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)]">
                  Area Intelligence Inspector
                </span>
                <span className="font-mono-id text-[12px] font-bold text-[var(--accent)]">
                  {selectedArea.id}
                </span>
              </div>

              <div>
                <h3 className="text-[18px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                  {selectedArea.area}, {selectedArea.city}
                </h3>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
                  Territory under jurisdiction of {selectedArea.state} Police
                </p>
                <div className="text-[11px] font-mono-id text-[var(--ink-tertiary)] mt-1">
                  Centroid: [{selectedArea.coordinates.join(', ')}]
                </div>
              </div>

              {/* Density Meter */}
              <div className="p-3.5 rounded-lg border space-y-2 text-[12px]" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                <div className="flex justify-between font-semibold">
                  <span>Relative Density Index:</span>
                  <span className="font-mono-id text-[var(--error)]">
                    {selectedArea.severity === 'Critical' ? '92/100 (Severe)' : '74/100 (Elevated)'}
                  </span>
                </div>
                <div className="w-full bg-[var(--surface-3)] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--error)]"
                    style={{ width: selectedArea.severity === 'Critical' ? '92%' : '74%' }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[var(--ink-tertiary)]">
                  <span>City Mean: 24 incidents</span>
                  <span>Hotspot: {selectedArea.crimeCount} incidents</span>
                </div>
              </div>

              {/* Crime Type Breakdown List */}
              <div className="space-y-2 text-[12px]">
                <h4 className="font-semibold text-[11px] uppercase tracking-wider text-[var(--ink-tertiary)]">
                  Prevalent Crime Distribution
                </h4>
                {selectedArea.crimeTypes.map((ct) => (
                  <div key={ct.type} className="flex justify-between items-center py-1 border-b" style={{ borderColor: 'var(--border)' }}>
                    <span className="font-medium" style={{ color: 'var(--ink-primary)' }}>{ct.type}</span>
                    <span className="font-mono-id font-bold text-[var(--accent)]">{ct.count} cases</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => toast.success(`Area intelligence dossier generated for ${selectedArea.area}`)}
                  className="w-full py-2 rounded-lg text-[13px] font-medium text-white shadow-sm hover:opacity-90 transition-all"
                  style={{ background: 'var(--accent)' }}
                >
                  Generate Precinct Intelligence Dossier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
