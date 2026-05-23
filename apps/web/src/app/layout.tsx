import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
// Wave 55 LCP #1 — dropped Inter import. Inter only sat in the `sans` fallback
// chain (`var(--font-be-vietnam), var(--font-inter), ...`) and almost never
// actually rendered because Be Vietnam Pro already covers latin. Removing it
// drops ~1 woff2 file from the critical-path font fan-out.
import { Be_Vietnam_Pro, Outfit, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { PlausibleScript } from '@/components/analytics/PlausibleScript';
import { PostHogProvider } from '@/components/PostHogProvider';
import { ConsentBanner } from '@/components/cmp/ConsentBanner';
import { Toaster } from '@hieu-asia/ui';
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
const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'hieu.asia — Tử Vi & MBTI bằng AI',
    description: 'Tử Vi · MBTI · Palm Reading bằng AI',
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
      className={`${beVietnam.variable} ${outfit.variable} ${mono.variable}`}
    >
      <head>
        {/* Wave 55 LCP #3 — dropped 3 unused preconnects.
            • fonts.gstatic.com: fonts self-hosted via next/font/google now.
            • supabase.co: only hit on auth/data click, not initial render.
            • api.hieu.asia: same — server-action / fetch on user interaction.
            Wasted preconnects burn DNS/TLS slots that the browser needs for
            critical-path resources. -0.2 to -0.5 s LCP. */}
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
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <QueryProvider>
              <Suspense fallback={null}>
                <PostHogProvider>{children}</PostHogProvider>
              </Suspense>
              {/* Wave 41 Track E — CMP cookie consent banner. Renders only
                  on first visit (geo-aware: VN + EU always; auto-accept
                  legitimate-interest defaults elsewhere). */}
              <ConsentBanner />
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
