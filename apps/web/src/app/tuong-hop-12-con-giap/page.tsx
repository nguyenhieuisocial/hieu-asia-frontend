import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, faqPage, type FaqItem } from '@/lib/seo/jsonld';
import {
  ZODIAC,
  relationOf,
  RELATION_COPY,
  pairToSlug,
  findZodiac,
  type RelationKind,
} from '@/lib/hop-tuoi-pairs';
import { TuongHopMatrix } from './TuongHopMatrix';

const TITLE = 'Bản đồ tương hợp 12 con giáp: tam hợp, lục xung, ngũ hành';
const DESCRIPTION =
  'Chọn con giáp của bạn: xem ngay hợp / khắc với cả 11 con còn lại — Tam Hợp, Lục Hợp, Lục Xung, Lục Hại, cùng tuổi, bình hoà và ngũ hành sinh – khắc. Cả 144 quan hệ trên một bản đồ, tính minh bạch theo Can Chi để tham khảo, không phán, không bói.';
const URL = 'https://hieu.asia/tuong-hop-12-con-giap';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: 'website',
    locale: 'vi_VN',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og-image.jpg', alt: TITLE }],
  },
};

// Màu ô ma trận theo loại quan hệ: hợp → xanh, cần dung hoà → hổ phách,
// còn lại → trung tính. Cùng bảng tone với badge trong TuongHopMatrix.
const CELL_CLASS: Record<RelationKind, string> = {
  'tam-hop': 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20',
  'luc-hop': 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20',
  'luc-xung': 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20',
  'luc-hai': 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20',
  'dong-tuoi': 'bg-card/60 text-foreground/70 hover:bg-card/80',
  'binh-hoa': 'bg-background/40 text-muted-foreground hover:bg-card/50',
};

// Giải nghĩa 6 loại quan hệ Can Chi — tái dùng nhãn RELATION_COPY, giọng tham
// khảo, nhấn mạnh "xung"/"hại" KHÔNG phải điềm xấu.
const TERMS: { term: string; body: string }[] = [
  {
    term: RELATION_COPY['tam-hop'].label,
    body: 'Bốn nhóm tam giác, mỗi nhóm ba con giáp có nhịp hợp nhau (vd Thân – Tý – Thìn). Dân gian xem là nhóm dễ tìm tiếng nói chung, hỗ trợ nhau.',
  },
  {
    term: RELATION_COPY['luc-hop'].label,
    body: 'Sáu cặp con giáp bổ trợ cho nhau — điểm mạnh của người này cân bằng điểm yếu của người kia (vd Tý – Sửu, Ngọ – Mùi).',
  },
  {
    term: RELATION_COPY['luc-xung'].label,
    body: 'Sáu cặp đối nhau trên vòng địa chi (vd Tý – Ngọ). KHÔNG phải điềm xấu: chỉ là hai nhịp sống khác nhau, dễ va chạm quan điểm nên cần dung hoà nhiều hơn. Rất nhiều cặp "xung" vẫn rất bền.',
  },
  {
    term: RELATION_COPY['luc-hai'].label,
    body: 'Sáu cặp dễ hiểu lầm nhau ở vài điểm (vd Tý – Mùi). Cách hiểu lành mạnh: cần giao tiếp rõ ràng và kiên nhẫn hơn — không phải lời khuyên "tránh nhau".',
  },
  {
    term: RELATION_COPY['dong-tuoi'].label,
    body: 'Hai người cùng một con giáp: dễ đồng cảm vì giống nhau, nhưng điểm mạnh và điểm yếu cũng có thể bị nhân đôi, nên cần bổ sung cho nhau chỗ cùng thiếu.',
  },
  {
    term: RELATION_COPY['binh-hoa'].label,
    body: 'Không thuộc nhóm hợp đặc biệt cũng không thuộc nhóm cần lưu ý: không có lực hút hay lực đẩy nổi bật từ con giáp — kết quả gần như hoàn toàn nằm trong tay hai người.',
  },
  {
    term: 'Ngũ hành sinh – khắc',
    body: 'Mỗi con giáp mang một hành (Kim, Mộc, Thủy, Hỏa, Thổ). Hai hành có thể tương sinh (nâng đỡ), tương khắc (nhắc dung hoà) hoặc trung tính. Tương khắc không phải điều xấu, chỉ là lời nhắc cân bằng.',
  },
];

