/**
 * Admin proxy: GET /api/admin/affiliates/[id] — affiliate detail.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // Wave 60.62.T1.4 — defense-in-depth verifySession backfill (PII read → viewer+).
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  const { id } = await params;
  if (!TOKEN) {
    return NextResponse.json({ ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured' }, { status: 503 });
  }
  try {
    const r = await fetch(`${GATEWAY}/admin/affiliates/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: { 'X-Admin-Token': TOKEN },
      cache: 'no-store',
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
