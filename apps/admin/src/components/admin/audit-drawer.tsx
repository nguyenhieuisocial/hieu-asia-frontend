'use client';

/**
 * AuditLogDrawer — slide-out drawer showing recent audit_log entries for a
 * specific resource (user, coupon, secret, …).
 *
 * Wire-up: each list page passes the row's identifier (e.g. user id, email,
 * coupon code) as `actorId` (matches the worker's `actor` filter). The drawer
 * fetches `/api/admin/audit-log?actor=<id>&limit=<n>` on open.
 *
 * Worker endpoint already supports `?actor=`, `?action=`, `?from=`, `?to=`,
 * `?limit=`. See `apps/admin/src/app/audit/page.tsx` for the full filter set
 * (we use just `actor` + `limit` here — the drawer is intentionally narrow).
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
import { Activity, AlertTriangle, ExternalLink } from 'lucide-react';

interface AuditEntry {
  id?: string;
  ts?: string | null;
  actor?: string | null;
  actor_type?: string | null;
  action?: string | null;
  resource_id?: string | null;
  ip?: string | null;
  metadata?: Record<string, unknown> | null;
}

interface AuditResponse {
  ok: boolean;
  entries?: AuditEntry[];
  note?: string;
  error?: string;
}

const HIGH_RISK_ACTIONS = new Set([
  'user_erased',
  'secret_rotated',
  'coupon_revoked',
  'admin_user_deleted',
  'admin_user_role_changed',
]);

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });
  } catch {
    return iso;
  }
}

function fmtRelative(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60_000);
    if (m < 1) return 'vừa xong';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  } catch {
    return '';
  }
}

async function fetchAudit(actor: string, limit: number): Promise<AuditResponse> {
  const qs = new URLSearchParams();
  qs.set('actor', actor);
  qs.set('limit', String(limit));
  const r = await fetch(`/api/admin/audit-log?${qs.toString()}`, { cache: 'no-store' });
  const text = await r.text();
  try {
    return JSON.parse(text) as AuditResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${r.status})` };
  }
}

export interface AuditLogDrawerProps {
  /** Resource identifier (email/user id/coupon code). Used as `?actor=`. */
  resourceId: string | null;
  /** Resource type — shown in the header (e.g. "user", "coupon"). */
  resourceType: string;
  /** Optional human-friendly label (e.g. user email). Defaults to `resourceId`. */
  resourceLabel?: string;
  /** Max entries to fetch. Default 10. */
  limit?: number;
  open: boolean;
  onClose: () => void;
}

export function AuditLogDrawer({
  resourceId,
  resourceType,
  resourceLabel,
  limit = 10,
  open,
  onClose,
}: AuditLogDrawerProps): React.ReactElement {
  const enabled = open && !!resourceId;
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'audit-log', 'drawer', resourceId, limit],
    queryFn: () => fetchAudit(resourceId!, limit),
    enabled,
  });

  const entries = data?.entries ?? [];
  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;
  const note = data?.note;
  const label = resourceLabel ?? resourceId ?? '';

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-gold" />
            Audit log
          </SheetTitle>
          <SheetDescription className="break-words">
            {limit} entry mới nhất cho {resourceType}{' '}
            <span className="font-mono text-cream/85">{label}</span>.
          </SheetDescription>
        </SheetHeader>

        {showError && (
          <div className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {errorMsg ?? 'Không tải được audit log.'}
          </div>
        )}

        {note && !showError && (
          <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-cream/70">
            {note}
          </div>
        )}

        {isLoading && (
          <div className="space-y-2 pt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded bg-cream/5" />
            ))}
          </div>
        )}

        {!isLoading && !showError && entries.length === 0 && (
          <p className="rounded-md border border-cream/10 bg-ink/40 px-3 py-4 text-center text-xs text-cream/55">
            Chưa có hoạt động nào cho {resourceType} này.
          </p>
        )}

        {entries.length > 0 && (
          <ol className="space-y-2">
            {entries.map((e, i) => {
              const highRisk = HIGH_RISK_ACTIONS.has(e.action ?? '');
              return (
                <li
                  key={e.id ?? `${e.ts ?? ''}-${i}`}
                  className="rounded-md border border-gold/15 bg-ink/40 px-3 py-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[11px] ${
                        highRisk
                          ? 'border-red-400/40 bg-red-500/10 text-red-200'
                          : 'border-gold/20 bg-gold/5 text-gold'
                      }`}
                    >
                      {highRisk && <AlertTriangle className="h-3 w-3" />}
                      {e.action ?? '—'}
                    </span>
                    <span className="font-mono text-[10px] text-cream/45">
                      {fmtRelative(e.ts)}
                    </span>
                  </div>
                  <div className="mt-1.5 font-mono text-[10px] text-cream/55" title={e.ts ?? ''}>
                    {fmtDate(e.ts)}
                  </div>
                  {e.resource_id && (
                    <div className="mt-1 font-mono text-[10px] text-cream/55">
                      <span className="text-cream/35">resource:</span> {e.resource_id}
                    </div>
                  )}
                  {e.ip && (
                    <div className="font-mono text-[10px] text-cream/55">
                      <span className="text-cream/35">ip:</span> {e.ip}
                    </div>
                  )}
                  {e.metadata && Object.keys(e.metadata).length > 0 && (
                    <pre className="mt-1.5 max-h-24 overflow-y-auto rounded bg-ink/60 px-2 py-1 font-mono text-[10px] text-cream/65">
                      {JSON.stringify(e.metadata, null, 2)}
                    </pre>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        <div className="pt-4">
          <a
            href={`/audit?actor=${encodeURIComponent(resourceId ?? '')}`}
            className="inline-flex items-center gap-1 text-xs text-gold hover:underline"
            onClick={onClose}
          >
            <ExternalLink className="h-3 w-3" />
            Mở trang audit log đầy đủ
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
