'use client';

/**
 * /signin — Sign-in page (Wave 60.56 P3.4 rebuild).
 *
 * R1 forensic audit verdict B: REBUILD. Previous Card-in-cream layout scored
 * DNA 3.1/5 (weakest page in marketing funnel) — asks for credentials before
 * demonstrating value. This rebuild splits the surface:
 *   - LEFT (form):   existing OAuth + magic-link auth (logic untouched).
 *   - RIGHT (sell):  <PreviewReadingCard> showing a real Tử Vi cung preview
 *                    with insight quote — the payoff before the gate.
 *   - Mobile:        preview on TOP, form below (sell-first ordering).
 *
 * Hero copy: "Đăng nhập để được *hiểu*." — italic span signature ties to
 * the Wave 60.56 "warm-dark editorial" voice used across marketing surfaces.
 *
 * Auth logic preserved 100%: OAuth providers (Google, Facebook, Apple),
 * magic-link form, `?next=` roundtrip, redirect-if-authed guard, env-missing
 * fallback. Only the visual wrapper changed.
 */

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Facebook, Apple, ShieldCheck } from 'lucide-react';
import { Button, Input, Label } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { PreviewReadingCard } from '@/components/marketing/PreviewReadingCard';
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

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialError = searchParams.get('error');
  // Wave 36 fix: redirect away if already signed in. Without this guard, a
  // logged-in user can reload /signin and see the form again — confusing and
  // could let them re-trigger an OAuth flow that overwrites their session.
  const { user: authedUser, loading: authLoading } = useAuth();

  React.useEffect(() => {
    if (!authLoading && authedUser) {
      const next = searchParams.get('next');
      router.replace(next && next.startsWith('/') ? next : '/account');
    }
  }, [authLoading, authedUser, router, searchParams]);

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
    setEmailLoading(true);
    setError(null);
    try {
      track('signin_started', { method: 'magic_link' });
    } catch {
      /* ignore */
    }
    // Wave 44.4 (#251): pass `?next=` through magic-link roundtrip so
    // signup-from-partner flow lands back on `/partner` after callback.
    const next = searchParams.get('next');
    const result = await sendMagicLink(email.trim(), next);
    setEmailLoading(false);
    if (result.ok) {
      setSent(true);
    } else {
      setError(result.error);
    }
  }

  async function onOAuthClick(provider: OAuthProvider) {
    setOauthLoading(provider);
    setError(null);
    try {
      track('signin_started', { method: 'oauth' });
    } catch {
      /* ignore */
    }
    // Wave 44.4 (#251): pass `?next=` through OAuth roundtrip.
    const next = searchParams.get('next');
    const result = await signInWithOAuth(provider, next);
    // On success Supabase redirects the tab away; we only land here on error.
    if (!result.ok) {
      setOauthLoading(null);
      setError(result.error);
    }
  }

  return (
    <>
      <SiteNav />
      <main
        id="main-content"
        className="relative isolate min-h-screen bg-warm-dark-50 px-6 py-12 pt-24 text-cream-50"
      >
        <div className="mx-auto max-w-marketing">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-cream-500">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-cream-300">Đăng nhập</span>
          </nav>

          <header className="mb-10 max-w-marketing-text">
            <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
              — HIEU.ASIA · ĐĂNG NHẬP
            </p>
            <h1 className="mt-4 font-marketing-display text-4xl leading-tight text-cream-50 md:text-5xl">
              Đăng nhập để được{' '}
              <span className="italic text-gold">hiểu</span>.
            </h1>
            <p className="mt-4 font-sans text-base text-cream-300">
              Không cần mật khẩu. Chọn nhà cung cấp hoặc nhận liên kết qua email.
            </p>
          </header>

          <div className="grid gap-12 md:grid-cols-2 md:items-start">
            {/* RIGHT in DOM order but `order-` flips so mobile shows preview ON TOP. */}
            <div className="order-1 md:order-2">
              <PreviewReadingCard
                cungName="Cung Mệnh"
                cungSubtitle="Tử Vi · Bản đồ sao thời điểm sinh"
                starList={['Tử Vi', 'Thiên Tướng', 'Hữu Bật']}
                insightQuote="Bạn có Mệnh Vô Chính Diệu — sao chính cung Mệnh trống, ưu thế ở khả năng tự định hình bản thân không bị áp đặt bởi định khuôn."
                insightAuthor="Hệ thống Tử Vi · Đối chiếu 2026"
                ctaLabel="Tiếp tục đăng nhập để xem lá số của bạn"
                ctaHref="#signin-form"
              />
            </div>

            {/* LEFT in DOM order but `order-` puts form BELOW preview on mobile. */}
            <div id="signin-form" className="order-2 md:order-1">
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
                  {/* OAuth providers — priority order: Google, Facebook, Apple */}
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOAuthClick('google')}
                      disabled={anyLoading}
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
                      disabled={anyLoading}
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
                      disabled={anyLoading}
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
                      disabled={anyLoading || !email}
                      className="h-12 w-full rounded-pill bg-gold text-warm-dark-50 transition-all duration-300 ease-editorial hover:bg-gold-soft"
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
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
