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
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';

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

function fmtPct(pct: number | null | undefined): string {
  if (typeof pct !== 'number' || Number.isNaN(pct)) return '—';
  return `${pct.toFixed(2)}%`;
}

const MODEL_COLUMNS: AdminTableColumn<InfraAiGatewayItem>[] = [
  {
    id: 'vendor',
    header: 'Provider',
    className: 'whitespace-nowrap font-medium text-foreground',
    cell: (r) => r.vendor,
  },
  {
    id: 'model',
    header: 'Model',
    className: 'max-w-[18rem] truncate font-mono text-xs text-muted-foreground',
    cell: (r) => r.model,
  },
  {
    id: 'requests',
    header: 'Request',
    className: 'text-right tabular-nums',
    cell: (r) => fmtNum(r.requests),
  },
  {
    id: 'cost',
    header: 'Chi phí',
    className: 'text-right tabular-nums',
    cell: (r) => fmtCost(r.cost_usd),
  },
  {
    id: 'latency',
    header: 'Độ trễ p95',
    className: 'text-right tabular-nums text-muted-foreground',
    cell: (r) => fmtMs(r.latency_p95_ms),
  },
  {
    id: 'error_rate',
    header: 'Tỷ lệ lỗi',
    className: 'text-right tabular-nums text-muted-foreground',
    cell: (r) => fmtPct(r.error_rate_pct),
  },
  {
    id: 'top_error',
    header: 'Lỗi hay gặp',
    className: 'max-w-[14rem] truncate text-xs text-muted-foreground',
    cell: (r) => {
      const topError = r.error_class_top?.[0];
      return topError ? (
        <span title={`${topError.error_class} (${topError.count})`}>
          {topError.error_class}
          <span className="ml-1 text-muted-foreground/70">
            ×{fmtNum(topError.count)}
          </span>
        </span>
      ) : (
        '—'
      );
    },
  },
];

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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              {summary.total_spend_usd != null && (
                <StatCard
                  label="Tổng đã tiêu từ trước đến nay"
                  value={fmtBalance(summary.total_spend_usd)}
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

          <AdminTable
            rows={items}
            columns={MODEL_COLUMNS}
            getRowId={(r) => `${r.vendor}/${r.model}`}
            caption="Thống kê theo model"
          />
        </div>
      )}
    />
  );
}
