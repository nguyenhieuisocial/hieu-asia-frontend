import Link from 'next/link';
import { Button } from '@hieu-asia/ui';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12 text-cream">
      <div className="mx-auto max-w-sm text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">404</p>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-cream">
          Trang không có
        </h1>
        <p className="mt-2 text-sm text-cream/70">
          Mini App không tìm thấy đường dẫn này. Quay về dashboard để tiếp tục.
        </p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button size="lg" className="w-full">
              Về dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
