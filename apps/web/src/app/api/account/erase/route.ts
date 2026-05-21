/**
 * Server-side proxy: POST /api/account/erase.
 *
 * Hides HIEU_API_SERVICE_TOKEN. Forwards to `${HIEU_API_URL}/user/erase`.
 * Caller MUST send body { user_id, confirm: "DELETE_MY_DATA_FOREVER" }.
 *
 * GDPR / Nghị định 13/2023 — quyền xóa dữ liệu.
 */

import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;

export async function POST(req: NextRequest) {
  if (!HIEU_API_SERVICE_TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'server_misconfigured: HIEU_API_SERVICE_TOKEN missing' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  try {
    const res = await fetch(`${HIEU_API_URL}/user/erase`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Service-Token': HIEU_API_SERVICE_TOKEN,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'content-type':
          res.headers.get('content-type') ?? 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: 'upstream_fetch_failed',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }
}
