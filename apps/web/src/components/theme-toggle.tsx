'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

/**
 * Theme toggle — wired to next-themes (`attribute="class"` in layout).
 *
 * Wave 62.05c — re-introduced `usePathname()` guard to hide toggle on
 * Wave 62.05b force-dark routes. ThemeProvider now passes
 * `forcedTheme="dark"` on /reading + /dashboard + /tu-vi-* +
 * /dai-van-hien-tai + /mentor; calling setTheme on those routes was a
 * silent no-op (next-themes ignores setTheme when forcedTheme is set),
 * producing a UX papercut where the toggle appeared interactive but did
 * nothing. Now toggle renders null on those routes — visual honesty.
 *
 * History:
 *  - Wave 60.79.T1: env-gated to NULL render (vault 112 P0-01).
 *  - Wave 60.82.B: unhid on product routes only via PRODUCT_ROUTE_PREFIXES.
 *  - Wave 60.95.aj: forcedTheme="dark" on marketing as hotfix.
 *  - Wave 60.83.4: removed allowlist; toggle site-wide.
 *  - Wave 62.05b: Day "Giấy thấm" default + force-dark on 9 experience
 *    routes (Night "Khoảng lặng").
 *  - Wave 62.05c (this commit): hide toggle on those 9 force-dark routes
 *    to prevent silent no-op clicks.
 */

const FORCED_DARK_PREFIXES = [
  '/reading',
  '/dashboard',
  '/tu-vi-2026',
  '/tu-vi-hom-nay',
  '/tu-vi-nghe-nghiep',
  '/tu-vi-tai-chinh',
  '/tu-vi-tinh-yeu',
  '/dai-van-hien-tai',
  '/mentor',
];

export function ThemeToggle() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // Hide on force-dark routes (Wave 62.05c). ThemeProvider's forcedTheme
  // prop makes setTheme a no-op here — the button would be visually
  // active but functionally dead.
  if (
    pathname != null &&
    FORCED_DARK_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
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
      // Wave 60.97.1 — 44×44 tap target.
      className="relative min-h-11 min-w-11 touch-manipulation"
    >
      {current === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
