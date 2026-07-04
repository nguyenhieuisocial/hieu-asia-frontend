'use client';

/**
 * /admin/feature-flags — toggle worker-side flags backed by KV `feature-flag:`.
 *
 * Worker seeds the defaults on first read, so the list is always populated.
 * Toggling optimistically updates the row, then invalidates the query.
 *
 * Each flag also exposes:
 *   - an editable rollout % (0–100) persisted via the same toggle endpoint, and
 *   - a "Lịch sử thay đổi" drawer reading the audit log filtered by
 *     resource_id = <flag key> (action admin.feature_flag.toggled).
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  StatusBadge,
  Switch,
  toast,
} from '@hieu-asia/ui';
import { Flag, History } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { useOptimisticMutation } from '@/lib/optimistic-mutation';
import { trackAdminMutation } from '@/lib/admin-breadcrumb';
import { clampRolloutPct } from '@/lib/rollout-pct';
import { fmtDateTime } from '@/lib/format';

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

interface AuditEntry {
  ts?: string | null;
  actor?: string | null;
  action?: string | null;
  resource_id?: string | null;
  metadata?: Record<string, unknown> | null;
}

interface AuditResponse {
  ok: boolean;
  entries?: AuditEntry[];
  note?: string;
  error?: string;
}

/** Mutation variables — `rollout_pct` optional so a plain toggle keeps it. */
interface ToggleVars {
  key: string;
  enabled: boolean;
  rollout_pct?: number;
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

async function toggleFlag(input: ToggleVars): Promise<FeatureFlag> {
  const r = await fetch('/api/admin/feature-flags/toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await r.json().catch(() => ({ ok: false, error: `HTTP ${r.status}` }));
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.flag as FeatureFlag;
}

async function fetchFlagHistory(flagKey: string): Promise<AuditResponse> {
  const qs = new URLSearchParams({
    action: 'admin.feature_flag.toggled',
    resource_id: flagKey,
    limit: '50',
  });
  const res = await fetch(`/api/admin/audit-log?${qs.toString()}`, { cache: 'no-store' });
  const text = await res.text();
  try {
    return JSON.parse(text) as AuditResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

const FLAGS_QUERY_KEY = ['admin', 'feature-flags'] as const;

// ---------------------------------------------------------------------------
// Per-flag change-history drawer (reuses the audit-log endpoint).
// ---------------------------------------------------------------------------

function HistoryRow({ entry }: { entry: AuditEntry }) {
  const meta = entry.metadata ?? {};
  const enabled = typeof meta.enabled === 'boolean' ? meta.enabled : undefined;
  const rollout = typeof meta.rollout_pct === 'number' ? meta.rollout_pct : undefined;
  return (
    <li className="rounded-lg border border-gold/15 bg-card/60 px-3 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted-foreground">{fmtDateTime(entry.ts)}</span>
        <span className="truncate font-mono text-[11px] text-gold" title={entry.actor ?? ''}>
          {entry.actor ?? '—'}
        </span>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
        {enabled !== undefined && (
          <span
            className={
              enabled
                ? 'font-mono uppercase tracking-wider text-jade-700 dark:text-jade-300'
                : 'font-mono uppercase tracking-wider text-muted-foreground'
            }
          >
            {enabled ? 'ON' : 'OFF'}
          </span>
        )}
        {rollout !== undefined && (
          <span className="inline-flex items-center rounded-full border border-gold/20 bg-gold/5 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {rollout}% rollout
          </span>
        )}
      </div>
    </li>
  );
}

function FlagHistoryDrawer({
  flagKey,
  open,
  onOpenChange,
}: {
  flagKey: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'feature-flags', 'history', flagKey],
    queryFn: () => fetchFlagHistory(flagKey as string),
    enabled: open && !!flagKey,
    staleTime: 30_000,
  });

  const entries = Array.isArray(data?.entries) ? data.entries : [];
  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;
  const note = data?.note;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Lịch sử thay đổi</SheetTitle>
          <SheetDescription>
            {flagKey ? (
              <code className="font-mono text-xs text-gold">{flagKey}</code>
            ) : (
              'Flag'
            )}{' '}
            — bật/tắt + rollout gần đây (tối đa 50 mục).
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4">
          {showError && (
            <ErrorBlock compact message={errorMsg ?? 'Không tải được lịch sử.'} />
          )}
          {!showError && isLoading && (
            <p className="px-1 py-6 text-center text-sm text-muted-foreground">Đang tải…</p>
          )}
          {!showError && !isLoading && entries.length === 0 && (
            <EmptyState
              title="Chưa có thay đổi nào"
              description={note ?? 'Flag này chưa được chỉnh sau khi audit log bắt đầu ghi.'}
              className="my-2 border-0 bg-transparent"
            />
          )}
          {!showError && entries.length > 0 && (
            <ul className="space-y-2">
              {entries.map((e, i) => (
                <HistoryRow key={`${e.ts ?? ''}-${i}`} entry={e} />
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Single flag row — enable switch + editable rollout %.
// ---------------------------------------------------------------------------

function FlagRow({
  flag,
  pending,
  onToggle,
  onSaveRollout,
  onOpenHistory,
}: {
  flag: FeatureFlag;
  pending: boolean;
  onToggle: (vars: ToggleVars) => void;
  onSaveRollout: (vars: ToggleVars) => void;
  onOpenHistory: (key: string) => void;
}) {
  const [pct, setPct] = React.useState(String(flag.rollout_pct));

  // Keep the local input in sync when the server value changes (e.g. after a
  // successful save / refetch) — but don't fight the user while they edit.
  React.useEffect(() => {
    setPct(String(flag.rollout_pct));
  }, [flag.rollout_pct]);

  const parsed = clampRolloutPct(Number(pct));
  const dirty = parsed !== flag.rollout_pct;

  const handlePctChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPct(e.target.value);
  }, []);

  const handleSave = React.useCallback(() => {
    onSaveRollout({ key: flag.key, enabled: flag.enabled, rollout_pct: parsed });
  }, [onSaveRollout, flag.key, flag.enabled, parsed]);

  const handleToggle = React.useCallback(
    (next: boolean) => {
      onToggle({ key: flag.key, enabled: next });
    },
    [onToggle, flag.key],
  );

  const handleHistory = React.useCallback(() => {
    onOpenHistory(flag.key);
  }, [onOpenHistory, flag.key]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gold/15 bg-card/60 px-4 py-3 transition-all duration-300 ease-editorial hover:border-gold/30 hover:bg-gold/[0.03]">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <code className="font-mono text-sm text-gold">{flag.key}</code>
          {flag.rollout_pct < 100 && (
            <StatusBadge status="warning" label={`${flag.rollout_pct}% rollout`} />
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{flag.description}</p>

        {/* Editable rollout % */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label
            htmlFor={`rollout-${flag.key}`}
            className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            Rollout %
          </label>
          <Input
            id={`rollout-${flag.key}`}
            type="number"
            min={0}
            max={100}
            step={1}
            value={pct}
            onChange={handlePctChange}
            disabled={pending}
            className="h-8 w-20"
            aria-label={`Rollout phần trăm cho ${flag.key}`}
          />
          <Button
            variant="outline"
            size="sm"
            disabled={pending || !dirty}
            onClick={handleSave}
          >
            Lưu rollout
          </Button>
          <Button variant="ghost" size="sm" onClick={handleHistory}>
            <History className="mr-1 h-3.5 w-3.5" aria-hidden />
            Lịch sử
          </Button>
        </div>

        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Cập nhật: {fmtDateTime(flag.last_modified)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={
            flag.enabled
              ? 'font-mono text-xs uppercase tracking-wider text-jade-700 dark:text-jade-300 transition-colors duration-300 ease-editorial'
              : 'font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors duration-300 ease-editorial'
          }
        >
          {flag.enabled ? 'ON' : 'OFF'}
        </span>
        <Switch checked={flag.enabled} disabled={pending} onCheckedChange={handleToggle} />
      </div>
    </div>
  );
}

export default function FeatureFlagsPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: FLAGS_QUERY_KEY,
    queryFn: fetchFlags,
    staleTime: 60_000,
  });

  const flags = data?.flags ?? [];
  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;

  const [historyKey, setHistoryKey] = React.useState<string | null>(null);
  const historyOpen = historyKey !== null;

  const handleOpenHistory = React.useCallback((key: string) => setHistoryKey(key), []);
  const handleHistoryOpenChange = React.useCallback((open: boolean) => {
    if (!open) setHistoryKey(null);
  }, []);

  // Optimistic mutation handles both the enable toggle and the rollout edit.
  // `enabled` + `rollout_pct` are operational config, not PII — safe to flip in
  // cache instantly; `onSettled` invalidate keeps eventual consistency.
  const flagMut = useOptimisticMutation<FlagsResponse, ToggleVars, FeatureFlag>({
    queryKey: FLAGS_QUERY_KEY,
    mutationFn: toggleFlag,
    applyOptimistic: (cache, vars) => {
      if (!cache?.flags) return cache;
      return {
        ...cache,
        flags: cache.flags.map((f) =>
          f.key === vars.key
            ? {
                ...f,
                enabled: vars.enabled,
                rollout_pct: vars.rollout_pct ?? f.rollout_pct,
              }
            : f,
        ),
      };
    },
    onSuccess: (flag) => {
      trackAdminMutation('feature-flags.update', 'success', {
        key: flag.key,
        enabled: flag.enabled,
        rollout_pct: flag.rollout_pct,
      });
      toast.success('Đã cập nhật flag', {
        description: `${flag.key} — ${flag.enabled ? 'ON' : 'OFF'} · ${flag.rollout_pct}%`,
      });
    },
    onError: (e) => {
      trackAdminMutation('feature-flags.update', 'failure', { error: e.message.slice(0, 200) });
      toast.error('Cập nhật thất bại', { description: e.message });
    },
  });

  const handleToggle = React.useCallback(
    (vars: ToggleVars) => flagMut.mutate(vars),
    [flagMut],
  );

  const enabledCount = flags.filter((f) => f.enabled).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feature flags"
        description="Cờ phía SERVER (Worker) — bật / tắt tính năng runtime, state trong Cloudflare KV (prefix `feature-flag:`). (Khác A/B test phía người dùng / PostHog ở /experiments.)"
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
            Toggle + rollout % áp dụng tức thì cho worker. Một số flag (cron, service binding) cần
            redeploy mới có tác dụng.
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
                <FlagRow
                  key={f.key}
                  flag={f}
                  pending={flagMut.isPending}
                  onToggle={handleToggle}
                  onSaveRollout={handleToggle}
                  onOpenHistory={handleOpenHistory}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <FlagHistoryDrawer
        flagKey={historyKey}
        open={historyOpen}
        onOpenChange={handleHistoryOpenChange}
      />
    </div>
  );
}
