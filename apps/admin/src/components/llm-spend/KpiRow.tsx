'use client';

import * as React from 'react';
import { StatCard } from '@/components/stat-card';

export interface KpiRowProps {
  today: number;
  last7: number;
  last30: number;
  mtd: number;
  monthlyBudget: number | null;
  /**
   * Month-end cost forecast derived client-side from the daily series. Optional
   * — when absent (or `null` while the series loads) the card shows "—".
   */
  forecast?: {
    projected: number;
    mtdCost: number;
    daysElapsed: number;
    daysInMonth: number;
  } | null;
}

function fmtUsd(v: number, digits = 2) {
  return `$${v.toFixed(digits)}`;
}

export function KpiRow({ today, last7, last30, mtd, monthlyBudget, forecast }: KpiRowProps) {
  const pct = monthlyBudget && monthlyBudget > 0 ? (mtd / monthlyBudget) * 100 : null;
  const pctLabel = pct == null ? '—' : `${pct.toFixed(1)}%`;
  const budgetHint =
    monthlyBudget == null
      ? 'Chưa cấu hình budget tháng'
      : `${fmtUsd(mtd)} / ${fmtUsd(monthlyBudget)}`;
  const budgetDirection: 'up' | 'down' | 'flat' =
    pct == null ? 'flat' : pct >= 90 ? 'up' : pct >= 60 ? 'flat' : 'down';

  const daysLeft =
    forecast && forecast.daysInMonth > 0 ? forecast.daysInMonth - forecast.daysElapsed : null;
  const forecastHint =
    forecast == null
      ? '—'
      : `MTD ${fmtUsd(forecast.mtdCost)} • còn ${daysLeft ?? 0} ngày`;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      <StatCard label="Hôm nay" value={fmtUsd(today)} hint="USD" />
      <StatCard label="7 ngày" value={fmtUsd(last7)} hint="cộng dồn" />
      <StatCard label="30 ngày" value={fmtUsd(last30)} hint="cộng dồn" />
      <StatCard
        label="MTD vs budget"
        value={pctLabel}
        hint={budgetHint}
        delta={
          pct == null
            ? undefined
            : {
                value: pctLabel,
                direction: budgetDirection,
              }
        }
      />
      <StatCard
        label="Dự báo chi phí tháng"
        value={forecast == null ? '—' : fmtUsd(forecast.projected)}
        hint={forecastHint}
      />
    </div>
  );
}
