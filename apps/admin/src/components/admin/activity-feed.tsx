'use client';

/**
 * Dashboard activity feed — last N events.
 *
 * Order of fallback for the data source:
 *   1. /admin/audit-log?limit=10 (via /api/admin/audit-log)  (preferred — ships)
 *   2. /admin/sessions?limit=10 (already real-data)          (fallback)
 *
 * Renders a vertical timeline with relative timestamps + colored dot per event
 * type. Empty state shows a friendly hint.
 */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@hieu-asia/ui';
import { Activity } from 'lucide-react';
import { listSessions } from '@/lib/admin-api';

interface AuditEntry {
  id: string;
  ts: string;
  actor?: string;
  action: string;
  detail?: string;
  href?: string;
  tone: 'gold' | 'jade' | 'purple' | 'red' | 'neutral';
}

async function fetchAudit(): Promise<AuditEntry[] | null> {
  try {
    const r = await fetch('/api/admin/audit-log?limit=10', { cache: 'no-store' });
    if (!r.ok) return null;
    const data = (await r.json()) as { ok?: boolean; entries?: Array<{
      id: string;
      ts: string;
      actor?: string;
      action: string;
      detail?: string;
      resource_id?: string | null;
    }>};
    if (!data?.ok || !Array.isArray(data.entries)) return null;
    return data.entries
      // Drop malformed audit rows — a missing id/ts/action would render a
      // keyless <li>, a NaN timestamp, or a blank action.
      .filter((e) => e && typeof e.id === 'string' && typeof e.ts === 'string' && typeof e.action === 'string')
      .map((e): AuditEntry => ({
      id: e.id,
      ts: e.ts,
      actor: e.actor,
      action: e.action,
      detail: e.detail ?? e.resource_id ?? undefined,
      tone:
        e.action.includes('error') || e.action.includes('fail')
          ? 'red'
          : e.action.includes('paid') || e.action.includes('refund')
            ? 'jade'
            : e.action.includes('coupon') || e.action.includes('admin')
              ? 'gold'
              : 'purple',
    }));
  } catch {
    return null;
  }
}

function relTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return iso;
  const sec = Math.max(0, (Date.now() - t) / 1000);
  if (sec < 60) return `${sec.toFixed(0)}s trước`;
  const m = sec / 60;
  if (m < 60) return `${m.toFixed(0)}m trước`;
  const h = m / 60;
  if (h < 24) return `${h.toFixed(0)}h trước`;
  const d = h / 24;
  if (d < 7) return `${d.toFixed(0)}d trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
}

const TONE_DOT: Record<AuditEntry['tone'], string> = {
  gold: 'bg-gold border-gold/40',
  jade: 'bg-jade-50 border-jade/40',
  purple: 'bg-purple-50 border-purple/40',
  red: 'bg-red-400 border-red-500/40',
  neutral: 'bg-muted border-border',
};

export function ActivityFeed() {
  const audit = useQuery({ queryKey: ['admin', 'audit-feed'], queryFn: fetchAudit, refetchInterval: 30_000 });
  const sessions = useQuery({
    queryKey: ['admin', 'recent-sessions'],
    queryFn: () => listSessions({ page_size: 10, page: 1 }),
    enabled: !audit.data,
    staleTime: 60_000,
  });

  // Map sessions → activity entries (fallback)
  const fallbackEntries: AuditEntry[] = React.useMemo(() => {
    const rows = sessions.data?.rows ?? [];
    return rows.slice(0, 10).map((s): AuditEntry => ({
      id: s.session_id,
      ts: s.created_at,
      actor: s.user_email || '—',
      action: `Phiên ${s.status}`,
      detail: s.primary_concern,
      href: `/sessions/${s.session_id}`,
      tone:
        s.status === 'failed'
          ? 'red'
          : s.status === 'completed'
            ? 'jade'
            : s.status === 'running'
              ? 'gold'
              : 'purple',
    }));
  }, [sessions.data]);

  const entries = audit.data ?? fallbackEntries;
  const isLoading = audit.isLoading || (!audit.data && sessions.isLoading);
  const noData = !isLoading && entries.length === 0;
  const isFallback = !audit.data && fallbackEntries.length > 0;

  return (
    <div className="rounded-xl border border-gold/15 bg-card/60 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/85">
          Hoạt động gần đây
        </h3>
        {isFallback && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            sessions feed
          </span>
        )}
      </div>

      {isLoading && (
        <ul className="mt-3 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="flex animate-pulse items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-muted/40" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2 w-2/3 rounded bg-muted/40" />
                <div className="h-2 w-1/3 rounded bg-muted/30" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {noData && (
        <div className="mt-4 flex flex-col items-center gap-2 py-6 text-center">
          <Activity className="h-6 w-6 text-foreground/30" />
          <p className="text-xs text-muted-foreground">Chưa có hoạt động — chờ event đầu tiên.</p>
        </div>
      )}

      {!isLoading && entries.length > 0 && (
        <ol className="mt-4 space-y-3.5">
          {entries.map((e) => {
            const inner = (
              <>
                <span
                  className={cn(
                    'mt-1 h-2.5 w-2.5 shrink-0 rounded-full border ring-2 ring-ink/40',
                    TONE_DOT[e.tone],
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-medium text-foreground/90">{e.action}</span>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      {relTime(e.ts)}
                    </span>
                  </div>
                  {e.detail && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{e.detail}</p>
                  )}
                  {e.actor && (
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{e.actor}</p>
                  )}
                </div>
              </>
            );
            return (
              <li key={e.id} className="group">
                {e.href ? (
                  <Link
                    href={e.href}
                    className="flex items-start gap-3 rounded-md p-1 -mx-1 hover:bg-gold/5"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="flex items-start gap-3">{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
