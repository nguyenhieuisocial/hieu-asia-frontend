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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

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

export interface VoucherInfo {
  /**
   * "v30" = 30% off (7-day streak milestone), "v50" = 50% off (30-day streak
   * milestone), "vref" = 20% off (referral reward). The endpoint can return any
   * of these, so the UI must label by type, not assume "streak".
   */
  type: 'v30' | 'v50' | 'vref';
  discount_pct: number;
  issued_at: string;
}

/** POST /daily/checkin — idempotent per ICT day. */
export async function checkin(): Promise<{
  streak: StreakView;
  alreadyCheckedIn: boolean;
  /** Non-null only on the exact day a voucher milestone is hit for the first time. */
  voucher_issued: VoucherInfo | null;
} | null> {
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
      voucher_issued?: VoucherInfo | null;
    };
    if (!body?.ok || !body.streak) return null;
    return {
      streak: body.streak,
      alreadyCheckedIn: Boolean(body.alreadyCheckedIn),
      voucher_issued: body.voucher_issued ?? null,
    };
  } catch {
    return null;
  }
}

/** GET /daily/voucher — fetch the user's best unused streak voucher, if any. */
export async function getVoucher(): Promise<VoucherInfo | null> {
  const headers = await authHeader();
  if (!headers) return null;
  try {
    const res = await fetch(`${API_BASE}/daily/voucher`, { headers, cache: 'no-store' });
    if (!res.ok) return null;
    const body = (await res.json()) as { ok?: boolean; voucher?: VoucherInfo | null };
    return body?.ok && body.voucher ? body.voucher : null;
  } catch {
    return null;
  }
}

/**
 * Streak milestones — the free "celebrate the chain" cue. Still NO rewards
 * economy: recognition only (a badge + a congrats line), derived purely on the
 * client from the consecutive-day count. No API or payment change.
 */
export const STREAK_MILESTONES: readonly { days: number; label: string }[] = [
  { days: 7, label: '1 tuần' },
  { days: 30, label: '1 tháng' },
  { days: 100, label: '100 ngày' },
  { days: 365, label: '1 năm' },
];

export interface MilestoneState {
  /** Highest milestone the streak has reached (persistent badge), or null. */
  reached: { days: number; label: string } | null;
  /** True when `current` lands exactly on a milestone (reached it today). */
  justHit: boolean;
  /** Next milestone ahead, or null once past the last one. */
  next: { days: number; label: string } | null;
  /** Days remaining until `next` (0 when there is none). */
  toNext: number;
}

/** Derive milestone state from the current consecutive-day count. Pure. */
export function streakMilestone(current: number): MilestoneState {
  let reached: MilestoneState['reached'] = null;
  let next: MilestoneState['next'] = null;
  for (const m of STREAK_MILESTONES) {
    if (current >= m.days) {
      reached = { days: m.days, label: m.label };
    } else {
      next = { days: m.days, label: m.label };
      break;
    }
  }
  return {
    reached,
    justHit: STREAK_MILESTONES.some((m) => m.days === current),
    next,
    toNext: next ? next.days - current : 0,
  };
}
