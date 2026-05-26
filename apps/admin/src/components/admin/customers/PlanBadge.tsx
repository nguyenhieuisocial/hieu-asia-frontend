'use client';

/**
 * PlanBadge — colored chip for `users.plan` value.
 *
 * Wave 60.71.T2.customers. Shared between list + detail surfaces so the tone
 * map for `lifetime` (Wave 54) stays consistent.
 */

import * as React from 'react';
import { type CustomerPlan, PLAN_LABEL, PLAN_TONE } from './types';

export interface PlanBadgeProps {
  plan?: CustomerPlan | string | null;
}

export function PlanBadge({ plan }: PlanBadgeProps) {
  if (!plan) return <span className="text-muted-foreground">—</span>;
  const known = plan in PLAN_TONE ? (plan as CustomerPlan) : null;
  const tone = known
    ? PLAN_TONE[known]
    : 'border-border bg-muted/30 text-muted-foreground';
  const label = known ? PLAN_LABEL[known] : plan;
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${tone}`}
    >
      {label}
    </span>
  );
}
