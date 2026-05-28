import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
// Wave 55 LCP #1 — dropped Inter import. Inter only sat in the `sans` fallback
// chain (`var(--font-be-vietnam), var(--font-inter), ...`) and almost never
// actually rendered because Be Vietnam Pro already covers latin. Removing it
// drops ~1 woff2 file from the critical-path font fan-out.
// Wave 56 (V4 Sprint B) LCP — dropped JetBrains_Mono from root layout. Mono
// only appears on `/brand` and `/changelog` (and in tiny uppercase labels via
// `font-mono` on home — those size-adjust gracefully to `ui-monospace` from
// the Tailwind fallback stack). Removing it cuts 3 woff2 files (latin-ext +
// latin + vietnamese subsets) from every page's critical path.
import { Be_Vietnam_Pro, Instrument_Serif, Outfit } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { LazyMotionProvider } from '@/components/providers/lazy-motion-provider';
import { PlausibleScript } from '@/components/analytics/PlausibleScript';
import { PostHogProvider } from '@/components/PostHogProvider';
import { ConsentBanner } from '@/components/cmp/ConsentBanner';
import { Toaster } from '@hieu-asia/ui';
import { AppShell } from '@/components/product/AppShell';
// Wave 21 — Vercel telemetry (customer-facing web only).
// Phân vai analytics:
//   - PostHog:               business events, feature flags, session replay, exceptions
//   - Vercel Analytics:      privacy-first page views + referrer (Vercel dashboard)
//   - Vercel Speed Insights: Core Web Vitals từ browser API native (SEO / Google ranking)
// Không lo double-count: 3 surface khác nhau, mỗi cái phục vụ một mục đích riêng.
// Local dev không có VERCEL env → no-op, không gửi data.
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

// Wave 55 LCP #1 — trimmed weight 300 (light). Body text uses 400+; the few
// places that wanted ultra-light were dropping into the wrong weight anyway
// due to fallback. Dropping 300 removes 2 woff2 files (latin + vietnamese
// subsets each load one file per weight).
// Wave 56 (V4 Sprint B) — also dropped weight 500. `font-medium` (500) is
// used on home in only 5 spots (SiteNav, MethodChooser, NewsletterSignup,
// SiteFooter, FaqAccordion) — all secondary UI text. Browser substitutes
// from weight 400 with synthetic medium; visual delta is negligible at
// 14-16px sizes. Removes 3 woff2 files (vietnamese + latin-ext + latin
// subsets) from the critical path.
const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

