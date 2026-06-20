'use client';

/**
 * OverviewTrends — compact trend chart row for the admin dashboard.
 *
 * Renders ONE genuinely-missing trend: AI spend per day. The overview already
 * has a 30-day readings line chart + per-KPI sparklines, but the LLM-spend
 * series (real, also powering /llm-spend's CostPanel) only appears as a tiny
 * 14-day KPI sparkline — there's no standalone spend trend on the dashboard.
 *
 * Data is the SAME `getCostByDay(14)` series already fetched by the page and
 * passed in here — no new fetch, no new admin-api getter. Source: the worker
 * endpoint `/admin/cost/by_day` (llm_traces daily rollup).
 *
 * Honesty rules (product is pre-launch / sparse):
 *   - all-zero / empty series  → muted "chưa có chi tiêu" state, NOT a flat
 *     line pretending to be a meaningful chart.
 *   - the card labels its real source + window explicitly.
 */

import * as React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { colors } from '@hieu-asia/ui';
import { Coins } from 'lucide-react';
import type { CostByDay } from '@/lib/mock-data';

const GOLD = colors.gold.DEFAULT;

function fmtUsd(v: number) {
  if (v === 0) return '$0';
  if (v < 1) return `$${v.toFixed(2)}`;
  return `$${v.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

interface OverviewTrendsProps {
  /** The same series the page already fetched via getCostByDay(14). */
  cost: CostByDay[] | undefined;
  isLoading: boolean;
}

/**
 * AI spend / day. The series is real (proven by /llm-spend's CostPanel) but on a
 * fresh / low-traffic install every day is $0 — we detect that and show a muted
 * note instead of a misleading flat area.
 */
export function OverviewTrends({ cost, isLoading }: OverviewTrendsProps) {
  const data = cost ?? [];
  const total = data.reduce((s, d) => s + (d.total_usd ?? 0), 0);
  const hasSpend = total > 0;

  const rows = data.map((d) => ({ label: d.date.slice(5), spend: d.total_usd }));

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base">
          <Coins className="h-4 w-4 text-gold" aria-hidden />
          Chi phí AI 14 ngày
        </CardTitle>
        <CardDescription>
          Chi phí gọi mô hình theo ngày — nguồn{' '}
          <code className="font-mono text-foreground/85">/admin/cost/by_day</code> (llm_traces).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-48 animate-pulse rounded bg-muted/30" aria-hidden />
        ) : !hasSpend ? (
          // Honest empty/sparse state — never draw a flat $0 area as if it meant
          // something. Pre-launch this is the expected case.
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-center">
            <div className="relative h-12 w-12" aria-hidden>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/20 via-purple/15 to-jade/15 blur-lg" />
              <div className="relative flex h-full w-full items-center justify-center rounded-full border border-gold/30 bg-card/60">
                <Coins className="h-5 w-5 text-gold/70" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Chưa có chi tiêu AI trong 14 ngày qua.
            </p>
            <p className="text-xs text-muted-foreground/80">
              Biểu đồ sẽ hiện khi pipeline AI bắt đầu gọi mô hình.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-baseline gap-2">
              <span className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                {fmtUsd(total)}
              </span>
              <span className="text-xs text-muted-foreground">tổng 14 ngày</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer>
                <AreaChart data={rows} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="overviewSpendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GOLD} stopOpacity={0.32} />
                      <stop offset="100%" stopColor={GOLD} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
                  <XAxis dataKey="label" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="rgba(242,237,227,0.5)"
                    tick={{ fontSize: 11 }}
                    width={44}
                    tickFormatter={(v: number) => fmtUsd(v)}
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
                      return [fmtUsd(n), 'Chi phí'];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke={GOLD}
                    strokeWidth={2}
                    fill="url(#overviewSpendFill)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
