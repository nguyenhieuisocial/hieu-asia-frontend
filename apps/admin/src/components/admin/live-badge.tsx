'use client';

/**
 * Pulse "LIVE" badge. Used near widgets that auto-refresh (queue, traces).
 * Pure CSS animation — no JS.
 */

import * as React from 'react';
import { cn } from '@hieu-asia/ui';

export function LiveBadge({
  label,
  className,
  tone,
  isMock = false,
}: {
  label?: string;
  className?: string;
  tone?: 'jade' | 'gold' | 'red';
  isMock?: boolean;
}) {
  const effLabel = label ?? (isMock ? 'DEMO' : 'LIVE');
  const effTone = tone ?? (isMock ? 'gold' : 'jade');

  const toneClass =
    effTone === 'red'
      ? 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300'
      : effTone === 'gold'
        ? 'border-gold/40 bg-gold/10 text-gold'
        : 'border-jade/40 bg-jade/10 text-jade-700 dark:text-jade-50';
  const dotClass =
    effTone === 'red' ? 'bg-red-400' : effTone === 'gold' ? 'bg-gold' : 'bg-jade-400 dark:bg-jade-50';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest',
        toneClass,
        className,
      )}
    >
      <span className="relative inline-flex h-2 w-2">
        <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', dotClass)} />
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', dotClass)} />
      </span>
      {effLabel}
    </span>
  );
}
