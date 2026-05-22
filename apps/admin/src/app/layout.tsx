import type { Metadata } from 'next';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { Be_Vietnam_Pro, Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { PostHogProvider } from '@/components/posthog-provider';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { MobileNav } from '@/components/mobile-nav';
import { Toaster } from '@hieu-asia/ui';
import { ADMIN_SESSION_COOKIE, verifySession } from '@/lib/auth';
import './globals.css';

const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam',
  display: 'swap',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'admin.hieu.asia', template: '%s · admin.hieu.asia' },
  description: 'Bảng điều khiển vận hành — operations + cost tracking + RAG management.',
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  const adminEmail = session?.email ?? '';

  // No session → render children without chrome (login page handles itself).
  if (!adminEmail) {
    return (
      <html
        lang="vi"
        suppressHydrationWarning
        className={`${beVietnam.variable} ${inter.variable} ${outfit.variable} ${mono.variable}`}
      >
        <body>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Suspense fallback={null}>
              <PostHogProvider>
                <QueryProvider>{children}</QueryProvider>
              </PostHogProvider>
            </Suspense>
          </ThemeProvider>
        </body>
      </html>
    );
  }

  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${beVietnam.variable} ${inter.variable} ${outfit.variable} ${mono.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Suspense fallback={null}>
            <PostHogProvider>
              <QueryProvider>
                <div className="min-h-screen bg-ink-radial">
                  <Sidebar />
                  <div className="lg:pl-64">
                    <Topbar adminEmail={adminEmail} />
                    <main className="px-4 pb-20 pt-6 lg:px-8 lg:py-8 lg:pb-8">{children}</main>
                  </div>
                  <MobileNav />
                </div>
              </QueryProvider>
            </PostHogProvider>
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
