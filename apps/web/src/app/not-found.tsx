import Link from 'next/link';
import { Button } from '@hieu-asia/ui';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-radial px-6 py-16 text-cream">
      <div className="mx-auto max-w-lg text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">404 · not found</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold text-cream sm:text-5xl">
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
