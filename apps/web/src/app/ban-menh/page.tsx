import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, faqPage, itemList, webPage } from '@/lib/seo/jsonld';
import { listElementGuide, recentYears, BIRTH_YEARS, COLOR_HEX } from '@/lib/ban-menh-data';
import { BanMenhFinder } from './BanMenhFinder';

const URL = 'https://hieu.asia/ban-menh';

export const metadata: Metadata = {
  title: 'Sinh năm nào mệnh gì? Tra ngũ hành bản mệnh (nạp âm) & màu hợp theo năm sinh',
  description:
    'Tra ngũ hành bản mệnh theo năm sinh: bạn mệnh Kim, Mộc, Thủy, Hỏa hay Thổ, nạp âm là gì, hợp màu gì và nên hạn chế màu nào. Tính theo nạp âm 60 Giáp Tý, suy màu theo luật tương sinh – tương khắc. Tham khảo, không phán số mệnh.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Sinh năm nào mệnh gì? Tra ngũ hành bản mệnh & màu hợp',
    description:
      'Tra mệnh theo năm sinh (nạp âm 60 Giáp Tý) + màu hợp / nên hạn chế theo ngũ hành tương sinh – tương khắc.',
    url: URL,
    type: 'website',
    locale: 'vi_VN',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'hieu.asia — Ngũ hành bản mệnh' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sinh năm nào mệnh gì? Tra ngũ hành bản mệnh & màu hợp',
    description: 'Tra mệnh theo năm sinh + màu hợp theo ngũ hành tương sinh – tương khắc.',
    images: [{ url: '/og-image.jpg', alt: 'hieu.asia — Ngũ hành bản mệnh' }],
  },
};

const FAQS = [
  {
    q: 'Nạp âm là gì?',
    a: 'Nạp âm là cách gán mỗi cặp Can – Chi trong chu kỳ 60 Giáp Tý vào một trong năm hành (Kim, Mộc, Thủy, Hỏa, Thổ), kèm một tên gọi giàu hình ảnh như "Hải Trung Kim" (vàng trong biển) hay "Lộ Bàng Thổ" (đất ven đường). Cứ hai năm liền kề chia sẻ một nạp âm.',
  },
  {
    q: 'Làm sao biết mình mệnh gì?',
    a: 'Dựa vào năm sinh âm lịch. Nhập năm sinh vào công cụ ở trên để biết nạp âm và hành bản mệnh. Lưu ý tuổi tính theo năm âm lịch (đổi vào Tết), nên người sinh tháng 1 – đầu tháng 2 dương có thể thuộc năm âm liền trước.',
  },
  {
    q: 'Mệnh hợp màu gì được tính thế nào?',
    a: 'Theo ngũ hành: màu hợp gồm màu của chính hành bản mệnh và màu của hành "sinh ra" mệnh đó (tương sinh, bổ trợ); màu nên hạn chế là màu của hành "khắc" mệnh. Ví dụ mệnh Hỏa hợp xanh lá (Mộc sinh Hỏa) và đỏ/hồng, nên hạn chế đen/xanh dương (Thủy khắc Hỏa).',
  },
  {
    q: 'Mệnh nạp âm có phải là Cung Mệnh trong Tử Vi không?',
    a: 'Không. Mệnh nạp âm tính theo năm sinh (một trong 5 hành). Cung Mệnh trong Tử Vi là một cung cụ thể trên lá số, tính từ giờ – ngày – tháng – năm sinh. Hai khái niệm khác nhau; muốn xem Cung Mệnh hãy lập lá số Tử Vi.',
  },
];

// Nhóm năm theo thập kỷ để lưới gọn mà vẫn cho mọi năm một liên kết nội bộ.
function byDecade(years: number[]): { decade: number; years: number[] }[] {
  const map = new Map<number, number[]>();
  for (const y of years) {
    const d = Math.floor(y / 10) * 10;
    map.set(d, [...(map.get(d) ?? []), y]);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([decade, ys]) => ({ decade, years: ys }));
}

