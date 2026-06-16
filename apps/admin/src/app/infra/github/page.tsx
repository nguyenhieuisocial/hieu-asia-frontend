'use client';

/**
 * Hạ tầng → GitHub Actions — recent workflow runs.
 *
 * Data: GET /api/admin-proxy/admin/infra/github → worker `handleGithub`.
 * State handling lives in <InfraPanel>; this page declares the run columns and
 * colours each run by its `conclusion` (success → jade, failure → red).
 */

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@hieu-asia/ui';
import { ExternalLink } from 'lucide-react';
import { getInfraGithub, type InfraGithubItem } from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatRelativeOrEmpty } from '@/lib/format-date';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';

const tool = getInfraTool('github')!;

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
  const query = useQuery({
    queryKey: ['infra', 'github'],
    queryFn: getInfraGithub,
    staleTime: 30_000,
  });

  return (
    <InfraPanel<InfraGithubItem>
      tool={tool}
      query={query}
      emptyTitle="Chưa có lần chạy gần đây"
      renderTable={(items) => (
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
                    <th className="px-4 py-2.5 text-right">Mở</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r, idx) => {
                    const { label, tone } = runTone(r.status, r.conclusion);
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
      )}
    />
  );
}
