'use client';

/**
 * Dashboard health widget — shows the state of critical sub-systems.
 *
 * Reads from real endpoints when available:
 *   GET /admin/queue_depth           (worker queue health)
 *   GET /admin/secrets/list          (bootstrap status)
 *
 * Falls back to "unknown" rather than throwing — this widget should never
 * crash the dashboard.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, AlertTriangle, MinusCircle, Loader2 } from 'lucide-react';
import { cn } from '@hieu-asia/ui';
import { useQueueDepth } from '@/hooks/useQueueDepth';

type Status = 'ok' | 'warn' | 'down' | 'unknown';

interface HealthRow {
  label: string;
  detail?: React.ReactNode;
  status: Status;
}

async function fetchSecretsBootstrap(): Promise<{
  cf_token_set: boolean;
  vercel_token_set: boolean;
} | null> {
  try {
    const r = await fetch('/api/admin-proxy/admin/secrets/list', { cache: 'no-store' });
    if (!r.ok) return null;
    const data = (await r.json()) as {
      ok?: boolean;
      bootstrap?: { cf_token_set?: boolean; vercel_token_set?: boolean };
    };
    if (!data?.bootstrap) return null;
    return {
      cf_token_set: !!data.bootstrap.cf_token_set,
      vercel_token_set: !!data.bootstrap.vercel_token_set,
    };
  } catch {
    return null;
  }
}

async function fetchHealth(): Promise<{ version?: string; commit?: string; uptime?: number } | null> {
  try {
    const r = await fetch('/api/admin-proxy/health', { cache: 'no-store' });
    if (!r.ok) return null;
    return (await r.json()) as { version?: string; commit?: string; uptime?: number };
  } catch {
    return null;
  }
}

function StatusDot({ status }: { status: Status }) {
  if (status === 'ok') return <CheckCircle2 className="h-3.5 w-3.5 text-jade-700 dark:text-jade-50" />;
  if (status === 'warn') return <AlertTriangle className="h-3.5 w-3.5 text-warn-700 dark:text-gold" />;
  if (status === 'down') return <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />;
  return <MinusCircle className="h-3.5 w-3.5 text-muted-foreground" />;
}

export function HealthWidget() {
  const queue = useQueueDepth();
  const secrets = useQuery({
    queryKey: ['admin', 'secrets-bootstrap'],
    queryFn: fetchSecretsBootstrap,
    refetchInterval: 60_000,
  });
  const health = useQuery({
    queryKey: ['admin', 'worker-health'],
    queryFn: fetchHealth,
    refetchInterval: 60_000,
  });

  const queueStatus: Status = queue.isLoading
    ? 'unknown'
    : queue.data
      ? queue.data.oldest_pending_age_seconds && queue.data.oldest_pending_age_seconds > 3600
        ? 'warn'
        : 'ok'
      : 'unknown';

  const secretsStatus: Status = secrets.isLoading
    ? 'unknown'
    : secrets.data
      ? secrets.data.cf_token_set && secrets.data.vercel_token_set
        ? 'ok'
        : 'warn'
      : 'unknown';

  const workerStatus: Status = health.isLoading ? 'unknown' : health.data ? 'ok' : 'down';

  const rows: HealthRow[] = [
    {
      label: 'Worker API',
      status: workerStatus,
      detail: health.data?.version
        ? `v${health.data.version}`
        : workerStatus === 'down'
          ? 'không kết nối'
          : 'đang kiểm tra…',
    },
    {
      label: 'Queue depth',
      status: queueStatus,
      detail: queue.data ? (
        <>
          pending {queue.data.default ?? 0} · processing {queue.data.high_priority ?? 0}
          {queue.data.oldest_pending_age_seconds && queue.data.oldest_pending_age_seconds > 60 ? (
            <span className="ml-1 text-gold">
              · oldest {Math.round(queue.data.oldest_pending_age_seconds / 60)}m
            </span>
          ) : null}
        </>
      ) : (
        '…'
      ),
    },
    {
      label: 'Secrets bootstrap',
      status: secretsStatus,
      detail: secrets.data ? (
        <span>
          CF {secrets.data.cf_token_set ? '✓' : '✗'} · Vercel {secrets.data.vercel_token_set ? '✓' : '✗'}
        </span>
      ) : (
        '…'
      ),
    },
  ];

  const anyLoading = queue.isLoading || secrets.isLoading || health.isLoading;

  return (
    <div className="rounded-xl border border-gold/15 bg-card/60 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/85">
          Sức khoẻ hệ thống
        </h3>
        {anyLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      </div>
      <ul className="mt-3 space-y-2.5">
        {rows.map((r) => (
          <li key={r.label} className="flex items-start justify-between gap-3 text-xs">
            <span className="flex items-center gap-2">
              <StatusDot status={r.status} />
              <span className="text-foreground/85">{r.label}</span>
            </span>
            <span
              className={cn(
                'min-w-0 text-right font-mono text-[11px]',
                r.status === 'warn' && 'text-warn-700 dark:text-gold',
                r.status === 'down' && 'text-red-700 dark:text-red-300',
                (r.status === 'ok' || r.status === 'unknown') && 'text-muted-foreground',
              )}
            >
              {r.detail}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
