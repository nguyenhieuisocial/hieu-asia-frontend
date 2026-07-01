import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { TimeFlowChecker } from '@/components/time-flow/TimeFlowChecker';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata: Metadata = {
  title: 'Khung kế hoạch năm 2026 — 4 quý + quyết định lớn',
  description:
    'Khung tham khảo chung để lập kế hoạch năm Bính Ngọ 2026: chủ đề năm + 4 quý + các quyết định lớn nên chuẩn bị. Lập lá số để cá nhân hoá theo đại vận của bạn.',
  alternates: { canonical: 'https://hieu.asia/annual-planning' },
  openGraph: {
    title: 'Annual Planning — Kế hoạch năm 2026',
    description: 'Chủ đề năm Bính Ngọ + 4 quý + 5 decisions lớn — tham chiếu chung.',
    url: 'https://hieu.asia/annual-planning',
    type: 'article',
    images: OG_DEFAULT_IMAGES,
  },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Annual Planning',
      item: 'https://hieu.asia/annual-planning',
    },
  ],
};

const QUARTERS: {
  label: string;
  range: string;
  title: string;
  tone: 'Thuận lợi' | 'Cẩn trọng';
  points: string[];
}[] = [
  {
    label: 'Q1',
    range: 'Jan – Mar',
    title: 'Đặt câu hỏi — chưa cần quyết định lớn',
    tone: 'Cẩn trọng',
    points: [
      'Review 2025: 3 việc làm được, 1 việc tiếc.',
      'Liệt kê 5 câu hỏi quan trọng cho năm.',
      'Chưa nên ký hợp đồng dài hạn quý này.',
    ],
  },
  {
    label: 'Q2',
    range: 'Apr – Jun',
    title: 'Thử nghiệm có kiểm soát',
    tone: 'Thuận lợi',
    points: [
      'Chuẩn bị dòng tiền dự phòng đủ sống 6 tháng trước khi thử.',
      'Chọn 1 thử nghiệm có mức thiệt hại tối đa giới hạn.',
      'Set sẵn tiêu chí dừng / tiếp tục.',
    ],
  },
  {
    label: 'Q3',
    range: 'Jul – Sep',
    title: 'Mở rộng — nếu Q2 có tín hiệu thuận',
    tone: 'Thuận lợi',
    points: [
      'Chỉ mở rộng khi Q2 đạt 2/3 tín hiệu thuận.',
      'Tránh leverage cao — Bính Ngọ dễ biến động.',
      'Tăng giao tiếp với mentor / đồng nghiệp tin cậy.',
    ],
  },
  {
    label: 'Q4',
    range: 'Oct – Dec',
    title: 'Review + kế hoạch năm 2027',
    tone: 'Cẩn trọng',
    points: [
      'Khép sổ — không khởi dự án mới sát cuối năm.',
      'Tổng kết 4 quý: học được gì về chính mình.',
      'Phác 3 chủ đề cho 2027 (Đinh Mùi).',
    ],
  },
];

const QUARTER_TONE: Record<'Thuận lợi' | 'Cẩn trọng', string> = {
  'Thuận lợi': 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
  'Cẩn trọng': 'border-amber-400/40 bg-amber-500/10 text-amber-200',
};

const DECISIONS = [
  'Đổi việc / khởi nghiệp',
  'Mua nhà / đầu tư lớn',
  'Cưới hỏi / sinh con',
  'Đầu tư học vấn / chuyển ngành',
  'Chuyển nơi ở / đổi môi trường sống',
];

export default function AnnualPlanningPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      <section className="mx-auto max-w-5xl px-6 pt-16 pb-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-gold">
            Trang chủ
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-muted-foreground">Annual Planning</span>
        </nav>

        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-700">
            Kế hoạch năm
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              Khung kế hoạch năm 2026
            </span>
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Chủ đề năm + 4 quý + các quyết định lớn nên chuẩn bị. Đây là khung
            tham khảo chung cho năm Bính Ngọ — chưa phải kế hoạch theo lá số
            riêng; lập lá số để cá nhân hoá theo đại vận của bạn.
          </p>
        </header>

        <div className="mb-12">
          <TimeFlowChecker scope="yearly" />
        </div>

        <Card className="mb-10 border-gold/25 bg-gold/[0.05]">
          <CardHeader>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700">
              Chủ đề năm 2026
            </p>
            <CardTitle className="font-heading text-xl sm:text-2xl">
              Năm Bính Ngọ — &ldquo;xây nền + thử nghiệm có kiểm soát&rdquo;
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Năng lượng Hỏa vượng: thuận cho người chủ động, không thuận cho
              người chần chừ — nhưng dễ &ldquo;đốt&rdquo; nếu thiếu kỷ luật.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-amber-400/30 bg-amber-500/[0.06] p-4 text-sm text-amber-100/85">
              <strong className="text-amber-200">Lưu ý.</strong> Đây là chủ đề
              chung của năm Bính Ngọ; lá số riêng sẽ cá nhân hoá hơn theo đại
              vận, lưu niên và cung an mệnh.
            </div>
          </CardContent>
        </Card>

        <section aria-labelledby="quarters-heading" className="mb-12">
          <h2
            id="quarters-heading"
            className="mb-5 font-heading text-lg font-semibold sm:text-xl"
          >
            4 quý trong năm
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {QUARTERS.map((q) => (
              <Card key={q.label} className="border-border bg-card/40">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700">
                      {q.label} · {q.range}
                    </p>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${QUARTER_TONE[q.tone]}`}
                    >
                      {q.tone}
                    </span>
                  </div>
                  <CardTitle className="mt-1 font-heading text-lg">
                    {q.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    {q.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70"
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="decisions-heading" className="mb-12">
          <h2
            id="decisions-heading"
            className="mb-5 font-heading text-lg font-semibold sm:text-xl"
          >
            Quyết định lớn nên chuẩn bị
          </h2>
          <Card className="border-border bg-card/40">
            <CardContent className="p-6">
              <ul className="space-y-3 text-sm text-foreground/85">
                {DECISIONS.map((d) => (
                  <li key={d} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-gold/80"
                      aria-hidden="true"
                    />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-muted-foreground">
                Mỗi quyết định trên nên đi kèm 1 decision journal: bối cảnh, lựa
                chọn thay thế, tiêu chí review sau 30 / 90 ngày.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-xl border border-gold/25 bg-gold/[0.04] p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700">
              Liên kết
            </p>
          </div>
          <h2 className="mt-2 font-heading text-lg font-semibold sm:text-xl">
            Đào sâu kế hoạch năm
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/tu-vi-2026">
              
                Tử Vi 2026 — luận giải đầy đủ
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/ban-do">
              
                Bản đồ — bảng cá nhân
              
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/decisions/new">
              
                Lập decision brief
              
            </Link></Button>
          </div>
        </section>

        <div className="mt-12">
          <RelatedTools
            links={[
              { href: '/monthly-planning', label: 'Kế hoạch tháng' },
              { href: '/weekly-review', label: 'Đánh giá tuần' },
              { href: '/lo-trinh/ke-hoach-nam', label: 'Lộ trình kế hoạch năm' },
              { href: '/tu-vi-2026', label: 'Tử Vi 2026' },
            ]}
          />
        </div>
      </section>

      <SiteFooter />
      <StickyMobileCta trackId="annual-planning" />
    </div>
  );
}
