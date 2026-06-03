import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Wallet, PiggyBank, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'Tử Vi tài chính: kiếm tiền, quản lý, rủi ro',
  description:
    'Tử Vi tài chính — đọc cung Tài Bạch, Điền Trạch + đại vận để hiểu khuynh hướng kiếm tiền và quản lý tài chính cá nhân. KHÔNG phải tư vấn đầu tư.',
  alternates: { canonical: 'https://hieu.asia/tu-vi-tai-chinh' },
  // Wave 60.96.2 — route-level openGraph REPLACES root-layout openGraph; must
  // re-declare `images` or social preview cards render blank.
  openGraph: {
    title: 'Tử Vi tài chính',
    description: 'Tài Bạch + Điền Trạch — khuynh hướng tài chính cá nhân.',
    url: 'https://hieu.asia/tu-vi-tai-chinh',
    type: 'article',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Tử Vi tài chính: Tài Bạch + Điền Trạch',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tử Vi tài chính',
    description: 'Tài Bạch + Điền Trạch — khuynh hướng tài chính cá nhân.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Tử Vi tài chính',
      },
    ],
  },
};

const PATTERNS = [
  {
    icon: PiggyBank,
    title: 'Tích luỹ ổn định, ít rủi ro',
    body: 'Tài Bạch có Thiên Phủ/Thái Âm — khuynh hướng tiết kiệm tự nhiên. Hợp tích luỹ qua chuyên môn + bất động sản. Tránh "lướt sóng".',
  },
  {
    icon: TrendingUp,
    title: 'Quyết liệt, có hệ thống',
    body: 'Tài Bạch có Vũ Khúc — kỷ luật tài chính cao. Hợp ngành tài chính, kế toán, kỹ sư. Cẩn trọng "cứng nhắc" trong quyết định đầu tư.',
  },
  {
    icon: Wallet,
    title: 'Đa nguồn thu nhập, biến động',
    body: 'Tài Bạch có Tham Lang/Phá Quân — thu nhập đa nguồn, có lên có xuống. Hợp người làm freelance, kinh doanh, sáng tạo. Bắt buộc có emergency fund.',
  },
  {
    icon: AlertTriangle,
    title: 'Tài Bạch có Hoá Kỵ/sát tinh',
    body: 'Không nghĩa là "đời mạt vận tài chính". Là tín hiệu cần kỷ luật quản lý dòng tiền cao hơn người khác — và TUYỆT ĐỐI tránh leverage cao.',
  },
];

const REMINDERS = [
  'hieu.asia KHÔNG đưa ra tư vấn đầu tư cụ thể (mua cổ phiếu nào, lúc nào, bao nhiêu).',
  'Tử Vi cho biết KHUYNH HƯỚNG quản lý tiền, không cho biết RỦI RO THỊ TRƯỜNG.',
  'Quyết định đầu tư cần tham vấn người có chứng chỉ + cập nhật thị trường thực tế.',
  'Tài Bạch tốt không đảm bảo giàu; Tài Bạch yếu không đảm bảo nghèo — kỷ luật mới là yếu tố quyết định.',
];

const JSONLD = [
  article({
    headline: 'Tử Vi tài chính — Tài Bạch + Điền Trạch + đại vận',
    description:
      'Tử Vi tài chính — đọc cung Tài Bạch, Điền Trạch + đại vận để hiểu khuynh hướng kiếm tiền và quản lý tài chính cá nhân.',
    url: '/tu-vi-tai-chinh',
    image: '/og-image.jpg',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Tử Vi tài chính', url: '/tu-vi-tai-chinh' },
  ]),
];

export default function TuViTaiChinhPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <JsonLd data={JSONLD} />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-12 sm:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Tử Vi · Tài chính & dòng tiền cá nhân
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Tử Vi tài chính — bạn quản lý tiền kiểu nào?
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Cung Tài Bạch phản ánh CÁCH BẠN KIẾM và QUẢN LÝ tiền — không phải con số tài
            sản. Hiểu khuynh hướng giúp bạn chọn chiến lược tài chính hợp tính cách
            mình, thay vì copy strategy người khác.
          </p>
          <Card className="mt-6 border-amber-700/40 bg-amber-900/10">
            <CardContent className="flex items-start gap-3 pt-5 text-sm leading-relaxed text-amber-100/90">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
              <p>
                <strong className="text-amber-100">Disclaimer rõ:</strong> hieu.asia KHÔNG
                phải nền tảng tư vấn đầu tư. Mọi nội dung dưới đây là góc nhìn khuynh
                hướng cá nhân, không phải khuyến nghị mua/bán tài sản tài chính.
              </p>
            </CardContent>
          </Card>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/onboarding">
              Xem tử vi tài chính của tôi
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/tu-vi/cung-tai-bach">
              
                Cung Tài Bạch là gì
              
            </Link></Button>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            4 khuôn mẫu tài chính thường gặp
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
                Lằn ranh hieu.asia không vượt qua
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
                {REMINDERS.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-300">→</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Xem cung Tài Bạch + Điền Trạch của bạn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Lập lá số 2 phút. Mentor sẽ giúp bạn dịch Tài Bạch + Điền Trạch + đại vận
              thành thói quen tài chính nên có (và nên tránh) trong 90 ngày tới.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/onboarding">
                Lập lá số miễn phí
              </Link></Button>
              <Link
                href="/tu-vi-2026"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Tử Vi 2026 <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools current="/tu-vi-tai-chinh" />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/onboarding?intent=tai-chinh" trackId="tu-vi-tai-chinh" />
    </div>
  );
}
