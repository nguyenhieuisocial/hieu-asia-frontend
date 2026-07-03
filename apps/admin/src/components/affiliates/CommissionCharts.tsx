'use client';

/**
 * Charts for the Commissions tab. Wave 60.62 enrichment.
 *
 * Fed ONLY the commission rows the tab already fetched
 * (`/api/admin/affiliates/commissions?status=…`). No new endpoints. All
 * aggregation is client-side over `rows`, so every chart respects the active
 * state filter (the caption says so). Recharts is lazy-loaded by the tab.
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
import { DonutChart, type DonutSlice } from '@/components/admin/donut-chart';
import { ChartSection } from './ChartSection';
import { fmtVnd } from '@/lib/format';

const GOLD = colors.gold.DEFAULT;

export interface CommissionRow {
  commission_vnd: number;
  status: string;
  tier_level: number;
  created_at: string;
}

// House status → tone, reusing the badge palette from commissions-tab.
const STATUS_COLOR: Record<string, string> = {
  available: colors.jade.DEFAULT,
  paid: '#22C55E', // green-500
  held: '#EAB308', // yellow-500
  pending: '#D5B057', // gold-300
  clawed_back: '#EF4444', // red-500
  void: '#71717A', // zinc-500
};

const TIER_COLOR: Record<number, string> = {
  1: colors.gold.DEFAULT,
  2: colors.jade.DEFAULT,
  3: colors.purple.DEFAULT,
};

function vndShort(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'tr';
  if (n >= 1_000) return Math.round(n / 1_000) + 'k';
  return String(n);
}

function monthKey(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function CommissionCharts({ rows }: { rows: CommissionRow[] }) {
  // --- by month (commission VND, last 12 buckets that have data) ---
  const monthly = React.useMemo(() => {
    const byMonth = new Map<string, number>();
    for (const r of rows) {
      const k = monthKey(r.created_at);
      if (!k) continue;
      byMonth.set(k, (byMonth.get(k) ?? 0) + (r.commission_vnd || 0));
    }
    return Array.from(byMonth.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([month, vnd]) => ({ month: month.slice(2), vnd }));
  }, [rows]);

  // --- by status (VND) ---
  const statusSlices = React.useMemo<DonutSlice[]>(() => {
    const byStatus = new Map<string, number>();
    for (const r of rows) {
      byStatus.set(r.status, (byStatus.get(r.status) ?? 0) + (r.commission_vnd || 0));
    }
    return Array.from(byStatus.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([status, value]) => ({
        label: status,
        value,
        color: STATUS_COLOR[status] ?? colors.gold[300],
      }));
  }, [rows]);

  // --- by tier level (VND) ---
  const tierSlices = React.useMemo<DonutSlice[]>(() => {
    const byTier = new Map<number, number>();
    for (const r of rows) {
      byTier.set(r.tier_level, (byTier.get(r.tier_level) ?? 0) + (r.commission_vnd || 0));
    }
    return Array.from(byTier.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([tier, value]) => ({
        label: `L${tier}`,
        value,
        color: TIER_COLOR[tier] ?? colors.gold[300],
      }));
  }, [rows]);

  const statusTotal = statusSlices.reduce((s, x) => s + x.value, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <ChartSection
          title="Hoa hồng theo tháng"
          source="affiliate_commissions · theo state đang lọc · tính theo created_at"
          empty={monthly.length === 0}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={monthly} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
                <XAxis dataKey="month" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="rgba(242,237,227,0.5)"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: number) => vndShort(v)}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(184,146,61,0.08)' }}
                  contentStyle={{
                    background: 'rgba(15,15,18,0.95)',
                    border: '1px solid rgba(184,146,61,0.3)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: GOLD }}
                  formatter={(value: unknown) => [
                    fmtVnd(typeof value === 'number' ? value : Number(value)),
                    'Hoa hồng',
                  ]}
                />
                <Bar dataKey="vnd" name="Hoa hồng" fill={GOLD} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </div>

      <ChartSection
        title="Phân bổ hoa hồng theo trạng thái"
        source="affiliate_commissions · theo state đang lọc"
        empty={statusSlices.length === 0}
      >
        <DonutChart
          slices={statusSlices}
          centerLabel={
            <div className="leading-tight">
              <div className="font-heading text-lg text-gold">{vndShort(statusTotal)}</div>
              <div className="text-[10px] uppercase text-muted-foreground">tổng VND</div>
            </div>
          }
        />
      </ChartSection>

      <ChartSection
        title="Hoa hồng theo cấp (tier level)"
        source="affiliate_commissions · theo state đang lọc"
        empty={tierSlices.length === 0}
      >
        <DonutChart slices={tierSlices} />
      </ChartSection>
    </div>
  );
}
