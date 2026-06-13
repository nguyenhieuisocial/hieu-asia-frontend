/**
 * POST /api/admin/affiliates/payouts/batches/[id]/approve
 *
 * Wave 45 — proxies to worker
 * POST /admin/affiliates/payouts/batches/:id/approve.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // Defense-in-depth: payout routes move money — require admin+ in-handler
  // (middleware HMAC gate is the primary; this is the backstop). Fail closed.
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { id } = await params;
  // Wave 45.2 P3-2 — forward admin email for audit attribution.
  const session = auth.session;
  try {
    const r = await fetch(
      `${GATEWAY}/admin/affiliates/payouts/batches/${encodeURIComponent(id)}/approve`,
      {
        method: 'POST',
        headers: {
          'X-Admin-Token': TOKEN,
          'content-type': 'application/json',
          ...(session?.email ? { 'x-admin-email': session.email } : {}),
        },
        cache: 'no-store',
      },
    );
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