const FAQS: FaqItem[] = [
  {
    q: 'Bản đồ tương hợp 12 con giáp là gì?',
    a: 'Là một bảng gom toàn bộ cách 12 con giáp quan hệ với nhau theo Can Chi dân gian: Tam Hợp, Lục Hợp, Lục Xung, Lục Hại, cùng tuổi và bình hoà, kèm tương tác Ngũ Hành sinh – khắc. Bạn chọn con giáp của mình để xem nhanh quan hệ với cả 11 con còn lại, hoặc tra cả 144 ô trong ma trận đầy đủ. Mọi quan hệ đều tính minh bạch theo quy tắc, không bịa.',
  },
  {
    q: 'Con giáp "xung" hay "khắc" nhau có phải điềm xấu không?',
    a: 'Không. "Xung" chỉ nghĩa là hai con giáp có nhịp sống và cách phản ứng khác nhau nên đôi khi dễ va chạm quan điểm; "khắc" trong Ngũ Hành là lời nhắc hai bên nên dung hoà để khác biệt trở thành sự cân bằng. Rất nhiều cặp thuộc nhóm này vẫn gắn bó bền lâu khi cả hai hiểu và nhường nhau đúng lúc. Con giáp chỉ là một lát cắt nhỏ.',
  },
  {
    q: 'Tam Hợp và Lục Hợp khác nhau thế nào?',
    a: 'Tam Hợp là bốn nhóm tam giác, mỗi nhóm ba con giáp có nhịp hợp nhau (Thân – Tý – Thìn, Dần – Ngọ – Tuất, Tỵ – Dậu – Sửu, Hợi – Mão – Mùi). Lục Hợp là sáu cặp bổ trợ cho nhau (Tý – Sửu, Dần – Hợi, Mão – Tuất, Thìn – Dậu, Tỵ – Thân, Ngọ – Mùi). Cả hai đều là tín hiệu tham khảo tích cực về sự hoà hợp.',
  },
  {
    q: 'Kết quả này có quyết định chuyện hợp – tan của tôi không?',
    a: 'Không. Đây là tri thức phong tục để tham khảo và hiểu nhau hơn, không phải lời phán. Một mối quan hệ bền vẫn dựa trên cách hai người lắng nghe, tôn trọng và đồng hành hằng ngày, hơn là chỉ ở con giáp. Muốn xét kỹ theo cả năm – giờ sinh, hãy lập lá số Bát Tự hoặc Tử Vi đầy đủ.',
  },
  {
    q: 'Vì sao mỗi con giáp chỉ có một con "xung"?',
    a: 'Vì 12 địa chi xếp trên một vòng tròn, mỗi chi có đúng một chi đối diện (cách nhau 6 bước) tạo thành cặp Lục Xung — nên có 6 cặp xung cho 12 con giáp. Tương tự, Lục Hại và Lục Hợp mỗi loại cũng gồm 6 cặp.',
  },
];

// Khối "Xem sâu hơn" — dẫn sang các công cụ quan hệ / con giáp liên quan.
const DEEP_LINKS: { href: string; label: string }[] = [
  { href: '/hop-tuoi', label: 'Xem hợp tuổi (đôi lứa, làm ăn)' },
  { href: '/hop-tuoi/tuoi', label: 'Hợp tuổi 12 con giáp theo từng cặp' },
  { href: '/xem-hop-nhom', label: 'Xem hợp nhóm / gia đình' },
  { href: '/xong-dat', label: 'Chọn tuổi xông đất theo tam hợp' },
  { href: '/learn/hop-tuoi', label: 'Tìm hiểu: hợp tuổi hoạt động thế nào' },
  { href: '/learn/con-giap', label: 'Tính cách 12 con giáp' },
  { href: '/tra-cuu-tuoi', label: 'Tra cứu tuổi trọn đời từ năm sinh' },
];

