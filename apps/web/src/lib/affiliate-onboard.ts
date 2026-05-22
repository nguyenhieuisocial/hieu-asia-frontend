/**
 * First-touch affiliate attribution wiring.
 *
 * Middleware (`apps/web/src/middleware.ts`) writes the `hieu_ref` cookie on
 * `/r/<CODE>` or `?ref=<CODE>` landings. This module reads that cookie at
 * auth-callback time and POSTs to the worker's `/aff/onboard` so the L1
 * parent row lands in `hieu_asia.affiliate_network`.
 *
 * Idempotency: worker-side `onboardAffiliate` returns the existing row when
 * one is present, and a localStorage flag (`hieu:ref:onboarded:<code>`) stops
 * us from hammering the endpoint on every callback round-trip. Errors are
 * swallowed — attribution must never block signup.
 */

import { readAffiliateRef } from './affiliate-ref';
import { getSupabaseAuth } from './auth-client';

const API_BASE = process.env.NEXT_PUBLIC_HIEU_API_URL ?? 'https://api.hieu.asia';
const ONBOARDED_KEY_PREFIX = 'hieu:ref:onboarded:';

export async function onboardAffiliateFromRef(): Promise<void> {
  const code = readAffiliateRef();
  if (!code) return;

  const flagKey = `${ONBOARDED_KEY_PREFIX}${code}`;
  try {
    if (window.localStorage.getItem(flagKey)) return;
  } catch {
    /* localStorage blocked — fall through; worker is idempotent */
  }

  const supabase = getSupabaseAuth();
  if (!supabase) return;

  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;

    const res = await fetch(`${API_BASE}/aff/onboard`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ parentCode: code }),
      keepalive: true,
    });

    // 2xx → wired. 4xx → bad cookie (parent not found / self-refer / depth
    // cap); no point retrying. Either way, set the flag so we stop calling.
    // 5xx → leave flag unset so the next callback retries.
    if (res.ok || (res.status >= 400 && res.status < 500)) {
      try {
        window.localStorage.setItem(flagKey, '1');
      } catch {
        /* localStorage blocked */
      }
    }
  } catch {
    /* network error — retry on next callback */
  }
}
