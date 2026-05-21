/**
 * Admin proxy to Worker `/admin/coupons`.
 *   GET  → list coupons
 *   POST → create coupon `{ code, discount_pct, valid_from?, valid_to?, max_uses?, notes? }`
 */

import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

function missingToken() {
  return NextResponse.json(
    { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
    { status: 503 },
  );
}

export async function GET() {
  if (!TOKEN) return missingToken();
  try {
    const r = await fetch(`${GATEWAY}/admin/coupons`, {
      cache: 'no-store',
      headers: { 'X-Admin-Token': TOKEN },
    });
    const text = await r.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: r.status });
    } catch {
      return NextResponse.json(
        { ok: false, error: `gateway returned non-JSON (status ${r.status})`, body: text.slice(0, 500) },
        { status: r.status >= 500 ? r.status : 502 },
      );
    }
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `gateway unreachable: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}

export async function POST(req: NextRequest) {
  if (!TOKEN) return missingToken();
  const body = await req.text();
  try {
    const r = await fetch(`${GATEWAY}/admin/coupons`, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': TOKEN,
      },
      body,
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `gateway unreachable: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}
