/**
 * POST /api/admin/affiliates/payouts/build-batch
 *
 * Wave 45 — proxies to worker POST /admin/affiliates/payouts/build-batch.
 * Body: { rail: 'manual_csv'|'wise'|'stripe_connect', min_amount_vnd?: number }
 */

import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifySession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function POST(req: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const body = await req.text();
  // Wave 45.2 P3-2 — forward admin email so the worker logs the real actor
  // (not "admin" literal).  Multiple admins → preserved attribution.
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  // Defense-in-depth: don't forward the admin token to the worker without a valid
  // admin session in-handler (middleware HMAC gate is the primary; this is the backstop
  // if the matcher ever regresses). Payout routes move money — fail closed.
  if (!session) {
    return NextResponse.json({ ok: false, error: 'unauthenticated' }, { status: 401 });
  }
  try {
    const r = await fetch(`${GATEWAY}/admin/affiliates/payouts/build-batch`, {
      method: 'POST',
      headers: {
        'X-Admin-Token': TOKEN,
        'content-type': 'application/json',
        ...(session?.email ? { 'x-admin-email': session.email } : {}),
      },
      body,
      cache: 'no-store',
    });
    const text = await r.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: r.status });
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: `gateway returned non-JSON (status ${r.status})`,
          body: text.slice(0, 500),
        },
        { status: r.status >= 500 ? r.status : 502 },
      );
    }
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `gateway unreachable: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
