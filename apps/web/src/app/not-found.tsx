import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';

export const metadata: Metadata = {
  title: 'Không tìm thấy trang',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  // V4-FIX BUG-029: was <main>. not-found.tsx renders alongside route segments
  // during streaming so duplicates the page's <main> landmark. Use <section>
  // — Next.js sets the document status to 404 via the App Router, and the
  // h1 below ("Trang không tồn tại") still provides the page-level heading.
  return (
    <section
      className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground"
    >
      <div className="mx-auto max-w-lg text-center">
        <p
          aria-hidden
          className="bg-gold-gradient bg-clip-text font-heading text-[120px] font-bold leading-none text-transparent sm:text-[160px]"
        >
          404
        </p>
        <p className="mt-2 font-mono text-xs font-medium uppercase tracking-[0.12em] text-gold-700">
          không tìm thấy trang này
        </p>
        <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
          Trang không tồn tại
        </h1>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          Có thể link đã hết hạn hoặc gõ sai. Hãy quay về trang chủ hoặc xem lại
          báo cáo của bạn.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg"><Link href="/">
            Về trang chủ
          </Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/account">
            
              Tài khoản
            
          </Link></Button>
          <Button asChild size="lg" variant="ghost"><Link href="/onboarding">
            
              Bắt đầu luận giải
            
          </Link></Button>
        </div>
      </div>
    </section>
  );
}
