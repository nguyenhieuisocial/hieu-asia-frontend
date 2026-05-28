/**
 * Wave 61.02 — Next.js proxy for mentor conversation persistence.
 *
 * The browser sends its Supabase access_token as `Authorization: Bearer ...`.
 * We forward it verbatim to the Worker which verifies the JWT and FORCES
 * user_id from `JWT.sub` (no IDOR vector via spoofed query/body).
 *
 * Routes (this file = root list/create; [id] subpath handled by ./[id]):
 *   POST /api/mentor/conversations              -> create
 *   GET  /api/mentor/conversations              -> list user's
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';

function pickAuthHeader(req: Request): string | null {
  return req.headers.get('authorization') ?? req.headers.get('Authorization');
}

async function forward(req: Request, target: string): Promise<NextResponse> {
  const authHeader = pickAuthHeader(req);
  if (!authHeader) {
    return NextResponse.json(
      { ok: false, error: 'auth_required' },
      { status: 401 },
    );
  }

  const init: RequestInit = {
    method: req.method,
    headers: {
      'content-type': 'application/json',
      authorization: authHeader,
    },
    cache: 'no-store',
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.text();
  }

  try {
    const res = await fetch(target, init);
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'content-type':
          res.headers.get('content-type') ?? 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: 'upstream_fetch_failed',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }
}

export async function GET(req: Request) {
  const incoming = new URL(req.url);
  const qs = incoming.search; // preserve `?limit=...`
  const target = `${HIEU_API_URL}/mentor/conversations${qs}`;
  return forward(req, target);
}

export async function POST(req: Request) {
  const target = `${HIEU_API_URL}/mentor/conversations`;
  return forward(req, target);
}
