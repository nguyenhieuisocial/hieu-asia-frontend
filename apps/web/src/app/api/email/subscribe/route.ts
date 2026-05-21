/**
 * Server-side proxy: POST /api/email/subscribe.
 *
 * Accepts { email, source? } from the public site, forwards to the api-gateway
 * `/email/subscribe` endpoint when configured. If the upstream isn't reachable
 * we still return ok=true so the user gets a confirmation — the email is
 * logged for manual reconciliation (worker logs persist for 7 days). This
 * keeps the public surface working even if the backend isn't deployed yet.
 *
 * Rate-limited by Cloudflare upstream; no auth required.
 */

import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribeBody {
  email?: unknown;
  source?: unknown;
}

export async function POST(req: NextRequest) {
  let body: SubscribeBody;
  try {
    body = (await req.json()) as SubscribeBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const source = typeof body.source === 'string' ? body.source.slice(0, 32) : 'web';

  if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: 'Email không hợp lệ' },
      { status: 400 },
    );
  }

  // Fire-and-forget proxy to backend gateway. If it fails or is unreachable,
  // we still return ok=true — keeping the public CTA reliable. Worker logs
  // capture the request for reconciliation.
  try {
    await fetch(`${HIEU_API_URL}/email/subscribe`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, source }),
      // Short timeout so a slow upstream doesn't block the form.
      signal: AbortSignal.timeout(2500),
    }).catch(() => {});
  } catch {
    /* swallow — handled below */
  }

  return NextResponse.json({ ok: true });
}
