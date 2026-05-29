/**
 * /admin/billing — Wave 60.71.T2.billing redesign (new route).
 *
 * Vault 107 §5.8 Tier 2 — subscription + revenue admin view. Splits into
 * four tabs (Subscriptions, Failed payments, Revenue analytics, Coupon
 * performance) hosted by ProductTabs so `?tab=…` deep-links survive
 * reload.
 *
 * Page-level KPI strip (MRR / ARR / Churn / Active subs / Trial-to-paid)
 * derives from the Subscriptions tab callback + the MRR-by-month series.
 *
 * RSC discipline:
 *   - Icons pre-rendered at the call site (Wave 60.65.P0a)
 *   - No inline arrow fns in props (Wave 60.70 ESLint rule)
 *   - Page stays Client because it owns interactive filter + tab state.
 *   - Defensive `Array.isArray` guards (Wave 60.65.P0c) on async data.
 */

'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  AlertTriangle,
  CreditCard,
  DollarSign,
  LineChart,
  Ticket,
  TrendingDown,
  TrendingUp,
  UserMinus,
  Users,
} from 'lucide-react';
import { getMrrByMonth, listFailedPayments, listSubscriptions } from '@/lib/admin-api';
import { MockBanner, SkeletonBlock } from '@/components/mock-banner';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { LiveBadge } from '@/components/admin/live-badge';
import { ProductTabs, type ProductTab } from '@/components/admin/product-tabs';
import { SubscriptionsTab } from '@/components/admin/billing/SubscriptionsTab';
import { FailedPaymentsTab } from '@/components/admin/billing/FailedPaymentsTab';
import { RevenueAnalyticsTab } from '@/components/admin/billing/RevenueAnalyticsTab';
import { CouponPerformanceTab } from '@/components/admin/billing/CouponPerformanceTab';
import type { AdminFailedPayment, AdminSubscription } from '@/lib/mock-data';

const VALID_TABS = ['subscriptions', 'failed', 'revenue', 'coupons'] as const;
type TabId = (typeof VALID_TABS)[number];

function isValidTab(v: string | null): v is TabId {
  return v !== null && (VALID_TABS as readonly string[]).includes(v);
}

