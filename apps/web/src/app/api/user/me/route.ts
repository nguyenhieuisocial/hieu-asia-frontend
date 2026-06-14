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
  membership_tier: 'free' | 'standard' | 'premium' | 'lifetime';
}

const SAFE_DEFAULT: UserMeResponse = {
  ok: true,
  user_id: null,
  email: null,
  membership_tier: 'free',
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
    return NextResponse.json({
      ok: true,
      user_id: data.user_id ?? null,
      email: data.email ?? null,
      membership_tier: data.membership_tier ?? 'free',
    });
  } catch {
    return NextResponse.json(SAFE_DEFAULT);
  }
}
