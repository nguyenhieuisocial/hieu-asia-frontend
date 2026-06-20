/**
 * SubscriptionCheckout — SESSION-LESS QR checkout for subscription/lifetime tiers.
 *
 * Mirrors `unlock/[session_id]/PaymentClient.tsx` but with two key differences:
 *
 *  1. NO session_id. A subscription/lifetime purchase isn't bound to a reading.
 *     It POSTs `/api/payment/intent` with just `{ tier }`; the worker derives the
 *     buyer's user_id from the verified Supabase JWT and the webhook's Stage B
 *     attaches the plan to that account.
 *
 *  2. LOGIN REQUIRED. A plan must attach to an account, so an anonymous buyer is
 *     sent to /signin?next=/checkout/{slug} instead of minting an `anon-*` intent
 *     (which would have nowhere to land the plan). We only create the intent once
 *     we have a Bearer token.
 *
 * On `status === 'paid'` there is NO reading to redirect to → we show an
 * activation success state linking to /account (not /reading).
 *
 * Reused contract (from PaymentClient): POST /api/payment/intent → { ok, intent },
 * GET /api/payment/intent/{id} polled every 5s, `streak_voucher: true` to apply a
 * voucher, analytics `payment_intent_created` / `payment_completed`.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { QRDisplay, type PaymentIntent } from '@/components/payment/QRDisplay';
import { track } from '@/lib/analytics';
import { safeJson } from '@/lib/safe-json';
import { getSupabaseAuth } from '@/lib/auth-client';
import { getVoucher, type VoucherInfo } from '@/lib/daily-checkin';

type SubscriptionTier =
  | 'subscription_monthly'
  | 'subscription_yearly'
  | 'lifetime_onetime';

const POLL_INTERVAL_MS = 5_000;

/** Maps tier → the /checkout/{slug} path used for the signin `next` round-trip. */
const TIER_CHECKOUT_SLUG: Record<SubscriptionTier, string> = {
  subscription_monthly: 'mentor',
  subscription_yearly: 'yearly',
  lifetime_onetime: 'lifetime',
};

/** Human label for the success copy ("Đã kích hoạt gói … cho tài khoản"). */
const TIER_LABEL: Record<SubscriptionTier, string> = {
  subscription_monthly: 'Mentor (hàng tháng)',
  subscription_yearly: 'Mentor (hàng năm)',
  lifetime_onetime: 'Lifetime (trọn đời)',
};

interface SubscriptionCheckoutProps {
  tier: SubscriptionTier;
}

interface IntentEnvelope {
  ok: boolean;
  intent?: PaymentIntent;
  error?: string;
}

/** Auth state machine: null = still checking, false = signed out, string = token. */
type AuthState = string | false | null;

async function resolveToken(): Promise<string | false> {
  if (typeof window === 'undefined') return false;
  try {
    const supa = getSupabaseAuth();
    if (!supa) return false;
    const { data } = await supa.auth.getSession();
    return data.session?.access_token ?? false;
  } catch {
    return false;
  }
}

async function createIntent(
  token: string,
  tier: SubscriptionTier,
  applyVoucher = false,
): Promise<PaymentIntent> {
  const res = await fetch('/api/payment/intent', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    // Session-less: NO session_id, NO user_id. The worker derives user_id from
    // the verified JWT (Authorization header) and the amount from the tier.
    body: JSON.stringify({
      tier,
      ...(applyVoucher ? { streak_voucher: true } : {}),
    }),
    cache: 'no-store',
  });
  const parsed = await safeJson<IntentEnvelope>(res);
  if (!parsed.ok) {
    throw new Error(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
  }
  const body = parsed.data;
  if (!res.ok || !body.ok || !body.intent) {
    throw new Error(body.error ?? `Tạo giao dịch thất bại (${res.status})`);
  }
  return body.intent;
}

