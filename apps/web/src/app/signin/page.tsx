/**
 * /signin — Sign-in page (Wave 60.67.X split).
 *
 * Wave 60.67.X: split into server component (this file) + client island
 * (SignInForm.tsx). Server component renders SiteNav, breadcrumb, hero
 * header (h1 + eyebrow + subtitle), and PreviewReadingCard — all SSR'd
 * into HTML so Google bot / Lighthouse / social previews see them.
 * Client island renders the interactive form (hooks + state + Turnstile).
 *
 * Wave 60.56 P3.4 history: rebuild from Card-in-cream (DNA 3.1/5) to
 * split surface — LEFT form (auth gate), RIGHT preview (sell payoff),
 * mobile preview-on-top (sell-first ordering). Hero copy "Đăng nhập để
 * được *hiểu*." ties to Wave 60.56 warm-dark editorial voice.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { PreviewReadingCard } from '@/components/marketing/PreviewReadingCard';
import { SignInForm } from './SignInForm';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description:
    'Đăng nhập để xem lá số Tử Vi của bạn. Magic link hoặc OAuth (Google / Facebook / Apple).',
  alternates: { canonical: 'https://hieu.asia/signin' },
};

interface SignInPageProps {
  // Next.js 15 — searchParams is a Promise. Server component awaits it once
  // before passing primitives down to the SignInForm client island.
  // Wave 60.79.T3 (vault 112 P1 #11): `reason=auth` triggers session-timeout
  // banner so middleware redirects after session expiry give clear feedback.
  searchParams?: Promise<{ error?: string; next?: string; reason?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = (await searchParams) ?? {};
  const initialError = params.error;
  const next = params.next;
  const reason = params.reason;

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

          {/* Wave 60.79.T3 (vault 112 P1 #11): post-timeout banner so users
              redirected by middleware know why they landed back on /signin. */}
          {reason === 'auth' && (
            <div
              role="status"
              className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
            >
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
              <p>
                Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.
              </p>
            </div>
          )}

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
              <SignInForm initialError={initialError} next={next} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
