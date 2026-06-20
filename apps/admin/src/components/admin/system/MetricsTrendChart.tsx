'use client';

/**
 * /system Performance — request/error daily-trend chart.
 *
 * Requests render as a faint JADE area (left axis, larger magnitude); 5xx
 * errors as a GOLD line (right axis). Mirrors GscTrendChart's dual-axis
 * ComposedChart structure + tooltip/grid/legend styling. Lazy-loaded via
 * next/dynamic on PerformanceTab so Recharts stays out of the initial bundle.
 *
 * Data comes from the worker `GET /admin/metrics/trend?days=N` (90-day KV
 * counters), series ascending by date.
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

const GOLD = colors.gold.DEFAULT;
const JADE = colors.jade.DEFAULT;

export interface MetricsTrendPoint {
  date: string;
  requests: number;
  errors: number;
  error_rate: number;
}

interface MetricsTrendChartProps {
  data: MetricsTrendPoint[];
}

export function MetricsTrendChart({ data }: MetricsTrendChartProps) {
  // date → MM-DD for compact axis labels (mirrors GscTrendChart / cost-chart).
  const rows = data.map((d) => ({
    date: d.date.slice(5),
    requests: d.requests,
    errors: d.errors,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <ComposedChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="metricsReq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={JADE} stopOpacity={0.28} />
              <stop offset="100%" stopColor={JADE} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
          <XAxis dataKey="date" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          {/* left axis = requests (larger magnitude), right axis = errors */}
          <YAxis
            yAxisId="requests"
            stroke="rgba(242,237,227,0.5)"
            tick={{ fontSize: 11 }}
            width={44}
          />
          <YAxis
            yAxisId="errors"
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
            yAxisId="requests"
            type="monotone"
            dataKey="requests"
            name="Requests"
            stroke={JADE}
            strokeWidth={1.5}
            fill="url(#metricsReq)"
            dot={false}
          />
          <Line
            yAxisId="errors"
            type="monotone"
            dataKey="errors"
            name="Lỗi (5xx)"
            stroke={GOLD}
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
