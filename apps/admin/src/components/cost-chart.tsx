'use client';

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
  LineChart,
  Line,
} from 'recharts';
import { chartSeries, colors } from '@hieu-asia/ui';
import type { CostByDay, ReadingsPerDay } from '@/lib/mock-data';

// Wave 60.7 — replaced hardcoded ['#B8923D','#D5B057','#3B2754','#2D5F5A']
// with shared `chartSeries` token from @hieu-asia/ui. Brand palette drift
// risk gone — if tailwind-preset.gold.DEFAULT changes, both charts +
// CSS utility colors update together.
const COLORS = chartSeries;
const GOLD = colors.gold.DEFAULT;
const RED_FAIL = '#ef4444';

interface CostChartProps {
  data: CostByDay[];
}

export function CostChart({ data }: CostChartProps) {
  const models = data.length > 0 ? Object.keys(data[0]!.by_model) : [];
  const rows = data.map((d) => ({
    date: d.date.slice(5), // MM-DD
    ...d.by_model,
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
          <XAxis dataKey="date" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          <YAxis stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} unit="$" />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#B8923D' }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(242,237,227,0.7)' }} />
          {models.map((m, i) => (
            <Bar key={m} dataKey={m} stackId="cost" fill={COLORS[i % COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ReadingsChartProps {
  data: ReadingsPerDay[];
}

export function ReadingsChart({ data }: ReadingsChartProps) {
  const rows = data.map((d) => ({ date: d.date.slice(5), count: d.count, failed: d.failed }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
          <XAxis dataKey="date" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          <YAxis stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#B8923D' }}
          />
          <Line type="monotone" dataKey="count" stroke={GOLD} strokeWidth={2} dot={false} name="Tổng" />
          <Line type="monotone" dataKey="failed" stroke={RED_FAIL} strokeWidth={1.5} dot={false} name="Lỗi" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
