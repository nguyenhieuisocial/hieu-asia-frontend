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
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Compass,
  Flag,
  Heart,
  Sparkles,
  Target,
  Wallet,
  Wind,
} from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';

export const metadata: Metadata = {
  title: 'Monthly Planning — Lập kế hoạch tháng theo lá số',
  description:
    'Lập kế hoạch tháng theo lá số: chia chủ đề tháng thành 4 tuần. Premium tự fill dữ liệu từ đại vận và lưu nguyệt của bạn.',
  alternates: { canonical: 'https://hieu.asia/monthly-planning' },
  openGraph: {
    title: 'Monthly Planning — Lập kế hoạch tháng',
    description:
      'Chia chủ đề tháng thành 4 tuần — định hướng theo đại vận và lưu nguyệt cá nhân.',
    url: 'https://hieu.asia/monthly-planning',
    type: 'article',
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
      name: 'Monthly Planning',
      item: 'https://hieu.asia/monthly-planning',
    },
  ],
};

const WEEKS: {
  label: string;
  title: string;
  description: string;
  icon: typeof Flag;
  actions: string[];
}[] = [
  {
    label: 'Tuần 1',
    title: 'Khởi động',
    description: 'Review tháng trước, đặt 3 mục tiêu rõ ràng cho tháng này.',
    icon: Flag,
    actions: [
      'Đọc lại weekly review của 4 tuần trước.',
      'Viết ra 3 mục tiêu — đủ nhỏ để đo được.',
      'Đặt lịch 1 buổi "deep work" trong tuần.',
    ],
  },
  {
    label: 'Tuần 2',
    title: 'Build',
    description: 'Tập trung 1 việc quan trọng nhất — không pha loãng.',
    icon: Target,
    actions: [
      'Chọn việc số 1 trong 3 mục tiêu để dồn lực.',
      'Tắt noise: bớt họp, bớt scroll.',
      'Cuối tuần kiểm: đã tiến được bao nhiêu %.',
    ],
  },
  {
    label: 'Tuần 3',
    title: 'Mid-cycle review',
    description: 'Điều chỉnh nếu lệch. Đừng đợi cuối tháng mới sửa.',
    icon: Compass,
    actions: [
      'So tiến độ với mục tiêu — 50% là điểm chuẩn.',
      'Bỏ 1 việc không quan trọng để dồn năng lượng.',
      'Hỏi 1 người tin cậy về blind spot của bạn.',
    ],
  },
  {
    label: 'Tuần 4',
    title: 'Kết & chuẩn bị tháng sau',
    description: 'Viết review — chuyển "cảm giác" thành "dữ kiện".',
    icon: Sparkles,
    actions: [
      'Liệt kê 3 việc làm được, 1 việc chưa xong.',
      'Ghi 1 điều học được về chính mình.',
      'Phác 3 mục tiêu nháp cho tháng sau.',
    ],
  },
];

const ENERGIES: {
  icon: typeof Briefcase;
  label: string;
  tone: 'Thuận' | 'Trung tính' | 'Cẩn trọng';
}[] = [
  { icon: Briefcase, label: 'Sự nghiệp', tone: 'Thuận' },
  { icon: Wallet, label: 'Tài chính', tone: 'Cẩn trọng' },
  { icon: Heart, label: 'Quan hệ', tone: 'Trung tính' },
  { icon: Wind, label: 'Sức khoẻ', tone: 'Thuận' },
  { icon: Sparkles, label: 'Tinh thần', tone: 'Trung tính' },
];

const TONE_STYLE: Record<'Thuận' | 'Trung tính' | 'Cẩn trọng', string> = {
  'Thuận': 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
  'Trung tính': 'border-border bg-muted/5 text-foreground/80',
  'Cẩn trọng': 'border-amber-400/40 bg-amber-500/10 text-amber-200',
};

function currentMonthVN(): string {
  return new Intl.DateTimeFormat('vi-VN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date());
}

export default function MonthlyPlanningPage() {
  const monthLabel = currentMonthVN();

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
          <span className="text-muted-foreground">Monthly Planning</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80">
              Monthly Planning
            </p>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-200">
              Demo
            </span>
          </div>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              Lập kế hoạch tháng theo lá số
            </span>
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Chia chủ đề tháng thành 4 tuần. Premium subscription tự fill dữ liệu từ
            đại vận + lưu nguyệt của bạn — Phase 1 hiển thị nội dung tham chiếu.
          </p>
        </header>

        <Card className="mb-10 border-gold/25 bg-gold/[0.05]">
          <CardHeader>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Chủ đề tháng
            </p>
            <CardTitle className="font-heading text-xl capitalize sm:text-2xl">
              {monthLabel}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Chủ đề tham chiếu — <strong className="text-foreground">xây nền hơn là
              mở rộng</strong>. Tập trung vào hệ thống bạn đã có, đừng vội thêm
              dự án mới.
            </CardDescription>
          </CardHeader>
        </Card>

        <section aria-labelledby="weeks-heading" className="mb-12">
          <h2
            id="weeks-heading"
            className="mb-5 font-heading text-lg font-semibold sm:text-xl"
          >
            4 tuần trong tháng
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {WEEKS.map((w) => {
              const Icon = w.icon;
              return (
                <Card key={w.label} className="border-border bg-card/40">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gold" aria-hidden="true" />
                      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
                        {w.label}
                      </p>
                    </div>
                    <CardTitle className="mt-1 font-heading text-lg">
                      {w.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {w.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-foreground/80">
                      {w.actions.map((a) => (
                        <li key={a} className="flex gap-2">
                          <span aria-hidden="true" className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="energies-heading" className="mb-12">
          <h2
            id="energies-heading"
            className="mb-5 font-heading text-lg font-semibold sm:text-xl"
          >
            5 năng lượng tháng này
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {ENERGIES.map((e) => {
              const Icon = e.icon;
              return (
                <Card key={e.label} className="border-border bg-card/40">
                  <CardContent className="flex flex-col items-start gap-2 p-5">
                    <Icon className="h-5 w-5 text-gold/80" aria-hidden="true" />
                    <p className="text-sm font-medium text-foreground">{e.label}</p>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${TONE_STYLE[e.tone]}`}
                    >
                      {e.tone}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-gold/25 bg-gold/[0.04] p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gold" aria-hidden="true" />
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Tiếp theo
            </p>
          </div>
          <h2 className="mt-2 font-heading text-lg font-semibold sm:text-xl">
            Cá nhân hoá theo lá số của bạn
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Lập lá số Tử Vi để nội dung tháng phản ánh đại vận + lưu nguyệt riêng
            của bạn — thay vì chủ đề tham chiếu chung.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/onboarding/topic">
              
                Lập lá số cá nhân hoá
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/journal/new">
              
                Tạo decision journal đầu tháng
              
            </Link></Button>
          </div>
        </section>
      </section>

      <SiteFooter />
      <StickyMobileCta trackId="monthly-planning" />
    </div>
  );
}
