'use client';

/**
 * VercelDeployDrawer — slide-out detail for ONE Vercel deployment.
 *
 * Opened from a row on /infra/vercel. Lazily fetches
 * GET /admin/infra/vercel/:uid (React Query enabled only while open, keyed by
 * the uid) and shows state / target / branch+sha / commit message + author /
 * created & ready durations, a deep link to the build log on Vercel
 * (inspectorUrl), and — when present — the build logs in a scrollable <pre>.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@hieu-asia/ui';
import { ExternalLink } from 'lucide-react';
import {
  getInfraVercelDetail,
  type InfraVercelDetailDeployment,
} from '@/lib/admin-api';
import { formatDateOrEmpty } from '@/lib/format-date';
import { ErrorBlock } from '@/components/admin/error-block';
import { InfraStatusPill } from '@/components/admin/infra/infra-panel';

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

/** ms duration between two epoch-ms timestamps → "1m 23s" / "12s" / "—". */
function fmtDuration(from: number | null, to: number | null): string {
  if (from == null || to == null || !Number.isFinite(from) || !Number.isFinite(to)) {
    return '—';
  }
  const secs = Math.round((to - from) / 1000);
  if (secs < 0) return '—';
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

function StatLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1.5 last:border-0">
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="break-all text-right text-sm text-foreground">{value}</span>
    </div>
  );
}

export interface VercelDeployDrawerProps {
  uid: string | null;
  open: boolean;
  onClose: () => void;
}

export function VercelDeployDrawer({
  uid,
  open,
  onClose,
}: VercelDeployDrawerProps): React.ReactElement {
  const enabled = open && !!uid;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['infra', 'vercel', 'detail', uid],
    queryFn: () => getInfraVercelDetail(uid!),
    enabled,
    staleTime: 30_000,
  });

  const d: InfraVercelDetailDeployment | undefined =
    data && data.ok ? data.deployment : undefined;
  const logs = data && data.ok ? data.build_logs : undefined;
  const showError = isError || (data && data.ok === false);
  const errorMsg = data && data.ok === false ? data.error : undefined;

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="pb-4">
          <SheetTitle className="break-words pr-6">
            {d?.name ?? 'Chi tiết deploy'}
          </SheetTitle>
          {d?.meta?.githubCommitMessage && (
            <SheetDescription className="break-words">
              {d.meta.githubCommitMessage}
            </SheetDescription>
          )}
        </SheetHeader>

        {showError && (
          <ErrorBlock
            compact
            message={errorMsg ?? 'Không tải được chi tiết deploy.'}
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="space-y-2 pt-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted/30" />
            ))}
          </div>
        )}

        {d && !isLoading && (
          <div className="space-y-5">
            {d.inspectorUrl && (
              <a
                href={d.inspectorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-gold hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Xem log build trên Vercel
              </a>
            )}

            <div className="rounded-md border border-border bg-card/60 px-3 py-1">
              <StatLine
                label="Trạng thái"
                value={
                  <InfraStatusPill label={d.state ?? '—'} tone={stateTone(d.state)} />
                }
              />
              <StatLine label="Môi trường" value={d.target ?? '—'} />
              <StatLine
                label="Nhánh"
                value={
                  d.gitSource?.ref ? (
                    <span className="font-mono text-xs">
                      {d.gitSource.ref}
                      {d.gitSource.sha && (
                        <span className="text-muted-foreground">
                          {' '}
                          @ {d.gitSource.sha.slice(0, 7)}
                        </span>
                      )}
                    </span>
                  ) : (
                    '—'
                  )
                }
              />
              <StatLine
                label="Tác giả"
                value={d.meta?.githubCommitAuthorName ?? d.creator ?? '—'}
              />
              <StatLine label="Tạo lúc" value={formatDateOrEmpty(d.created)} />
              <StatLine
                label="Thời gian build"
                value={fmtDuration(d.buildingAt ?? d.created, d.ready)}
              />
            </div>

            {logs && logs.length > 0 && (
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Log build
                </p>
                <pre className="max-h-72 overflow-auto rounded-md border border-border bg-ink/90 px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground dark:bg-card/60">
                  {logs.map((l) => l.text).join('\n')}
                </pre>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
