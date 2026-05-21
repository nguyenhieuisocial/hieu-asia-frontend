/**
 * Public proxy: GET /api/affiliate/leaderboard?period=monthly|all_time&limit=N
 * Forwards to api.hieu.asia/affiliate/leaderboard — no auth required.
 */

import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const search = url.searchParams.toString();
  try {
    const r = await fetch(`${HIEU_API_URL}/affiliate/leaderboard?${search}`, {
      method: 'GET',
      cache: 'no-store',
    });
    const text = await r.text();
    return new NextResponse(text, {
      status: r.status,
      headers: {
        'content-type': r.headers.get('content-type') ?? 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=60',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'upstream_fetch_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
