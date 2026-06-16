'use client';

/**
 * Vercel 14d deploy-frequency — stacked bars: success (jade) + failed (red).
 *
 * Lazy-loaded via next/dynamic({ssr:false}) on the Vercel infra page so
 * Recharts stays out of the initial bundle (same pattern as AiGatewayTrendChart).
 * jade = thành công, red = thất bại (mirrors InfraStatusPill tones).
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
  Legend,
} from 'recharts';
import { colors } from '@hieu-asia/ui';
import type { InfraVercelSeriesPoint } from '@/lib/admin-api';

const JADE = colors.jade.DEFAULT;
const RED = '#EF4444'; // red-500, matches the InfraStatusPill "bad" tone

interface VercelDeployChartProps {
  data: InfraVercelSeriesPoint[];
}

export function VercelDeployChart({ data }: VercelDeployChartProps) {
  // date → MM-DD for compact axis labels.
  const rows = data.map((d) => ({
    date: d.date.slice(5),
    success: d.success,
    failed: d.failed,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
          <XAxis dataKey="date" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          <YAxis
            stroke="rgba(242,237,227,0.5)"
            tick={{ fontSize: 11 }}
            width={32}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(184,146,61,0.06)' }}
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: colors.gold.DEFAULT }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(242,237,227,0.7)' }} />
          <Bar
            dataKey="success"
            name="Thành công"
            stackId="deploys"
            fill={JADE}
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="failed"
            name="Thất bại"
            stackId="deploys"
            fill={RED}
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
