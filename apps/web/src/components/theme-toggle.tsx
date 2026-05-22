'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

/**
 * Theme toggle — wired to next-themes (`attribute="class"` in layout).
 *
 * NOTE: Light mode is currently INCOMPLETE. globals.css defines `:root` light
 * tokens, but ~2,300 occurrences of `bg-ink` / `text-cream` are hardcoded
 * across 182 pages and components; every page wraps content in
 * `<main className="bg-ink text-cream">`, which overrides the body-level
 * CSS-variable swap. The toggle does flip next-themes's `class` on <html>,
 * but the visible UI stays dark.
 *
 * Until a Wave 14+ pass migrates components to use semantic Tailwind
 * (`bg-background`, `text-foreground`), keep the toggle hidden in
 * production. Set `NEXT_PUBLIC_THEME_TOGGLE=1` to render it for QA.
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
    >
      {current === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
