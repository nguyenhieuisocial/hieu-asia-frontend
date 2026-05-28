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
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';

export const metadata: Metadata = {
  title: 'Timeline — Đại vận + Lưu niên',
  description:
    'Timeline đại vận của bạn: 10 đại vận theo Tử Vi Đẩu Số, lưu niên năm hiện tại, lưu nguyệt tháng hiện tại. Demo content — lập lá số để cá nhân hoá.',
  alternates: { canonical: 'https://hieu.asia/timeline' },
  openGraph: {
    title: 'Timeline đại vận',
    description:
      'Đại vận = 10 năm. Lưu niên = năm hiện tại. Lưu nguyệt = tháng hiện tại.',
    url: 'https://hieu.asia/timeline',
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
      name: 'Timeline',
      item: 'https://hieu.asia/timeline',
    },
  ],
};

const CUNG_CYCLE: readonly string[] = [
  'Mệnh',
  'Phụ Mẫu',
  'Phúc Đức',
  'Điền Trạch',
  'Quan Lộc',
  'Nô Bộc',
  'Thiên Di',
  'Tật Ách',
  'Tài Bạch',
  'Tử Tức',
];

const THEMES: readonly string[] = [
  'Khởi đầu — nền móng học vấn và tính cách.',
  'Mở rộng quan hệ — học hỏi từ môi trường gia đình.',
  'Tích luỹ nội lực — phù hợp học sâu một kỹ năng.',
  'Bước vào sự nghiệp chính — thử thách đầu đời.',
  'Năm cao điểm sự nghiệp — quyết định lớn về định hướng.',
  'Củng cố mạng lưới — bạn bè trở thành đối tác.',
  'Chuyển động bên ngoài — đi xa, học rộng.',
  'Cần chú ý sức khoẻ — chuyển trọng tâm về bản thân.',
  'Tài chính bước vào giai đoạn ổn định.',
  'Trọng tâm con cái / thế hệ kế tiếp.',
];

type Segment = {
  ageStart: number;
  ageEnd: number;
  cung: string;
  theme: string;
};

function buildSegments(): Segment[] {
  return Array.from({ length: 10 }, (_, i) => ({
    ageStart: 10 + i * 10,
    ageEnd: 19 + i * 10,
    cung: CUNG_CYCLE[i] ?? 'Mệnh',
    theme: THEMES[i] ?? '',
  }));
}

// Demo: assume user is 28 → current đại vận = 24-33 (segment index 1).
const DEMO_USER_AGE = 28;

const VN_MONTH = new Intl.DateTimeFormat('vi-VN', {
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
});

export default function TimelinePage() {
  const segments = buildSegments();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthLabel = VN_MONTH.format(now);
  const activeIdx = segments.findIndex(
    (s) => DEMO_USER_AGE >= s.ageStart && DEMO_USER_AGE <= s.ageEnd,
  );

  const upcoming: { year: number; theme: string }[] = [
    {
      year: currentYear,
      theme: 'Năm xây nền — thử nghiệm có kiểm soát.',
    },
    {
      year: currentYear + 1,
      theme: 'Năm mở rộng nếu năm hiện tại có tín hiệu thuận.',
    },
    {
      year: currentYear + 2,
      theme: 'Năm chuyển dịch — review trung hạn 3 năm.',
    },
  ];

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
          <span className="text-muted-foreground">Timeline</span>
        </nav>

        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold/80">
            Timeline
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              Timeline đại vận của bạn
            </span>
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Đại vận = giai đoạn 10 năm. Lưu niên = năm hiện tại. Lưu nguyệt = tháng
            hiện tại. Demo content — lập lá số để cá nhân hoá theo cung an mệnh
            của bạn.
          </p>
        </header>

        <section aria-labelledby="timeline-heading" className="mb-10">
          <h2
            id="timeline-heading"
            className="mb-4 font-heading text-lg font-semibold sm:text-xl"
          >
            Demo timeline đại vận (10 → 109 tuổi)
          </h2>
          <div
            className="-mx-2 flex gap-3 overflow-x-auto px-2 pb-4"
            role="list"
          >
            {segments.map((s, i) => {
              const active = i === activeIdx;
              return (
                <Card
                  key={s.ageStart}
                  role="listitem"
                  className={[
                    'min-w-[160px] flex-shrink-0',
                    active
                      ? 'border-gold/70 bg-gold/[0.07]'
                      : 'border-border bg-card/40',
                  ].join(' ')}
                >
                  <CardContent className="p-4">
                    {active && (
                      <span className="mb-2 inline-flex rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold">
                        Hiện tại
                      </span>
                    )}
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {s.ageStart}–{s.ageEnd} tuổi
                    </p>
                    <p className="mt-1 font-heading text-sm font-semibold text-foreground">
                      {s.cung}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {s.theme}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Kéo ngang để xem các đại vận khác. Giai đoạn đang highlight là demo
            cho user 28 tuổi.
          </p>
        </section>

        <Card className="mb-10 border-gold/25 bg-gold/[0.05]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" aria-hidden="true" />
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
                Lưu niên
              </p>
            </div>
            <CardTitle className="font-heading text-xl sm:text-2xl">
              Lưu niên {currentYear} — Bính Ngọ
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Chủ đề:{' '}
              <strong className="text-foreground">
                xây nền + thử nghiệm có kiểm soát
              </strong>
              . Tháng đang trong:{' '}
              <span className="capitalize">{currentMonthLabel}</span>.
            </CardDescription>
          </CardHeader>
        </Card>

        <section aria-labelledby="upcoming-heading" className="mb-12">
          <h2
            id="upcoming-heading"
            className="mb-5 font-heading text-lg font-semibold sm:text-xl"
          >
            3 năm quan trọng sắp tới
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {upcoming.map((u) => (
              <Card key={u.year} className="border-border bg-card/40">
                <CardHeader>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
                    Năm {u.year}
                  </p>
                  <CardDescription className="text-muted-foreground">
                    {u.theme}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gold/25 bg-gold/[0.04] p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Tiếp theo
            </p>
          </div>
          <h2 className="mt-2 font-heading text-lg font-semibold sm:text-xl">
            Xem timeline của riêng bạn
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Lập lá số Tử Vi để xác định đại vận thật + cung an mệnh + tinh đẩu
            theo ngày giờ sinh.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/onboarding/topic">
              
                Lập lá số
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/sample-report">
              
                Xem mẫu báo cáo có timeline
              
            </Link></Button>
          </div>
        </section>
      </section>

      <SiteFooter />
      <StickyMobileCta trackId="timeline" />
    </div>
  );
}
