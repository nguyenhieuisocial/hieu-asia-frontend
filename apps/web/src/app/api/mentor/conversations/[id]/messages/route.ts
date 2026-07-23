/**
 * Wave 61.02 — POST /api/mentor/conversations/:id/messages
 * Appends a message. Worker auto-summarises every 10th message.
 */

import { NextResponse } from 'next/server';
import { safeErrorDetail } from '@/lib/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';

export async function POST(
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
  const body = await req.text();
  try {
    const res = await fetch(
      `${HIEU_API_URL}/mentor/conversations/${encodeURIComponent(id)}/messages`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: auth,
        },
        body,
        cache: 'no-store',
      },
    );
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
        detail: safeErrorDetail('mentor/conversations/[id]/messages', err),
      },
      { status: 502 },
    );
  }
}
