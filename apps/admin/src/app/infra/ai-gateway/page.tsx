'use client';

/**
 * Hạ tầng → AI Gateway — LLM routing by vendor/model.
 *
 * Data: GET /api/admin-proxy/admin/infra/ai-gateway → worker `handleAiGateway`
 * (Vercel AI Gateway usage). State handling lives in <InfraPanel>; this page
 * renders the prepaid-balance / request / cost tiles (`query.data.summary`), a
 * 30d cost+request trend (`query.data.series`, lazy Recharts), and the per
 * vendor/model breakdown table (now with p95 latency + top error class).
 */

import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import {
  getInfraAiGateway,
  type InfraAiGatewayItem,
  type InfraAiGatewaySummary,
  type InfraAiGatewaySeriesPoint,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { StatCard } from '@/components/stat-card';
import { InfraPanel } from '@/components/admin/infra/infra-panel';

const tool = getInfraTool('ai-gateway')!;

// Recharts (~150KB) lazy-loaded so it stays out of the initial bundle; ssr:false
// because admin is auth-gated (mirrors GscTrendChart on /seo).
const AiGatewayTrendChart = dynamic(
  () =>
    import('@/components/admin/infra/AiGatewayTrendChart').then(
      (m) => m.AiGatewayTrendChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

function fmtNum(n: number): string {
  return n.toLocaleString('vi-VN');
}

function fmtCost(usd: number): string {
  return `$${usd.toFixed(4)}`;
}

function fmtBalance(usd: number): string {
  return `$${usd.toFixed(2)}`;
}

function fmtMs(ms: number | null | undefined): string {
  if (ms == null) return '—';
  return `${Math.round(ms).toLocaleString('vi-VN')} ms`;
}

export default function InfraAiGatewayPage() {
  const query = useQuery({
    queryKey: ['infra', 'ai-gateway'],
    queryFn: getInfraAiGateway,
    staleTime: 30_000,
  });

  const summary: InfraAiGatewaySummary | undefined =
    query.data?.ok ? query.data.summary : undefined;
  const series: InfraAiGatewaySeriesPoint[] =
    query.data?.ok && Array.isArray(query.data.series) ? query.data.series : [];

  return (
    <InfraPanel<InfraAiGatewayItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có lượt gọi nào"
      renderTable={(items) => (
        <div className="space-y-6">
          {summary && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {summary.balance_usd != null && (
                <StatCard
                  label="Số dư trả trước"
                  value={fmtBalance(summary.balance_usd)}
                  hint={summary.low_balance ? 'Sắp hết — cần nạp thêm' : undefined}
                  className={
                    summary.low_balance
                      ? 'border-red-400/40 bg-red-500/5 hover:border-red-400/60'
                      : undefined
                  }
                />
              )}
              <StatCard label="Tổng request" value={fmtNum(summary.total_requests)} />
              <StatCard label="Tổng chi phí" value={fmtCost(summary.total_cost_usd)} />
            </div>
          )}

          {series.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Chi phí &amp; request (30 ngày)
                </p>
                <AiGatewayTrendChart data={series} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5">Provider</th>
                      <th className="px-4 py-2.5">Model</th>
                      <th className="px-4 py-2.5 text-right">Request</th>
                      <th className="px-4 py-2.5 text-right">Chi phí</th>
                      <th className="px-4 py-2.5 text-right">Độ trễ p95</th>
                      <th className="px-4 py-2.5 text-right">Tỷ lệ lỗi</th>
                      <th className="px-4 py-2.5">Lỗi hay gặp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r) => {
                      const topError = r.error_class_top?.[0];
                      return (
                        <tr
                          key={`${r.vendor}/${r.model}`}
                          className="border-b border-border/50 last:border-0 hover:bg-gold/5"
                        >
                          <td className="whitespace-nowrap px-4 py-2.5 font-medium text-foreground">
                            {r.vendor}
                          </td>
                          <td className="max-w-[18rem] truncate px-4 py-2.5 font-mono text-xs text-muted-foreground">
                            {r.model}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums">
                            {fmtNum(r.requests)}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums">
                            {fmtCost(r.cost_usd)}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                            {fmtMs(r.latency_p95_ms)}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                            {r.error_rate_pct.toFixed(2)}%
                          </td>
                          <td className="max-w-[14rem] truncate px-4 py-2.5 text-xs text-muted-foreground">
                            {topError ? (
                              <span title={`${topError.error_class} (${topError.count})`}>
                                {topError.error_class}
                                <span className="ml-1 text-muted-foreground/70">
                                  ×{fmtNum(topError.count)}
                                </span>
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    />
  );
}
