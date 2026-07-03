'use client';

import * as React from 'react';
import { DataTable, StatusBadge, type DataTableColumn } from '@hieu-asia/ui';
import type { LlmTraceRow } from '@/lib/llm-spend-api';
import { fmtDateTime } from '@/lib/format';

interface Props {
  rows: LlmTraceRow[];
  isLoading?: boolean;
  vendorFilter: string;
  onVendorFilterChange: (v: string) => void;
  roleFilter: string;
  onRoleFilterChange: (v: string) => void;
}

function statusTone(s: string): React.ComponentProps<typeof StatusBadge>['status'] {
  if (s === 'ok' || s === 'success') return 'success';
  if (s === 'error' || s === 'failed') return 'error';
  if (s === 'rate_limited' || s === 'timeout') return 'warning';
  return 'neutral';
}

export function RecentTracesTable({
  rows,
  isLoading,
  vendorFilter,
  onVendorFilterChange,
  roleFilter,
  onRoleFilterChange,
}: Props) {
  const vendors = React.useMemo(() => {
    const s = new Set<string>();
    for (const r of rows) s.add(r.vendor);
    return Array.from(s).sort();
  }, [rows]);
  const roles = React.useMemo(() => {
    const s = new Set<string>();
    for (const r of rows) if (r.role) s.add(r.role);
    return Array.from(s).sort();
  }, [rows]);

  const cols: DataTableColumn<LlmTraceRow>[] = [
    {
      key: 'created_at',
      header: 'Thời gian',
      width: '180px',
      cell: (r) => <span className="font-mono text-xs text-foreground/85">{fmtDateTime(r.created_at)}</span>,
    },
    {
      key: 'vendor',
      header: 'Vendor',
      width: '110px',
      cell: (r) => <span className="font-mono text-xs text-gold">{r.vendor}</span>,
    },
    {
      key: 'model',
      header: 'Model',
      cell: (r) => <span className="font-mono text-xs text-foreground/85">{r.model}</span>,
    },
    {
      key: 'role',
      header: 'Role',
      width: '110px',
      cell: (r) => (r.role ? <span className="text-xs text-muted-foreground">{r.role}</span> : <span className="text-foreground/30">—</span>),
    },
    {
      key: 'tokens',
      header: 'Tokens',
      align: 'right',
      width: '100px',
      cell: (r) => (
        <span className="font-mono text-xs text-muted-foreground">
          {(r.input_tokens ?? 0) + (r.output_tokens ?? 0)}
        </span>
      ),
    },
    {
      key: 'cost_usd',
      header: 'Chi phí',
      align: 'right',
      width: '90px',
      cell: (r) => <span className="font-mono text-xs text-gold">${Number(r.cost_usd ?? 0).toFixed(4)}</span>,
    },
    {
      key: 'latency_ms',
      header: 'Latency',
      align: 'right',
      width: '90px',
      cell: (r) => (r.latency_ms == null ? '—' : <span className="font-mono text-xs">{r.latency_ms}ms</span>),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '110px',
      cell: (r) => <StatusBadge status={statusTone(r.status)} label={r.status} />,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <label className="flex items-center gap-2">
          <span>Vendor:</span>
          <select
            value={vendorFilter}
            onChange={(e) => onVendorFilterChange(e.target.value)}
            className="rounded border border-gold/20 bg-card/60 px-2 py-1 text-xs text-foreground"
          >
            <option value="">Tất cả</option>
            {vendors.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span>Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="rounded border border-gold/20 bg-card/60 px-2 py-1 text-xs text-foreground"
          >
            <option value="">Tất cả</option>
            {roles.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <span className="ml-auto text-muted-foreground">{rows.length} bản ghi</span>
      </div>
      <DataTable
        columns={cols}
        rows={rows}
        rowKey={(r) => r.id}
        emptyState={isLoading ? 'Đang tải…' : 'Chưa có trace.'}
      />
    </div>
  );
}
