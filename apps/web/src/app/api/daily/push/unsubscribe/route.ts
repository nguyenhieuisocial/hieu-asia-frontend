import { NextResponse } from 'next/server';
import { safeErrorDetail } from '@/lib/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;

export async function POST(req: Request) {
  const body = await req.text();
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (HIEU_API_SERVICE_TOKEN) headers['X-Service-Token'] = HIEU_API_SERVICE_TOKEN;
  try {
    const res = await fetch(`${HIEU_API_URL}/daily/push/unsubscribe`, {
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
      { ok: false, error: 'upstream_fetch_failed', detail: safeErrorDetail('daily/push/unsubscribe', err) },
      { status: 502 },
    );
  }
}
