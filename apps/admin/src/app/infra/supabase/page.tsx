'use client';

/**
 * Hạ tầng → Supabase — Postgres tables by row count.
 *
 * Data: GET /api/admin-proxy/admin/infra/supabase → worker `handleSupabase`.
 * State handling lives in <InfraPanel>; this page renders a small "tổng số
 * bảng" tile (from `query.data.summary`) + the table-by-rows list.
 */

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import {
  getInfraSupabase,
  type InfraSupabaseItem,
  type InfraSupabaseSummary,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { StatCard } from '@/components/stat-card';
import { InfraPanel } from '@/components/admin/infra/infra-panel';

const tool = getInfraTool('supabase')!;

function fmtNum(n: number): string {
  return n.toLocaleString('vi-VN');
}

export default function InfraSupabasePage() {
  const query = useQuery({
    queryKey: ['infra', 'supabase'],
    queryFn: getInfraSupabase,
    staleTime: 30_000,
  });

  const summary: InfraSupabaseSummary | undefined =
    query.data?.ok ? query.data.summary : undefined;

  return (
    <InfraPanel<InfraSupabaseItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có bảng nào"
      renderTable={(items) => (
        <div className="space-y-6">
          {summary && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Tổng số bảng" value={fmtNum(summary.total_tables)} />
            </div>
          )}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-2.5">Schema</th>
                      <th className="px-4 py-2.5">Bảng</th>
                      <th className="px-4 py-2.5 text-right">Số dòng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((t) => (
                      <tr
                        key={`${t.schema}.${t.table}`}
                        className="border-b border-border/50 last:border-0 hover:bg-gold/5"
                      >
                        <td className="whitespace-nowrap px-4 py-2.5 font-mono text-muted-foreground">
                          {t.schema}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-foreground">
                          {t.table}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          {fmtNum(t.rows)}
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
