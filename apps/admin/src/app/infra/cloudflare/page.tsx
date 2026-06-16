'use client';

/**
 * Hạ tầng → Cloudflare Worker — recent deployments.
 *
 * Data: GET /api/admin-proxy/admin/infra/cloudflare → worker `handleCloudflare`
 * (Pages/Workers deployments, most-recent first; worker PR #203). State handling
 * lives in <InfraPanel> — including the not-configured setup card the worker
 * returns when its token can't read deployments. This page renders the
 * "tổng số bản triển khai" tile (`query.data.summary`) + the deployments table.
 */

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import {
  getInfraCloudflare,
  type InfraCloudflareItem,
  type InfraCloudflareSummary,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatRelativeOrEmpty } from '@/lib/format-date';
import { StatCard } from '@/components/stat-card';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';

const tool = getInfraTool('cloudflare')!;

function fmtNum(n: number): string {
  return n.toLocaleString('vi-VN');
}

export default function InfraCloudflarePage() {
  const query = useQuery({
    queryKey: ['infra', 'cloudflare'],
    queryFn: getInfraCloudflare,
    staleTime: 30_000,
  });

  const summary: InfraCloudflareSummary | undefined =
    query.data?.ok ? query.data.summary : undefined;

  return (
    <InfraPanel<InfraCloudflareItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có bản triển khai"
      renderTable={(items) => (
        <div className="space-y-6">
          {summary && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                label="Tổng số bản triển khai"
                value={fmtNum(summary.total_deployments)}
                hint={
                  formatRelativeOrEmpty(summary.live_deployment_at)
                    ? `Đang chạy ${formatRelativeOrEmpty(summary.live_deployment_at)}`
                    : undefined
                }
              />
            </div>
          )}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5">Bản</th>
                      <th className="px-4 py-2.5">Đang chạy</th>
                      <th className="px-4 py-2.5">Người</th>
                      <th className="px-4 py-2.5">Ghi chú</th>
                      <th className="px-4 py-2.5">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((d) => (
                      <tr
                        key={d.id}
                        className="border-b border-border/50 last:border-0 hover:bg-gold/5"
                      >
                        <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                          {d.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-2.5">
                          {d.live ? (
                            <InfraStatusPill label="live" tone="good" />
                          ) : (
                            <InfraStatusPill label="—" tone="neutral" />
                          )}
                        </td>
                        <td className="max-w-[14rem] truncate px-4 py-2.5 text-muted-foreground">
                          {d.author_email ?? '—'}
                        </td>
                        <td className="max-w-[22rem] truncate px-4 py-2.5 text-foreground">
                          {d.message ?? '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                          {formatRelativeOrEmpty(d.created_on) || '—'}
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
  );
}
