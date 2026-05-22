/**
 * Admin proxy: POST /api/admin/affiliates/:id/clear-flag
 *
 * NOTE: The slug is `[id]` to match its siblings under
 * `api/admin/affiliates/[id]/*`. Next.js does not allow two sibling
 * dynamic segments with different slug names — having `[code]` here and
 * `[id]` next to it crashes the entire serverless runtime at module load
 * with "You cannot use different slug names for the same dynamic path".
 *
 * The runtime value passed in is the affiliate CODE (matches the worker
 * route `${GATEWAY}/admin/affiliates/${code}/clear-flag`); we just label
 * the slug `id` for router consistency.
 */

import { NextRequest, NextResponse } from 'next/server';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { id: code } = await ctx.params;
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
