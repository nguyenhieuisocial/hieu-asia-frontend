/**
 * GET /api/admin/affiliates/leaderboard-top — Wave 48
 *
 * Reads top N rows from hieu_asia.mv_affiliate_leaderboard (service-role,
 * bypasses RLS) and joins owner email from hieu_asia.users for admin display.
 *
 * Admin-only: owner email IS shown here. Do not reuse this route in any
 * non-admin surface.
 *
 * Auth: defense-in-depth — middleware.ts already gates /api/admin/*, but we
 * re-verify the session inside the handler so that if the middleware matcher
 * ever changes (e.g. excludes /api/admin/* by mistake), this service-role
 * lookup remains protected. See Wave 48 P2-B audit.
 */

import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { sbServer } from '@/lib/supabase-server';
import { ADMIN_SESSION_COOKIE, verifySession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface MvRow {
  user_id: string;
  affiliate_code: string;
  tier: string | null;
  total_commissions: number;
  total_earned_vnd: number;
  total_paid_vnd: number;
  total_available_vnd: number;
  total_orders: number;
}

interface UserRow {
  id: string;
  email: string | null;
}

export async function GET(req: NextRequest) {
  // Defense-in-depth: re-verify session inside the handler. Middleware also
  // gates this path, but a matcher regression must not expose service-role
  // data.
  const cookieStore = await cookies();
  const session = await verifySession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );
  if (!session) {
    return NextResponse.json(
      { ok: false, error: 'unauthenticated' },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(url.searchParams.get('limit') ?? '5', 10)),
  );

  const mvR = await sbServer<MvRow[]>(
    `mv_affiliate_leaderboard?select=user_id,affiliate_code,tier,total_commissions,total_earned_vnd,total_paid_vnd,total_available_vnd,total_orders&order=total_earned_vnd.desc&limit=${limit}`,
  );
  if (!mvR.ok) {
    return NextResponse.json(
      { ok: false, error: mvR.error ?? 'Supabase error' },
      { status: mvR.status === 503 ? 503 : 502 },
    );
  }

  const rows = mvR.body ?? [];
  const ids = rows.map((r) => r.user_id).filter(Boolean);
  let emailById = new Map<string, string>();
  if (ids.length > 0) {
    const idsCsv = ids.map(encodeURIComponent).join(',');
    const usrR = await sbServer<UserRow[]>(
      `users?select=id,email&id=in.(${idsCsv})&limit=${ids.length}`,
    );
    if (usrR.ok && usrR.body) {
      emailById = new Map(
        usrR.body
          .filter((u): u is { id: string; email: string } => !!u.email)
          .map((u) => [u.id, u.email]),
      );
    }
  }

  const out = rows.map((r) => ({
    user_id: r.user_id,
    affiliate_code: r.affiliate_code,
    email: emailById.get(r.user_id) ?? null,
    tier: r.tier,
    total_commissions: Number(r.total_commissions ?? 0),
    total_earned_vnd: Number(r.total_earned_vnd ?? 0),
    total_paid_vnd: Number(r.total_paid_vnd ?? 0),
    total_available_vnd: Number(r.total_available_vnd ?? 0),
    total_orders: Number(r.total_orders ?? 0),
  }));

  return NextResponse.json({ ok: true, leaderboard: out });
}
