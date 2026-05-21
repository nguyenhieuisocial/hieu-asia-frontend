'use client';

import * as React from 'react';
import { getWebApp } from '@/lib/telegram-init';

/**
 * Disable Telegram's vertical-swipe-to-close on the current page.
 *
 * iOS Telegram lets users drag-down to close the mini app. On scroll-heavy
 * pages (reading report, mentor chat) that gesture conflicts with content
 * scroll. Mount this component inside such pages to disable the gesture
 * while mounted, and restore it on unmount.
 *
 * Outside Telegram and on Telegram clients without the API, no-op.
 */
export function SwipeBackHandler() {
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const webApp = await getWebApp();
      if (cancelled || !webApp) return;
      // disableVerticalSwipes added in Telegram Bot API 7.7 (Sept 2024).
      try {
        webApp.disableVerticalSwipes?.();
      } catch {
        /* older clients: noop */
      }
    })();

    return () => {
      cancelled = true;
      void getWebApp().then((webApp) => {
        try {
          webApp?.enableVerticalSwipes?.();
        } catch {
          /* noop */
        }
      });
    };
  }, []);

  return null;
}
