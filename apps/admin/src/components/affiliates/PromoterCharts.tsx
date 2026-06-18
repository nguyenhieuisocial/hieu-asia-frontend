'use client';

/**
 * Charts for the Promoters tab. Wave 60.62 enrichment.
 *
 * Fed ONLY the promoter rows the tab already fetched
 * (`/api/admin/affiliates/promoters`). No new endpoints. Aggregation is
 * client-side. Recharts is lazy-loaded by the tab.
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

const GOLD = colors.gold.DEFAULT;

export interface PromoterChartRow {
  affiliate_code: string;
  tier: string;
  l1_count: number;
  l2_count: number;
  l3_count: number;
  total_subtree: number;
}

const TIER_COLOR: Record<string, string> = {
  platinum: colors.purple.DEFAULT,
  gold: colors.gold.DEFAULT,
  silver: '#A1A1AA', // zinc-400
  bronze: '#B45309', // amber-700
};

export function PromoterCharts({ rows }: { rows: PromoterChartRow[] }) {
  // --- network depth (sum of L1/L2/L3 referrals across all promoters) ---
  const depthSlices = React.useMemo<DonutSlice[]>(() => {
    const l1 = rows.reduce((s, r) => s + (r.l1_count || 0), 0);
    const l2 = rows.reduce((s, r) => s + (r.l2_count || 0), 0);
    const l3 = rows.reduce((s, r) => s + (r.l3_count || 0), 0);
    return [
      { label: 'L1 (trực tiếp)', value: l1, color: colors.gold.DEFAULT },
      { label: 'L2', value: l2, color: colors.jade.DEFAULT },
      { label: 'L3', value: l3, color: colors.purple.DEFAULT },
    ];
  }, [rows]);

  const depthTotal = depthSlices.reduce((s, x) => s + x.value, 0);

  // --- promoters by tier (count) ---
  const tierSlices = React.useMemo<DonutSlice[]>(() => {
    const byTier = new Map<string, number>();
    for (const r of rows) byTier.set(r.tier, (byTier.get(r.tier) ?? 0) + 1);
    return Array.from(byTier.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tier, value]) => ({
        label: tier,
        value,
        color: TIER_COLOR[tier] ?? colors.gold[300],
      }));
  }, [rows]);

  // --- top 8 promoters by subtree size ---
  const topSubtree = React.useMemo(() => {
    return [...rows]
      .filter((r) => (r.total_subtree || 0) > 0)
      .sort((a, b) => (b.total_subtree || 0) - (a.total_subtree || 0))
      .slice(0, 8)
      .map((r) => ({ code: r.affiliate_code, subtree: r.total_subtree }));
  }, [rows]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartSection
        title="Mạng lưới theo cấp"
        source="affiliate_network · tổng L1/L2/L3 toàn bộ promoter"
        empty={depthTotal === 0}
      >
        <DonutChart
          slices={depthSlices}
          centerLabel={
            <div className="leading-tight">
              <div className="font-heading text-lg text-gold">
                {depthTotal.toLocaleString('vi-VN')}
              </div>
              <div className="text-[10px] uppercase text-muted-foreground">tổng referral</div>
            </div>
          }
        />
      </ChartSection>

      <ChartSection
        title="Promoter theo hạng (tier)"
        source="affiliate_network · đếm số promoter"
        empty={tierSlices.length === 0}
      >
        <DonutChart slices={tierSlices} />
      </ChartSection>

      <div className="lg:col-span-2">
        <ChartSection
          title="Top promoter theo quy mô subtree"
          source="affiliate_network · top 8 theo total_subtree"
          empty={topSubtree.length === 0}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={topSubtree} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
                <XAxis dataKey="code" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="rgba(242,237,227,0.5)"
                  tick={{ fontSize: 11 }}
                  allowDecimals={false}
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
                  formatter={(value: unknown) => [String(value), 'Subtree']}
                />
                <Bar dataKey="subtree" name="Subtree" fill={GOLD} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </div>
    </div>
  );
}
