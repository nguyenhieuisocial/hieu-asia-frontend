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
} from 'recharts';
import { colors } from '@hieu-asia/ui';

// Created (đã bắt đầu thanh toán) vs Paid (đã trả) → khoảng cách = bỏ giỏ.
const CREATED = colors.purple.DEFAULT; // tổng intent tạo ra
const PAID = colors.gold.DEFAULT; // trong đó đã thanh toán

export interface AbandonedDay {
  date: string;
  created: number;
  paid: number;
  abandoned: number;
}

const LABELS: Record<string, string> = {
  created: 'Bắt đầu',
  paid: 'Đã trả',
};

export function AbandonedChart({ data }: { data: AbandonedDay[] }) {
  const rows = data.map((d) => ({ ...d, label: d.date.slice(5) }));
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
          <XAxis dataKey="label" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          <YAxis stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: colors.gold.DEFAULT }}
            formatter={(value: unknown, name: unknown) => {
              const n = typeof value === 'number' ? value : Number(value);
              const key = typeof name === 'string' ? name : String(name ?? '');
              return [n.toLocaleString('vi-VN'), LABELS[key] ?? key];
            }}
          />
          <Legend
            formatter={(value: unknown) => {
              const key = typeof value === 'string' ? value : String(value ?? '');
              return LABELS[key] ?? key;
            }}
            wrapperStyle={{ fontSize: 11 }}
          />
          <Bar dataKey="created" fill={CREATED} radius={[4, 4, 0, 0]} />
          <Bar dataKey="paid" fill={PAID} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
