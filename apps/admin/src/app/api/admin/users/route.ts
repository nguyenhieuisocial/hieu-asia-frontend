import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

async function proxy(req: NextRequest, method: 'GET' | 'POST') {
  // Wave 60.62.T1.4 — defense-in-depth verifySession backfill (user mgmt → owner only).
  const auth = await requireAdminSession('owner');
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const body = method === 'POST' ? await req.text() : undefined;
  try {
    const r = await fetch(`${GATEWAY}/admin/users`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': TOKEN,
      },
      body,
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

export const GET = (req: NextRequest) => proxy(req, 'GET');
export const POST = (req: NextRequest) => proxy(req, 'POST');
