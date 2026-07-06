import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, faqPage, itemList, webPage } from '@/lib/seo/jsonld';
import { listCung } from '@/lib/cung-hoang-dao-data';
import {
  matrixRow,
  RELATION_SHORT,
  pairSlug,
  type PairRelation,
} from '@/lib/cung-hoang-dao-hop-data';
import { PairPicker } from './PairPicker';

const URL = 'https://hieu.asia/cung-hoang-dao/hop';

export const metadata: Metadata = {
  title: 'Độ hợp 12 cung hoàng đạo — tra cặp đôi',
  description:
    'Tra độ hợp 2 cung hoàng đạo: chọn cung của bạn và người kia — hợp theo nguyên tố (cùng, bổ trợ, đối, khác biệt). Tham khảo, không phán số mệnh.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Độ hợp cung hoàng đạo — tra cặp đôi 12 cung',
    description:
      'Chọn 2 cung để xem độ hợp tình yêu & tính cách, phân loại theo nguyên tố. Tham khảo, không phán số mệnh.',
    url: URL,
    type: 'website',
    locale: 'vi_VN',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'hieu.asia — Độ hợp cung hoàng đạo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Độ hợp cung hoàng đạo — tra cặp đôi 12 cung',
    description: 'Chọn 2 cung để xem độ hợp, phân loại theo nguyên tố.',
    images: [{ url: '/og-image.jpg', alt: 'hieu.asia — Độ hợp cung hoàng đạo' }],
  },
};

const CELL_COLOR: Record<PairRelation, string> = {
  'same-sign': 'bg-sky-500/15 text-sky-200',
  'same-element': 'bg-emerald-500/15 text-emerald-200',
  support: 'bg-emerald-500/10 text-emerald-200/90',
  opposite: 'bg-amber-500/15 text-amber-200',
  different: 'bg-card/40 text-foreground/60',
};

const FAQS = [
  {
    q: 'Cách xem độ hợp cung hoàng đạo?',
    a: 'Chọn cung của bạn và cung của người kia ở công cụ phía trên. Hệ thống phân loại quan hệ hai cung theo nguyên tố: cùng cung, cùng nguyên tố, bổ trợ, cung đối, hoặc khác biệt — kèm lời diễn giải để tham khảo.',
  },
  {
    q: 'Cung nào hợp cung nào?',
    a: 'Theo khung nguyên tố: các cung cùng nguyên tố (Lửa–Lửa, Đất–Đất, Khí–Khí, Nước–Nước) hòa hợp tự nhiên; Lửa hợp bổ trợ với Khí, Đất hợp bổ trợ với Nước. Cung đối nhau (cách 6 cung) thì "vừa hút vừa thử thách". Các cặp còn lại cần thấu hiểu nhau hơn.',
  },
  {
    q: 'Hai cung "khắc" nhau thì không nên yêu nhau?',
    a: 'Không đúng. Không có chuyện hai cung "khắc" nhau theo kiểu định mệnh. Hai cung khác nguyên tố chỉ có nhịp sống khác nhau, cần lắng nghe và bù trừ — rất nhiều cặp bền chặt thuộc nhóm này. Đây chỉ là gợi ý để hiểu nhau hơn.',
  },
  {
    q: 'So cung Mặt Trời có đủ để biết độ hợp không?',
    a: 'Chưa đủ. Cung Mặt Trời chỉ là một phần. Độ hợp thật còn phụ thuộc cung Mọc, Mặt Trăng và các hành tinh của cả hai người (cần giờ và nơi sinh). Hãy lập bản đồ sao đầy đủ cho cả hai để xem bức tranh trọn vẹn.',
  },
];

