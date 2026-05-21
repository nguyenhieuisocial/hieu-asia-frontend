/**
 * Server-side proxy: GET/POST /api/user/preferences.
 *
 * Forwards to `${HIEU_API_URL}/user/preferences` with service token.
 * Used to sync settings page preferences to Worker KV.
 *
 * Fire-and-forget from client — failures must not break the UI.
 */

import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;

function unconfigured() {
  return NextResponse.json(
    { ok: false, error: 'server_misconfigured: HIEU_API_SERVICE_TOKEN missing' },
    { status: 503 },
  );
}

export async function POST(req: NextRequest) {
  if (!HIEU_API_SERVICE_TOKEN) return unconfigured();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  try {
    const res = await fetch(`${HIEU_API_URL}/user/preferences`, {
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

export async function GET(req: NextRequest) {
  if (!HIEU_API_SERVICE_TOKEN) return unconfigured();

  const userId = req.nextUrl.searchParams.get('user_id');
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'missing user_id' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${HIEU_API_URL}/user/preferences?user_id=${encodeURIComponent(userId)}`,
      {
        method: 'GET',
        headers: { 'X-Service-Token': HIEU_API_SERVICE_TOKEN },
        cache: 'no-store',
      },
    );
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