export default function BanMenhHubPage() {
  const elements = listElementGuide();
  const decades = byDecade(BIRTH_YEARS);

  const JSONLD = [
    webPage({
      name: 'Ngũ hành bản mệnh theo năm sinh',
      description: 'Tra mệnh (nạp âm) và màu hợp theo năm sinh.',
      url: '/ban-menh',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Ngũ hành bản mệnh', url: '/ban-menh' },
    ]),
    itemList(recentYears(20).map((y) => ({ name: `Sinh năm ${y} mệnh gì`, url: `/ban-menh/${y}` }))),
    faqPage(FAQS),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <JsonLd data={JSONLD} />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        {/* Hero */}
        <section className="relative mx-auto max-w-3xl px-6 pb-8 pt-6 sm:pt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Ngũ hành · Nạp âm 60 Giáp Tý
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Sinh năm nào mệnh gì?
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Tra ngũ hành bản mệnh theo năm sinh: bạn mệnh Kim, Mộc, Thủy, Hỏa hay Thổ, nạp âm là gì,
            hợp màu gì và nên hạn chế màu nào. Tính theo nạp âm và luật tương sinh – tương khắc —
            tham khảo để hiểu mình, không phán số mệnh.
          </p>
        </section>

        {/* Công cụ tra mệnh */}
        <section id="tra-menh" className="relative mx-auto max-w-3xl scroll-mt-24 px-6 pb-10">
          <BanMenhFinder />
        </section>

        {/* 5 hành */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Năm hành (ngũ hành)
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            Mọi nạp âm đều quy về một trong năm hành. Mỗi hành mang một "khí chất" và bộ màu đại
            diện.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {elements.map((e) => (
              <Card key={e.key} className="border-border bg-card/40">
                <CardContent className="p-4">
                  <p className="flex items-center gap-2 font-heading text-base font-semibold text-foreground">
                    Mệnh {e.name}
                    <span className="inline-flex gap-1">
                      {e.colors.map((c) => (
                        <span
                          key={c}
                          aria-hidden
                          title={c}
                          className="h-3.5 w-3.5 rounded-full border border-border"
                          style={{ backgroundColor: COLOR_HEX[c] ?? '#888' }}
                        />
                      ))}
                    </span>
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">{e.blurb}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Lưới năm sinh */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Tra mệnh theo từng năm sinh
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            Chọn năm sinh để xem chi tiết: tuổi (can chi), con giáp, nạp âm, hành bản mệnh và màu
            hợp.
          </p>
          <div className="space-y-5">
            {decades.map((d) => (
              <div key={d.decade}>
                <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Thập niên {d.decade}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {d.years.map((y) => (
                    <Link
                      key={y}
                      href={`/ban-menh/${y}`}
                      className="inline-flex items-center rounded-md border border-border bg-card/40 px-2.5 py-1 font-mono text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
                    >
                      {y}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Giải thích */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-border bg-card/40 p-6">
            <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
              Ngũ hành bản mệnh chỉ là một lát cắt
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nạp âm theo năm sinh cho biết hành bản mệnh chung của cả một (đôi khi hai) năm, hữu ích
              để tham khảo màu sắc cho dễ chịu, hợp gu. Nhưng nó không phản ánh đầy đủ một con người.
              Lá số <strong className="text-foreground/85">Bát Tự</strong> (Tứ Trụ) tính cả giờ – ngày
              – tháng sinh mới cho thấy ngũ hành nào vượng, nào thiếu trong chính bạn.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/la-so-bat-tu">
                  Lập lá số Bát Tự miễn phí <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <Card key={f.q} className="border-border bg-card/40">
                <CardContent className="p-4">
                  <p className="font-heading text-base text-foreground">{f.q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bắt email */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-border bg-card/40 p-6">
            <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
              Nhận bài về ngũ hành & phong thủy ứng dụng
            </h2>
            <OccasionLeadCapture
              source="ban-menh-hub"
              capturedEvent="lead_capture_ban_menh"
              capturedProps={{ year: 'hub' }}
              blurb="Để lại email, thi thoảng chúng tôi gửi bài giúp bạn dùng ngũ hành bản mệnh vào đời sống (màu sắc, chọn ngày, hướng). Không spam."
              cta="Nhận bài"
            />
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools
            links={[
              { href: '/la-so-bat-tu', label: 'Lá số Bát Tự (Tứ Trụ) đầy đủ' },
              { href: '/dat-ten-ngu-hanh', label: 'Đặt tên con theo ngũ hành' },
              { href: '/huong-nha', label: 'Hướng nhà hợp tuổi' },
              { href: '/hop-tuoi', label: 'Xem hợp tuổi' },
            ]}
          />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/la-so-bat-tu" trackId="ban-menh-hub" />
    </div>
  );
}
