/**
 * Server-side proxy: POST /api/payment/intent.
 *
 * Hides HIEU_API_SERVICE_TOKEN from the browser. Forwards body to
 * `${HIEU_API_URL}/payment/intent` with the service-token header.
 *
 * Wave 55 — Vercel BotID guard. `checkBotId()` reads the classification
 * headers attached by the client (see `src/instrumentation-client.ts` for
 * the matching `protect` entry). Bot-classified requests get a 403 instead
 * of consuming an intent slot. Pro feature; no-op in non-Vercel previews.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { checkBotId } from 'botid/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL =
  process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;

export async function POST(req: NextRequest) {
  // Wave 55 BotID — reject bot-classified requests before they touch the
  // worker or mint an intent. The client `initBotId` declares this path in
  // its protect list, so legitimate browser users carry the right headers.
  const botCheck = await checkBotId();
  if (botCheck.isBot) {
    return NextResponse.json(
      { ok: false, error: 'bot_detected' },
      { status: 403 },
    );
  }

  if (!HIEU_API_SERVICE_TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'server_misconfigured: HIEU_API_SERVICE_TOKEN missing' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_json' },
      { status: 400 },
    );
  }

  // Wave 53 P1 (#272) — IDOR fix. Forward the caller's Supabase access token
  // so the worker can verify identity and derive user_id server-side, instead
  // of trusting the client-supplied user_id field. The worker treats body.user_id
  // as authoritative only when the Authorization header is absent (anonymous
  // flow), and even then enforces the `anon-*` shape so a logged-in attacker
  // can no longer POST `{ user_id: <victim_uuid> }` to bind unlocks to others.
  const authz = req.headers.get('authorization');

  try {
    const res = await fetch(`${HIEU_API_URL}/payment/intent`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Service-Token': HIEU_API_SERVICE_TOKEN,
        ...(authz ? { authorization: authz } : {}),
      },
      body: JSON.stringify(body),
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
