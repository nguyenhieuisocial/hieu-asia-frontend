import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { BirthDataForm } from '@/components/birth-data-form';
import { SiteNav } from '@/components/home/SiteNav';
import { WizardFooter } from '@/components/onboarding/WizardFooter';
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
      <main id="main-content" className="min-h-screen bg-ink-radial pt-nav-safe">
        <header className="container mx-auto flex items-center justify-between px-6 py-5">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <Link href="/onboarding" className="hover:text-gold">Lập lá số miễn phí</Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Thông tin sinh</span>
          </nav>
          {/* Step counter lives in WizardFooter ("BƯỚC 4/4") — a badge here
              rendered a second counter on the same screen. OnboardingStepBadge
              stays in use on /onboarding, which has no WizardFooter. */}
        </header>

        <section className="container mx-auto max-w-2xl px-6 pb-20 pt-2">
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

          <WizardFooter currentStep={4} totalSteps={4} previousHref="/onboarding/consent" />
        </section>
      </main>
    </>
  );
}
