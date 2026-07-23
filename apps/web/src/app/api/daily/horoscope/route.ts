/**
 * Proxy /api/daily/horoscope?zodiac=<key>&date=<YYYY-MM-DD>
 * Anonymous (no service token needed) but forwarded with one anyway
 * so cron-warmed cache hits skip rate-limit consideration.
 */

import { NextResponse } from 'next/server';
import { safeErrorDetail } from '@/lib/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;

/**
 * Map the public-facing zodiac slug to the upstream backend slug.
 * Frontend now uses `ti` for Tỵ (canonical), but the upstream worker still
 * expects the legacy `ty2`. Translate at the boundary so callers can use the
 * clean slug.
 */
function toUpstreamSlug(zodiac: string): string {
  return zodiac === 'ti' ? 'ty2' : zodiac;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const zodiacParam = url.searchParams.get('zodiac');
  const zodiac = zodiacParam ? toUpstreamSlug(zodiacParam) : null;
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
      { ok: false, error: 'upstream_fetch_failed', detail: safeErrorDetail('daily/horoscope', err) },
      { status: 502 },
    );
  }
}
