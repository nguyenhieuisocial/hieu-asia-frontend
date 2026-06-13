import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, faqPage, webPage } from '@/lib/seo/jsonld';
import { LOAI_SO, getLoaiSo } from '@/lib/than-so-hoc-loai-so';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LOAI_SO.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const l = getLoaiSo(slug);
  if (!l) return {};
  const title = `${l.name} trong thần số học là gì? Cách tính và ý nghĩa từng số`;
  const description = `${l.name} (${l.englishName}) tính từ ${l.keyTags[2]}: ${l.whatItReveals} Ý nghĩa từng số 1–9 và master 11/22/33 — viết theo lối tỉnh táo, không bói toán.`;
  const url = `https://hieu.asia/than-so-hoc/cac-loai-so/${l.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'hieu.asia',
      locale: 'vi_VN',
      type: 'article',
    },
  };
}

export default async function LoaiSoPage({ params }: Props) {
  const { slug } = await params;
  const l = getLoaiSo(slug);
  if (!l) notFound();

  const idx = LOAI_SO.findIndex((x) => x.slug === l.slug);
  const prev = idx > 0 ? LOAI_SO[idx - 1] : undefined;
  const next = idx < LOAI_SO.length - 1 ? LOAI_SO[idx + 1] : undefined;

  const numsBase = l.meanings.filter((m) => m.number <= 9);
  const numsMaster = l.meanings.filter((m) => m.number > 9);

  return (
    <ToolPageShell
      eyebrow="THẦN SỐ HỌC · CÁC LOẠI SỐ"
      relatedSlug="/than-so-hoc"
      icon={l.icon}
      title={
        <>
          <GoldAccent>{l.name}</GoldAccent>
        </>
      }
      description={`${l.englishName} — tính từ ${l.keyTags[2]}. ${l.whatItReveals}`}
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Thần số học', href: '/than-so-hoc' },
        { label: 'Các loại số', href: '/than-so-hoc/cac-loai-so' },
        { label: l.name },
      ]}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {l.keyTags.map((k) => (
            <span
              key={k}
              className="rounded-full border border-gold/30 px-2.5 py-0.5 text-xs text-foreground/85"
            >
              {k}
            </span>
          ))}
        </div>

        {/* Tổng quan */}
        <section className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-6">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            {l.name} là gì?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/85">{l.overview}</p>
        </section>

        {/* Cách tính */}
        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Cách tính {l.name}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{l.howToCalc}</p>
          <div className="mt-4 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-xs leading-relaxed text-foreground/80">
            Muốn tính nhanh? Công cụ{' '}
            <Link href="/than-so-hoc" className="text-gold hover:underline">
              thần số học tại đây
            </Link>{' '}
            tự động tính {l.name} và toàn bộ các loại số khác từ ngày sinh và tên của bạn.
          </div>
        </section>

        {/* {l.name} tiết lộ điều gì */}
        <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            {l.name} tiết lộ điều gì?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{l.whatItReveals}</p>
        </section>

        {/* Ý nghĩa từng số — cơ bản */}
        <section>
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Ý nghĩa từng số — 1 đến 9
          </h2>
          <div className="mt-4 space-y-4">
            {numsBase.map((m) => (
              <div
                key={m.number}
                className="rounded-xl border border-border bg-card/40 p-5"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-heading text-2xl font-bold text-gold">{m.number}</span>
                  <span className="font-medium text-foreground">{m.label}</span>
                </div>
                <p className="mt-2 text-xs italic leading-relaxed text-muted-foreground">
                  {m.core}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">{m.expanded}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Số master */}
        {numsMaster.length > 0 && (
          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Số master{' '}
              <span className="text-sm font-normal text-muted-foreground">
                — cường độ cao, bài tập khó hơn
              </span>
            </h2>
            <div className="mt-4 space-y-4">
              {numsMaster.map((m) => (
                <div
                  key={m.number}
                  className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-5"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading text-2xl font-bold text-gold">{m.number}</span>
                    <span className="font-medium text-foreground">{m.label}</span>
                  </div>
                  <p className="mt-2 text-xs italic leading-relaxed text-muted-foreground">
                    {m.core}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">{m.expanded}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lời nhắc không bói toán */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 px-5 py-4 text-sm leading-relaxed text-foreground/80">
          <span className="mr-1.5 text-gold" aria-hidden>✦</span>
          {l.notefooter}
        </div>

        {/* FAQ */}
        {l.faqs.length > 0 && (
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-heading text-xl font-semibold text-foreground">Câu hỏi thường gặp</h2>
            <dl className="mt-4 space-y-4">
              {l.faqs.map((f, i) => (
                <div key={i}>
                  <dt className="font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Nav trước/sau */}
        <nav className="flex items-center justify-between gap-3 text-sm" aria-label="Loại số trước / sau">
          {prev ? (
            <Link
              href={`/than-so-hoc/cac-loai-so/${prev.slug}`}
              className="rounded-md border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
            >
              ← {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/than-so-hoc/cac-loai-so/${next.slug}`}
              className="rounded-md border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
            >
              {next.name} →
            </Link>
          ) : (
            <span />
          )}
        </nav>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/than-so-hoc"
            className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Tính số của bạn →
          </Link>
          <Link
            href="/than-so-hoc/cac-loai-so"
            className="rounded-md border border-gold/30 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            Xem cả 4 loại số
          </Link>
        </div>
      </div>

      <JsonLd
        data={[
          webPage({
            url: `/than-so-hoc/cac-loai-so/${l.slug}`,
            name: `${l.name} trong thần số học là gì? Cách tính và ý nghĩa từng số`,
            description: `${l.name} (${l.englishName}): cách tính, điều tiết lộ và ý nghĩa từng số 1–9 và master 11/22/33.`,
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Thần số học', url: '/than-so-hoc' },
            { name: 'Các loại số', url: '/than-so-hoc/cac-loai-so' },
            { name: l.name, url: `/than-so-hoc/cac-loai-so/${l.slug}` },
          ]),
          ...(l.faqs.length > 0 ? [faqPage(l.faqs)] : []),
        ]}
      />
    </ToolPageShell>
  );
}
