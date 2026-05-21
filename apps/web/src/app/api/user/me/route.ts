/**
 * GET /api/user/me — returns the calling user's profile + membership tier.
 *
 * Phase 1 stub: returns the safe default ({ ok: true, user_id: null,
 * membership_tier: 'free' }) so identify.ts always receives valid JSON
 * regardless of auth state.
 *
 * Previously this route did not exist → Next.js rendered the HTML 404 page,
 * which callers tried to JSON.parse, throwing the well-known
 * `Unexpected token '<', "<!DOCTYPE "... is not valid JSON` console error.
 *
 * Future work: read Supabase auth cookie + look up membership_tier from
 * worker `/account/profile`. The contract here stays the same.
 */

import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface UserMeResponse {
  ok: true;
  user_id: string | null;
  email: string | null;
  membership_tier: 'free' | 'standard' | 'premium' | 'lifetime';
}

export function GET(): NextResponse<UserMeResponse> {
  return NextResponse.json({
    ok: true,
    user_id: null,
    email: null,
    membership_tier: 'free',
  });
}
