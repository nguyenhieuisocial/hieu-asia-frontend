import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { BirthDataForm } from '@/components/birth-data-form';
import { SiteNav } from '@/components/home/SiteNav';
import { OnboardingStepBadge } from '@/components/onboarding-recap';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata = {
  title: 'Thông tin ngày sinh',
  description:
    'Bước 4/4 — nhập ngày, giờ và nơi sinh để dựng lá số Tử Vi và Bát Tự. Bạn có thể chỉnh sửa sau, trước khi báo cáo được tạo.',
  alternates: { canonical: 'https://hieu.asia/onboarding/birth' },
  openGraph: {
    title: 'Thông tin ngày sinh',
    description:
      'Bước 4 / 4 — nhập ngày, giờ, nơi sinh để dựng lá số Tử Vi và Bát Tự.',
    url: 'https://hieu.asia/onboarding/birth',
    type: 'website' as const,
    images: OG_DEFAULT_IMAGES,
  },
  robots: { index: false, follow: true },
};

export default function OnboardingBirthPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-ink-radial pt-16">
        <header className="container mx-auto flex items-center justify-between px-6 py-5">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <Link href="/onboarding" className="hover:text-gold">Mở khoá lá số</Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Thông tin sinh</span>
          </nav>
          <OnboardingStepBadge />
        </header>

        <section className="container mx-auto max-w-2xl px-6 pb-20 pt-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">Bước 4 / 4</p>
          <Card className="mt-3 border-gold/20 bg-card/60 backdrop-blur">
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

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link href="/onboarding/consent" className="text-gold underline underline-offset-4 hover:opacity-80">
              ← Quay lại bước Đồng ý dữ liệu
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
