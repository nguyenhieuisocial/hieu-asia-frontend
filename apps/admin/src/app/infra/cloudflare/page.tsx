'use client';

/**
 * Hạ tầng → Cloudflare Worker — daily request/error counts.
 *
 * Data: GET /api/admin-proxy/admin/infra/cloudflare → worker `handleCloudflare`
 * (GraphQL analytics). State handling lives in <InfraPanel>; this page renders
 * the 24h summary tiles + the per-day table. The summary rides on the success
 * envelope (`query.data.summary`), so we read it from the query, not from
 * `renderTable`.
 */

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import {
  getInfraCloudflare,
  type InfraCloudflareItem,
  type InfraCloudflareSummary,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { StatCard } from '@/components/stat-card';
import { InfraPanel } from '@/components/admin/infra/infra-panel';

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
      emptyTitle="Chưa có dữ liệu Worker"
      renderTable={(items) => (
        <div className="space-y-6">
          {summary && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Request (24h)" value={fmtNum(summary.requests_24h)} />
              <StatCard label="Lỗi (24h)" value={fmtNum(summary.errors_24h)} />
              <StatCard
                label="Tỷ lệ lỗi"
                value={`${summary.error_rate_pct.toFixed(2)}%`}
              />
            </div>
          )}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5">Ngày</th>
                      <th className="px-4 py-2.5 text-right">Request</th>
                      <th className="px-4 py-2.5 text-right">Lỗi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((d) => (
                      <tr
                        key={d.date}
                        className="border-b border-border/50 last:border-0 hover:bg-gold/5"
                      >
                        <td className="whitespace-nowrap px-4 py-2.5 font-mono text-muted-foreground">
                          {d.date}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          {fmtNum(d.requests)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                          {fmtNum(d.errors)}
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
