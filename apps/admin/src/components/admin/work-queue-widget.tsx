'use client';

/**
 * Dashboard "Cần xử lý" widget — surfaces unresolved work the founder would
 * otherwise forget to check. Two action-needed counts, each a clickable number
 * linking to its page:
 *
 *   - Hoàn tiền chờ duyệt   → /sepay  (refunds with status requested|approved)
 *   - Phản hồi chưa trả lời → /feedback (feedback with status new|triaged)
 *
 * Reuses the SAME proxied endpoints the /sepay and /feedback pages fetch:
 *   GET /api/admin-proxy/admin/sepay/refunds?limit=100  → { ok, refunds[] }
 *   GET /api/admin-proxy/admin/feedback?limit=100        → { ok, rows[] }
 *
 * GRACEFUL: each fetch is independent and falls back to `null` (never throws),
 * so a single failing endpoint hides only its own line — it can never crash the
 * dashboard. When a count is 0 we render a calm "✓ Không có" rather than a
 * scary red badge.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Undo2, MessageSquare, Loader2, ChevronRight } from 'lucide-react';
import { cn } from '@hieu-asia/ui';

// Mirror the status unions used on /sepay + /feedback so "needs action" stays
// in sync with those pages.
type RefundStatus = 'requested' | 'approved' | 'completed' | 'rejected';
type FeedbackStatus = 'new' | 'triaged' | 'resolved';

/**
 * Count refunds awaiting action (requested|approved) — same predicate as the
 * /sepay page's `pendingRefunds`. Returns null on any hiccup so the line hides
 * instead of crashing.
 */
async function fetchPendingRefunds(): Promise<number | null> {
  try {
    const r = await fetch('/api/admin-proxy/admin/sepay/refunds?limit=100', {
      cache: 'no-store',
    });
    if (!r.ok) return null;
    const data = (await r.json()) as {
      ok?: boolean;
      refunds?: Array<{ status: RefundStatus }>;
    };
    if (data.ok === false || !Array.isArray(data.refunds)) return null;
    return data.refunds.filter(
      (x) => x.status === 'requested' || x.status === 'approved',
    ).length;
  } catch {
    return null;
  }
}

/**
 * Count feedback not yet resolved (new|triaged) — mirrors the /feedback page's
 * new + triaged buckets. Returns null on any hiccup so the line hides.
 */
async function fetchUnresolvedFeedback(): Promise<number | null> {
  try {
    const r = await fetch('/api/admin-proxy/admin/feedback?limit=100', {
      cache: 'no-store',
    });
    if (!r.ok) return null;
    const data = (await r.json()) as {
      ok?: boolean;
      rows?: Array<{ status: FeedbackStatus }>;
    };
    if (data.ok === false || !Array.isArray(data.rows)) return null;
    return data.rows.filter(
      (x) => x.status === 'new' || x.status === 'triaged',
    ).length;
  } catch {
    return null;
  }
}

function ActionRow({
  icon,
  label,
  count,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  href: string;
}) {
  const hasWork = count > 0;
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-lg border border-gold/10 bg-card/50 px-3 py-2.5 text-sm transition-all hover:border-gold/30 focus:outline-none focus:ring-2 focus:ring-ochre dark:focus:ring-gold"
    >
      <span className="flex items-center gap-2.5">
        <span
          className={cn(
            'inline-flex h-7 w-7 items-center justify-center rounded-md border',
            hasWork
              ? 'border-gold/30 bg-gold/10 text-gold'
              : 'border-jade/25 bg-jade/5 text-jade-700 dark:text-jade-50',
          )}
          aria-hidden
        >
          {icon}
        </span>
        <span className="text-foreground/85 group-hover:text-foreground">{label}</span>
      </span>
      <span className="flex items-center gap-1.5">
        {hasWork ? (
          <span className="font-heading text-lg font-semibold tabular-nums text-gold">
            {count}
          </span>
        ) : (
          <span className="font-mono text-[11px] text-jade-700 dark:text-jade-50">
            ✓ Không có
          </span>
        )}
        <ChevronRight
          className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}

export function WorkQueueWidget() {
  const refunds = useQuery({
    queryKey: ['admin', 'work-queue', 'pending-refunds'],
    queryFn: fetchPendingRefunds,
    staleTime: 60_000,
  });
  const feedback = useQuery({
    queryKey: ['admin', 'work-queue', 'unresolved-feedback'],
    queryFn: fetchUnresolvedFeedback,
    staleTime: 60_000,
  });

  const anyLoading = refunds.isLoading || feedback.isLoading;
  // Each line only renders when its fetch resolved to a real number. A null
  // (endpoint failed / unexpected shape) hides that line — never crashes.
  const refundCount = refunds.data;
  const feedbackCount = feedback.data;
  const nothingToShow =
    !anyLoading && refundCount == null && feedbackCount == null;

  return (
    <div className="rounded-xl border border-gold/15 bg-card/60 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/85">
          Cần xử lý
        </h3>
        {anyLoading && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" aria-hidden />
        )}
      </div>

      {anyLoading ? (
        <div className="mt-3 space-y-2">
          <div className="h-12 animate-pulse rounded-lg bg-muted/30" aria-hidden />
          <div className="h-12 animate-pulse rounded-lg bg-muted/30" aria-hidden />
        </div>
      ) : nothingToShow ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Chưa tải được dữ liệu cần xử lý.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {refundCount != null && (
            <ActionRow
              icon={<Undo2 className="h-3.5 w-3.5" />}
              label="Hoàn tiền chờ duyệt"
              count={refundCount}
              href="/sepay"
            />
          )}
          {feedbackCount != null && (
            <ActionRow
              icon={<MessageSquare className="h-3.5 w-3.5" />}
              label="Phản hồi chưa trả lời"
              count={feedbackCount}
              href="/feedback"
            />
          )}
        </div>
      )}
    </div>
  );
}
