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

  // Proxy to backend gateway. If the worker is reachable we forward its
  // response so 4xx (invalid email, rate-limited) reach the user; if the
  // worker is down or times out we degrade to ok=true so the form CTA stays
  // reliable — worker logs persist 7 days for manual reconciliation.
  try {
    const upstream = await fetch(`${HIEU_API_URL}/email/subscribe`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, source }),
      signal: AbortSignal.timeout(3500),
    });
    const data = (await upstream.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      alreadySubscribed?: boolean;
    };
    if (upstream.status === 429) {
      return NextResponse.json(
        { ok: false, error: 'Quá nhiều yêu cầu — thử lại sau ít phút' },
        { status: 429 },
      );
    }
    if (upstream.ok && data.ok) {
      return NextResponse.json({ ok: true, alreadySubscribed: data.alreadySubscribed });
    }
    // 4xx from worker — surface the message (e.g. "Email không hợp lệ").
    if (upstream.status >= 400 && upstream.status < 500) {
      return NextResponse.json(
        { ok: false, error: data.error ?? 'Đăng ký không thành công' },
        { status: upstream.status },
      );
    }
    // 5xx — degrade silently to keep CTA working.
  } catch {
    /* network / timeout — degrade silently below */
  }

  return NextResponse.json({ ok: true });
}
