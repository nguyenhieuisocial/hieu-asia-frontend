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
  type InfraGithubDependabot,
  type InfraGithubPullRequest,
  type InfraGithubCommit,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatRelativeOrEmpty } from '@/lib/format-date';
import { fmtNumber } from '@/lib/format';
import { StatCard } from '@/components/stat-card';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';

type DependabotItem = InfraGithubDependabot['items'][number];

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
      if (!window.confirm(`Chạy lại workflow này trên ${repo}?`)) return;
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

/** Short 7-char sha for the recent-commits list. */
function shortSha(sha: string | null): string {
  return sha ? sha.slice(0, 7) : '—';
}

/** Map a PR's aggregate check state to a pill tone. */
function checksTone(
  checks: InfraGithubPullRequest['checks'],
): { label: string; tone: 'good' | 'bad' | 'warn' | 'neutral' } {
  switch (checks) {
    case 'success':
      return { label: 'success', tone: 'good' };
    case 'failure':
      return { label: 'failure', tone: 'bad' };
    case 'pending':
      return { label: 'pending', tone: 'warn' };
    default:
      return { label: 'none', tone: 'neutral' };
  }
}

/** Map a Dependabot severity → red danger styling for Critical/High when > 0. */
function severityCardClass(value: number): string | undefined {
  return value > 0
    ? 'border-red-400/40 bg-red-500/5 hover:border-red-400/60'
    : undefined;
}

function severityPillTone(severity: string | null): 'good' | 'bad' | 'warn' | 'neutral' {
  switch ((severity ?? '').toLowerCase()) {
    case 'critical':
    case 'high':
      return 'bad';
    case 'medium':
      return 'warn';
    case 'low':
      return 'neutral';
    default:
      return 'neutral';
  }
}

