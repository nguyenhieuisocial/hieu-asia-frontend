'use client';

/**
 * VendorCell — vendor icon + label for /admin/keystore (Wave 60.81.A.v2).
 *
 * Lucide doesn't ship per-brand icons; we use a stable monogram inside a
 * small rounded square. Color is theme-neutral (gold accent on dark ink)
 * to keep the table readable without per-vendor brand bleed.
 */

import * as React from 'react';
import { vendorLabel } from '@/lib/keystore-api';

export function VendorCell({ vendor }: { vendor: string }) {
  const label = vendorLabel(vendor);
  const initial = label.slice(0, 1).toUpperCase();
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        className="flex h-7 w-7 items-center justify-center rounded-md border border-gold/20 bg-gradient-to-br from-gold/15 to-gold/0 font-mono text-xs font-medium text-gold"
      >
        {initial}
      </span>
      <span className="text-sm text-foreground">{label}</span>
    </div>
  );
}
