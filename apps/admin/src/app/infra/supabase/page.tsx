'use client';

/**
 * Hạ tầng → Supabase — Postgres tables by row count.
 *
 * Data: GET /api/admin-proxy/admin/infra/supabase → worker `handleSupabase`.
 * State handling lives in <InfraPanel>; this page renders a small "tổng số
 * bảng" tile (from `query.data.summary`) + the table-by-rows list.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import {
  getInfraSupabase,
  type InfraSupabaseItem,
  type InfraSupabaseSummary,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { useAdminRole } from '@/hooks/useAdminRole';
import { StatCard } from '@/components/stat-card';
import { InfraPanel } from '@/components/admin/infra/infra-panel';
import { SupabaseRowsDrawer } from '@/components/admin/infra/SupabaseRowsDrawer';

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
  const { isOwner } = useAdminRole();
  const [openTable, setOpenTable] = React.useState<string | null>(null);

  const summary: InfraSupabaseSummary | undefined =
    query.data?.ok ? query.data.summary : undefined;

  return (
    <>
      <SupabaseRowsDrawer
        table={openTable}
        open={openTable !== null}
        onClose={() => setOpenTable(null)}
      />
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
            {isOwner && (
              <p className="text-xs text-muted-foreground">
                Bấm vào một bảng để xem dữ liệu (chỉ-đọc, cột nhạy cảm đã ẩn).
              </p>
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
                      {items.map((t) => {
                        const clickable = isOwner && !!t.table && t.schema === 'hieu_asia';
                        return (
                          <tr
                            key={`${t.schema}.${t.table}`}
                            onClick={clickable ? () => setOpenTable(t.table) : undefined}
                            className={
                              clickable
                                ? 'cursor-pointer border-b border-border/50 last:border-0 hover:bg-gold/5'
                                : 'border-b border-border/50 last:border-0 hover:bg-gold/5'
                            }
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
    </>
  );
}
