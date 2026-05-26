'use client';

/**
 * Wave 60.68 — PWA Bottom Navigation Bar (Material 3).
 *
 * Renders ONLY when the app is in standalone display-mode (i.e. installed as
 * PWA on iOS Add-to-Home-Screen or Android WebAPK). Browser tabs keep their
 * normal header-based nav untouched — no UX pollution.
 *
 * Detection contract:
 *   - `window.matchMedia('(display-mode: standalone)').matches` (Android +
 *     Chromium-based desktop PWAs).
 *   - `(navigator as any).standalone` (iOS Safari legacy fallback).
 *
 * Hydration safety: standalone state can't be known on the server, so we mount
 * `null` on first render and flip after `useEffect`. Skipping SSR matters
 * because the bottom-bar would otherwise flash for non-PWA users for a frame.
 *
 * Tokens: warm-dark-50/95 + gold/15 border match the editorial in-app palette
 * (see vault 109 §4 — Tier 2 patterns). Safe-area-inset-bottom respected so
 * the bar doesn't sit under the iOS home indicator.
 */

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@hieu-asia/ui';

export type BottomNavItem = {
  /** Stable identifier (used as React key + analytics tag). */
  id: string;
  /** Visible label (vi-VN). */
  label: string;
  /** Pre-rendered JSX icon (~20px). RSC-safe — pass JSX, not a Component ref. */
  icon: React.ReactNode;
  /** Destination route. */
  href: string;
};

export type BottomNavBarProps = {
  items: BottomNavItem[];
};

function useIsStandalone(): boolean {
  const [standalone, setStandalone] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(display-mode: standalone)');
    const iosLegacy =
      typeof (navigator as Navigator & { standalone?: boolean }).standalone ===
        'boolean' &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setStandalone(mq.matches || iosLegacy);
    const handler = (e: MediaQueryListEvent) => setStandalone(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return standalone;
}

/** Pick the active item by longest-prefix match (so /account/mentor highlights /account/mentor over /account). */
function pickActiveId(pathname: string | null, items: BottomNavItem[]): string | null {
  if (!pathname) return null;
  let best: { id: string; len: number } | null = null;
  for (const item of items) {
    if (item.href === '/') {
      if (pathname === '/') return item.id;
      continue;
    }
    if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
      if (!best || item.href.length > best.len) {
        best = { id: item.id, len: item.href.length };
      }
    }
  }
  return best?.id ?? null;
}

export function BottomNavBar({ items }: BottomNavBarProps) {
  const standalone = useIsStandalone();
  const pathname = usePathname();
  const activeId = React.useMemo(
    () => pickActiveId(pathname, items),
    [pathname, items],
  );

  if (!standalone || !items.length) return null;

  return (
    <nav
      aria-label="Điều hướng chính"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40',
        'border-t border-gold/15 bg-warm-dark-50/95 backdrop-blur-sm',
        'pb-[env(safe-area-inset-bottom)]',
      )}
    >
      <ul className="flex h-16 items-center justify-around">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-full flex-col items-center justify-center gap-0.5 px-2 text-xs transition-colors duration-200',
                  active
                    ? 'text-gold'
                    : 'text-cream-500 hover:text-cream-100',
                )}
              >
                <span className="grid place-items-center" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="truncate font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
