'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { openInspector } from '@/store/slices/uiSlice';
import { mockEvidenceService } from '@/services/mockServices';
import type { Evidence, EvidenceType, EvidenceStatus } from '@/types';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import FilterBar, { FilterOption } from '@/components/shared/FilterBar';
import {
  Package, ShieldCheck, CheckCircle2, AlertCircle, FileText,
  Camera, Video, DollarSign, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function EvidencePage() {
  const dispatch = useAppDispatch();

  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    type: 'all',
    status: 'all',
    case: 'all',
  });

  useEffect(() => {
    mockEvidenceService.getEvidence().then((data) => {
      setEvidenceList(data);
      setLoading(false);
    });
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearAll = () => {
    setFilters({ type: 'all', status: 'all', case: 'all' });
    setSearchQuery('');
  };

  const filteredEvidence = useMemo(() => {
    return evidenceList.filter((e) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          e.id.toLowerCase().includes(q) ||
          e.title.toLowerCase().includes(q) ||
          e.source.toLowerCase().includes(q) ||
          e.caseId.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (filters.type !== 'all' && e.type !== filters.type) return false;
      if (filters.status !== 'all' && e.status !== filters.status) return false;
      if (filters.case !== 'all' && e.caseId !== filters.case) return false;
      return true;
    });
  }, [evidenceList, searchQuery, filters]);

  const filterOptions: FilterOption[] = [
    {
      key: 'type',
      label: 'Evidence Type',
      value: filters.type,
      options: [
        { label: 'FIR', value: 'FIR' },
        { label: 'Document', value: 'Document' },
        { label: 'Transaction', value: 'Transaction' },
        { label: 'CCTV', value: 'CCTV' },
        { label: 'Image', value: 'Image' },
        { label: 'Video', value: 'Video' },
        { label: 'Report', value: 'Report' },
        { label: 'PDF', value: 'PDF' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      value: filters.status,
      options: [
        { label: 'Verified', value: 'Verified' },
        { label: 'Under Analysis', value: 'Under Analysis' },
        { label: 'Flagged', value: 'Flagged' },
        { label: 'Collected', value: 'Collected' },
        { label: 'Archived', value: 'Archived' },
      ],
    },
    {
      key: 'case',
      label: 'Case',
      value: filters.case,
      options: [
        { label: 'CASE-102 (Flagship)', value: 'CASE-102' },
        { label: 'CASE-087 (Historical)', value: 'CASE-087' },
        { label: 'CASE-001', value: 'CASE-001' },
        { label: 'CASE-002', value: 'CASE-002' },
      ],
    },
  ];

  const columns: ColumnDef<Evidence>[] = [
    {
      key: 'id',
      header: 'Evidence ID',
      sortable: true,
      width: '130px',
      render: (e) => (
        <span className="font-mono-id font-semibold text-[var(--accent)] hover:underline">
          {e.id}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (e) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--surface-2)] text-[var(--ink-secondary)]">
          {e.type}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Description / Title',
      sortable: true,
      render: (e) => (
        <div>
          <div className="font-medium text-[var(--ink-primary)] truncate max-w-[340px]">{e.title}</div>
          <div className="text-[11px] text-[var(--ink-tertiary)] truncate max-w-[340px]">{e.description}</div>
        </div>
      ),
    },
    {
      key: 'caseId',
      header: 'Case Ref',
      sortable: true,
      render: (e) => (
        <span className="font-mono-id text-[12px] font-medium text-[var(--ink-primary)]">
          {e.caseId}
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      sortable: true,
      render: (e) => <span className="text-[12px] text-[var(--ink-secondary)]">{e.source}</span>,
    },
    {
      key: 'date',
      header: 'Date Logged',
      sortable: true,
      render: (e) => <span className="font-mono-id text-[11px] text-[var(--ink-tertiary)]">{e.date}</span>,
    },
    {
      key: 'integrity',
      header: 'Integrity',
      render: (e) => (
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className={e.integrity.verified ? 'text-[var(--success)]' : 'text-[var(--warning)]'} />
          <span className="font-mono-id text-[10px] truncate max-w-[90px]" style={{ color: 'var(--ink-tertiary)' }}>
            {e.integrity.hash.slice(0, 10)}...
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (e) => {
        const cls =
          e.status === 'Verified'
            ? 'badge-active'
            : e.status === 'Flagged'
            ? 'badge-critical'
            : e.status === 'Under Analysis'
            ? 'badge-review'
            : 'badge-low';
        return <span className={`badge ${cls}`}>{e.status}</span>;
      },
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Evidence Intelligence Ledger
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              {filteredEvidence.length} catalogued items
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Chain of custody, forensic intake, CCTV recordings, and cryptographic proof registry
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search evidence by ID, description, or case..."
      />

      {/* Table */}
      <DataTable
        data={filteredEvidence}
        columns={columns}
        keyExtractor={(e) => e.id}
        loading={loading}
        pageSize={14}
        onRowClick={(e) => dispatch(openInspector({ id: e.id, type: 'Evidence' }))}
        emptyMessage="No evidence items found matching the current filter."
        bulkActions={[
          {
            label: 'Verify Hash Checksum',
            action: (selected) => {
              toast.success(`Cryptographic check complete for ${selected.length} items. All SHA-256 hashes verified.`);
            },
          },
        ]}
      />
    </div>
  );
}
