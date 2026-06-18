'use client';

/**
 * Active-fraud-flag breakdown by reason for the Fraud tab. Wave 60.62.
 *
 * Fed ONLY the flags the tab already fetched
 * (`/api/admin/affiliates/fraud-report`). Counts ACTIVE flags per reason enum
 * (ip_duplicate / self_referral / velocity / manual). No new endpoints.
 * Recharts lazy-loaded by the tab.
 */

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
import { colors } from '@hieu-asia/ui';
import { ChartSection } from './ChartSection';

const GOLD = colors.gold.DEFAULT;

type Reason = 'ip_duplicate' | 'self_referral' | 'velocity' | 'manual';

export interface FraudFlagRow {
  reason: Reason;
  cleared_at?: string;
}

const REASON_LABEL: Record<Reason, string> = {
  ip_duplicate: 'Trùng IP',
  self_referral: 'Self-referral',
  velocity: 'Velocity',
  manual: 'Admin manual',
};

const REASON_COLOR: Record<Reason, string> = {
  ip_duplicate: '#F97316', // orange-500
  self_referral: '#EF4444', // red-500
  velocity: '#EAB308', // yellow-500
  manual: '#71717A', // zinc-500
};

export function FraudReasonChart({ flags }: { flags: FraudFlagRow[] }) {
  const data = React.useMemo(() => {
    const byReason = new Map<Reason, number>();
    for (const f of flags) {
      if (f.cleared_at) continue; // active flags only
      byReason.set(f.reason, (byReason.get(f.reason) ?? 0) + 1);
    }
    return (Object.keys(REASON_LABEL) as Reason[])
      .map((reason) => ({
        reason,
        label: REASON_LABEL[reason],
        count: byReason.get(reason) ?? 0,
      }))
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [flags]);

  return (
    <ChartSection
      title="Cờ gian lận đang active theo lý do"
      source="fraud-report · chỉ flag chưa clear"
      empty={data.length === 0}
    >
      <div className="h-56 w-full">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
            <XAxis dataKey="label" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
            <YAxis
              stroke="rgba(242,237,227,0.5)"
              tick={{ fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(184,146,61,0.08)' }}
              contentStyle={{
                background: 'rgba(15,15,18,0.95)',
                border: '1px solid rgba(184,146,61,0.3)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: GOLD }}
              formatter={(value: unknown) => [String(value), 'Số flag']}
            />
            <Bar dataKey="count" name="Số flag" radius={[4, 4, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.reason} fill={REASON_COLOR[d.reason]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartSection>
  );
}
