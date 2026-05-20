'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

/**
 * Sync theme với Telegram WebApp.colorScheme.
 *
 * When running inside Telegram WebView, `window.Telegram.WebApp.colorScheme`
 * is "light" | "dark" based on user's Telegram theme. We mirror it into
 * next-themes so all components react.
 *
 * Outside Telegram (e.g. dev preview in browser), this is a no-op.
 */
export function TelegramThemeBridge() {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    let cancelled = false;

    const apply = async () => {
      try {
        // Dynamic import — @twa-dev/sdk reads `window.Telegram` only on client.
        const mod = await import('@twa-dev/sdk');
        const WebApp = mod.default;
        if (cancelled) return;

        WebApp.ready();
        WebApp.expand();
        if (WebApp.colorScheme === 'dark' || WebApp.colorScheme === 'light') {
          setTheme(WebApp.colorScheme);
        }

        WebApp.onEvent('themeChanged', () => {
          if (cancelled) return;
          if (WebApp.colorScheme === 'dark' || WebApp.colorScheme === 'light') {
            setTheme(WebApp.colorScheme);
          }
        });
      } catch {
        // Not inside Telegram — ignore.
      }
    };

    void apply();
    return () => {
      cancelled = true;
    };
  }, [setTheme]);

  return null;
}
