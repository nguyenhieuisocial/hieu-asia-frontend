/**
 * Server-side proxy: GET/POST /api/user/preferences.
 *
 * Forwards to `${HIEU_API_URL}/user/preferences` with service token.
 * Used to sync settings page preferences to Worker KV.
 *
 * Fire-and-forget from client — failures must not break the UI.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { getSessionFromRequest } from '@/lib/reasoning/session-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;

// Wave 60.49.b — Bound the prefs payload at the proxy edge. The worker is
// authoritative for nested-field validation; here we only enforce that the
// body is well-formed JSON with a user_id and an object-shaped prefs bag.
const PrefsSchema = z.object({
  user_id: z.string().min(1).max(120),
  prefs: z.record(z.string(), z.unknown()),
}).passthrough();

function unconfigured() {
  return NextResponse.json(
    { ok: false, error: 'service_unavailable' },
    { status: 503 },
  );
}

export async function POST(req: NextRequest) {
  if (!HIEU_API_SERVICE_TOKEN) return unconfigured();

  let session: { userId: string; email: string | null } | null;
  try {
    session = await getSessionFromRequest(req);
  } catch {
    return NextResponse.json({ ok: false, error: 'auth_unavailable' }, { status: 503 });
  }
  if (!session) {
    return NextResponse.json({ ok: false, error: 'auth_required' }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const parsed = PrefsSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_input', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const body = parsed.data;

  // Override user_id with the verified session identity — never trust the client-supplied value.
  const forwardBody = { ...body, user_id: session.userId };

  try {
    const res = await fetch(`${HIEU_API_URL}/user/preferences`, {
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

export async function GET(req: NextRequest) {
  if (!HIEU_API_SERVICE_TOKEN) return unconfigured();

  let session: { userId: string; email: string | null } | null;
  try {
    session = await getSessionFromRequest(req);
  } catch {
    return NextResponse.json({ ok: false, error: 'auth_unavailable' }, { status: 503 });
  }
  if (!session) {
    return NextResponse.json({ ok: false, error: 'auth_required' }, { status: 401 });
  }

  try {
    const res = await fetch(
      `${HIEU_API_URL}/user/preferences?user_id=${encodeURIComponent(session.userId)}`,
      {
        method: 'GET',
        headers: { 'X-Service-Token': HIEU_API_SERVICE_TOKEN },
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
