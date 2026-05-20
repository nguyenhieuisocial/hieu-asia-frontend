/**
 * Server-side proxy to api.hieu.asia mentor endpoint.
 *
 * Hides HIEU_API_SERVICE_TOKEN from the browser. Browser POSTs
 * `/api/mentor` with `{ messages, session_id? }`; this handler forwards
 * to `https://api.hieu.asia/ai/role/mentor` with the service token header.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL =
  process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;

export async function POST(req: Request) {
  if (!HIEU_API_SERVICE_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        error: 'server_misconfigured: HIEU_API_SERVICE_TOKEN missing',
      },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_json' },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${HIEU_API_URL}/ai/role/mentor`, {
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
