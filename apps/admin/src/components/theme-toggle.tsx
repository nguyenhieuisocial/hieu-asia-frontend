'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const current = mounted ? (resolvedTheme ?? theme) : 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  return (
    <Button variant="ghost" size="sm" onClick={() => setTheme(next)} aria-label="Toggle theme">
      {current === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
