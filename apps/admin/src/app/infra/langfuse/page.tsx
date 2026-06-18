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
  const query = useQuery({
    queryKey: ['infra', 'langfuse'],
    queryFn: getInfraLangfuse,
    staleTime: 30_000,
  });
  const [openTraceId, setOpenTraceId] = React.useState<string | null>(null);

  const summary: InfraLangfuseSummary | undefined =
    query.data?.ok ? query.data.summary : undefined;
  const series: InfraLangfuseSeriesPoint[] =
    query.data?.ok && Array.isArray(query.data.series) ? query.data.series : [];
  const byRole: InfraLangfuseRole[] =
    query.data?.ok && Array.isArray(query.data.by_role) ? query.data.by_role : [];

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
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Chi phí &amp; trace (30 ngày)
                </p>
                <LangfuseTrendChart data={series} />
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
