import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage } from '@/lib/seo/jsonld';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';
import {
  DownloadToolPdfButton,
  type ToolPdfPayload,
} from '@/components/tools/DownloadToolPdfButton';
import {
  EBOOK_TITLE,
  EBOOK_SUBTITLE,
  EBOOK_READ_MINUTES,
  EBOOK_INTRO,
  EBOOK_SECTIONS,
  EBOOK_CLOSING,
  EBOOK_DISCLAIMER,
} from '@/lib/tai-lieu/sach-hieu-la-so';

/**
 * /tai-lieu/sach-hieu-la-so — sách điện tử tặng, đọc trọn trên web.
 *
 * Nội dung nằm ở lib/tai-lieu/sach-hieu-la-so.ts và được dùng cho CẢ trang đọc
 * lẫn payload PDF, nên hai bản không bao giờ lệch nhau.
 */

const DESC =
  'Sách điện tử miễn phí: cách đọc lá số của mình một cách tỉnh táo — phân biệt phần tính được với phần diễn giải, nhận ra lời chung chung, đối chiếu với quá khứ thật của bạn. Đọc khoảng 15–20 phút.';

export const metadata: Metadata = {
  title: `${EBOOK_TITLE} — sách điện tử miễn phí`,
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/tai-lieu/sach-hieu-la-so' },
  openGraph: {
    title: `${EBOOK_TITLE} — hieu.asia`,
    description: DESC,
    url: 'https://hieu.asia/tai-lieu/sach-hieu-la-so',
    type: 'article',
    images: OG_DEFAULT_IMAGES,
  },
};

/** Payload PDF — dựng từ CÙNG nguồn nội dung với trang đọc. */
const PDF_PAYLOAD: ToolPdfPayload = {
  title: EBOOK_TITLE,
  subtitle: EBOOK_SUBTITLE,
  hero: {
    big: EBOOK_TITLE,
    small: `${EBOOK_SECTIONS.length} chương · đọc khoảng ${EBOOK_READ_MINUTES} phút · hieu.asia`,
  },
  sections: [
    { heading: 'Mở đầu', text: EBOOK_INTRO.join('\n\n') },
    ...EBOOK_SECTIONS.map((s) => ({
      heading: `${s.label} — ${s.heading}`,
      text: s.paragraphs.join('\n\n'),
    })),
    { heading: 'Lời cuối', text: EBOOK_CLOSING.join('\n\n') },
    { heading: 'Giới hạn của tài liệu này', text: EBOOK_DISCLAIMER },
  ],
  cta: { text: 'Lập lá số miễn phí tại hieu.asia', url: 'https://hieu.asia/onboarding' },
};

export default function SachHieuLaSoPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ name: EBOOK_TITLE, description: DESC, url: '/tai-lieu/sach-hieu-la-so' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tài liệu tặng', url: '/tai-lieu' },
            { name: EBOOK_TITLE, url: '/tai-lieu/sach-hieu-la-so' },
          ]),
        ]}
      />
      <ToolPageShell
        eyebrow="Sách điện tử · Tặng miễn phí"
        icon={<span aria-hidden="true">📖</span>}
        title={
          <>
            Hiểu lá số của mình <GoldAccent>mà không mê tín</GoldAccent>
          </>
        }
        description={EBOOK_SUBTITLE}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tài liệu tặng', href: '/tai-lieu' },
          { label: 'Sách điện tử' },
        ]}
        heroAction={
          <DownloadToolPdfButton
            source="pdf-sach-la-so"
            label="Tải bản PDF về máy"
            payload={PDF_PAYLOAD}
          />
        }
      >
        <article className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            {EBOOK_INTRO.map((p) => (
              <p key={p} className="mt-3 text-base leading-relaxed text-foreground/90 first:mt-0">
                {p}
              </p>
            ))}
          </div>

          {/* Mục lục — sách dài, người lớn tuổi cần chỗ nhảy nhanh tới chương. */}
          <nav aria-label="Mục lục" className="mt-8 rounded-2xl border border-gold/25 bg-gold/[0.04] p-5">
            <h2 className="font-heading text-base font-semibold text-foreground">Mục lục</h2>
            <ol className="mt-3 space-y-1.5 text-sm">
              {EBOOK_SECTIONS.map((s) => (
                <li key={s.label}>
                  <a
                    href={`#${slugOf(s.label)}`}
                    className="text-muted-foreground underline-offset-4 hover:text-gold hover:underline"
                  >
                    {s.label}. {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {EBOOK_SECTIONS.map((s) => (
            <section key={s.label} id={slugOf(s.label)} className="mt-10 scroll-mt-24">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold">
                {s.label}
              </p>
              <h2 className="mt-2 font-editorial-display text-2xl font-normal text-foreground">
                {s.heading}
              </h2>
              {s.paragraphs.map((p) => (
                <p key={p} className="mt-4 text-base leading-relaxed text-foreground/90">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <section className="mt-12 rounded-2xl border border-border bg-card/40 p-5">
            <h2 className="font-heading text-lg font-semibold text-foreground">Lời cuối</h2>
            {EBOOK_CLOSING.map((p) => (
              <p key={p} className="mt-3 text-base leading-relaxed text-foreground/90">
                {p}
              </p>
            ))}
          </section>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {EBOOK_DISCLAIMER}
          </p>

          <div className="mt-8 rounded-2xl border border-gold/25 bg-gold/[0.04] p-5">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Muốn giữ một bản để đọc lại?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Để lại email, chúng tôi gửi bản PDF vào hộp thư của bạn — in ra đọc hay đưa người
              nhà đọc đều được. Không spam, huỷ bất cứ lúc nào.
            </p>
            <div className="mt-4">
              <DownloadToolPdfButton
                source="pdf-sach-la-so"
                label="Nhận bản PDF"
                payload={PDF_PAYLOAD}
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Hoặc thử ngay:{' '}
              <Link href="/onboarding" className="text-gold hover:underline">
                lập lá số miễn phí
              </Link>{' '}
              ·{' '}
              <Link href="/bang-chung" className="text-gold hover:underline">
                đối chiếu lá số với quá khứ của bạn
              </Link>{' '}
              ·{' '}
              <Link href="/tai-lieu" className="text-gold hover:underline">
                các tài liệu tặng khác
              </Link>
            </p>
          </div>
        </article>
      </ToolPageShell>
    </>
  );
}

/** "Chương 1" → "chuong-1" (id neo cho mục lục). */
function slugOf(label: string): string {
  const n = label.replace(/\D+/g, '');
  return `chuong-${n || '0'}`;
}
