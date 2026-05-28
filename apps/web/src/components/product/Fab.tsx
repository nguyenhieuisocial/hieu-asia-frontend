/**
 * Wave 60.68 — Extended FAB (Material 3 floating action button, pill variant).
 *
 * Server-friendly: pure Link wrapper, no hooks. Mount on routes that have a
 * single, primary, persistent action (e.g. "Xem lá số mới" on /reading hub,
 * "Tra cứu mới" on /account).
 *
 * Positioning rules:
 *   - `bottom-right` (default): fixed bottom-right with `max()` safe-area
 *     respect so iPhone home-indicator never clips the button.
 *   - `bottom-center`: centered horizontally — use when the FAB is the only
 *     CTA on the page (e.g. blank-state screens).
 *
 * Brand: pill-shape gold with `text-ink` body (theme-stable brand black,
 * same hex in light + dark; matches signin button geometry). Wave 60.82:
 * migrated from `text-warm-dark-50` → `text-ink` per vault [[93i - Light
 * Mode Refactor Wave 60.82 Plan]] §1 edge case rule (ink stable on gold).
 * Press feedback comes from the global `button:active` rule in globals.css
 * (Wave 60.66.P5) — no per-component scale needed. `transition-all` covers
 * background-color hover; `prefers-reduced-motion` is respected globally.
 */

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@hieu-asia/ui';

export type FabProps = {
  href: string;
  /** Pre-rendered JSX icon (typically a 20px lucide icon). RSC-safe — never pass a Component reference. */
  icon: React.ReactNode;
  label: string;
  /** Position: default 'bottom-right'. */
  position?: 'bottom-right' | 'bottom-center';
  /** Track event id for analytics. */
  trackId?: string;
  className?: string;
};

export function Fab({
  href,
  icon,
  label,
  position = 'bottom-right',
  trackId,
  className,
}: FabProps) {
  const positionCls =
    position === 'bottom-center'
      ? 'left-1/2 -translate-x-1/2'
      : 'right-6';

  return (
    <Link
      href={href}
      data-track-id={trackId}
      className={cn(
        'fixed z-30 inline-flex items-center gap-2 rounded-pill bg-gold px-6 text-ink shadow-lg shadow-gold/20',
        'h-14 font-heading text-sm font-semibold',
        'transition-all duration-300 ease-editorial hover:bg-gold-soft hover:shadow-gold/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'bottom-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))]',
        positionCls,
        className,
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
