import type { Metadata, Viewport } from 'next';
// Wave 55 LCP #1 — dropped Inter import. Inter only sat in the `sans` fallback
// chain (`var(--font-be-vietnam), var(--font-inter), ...`) and almost never
// actually rendered because Be Vietnam Pro already covers latin. Removing it
// drops ~1 woff2 file from the critical-path font fan-out.
// Wave 56 (V4 Sprint B) LCP — dropped JetBrains_Mono from root layout. Mono
// only appears on `/brand` and `/changelog` (and in tiny uppercase labels via
// `font-mono` on home — those size-adjust gracefully to `ui-monospace` from
// the Tailwind fallback stack). Removing it cuts 3 woff2 files (latin-ext +
// latin + vietnamese subsets) from every page's critical path.
import { Be_Vietnam_Pro, Newsreader } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { LazyMotionProvider } from '@/components/providers/lazy-motion-provider';
import { PlausibleScript } from '@/components/analytics/PlausibleScript';
import { AhrefsAnalytics } from '@/components/analytics/AhrefsAnalytics';
import { GoogleTags } from '@/components/analytics/GoogleTags';
import { PostHogProvider } from '@/components/PostHogProvider';
import { ConsentBanner } from '@/components/cmp/ConsentBanner';
import { FloatingMentor } from '@/components/marketing/FloatingMentor';
import { BackToTop } from '@/components/BackToTop';
import { WebMcpTools } from '@/components/marketing/WebMcpTools';
import { Toaster } from '@hieu-asia/ui';
import { AppShell } from '@/components/product/AppShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteGraph } from '@/lib/seo/jsonld';
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
// Wave 62.01 — expanded weight set (400→500/600/700) and added italic style.
// Spec "Như giấy cũ" calls for italic-driven editorial voice; Be Vietnam Pro
// now serves italic body emphasis without falling back to synthetic italic.
// Weight 500 re-added (was dropped Wave 56) — used for nav + button labels in
// the new editorial system. The weight cost is ~1 woff2 file per subset
// (vietnamese + latin) per added weight, but the editorial direction makes
// the type system unworkable without 500.
const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

// 2026-06-29 VN-FIX: Outfit removed entirely. It was the `font-heading` lead
// font but has no Google Fonts 'vietnamese' subset, so every VN heading mixed
// fonts. Headings now use Be Vietnam Pro (see tailwind-preset heading token).
// Dropping the import also removes an unused webfont from the build.

// 2026-07-23 — Instrument Serif REMOVED. It was kept as a transitional fallback
// (Wave 62.01) and demoted to `preload: false` (Wave 62.05e), but the VN-
// diacritics fix pointed every display token at Newsreader, and the
// `font-marketing-display` utility was then dropped from tailwind.config.ts.
// Grep confirms nothing reads `var(--font-marketing-display)` — the font was
// downloaded and its variable attached to <html> for no consumer. Newsreader is
// the canonical editorial display; re-add only with a real consumer.

