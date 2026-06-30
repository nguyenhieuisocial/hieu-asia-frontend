import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, BookOpen, Map, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';

export const metadata: Metadata = {
  title: 'Tử Vi Đẩu Số: lập lá số, tra cung và sao bằng AI',
  description:
    'Cẩm nang Tử Vi Đẩu Số: lập lá số 12 cung theo trường phái Bắc phái 121 sao, tra cứu ý nghĩa từng cung và từng sao, luận đại vận lưu niên. Miễn phí cốt lõi, AI Mentor tuỳ chọn.',
  alternates: { canonical: 'https://hieu.asia/tu-vi' },
  // Wave 60.96.2 — route-level openGraph REPLACES root-layout openGraph; must
  // re-declare `images` or Zalo/FB/Telegram/Slack previews render blank.
  openGraph: {
    title: 'Tử Vi Đẩu Số',
    description:
      'Lập lá số 12 cung, tra cung tra sao, luận đại vận — AI Mentor cá nhân hoá.',
    url: 'https://hieu.asia/tu-vi',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Tử Vi Đẩu Số: 12 cung, 121 sao, AI Mentor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tử Vi Đẩu Số',
    description: 'Lập lá số 12 cung, tra cung tra sao — AI Mentor cá nhân hoá.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Tử Vi Đẩu Số: 12 cung, 121 sao, AI Mentor',
      },
    ],
  },
};

const PALACES: { slug: string; name: string; pitch: string }[] = [
  { slug: 'cung-menh', name: 'Mệnh', pitch: 'Khí chất, bản chất, thiên hướng cốt lõi.' },
  { slug: 'cung-phu-mau', name: 'Phụ Mẫu', pitch: 'Cha mẹ, học vấn, sức khoẻ tinh thần.' },
  { slug: 'cung-phuc-duc', name: 'Phúc Đức', pitch: 'Phước báu, gia đạo, mức chịu đựng.' },
  { slug: 'cung-dien-trach', name: 'Điền Trạch', pitch: 'Nhà cửa, tài sản bất động.' },
  { slug: 'cung-quan-loc', name: 'Quan Lộc', pitch: 'Sự nghiệp, vai trò, môi trường làm việc.' },
  { slug: 'cung-no-boc', name: 'Nô Bộc', pitch: 'Bạn bè, đồng nghiệp, mạng lưới.' },
  { slug: 'cung-thien-di', name: 'Thiên Di', pitch: 'Di chuyển, xa quê, cơ hội bên ngoài.' },
  { slug: 'cung-tat-ach', name: 'Tật Ách', pitch: 'Sức khoẻ, bệnh tật, rủi ro thể chất.' },
  { slug: 'cung-tai-bach', name: 'Tài Bạch', pitch: 'Tiền bạc, dòng tiền, cách quản lý.' },
  { slug: 'cung-tu-tuc', name: 'Tử Tức', pitch: 'Con cái, sáng tạo, sản phẩm cá nhân.' },
  { slug: 'cung-phu-the', name: 'Phu Thê', pitch: 'Bạn đời, kiểu gắn bó, kỳ vọng quan hệ.' },
  { slug: 'cung-huynh-de', name: 'Huynh Đệ', pitch: 'Anh chị em, bạn thân, cộng sự gần.' },
];

