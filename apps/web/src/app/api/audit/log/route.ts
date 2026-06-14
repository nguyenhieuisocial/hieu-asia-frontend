/**
 * Server-side proxy: POST /api/audit/log — consent / privacy audit trail.
 *
 * Background (Wave 64 P0 + follow-up):
 *   The `audit-log` Edge Function used to be fully public, so anyone could forge
 *   or flood audit rows (including impersonating any user_id). Wave 64 gated it
 *   behind an `x-service-token` (the service-role key). The browser only holds
 *   the anon key, so its `logAudit` calls then 401'd and the consent audit
 *   silently stopped being written. This route restores it SECURELY: it attaches
 *   the service token server-side and forces the actor server-side.
 *
 * SECURITY — the actor is ALWAYS server-derived, NEVER client-trusted:
 *   - If the request carries a valid Supabase JWT, the actor is the verified
 *     user id (getSessionFromRequest → GoTrue), actor_type "user".
 *   - Otherwise (pre-login consent flow) the actor is a freshly server-generated
 *     anon id, actor_type "anon". We deliberately ignore any `user_id`/`actor`
 *     the client sends, so a client cannot attribute an audit entry to someone
 *     else.
 *   The client may only supply `action` + `metadata` (and an optional
 *   `resource_id`). This preserves the gate's intent: no forging entries as
 *   another principal.
 *
 * Note: consent is recorded pre-login by design (anonymous-first flow), so an
 * anon path is required here. The trade-off vs. requiring login is documented
 * in the route comment above — it does NOT weaken the IDOR fix because the anon
 * actor is server-minted, not a client-chosen identity.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/reasoning/session-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://fvftbqairezsybasqsek.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Bound the metadata blob so a hostile client can't push arbitrarily large rows.
const MAX_ACTION_LEN = 128;
const MAX_METADATA_BYTES = 8 * 1024;

export async function POST(req: NextRequest) {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { ok: false, error: 'service_unavailable' },
      { status: 503 },
    );
  }

  // Authenticated actor if a valid JWT is present; anon otherwise. GoTrue being
  // unreachable here is non-fatal — fall back to the anon actor so consent can
  // still be recorded (this endpoint writes no PII it would otherwise leak).
  let actor: string;
  let actorType: 'user' | 'anon';
  try {
    const session = await getSessionFromRequest(req);
    if (session) {
      actor = session.userId;
      actorType = 'user';
    } else {
      actor = `anon_${crypto.randomUUID()}`;
      actorType = 'anon';
    }
  } catch {
    actor = `anon_${crypto.randomUUID()}`;
    actorType = 'anon';
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const action = typeof body.action === 'string' ? body.action.trim() : '';
  if (!action) {
    return NextResponse.json({ ok: false, error: 'action_required' }, { status: 400 });
  }
  if (action.length > MAX_ACTION_LEN) {
    return NextResponse.json({ ok: false, error: 'action_too_long' }, { status: 400 });
  }

  const metadata =
    body.audit_metadata && typeof body.audit_metadata === 'object'
      ? (body.audit_metadata as Record<string, unknown>)
      : body.metadata && typeof body.metadata === 'object'
        ? (body.metadata as Record<string, unknown>)
        : {};
  if (JSON.stringify(metadata).length > MAX_METADATA_BYTES) {
    return NextResponse.json({ ok: false, error: 'metadata_too_large' }, { status: 400 });
  }

  const resourceId =
    typeof body.resource_id === 'string' ? body.resource_id : null;

  // Actor + actor_type are forced server-side; any client `user_id`/`actor` is
  // intentionally dropped here.
  const forwardBody = {
    actor,
    actor_type: actorType,
    action,
    resource_id: resourceId,
    metadata,
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/audit-log`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-service-token': SUPABASE_SERVICE_ROLE_KEY,
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
