import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ConsentForm } from '@/components/consent-form';

export const metadata = { title: 'Đồng ý xử lý dữ liệu' };

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
        <h1 className="mb-6 font-heading text-3xl font-semibold text-cream sm:text-4xl">
          Bắt đầu phân tích — Bước 1/4
        </h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Trước khi bắt đầu</CardTitle>
            <CardDescription>
              Hệ thống sẽ xử lý các dữ liệu sau để tạo báo cáo cá nhân hóa. Vui lòng xem kỹ và đồng ý
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
