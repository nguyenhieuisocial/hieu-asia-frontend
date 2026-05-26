/**
 * Admin proxy for API key management.
 *
 * GET  /api/admin/api-keys           → list (viewer+)
 * POST /api/admin/api-keys           → create + return plaintext ONCE (admin+)
 *
 * Wave 60.81.D vault 107 §5.7. Proxies to gateway `/admin/api-keys`. The
 * gateway is responsible for hashing the secret, writing the audit_log
 * row, and returning the cleartext value exactly once.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function GET() {
  const auth = await requireAdminSession();
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  try {
    const r = await fetch(`${GATEWAY}/admin/api-keys`, {
      cache: 'no-store',
      headers: { 'X-Admin-Token': TOKEN },
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

export async function POST(req: NextRequest) {
  // Creating an API key is a privilege-grant — restrict to admin+.
  const auth = await requireAdminSession('admin');
  if ('error' in auth) return auth.error;
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const body = await req.text();
  try {
    const r = await fetch(`${GATEWAY}/admin/api-keys`, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': TOKEN,
      },
      body,
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
