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
    // Wave 52.fix (#257): swallow upstream 5xx as 204 best-effort silent fail.
    // Analytics is fire-and-forget; surfacing upstream errors (e.g. KV daily
    // quota exhausted → "KV put() limit exceeded") pollutes browser console
    // and Sentry monitoring without giving the user any actionable signal.
    // The body is dropped client-side anyway (`.catch(() => {})` in analytics.ts).
    // Still log to backend console for Sentry auto-capture.
    if (res.status >= 500) {
      try {
        const detail = await res.text();
        console.error('[analytics/event proxy] upstream 5xx swallowed', {
          status: res.status,
          detail: detail.slice(0, 200),
        });
      } catch {
        /* ignore */
      }
      return new NextResponse(null, { status: 204 });
    }
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
    });
  } catch (e: unknown) {
    // Fire-and-forget: don't surface upstream network errors to client
    console.error('[analytics/event proxy] upstream network error swallowed', {
      message: (e as Error).message,
    });
    return new NextResponse(null, { status: 204 });
  }
}
