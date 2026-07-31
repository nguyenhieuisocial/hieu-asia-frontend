/**
 * GET /api/user/me — returns the calling user's profile + membership tier.
 *
 * Real wiring (replaces the Phase-1 hardcoded 'free' stub that made every
 * paying user show as Free):
 *   - The browser auth session in this app lives in localStorage
 *     (`hieu.auth.session`), NOT in a server-readable cookie — see
 *     `lib/auth-client.ts`. So, exactly like the other authed API routes
 *     (`/api/reading/list`, `/api/account/export`), the caller passes its
 *     Supabase access token as `Authorization: Bearer <jwt>`.
 *   - If a Bearer token is present, we forward it to the api-gateway worker's
 *     `GET /account/profile`, which verifies the JWT and resolves the real
 *     membership tier from the user's `plan`. We return its JSON verbatim
 *     (same UserMeResponse shape).
 *   - No token (anonymous) → the safe default so identify.ts always receives
 *     valid JSON: { ok:true, user_id:null, email:null, membership_tier:'free' }.
 *   - Any upstream error → the same safe default (never surface a 5xx here).
 *
 * NOTE: callers that fetch this route without an Authorization header will keep
 * getting the 'free' default — the shared accessor `lib/user-me.ts` must attach
 * the access token for paying tiers to appear. (Out of scope for this change.)
 */

import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface UserMeResponse {
  ok: true;
  user_id: string | null;
  email: string | null;
  /** Mirrors the worker's `MembershipTier`. ('standard' was never emitted.) */
  membership_tier: 'free' | 'premium' | 'lifetime';
  /**
   * Recurring subscriber (monthly/yearly) or lifetime holder. Distinguishes
   * those from the one-shot `premium` unlock, which `membership_tier` cannot.
   * Omitted when the upstream worker predates the field — callers fall back.
   */
  is_subscriber?: boolean;
}

const SAFE_DEFAULT: UserMeResponse = {
  ok: true,
  user_id: null,
  email: null,
  membership_tier: 'free',
  is_subscriber: false,
};

const API_BASE =
  process.env.HIEU_API_GATEWAY_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'https://api.hieu.asia';

function extractBearer(req: NextRequest): string | null {
  const auth =
    req.headers.get('authorization') ?? req.headers.get('Authorization');
  if (!auth) return null;
  const m = auth.match(/^Bearer\s+(\S+)$/i);
  return m ? m[1]! : null;
}

export async function GET(
  req: NextRequest,
): Promise<NextResponse<UserMeResponse>> {
  const token = extractBearer(req);
  if (!token) {
    return NextResponse.json(SAFE_DEFAULT);
  }

  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/account/profile`, {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const ct = res.headers.get('content-type') ?? '';
    if (!res.ok || !/\bjson\b/i.test(ct)) {
      return NextResponse.json(SAFE_DEFAULT);
    }
    const data = (await res.json()) as Partial<UserMeResponse>;
    // Preserve the UserMeResponse contract regardless of upstream wording.
    //
    // `is_subscriber` is passed through ONLY when the worker actually sent a
    // boolean. Do NOT collapse a missing field to `false`: during the window
    // where this route is deployed but the worker is not, `false` would assert
    // "definitely not a subscriber" and get real subscribers pitched the plan
    // they already pay for. Leaving it undefined (JSON drops the key) keeps the
    // state honestly "unknown" so callers apply their own fallback.
    return NextResponse.json({
      ok: true,
      user_id: data.user_id ?? null,
      email: data.email ?? null,
      membership_tier: data.membership_tier ?? 'free',
      is_subscriber:
        typeof data.is_subscriber === 'boolean' ? data.is_subscriber : undefined,
    });
  } catch {
    return NextResponse.json(SAFE_DEFAULT);
  }
}
