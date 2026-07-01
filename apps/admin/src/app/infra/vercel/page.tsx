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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardContent, toast } from '@hieu-asia/ui';
import { ExternalLink, RotateCw } from 'lucide-react';
import {
  getInfraVercel,
  postInfraVercelRedeploy,
  type InfraVercelItem,
  type InfraVercelSummary,
  type InfraVercelSeriesPoint,
  type InfraVercelProject,
  type InfraVercelDomain,
  type InfraVercelEnvGroup,
} from '@/lib/admin-api';
import { useAdminRole } from '@/hooks/useAdminRole';
import { getInfraTool } from '@/lib/infra-tools';
import { formatDateOrEmpty, formatRelativeOrEmpty } from '@/lib/format-date';
import { StatCard } from '@/components/stat-card';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';
import { VercelDeployDrawer } from '@/components/admin/infra/VercelDeployDrawer';
import {
  VercelProjectCard,
  VercelDomainsCard,
  VercelEnvCard,
} from '@/components/admin/infra/VercelDetailPanels';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';

const tool = getInfraTool('vercel')!;

/** Header action: redeploy admin prod from git main. Owner/admin only. */
function RedeployButton() {
  const { role } = useAdminRole();
  const qc = useQueryClient();
  const [pending, setPending] = React.useState(false);
  const allowed = role === 'owner' || role === 'admin';
  const click = React.useCallback(async () => {
    if (pending) return;
    if (
      !window.confirm(
        'Triển khai lại bản production của admin từ nhánh main? (Không xoá bản cũ — Vercel giữ lại mọi bản triển khai trước.)',
      )
    )
      return;
    setPending(true);
    const res = await postInfraVercelRedeploy('admin');
    setPending(false);
    if (res.ok) {
      toast.success('Đã kích hoạt deploy lại từ main.');
      void qc.invalidateQueries({ queryKey: ['infra', 'vercel'] });
      return;
    }
    toast.error(res.error ?? 'Không kích hoạt được deploy lại.');
  }, [pending, qc]);
  if (!allowed) return null;
  return (
    <Button variant="outline" size="sm" onClick={click} disabled={pending}>
      <RotateCw className={`mr-1.5 h-3.5 w-3.5 ${pending ? 'animate-spin' : ''}`} />
      {pending ? 'Đang gửi…' : 'Deploy lại prod'}
    </Button>
  );
}

type EnvFilter = 'all' | 'production' | 'preview';

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

const DEPLOY_COLUMNS: AdminTableColumn<InfraVercelItem>[] = [
  {
    id: 'state',
    header: 'Trạng thái',
    cell: (d) => <InfraStatusPill label={d.state ?? '—'} tone={stateTone(d.state)} />,
  },
  {
    id: 'target',
    header: 'Môi trường',
    className: 'text-muted-foreground',
    cell: (d) => d.target ?? '—',
  },
  {
    id: 'commit',
    header: 'Commit',
    className: 'max-w-[24rem] truncate',
    cell: (d) =>
      d.commit_message ?? <span className="text-muted-foreground">—</span>,
  },
  {
    id: 'sha',
    header: 'SHA',
    className: 'whitespace-nowrap font-mono text-xs',
    cell: (d) =>
      d.commit_sha ? (
        d.commit_url ? (
          <a
            href={d.commit_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gold hover:underline"
          >
            {d.commit_sha.slice(0, 7)}
          </a>
        ) : (
          <span className="text-muted-foreground">{d.commit_sha.slice(0, 7)}</span>
        )
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: 'time',
    header: 'Thời gian',
    className: 'whitespace-nowrap text-muted-foreground',
    cell: (d) => (
      <>
        {formatDateOrEmpty(d.created)}
        {formatRelativeOrEmpty(d.created) && (
          <span className="ml-1.5 text-xs opacity-70">
            · {formatRelativeOrEmpty(d.created)}
          </span>
        )}
      </>
    ),
  },
  {
    id: 'open',
    header: 'Mở',
    className: 'text-right',
    cell: (d) =>
      d.url ? (
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
      ),
  },
];

export default function InfraVercelPage() {
  const query = useQuery({
    queryKey: ['infra', 'vercel'],
    queryFn: getInfraVercel,
    staleTime: 30_000,
  });

  const [openUid, setOpenUid] = React.useState<string | null>(null);
  const [envFilter, setEnvFilter] = React.useState<EnvFilter>('all');

  const summary: InfraVercelSummary | undefined =
    query.data?.ok ? query.data.summary : undefined;
  const series: InfraVercelSeriesPoint[] =
    query.data?.ok && Array.isArray(query.data.series) ? query.data.series : [];
  const project: InfraVercelProject | null =
    query.data?.ok && query.data.project ? query.data.project : null;
  const domains: InfraVercelDomain[] | null =
    query.data?.ok && Array.isArray(query.data.domains) ? query.data.domains : null;
  const envGroups: InfraVercelEnvGroup[] | null =
    query.data?.ok && Array.isArray(query.data.env_groups) ? query.data.env_groups : null;

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
      headerActions={<RedeployButton />}
      renderTable={(items) => {
       const filtered =
         envFilter === 'all'
           ? items
           : items.filter((d) => (d.target ?? '') === envFilter);
       return (
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

          {project && <VercelProjectCard project={project} />}
          {domains && <VercelDomainsCard domains={domains} />}
          {envGroups && <VercelEnvCard groups={envGroups} />}

          <Card>
            <CardContent className="p-0">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
                {(['all', 'production', 'preview'] as EnvFilter[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setEnvFilter(f)}
                    className={`rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${
                      envFilter === f
                        ? 'bg-gold/15 text-gold'
                        : 'text-muted-foreground hover:bg-muted/40'
                    }`}
                  >
                    {f === 'all' ? 'tất cả' : f}
                  </button>
                ))}
              </div>
              <AdminTable
                rows={filtered}
                columns={DEPLOY_COLUMNS}
                getRowId={(d) => d.uid}
                onRowClick={(d) => setOpenUid(d.uid)}
                caption="Danh sách deploy gần đây"
              />
            </CardContent>
          </Card>
        </div>
       );
      }}
    />
    </>
  );
}
