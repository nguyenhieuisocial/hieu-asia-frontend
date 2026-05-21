import Link from 'next/link';
import { Button } from '@hieu-asia/ui';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16 text-cream">
      <div className="mx-auto max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">404</p>
        <h1 className="mt-3 font-heading text-2xl font-semibold text-cream sm:text-3xl">
          Trang admin không tồn tại
        </h1>
        <p className="mt-3 text-sm text-cream/70">
          Đường dẫn không khớp với route nào trong admin panel. Có thể bạn vừa gõ sai URL.
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button size="lg">Về Tổng quan</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
