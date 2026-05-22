import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;

export async function POST(req: Request) {
  const raw = await req.text();
  // Translate canonical `ti` slug → legacy upstream `ty2` so the worker
  // recognises the subscription. (See route comment in /api/daily/horoscope.)
  let body = raw;
  try {
    const parsed = JSON.parse(raw) as { zodiac?: unknown };
    if (parsed.zodiac === 'ti') {
      parsed.zodiac = 'ty2';
      body = JSON.stringify(parsed);
    }
  } catch {
    /* keep raw body if not JSON */
  }
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (HIEU_API_SERVICE_TOKEN) headers['X-Service-Token'] = HIEU_API_SERVICE_TOKEN;
  try {
    const res = await fetch(`${HIEU_API_URL}/daily/push/subscribe`, {
      method: 'POST',
      headers,
      body,
      cache: 'no-store',
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') ?? 'application/json; charset=utf-8' },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'upstream_fetch_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
