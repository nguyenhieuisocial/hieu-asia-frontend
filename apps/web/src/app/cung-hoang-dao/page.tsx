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
import { ELEMENT_TENDENCY, type ZodiacElement } from '@/lib/western-astrology';
import { listCung } from '@/lib/cung-hoang-dao-data';
import { SunSignFinder } from './SunSignFinder';

const URL = 'https://hieu.asia/cung-hoang-dao';

export const metadata: Metadata = {
  title: 'Cung hoàng đạo: 12 cung, ngày sinh, tính cách & độ hợp — tính theo thiên văn thật',
  description:
    'Tra cung hoàng đạo theo ngày sinh và tìm hiểu 12 cung: Bạch Dương, Kim Ngưu, Song Tử, Cự Giải, Sư Tử, Xử Nữ, Thiên Bình, Bọ Cạp, Nhân Mã, Ma Kết, Bảo Bình, Song Ngư. Tính cách, nguyên tố, hành tinh chủ quản và cung hợp nhau. Tính theo vị trí Mặt Trời thật, tham khảo, không phán số mệnh.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Cung hoàng đạo — 12 cung, ngày sinh & độ hợp',
    description:
      'Tra cung theo ngày sinh (tính theo Mặt Trời thật) + tìm hiểu tính cách, nguyên tố và cung hợp nhau của cả 12 cung hoàng đạo.',
    url: URL,
    type: 'website',
    locale: 'vi_VN',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'hieu.asia — Cung hoàng đạo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cung hoàng đạo — 12 cung, ngày sinh & độ hợp',
    description: 'Tra cung theo ngày sinh + tính cách, nguyên tố và cung hợp nhau của 12 cung.',
    images: [{ url: '/og-image.jpg', alt: 'hieu.asia — Cung hoàng đạo' }],
  },
};

const ELEMENT_GROUPS: { key: ZodiacElement; emoji: string }[] = [
  { key: 'Lửa', emoji: '🔥' },
  { key: 'Đất', emoji: '⛰️' },
  { key: 'Khí', emoji: '💨' },
  { key: 'Nước', emoji: '💧' },
];

const FAQS = [
  {
    q: 'Cung hoàng đạo là gì?',
    a: '12 cung hoàng đạo chia đường đi biểu kiến của Mặt Trời trong một năm (hoàng đạo) thành 12 phần bằng nhau, mỗi phần 30°. "Cung hoàng đạo" của bạn (còn gọi là cung Mặt Trời) là cung mà Mặt Trời nằm trong đó vào ngày bạn sinh.',
  },
  {
    q: 'Làm sao biết tôi thuộc cung nào?',
    a: 'Dựa vào ngày sinh. Dùng công cụ "Bạn là cung gì?" ở trên — nó tính theo vị trí Mặt Trời thật cho đúng ngày của bạn, nên chính xác cả với người sinh sát ranh giới giữa hai cung (mốc ngày có thể lệch một ngày tuỳ năm).',
  },
  {
    q: 'Cung Mặt Trời khác cung Mọc thế nào?',
    a: 'Cung Mặt Trời nói về ý chí và cái tôi. Cung Mọc (Ascendant) là cung đang mọc ở chân trời lúc bạn sinh — liên quan đến cách bạn xuất hiện và phản ứng tự nhiên — và cần biết giờ lẫn nơi sinh mới tính được. Bản đồ sao đầy đủ gồm cả hai cùng Mặt Trăng và các hành tinh khác.',
  },
  {
    q: 'Cung hoàng đạo có đáng tin không?',
    a: 'Ngày tháng và nguyên tố của mỗi cung là dữ kiện thiên văn có thật, kiểm chứng được. Phần mô tả tính cách là một khung để soi chiếu và hiểu mình rõ hơn — mang tính tham khảo, không phải lời tiên đoán số mệnh. hieu.asia trình bày minh bạch và không bán lễ "giải hạn".',
  },
];

