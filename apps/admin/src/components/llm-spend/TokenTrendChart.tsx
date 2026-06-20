'use client';

/**
 * Token-volume trend — per-day input/output token sums across vendors.
 *
 * The daily series has one row per vendor/model per day, so we group by `day`
 * and sum the (optional) token fields. Input tokens render as a JADE area,
 * output tokens as a GOLD area (stacked). Compact MM-DD X labels. Lazy-loaded
 * via next/dynamic on the /llm-spend page.
 *
 * Graceful degrade: rows missing both token fields are skipped; if the WHOLE
 * series has no token data (backend not yet deployed) we render a muted
 * placeholder instead of an empty chart.
 */

import * as React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { colors } from '@hieu-asia/ui';
import type { LlmDailyRow } from '@/lib/llm-spend-api';

const GOLD = colors.gold.DEFAULT;
const JADE = colors.jade.DEFAULT;

function fmtTokens(value: unknown): string {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(n);
}

export function TokenTrendChart({ data }: { data: LlmDailyRow[] }) {
  const { rows, hasData } = React.useMemo(() => {
    const byDay = new Map<string, { input: number; output: number }>();
    let anyToken = false;
    for (const r of data) {
      const hasInput = r.input_tokens != null;
      const hasOutput = r.output_tokens != null;
      // Skip rows that carry no token data at all.
      if (!hasInput && !hasOutput) continue;
      anyToken = true;
      const key = r.day.slice(0, 10);
      const cur = byDay.get(key) ?? { input: 0, output: 0 };
      cur.input += Number(r.input_tokens ?? 0);
      cur.output += Number(r.output_tokens ?? 0);
      byDay.set(key, cur);
    }
    const pivoted = Array.from(byDay.keys())
      .sort()
      .map((day) => {
        const v = byDay.get(day)!;
        return { date: day.slice(5), input: v.input, output: v.output };
      });
    return { rows: pivoted, hasData: anyToken && pivoted.length > 0 };
  }, [data]);

  if (!hasData) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
        Token chưa có dữ liệu
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <ComposedChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="tokIn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={JADE} stopOpacity={0.32} />
              <stop offset="100%" stopColor={JADE} stopOpacity={0.04} />
            </linearGradient>
            <linearGradient id="tokOut" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity={0.32} />
              <stop offset="100%" stopColor={GOLD} stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
          <XAxis dataKey="date" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          <YAxis stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} width={52} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: GOLD }}
            formatter={(value: unknown, name) => [fmtTokens(value), name]}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(242,237,227,0.7)' }} />
          <Area
            type="monotone"
            dataKey="input"
            name="Token vào"
            stackId="tok"
            stroke={JADE}
            strokeWidth={1.5}
            fill="url(#tokIn)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="output"
            name="Token ra"
            stackId="tok"
            stroke={GOLD}
            strokeWidth={1.5}
            fill="url(#tokOut)"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
