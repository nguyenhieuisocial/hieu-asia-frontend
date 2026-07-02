import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, faqPage, webPage } from '@/lib/seo/jsonld';
import { MAJOR_PAGES } from '@/lib/tarot-card-pages';
import { MINOR_PAGES } from '@/lib/tarot-card-pages-minor';

export const metadata: Metadata = {
  // SEO-FIX: absolute (62 → 52 chars) + description shortened (213 → ~155).
  title: { absolute: 'Ý nghĩa 78 lá bài Tarot — xuôi & ngược | hieu.asia' },
  description:
    'Ý nghĩa đủ 78 lá Tarot (22 Ẩn chính + 56 Ẩn phụ) theo hệ Rider–Waite–Smith: từ khóa xuôi – ngược, biểu tượng và câu hỏi tự soi. Không phán định mệnh.',
  alternates: { canonical: 'https://hieu.asia/tarot/y-nghia' },
  openGraph: {
    title: 'Ý nghĩa 78 lá bài Tarot — xuôi & ngược, đủ bộ | hieu.asia',
    description: 'Thư viện ý nghĩa lá Tarot viết theo lối phản tư: hiểu lá để tự hỏi, không phải để được phán.',
    url: 'https://hieu.asia/tarot/y-nghia',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Ý nghĩa lá Tarot có cố định không?',
    a: 'Có một lõi nghĩa truyền thống (ở đây dùng hệ Rider–Waite–Smith, phổ biến nhất thế giới) — nhưng nghĩa của một lá trong từng lần rút luôn phụ thuộc câu hỏi và hoàn cảnh của người rút. Vì vậy mỗi trang đều kết bằng câu hỏi tự soi thay vì một lời phán cố định.',
  },
  {
    q: 'Có cần học thuộc 78 lá để dùng Tarot không?',
    a: 'Không. Bạn có thể rút bài và đọc gợi ý kèm theo ngay. Thư viện này dành cho lúc bạn muốn hiểu sâu hơn một lá vừa gặp — đọc đến đâu, dùng đến đó.',
  },
  {
    q: 'Ẩn chính và Ẩn phụ khác gì nhau?',
    a: '22 lá Ẩn chính (Major Arcana) mang các chủ đề lớn của đời người — khởi đầu, chuyển hóa, khép vòng. 56 lá Ẩn phụ (Minor Arcana) nói chuyện đời thường hằng ngày, chia 4 chất: Gậy (hành động), Cốc (cảm xúc), Kiếm (suy nghĩ – lời nói), Tiền (công việc – vật chất). Khi rút bài, cả hai nhóm trộn chung một bộ.',
  },
];

export default function TarotMeaningsHubPage() {
  return (
    <ToolPageShell
      eyebrow="TAROT PHẢN TƯ · THƯ VIỆN"
      relatedSlug="/tarot"
      icon="📖"
      title={<>Ý nghĩa <GoldAccent>78 lá Tarot</GoldAccent></>}
      description="Đủ bộ 78 lá, mỗi lá một trang: hình ảnh biểu tượng, nghĩa xuôi – ngược theo truyền thống Rider–Waite–Smith, góc tình cảm – công việc, và câu hỏi để bạn tự soi. Hiểu lá để tự hỏi — không phải để được phán."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Tarot', href: '/tarot' },
        { label: 'Ý nghĩa lá bài' },
      ]}
    >
      <div className="mx-auto max-w-3xl">
        <p className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          Hành trình Ẩn chính đi từ <b className="text-foreground/85">0 — Gã Khờ</b> (khởi đầu) tới{' '}
          <b className="text-foreground/85">21 — Thế Giới</b> (trọn vẹn): một vòng đời thu nhỏ mà ai cũng đi qua nhiều
          lần. Chọn lá bạn vừa rút được, hoặc lá đang khiến bạn tò mò.
        </p>

        <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">22 lá Ẩn chính — hành trình lớn</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {MAJOR_PAGES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/tarot/y-nghia/${c.slug}`}
                className="flex h-full flex-col rounded-xl border border-border bg-card/40 p-4 transition-colors hover:border-gold/40 hover:bg-gold/5"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
                  {String(c.number).padStart(2, '0')} · Ẩn chính
                </span>
                <span className="mt-1 font-heading text-lg font-semibold text-foreground">
                  {c.name_vi} <span className="text-sm font-normal text-muted-foreground">· {c.name}</span>
                </span>
                <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {c.keyUp.slice(0, 3).join(' · ')}
                </span>
              </Link>
            </li>
          ))}
        </ul>


        {[
          { vi: 'Gậy', en: 'Wands', theme: 'hành động · đam mê · năng lượng' },
          { vi: 'Cốc', en: 'Cups', theme: 'cảm xúc · quan hệ · trực giác' },
          { vi: 'Kiếm', en: 'Swords', theme: 'tư duy · lời nói · sự thật' },
          { vi: 'Tiền', en: 'Pentacles', theme: 'công việc · vật chất · sức khỏe' },
        ].map((suit) => (
          <section key={suit.vi} className="mt-10">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Chất {suit.vi} <span className="text-sm font-normal text-muted-foreground">· {suit.en} — {suit.theme}</span>
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {MINOR_PAGES.filter((c) => c.suit_vi === suit.vi).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/tarot/y-nghia/${c.slug}`}
                    className="flex h-full items-baseline justify-between gap-3 rounded-lg border border-border bg-card/40 px-4 py-2.5 transition-colors hover:border-gold/40 hover:bg-gold/5"
                  >
                    <span className="font-medium text-foreground">
                      {c.name_vi} <span className="text-xs font-normal text-muted-foreground">· {c.name}</span>
                    </span>
                    <span className="shrink-0 text-right text-[11px] leading-snug text-muted-foreground">{c.keyUp[0]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/tarot"
            className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Rút lá cho câu hỏi của bạn →
          </Link>
          <Link
            href="/tarot/hom-nay"
            className="rounded-md border border-gold/30 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            🌅 Lá Tarot hôm nay
          </Link>
        </div>

        <section className="mt-10 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Câu hỏi thường gặp</h2>
          <dl className="mt-4 space-y-4">
            {FAQS.map((f, i) => (
              <div key={i}>
                <dt className="font-medium text-foreground">{f.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <JsonLd
        data={[
          webPage({
            url: '/tarot/y-nghia',
            name: 'Ý nghĩa 78 lá bài Tarot — đủ bộ',
            description:
              'Thư viện ý nghĩa đủ 78 lá Tarot (22 Ẩn chính + 56 Ẩn phụ): từ khóa xuôi – ngược, biểu tượng, góc tình cảm – công việc và câu hỏi tự soi.',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tarot', url: '/tarot' },
            { name: 'Ý nghĩa lá bài', url: '/tarot/y-nghia' },
          ]),
          faqPage(FAQS),
        ]}
      />
    </ToolPageShell>
  );
}
