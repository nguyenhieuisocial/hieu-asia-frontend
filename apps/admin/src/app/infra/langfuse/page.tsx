'use client';

/**
 * Hạ tầng → Langfuse — recent LLM traces.
 *
 * Data: GET /api/admin-proxy/admin/infra/langfuse → worker `handleLangfuse`.
 * State handling lives in <InfraPanel>; this page declares the trace columns
 * (tên, độ trễ, chi phí, người dùng, thời gian).
 */

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import { getInfraLangfuse, type InfraLangfuseItem } from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatDateOrEmpty, formatRelativeOrEmpty } from '@/lib/format-date';
import { InfraPanel } from '@/components/admin/infra/infra-panel';

const tool = getInfraTool('langfuse')!;

function fmtLatency(ms: number | null): string {
  if (ms === null || !Number.isFinite(ms)) return '—';
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function fmtCost(usd: number | null): string {
  if (usd === null || !Number.isFinite(usd)) return '—';
  return `$${usd.toFixed(4)}`;
}

export default function InfraLangfusePage() {
  const query = useQuery({
    queryKey: ['infra', 'langfuse'],
    queryFn: getInfraLangfuse,
    staleTime: 30_000,
  });

  return (
    <InfraPanel<InfraLangfuseItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có trace gần đây"
      renderTable={(items) => (
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
                      className="border-b border-border/50 last:border-0 hover:bg-gold/5"
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
      )}
    />
  );
}
