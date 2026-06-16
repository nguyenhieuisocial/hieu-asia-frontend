import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { FaqSection } from '@/components/seo/FaqSection';
import { breadcrumb, webPage, faqPage, type FaqItem } from '@/lib/seo/jsonld';
import { QUE_PAGES, TRIGRAMS, getQue } from '@/lib/que-kinh-dich';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return QUE_PAGES.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const q = getQue(slug);
  if (!q) return {};
  const title = `Quẻ ${q.nameVi} (quẻ số ${q.id}) — ý nghĩa & lời khuyên | hieu.asia`;
  const description = `Quẻ ${q.nameVi} — quẻ ${q.id}/64 Kinh Dịch: ${q.keyTags.join(', ')}. Tượng quẻ, ý chính của thế cục, gợi ý ứng xử, góc tình cảm – công việc và câu hỏi tự soi.`;
  const url = `https://hieu.asia/gieo-que/y-nghia/${q.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'hieu.asia', locale: 'vi_VN', type: 'article' },
  };
}

/** Vẽ 1 hào: dương = vạch liền, âm = hai đoạn. */
function HaoLine({ duong }: { duong: boolean }) {
  return duong ? (
    <div className="h-2 w-24 rounded-sm bg-gold/80" />
  ) : (
    <div className="flex w-24 justify-between">
      <div className="h-2 w-10 rounded-sm bg-gold/80" />
      <div className="h-2 w-10 rounded-sm bg-gold/80" />
    </div>
  );
}

export default async function QueMeaningPage({ params }: Props) {
  const { slug } = await params;
  const q = getQue(slug);
  if (!q) notFound();

  const up = TRIGRAMS[q.binary.slice(0, 3)];
  const down = TRIGRAMS[q.binary.slice(3)];
  const idx = QUE_PAGES.findIndex((x) => x.slug === q.slug);
  const prev = idx > 0 ? QUE_PAGES[idx - 1] : undefined;
  const next = idx < QUE_PAGES.length - 1 ? QUE_PAGES[idx + 1] : undefined;

  // Câu hỏi thường gặp — dựng từ dữ liệu THẬT của quẻ (core/advice/love/work) + cấu trúc quái,
  // mỗi quẻ một bộ riêng. Dùng chung 1 mảng cho cả FAQPage JSON-LD lẫn phần hiển thị.
  const faqs: FaqItem[] = [
    { q: `Quẻ ${q.nameVi} có ý nghĩa gì?`, a: q.core },
    { q: `Bốc được quẻ ${q.nameVi} thì nên ứng xử thế nào?`, a: q.advice },
    { q: `Quẻ ${q.nameVi} nói gì về tình cảm, quan hệ?`, a: q.love },
    { q: `Quẻ ${q.nameVi} nói gì về công việc, tiền bạc?`, a: q.work },
    ...(up && down
      ? [
          {
            q: `Quẻ ${q.nameVi} gồm những quái nào?`,
            a: `Quẻ ${q.nameVi} (quẻ ${q.id}/64 Kinh Dịch) ghép từ ${up.ten} (${up.tuong}) ở trên và ${down.ten} (${down.tuong}) ở dưới.`,
          },
        ]
      : []),
  ];

  return (
    <ToolPageShell
      eyebrow={`KINH DỊCH · QUẺ ${String(q.id).padStart(2, '0')}/64`}
      relatedSlug="/gieo-que"
      icon="☰"
      title={
        <>
          Quẻ <GoldAccent>{q.nameVi}</GoldAccent>
        </>
      }
      description={`Ý nghĩa quẻ ${q.nameVi} theo truyền thống Chu Dịch, viết lại theo lối phản tư: quẻ mô tả thế cục để bạn tự hỏi đúng câu — không phán số mệnh.`}
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Gieo quẻ', href: '/gieo-que' },
        { label: 'Ý nghĩa 64 quẻ', href: '/gieo-que/y-nghia' },
        { label: q.nameVi },
      ]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-col gap-1.5" aria-label={`Hình quẻ ${q.nameVi}: 6 hào từ trên xuống`}>
              {q.binary.split('').map((bit, i) => (
                <HaoLine key={i} duong={bit === '1'} />
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/80">Cấu trúc quẻ</div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                {up ? (
                  <>
                    <b className="text-foreground">{up.ten}</b> ({up.tuong}) trên ·{' '}
                  </>
                ) : null}
                {down ? (
                  <>
                    <b className="text-foreground">{down.ten}</b> ({down.tuong}) dưới
                  </>
                ) : null}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {q.keyTags.map((k) => (
                  <span key={k} className="rounded-full border border-gold/30 px-2.5 py-0.5 text-xs text-foreground/85">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Tượng quẻ</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{q.tuong}</p>
        </section>

        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Thế cục quẻ này nói gì</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{q.core}</p>
        </section>

        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Ứng xử khôn ngoan trong thế cục này</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{q.advice}</p>
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-heading text-lg font-semibold text-foreground">💞 Tình cảm &amp; quan hệ</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{q.love}</p>
          </section>
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-heading text-lg font-semibold text-foreground">💼 Công việc &amp; tiền bạc</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{q.work}</p>
          </section>
        </div>

        <section className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Câu hỏi để bạn tự soi</h2>
          <ul className="mt-3 space-y-2">
            {q.reflect.map((c) => (
              <li key={c} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
                <span aria-hidden className="text-gold">·</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Quẻ mô tả thế cục, không phán số mệnh — điều có ý nghĩa là cách bạn ứng xử trong thế cục ấy. Không bói toán,
            không tiên đoán.
          </p>
        </section>

        <FaqSection items={faqs} />

        <nav className="flex items-center justify-between gap-3 text-sm" aria-label="Quẻ trước / quẻ sau">
          {prev ? (
            <Link
              href={`/gieo-que/y-nghia/${prev.slug}`}
              className="rounded-md border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
            >
              ← {String(prev.id).padStart(2, '0')} {prev.nameVi}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/gieo-que/y-nghia/${next.slug}`}
              className="rounded-md border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
            >
              {String(next.id).padStart(2, '0')} {next.nameVi} →
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/gieo-que"
            className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Gieo quẻ cho câu hỏi của bạn →
          </Link>
          <Link
            href="/gieo-que/y-nghia"
            className="rounded-md border border-gold/30 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            📖 Xem cả 64 quẻ
          </Link>
        </div>
      </div>

      <JsonLd
        data={[
          webPage({
            url: `/gieo-que/y-nghia/${q.slug}`,
            name: `Quẻ ${q.nameVi} (quẻ số ${q.id}/64) — ý nghĩa & lời khuyên`,
            description: `Ý nghĩa quẻ ${q.nameVi} trong Kinh Dịch: tượng quẻ, thế cục, ứng xử, góc tình cảm – công việc và câu hỏi tự soi.`,
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Gieo quẻ', url: '/gieo-que' },
            { name: 'Ý nghĩa 64 quẻ', url: '/gieo-que/y-nghia' },
            { name: q.nameVi, url: `/gieo-que/y-nghia/${q.slug}` },
          ]),
          faqPage(faqs),
        ]}
      />
    </ToolPageShell>
  );
}
