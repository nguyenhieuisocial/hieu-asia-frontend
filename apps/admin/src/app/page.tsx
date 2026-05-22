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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import {
  Users,
  Sparkles,
  ListChecks,
  DollarSign,
  Coins,
} from 'lucide-react';
import { ReadingsChart } from '@/components/cost-chart';
import { MockBanner } from '@/components/mock-banner';
import { KpiCard } from '@/components/admin/kpi-card';
import { HealthWidget } from '@/components/admin/health-widget';
import { QuickActions } from '@/components/admin/quick-actions';
import { ActivityFeed } from '@/components/admin/activity-feed';
import { LiveBadge } from '@/components/admin/live-badge';
import { PageHeader } from '@/components/admin/page-header';
import {
  getCostByDay,
  getKpis,
  getQueueDepth,
  getReadingsPerDay,
} from '@/lib/admin-api';

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
          icon={<ListChecks className="h-4 w-4" />}
          accent={activeJobs > 0 ? 'gold' : 'jade'}
          delta={
            queue.data?.oldest_pending_age_seconds && queue.data.oldest_pending_age_seconds > 3600
              ? { value: `${Math.round(queue.data.oldest_pending_age_seconds / 60)}m`, direction: 'down' }
              : null
          }
          hint={queue.data ? `${queue.data.default ?? 0} pending` : 'queue'}
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
