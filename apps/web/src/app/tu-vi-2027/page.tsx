import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';
import { ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { article, breadcrumb, faqPage, itemList } from '@/lib/seo/jsonld';
import { TimeFlowChecker } from '@/components/time-flow/TimeFlowChecker';
import type { RelationKind } from '@/lib/hop-tuoi-pairs';
import { buildConGiap2027, CON_GIAP_SLUGS, YEAR_RANGE } from './con-giap-data';

export const metadata: Metadata = {
  title: 'Tử Vi 2027 năm Đinh Mùi — 12 con giáp, hợp xung, Tam Tai, sao hạn',
  description:
    'Tử Vi 2027 (năm Đinh Mùi, hành Thổ) cho cả 12 con giáp: tuổi nào hợp/xung Thái Tuế, tuổi nào phạm Tam Tai, vận trình sự nghiệp – tài lộc – tình cảm – sức khoẻ và sao hạn theo năm sinh. Minh bạch theo Can Chi, tham khảo, không phán số mệnh.',
  alternates: { canonical: 'https://hieu.asia/tu-vi-2027' },
  openGraph: {
    title: 'Tử Vi 2027 năm Đinh Mùi — 12 con giáp',
    description:
      'Năm Đinh Mùi hành Thổ: tuổi hợp/xung Thái Tuế, Tam Tai, vận trình 4 mảng + sao hạn theo năm sinh cho 12 con giáp.',
    url: 'https://hieu.asia/tu-vi-2027',
    type: 'article',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Tử Vi 2027 năm Đinh Mùi hành Thổ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tử Vi 2027 năm Đinh Mùi — 12 con giáp',
    description: 'Hợp xung Thái Tuế, Tam Tai, vận trình 4 mảng + sao hạn theo năm sinh.',
    images: [{ url: '/og-image.jpg', alt: 'hieu.asia — Tử Vi 2027 năm Đinh Mùi' }],
  },
};

const RELATION_TONE: Record<RelationKind, { label: string; cls: string }> = {
  'tam-hop': { label: 'Tam Hợp — thuận', cls: 'text-emerald-400' },
  'luc-hop': { label: 'Lục Hợp — thuận', cls: 'text-emerald-400' },
  'dong-tuoi': { label: 'Năm tuổi — chủ động', cls: 'text-amber-400' },
  'luc-xung': { label: 'Xung Thái Tuế — chủ động', cls: 'text-rose-400' },
  'luc-hai': { label: 'Lục Hại — chủ động', cls: 'text-amber-400' },
  'binh-hoa': { label: 'Bình hoà', cls: 'text-muted-foreground' },
};

const HUB_FAQS = [
  {
    q: 'Năm 2027 là năm con gì, mệnh gì?',
    a: '2027 là năm Đinh Mùi — con giáp cầm tinh con Dê, can Đinh (hành Hỏa) và chi Mùi (hành Thổ), nạp âm Thiên Hà Thủy. Năm âm lịch Đinh Mùi kéo dài khoảng 06/02/2027 đến 25/01/2028.',
  },
  {
    q: 'Tuổi nào xung Thái Tuế, phạm Tam Tai năm 2027?',
    a: 'Theo Can Chi, năm Mùi 2027: tuổi Sửu xung Thái Tuế (Sửu – Mùi tương xung); tuổi Mùi là năm tuổi (Bản Mệnh Thái Tuế); nhóm tuổi Hợi – Mão – Mùi phạm Tam Tai. Đây là lưu ý để chủ động, không phải hạn nặng hay điềm xấu cố định.',
  },
  {
    q: 'Tử Vi theo con giáp có chính xác cho riêng tôi không?',
    a: 'Khung theo con giáp chỉ là một lát cắt chung cho cả nhóm tuổi. Lá số riêng của bạn còn phụ thuộc ngày giờ sinh, đại vận và lưu niên cá nhân. Hãy xem trang con giáp như một điểm khởi đầu tham khảo, rồi lập lá số để có bản chi tiết của riêng mình.',
  },
];

export default function TuVi2027HubPage() {
  const rows = CON_GIAP_SLUGS.map((slug) => buildConGiap2027(slug)!);

  const JSONLD = [
    article({
      headline: 'Tử Vi 2027 — năm Đinh Mùi hành Thổ cho 12 con giáp',
      description:
        'Tử Vi 2027 (năm Đinh Mùi): hợp xung Thái Tuế, Tam Tai, vận trình 4 mảng và sao hạn theo năm sinh cho cả 12 con giáp.',
      url: '/tu-vi-2027',
      image: '/og-image.jpg',
      datePublished: '2026-06-20',
      dateModified: '2026-06-20',
      type: 'Article',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Tử Vi 2027', url: '/tu-vi-2027' },
    ]),
    itemList(
      rows.map((d, i) => ({
        position: i + 1,
        name: `Tử Vi 2027 tuổi ${d.z.ten}`,
        url: `/tu-vi-2027/${d.z.slug}`,
      })),
    ),
    faqPage(HUB_FAQS),
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

        <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-12 sm:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Năm Đinh Mùi · hành Thổ · con Dê · {YEAR_RANGE}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Tử Vi 2027 — năm Đinh Mùi cho 12 con giáp
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            2027 là năm Đinh Mùi, hành Thổ — tông năm thiên về sự ổn định, chắc chắn và vun đắp lâu
            dài hơn là bứt phá ồ ạt. Mỗi con giáp đón năm một khác, tuỳ quan hệ Can Chi của tuổi với
            chi Mùi (Thái Tuế) và tương tác ngũ hành. Chọn tuổi của bạn bên dưới để xem vận trình,
            Tam Tai và sao hạn — tất cả tính minh bạch, để tham khảo, không phán số mệnh.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding?intent=tu-vi-2027">Xem tử vi 2027 của tôi</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sample-report">Mẫu báo cáo</Link>
            </Button>
          </div>
        </section>

        {/* Bảng tra nhanh 12 con giáp */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Tử Vi 2027 theo tuổi — tra nhanh 12 con giáp
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            Quan hệ của mỗi tuổi với năm Mùi (Thái Tuế) và việc có phạm Tam Tai hay không. Bấm vào
            từng tuổi để xem vận trình sự nghiệp – tài lộc – tình cảm – sức khoẻ và bảng sao hạn theo
            năm sinh.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Con giáp
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Quan hệ với năm Mùi
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Tam Tai
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((d) => {
                  const tone = RELATION_TONE[d.relation];
                  return (
                    <tr key={d.z.slug} className="text-foreground/85">
                      <td className="px-3 py-2 font-medium text-foreground">
                        <span aria-hidden="true" className="mr-1.5">
                          {d.z.emoji}
                        </span>
                        Tuổi {d.z.ten}
                      </td>
                      <td className={`px-3 py-2 ${tone.cls}`}>{tone.label}</td>
                      <td className="px-3 py-2">
                        {d.isTamTai ? (
                          <span className="text-rose-400">Có</span>
                        ) : (
                          <span className="text-muted-foreground">Không</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <Link
                          href={`/tu-vi-2027/${d.z.slug}`}
                          className="text-gold hover:underline"
                        >
                          Xem
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            "Thuận" hay "chủ động" chỉ là tông tham khảo theo Can Chi của cả nhóm tuổi — không phải
            lời phán tốt/xấu cho riêng bạn.
          </p>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <TimeFlowChecker scope="yearly" />
        </section>

        {/* FAQ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Câu hỏi thường gặp về Tử Vi 2027
          </h2>
          <dl className="space-y-4">
            {HUB_FAQS.map((f) => (
              <div key={f.q} className="rounded-lg border border-border bg-card/40 p-4">
                <dt className="font-heading font-medium text-foreground">{f.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Liên kết theo mùa */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <nav aria-label="Công cụ liên quan" className="text-sm leading-7">
            <span className="text-muted-foreground">Xem thêm: </span>
            <Link href="/tu-vi-2026" className="text-gold hover:underline">
              Tử Vi 2026 (Bính Ngọ)
            </Link>
            {', '}
            <Link href="/sao-han" className="text-gold hover:underline">
              Sao hạn theo tuổi
            </Link>
            {', '}
            <Link href="/hop-tuoi" className="text-gold hover:underline">
              Xem hợp tuổi
            </Link>
            {', '}
            <Link href="/la-so-bat-tu" className="text-gold hover:underline">
              Lập lá số miễn phí
            </Link>
          </nav>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Tử Vi 2027 cá nhân hoá theo lá số của bạn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Bảng theo con giáp ở trên là chung cho năm Đinh Mùi. Tử Vi 2027 RIÊNG bạn phụ thuộc đại
              vận hiện tại + lưu niên cá nhân + cung Quan/Tài/Phu Thê của riêng bạn. Lập lá số 2 phút
              để xem chi tiết.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/onboarding?intent=tu-vi-2027">Lập lá số miễn phí</Link>
              </Button>
              <Link
                href="/tu-vi"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Cẩm nang Tử Vi <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <div className="rounded-xl border border-border bg-card/40 p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Nhận nhắc theo mùa
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source="tu-vi-2027-hub"
                capturedEvent="lead_capture_tu_vi_2027_hub"
                blurb="Để lại email, chúng tôi sẽ báo bạn khi có bản tử vi 2027 đầy đủ theo tuổi và nội dung mới theo mùa. Thi thoảng thôi, không spam."
                cta="Nhận nhắc"
              />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools current="/tu-vi-2027" />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/onboarding?intent=tu-vi-2027" trackId="tu-vi-2027" />
    </div>
  );
}
