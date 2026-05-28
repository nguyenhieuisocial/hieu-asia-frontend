'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * Wave 60.95.aj — route-aware forcedTheme.
 *
 * Vault 108 brand-locks the marketing surfaces to "Warm-Dark Editorial"
 * (founder decision 2026-05-26). Wave 60.82.B unhid the ThemeToggle on
 * product routes (/account, /reading, /onboarding, /dashboard, /journal,
 * /decisions). Problem: if a user toggles to light on product, the
 * `theme=light` value persists in localStorage and applies even when
 * navigating back to marketing — which renders dark text on hardcoded
 * `bg-warm-dark-*` = invisible (founder report 2026-05-28).
 *
 * Fix: pass `forcedTheme="dark"` to next-themes when the current pathname
 * is a marketing route. next-themes honours forcedTheme by ignoring
 * stored user preference + system preference, so marketing always renders
 * with the dark CSS variables regardless of what the user picked elsewhere.
 *
 * Product routes get a normal toggle experience (no forcedTheme passed) so
 * the persisted user preference applies as usual.
 *
 * When Wave 60.83 ships full-site light-mode migration (per Option 2),
 * this forcedTheme override can be removed.
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
  return PRODUCT_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname();
  const forced = isProductRoute(pathname) ? undefined : 'dark';
  return (
    <NextThemesProvider {...props} forcedTheme={forced}>
      {children}
    </NextThemesProvider>
  );
}
