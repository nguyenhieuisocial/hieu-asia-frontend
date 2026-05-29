/**
 * Server-side proxy to Supabase Edge Function `reading-get`.
 *
 * Hides SUPABASE_ANON_KEY from the browser. Browser calls
 * `/api/reading/{id}`; this handler forwards to Supabase with auth headers.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? 'https://fvftbqairezsybasqsek.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

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

  if (!SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { ok: false, error: 'service_unavailable' },
      { status: 500 },
    );
  }

  const url = `${SUPABASE_URL}/functions/v1/reading-get?id=${encodeURIComponent(id)}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
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
