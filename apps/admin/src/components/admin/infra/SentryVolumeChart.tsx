'use client';

/**
 * Sentry event-volume chart — a gold Area over an issue's event counts (24h
 * hourly or 14d daily buckets). Lazy-loaded via next/dynamic({ssr:false}) inside
 * SentryIssueDrawer so Recharts stays out of the initial bundle (same pattern as
 * LangfuseTrendChart / UptimeSparkline).
 */

import * as React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { colors } from '@hieu-asia/ui';

const GOLD = colors.gold.DEFAULT;

interface SentryVolumeChartProps {
  /** Ordered event counts (oldest → newest). */
  data: number[];
  /** Tooltip noun, e.g. "Sự kiện". */
  label?: string;
}

export function SentryVolumeChart({ data, label = 'Sự kiện' }: SentryVolumeChartProps) {
  const rows = data.map((count, i) => ({ i, count }));
  if (rows.length === 0) return null;

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer>
        <AreaChart data={rows} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sentryVol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity={0.3} />
              <stop offset="100%" stopColor={GOLD} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="i" hide />
          <YAxis
            stroke="rgba(242,237,227,0.5)"
            tick={{ fontSize: 10 }}
            width={36}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={() => ''}
            formatter={(value) => [`${Number(value).toLocaleString('vi-VN')}`, label]}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={GOLD}
            strokeWidth={1.5}
            fill="url(#sentryVol)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
