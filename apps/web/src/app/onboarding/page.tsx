import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/home/SiteNav';
import { OnboardingRecap, OnboardingStepBadge } from '@/components/onboarding-recap';
import { OnboardingIntentTracker } from '@/components/onboarding-intent-tracker';

export const metadata: Metadata = {
  title: 'Mở khóa lá số',
  description:
    'Bắt đầu lá số cá nhân hoá — 4 bước. Đồng ý xử lý dữ liệu theo Nghị định 13/2023/NĐ-CP. Mã hoá AES-256, không bán dữ liệu, có quyền rút lại bất cứ lúc nào.',
  alternates: { canonical: 'https://hieu.asia/onboarding' },
  // Wave 60.95.k P1-SEO — route-level openGraph REPLACES root-layout
  // openGraph (Next.js merge semantics), so we must re-declare `images` here
  // or Zalo/Facebook/Telegram/Slack previews render blank. Same for `twitter`.
  openGraph: {
    title: 'Mở khóa lá số',
    description:
      'Bắt đầu hành trình hiểu chính mình — 4 bước. Đồng ý xử lý dữ liệu để tạo lá số.',
    url: 'https://hieu.asia/onboarding',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Mở khóa lá số Tử Vi cá nhân hoá trong 4 bước',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mở khóa lá số',
    description:
      'Bắt đầu hành trình hiểu chính mình — 4 bước.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Mở khóa lá số Tử Vi cá nhân hoá trong 4 bước',
      },
    ],
  },
  robots: { index: false, follow: true },
};

// Wave 60.95.k P1-SEO — JSON-LD parity with /pricing /sample-report
// /methodology. WebPage + BreadcrumbList signals to crawlers that
// /onboarding is a discoverable VN-language entry-point even though
// `robots.index: false` keeps it out of SERP (BreadcrumbList still
// surfaces in site-link context when referenced from indexed pages).
const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Mở khóa lá số', item: 'https://hieu.asia/onboarding' },
  ],
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Mở khóa lá số — hieu.asia',
  description:
    'Bắt đầu lá số cá nhân hoá — 4 bước. Đồng ý xử lý dữ liệu theo Nghị định 13/2023/NĐ-CP.',
  url: 'https://hieu.asia/onboarding',
  inLanguage: 'vi-VN',
  isPartOf: {
    '@type': 'WebSite',
    name: 'hieu.asia',
    url: 'https://hieu.asia',
  },
};

export default async function OnboardingPage({
  searchParams,
}: {
  // Next.js 15 — searchParams is now a Promise. Awaiting once is safe (the
  // value is cached per request).
  searchParams?: Promise<{ intent?: string }>;
}) {
  // Wave 60.66.P3 — read ?intent=<slug> from IntentChips on the homepage so
  // we can fire a PostHog `onboarding_intent_seed` event for funnel analysis.
  // Pure analytics signal — doesn't gate the onboarding flow.
  const params = await searchParams;
  const intent = params?.intent;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {intent && <OnboardingIntentTracker intent={intent} />}
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }}
      />
      <main id="main-content" className="relative overflow-hidden bg-background pt-20 pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-[-10%] h-[300px] w-[300px] rounded-full bg-purple/20 blur-3xl"
        />

        <section className="relative mx-auto max-w-2xl px-6">
          {/* Wave 60.95.m P2-a11y — WCAG 2.5.5 ≥44×44 tap targets. Breadcrumb
              link wrapped in inline-flex with min-h/min-w 44px + px-2 padding so
              the hit area meets the spec without visually enlarging the text. */}
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center">
              <Link
                href="/"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 hover:text-gold"
              >
                Trang chủ
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-muted-foreground">Mở khóa lá số</span>
            </span>
            <OnboardingStepBadge />
          </nav>

          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-gold/80">
            Hiểu mình. Quyết định mình.
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Mở khóa <span className="bg-gold-gradient bg-clip-text text-transparent">lá số</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/75">
            4 bước, khoảng 2 phút. Trước khi bắt đầu, vui lòng xem các mục dữ liệu hieu.asia sẽ xử lý.
            Bạn có quyền từ chối hoặc rút lại đồng ý bất cứ lúc nào tại trang{' '}
            {/* Inline-in-prose link — WCAG 2.5.5 SC has an explicit
                exception for links inside a sentence of flowing text, so we
                don't inflate the line box with min-h-[44px] here. */}
            <Link href="/account" className="text-gold underline underline-offset-4 hover:opacity-80">
              Tài khoản
            </Link>
            .
          </p>

          <OnboardingRecap />

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/onboarding/topic"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Bắt đầu — Bước 1 / 4 →
            </Link>
            <Link
              href="/sample-report"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-gold/30 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Xem báo cáo mẫu trước →
            </Link>
          </div>

          <p className="mt-8 mx-auto max-w-prose text-center text-xs text-muted-foreground">
            Mã hoá AES-256 · TLS 1.3 · Không dùng dữ liệu cá nhân để huấn luyện
            mô hình. Chỉ dùng dữ liệu đã ẩn danh để cải thiện prompt — bạn có
            thể tắt tùy chọn này bất cứ lúc nào.
          </p>

          {/* Wave 60.79.T1 (vault 112 P0-07): fill the 370px void below CTAs
              with concrete social proof + sample-report nudge so the viewport
              doesn't feel half-empty before the first scroll. */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold/80">
                Bảo mật
              </p>
              <p className="mt-1 font-heading text-lg font-bold text-foreground">
                Mã hoá AES-256
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/40 px-4 py-3 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold/80">
                Thời gian
              </p>
              <p className="mt-1 font-heading text-lg font-bold text-foreground">
                ≈ 2 phút
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/40 px-4 py-3 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gold/80">
                Phương pháp
              </p>
              <p className="mt-1 font-heading text-lg font-bold text-foreground">
                Bắc phái 121 sao
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
