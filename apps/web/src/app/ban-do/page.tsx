import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  Calendar,
  Target,
  ArrowRight,
  TrendingUp,
  Heart,
  Briefcase,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bản đồ cá nhân — gợi ý theo tuần/tháng/năm',
  description:
    'Gợi ý cá nhân hoá theo ngày, tuần, tháng và năm dựa trên lá số Tử Vi của bạn. Gói đồng hành cập nhật mỗi tuần, nhắc việc nên làm.',
  alternates: { canonical: 'https://hieu.asia/ban-do' },
};

function formatVnToday(now: Date): string {
  const fmt = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  });
  // Capitalise first letter of weekday for nicer rendering ("thứ sáu" → "Thứ Sáu …")
  const raw = fmt.format(now);
  return raw.replace(/^\p{Ll}/u, (c) => c.toUpperCase()).replace(/, /, ' ');
}

function formatVnLastDayOfMonth(now: Date): string {
  // Get current year/month in VN tz, then compute last day.
  const vnNowParts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).formatToParts(now);
  const year = Number(vnNowParts.find((p) => p.type === 'year')?.value ?? now.getUTCFullYear());
  const month = Number(vnNowParts.find((p) => p.type === 'month')?.value ?? now.getUTCMonth() + 1);
  // Day 0 of next month = last day of this month.
  const lastDayUtc = new Date(Date.UTC(year, month, 0));
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(lastDayUtc);
}

type QuarterCard = {
  label: string;
  badge: 'Thuận lợi' | 'Cẩn trọng';
  note: string;
};

const QUARTERS: QuarterCard[] = [
  {
    label: 'Q1',
    badge: 'Thuận lợi',
    note: 'Khởi động chậm rãi, đặt nền cho năm. Việc nhỏ làm đều quan trọng hơn việc lớn dồn dập.',
  },
  {
    label: 'Q2',
    badge: 'Thuận lợi',
    note: 'Năng lượng quan hệ và hợp tác lên. Là quý tốt để mở rộng vòng kết nối có chọn lọc.',
  },
  {
    label: 'Q3',
    badge: 'Cẩn trọng',
    note: 'Áp lực và chuyển động nhiều. Giữ sức khoẻ, tránh quyết định lớn khi mệt mỏi.',
  },
  {
    label: 'Q4',
    badge: 'Thuận lợi',
    note: 'Thời điểm thu hoạch và tổng kết. Phù hợp để chốt mục tiêu và chuẩn bị năm sau.',
  },
];

