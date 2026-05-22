import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Briefcase,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

const SLUG = 'su-nghiep';
const TOPIC = 'career';

export const metadata: Metadata = {
  title: 'Sự nghiệp — lộ trình · hieu.asia',
  description:
    'Đang phân vân sự nghiệp? Lộ trình đọc cung Quan Lộc, Tài Bạch, Thiên Di kết hợp đại vận để giúp bạn tách "cảm giác mệt" khỏi "cơ hội thật" — và lập một Decision Brief có rủi ro kèm.',
  alternates: { canonical: `https://hieu.asia/lo-trinh/${SLUG}` },
  openGraph: {
    title: 'Sự nghiệp — lộ trình · hieu.asia',
    description:
      'Hiểu để chuyển động đúng: Quan Lộc, Tài Bạch, Thiên Di + Decision Brief có rủi ro kèm.',
    url: `https://hieu.asia/lo-trinh/${SLUG}`,
    type: 'website',
  },
};

const TOOLS: { name: string; desc: string; href: string }[] = [
  {
    name: 'Cung Quan Lộc',
    desc: 'Vai trò, môi trường làm việc, kiểu công việc bạn phát huy được năng lực.',
    href: '/tu-vi/cung-quan-loc',
  },
  {
    name: 'Cung Tài Bạch',
    desc: 'Dòng tiền — kiểu tiền vào, kiểu tiền ra, mức độ ổn định bạn cần để an tâm.',
    href: '/tu-vi/cung-tai-bach',
  },
  {
    name: 'Cung Thiên Di',
    desc: 'Cơ hội bên ngoài, khả năng di chuyển, môi trường mới — chìa khoá khi cân nhắc đổi việc.',
    href: '/tu-vi/cung-thien-di',
  },
  {
    name: 'Decision Brief (nghề nghiệp)',
    desc: 'Tóm tắt 2-4 lựa chọn cụ thể, rủi ro và kiểm chứng — không phải lời tiên tri.',
    href: '/decisions/new?topic=career',
  },
  {
    name: 'Career Fit',
    desc: 'Khớp lá số với nhóm nghề có cộng hưởng — đang trong phát triển, gợi ý sớm.',
    href: '/lo-trinh/su-nghiep#career-fit',
  },
];

const QUESTIONS: { q: string; a: string }[] = [
  {
    q: 'Tôi có nên đổi việc không?',
    a: 'Decision Brief giúp bạn tách "cảm giác mệt" khỏi "cơ hội thật sự". Hệ thống đọc Quan Lộc + Tài Bạch + đại vận hiện tại để gợi 2-4 lựa chọn cụ thể với rủi ro kèm — kèm câu hỏi tự phản tư để bạn không quyết vội vì cảm xúc.',
  },
  {
    q: 'Tôi hợp làm thuê hay tự kinh doanh?',
    a: 'Lá số chỉ ra kiểu năng lượng bạn cần để duy trì — có người cần cấu trúc, có người cần tự do. Quan Lộc + Phúc Đức cho biết ngưỡng chịu rủi ro thật, không phải ngưỡng bạn "muốn" có. Câu trả lời thường nằm giữa hai cực, kèm điều kiện cụ thể.',
  },
  {
    q: 'Khi nào là thời điểm nên đẩy mạnh / nên giữ?',
    a: 'Đại vận và lưu niên cho biết bạn đang ở pha tích luỹ, mở rộng hay củng cố. Hệ thống gợi ý 3 cửa sổ thời gian trong 12 tháng tới — kèm chỉ báo nội bộ để bạn tự kiểm chứng, không phải lịch thiên định.',
  },
];

const FIT: string[] = [
  'Bạn đang cân nhắc đổi việc, đổi ngành, hoặc rời công ty hiện tại',
  'Bạn đã chạy 2-3 năm liên tục và bắt đầu nghi ngờ hướng đi',
  'Bạn vừa được offer mới và muốn đánh giá bình tĩnh hơn',
  'Bạn tự kinh doanh và cần một góc nhìn ngoài về thời điểm',
  'Bạn muốn lập kế hoạch năm có chỗ cho cả công việc lẫn năng lượng cá nhân',
];

