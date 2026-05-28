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
 * Tokens (Wave 60.82): theme-aware `bg-background/95` + `border-gold/15` so
 * the bar adapts in light mode on product surfaces. Previously hardcoded
 * `bg-warm-dark-50/95` + `text-cream-{500,100}` — vault [[93i - Light Mode
 * Refactor Wave 60.82 Plan]] migration map. Safe-area-inset-bottom respected
 * so the bar doesn't sit under the iOS home indicator.
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
        'border-t border-gold/15 bg-background/95 backdrop-blur-sm',
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
                // Wave 60.69 (vault 109 §4.6) — analytics on PWA bottom-nav taps.
                // Feature-detect window.posthog so we never crash when PostHog
                // hasn't loaded (consent denied, blocked by ad-blocker, SSR).
                // `data-track-id` doubles as a Sentry breadcrumb hook + manual
                // QA selector.
                data-track-id={item.id}
                onClick={() => {
                  try {
                    const ph = (
                      window as unknown as {
                        posthog?: { capture: (n: string, p?: unknown) => void };
                      }
                    ).posthog;
                    ph?.capture('bottom_nav_tap', { item: item.id });
                  } catch {
                    /* never crash navigation over analytics */
                  }
                }}
                className={cn(
                  'flex h-full flex-col items-center justify-center gap-0.5 px-2 text-xs transition-colors duration-200',
                  active
                    ? 'text-gold'
                    : 'text-muted-foreground/70 hover:text-foreground/90',
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
