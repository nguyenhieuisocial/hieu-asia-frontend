import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Calendar,
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
import { RelatedTools } from '@/components/tools/RelatedTools';
import { LoTrinhChart } from '@/components/lo-trinh/LoTrinhChart';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

const SLUG = 'ke-hoach-nam';
const TOPIC = 'general';

export const metadata: Metadata = {
  title: 'Lập kế hoạch năm — lộ trình',
  description:
    'Một bản đồ thời điểm cho 12 tháng tới: đại vận hiện tại, lưu niên 2026, planner năm và review tháng — bạn biết tháng nào nên đẩy, tháng nào nên giữ.',
  alternates: { canonical: `https://hieu.asia/lo-trinh/${SLUG}` },
  openGraph: {
    title: 'Lập kế hoạch năm — lộ trình',
    description:
      'Đại vận + lưu niên 2026 + planner + review — bản đồ thời điểm cho 12 tháng tới.',
    url: `https://hieu.asia/lo-trinh/${SLUG}`,
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

const TOOLS: { name: string; desc: string; href: string }[] = [
  {
    name: 'Đại vận hiện tại',
    desc: 'Pha 10 năm bạn đang ở — chủ đề lớn của giai đoạn này, không phải chuyện ngày qua ngày.',
    href: '/dai-van-hien-tai',
  },
  {
    name: 'Lưu niên 2026',
    desc: 'Lát cắt năm 2026 trên lá số của bạn — đâu là tháng tăng tốc, đâu là tháng nên giữ.',
    href: '/tu-vi-2026',
  },
  {
    name: 'Annual Planner',
    desc: 'Khung lập kế hoạch năm — gắn mục tiêu cá nhân với pha đại vận và lưu niên.',
    href: '/annual-planning',
  },
  {
    name: 'Monthly Review',
    desc: 'Sổ tay rà soát từng tháng — bạn kiểm chứng dự đoán đầu năm với thực tế tháng đó.',
    href: '/monthly-planning',
  },
];

const QUESTIONS: { q: string; a: string }[] = [
  {
    q: 'Năm 2026 tôi nên tập trung vào việc gì?',
    a: 'Lưu niên 2026 chiếu lên lá số bạn cho biết cung nào đang được nhấn — Quan Lộc, Tài Bạch, Phu Thê, hay Phúc Đức. Hệ thống gợi ý 2-3 mục tiêu năm cộng hưởng với pha hiện tại, kèm chỉ báo nội bộ để bạn tự kiểm chứng.',
  },
  {
    q: 'Tháng nào nên đẩy mạnh, tháng nào nên giữ?',
    a: 'Annual Planner phân bổ 12 tháng theo "pha vận hành" — tháng tăng tốc, tháng tích luỹ, tháng củng cố, tháng nghỉ. Không phải lịch thiên định — là một khung gợi ý để bạn cân năng lượng cá nhân, không kiệt sức vào tháng đáng lẽ phải nghỉ.',
  },
  {
    q: 'Đại vận hiện tại đang muốn tôi học bài gì?',
    a: 'Mỗi đại vận 10 năm có "chủ đề" rõ — học kỷ luật tài chính, học buông, học lãnh đạo, học sâu một kỹ năng. Hệ thống phân tích cung đại vận hiện tại + tứ hoá để chỉ ra bài học cốt lõi — bạn dùng nó làm khung định hướng cho 12 tháng tới.',
  },
];

const FIT: string[] = [
  'Bạn đang lập OKR / mục tiêu năm và muốn một góc nhìn ngoài về thời điểm',
  'Bạn vừa qua một năm mệt mỏi và muốn thiết kế năm sau khác đi',
  'Bạn quen ghi nhật ký / review định kỳ và sẵn sàng theo dõi 12 tháng',
  'Bạn muốn phối hợp kế hoạch cá nhân với pha đại vận thay vì đẩy ngược dòng',
  'Bạn vừa bước vào đại vận mới và chưa rõ chủ đề của pha này',
];

const NOT_FIT: string[] = [
  'Bạn muốn lịch dự đoán "tháng X sẽ có chuyện Y" theo nghĩa tiên tri',
  'Bạn cần lập kế hoạch tài chính chi tiết (hãy gặp financial planner)',
  'Bạn không có thời gian để review tháng — kế hoạch không có review chỉ là danh sách',
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
      name: 'Lập kế hoạch năm',
      item: `https://hieu.asia/lo-trinh/${SLUG}`,
    },
  ],
};

