/**
 * Server-side proxy: POST /api/account/export.
 *
 * Hides HIEU_API_SERVICE_TOKEN from the browser. Forwards body to
 * `${HIEU_API_URL}/user/export` with the service-token header.
 *
 * GDPR / Nghị định 13/2023 — quyền truy cập + sao chép dữ liệu.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/reasoning/session-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;

export async function POST(req: NextRequest) {
  if (!HIEU_API_SERVICE_TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'service_unavailable' },
      { status: 503 },
    );
  }

  // Auth (Wave 64 security audit P0): this proxy attaches the privileged
  // service token, so it MUST authenticate the caller and act ONLY on their own
  // data. Verify the Supabase JWT and derive user_id from it — never trust a
  // client-supplied user_id (was an unauth IDOR: any caller could export any
  // user's full PII by POSTing their UUID, because the backend trusts
  // body.user_id when the service token is present).
  let session: { userId: string; email: string | null; linkedAnonId: string | null } | null;
  try {
    session = await getSessionFromRequest(req);
  } catch {
    return NextResponse.json({ ok: false, error: 'auth_unavailable' }, { status: 503 });
  }
  if (!session) {
    return NextResponse.json({ ok: false, error: 'auth_required' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // Force user_id to the authenticated user; ignore any client-supplied value.
  // Also forward the linked anon id (user_id_2) so the export covers readings &
  // uploads created before sign-in — already sanitized to anon_<uuid v4>.
  const forwardBody = {
    ...body,
    user_id: session.userId,
    ...(session.linkedAnonId ? { user_id_2: session.linkedAnonId } : {}),
  };

  try {
    const res = await fetch(`${HIEU_API_URL}/user/export`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Service-Token': HIEU_API_SERVICE_TOKEN,
      },
      body: JSON.stringify(forwardBody),
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
