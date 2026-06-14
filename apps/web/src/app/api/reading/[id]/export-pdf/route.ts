/**
 * Server-side proxy: POST /api/reading/[id]/export-pdf
 *
 * Forwards the Supabase JWT (Authorization header) from the browser to
 * api.hieu.asia/reading/:id/export-pdf. The worker verifies the JWT,
 * checks is_paid===true, generates the PDF via Cloudflare Browser Rendering,
 * uploads to R2, and returns a signed URL.
 *
 * Response shape from upstream:
 *   { ok: true, url: string, expiresAt: string, size_bytes: number, key: string, cached?: boolean }
 *   { ok: false, error: string }  (401/402/403/404/503)
 */

import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Upstream PDF generation can take 5-10s — give it ample room.
export const maxDuration = 30;

const HIEU_API_URL =
  process.env.HIEU_API_URL ?? 'https://api.hieu.asia';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { ok: false, error: 'missing_id' },
      { status: 400 },
    );
  }

  // Pass the caller's Supabase JWT so the worker can verify ownership.
  const authz = req.headers.get('authorization');
  if (!authz) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  try {
    const res = await fetch(
      `${HIEU_API_URL}/reading/${encodeURIComponent(id)}/export-pdf`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: authz,
        },
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
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }
}
