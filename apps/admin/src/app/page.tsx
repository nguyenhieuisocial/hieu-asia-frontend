'use client';

/**
 * Admin command center — top-level dashboard.
 *
 * Layout:
 *   row 1 — hero KPIs (5 KPI cards with sparklines)
 *   row 2 — readings chart (3-col span) | health widget (1-col)
 *   row 3 — activity feed (2-col) | quick actions (1-col)
 *
 * Data sources (all real, all proxied via /api/admin-proxy):
 *   - getKpis()              → /admin/analytics + /admin/customers
 *   - getReadingsPerDay(30)  → /admin/analytics
 *   - getCostByDay(30)       → /admin/cost/by_day      (for spend KPI)
 *   - getQueueDepth()        → /admin/queue_depth      (for active queue KPI)
 *
 * Each KPI gets a 14-day sparkline derived from the corresponding series.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import {
  Users,
  Sparkles,
  ListChecks,
  DollarSign,
  Coins,
} from 'lucide-react';
// Wave 60.12 — ReadingsChart lazy-loaded so Recharts (~150KB gzipped) is
// no longer in the initial bundle. KPI cards above-fold paint first; chart
// chunk loads in parallel and hydrates when the user scrolls past the KPIs.
// `ssr: false` because admin is auth-gated and not SEO-indexed — saves a
// server-side render pass on a non-critical widget.
const ReadingsChart = dynamic(
  () => import('@/components/cost-chart').then((m) => m.ReadingsChart),
  {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);
import { MockBanner } from '@/components/mock-banner';
import { KpiCard } from '@/components/admin/kpi-card';
import { HealthWidget } from '@/components/admin/health-widget';
import { QuickActions } from '@/components/admin/quick-actions';
import { ActivityFeed } from '@/components/admin/activity-feed';
import { LiveBadge } from '@/components/admin/live-badge';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import Link from 'next/link';
import { AlertTriangle, LineChart as LineChartIcon } from 'lucide-react';
import {
  getCostByDay,
  getKpis,
  getQueueDepth,
  getReadingsPerDay,
} from '@/lib/admin-api';

/** BUG-022: surface a visual alert + Triage CTA when oldest pending > 60 min. */
const QUEUE_ALERT_AGE_SECONDS = 60 * 60;
/**
 * Wave 60.81.C — second threshold for "critical" tone. < critical = warn (amber);
 * > critical = red. Keeps the queue card from screaming red on every brief blip.
 */
const QUEUE_CRITICAL_AGE_SECONDS = 4 * 60 * 60;

