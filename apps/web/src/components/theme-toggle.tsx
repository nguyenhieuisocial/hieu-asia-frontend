'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

/**
 * Theme toggle — wired to next-themes (`attribute="class"` in layout).
 *
 * Wave 60.79.T1: feature-gated to NULL render. Wave 60.66 locked Option D
 * "Warm-Dark Editorial" as the brand identity (vault 108) — the entire
 * marketing surface uses hardcoded `bg-warm-dark-*` / `text-cream-*` tokens
 * with no light variants. Vault 112 P0-01 confirmed light mode produces a
 * broken visual sandwich (cream nav + dark hero + cream content bands).
 *
 * Restore when warm-dark light variants ship Wave 60.82+. To force-render
 * for QA inside the meantime, set `NEXT_PUBLIC_THEME_TOGGLE=1`.
 *
 * NOTE: Light mode is currently INCOMPLETE. globals.css defines `:root` light
 * tokens, but ~2,300 occurrences of `bg-ink` / `text-cream` are hardcoded
 * across 182 pages and components; every page wraps content in
 * `<main className="bg-ink text-cream">`, which overrides the body-level
 * CSS-variable swap. The toggle does flip next-themes's `class` on <html>,
 * but the visible UI stays dark.
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // Wave 60.79.T1 — light mode feature-gated. Render nothing unless QA
  // explicitly enables the env flag.
  if (process.env.NEXT_PUBLIC_THEME_TOGGLE !== '1') {
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
    >
      {current === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
