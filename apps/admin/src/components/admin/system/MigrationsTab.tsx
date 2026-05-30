'use client';

/**
 * Migrations tab — D1 + Supabase migration history.
 *
 * Wave 66 IA: extracted from the former /migrations page into a tab body of
 * /audit ("Logs & sự cố"). Lists migrations with timestamp + applied/pending/
 * failed status on AdminTable (vault 107 §5.5).
 *
 * Data source (best-effort):
 *   GET /api/admin-proxy/admin/migrations?limit=50
 *
 * Worker endpoint TODO — until shipped, mock list renders so the shell is
 * exercised (MockBanner surfaces the mock state).
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from '@hieu-asia/ui';
import { Database, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { KpiCard } from '@/components/admin/kpi-card';
import { MockBanner } from '@/components/mock-banner';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';

type MigrationStatus = 'applied' | 'pending' | 'failed';

interface Migration {
  id: string;
  filename: string;
  database: 'd1' | 'supabase';
  applied_at: string | null;
  status: MigrationStatus;
  duration_ms: number | null;
  error: string | null;
}

// Wave 60.81.C scaffold — deterministic mock. Order: applied descending,
// then pending, then failed at top to mimic the worker default sort.
const MOCK_MIGRATIONS: Migration[] = [
  {
    id: 'm-0042',
    filename: '0042_add_warn_token_audit.sql',
    database: 'supabase',
    applied_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    status: 'applied',
    duration_ms: 240,
    error: null,
  },
  {
    id: 'm-0041',
    filename: '0041_reading_session_tags_index.sql',
    database: 'supabase',
    applied_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    status: 'applied',
    duration_ms: 1180,
    error: null,
  },
  {
    id: 'm-0040',
    filename: '0040_d1_kv_prompt_versions.sql',
    database: 'd1',
    applied_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    status: 'applied',
    duration_ms: 86,
    error: null,
  },
  {
    id: 'm-0043',
    filename: '0043_supabase_feedback_table.sql',
    database: 'supabase',
    applied_at: null,
    status: 'pending',
    duration_ms: null,
    error: null,
  },
];

const STATUS_CLASS: Record<MigrationStatus, string> = {
  applied: 'border-jade-300/40 bg-jade-500/15 text-jade-700 dark:text-jade-300',
  pending: 'border-warn-500/40 bg-warn-500/10 text-warn-700 dark:text-warn-300',
  failed: 'border-red-500/50 bg-red-500/15 text-red-700 dark:text-red-300',
};

const STATUS_ICON: Record<MigrationStatus, React.ComponentType<{ className?: string }>> = {
  applied: CheckCircle2,
  pending: Clock,
  failed: AlertTriangle,
};

function fmtDateTime(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fmtDuration(ms: number | null) {
  if (ms == null) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function MigrationsTab() {
  const list = useQuery({
    queryKey: ['admin', 'migrations'],
    queryFn: async () => {
      try {
        const r = await fetch('/api/admin-proxy/admin/migrations?limit=50', {
          cache: 'no-store',
        });
        if (!r.ok) return { rows: MOCK_MIGRATIONS, isMock: true };
        const data = (await r.json()) as { rows?: Migration[] };
        return { rows: data.rows ?? MOCK_MIGRATIONS, isMock: !data.rows };
      } catch {
        return { rows: MOCK_MIGRATIONS, isMock: true };
      }
    },
  });

  const rows = list.data?.rows ?? [];
  const applied = rows.filter((r) => r.status === 'applied').length;
  const pending = rows.filter((r) => r.status === 'pending').length;
  const failed = rows.filter((r) => r.status === 'failed').length;
  const lastApplied = rows
    .filter((r) => r.status === 'applied' && r.applied_at)
    .sort((a, b) => (b.applied_at! > a.applied_at! ? 1 : -1))[0];

  const cols: AdminTableColumn<Migration>[] = [
    {
      id: 'filename',
      header: 'File',
      sortKey: 'filename',
      cell: (r) => (
        <span className="font-mono text-xs text-foreground" title={r.filename}>
          {r.filename}
        </span>
      ),
    },
    {
      id: 'database',
      header: 'DB',
      sortKey: 'database',
      width: '90px',
      cell: (r) => (
        <span className="inline-flex items-center rounded-md border border-gold/20 bg-card/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/85">
          {r.database}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Trạng thái',
      sortKey: 'status',
      width: '130px',
      cell: (r) => {
        const Icon = STATUS_ICON[r.status];
        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
              STATUS_CLASS[r.status],
            )}
          >
            <Icon className="h-3 w-3" aria-hidden />
            {r.status}
          </span>
        );
      },
    },
    {
      id: 'applied_at',
      header: 'Áp dụng lúc',
      sortKey: 'applied_at',
      width: '170px',
      hideOnMobile: true,
      cell: (r) => (
        <span className="font-mono text-xs text-foreground/85">{fmtDateTime(r.applied_at)}</span>
      ),
    },
    {
      id: 'duration',
      header: 'Thời gian',
      sortKey: 'duration_ms',
      width: '100px',
      className: 'text-right',
      hideOnMobile: true,
      cell: (r) => (
        <span className="font-mono text-xs text-muted-foreground">{fmtDuration(r.duration_ms)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <MockBanner
        source={{ isMock: list.data?.isMock ?? false, reason: 'endpoint /admin/migrations TBD' }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Tổng migration"
          value={rows.length}
          icon={<Database className="h-4 w-4" />}
          accent="gold"
          hint="D1 + Supabase"
        />
        <KpiCard
          label="Đã áp dụng"
          value={applied}
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="jade"
          hint="applied"
        />
        <KpiCard
          label="Đang chờ"
          value={pending}
          icon={<Clock className="h-4 w-4" />}
          accent={pending > 0 ? 'gold' : 'jade'}
          hint="pending"
        />
        <KpiCard
          label="Thất bại"
          value={failed}
          icon={<AlertTriangle className="h-4 w-4" />}
          accent={failed > 0 ? 'red' : 'jade'}
          hint="failed"
        />
      </div>

      {lastApplied && (
        <Card>
          <CardHeader>
            <CardTitle>Migration mới nhất</CardTitle>
            <CardDescription>
              <span className="font-mono text-xs text-foreground/90">{lastApplied.filename}</span>
              {' '}áp dụng lên <span className="text-foreground/90">{lastApplied.database}</span>
              {' '}lúc {fmtDateTime(lastApplied.applied_at)} (
              {fmtDuration(lastApplied.duration_ms)}).
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử migration</CardTitle>
          <CardDescription>
            Mới nhất ở trên. Click cột tiêu đề để sắp xếp. Status badge dùng
            warn (đang chờ) / red (thất bại) / jade (đã áp dụng).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminTable
            rows={rows}
            columns={cols}
            loading={list.isLoading}
            empty={
              <span className="text-sm text-muted-foreground">
                Chưa có migration nào được ghi nhận.
              </span>
            }
            caption="Danh sách migration"
          />
        </CardContent>
      </Card>
    </div>
  );
}
