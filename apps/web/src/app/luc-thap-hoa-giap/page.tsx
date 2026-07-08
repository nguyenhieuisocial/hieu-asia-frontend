import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, faqPage, type FaqItem } from '@/lib/seo/jsonld';
import { yearProfile } from '@/lib/sinh-con';
import { ELEMENTS } from '@/lib/dat-ten-ngu-hanh';

const TITLE = 'Lục Thập Hoa Giáp: bảng 60 Can Chi, nạp âm, ngũ hành';
const DESCRIPTION =
  'Bảng tra Lục Thập Hoa Giáp đầy đủ: 60 năm Can Chi (Giáp Tý → Quý Hợi), tên nạp âm và ngũ hành bản mệnh của từng năm. Tra cứu minh bạch, tính theo lịch can chi — không bói toán.';
const URL = 'https://hieu.asia/luc-thap-hoa-giap';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: 'article',
    locale: 'vi_VN',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [{ url: '/og-image.jpg', alt: TITLE }] },
};

// Chu kỳ 60 Hoa Giáp: 1984 = Giáp Tý (đầu vòng) → 60 năm liên tiếp phủ đủ 60
// Can Chi (Giáp Tý … Quý Hợi). Mỗi Can Chi lặp lại mỗi 60 năm — cột "Năm" nêu
// 3 mốc đại diện (y−60 · y · y+60). Tính từ engine THUẦN yearProfile (không bịa).
interface Row {
  stt: number;
  canChi: string;
  zodiacTen: string;
  zodiacEmoji: string;
  napAm: string;
  element: string;
  years: number[];
}

const CYCLE: Row[] = Array.from({ length: 60 }, (_, i) => {
  const year = 1984 + i;
  const p = yearProfile(year)!;
  return {
    stt: i + 1,
    canChi: p.canChi,
    zodiacTen: p.zodiac.ten,
    zodiacEmoji: p.zodiac.emoji,
    napAm: p.napAmName,
    element: ELEMENTS[p.element].name,
    years: [year - 60, year, year + 60],
  };
});

// Màu ngũ hành cho dễ quét mắt (thuần trang trí, đúng cả 2 theme).
const ELEMENT_COLOR: Record<string, string> = {
  Kim: 'text-amber-500',
  Mộc: 'text-emerald-500',
  Thủy: 'text-sky-500',
  Hỏa: 'text-rose-500',
  Thổ: 'text-yellow-600 dark:text-yellow-500',
};

const FAQS: FaqItem[] = [
  {
    q: 'Lục Thập Hoa Giáp là gì?',
    a: 'Là vòng 60 năm ghép từ 10 Thiên Can (Giáp, Ất, Bính…) và 12 Địa Chi (Tý, Sửu, Dần…). Bắt đầu từ Giáp Tý, sau đúng 60 năm mới lặp lại — nên gọi là "lục thập" (60). Mỗi năm trong vòng có một tên Can Chi, một nạp âm và một hành bản mệnh riêng.',
  },
  {
    q: 'Nạp âm là gì, khác gì ngũ hành?',
    a: 'Nạp âm là "mệnh" của năm theo vòng 60 Giáp Tý, có tên riêng (ví dụ Hải Trung Kim, Lộ Bàng Thổ). Cứ hai Can Chi liền nhau chung một nạp âm. Ngũ hành bản mệnh là hành (Kim/Mộc/Thủy/Hỏa/Thổ) suy từ tên nạp âm đó.',
  },
  {
    q: 'Vì sao mỗi dòng ghi 3 năm?',
    a: 'Vì mỗi Can Chi lặp lại đúng mỗi 60 năm. Ba năm trong cột "Năm" (cách nhau 60 năm) đều cùng một Can Chi, nạp âm và hành — tiện đối chiếu năm sinh của bạn.',
  },
  {
    q: 'Bảng này có phải bói toán không?',
    a: 'Không. Đây là tri thức can-chi được tính minh bạch để tra cứu và tham khảo. Con số hoàn toàn theo quy ước lịch pháp, không có phán định số phận.',
  },
];

