'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { LlmDailyRow } from '@/lib/llm-spend-api';

const VENDOR_COLORS: Record<string, string> = {
  anthropic: '#B8923D',
  openai: '#4ADE80',
  google: '#60A5FA',
  'workers-ai': '#A78BFA',
  cloudflare: '#A78BFA',
  groq: '#F87171',
};

function colorFor(vendor: string): string {
  return VENDOR_COLORS[vendor] ?? '#D5B057';
}

export function DailyCostChart({ data }: { data: LlmDailyRow[] }) {
  // Pivot rows: { day, [vendor]: cost_sum }
  const { rows, vendors } = React.useMemo(() => {
    const vendorSet = new Set<string>();
    const byDay = new Map<string, Record<string, number>>();
    for (const r of data) {
      vendorSet.add(r.vendor);
      const key = r.day.slice(0, 10);
      const cur = byDay.get(key) ?? {};
      cur[r.vendor] = (cur[r.vendor] ?? 0) + Number(r.cost_usd ?? 0);
      byDay.set(key, cur);
    }
    const sortedDays = Array.from(byDay.keys()).sort();
    const vendorList = Array.from(vendorSet).sort();
    const pivoted = sortedDays.map((day) => {
      const out: Record<string, string | number> = { day: day.slice(5) };
      for (const v of vendorList) out[v] = byDay.get(day)?.[v] ?? 0;
      return out;
    });
    return { rows: pivoted, vendors: vendorList };
  }, [data]);

  if (rows.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-cream/55">
        Chưa có giao dịch trong khoảng này.
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <AreaChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
          <XAxis dataKey="day" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          <YAxis stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} unit="$" />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#B8923D' }}
            formatter={(value: unknown, name) => {
              const n = typeof value === 'number' ? value : Number(value);
              return [`$${n.toFixed(4)}`, name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(242,237,227,0.7)' }} />
          {vendors.map((v) => (
            <Area
              key={v}
              type="monotone"
              dataKey={v}
              stackId="cost"
              stroke={colorFor(v)}
              fill={colorFor(v)}
              fillOpacity={0.5}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
