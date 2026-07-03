/**
 * /admin/payments — giao dịch (audit ledger /payment/transactions).
 *
 * Chỉ còn surface THẬT: tab Giao dịch. Các tab mock cũ (Subscription / Doanh thu
 * / Thanh toán fail / Coupon) đã gỡ — số liệu thật về doanh thu, gói và hoàn tiền
 * sống ở /sepay; mã giảm giá ở /coupons.
 *
 * RSC discipline:
 *   - Icons pre-rendered at the call site (Wave 60.65.P0a)
 *   - Defensive `Array.isArray` guards (Wave 60.65.P0c) on data crossing
 *     the React Query cache boundary.
 */

'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  CreditCard,
  Landmark,
  Receipt,
  Ticket,
  TrendingUp,
  Undo2,
} from 'lucide-react';
import { listTransactions } from '@/lib/admin-api';
import { MockBanner } from '@/components/mock-banner';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { LiveBadge } from '@/components/admin/live-badge';
import { TransactionsTab } from '@/components/admin/payments/TransactionsTab';
import { PaymentCharts } from '@/components/payments/PaymentCharts';
import type { AdminTransaction } from '@/lib/mock-data';
import { fmtVnd } from '@/lib/format';

export default function AdminPaymentsPage() {
  // KPI tracking surfaces — kept in the page so the strip updates as the
  // Transactions tab filters. The child calls back with current rows.
  const [txRows, setTxRows] = React.useState<AdminTransaction[]>([]);
  const [txTotal, setTxTotal] = React.useState(0);

  // Probe so the KPI strip + MockBanner have data before the tab bubbles up.
  // React Query dedupes against the tab's identical query.
  const txProbe = useQuery({
    queryKey: ['admin', 'transactions', 1],
    queryFn: () => listTransactions({ page: 1, page_size: 15 }),
    staleTime: 60_000,
  });

  // KPI aggregates — derived from current filter state on the Transactions tab.
  // Falls back to the probe query; khi probe còn đang tải thì strip hiện `—`
  // thay vì 0đ giả (audit UX 2026-07-03 — số 0 giả trên trang doanh thu).
  const fallbackRows = Array.isArray(txProbe.data?.rows) ? txProbe.data.rows : [];
  const rowsForKpi = txRows.length > 0 ? txRows : fallbackRows;
  const kpiLoading = txProbe.isLoading && txRows.length === 0;

  const totalRevenue = rowsForKpi
    .filter((t) => t.status === 'succeeded')
    .reduce((s, t) => s + t.amount_usd, 0);
  const refundedCount = rowsForKpi.filter((t) => t.status === 'refunded').length;
  const succeededCount = rowsForKpi.filter((t) => t.status === 'succeeded').length;
  const totalTx = txTotal || txProbe.data?.total || 0;

  const liveBadge = rowsForKpi.length > 0 ? <LiveBadge /> : null;
  const headerIcon = <CreditCard className="h-5 w-5" />;
  const trendingIcon = <TrendingUp className="h-4 w-4" />;
  const undoIcon = <Undo2 className="h-4 w-4" />;
  const receiptIcon = <Receipt className="h-4 w-4" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Giao dịch thanh toán"
        description="Nhật ký giao dịch (audit ledger) từ /payment/transactions. Doanh thu, gói và hoàn tiền xem ở SePay; mã giảm giá ở Coupon."
        icon={headerIcon}
        badge={liveBadge}
      />

      <MockBanner source={txProbe.data?._source} />

      <div className="rounded-lg border border-gold/15 bg-card/40 px-4 py-3 text-sm text-muted-foreground">
        Cần xem doanh thu, subscription, hoàn tiền hay mã giảm giá?{' '}
        <Link href="/sepay" className="inline-flex items-center gap-1 text-gold hover:underline">
          <Landmark className="h-3.5 w-3.5" aria-hidden />
          SePay (doanh thu · gói · hoàn tiền)
        </Link>
        {' · '}
        <Link href="/coupons" className="inline-flex items-center gap-1 text-gold hover:underline">
          <Ticket className="h-3.5 w-3.5" aria-hidden />
          Coupon (mã giảm giá)
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Doanh thu (trang)"
          value={kpiLoading ? '—' : fmtVnd(totalRevenue)}
          icon={trendingIcon}
          accent="jade"
          hint={kpiLoading ? 'đang tải…' : `${succeededCount} thành công · ${totalTx} giao dịch`}
        />
        <KpiCard
          label="Giao dịch (tổng)"
          value={kpiLoading ? '—' : totalTx}
          icon={receiptIcon}
          accent="gold"
          hint="trong nhật ký"
        />
        <KpiCard
          label="Hoàn tiền (trang)"
          value={kpiLoading ? '—' : refundedCount}
          icon={undoIcon}
          accent={refundedCount > 0 ? 'red' : 'jade'}
          hint="đã hoàn"
        />
      </div>

      {/* Charts from the same real ledger (/payment/transactions). Self-hides on
          fetch error or mock fallback so a chart never poses as real data. */}
      <PaymentCharts />

      <TransactionsTab onRowsChange={setTxRows} onTotalChange={setTxTotal} />
    </div>
  );
}
