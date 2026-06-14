'use client';

/**
 * FeaturePaywall — inline paywall for per-feature unlock.
 *
 * Shows the price, creates a feature_unlock intent, renders QR,
 * polls until paid, then calls onUnlocked(). Mirrors PaymentClient.tsx.
 */

import * as React from 'react';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { QRDisplay, type PaymentIntent } from '@/components/payment/QRDisplay';
import { safeJson } from '@/lib/safe-json';
import { getSupabaseAuth } from '@/lib/auth-client';
import { track } from '@/lib/analytics';

const POLL_INTERVAL_MS = 5_000;

interface FeaturePaywallProps {
  slug: string;
  price: number;
  label?: string;
  /**
   * Optional reading session to unlock after payment. When provided, the
   * intent carries `session_id` so the SePay webhook flips `is_paid` on that
   * specific reading_session (gates reading-get). Used by the locked report
   * gate; omitted for plain per-tool unlocks (xem-tuong, big-five, …).
   */
  sessionId?: string;
  onUnlocked: () => void;
}

interface IntentEnvelope {
  ok: boolean;
  intent?: PaymentIntent;
  error?: string;
}

interface ValidateCodeEnvelope {
  ok: boolean;
  valid?: boolean;
  code?: string;
  discount_pct?: number;
  discounted_amount?: number;
  original_amount?: number;
  reason?: string;
  error?: string;
}

interface ValidatedCode {
  code: string;
  discountedAmount: number;
  discountPct?: number;
}

async function getToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    const sb = getSupabaseAuth();
    if (!sb) return null;
    const { data } = await sb.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

async function createFeatureIntent(
  slug: string,
  sessionId?: string,
  couponCode?: string,
): Promise<PaymentIntent> {
  const token = await getToken();
  const res = await fetch('/api/payment/intent', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      tier: 'feature_unlock',
      tool_slug: slug,
      ...(sessionId ? { session_id: sessionId } : {}),
      ...(couponCode ? { coupon_code: couponCode } : {}),
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

type ValidateResult =
  | { kind: 'valid'; data: ValidatedCode }
  | { kind: 'invalid'; reason: string }
  | { kind: 'error' };

async function validateCode(slug: string, code: string): Promise<ValidateResult> {
  const token = await getToken();
  let res: Response;
  try {
    res = await fetch('/api/payment/validate-code', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        code,
        tier: 'feature_unlock',
        tool_slug: slug,
      }),
      cache: 'no-store',
    });
  } catch {
    return { kind: 'error' };
  }
  const parsed = await safeJson<ValidateCodeEnvelope>(res);
  if (!parsed.ok) return { kind: 'error' };
  const body = parsed.data;
  if (!res.ok || !body.ok) return { kind: 'error' };
  if (!body.valid) {
    return { kind: 'invalid', reason: body.reason ?? 'Mã không hợp lệ' };
  }
  if (typeof body.discounted_amount !== 'number') return { kind: 'error' };
  return {
    kind: 'valid',
    data: {
      code: body.code ?? code,
      discountedAmount: body.discounted_amount,
      discountPct: body.discount_pct,
    },
  };
}

