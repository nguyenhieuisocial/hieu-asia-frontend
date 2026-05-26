'use client';

/**
 * Cloudflare Turnstile widget — invisible/managed captcha for /signin.
 *
 * Wave 60.60.d — wires the existing CF Turnstile site (created Wave 60.57.f)
 * to the magic-link + OAuth signin flows. Token returned by the widget is
 * passed to `supabase.auth.signInWithOtp({ options: { captchaToken } })`,
 * which then forwards it to Cloudflare's `/siteverify` endpoint (Supabase
 * holds the secret server-side). Once Supabase verifies the token, the OTP
 * is sent; otherwise the request is rejected with `captcha_failed`.
 *
 * Lifecycle:
 *   1. Mount → inject `<script src="…turnstile/v0/api.js">` once.
 *   2. Script load → `window.turnstile.render(div, { sitekey, callback })`.
 *   3. User passes challenge → `callback(token)` → bubble up via `onVerify`.
 *   4. Unmount → `window.turnstile.remove(widgetId)` to free DOM + state.
 *
 * Security:
 *   - Sitekey is PUBLIC (intentionally inlined as fallback). Secret stays
 *     server-side, configured in Supabase Auth → Bot Detection.
 *   - Token is single-use, ~5min TTL. Reset state after every submit attempt.
 */

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        selector: string | HTMLElement,
        options: TurnstileOptions,
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
    __turnstileOnLoad?: () => void;
  }
}

type TurnstileOptions = {
  sitekey: string;
  callback: (token: string) => void;
  'error-callback'?: (errorCode: string) => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
};

export type TurnstileWidgetProps = {
  /** Called with the Turnstile token when challenge passes. */
  onVerify: (token: string) => void;
  /** Called with Cloudflare error code (e.g. "300010") when challenge fails. */
  onError?: (errorCode: string) => void;
  /** Called when token expires (~5min after issue). Parent should clear state. */
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  className?: string;
};

const SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '0x4AAAAAADWihCrZrhVk19I-';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__turnstileOnLoad';

export function TurnstileWidget({
  onVerify,
  onError,
  onExpire,
  theme = 'dark',
  size = 'normal',
  className,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!SITEKEY) return;
    if (typeof window === 'undefined') return;

    const render = () => {
      if (!containerRef.current || !window.turnstile) return;
      // Guard against double-render (StrictMode dev re-runs).
      if (widgetIdRef.current) return;
      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITEKEY,
          callback: onVerify,
          'error-callback': onError,
          'expired-callback': onExpire,
          theme,
          size,
        });
      } catch {
        /* swallow — render failure is non-fatal, parent shows error state */
      }
    };

    // If script already loaded (navigation between pages), render now.
    if (window.turnstile) {
      render();
      return () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            /* ignore */
          }
          widgetIdRef.current = null;
        }
      };
    }

    // First mount: inject script + register onload callback.
    const existing = document.querySelector(`script[src^="${SCRIPT_SRC.split('?')[0]}"]`);
    if (!existing) {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    window.__turnstileOnLoad = render;

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
    };
    // Intentionally exclude callbacks from deps — Turnstile holds the original
    // refs internally and we don't want to remount the widget on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className={className} />;
}
