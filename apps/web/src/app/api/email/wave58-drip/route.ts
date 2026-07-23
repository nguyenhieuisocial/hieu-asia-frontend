/**
 * Wave 58 Phase B — Drip-email dispatcher.
 *
 * POST /api/email/wave58-drip
 * Header: X-Cron-Secret: <WAVE58_DRIP_CRON_SECRET>
 * Body:   { user_id: string, email_kind: 'welcome'|'careers'|'premium-drill'|'lifetime-offer'|'winback' }
 *
 * Flow per call (one user × one kind):
 *   1. Verify cron secret (timing-safe) — only Supabase pg_cron should call us.
 *   2. Resend domain check: hieu.asia must be `verified` (DKIM+SPF). If not →
 *      503 with explicit message, no send attempted. This is a safety gate so
 *      a misconfigured domain doesn't burn deliverability via Resend's
 *      sandbox fallback.
 *   3. Consent gate — `hieu_asia.users.email_opted_out IS NOT TRUE`. Default
 *      include (i.e. NULL = opted-in). Column may not exist yet → graceful
 *      degrade to "send" so we don't block on a migration.
 *   4. Load user (display name, email, plan snapshot, latest run_id) — single
 *      RPC round-trip ideal, but plain selects are fine at our volume.
 *   5. Render React Email template → HTML.
 *   6. Send via Resend with Idempotency-Key = `${user_id}:${email_kind}` so a
 *      retry inside 24h doesn't double-send.
 *   7. Stamp email_drip_log.sent_at on Resend ACK.
 *
 * Why per-(user,kind) instead of a batch endpoint:
 *   - One RPC tick = one HTTP call → simpler retries; pg_cron handles the
 *     loop server-side via `dispatch_wave58_drip()`.
 *   - Failure of one user doesn't poison the batch — Postgres just re-queues
 *     on the next 30-min tick.
 *
 * Resend domain status caveat:
 *   At time of writing this scaffold the founder still needs to verify
 *   `hieu.asia` DKIM+SPF in the Resend dashboard. Until verification, this
 *   endpoint will 503 every call — log entries make the gap visible without
 *   sending broken mail.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { timingSafeEqual, createHmac } from 'node:crypto';
import { GENERIC_ERROR_DETAIL } from '@/lib/safe-error';

import WelcomeEmail from '@/emails/wave58/welcome';
import CareersEmail from '@/emails/wave58/careers';
import PremiumDrillEmail from '@/emails/wave58/premium-drill';
import LifetimeOfferEmail from '@/emails/wave58/lifetime-offer';
import WinbackEmail from '@/emails/wave58/winback';
import type { Wave58EmailProps } from '@/emails/wave58/welcome';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type EmailKind = 'welcome' | 'careers' | 'premium-drill' | 'lifetime-offer' | 'winback';

const KIND_TO_SUBJECT: Record<EmailKind, string> = {
  welcome: 'Bản phân tích của bạn đã sẵn sàng',
  careers: 'Reading nói gì về sự nghiệp của bạn?',
  'premium-drill': '2 thứ Premium làm được mà bản miễn phí không',
  'lifetime-offer': 'Lifetime 4.99tr — bằng giá 25 tháng Monthly',
  winback: 'Một ưu đãi 10% — dành riêng cho bạn',
};

const FROM_ADDR = 'hieu.asia <noreply@hieu.asia>';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hieu.asia';

// ────────────────────────────────────────────────────────────────────────────
// Helpers

function timingSafeStringEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

/**
 * Two clients: one bound to `hieu_asia` (users, email_drip_log) and one
 * default-schema (`public`) for agent_runs. Avoids per-call header juggling.
 */
function getSupabase(schema: 'hieu_asia' | 'public' = 'public') {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('wave58-drip: SUPABASE env required');
  return createClient(url, key, {
    auth: { persistSession: false },
    db: { schema },
  });
}

function signUnsubscribeToken(userId: string): string {
  const secret = process.env.UNSUBSCRIBE_HMAC_SECRET;
  if (!secret) throw new Error('wave58-drip: UNSUBSCRIBE_HMAC_SECRET required');
  const sig = createHmac('sha256', secret).update(userId).digest('hex').slice(0, 32);
  return `${userId}.${sig}`;
}

