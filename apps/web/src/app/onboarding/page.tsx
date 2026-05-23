import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ConsentForm } from '@/components/consent-form';
import { SiteNav } from '@/components/home/SiteNav';
import { OnboardingRecap, OnboardingStepBadge } from '@/components/onboarding-recap';

export const metadata: Metadata = {
  title: 'Mở khóa lá số',
  description:
    'Bắt đầu lá số cá nhân hoá — bước 1/4. Đồng ý xử lý dữ liệu theo Nghị định 13/2023/NĐ-CP. Mã hoá AES-256, không bán dữ liệu, có quyền rút lại bất cứ lúc nào.',
  alternates: { canonical: 'https://hieu.asia/onboarding' },
  openGraph: {
    title: 'Mở khóa lá số',
    description:
      'Bắt đầu hành trình hiểu chính mình — bước 1/4. Đồng ý xử lý dữ liệu để tạo lá số.',
    url: 'https://hieu.asia/onboarding',
    type: 'website',
  },
  robots: { index: false, follow: true },
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden bg-background pt-20 pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-[-10%] h-[300px] w-[300px] rounded-full bg-purple/20 blur-3xl"
        />

        <section className="relative mx-auto max-w-2xl px-6">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              <Link href="/" className="hover:text-gold">Trang chủ</Link>
              <span className="mx-1.5">/</span>
              <span className="text-muted-foreground">Mở khóa lá số</span>
            </span>
            <OnboardingStepBadge />
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Hiểu mình. Quyết định mình.
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Mở khóa <span className="bg-gold-gradient bg-clip-text text-transparent">lá số</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/75">
            Trước khi bắt đầu, vui lòng xem các mục dữ liệu hieu.asia sẽ xử lý.
            Bạn có quyền từ chối hoặc rút lại đồng ý bất cứ lúc nào tại trang{' '}
            <Link href="/account" className="text-gold underline-offset-4 hover:underline">
              Tài khoản
            </Link>
            .
          </p>

          <OnboardingRecap />

          <Card className="mt-8 border-gold/20 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Đồng ý xử lý dữ liệu sinh</CardTitle>
              <CardDescription className="text-muted-foreground">
                Bước này chỉ hỏi quyền tối thiểu cần để lập lá số. Quyền tuỳ chọn
                (Palm, MBTI, lưu chat) sẽ hỏi sau khi bạn dùng đến.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsentForm />
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Mã hoá AES-256 · TLS 1.3 · Không dùng dữ liệu cá nhân để huấn luyện
            mô hình. Chỉ dùng dữ liệu đã ẩn danh để cải thiện prompt — bạn có
            thể tắt tùy chọn này bất cứ lúc nào.
          </p>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Chưa muốn quyết định ngay?{' '}
            <Link href="/sample-report" className="text-gold underline-offset-4 hover:underline">
              Xem báo cáo mẫu trước →
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