// Wave 60.56 Phase 1 — Option D "Warm-Dark Editorial" marketing display serif.
// Italic-capable (signature `<em>verb</em>` spans in hero/section headers).
// Google Fonts only ships latin + latin-ext for Instrument Serif (no
// `vietnamese` subset upstream); VN diacritics that fall outside latin-ext
// fall back gracefully to Be Vietnam Pro via the `font-marketing-display`
// Tailwind fallback chain. Marketing surfaces only; in-app UI uses Outfit.
const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  variable: '--font-marketing-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hieu.asia'),
  title: {
    default: 'hieu.asia — Tử Vi & MBTI bằng AI',
    template: '%s · hieu.asia',
  },
  description:
    'Hệ thống AI phân tích Tử Vi, Bát Tự, MBTI và lòng bàn tay. Người bạn đồng hành giúp bạn hiểu chính mình rõ hơn.',
  applicationName: 'hieu.asia',
  authors: [{ name: 'hieu.asia' }],
  creator: 'hieu.asia',
  publisher: 'hieu.asia',
  keywords: [
    'Tử Vi',
    'Tử Vi Đẩu Số',
    'Bát Tự',
    'MBTI',
    'AI',
    'palm reading',
    'xem chỉ tay',
    'kinh dịch',
    'huyền học',
    'tử vi AI',
    'tâm lý học',
    'Việt Nam',
    'hieu.asia',
  ],
  category: 'lifestyle',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  // SEO fix (Wave 14 audit): only `/` (homepage) should canonicalize to root.
  // Previously this bubbled to every child page lacking its own canonical →
  // pages like /lich-van-nien, /career-fit risked being seen as duplicates of /.
  // Each indexable child page now sets its own `alternates.canonical`; if a
  // page omits canonical, Next.js will not emit a canonical tag (self-canonical
  // by default, which is correct).
  // The homepage canonical is declared in `app/page.tsx`'s own metadata.
  alternates: {
    languages: {
      'vi-VN': 'https://hieu.asia',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://hieu.asia',
    siteName: 'hieu.asia',
    title: 'hieu.asia — Tử Vi & MBTI bằng AI',
    description:
      'Hệ thống AI phân tích Tử Vi, Bát Tự, MBTI và lòng bàn tay. Người bạn đồng hành giúp bạn hiểu chính mình.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Cẩm nang AI giúp hiểu mình và ra quyết định',
      },
    ],
  },
  // V4-FIX BUG-NEW5: dropped `width`/`height` from `twitter.images`. Next.js
  // emits them as `<meta name="twitter:image:width">` / `:height` which are NOT
  // part of the Twitter Cards spec (only `twitter:image` + `twitter:image:alt`
  // are valid; Twitter auto-detects image dimensions). W3C validator flagged
  // these as unknown meta names. Keep width/height on `openGraph.images` —
  // those render as `<meta property="og:image:width">` per OG spec (valid).
  twitter: {
    card: 'summary_large_image',
    title: 'hieu.asia — Tử Vi & MBTI bằng AI',
    description: 'Tử Vi · MBTI · Palm Reading bằng AI',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Cẩm nang AI giúp hiểu mình và ra quyết định',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0F0F12' },
    { media: '(prefers-color-scheme: light)', color: '#B8923D' },
  ],
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // Wave 60.68 — PWA / iOS notch + home-indicator support.
  // `viewport-fit=cover` lets `env(safe-area-inset-*)` resolve to actual
  // insets on iPhone (otherwise the page treats the notch as part of the
  // safe area and our bottom-nav / FAB pad-bottom math is a no-op).
  // `interactiveWidget=resizes-content` (Chromium) keeps the iOS-style
  // keyboard-resize behavior so floating chat composers don't clip.
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${beVietnam.variable} ${outfit.variable} ${instrumentSerif.variable}`}
    >
      <head>
        {/* Wave 55 LCP #3 — dropped 3 unused preconnects.
            • fonts.gstatic.com: fonts self-hosted via next/font/google now.
            • supabase.co: only hit on auth/data click, not initial render.
            • api.hieu.asia: same — server-action / fetch on user interaction.
            Wasted preconnects burn DNS/TLS slots that the browser needs for
            critical-path resources. -0.2 to -0.5 s LCP. */}
        {/* Wave 60.95.m perf — preconnect to PostHog (fires on initial render
            via PostHogProvider). Saves ~100-300 ms first analytics flush vs
            cold DNS+TLS. Sub-agent Z perf audit finding. Sentry ingest
            preconnect skipped pending confirmation of exact host
            (browser.sentry-cdn.com is CDN; events go to *.ingest.us.sentry.io
            with project-specific subdomain — adding wrong host wastes a slot). */}
        <link rel="preconnect" href="https://us.i.posthog.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-ink focus:outline-none focus:ring-2 focus:ring-cream"
        >
          Bỏ qua đến nội dung chính
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Wave 60.95.p — `enableSystem={false}` so OS-level
              `prefers-color-scheme: light` does NOT auto-switch the site to
              light mode. Light mode is feature-gated to null render in
              ThemeToggle (Wave 60.79.T1, vault 112 P0-01): ~2,300 hardcoded
              `bg-warm-dark-*` / `text-cream-*` tokens across 182 pages would
              produce a broken visual sandwich (dark hero + light WhyTrust +
              dark FAQ wrapper) for users whose OS prefers light. The
              miniapp-telegram layout already uses `enableSystem={false}` for
              the same reason. Re-enable when warm-dark light variants ship
              Wave 60.82+ and the dark-locked tokens are migrated. */}
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <QueryProvider>
              <LazyMotionProvider>
                <Suspense fallback={null}>
                  <PostHogProvider>{children}</PostHogProvider>
                </Suspense>
                {/* Wave 41 Track E — CMP cookie consent banner. Renders only
                    on first visit (geo-aware: VN + EU always; auto-accept
                    legitimate-interest defaults elsewhere). */}
                <ConsentBanner />
                {/* Wave 60.68 — PWA bottom-nav. Renders ONLY in standalone
                    display-mode AND on in-app routes (/account, /reading,
                    /dashboard, /journal, /decisions). No-op otherwise. */}
                <AppShell />
              </LazyMotionProvider>
            </QueryProvider>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
        <PlausibleScript />
        {/* Vercel telemetry — mount cuối <body> để fire sau khi providers init xong. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
