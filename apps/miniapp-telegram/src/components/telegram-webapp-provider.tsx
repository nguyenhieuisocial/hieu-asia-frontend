'use client';

/**
 * Telegram WebApp identity bridge.
 *
 * Responsibilities (separate from TelegramThemeBridge, which handles color
 * scheme + JWT exchange):
 *   1. POST the RAW `initData` string to /api/auth/telegram, which verifies the
 *      HMAC against the bot token server-side and upserts the Supabase user.
 *   2. Only AFTER the server confirms the HMAC, write
 *      `hieu.user_id = "tg_${telegram_id}"` (using the SERVER's verified id,
 *      not client `initDataUnsafe`) so the reading flow attributes records to a
 *      server-verified identity.
 *
 * Security: `initDataUnsafe.user` is client-supplied and spoofable, so it is
 * never written to localStorage. The identity that the reading/consent/dashboard
 * flows trust (`hieu.user_id`) is derived solely from the server's HMAC check.
 *
 * Outside Telegram (dev browser preview), this no-ops silently — getWebApp()
 * returns null when window.Telegram.WebApp is absent, leaving the anon-id
 * fallback (getOrCreateAnonUserId) intact. If verification fails, we also leave
 * the existing id untouched rather than trusting an unverified one.
 */

import * as React from 'react';
import { getWebApp } from '@/lib/telegram-init';

const USER_ID_KEY = 'hieu.user_id';

interface AuthVerifyResponse {
  ok?: boolean;
  user_id?: string;
}

export function TelegramWebAppProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const webApp = await getWebApp();
      if (cancelled || !webApp) return;

      const initData = webApp.initData;
      // No raw initData → can't be server-verified. Do NOT fall back to the
      // spoofable initDataUnsafe id; leave the anon-id fallback in place.
      if (!initData) return;

      try {
        const res = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        });
        if (cancelled) return;
        if (!res.ok) {
          // Tampered/forged/stale initData → server rejected it. Trust nothing.
          console.error('telegram auth verify rejected:', res.status);
          return;
        }
        const data = (await res.json()) as AuthVerifyResponse;
        if (cancelled) return;
        // Source of truth = SERVER's HMAC-verified id, never client initDataUnsafe.
        if (data.ok && typeof data.user_id === 'string') {
          try {
            window.localStorage.setItem(USER_ID_KEY, data.user_id);
          } catch {
            // localStorage may be blocked (private mode); reading flow falls back.
          }
        }
      } catch (e) {
        console.error('telegram auth verify failed:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
