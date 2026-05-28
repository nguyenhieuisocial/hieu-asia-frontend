'use client';

/**
 * Wave 60.69 — PWA Add-to-Home-Screen prompt (vault 109 §4.3).
 *
 * Wave 60.95.w PoC (vault [[93i - Light Mode Refactor Wave 60.82 Plan]]):
 * Converted `bg-warm-dark-200/80` → `bg-card/80` and `text-warm-dark-50`
 * → `text-ink` so this card responds to light mode. This is a *scoped* PoC
 * for the /account hub only — sibling product surfaces (/reading, /onboarding,
 * /account/*) get migrated in Wave 60.82 per the plan above. Dark mode
 * shifts the card from warm-brown #221C18 to cooler `hsl(240 10% 9%)`, which
 * is the same cool-dark surface the rest of /account already uses — so this
 * actually *removes* an existing inconsistency (warm-brown panel on a
 * cool-dark page). Cream-on-gold pill text becomes `text-ink` (theme-stable,
 * identical hex in both modes).
 *
 * Renders a small editorial-styled card on `/account` after the user has at
 * least one reading in their feed — soft, contextual ask rather than a
 * page-load interrupt. Listens to the `beforeinstallprompt` event (Chromium
 * Android + Chromium desktop; Safari and Firefox don't fire this so the card
 * stays hidden for them).
 *
 * Lifecycle:
 *   1. `beforeinstallprompt` event fires → we preventDefault() and stash the
 *      `BeforeInstallPromptEvent` for later. The browser's native banner is
 *      suppressed (Chrome policy: must be deferred + manually triggered).
 *   2. Once a session, after a short delay so the user has settled, render
 *      our own card.
 *   3. User taps "Cài đặt" → call `deferredPrompt.prompt()` then await
 *      `userChoice`. Capture outcome to PostHog.
 *   4. User taps "Bỏ qua" → mark `pwa.shown` so we never ask again from this
 *      device, capture `dismissed` outcome.
 *   5. Standalone mode detected (`display-mode: standalone`) → return null
 *      (already installed, nothing to ask for).
 *
 * Privacy: localStorage flag scoped to this device only — no server round-trip.
 *
 * Safety: every browser API call is gated by `typeof window !== 'undefined'`
 * and try/catch so this component never crashes the page (the account feed
 * is critical UX and must always render).
 */

import * as React from 'react';
import { Download, X } from 'lucide-react';
import { cn } from '@hieu-asia/ui';

const LS_KEY = 'pwa.shown';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
    if ((navigator as Navigator & { standalone?: boolean }).standalone === true) return true;
  } catch {
    /* ignore */
  }
  return false;
}

function alreadyShown(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(LS_KEY) === '1';
  } catch {
    // localStorage may be blocked (privacy mode); treat as "shown" to be quiet.
    return true;
  }
}

function markShown(): void {
  try {
    window.localStorage.setItem(LS_KEY, '1');
  } catch {
    /* ignore */
  }
}

function capture(outcome: 'accepted' | 'dismissed'): void {
  try {
    const ph = (window as unknown as { posthog?: { capture: (n: string, p?: unknown) => void } })
      .posthog;
    ph?.capture('pwa_install_prompt', { outcome });
  } catch {
    /* ignore — never crash the page over analytics */
  }
}

export function PwaInstallPrompt() {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(null);
  // `visible` starts false to avoid hydration mismatch + flash.
  const [visible, setVisible] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    if (isStandalone()) return; // Already installed.
    if (alreadyShown()) return; // User answered before.

    const onBeforeInstall = (e: Event) => {
      // Chrome will show its own mini-infobar unless we preventDefault.
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const onInstall = React.useCallback(async () => {
    if (!deferred || pending) return;
    setPending(true);
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      capture(choice.outcome);
    } catch {
      // User-agent may reject the prompt() call (already used, gesture timing).
      // Treat as dismissed so we don't loop.
      capture('dismissed');
    } finally {
      markShown();
      setDeferred(null);
      setVisible(false);
      setPending(false);
    }
  }, [deferred, pending]);

  const onDismiss = React.useCallback(() => {
    markShown();
    capture('dismissed');
    setDeferred(null);
    setVisible(false);
  }, []);

  if (!visible || !deferred) return null;

  return (
    <div
      role="region"
      aria-label="Cài đặt hieu.asia"
      className={cn(
        'rounded-xl border border-gold/30 bg-card/80 p-4 backdrop-blur-sm',
        'sm:flex sm:items-center sm:justify-between sm:gap-4',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
          <Download className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-foreground">
            Cài hieu.asia lên màn hình chính
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Mở nhanh hơn, không cần nhập URL. Hoạt động ngoại tuyến cho lá số đã lưu.
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 sm:mt-0 sm:shrink-0">
        <button
          type="button"
          onClick={onInstall}
          disabled={pending}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-pill bg-gold px-4 py-2 text-xs font-semibold text-ink',
            'transition-colors duration-200 hover:bg-gold-soft disabled:opacity-50',
          )}
        >
          {pending ? 'Đang xử lý…' : 'Cài đặt'}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex items-center gap-1 rounded-md px-2 py-2 text-xs text-muted-foreground hover:text-foreground"
          aria-label="Bỏ qua"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Bỏ qua
        </button>
      </div>
    </div>
  );
}
