'use client';

/**
 * Hạ tầng → Vercel — deploys summary + 14d frequency chart + deployments table.
 *
 * Data: GET /api/admin-proxy/admin/infra/vercel → worker `handleVercel`.
 * State handling lives in <InfraPanel>; this page renders the deploy summary
 * tiles (`summary`), a 14d success/failed stacked-bar chart (`series`, lazy
 * Recharts), and the recent-deployments table.
 */

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import { ExternalLink } from 'lucide-react';
import {
  getInfraVercel,
  type InfraVercelItem,
  type InfraVercelSummary,
  type InfraVercelSeriesPoint,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatDateOrEmpty, formatRelativeOrEmpty } from '@/lib/format-date';
import { StatCard } from '@/components/stat-card';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';
import { VercelDeployDrawer } from '@/components/admin/infra/VercelDeployDrawer';

const tool = getInfraTool('vercel')!;

// Recharts (~150KB) lazy-loaded so it stays out of the initial bundle; ssr:false
// because admin is auth-gated (mirrors AiGatewayTrendChart).
const VercelDeployChart = dynamic(
  () =>
    import('@/components/admin/infra/VercelDeployChart').then(
      (m) => m.VercelDeployChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

function stateTone(state: string | null): 'good' | 'bad' | 'warn' | 'neutral' {
  switch ((state ?? '').toUpperCase()) {
    case 'READY':
      return 'good';
    case 'ERROR':
    case 'CANCELED':
      return 'bad';
    case 'BUILDING':
    case 'QUEUED':
    case 'INITIALIZING':
      return 'warn';
    default:
      return 'neutral';
  }
}

function fmtPct(pct: number): string {
  return `${pct.toFixed(1)}%`;
}

// minutes → "2 giờ trước" / "15 phút trước" / "1 ngày trước"
function fmtAge(min: number | null | undefined): string | undefined {
  if (min == null || !Number.isFinite(min)) return undefined;
  if (min < 60) return `${Math.round(min)} phút trước`;
  const hours = min / 60;
  if (hours < 24) return `${Math.round(hours)} giờ trước`;
  return `${Math.round(hours / 24)} ngày trước`;
}

export default function InfraVercelPage() {
  const query = useQuery({
    queryKey: ['infra', 'vercel'],
    queryFn: getInfraVercel,
    staleTime: 30_000,
  });

  const [openUid, setOpenUid] = React.useState<string | null>(null);

  const summary: InfraVercelSummary | undefined =
    query.data?.ok ? query.data.summary : undefined;
  const series: InfraVercelSeriesPoint[] =
    query.data?.ok && Array.isArray(query.data.series) ? query.data.series : [];

  return (
    <>
    <VercelDeployDrawer
      uid={openUid}
      open={openUid !== null}
      onClose={() => setOpenUid(null)}
    />
    <InfraPanel<InfraVercelItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có deploy gần đây"
      renderTable={(items) => (
        <div className="space-y-6">
          {summary && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {summary.deploys_7d != null && (
                <StatCard
                  label="Deploy 7 ngày"
                  value={summary.deploys_7d.toLocaleString('vi-VN')}
                />
              )}
              {summary.success_rate_pct != null && (
                <StatCard
                  label="Tỉ lệ thành công"
                  value={fmtPct(summary.success_rate_pct)}
                />
              )}
              {summary.last_prod_state != null && (
                <StatCard
                  label="Prod gần nhất"
                  value={
                    <span className="inline-flex items-center">
                      <InfraStatusPill
                        label={summary.last_prod_state}
                        tone={stateTone(summary.last_prod_state)}
                      />
                    </span>
                  }
                  hint={fmtAge(summary.last_prod_age_min)}
                />
              )}
            </div>
          )}

          {series.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Tần suất deploy (14 ngày)
                </p>
                <VercelDeployChart data={series} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5">Trạng thái</th>
                      <th className="px-4 py-2.5">Môi trường</th>
                      <th className="px-4 py-2.5">Commit</th>
                      <th className="px-4 py-2.5">Thời gian</th>
                      <th className="px-4 py-2.5 text-right">Mở</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((d) => (
                      <tr
                        key={d.uid}
                        onClick={() => setOpenUid(d.uid)}
                        className="cursor-pointer border-b border-border/50 last:border-0 hover:bg-gold/5"
                      >
                        <td className="px-4 py-2.5">
                          <InfraStatusPill
                            label={d.state ?? '—'}
                            tone={stateTone(d.state)}
                          />
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {d.target ?? '—'}
                        </td>
                        <td className="max-w-[28rem] truncate px-4 py-2.5">
                          {d.commit_message ?? (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                          {formatDateOrEmpty(d.created)}
                          {formatRelativeOrEmpty(d.created) && (
                            <span className="ml-1.5 text-xs opacity-70">
                              · {formatRelativeOrEmpty(d.created)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {d.url ? (
                            <a
                              href={d.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-gold hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
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