async function pollIntent(id: string): Promise<PaymentIntent> {
  const res = await fetch(`/api/payment/intent/${encodeURIComponent(id)}`, {
    method: 'GET',
    cache: 'no-store',
  });
  const parsed = await safeJson<IntentEnvelope>(res);
  if (!parsed.ok) {
    throw new Error(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
  }
  const body = parsed.data;
  if (!res.ok || !body.ok || !body.intent) {
    throw new Error(body.error ?? `Không kiểm tra được trạng thái`);
  }
  return body.intent;
}

export function SubscriptionCheckout({ tier }: SubscriptionCheckoutProps) {
  const [auth, setAuth] = React.useState<AuthState>(null);
  const [intent, setIntent] = React.useState<PaymentIntent | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expired, setExpired] = React.useState(false);
  const [attempt, setAttempt] = React.useState(0);
  // Voucher: null = still checking, false = none, VoucherInfo = available
  const [voucher, setVoucher] = React.useState<VoucherInfo | false | null>(null);
  // Whether user chose to apply the voucher (null = undecided, shown as prompt)
  const [applyVoucher, setApplyVoucher] = React.useState<boolean | null>(null);

  const signinHref = `/signin?next=${encodeURIComponent(
    `/checkout/${TIER_CHECKOUT_SLUG[tier]}`,
  )}`;

  // 0a. Resolve auth on mount. A subscription must attach to an account, so we
  //     gate intent creation on a verified token.
  React.useEffect(() => {
    let cancelled = false;
    resolveToken().then((t) => {
      if (!cancelled) setAuth(t);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 0b. Check for streak voucher only once we know the user is authed.
  React.useEffect(() => {
    if (typeof auth !== 'string') return;
    getVoucher().then((v) => setVoucher(v ?? false)).catch(() => setVoucher(false));
  }, [auth]);

  // 1. Create intent once per (tier, attempt, applyVoucher decision), but only
  //    when authenticated AND the voucher decision has resolved.
  const voucherDecided = voucher === false || applyVoucher !== null;
  const authed = typeof auth === 'string';

  React.useEffect(() => {
    if (!authed) return; // signed-out → render the signin gate below
    if (!voucherDecided) return; // waiting for user's voucher decision
    let cancelled = false;
    setLoading(true);
    setError(null);
    setExpired(false);
    setIntent(null);
    createIntent(auth as string, tier, applyVoucher === true)
      .then((i) => {
        if (cancelled) return;
        setIntent(i);
        track('payment_intent_created', { tier, intent_id: i.id, amount: i.amount_due });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, auth, tier, attempt, voucherDecided, applyVoucher]);

  // 2. Poll status every 5s while pending.
  React.useEffect(() => {
    if (!intent) return;
    if (intent.status !== 'pending') return;
    if (expired) return;

    let cancelled = false;
    const tick = async () => {
      try {
        const fresh = await pollIntent(intent.id);
        if (cancelled) return;
        setIntent(fresh);
      } catch {
        // Soft-fail: keep last known state, try again next tick.
      }
    };
    const t = setInterval(tick, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [intent, expired]);

  // 3. On `paid` → fire `payment_completed` once (so it isn't lost if the user
  //    navigates away). No reading exists → success state links to /account.
  const paidTrackedRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (intent?.status === 'paid' && paidTrackedRef.current !== intent.id) {
      paidTrackedRef.current = intent.id;
      track('payment_completed', { tier, intent_id: intent.id, amount: intent.amount_due });
    }
  }, [intent?.status, intent?.id, intent?.amount_due, tier]);

  const handleRetry = React.useCallback(() => {
    setAttempt((n) => n + 1);
  }, []);

  const handleExpire = React.useCallback(() => {
    setExpired(true);
  }, []);

  // Still resolving auth — brief neutral state.
  if (auth === null) {
    return (
      <Card className="border-gold/15 bg-card/40">
        <CardContent className="space-y-3 p-8 text-center">
          <p className="font-heading text-foreground">Đang kiểm tra tài khoản…</p>
          <div className="mx-auto h-2 w-32 animate-pulse rounded bg-muted/10" />
        </CardContent>
      </Card>
    );
  }

  // Signed out — a subscription/lifetime must attach to an account, so require
  // login before minting an intent. Round-trip back to this checkout after auth.
  if (auth === false) {
    return (
      <Card className="border-gold/30 bg-gold/[0.05]">
        <CardContent className="space-y-4 p-8 text-center">
          <p className="font-heading text-xl text-foreground">
            Đăng nhập để mua gói
          </p>
          <p className="text-sm text-muted-foreground">
            Gói thuê bao và trọn đời được gắn vào tài khoản của bạn, nên cần đăng
            nhập trước khi thanh toán. Sau khi đăng nhập bạn sẽ quay lại trang này.
          </p>
          <Link
            href={signinHref}
            className="inline-flex items-center justify-center rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-black transition hover:bg-gold/90"
          >
            Đăng nhập để tiếp tục →
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Voucher prompt — shown while a voucher is available and the user hasn't
  // decided yet. Momentarily delays QR creation so the discount is a conscious choice.
  if (voucher && applyVoucher === null) {
    return (
      <Card className="border-gold/30 bg-gold/[0.05]">
        <CardContent className="space-y-4 p-8 text-center">
          <p className="font-heading text-xl text-foreground">
            <span aria-hidden>🎁</span>{' '}
            {voucher.type === 'vref' ? 'Bạn có voucher giới thiệu!' : 'Bạn có voucher điểm danh!'}
          </p>
          <p className="text-sm text-muted-foreground">
            {voucher.type === 'vref'
              ? 'Phần thưởng từ chương trình giới thiệu của bạn. '
              : 'Chuỗi điểm danh của bạn đã đạt mốc phần thưởng. '}
            Voucher giảm <strong className="text-gold-700 font-semibold">{voucher.discount_pct}%</strong> cho gói này.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              onClick={() => setApplyVoucher(true)}
              className="bg-gold text-black hover:bg-gold/90"
            >
              Áp dụng -{voucher.discount_pct}%
            </Button>
            <Button
              variant="outline"
              onClick={() => setApplyVoucher(false)}
              className="border-border text-muted-foreground"
            >
              Bỏ qua, dùng sau
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-gold/15 bg-card/40">
        <CardContent className="space-y-3 p-8 text-center">
          <p className="font-heading text-foreground">Đang tạo giao dịch…</p>
          <div className="mx-auto h-2 w-32 animate-pulse rounded bg-muted/10" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/30 bg-card/40">
        <CardContent className="space-y-4 p-8 text-center">
          <p className="font-heading text-foreground">
            Không thể tạo giao dịch
          </p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={handleRetry}>Thử lại</Button>
        </CardContent>
      </Card>
    );
  }

  if (!intent) {
    return (
      <Card className="border-gold/15 bg-card/40">
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          Không có dữ liệu giao dịch.
        </CardContent>
      </Card>
    );
  }

  // Paid → activation success. There is NO reading to redirect to; the plan is
  // attached to the account server-side (webhook Stage B), so we point the user
  // to /account where the active plan now shows.
  if (intent.status === 'paid') {
    return (
      <Card className="border-emerald-500/30 bg-emerald-500/[0.05]">
        <CardContent className="space-y-4 p-8 text-center">
          <p className="font-heading text-xl text-foreground">
            <span aria-hidden>✓</span> Thanh toán thành công
          </p>
          <p className="text-sm text-muted-foreground">
            Đã kích hoạt gói <strong className="text-foreground">{TIER_LABEL[tier]}</strong>{' '}
            cho tài khoản của bạn. Bạn có thể bắt đầu dùng ngay.
          </p>
          <Link
            href="/account"
            className="inline-flex items-center justify-center rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-black transition hover:bg-gold/90"
          >
            Tới tài khoản của tôi →
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Treat both upstream "expired" and local countdown-zero the same.
  const showExpired =
    expired ||
    intent.status === 'expired' ||
    intent.status === 'cancelled';

  if (showExpired) {
    return (
      <div className="space-y-4">
        <QRDisplay
          intent={{ ...intent, status: 'expired' }}
          onExpire={handleExpire}
        />
        <Card className="border-red-500/30 bg-card/40">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <p className="font-heading text-foreground">
              Giao dịch đã hết hạn
            </p>
            <p className="text-sm text-muted-foreground">
              Mã QR chỉ có hiệu lực trong 15 phút. Bạn có thể tạo lại để
              tiếp tục.
            </p>
            <Button onClick={handleRetry}>Tạo lại giao dịch</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <QRDisplay intent={intent} onExpire={handleExpire} />
      {intent.status === 'pending' && (
        <p className="text-center text-xs text-muted-foreground">
          Trang sẽ tự kích hoạt gói sau khi xác nhận thanh toán thành công.
        </p>
      )}
    </div>
  );
}
