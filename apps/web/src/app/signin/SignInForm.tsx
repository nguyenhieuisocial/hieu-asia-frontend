'use client';

/**
 * SignInForm — Client island for /signin (Wave 60.67.X split).
 *
 * Wave 60.67.X: extracted from page.tsx so the page can be a server
 * component (h1 + hero SSR'd into HTML for Google/Lighthouse). All hook
 * logic (useAuth, useRouter, useSearchParams, useState, useEffect) lives
 * here; the form renders client-side after hydration. Behavior preserved
 * 100% — only the wrapper (SiteNav/breadcrumb/header/PreviewReadingCard)
 * moved up to the server page.
 *
 * Auth logic preserved 100% from Wave 60.56 P3.4:
 * - OAuth providers (Google, Facebook, Apple)
 * - Magic-link form
 * - `?next=` roundtrip (Wave 44.4 #251)
 * - Redirect-if-authed guard (Wave 36)
 * - Env-missing fallback (Task 4)
 * - Cloudflare Turnstile gate (Wave 60.60.d)
 */

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Facebook, Apple, ShieldCheck } from 'lucide-react';
import { Button, Input, Label } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { TurnstileWidget } from '@/components/auth/TurnstileWidget';
import { sendMagicLink, signInWithOAuth } from '@/lib/auth-client';
import { useAuth } from '@/hooks/use-auth';
import { track } from '@/lib/analytics';

type OAuthProvider = 'google' | 'facebook' | 'apple';

const PROVIDER_LABEL: Record<OAuthProvider, string> = {
  google: 'Tiếp tục với Google',
  facebook: 'Tiếp tục với Facebook',
  apple: 'Tiếp tục với Apple',
};

/** Multi-color Google "G" logo (inline SVG, brand-safe). */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8a12 12 0 1 1 0-24c3.1 0 5.9 1.2 8 3.1l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7A20 20 0 0 0 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.3 0 10-2 13.6-5.3l-6.3-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4 5.5l6.3 5.2C41.2 36 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

export interface SignInFormProps {
  /** Error message persisted in URL by callback redirect (e.g. ?error=...). */
  initialError?: string;
  /** Redirect-after-auth target persisted in URL (e.g. ?next=/partner). */
  next?: string;
}

