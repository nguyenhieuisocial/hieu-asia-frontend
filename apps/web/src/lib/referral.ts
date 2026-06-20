/**
 * Referral ("Mời bạn") client.
 *
 * Talks directly to the worker's JWT-gated `/referral/me` and `/referral/claim`
 * endpoints, attaching the Supabase access token as `Authorization: Bearer …`
 * — same pattern as `daily-checkin.ts`. Resolves to `null` when the user isn't
 * signed in or the endpoint is unavailable, so the UI degrades gracefully.
 */

import { getSupabaseAuth } from './auth-client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

export interface ReferralVoucher {
  type: 'v30' | 'v50' | 'vref';
  discount_pct: 20 | 30 | 50;
  issued_at: string;
}

export interface ReferralInfo {
  code: string;
  invite_url: string;
  invited_count: number;
  voucher: ReferralVoucher | null;
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

/** GET /referral/me — the signed-in user's invite code + stats. */
export async function getReferral(): Promise<ReferralInfo | null> {
  const headers = await authHeader();
  if (!headers) return null;
  try {
    const res = await fetch(`${API_BASE}/referral/me`, { headers, cache: 'no-store' });
    if (!res.ok) return null;
    const body = (await res.json()) as { ok?: boolean } & Partial<ReferralInfo>;
    if (!body?.ok || !body.code || !body.invite_url) return null;
    return {
      code: body.code,
      invite_url: body.invite_url,
      invited_count: body.invited_count ?? 0,
      voucher: body.voucher ?? null,
    };
  } catch {
    return null;
  }
}

export interface ClaimResult {
  granted: boolean;
  already: boolean;
  reason?: string;
  voucher: ReferralVoucher | null;
}

/** POST /referral/claim — claim a referral by code. Idempotent server-side. */
export async function claimReferral(refCode: string): Promise<ClaimResult | null> {
  const headers = await authHeader();
  if (!headers) return null;
  try {
    const res = await fetch(`${API_BASE}/referral/claim`, {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({ ref_code: refCode }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      ok?: boolean;
      granted?: boolean;
      already?: boolean;
      reason?: string;
      voucher?: ReferralVoucher | null;
    };
    if (!body?.ok) return null;
    return {
      granted: Boolean(body.granted),
      already: Boolean(body.already),
      reason: body.reason,
      voucher: body.voucher ?? null,
    };
  } catch {
    return null;
  }
}
