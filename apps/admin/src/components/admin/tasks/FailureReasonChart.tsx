'use client';

/**
 * /tasks failure-reason breakdown — GOLD bar chart over the CURRENTLY-FETCHED
 * page rows (no extra fetch). Reasons are derived from the raw worker status
 * via groupFailureReasons (lib/task-failure-reason.ts). Lazy-loaded on the
 * /tasks page so Recharts stays out of the initial bundle. House style mirrors
 * VendorBarChart (same tooltip/axis/grid).
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

const GOLD = colors.gold.DEFAULT;

interface FailureReasonChartProps {
  data: Array<{ reason: string; count: number }>;
}

export function FailureReasonChart({ data }: FailureReasonChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Không có task lỗi trong danh sách.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
          <XAxis dataKey="reason" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          <YAxis
            stroke="rgba(242,237,227,0.5)"
            tick={{ fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(184,146,61,0.08)' }}
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: GOLD }}
            formatter={(value: unknown) => [String(value), 'Số task']}
          />
          <Bar dataKey="count" name="Số task" fill={GOLD} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
