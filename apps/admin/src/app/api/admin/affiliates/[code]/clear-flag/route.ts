/**
 * Admin proxy: POST /api/admin/affiliates/:code/clear-flag
 * Path param is the affiliate code (not id), matching the worker route.
 */

import { NextRequest, NextResponse } from 'next/server';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ code: string }> },
) {
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { code } = await ctx.params;
  const body = await req.text();
  try {
    const r = await fetch(`${GATEWAY}/admin/affiliates/${code}/clear-flag`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Admin-Token': TOKEN,
      },
      body: body || '{}',
      cache: 'no-store',
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
