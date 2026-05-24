/**
 * Wave 56 Phase 2.6.C — Pre-call reasoning cost guard.
 *
 * Sits in front of every reasoning route. Three responsibilities:
 *
 *   1. Honor the global kill switch (Edge Config) — return 503 if set
 *   2. Identify the subject (user_id or hashed anon IP)
 *   3. Atomically reserve the estimated budget vs the per-day cap; reject
 *      with 402 if exceeded
 *
 * Usage from a route handler:
 *
 *   const guard = await assertCostGuard({
 *     graph: 'tu-vi',                 // picks worst-case estimate
 *     userId: session?.user.id,       // null/undefined → anon
 *     headers: req.headers,           // for IP-hash anon subject_key
 *   });
 *   if (!guard.ok) return guard.response; // 503 kill / 402 cap / 500 error
 *   // …proceed with graph dispatch…
 *
 * The estimated cost is intentionally pessimistic — we pre-charge the
 * worst-case from the graph's known cost ceiling. If the actual run comes
 * in under, that's fine: tomorrow's reset gives the budget back. We do NOT
 * refund mid-day overages (see migration 0031 comment for rationale).
 *
 * Subject key derivation:
 *   - authed: "user:<uuid>"
 *   - anon: "anon:<sha256(ip + visitorId + 'reasoning-cost-guard-v1')>".
 *     NO date salt inside the hash — the (subject_key, day) primary key on
 *     reasoning_daily_cost is the SOLE daily-rotation mechanism. /ultrareview
 *     Phase 2.6.1 P1-4 removed an earlier date-in-hash variant that created
 *     a dual-clock midnight-rollover race (JS computed yesterday pre-midnight
 *     while the RPC computed today post-midnight → cap bypass for ~1s/day).
 *     Re-introducing date here would re-open that race.
 *
 *     If a `hieu_visitor` cookie is present (set by Wave 41 attribution),
 *     mix it into the hash so 50 office workers behind one NAT don't share
 *     one $0.50 bucket. Cookie is opaque (no PII) and resets with browser.
 *
 * IP source: prefer `x-real-ip`, then first `x-forwarded-for`, then a
 * sentinel. Vercel sets `x-real-ip` for every request behind the edge —
 * spoofing requires Vercel's infra cooperation. We still cap the value at
 * 64 chars before hashing (sha256 doesn't care, but a 64KB header would
 * burn CPU on no-op).
 *
 * Failure modes:
 *   - Edge Config down → DEFAULTS used (see runtime-config.ts)
 *   - Supabase RPC down → guard returns 503 with `error: 'guard_unavailable'`
 *     (fail CLOSED — never let a billing leak happen because the guard is
 *     temporarily down)
 *   - subject_key collision → impossible by construction (uuid or sha256)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getReasoningConfig } from './runtime-config';

/** Worst-case cost ceiling per graph kind. Pessimistic on purpose. */
const ESTIMATED_COST_USD: Record<GraphKind, number> = {
  // Tử Vi: 12 palace × mid + cross-ref mid + synthesize top → ~$1.74 typical,
  // bump to $2.20 for fallback retries + token bloat headroom.
  'tu-vi': 2.2,
  // Bát Tự: 4 pillar × mid + balance mid + synthesize top → ~$1.01 typical.
  'bat-tu': 1.4,
  // Palm: vision describe + 1 mid + synthesize top → ~$0.40 typical.
  'palm': 0.6,
};

export type GraphKind = 'tu-vi' | 'bat-tu' | 'palm';

interface AssertArgs {
  graph: GraphKind;
  /**
   * Authed user UUID. REQUIRED in Wave 58 — anon callers are rejected by
   * the route's session-auth gate before reaching this guard. Kept as a
   * required string (not nullable) so a future refactor that drops the
   * route-level gate fails the type check instead of silently going anon.
   */
  userId: string;
  /** Request headers — currently only used for IP-hash fallback paths
   * (none today; kept for forward-compat with admin overrides etc.). */
  headers: Headers;
}

export type AssertResult =
  | { ok: true; subjectKey: string; reservedUsd: number; capUsd: number }
  | { ok: false; response: NextResponse };

/** SHA-256 hex digest. No date salt — daily rotation is handled by the
 * (subject_key, day) primary key on reasoning_daily_cost (see top-of-file
 * docstring). Re-adding a date salt here would re-open the Phase 2.6.1 P1-4
 * midnight-rollover race. */
