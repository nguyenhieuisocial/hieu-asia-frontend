/**
 * Telegram WebApp init helpers.
 *
 * Use the dynamic import wrapper because @twa-dev/sdk touches `window.Telegram`
 * synchronously at module load — SSR would crash. All helpers here are safe
 * to call from client code; outside Telegram they no-op.
 *
 * `getWebApp()` is idempotent: it runs ready/expand/setup once on first call
 * and caches the SDK instance. Subsequent calls return the cache.
 */

import type WebApp from '@twa-dev/sdk';

type WebAppType = typeof WebApp;

const HEADER_COLOR = '#0F0F12';
const BG_COLOR = '#0F0F12';

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
      // Tell Telegram we're done loading (hides loading dots).
      cached.ready();
      // Expand to full viewport height (avoid the half-sheet).
      cached.expand();
      // Prompt before close (user pulls down or taps × in chat).
      try {
        cached.enableClosingConfirmation();
      } catch {
        /* older clients: noop */
      }
      // Match our brand chrome.
      try {
        cached.setHeaderColor(HEADER_COLOR);
        cached.setBackgroundColor(BG_COLOR);
      } catch {
        /* older clients may not support both */
      }
      // Tag color scheme for non-next-themes CSS consumers.
      if (cached.colorScheme === 'dark' || cached.colorScheme === 'light') {
        document.documentElement.dataset.tgColorScheme = cached.colorScheme;
      }
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