const MAJOR_STARS: { slug: string; name: string; hint: string }[] = [
  { slug: 'tu-vi', name: 'Tử Vi', hint: 'Đế tinh — lãnh đạo, ổn định, kiêu hãnh.' },
  { slug: 'thien-co', name: 'Thiên Cơ', hint: 'Trí, linh hoạt, hay đổi.' },
  { slug: 'thai-duong', name: 'Thái Dương', hint: 'Năng lượng, dương khí, danh tiếng.' },
  { slug: 'vu-khuc', name: 'Vũ Khúc', hint: 'Tài tinh — quyết liệt, kỷ luật tiền.' },
  { slug: 'thien-dong', name: 'Thiên Đồng', hint: 'Hoà hảo, hưởng thụ, dễ chịu.' },
  { slug: 'liem-trinh', name: 'Liêm Trinh', hint: 'Kỷ luật, hai mặt, dễ căng.' },
  { slug: 'thien-phu', name: 'Thiên Phủ', hint: 'Khố tinh — tích luỹ, ổn định.' },
  { slug: 'thai-am', name: 'Thái Âm', hint: 'Âm tài, gia đạo, nội tâm.' },
  { slug: 'tham-lang', name: 'Tham Lang', hint: 'Đào hoa, tham vọng, thay đổi.' },
  { slug: 'cu-mon', name: 'Cự Môn', hint: 'Khẩu thiệt, phân tích, tranh luận.' },
  { slug: 'thien-tuong', name: 'Thiên Tướng', hint: 'Phụ tá, trung thành, tham mưu.' },
  { slug: 'thien-luong', name: 'Thiên Lương', hint: 'Trưởng thượng, đạo đức, từ thiện.' },
  { slug: 'that-sat', name: 'Thất Sát', hint: 'Quyết đoán, mạnh mẽ, đột phá.' },
  { slug: 'pha-quan', name: 'Phá Quân', hint: 'Phá cách, đổi mới, mạo hiểm.' },
];

const AUX_STARS: { slug: string; name: string; hint: string }[] = [
  { slug: 'ta-phu', name: 'Tả Phụ', hint: 'Trợ tinh — quý nhân hỗ trợ.' },
  { slug: 'huu-bat', name: 'Hữu Bật', hint: 'Trợ tinh — cặp với Tả Phụ.' },
  { slug: 'van-xuong', name: 'Văn Xương', hint: 'Văn tinh — học vấn, viết.' },
  { slug: 'van-khuc', name: 'Văn Khúc', hint: 'Văn tinh — nghệ thuật, sáng tạo.' },
  { slug: 'khoi-viet', name: 'Thiên Khôi - Thiên Việt', hint: 'Quý nhân tinh — mentor.' },
  { slug: 'loc-ton', name: 'Lộc Tồn', hint: 'Tài tinh — tích luỹ.' },
  { slug: 'kinh-da', name: 'Kình Dương - Đà La', hint: 'Sát tinh nhẹ — áp lực.' },
  { slug: 'hoa-linh', name: 'Hỏa Tinh - Linh Tinh', hint: 'Sát tinh — biến động.' },
  { slug: 'hoa-loc', name: 'Hoá Lộc', hint: 'Tứ hoá — cơ hội tài lộc.' },
  { slug: 'hoa-ky', name: 'Hoá Kỵ', hint: 'Tứ hoá — chủ đề cần chú ý.' },
];

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Tử Vi', item: 'https://hieu.asia/tu-vi' },
  ],
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://hieu.asia/tu-vi',
  url: 'https://hieu.asia/tu-vi',
  name: 'Tử Vi Đẩu Số — lập lá số, tra cung, tra sao',
  description:
    'Cẩm nang Tử Vi Đẩu Số 12 cung 121 sao Bắc phái — lập lá số AI miễn phí, tra ý nghĩa cung, ý nghĩa sao, luận đại vận lưu niên.',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

