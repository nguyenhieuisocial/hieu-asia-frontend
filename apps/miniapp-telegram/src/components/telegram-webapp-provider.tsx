'use client';

/**
 * Telegram WebApp identity bridge.
 *
 * Responsibilities (separate from TelegramThemeBridge, which handles color
 * scheme + JWT exchange):
 *   1. After SDK is ready, write `hieu.user_id = "tg_${telegram_id}"` into
 *      localStorage so the reading flow can attribute records.
 *   2. POST initData to /api/auth/telegram for HMAC verification +
 *      Supabase users upsert.
 *
 * Outside Telegram (dev browser preview), this no-ops silently — getWebApp()
 * returns null when window.Telegram.WebApp is absent.
 */

import * as React from 'react';
import { getWebApp } from '@/lib/telegram-init';

const USER_ID_KEY = 'hieu.user_id';

export function TelegramWebAppProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const webApp = await getWebApp();
      if (cancelled || !webApp) return;

      const user = webApp.initDataUnsafe?.user;
      if (user?.id) {
        try {
          window.localStorage.setItem(USER_ID_KEY, `tg_${user.id}`);
        } catch {
          // localStorage may be blocked (private mode); reading flow falls back.
        }
      }

      const initData = webApp.initData;
      if (!initData) return;

      // HMAC verify + upsert. Fire-and-forget; failure must not block UI.
      void fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      }).catch((e) => {
        console.error('telegram auth verify failed:', e);
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
