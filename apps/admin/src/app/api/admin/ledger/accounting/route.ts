/** Admin proxy → Worker GET /admin/ledger/accounting. Money data → admin+. */
import { type NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function GET(_req: NextRequest) {
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json({ ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured' }, { status: 503 });
  }
  try {
    const r = await fetch(`${GATEWAY}/admin/ledger/accounting`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': TOKEN, 'x-admin-email': auth.session.email },
      signal: AbortSignal.timeout(25_000),
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (err) {
    return NextResponse.json({ ok: false, error: `gateway unreachable: ${(err as Error).message}` }, { status: 502 });
  }
}
