/**
 * Haptic helpers — convenience wrappers on top of `telegram-haptic`.
 *
 * Two flavors:
 *   - `haptic(kind)` async — same behavior as `telegram-haptic.haptic`,
 *     waits for the SDK to load.
 *   - `hapticSync(kind)` sync — uses `window.Telegram.WebApp.HapticFeedback`
 *     directly if already present. Safe to call inside React event handlers
 *     without `await`. Returns silently outside Telegram.
 */

import { haptic as hapticAsync } from './telegram-haptic';

export type HapticKind =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'rigid'
  | 'soft'
  | 'success'
  | 'warning'
  | 'error'
  | 'select';

export const haptic = hapticAsync;

interface HapticFeedbackBridge {
  impactOccurred?: (style: string) => void;
  notificationOccurred?: (type: string) => void;
  selectionChanged?: () => void;
}

function getBridge(): HapticFeedbackBridge | null {
  if (typeof window === 'undefined') return null;
  const tg = (window as unknown as {
    Telegram?: { WebApp?: { HapticFeedback?: HapticFeedbackBridge } };
  }).Telegram?.WebApp;
  return tg?.HapticFeedback ?? null;
}

export function hapticSync(kind: HapticKind = 'light'): void {
  const h = getBridge();
  if (!h) return;
  try {
    if (kind === 'success' || kind === 'warning' || kind === 'error') {
      h.notificationOccurred?.(kind);
    } else if (kind === 'select') {
      h.selectionChanged?.();
    } else {
      h.impactOccurred?.(kind);
    }
  } catch {
    /* noop */
  }
}
