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
 *   - anon: "anon:<sha256(ip + UTC date)>". The UTC date salt rotates the
 *     hash daily — useful because (a) it limits how long an abusive IP is
 *     trackable, (b) it caps the table growth even with millions of unique
 *     IPs over a year.
 *
 * IP source: prefer `x-real-ip`, then first `x-forwarded-for`, then a
 * sentinel. Vercel sets `x-real-ip` for every request behind the edge —
 * spoofing requires Vercel's infra cooperation, so we treat it as trusted.
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
  /** Authed user UUID, or null/undefined for anonymous visitors. */
  userId?: string | null;
  /** Request headers — for IP-hash subject key on anon. */
  headers: Headers;
}

export type AssertResult =
  | { ok: true; subjectKey: string; reservedUsd: number; capUsd: number }
  | { ok: false; response: NextResponse };

/** Hash for anonymous subject key (daily-rotating salt baked into hash input). */
async function sha256Hex(s: string): Promise<string> {
  const bytes = new TextEncoder().encode(s);
  const buf = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function getClientIp(headers: Headers): string {
  // Vercel-trusted. `x-real-ip` is set on every request behind the edge.
  const real = headers.get('x-real-ip');
  if (real) return real;
  const fwd = headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return 'unknown';
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
  let subjectKey: string;
  let capUsd: number;
  if (args.userId && /^[0-9a-f-]{36}$/i.test(args.userId)) {
    subjectKey = `user:${args.userId}`;
    capUsd = cfg.capUsdPerDayAuthed;
  } else {
    const ip = getClientIp(args.headers);
    // Daily-rotating salt: hash inputs include UTC date so the same IP gets
    // a fresh subject_key tomorrow. Caps table cardinality + limits how long
    // an abuser is tracked. The date format YYYY-MM-DD is deterministic.
    const utcDate = new Date().toISOString().slice(0, 10);
    const hash = await sha256Hex(`${ip}|${utcDate}|reasoning-cost-guard-v1`);
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
