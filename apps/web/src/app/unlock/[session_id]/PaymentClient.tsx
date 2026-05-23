/**
 * PaymentClient — client component that owns the full payment lifecycle.
 *
 * 1. On mount, POSTs `/api/payment/intent` once to obtain a SePay/VietQR intent.
 * 2. Renders the QR + bank info via <QRDisplay />.
 * 3. Polls `/api/payment/intent/{id}` every 5s, refreshing local state.
 * 4. On `status === 'paid'` → redirect to `/reading/{session_id}/report`.
 * 5. On `status === 'expired'` or countdown 0 → show retry CTA.
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { QRDisplay, type PaymentIntent } from '@/components/payment/QRDisplay';
import { track } from '@/lib/analytics';
import { safeJson } from '@/lib/safe-json';
import { getSupabaseAuth } from '@/lib/auth-client';

type Tier =
  | 'premium'
  | 'subscription_monthly'
  | 'subscription_yearly'
  | 'lifetime_onetime';

const POLL_INTERVAL_MS = 5_000;

interface PaymentClientProps {
  sessionId: string;
  tier: Tier;
}

interface IntentEnvelope {
  ok: boolean;
  intent?: PaymentIntent;
  error?: string;
}

/**
 * Wave 53 P1 (#272) — IDOR fix. Authenticated callers send a Bearer token so
 * the worker derives user_id from the verified JWT instead of trusting the
 * client. Anonymous callers fall back to an `anon-<sessionId>` shape which
 * the worker accepts only when no Authorization header is present.
 */
async function resolveAuth(
  sessionId: string,
): Promise<{ token: string | null; anonUserId: string }> {
  const anonUserId = `anon-${sessionId}`;
  if (typeof window === 'undefined') return { token: null, anonUserId };
  try {
    const supa = getSupabaseAuth();
    if (!supa) return { token: null, anonUserId };
    const { data } = await supa.auth.getSession();
    const token = data.session?.access_token ?? null;
    return { token, anonUserId };
  } catch {
    return { token: null, anonUserId };
  }
}

async function createIntent(
  sessionId: string,
  tier: Tier,
): Promise<PaymentIntent> {
  const { token, anonUserId } = await resolveAuth(sessionId);
  const res = await fetch('/api/payment/intent', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      // user_id is only consulted by the worker when no Authorization header
      // is present. Authenticated callers' user_id is overridden server-side
      // from the verified JWT (see worker /payment/intent handler).
      user_id: anonUserId,
      session_id: sessionId,
      tier,
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

export function PaymentClient({ sessionId, tier }: PaymentClientProps) {
  const router = useRouter();
  const [intent, setIntent] = React.useState<PaymentIntent | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expired, setExpired] = React.useState(false);
  const [attempt, setAttempt] = React.useState(0);

  // 1. Create intent once per (session, tier, attempt) tuple.
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setExpired(false);
    setIntent(null);
    createIntent(sessionId, tier)
      .then((i) => {
        if (cancelled) return;
        setIntent(i);
        track('payment_intent_created', { session_id: sessionId, tier, intent_id: i.id, amount: i.amount_due });
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
  }, [sessionId, tier, attempt]);

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

  // 3. On `paid` → redirect to report.
  const paidTrackedRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (intent?.status === 'paid') {
      if (paidTrackedRef.current !== intent.id) {
        paidTrackedRef.current = intent.id;
        track('payment_completed', { session_id: sessionId, tier, intent_id: intent.id, amount: intent.amount_due });
      }
      router.push(`/reading/${encodeURIComponent(sessionId)}/report`);
    }
  }, [intent?.status, intent?.id, intent?.amount_due, router, sessionId, tier]);

  const handleRetry = React.useCallback(() => {
    setAttempt((n) => n + 1);
  }, []);

  const handleExpire = React.useCallback(() => {
    setExpired(true);
  }, []);

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
          Trang sẽ tự chuyển sau khi xác nhận thanh toán thành công.
        </p>
      )}
    </div>
  );
}
