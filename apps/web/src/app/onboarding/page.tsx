import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ConsentForm } from '@/components/consent-form';

export const metadata = {
  title: 'Mở khóa lá số — hieu.asia',
  description:
    'Mỗi quyết định quan trọng cần một góc nhìn sâu hơn — bắt đầu bằng đồng ý xử lý dữ liệu theo Nghị định 13/2023/NĐ-CP để tạo lá số.',
};

export default function OnboardingPage() {
  return (
    <main id="main-content" className="min-h-screen bg-ink-radial">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-xl font-semibold text-gold">
          hieu.asia
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-cream/50">Bước 1 / 4</span>
      </header>

      <section className="container mx-auto max-w-2xl px-6 pb-20 pt-6">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-gold/70">
          Hiểu mình. Quyết định mình.
        </p>
        <h1 className="mb-6 font-heading text-3xl font-semibold text-cream sm:text-4xl">
          Mở khóa lá số — Bước 1/4
        </h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Trước khi bắt đầu</CardTitle>
            <CardDescription>
              Hệ thống sẽ xử lý các dữ liệu sau để tạo lá số cá nhân hóa. Vui lòng xem kỹ và đồng ý
              từng mục. Bạn có quyền từ chối hoặc rút lại đồng ý bất cứ lúc nào.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConsentForm />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