export function SignInForm({ initialError: initialErrorProp, next: nextProp }: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Prefer server-passed prop (from page.tsx searchParams) but fall back to
  // useSearchParams in case URL changes client-side (rare, but safe).
  const initialError = initialErrorProp ?? searchParams.get('error') ?? null;
  // Wave 36 fix: redirect away if already signed in. Without this guard, a
  // logged-in user can reload /signin and see the form again — confusing and
  // could let them re-trigger an OAuth flow that overwrites their session.
  const { user: authedUser, loading: authLoading } = useAuth();

  React.useEffect(() => {
    if (!authLoading && authedUser) {
      const next = nextProp ?? searchParams.get('next');
      // Open-redirect guard: same-origin relative path only. `//evil.com` and
      // `/\evil.com` are protocol-relative — browsers treat them as absolute —
      // so `startsWith('/')` alone is not enough; reject those too.
      router.replace(
        next &&
          next.startsWith('/') &&
          !next.startsWith('//') &&
          !next.startsWith('/\\')
          ? next
          : '/account',
      );
    }
  }, [authLoading, authedUser, router, searchParams, nextProp]);

  // Pre-flight: if Supabase env is missing, render a "not available" notice
  // instead of a form that silently fails on submit (Task 4).
  // We check the env directly (cheap, build-time inlined) rather than calling
  // getSupabaseAuth() during render which would create the client.
  const authAvailable = React.useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return Boolean(url && key);
  }, []);

  const [email, setEmail] = React.useState('');
  const [emailLoading, setEmailLoading] = React.useState(false);
  const [oauthLoading, setOauthLoading] = React.useState<OAuthProvider | null>(null);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(initialError);
  // Wave 60.60.d — Cloudflare Turnstile token. Required for both magic-link
  // and OAuth submit when Supabase captcha is enabled. Single-use, reset
  // after every submit attempt regardless of outcome.
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);

  const anyLoading = emailLoading || oauthLoading !== null;

  // While we determine whether there's an existing session, render a minimal
  // placeholder to avoid flashing the full sign-in form to logged-in users.
  if (authLoading || (!authLoading && authedUser)) {
    return (
      <>
        <SiteNav />
        <main className="flex min-h-screen items-center justify-center bg-warm-dark-50 text-cream-50">
          <p
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="font-marketing-display italic text-gold"
          >
            Đang kiểm tra phiên đăng nhập…
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaToken) {
      setError('Vui lòng hoàn tất bước xác thực bên dưới.');
      return;
    }
    setEmailLoading(true);
    setError(null);
    try {
      track('signin_started', { method: 'magic_link' });
    } catch {
      /* ignore */
    }
    // Wave 44.4 (#251): pass `?next=` through magic-link roundtrip so
    // signup-from-partner flow lands back on `/partner` after callback.
    const next = nextProp ?? searchParams.get('next');
    // Wave 60.60.d — forward Turnstile token to Supabase; reset after attempt
    // since token is single-use (replay would 400 on next try).
    const result = await sendMagicLink(email.trim(), next, captchaToken);
    setCaptchaToken(null);
    setEmailLoading(false);
    if (result.ok) {
      setSent(true);
    } else {
      setError(result.error);
    }
  }

  async function onOAuthClick(provider: OAuthProvider) {
    if (!captchaToken) {
      setError('Vui lòng hoàn tất bước xác thực bên dưới.');
      return;
    }
    setOauthLoading(provider);
    setError(null);
    try {
      track('signin_started', { method: 'oauth' });
    } catch {
      /* ignore */
    }
    // Wave 44.4 (#251): pass `?next=` through OAuth roundtrip.
    const next = nextProp ?? searchParams.get('next');
    // Wave 60.60.d — pass Turnstile token; reset post-attempt.
    const result = await signInWithOAuth(provider, next, captchaToken);
    setCaptchaToken(null);
    // On success Supabase redirects the tab away; we only land here on error.
    if (!result.ok) {
      setOauthLoading(null);
      setError(result.error);
    }
  }

  return (
    <>
      {!authAvailable ? (
        <div className="rounded-card-editorial border border-amber-500/40 bg-warm-dark-200 p-6 text-sm text-amber-200">
          <p className="font-marketing-display text-lg italic">
            Đăng nhập tạm thời chưa khả dụng
          </p>
          <p className="mt-2 text-amber-200/80">
            Hệ thống xác thực đang được cấu hình. Vui lòng quay lại sau
            ít phút hoặc liên hệ{' '}
            <a href="mailto:hi@hieu.asia" className="underline hover:text-gold">
              hi@hieu.asia
            </a>
            .
          </p>
        </div>
      ) : sent ? (
        <div className="rounded-card-editorial border border-emerald-500/40 bg-warm-dark-200 p-6 text-sm text-emerald-200">
          <p className="font-marketing-display text-lg italic">
            Đã gửi liên kết đăng nhập
          </p>
          <p className="mt-2 text-emerald-200/80">
            Kiểm tra hộp thư <strong>{email}</strong> và nhấp vào liên
            kết để hoàn tất đăng nhập. Liên kết có hiệu lực trong 15
            phút.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Wave 60.60.d — Captcha mounted FIRST so it gates both
              OAuth buttons + magic-link submit. Token resets after
              every attempt (single-use). Widget itself stays
              visible-but-rendered-once across the session.
              Wave 60.79.T1 (vault 112 P0-06): removed descriptive label +
              tightened wrapper to `p-1 min-h-0` so the box doesn't reserve
              ~150px of empty whitespace before Turnstile script loads. The
              widget itself self-labels (Cloudflare branding) when rendered. */}
          <div className="flex min-h-0 justify-center rounded-card-editorial border border-warm-dark-300 bg-warm-dark-200 p-1">
            <TurnstileWidget
              onVerify={(token) => {
                setCaptchaToken(token);
                setError(null);
              }}
              onError={() =>
                setError(
                  'Captcha không tải được. Vui lòng tải lại trang.',
                )
              }
              onExpire={() => setCaptchaToken(null)}
              theme="dark"
              className="flex justify-center"
            />
          </div>

          {/* Wave 60.95.m — proactive Turnstile hint so users on slow
              connections understand why OAuth buttons + submit start
              disabled, instead of seeing four greyed-out buttons with
              no upfront explanation. Disappears once captcha resolves. */}
          {!captchaToken && (
            <p className="text-center font-mono text-[11px] uppercase tracking-wider text-cream-500">
              Hoàn tất xác thực Cloudflare bên dưới để mở tuỳ chọn đăng nhập
            </p>
          )}

          {/* OAuth providers — priority order: Google, Facebook, Apple */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOAuthClick('google')}
              disabled={anyLoading || !captchaToken}
              className="h-12 w-full justify-start gap-3 rounded-pill border-warm-dark-300 bg-warm-dark-200 text-cream-100 hover:border-gold-soft hover:bg-warm-dark-300"
            >
              <GoogleIcon className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left text-sm">
                {oauthLoading === 'google'
                  ? 'Đang chuyển hướng…'
                  : PROVIDER_LABEL.google}
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => onOAuthClick('facebook')}
              disabled={anyLoading || !captchaToken}
              className="h-12 w-full justify-start gap-3 rounded-pill border-warm-dark-300 bg-warm-dark-200 text-cream-100 hover:border-gold-soft hover:bg-warm-dark-300"
            >
              <Facebook
                className="h-5 w-5 shrink-0 text-[#1877F2]"
                aria-hidden="true"
                fill="currentColor"
              />
              <span className="flex-1 text-left text-sm">
                {oauthLoading === 'facebook'
                  ? 'Đang chuyển hướng…'
                  : PROVIDER_LABEL.facebook}
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => onOAuthClick('apple')}
              disabled={anyLoading || !captchaToken}
              className="h-12 w-full justify-start gap-3 rounded-pill border-warm-dark-300 bg-warm-dark-200 text-cream-100 hover:border-gold-soft hover:bg-warm-dark-300"
            >
              <Apple
                className="h-5 w-5 shrink-0 text-cream-100"
                aria-hidden="true"
                fill="currentColor"
              />
              <span className="flex-1 text-left text-sm">
                {oauthLoading === 'apple'
                  ? 'Đang chuyển hướng…'
                  : PROVIDER_LABEL.apple}
              </span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-2" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-warm-dark-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-warm-dark-50 px-3 font-mono uppercase tracking-wider text-cream-500">
                hoặc
              </span>
            </div>
          </div>

          {/* Magic-link form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-cream-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                enterKeyHint="send"
                placeholder="ban@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={anyLoading}
                className="min-h-[44px] rounded-pill border-warm-dark-300 bg-warm-dark-200 px-5 text-cream-50 placeholder:text-cream-500"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-card-editorial border border-rose-500/40 bg-warm-dark-200 p-3 text-sm text-rose-200"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={anyLoading || !email || !captchaToken}
              className="h-12 w-full rounded-pill border border-gold-soft/50 bg-gold text-warm-dark-50 transition-all duration-300 ease-editorial hover:bg-gold-soft disabled:opacity-60"
            >
              {emailLoading ? 'Đang gửi…' : 'Gửi liên kết đăng nhập'}
            </Button>

            <p className="text-center text-xs text-cream-500">
              Bằng cách đăng nhập, bạn đồng ý với{' '}
              <a href="/terms" className="underline hover:text-gold">
                Điều khoản
              </a>{' '}
              và{' '}
              <a href="/privacy" className="underline hover:text-gold">
                Chính sách bảo mật
              </a>
              .
            </p>
          </form>
        </div>
      )}

      <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-cream-500">
        <ShieldCheck
          className="h-3.5 w-3.5 text-gold-soft"
          aria-hidden="true"
        />
        Liên kết chỉ dùng được một lần · hết hạn sau 15 phút
      </p>

      {/* Wave 60.95.m — permanent escape hatch so users who can't
          receive the magic link (spam filter, typo, blocked OAuth)
          always have a contact path. Previously only surfaced in the
          !authAvailable fallback. */}
      <p className="mt-4 text-center text-xs text-cream-500">
        Cần trợ giúp đăng nhập?{' '}
        <a
          href="mailto:hi@hieu.asia"
          className="underline hover:text-gold"
        >
          hi@hieu.asia
        </a>
      </p>
    </>
  );
}