export default function TuViHubPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }}
      />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-5xl px-6 pb-12 pt-6 sm:pt-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Tử Vi</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
            Tử Vi Đẩu Số · Bắc phái 121 sao
          </p>
          <h1 className="mt-3 font-editorial-display text-3xl font-normal leading-tight text-foreground sm:text-5xl">
            Lá số Tử Vi — bản đồ thiên hướng của bạn
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tử Vi Đẩu Số chia cuộc đời thành 12 cung, mỗi cung là một lĩnh vực sống. hieu.asia
            lập lá số theo trường phái Bắc phái 121 sao, có đại vận và lưu niên — kèm AI
            Mentor đối chiếu với bối cảnh đời thực để giúp bạn ra quyết định.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/onboarding">
              Lập lá số của tôi
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/sample-report">
              
                Xem mẫu báo cáo
              
            </Link></Button>
            <Link
              href="/methodology"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
            >
              Phương pháp luận
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        {/* 12 cung */}
        <section className="relative mx-auto max-w-5xl px-6 pb-12">
          <div className="mb-6 flex items-center gap-3">
            <Map className="h-5 w-5 text-gold" aria-hidden />
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              12 cung Tử Vi
            </h2>
          </div>
          <p className="mb-6 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Mỗi cung đại diện một lĩnh vực đời sống. Tử Vi không đọc từng cung rời lẻ —
            luận đúng phải xem cùng tam phương tứ chính. Bấm từng cung để hiểu cách hệ
            thống diễn giải.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PALACES.map((p) => (
              <Link key={p.slug} href={`/tu-vi/${p.slug}`}>
                <Card className="h-full border-border bg-card/40 transition hover:border-gold/40 active:scale-[0.98]">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-base text-foreground">
                      Cung {p.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs leading-relaxed text-muted-foreground">
                    {p.pitch}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* 14 chính tinh */}
        <section className="relative mx-auto max-w-5xl px-6 pb-12">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-gold" aria-hidden />
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              14 chính tinh
            </h2>
          </div>
          <p className="mb-6 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Chính tinh là nhóm 14 sao quan trọng nhất trong Tử Vi. Vị trí của chúng trên 12
            cung tạo ra "khuôn mẫu" tính cách + sự nghiệp + quan hệ.
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {MAJOR_STARS.map((s) => (
              <Link
                key={s.slug}
                href={`/tu-vi/sao/${s.slug}`}
                className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card/40 p-3 transition hover:border-gold/40 active:scale-[0.98]"
              >
                <div>
                  <p className="font-heading text-sm font-semibold text-foreground">{s.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.hint}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            ))}
          </div>
        </section>

        {/* Aux stars */}
        <section className="relative mx-auto max-w-5xl px-6 pb-12">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-gold/70" aria-hidden />
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Phụ tinh + tứ hoá quan trọng
            </h2>
          </div>
          <p className="mb-6 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Phụ tinh và tứ hoá điều chỉnh ý nghĩa của chính tinh. Một chính tinh có Hoá
            Lộc luận khác với cùng chính tinh có Hoá Kỵ — bộ này quyết định "vị thuốc"
            của lá số.
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {AUX_STARS.map((s) => (
              <Link
                key={s.slug}
                href={`/tu-vi/sao/${s.slug}`}
                className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card/40 p-3 transition hover:border-gold/40 active:scale-[0.98]"
              >
                <div>
                  <p className="font-heading text-sm font-semibold text-foreground">{s.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.hint}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            ))}
          </div>
        </section>

        {/* Đặc trưng */}
        <section className="relative mx-auto max-w-5xl px-6 pb-20">
          <div className="mb-6 flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-gold" aria-hidden />
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              hieu.asia khác gì với web xem Tử Vi miễn phí?
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <FeatureItem
              title="Lá số tương tác"
              body="Bấm từng cung để thấy chính tinh, phụ tinh, tứ hoá. Tam phương tứ chính được tô vàng — luận có chiều sâu, không đọc rời lẻ."
            />
            <FeatureItem
              title="AI Mentor đọc đúng lá số đã lập"
              body="Mentor không đoán từ ngữ cảnh trống — nó đọc đúng cung Quan Lộc, Tài Bạch, Thiên Di để trả lời câu hỏi cụ thể của bạn."
            />
            <FeatureItem
              title="Kế hoạch hành động 30-60-90 ngày"
              body="Kết thúc không phải lời tiên tri mà là kế hoạch hành động — kèm câu hỏi tự phản tư và bước kiểm chứng."
            />
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools current="/tu-vi" />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta trackId="tu-vi-hub" />
    </div>
  );
}

function FeatureItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-5">
      <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
