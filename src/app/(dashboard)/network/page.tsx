'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { openInspector } from '@/store/slices/uiSlice';
import { selectEntity, setInvestigationCase } from '@/store/slices/investigationSlice';
import { networkNodes, networkEdges } from '@/mock';
import type { NetworkNode, NetworkEdge, EntityType } from '@/types';
import {
  Network as NetworkIcon, ZoomIn, ZoomOut, Maximize2, Filter,
  Layers, Search, Share2, HelpCircle, Shield, Activity, X, Info
} from 'lucide-react';
import { toast } from 'sonner';

export default function NetworkIntelligencePage() {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<any>(null);

  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<NetworkEdge | null>(null);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Centrality analytics for key entities
  const analytics: Record<string, { connections: number; centrality: number; betweenness: number; pageRank: number; label: string }> = {
    'PERSON-014': { connections: 15, centrality: 0.48, betweenness: 0.62, pageRank: 0.082, label: 'Potential coordination hub' },
    'PERSON-021': { connections: 12, centrality: 0.42, betweenness: 0.45, pageRank: 0.065, label: 'High investigative relevance' },
    'ORG-014': { connections: 14, centrality: 0.45, betweenness: 0.58, pageRank: 0.078, label: 'Primary corporate entity' },
    'PERSON-015': { connections: 7, centrality: 0.28, betweenness: 0.22, pageRank: 0.041, label: 'Secondary associate' },
    'PERSON-016': { connections: 6, centrality: 0.24, betweenness: 0.18, pageRank: 0.035, label: 'Regional node (Pune)' },
    'CASE-102': { connections: 18, centrality: 0.55, betweenness: 0.70, pageRank: 0.095, label: 'Investigation Nexus' },
  };

  useEffect(() => {
    let cyInstance: any;
    let isMounted = true;

    async function initCytoscape() {
      if (!containerRef.current) return;
      try {
        const cytoscape = (await import('cytoscape')).default;

        if (!isMounted) return;

        const elements = [
          ...networkNodes.map((n) => ({
            data: {
              id: n.id,
              label: n.label,
              type: n.type,
              color: getNodeColor(n.type),
            },
          })),
          ...networkEdges.map((e) => ({
            data: {
              id: e.id,
              source: e.source,
              target: e.target,
              relationship: e.relationship,
              confidence: e.confidence,
            },
          })),
        ];

        cyInstance = cytoscape({
          container: containerRef.current,
          elements,
          style: [
            {
              selector: 'node',
              style: {
                label: 'data(label)',
                'font-size': '11px',
                'font-family': 'Inter, sans-serif',
                color: '#18181B',
                'background-color': 'data(color)',
                width: 32,
                height: 32,
                'border-width': 2,
                'border-color': '#FFFFFF',
                'text-valign': 'bottom',
                'text-margin-y': 4,
                'text-wrap': 'ellipsis',
                'text-max-width': '80px',
              },
            },
            {
              selector: 'node:selected',
              style: {
                'border-color': '#5B5BD6',
                'border-width': 3,
                width: 38,
                height: 38,
              },
            },
            {
              selector: 'edge',
              style: {
                width: 1.5,
                'line-color': 'rgba(24,24,27,0.18)',
                'target-arrow-color': 'rgba(24,24,27,0.22)',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'arrow-scale': 0.8,
              },
            },
            {
              selector: 'edge:selected',
              style: {
                width: 3,
                'line-color': '#5B5BD6',
                'target-arrow-color': '#5B5BD6',
              },
            },
          ],
          layout: {
            name: 'cose',
            animate: false,
            nodeRepulsion: 8000,
            idealEdgeLength: 80,
          },
        });

        cyRef.current = cyInstance;

        cyInstance.on('tap', 'node', (evt: any) => {
          const nodeData = evt.target.data();
          const fullNode = networkNodes.find((n) => n.id === nodeData.id);
          if (fullNode) {
            setSelectedNode(fullNode);
            setSelectedEdge(null);
            dispatch(selectEntity({ id: fullNode.id, type: fullNode.type }));
            if (fullNode.type === 'Case') {
              dispatch(setInvestigationCase(fullNode.id));
            }
          }
        });

        cyInstance.on('tap', 'edge', (evt: any) => {
          const edgeData = evt.target.data();
          const fullEdge = networkEdges.find((e) => e.id === edgeData.id);
          if (fullEdge) {
            setSelectedEdge(fullEdge);
            setSelectedNode(null);
          }
        });

        cyInstance.on('tap', (evt: any) => {
          if (evt.target === cyInstance) {
            setSelectedNode(null);
            setSelectedEdge(null);
          }
        });
      } catch (err) {
        console.error('Cytoscape init error:', err);
      }
    }

    initCytoscape();

    return () => {
      isMounted = false;
      if (cyInstance) cyInstance.destroy();
    };
  }, []);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'Person': return '#3B82F6';
      case 'Organization': return '#8B5CF6';
      case 'Vehicle': return '#10B981';
      case 'Location': return '#F59E0B';
      case 'Evidence': return '#EC4899';
      case 'Case': return '#5B5BD6';
      case 'Transaction': return '#14B8A6';
      default: return '#6B7280';
    }
  };

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!cyRef.current || !q) return;
    const matched = cyRef.current.nodes().filter((n: any) =>
      n.data('label').toLowerCase().includes(q.toLowerCase()) ||
      n.data('id').toLowerCase().includes(q.toLowerCase())
    );
    if (matched.length > 0) {
      cyRef.current.center(matched);
      matched.select();
      const node = networkNodes.find((n) => n.id === matched.first().data('id'));
      if (node) setSelectedNode(node);
    }
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    if (!cyRef.current) return;
    if (type === 'all') {
      cyRef.current.elements().show();
    } else {
      cyRef.current.elements().hide();
      const matchingNodes = cyRef.current.nodes(`[type = "${type}"]`);
      matchingNodes.show();
      matchingNodes.connectedEdges().show();
      matchingNodes.neighborhood().show();
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Network Intelligence Graph
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              CASE-102 Ecosystem ({networkNodes.length} nodes, {networkEdges.length} edges)
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Multi-relational graph analysis, community clustering, and explainable relationship paths
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => {
            setSelectedEdge(networkEdges[2]); // PERSON-014 -> PERSON-021
            setExplanationOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-md text-[13px] font-medium border flex items-center gap-1.5 hover:bg-[var(--surface-2)] transition-colors"
          style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
        >
          <HelpCircle size={14} />
          <span>Why are PERSON-014 &amp; 021 Connected?</span>
        </button>
      </div>

      {/* Filter and Control Toolbar */}
      <div
        className="p-3 rounded-lg border flex flex-wrap items-center justify-between gap-3 text-[12px]"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Live search in graph */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Find entity in graph..."
              className="w-full h-8 px-3 py-1 rounded text-[12px] border bg-[var(--surface-0)] text-[var(--ink-primary)] outline-none focus:border-[var(--accent)]"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="h-8 px-2.5 py-1 rounded border text-[12px] bg-[var(--surface-1)] text-[var(--ink-secondary)] outline-none"
            style={{ borderColor: 'var(--border)' }}
          >
            <option value="all">All Entity Types</option>
            <option value="Person">People</option>
            <option value="Organization">Organizations</option>
            <option value="Vehicle">Vehicles</option>
            <option value="Location">Locations</option>
            <option value="Evidence">Evidence</option>
            <option value="Transaction">Transactions</option>
          </select>
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-1">
          <button onClick={handleZoomIn} className="p-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--ink-secondary)]" title="Zoom in">
            <ZoomIn size={16} />
          </button>
          <button onClick={handleZoomOut} className="p-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--ink-secondary)]" title="Zoom out">
            <ZoomOut size={16} />
          </button>
          <button onClick={handleFit} className="p-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--ink-secondary)]" title="Fit to view">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Graph Viewport with Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Cytoscape Container (8 cols or 12 cols if no node selected) */}
        <div
          className="lg:col-span-8 rounded-xl border relative overflow-hidden h-[620px]"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          {/* Cytoscape DOM container */}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Graph Legend overlay */}
          <div
            className="absolute bottom-3 left-3 p-2.5 rounded-lg border text-[11px] space-y-1 bg-[var(--surface-1)]/90 backdrop-blur pointer-events-none"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="font-semibold text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--ink-tertiary)' }}>
              Node Types
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Person</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Organization</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Vehicle</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Location</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" /> Evidence</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#5B5BD6]" /> Case</span>
            </div>
          </div>
        </div>

        {/* Right Graph Inspector & Analytics (4 cols) */}
        <div
          className="lg:col-span-4 p-4 rounded-xl border flex flex-col justify-between h-[620px] overflow-y-auto"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          {selectedNode ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded" style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}>
                  {selectedNode.type} Details
                </span>
                <span className="text-[11px] font-mono-id" style={{ color: 'var(--ink-tertiary)' }}>{selectedNode.id}</span>
              </div>

              <div>
                <h3 className="text-[16px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                  {selectedNode.label}
                </h3>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--ink-secondary)' }}>
                  {analytics[selectedNode.id]?.label || 'Active investigative entity node'}
                </p>
              </div>

              {/* Centrality Metrics */}
              {analytics[selectedNode.id] && (
                <div className="p-3 rounded-lg border space-y-2 text-[12px]" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold text-[11px] uppercase tracking-wider" style={{ color: 'var(--ink-tertiary)' }}>
                    Network Centrality Analytics
                  </h4>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--ink-secondary)' }}>Connection Count:</span>
                    <span className="font-mono-id font-bold text-[var(--accent)]">{analytics[selectedNode.id].connections} edges</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--ink-secondary)' }}>Degree Centrality:</span>
                    <span className="font-mono-id font-bold">{analytics[selectedNode.id].centrality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--ink-secondary)' }}>Betweenness:</span>
                    <span className="font-mono-id font-bold">{analytics[selectedNode.id].betweenness}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--ink-secondary)' }}>PageRank Score:</span>
                    <span className="font-mono-id font-bold">{analytics[selectedNode.id].pageRank}</span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => dispatch(openInspector({ id: selectedNode.id, type: selectedNode.type }))}
                  className="w-full py-2 rounded-lg text-[13px] font-medium border flex items-center justify-center gap-1.5 hover:bg-[var(--surface-2)] transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--ink-primary)' }}
                >
                  <span>Open Full Entity Profile</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedEdge(networkEdges.find((e) => e.source === selectedNode.id || e.target === selectedNode.id) || null);
                    setExplanationOpen(true);
                  }}
                  className="w-full py-2 rounded-lg text-[13px] font-medium border flex items-center justify-center gap-1.5 hover:bg-[var(--surface-2)] transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
                >
                  <span>Explain Connected Paths</span>
                </button>
              </div>
            </div>
          ) : selectedEdge ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded" style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}>
                  Relationship Edge
                </span>
                <span className="text-[11px] font-mono-id" style={{ color: 'var(--ink-tertiary)' }}>{selectedEdge.id}</span>
              </div>

              <div>
                <h3 className="text-[15px] font-bold font-mono-id" style={{ color: 'var(--ink-primary)' }}>
                  {selectedEdge.source} → {selectedEdge.relationship} → {selectedEdge.target}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>Confidence:</span>
                  <span className="text-[13px] font-mono-id font-bold text-[var(--accent)]">{selectedEdge.confidence}%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border text-[12px] space-y-1.5" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                <span className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--ink-tertiary)' }}>
                  Evidentiary Basis
                </span>
                {selectedEdge.evidenceBasis.map((eb) => (
                  <div key={eb} className="font-mono-id text-[var(--accent)] hover:underline cursor-pointer"
                    onClick={() => dispatch(openInspector({ id: eb, type: 'Evidence' }))}>
                    • {eb}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setExplanationOpen(true)}
                className="w-full py-2 rounded-lg text-[13px] font-medium text-white shadow-sm transition-all hover:opacity-90"
                style={{ background: 'var(--accent)' }}
              >
                Why Are They Connected?
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Activity size={32} className="text-[var(--ink-tertiary)] mb-2" />
              <h4 className="text-[14px] font-medium" style={{ color: 'var(--ink-primary)' }}>
                Select Node or Edge
              </h4>
              <p className="text-[12px] mt-1" style={{ color: 'var(--ink-secondary)' }}>
                Click any person, vehicle, organization, or relationship edge in the graph to inspect centrality scores, connection basis, and explainable links.
              </p>
            </div>
          )}

          {/* Safety Notice */}
          <div className="p-2.5 rounded text-[11px] border flex gap-1.5 mt-auto"
            style={{ background: 'var(--warning-muted)', borderColor: 'rgba(245,158,11,0.2)', color: '#B45309' }}>
            <Shield size={14} className="shrink-0 mt-0.5" />
            <span>
              Graph centrality scores indicate structural network connectivity, not judicial culpability.
            </span>
          </div>
        </div>
      </div>

      {/* EXPLAINABLE RELATIONSHIP MODAL / DRAWER (Section 19: WHY ARE THEY CONNECTED?) */}
      {explanationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
          onClick={() => setExplanationOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[600px] max-w-full rounded-xl border shadow-2xl p-5 space-y-4 animate-slide-in-up"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border-strong)' }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <Share2 size={16} className="text-[var(--accent)]" />
                <h3 className="text-[16px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                  Why Are They Connected?
                </h3>
              </div>
              <button onClick={() => setExplanationOpen(false)} className="p-1 rounded hover:bg-[var(--surface-2)]">
                <X size={16} />
              </button>
            </div>

            {/* Path visualization */}
            <div className="p-3 rounded-lg border flex items-center justify-between font-mono-id text-[13px]"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <span className="font-bold text-[var(--ink-primary)]">PERSON-014 (Aarav Mehta)</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[var(--accent-muted)] text-[var(--accent)] font-semibold">
                ASSOCIATED_WITH
              </span>
              <span className="font-bold text-[var(--ink-primary)]">PERSON-021 (Vikram Sharma)</span>
            </div>

            {/* Confidence Badge */}
            <div className="flex items-center justify-between text-[13px]">
              <span style={{ color: 'var(--ink-secondary)' }}>Relationship Confidence:</span>
              <span className="font-mono-id font-bold text-[15px] text-[var(--accent)]">82% Verified Lead</span>
            </div>

            {/* Narrative Explanation */}
            <div className="p-3 rounded-lg text-[13px] leading-relaxed border"
              style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--ink-primary)' }}>
              Both entities appear as registered directors of <strong>Nexus Trading Corp (ORG-014)</strong>. Forensic accounting in CASE-102 established ₹4.7 Crore of routed transactions between company accounts and associated shell entities. Additional co-presence observed at Juhu office and documented communication via CDR logs.
            </div>

            {/* Evidence & Case References */}
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div className="p-3 rounded-lg border space-y-1" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--ink-tertiary)' }}>
                  Evidence Basis (3 Items)
                </span>
                <div className="space-y-0.5 font-mono-id text-[var(--accent)]">
                  <div>• EVIDENCE-045 (Registration)</div>
                  <div>• EVIDENCE-049 (Financial Report)</div>
                  <div>• EVIDENCE-056 (Phone CDR)</div>
                </div>
              </div>

              <div className="p-3 rounded-lg border space-y-1" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: 'var(--ink-tertiary)' }}>
                  Shared Context
                </span>
                <div className="space-y-0.5">
                  <div>• Cases: <strong>CASE-102, CASE-087</strong></div>
                  <div>• Organization: <strong>Nexus Trading</strong></div>
                  <div>• Location: <strong>Juhu Tara Road</strong></div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setExplanationOpen(false)}
                className="px-4 py-2 rounded-lg text-[13px] font-medium bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-colors"
                style={{ color: 'var(--ink-primary)' }}
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
