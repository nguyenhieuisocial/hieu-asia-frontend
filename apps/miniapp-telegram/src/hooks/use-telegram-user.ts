'use client';

import { useEffect, useState } from 'react';
import { getTelegramUser, type TelegramUser } from '@/lib/telegram-auth';

/**
 * Read the current Telegram user from `WebApp.initDataUnsafe`.
 *
 * Returns `null` while loading and outside Telegram (dev browser preview).
 * Server snapshot: `null` (component must render gracefully without user).
 *
 * For server-trustable identity, the JWT exchanged via `TelegramThemeBridge`
 * → `/v1/auth/telegram` is what backend APIs must rely on.
 */
export function useTelegramUser(): TelegramUser | null {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getTelegramUser().then((u) => {
      if (!cancelled) setUser(u);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return user;
}
