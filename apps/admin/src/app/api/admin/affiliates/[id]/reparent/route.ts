/**
 * POST /api/admin/affiliates/[id]/reparent
 *
 * Wave 43.2 — proxies to worker POST /admin/affiliates/:id/reparent.
 * Body: { new_parent_user_id: uuid | null }
 */

import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // Wave 60.62.T1.4 — defense-in-depth verifySession backfill (reparent tree → admin+).
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { id } = await params;
  const body = await req.text();
  try {
    const r = await fetch(`${GATEWAY}/admin/affiliates/${id}/reparent`, {
      method: 'POST',
      headers: {
        'X-Admin-Token': TOKEN,
        'content-type': 'application/json',
      },
      body,
      cache: 'no-store',
    });
    const text = await r.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: r.status });
    } catch {
      return NextResponse.json(
        { ok: false, error: `gateway returned non-JSON (status ${r.status})`, body: text.slice(0, 500) },
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
