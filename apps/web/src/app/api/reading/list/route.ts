/**
 * Server-side proxy: GET /api/reading/list — the web dashboard's reading history.
 *
 * Background (Wave 64 P0 + follow-up):
 *   The `reading-list` Edge Function used to be fully public and returned ANY
 *   user's readings + PII by a client-supplied `user_id` (an IDOR). Wave 64
 *   closed that by gating the EF behind an `x-service-token` (the service-role
 *   key). The browser, which only holds the anon key, then started getting 401s
 *   — so the dashboard history went permanently empty. This route restores the
 *   feature SECURELY: it attaches the privileged service token server-side and
 *   scopes the query to the *verified* caller only.
 *
 * SECURITY — the user_id is ALWAYS server-derived, NEVER client-trusted:
 *   - The user is identified by verifying the Supabase JWT (getSessionFromRequest
 *     → GoTrue getUser). No session ⇒ 401.
 *   - The upstream `user_id` is taken from that verified session, NOT from the
 *     query/body. Any `?user_id=` a client sends is ignored.
 *   - The optional second id (the prior anon id a user claimed at login) also
 *     comes from the verified session's GoTrue-signed `user_metadata`
 *     (`session.linkedAnonId`), not from request input.
 *   ⇒ The PII IDOR is NOT re-opened: a caller can only ever read their own
 *     readings + the anon readings their own account claimed.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/reasoning/session-auth';
import { safeErrorDetail } from '@/lib/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://fvftbqairezsybasqsek.supabase.co';
// The `reading-list` EF compares `x-service-token` against its own
// SUPABASE_SERVICE_ROLE_KEY, so this MUST be the service-role key (server-only,
// never shipped to the browser).
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(req: NextRequest) {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { ok: false, error: 'service_unavailable' },
      { status: 503 },
    );
  }

  let session: { userId: string; email: string | null; linkedAnonId: string | null } | null;
  try {
    session = await getSessionFromRequest(req);
  } catch {
    // GoTrue unreachable — fail closed (this route returns PII).
    return NextResponse.json({ ok: false, error: 'auth_unavailable' }, { status: 503 });
  }
  if (!session) {
    return NextResponse.json({ ok: false, error: 'auth_required' }, { status: 401 });
  }

  // BOTH ids are server-derived from the verified session.
  const query = new URLSearchParams({ user_id: session.userId });
  if (session.linkedAnonId) query.set('user_id_2', session.linkedAnonId);

  const url = `${SUPABASE_URL}/functions/v1/reading-list?${query.toString()}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-service-token': SUPABASE_SERVICE_ROLE_KEY,
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
        detail: safeErrorDetail('reading/list', err),
      },
      { status: 502 },
    );
  }
}
