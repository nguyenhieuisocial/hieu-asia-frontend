/**
 * GET /api/admin/affiliates/payouts/batches/[id]/csv
 *
 * Wave 45 — proxies to worker
 * GET /admin/affiliates/payouts/batches/:id/csv.
 * Returns { ok, url, key, row_count, expires_in }.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // Payout CSV exposes affiliate bank-account numbers + PII → require admin role
  // (matches the approve / build-batch sibling routes). A viewer must not be able
  // to export it. requireAdminSession enforces the per-user role the proxy/worker
  // would otherwise skip.
  const auth = await requireAdminSession('admin', { read: true });
  if ('error' in auth) return auth.error;
  const session = auth.session;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { id } = await params;
  try {
    const r = await fetch(
      `${GATEWAY}/admin/affiliates/payouts/batches/${encodeURIComponent(id)}/csv`,
      {
        method: 'GET',
        headers: {
          'X-Admin-Token': TOKEN,
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
