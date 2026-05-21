/**
 * Server-side proxy: POST /api/affiliate/payout
 * Reads affiliate id from cookie, forwards to api.hieu.asia/affiliate/payout.
 */

import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const COOKIE_NAME = 'hieu_aff_id';

export async function POST(req: NextRequest) {
  const affId = req.cookies.get(COOKIE_NAME)?.value;
  if (!affId) return NextResponse.json({ ok: false, error: 'not_signed_in' }, { status: 401 });

  let body: { amount?: number };
  try {
    body = (await req.json()) as { amount?: number };
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  if (!body.amount) {
    return NextResponse.json({ ok: false, error: 'amount required' }, { status: 400 });
  }

  try {
    const res = await fetch(`${HIEU_API_URL}/affiliate/payout`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ affiliate_id: affId, amount: body.amount }),
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
