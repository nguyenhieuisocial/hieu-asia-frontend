/**
 * Server-side proxy: POST /api/email/subscribe.
 *
 * Accepts { email, source?, interest?, path? } from the public site and:
 *   1. Forwards to the api-gateway `/email/subscribe` endpoint (legacy/dual-
 *      write) for backwards compatibility with the existing worker pipeline.
 *   2. Writes the contact into a Resend Audience so the founder can run
 *      segmented broadcast campaigns (Wave 60.95.w — vault note 93h).
 *
 * Wave 60.95.w — Resend Audiences integration:
 *   - Requires `RESEND_API_KEY` and `RESEND_NEWSLETTER_AUDIENCE_ID`. If either
 *     is unset, the Audience write is skipped silently (the gateway forward
 *     and the user-facing 200 response are unaffected).
 *   - Per-subscriber metadata (`source`, `interest`, `signup_path`) is stored
 *     via Resend's `properties` field, enabling segment filters like
 *     "interest=tu-vi AND source=archive". Tag schema lives in vault 93h.
 *   - Duplicate signups return 200 (Resend's contacts.create surfaces a
 *     422-style "already exists" payload — we treat it as `alreadySubscribed`
 *     for parity with the gateway response shape).
 *
 * Rate-limited by Cloudflare upstream; no auth required.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { checkBotId } from 'botid/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Whitelist of accepted interest tags — matches vault note 93h. We reject
// freeform interest strings server-side so an attacker can't pollute the
// Audience properties with arbitrary keys before segment filters lock in.
const INTEREST_TAGS = new Set([
  'tu-vi',
  'bat-tu',
  'mbti',
  'phan-van',
  'archive',
  'general',
]);

interface SubscribeBody {
  email?: unknown;
  source?: unknown;
  interest?: unknown;
  path?: unknown;
}

/**
 * Side-effect: try to write the contact to the configured Resend Audience.
 *
 * Returns `'added' | 'duplicate' | 'skipped' | 'error'` so the caller can
 * (optionally) reflect "already subscribed" in the response. NEVER throws —
 * Audience write must not break the signup flow if Resend is degraded or the
 * env vars haven't been set yet.
 */
async function writeToAudience(args: {
  email: string;
  source: string;
  interest: string;
  signupPath: string;
}): Promise<'added' | 'duplicate' | 'skipped' | 'error'> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_NEWSLETTER_AUDIENCE_ID;
  if (!apiKey || !audienceId) return 'skipped';

  try {
    const resend = new Resend(apiKey);
    const result = await resend.contacts.create({
      audienceId,
      email: args.email,
      unsubscribed: false,
      properties: {
        source: args.source,
        interest: args.interest,
        signup_path: args.signupPath,
        signed_up_at: new Date().toISOString(),
      },
    });
    if (result.error) {
      const msg = result.error.message?.toLowerCase() ?? '';
      // Resend returns 422 with a "contact already exists" message; we
      // treat that as a successful duplicate rather than an error.
      if (msg.includes('already') || msg.includes('exists')) {
        return 'duplicate';
      }
      console.warn('[email/subscribe] resend audience write failed', {
        err: result.error.message,
      });
      return 'error';
    }
    return 'added';
  } catch (e) {
    console.warn('[email/subscribe] resend audience write threw', {
      err: e instanceof Error ? e.message : e,
    });
    return 'error';
  }
}

export async function POST(req: NextRequest) {
  // Reject automated floods before any work — mirrors the 5 sibling paid/LLM
  // routes. Stops a bot from burning the Resend contact quota / polluting the
  // newsletter Audience via this public, unauthenticated endpoint.
  const botCheck = await checkBotId();
  if (botCheck.isBot) {
    return NextResponse.json({ ok: false, error: 'bot_detected' }, { status: 403 });
  }

  let body: SubscribeBody;
  try {
    body = (await req.json()) as SubscribeBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const source = typeof body.source === 'string' ? body.source.slice(0, 32) : 'web';
  const interestRaw =
    typeof body.interest === 'string' ? body.interest.trim().toLowerCase() : '';
  const interest = INTEREST_TAGS.has(interestRaw) ? interestRaw : 'general';
  const signupPath =
    typeof body.path === 'string' ? body.path.slice(0, 128) : '/';

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
  let alreadySubscribedUpstream: boolean | undefined;
  let upstreamAccepted = false;
  try {
    // Forward the real client IP so the worker's per-IP rate-limit is
    // per-attacker, not per-Vercel-egress-IP (copies the validate-code pattern).
    const clientIp = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip');
    const upstream = await fetch(`${HIEU_API_URL}/email/subscribe`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(clientIp ? { 'x-forwarded-for': clientIp } : {}),
      },
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
    // 4xx from worker — surface the message (e.g. "Email không hợp lệ").
    if (upstream.status >= 400 && upstream.status < 500) {
      return NextResponse.json(
        { ok: false, error: data.error ?? 'Đăng ký không thành công' },
        { status: upstream.status },
      );
    }
    if (upstream.ok && data.ok) {
      alreadySubscribedUpstream = data.alreadySubscribed;
      upstreamAccepted = true;
    }
    // 5xx — degrade silently below; we still attempt the Audience write.
  } catch {
    /* network / timeout — degrade silently below */
  }

  // Dual-write to Resend Audience — ONLY when the worker accepted the request
  // (2xx + ok). On worker 429/5xx/timeout we skip it, so the CloudFlare rate-
  // limit also governs Resend (was: always wrote → a worker outage became an
  // unthrottled Resend flood). Trade-off: a lead lost during a worker partition
  // isn't captured in Resend — acceptable at pre-launch volume.
  const audienceResult = upstreamAccepted
    ? await writeToAudience({ email, source, interest, signupPath })
    : 'skipped';
  const alreadySubscribed =
    alreadySubscribedUpstream ?? (audienceResult === 'duplicate' ? true : undefined);

  return NextResponse.json({ ok: true, alreadySubscribed });
}
