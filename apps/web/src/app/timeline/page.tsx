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
import { TimeFlowChecker } from '@/components/time-flow/TimeFlowChecker';

export const metadata: Metadata = {
  title: 'Timeline đại vận — đại vận 10 năm vận hành thế nào',
  description:
    'Đại vận = giai đoạn 10 năm trong Tử Vi Đẩu Số. Trang này minh hoạ cách 10 đại vận nối tiếp nhau — lập lá số để biết bạn đang ở đại vận nào theo ngày giờ sinh.',
  alternates: { canonical: 'https://hieu.asia/timeline' },
  openGraph: {
    title: 'Timeline đại vận',
    description:
      'Đại vận = 10 năm. Lưu niên = năm. Lưu nguyệt = tháng. Ví dụ minh hoạ — lập lá số để cá nhân hoá.',
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

// Minh hoạ thứ tự cung theo vòng đại vận — KHÔNG phải lá số của ai cụ thể.
// Cung an mệnh thật, chiều thuận/nghịch và tuổi khởi đại vận phụ thuộc ngày
// giờ sinh + Cục; xác định ở /dai-van-hien-tai hoặc lá số đầy đủ.
function buildSegments(): Segment[] {
  return Array.from({ length: 10 }, (_, i) => ({
    ageStart: 10 + i * 10,
    ageEnd: 19 + i * 10,
    cung: CUNG_CYCLE[i] ?? 'Mệnh',
    theme: THEMES[i] ?? '',
  }));
}

const VN_MONTH = new Intl.DateTimeFormat('vi-VN', {
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
});

export default function TimelinePage() {
  const segments = buildSegments();
  const now = new Date();
  const currentMonthLabel = VN_MONTH.format(now);

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
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-gold-700">
            Timeline
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              Đại vận 10 năm vận hành thế nào
            </span>
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Đại vận = giai đoạn 10 năm. Lưu niên = năm. Lưu nguyệt = tháng. Trang
            này là <strong className="text-foreground">ví dụ minh hoạ</strong> cách
            các đại vận nối tiếp nhau — lập lá số để biết bạn đang ở đại vận nào
            theo cung an mệnh của mình.
          </p>
        </header>

        <div className="mb-12">
          <TimeFlowChecker scope="decadal" />
        </div>

        <section aria-labelledby="timeline-heading" className="mb-10">
          <h2
            id="timeline-heading"
            className="mb-4 font-heading text-lg font-semibold sm:text-xl"
          >
            10 đại vận trong đời — ví dụ minh hoạ (10 → 109 tuổi)
          </h2>
          <div
            className="-mx-2 flex gap-3 overflow-x-auto px-2 pb-4"
            role="list"
          >
            {segments.map((s) => (
              <Card
                key={s.ageStart}
                role="listitem"
                className="min-w-[160px] flex-shrink-0 border-border bg-card/40"
              >
                <CardContent className="p-4">
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
            ))}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Kéo ngang để xem cả 10 đại vận. Thứ tự cung ở đây chỉ là minh hoạ —
            mốc tuổi và cung an mệnh thật phụ thuộc ngày giờ sinh, lập lá số để
            biết bạn đang ở đại vận nào.
          </p>
        </section>

        <Card className="mb-10 border-gold/25 bg-gold/[0.05]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" aria-hidden="true" />
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-700">
                Lưu niên & lưu nguyệt
              </p>
            </div>
            <CardTitle className="font-heading text-xl sm:text-2xl">
              Lưu niên là gì
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Lưu niên là lớp sao chiếu theo từng năm, lưu nguyệt là theo từng
              tháng (đang trong{' '}
              <span className="capitalize">{currentMonthLabel}</span>). Lưu niên
              riêng của bạn — sao nào vào cung nào trong năm — cần lá số để xác
              định, không suy ra được nếu chỉ biết năm dương lịch.
            </CardDescription>
          </CardHeader>
        </Card>

        <section aria-labelledby="howto-heading" className="mb-12">
          <h2
            id="howto-heading"
            className="mb-5 font-heading text-lg font-semibold sm:text-xl"
          >
            Đọc đại vận thế nào cho có ích
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              'Xác định bạn đang ở đại vận nào (10 năm) — đó là "bối cảnh" lớn của giai đoạn này.',
              'Xem cung nào được đại vận chiếu tới: sự nghiệp, tài chính, hay quan hệ đang là trọng tâm.',
              'Dùng lưu niên / lưu nguyệt để chọn thời điểm trong giai đoạn — không dùng để phán đúng/sai.',
            ].map((t, i) => (
              <Card key={i} className="border-border bg-card/40">
                <CardHeader>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-700">
                    Bước {i + 1}
                  </p>
                  <CardDescription className="text-muted-foreground">
                    {t}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gold/25 bg-gold/[0.04] p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold-700">
              Tiếp theo
            </p>
          </div>
          <h2 className="mt-2 font-heading text-lg font-semibold sm:text-xl">
            Xem đại vận thật của bạn
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Nhập ngày giờ sinh để xác định bạn đang ở đại vận nào, cung an mệnh
            và chính tinh của giai đoạn — thay cho ví dụ minh hoạ ở trên.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/dai-van-hien-tai">
                Xem đại vận hiện tại
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/onboarding/topic">Lập lá số đầy đủ</Link>
            </Button>
          </div>
        </section>
      </section>

      <SiteFooter />
      <StickyMobileCta trackId="timeline" />
    </div>
  );
}