export default function LucThapHoaGiapPage() {
  const JSONLD = [
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Lục Thập Hoa Giáp', url: '/luc-thap-hoa-giap' },
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

        <section className="relative mx-auto max-w-4xl px-6 pb-8 pt-6 sm:pt-8">
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
            Bảng tra · 60 năm · miễn phí
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Lục Thập Hoa Giáp
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Trọn bộ <strong className="text-foreground">60 Can Chi</strong> (Giáp Tý → Quý Hợi) cùng{' '}
            <strong className="text-foreground">nạp âm</strong> và{' '}
            <strong className="text-foreground">ngũ hành bản mệnh</strong> của từng năm — tính theo
            lịch can chi, minh bạch để tra cứu. Muốn xem trọn đời một tuổi cụ thể?{' '}
            <Link href="/tra-cuu-tuoi" className="text-gold underline underline-offset-4 hover:text-gold/80">
              Tra cứu tuổi trọn đời
            </Link>
            .
          </p>
        </section>

        {/* Bảng 60 Hoa Giáp — server-render đủ 60 dòng; cuộn ngang trên mobile */}
        <section aria-labelledby="bang-hoa-giap" className="relative mx-auto max-w-4xl px-6 pb-10">
          <h2 id="bang-hoa-giap" className="sr-only">
            Bảng 60 Can Chi, nạp âm và ngũ hành
          </h2>
          <div className="overflow-x-auto scroll-fade-x rounded-xl border border-border bg-card/40">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[12px] uppercase tracking-[0.1em] text-primary/80">
                  <th className="px-3 py-3 font-medium">#</th>
                  <th className="px-3 py-3 font-medium">Can Chi</th>
                  <th className="px-3 py-3 font-medium">Con giáp</th>
                  <th className="px-3 py-3 font-medium">Nạp âm</th>
                  <th className="px-3 py-3 font-medium">Ngũ hành</th>
                  <th className="px-3 py-3 font-medium">Năm</th>
                </tr>
              </thead>
              <tbody>
                {CYCLE.map((r) => (
                  <tr key={r.stt} className="border-b border-border/50 last:border-0 hover:bg-card/60">
                    <td className="px-3 py-2.5 text-muted-foreground">{r.stt}</td>
                    <td className="px-3 py-2.5 font-heading font-semibold text-foreground">{r.canChi}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-foreground/85">
                      <span aria-hidden className="mr-1">{r.zodiacEmoji}</span>
                      {r.zodiacTen}
                    </td>
                    <td className="px-3 py-2.5 text-foreground/85">{r.napAm}</td>
                    <td className={`px-3 py-2.5 font-medium ${ELEMENT_COLOR[r.element] ?? 'text-foreground'}`}>
                      {r.element}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-muted-foreground">
                      {r.years.join(' · ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground/90">Lưu ý:</strong> tuổi tính theo năm âm lịch (đổi vào
            Tết). Người sinh tháng 1 hoặc đầu tháng 2 dương lịch có thể vẫn thuộc Can Chi của năm liền
            trước — hãy đối chiếu ngày Tết của năm sinh để chắc chắn.
          </p>
        </section>

        {/* FAQ */}
        <section className="relative mx-auto max-w-4xl px-6 pb-12">
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

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">Xem sâu hơn:{' '}
              <Link href="/tra-cuu-tuoi" className="text-gold hover:underline">Tra cứu tuổi trọn đời</Link>{' · '}
              <Link href="/ban-menh" className="text-gold hover:underline">Ngũ hành bản mệnh theo năm</Link>{' · '}
              <Link href="/learn/con-giap" className="text-gold hover:underline">12 con giáp</Link>{' · '}
              <Link href="/la-so-bat-tu" className="text-gold hover:underline">Lập lá số Bát Tự</Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
