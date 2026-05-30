'use client';

import * as React from 'react';
import { ErrorBlock } from '@/components/admin/error-block';
import {
  AdminKpiCard,
  type KpiSource,
} from '@/components/admin-kpi-card';
import { useAdminDashboard, type Kpi } from '@/hooks/useAdminDashboard';

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
  if (raw === null) return '—';
  if (typeof raw === 'string') return raw;
  if (key === 'llm_cost_today') {
    return `$${raw.toFixed(2)}`;
  }
  return raw.toLocaleString('vi-VN');
}

export function PlatformKpiBand() {
  const { data, isLoading, isError, error, refetch } = useAdminDashboard();

  const showError = isError || data?.ok === false;
  const errorMsg =
    (error as Error | undefined)?.message ??
    data?.error ??
    'Không tải được dashboard. Worker endpoint có thể chưa deploy.';

  const kpiByKey = React.useMemo(() => {
    const m = new Map<string, Kpi>();
    for (const k of data?.kpis ?? []) m.set(k.key, k);
    return m;
  }, [data?.kpis]);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/85">
          Nền tảng
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          7 tín hiệu cốt lõi từ các nhà cung cấp · refresh 60s
        </p>
      </div>

      {showError && (
        <ErrorBlock
          compact
          message={errorMsg}
          onRetry={() => refetch()}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    </section>
  );
}
