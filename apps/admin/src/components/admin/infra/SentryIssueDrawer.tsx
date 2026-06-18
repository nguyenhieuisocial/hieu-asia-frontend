'use client';

/**
 * SentryIssueDrawer — slide-out detail for ONE Sentry issue + safe state actions.
 *
 * Opened from a row on /infra/sentry. Lazily fetches GET /admin/infra/sentry/:id
 * (React Query enabled only while open, keyed by the issue id) and renders the
 * issue header, the exception (type: value), the stack frames (innermost-first
 * mono list), and tags. Two safe actions — "Đánh dấu đã xử lý" (resolve) and
 * "Bỏ qua" (ignore) — POST to the worker; on success they toast + call
 * `onResolved` so the page can invalidate the issues list (the issue then drops
 * out, since the list is `is:unresolved`). A `sentry_token_no_write_scope` error
 * gets a friendly toast instead of a raw error.
 */

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  toast,
} from '@hieu-asia/ui';
import { CheckCircle2, ExternalLink, EyeOff } from 'lucide-react';
import {
  getInfraSentryDetail,
  postInfraSentryResolve,
  postInfraSentryIgnore,
} from '@/lib/admin-api';
import { formatDateOrEmpty } from '@/lib/format-date';
import { ErrorBlock } from '@/components/admin/error-block';
import { InfraStatusPill } from '@/components/admin/infra/infra-panel';

// Recharts lazy-loaded so it stays out of the initial bundle (ssr:false because
// admin is auth-gated). Mirrors the Langfuse/AI-Gateway charts.
const SentryVolumeChart = dynamic(
  () =>
    import('@/components/admin/infra/SentryVolumeChart').then((m) => m.SentryVolumeChart),
  {
    ssr: false,
    loading: () => <div className="h-40 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

function breadcrumbTone(level: string | null): string {
  switch ((level ?? '').toLowerCase()) {
    case 'fatal':
    case 'error':
      return 'text-red-700 dark:text-red-300';
    case 'warning':
      return 'text-gold';
    default:
      return 'text-muted-foreground';
  }
}

function levelTone(level: string): 'good' | 'bad' | 'warn' | 'neutral' {
  switch (level.toLowerCase()) {
    case 'fatal':
    case 'error':
      return 'bad';
    case 'warning':
      return 'warn';
    default:
      return 'neutral';
  }
}

function StatLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1.5 last:border-0">
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-right text-sm text-foreground">{value}</span>
    </div>
  );
}

export interface SentryIssueDrawerProps {
  issueId: string | null;
  open: boolean;
  onClose: () => void;
  /** Called after a successful resolve/ignore so the page can refetch the list. */
  onResolved: () => void;
}

