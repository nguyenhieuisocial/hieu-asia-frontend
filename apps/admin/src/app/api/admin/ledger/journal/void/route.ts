/** Admin proxy → Worker POST /admin/ledger/journal/void (void a manual entry).
 *  Bookkeeping write → owner+. id in body (avoids ':' in path). */
import { type NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession('owner');
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json({ ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured' }, { status: 503 });
  }
  const incoming = (await req.json().catch(() => ({}))) as { id?: string };
  const body = JSON.stringify({ id: incoming.id, by: auth.session.email });
  try {
    const r = await fetch(`${GATEWAY}/admin/ledger/journal/void`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': TOKEN, 'x-admin-email': auth.session.email },
      body,
      signal: AbortSignal.timeout(20_000),
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (err) {
    return NextResponse.json({ ok: false, error: `gateway unreachable: ${(err as Error).message}` }, { status: 502 });
  }
}
