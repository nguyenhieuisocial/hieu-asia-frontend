/**
 * Server-side proxy: POST /api/payment/validate-code.
 *
 * Hides HIEU_API_SERVICE_TOKEN from the browser. Forwards body to
 * `${HIEU_API_URL}/payment/validate-code` with the service-token header.
 * Non-consuming voucher/promo code validation — returns the discounted
 * price without minting an intent.
 *
 * Wave 55 — Vercel BotID guard. `checkBotId()` reads the classification
 * headers attached by the client (see `src/instrumentation-client.ts` for
 * the matching `protect` entry). Bot-classified requests get a 403 instead
 * of probing the voucher endpoint. Pro feature; no-op in non-Vercel previews.
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
  // worker. The client `initBotId` declares this path in its protect list,
  // so legitimate browser users carry the right headers.
  const botCheck = await checkBotId();
  if (botCheck.isBot) {
    return NextResponse.json(
      { ok: false, error: 'bot_detected' },
      { status: 403 },
    );
  }

  if (!HIEU_API_SERVICE_TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'service_unavailable' },
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

  // Forward the caller's Supabase access token so the worker can verify
  // identity and derive user_id server-side (mirrors /payment/intent).
  const authz = req.headers.get('authorization');
  // Forward the REAL client IP so the worker can rate-limit per buyer. Without
  // this, every call reaches the worker from this Vercel function's shared egress
  // IP, turning the worker's per-IP coupon-validate cap into a near-global one
  // (a promo burst would then wrongly reject everyone's valid codes).
  const clientIp = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip');

  try {
    const res = await fetch(`${HIEU_API_URL}/payment/validate-code`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Service-Token': HIEU_API_SERVICE_TOKEN,
        ...(authz ? { authorization: authz } : {}),
        ...(clientIp ? { 'x-forwarded-for': clientIp } : {}),
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
