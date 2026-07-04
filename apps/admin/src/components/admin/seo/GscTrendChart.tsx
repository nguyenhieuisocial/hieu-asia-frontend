'use client';

/**
 * GSC daily-trend chart — impressions (faint area) + clicks (line) over time.
 *
 * Lazy-loaded via next/dynamic on the /seo page so Recharts stays out of the
 * initial bundle (same pattern as ReadingsChart on the dashboard). Brand tokens
 * sourced from @hieu-asia/ui (gold = clicks, jade = impressions) so the palette
 * tracks the shared chart series.
 */

import * as React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { colors } from '@hieu-asia/ui';
import type { GscDailyPoint } from '@/lib/gsc-api';

const GOLD = colors.gold.DEFAULT;
const JADE = colors.jade.DEFAULT;

interface GscTrendChartProps {
  data: GscDailyPoint[];
}

export function GscTrendChart({ data }: GscTrendChartProps) {
  // date → MM-DD for compact axis labels (mirrors cost-chart).
  const rows = data.map((d) => ({
    date: d.date.slice(5),
    clicks: d.clicks,
    impressions: d.impressions,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <ComposedChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gscImpr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={JADE} stopOpacity={0.28} />
              <stop offset="100%" stopColor={JADE} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
          <XAxis dataKey="date" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          {/* left axis = impressions (larger magnitude), right axis = clicks */}
          <YAxis
            yAxisId="impr"
            stroke="rgba(242,237,227,0.5)"
            tick={{ fontSize: 11 }}
            width={44}
          />
          <YAxis
            yAxisId="clicks"
            orientation="right"
            stroke="rgba(242,237,227,0.5)"
            tick={{ fontSize: 11 }}
            width={36}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: GOLD }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(242,237,227,0.7)' }} />
          <Area
            yAxisId="impr"
            type="monotone"
            dataKey="impressions"
            name="Hiển thị"
            stroke={JADE}
            strokeWidth={1.5}
            fill="url(#gscImpr)"
            dot={false}
          />
          <Line
            yAxisId="clicks"
            type="monotone"
            dataKey="clicks"
            name="Lượt click"
            stroke={GOLD}
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
