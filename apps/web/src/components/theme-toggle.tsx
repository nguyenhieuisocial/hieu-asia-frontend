'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

/**
 * Theme toggle — wired to next-themes (`attribute="class"` in layout).
 *
 * Wave 60.82.B: live for the first time on product surfaces (`/account`,
 * `/reading`, `/onboarding` and admin app). Light mode is opt-in via this
 * toggle — `enableSystem={false}` stays in root layout so OS-level
 * `prefers-color-scheme: light` does NOT auto-flip marketing pages.
 *
 * Marketing surfaces stay dark-locked per vault 108 (Warm-Dark Editorial
 * brand identity, founder-locked 2026-05-26). This component short-circuits
 * to null on marketing routes so even though `SiteNav` mounts it everywhere,
 * the toggle only renders inside product/admin chrome.
 *
 * Wave 60.82.A migrated the remaining product-chrome tokens (BottomNavBar
 * + Fab). Wave 60.95.w PoC migrated `/account` hub + `PwaInstallPrompt`.
 * Earlier Wave 60.58-60.69 refactors brought the bulk of product UI to
 * semantic tokens already.
 *
 * History:
 *  - Wave 60.79.T1: env-gated to NULL render (vault 112 P0-01 visual
 *    sandwich regression). Gate removed in 60.82.B now that product
 *    surfaces are theme-aware.
 *
 * QA kill-switch: if a regression is found post-launch, re-enable the
 * env-gate by uncommenting the early-return in this file, OR set the
 * `NEXT_PUBLIC_THEME_TOGGLE=0` env var on Vercel and add a check here.
 * (Currently the toggle is unconditionally live on product routes.)
 */

/**
 * Route prefixes where the theme toggle renders. Must match the product
 * scope from `AppShell.tsx` (kept in sync manually — this list is short
 * enough that a shared constant adds more indirection than it saves).
 * Marketing routes (/, /pricing, /sample-report, …) are intentionally
 * excluded per vault 108 brand lock.
 */
const PRODUCT_ROUTE_PREFIXES = [
  '/account',
  '/reading',
  '/onboarding',
  '/dashboard',
  '/journal',
  '/decisions',
];

function isProductRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return PRODUCT_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // Marketing surfaces are dark-locked per vault 108. SiteNav is shared
  // between marketing and product so the toggle must self-gate here.
  if (!isProductRoute(pathname)) {
    return null;
  }

  const current = mounted ? (resolvedTheme ?? theme) : 'dark';
  const next = current === 'dark' ? 'light' : 'dark';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(next)}
      aria-label={`Chuyển sang chế độ ${next === 'dark' ? 'tối' : 'sáng'}`}
      className="relative"
    >
      {current === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {/* Wave 60.82.B — Beta badge to signal opt-in status. Dot, not pill,
          to keep header chrome lightweight. */}
      <span
        aria-hidden="true"
        className="absolute -right-0.5 -top-0.5 inline-flex h-1.5 w-1.5 rounded-full bg-gold"
        title="Beta"
      />
    </Button>
  );
}
