'use client';

import * as React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Refund = tiền rời khỏi quỹ → màu cảnh báo (đỏ gạch ấm, hợp tông kem/vàng).
const REFUND_RED = '#C2410C';

export interface RefundDay {
  date: string;
  amount: number;
  count: number;
}

export function RefundChart({ data }: { data: RefundDay[] }) {
  const rows = data.map((d) => ({ ...d, label: d.date.slice(5) }));
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
          <XAxis dataKey="label" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          <YAxis stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(194,65,12,0.4)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: REFUND_RED }}
            formatter={(value: unknown) => {
              const n = typeof value === 'number' ? value : Number(value);
              return [new Intl.NumberFormat('vi-VN').format(n) + ' đ', 'Hoàn tiền'];
            }}
          />
          <Bar dataKey="amount" fill={REFUND_RED} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
