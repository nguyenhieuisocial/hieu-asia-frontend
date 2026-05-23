import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { BirthDataForm } from '@/components/birth-data-form';
import { SiteNav } from '@/components/home/SiteNav';

export const metadata = {
  title: 'Thông tin ngày sinh',
  description:
    'Nhập ngày, giờ và nơi sinh để dựng lá số Tử Vi và Bát Tự. Bạn có thể chỉnh sửa sau, trước khi báo cáo được tạo.',
  alternates: { canonical: 'https://hieu.asia/reading/new' },
  openGraph: {
    title: 'Thông tin ngày sinh',
    description:
      'Bước 2 / 4 — nhập ngày, giờ, nơi sinh để dựng lá số Tử Vi và Bát Tự.',
    url: 'https://hieu.asia/reading/new',
    type: 'website' as const,
  },
  robots: { index: false, follow: true },
};

export default function NewReadingPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-ink-radial pt-16">
        <header className="container mx-auto flex items-center justify-between px-6 py-5">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <Link href="/reading" className="hover:text-gold">Lá số</Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Thông tin sinh</span>
          </nav>
          <span className="font-mono text-xs uppercase tracking-widest text-gold/70">
            Bước 2 / 4
          </span>
        </header>

        <section className="container mx-auto max-w-2xl px-6 pb-20 pt-2">
          <Card className="border-gold/20 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">
                <span className="bg-gold-gradient bg-clip-text text-transparent">
                  Thông tin
                </span>{' '}
                ngày sinh
              </CardTitle>
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
    </>
  );
}