const NOT_FIT: string[] = [
  'Đang cần tư vấn nghề nghiệp chuyên môn cấp cao (hãy gặp career coach)',
  'Cần lời khuyên đầu tư cụ thể (chúng tôi không tư vấn mua/bán cổ phiếu, crypto, BĐS)',
  'Muốn ai đó quyết hộ (chúng tôi giúp bạn nhìn rõ — bạn vẫn là người quyết)',
];

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Lộ trình', item: 'https://hieu.asia/lo-trinh' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Sự nghiệp',
      item: `https://hieu.asia/lo-trinh/${SLUG}`,
    },
  ],
};

export default function SuNghiepPage() {
  return (
    <div className="min-h-screen bg-ink text-cream">
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

        <section className="relative mx-auto max-w-4xl px-6 pb-10 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-cream/55">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/lo-trinh" className="hover:text-gold">
              Lộ trình
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-cream/70">Sự nghiệp</span>
          </nav>

          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 text-gold">
            <Briefcase className="h-5 w-5" aria-hidden />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Lộ trình · Tôi đang phân vân sự nghiệp
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-cream sm:text-5xl">
            Sự nghiệp — Hiểu để chuyển động đúng
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-cream/75 sm:text-lg">
            Đứng giữa ngã ba ở lại / đổi việc / tự làm là chuyện ai cũng gặp một lần. Lộ
            trình này không nói cho bạn nên chọn gì — nó dựng ba góc nhìn (vai trò, dòng
            tiền, cơ hội bên ngoài) để bạn ra quyết định không hối tiếc.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/onboarding/topic?topic=${TOPIC}`}>
              <Button size="lg">Bắt đầu lập lá số</Button>
            </Link>
            <Link href="/decisions/new?topic=career">
              <Button size="lg" variant="outline">
                Ghi quyết định sự nghiệp
              </Button>
            </Link>
          </div>
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-12">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-gold" aria-hidden />
            <h2 className="font-heading text-2xl font-semibold text-cream sm:text-3xl">
              Bạn sẽ dùng tới những công cụ này
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <Link key={t.name} href={t.href}>
                <Card className="h-full border-cream/10 bg-ink/40 transition-colors hover:border-gold/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-base text-cream">
                      {t.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs leading-relaxed text-cream/70">
                    {t.desc}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-12">
          <div className="mb-6 flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-gold" aria-hidden />
            <h2 className="font-heading text-2xl font-semibold text-cream sm:text-3xl">
              3 câu hỏi điển hình lộ trình này trả lời
            </h2>
          </div>
          <div className="space-y-4">
            {QUESTIONS.map((qa) => (
              <div
                key={qa.q}
                className="rounded-xl border border-cream/10 bg-ink/40 p-5"
              >
                <p className="font-heading text-base font-semibold text-cream">{qa.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">{qa.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-cream/10 bg-ink/40 p-6">
              <h2 className="font-heading text-xl font-semibold text-cream">
                Phù hợp khi bạn...
              </h2>
              <ul className="mt-4 space-y-2.5">
                {FIT.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-cream/75">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-cream/10 bg-ink/30 p-6">
              <h2 className="font-heading text-xl font-semibold text-cream">
                Không phù hợp khi bạn...
              </h2>
              <ul className="mt-4 space-y-2.5">
                {NOT_FIT.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-cream/70">
                    <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-cream/40" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-12">
          <Link
            href="/community/cases/khoi-nghiep-lan-thu-3"
            className="group block rounded-xl border border-cream/10 bg-ink/30 p-5 transition-colors hover:border-gold/40"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/70">
              Đọc case study tương tự
            </p>
            <p className="mt-2 font-heading text-base font-semibold text-cream group-hover:text-gold">
              Khởi nghiệp lần thứ 3 sau 2 thất bại — có nên thử nữa?
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-cream/65">
              Nam, 41 tuổi · cung Mệnh Phá Quân + Liêm Trinh · tách 2 thất bại thành 2 bài học khác nhau trước khi quyết.
            </p>
          </Link>
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-20">
          <div className="rounded-xl border border-cream/10 bg-ink/40 p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold text-cream">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cream/70">
              Lập lá số mất khoảng 3 phút. Bạn có thể xem mẫu báo cáo trước nếu muốn
              biết kết quả trông như thế nào.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/onboarding/topic?topic=${TOPIC}`}>
                <Button size="lg">Bắt đầu lập lá số</Button>
              </Link>
              <Link
                href="/sample-report"
                className="inline-flex items-center text-sm text-cream/70 hover:text-gold"
              >
                Xem mẫu báo cáo
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
