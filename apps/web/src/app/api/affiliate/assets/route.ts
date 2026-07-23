/**
 * Server-side proxy: GET /api/affiliate/assets
 * Forwards to api.hieu.asia/affiliate/assets with the affiliate_id cookie.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { safeErrorDetail } from '@/lib/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const COOKIE_NAME = 'hieu_aff_id';

export async function GET(req: NextRequest) {
  const affId = req.cookies.get(COOKIE_NAME)?.value;
  if (!affId) {
    return NextResponse.json({ ok: false, error: 'not_signed_in' }, { status: 401 });
  }
  try {
    const r = await fetch(`${HIEU_API_URL}/affiliate/assets`, {
      method: 'GET',
      headers: { 'x-affiliate-id': affId },
      cache: 'no-store',
    });
    const text = await r.text();
    return new NextResponse(text, {
      status: r.status,
      headers: {
        'content-type': r.headers.get('content-type') ?? 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'upstream_fetch_failed', detail: safeErrorDetail('affiliate/assets', err) },
      { status: 502 },
    );
  }
}
