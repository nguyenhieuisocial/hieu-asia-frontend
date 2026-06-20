'use client';

/**
 * Supabase signups chart — a gold Bar over daily new-user counts (≤30 days).
 * Lazy-loaded via next/dynamic({ssr:false}) on the Supabase panel so Recharts
 * stays out of the initial bundle (same pattern as SentryVolumeChart /
 * VercelDeployChart).
 */

import * as React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { colors } from '@hieu-asia/ui';
import type { InfraSupabaseSignupPoint } from '@/lib/admin-api';

const GOLD = colors.gold.DEFAULT;

interface SupabaseSignupChartProps {
  /** Daily signup counts, ascending by date (≤30 days). */
  data: InfraSupabaseSignupPoint[];
}

function shortDate(iso: string): string {
  // "2026-06-17" → "17/6"
  const [, m, d] = iso.split('-');
  if (!m || !d) return iso;
  return `${Number(d)}/${Number(m)}`;
}

export function SupabaseSignupChart({ data }: SupabaseSignupChartProps) {
  const rows = data.map((p) => ({ date: shortDate(p.date), count: p.count }));
  if (rows.length === 0) return null;

  return (
    <div className="h-44 w-full">
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="date"
            stroke="rgba(242,237,227,0.5)"
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis
            stroke="rgba(242,237,227,0.5)"
            tick={{ fontSize: 10 }}
            width={32}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            cursor={{ fill: 'rgba(184,146,61,0.08)' }}
            formatter={(value) => [
              `${Number(value).toLocaleString('vi-VN')}`,
              'Người dùng mới',
            ]}
          />
          <Bar dataKey="count" fill={GOLD} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
