'use client';

/**
 * Hạ tầng → GitHub Actions — recent workflow runs.
 *
 * Data: GET /api/admin-proxy/admin/infra/github → worker `handleGithub`.
 * State handling lives in <InfraPanel>; this page declares the run columns and
 * colours each run by its `conclusion` (success → jade, failure → red).
 */

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardContent, toast } from '@hieu-asia/ui';
import { ExternalLink, RotateCw } from 'lucide-react';
import {
  getInfraGithub,
  postInfraGithubRerun,
  type InfraGithubItem,
  type InfraGithubSummary,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatRelativeOrEmpty } from '@/lib/format-date';
import { StatCard } from '@/components/stat-card';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';

const tool = getInfraTool('github')!;

// The rerun endpoint validates `repo ∈ hieu-asia-frontend | hieu-asia-backend`.
// The row's `repo` may arrive as `owner/name` — strip any leading owner segment
// and only enable the button when the result is one of the two allowed repos.
const RERUN_REPOS = new Set(['hieu-asia-frontend', 'hieu-asia-backend']);
function normalizeRepo(repo: string): string | null {
  const short = repo.includes('/') ? repo.split('/').pop()! : repo;
  return RERUN_REPOS.has(short) ? short : null;
}

/** A conclusion that warrants a re-run button (the job did not succeed). */
function isRerunnable(conclusion: string | null): boolean {
  const c = (conclusion ?? '').toLowerCase();
  return c === 'failure' || c === 'cancelled' || c === 'timed_out' || c === 'startup_failure';
}

/** Inline "Chạy lại" button — in-flight disabled, toast on result, then refetch. */
function RerunButton({
  repo,
  runId,
  onDone,
}: {
  repo: string;
  runId: number | string;
  onDone: () => void;
}) {
  const [pending, setPending] = React.useState(false);
  const click = React.useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (pending) return;
      setPending(true);
      const res = await postInfraGithubRerun(repo, runId);
      setPending(false);
      if (res.ok) {
        toast.success('Đã yêu cầu chạy lại workflow.');
        onDone();
        return;
      }
      if ((res.error ?? '').toLowerCase().includes('actions:write')) {
        toast.error('GITHUB_TOKEN thiếu quyền actions:write.');
        return;
      }
      toast.error(res.error ?? 'Không chạy lại được workflow.');
    },
    [repo, runId, pending, onDone],
  );
  return (
    <Button variant="outline" size="sm" onClick={click} disabled={pending}>
      <RotateCw className={`mr-1.5 h-3.5 w-3.5 ${pending ? 'animate-spin' : ''}`} />
      {pending ? 'Đang gửi…' : 'Chạy lại'}
    </Button>
  );
}

/** A run is `in_progress`/`queued` until it has a conclusion. */
function runTone(
  status: string | null,
  conclusion: string | null,
): { label: string; tone: 'good' | 'bad' | 'warn' | 'neutral' } {
  if (!conclusion) {
    return { label: status ?? '—', tone: 'warn' };
  }
  switch (conclusion.toLowerCase()) {
    case 'success':
      return { label: conclusion, tone: 'good' };
    case 'failure':
    case 'timed_out':
    case 'startup_failure':
      return { label: conclusion, tone: 'bad' };
    case 'cancelled':
    case 'skipped':
      return { label: conclusion, tone: 'neutral' };
    default:
      return { label: conclusion, tone: 'neutral' };
  }
}

export default function InfraGithubPage() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['infra', 'github'],
    queryFn: getInfraGithub,
    staleTime: 30_000,
  });
  const refetchList = React.useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['infra', 'github'] }),
    [queryClient],
  );

  const summary: InfraGithubSummary | undefined =
    query.data?.ok ? query.data.summary : undefined;
  const lastDeploy = summary?.last_worker_deploy;
  const deployTone = lastDeploy
    ? runTone(null, lastDeploy.conclusion)
    : null;

  return (
    <InfraPanel<InfraGithubItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có lần chạy gần đây"
      renderTable={(items) => (
        <div className="space-y-6">
          {lastDeploy && deployTone && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                label="Lần deploy Worker gần nhất"
                value={<InfraStatusPill label={deployTone.label} tone={deployTone.tone} />}
                hint={formatRelativeOrEmpty(lastDeploy.created_at) || undefined}
              />
            </div>
          )}
          <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-2.5">Kết quả</th>
                    <th className="px-4 py-2.5">Workflow</th>
                    <th className="px-4 py-2.5">Nhánh</th>
                    <th className="px-4 py-2.5">Người chạy</th>
                    <th className="px-4 py-2.5">Thời gian</th>
                    <th className="px-4 py-2.5 text-right">Hành động</th>
                    <th className="px-4 py-2.5 text-right">Mở</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r, idx) => {
                    const { label, tone } = runTone(r.status, r.conclusion);
                    const repo = normalizeRepo(r.repo);
                    const canRerun =
                      isRerunnable(r.conclusion) && repo !== null && r.run_id != null;
                    return (
                      <tr
                        key={r.url ?? `${r.repo}-${r.workflow}-${idx}`}
                        className="border-b border-border/50 last:border-0 hover:bg-gold/5"
                      >
                        <td className="px-4 py-2.5">
                          <InfraStatusPill label={label} tone={tone} />
                        </td>
                        <td className="max-w-[20rem] px-4 py-2.5">
                          <div className="truncate font-medium text-foreground">
                            {r.workflow}
                          </div>
                          <div className="truncate font-mono text-xs text-muted-foreground">
                            {r.repo}
                          </div>
                        </td>
                        <td className="max-w-[12rem] truncate px-4 py-2.5 font-mono text-xs text-muted-foreground">
                          {r.branch ?? '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                          {r.actor ?? '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                          {formatRelativeOrEmpty(r.created_at) || '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-right">
                          {canRerun ? (
                            <RerunButton
                              repo={repo!}
                              runId={r.run_id!}
                              onDone={refetchList}
                            />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {r.url ? (
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-gold hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
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
  );
}
