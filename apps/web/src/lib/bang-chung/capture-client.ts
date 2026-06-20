/**
 * Fire-and-forget client that posts anonymous calibration rows to the
 * `backtest-capture` Edge Function. It NEVER throws and NEVER blocks the UI —
 * capture must never degrade the experience. The anon id travels in a dedicated
 * `x-bc-anon` header (never the persisted body); the body is only `{ rows }`,
 * and each row is a CalibrationTuple (no PII — see calibration.ts).
 *
 * Tier-A consent is implicit-with-notice (the payload is genuinely non-personal),
 * but a one-click opt-out is honoured here.
 */

import { getEdgeFnBase, getOrCreateAnonUserId } from '@hieu-asia/supabase';
import type { CalibrationTuple } from '@/lib/backtest/calibration';

const OPT_OUT_KEY = 'hieu:bc:capture-optout';

export function isCaptureOptedOut(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
}

export function setCaptureOptedOut(optedOut: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(OPT_OUT_KEY, optedOut ? '1' : '0');
  } catch {
    /* ignore storage failures */
  }
}

/**
 * Persist anonymous calibration rows. Swallows every error; returns nothing.
 * No-op when opted out, server-side, or unconfigured.
 */
export function captureCalibration(rows: CalibrationTuple[]): void {
  if (typeof window === 'undefined') return;
  if (!rows.length || isCaptureOptedOut()) return;

  let base: string;
  let anonKey: string;
  let anonId: string;
  try {
    base = getEdgeFnBase();
    anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();
    anonId = getOrCreateAnonUserId();
  } catch {
    return;
  }
  if (!base || !anonKey || !anonId) return;

  void fetch(`${base}/backtest-capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'x-bc-anon': anonId,
    },
    body: JSON.stringify({ rows }),
    keepalive: true, // let it finish even if the user navigates away
  }).catch(() => {
    /* fire-and-forget — capture must never surface to the user */
  });
}
