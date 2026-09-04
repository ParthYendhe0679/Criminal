'use client';

import React, { useState, useMemo } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { openInspector } from '@/store/slices/uiSlice';
import { setSelectedLocation, selectEntity, setInvestigationCase } from '@/store/slices/investigationSlice';
import { locations, cases, people, vehicles, firs, hotspotData } from '@/mock';
import type { Location } from '@/types';
import {
  MapPin, Search, Filter, Layers, Navigation, ZoomIn, ZoomOut,
  Maximize2, Eye, Shield, Camera, Car, AlertTriangle, X, Radio,
  FolderOpen, Flame, History, Check
} from 'lucide-react';
import { toast } from 'sonner';

export default function MapIntelligencePage() {
  const dispatch = useAppDispatch();

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightEntity, setHighlightEntity] = useState<string>('all');
  const [selectedLocation, setSelectedLoc] = useState<Location | null>(locations[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showLayersMenu, setShowLayersMenu] = useState(false);

  // Multi-layer toggle states (Section 9 & 42)
  const [layers, setLayers] = useState({
    crimeIncidents: true,
    firLocations: true,
    caseLocations: true,
    people: true,
    vehicles: true,
    cctv: true,
    historicalCases: true,
    watchlist: true,
    liveObservations: true,
    hotspots: true,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter locations based on queries & active entity highlight
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      if (selectedCity !== 'all' && loc.city !== selectedCity) return false;
      if (selectedType !== 'all' && loc.type !== selectedType) return false;
      if (highlightEntity === 'PERSON-014' && !loc.personIds.includes('PERSON-014')) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          loc.name.toLowerCase().includes(q) ||
          loc.address.toLowerCase().includes(q) ||
          loc.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCity, selectedType, highlightEntity, searchQuery]);

  // Coordinate normalization for SVG map projection
  const projectCoordinates = (coords: [number, number], width: number, height: number) => {
    const [lat, lng] = coords;
    const minLat = 12.0;
    const maxLat = 29.5;
    const minLng = 72.0;
    const maxLng = 89.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * (width - 80) + 40;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (height - 80) + 40;
    return { x, y };
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'Crime Scene': return '#EF4444';
      case 'Business': return '#8B5CF6';
      case 'Residence': return '#3B82F6';
      case 'Observation Point': return '#F59E0B';
      default: return '#5B5BD6';
    }
  };

  const handleSelectLocation = (loc: Location) => {
    setSelectedLoc(loc);
    dispatch(setSelectedLocation(loc.id));
    if (loc.caseIds.length > 0) {
      dispatch(setInvestigationCase(loc.caseIds[0]));
    }
  };

  return (
    <div className="space-y-4 animate-fade-in max-w-[1560px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Geospatial Intelligence Map &amp; Tactical Grid
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              Full-Workspace Intelligence Canvas
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Interactive multi-layer tracking of crime scenes, FIR registries, ANPR sightings, CCTV nodes, and suspect residences
          </p>
        </div>

        {/* Quick highlight entity shortcut */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = highlightEntity === 'PERSON-014' ? 'all' : 'PERSON-014';
              setHighlightEntity(next);
              if (next === 'PERSON-014') {
                dispatch(selectEntity({ id: 'PERSON-014', type: 'Person' }));
                toast.info('Map filtered and centered on PERSON-014 (Aarav Mehta)');
              } else {
                toast.info('Showing all jurisdictional coordinates');
              }
            }}
            className="px-3.5 py-1.5 rounded-xl text-[12.5px] font-semibold border flex items-center gap-1.5 transition-all glass-panel"
            style={{
              borderColor: highlightEntity === 'PERSON-014' ? 'var(--accent)' : 'var(--border)',
              background: highlightEntity === 'PERSON-014' ? 'var(--accent-muted)' : 'var(--glass-1)',
              color: highlightEntity === 'PERSON-014' ? 'var(--accent)' : 'var(--ink-secondary)',
            }}
          >
            <Eye size={14} />
            <span>{highlightEntity === 'PERSON-014' ? 'Clear POI Filter' : 'Focus PERSON-014 Locations'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div
        className="p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-[12px] glass-panel"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coordinates, address or entity..."
              className="w-full h-8 px-3 py-1 rounded-lg text-[12px] border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none focus:border-[var(--accent)]"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="h-8 px-2.5 py-1 rounded-lg border text-[12px] bg-[var(--surface-1)] text-[var(--ink-secondary)] outline-none"
            style={{ borderColor: 'var(--border)' }}
          >
            <option value="all">City: All Jurisdictions</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
            <option value="Delhi">Delhi</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Chennai">Chennai</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-8 px-2.5 py-1 rounded-lg border text-[12px] bg-[var(--surface-1)] text-[var(--ink-secondary)] outline-none"
            style={{ borderColor: 'var(--border)' }}
          >
            <option value="all">Category: All Types</option>
            <option value="Crime Scene">Crime Scene</option>
            <option value="Business">Business / Office</option>
            <option value="Residence">Residence</option>
            <option value="Observation Point">Observation Point</option>
          </select>

          {/* Layers Toggle Button */}
          <div className="relative">
            <button
              onClick={() => setShowLayersMenu(!showLayersMenu)}
              className="h-8 px-3 py-1 rounded-lg border flex items-center gap-1.5 font-medium hover:bg-[var(--glass-2)] text-[var(--ink-secondary)]"
              style={{ borderColor: 'var(--border)' }}
            >
              <Layers size={13} />
              <span>Map Layers (10)</span>
            </button>

            {/* Floating Layers Dropdown */}
            {showLayersMenu && (
              <div
                className="absolute left-0 top-10 z-50 w-64 p-3 rounded-xl border shadow-xl space-y-1.5 glass-panel-elevated"
                style={{ borderColor: 'var(--border-strong)' }}
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-tertiary)] border-b pb-1">
                  Active Intelligence Layers
                </div>
                {Object.entries(layers).map(([key, val]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between text-[12px] p-1 rounded hover:bg-[var(--glass-1)] cursor-pointer"
                  >
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={() => toggleLayer(key as any)}
                      className="accent-[var(--accent)]"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2))} className="p-1.5 rounded hover:bg-[var(--surface-2)]">
            <ZoomIn size={15} />
          </button>
          <button onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))} className="p-1.5 rounded hover:bg-[var(--surface-2)]">
            <ZoomOut size={15} />
          </button>
          <button onClick={() => setZoomLevel(1)} className="p-1.5 rounded hover:bg-[var(--surface-2)]">
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Full-Workspace Map Grid View with Floating Inspector (8 cols map + 4 cols inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Tactical Canvas */}
        <div
          className="lg:col-span-8 rounded-2xl border relative overflow-hidden h-[640px] select-none glass-panel"
          style={{ background: '#0D0E12', borderColor: 'var(--border)' }}
        >
          <svg className="w-full h-full" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 200ms ease-out' }}>
            <defs>
              <pattern id="fullGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#fullGrid)" />

            {/* Highway Corridors */}
            <path d="M 120 420 Q 220 380 280 200 T 360 80" fill="none" stroke="rgba(91,91,214,0.18)" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 120 420 L 160 460 L 320 540" fill="none" stroke="rgba(91,91,214,0.18)" strokeWidth="2" strokeDasharray="4 4" />

            {/* Render Location Markers */}
            {filteredLocations.map((loc) => {
              const { x, y } = projectCoordinates(loc.coordinates, 800, 640);
              const isSelected = selectedLocation?.id === loc.id;
              const hasPoi = loc.personIds.includes('PERSON-014');
              const color = getMarkerColor(loc.type);

              return (
                <g key={loc.id} className="cursor-pointer transition-transform" onClick={() => handleSelectLocation(loc)}>
                  {hasPoi && (
                    <circle cx={x} cy={y} r={18} fill="rgba(239, 68, 68, 0.2)" className="animate-ping" />
                  )}
                  {isSelected && (
                    <circle cx={x} cy={y} r={14} fill="rgba(91,91,214,0.25)" />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 8 : hasPoi ? 7 : 5}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  <text
                    x={x}
                    y={y - 10}
                    fill={isSelected ? '#FFFFFF' : '#A1A1AA'}
                    fontSize={isSelected ? '11' : '9'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {loc.name.split(',')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Glass Legend Overlay */}
          <div
            className="absolute bottom-3 left-3 p-3 rounded-xl border text-[11px] space-y-1.5 glass-panel text-[var(--ink-secondary)]"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <div className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)]">Map Legend</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Crime Scene</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Business / Office</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Residence</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Observation Point</div>
          </div>
        </div>

        {/* Selected Location Glass Inspector (4 cols) */}
        <div className="lg:col-span-4">
          {selectedLocation ? (
            <div
              className="p-5 rounded-2xl border space-y-5 h-[640px] flex flex-col justify-between overflow-y-auto glass-panel-elevated"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <span className="font-mono-id font-bold text-[12px] text-[var(--accent)]">{selectedLocation.id}</span>
                    <h3 className="text-[16px] font-bold mt-0.5" style={{ color: 'var(--ink-primary)' }}>{selectedLocation.name}</h3>
                  </div>
                  <span className="badge badge-active">{selectedLocation.type}</span>
                </div>

                <div className="space-y-1 text-[12px]">
                  <span className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)]">Physical Address</span>
                  <p className="font-medium" style={{ color: 'var(--ink-primary)' }}>{selectedLocation.address}, {selectedLocation.city}</p>
                </div>

                <div className="p-3 rounded-xl border bg-[var(--surface-0)] font-mono-id text-[11px] space-y-1" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-[10px] text-[var(--ink-tertiary)] uppercase font-semibold">GPS Telemetry</div>
                  <div className="text-[var(--accent)] font-bold">{selectedLocation.coordinates[0]}° N, {selectedLocation.coordinates[1]}° E</div>
                </div>

                {/* Linked POIs at this coordinate */}
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)] block mb-1.5">
                    Associated Suspects &amp; Entities ({selectedLocation.personIds.length})
                  </span>
                  <div className="space-y-1.5">
                    {selectedLocation.personIds.map((pid) => (
                      <div
                        key={pid}
                        onClick={() => dispatch(openInspector({ id: pid, type: 'Person' }))}
                        className="p-2.5 rounded-lg border text-[12px] flex items-center justify-between hover:bg-[var(--accent-muted)] cursor-pointer glass-panel"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <span className="font-mono-id font-bold text-[var(--accent)]">{pid}</span>
                        <span className="text-[11px] text-[var(--ink-secondary)]">Inspect Dossier →</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connected Investigation Cases */}
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[var(--ink-tertiary)] block mb-1.5">
                    Active Case Associations ({selectedLocation.caseIds.length})
                  </span>
                  <div className="space-y-1.5">
                    {selectedLocation.caseIds.map((cid) => (
                      <div
                        key={cid}
                        onClick={() => dispatch(openInspector({ id: cid, type: 'Case' }))}
                        className="p-2.5 rounded-lg border text-[12px] flex items-center justify-between hover:bg-[var(--accent-muted)] cursor-pointer glass-panel"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <span className="font-mono-id font-bold text-[var(--accent)]">{cid}</span>
                        <span className="text-[11px] text-[var(--ink-secondary)]">Open Workspace →</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => dispatch(openInspector({ id: selectedLocation.id, type: 'Location' }))}
                  className="w-full py-2.5 rounded-xl text-[12px] font-semibold text-white shadow-sm flex items-center justify-center gap-1.5 hover:opacity-90"
                  style={{ background: 'var(--accent)' }}
                >
                  <span>Detailed Location Inspection</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border rounded-2xl glass-panel h-[640px] flex items-center justify-center text-[var(--ink-tertiary)]">
              Select a geospatial coordinate on the map to inspect telemetry
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
