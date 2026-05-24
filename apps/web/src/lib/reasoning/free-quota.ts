/**
 * Wave 58 Phase A — Free reading quota helper.
 *
 * Calls the `check_free_reading_quota(uuid)` SECURITY DEFINER RPC and shapes
 * its result into a typed `{ok, response?}` that reasoning routes can return
 * directly on rejection.
 *
 * Quota policy (canonical in SQL migration 0032):
 *   - Subscription tiers (monthly / yearly / lifetime): unlimited reads up to
 *     the per-day cost-guard cap (Phase 2.6).
 *   - Free tier: 1 reading per rolling 30 days. After exhaustion → 402 with
 *     Vietnamese upsell message + Premium/Monthly comparison.
 *   - Premium (one-shot 99k): currently treated as 'free' here — the
 *     pay-per-reading flow at unlock time bypasses this gate via a separate
 *     code path (deferred to Wave 58.1 credit ledger).
 *
 * Why a thin wrapper:
 *   - Reasoning routes shouldn't know about jsonb/RPC shapes
 *   - Vietnamese error copy lives next to the upsell URL in one place
 *   - Easier to swap to a credit-based ledger later (only this file changes)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

let _supabase: ReturnType<typeof createClient> | null = null;
function getServiceRoleClient() {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('free-quota: SUPABASE service-role env required');
  _supabase = createClient(url, key, { auth: { persistSession: false } });
  return _supabase;
}

/**
 * Coarse upsell-variant enum derived from the plan string. Used as the
 * route's public-facing surface instead of leaking the literal plan
 * (`/ultrareview Wave 58 P2-1`: `plan='lifetime'` in a response body tells an
 * attacker this account paid 4.99M VND → targeted phishing seed). The UI only
 * branches on three states anyway.
 */
export type UpsellVariant = 'subscriber' | 'free' | 'free_quota_exhausted';

function planToUpsellVariant(plan: string, quotaExhausted: boolean): UpsellVariant {
  if (plan === 'subscription_monthly' || plan === 'subscription_yearly' || plan === 'lifetime') {
    return 'subscriber';
  }
  return quotaExhausted ? 'free_quota_exhausted' : 'free';
}

export type QuotaResult =
  | { ok: true; upsellVariant: UpsellVariant }
  | { ok: false; response: NextResponse };

interface RpcShape {
  allowed: boolean;
  plan: string;
  reason: string;
  used_count?: number;
  limit?: number;
  window_days?: number;
}

/**
 * Check whether `userId` may consume one more reading right now.
 *
 * Returns ok:true with the plan name (for telemetry/agent_runs tagging) when
 * the user is allowed. Returns ok:false with a ready-to-return 402 NextResponse
 * when the free quota is exhausted, or 503 if the RPC errors (fail closed —
 * a billing leak is worse than a few denied legit calls).
 */
export async function assertFreeQuota(userId: string): Promise<QuotaResult> {
  try {
    const { data, error } = await getServiceRoleClient().rpc(
      'check_free_reading_quota' as never,
      { p_user_id: userId } as never,
    );
    if (error) {
      // /ultrareview Wave 58 P3 fix: don't leak Supabase internals to the
      // client. Log server-side; client gets a generic message.
      console.error('[free-quota] supabase rpc error:', error.message);
      return {
        ok: false,
        response: NextResponse.json(
          { ok: false, error: 'quota_check_unavailable' },
          { status: 503, headers: { 'Retry-After': '30' } },
        ),
      };
    }
    const parsed = data as RpcShape;
    if (parsed.allowed) {
      // P2-1: emit the coarse upsell variant — never the literal plan name.
      return {
        ok: true,
        upsellVariant: planToUpsellVariant(parsed.plan, false),
      };
    }
    // Free quota exhausted. Compose a Vietnamese upsell.
    // /ultrareview Wave 58.1 F1 fix: do NOT emit `parsed.plan` literal here.
    // Subscriber early-return at line 92 means this branch only fires for
    // 'free'/'premium' today, but a future tier added between early-return and
    // this point would leak. Use the coarse upsell_variant enum, consistent
    // with the success path.
    const used = parsed.used_count ?? 1;
    const limit = parsed.limit ?? 1;
    const window = parsed.window_days ?? 30;
    return {
      ok: false,
      response: NextResponse.json(
        {
          ok: false,
          error: 'free_quota_exhausted',
          upsell_variant: 'free_quota_exhausted' as const,
          used_count: used,
          limit,
          window_days: window,
          message: `Bạn đã dùng hết ${limit} lượt phân tích miễn phí trong ${window} ngày. Mở khoá Premium để xem thêm — hoặc đăng ký Monthly để không giới hạn.`,
          upgrade_url: '/pricing',
          // Also include 99k single-shot and monthly comparison so the client
          // UI can render two buttons without another fetch.
          options: [
            { tier: 'premium', vnd: 99_000, label: '1 reading sâu (99.000đ)', href: '/pricing#premium' },
            { tier: 'monthly', vnd: 199_000, label: 'Unlimited tháng (199.000đ)', href: '/pricing#monthly' },
          ],
        },
        {
          status: 402,
          headers: { 'Cache-Control': 'no-store' },
        },
      ),
    };
  } catch (err) {
    // /ultrareview Wave 58.1 F2 fix: log server-side only. The JS-throw path
    // (Supabase client constructor failure, network reject pre-RPC) shouldn't
    // contain SQL fragments, but stack traces and env-var error messages still
    // leak infra hints. Generic 503 + retry; ops see detail in Vercel logs.
    console.error('[free-quota] exception:', err instanceof Error ? err.message : err);
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: 'quota_check_unavailable' },
        { status: 503, headers: { 'Retry-After': '30' } },
      ),
    };
  }
}
