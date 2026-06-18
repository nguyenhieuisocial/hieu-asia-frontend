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
import { StatCard } from '@/components/stat-card';
import { InfraPanel } from '@/components/admin/infra/infra-panel';
import { LangfuseTraceDrawer } from '@/components/admin/infra/LangfuseTraceDrawer';

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

function fmtNum(n: number): string {
  return n.toLocaleString('vi-VN');
}

function fmtCost(usd: number | null | undefined): string {
  if (usd == null || !Number.isFinite(usd)) return '—';
  return `$${usd.toFixed(4)}`;
}

function fmtLatency(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms)) return '—';
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

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
                <StatCard label="Trace 24h" value={fmtNum(summary.traces_24h)} />
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
            <Card>
              <CardContent className="p-0">
                <p className="px-4 pt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Theo mô hình (chi phí)
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                        <th className="px-4 py-2.5">Mô hình</th>
                        <th className="px-4 py-2.5 text-right">Trace</th>
                        <th className="px-4 py-2.5 text-right">Token</th>
                        <th className="px-4 py-2.5 text-right">Chi phí</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byModel.map((m) => (
                        <tr
                          key={m.model}
                          className="border-b border-border/50 last:border-0 hover:bg-gold/5"
                        >
                          <td className="max-w-[18rem] truncate px-4 py-2.5 font-mono text-xs text-foreground">
                            {m.model}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums">
                            {fmtNum(m.traces)}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                            {fmtNum(m.total_tokens)}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums">
                            {fmtCost(m.cost_usd)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {byRole.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <p className="px-4 pt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Theo vai trò
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                        <th className="px-4 py-2.5">Vai trò</th>
                        <th className="px-4 py-2.5 text-right">Trace</th>
                        <th className="px-4 py-2.5 text-right">Chi phí</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byRole.map((r) => (
                        <tr
                          key={r.role}
                          className="border-b border-border/50 last:border-0 hover:bg-gold/5"
                        >
                          <td className="whitespace-nowrap px-4 py-2.5 font-medium text-foreground">
                            {r.role}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums">
                            {fmtNum(r.traces)}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums">
                            {fmtCost(r.cost_usd)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {scores.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <p className="px-4 pt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Điểm đánh giá (scores)
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                        <th className="px-4 py-2.5">Tên</th>
                        <th className="px-4 py-2.5 text-right">Giá trị</th>
                        <th className="px-4 py-2.5">Ghi chú</th>
                        <th className="px-4 py-2.5">Trace</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.map((s) => (
                        <tr
                          key={s.id}
                          className="border-b border-border/50 last:border-0 hover:bg-gold/5"
                        >
                          <td className="whitespace-nowrap px-4 py-2.5 font-medium text-foreground">
                            {s.name ?? '—'}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums">
                            {s.value == null ? '—' : String(s.value)}
                          </td>
                          <td className="max-w-[18rem] truncate px-4 py-2.5 text-muted-foreground">
                            {s.comment ?? '—'}
                          </td>
                          <td className="max-w-[10rem] truncate px-4 py-2.5 font-mono text-xs text-muted-foreground">
                            {s.trace_id ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5">Tên</th>
                      <th className="px-4 py-2.5 text-right">Độ trễ</th>
                      <th className="px-4 py-2.5 text-right">Chi phí</th>
                      <th className="px-4 py-2.5">Người dùng</th>
                      <th className="px-4 py-2.5">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((t) => (
                      <tr
                        key={t.id}
                        onClick={t.id ? () => setOpenTraceId(t.id) : undefined}
                        className={
                          t.id
                            ? 'cursor-pointer border-b border-border/50 last:border-0 hover:bg-gold/5'
                            : 'border-b border-border/50 last:border-0 hover:bg-gold/5'
                        }
                      >
                        <td className="max-w-[24rem] truncate px-4 py-2.5 font-medium text-foreground">
                          {t.name ?? <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                          {fmtLatency(t.latency_ms)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          {fmtCost(t.cost_usd)}
                        </td>
                        <td className="max-w-[14rem] truncate px-4 py-2.5 font-mono text-xs text-muted-foreground">
                          {t.user_id ?? '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                          {formatDateOrEmpty(t.timestamp)}
                          {formatRelativeOrEmpty(t.timestamp) && (
                            <span className="ml-1.5 text-xs opacity-70">
                              · {formatRelativeOrEmpty(t.timestamp)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    />
    </>
  );
}