function fmtUsd(v: number) {
  return `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function fmtUsdSmall(v: number) {
  if (v < 1) return `$${v.toFixed(2)}`;
  return `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export default function AdminOverviewPage() {
  const kpis = useQuery({ queryKey: ['admin', 'kpis'], queryFn: getKpis });
  const readings = useQuery({
    queryKey: ['admin', 'readings-per-day'],
    queryFn: () => getReadingsPerDay(30),
  });
  const cost = useQuery({
    queryKey: ['admin', 'cost-by-day-overview'],
    queryFn: () => getCostByDay(14),
  });
  const queue = useQuery({
    queryKey: ['admin', 'queue-depth-overview'],
    queryFn: getQueueDepth,
    refetchInterval: 30_000,
  });

  // Build sparklines from existing series.
  const readingsSpark = (readings.data ?? []).slice(-14).map((d) => d.count);
  const costSpark = (cost.data ?? []).slice(-14).map((d) => d.total_usd);

  // Spend total for 14d
  const spend14d = (cost.data ?? []).reduce((s, d) => s + d.total_usd, 0);
  // Active queue items
  const activeJobs =
    (queue.data?.default ?? 0) + (queue.data?.high_priority ?? 0) + (queue.data?.rag ?? 0);
  // BUG-022 — queue alert: oldest pending older than threshold needs human triage.
  // Wave 60.81.C: split into warn vs critical so we don't burn red attention
  // on every 65-minute blip. < critical = amber/warn, > critical = red.
  const oldestAgeSec = queue.data?.oldest_pending_age_seconds ?? 0;
  const queueAlerting = oldestAgeSec > QUEUE_ALERT_AGE_SECONDS;
  const queueCritical = oldestAgeSec > QUEUE_CRITICAL_AGE_SECONDS;
  const oldestAgeLabel = oldestAgeSec
    ? oldestAgeSec >= 3600
      ? `${Math.floor(oldestAgeSec / 3600)}h${Math.round((oldestAgeSec % 3600) / 60)}m`
      : `${Math.round(oldestAgeSec / 60)}m`
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan"
        description={
          <>
            Theo dõi nhanh vận hành ngày + tháng. Dữ liệu lấy từ{' '}
            <code className="font-mono text-foreground/85">/admin/analytics</code> +{' '}
            <code className="font-mono text-foreground/85">/admin/cost</code>.
          </>
        }
        badge={<LiveBadge />}
      />

      <MockBanner source={kpis.data?._source ?? readings.data?._source} />

      {queueAlerting && (
        <div
          role="alert"
          className={
            queueCritical
              ? 'flex items-center justify-between gap-3 rounded-xl border border-red-500/40 bg-red-500/[0.07] px-4 py-3 text-sm transition-all duration-300 ease-editorial'
              : 'flex items-center justify-between gap-3 rounded-xl border border-warn-500/40 bg-warn-500/[0.07] px-4 py-3 text-sm transition-all duration-300 ease-editorial'
          }
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className={
                queueCritical
                  ? 'mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400'
                  : 'mt-0.5 h-5 w-5 shrink-0 text-warn-700 dark:text-warn-300'
              }
              aria-hidden
            />
            <div>
              <p
                className={
                  queueCritical
                    ? 'font-semibold text-red-700 dark:text-red-200'
                    : 'font-semibold text-warn-700 dark:text-warn-300'
                }
              >
                Queue đang đọng
              </p>
              <p
                className={
                  queueCritical
                    ? 'text-xs text-red-700/90 dark:text-red-100/80'
                    : 'text-xs text-warn-700/90 dark:text-warn-300/85'
                }
              >
                Tác vụ chờ lâu nhất {oldestAgeLabel} · pending {queue.data?.default ?? 0}.
                {queueCritical ? ' Cần triage ngay.' : ' Theo dõi, có thể tự thoát.'}
              </p>
            </div>
          </div>
          <Link
            href="/sessions?status=pending&sort=oldest"
            className={
              queueCritical
                ? 'inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-red-500/50 bg-red-500/10 px-3 text-xs font-medium text-red-700 transition-all duration-300 ease-editorial hover:bg-red-500/20 dark:border-red-400/50 dark:text-red-100'
                : 'inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-warn-500/50 bg-warn-500/10 px-3 text-xs font-medium text-warn-700 transition-all duration-300 ease-editorial hover:bg-warn-500/20 dark:text-warn-300'
            }
          >
            Triage queue
          </Link>
        </div>
      )}

      {/* Hero KPI strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="Tổng người dùng"
          value={kpis.data?.total_users.toLocaleString('vi-VN') ?? '—'}
          icon={<Users className="h-4 w-4" />}
          accent="gold"
          hint="end-user"
        />
        <KpiCard
          label="Báo cáo hôm nay"
          value={kpis.data?.readings_today ?? '—'}
          icon={<Sparkles className="h-4 w-4" />}
          accent="purple"
          sparkline={readingsSpark}
          hint="14d"
        />
        <KpiCard
          label="Đang xử lý"
          value={activeJobs}
          icon={
            queueAlerting ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <ListChecks className="h-4 w-4" />
            )
          }
          accent={queueCritical ? 'red' : queueAlerting ? 'warn' : activeJobs > 0 ? 'gold' : 'jade'}
          delta={
            oldestAgeLabel
              ? { value: oldestAgeLabel, direction: queueAlerting ? 'down' : 'flat' }
              : null
          }
          hint={queue.data ? `${queue.data.default ?? 0} pending` : 'queue'}
          href={queueAlerting ? '/sessions' : undefined}
        />
        <KpiCard
          label="Doanh thu 7 ngày"
          value={kpis.data ? fmtUsd(kpis.data.weekly_revenue_usd) : '—'}
          icon={<DollarSign className="h-4 w-4" />}
          accent="jade"
        />
        <KpiCard
          label="LLM spend 14d"
          value={fmtUsdSmall(spend14d)}
          icon={<Coins className="h-4 w-4" />}
          accent="gold"
          sparkline={costSpark}
          hint="USD"
        />
      </div>

      {/* Chart + health */}
      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Báo cáo 30 ngày qua</CardTitle>
            <CardDescription>
              Số lượng phiên phân tích theo ngày — vàng = tổng, đỏ = lỗi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {readings.isLoading ? (
              <div className="h-72 animate-pulse rounded bg-muted/30" />
            ) : (readings.data ?? []).length === 0 ? (
              // BUG-024 — never render an empty axis grid; use brand empty-state.
              <EmptyState
                className="border-none bg-transparent py-10"
                illustration={
                  <div className="relative mx-auto h-16 w-16" aria-hidden>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/20 via-purple/15 to-jade/15 blur-xl" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-full border border-gold/30 bg-card/60">
                      <LineChartIcon className="h-7 w-7 text-gold/70" />
                    </div>
                  </div>
                }
                title="Chưa có dữ liệu trong 30 ngày"
                description="Khi có phiên phân tích, biểu đồ sẽ hiển thị số lượng theo ngày."
              />
            ) : (
              <ReadingsChart data={readings.data ?? []} />
            )}
          </CardContent>
        </Card>
        <div className="lg:col-span-1">
          <HealthWidget />
        </div>
      </div>

      {/* Activity feed + quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
