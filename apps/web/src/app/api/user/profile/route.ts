/**
 * GET/POST /api/user/profile — saved birth-chart profile for the logged-in user.
 *
 * Phase 1 stub: this route is a thin echo + localStorage fallback.
 *
 * - GET returns `{ ok: true, profile: null }` so the client can fall back to
 *   reading `hieu:onboarding:v2` from localStorage.
 * - POST accepts an arbitrary profile object and echoes it back. When wired
 *   to the worker `/user/profile` route later, the contract stays the same:
 *   `{ ok: true, profile: <data>, updated_at: <iso> }`.
 *
 * This stub exists so the account page can be built and shipped before the
 * worker endpoint lands — front-end persistence still works via localStorage.
 */

import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface ProfileResponse {
  ok: boolean;
  profile: unknown | null;
  updated_at: string | null;
  error?: string;
}

export function GET(): NextResponse<ProfileResponse> {
  return NextResponse.json({
    ok: true,
    profile: null,
    updated_at: null,
  });
}

export async function POST(req: NextRequest): Promise<NextResponse<ProfileResponse>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, profile: null, updated_at: null, error: 'invalid_json' },
      { status: 400 },
    );
  }
  // Echo back with a fresh updated_at. Worker integration replaces this.
  return NextResponse.json({
    ok: true,
    profile: body,
    updated_at: new Date().toISOString(),
  });
}
