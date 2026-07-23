/**
 * Public server-side proxy: GET /api/payment/intent/[id].
 *
 * Worker's GET /payment/intent/:id is unauthenticated (status polling),
 * so this is a pure pass-through with no service-token header.
 */

import { NextResponse } from 'next/server';
import { safeErrorDetail } from '@/lib/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL =
  process.env.HIEU_API_URL ?? 'https://api.hieu.asia';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { ok: false, error: 'missing_id' },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `${HIEU_API_URL}/payment/intent/${encodeURIComponent(id)}`,
      {
        method: 'GET',
        headers: { accept: 'application/json' },
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
        detail: safeErrorDetail('payment/intent/[id]', err),
      },
      { status: 502 },
    );
  }
}
