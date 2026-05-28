'use client';

/**
 * /overview — single-pane operational dashboard.
 *
 * Wave 60.95.x — surfaces 7 KPI tiles, one per 3rd-party service, fetched
 * from WW's Worker endpoint `/admin/dashboard/overview` (proxied through the
 * admin Edge route to attach `X-Admin-Token`). Each tile links back to the
 * original dashboard as an escape hatch so the operator can drill in.
 *
 * Data fetching: `useAdminDashboard()` polls every 60s (matches Worker KV
 * TTL). Tiles render in three states:
 *   1. fetching, no cached data → skeleton (all 7 labels visible)
 *   2. success → real values from the Worker envelope, matched by `key`
 *   3. 404 / 500 / error → degraded to skeleton + compact error banner;
 *      the labels still render so the page LOOKS done even pre-WW-ship.
 */

import * as React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { PageHeader } from '@/components/admin/page-header';
import { LiveBadge } from '@/components/admin/live-badge';
import { ErrorBlock } from '@/components/admin/error-block';
import {
  AdminKpiCard,
  type KpiSource,
} from '@/components/admin-kpi-card';
import { useAdminDashboard, type Kpi } from '@/hooks/useAdminDashboard';

/**
 * Canonical 7-card grid. Labels + sources are stable; values come from the
 * Worker. If a slot's `key` isn't returned by the Worker we render a
 * skeleton card so the layout doesn't collapse to 6 tiles.
 */
interface PlaceholderCard {
  key: string;
  label: string;
  source: KpiSource;
  sourceUrl: string;
  subtitle: string;
}

const PLACEHOLDERS: PlaceholderCard[] = [
  {
    key: 'deploys_today',
    label: 'Deploys hôm nay',
    source: 'vercel',
    sourceUrl: 'https://vercel.com/hieu-asia',
    subtitle: 'Vercel · production deploys',
  },
  {
    key: 'errors_today',
    label: 'Lỗi hôm nay',
    source: 'sentry',
    sourceUrl: 'https://sentry.io/organizations/hieu-asia/issues/',
    subtitle: 'Sentry · sự kiện unresolved',
  },
  {
    key: 'signups_today',
    label: 'Đăng ký hôm nay',
    source: 'supabase',
    sourceUrl: 'https://supabase.com/dashboard/project/_/auth/users',
    subtitle: 'Supabase · auth.users',
  },
  {
    key: 'emails_today',
    label: 'Email gửi hôm nay',
    source: 'resend',
    sourceUrl: 'https://resend.com/emails',
    subtitle: 'Resend · sent volume',
  },
  {
    key: 'llm_cost_today',
    label: 'Chi phí LLM hôm nay',
    source: 'posthog',
    sourceUrl: 'https://us.posthog.com/project/_/insights',
    subtitle: 'PostHog · USD',
  },
  {
    key: 'worker_invocations_24h',
    label: 'Worker invocations 24h',
    source: 'cloudflare',
    sourceUrl: 'https://dash.cloudflare.com/?to=/:account/workers',
    subtitle: 'Cloudflare · Workers Analytics',
  },
  {
    key: 'dependabot_alerts',
    label: 'Dependabot alerts',
    source: 'github',
    sourceUrl: 'https://github.com/hieu-asia/frontend/security/dependabot',
    subtitle: 'GitHub · open alerts',
  },
];

function formatValue(raw: Kpi['value'], key: string): React.ReactNode {
  // Wave 60.95.ai — Worker `safe()` returns `null` when an upstream source
  // (Cloudflare GraphQL, GitHub REST, etc.) fails; render an em-dash so the
  // tile degrades gracefully instead of throwing `null.toFixed is not a function`
  // which surfaced as admin /overview 500 (founder report 2026-05-28).
  if (raw === null) return '—';
  if (typeof raw === 'string') return raw;
  // Currency keys get a USD prefix; everything else stays as a locale-formatted int.
  if (key === 'llm_cost_today') {
    return `$${raw.toFixed(2)}`;
  }
  return raw.toLocaleString('vi-VN');
}

export default function OverviewPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useAdminDashboard();

  const showError = isError || data?.ok === false;
  const errorMsg =
    (error as Error | undefined)?.message ??
    data?.error ??
    'Không tải được dashboard. Worker endpoint có thể chưa deploy.';

  // Index the Worker envelope by key for O(1) lookup against placeholders.
  const kpiByKey = React.useMemo(() => {
    const m = new Map<string, Kpi>();
    for (const k of data?.kpis ?? []) m.set(k.key, k);
    return m;
  }, [data?.kpis]);

  const hasAnyData = (data?.kpis?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Bảng điều khiển vận hành — 7 tín hiệu cốt lõi từ 7 nhà cung cấp, refresh mỗi 60 giây."
        icon={<LayoutDashboard className="h-5 w-5" />}
        badge={hasAnyData ? <LiveBadge /> : null}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? 'Đang tải…' : 'Làm mới'}
          </Button>
        }
      />

      {showError && (
        <ErrorBlock
          compact
          message={errorMsg}
          onRetry={() => refetch()}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PLACEHOLDERS.map((p) => {
          const live = kpiByKey.get(p.key);
          const loading = isLoading || (!live && !showError);
          return (
            <AdminKpiCard
              key={p.key}
              label={live?.label ?? p.label}
              value={live ? formatValue(live.value, p.key) : '—'}
              subtitle={live?.subtitle ?? p.subtitle}
              source={live?.source ?? p.source}
              sourceUrl={live?.sourceUrl ?? p.sourceUrl}
              trend={live?.trend ?? undefined}
              loading={loading}
            />
          );
        })}
      </div>

      {data?.generated_at && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Snapshot lúc{' '}
          {new Date(data.generated_at).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </p>
      )}
    </div>
  );
}