async function pollIntent(id: string): Promise<PaymentIntent> {
  const res = await fetch(
    `/api/payment/intent/${encodeURIComponent(id)}`,
    { method: 'GET', cache: 'no-store' },
  );
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

export function FeaturePaywall({
  slug,
  price,
  label,
  sessionId,
  onUnlocked,
}: FeaturePaywallProps) {
  const [intent, setIntent] = React.useState<PaymentIntent | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [expired, setExpired] = React.useState(false);
  const [attempt, setAttempt] = React.useState(0);

  // Voucher / promo code state (initial price card only).
  const [code, setCode] = React.useState('');
  const [appliedCode, setAppliedCode] = React.useState<string | null>(null);
  const [appliedPrice, setAppliedPrice] = React.useState<number | null>(null);
  const [appliedDiscountPct, setAppliedDiscountPct] = React.useState<number | null>(null);
  const [codeErr, setCodeErr] = React.useState<string | null>(null);
  const [validating, setValidating] = React.useState(false);

  // The intent-creation effect deps are [slug, attempt] only, so read the
  // applied code through a ref to avoid re-running the effect on every code
  // change. Kept in sync below.
  const appliedCodeRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    appliedCodeRef.current = appliedCode;
  }, [appliedCode]);

  const toolLabel = label ?? slug;

  // Create intent when user clicks "Mở khoá" (attempt > 0 after first click).
  React.useEffect(() => {
    if (attempt === 0) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setExpired(false);
    setIntent(null);

    createFeatureIntent(slug, sessionId, appliedCodeRef.current ?? undefined)
      .then((i) => {
        if (cancelled) return;
        setIntent(i);
        track('payment_intent_created', { slug, tier: 'feature_unlock', intent_id: i.id, amount: i.amount_due });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, attempt]);

  // Poll status every 5s while pending.
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
        // Soft-fail: keep polling.
      }
    };
    const t = setInterval(tick, POLL_INTERVAL_MS);
    return () => { cancelled = true; clearInterval(t); };
  }, [intent, expired]);

  // On paid → fire analytics + notify parent.
  const paidTrackedRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (intent?.status === 'paid' && paidTrackedRef.current !== intent.id) {
      paidTrackedRef.current = intent.id;
      track('payment_completed', { slug, tier: 'feature_unlock', intent_id: intent.id, amount: intent.amount_due });
      onUnlocked();
    }
  }, [intent?.status, intent?.id, intent?.amount_due, slug, onUnlocked]);

  const handleRetry = React.useCallback(() => {
    setAttempt((n) => n + 1);
  }, []);

  const handleExpire = React.useCallback(() => {
    setExpired(true);
  }, []);

  const handleApplyCode = React.useCallback(async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setValidating(true);
    setCodeErr(null);
    try {
      const result = await validateCode(slug, trimmed);
      if (result.kind === 'valid') {
        setAppliedCode(result.data.code);
        setAppliedPrice(result.data.discountedAmount);
        setAppliedDiscountPct(result.data.discountPct ?? null);
        setCodeErr(null);
      } else if (result.kind === 'invalid') {
        setCodeErr(result.reason);
        setAppliedCode(null);
        setAppliedPrice(null);
        setAppliedDiscountPct(null);
      } else {
        setCodeErr('Không kiểm tra được mã');
        setAppliedCode(null);
        setAppliedPrice(null);
        setAppliedDiscountPct(null);
      }
    } finally {
      setValidating(false);
    }
  }, [code, slug]);

  const handleRemoveCode = React.useCallback(() => {
    setAppliedCode(null);
    setAppliedPrice(null);
    setAppliedDiscountPct(null);
    setCode('');
    setCodeErr(null);
  }, []);

  // Effective price = discounted amount when a code is applied, else base price.
  const effectivePrice = appliedPrice ?? price;

  // Initial state — show price + unlock button.
  if (attempt === 0) {
    return (
      <Card className="border-gold/20 bg-card/60 backdrop-blur-sm">
        <CardContent className="space-y-4 p-8 text-center">
          <p className="text-4xl" aria-hidden>🔒</p>
          <p className="font-heading text-xl text-foreground">
            {toolLabel} — tính năng trả phí
          </p>
          <p className="text-sm text-muted-foreground">
            Giá:{' '}
            {appliedCode ? (
              <>
                <span className="text-muted-foreground line-through">
                  {price.toLocaleString('vi-VN')}đ
                </span>{' '}
                <span className="font-semibold text-gold">
                  {effectivePrice.toLocaleString('vi-VN')}đ
                </span>
                {appliedPrice !== null &&
                  appliedPrice < price &&
                  (() => {
                    const pct =
                      typeof appliedDiscountPct === 'number'
                        ? appliedDiscountPct
                        : Math.round((1 - appliedPrice / price) * 100);
                    return pct > 0 ? (
                      <span className="ml-1 text-xs font-medium text-emerald-500">
                        -{pct}%
                      </span>
                    ) : null;
                  })()}
              </>
            ) : (
              <span className="font-semibold text-gold">
                {price.toLocaleString('vi-VN')}đ
              </span>
            )}{' '}
            / lần mở khoá
          </p>

          {/* Voucher / promo code — understated, secondary to the unlock CTA. */}
          <div className="mx-auto max-w-xs space-y-1 text-left">
            {appliedCode ? (
              <p className="text-center text-xs text-muted-foreground">
                Đã áp mã{' '}
                <span className="font-semibold text-gold">{appliedCode}</span>{' '}
                <button
                  type="button"
                  onClick={handleRemoveCode}
                  className="text-muted-foreground underline hover:text-foreground"
                >
                  Bỏ
                </button>
              </p>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void handleApplyCode();
                    }
                  }}
                  placeholder="Nhập mã giảm giá (nếu có)"
                  maxLength={32}
                  className="w-full rounded-md border border-gold/20 bg-card/60 px-3 py-2 text-sm uppercase text-foreground placeholder:normal-case placeholder:text-muted-foreground focus:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                />
                <Button
                  variant="outline"
                  onClick={() => void handleApplyCode()}
                  disabled={validating || code.trim().length === 0}
                >
                  {validating ? 'Đang kiểm tra…' : 'Áp dụng'}
                </Button>
              </div>
            )}
            {codeErr && (
              <p className="text-xs text-red-500">{codeErr}</p>
            )}
          </div>

          <Button
            onClick={() => setAttempt(1)}
            className="bg-gold text-black hover:bg-gold/90"
          >
            Mở khoá — {effectivePrice.toLocaleString('vi-VN')}đ
          </Button>
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
          <p className="font-heading text-foreground">Không thể tạo giao dịch</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={handleRetry}>Thử lại</Button>
        </CardContent>
      </Card>
    );
  }

  if (!intent) return null;

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
            <p className="font-heading text-foreground">Giao dịch đã hết hạn</p>
            <p className="text-sm text-muted-foreground">
              Mã QR chỉ có hiệu lực trong 15 phút.
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
          Trang sẽ tự mở khoá sau khi xác nhận thanh toán thành công.
        </p>
      )}
    </div>
  );
}
