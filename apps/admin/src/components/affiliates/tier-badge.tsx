'use client';

import * as React from 'react';
import { cn } from '@hieu-asia/ui';
import { getTier } from '@/lib/affiliate-admin-api';

export interface TierBadgeProps {
  conversions: number;
  /** Show the progress-to-next-tier bar below the badge. */
  withProgress?: boolean;
  className?: string;
}

export function TierBadge({ conversions, withProgress, className }: TierBadgeProps) {
  const info = React.useMemo(() => getTier(conversions), [conversions]);
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
          info.badgeClass,
        )}
        title={
          info.nextThreshold != null
            ? `Còn ${info.nextThreshold - conversions} conversion để lên tier kế`
            : 'Tier cao nhất'
        }
      >
        <span aria-hidden>★</span>
        {info.label}
      </span>
      {withProgress && info.nextThreshold != null && (
        <div className="h-1 w-20 overflow-hidden rounded-full bg-muted/40">
          <div
            className={cn('h-full transition-all', info.barClass)}
            style={{ width: `${Math.round(info.progress * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
