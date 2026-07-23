/**
 * Server-side proxy: GET/POST /api/affiliate/tax-profile
 * Forwards to api.hieu.asia/affiliate/tax-profile with the affiliate session
 * token read from the httpOnly cookie (same auth model as /api/affiliate/me).
 *
 * GET  → current tax/KYC status (masked).
 * POST → submit MST/CCCD/legal name + cam-kết-08 + accept CTV contract.
 * The browser never sees the affiliate id directly.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { safeErrorDetail } from '@/lib/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;
const COOKIE_NAME = 'hieu_aff_id';

async function proxy(req: NextRequest, method: 'GET' | 'POST') {
  const affId = req.cookies.get(COOKIE_NAME)?.value;
  if (!affId) {
    return NextResponse.json({ ok: false, error: 'not_signed_in' }, { status: 401 });
  }
  // Worker gates /affiliate/tax-profile behind isService() — same as /affiliate/me,
  // so present the shared service token or the worker replies 401 "Service token required".
  if (!HIEU_API_SERVICE_TOKEN) {
    return NextResponse.json({ ok: false, error: 'service_unavailable' }, { status: 503 });
  }
  try {
    const init: RequestInit = {
      method,
      headers: {
        'x-affiliate-id': affId,
        'x-service-token': HIEU_API_SERVICE_TOKEN,
        ...(method === 'POST' ? { 'content-type': 'application/json' } : {}),
      },
      cache: 'no-store',
    };
    if (method === 'POST') {
      init.body = await req.text();
    }
    const res = await fetch(`${HIEU_API_URL}/affiliate/tax-profile`, init);
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
      { ok: false, error: 'upstream_fetch_failed', detail: safeErrorDetail('affiliate/tax-profile', err) },
      { status: 502 },
    );
  }
}

export function GET(req: NextRequest) {
  return proxy(req, 'GET');
}

export function POST(req: NextRequest) {
  return proxy(req, 'POST');
}
