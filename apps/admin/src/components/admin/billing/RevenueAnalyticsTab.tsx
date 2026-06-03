'use client';

/**
 * Wave 60.71.T2.billing — Revenue Analytics tab.
 *
 * Vault 107 §5.8 /billing spec — MRR-by-month line chart + churn breakdown.
 * Visual style mirrors `analytics/RevenueChart.tsx` (Wave 60.9) using the
 * shared `colors.gold.DEFAULT` token so brand stays consistent.
 *
 * Recharts is already a dep — no new bundle weight.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  StatusBadge,
  colors,
} from '@hieu-asia/ui';
import { getMrrByMonth } from '@/lib/admin-api';
import { ErrorBlock } from '@/components/admin/error-block';

const GOLD = colors.gold.DEFAULT;
const JADE = colors.jade.DEFAULT;

interface ChartRow {
  label: string;
  mrr_usd: number;
  new_subs: number;
  churned_subs: number;
}

export function RevenueAnalyticsTab() {
  const mrr = useQuery({
    queryKey: ['admin', 'mrr-by-month'],
    queryFn: getMrrByMonth,
  });

  const data = React.useMemo<ChartRow[]>(() => {
    const rows = Array.isArray(mrr.data) ? mrr.data : [];
    return rows.map((d) => ({
      // YYYY-MM → MM/YY for axis brevity
      label: `${d.month.slice(5)}/${d.month.slice(2, 4)}`,
      mrr_usd: d.mrr_usd,
      new_subs: d.new_subs,
      churned_subs: d.churned_subs,
    }));
  }, [mrr.data]);

  const latest = data.at(-1);
  const previous = data.at(-2);
  const growthPct =
    latest && previous && previous.mrr_usd > 0
      ? Math.round(((latest.mrr_usd - previous.mrr_usd) / previous.mrr_usd) * 1000) / 10
      : null;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>MRR theo tháng (12 tháng gần nhất)</CardTitle>
          <CardDescription>
            Monthly Recurring Revenue — amortise yearly (12m) + lifetime (24m) khi tính contribution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mrr.error ? (
            <ErrorBlock
              compact
              message={(mrr.error as Error).message}
              onRetry={() => mrr.refetch()}
            />
          ) : mrr.isLoading ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
                  <XAxis dataKey="label" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,15,18,0.95)',
                      border: '1px solid rgba(184,146,61,0.3)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: GOLD }}
                    formatter={formatTooltip}
                  />
                  <Line
                    type="monotone"
                    dataKey="mrr_usd"
                    stroke={GOLD}
                    strokeWidth={2}
                    dot={{ r: 3, fill: GOLD }}
                    activeDot={{ r: 5, fill: GOLD }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tóm tắt tháng hiện tại</CardTitle>
          <CardDescription>So với tháng trước.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mrr.isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : latest ? (
            <>
              <SummaryRow
                label="MRR"
                value={`$${latest.mrr_usd.toLocaleString('en-US')}`}
                badge={
                  growthPct !== null ? (
                    <StatusBadge
                      status={growthPct >= 0 ? 'success' : 'error'}
                      label={`${growthPct >= 0 ? '+' : ''}${growthPct}%`}
                    />
                  ) : null
                }
                accent="gold"
              />
              <SummaryRow
                label="ARR"
                value={`$${(latest.mrr_usd * 12).toLocaleString('en-US')}`}
                accent="gold"
              />
              <SummaryRow
                label="New subscriptions"
                value={latest.new_subs.toString()}
                accent="jade"
              />
              <SummaryRow
                label="Churned"
                value={latest.churned_subs.toString()}
                badge={
                  <StatusBadge
                    status={latest.churned_subs > 3 ? 'warning' : 'neutral'}
                    label={`${latest.new_subs > 0 ? Math.round((latest.churned_subs / latest.new_subs) * 100) : 0}% churn`}
                  />
                }
                accent="red"
              />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu.</p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>New vs Churned subscriptions</CardTitle>
          <CardDescription>Đường xanh ngọc = tăng trưởng net. Đường đỏ = churn.</CardDescription>
        </CardHeader>
        <CardContent>
          {mrr.isLoading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
                  <XAxis dataKey="label" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,15,18,0.95)',
                      border: '1px solid rgba(184,146,61,0.3)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: GOLD }}
                  />
                  <Line
                    type="monotone"
                    name="New"
                    dataKey="new_subs"
                    stroke={JADE}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    name="Churned"
                    dataKey="churned_subs"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function formatTooltip(value: unknown): [string, string] {
  const n = typeof value === 'number' ? value : Number(value);
  return [`$${n.toLocaleString('en-US')}`, 'MRR'];
}

interface SummaryRowProps {
  label: string;
  value: string;
  badge?: React.ReactNode;
  accent: 'gold' | 'jade' | 'red';
}

function SummaryRow({ label, value, badge, accent }: SummaryRowProps) {
  const valueClass =
    accent === 'gold'
      ? 'text-gold'
      : accent === 'jade'
        ? 'text-jade'
        : 'text-red-700 dark:text-red-300';
  return (
    <div className="flex items-center justify-between border-b border-gold/10 pb-3 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-mono text-lg ${valueClass}`}>{value}</span>
        {badge}
      </div>
    </div>
  );
}
