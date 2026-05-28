'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

/**
 * Admin theme toggle — Wave 60.82.B beta-badge parity with the web
 * counterpart (`apps/web/src/components/theme-toggle.tsx`). Admin app
 * always renders the toggle (no route-aware short-circuit needed) because
 * the entire admin surface is in scope per vault 93i §2.
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
      aria-label="Toggle theme"
      className="relative"
    >
      {current === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span
        aria-hidden="true"
        className="absolute -right-0.5 -top-0.5 inline-flex h-1.5 w-1.5 rounded-full bg-gold"
        title="Beta"
      />
    </Button>
  );
}
