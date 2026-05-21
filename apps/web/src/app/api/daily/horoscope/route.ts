/**
 * Proxy /api/daily/horoscope?zodiac=<key>&date=<YYYY-MM-DD>
 * Anonymous (no service token needed) but forwarded with one anyway
 * so cron-warmed cache hits skip rate-limit consideration.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const zodiac = url.searchParams.get('zodiac');
  const date = url.searchParams.get('date');
  const all = url.searchParams.get('all');

  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (HIEU_API_SERVICE_TOKEN) headers['X-Service-Token'] = HIEU_API_SERVICE_TOKEN;

  try {
    let target: string;
    if (all === '1') {
      target = `${HIEU_API_URL}/daily/horoscope/all${date ? `?date=${encodeURIComponent(date)}` : ''}`;
    } else {
      if (!zodiac) {
        return NextResponse.json({ ok: false, error: 'zodiac query param required' }, { status: 400 });
      }
      target = `${HIEU_API_URL}/daily/horoscope/${encodeURIComponent(zodiac)}${date ? `?date=${encodeURIComponent(date)}` : ''}`;
    }
    const res = await fetch(target, { method: 'GET', headers, cache: 'no-store' });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'content-type': res.headers.get('content-type') ?? 'application/json; charset=utf-8',
        'cache-control': 's-maxage=600, stale-while-revalidate=3600',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'upstream_fetch_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
