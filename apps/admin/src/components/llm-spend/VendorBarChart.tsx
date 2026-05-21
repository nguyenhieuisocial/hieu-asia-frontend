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
  Cell,
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

export function VendorBarChart({ data }: { data: LlmDailyRow[] }) {
  const rows = React.useMemo(() => {
    const byVendor = new Map<string, { cost: number; calls: number }>();
    for (const r of data) {
      const cur = byVendor.get(r.vendor) ?? { cost: 0, calls: 0 };
      cur.cost += Number(r.cost_usd ?? 0);
      cur.calls += Number(r.call_count ?? 0);
      byVendor.set(r.vendor, cur);
    }
    return Array.from(byVendor.entries())
      .map(([vendor, v]) => ({ vendor, cost: Number(v.cost.toFixed(4)), calls: v.calls }))
      .sort((a, b) => b.cost - a.cost);
  }, [data]);

  if (rows.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-cream/55">
        Chưa có dữ liệu.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
          <XAxis dataKey="vendor" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
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
              if (name === 'cost') {
                const n = typeof value === 'number' ? value : Number(value);
                return [`$${n.toFixed(4)}`, 'Chi phí'];
              }
              return [String(value), name];
            }}
          />
          <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
            {rows.map((r) => (
              <Cell key={r.vendor} fill={VENDOR_COLORS[r.vendor] ?? '#D5B057'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
