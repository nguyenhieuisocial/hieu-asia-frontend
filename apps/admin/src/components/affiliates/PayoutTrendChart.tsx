'use client';

/**
 * Paid-payout trend for the Payouts tab. Wave 60.62.
 *
 * Fed ONLY the ledger rows the tab already fetched
 * (`/api/admin/affiliates/payouts-ledger`). Groups PAID payouts (those with a
 * `paid_at`) by month. Pending rows have no pay date, so they're excluded from
 * the trend (the caption says so) — charting them by month would be dishonest.
 * No new endpoints. Recharts lazy-loaded by the tab.
 */

import * as React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { colors } from '@hieu-asia/ui';
import { ChartSection } from './ChartSection';
import { fmtVnd } from '@/lib/format';

const JADE = colors.jade.DEFAULT;

export interface PayoutTrendRow {
  amount_vnd: number;
  paid_at: string | null;
}

function vndShort(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'tr';
  if (n >= 1_000) return Math.round(n / 1_000) + 'k';
  return String(n);
}

export function PayoutTrendChart({ rows }: { rows: PayoutTrendRow[] }) {
  const data = React.useMemo(() => {
    const byMonth = new Map<string, number>();
    for (const r of rows) {
      if (!r.paid_at) continue;
      const d = new Date(r.paid_at);
      if (Number.isNaN(d.getTime())) continue;
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      byMonth.set(k, (byMonth.get(k) ?? 0) + (r.amount_vnd || 0));
    }
    return Array.from(byMonth.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([month, vnd]) => ({ month: month.slice(2), vnd }));
  }, [rows]);

  return (
    <ChartSection
      title="Payout đã chi theo tháng"
      source="affiliate_payouts · chỉ dòng đã paid · theo paid_at"
      empty={data.length === 0}
    >
      <div className="h-56 w-full">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
            <XAxis dataKey="month" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
            <YAxis
              stroke="rgba(242,237,227,0.5)"
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) => vndShort(v)}
            />
            <Tooltip
              cursor={{ fill: 'rgba(45,95,90,0.10)' }}
              contentStyle={{
                background: 'rgba(15,15,18,0.95)',
                border: '1px solid rgba(184,146,61,0.3)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: colors.gold.DEFAULT }}
              formatter={(value: unknown) => [
                fmtVnd(typeof value === 'number' ? value : Number(value)),
                'Đã chi',
              ]}
            />
            <Bar dataKey="vnd" name="Đã chi" fill={JADE} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartSection>
  );
}
