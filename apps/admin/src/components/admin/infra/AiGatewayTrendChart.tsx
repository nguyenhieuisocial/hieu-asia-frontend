'use client';

/**
 * AI Gateway 30d trend — cost (gold area) + requests (jade line) over time.
 *
 * Lazy-loaded via next/dynamic({ssr:false}) on the AI Gateway infra page so
 * Recharts stays out of the initial bundle (same pattern as GscTrendChart on
 * /seo). Brand tokens from @hieu-asia/ui: gold = cost, jade = requests.
 */

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
import type { InfraAiGatewaySeriesPoint } from '@/lib/admin-api';

const GOLD = colors.gold.DEFAULT;
const JADE = colors.jade.DEFAULT;

interface AiGatewayTrendChartProps {
  data: InfraAiGatewaySeriesPoint[];
}

export function AiGatewayTrendChart({ data }: AiGatewayTrendChartProps) {
  // date → MM-DD for compact axis labels (mirrors GscTrendChart).
  const rows = data.map((d) => ({
    date: d.date.slice(5),
    cost_usd: d.cost_usd,
    requests: d.requests,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <ComposedChart data={rows} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="aiGwCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity={0.28} />
              <stop offset="100%" stopColor={GOLD} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
          <XAxis dataKey="date" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
          {/* left axis = cost (small magnitude), right axis = requests */}
          <YAxis
            yAxisId="cost"
            stroke="rgba(242,237,227,0.5)"
            tick={{ fontSize: 11 }}
            width={48}
            tickFormatter={(v: number) => `$${v}`}
          />
          <YAxis
            yAxisId="req"
            orientation="right"
            stroke="rgba(242,237,227,0.5)"
            tick={{ fontSize: 11 }}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: GOLD }}
            formatter={(value, name) =>
              name === 'Chi phí' ? `$${Number(value).toFixed(4)}` : String(value)
            }
          />
          <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(242,237,227,0.7)' }} />
          <Area
            yAxisId="cost"
            type="monotone"
            dataKey="cost_usd"
            name="Chi phí"
            stroke={GOLD}
            strokeWidth={1.5}
            fill="url(#aiGwCost)"
            dot={false}
          />
          <Line
            yAxisId="req"
            type="monotone"
            dataKey="requests"
            name="Request"
            stroke={JADE}
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
