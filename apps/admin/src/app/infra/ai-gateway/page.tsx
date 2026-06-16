'use client';

/**
 * Hạ tầng → AI Gateway — LLM routing by vendor/model.
 *
 * Data: GET /api/admin-proxy/admin/infra/ai-gateway → worker `handleAiGateway`
 * (Vercel AI Gateway usage). State handling lives in <InfraPanel>; this page
 * renders the total request/cost tiles (`query.data.summary`) + the per
 * vendor/model breakdown table.
 */

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import {
  getInfraAiGateway,
  type InfraAiGatewayItem,
  type InfraAiGatewaySummary,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { StatCard } from '@/components/stat-card';
import { InfraPanel } from '@/components/admin/infra/infra-panel';

const tool = getInfraTool('ai-gateway')!;

function fmtNum(n: number): string {
  return n.toLocaleString('vi-VN');
}

function fmtCost(usd: number): string {
  return `$${usd.toFixed(4)}`;
}

export default function InfraAiGatewayPage() {
  const query = useQuery({
    queryKey: ['infra', 'ai-gateway'],
    queryFn: getInfraAiGateway,
    staleTime: 30_000,
  });

  const summary: InfraAiGatewaySummary | undefined =
    query.data?.ok ? query.data.summary : undefined;

  return (
    <InfraPanel<InfraAiGatewayItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có lượt gọi nào"
      renderTable={(items) => (
        <div className="space-y-6">
          {summary && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                label="Tổng request"
                value={fmtNum(summary.total_requests)}
              />
              <StatCard
                label="Tổng chi phí"
                value={fmtCost(summary.total_cost_usd)}
              />
            </div>
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
                      <th className="px-4 py-2.5 text-right">Tỷ lệ lỗi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r) => (
                      <tr
                        key={`${r.vendor}/${r.model}`}
                        className="border-b border-border/50 last:border-0 hover:bg-gold/5"
                      >
                        <td className="whitespace-nowrap px-4 py-2.5 font-medium text-foreground">
                          {r.vendor}
                        </td>
                        <td className="max-w-[20rem] truncate px-4 py-2.5 font-mono text-xs text-muted-foreground">
                          {r.model}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          {fmtNum(r.requests)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          {fmtCost(r.cost_usd)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                          {r.error_rate_pct.toFixed(2)}%
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
