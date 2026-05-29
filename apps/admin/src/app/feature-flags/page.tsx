'use client';

/**
 * /admin/feature-flags — toggle worker-side flags backed by KV `feature-flag:`.
 *
 * Worker seeds the defaults on first read, so the list is always populated.
 * Toggling optimistically updates the row, then invalidates the query.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Switch,
  toast,
} from '@hieu-asia/ui';
import { Flag } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { useOptimisticMutation } from '@/lib/optimistic-mutation';
import { trackAdminMutation } from '@/lib/admin-breadcrumb';

interface FeatureFlag {
  key: string;
  description: string;
  enabled: boolean;
  rollout_pct: number;
  last_modified: string;
}

interface FlagsResponse {
  ok: boolean;
  flags?: FeatureFlag[];
  error?: string;
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

async function fetchFlags(): Promise<FlagsResponse> {
  const res = await fetch('/api/admin/feature-flags', { cache: 'no-store' });
  const text = await res.text();
  try {
    return JSON.parse(text) as FlagsResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

async function toggleFlag(input: { key: string; enabled: boolean }): Promise<FeatureFlag> {
  const r = await fetch('/api/admin/feature-flags/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await r.json().catch(() => ({ ok: false, error: `HTTP ${r.status}` }));
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.flag as FeatureFlag;
}

const FLAGS_QUERY_KEY = ['admin', 'feature-flags'] as const;

export default function FeatureFlagsPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: FLAGS_QUERY_KEY,
    queryFn: fetchFlags,
  });

  const flags = data?.flags ?? [];
  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;

  // Optimistic toggle: flip the row in cache instantly, rollback on error.
  // Removes the perceived lag from KV propagation while keeping eventual
  // consistency via `onSettled` invalidate.
  const toggleMut = useOptimisticMutation<
    FlagsResponse,
    { key: string; enabled: boolean },
    FeatureFlag
  >({
    queryKey: FLAGS_QUERY_KEY,
    mutationFn: toggleFlag,
    applyOptimistic: (cache, vars) => {
      if (!cache?.flags) return cache;
      return {
        ...cache,
        flags: cache.flags.map((f) =>
          f.key === vars.key ? { ...f, enabled: vars.enabled } : f,
        ),
      };
    },
    onSuccess: (flag) => {
      // Wave 60.15/60.16 — flag key + enabled state IS operational config,
      // not PII — safe to capture for "which flag flipped before incident?" trace.
      trackAdminMutation('feature-flags.toggle', 'success', {
        key: flag.key,
        enabled: flag.enabled,
      });
      toast.success(`Đã ${flag.enabled ? 'bật' : 'tắt'} flag`, { description: flag.key });
    },
    onError: (e) => {
      trackAdminMutation('feature-flags.toggle', 'failure', { error: e.message.slice(0, 200) });
      toast.error('Toggle thất bại', { description: e.message });
    },
  });

  const enabledCount = flags.filter((f) => f.enabled).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feature flags"
        description="Bật / tắt tính năng runtime. State lưu trong Cloudflare KV (CACHE namespace, prefix `feature-flag:`)."
        icon={<Flag className="h-5 w-5" />}
        badge={
          flags.length > 0 ? (
            <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 font-mono text-[10px] text-gold">
              {enabledCount}/{flags.length} bật
            </span>
          ) : null
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách flag</CardTitle>
          <CardDescription>
            Toggle áp dụng tức thì cho worker. Một số flag (cron, service binding) cần redeploy mới
            có tác dụng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4">
              <ErrorBlock
                compact
                message={errorMsg ?? 'Không tải được danh sách flag.'}
                onRetry={() => refetch()}
              />
            </div>
          )}

          {isLoading && (
            <div className="px-3 py-6 text-center text-muted-foreground">Đang tải…</div>
          )}

          {!isLoading && flags.length === 0 && !showError && (
            <EmptyState
              title="Chưa có flag nào"
              description="Worker sẽ seed defaults lần đầu gọi endpoint. Thử bấm Làm mới."
              className="my-2 border-0 bg-transparent"
            />
          )}

          {flags.length > 0 && (
            <div className="space-y-2">
              {flags.map((f) => (
                <div
                  key={f.key}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gold/15 bg-card/60 px-4 py-3 transition-all duration-300 ease-editorial hover:border-gold/30 hover:bg-gold/[0.03]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm text-gold">{f.key}</code>
                      {f.rollout_pct < 100 && (
                        <span className="inline-flex items-center rounded-full border border-warn-500/40 bg-warn-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warn-700 dark:text-warn-300">
                          {f.rollout_pct}% rollout
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Cập nhật: {fmtDate(f.last_modified)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        f.enabled
                          ? 'font-mono text-xs uppercase tracking-wider text-jade-700 dark:text-jade-300 transition-colors duration-300 ease-editorial'
                          : 'font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors duration-300 ease-editorial'
                      }
                    >
                      {f.enabled ? 'ON' : 'OFF'}
                    </span>
                    <Switch
                      checked={f.enabled}
                      disabled={toggleMut.isPending}
                      onCheckedChange={(next) => toggleMut.mutate({ key: f.key, enabled: next })}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
