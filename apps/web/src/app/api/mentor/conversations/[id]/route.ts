/**
 * Wave 61.02 — GET /api/mentor/conversations/:id
 * Returns the conversation envelope (summary + last 50 messages) for resume.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = req.headers.get('authorization') ?? req.headers.get('Authorization');
  if (!auth) {
    return NextResponse.json({ ok: false, error: 'auth_required' }, { status: 401 });
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, error: 'id_required' }, { status: 400 });
  }
  try {
    const res = await fetch(`${HIEU_API_URL}/mentor/conversations/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: { authorization: auth },
      cache: 'no-store',
    });
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
