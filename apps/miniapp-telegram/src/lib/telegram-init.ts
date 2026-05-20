/**
 * Telegram WebApp init helpers.
 *
 * Use the dynamic import wrapper because @twa-dev/sdk touches `window.Telegram`
 * synchronously at module load — SSR would crash. All helpers here are safe
 * to call from client code; outside Telegram they no-op.
 */

import type WebApp from '@twa-dev/sdk';

type WebAppType = typeof WebApp;

let cached: WebAppType | null = null;
let pending: Promise<WebAppType | null> | null = null;

export async function getWebApp(): Promise<WebAppType | null> {
  if (typeof window === 'undefined') return null;
  if (cached) return cached;
  if (pending) return pending;

  pending = (async () => {
    try {
      const mod = await import('@twa-dev/sdk');
      cached = mod.default;
      // ready() tells Telegram the loading is done.
      cached.ready();
      cached.expand();
      return cached;
    } catch {
      return null;
    } finally {
      pending = null;
    }
  })();
  return pending;
}

export function isTelegramEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  // The Telegram SDK loader sets window.Telegram.WebApp.
  return Boolean((window as unknown as { Telegram?: { WebApp?: unknown } }).Telegram?.WebApp);
}
