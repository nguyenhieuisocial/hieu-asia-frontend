'use client';

import * as React from 'react';
import { Card, CardContent } from '@hieu-asia/ui';
import { Gauge, Sparkles } from 'lucide-react';
import { scoreCustomer, type Segment, type ChurnBand } from '@/lib/customer-intelligence';
import type { CustomerDetail } from './detail-types';

const SEGMENT_ACCENT: Record<Segment, string> = {
  new: 'bg-blue-500/15 text-blue-600 dark:text-blue-300',
  active_paying: 'bg-jade-500/15 text-jade-700 dark:text-jade-50',
  free_engaged: 'bg-gold/15 text-gold',
  at_risk: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  dormant: 'bg-muted/40 text-muted-foreground',
  churned: 'bg-red-500/15 text-red-600 dark:text-red-300',
};
const CHURN_LABEL: Record<ChurnBand, { label: string; cls: string }> = {
  low: { label: 'Thấp', cls: 'text-jade-700 dark:text-jade-50' },
  medium: { label: 'Trung bình', cls: 'text-amber-600 dark:text-amber-300' },
  high: { label: 'Cao', cls: 'text-red-600 dark:text-red-300' },
};

function birthMonthDay(c: CustomerDetail): { month?: number | null; day?: number | null } {
  if (c.birth_month && c.birth_day) return { month: c.birth_month, day: c.birth_day };
  // birth_date is "YYYY-MM-DD" (enriched from the latest reading session)
  const m = /^\d{4}-(\d{2})-(\d{2})/.exec(String(c.birth_date ?? ''));
  if (m) return { month: Number(m[1]), day: Number(m[2]) };
  return {};
}

export function CustomerIntelligenceCard({
  customer,
  sessionCount,
  totalSpendVnd,
}: {
  customer: CustomerDetail;
  sessionCount: number;
  totalSpendVnd: number;
}) {
  const { month, day } = birthMonthDay(customer);
  const score = React.useMemo(
    () =>
      scoreCustomer({
        plan: customer.plan,
        createdAt: customer.created_at,
        lastActive: customer.last_active,
        sessionCount,
        totalSpendVnd,
        birthMonth: month,
        birthDay: day,
        nowMs: Date.now(),
      }),
    [customer.plan, customer.created_at, customer.last_active, sessionCount, totalSpendVnd, month, day],
  );
  const churn = CHURN_LABEL[score.churnBand];

  return (
    <Card className="border-gold/20">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gold">
          <Gauge className="h-3.5 w-3.5" />
          Trí tuệ khách hàng (CDP)
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${SEGMENT_ACCENT[score.segment]}`}>
            {score.segmentLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            Sức khỏe: <span className="font-mono font-medium text-foreground">{score.healthScore}/100</span>
          </span>
          <span className="text-xs text-muted-foreground">
            Nguy cơ rời bỏ: <span className={`font-medium ${churn.cls}`}>{churn.label}</span>
          </span>
          {score.daysSinceActive !== null && (
            <span className="text-xs text-muted-foreground">
              Hoạt động cuối: <span className="text-foreground/85">{score.daysSinceActive} ngày trước</span>
            </span>
          )}
        </div>
        {score.nextBestMoments.length > 0 && (
          <div className="space-y-1 border-t border-border/40 pt-2">
            <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3 text-gold" /> Thời điểm vàng (gợi ý — chỉ-đọc)
            </div>
            <ul className="space-y-0.5 text-xs text-foreground/85">
              {score.nextBestMoments.map((m, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold/60" aria-hidden />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
