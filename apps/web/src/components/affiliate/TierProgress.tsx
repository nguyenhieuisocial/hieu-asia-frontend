/**
 * TierProgress — bronze/silver/gold/platinum progress bar.
 * Consumed by /affiliate/dashboard.
 */

'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';

export interface Tier {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  min_monthly_conversions: number;
  commission_first: number;
  commission_recurring: number;
  badge_color: string;
}

export interface TierProgressData {
  current: Tier;
  next: Tier | null;
  monthly_conversions: number;
  conversions_to_next: number | null;
  pct_to_next: number;
}

interface Props {
  tier: TierProgressData;
  tiers: Tier[];
}

function pct(rate: number) {
  return `${Math.round(rate * 100)}%`;
}

export function TierProgress({ tier, tiers }: Props) {
  const c = tier.current;
  return (
    <Card className="border-gold/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>
            Tier hiện tại:{' '}
            <span style={{ color: c.badge_color }} className="font-bold">
              {c.name}
            </span>
          </span>
          <span className="text-xs text-cream/60">
            {tier.monthly_conversions} conversions / 30 ngày
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-xs text-cream/60">
            <span>
              Hoa hồng: <b className="text-gold">{pct(c.commission_first)}</b> tháng đầu ·{' '}
              <b className="text-gold">{pct(c.commission_recurring)}</b> recurring
            </span>
            {tier.next && (
              <span>
                Còn <b>{tier.conversions_to_next}</b> conversion lên{' '}
                <b style={{ color: tier.next.badge_color }}>{tier.next.name}</b>
              </span>
            )}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-cream/10">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${tier.pct_to_next}%`,
                backgroundColor: tier.next?.badge_color ?? c.badge_color,
              }}
            />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-4">
          {tiers.map((t) => {
            const active = t.name === c.name;
            return (
              <div
                key={t.name}
                className={`rounded border p-2 text-xs ${
                  active ? 'border-gold/50 bg-gold/5' : 'border-cream/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span style={{ color: t.badge_color }} className="font-semibold">
                    {t.name}
                  </span>
                  {active && <span className="text-[10px] text-gold">Hiện tại</span>}
                </div>
                <div className="mt-1 text-cream/60">
                  ≥ {t.min_monthly_conversions} conv/tháng
                </div>
                <div className="text-cream/70">
                  {pct(t.commission_first)} / {pct(t.commission_recurring)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