async function sha256Hex(s: string): Promise<string> {
  const bytes = new TextEncoder().encode(s);
  const buf = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Cap at 64 chars — IPv6 max is 45, so this is generous and prevents
 * accidental 64KB-header CPU burn. /ultrareview Phase 2.6.1 P1-5 fix. */
function getClientIp(headers: Headers): string {
  const real = headers.get('x-real-ip');
  if (real) return real.slice(0, 64);
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim().slice(0, 64);
  return 'unknown';
}

/** Read the opaque `hieu_visitor` cookie (set by Wave 41 attribution). */
function getVisitorId(headers: Headers): string {
  const cookie = headers.get('cookie') ?? '';
  const match = cookie.match(/(?:^|;\s*)hieu_visitor=([^;]+)/);
  if (!match) return '';
  // Strip URL-encoding + cap at 64 chars (visitor IDs are sha256-hex = 64 chars).
  try {
    return decodeURIComponent(match[1]!).slice(0, 64);
  } catch {
    return match[1]!.slice(0, 64);
  }
}

let _supabase: ReturnType<typeof createClient> | null = null;
function getServiceRoleClient() {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('cost-guard: SUPABASE env required');
  _supabase = createClient(url, key, { auth: { persistSession: false } });
  return _supabase;
}

/**
 * Run the kill-switch + cap check.
 *
 * Returns ok:true with the subject_key (route should pass it to logging) or
 * ok:false with a ready-to-return NextResponse. Caller does not need to
 * format error messages.
 */
export async function assertCostGuard(args: AssertArgs): Promise<AssertResult> {
  const cfg = await getReasoningConfig();

  // ─── Kill switch ─────────────────────────────────────────────────────
  if (cfg.killSwitch) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          ok: false,
          error: 'reasoning_disabled',
          reason: cfg.killSwitchReason || 'Tạm dừng phân tích để bảo trì. Vui lòng thử lại sau.',
        },
        { status: 503, headers: { 'Retry-After': '300' } },
      ),
    };
  }

  // ─── Subject key + cap pick ──────────────────────────────────────────
  //
  // Phase 2.6.1 fix (P1-4): NO date salt in the hash. The (subject_key, day)
  // PK on reasoning_daily_cost handles daily rotation by row keying. Putting
  // date in the hash too created a midnight-rollover race where JS computed
  // yesterday's date and SQL computed today's — for ~1s/day the cap could
  // be bypassed.
  //
  // P2-1 fix: mix in `hieu_visitor` cookie when present so 50 office workers
  // behind one NAT don't share one $0.50 bucket. Cookie is opaque attribution
  // ID set by Wave 41; resets with browser. No PII.
  let subjectKey: string;
  let capUsd: number;
  // Proper UUID v4-style regex (Phase 2.6.1 P2-5): the old /^[0-9a-f-]{36}$/i
  // accepted 36 hyphens. Strict shape now: 8-4-4-4-12 hex.
  if (
    args.userId &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(args.userId)
  ) {
    subjectKey = `user:${args.userId}`;
    capUsd = cfg.capUsdPerDayAuthed;
  } else {
    const ip = getClientIp(args.headers);
    const visitorId = getVisitorId(args.headers);
    const hash = await sha256Hex(`${ip}|${visitorId}|reasoning-cost-guard-v1`);
    subjectKey = `anon:${hash}`;
    capUsd = cfg.capUsdPerDayAnon;
  }

  // ─── Atomic check + reserve via Supabase RPC ─────────────────────────
  const estimated = ESTIMATED_COST_USD[args.graph];
  try {
    const sb = getServiceRoleClient();
    const { data, error } = await sb.rpc(
      'check_and_increment_reasoning_cost' as never,
      {
        p_subject_key: subjectKey,
        p_estimated_cost_usd: estimated,
        p_cap_usd: capUsd,
      } as never,
    );
    if (error) {
      // FAIL CLOSED — better to deny a few legitimate requests during a
      // Supabase blip than to leak budget. The user gets a clear "try again
      // in a moment" rather than a runaway charge.
      return {
        ok: false,
        response: NextResponse.json(
          { ok: false, error: 'guard_unavailable', detail: error.message },
          { status: 503, headers: { 'Retry-After': '30' } },
        ),
      };
    }
    const parsed = data as { allowed: boolean; current_usd: number; cap_usd: number; day: string };
    if (!parsed.allowed) {
      const remainingSeconds = secondsUntilUtcMidnight();
      return {
        ok: false,
        response: NextResponse.json(
          {
            ok: false,
            error: 'daily_cap_exceeded',
            current_usd: parsed.current_usd,
            cap_usd: parsed.cap_usd,
            day: parsed.day,
            // Vietnamese-friendly message for the UI — server-side i18n
            // keeps the client truly thin.
            message: args.userId
              ? `Bạn đã dùng hết quota AI hôm nay ($${parsed.cap_usd}). Quota sẽ làm mới sau ${formatRetry(remainingSeconds)}.`
              : `Bạn đã dùng hết quota miễn phí hôm nay ($${parsed.cap_usd}). Đăng nhập để nhận quota lớn hơn, hoặc thử lại sau ${formatRetry(remainingSeconds)}.`,
          },
          { status: 402, headers: { 'Retry-After': String(remainingSeconds) } },
        ),
      };
    }
    return { ok: true, subjectKey, reservedUsd: estimated, capUsd };
  } catch (err) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          ok: false,
          error: 'guard_unavailable',
          detail: err instanceof Error ? err.message : String(err),
        },
        { status: 503, headers: { 'Retry-After': '30' } },
      ),
    };
  }
}

function secondsUntilUtcMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);
  return Math.max(60, Math.ceil((midnight.getTime() - now.getTime()) / 1000));
}

function formatRetry(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  if (h >= 1) return `${h} giờ`;
  const m = Math.floor(seconds / 60);
  return `${m} phút`;
}
