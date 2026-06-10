'use client';

import * as React from 'react';
import { Mail, Check } from 'lucide-react';
import { Button, Input } from '@hieu-asia/ui';
import { track } from '@/lib/analytics';

interface OccasionLeadCaptureProps {
  /** Attribution tag sent to /email/subscribe (e.g. "occasion:xem-tuoi-cuoi"). */
  source: string;
  /** Analytics event fired on a successful capture. */
  capturedEvent: string;
  /** Extra props attached to the captured event (no PII — no birth years). */
  capturedProps?: Record<string, string | number | boolean | undefined>;
  /** Short pitch above the email field. */
  blurb: string;
  /** Button label, e.g. "Nhận khi có bản đầy đủ". */
  cta?: string;
}

/**
 * Compact, opt-in email capture for high-intent occasion landing pages.
 *
 * Turns the "I'm interested" moment (otherwise a dead-end thank-you) into an
 * owned lead, reusing the EXISTING double-opt-in newsletter pipeline
 * (`POST /api/email/subscribe` → Resend audience, consent + confirmation
 * handled server-side). No new backend, no new PII practice — same mechanism
 * already running on the homepage NewsletterSignup, just placed where intent is
 * highest. Brand voice: tham khảo, không spam, huỷ bất cứ lúc nào.
 */
export function OccasionLeadCapture({
  source,
  capturedEvent,
  capturedProps,
  blurb,
  cta = 'Đăng ký nhận',
}: OccasionLeadCaptureProps) {
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const [alreadySubscribed, setAlreadySubscribed] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state === 'loading') return;
    setState('loading');
    setError(null);
    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        alreadySubscribed?: boolean;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? 'Đăng ký không thành công');
      }
      setAlreadySubscribed(Boolean(data.alreadySubscribed));
      setState('sent');
      track(capturedEvent, { ...capturedProps, alreadySubscribed: Boolean(data.alreadySubscribed) });
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    }
  }

  if (state === 'sent') {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm"
      >
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
        <div>
          <p className="font-medium text-foreground">
            {alreadySubscribed ? 'Email của bạn đã có trong danh sách' : 'Gần xong rồi!'}
          </p>
          <p className="mt-1 text-muted-foreground">
            {alreadySubscribed
              ? 'Chúng tôi sẽ báo bạn ngay khi có bản đầy đủ.'
              : 'Hãy kiểm tra hộp thư và bấm xác nhận để hoàn tất. Chúng tôi sẽ báo bạn khi có bản đầy đủ.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <p className="text-xs leading-relaxed text-muted-foreground">{blurb}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@cua.ban"
            className="bg-card/70 pl-10"
            disabled={state === 'loading'}
            aria-label="Email nhận thông báo"
          />
        </div>
        <Button
          type="submit"
          disabled={state === 'loading' || !email}
          className="min-h-11 shrink-0 touch-manipulation"
        >
          {state === 'loading' ? 'Đang gửi…' : cta}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-300" role="alert">
          {error}
        </p>
      )}
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Tự nguyện — không spam, huỷ bất cứ lúc nào. Email không chia sẻ cho bên thứ ba (xem{' '}
        <a href="/privacy" className="underline hover:text-gold">
          Chính sách bảo mật
        </a>
        ).
      </p>
    </form>
  );
}
