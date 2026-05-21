'use client';

import * as React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export interface VendorCost {
  vendor: string;
  cost_usd: number;
  tokens: number;
  requests: number;
}

const COLORS: Record<string, string> = {
  anthropic: '#B8923D',
  openai: '#4ADE80',
  google: '#60A5FA',
  cloudflare: '#F87171',
};

export function VendorCostChart({ data }: { data: VendorCost[] }) {
  const total = data.reduce((s, d) => s + d.cost_usd, 0);
  const rows = data.map(d => ({ name: d.vendor, value: d.cost_usd, tokens: d.tokens, requests: d.requests }));

  if (total === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-cream/55">
        Chưa có dữ liệu vendor cost (Langfuse chưa wire).
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={rows}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={45}
            paddingAngle={2}
            label={(entry) => `${entry.name}`}
            labelLine={false}
          >
            {rows.map((r) => (
              <Cell key={r.name} fill={COLORS[r.name] ?? '#888'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: unknown) => {
              const n = typeof value === 'number' ? value : Number(value);
              return [`$${n.toFixed(2)}`, 'Chi phí'];
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(242,237,227,0.7)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
