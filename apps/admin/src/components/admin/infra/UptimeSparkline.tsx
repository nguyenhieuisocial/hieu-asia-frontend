'use client';

/**
 * Uptime response-time sparkline — a minimal jade LineChart over the monitor's
 * recent ≤60 response-time samples. Lazy-loaded via next/dynamic({ssr:false})
 * inside UptimeMonitorDrawer so Recharts stays out of the initial bundle
 * (same pattern as AiGatewayTrendChart).
 */

import * as React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { colors } from '@hieu-asia/ui';
import type { InfraUptimeResponseTime } from '@/lib/admin-api';

const JADE = colors.jade.DEFAULT;

interface UptimeSparklineProps {
  data: InfraUptimeResponseTime[];
}

export function UptimeSparkline({ data }: UptimeSparklineProps) {
  // Keep only points with a numeric latency; index as the x-axis (timestamps
  // are too dense to label on a sparkline).
  const rows = data
    .filter((d) => d.response_time_ms != null)
    .map((d, i) => ({ i, ms: d.response_time_ms as number }));

  if (rows.length === 0) return null;

  return (
    <div className="h-28 w-full">
      <ResponsiveContainer>
        <LineChart data={rows} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="i" hide />
          <YAxis
            stroke="rgba(242,237,227,0.5)"
            tick={{ fontSize: 10 }}
            width={40}
            tickFormatter={(v: number) => `${v}`}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={() => ''}
            formatter={(value) => [`${Number(value).toLocaleString('vi-VN')} ms`, 'Phản hồi']}
          />
          <Line
            type="monotone"
            dataKey="ms"
            stroke={JADE}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
