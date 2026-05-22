/**
 * /newsletter/confirmed — landing page for the double-opt-in confirmation
 * link. The worker `GET /email/confirm` redirects here with a `?status` param:
 *   - ok       → confirmed, show success
 *   - expired  → token expired or already used, point back to /#newsletter
 *   - invalid  → bad/missing token, point back to /#newsletter
 *
 * Pure server component — no client JS needed.
 */

import Link from 'next/link';
import { Check, AlertCircle } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export const metadata = {
  title: 'Xác nhận đăng ký newsletter',
  robots: { index: false, follow: false },
};

export default async function NewsletterConfirmedPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  const ok = status === 'ok';

  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-ink text-cream pt-16">
        <section className="mx-auto max-w-2xl px-6 py-24 text-center">
          {ok ? (
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <Check className="h-7 w-7" aria-hidden="true" />
            </div>
          ) : (
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
              <AlertCircle className="h-7 w-7" aria-hidden="true" />
            </div>
          )}
          <h1 className="mt-6 font-heading text-3xl font-bold leading-tight text-cream sm:text-4xl">
            {ok ? 'Đã xác nhận đăng ký' : 'Liên kết không hợp lệ'}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-cream/75">
            {ok
              ? 'Cảm ơn bạn. Bạn sẽ nhận được bài viết đầu tiên trong vài ngày tới — không spam, không bán hàng, huỷ bất cứ lúc nào.'
              : status === 'expired'
                ? 'Liên kết đã hết hạn hoặc đã được sử dụng. Bạn có thể đăng ký lại từ trang chủ.'
                : 'Liên kết không hợp lệ. Bạn có thể đăng ký lại từ trang chủ.'}
          </p>
          <Link
            href="/#newsletter"
            className="mt-8 inline-flex items-center justify-center rounded-md border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-medium text-gold hover:bg-gold/20"
          >
            {ok ? 'Về trang chủ' : 'Đăng ký lại'}
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
