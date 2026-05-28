'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

/**
 * Theme toggle — wired to next-themes (`attribute="class"` in layout).
 *
 * Wave 60.83.4: light/dark works site-wide (founder Option 2). All marketing
 * + product + audience routes use theme-aware tokens after Wave 60.83.1-.3
 * token migration. Toggle renders unconditionally in `SiteNav` chrome and
 * persists user choice via next-themes localStorage.
 *
 * History:
 *  - Wave 60.79.T1: env-gated to NULL render (vault 112 P0-01 visual sandwich
 *    regression — marketing components were hardcoded dark, light flip broke
 *    them).
 *  - Wave 60.82.B: unhid on product routes only via PRODUCT_ROUTE_PREFIXES
 *    allowlist + `isProductRoute` check.
 *  - Wave 60.95.aj: ThemeProvider passed `forcedTheme="dark"` on marketing
 *    routes as a hotfix when user toggle on product caused localStorage
 *    `theme=light` to bleed onto marketing pages (dark text on hardcoded
 *    dark bg = invisible).
 *  - Wave 60.83.4 (this commit): removed the route allowlist; toggle is
 *    site-wide. Forcedtheme override in ThemeProvider also reverted in the
 *    same wave. Vault 108 dark-as-default still applies (defaultTheme="dark"
 *    + enableSystem={false}) — light mode is opt-in via this toggle.
 *
 * QA kill-switch: if a regression appears, re-add the `PRODUCT_ROUTE_PREFIXES`
 * + `usePathname()` gate from Wave 60.82.B (git history `b1dc28b`).
 */

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const current = mounted ? (resolvedTheme ?? theme) : 'dark';
  const next = current === 'dark' ? 'light' : 'dark';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(next)}
      aria-label={`Chuyển sang chế độ ${next === 'dark' ? 'tối' : 'sáng'}`}
      // Wave 60.97.1 — bump hit area to 44×44 (WCAG 2.5.5 + Apple HIG). The
      // `size="sm"` variant ships at 36×36, below the mobile tap-target
      // minimum. `min-h-11 min-w-11` enlarges the hit area without changing
      // the visible icon size. `touch-manipulation` blocks double-tap-zoom
      // delay on iOS so the toggle feels native.
      className="relative min-h-11 min-w-11 touch-manipulation"
    >
      {current === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
