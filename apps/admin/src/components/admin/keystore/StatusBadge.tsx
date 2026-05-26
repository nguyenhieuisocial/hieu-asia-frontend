'use client';

/**
 * StatusBadge — vault entry lifecycle badge (Wave 60.81.A.v2).
 *
 * Three tones:
 *   active   → jade
 *   expiring → warn (semantic --warn token, vault 107 §4.2)
 *   expired  → red
 */

import * as React from 'react';
import { cn } from '@hieu-asia/ui';
import type { VaultStatus } from '@/lib/keystore-api';

const TONE: Record<VaultStatus, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-jade/15 text-foreground/85 border-jade/40',
  },
  expiring: {
    label: 'Expiring',
    className: 'bg-warn-300/10 text-warn-300 border-warn-500/40',
  },
  expired: {
    label: 'Expired',
    className: 'bg-red-500/15 text-red-300 border-red-400/40',
  },
};

export function StatusBadge({ status }: { status: VaultStatus }) {
  const tone = TONE[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
        tone.className,
      )}
    >
      {tone.label}
    </span>
  );
}
