/**
 * Daily check-in / streak client.
 *
 * Talks directly to the worker's JWT-gated `/daily/streak` (read) and
 * `/daily/checkin` (record) endpoints, attaching the Supabase access token as
 * `Authorization: Bearer …` — same pattern as `affiliate-onboard.ts` and
 * `user-preferences.ts`. CORS on the worker allows `*.hieu.asia`.
 *
 * Every call resolves to `null` when the user isn't signed in or the endpoint
 * is unavailable, so the UI can degrade gracefully (the card simply hides)
 * rather than throwing — e.g. in the window before the backend deploy lands.
 */

import { getSupabaseAuth } from './auth-client';

const API_BASE = process.env.NEXT_PUBLIC_HIEU_API_URL ?? 'https://api.hieu.asia';

export interface StreakView {
  /** Effective current streak — 0 once the run is broken. */
  current: number;
  best: number;
  total: number;
  /** ICT "YYYY-MM-DD" of the last check-in, or "" if never. */
  last_checkin: string;
  checkedInToday: boolean;
}

async function authHeader(): Promise<Record<string, string> | null> {
  const sb = getSupabaseAuth();
  if (!sb) return null;
  try {
    const { data } = await sb.auth.getSession();
    const token = data.session?.access_token;
    return token ? { authorization: `Bearer ${token}` } : null;
  } catch {
    return null;
  }
}

/** GET /daily/streak — current streak for display. */
export async function getStreak(): Promise<StreakView | null> {
  const headers = await authHeader();
  if (!headers) return null;
  try {
    const res = await fetch(`${API_BASE}/daily/streak`, { headers, cache: 'no-store' });
    if (!res.ok) return null;
    const body = (await res.json()) as { ok?: boolean; streak?: StreakView };
    return body?.ok && body.streak ? body.streak : null;
  } catch {
    return null;
  }
}

/** POST /daily/checkin — idempotent per ICT day. */
export async function checkin(): Promise<{ streak: StreakView; alreadyCheckedIn: boolean } | null> {
  const headers = await authHeader();
  if (!headers) return null;
  try {
    const res = await fetch(`${API_BASE}/daily/checkin`, {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: '{}',
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      ok?: boolean;
      streak?: StreakView;
      alreadyCheckedIn?: boolean;
    };
    if (!body?.ok || !body.streak) return null;
    return { streak: body.streak, alreadyCheckedIn: Boolean(body.alreadyCheckedIn) };
  } catch {
    return null;
  }
}