export default function AdminBillingPage() {
  // Lifted KPI state — Subscriptions tab bubbles current rows + total
  // so the page strip can derive MRR / Active / Trial counts. Failed
  // payments tab does the same so the strip's failure tile is live.
  const [subRows, setSubRows] = React.useState<AdminSubscription[]>([]);
  const [subTotal, setSubTotal] = React.useState(0);
  const [failedRows, setFailedRows] = React.useState<AdminFailedPayment[]>([]);

  // Probe queries — pre-fetch so the KPI strip never shows `—` on first
  // paint, and MockBanner can surface degraded source even before the
  // active tab fires its own query. React Query dedupes inside tabs.
  const subProbe = useQuery({
    queryKey: ['admin', 'subscriptions', 1, 'all', 'all'],
    queryFn: () => listSubscriptions({ page: 1, page_size: 15 }),
  });
  const failedProbe = useQuery({
    queryKey: ['admin', 'failed-payments'],
    queryFn: listFailedPayments,
  });
  const mrrProbe = useQuery({
    queryKey: ['admin', 'mrr-by-month'],
    queryFn: getMrrByMonth,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const param = searchParams.get('tab');
  const active: TabId = isValidTab(param) ? param : 'subscriptions';

  const onTabChange = React.useCallback(
    (id: string) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set('tab', id);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const tabs: ProductTab[] = React.useMemo(
    () => [
      {
        id: 'subscriptions',
        label: 'Subscription',
        icon: <Users size={16} />,
        content: <SubscriptionsTab onRowsChange={setSubRows} onTotalChange={setSubTotal} />,
        badge: subTotal > 0 ? String(subTotal) : undefined,
      },
      {
        id: 'failed',
        label: 'Thanh toán fail',
        icon: <AlertTriangle size={16} />,
        content: <FailedPaymentsTab onRowsChange={setFailedRows} />,
        badge: failedRows.length > 0 ? String(failedRows.length) : undefined,
      },
      {
        id: 'revenue',
        label: 'Doanh thu',
        icon: <LineChart size={16} />,
        content: <RevenueAnalyticsTab />,
      },
      {
        id: 'coupons',
        label: 'Coupon',
        icon: <Ticket size={16} />,
        content: <CouponPerformanceTab />,
      },
    ],
    [subTotal, failedRows.length],
  );

  // KPI aggregates — derived from current filter state on Subscriptions
  // tab + probe data for tiles that don't follow the active tab.
  const fallbackSubs = Array.isArray(subProbe.data?.rows) ? subProbe.data.rows : [];
  const subsForKpi = subRows.length > 0 ? subRows : fallbackSubs;
  const fallbackFailed = Array.isArray(failedProbe.data) ? failedProbe.data : [];
  const failedForKpi = failedRows.length > 0 ? failedRows : fallbackFailed;
  const mrrSeries = Array.isArray(mrrProbe.data) ? mrrProbe.data : [];

  const activeSubs = subsForKpi.filter((s) => s.status === 'active' || s.status === 'past_due');
  const trialingSubs = subsForKpi.filter((s) => s.status === 'trialing');
  const canceledSubs = subsForKpi.filter((s) => s.status === 'canceled');
  const visibleMrr = activeSubs.reduce((sum, s) => sum + s.mrr_contribution, 0);

  // Authoritative MRR comes from the time-series tile; fall back to the
  // per-page derived figure when the series probe hasn't returned yet.
  const latestMonthMrr = mrrSeries.at(-1)?.mrr_usd ?? 0;
  const previousMonthMrr = mrrSeries.at(-2)?.mrr_usd ?? 0;
  const mrrGrowthPct =
    previousMonthMrr > 0
      ? Math.round(((latestMonthMrr - previousMonthMrr) / previousMonthMrr) * 1000) / 10
      : null;
  const arr = latestMonthMrr * 12;

  // Churn — over the current page (canceled / total). True monthly churn
  // would require date filtering — flag it as approximate via the `hint`.
  const churnPct =
    subsForKpi.length > 0
      ? Math.round((canceledSubs.length / subsForKpi.length) * 1000) / 10
      : 0;

  const trialToPaidPct =
    subsForKpi.length > 0
      ? Math.round(
          ((subsForKpi.length - trialingSubs.length - canceledSubs.length) / subsForKpi.length) * 1000,
        ) / 10
      : 0;

  const sparkline = mrrSeries.map((m) => m.mrr_usd);

  // Pre-rendered icons (Wave 60.65.P0a). Computed in the render body
  // (not memo'd) — they're cheap JSX and re-instantiating per paint is
  // free; memo'ing them would add complexity for no measurable win.
  const headerIcon = <CreditCard className="h-5 w-5" />;
  const dollarIcon = <DollarSign className="h-4 w-4" />;
  const trendingUpIcon = <TrendingUp className="h-4 w-4" />;
  const trendingDownIcon = <TrendingDown className="h-4 w-4" />;
  const usersIcon = <Users className="h-4 w-4" />;
  const userMinusIcon = <UserMinus className="h-4 w-4" />;

  const liveBadge = subsForKpi.length > 0 ? <LiveBadge /> : null;

  // MockBanner source — prefer subscriptions probe, fall back to failed
  // probe (both endpoints are TODO in admin-api.ts).
  const mockSource =
    (subProbe.data as { _source?: { isMock: boolean; reason?: string } } | undefined)?._source ??
    (failedProbe.data as { _source?: { isMock: boolean; reason?: string } } | undefined)?._source;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Subscription + doanh thu. Stripe webhooks ghi vào /v1/payments/webhook; MRR amortise lifetime (24m) + yearly (12m)."
        icon={headerIcon}
        badge={liveBadge}
      />

      <MockBanner source={mockSource} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="MRR (tháng này)"
          value={mrrProbe.isLoading ? <SkeletonBlock /> : `$${latestMonthMrr.toLocaleString('en-US') || visibleMrr.toFixed(0)}`}
          icon={dollarIcon}
          accent="gold"
          sparkline={sparkline.length >= 2 ? sparkline : undefined}
          hint={mrrGrowthPct !== null ? `${mrrGrowthPct >= 0 ? '+' : ''}${mrrGrowthPct}% vs tháng trước` : 'Monthly Recurring Revenue'}
        />
        <KpiCard
          label="ARR"
          value={mrrProbe.isLoading ? <SkeletonBlock /> : `$${arr.toLocaleString('en-US')}`}
          icon={trendingUpIcon}
          accent="jade"
          hint="MRR × 12"
        />
        <KpiCard
          label="Churn rate"
          value={`${churnPct}%`}
          icon={trendingDownIcon}
          accent={churnPct > 5 ? 'red' : 'jade'}
          hint={`${canceledSubs.length} cancel (trang hiện tại)`}
        />
        <KpiCard
          label="Active subs"
          value={activeSubs.length}
          icon={usersIcon}
          accent="gold"
          hint={`${subTotal || subsForKpi.length} tổng`}
        />
        <KpiCard
          label="Trial → Paid"
          value={`${trialToPaidPct}%`}
          icon={userMinusIcon}
          accent="purple"
          hint={`${trialingSubs.length} đang trial · ${failedForKpi.length} fail`}
        />
      </div>

      <ProductTabs tabs={tabs} value={active} onValueChange={onTabChange} />
    </div>
  );
}
