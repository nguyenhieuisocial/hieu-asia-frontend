import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Be_Vietnam_Pro, Inter } from 'next/font/google';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { PostHogProvider } from '@/components/posthog-provider';
import { TelegramThemeBridge } from '@/components/telegram-theme-bridge';
import { TelegramWebAppProvider } from '@/components/telegram-webapp-provider';
import './globals.css';

const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam',
  display: 'swap',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
// 2026-06-29 — Outfit + JetBrains Mono removed. Headings + `font-mono` labels
// both resolve to Be Vietnam Pro via the shared tokens (full VN coverage).

export const metadata: Metadata = {
  metadataBase: new URL('https://miniapp.hieu.asia'),
  title: 'hieu.asia Mini App',
  description: 'Telegram Mini App cho hieu.asia — Tử Vi, Bát Tự, MBTI bằng AI ngay trong Telegram.',
  alternates: { canonical: 'https://miniapp.hieu.asia' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://miniapp.hieu.asia',
    siteName: 'hieu.asia',
    title: 'hieu.asia Mini App',
    description: 'Mở trong Telegram để dùng — Tử Vi, Bát Tự, MBTI bằng AI.',
  },
  robots: { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0F0F12',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${beVietnam.variable} ${inter.variable}`}
    >
      <body>
        {/* Official Telegram WebApp loader — required for SDK before hydration. */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <TelegramThemeBridge />
            <TelegramWebAppProvider>
              <Suspense fallback={null}>
                <PostHogProvider>
                  <QueryProvider>{children}</QueryProvider>
                </PostHogProvider>
              </Suspense>
            </TelegramWebAppProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
