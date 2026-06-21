'use client';

/**
 * "Cần chú ý hôm nay" — the admin home attention aggregator. Supersedes the old
 * WorkQueueWidget (which only surfaced pending refunds + unresolved feedback):
 * this panel rolls those two plus six more operational signals into ONE feed,
 * fed by a single backend aggregator.
 *
 *   GET /api/admin-proxy/admin/cockpit/attention
 *     → { ok, generatedAt, signals: Signal[] }
 *
 * Each signal is one row: a severity dot (high=red, medium=amber, low/info=muted),
 * a plain-Vietnamese label, a count badge, an optional one-line detail, all
 * linking to the admin route that lets the operator act.
 *
 * GRACEFUL by design — the aggregator deploys separately and may not exist yet:
 *   - endpoint 404 / network error / unexpected shape → quiet empty state, NEVER
 *     a crash. The home must always render.
 *   - all counts 0 → a calm "everything's fine" state.
 *
 * The endpoint is admin-gated (requireAdminSession, viewer-ok) and READ-ONLY:
 * the backend best-effort computes each signal and returns count 0 (healthy) or
 * omits a signal it couldn't compute — this component just renders what arrives.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@hieu-asia/ui';

type Severity = 'high' | 'medium' | 'low' | 'info';

/** One actionable signal from the aggregator. Mirrors the backend contract. */
interface AttentionSignal {
  /** Stable key, e.g. "stuck_readings". */
  id: string;
  severity: Severity;
  /** How many items need attention. 0 = healthy. */
  count: number;
  /** Plain Vietnamese, e.g. "Lá số trả phí đang kẹt". */
  label: string;
  /** Admin route to act, e.g. "/sessions?filter=stuck". */
  href: string;
  /** Optional one-line context. */
  detail?: string;
}

interface AttentionResponse {
  ok?: boolean;
  generatedAt?: string;
  signals?: AttentionSignal[];
}

/** Severity → sort rank (higher = more urgent, sorts first). */
const SEVERITY_RANK: Record<Severity, number> = {
  high: 3,
  medium: 2,
  low: 1,
  info: 0,
};

/**
 * Fetch the attention aggregator. Returns null on ANY hiccup (404 because the
 * endpoint deploys later, network error, non-ok body, wrong shape) so the panel
 * degrades to a quiet state instead of throwing. Filters out malformed signals
 * defensively — one bad row can't poison the whole feed.
 */
async function fetchAttention(): Promise<AttentionSignal[] | null> {
  try {
    const r = await fetch('/api/admin-proxy/admin/cockpit/attention', {
      cache: 'no-store',
    });
    if (!r.ok) return null;
    const data = (await r.json()) as AttentionResponse;
    if (data.ok === false || !Array.isArray(data.signals)) return null;
    return data.signals.filter(
      (s): s is AttentionSignal =>
        !!s &&
        typeof s.id === 'string' &&
        typeof s.label === 'string' &&
        typeof s.href === 'string' &&
        typeof s.count === 'number' &&
        (s.severity === 'high' ||
          s.severity === 'medium' ||
          s.severity === 'low' ||
          s.severity === 'info'),
    );
  } catch {
    return null;
  }
}

/** Severity dot color — high=red, medium=amber/warn, low/info=muted. */
function severityDotClass(severity: Severity): string {
  if (severity === 'high') return 'bg-red-500 dark:bg-red-400';
  if (severity === 'medium') return 'bg-warn-500 dark:bg-gold';
  return 'bg-muted-foreground/50';
}

/** Count-badge color — echoes the severity so the number reads at a glance. */
function severityBadgeClass(severity: Severity): string {
  if (severity === 'high')
    return 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300';
  if (severity === 'medium')
    return 'border-warn-500/30 bg-warn-500/10 text-warn-700 dark:text-gold';
  return 'border-gold/15 bg-muted/20 text-muted-foreground';
}

function SignalRow({ signal }: { signal: AttentionSignal }) {
  return (
    <Link
      href={signal.href}
      className="group flex items-center justify-between gap-3 rounded-lg border border-gold/10 bg-card/50 px-3 py-2.5 text-sm transition-all hover:border-gold/30 focus:outline-none focus:ring-2 focus:ring-ochre dark:focus:ring-gold"
    >
      <span className="flex min-w-0 items-start gap-2.5">
        <span
          className={cn(
            'mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full',
            severityDotClass(signal.severity),
          )}
          aria-hidden
        />
        <span className="min-w-0">
          <span className="block truncate text-foreground/85 group-hover:text-foreground">
            {signal.label}
          </span>
          {signal.detail && (
            <span className="block truncate text-xs text-muted-foreground">
              {signal.detail}
            </span>
          )}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1.5">
        <span
          className={cn(
            'inline-flex min-w-[1.5rem] items-center justify-center rounded-md border px-1.5 py-0.5 font-heading text-sm font-semibold tabular-nums',
            severityBadgeClass(signal.severity),
          )}
        >
          {signal.count}
        </span>
        <ChevronRight
          className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}

export function AttentionPanel() {
  const attention = useQuery({
    queryKey: ['admin', 'cockpit', 'attention'],
    queryFn: fetchAttention,
    staleTime: 60_000,
  });

  const isLoading = attention.isLoading;
  // null → endpoint failed / not deployed yet / wrong shape. Quiet, never crash.
  const signals = attention.data;

  // Only signals with work (count > 0) are worth a row. Sort by severity, then
  // by count (more items = higher). When nothing needs action → calm state.
  const actionable = React.useMemo(() => {
    if (!signals) return [];
    return signals
      .filter((s) => s.count > 0)
      .sort((a, b) => {
        const sev = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
        if (sev !== 0) return sev;
        return b.count - a.count;
      });
  }, [signals]);

  return (
    <div className="rounded-xl border border-gold/15 bg-card/60 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/85">
          Cần chú ý hôm nay
        </h3>
        {isLoading && (
          <Loader2
            className="h-3.5 w-3.5 animate-spin text-muted-foreground"
            aria-hidden
          />
        )}
      </div>

      {isLoading ? (
        <div className="mt-3 space-y-2">
          <div className="h-12 animate-pulse rounded-lg bg-muted/30" aria-hidden />
          <div className="h-12 animate-pulse rounded-lg bg-muted/30" aria-hidden />
          <div className="h-12 animate-pulse rounded-lg bg-muted/30" aria-hidden />
        </div>
      ) : signals == null ? (
        // Endpoint not reachable (likely deploys later) — quiet, not alarming.
        <p className="mt-3 text-xs text-muted-foreground">
          Chưa tải được dữ liệu cần chú ý.
        </p>
      ) : actionable.length === 0 ? (
        // All signals healthy (or none returned) — calm "all clear" state.
        <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-jade/20 bg-jade/5 px-3 py-3 text-sm">
          <CheckCircle2
            className="h-4 w-4 shrink-0 text-jade-700 dark:text-jade-50"
            aria-hidden
          />
          <span className="text-jade-700 dark:text-jade-50">
            Mọi thứ ổn — không có việc cần xử ngay.
          </span>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {actionable.map((s) => (
            <SignalRow key={s.id} signal={s} />
          ))}
        </div>
      )}
    </div>
  );
}
