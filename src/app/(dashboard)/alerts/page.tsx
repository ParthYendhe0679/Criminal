'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { openInspector } from '@/store/slices/uiSlice';
import { mockAlertService } from '@/services/mockServices';
import type { Alert, AlertSeverity, AlertType } from '@/types';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import FilterBar, { FilterOption } from '@/components/shared/FilterBar';
import {
  Bell, AlertTriangle, CheckCircle2, Shield, Info,
  Check, Eye, ExternalLink, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export default function AlertsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [alertsList, setAlertsList] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ [key: string]: string }>({
    severity: 'all',
    type: 'all',
    status: 'all',
  });

  useEffect(() => {
    mockAlertService.getAlerts().then((data) => {
      setAlertsList(data);
      setLoading(false);
    });
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearAll = () => {
    setFilters({ severity: 'all', type: 'all', status: 'all' });
    setSearchQuery('');
  };

  const filteredAlerts = useMemo(() => {
    return alertsList.filter((a) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.caseId.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (filters.severity !== 'all' && a.severity !== filters.severity) return false;
      if (filters.type !== 'all' && a.type !== filters.type) return false;
      if (filters.status === 'unread' && a.read) return false;
      if (filters.status === 'unresolved' && a.resolved) return false;
      return true;
    });
  }, [alertsList, searchQuery, filters]);

  const handleResolveAlert = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlertsList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true, read: true } : a))
    );
    toast.success(`Alert ${id} marked as resolved.`);
  };

  const filterOptions: FilterOption[] = [
    {
      key: 'severity',
      label: 'Severity',
      value: filters.severity,
      options: [
        { label: 'High Priority', value: 'High Priority' },
        { label: 'Review', value: 'Review' },
        { label: 'Info', value: 'Info' },
      ],
    },
    {
      key: 'type',
      label: 'Alert Type',
      value: filters.type,
      options: [
        { label: 'Network Relationship', value: 'Network Relationship' },
        { label: 'Evidence Contradiction', value: 'Evidence Contradiction' },
        { label: 'Historical Match', value: 'Historical Match' },
        { label: 'Anomaly Detected', value: 'Anomaly Detected' },
        { label: 'New FIR Connection', value: 'New FIR Connection' },
        { label: 'CCTV Observation', value: 'CCTV Observation' },
        { label: 'Watchlist Event', value: 'Watchlist Event' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      value: filters.status,
      options: [
        { label: 'Unread Only', value: 'unread' },
        { label: 'Unresolved Only', value: 'unresolved' },
      ],
    },
  ];

  const columns: ColumnDef<Alert>[] = [
    {
      key: 'id',
      header: 'Alert ID',
      sortable: true,
      width: '110px',
      render: (a) => (
        <span className="font-mono-id font-bold text-[var(--accent)] hover:underline">
          {a.id}
        </span>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      render: (a) => {
        const bg =
          a.severity === 'High Priority'
            ? 'var(--error-muted)'
            : a.severity === 'Review'
            ? 'var(--warning-muted)'
            : 'var(--info-muted)';
        const color =
          a.severity === 'High Priority'
            ? '#DC2626'
            : a.severity === 'Review'
            ? '#D97706'
            : '#2563EB';
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase" style={{ background: bg, color }}>
            {a.severity}
          </span>
        );
      },
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (a) => (
        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--ink-secondary)]">
          {a.type}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Alert Summary',
      sortable: true,
      render: (a) => (
        <div>
          <div className="font-medium text-[var(--ink-primary)] truncate max-w-[340px]">{a.title}</div>
          <div className="text-[11px] text-[var(--ink-tertiary)] truncate max-w-[340px]">{a.description}</div>
        </div>
      ),
    },
    {
      key: 'caseId',
      header: 'Case Ref',
      sortable: true,
      render: (a) => (
        <span className="font-mono-id text-[12px] font-medium text-[var(--ink-primary)]">
          {a.caseId}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Timestamp',
      sortable: true,
      render: (a) => (
        <span className="font-mono-id text-[11px] text-[var(--ink-secondary)]">
          {a.date.replace('T', ' ')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      render: (a) => (
        <div className="flex items-center gap-2">
          {!a.resolved && (
            <button
              onClick={(e) => handleResolveAlert(a.id, e)}
              className="px-2 py-1 rounded text-[11px] font-medium border hover:bg-[var(--surface-2)] transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--ink-secondary)' }}
            >
              Resolve
            </button>
          )}
          {a.resolved && (
            <span className="text-[11px] text-[var(--success)] font-medium flex items-center gap-1">
              <CheckCircle2 size={12} /> Resolved
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Alert &amp; Operational Notification Center
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              {filteredAlerts.length} operational alerts
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Autonomous multi-stream triggers: network linkages, evidence contradictions, circadian anomalies, and watchlists
          </p>
        </div>

        <button
          onClick={() => {
            setAlertsList((prev) => prev.map((a) => ({ ...a, read: true })));
            toast.success('All alerts marked as read');
          }}
          className="px-3 py-1.5 rounded-md text-[12px] font-medium border hover:bg-[var(--surface-2)] transition-colors"
          style={{ borderColor: 'var(--border)', color: 'var(--ink-secondary)' }}
        >
          Mark All Read
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filterOptions}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Filter alerts by title, description, case..."
      />

      {/* Table */}
      <DataTable
        data={filteredAlerts}
        columns={columns}
        keyExtractor={(a) => a.id}
        loading={loading}
        pageSize={14}
        onRowClick={(a) => dispatch(openInspector({ id: a.id, type: 'Alert' }))}
        emptyMessage="No operational alerts matching active filters."
      />
    </div>
  );
}
