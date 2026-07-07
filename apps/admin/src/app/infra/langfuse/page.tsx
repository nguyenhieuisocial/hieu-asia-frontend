'use client';

/**
 * Hạ tầng → Langfuse — recent LLM traces + 24h summary + 30d trend + by-role.
 *
 * Data: GET /api/admin-proxy/admin/infra/langfuse → worker `handleLangfuse`.
 * State handling lives in <InfraPanel>; this page renders the 24h summary tiles
 * (`summary`), a 30d cost+trace trend (`series`, lazy Recharts), a per-role
 * breakdown table (`by_role`), and the recent-traces table.
 *
 * HONEST NOTE: the worker's `error_rate_pct` is always 0 — the Langfuse API has
 * no error field — so we deliberately omit it from the StatCards.
 */

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import {
  getInfraLangfuse,
  type InfraLangfuseItem,
  type InfraLangfuseSummary,
  type InfraLangfuseSeriesPoint,
  type InfraLangfuseRole,
  type InfraLangfuseModelRow,
  type InfraLangfuseScore,
  type InfraLangfuseFilters,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatDateOrEmpty, formatRelativeOrEmpty } from '@/lib/format-date';
import { fmtNumber } from '@/lib/format';
import { StatCard } from '@/components/stat-card';
import { InfraPanel } from '@/components/admin/infra/infra-panel';
import { LangfuseTraceDrawer } from '@/components/admin/infra/LangfuseTraceDrawer';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';

const tool = getInfraTool('langfuse')!;

