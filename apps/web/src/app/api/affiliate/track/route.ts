/**
 * Server-side proxy: POST /api/affiliate/track
 * Service-gated — only callable from our own middleware / payment webhooks.
 * Holds HIEU_API_SERVICE_TOKEN server-side.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;

// Wave 60.49.b — Validate the referral-tracking payload before proxying.
// Shape matches `middleware.ts` (event=click) and the `r/[code]` page worker
// call. event is open-ended so future event types (signup, purchase) don't
// require a schema bump; just bound the length.
const TrackSchema = z.object({
  event: z.string().min(1).max(40),
  referral_code: z.string().min(1).max(80),
}).passthrough();

export async function POST(req: NextRequest) {
  if (!HIEU_API_SERVICE_TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'service_unavailable' },
      { status: 503 },
    );
  }
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const parsed = TrackSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_input', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const body = parsed.data;
  try {
    const res = await fetch(`${HIEU_API_URL}/affiliate/track`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-service-token': HIEU_API_SERVICE_TOKEN,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'content-type': res.headers.get('content-type') ?? 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'upstream_fetch_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
