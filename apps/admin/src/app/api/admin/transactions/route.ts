/**
 * Admin proxy to Worker `GET /payment/transactions`.
 *
 * Browser/admin UI calls `/api/admin/transactions?limit=...&user_id=...`;
 * this handler forwards to `${HIEU_API_GATEWAY_URL}/payment/transactions`
 * with the X-Admin-Token header from server env.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function GET(req: Request) {
  if (!TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app',
      },
      { status: 503 },
    );
  }
  const url = new URL(req.url);
  try {
    const r = await fetch(
      `${GATEWAY}/payment/transactions${url.search}`,
      {
        cache: 'no-store',
        headers: { 'X-Admin-Token': TOKEN },
      },
    );
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: `gateway unreachable: ${(err as Error).message}`,
      },
      { status: 502 },
    );
  }
}