export default async function TuongHop12ConGiapPage({
  searchParams,
}: {
  searchParams: Promise<{ tuoi?: string }>;
}) {
  const sp = await searchParams;
  // Prefill con giáp từ ?tuoi= — chỉ nhận slug hợp lệ (khớp ZODIAC), sai → bỏ qua.
  const initialSlug =
    typeof sp.tuoi === 'string' && findZodiac(sp.tuoi) ? sp.tuoi : undefined;

  const JSONLD = [
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Bản đồ tương hợp 12 con giáp', url: '/tuong-hop-12-con-giap' },
    ]),
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

        {/* Hero + công cụ chọn con giáp */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-6 sm:pt-8">
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
            Tương hợp 12 con giáp · một bản đồ · miễn phí
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Bản đồ tương hợp 12 con giáp
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Chọn con giáp của bạn — xem ngay nó hợp hay khắc thế nào với cả 11 con còn lại: Tam Hợp,
            Lục Hợp, Lục Xung, Lục Hại, cùng tuổi, bình hoà và ngũ hành sinh – khắc. Tất cả tính minh
            bạch theo Can Chi để <strong className="text-foreground">tham khảo</strong>; &quot;xung&quot;
            hay &quot;khắc&quot; không phải điềm xấu — chỉ là hai nhịp khác nhau, không phán, không bói.
          </p>

          <div className="mt-7">
            <TuongHopMatrix initialSlug={initialSlug} />
          </div>
        </section>

        {/* Ma trận 12×12 đầy đủ — render server-side cho SEO/crawler (đủ 144 quan hệ) */}
        <section className="relative mx-auto max-w-5xl px-6 pb-10">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Ma trận tương hợp đầy đủ 12 × 12
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            Đọc theo hàng (con giáp của bạn) giao với cột (con giáp còn lại) để biết loại quan hệ. Bấm
            một ô để mở trang chi tiết của cặp đó. Ô trên đường chéo là hai người <strong>cùng tuổi</strong>.
          </p>
          <div className="overflow-x-auto scroll-fade-x">
            <table className="w-full border-collapse text-center text-xs">
              <caption className="sr-only">
                Bảng quan hệ Can Chi giữa 12 con giáp: hàng và cột là con giáp, mỗi ô là loại quan hệ.
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-10 bg-background p-2 text-left font-medium text-muted-foreground"
                  >
                    <span className="sr-only">Con giáp</span>
                  </th>
                  {ZODIAC.map((col) => (
                    <th
                      key={col.slug}
                      scope="col"
                      className="whitespace-nowrap p-2 font-heading font-semibold text-foreground"
                    >
                      <span className="text-base" aria-hidden>
                        {col.emoji}
                      </span>
                      <span className="ml-1">{col.ten}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ZODIAC.map((row) => (
                  <tr key={row.slug}>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 whitespace-nowrap bg-background p-2 text-left font-heading font-semibold text-foreground"
                    >
                      <span className="text-base" aria-hidden>
                        {row.emoji}
                      </span>
                      <span className="ml-1">{row.ten}</span>
                    </th>
                    {ZODIAC.map((col) => {
                      const rel = relationOf(row.slug, col.slug);
                      const copy = RELATION_COPY[rel];
                      return (
                        <td key={col.slug} className="p-1">
                          <Link
                            href={`/hop-tuoi/tuoi/${pairToSlug(row.slug, col.slug)}`}
                            title={`Tuổi ${row.ten} và tuổi ${col.ten}: ${copy.label}`}
                            className={`block whitespace-nowrap rounded-md px-2 py-1.5 font-medium transition ${CELL_CLASS[rel]}`}
                          >
                            {copy.label}
                          </Link>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Giải nghĩa thuật ngữ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Các loại quan hệ nghĩa là gì?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {TERMS.map((t) => (
              <div key={t.term} className="rounded-lg border border-border bg-card/40 p-4">
                <p className="mb-1 font-heading text-base font-semibold text-foreground">{t.term}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground/90">Lưu ý:</strong> đây là phong tục Can Chi để tham khảo.
            Con giáp tính theo năm âm lịch (đổi vào Tết) — người sinh tháng 1 hoặc đầu tháng 2 dương lịch
            có thể vẫn thuộc con giáp của năm liền trước, hãy đối chiếu ngày Tết của năm sinh để chắc chắn.
          </p>
        </section>

        {/* FAQ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-lg border border-border bg-card/40 p-4">
                <p className="mb-1.5 font-heading text-base font-semibold text-foreground">{f.q}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Xem sâu hơn — link nội bộ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-16">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Xem sâu hơn
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {DEEP_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-lg border border-border bg-card/40 p-3 text-sm leading-relaxed text-foreground/85 transition hover:border-gold/40 hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Muốn hiểu sâu hơn về chính mình và một mối quan hệ cụ thể từ giờ – ngày – tháng – năm sinh,
            hãy lập{' '}
            <Link href="/la-so-bat-tu" className="text-gold hover:underline">
              lá số Bát Tự
            </Link>{' '}
            hoặc{' '}
            <Link href="/la-so-tu-vi" className="text-gold hover:underline">
              lá số Tử Vi
            </Link>{' '}
            đầy đủ — miễn phí.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