// Wave 62.01 — Newsreader Variable. Founder-locked editorial display serif
// per spec "Như giấy cũ": italic 300–800 with full diacritics, free via
// Google Fonts. Replaces Instrument Serif's role for hero + H1/H2 + pull
// quotes going forward. Three weights chosen for the 9-bậc type scale:
// - 300 (display 88px hero), 400 (H1-H3 normal), 500 (button label), 700 (H2 emphasis).
// Italic enabled for the signature `<em>verb</em>` accent inside headlines.
const newsreader = Newsreader({
  // 2026-06-22 — +'vietnamese' subset: Newsreader giờ là serif display DUY NHẤT
  // (marketing-display cũng trỏ về đây sau VN-fix) nên cần phủ trọn dấu tiếng Việt,
  // không phụ thuộc latin-ext (tránh fallback sang sans gây lẫn font).
  subsets: ['vietnamese', 'latin', 'latin-ext'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

// 2026-06-29 — JetBrains Mono removed entirely (founder: "vẫn còn thấy
// JetBrains"). The `font-mono` token now resolves to Be Vietnam Pro (see
// tailwind-preset), so label/eyebrow surfaces read consistently with the rest
// of the site. Dropping the import also removes the mono webfont from the build.

export const metadata: Metadata = {
  metadataBase: new URL('https://hieu.asia'),
  title: {
    // Tiêu đề mặc định phủ đủ 5 lăng kính (Tử Vi · Bát Tự · MBTI · Big Five ·
    // Xem Tướng) thay vì chỉ 2 — trước đây các trang không tự đặt title đều
    // hiện "Tử Vi & MBTI", bỏ sót 3 lăng kính còn lại.
    default: 'hieu.asia — Tử Vi, Bát Tự, MBTI, Big Five & Xem Tướng bằng AI',
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
  // SEO-FIX: removed root-level `url` from openGraph.
  // The root layout must NOT set `openGraph.url` because child pages that
  // inherit this block (without declaring their own `openGraph`) would get
  // `og:url = 'https://hieu.asia'` regardless of their canonical URL.
  // This caused Ahrefs "Open Graph URL ≠ canonical" on 28 pages.
  // Fix: omit `url` here — Next.js will not emit `<meta property="og:url">`
  // when the field is absent, which is correct. Pages that need a specific
  // og:url (e.g. the homepage) declare it in their own metadata export.
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
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
    description: 'Tử Vi · MBTI · Xem Tướng bằng AI',
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
  // Wave 62.02 — theme-color updated to vault 138 "Như giấy cũ" palette.
  // Wave 62.05b — colorScheme RE-FLIPPED to "light" now that Wave 62.05a
  // swept 121 legacy gold tokens to semantic primary. Marketing surfaces
  // greet first-visit users on Paper "Giấy thấm"; experience surfaces
  // (/reading, /dashboard, /tu-vi-*, /dai-van-hien-tai, /mentor) get
  // force-dark via the ThemeProvider pathname check (Night "Khoảng lặng").
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#15110C' },
    { media: '(prefers-color-scheme: light)', color: '#F3ECDD' },
  ],
  colorScheme: 'light',
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
      lang="vi"
      // globals.css sets `html { scroll-behavior: smooth }`. Next.js asks pages
      // to declare this so it keeps managing scroll on route transitions (and to
      // silence its dev warning + stay correct in a future Next version).
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${beVietnam.variable} ${newsreader.variable}`}
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
            cold DNS+TLS. Sub-agent Z perf audit finding.
            Wave 60.95.ao perf — add browser.sentry-cdn.com preconnect.
            Sentry session replay is lazy-loaded via
            `Sentry.lazyLoadIntegration('replayIntegration')` from this CDN
            (sentry.client.config.ts, Wave 60.95.m). Preconnect saves the
            TLS handshake when `requestIdleCallback` fires (~100-200 ms on
            slow networks). Event ingest still flows through our own
            `/monitoring` tunnel (next.config.ts tunnelRoute) so the
            *.ingest.us.sentry.io subdomain is intentionally NOT preconnected
            — that host is never hit from the browser in production. */}
        <link rel="preconnect" href="https://us.i.posthog.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://browser.sentry-cdn.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        {/* Site-wide structured data (Organization + WebSite) — centralized via
            lib/seo so answer engines (ChatGPT/Perplexity/Google AI Overviews)
            get a consistent, correct brand description on every page. */}
        <JsonLd data={siteGraph()} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-ink focus:outline-none focus:ring-2 focus:ring-cream"
        >
          Bỏ qua đến nội dung chính
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Wave 62.05b — defaultTheme RE-FLIPPED "dark" → "light" now
              that Wave 62.05a swept 121 legacy gold tokens to semantic
              primary. First-visit users now greet hieu.asia on Paper
              "Giấy thấm" (#F3ECDD bg) per vault 138 spec, with HeroV4
              editorial split layout + 12-cung neo thị giác in the new
              palette.

              Experience routes (/reading, /dashboard, /tu-vi-*,
              /dai-van-hien-tai, /mentor) force-dark via the ThemeProvider
              pathname check — those surfaces render Night "Khoảng lặng"
              (Charcoal × Bone × Gold-soft) regardless of user toggle,
              honoring the editorial intent that the reading itself is a
              dark, contemplative experience.

              `enableSystem={false}` STAYS — OS preference doesn't
              auto-flip the theme. Users who explicitly toggle to dark
              via SiteNav stay dark across sessions. */}
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <QueryProvider>
              <LazyMotionProvider>
                {/* Soft-404 fix: KHÔNG bọc {children} trong Suspense ở root —
                    boundary root làm shell flush trước khi page chạy → notFound()
                    hết đường trả HTTP 404 thật (mọi slug lạ thành 200+noindex).
                    Suspense cho useSearchParams nằm BÊN TRONG PostHogProvider,
                    chỉ quanh phần tracking. */}
                <PostHogProvider>{children}</PostHogProvider>
                {/* Wave 41 Track E — CMP cookie consent banner. Renders only
                    on first visit (geo-aware: VN + EU always; auto-accept
                    legitimate-interest defaults elsewhere). */}
                <ConsentBanner />
                {/* Wave 60.68 — PWA bottom-nav. Renders ONLY in standalone
                    display-mode AND on in-app routes (/account, /reading,
                    /dashboard, /journal, /decisions). No-op otherwise. */}
                <AppShell />
                {/* Persistent "Hỏi Mentor" entry (desktop-only; hidden on
                    experience routes). Surfaces the AI assistant like Bitget's
                    always-present GetAgent. */}
                <FloatingMentor />
                {/* Nút "về đầu trang" — mobile-only, hiện sau khi cuộn >2 màn. */}
                <BackToTop />
                {/* WebMCP — registers public read-only free tools with an
                    in-browser AI agent if the experimental
                    navigator.modelContext API exists. Feature-detected,
                    renders null, no-op otherwise. */}
                <WebMcpTools />
              </LazyMotionProvider>
            </QueryProvider>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
        <PlausibleScript />
        {/* Ahrefs Web Analytics — cookieless/GDPR-friendly (like Plausible),
            so it mounts un-gated. Feeds the AWT "Web Analytics" report with
            SEO-correlated traffic (traffic ↔ keywords/rankings). */}
        <AhrefsAnalytics />
        {/* GTM + GA4 — consent-gated: loads only after the visitor grants
            analytics consent (lib/google-tags via the CMP). Returning
            already-consented visitors get it re-loaded here on mount. */}
        <GoogleTags />
        {/* Vercel telemetry — mount cuối <body> để fire sau khi providers init xong. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
