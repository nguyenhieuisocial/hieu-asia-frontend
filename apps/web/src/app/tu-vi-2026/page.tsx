import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Briefcase, Heart, Wallet, Activity, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { article, breadcrumb } from '@/lib/seo/jsonld';
import { TimeFlowChecker } from '@/components/time-flow/TimeFlowChecker';
import { ZODIAC } from '@/lib/hop-tuoi-pairs';

export const metadata: Metadata = {
  title: 'Tử Vi 2026 cá nhân hoá theo ngày sinh (Bính Ngọ)',
  description:
    'Tử Vi 2026 (năm Bính Ngọ): chủ đề năm, sự nghiệp, tài chính, tình cảm, sức khoẻ — cá nhân hoá theo lá số Tử Vi Đẩu Số và đại vận hiện tại.',
  alternates: { canonical: 'https://hieu.asia/tu-vi-2026' },
  // Wave 60.96.2 — route-level openGraph REPLACES root-layout openGraph; must
  // re-declare `images` or Zalo/FB/Telegram/Slack previews render blank.
  openGraph: {
    title: 'Tử Vi năm 2026',
    description: 'Năm Bính Ngọ — chủ đề năm + 12 tháng + 3 quyết định nên cân nhắc.',
    url: 'https://hieu.asia/tu-vi-2026',
    type: 'article',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Tử Vi 2026 năm Bính Ngọ hành Hỏa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tử Vi năm 2026',
    description: 'Năm Bính Ngọ hành Hỏa — chủ đề năm + 12 tháng + 3 quyết định cân nhắc.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Tử Vi 2026 năm Bính Ngọ hành Hỏa',
      },
    ],
  },
};

const MONTHS: { name: string; theme: string }[] = [
  { name: 'Tháng 1 — Canh Dần', theme: 'Khởi đầu thận trọng. Lên kế hoạch năm, chưa nên ra quyết định lớn.' },
  { name: 'Tháng 2 — Tân Mão', theme: 'Năng lượng giao tiếp tốt. Phù hợp tái lập quan hệ và mạng lưới.' },
  { name: 'Tháng 3 — Nhâm Thìn', theme: 'Thời điểm đẩy dự án ổn định. Chú ý sức khoẻ tinh thần.' },
  { name: 'Tháng 4 — Quý Tỵ', theme: 'Cảm xúc dễ căng — tránh quyết định trong lúc nóng.' },
  { name: 'Tháng 5 — Giáp Ngọ', theme: 'Cơ hội xa quê, du học, dự án quốc tế.' },
  { name: 'Tháng 6 — Ất Mùi', theme: 'Phù hợp tích luỹ tài chính + chăm sóc gia đạo.' },
  { name: 'Tháng 7 — Bính Thân', theme: 'Cần thận trọng khẩu thiệt. Tránh tranh luận online.' },
  { name: 'Tháng 8 — Đinh Dậu', theme: 'Thời điểm tốt để kết nối — học thêm, mentor, mở rộng kỹ năng.' },
  { name: 'Tháng 9 — Mậu Tuất', theme: 'Sự nghiệp có dấu hiệu thay đổi — nên đánh giá lại 6 tháng đầu năm.' },
  { name: 'Tháng 10 — Kỷ Hợi', theme: 'Tài chính cần kỷ luật. Tránh đầu tư rủi ro cao cuối năm.' },
  { name: 'Tháng 11 — Canh Tý', theme: 'Năng lượng nội tâm tăng — phù hợp ôn lại mục tiêu.' },
  { name: 'Tháng 12 — Tân Sửu', theme: 'Khép năm bằng kế hoạch 2027 — không vội quyết định cuối năm.' },
];

const THEMES = [
  {
    icon: Briefcase,
    title: 'Sự nghiệp 2026',
    body: 'Năm Hỏa Mã — năng lượng đẩy người có Quan Lộc tốt mở rộng phạm vi. Cẩn trọng với quyết định nghề nóng vội quý 1 + quý 4.',
  },
  {
    icon: Wallet,
    title: 'Tài chính 2026',
    body: 'Không phải năm dồn hết vốn một lần — Bính Ngọ có khuynh hướng biến động. Ưu tiên quỹ dự phòng 6 tháng trước khi tăng rủi ro.',
  },
  {
    icon: Heart,
    title: 'Tình cảm 2026',
    body: 'Năm phù hợp cho người độc thân kết duyên (đặc biệt tuổi có Đào Hoa nhập hạn). Người đang trong quan hệ: tập trung giao tiếp kỳ vọng.',
  },
  {
    icon: Activity,
    title: 'Sức khoẻ 2026',
    body: 'Năm Hỏa vượng — cẩn trọng với stress + giấc ngủ. Duy trì vận động đều, không ép quá nhanh.',
  },
];

