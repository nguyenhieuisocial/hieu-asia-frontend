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
  UserPlus,
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
import { WorkQueueWidget } from '@/components/admin/work-queue-widget';
import { QuickActions } from '@/components/admin/quick-actions';
import { ActivityFeed } from '@/components/admin/activity-feed';
import { LiveBadge } from '@/components/admin/live-badge';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import Link from 'next/link';
import { AlertTriangle, LineChart as LineChartIcon } from 'lucide-react';
import { PlatformKpiBand } from '@/components/admin/platform-kpi-band';
import { useQueueDepth } from '@/hooks/useQueueDepth';
import {
  getCostByDay,
  getKpis,
  getReadingsPerDay,
  getSignupsByDay,
} from '@/lib/admin-api';
import { getGscSearchAnalytics } from '@/lib/gsc-api';
import { Search, MousePointerClick, Percent, Gauge } from 'lucide-react';

/** BUG-022: surface a visual alert + Triage CTA when oldest pending > 60 min. */
const QUEUE_ALERT_AGE_SECONDS = 60 * 60;
/**
 * Wave 60.81.C — second threshold for "critical" tone. < critical = warn (amber);
 * > critical = red. Keeps the queue card from screaming red on every brief blip.
 */
const QUEUE_CRITICAL_AGE_SECONDS = 4 * 60 * 60;

// #55: weekly_revenue_usd actually holds VND (SePay), despite the legacy field
// name — format as VND, not USD.
function fmtVnd(v: number) {
  return `${v.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ`;
}

