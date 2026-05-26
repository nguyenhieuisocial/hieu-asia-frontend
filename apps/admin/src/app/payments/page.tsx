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
  CreditCard,
  DollarSign,
  Receipt,
  Ticket,
  TrendingUp,
  Undo2,
} from 'lucide-react';
import { listCoupons, listTransactions } from '@/lib/admin-api';
import { MockBanner } from '@/components/mock-banner';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { LiveBadge } from '@/components/admin/live-badge';
import { ProductTabs, type ProductTab } from '@/components/admin/product-tabs';
import { TransactionsTab } from '@/components/admin/payments/TransactionsTab';
import { CouponsTab } from '@/components/admin/payments/CouponsTab';
import type { AdminCoupon, AdminTransaction } from '@/lib/mock-data';

const VALID_TABS = ['transactions', 'coupons'] as const;
type TabId = (typeof VALID_TABS)[number];

function isValidTab(v: string | null): v is TabId {
  return v !== null && (VALID_TABS as readonly string[]).includes(v);
}

export default function AdminPaymentsPage() {
  // KPI tracking surfaces — kept in the page so the strip updates as
  // children filter / mutate. Children call back with current rows; we
  // derive aggregates here.
  const [txRows, setTxRows] = React.useState<AdminTransaction[]>([]);
  const [txTotal, setTxTotal] = React.useState(0);
  const [couponRows, setCouponRows] = React.useState<AdminCoupon[]>([]);

  // Mock banner needs to know source even when its tab is not active.
  // Cheap to pre-fetch — React Query dedupes inside the tabs.
  const txProbe = useQuery({
    queryKey: ['admin', 'transactions', 1],
    queryFn: () => listTransactions({ page: 1, page_size: 15 }),
  });
  const couponProbe = useQuery({ queryKey: ['admin', 'coupons'], queryFn: listCoupons });

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
        id: 'coupons',
        label: 'Coupon',
        icon: <Ticket size={16} />,
        content: <CouponsTab onCouponsChange={setCouponRows} />,
      },
    ],
    [],
  );

  // KPI aggregates — derived from current filter state on the active tab.
  // When a tab hasn't bubbled data yet, fall back to the probe queries so the
  // strip never shows `—` on first paint.
  const fallbackRows = Array.isArray(txProbe.data?.rows) ? txProbe.data.rows : [];
  const rowsForKpi = txRows.length > 0 ? txRows : fallbackRows;
  const fallbackCoupons = Array.isArray(couponProbe.data) ? couponProbe.data : [];
  const couponsForKpi = couponRows.length > 0 ? couponRows : fallbackCoupons;

  const totalRevenue = rowsForKpi
    .filter((t) => t.status === 'succeeded')
    .reduce((s, t) => s + t.amount_usd, 0);
  const refundedCount = rowsForKpi.filter((t) => t.status === 'refunded').length;
  const succeededCount = rowsForKpi.filter((t) => t.status === 'succeeded').length;
  const activeCoupons = couponsForKpi.filter((c) => c.active).length;
  const totalTx = txTotal || txProbe.data?.total || 0;

  const liveBadge = rowsForKpi.length > 0 ? <LiveBadge /> : null;
  const headerIcon = <CreditCard className="h-5 w-5" />;
  const dollarIcon = <DollarSign className="h-4 w-4" />;
  const trendingIcon = <TrendingUp className="h-4 w-4" />;
  const undoIcon = <Undo2 className="h-4 w-4" />;
  const ticketIcon = <Ticket className="h-4 w-4" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thanh toán"
        description="Giao dịch SePay + quản lý coupon. Mỗi tab giữ filter riêng qua `?tab=…`."
        icon={headerIcon}
        badge={liveBadge}
      />

      <MockBanner source={txProbe.data?._source ?? couponProbe.data?._source} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Doanh thu (trang)"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={dollarIcon}
          accent="gold"
          hint={`${succeededCount} succeeded`}
        />
        <KpiCard
          label="Tổng giao dịch"
          value={totalTx}
          icon={trendingIcon}
          accent="jade"
          hint="all-time"
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
          hint={`${couponsForKpi.length} tổng`}
        />
      </div>

      <ProductTabs tabs={tabs} value={active} onValueChange={onTabChange} />
    </div>
  );
}
