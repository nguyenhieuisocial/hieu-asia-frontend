import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { BirthDataForm } from '@/components/birth-data-form';

export const metadata = { title: 'Thông tin ngày sinh' };

export default function NewReadingPage() {
  return (
    <main className="min-h-screen bg-ink-radial">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-xl font-semibold text-gold">
          hieu.asia
        </Link>
        <span className="font-mono text-xs uppercase tracking-widest text-cream/50">Bước 2 / 4</span>
      </header>

      <section className="container mx-auto max-w-2xl px-6 pb-20 pt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Thông tin ngày sinh</CardTitle>
            <CardDescription>
              Dữ liệu này dùng để dựng lá số và mốc thời gian luận giải. Bạn có thể chỉnh sửa lại
              sau, trước khi báo cáo được tạo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BirthDataForm />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
