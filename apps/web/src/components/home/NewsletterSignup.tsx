'use client';

import * as React from 'react';
import { Mail, Check } from 'lucide-react';
import { Button, Input } from '@hieu-asia/ui';

interface NewsletterSignupProps {
  id?: string;
  variant?: 'section' | 'inline';
}

/**
 * Newsletter signup block — POSTs to /api/email/subscribe.
 *
 * Reuses brand styling (gold accent + ink-radial). On success swaps to a
 * confirmation card; on failure surfaces an inline error and keeps the form
 * editable.
 */
export function NewsletterSignup({
  id = 'newsletter',
  variant = 'section',
}: NewsletterSignupProps) {
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
        body: JSON.stringify({ email: email.trim(), source: 'web' }),
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
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    }
  }

  const card = (
    <div className="relative isolate overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-background to-purple/15 p-8 sm:p-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple/20 blur-3xl"
      />

      <div className="relative grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/90 sm:text-xs">
            Newsletter · mỗi tuần một bài
          </p>
          <h2 className="mt-4 text-balance font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            Theo dõi tri thức <span className="text-primary">hàng tuần</span>
          </h2>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Một bài viết ngắn về cách dùng cổ học để ra quyết định tốt hơn. Không
            spam, không bán hàng, huỷ bất cứ lúc nào.
          </p>
          {/* Wave 60.97.1 — `min-h-11 py-2.5` so "Xem các bài trước"
              tertiary link reaches 44px on mobile (was 16px). */}
          <a
            href="/newsletter/archive"
            className="mt-2 inline-flex min-h-11 items-center gap-1.5 py-2.5 text-xs font-medium text-primary/90 underline-offset-4 hover:text-primary hover:underline active:text-primary touch-manipulation sm:text-sm"
          >
            Xem các bài trước
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div>
          {state === 'sent' ? (
            <div
              role="status"
              className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-sm text-emerald-100"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
              <div>
                <p className="font-medium">
                  {alreadySubscribed ? 'Bạn đã đăng ký trước đó' : 'Đã đăng ký'}
                </p>
                <p className="mt-1 text-emerald-200/80">
                  {alreadySubscribed
                    ? 'Hộp thư của bạn vẫn nằm trong danh sách. Hẹn gặp lại vào tuần tới.'
                    : 'Hãy kiểm tra hộp thư để xác nhận đăng ký.'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3" noValidate>
              <label htmlFor={`${id}-email`} className="sr-only">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id={`${id}-email`}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ban@cua.ban"
                  className="bg-card/70 pl-10"
                  disabled={state === 'loading'}
                  aria-describedby={error ? `${id}-error` : undefined}
                />
              </div>
              <Button
                type="submit"
                disabled={state === 'loading' || !email}
                aria-describedby={
                  !email && state !== 'loading' ? `${id}-hint` : undefined
                }
                // Wave 60.97.1 — `min-h-11 touch-manipulation` so the newsletter
                // CTA reaches the 44px mobile tap target (Button default = 40px).
                className="w-full min-h-11 touch-manipulation disabled:border disabled:border-primary/40"
              >
                {state === 'loading' ? 'Đang đăng ký…' : 'Đăng ký miễn phí'}
              </Button>
              {/* Wave 52.1 — visible helper text when button is disabled (BUG-019). */}
              {!email && state !== 'loading' && (
                <p
                  id={`${id}-hint`}
                  className="text-[11px] text-muted-foreground"
                >
                  Nhập email trước để đăng ký.
                </p>
              )}
              {error && (
                <p
                  id={`${id}-error`}
                  className="text-xs text-rose-300"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Bằng cách đăng ký bạn đồng ý với{' '}
                <a href="/privacy" className="underline hover:text-primary">
                  Chính sách bảo mật
                </a>
                . Email không được chia sẻ cho bên thứ ba.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  if (variant === 'inline') return <div id={id}>{card}</div>;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="relative bg-background py-20 sm:py-24 scroll-mt-24">
      <h2 id={`${id}-heading`} className="sr-only">
        Đăng ký newsletter hieu.asia
      </h2>
      <div className="mx-auto max-w-5xl px-6">{card}</div>
    </section>
  );
}
