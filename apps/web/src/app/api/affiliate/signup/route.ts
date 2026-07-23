/**
 * Server-side proxy: POST /api/affiliate/signup
 * Forwards to api.hieu.asia/affiliate/signup. The worker now JWT-gates signup
 * (identity comes from the Supabase token, not the body), so we forward the
 * Authorization bearer header the browser sends — without it the worker 401s.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { safeErrorDetail } from '@/lib/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const authz = req.headers.get('authorization');

  try {
    const res = await fetch(`${HIEU_API_URL}/affiliate/signup`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(authz ? { authorization: authz } : {}),
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
      { ok: false, error: 'upstream_fetch_failed', detail: safeErrorDetail('affiliate/signup', err) },
      { status: 502 },
    );
  }
}