export default function KeHoachNamPage() {
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
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.10)_0%,_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(184,146,61,0.18)_0%,_transparent_55%)]"
        />

        <section className="relative mx-auto max-w-4xl px-6 pb-10 pt-6 sm:pt-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/lo-trinh" className="hover:text-gold">
              Lộ trình
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Lập kế hoạch năm</span>
          </nav>

          <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 text-gold">
            <Calendar className="h-5 w-5" aria-hidden />
          </div>
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold-700">
            Lộ trình · Tôi muốn lập kế hoạch năm
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Kế hoạch năm — Bản đồ thời điểm cho 12 tháng tới
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Bạn muốn nhìn cả năm: tháng nào nên đẩy, tháng nào nên giữ, đại vận đang vào
            pha gì. Lộ trình này phối hợp lưu niên 2026 với mục tiêu cá nhân — để kế
            hoạch của bạn cộng hưởng với pha, không đẩy ngược dòng.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href={`/onboarding/topic?topic=${TOPIC}`}>
              Bắt đầu lập lá số
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/annual-planning">
              
                Mở Annual Planning
              
            </Link></Button>
          </div>
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-12">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-gold" aria-hidden />
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Bạn sẽ dùng tới những công cụ này
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <Link key={t.name} href={t.href}>
                <Card className="h-full border-border bg-card/40 transition-colors hover:border-gold/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-base text-foreground">
                      {t.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs leading-relaxed text-muted-foreground">
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
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              3 câu hỏi điển hình lộ trình này trả lời
            </h2>
          </div>
          <div className="space-y-4">
            {QUESTIONS.map((qa) => (
              <div
                key={qa.q}
                className="rounded-xl border border-border bg-card/40 p-5"
              >
                <p className="font-heading text-base font-semibold text-foreground">{qa.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{qa.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card/40 p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Phù hợp khi bạn...
              </h2>
              <ul className="mt-4 space-y-2.5">
                {FIT.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card/30 p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Không phù hợp khi bạn...
              </h2>
              <ul className="mt-4 space-y-2.5">
                {NOT_FIT.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-muted/40" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-12">
          <Link
            href="/community/cases/dau-tu-bat-dong-san-dau-tien"
            className="group block rounded-xl border border-border bg-card/30 p-5 transition-colors hover:border-gold/40"
          >
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
              Đọc case study tương tự
            </p>
            <p className="mt-2 font-heading text-base font-semibold text-foreground group-hover:text-gold">
              Đầu tư bất động sản đầu tiên — có nên nhảy vào lúc thị trường đỉnh?
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Nam, 35 tuổi · cung Điền Trạch + đại vận chuyển · chọn phân bổ tài sản theo pha vận, không theo giá thị trường.
            </p>
          </Link>
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-12">
          <LoTrinhChart
            topic="general"
            focusPalaces={['Mệnh', 'Quan Lộc']}
            heading="Kế hoạch năm theo lá số của bạn"
          />
        </section>

        <section className="relative mx-auto max-w-4xl px-6 pb-20">
          <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Lập lá số mất khoảng 3 phút. Bạn có thể xem mẫu báo cáo trước nếu muốn
              biết kết quả trông như thế nào.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href={`/onboarding/topic?topic=${TOPIC}`}>
                Bắt đầu lập lá số
              </Link></Button>
              <Link
                href="/sample-report"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Xem mẫu báo cáo
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
        <div className="mx-auto max-w-4xl px-6 pb-12">
          <div className="border-t border-border pt-6">
            <RelatedTools
              links={[
                { href: '/dai-van-hien-tai', label: 'Đại vận hiện tại' },
                { href: '/tu-vi-2026', label: 'Tử Vi 2026' },
                { href: '/timeline', label: 'Timeline đại vận' },
                { href: '/tu-vi-hom-nay', label: 'Tử Vi hôm nay' },
                { href: '/sao-han', label: 'Xem sao hạn' },
              ]}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
