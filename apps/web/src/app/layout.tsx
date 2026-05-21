import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import './globals.css';

const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
  alternates: {
    canonical: 'https://hieu.asia',
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
      className={`${beVietnam.variable} ${inter.variable} ${outfit.variable} ${mono.variable}`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
