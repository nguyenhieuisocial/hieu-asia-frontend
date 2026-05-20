'use client';

import * as React from 'react';
import { cn } from '@hieu-asia/ui';

export interface CautionBannerProps {
  flags: string[];
  className?: string;
}

export function CautionBanner({ flags, className }: CautionBannerProps) {
  const [open, setOpen] = React.useState(true);
  if (!flags.length) return null;

  return (
    <aside
      className={cn(
        'rounded-lg border border-gold/30 bg-gold/5 text-cream',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-gold">
          <span aria-hidden>⚠️</span>
          Lưu ý quan trọng trước khi đọc báo cáo
        </span>
        <span aria-hidden className="text-gold/70">
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && (
        <ul className="space-y-2 border-t border-gold/15 px-4 py-3 text-sm text-cream/80">
          {flags.map((flag, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-gold/60">·</span>
              <span>{flag}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
