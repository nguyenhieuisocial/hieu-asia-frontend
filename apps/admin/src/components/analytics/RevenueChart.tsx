'use client';

import * as React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export interface RevenueDay {
  date: string;
  amount: number;
  txn_count: number;
}

export function RevenueChart({ data }: { data: RevenueDay[] }) {
  const rows = data.map(d => ({ ...d, label: d.date.slice(5) }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
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
            labelStyle={{ color: '#B8923D' }}
            formatter={(value: unknown) => {
              const n = typeof value === 'number' ? value : Number(value);
              return [new Intl.NumberFormat('vi-VN').format(n) + ' đ', 'Doanh thu'];
            }}
          />
          <Bar dataKey="amount" fill="#B8923D" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
