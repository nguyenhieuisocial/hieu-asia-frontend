import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';

export const metadata: Metadata = {
  title: 'Không tìm thấy trang',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-radial px-6 py-16 text-cream">
      <div className="mx-auto max-w-lg text-center">
        <p
          aria-hidden
          className="bg-gold-gradient bg-clip-text font-heading text-[120px] font-bold leading-none text-transparent sm:text-[160px]"
        >
          404
        </p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-gold/80">
          không tìm thấy trang này
        </p>
        <h1 className="mt-6 font-heading text-3xl font-semibold text-cream sm:text-4xl">
          Trang không tồn tại
        </h1>
        <p className="mt-4 text-sm text-cream/70 sm:text-base">
          Có thể link đã hết hạn hoặc gõ sai. Hãy quay về trang chủ và bắt đầu lại từ đó.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/">
            <Button size="lg">Về trang chủ</Button>
          </Link>
          <Link href="/onboarding">
            <Button size="lg" variant="outline">
              Bắt đầu luận giải
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
