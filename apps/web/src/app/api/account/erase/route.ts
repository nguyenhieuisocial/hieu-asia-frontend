/**
 * Server-side proxy: POST /api/account/erase.
 *
 * Hides HIEU_API_SERVICE_TOKEN. Forwards to `${HIEU_API_URL}/user/erase`.
 * Caller MUST send body { user_id, confirm: "DELETE_MY_DATA_FOREVER" }.
 *
 * GDPR / Nghị định 13/2023 — quyền xóa dữ liệu.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/reasoning/session-auth';
import { safeErrorDetail } from '@/lib/safe-error';

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
  // client-supplied user_id (was an unauth IDOR: any caller could erase any
  // user's data by POSTing their UUID, because the backend trusts body.user_id
  // when the service token is present).
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

  // Strip any client-supplied identity fields, THEN set server-derived values —
  // never let body.user_id / body.user_id_2 survive the spread. A client could
  // otherwise smuggle a victim's anon id as user_id_2 (e.g. when the user has no
  // linked anon, the conditional spread below adds nothing and `...body` would
  // forward it verbatim) and the worker trusts it under our service token, ERASING
  // the victim's data → destructive IDOR. linkedAnonId comes from the GoTrue-signed
  // session, bound to this user.
  const rest = { ...body };
  delete rest.user_id;
  delete rest.user_id_2;
  const forwardBody = {
    ...rest,
    user_id: session.userId,
    ...(session.linkedAnonId ? { user_id_2: session.linkedAnonId } : {}),
  };

  try {
    const res = await fetch(`${HIEU_API_URL}/user/erase`, {
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
        detail: safeErrorDetail('account/erase', err),
      },
      { status: 502 },
    );
  }
}
