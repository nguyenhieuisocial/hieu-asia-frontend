/**
 * Server-side proxy: POST /api/analytics/event.
 *
 * Forwards browser-fired funnel events to the Worker
 * (`${HIEU_API_URL}/analytics/event`) with the X-Service-Token header so
 * the service-gate accepts them. Fire-and-forget — never blocks the UI.
 *
 * When the service token isn't configured, returns 204 (best-effort silent
 * fail) so dev preview deploys don't 503-spam the browser console.
 */

import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;

export async function POST(req: NextRequest) {
  // Silently drop when token unset — events are best-effort.
  if (!HIEU_API_SERVICE_TOKEN) {
    return new NextResponse(null, { status: 204 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  try {
    const res = await fetch(`${HIEU_API_URL}/analytics/event`, {
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
      headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
    });
  } catch (e: unknown) {
    // Fire-and-forget: don't surface upstream errors to client
    return NextResponse.json(
      { ok: false, error: (e as Error).message ?? 'upstream_error' },
      { status: 502 },
    );
  }
}
