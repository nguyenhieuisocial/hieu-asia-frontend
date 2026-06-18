'use client';

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
import type { NetRevenueDay } from '@/lib/net-revenue';

// Gross = gold (same token as the revenue bar chart); net = jade (tiền giữ lại).
const GOLD = colors.gold.DEFAULT;
const JADE = colors.jade.DEFAULT;

const SERIES_LABEL: Record<string, string> = {
  gross: 'Doanh thu gộp',
  net: 'Tiền thực thu',
};

export function NetRevenueChart({ data }: { data: NetRevenueDay[] }) {
  const rows = data.map((d) => ({ ...d, label: d.date.slice(5) }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <ComposedChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="netRevenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={JADE} stopOpacity={0.35} />
              <stop offset="100%" stopColor={JADE} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
          <XAxis dataKey="label" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          <YAxis stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: GOLD }}
            formatter={(value: unknown, name: unknown) => {
              const n = typeof value === 'number' ? value : Number(value);
              const key = String(name);
              return [
                new Intl.NumberFormat('vi-VN').format(n) + ' đ',
                SERIES_LABEL[key] ?? key,
              ];
            }}
          />
          <Legend
            formatter={(value) => SERIES_LABEL[String(value)] ?? String(value)}
            wrapperStyle={{ fontSize: 12 }}
          />
          {/* Gross as a thin reference line, net as the filled headline series. */}
          <Line
            type="monotone"
            dataKey="gross"
            stroke={GOLD}
            strokeWidth={1.5}
            strokeDasharray="4 3"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="net"
            stroke={JADE}
            strokeWidth={2}
            fill="url(#netRevenueFill)"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
