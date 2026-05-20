'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { getWebApp } from '@/lib/telegram-init';
import { exchangeInitDataForJwt } from '@/lib/telegram-auth';

/**
 * Sync theme với Telegram WebApp.colorScheme + exchange initData → JWT.
 *
 * Runs once on first mount. Outside Telegram, all calls no-op.
 */
export function TelegramThemeBridge() {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const webApp = await getWebApp();
      if (cancelled || !webApp) return;

      const applyScheme = () => {
        if (webApp.colorScheme === 'dark' || webApp.colorScheme === 'light') {
          setTheme(webApp.colorScheme);
        }
      };
      applyScheme();
      webApp.onEvent('themeChanged', applyScheme);

      // Best-effort: get a JWT from initData. Mock-mode if backend unset.
      void exchangeInitDataForJwt();
    })();

    return () => {
      cancelled = true;
    };
  }, [setTheme]);

  return null;
}
