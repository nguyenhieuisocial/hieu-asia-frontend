/**
 * POST /api/admin/customers/set-plan  body: { email, plan, days? }
 *
 * Comp / extend / revoke an END-USER's paid plan by email. Forwards to the worker
 * POST /admin/users/set-plan (which PATCHes hieu_asia.users.plan + plan_expires_at).
 *
 * Owner-only: granting a free lifetime/monthly plan gives away the paid product
 * (comping), so it's revenue-affecting — gated the same as secrets/refunds. The
 * worker only checks the shared admin token (role-blind), so per-user role MUST be
 * enforced here.
 *
 * Contract (verified vs worker index.ts):
 *   plan ∈ 'lifetime' | 'subscription_monthly' | 'free'  (these EXACT strings —
 *   the quota gate ignores 'premium'); `days` honored only for subscription_monthly.
 *   Returns 200 {ok:true,email,plan,expires_at,count} | 200 {ok:false,error:'not_found'}
 *   | 400 invalid | 503 not_configured | 502 write_failed.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession('owner');
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const body = await req.text();
  try {
    const r = await fetch(`${GATEWAY}/admin/users/set-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': TOKEN,
        'x-admin-email': auth.session.email,
      },
      body,
      signal: AbortSignal.timeout(20000),
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `gateway unreachable: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