export default function HopHubPage() {
  const signs = listCung(); // thứ tự = idx (0..11)
  const rows = signs.map((s, i) => ({ sign: s, cells: matrixRow(i) }));

  // itemList mẫu: Bạch Dương (idx 0) với 11 cung còn lại.
  const sampleItems = signs
    .map((s, i) => ({ s, i }))
    .filter(({ i }) => i !== 0)
    .map(({ s, i }) => ({
      name: `Cung ${signs[0]!.name} và ${s.name}`,
      url: `/cung-hoang-dao/hop/${pairSlug(0, i)}`,
    }));

  const JSONLD = [
    webPage({
      name: 'Độ hợp cung hoàng đạo — 12 cung',
      description: 'Tra độ hợp giữa hai cung hoàng đạo theo nguyên tố.',
      url: '/cung-hoang-dao/hop',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Cung hoàng đạo', url: '/cung-hoang-dao' },
      { name: 'Độ hợp', url: '/cung-hoang-dao/hop' },
    ]),
    itemList(sampleItems),
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
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
            Chiêm tinh phương Tây · Độ hợp
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Độ hợp cung hoàng đạo
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Chọn cung của bạn và cung của người kia để xem hai cung có hợp nhau không — về tình yêu và
            tính cách. Phân loại theo nguyên tố, tham khảo để hiểu nhau hơn, không phán số mệnh.
          </p>
        </section>

        {/* Picker */}
        <section id="tra-do-hop" className="relative mx-auto max-w-3xl scroll-mt-24 px-6 pb-10">
          <PairPicker />
        </section>

        {/* Bảng độ hợp 12 cung */}
        <section className="relative mx-auto max-w-3xl px-6 pb-4">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Bảng độ hợp 12 cung
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Chọn ô giao giữa hai cung để xem chi tiết. Màu thể hiện kiểu quan hệ theo nguyên tố.
          </p>
          <p className="mb-2 font-mono text-[13px] text-muted-foreground sm:hidden" aria-hidden="true">
            ← vuốt ngang →
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-center text-xs">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-card/80 p-1.5" aria-label="cung" />
                  {signs.map((s) => (
                    <th key={s.slug} className="p-1.5 font-medium text-muted-foreground" title={s.name}>
                      <span aria-hidden>{s.symbol}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ sign, cells }) => (
                  <tr key={sign.slug}>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-card/80 p-1.5 text-left font-medium text-muted-foreground"
                      title={sign.name}
                    >
                      <span aria-hidden className="mr-1">
                        {sign.symbol}
                      </span>
                    </th>
                    {cells.map((c, j) => (
                      <td key={c.slug} className="p-0.5">
                        <Link
                          href={`/cung-hoang-dao/hop/${c.slug}`}
                          title={`${sign.name} & ${signs[j]!.name}: ${RELATION_SHORT[c.relation]}`}
                          className={`flex h-10 w-10 items-center justify-center rounded sm:h-7 sm:w-7 ${CELL_COLOR[c.relation]} transition hover:ring-1 hover:ring-gold/50`}
                        >
                          <span aria-hidden className="text-[13px]">
                            {signs[j]!.symbol}
                          </span>
                        </Link>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Chú thích */}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {(Object.keys(RELATION_SHORT) as PairRelation[]).map((r) => (
              <span key={r} className="inline-flex items-center gap-1.5">
                <span aria-hidden className={`h-3 w-3 rounded ${CELL_COLOR[r]}`} />
                {RELATION_SHORT[r]}
              </span>
            ))}
          </div>
        </section>

        {/* 12 cung */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-4">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Tìm hiểu từng cung
          </h2>
          <div className="flex flex-wrap gap-2">
            {signs.map((s) => (
              <Link
                key={s.slug}
                href={`/cung-hoang-dao/${s.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
              >
                <span aria-hidden>{s.symbol}</span> {s.name}
              </Link>
            ))}
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
              Nhận bài về độ hợp & chiêm tinh
            </h2>
            <OccasionLeadCapture
              source="cung-hop-hub"
              capturedEvent="lead_capture_cung_hop"
              capturedProps={{ pair: 'hub' }}
              blurb="Để lại email, thi thoảng chúng tôi gửi bài giúp bạn hiểu sâu hơn về độ hợp cung hoàng đạo và bản đồ sao đôi. Không spam."
              cta="Nhận bài"
            />
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools
            links={[
              { href: '/cung-hoang-dao', label: '12 cung hoàng đạo' },
              { href: '/ban-do-sao', label: 'Bản đồ sao đầy đủ' },
              { href: '/hop-tuoi', label: 'Xem hợp tuổi (con giáp)' },
            ]}
          />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="#tra-do-hop" trackId="cung-hop-hub" />
    </div>
  );
}