function pickTemplate(
  kind: EmailKind,
): (props: Wave58EmailProps) => React.ReactElement {
  switch (kind) {
    case 'welcome':
      return WelcomeEmail;
    case 'careers':
      return CareersEmail;
    case 'premium-drill':
      return PremiumDrillEmail;
    case 'lifetime-offer':
      return LifetimeOfferEmail;
    case 'winback':
      return WinbackEmail;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Domain verification cache
//
// Resend's domains.list is fine to call once per warm Lambda but we'd rather
// not hit it on every cron tick. Cache for 10 min — domain status only
// changes on manual flip in their dashboard.

let domainVerifiedAt: number | null = null;
const DOMAIN_CACHE_MS = 10 * 60 * 1000;

async function isDomainVerified(resend: Resend): Promise<boolean> {
  if (domainVerifiedAt && Date.now() - domainVerifiedAt < DOMAIN_CACHE_MS) {
    return true;
  }
  try {
    const { data, error } = await resend.domains.list();
    if (error) {
      console.warn('[wave58-drip] domains.list error', error.message);
      return false;
    }
    const list = (data as { data?: Array<{ name: string; status: string }> })?.data ?? [];
    const hieu = list.find((d) => d.name === 'hieu.asia');
    if (hieu && hieu.status === 'verified') {
      domainVerifiedAt = Date.now();
      return true;
    }
    console.warn('[wave58-drip] hieu.asia not verified', { status: hieu?.status });
    return false;
  } catch (e) {
    console.warn('[wave58-drip] domain check threw', e instanceof Error ? e.message : e);
    return false;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Route handler

interface DripBody {
  user_id?: unknown;
  email_kind?: unknown;
}

export async function POST(req: NextRequest) {
  // 1. Cron secret
  const expected = process.env.WAVE58_DRIP_CRON_SECRET;
  if (!expected) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 500 });
  }
  const got = req.headers.get('x-cron-secret') ?? '';
  if (!timingSafeStringEq(got, expected)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // 2. Parse body
  let body: DripBody;
  try {
    body = (await req.json()) as DripBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const userId = typeof body.user_id === 'string' ? body.user_id : '';
  const kind = body.email_kind as EmailKind;
  if (!userId || !KIND_TO_SUBJECT[kind]) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  // 3. Resend setup + domain verification gate
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'email_disabled', detail: 'RESEND_API_KEY unset' },
      { status: 503 },
    );
  }
  const resend = new Resend(apiKey);

  if (!(await isDomainVerified(resend))) {
    return NextResponse.json(
      {
        ok: false,
        error: 'domain_unverified',
        detail: 'hieu.asia DKIM+SPF not verified in Resend dashboard',
      },
      { status: 503 },
    );
  }

  // 4. Load user + consent + reading snapshot
  // `users` lives in hieu_asia (see migration 0012); `agent_runs` + the new
  // `email_drip_log` live in public — two clients keeps the schema concern
  // explicit instead of header-juggling per call.
  const sbHieu = getSupabase('hieu_asia');
  const sbPublic = getSupabase('public');
  const { data: userRow, error: userErr } = await sbHieu
    .from('users')
    .select('id,email,chart_data,consent_flags,email_opted_out')
    .eq('id', userId)
    .maybeSingle();
  if (userErr || !userRow) {
    console.warn('[wave58-drip] user not found', { userId, err: userErr?.message });
    return NextResponse.json({ ok: false, error: 'user_not_found' }, { status: 404 });
  }
  const user = userRow as {
    id: string;
    email: string | null;
    chart_data: { full_name?: string; birth_year?: number } | null;
    consent_flags: { email_tips?: boolean } | null;
    email_opted_out?: boolean | null;
  };
  if (!user.email) {
    return NextResponse.json({ ok: false, error: 'no_email' }, { status: 422 });
  }
  // Consent gate: explicit opt-out blocks. NULL/undefined = include (legacy
  // users predate the consent flag).
  if (user.email_opted_out === true) {
    return NextResponse.json({ ok: true, skipped: 'opted_out' });
  }
  // Granular consent (consent_flags.email_tips) — only block if explicitly false.
  if (user.consent_flags && user.consent_flags.email_tips === false) {
    return NextResponse.json({ ok: true, skipped: 'email_tips_off' });
  }

  // Latest completed run (for runId + snapshot)
  const { data: runRow } = await sbPublic
    .from('agent_runs')
    .select('run_id,state')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  const run = runRow as
    | { run_id: string; state: { chart?: { displayName?: string; birthYear?: number } } | null }
    | null;
  if (!run) {
    return NextResponse.json({ ok: true, skipped: 'no_completed_run' });
  }

  const userName =
    user.chart_data?.full_name ||
    run.state?.chart?.displayName ||
    user.email.split('@')[0] ||
    'bạn';
  const birthYear = user.chart_data?.birth_year ?? run.state?.chart?.birthYear ?? null;
  const planSnapshot = birthYear ? `lá số ${userName} (${birthYear})` : `lá số ${userName}`;
  const syntheticUrl = `${BASE_URL}/reading/${run.run_id}`;
  const unsubToken = signUnsubscribeToken(userId);
  const unsubscribeUrl = `${BASE_URL}/api/email/unsubscribe?token=${encodeURIComponent(unsubToken)}`;

  // 5. Render template
  const Template = pickTemplate(kind);
  const html = await render(
    Template({ userName, runId: run.run_id, planSnapshot, syntheticUrl, unsubscribeUrl }),
  );

  // 6. Send via Resend with idempotency key
  const idempotencyKey = `${userId}:${kind}`;
  const sendResult = await resend.emails.send(
    {
      from: FROM_ADDR,
      to: [user.email],
      subject: KIND_TO_SUBJECT[kind],
      html,
      headers: {
        // RFC 2369 + RFC 8058. Gmail/Apple Mail show the one-click button.
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    },
    { idempotencyKey },
  );

  if (sendResult.error) {
    console.warn('[wave58-drip] resend send failed', {
      userId,
      kind,
      err: sendResult.error.message,
    });
    return NextResponse.json(
      // Resend's wording stays in the console.warn above; client gets generic.
      { ok: false, error: 'send_failed', detail: GENERIC_ERROR_DETAIL },
      { status: 502 },
    );
  }

  // 7. Stamp log
  const { error: logErr } = await sbPublic
    .from('email_drip_log')
    .upsert(
      {
        user_id: userId,
        email_kind: kind,
        sent_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,email_kind' },
    );
  if (logErr) {
    // Email already left the building. Log but don't fail — the cron job
    // checks email_drip_log next tick, so worst case is a double-send on the
    // SAME tick, which Resend's Idempotency-Key dedupes anyway.
    console.warn('[wave58-drip] log upsert failed', { userId, kind, err: logErr.message });
  }

  return NextResponse.json({ ok: true, id: sendResult.data?.id ?? null });
}
