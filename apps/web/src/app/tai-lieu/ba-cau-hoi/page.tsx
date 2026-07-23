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
  BA_CAU_HOI,
  BA_CAU_HOI_TITLE,
  BA_CAU_HOI_SUBTITLE,
  BA_CAU_HOI_INTRO,
  BA_CAU_HOI_AFTER,
  BA_CAU_HOI_DISCLAIMER,
} from '@/lib/tai-lieu/ba-cau-hoi';

/**
 * /tai-lieu/ba-cau-hoi — tài liệu tặng "Bộ 3 câu hỏi giúp bạn tự soi mình".
 *
 * Không dùng engine lá số: đây là khung tự soi thuần, cố ý dùng được cho cả
 * người chưa từng xem tử vi. Nội dung ở lib/tai-lieu/ba-cau-hoi.ts dùng chung
 * cho trang đọc và bản PDF.
 */

const DESC =
  'Tài liệu miễn phí: ba câu hỏi tự soi trước một quyết định lớn (cưới, sinh con, đổi việc, bán nhà) — kèm cách trả lời từng bước, ví dụ đã điền sẵn và cạm bẫy hay gặp. Làm trong 20 phút.';

export const metadata: Metadata = {
  title: `${BA_CAU_HOI_TITLE} — tài liệu miễn phí`,
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/tai-lieu/ba-cau-hoi' },
  openGraph: {
    title: `${BA_CAU_HOI_TITLE} — hieu.asia`,
    description: DESC,
    url: 'https://hieu.asia/tai-lieu/ba-cau-hoi',
    type: 'article',
    images: OG_DEFAULT_IMAGES,
  },
};

const PDF_PAYLOAD: ToolPdfPayload = {
  title: BA_CAU_HOI_TITLE,
  subtitle: BA_CAU_HOI_SUBTITLE,
  hero: {
    big: 'Ba câu hỏi, 20 phút, một quyết định rõ hơn',
    small: 'Không cần biết gì về tử vi — chỉ cần giấy bút · hieu.asia',
  },
  sections: [
    { heading: 'Trước khi bắt đầu', text: BA_CAU_HOI_INTRO.join('\n\n') },
    ...BA_CAU_HOI.map((q) => ({
      heading: `Câu ${q.no}. ${q.question}`,
      text: [
        `VÌ SAO HỎI: ${q.why}`,
        `CÁCH TRẢ LỜI:\n${q.how.map((h, i) => `${i + 1}. ${h}`).join('\n')}`,
        `VÍ DỤ: ${q.example}`,
        `CẠM BẪY: ${q.trap}`,
      ].join('\n\n'),
    })),
    { heading: 'Sau khi làm xong', text: BA_CAU_HOI_AFTER.join('\n\n') },
    { heading: 'Giới hạn của tài liệu này', text: BA_CAU_HOI_DISCLAIMER },
  ],
  cta: { text: 'Lập lá số miễn phí tại hieu.asia', url: 'https://hieu.asia/onboarding' },
};

export default function BaCauHoiPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({ name: BA_CAU_HOI_TITLE, description: DESC, url: '/tai-lieu/ba-cau-hoi' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tài liệu tặng', url: '/tai-lieu' },
            { name: BA_CAU_HOI_TITLE, url: '/tai-lieu/ba-cau-hoi' },
          ]),
        ]}
      />
      <ToolPageShell
        eyebrow="Tài liệu tặng · Tự soi"
        icon={<span aria-hidden="true">🪞</span>}
        title={
          <>
            Bộ 3 câu hỏi giúp bạn <GoldAccent>tự soi mình</GoldAccent>
          </>
        }
        description={BA_CAU_HOI_SUBTITLE}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tài liệu tặng', href: '/tai-lieu' },
          { label: 'Bộ 3 câu hỏi' },
        ]}
        heroAction={
          <DownloadToolPdfButton
            source="pdf-ba-cau-hoi"
            label="Tải bản PDF để in ra"
            payload={PDF_PAYLOAD}
          />
        }
      >
        <article className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            {BA_CAU_HOI_INTRO.map((p) => (
              <p key={p} className="mt-3 text-base leading-relaxed text-foreground/90 first:mt-0">
                {p}
              </p>
            ))}
          </div>

          {BA_CAU_HOI.map((q) => (
            <section key={q.no} className="mt-8 rounded-2xl border border-border bg-card/30 p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold">
                Câu hỏi {q.no}
              </p>
              <h2 className="mt-2 font-editorial-display text-2xl font-normal text-foreground">
                {q.question}
              </h2>

              <h3 className="mt-5 font-heading text-sm font-semibold text-foreground">
                Vì sao nên hỏi
              </h3>
              <p className="mt-1.5 text-base leading-relaxed text-foreground/90">{q.why}</p>

              <h3 className="mt-5 font-heading text-sm font-semibold text-foreground">
                Cách trả lời
              </h3>
              <ol className="mt-1.5 list-decimal space-y-1.5 pl-5 text-base leading-relaxed text-foreground/90">
                {q.how.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ol>

              <div className="mt-5 rounded-xl border border-gold/25 bg-gold/[0.04] p-4">
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  Ví dụ đã điền
                </h3>
                <p className="mt-1.5 text-base italic leading-relaxed text-foreground/90">
                  {q.example}
                </p>
              </div>

              <h3 className="mt-5 font-heading text-sm font-semibold text-foreground">
                Cạm bẫy hay gặp
              </h3>
              <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">{q.trap}</p>
            </section>
          ))}

          <section className="mt-8 rounded-2xl border border-border bg-card/40 p-5">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Sau khi làm xong
            </h2>
            {BA_CAU_HOI_AFTER.map((p) => (
              <p key={p} className="mt-3 text-base leading-relaxed text-foreground/90">
                {p}
              </p>
            ))}
          </section>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {BA_CAU_HOI_DISCLAIMER}
          </p>

          <div className="mt-8 rounded-2xl border border-gold/25 bg-gold/[0.04] p-5">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Muốn bản in để viết tay vào?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Để lại email, chúng tôi gửi bản PDF vào hộp thư — in ra, ngồi viết tay thường cho
              kết quả tốt hơn gõ trên máy. Không spam, huỷ bất cứ lúc nào.
            </p>
            <div className="mt-4">
              <DownloadToolPdfButton
                source="pdf-ba-cau-hoi"
                label="Nhận bản PDF"
                payload={PDF_PAYLOAD}
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Đọc thêm:{' '}
              <Link href="/tai-lieu/sach-hieu-la-so" className="text-gold hover:underline">
                sách &ldquo;Hiểu lá số của mình mà không mê tín&rdquo;
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
