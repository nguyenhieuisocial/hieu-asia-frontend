import type { Metadata } from 'next';
import { Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Bản tin hieu.asia — Tử Vi hàng tuần',
  description:
    'Mỗi tuần một bài viết ngắn về cách dùng Tử Vi để ra quyết định tốt hơn, kèm cập nhật sản phẩm. Không spam, không bán hàng, huỷ bất cứ lúc nào.',
  alternates: { canonical: 'https://hieu.asia/newsletter' },
};

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: 'Tử Vi ứng dụng',
    text: 'Mỗi tuần một góc nhìn — cách đọc lá số cho các quyết định nghề nghiệp, tài chính, gia đình.',
  },
  {
    icon: Mail,
    title: 'Cập nhật sản phẩm',
    text: 'Tính năng mới, công cụ mới ở hieu.asia — biết trước, dùng trước.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero spam',
    text: 'Không bán email, không quảng cáo bên thứ ba, huỷ đăng ký một-cú-nhấp bất cứ lúc nào.',
  },
];

export default function NewsletterHubPage() {
  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <main id="main-content" className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
        <header className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80">
            Newsletter
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Bản tin <span className="bg-gold-gradient bg-clip-text text-transparent">hieu.asia</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-cream/75 sm:text-lg">
            Mỗi tuần một bài viết ngắn về Tử Vi ứng dụng và cập nhật sản phẩm
            tại hieu.asia. Cam kết không spam — chỉ nội dung đáng đọc.
          </p>
        </header>

        <section aria-labelledby="why-heading" className="mb-12">
          <h2 id="why-heading" className="sr-only">
            Bạn nhận được gì
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="border-gold/15 bg-ink/60">
                <CardContent className="pt-6">
                  <Icon className="mb-3 h-5 w-5 text-gold/80" aria-hidden="true" />
                  <p className="font-heading text-base font-semibold text-cream">
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-cream/70">
                    {text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <NewsletterSignup variant="inline" id="newsletter-hub" />
      </main>
      <SiteFooter />
    </div>
  );
}
