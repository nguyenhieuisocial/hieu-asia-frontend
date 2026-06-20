'use client';

/**
 * Hạ tầng → Supabase — Postgres tables by row count.
 *
 * Data: GET /api/admin-proxy/admin/infra/supabase → worker `handleSupabase`.
 * State handling lives in <InfraPanel>; this page renders a small "tổng số
 * bảng" tile (from `query.data.summary`) + the table-by-rows list.
 */

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import {
  getInfraSupabase,
  type InfraSupabaseItem,
  type InfraSupabaseSummary,
  type InfraSupabaseSignupPoint,
  type InfraSupabaseMigration,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { useAdminRole } from '@/hooks/useAdminRole';
import { StatCard } from '@/components/stat-card';
import { InfraPanel } from '@/components/admin/infra/infra-panel';
import { SupabaseRowsDrawer } from '@/components/admin/infra/SupabaseRowsDrawer';

// Recharts lazy-loaded so it stays out of the initial bundle (ssr:false because
// admin is auth-gated). Mirrors the Sentry/Vercel charts.
const SupabaseSignupChart = dynamic(
  () =>
    import('@/components/admin/infra/SupabaseSignupChart').then(
      (m) => m.SupabaseSignupChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-44 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

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
  const signups: InfraSupabaseSignupPoint[] =
    query.data?.ok && query.data.signups ? query.data.signups : [];
  const migrations: InfraSupabaseMigration[] =
    query.data?.ok && query.data.migrations ? query.data.migrations : [];
  const migrationsNote: string | undefined =
    query.data?.ok ? query.data.migrations_note : undefined;

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
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <StatCard label="Tổng số bảng" value={fmtNum(summary.total_tables)} />
                {summary.total_users != null && (
                  <StatCard label="Tổng người dùng" value={fmtNum(summary.total_users)} />
                )}
              </div>
            )}

            {signups.length > 1 && (
              <Card>
                <CardContent className="space-y-2 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Người dùng mới (30 ngày)
                  </p>
                  <SupabaseSignupChart data={signups} />
                </CardContent>
              </Card>
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
                        <th className="px-4 py-2.5 text-right">Ước tính</th>
                        <th className="px-4 py-2.5 text-right">Chính xác</th>
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
                            <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                              {fmtNum(t.rows)}
                            </td>
                            <td className="px-4 py-2.5 text-right tabular-nums font-medium text-foreground">
                              {t.rows_exact != null ? fmtNum(t.rows_exact) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Applied migrations (DB schema history) */}
            {(migrations.length > 0 || migrationsNote) && (
              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Lịch sử migration ({migrations.length})
                </p>
                {migrationsNote ? (
                  <p className="text-xs text-muted-foreground">{migrationsNote}</p>
                ) : (
                  <Card>
                    <CardContent className="p-0">
                      <div className="max-h-72 overflow-auto">
                        <table className="w-full text-sm">
                          <thead className="sticky top-0 bg-card">
                            <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                              <th className="px-4 py-2">Version</th>
                              <th className="px-4 py-2">Tên</th>
                            </tr>
                          </thead>
                          <tbody>
                            {migrations.map((m) => (
                              <tr
                                key={m.version}
                                className="border-b border-border/40 last:border-0 hover:bg-gold/5"
                              >
                                <td className="whitespace-nowrap px-4 py-1.5 font-mono text-muted-foreground">
                                  {m.version}
                                </td>
                                <td className="px-4 py-1.5 text-foreground/90">
                                  {m.name ?? '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      />
    </>
  );
}