const DEPENDABOT_COLUMNS: AdminTableColumn<DependabotItem>[] = [
  {
    id: 'package',
    header: 'Gói',
    cell: (it) => (
      <>
        <div className="font-medium text-foreground">{it.package ?? '—'}</div>
        {it.summary && (
          <div className="max-w-[28rem] truncate text-xs text-muted-foreground">
            {it.summary}
          </div>
        )}
      </>
    ),
  },
  {
    id: 'ecosystem',
    header: 'Hệ sinh thái',
    className: 'whitespace-nowrap font-mono text-xs text-muted-foreground',
    cell: (it) => it.ecosystem ?? '—',
  },
  {
    id: 'severity',
    header: 'Mức độ',
    cell: (it) => (
      <InfraStatusPill label={it.severity ?? '—'} tone={severityPillTone(it.severity)} />
    ),
  },
  {
    id: 'code',
    header: 'Mã lỗi',
    className: 'whitespace-nowrap font-mono text-xs',
    cell: (it) => {
      const code = it.cve_id ?? it.ghsa_id;
      return code ? (
        it.url ? (
          <a
            href={it.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-gold hover:underline"
          >
            {code}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-muted-foreground">{code}</span>
        )
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
];

/** Dependabot security alerts — 4 severity StatCards + an items list. */
function DependabotSection({ data }: { data: InfraGithubDependabot }) {
  if (!data.available) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Dependabot
          </p>
          <p className="text-sm text-muted-foreground">
            Token GitHub thiếu quyền đọc Dependabot (cần scope security_events).
          </p>
        </CardContent>
      </Card>
    );
  }
  const sev = data.by_severity;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Critical"
          value={fmtNumber(sev.critical)}
          className={severityCardClass(sev.critical)}
        />
        <StatCard
          label="High"
          value={fmtNumber(sev.high)}
          className={severityCardClass(sev.high)}
        />
        <StatCard label="Medium" value={fmtNumber(sev.medium)} />
        <StatCard label="Low" value={fmtNumber(sev.low)} />
      </div>
      {data.items.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <AdminTable
              rows={data.items}
              columns={DEPENDABOT_COLUMNS}
              getRowId={(it) =>
                `${it.repo ?? ''}-${it.package ?? ''}-${it.ghsa_id ?? it.cve_id ?? ''}`
              }
              caption="Cảnh báo bảo mật Dependabot"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const PR_COLUMNS: AdminTableColumn<InfraGithubPullRequest>[] = [
  {
    id: 'checks',
    header: 'Checks',
    cell: (pr) => {
      const { label, tone } = checksTone(pr.checks);
      return <InfraStatusPill label={label} tone={tone} />;
    },
  },
  {
    id: 'pr',
    header: 'PR',
    className: 'max-w-[24rem]',
    cell: (pr) => (
      <>
        {pr.url ? (
          <a
            href={pr.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 font-medium text-gold hover:underline"
          >
            <span className="font-mono text-xs">#{pr.number ?? '—'}</span>{' '}
            <span className="truncate">{pr.title ?? '—'}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ) : (
          <span className="font-medium text-foreground">
            <span className="font-mono text-xs">#{pr.number ?? '—'}</span>{' '}
            {pr.title ?? '—'}
          </span>
        )}
        <div className="truncate font-mono text-xs text-muted-foreground">
          {pr.repo}
        </div>
      </>
    ),
  },
  {
    id: 'author',
    header: 'Tác giả',
    className: 'whitespace-nowrap text-muted-foreground',
    cell: (pr) => (
      <>
        {pr.author ?? '—'}
        {pr.draft && (
          <span className="ml-2">
            <InfraStatusPill label="draft" tone="neutral" />
          </span>
        )}
      </>
    ),
  },
  {
    id: 'branch',
    header: 'Nhánh',
    className: 'max-w-[14rem] truncate font-mono text-xs text-muted-foreground',
    cell: (pr) => (pr.head ?? '—') + ' → ' + (pr.base ?? '—'),
  },
  {
    id: 'created',
    header: 'Tạo lúc',
    className: 'whitespace-nowrap text-muted-foreground',
    cell: (pr) => formatRelativeOrEmpty(pr.created_at) || '—',
  },
];

/** Open pull requests — compact table with check-state pills. */
function OpenPrsSection({ prs }: { prs: InfraGithubPullRequest[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <p className="border-b border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Pull request đang mở
        </p>
        <AdminTable
          rows={prs}
          columns={PR_COLUMNS}
          getRowId={(pr) => pr.url ?? `${pr.repo}-${pr.number ?? ''}`}
          caption="Pull request đang mở"
        />
      </CardContent>
    </Card>
  );
}

/** Recent commits on the default branch — compact list. */
function RecentCommitsSection({ commits }: { commits: InfraGithubCommit[] }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Commit gần đây trên main
        </p>
        <ul className="space-y-2">
          {commits.map((c, idx) => (
            <li
              key={c.url ?? `${c.repo}-${c.sha ?? idx}`}
              className="flex items-start justify-between gap-4 rounded-md border border-border/60 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mr-2 font-mono text-xs text-gold hover:underline"
                    >
                      {shortSha(c.sha)}
                    </a>
                  ) : (
                    <span className="mr-2 font-mono text-xs text-muted-foreground">
                      {shortSha(c.sha)}
                    </span>
                  )}
                  {(c.message ?? '—').split('\n')[0]}
                </p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {c.repo} · {c.author ?? '—'}
                </p>
              </div>
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                {formatRelativeOrEmpty(c.date) || '—'}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
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

  // Built inside the component so the "Hành động" cell can close over
  // `refetchList` (the RerunButton onDone handler).
  const runColumns: AdminTableColumn<InfraGithubItem>[] = React.useMemo(
    () => [
      {
        id: 'result',
        header: 'Kết quả',
        cell: (r) => {
          const { label, tone } = runTone(r.status, r.conclusion);
          return <InfraStatusPill label={label} tone={tone} />;
        },
      },
      {
        id: 'workflow',
        header: 'Workflow',
        className: 'max-w-[20rem]',
        cell: (r) => (
          <>
            <div className="truncate font-medium text-foreground">{r.workflow}</div>
            <div className="truncate font-mono text-xs text-muted-foreground">
              {r.repo}
            </div>
          </>
        ),
      },
      {
        id: 'branch',
        header: 'Nhánh',
        className: 'max-w-[12rem] truncate font-mono text-xs text-muted-foreground',
        cell: (r) => r.branch ?? '—',
      },
      {
        id: 'actor',
        header: 'Người chạy',
        className: 'whitespace-nowrap text-muted-foreground',
        cell: (r) => r.actor ?? '—',
      },
      {
        id: 'time',
        header: 'Thời gian',
        className: 'whitespace-nowrap text-muted-foreground',
        cell: (r) => formatRelativeOrEmpty(r.created_at) || '—',
      },
      {
        id: 'action',
        header: 'Hành động',
        className: 'whitespace-nowrap text-right',
        cell: (r) => {
          const repo = normalizeRepo(r.repo);
          const canRerun =
            isRerunnable(r.conclusion) && repo !== null && r.run_id != null;
          return canRerun ? (
            <RerunButton repo={repo!} runId={r.run_id!} onDone={refetchList} />
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        id: 'open',
        header: 'Mở',
        className: 'text-right',
        cell: (r) =>
          r.url ? (
            <a
              href={r.url}
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
    ],
    [refetchList],
  );

  const summary: InfraGithubSummary | undefined =
    query.data?.ok ? query.data.summary : undefined;
  const dependabot: InfraGithubDependabot | undefined =
    query.data?.ok ? query.data.dependabot : undefined;
  const pullRequests: InfraGithubPullRequest[] =
    query.data?.ok && Array.isArray(query.data.pull_requests)
      ? query.data.pull_requests
      : [];
  const recentCommits: InfraGithubCommit[] =
    query.data?.ok && Array.isArray(query.data.recent_commits)
      ? query.data.recent_commits
      : [];
  const lastDeploy = summary?.last_worker_deploy;
  const deployTone = lastDeploy
    ? runTone(null, lastDeploy.conclusion)
    : null;

  return (
    <InfraPanel<InfraGithubItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có lần chạy gần đây"
      renderSummary={
        <>
          {lastDeploy && deployTone && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                label="Lần deploy Worker gần nhất"
                value={<InfraStatusPill label={deployTone.label} tone={deployTone.tone} />}
                hint={formatRelativeOrEmpty(lastDeploy.created_at) || undefined}
              />
            </div>
          )}
          {dependabot && <DependabotSection data={dependabot} />}
          {pullRequests.length > 0 && <OpenPrsSection prs={pullRequests} />}
          {recentCommits.length > 0 && (
            <RecentCommitsSection commits={recentCommits} />
          )}
        </>
      }
      renderTable={(items) => (
        <Card>
          <CardContent className="p-0">
            <AdminTable
              rows={items}
              columns={runColumns}
              getRowId={(r) => r.url ?? `${r.repo}-${r.workflow}-${r.run_id ?? ''}`}
              caption="Lần chạy workflow gần đây"
            />
          </CardContent>
        </Card>
      )}
    />
  );
}