export default function CungHoangDaoHubPage() {
  const cung = listCung();

  const JSONLD = [
    webPage({
      name: 'Cung hoàng đạo — 12 cung, ngày sinh & độ hợp',
      description: 'Tra cung hoàng đạo theo ngày sinh và tìm hiểu tính cách 12 cung.',
      url: '/cung-hoang-dao',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Cung hoàng đạo', url: '/cung-hoang-dao' },
    ]),
    itemList(cung.map((s) => ({ name: `Cung ${s.name}`, url: `/cung-hoang-dao/${s.slug}` }))),
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
        <section className="relative mx-auto max-w-3xl px-6 pb-8 pt-12 sm:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Chiêm tinh phương Tây
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Cung hoàng đạo: 12 cung theo ngày sinh
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Tra cung của bạn theo ngày sinh, rồi khám phá tính cách, nguyên tố, hành tinh chủ quản và
            cung hợp nhau của cả 12 cung. Tất cả tính theo vị trí Mặt Trời thật — tham khảo để hiểu
            mình, không phán số mệnh.
          </p>
        </section>

        {/* Công cụ tra cung */}
        <section
          id="cung-cua-toi"
          className="relative mx-auto max-w-3xl scroll-mt-24 px-6 pb-10"
        >
          <SunSignFinder />
        </section>

        {/* Lưới 12 cung theo nguyên tố */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            12 cung hoàng đạo
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            Mỗi cung thuộc một trong bốn nguyên tố. Cùng nguyên tố thường chia sẻ "khí chất" giống
            nhau.
          </p>
          <div className="space-y-6">
            {ELEMENT_GROUPS.map((g) => {
              const signs = cung.filter((s) => s.element === g.key);
              return (
                <div key={g.key}>
                  <p className="mb-2 flex items-center gap-2 font-heading text-sm font-semibold text-foreground/90">
                    <span aria-hidden>{g.emoji}</span> Nhóm {g.key}
                    <span className="font-normal text-muted-foreground">
                      — {ELEMENT_TENDENCY[g.key]}
                    </span>
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {signs.map((s) => (
                      <Link key={s.slug} href={`/cung-hoang-dao/${s.slug}`} className="group">
                        <Card className="h-full border-border bg-card/40 transition group-hover:border-gold/40">
                          <CardContent className="p-4">
                            <p className="flex items-center gap-2 font-heading text-base font-semibold text-foreground">
                              <span aria-hidden className="text-xl text-gold">
                                {s.symbol}
                              </span>
                              Cung {s.name}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">{s.dateLabel}</p>
                            <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                              {s.tagline}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Giải thích ngắn */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-border bg-card/40 p-6">
            <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
              Cung Mặt Trời mới là một mảnh của bức tranh
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Cung hoàng đạo (cung Mặt Trời) cho biết phần ý chí và cái tôi của bạn. Nhưng bản đồ sao
              đầy đủ còn có <strong className="text-foreground/85">cung Mọc</strong> (cách bạn xuất
              hiện), <strong className="text-foreground/85">cung Mặt Trăng</strong> (đời sống cảm xúc)
              và vị trí các hành tinh — tất cả phụ thuộc giờ và nơi sinh. Đó là lý do hai người cùng
              cung vẫn rất khác nhau.
            </p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/ban-do-sao">
                  Lập bản đồ sao đầy đủ <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
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
              Nhận bài về chiêm tinh và cung hoàng đạo
            </h2>
            <OccasionLeadCapture
              source="cung-hoang-dao-hub"
              capturedEvent="lead_capture_cung_hoang_dao"
              capturedProps={{ cung: 'hub' }}
              blurb="Để lại email, thi thoảng chúng tôi gửi bài giúp bạn hiểu sâu hơn về cung hoàng đạo, bản đồ sao và cách áp dụng vào đời sống. Không spam."
              cta="Nhận bài"
            />
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools
            links={[
              { href: '/ban-do-sao', label: 'Bản đồ sao (lá số chiêm tinh đầy đủ)' },
              { href: '/thien-van', label: 'Thiên văn hôm nay' },
              { href: '/la-so-tu-vi', label: 'Lá số Tử Vi' },
            ]}
          />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/ban-do-sao" trackId="cung-hoang-dao-hub" />
    </div>
  );
}
