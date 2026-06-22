/**
 * Server-side proxy to Supabase Edge Function `reading-get`.
 *
 * Wave 65 IDOR fix: `reading-get` is now gated (service-token + owner scoping).
 * This proxy derives the caller's owner id(s) from their verified session
 * (`Authorization: Bearer` JWT) and/or their own `x-anon-id` header, then calls
 * the EF with the service-role token. A leaked `session_id` alone no longer
 * reads the reading — the caller must prove ownership.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { resolveReadingOwnerIds } from '@/lib/reasoning/session-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://fvftbqairezsybasqsek.supabase.co';
// reading-get compares `x-service-token` against its own READING_PROXY_TOKEN
// (server-only, never shipped to the browser).
const READING_PROXY_TOKEN = process.env.READING_PROXY_TOKEN;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, error: 'missing_id' }, { status: 400 });
  }
  if (!READING_PROXY_TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'service_unavailable' },
      { status: 503 },
    );
  }

  // Wave 65 — only the owner may read. Derive owner id(s) server-side from the
  // verified session and/or the caller's own anon id; the session_id in the URL
  // is NOT one of them.
  const ownerIds = await resolveReadingOwnerIds(req);
  if (ownerIds.length === 0) {
    return NextResponse.json({ ok: false, error: 'auth_required' }, { status: 401 });
  }

  const qs = new URLSearchParams({ id, owner_ids: ownerIds.join(',') });
  const url = `${SUPABASE_URL}/functions/v1/reading-get?${qs.toString()}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'x-service-token': READING_PROXY_TOKEN },
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
