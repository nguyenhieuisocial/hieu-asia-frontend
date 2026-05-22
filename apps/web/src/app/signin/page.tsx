'use client';

/**
 * /signin — Sign-in page (Wave 14).
 *
 * Layout (top to bottom):
 *   1. OAuth providers (Google, Facebook, Apple) — priority order.
 *   2. "hoặc" divider.
 *   3. Email magic-link form (existing flow).
 *   4. Terms / privacy disclaimer.
 *
 * NOTE: OAuth providers must be enabled + credentials configured in the
 * Supabase dashboard (Auth → Providers). If a provider is disabled there,
 * clicking the button will surface a Supabase error in the banner. The UI
 * does not gate buttons on provider availability — that requires a server
 * fetch we currently avoid for snappy first paint.
 */

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Facebook, Apple, ShieldCheck, Sparkles } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
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
      router.replace(next && next.startsWith('/') ? next : '/dashboard');
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
        <main className="flex min-h-screen items-center justify-center bg-ink text-cream">
          <p className="font-heading text-gold">Đang kiểm tra phiên đăng nhập…</p>
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
    const result = await sendMagicLink(email.trim());
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
    const result = await signInWithOAuth(provider);
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
        className="relative isolate flex min-h-screen flex-col items-center justify-center bg-ink-radial px-4 py-12 pt-24 text-cream"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.15)_0%,_transparent_55%)]"
        />
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-cream/55">
          <Link href="/" className="hover:text-gold">
            Trang chủ
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-cream/70">Đăng nhập</span>
        </nav>
        <Card className="w-full max-w-md border-gold/20 bg-ink/80 backdrop-blur">
          <CardHeader>
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
              <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
            </div>
            <CardTitle className="font-heading text-2xl">
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                Đăng nhập
              </span>{' '}
              hieu.asia
            </CardTitle>
            <p className="mt-2 text-sm text-cream/70">
              Chọn nhà cung cấp hoặc dùng email — không cần mật khẩu.
            </p>
          </CardHeader>
          <CardContent>
            {!authAvailable ? (
              <div className="rounded-lg border border-amber-500/40 bg-amber-950/30 p-4 text-sm text-amber-200">
                <p className="font-medium">Đăng nhập tạm thời chưa khả dụng</p>
                <p className="mt-1 text-amber-200/80">
                  Hệ thống xác thực đang được cấu hình. Vui lòng quay lại sau ít
                  phút hoặc liên hệ{' '}
                  <a href="mailto:hi@hieu.asia" className="underline hover:text-gold">
                    hi@hieu.asia
                  </a>
                  .
                </p>
              </div>
            ) : sent ? (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-4 text-sm text-emerald-200">
                <p className="font-medium">Đã gửi liên kết đăng nhập</p>
                <p className="mt-1 text-emerald-200/80">
                  Kiểm tra hộp thư <strong>{email}</strong> và nhấp vào liên kết
                  để hoàn tất đăng nhập. Liên kết có hiệu lực trong 15 phút.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* OAuth providers — priority order: Google, Facebook, Apple */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOAuthClick('google')}
                    disabled={anyLoading}
                    className="h-12 w-full justify-start gap-3 border-cream/10 bg-ink/40 text-cream hover:border-gold/40 hover:bg-ink/60"
                  >
                    <GoogleIcon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left text-sm">
                      {oauthLoading === 'google' ? 'Đang chuyển hướng…' : PROVIDER_LABEL.google}
                    </span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOAuthClick('facebook')}
                    disabled={anyLoading}
                    className="h-12 w-full justify-start gap-3 border-cream/10 bg-ink/40 text-cream hover:border-gold/40 hover:bg-ink/60"
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
                    className="h-12 w-full justify-start gap-3 border-cream/10 bg-ink/40 text-cream hover:border-gold/40 hover:bg-ink/60"
                  >
                    <Apple
                      className="h-5 w-5 shrink-0 text-cream"
                      aria-hidden="true"
                      fill="currentColor"
                    />
                    <span className="flex-1 text-left text-sm">
                      {oauthLoading === 'apple' ? 'Đang chuyển hướng…' : PROVIDER_LABEL.apple}
                    </span>
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative my-2" aria-hidden="true">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-cream/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-ink/80 px-3 uppercase tracking-wider text-cream/50">
                      hoặc
                    </span>
                  </div>
                </div>

                {/* Magic-link form */}
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-cream/80">
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
                      className="min-h-[44px]"
                    />
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-md border border-rose-500/40 bg-rose-950/30 p-3 text-sm text-rose-200"
                    >
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={anyLoading || !email}
                    className="h-12 w-full bg-gold text-ink hover:bg-gold/90"
                  >
                    {emailLoading ? 'Đang gửi…' : 'Gửi liên kết đăng nhập'}
                  </Button>

                  <p className="text-center text-xs text-cream/70">
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
          </CardContent>
        </Card>
        <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-cream/55">
          <ShieldCheck className="h-3.5 w-3.5 text-gold/80" aria-hidden="true" />
          Liên kết chỉ dùng được một lần · hết hạn sau 15 phút
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
