import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Briefcase, Compass, Target, AlertTriangle, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata: Metadata = {
  title: 'Tử Vi nghề nghiệp: bạn hợp ngành nào, vai trò gì, môi trường nào?',
  description:
    'Tử Vi sự nghiệp — đọc cung Quan Lộc, Tài Bạch, Thiên Di + đại vận để tìm môi trường + vai trò hợp với thiên hướng cá nhân. Miễn phí lập lá số.',
  alternates: { canonical: 'https://hieu.asia/tu-vi-nghe-nghiep' },
  openGraph: {
    title: 'Tử Vi nghề nghiệp',
    description: 'Quan Lộc + Tài Bạch + Thiên Di — bản đồ thiên hướng sự nghiệp.',
    url: 'https://hieu.asia/tu-vi-nghe-nghiep',
    type: 'article',
  },
};

const PATTERNS = [
  {
    icon: Target,
    title: 'Có cấu trúc + tự chủ trong vai trò',
    body: 'Quan Lộc có Tử Vi/Thiên Phủ → hợp vai trò có thẩm quyền nhưng vẫn cần kỷ luật cao. Ví dụ: chuyên gia kỹ thuật, quản lý cấp trung, founder team nhỏ.',
  },
  {
    icon: Briefcase,
    title: 'Chuyên môn sâu, không thích quản lý người',
    body: 'Quan Lộc có Vũ Khúc/Thiên Cơ → hợp việc đào sâu một lĩnh vực. Ví dụ: kỹ sư, kế toán, nghiên cứu, IC track.',
  },
  {
    icon: Compass,
    title: 'Truyền cảm hứng + sức ảnh hưởng',
    body: 'Quan Lộc có Thái Dương → hợp việc trước công chúng. Ví dụ: giảng dạy, marketing, sales, content creator.',
  },
  {
    icon: AlertTriangle,
    title: 'Khởi nghiệp + đổi mới',
    body: 'Quan Lộc có Thất Sát/Phá Quân → hợp môi trường biến động. Cẩn trọng nếu Tài Bạch không đủ ổn.',
  },
];

const QUESTIONS = [
  'Bạn có hợp đi làm thuê hay tự kinh doanh?',
  'Bạn có nên chuyển ngành ở giai đoạn này không?',
  'Bạn hợp quản lý hay chuyên môn sâu?',
  'Môi trường tổ chức lớn hay startup hợp bạn hơn?',
  'Năm 2026 nên đẩy hay giữ vai trò hiện tại?',
];

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Tử Vi nghề nghiệp', item: 'https://hieu.asia/tu-vi-nghe-nghiep' },
  ],
};

export default function TuViNgheNghiepPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-12 sm:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Tử Vi · Sự nghiệp & vai trò
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Bạn hợp ngành nào, vai trò gì, môi trường nào?
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Tử Vi không kê khai "bạn sẽ làm nghề X". Nhưng cung Quan Lộc + Tài Bạch +
            Thiên Di cho biết KIỂU vai trò, KIỂU môi trường, KIỂU đồng nghiệp mà bạn
            phát huy tốt nhất. Lập lá số 2 phút để xem 4 cung chính ảnh hưởng nghề
            nghiệp của bạn.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/onboarding">
              <Button size="lg">Xem tử vi nghề nghiệp của tôi</Button>
            </Link>
            <Link href="/tu-vi/cung-quan-loc">
              <Button size="lg" variant="outline">
                Cung Quan Lộc là gì
              </Button>
            </Link>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            4 khuôn mẫu nghề nghiệp thường gặp
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PATTERNS.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.title} className="border-border bg-card/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-start gap-2 font-heading text-base text-foreground">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                      {p.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <Card className="border-border bg-card/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Mentor sẽ giúp bạn trả lời 5 câu này
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
                {QUESTIONS.map((q, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 font-mono text-gold/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-muted-foreground">
                Mentor không trả lời "có" hoặc "không" — Mentor hỏi lại bối cảnh, đối chiếu lá số,
                và đưa 2–3 kịch bản với điều kiện kiểm chứng. Bạn vẫn là người quyết định.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Bắt đầu — xem Quan Lộc + Tài Bạch của bạn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Lập lá số (2 phút, miễn phí). Bạn sẽ thấy 12 cung tương tác, click vào cung
              Quan Lộc để xem chính tinh + đại vận + lưu niên. Sau đó hỏi Mentor về quyết
              định nghề cụ thể của bạn.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/onboarding">
                <Button size="lg">Lập lá số miễn phí</Button>
              </Link>
              <Link
                href="/sample-report"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Xem mẫu báo cáo <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
