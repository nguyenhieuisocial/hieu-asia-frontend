/**
 * /admin/payments — Wave 60.71.T2 redesign.
 *
 * Vault 107 §5 Tier 2 — splits the 443-LOC monolith into:
 *   ├─ PageHeader + KPI strip (this file ~180 LOC)
 *   ├─ TransactionsTab (components/admin/payments/TransactionsTab.tsx)
 *   └─ CouponsTab     (components/admin/payments/CouponsTab.tsx)
 *
 * Material 3 — Wave 60.68 DropdownMenu replaces the 4 raw `<select>` filter
 * dropdowns inside TransactionsTab. ProductTabs (Wave 60.62.T1.2 affiliates
 * pattern) hosts the two surfaces so future Coupons-only deep-links work
 * via `?tab=coupons`.
 *
 * RSC discipline:
 *   - Icons pre-rendered at the call site (Wave 60.65.P0a)
 *   - No inline arrow fns in Server→Client props (Wave 60.66.HF1) — page
 *     stays Client because it owns interactive filter state.
 *   - Defensive `Array.isArray` guards (Wave 60.65.P0c) on data crossing
 *     the React Query cache boundary.
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
  Receipt,
  Ticket,
  TrendingUp,
  Undo2,
  Users,
} from 'lucide-react';
import {
  getMrrByMonth,
  listCoupons,
  listFailedPayments,
  listSubscriptions,
  listTransactions,
} from '@/lib/admin-api';
import { MockBanner, SkeletonBlock } from '@/components/mock-banner';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { LiveBadge } from '@/components/admin/live-badge';
import { ProductTabs, type ProductTab } from '@/components/admin/product-tabs';
import { TransactionsTab } from '@/components/admin/payments/TransactionsTab';
import { CouponsTab } from '@/components/admin/payments/CouponsTab';
import { SubscriptionsTab } from '@/components/admin/billing/SubscriptionsTab';
import { FailedPaymentsTab } from '@/components/admin/billing/FailedPaymentsTab';
import { RevenueAnalyticsTab } from '@/components/admin/billing/RevenueAnalyticsTab';
import type {
  AdminCoupon,
  AdminFailedPayment,
  AdminSubscription,
  AdminTransaction,
} from '@/lib/mock-data';

const VALID_TABS = ['transactions', 'subscriptions', 'failed', 'revenue', 'coupons'] as const;
type TabId = (typeof VALID_TABS)[number];

function isValidTab(v: string | null): v is TabId {
  return v !== null && (VALID_TABS as readonly string[]).includes(v);
}

export default function AdminPaymentsPage() {
  // useSearchParams() requires a Suspense boundary (App Router CSR bailout).
  // Local boundary keeps sidebar/topbar mounted while ?tab= resolves.
  return (
    <React.Suspense fallback={<div className="h-72 animate-pulse rounded bg-muted/30" />}>
      <AdminPaymentsPageInner />
    </React.Suspense>
  );
}

function AdminPaymentsPageInner() {
  // KPI tracking surfaces — kept in the page so the strip updates as
  // children filter / mutate. Children call back with current rows; we
  // derive aggregates here.
  const [txRows, setTxRows] = React.useState<AdminTransaction[]>([]);
  const [txTotal, setTxTotal] = React.useState(0);
  const [couponRows, setCouponRows] = React.useState<AdminCoupon[]>([]);
  const [subRows, setSubRows] = React.useState<AdminSubscription[]>([]);
  const [subTotal, setSubTotal] = React.useState(0);
  const [failedRows, setFailedRows] = React.useState<AdminFailedPayment[]>([]);

  // Mock banner needs to know source even when its tab is not active.
  // Cheap to pre-fetch — React Query dedupes inside the tabs.
  const txProbe = useQuery({
    queryKey: ['admin', 'transactions', 1],
    queryFn: () => listTransactions({ page: 1, page_size: 15 }),
  });
  const couponProbe = useQuery({ queryKey: ['admin', 'coupons'], queryFn: listCoupons });
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
  const active: TabId = isValidTab(param) ? param : 'transactions';

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
        id: 'transactions',
        label: 'Giao dịch',
        icon: <Receipt size={16} />,
        content: (
          <TransactionsTab onRowsChange={setTxRows} onTotalChange={setTxTotal} />
        ),
      },
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
        content: <CouponsTab onCouponsChange={setCouponRows} />,
      },
    ],
    [subTotal, failedRows.length],
  );

  // KPI aggregates — derived from current filter state on the active tab.
  // When a tab hasn't bubbled data yet, fall back to the probe queries so the
  // strip never shows `—` on first paint.
  const fallbackRows = Array.isArray(txProbe.data?.rows) ? txProbe.data.rows : [];
  const rowsForKpi = txRows.length > 0 ? txRows : fallbackRows;
  const fallbackCoupons = Array.isArray(couponProbe.data) ? couponProbe.data : [];
  const couponsForKpi = couponRows.length > 0 ? couponRows : fallbackCoupons;
  const fallbackSubs = Array.isArray(subProbe.data?.rows) ? subProbe.data.rows : [];
  const subsForKpi = subRows.length > 0 ? subRows : fallbackSubs;
  const fallbackFailed = Array.isArray(failedProbe.data) ? failedProbe.data : [];
  const failedForKpi = failedRows.length > 0 ? failedRows : fallbackFailed;
  const mrrSeries = Array.isArray(mrrProbe.data) ? mrrProbe.data : [];

  const totalRevenue = rowsForKpi
    .filter((t) => t.status === 'succeeded')
    .reduce((s, t) => s + t.amount_usd, 0);
  const refundedCount = rowsForKpi.filter((t) => t.status === 'refunded').length;
  const succeededCount = rowsForKpi.filter((t) => t.status === 'succeeded').length;
  const activeCoupons = couponsForKpi.filter((c) => c.active).length;
  const totalTx = txTotal || txProbe.data?.total || 0;

  const activeSubs = subsForKpi.filter((s) => s.status === 'active' || s.status === 'past_due');
  const latestMonthMrr = mrrSeries.at(-1)?.mrr_usd ?? 0;
  const previousMonthMrr = mrrSeries.at(-2)?.mrr_usd ?? 0;
  const mrrGrowthPct =
    previousMonthMrr > 0
      ? Math.round(((latestMonthMrr - previousMonthMrr) / previousMonthMrr) * 1000) / 10
      : null;
  const sparkline = mrrSeries.map((m) => m.mrr_usd);

  const liveBadge = rowsForKpi.length > 0 || subsForKpi.length > 0 ? <LiveBadge /> : null;
  const headerIcon = <CreditCard className="h-5 w-5" />;
  const dollarIcon = <DollarSign className="h-4 w-4" />;
  const trendingIcon = <TrendingUp className="h-4 w-4" />;
  const undoIcon = <Undo2 className="h-4 w-4" />;
  const ticketIcon = <Ticket className="h-4 w-4" />;
  const usersIcon = <Users className="h-4 w-4" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thanh toán & Doanh thu"
        description="Giao dịch SePay/Stripe, subscription, doanh thu (MRR/ARR), thanh toán fail và coupon — gộp trong một trang. Mỗi tab giữ filter riêng qua `?tab=…`."
        icon={headerIcon}
        badge={liveBadge}
      />

      <MockBanner
        source={
          txProbe.data?._source ??
          subProbe.data?._source ??
          (failedProbe.data as { _source?: { isMock: boolean; reason?: string } } | undefined)?._source ??
          couponProbe.data?._source
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="MRR (tháng này)"
          value={mrrProbe.isLoading ? <SkeletonBlock /> : `$${latestMonthMrr.toLocaleString('en-US')}`}
          icon={dollarIcon}
          accent="gold"
          sparkline={sparkline.length >= 2 ? sparkline : undefined}
          hint={
            mrrGrowthPct !== null
              ? `${mrrGrowthPct >= 0 ? '+' : ''}${mrrGrowthPct}% vs tháng trước`
              : 'Monthly Recurring Revenue'
          }
        />
        <KpiCard
          label="Doanh thu (trang)"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={trendingIcon}
          accent="jade"
          hint={`${succeededCount} succeeded · ${totalTx} giao dịch`}
        />
        <KpiCard
          label="Active subs"
          value={activeSubs.length}
          icon={usersIcon}
          accent="gold"
          hint={`${subTotal || subsForKpi.length} tổng`}
        />
        <KpiCard
          label="Refunded (trang)"
          value={refundedCount}
          icon={undoIcon}
          accent={refundedCount > 0 ? 'red' : 'jade'}
          hint="đã hoàn"
        />
        <KpiCard
          label="Coupon active"
          value={activeCoupons}
          icon={ticketIcon}
          accent="purple"
          hint={`${couponsForKpi.length} tổng · ${failedForKpi.length} fail`}
        />
      </div>

      <ProductTabs tabs={tabs} value={active} onValueChange={onTabChange} />
    </div>
  );
}