const DECISIONS = [
  {
    label: 'Có nên chuyển ngành/công ty?',
    body:
      'Năm 2026 thuận cho chuyển đổi NẾU bạn đã có quỹ cầm cự tài chính 6 tháng + 2-3 cơ hội cụ thể đã xác minh. Không thuận cho "nhảy mù".',
  },
  {
    label: 'Có nên cưới?',
    body:
      'Xét lá số Phu Thê + Phúc Đức + Đại vận. Nếu hai bên đã sống chung 1 năm và thông qua 1 khủng hoảng — đây là năm thuận.',
  },
  {
    label: 'Có nên đầu tư bất động sản?',
    body:
      'Năm thuận cho người có Điền Trạch mạnh + tài chính ổn. Cẩn trọng với leverage cao trong quý 3.',
  },
];

// Wave 60.96.2 — type=article in openGraph signals editorial yearly outlook;
// pair with Article JSON-LD so Google can render rich snippets correctly.
// Organization (author/publisher) is site-wide in layout.tsx → referenced by
// @id inside article(); not repeated here.
const JSONLD = [
  article({
    headline: 'Tử Vi 2026 — chủ đề năm Bính Ngọ hành Hỏa',
    description:
      'Tử Vi 2026 (năm Bính Ngọ): chủ đề năm, sự nghiệp, tài chính, tình cảm, sức khoẻ — cá nhân hoá theo lá số.',
    url: '/tu-vi-2026',
    image: '/og-image.jpg',
    datePublished: '2025-12-01',
    dateModified: '2026-05-28',
    type: 'Article',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Tử Vi 2026', url: '/tu-vi-2026' },
  ]),
];

export default function TuVi2026Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <JsonLd data={JSONLD} />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-6 sm:pt-8">
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
            Năm Bính Ngọ · hành Hỏa · 17/02/2026 → 05/02/2027
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Tử Vi 2026 — chủ đề năm Bính Ngọ
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            2026 là năm Bính Ngọ — hành Hỏa vượng. Đây là năm năng lượng cao: thuận cho
            người chủ động, không thuận cho người chần chừ. Nhưng năng lượng Hỏa cũng
            dễ "đốt" nếu không quản lý — ai vội vàng tài chính hoặc quan hệ trong năm
            này dễ tiếc nuối.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/onboarding">
              Xem tử vi 2026 của tôi
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/sample-report">
              
                Mẫu báo cáo
              
            </Link></Button>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Tử Vi 2026 theo tuổi của bạn
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Xem nhanh hợp xung với năm Ngọ, Tam Tai và sao hạn theo từng năm sinh cho mỗi con giáp.
          </p>
          <div className="flex flex-wrap gap-2">
            {ZODIAC.map((z) => (
              <Link
                key={z.slug}
                href={`/tu-vi-2026/${z.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
              >
                <span aria-hidden="true">{z.emoji}</span> Tuổi {z.ten}
              </Link>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <TimeFlowChecker scope="yearly" />
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            4 chủ đề lớn của năm
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {THEMES.map((t) => {
              const Icon = t.icon;
              return (
                <Card key={t.title} className="border-border bg-card/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                      <Icon className="h-4 w-4 text-gold" aria-hidden /> {t.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed text-muted-foreground">
                    {t.body}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            12 tháng 2026 — sơ đồ năng lượng
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {MONTHS.map((m) => (
              <div
                key={m.name}
                className="rounded-lg border border-border bg-card/40 p-3"
              >
                <p className="font-mono text-[12px] uppercase tracking-widest text-gold/80">
                  {m.name}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-foreground/80">{m.theme}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Đây là khung tháng chung. Lưu nguyệt cá nhân hoá theo lá số có thể lệch — Mentor sẽ tinh
            chỉnh theo Mệnh — Thân — Đại vận của bạn.
          </p>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            3 quyết định nhiều người cân nhắc trong 2026
          </h2>
          <div className="space-y-3">
            {DECISIONS.map((d) => (
              <Card key={d.label} className="border-border bg-card/40">
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-base text-foreground">
                    {d.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {d.body}
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            hieu.asia KHÔNG quyết định thay bạn. Mỗi quyết định cần cân nhắc dữ kiện đời thực + lá
            số + bối cảnh — Mentor sẽ hỏi lại bối cảnh trước khi gợi ý.
          </p>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Xem tử vi 2026 cá nhân hoá theo lá số của bạn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Khung trên là chung cho năm Bính Ngọ. Tử Vi 2026 RIÊNG bạn phụ thuộc vào đại
              vận hiện tại + lưu niên cá nhân + cung Quan/Tài/Phu Thê của riêng bạn.
              Lập lá số 2 phút để xem chi tiết.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/onboarding">
                Lập lá số miễn phí
              </Link></Button>
              <Link
                href="/tu-vi"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Cẩm nang Tử Vi <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Nhận nhắc theo mùa
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source="tu-vi-2026-hub"
                capturedEvent="lead_capture_tu_vi_2026_hub"
                blurb="Để lại email, chúng tôi sẽ báo bạn khi có bản tử vi 2026 đầy đủ theo tuổi và nội dung mới theo mùa. Thi thoảng thôi, không spam."
                cta="Nhận nhắc"
              />
            </div>
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools current="/tu-vi-2026" />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/onboarding?intent=ke-hoach-nam" trackId="tu-vi-2026" />
    </div>
  );
}
