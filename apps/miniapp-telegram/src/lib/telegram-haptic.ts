/**
 * Tiny wrapper around Telegram HapticFeedback so callers don't need to
 * import the SDK directly or check for environment.
 */

import { getWebApp } from './telegram-init';

type Impact = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';

export async function haptic(kind: Impact | 'success' | 'warning' | 'error' | 'select' = 'light') {
  const webApp = await getWebApp();
  const h = webApp?.HapticFeedback;
  if (!h) return;
  try {
    if (kind === 'success' || kind === 'warning' || kind === 'error') {
      h.notificationOccurred(kind);
    } else if (kind === 'select') {
      h.selectionChanged();
    } else {
      h.impactOccurred(kind);
    }
  } catch {
    /* noop */
  }
}