export function SentryIssueDrawer({
  issueId,
  open,
  onClose,
  onResolved,
}: SentryIssueDrawerProps): React.ReactElement {
  const enabled = open && !!issueId;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['infra', 'sentry', 'detail', issueId],
    queryFn: () => getInfraSentryDetail(issueId!),
    enabled,
    staleTime: 30_000,
  });

  const [pending, setPending] = React.useState<null | 'resolve' | 'ignore'>(null);

  const runAction = React.useCallback(
    async (kind: 'resolve' | 'ignore') => {
      if (!issueId || pending) return;
      const confirmMsg =
        kind === 'resolve'
          ? 'Đánh dấu lỗi này đã xử lý trên Sentry?'
          : 'Bỏ qua lỗi này trên Sentry?';
      if (!window.confirm(confirmMsg)) return;
      setPending(kind);
      const res =
        kind === 'resolve'
          ? await postInfraSentryResolve(issueId)
          : await postInfraSentryIgnore(issueId);
      setPending(null);
      if (res.ok) {
        toast.success(
          kind === 'resolve' ? 'Đã đánh dấu lỗi đã xử lý.' : 'Đã bỏ qua lỗi này.',
        );
        onResolved();
        onClose();
        return;
      }
      if (res.error === 'sentry_token_no_write_scope') {
        toast.error('Token Sentry thiếu quyền ghi — không đổi được trạng thái.');
        return;
      }
      toast.error(res.error ?? 'Thao tác thất bại.');
    },
    [issueId, pending, onResolved, onClose],
  );

  const issue = data && data.ok ? data.issue : undefined;
  const event = data && data.ok ? data.latest_event : null;
  const stats14d = data && data.ok ? data.stats_14d : null;
  const stats24h = data && data.ok ? data.stats_24h : null;
  const volume = stats14d && stats14d.length > 1 ? stats14d : stats24h;
  const volumeLabel = stats14d && stats14d.length > 1 ? 'Sự kiện (14 ngày)' : 'Sự kiện (24 giờ)';
  const recentEvents = data && data.ok ? (data.recent_events ?? []) : [];
  const breadcrumbs = event?.breadcrumbs ?? [];
  const showError = isError || (data && data.ok === false);
  const errorMsg = data && data.ok === false ? data.error : undefined;

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-start gap-2 break-words pr-6">
            {issue ? issue.title : 'Chi tiết lỗi'}
          </SheetTitle>
          {issue?.culprit && (
            <SheetDescription className="break-words font-mono text-xs">
              {issue.culprit}
            </SheetDescription>
          )}
        </SheetHeader>

        {showError && (
          <ErrorBlock
            compact
            message={errorMsg ?? 'Không tải được chi tiết lỗi.'}
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

        {issue && !isLoading && (
          <div className="space-y-5">
            {/* Safe actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => runAction('resolve')}
                disabled={pending !== null}
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                {pending === 'resolve' ? 'Đang lưu…' : 'Đánh dấu đã xử lý'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => runAction('ignore')}
                disabled={pending !== null}
              >
                <EyeOff className="mr-1.5 h-4 w-4" />
                {pending === 'ignore' ? 'Đang lưu…' : 'Bỏ qua'}
              </Button>
              {issue.permalink && (
                <a
                  href={issue.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 self-center text-sm text-gold hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Mở trên Sentry
                </a>
              )}
            </div>

            {/* Summary */}
            <div className="rounded-md border border-border bg-card/60 px-3 py-1">
              <StatLine
                label="Mức"
                value={<InfraStatusPill label={issue.level} tone={levelTone(issue.level)} />}
              />
              {issue.status && <StatLine label="Trạng thái" value={issue.status} />}
              <StatLine label="Số lần" value={issue.count.toLocaleString('vi-VN')} />
              <StatLine
                label="Người dùng"
                value={issue.userCount.toLocaleString('vi-VN')}
              />
              <StatLine
                label="Lần đầu"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    {formatDateOrEmpty(issue.firstSeen)}
                    {issue.is_new_24h && (
                      <span className="rounded bg-jade/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-jade-700 dark:text-jade-50">
                        mới 24h
                      </span>
                    )}
                  </span>
                }
              />
              <StatLine label="Gần nhất" value={formatDateOrEmpty(issue.lastSeen)} />
              {issue.first_release && (
                <StatLine
                  label="Phiên bản đầu"
                  value={<span className="font-mono text-xs">{issue.first_release}</span>}
                />
              )}
              {issue.last_release && (
                <StatLine
                  label="Phiên bản cuối"
                  value={<span className="font-mono text-xs">{issue.last_release}</span>}
                />
              )}
              {event?.release && (
                <StatLine
                  label="Phiên bản sự kiện"
                  value={<span className="font-mono text-xs">{event.release}</span>}
                />
              )}
            </div>

            {/* Event-volume chart (14d preferred, else 24h) */}
            {volume && volume.length > 1 && (
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {volumeLabel}
                </p>
                <SentryVolumeChart
                  data={volume}
                  label={stats14d && stats14d.length > 1 ? 'Sự kiện/ngày' : 'Sự kiện/giờ'}
                />
              </div>
            )}

            {/* Exception */}
            {event?.exception && (
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Ngoại lệ
                </p>
                <div className="rounded-md border border-red-400/30 bg-red-500/5 px-3 py-2 font-mono text-xs text-red-700 dark:text-red-200">
                  <span className="font-semibold">{event.exception.type ?? 'Error'}</span>
                  {event.exception.value && (
                    <span className="break-words">: {event.exception.value}</span>
                  )}
                </div>
              </div>
            )}

            {/* Stack frames (innermost first) */}
            {event && event.frames.length > 0 && (
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Stack (trong → ngoài)
                </p>
                <ol className="space-y-1">
                  {event.frames.map((f, i) => (
                    <li
                      key={`${f.filename ?? '?'}-${f.lineNo ?? i}-${i}`}
                      className="rounded border border-border/60 bg-card/60 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground"
                    >
                      <span className="text-foreground">{f.filename ?? '—'}</span>
                      {f.lineNo != null && <span className="text-gold">:{f.lineNo}</span>}
                      {f.function && (
                        <span className="block opacity-80">· {f.function}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Breadcrumbs (oldest → crash) */}
            {breadcrumbs.length > 0 && (
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Dấu vết (breadcrumbs)
                </p>
                <ol className="space-y-1">
                  {breadcrumbs.map((b, i) => (
                    <li
                      key={`${b.category ?? '?'}-${i}`}
                      className="rounded border border-border/60 bg-card/60 px-2.5 py-1.5 text-[11px]"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className={`font-mono ${breadcrumbTone(b.level)}`}>
                          {b.category ?? '—'}
                        </span>
                        {b.timestamp && (
                          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                            {formatDateOrEmpty(b.timestamp)}
                          </span>
                        )}
                      </div>
                      {b.message && (
                        <span className="mt-0.5 block break-words text-foreground/90">
                          {b.message}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Tags */}
            {event && event.tags.length > 0 && (
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((t, i) => (
                    <span
                      key={`${t.key}-${i}`}
                      className="rounded border border-gold/20 bg-gold/5 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      <span className="text-foreground">{t.key}</span>={t.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recent occurrences */}
            {recentEvents.length > 0 && (
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Lần xuất hiện gần đây ({recentEvents.length})
                </p>
                <ol className="space-y-1">
                  {recentEvents.map((e, i) => (
                    <li
                      key={`${e.id || 'evt'}-${i}`}
                      className="flex items-baseline justify-between gap-2 rounded border border-border/60 bg-card/60 px-2.5 py-1.5 text-[11px]"
                    >
                      <span className="truncate text-foreground/90">{e.title ?? e.id ?? '—'}</span>
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                        {formatDateOrEmpty(e.dateCreated)}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
