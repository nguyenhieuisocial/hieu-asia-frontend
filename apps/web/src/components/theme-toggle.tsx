'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

/**
 * Theme toggle — wired to next-themes (`attribute="class"` in layout).
 *
 * 2026-06-23 — gỡ guard ẩn-nút theo route. Trước đây nút bị `return null` trên
 * '/' (force-light cũ) + 9 route force-dark ("Khoảng lặng"). Nhưng ThemeProvider
 * (2026-06-22) đã BỎ mọi forcedTheme — không route nào bị ép nữa, mọi trang đều
 * theme-token-aware → nút phải hiện KHẮP NƠI để người dùng tự đổi sáng/tối.
 * Chỉ còn chặn trước khi mount (tránh đoán sai icon khi chưa biết theme).
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
      // 44×44 tap target.
      className="relative min-h-11 min-w-11 touch-manipulation"
    >
      {current === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