export default function BanDoPage() {
  const now = new Date();
  const todayLabel = formatVnToday(now);
  const monthReviewDate = formatVnLastDayOfMonth(now);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'https://hieu.asia/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Bản đồ của bạn',
        item: 'https://hieu.asia/ban-do',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SiteNav />
      <main id="main-content" className="pt-16">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pt-12 pb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Bản đồ của bạn, đồng hành mỗi tuần
          </h1>
          <p className="mt-4 text-lg text-foreground/80 max-w-3xl">
            Bản đồ này theo dõi bạn theo 4 nhịp — hôm nay, tuần này, tháng này, năm nay. Gói
            đồng hành sẽ cập nhật mỗi tuần theo lá số riêng của bạn.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-amber-700/40 bg-amber-900/10 px-4 py-2 text-amber-200 text-sm">
            <span>📍 Nội dung minh hoạ — chưa kết nối lá số của bạn</span>
          </div>
        </section>

        {/* Hôm nay */}
        <section className="mx-auto max-w-5xl px-6 pb-6">
          <Card className="border-gold/30 bg-card/40">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-gold" aria-hidden="true" />
                <CardTitle className="text-foreground text-xl">
                  Hôm nay · {todayLabel}
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Nhịp ngày — đủ ngắn để đọc trong 30 giây trước khi bắt đầu việc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-foreground/85">
              <div>
                <h3 className="text-sm font-medium text-gold-700 uppercase tracking-wide mb-1">
                  Gợi ý ngắn
                </h3>
                <p>
                  Hôm nay là ngày năng lượng tập trung. Bạn dễ hoàn thành một việc khó nếu chịu
                  ngồi xuống 90 phút không bị ngắt quãng — đừng để buổi sáng trôi qua trong các
                  cuộc họp ngắn.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-jade-50 uppercase tracking-wide mb-1">
                  Việc nên tập trung
                </h3>
                <p>Một việc quan trọng đã đẩy lùi nhiều lần — chọn nó, làm trước cà phê thứ hai.</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Việc nên tránh
                </h3>
                <p>Tranh luận qua tin nhắn về những chuyện đã rõ ai đúng ai sai.</p>
              </div>
              <blockquote className="border-l-2 border-gold/40 pl-4 italic text-muted-foreground">
                Nếu hôm nay chỉ làm được một việc, mình muốn cuối ngày nhìn lại và thấy việc gì?
              </blockquote>
            </CardContent>
          </Card>
        </section>

        {/* Tuần này + Tháng này */}
        <section className="mx-auto max-w-5xl px-6 pb-6 grid gap-6 md:grid-cols-2">
          <Card className="bg-card/40 border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Compass className="h-5 w-5 text-jade-50" aria-hidden="true" />
                <CardTitle className="text-foreground text-lg">Tuần này</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-foreground/85">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Chủ đề tuần</div>
                <p>Sắp xếp lại ưu tiên — bớt nói có với việc không thuộc về mình.</p>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Hành động chính
                </div>
                <p>Lên lịch 2 khối tập trung sâu 2 giờ, một việc khó mỗi khối.</p>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Cuộc trò chuyện nên có
                </div>
                <p>Nói rõ với một người về kỳ vọng đang lệch — càng để lâu càng khó.</p>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Rủi ro cần quản trị
                </div>
                <p>Quá tải buổi tối vì nhận thêm việc giữa tuần. Đặt giới hạn trước thứ Tư.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-jade-50" aria-hidden="true" />
                <CardTitle className="text-foreground text-lg">Tháng này</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-foreground/85">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Mục tiêu tháng</div>
                <p>Kết thúc một dự án còn lửng — không khởi động thêm cái mới.</p>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1 inline-flex items-center gap-1.5">
                  <Briefcase className="h-3 w-3" aria-hidden="true" /> Năng lượng sự nghiệp
                </div>
                <p>Đều, không bùng nổ. Phù hợp việc cần kiên nhẫn hơn việc cần tốc độ.</p>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1 inline-flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3" aria-hidden="true" /> Năng lượng tài chính
                </div>
                <p>Ổn định, nên tránh quyết định đầu tư lớn dựa trên cảm xúc.</p>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1 inline-flex items-center gap-1.5">
                  <Heart className="h-3 w-3" aria-hidden="true" /> Quan hệ
                </div>
                <p>Thời điểm tốt để hàn gắn một mối quan hệ đang xa cách trong im lặng.</p>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Review cuối tháng
                </div>
                <p className="text-muted-foreground">Đặt lịch nhìn lại tháng vào {monthReviewDate}.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Năm nay */}
        <section className="mx-auto max-w-5xl px-6 pb-8">
          <Card className="bg-card/40 border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-gold" aria-hidden="true" />
                <CardTitle className="text-foreground text-lg">Năm nay</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Bốn quý — mỗi quý một nhịp khác nhau.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-foreground/85">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Chủ đề lưu niên
                </div>
                <p>
                  Năm của củng cố nội lực — không phải năm để mở rộng nhiều mặt. Chọn 2 việc, làm
                  sâu, bỏ qua phần còn lại.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {QUARTERS.map((q) => (
                  <div
                    key={q.label}
                    className="rounded-lg border border-border bg-card/30 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{q.label}</span>
                      <span
                        className={
                          q.badge === 'Thuận lợi'
                            ? 'text-xs px-2 py-0.5 rounded-full bg-jade-50/10 text-jade-50 border border-jade-50/30'
                            : 'text-xs px-2 py-0.5 rounded-full bg-amber-900/20 text-amber-200 border border-amber-700/40'
                        }
                      >
                        {q.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{q.note}</p>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Các quyết định lớn nên chuẩn bị
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/85">
                  <li>Một thay đổi công việc — nếu có, nên rơi vào Q2 hoặc Q4.</li>
                  <li>Cam kết dài hạn trong quan hệ — cân nhắc kỹ trong Q3.</li>
                  <li>Khoản chi lớn (nhà, học, di chuyển) — chuẩn bị tài chính từ Q1.</li>
                </ul>
              </div>

              <p className="text-xs text-muted-foreground italic">
                Đây là gợi ý dựa trên chủ đề lưu niên chung. Lá số riêng sẽ cá nhân hoá nhiều hơn.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <Card className="border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent">
            <CardContent className="p-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-xl">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                  Bản đồ chưa cá nhân hoá. Lập lá số 2 phút để hệ thống đồng hành theo lá số riêng.
                </h2>
                <p className="text-sm text-muted-foreground">
                  Bạn nhập ngày giờ sinh một lần — sau đó mỗi tuần bản đồ sẽ cập nhật theo bạn,
                  không phải bản demo này.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Button asChild className="bg-gold text-ink hover:bg-gold/90">
                  <Link href="/onboarding/topic">
                    Lập lá số cá nhân hoá
                    <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted/5"
                >
                  <Link href="/pricing">Xem các gói Premium</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 border-t border-border pt-6">
            <RelatedTools
              links={[
                { href: '/tu-vi', label: 'Xem Tử Vi' },
                { href: '/tu-vi-hom-nay', label: 'Tử Vi hôm nay' },
                { href: '/tu-vi-2026', label: 'Tử Vi 2026' },
                { href: '/sao-han', label: 'Xem sao hạn' },
              ]}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
