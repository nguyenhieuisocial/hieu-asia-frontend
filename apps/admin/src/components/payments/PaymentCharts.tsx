'use client';

/**
 * PaymentCharts — insight charts for /payments, built from the SAME real ledger
 * the page already reads (GET /payment/transactions via listTransactions). The
 * page's KPI probe only pulls one 15-row page, which is too thin to chart a
 * trend, so this component issues ONE wide read (page_size: 500 — the worker
 * already returns up to 500 rows; listTransactions paginates client-side) under
 * a distinct query key and aggregates in-memory. No new admin-api getter.
 *
 * Charts:
 *   1. Doanh thu theo ngày — succeeded-only VND summed per day (last 14 days).
 *   2. Trạng thái giao dịch — succeeded / refunded / failed / pending donut.
 *
 * Pre-launch honesty: money is VND (the `amount_usd` field actually holds VND —
 * mirrors TransactionsTab). Empty/sparse slices render a muted "chưa có dữ liệu"
 * state; we never invent a bar. Each card labels its source + window. On fetch
 * error or mock fallback we render nothing so a chart can't masquerade as real.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, colors } from '@hieu-asia/ui';
import { listTransactions } from '@/lib/admin-api';
import { DonutChart, type DonutSlice } from '@/components/admin/donut-chart';
import type { AdminTransaction } from '@/lib/mock-data';
import { fmtVnd } from '@/lib/format';

const GOLD = colors.gold.DEFAULT;
const JADE = colors.jade.DEFAULT;
const PURPLE = colors.purple.DEFAULT;
const REFUND_RED = '#C2410C';

const REVENUE_WINDOW_DAYS = 14;

function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-gold/15 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

const STATUS_LABEL: Record<AdminTransaction['status'], string> = {
  succeeded: 'Thành công',
  refunded: 'Hoàn tiền',
  pending: 'Chờ xử lý',
  failed: 'Thất bại',
};

const STATUS_COLOR: Record<AdminTransaction['status'], string> = {
  succeeded: JADE,
  refunded: REFUND_RED,
  pending: GOLD,
  failed: PURPLE,
};

export function PaymentCharts() {
  // Wide read for aggregation only. Distinct key from the table's paginated
  // query so React Query keeps them separate; staleTime mirrors the page.
  const all = useQuery({
    queryKey: ['admin', 'transactions', 'all', 500],
    queryFn: () => listTransactions({ page: 1, page_size: 500 }),
    staleTime: 60_000,
  });

  const rows = React.useMemo<AdminTransaction[]>(
    () => (Array.isArray(all.data?.rows) ? all.data.rows : []),
    [all.data?.rows],
  );
  const isMock = all.data?._source?.isMock === true;

  const revenueByDay = React.useMemo(() => {
    const sums = new Map<string, number>();
    const today = new Date();
    const buckets: { key: string; label: string }[] = [];
    for (let i = REVENUE_WINDOW_DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = dayKey(d);
      sums.set(key, 0);
      buckets.push({
        key,
        label: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
      });
    }
    for (const t of rows) {
      if (t.status !== 'succeeded') continue;
      const dt = new Date(t.created_at);
      if (Number.isNaN(dt.getTime())) continue;
      const key = dayKey(dt);
      if (sums.has(key)) sums.set(key, (sums.get(key) ?? 0) + (t.amount_usd ?? 0));
    }
    return buckets.map((b) => ({ label: b.label, amount: sums.get(b.key) ?? 0 }));
  }, [rows]);

  const hasRevenue = revenueByDay.some((d) => d.amount > 0);

  const statusSlices = React.useMemo<DonutSlice[]>(() => {
    const order: AdminTransaction['status'][] = ['succeeded', 'refunded', 'failed', 'pending'];
    return order
      .map((s) => ({
        label: STATUS_LABEL[s],
        value: rows.filter((t) => t.status === s).length,
        color: STATUS_COLOR[s],
      }))
      .filter((slice) => slice.value > 0);
  }, [rows]);

  // Don't chart on fetch error or mock fallback — an honest blank beats a
  // misleading "zero" or fabricated demo curve. The page's MockBanner already
  // tells the operator the source is unavailable.
  if (all.isError || isMock) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo ngày</CardTitle>
          <CardDescription>
            {REVENUE_WINDOW_DAYS} ngày gần nhất · chỉ giao dịch thành công · nguồn:{' '}
            <code className="font-mono text-xs">/payment/transactions</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasRevenue ? (
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={revenueByDay} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
                  <XAxis dataKey="label" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="rgba(242,237,227,0.5)"
                    tick={{ fontSize: 11 }}
                    width={70}
                    tickFormatter={(v: number) =>
                      v >= 1_000_000
                        ? `${(v / 1_000_000).toFixed(1)}tr`
                        : v >= 1_000
                          ? `${Math.round(v / 1_000)}k`
                          : String(v)
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,15,18,0.95)',
                      border: '1px solid rgba(184,146,61,0.3)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: GOLD }}
                    formatter={(value: unknown) => {
                      const n = typeof value === 'number' ? value : Number(value);
                      return [fmtVnd(n), 'Doanh thu'];
                    }}
                  />
                  <Bar dataKey="amount" fill={GOLD} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState>
              Chưa có doanh thu thành công trong {REVENUE_WINDOW_DAYS} ngày qua.
            </EmptyState>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trạng thái giao dịch</CardTitle>
          <CardDescription>
            Toàn bộ nhật ký · nguồn:{' '}
            <code className="font-mono text-xs">/payment/transactions</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length > 0 ? (
            <DonutChart
              slices={statusSlices}
              centerLabel={
                <div className="leading-tight">
                  <div className="font-mono text-lg text-foreground">{rows.length}</div>
                  <div className="text-[10px] text-muted-foreground">giao dịch</div>
                </div>
              }
            />
          ) : (
            <EmptyState>Chưa có giao dịch nào.</EmptyState>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
