'use client';

/**
 * Hạ tầng → Cloudflare Worker — deployments + cadence + metadata/cron/bindings/
 * routes detail panels.
 *
 * Data: GET /api/admin-proxy/admin/infra/cloudflare → worker `handleCloudflare`.
 * State handling lives in <InfraPanel> — including the not-configured setup card
 * the worker returns when its token can't read deployments. This page renders the
 * cadence tiles + 30d deploy chart, the worker metadata / cron / bindings /
 * routes panels (each shown only when the token could read it), honest
 * permission notes for any panel that 403'd, and the deployments table with a
 * row drill-down drawer.
 */

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import {
  getInfraCloudflare,
  type InfraCloudflareItem,
  type InfraCloudflareSummary,
  type InfraCfScriptMeta,
  type InfraCfCronTrigger,
  type InfraCfBinding,
  type InfraCfRoute,
  type InfraCfCadence,
  type InfraCfDeploySeriesPoint,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatRelativeOrEmpty } from '@/lib/format-date';
import { StatCard } from '@/components/stat-card';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';
import { CloudflareDeployDrawer } from '@/components/admin/infra/CloudflareDeployDrawer';
import {
  CfScriptMetaCard,
  CfCronCard,
  CfBindingsCard,
  CfRoutesCard,
  CfPermissionNotes,
} from '@/components/admin/infra/CloudflareDetailPanels';

const tool = getInfraTool('cloudflare')!;

// Recharts (~150KB) lazy-loaded so it stays out of the initial bundle (same
// pattern as VercelDeployChart).
const CloudflareDeployChart = dynamic(
  () =>
    import('@/components/admin/infra/CloudflareDeployChart').then(
      (m) => m.CloudflareDeployChart,
    ),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

function fmtNum(n: number): string {
  return n.toLocaleString('vi-VN');
}

export default function InfraCloudflarePage() {
  const query = useQuery({
    queryKey: ['infra', 'cloudflare'],
    queryFn: getInfraCloudflare,
    staleTime: 30_000,
  });

  const [openId, setOpenId] = React.useState<string | null>(null);

  const data = query.data?.ok ? query.data : null;
  const summary: InfraCloudflareSummary | undefined = data?.summary;
  const scriptMeta: InfraCfScriptMeta | null = data?.script_meta ?? null;
  const cron: InfraCfCronTrigger[] | null = data?.cron_triggers ?? null;
  const bindings: InfraCfBinding[] | null = data?.bindings ?? null;
  const routes: InfraCfRoute[] | null = data?.routes ?? null;
  const cadence: InfraCfCadence | null = data?.cadence ?? null;
  const deploySeries: InfraCfDeploySeriesPoint[] =
    data && Array.isArray(data.deploy_series) ? data.deploy_series : [];
  const notes: string[] = data && Array.isArray(data.permission_notes) ? data.permission_notes : [];

  return (
    <>
      <CloudflareDeployDrawer
        id={openId}
        open={openId !== null}
        onClose={() => setOpenId(null)}
      />
      <InfraPanel<InfraCloudflareItem>
        tool={tool}
        query={query}
        emptyTitle="Chưa có bản triển khai"
        renderTable={(items) => (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {summary && (
                <StatCard
                  label="Tổng số bản"
                  value={fmtNum(summary.total_deployments)}
                  hint={
                    formatRelativeOrEmpty(summary.live_deployment_at)
                      ? `Đang chạy ${formatRelativeOrEmpty(summary.live_deployment_at)}`
                      : undefined
                  }
                />
              )}
              {cadence && (
                <>
                  <StatCard label="Deploy 7 ngày" value={fmtNum(cadence.deploys_7d)} />
                  <StatCard label="Deploy 30 ngày" value={fmtNum(cadence.deploys_30d)} />
                  <StatCard
                    label="Cách lần cuối"
                    value={
                      cadence.days_since_last == null
                        ? '—'
                        : cadence.days_since_last === 0
                          ? 'Hôm nay'
                          : `${cadence.days_since_last} ngày`
                    }
                  />
                </>
              )}
            </div>

            {deploySeries.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Tần suất deploy (30 ngày)
                  </p>
                  <CloudflareDeployChart data={deploySeries} />
                </CardContent>
              </Card>
            )}

            <CfPermissionNotes notes={notes} />
            {scriptMeta && <CfScriptMetaCard meta={scriptMeta} />}
            {cron && <CfCronCard crons={cron} />}
            {bindings && <CfBindingsCard bindings={bindings} />}
            {routes && <CfRoutesCard routes={routes} />}

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
                          onClick={() => setOpenId(d.id)}
                          className="cursor-pointer border-b border-border/50 last:border-0 hover:bg-gold/5"
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
    </>
  );
}
