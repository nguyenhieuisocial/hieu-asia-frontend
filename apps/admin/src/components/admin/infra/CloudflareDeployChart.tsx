'use client';

/**
 * Cloudflare 30d deploy-frequency — single gold bar series (count per UTC day).
 *
 * Lazy-loaded via next/dynamic({ssr:false}) on the Cloudflare infra page so
 * Recharts stays out of the initial bundle (same pattern as VercelDeployChart).
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
import type { InfraCfDeploySeriesPoint } from '@/lib/admin-api';

const GOLD = colors.gold.DEFAULT;

interface CloudflareDeployChartProps {
  data: InfraCfDeploySeriesPoint[];
}

export function CloudflareDeployChart({ data }: CloudflareDeployChartProps) {
  // date → MM-DD for compact axis labels.
  const rows = data.map((d) => ({ date: d.date.slice(5), count: d.count }));

  return (
    <div className="h-64 w-full">
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
          <Bar dataKey="count" name="Bản triển khai" fill={GOLD} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