// Recharts (~150KB) lazy-loaded so it stays out of the initial bundle; ssr:false
// because admin is auth-gated (mirrors AiGatewayTrendChart).
const LangfuseTrendChart = dynamic(
  () =>
    import('@/components/admin/infra/LangfuseTrendChart').then(
      (m) => m.LangfuseTrendChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

function fmtCost(usd: number | null | undefined): string {
  if (usd == null || !Number.isFinite(usd)) return '—';
  return `$${usd.toFixed(4)}`;
}

function fmtLatency(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms)) return '—';
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

const BY_MODEL_COLUMNS: AdminTableColumn<InfraLangfuseModelRow>[] = [
  {
    id: 'model',
    header: 'Mô hình',
    className: 'max-w-[18rem] truncate font-mono text-xs text-foreground',
    cell: (m) => m.model,
  },
  {
    id: 'traces',
    header: 'Trace',
    className: 'text-right tabular-nums',
    cell: (m) => fmtNumber(m.traces),
  },
  {
    id: 'tokens',
    header: 'Token',
    className: 'text-right tabular-nums text-muted-foreground',
    cell: (m) => fmtNumber(m.total_tokens),
  },
  {
    id: 'cost',
    header: 'Chi phí',
    className: 'text-right tabular-nums',
    cell: (m) => fmtCost(m.cost_usd),
  },
];

const BY_ROLE_COLUMNS: AdminTableColumn<InfraLangfuseRole>[] = [
  {
    id: 'role',
    header: 'Vai trò',
    className: 'whitespace-nowrap font-medium text-foreground',
    cell: (r) => r.role,
  },
  {
    id: 'traces',
    header: 'Trace',
    className: 'text-right tabular-nums',
    cell: (r) => fmtNumber(r.traces),
  },
  {
    id: 'cost',
    header: 'Chi phí',
    className: 'text-right tabular-nums',
    cell: (r) => fmtCost(r.cost_usd),
  },
];

const SCORE_COLUMNS: AdminTableColumn<InfraLangfuseScore>[] = [
  {
    id: 'name',
    header: 'Tên',
    className: 'whitespace-nowrap font-medium text-foreground',
    cell: (s) => s.name ?? '—',
  },
  {
    id: 'value',
    header: 'Giá trị',
    className: 'text-right tabular-nums',
    cell: (s) => (s.value == null ? '—' : String(s.value)),
  },
  {
    id: 'comment',
    header: 'Ghi chú',
    className: 'max-w-[18rem] truncate text-muted-foreground',
    cell: (s) => s.comment ?? '—',
  },
  {
    id: 'trace',
    header: 'Trace',
    className: 'max-w-[10rem] truncate font-mono text-xs text-muted-foreground',
    cell: (s) => s.trace_id ?? '—',
  },
];

const TRACE_COLUMNS: AdminTableColumn<InfraLangfuseItem>[] = [
  {
    id: 'name',
    header: 'Tên',
    className: 'max-w-[24rem] truncate font-medium text-foreground',
    cell: (t) => t.name ?? <span className="text-muted-foreground">—</span>,
  },
  {
    id: 'latency',
    header: 'Độ trễ',
    className: 'text-right tabular-nums text-muted-foreground',
    cell: (t) => fmtLatency(t.latency_ms),
  },
  {
    id: 'cost',
    header: 'Chi phí',
    className: 'text-right tabular-nums',
    cell: (t) => fmtCost(t.cost_usd),
  },
  {
    id: 'user',
    header: 'Người dùng',
    className: 'max-w-[14rem] truncate font-mono text-xs text-muted-foreground',
    cell: (t) => t.user_id ?? '—',
  },
  {
    id: 'timestamp',
    header: 'Thời gian',
    className: 'whitespace-nowrap text-muted-foreground',
    cell: (t) => (
      <>
        {formatDateOrEmpty(t.timestamp)}
        {formatRelativeOrEmpty(t.timestamp) && (
          <span className="ml-1.5 text-xs opacity-70">
            · {formatRelativeOrEmpty(t.timestamp)}
          </span>
        )}
      </>
    ),
  },
];

export default function InfraLangfusePage() {
  // Draft filter inputs vs the applied filter (applied only on submit so we
  // don't refetch on every keystroke).
  const [draft, setDraft] = React.useState<InfraLangfuseFilters>({});
  const [applied, setApplied] = React.useState<InfraLangfuseFilters>({});

  const query = useQuery({
    queryKey: ['infra', 'langfuse', applied],
    queryFn: () => getInfraLangfuse(applied),
    staleTime: 30_000,
  });
  const [openTraceId, setOpenTraceId] = React.useState<string | null>(null);

  const summary: InfraLangfuseSummary | undefined =
    query.data?.ok ? query.data.summary : undefined;
  const series: InfraLangfuseSeriesPoint[] =
    query.data?.ok && Array.isArray(query.data.series) ? query.data.series : [];
  const seriesSource: 'daily_metrics' | 'trace_sample' | undefined =
    query.data?.ok ? query.data.series_source : undefined;
  const byRole: InfraLangfuseRole[] =
    query.data?.ok && Array.isArray(query.data.by_role) ? query.data.by_role : [];
  const byModel: InfraLangfuseModelRow[] =
    query.data?.ok && Array.isArray(query.data.by_model) ? query.data.by_model : [];
  const scores: InfraLangfuseScore[] =
    query.data?.ok && Array.isArray(query.data.scores) ? query.data.scores : [];

  const hasFilters = Object.values(applied).some(Boolean);

  return (
    <>
    <LangfuseTraceDrawer
      traceId={openTraceId}
      open={openTraceId !== null}
      onClose={() => setOpenTraceId(null)}
    />
    <InfraPanel<InfraLangfuseItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có trace gần đây"
      renderTable={(items) => (
        <div className="space-y-6">
          {summary && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {summary.spend_today_usd != null && (
                <StatCard label="Chi hôm nay" value={fmtCost(summary.spend_today_usd)} />
              )}
              {summary.traces_24h != null && (
                <StatCard label="Trace 24h" value={fmtNumber(summary.traces_24h)} />
              )}
              {summary.latency_avg_ms !== undefined && (
                <StatCard label="Độ trễ TB" value={fmtLatency(summary.latency_avg_ms)} />
              )}
              {summary.latency_p95_ms !== undefined && (
                <StatCard label="Độ trễ p95" value={fmtLatency(summary.latency_p95_ms)} />
              )}
            </div>
          )}

          {series.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Chi phí &amp; trace (30 ngày)
                  </p>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {seriesSource === 'daily_metrics'
                      ? 'Nguồn: số liệu toàn tài khoản'
                      : 'Nguồn: mẫu ≤100 trace gần đây'}
                  </span>
                </div>
                <LangfuseTrendChart data={series} />
              </CardContent>
            </Card>
          )}

          {byModel.length > 0 && (
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Theo mô hình (chi phí)
              </p>
              <Card>
                <CardContent className="p-0">
                  <AdminTable
                    rows={byModel}
                    columns={BY_MODEL_COLUMNS}
                    getRowId={(m) => m.model}
                    caption="Chi phí theo mô hình"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {byRole.length > 0 && (
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Theo vai trò
              </p>
              <Card>
                <CardContent className="p-0">
                  <AdminTable
                    rows={byRole}
                    columns={BY_ROLE_COLUMNS}
                    getRowId={(r) => r.role}
                    caption="Chi phí theo vai trò"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {scores.length > 0 && (
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Điểm đánh giá (scores)
              </p>
              <Card>
                <CardContent className="p-0">
                  <AdminTable
                    rows={scores}
                    columns={SCORE_COLUMNS}
                    getRowId={(s) => s.id}
                    caption="Điểm đánh giá"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Trace search / filter — applied on submit (forwarded to Langfuse) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setApplied({ ...draft });
            }}
            className="flex flex-wrap items-end gap-2"
          >
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                Tên trace
              </span>
              <input
                type="text"
                value={draft.name ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="ai/role/report"
                className="h-8 w-44 rounded border border-border bg-card/50 px-2 text-sm outline-none focus:border-gold/40"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                User ID
              </span>
              <input
                type="text"
                value={draft.userId ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, userId: e.target.value }))}
                className="h-8 w-40 rounded border border-border bg-card/50 px-2 font-mono text-xs outline-none focus:border-gold/40"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                Từ ngày
              </span>
              <input
                type="date"
                value={draft.fromTimestamp ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, fromTimestamp: e.target.value }))}
                className="h-8 rounded border border-border bg-card/50 px-2 text-sm outline-none focus:border-gold/40"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                Đến ngày
              </span>
              <input
                type="date"
                value={draft.toTimestamp ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, toTimestamp: e.target.value }))}
                className="h-8 rounded border border-border bg-card/50 px-2 text-sm outline-none focus:border-gold/40"
              />
            </label>
            <button
              type="submit"
              className="h-8 rounded bg-gold/15 px-3 text-sm font-medium text-gold transition-colors hover:bg-gold/25"
            >
              Lọc
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setDraft({});
                  setApplied({});
                }}
                className="h-8 rounded px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Xoá lọc
              </button>
            )}
          </form>

          <AdminTable
            rows={items}
            columns={TRACE_COLUMNS}
            getRowId={(t) => t.id}
            onRowClick={(t) => {
              if (t.id) setOpenTraceId(t.id);
            }}
            caption="Trace LLM gần đây"
          />
        </div>
      )}
    />
    </>
  );
}