function fmtUsdSmall(v: number) {
  if (v < 1) return `$${v.toFixed(2)}`;
  return `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function fmtInt(v: number) {
  return v.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
}

export default function AdminOverviewPage() {
  const kpis = useQuery({ queryKey: ['admin', 'kpis'], queryFn: getKpis, staleTime: 60_000 });
  const readings = useQuery({
    queryKey: ['admin', 'readings-per-day'],
    queryFn: () => getReadingsPerDay(30),
    staleTime: 60_000,
  });
  const cost = useQuery({
    queryKey: ['admin', 'cost-by-day-overview'],
    queryFn: () => getCostByDay(14),
    staleTime: 60_000,
  });
  const queue = useQueueDepth();
  // New signups (last 30d) — powers the "Khách mới hôm nay" KPI. The backend
  // endpoint /admin/signups/by_day ships in a parallel wave; getSignupsByDay
  // returns null until then, so the card degrades to "—" without breaking.
  const signups = useQuery({
    queryKey: ['admin', 'signups'],
    queryFn: () => getSignupsByDay(30),
    staleTime: 60_000,
  });
  // Organic search at-a-glance (GSC, 7d) — reuses the same proxy endpoint as
  // the /seo page. staleTime 5min mirrors that page; GSC data lags ~2-3 days.
  const gsc = useQuery({
    queryKey: ['admin', 'gsc', 'dashboard'],
    queryFn: () => getGscSearchAnalytics(7),
    staleTime: 5 * 60_000,
  });

  // Build sparklines from existing series.
  const readingsSpark = (readings.data ?? []).slice(-14).map((d) => d.count);
  const costSpark = (cost.data ?? []).slice(-14).map((d) => d.total_usd);

  // New-signups KPI. signups.data is null until the backend endpoint deploys —
  // when null we render the card with "—" and no spark/delta (no fake data).
  const signupsData = signups.data ?? null;
  const signupsSpark = (signupsData?.days ?? []).slice(-14).map((d) => d.count);
  // Delta vs the previous window, only when the backend supplies prev_total.
  const signupsDelta = (() => {
    if (!signupsData || signupsData.prev_total == null) return null;
    const prev = signupsData.prev_total;
    const cur = signupsData.total;
    if (prev === 0 && cur === 0) return null;
    if (prev === 0) return { value: `+${cur.toFixed(0)}`, direction: 'up' as const };
    const pct = ((cur - prev) / Math.abs(prev)) * 100;
    if (Math.abs(pct) < 1) return { value: '0%', direction: 'flat' as const };
    return {
      value: `${pct > 0 ? '+' : ''}${pct.toFixed(0)}%`,
      direction: (pct > 0 ? 'up' : 'down') as 'up' | 'down',
    };
  })();

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

  // GSC at-a-glance. `not_configured` → render a "connect GSC" note. Otherwise
  // derive clicks / CTR / avg rank (`current.position`, optional) + a clicks
  // sparkline from `daily` when present (same optional-field rollout as /seo).
  const gscData = gsc.data && gsc.data.ok ? gsc.data : undefined;
  const gscNotConfigured = gsc.data?.ok === false && gsc.data.error === 'not_configured';
  const gscClicks = gscData?.totals.clicks ?? 0;
  const gscImpr = gscData?.totals.impressions ?? 0;
  const gscCtr = gscImpr > 0 ? gscClicks / gscImpr : 0;
  const gscPosition = gscData?.current?.position;
  const gscSpark = (gscData?.daily ?? []).map((d) => d.clicks);

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
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground/85">
        Vận hành
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <KpiCard
          label="Tổng người dùng"
          value={kpis.data?.total_users.toLocaleString('vi-VN') ?? '—'}
          icon={<Users className="h-4 w-4" />}
          accent="gold"
          hint="end-user"
        />
        <KpiCard
          label="Khách mới hôm nay"
          // Null until /admin/signups/by_day deploys → "—", no fake number.
          value={signupsData ? signupsData.today.toLocaleString('vi-VN') : '—'}
          icon={<UserPlus className="h-4 w-4" />}
          accent="jade"
          sparkline={signupsSpark.length > 1 ? signupsSpark : undefined}
          delta={signupsDelta}
          hint={signupsData ? '14d' : 'chưa có endpoint'}
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
          value={kpis.data ? fmtVnd(kpis.data.weekly_revenue_usd) : '—'}
          icon={<DollarSign className="h-4 w-4" />}
          accent="jade"
          hint="VNĐ (SePay)"
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
        <div className="space-y-4 lg:col-span-1">
          <HealthWidget />
          <WorkQueueWidget />
        </div>
      </div>

      {/* Tìm kiếm Google (GSC) — organic at-a-glance, 7 ngày */}
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4 text-gold" aria-hidden />
              Tìm kiếm Google (7 ngày)
            </CardTitle>
            <CardDescription>Traffic tự nhiên từ Google Search Console — trễ ~2-3 ngày.</CardDescription>
          </div>
          <Link
            href="/seo"
            className="shrink-0 text-xs text-muted-foreground transition-colors hover:text-gold"
          >
            Chi tiết →
          </Link>
        </CardHeader>
        <CardContent>
          {gsc.isLoading ? (
            <div className="h-16 animate-pulse rounded bg-muted/30" aria-hidden />
          ) : gscNotConfigured ? (
            <p className="text-sm text-muted-foreground">
              Chưa kết nối GSC.{' '}
              <Link href="/seo" className="text-gold hover:underline">
                Kết nối ở trang SEO →
              </Link>
            </p>
          ) : !gscData ? (
            <p className="text-sm text-muted-foreground">Chưa tải được dữ liệu Search Console.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <KpiCard
                label="Clicks (7d)"
                value={fmtInt(gscClicks)}
                icon={<MousePointerClick className="h-4 w-4" />}
                accent="gold"
                sparkline={gscSpark.length > 1 ? gscSpark : undefined}
                delta={null}
                hint="organic"
              />
              <KpiCard
                label="CTR"
                value={`${(gscCtr * 100).toFixed(1)}%`}
                icon={<Percent className="h-4 w-4" />}
                accent="purple"
                hint="clicks / impressions"
              />
              <KpiCard
                label="Vị trí TB"
                value={gscPosition != null ? gscPosition.toFixed(1) : '—'}
                icon={<Gauge className="h-4 w-4" />}
                accent="jade"
                hint="thấp hơn = tốt hơn"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform KPI band */}
      <PlatformKpiBand />

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
