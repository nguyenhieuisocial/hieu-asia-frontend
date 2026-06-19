import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SinhConChecker } from '@/components/sinh-con/SinhConChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { ELEMENTS } from '@/lib/dat-ten-ngu-hanh';
import { yearProfile, zodiacRelationTable } from '@/lib/sinh-con';
import { VARIANTS, getVariant } from '../variants';

// Fixed set of SEO landing slugs — unknown slugs 404 instead of rendering.
export const dynamicParams = false;

export function generateStaticParams() {
  return VARIANTS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = getVariant(slug);
  if (!v) return { title: 'Sinh con theo năm' };
  const url = `https://hieu.asia/sinh-con/${v.slug}`;
  return {
    title: v.seoTitle,
    description: v.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: v.seoTitle,
      description: v.seoDescription,
      url,
      type: 'website' as const,
    },
  };
}

export default async function SinhConVariantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = getVariant(slug);
  if (!v) notFound();

  const year = v.year ? yearProfile(v.year) : null;
  const table = v.year ? zodiacRelationTable(v.year) : [];

  return (
    <>
      <JsonLd
        data={[
          webPage({ name: v.seoTitle, description: v.seoDescription, url: `/sinh-con/${v.slug}` }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Sinh con theo năm', url: '/sinh-con' },
            { name: v.label, url: `/sinh-con/${v.slug}` },
          ]),
          faqPage(v.faqs),
        ]}
      />
      <ToolPageShell
        eyebrow={v.eyebrow}
        icon={<span aria-hidden="true">{v.emoji}</span>}
        title={
          <>
            <GoldAccent>Sinh con</GoldAccent> {v.h1Suffix}
          </>
        }
        description={v.intro}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Sinh con theo năm', href: '/sinh-con' },
          { label: v.label },
        ]}
      >
        <section className="space-y-8">
          <SinhConChecker defaultYear={v.defaultYear} />

          {year && (
            <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
                Bé sinh năm {year.year} — {year.canChi}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Bé tuổi <strong className="text-foreground">{year.zodiac.ten}</strong>{' '}
                <span aria-hidden="true">{year.zodiac.emoji}</span>, mệnh{' '}
                <strong className="text-gold">
                  {ELEMENTS[year.element].name} — {year.napAmName}
                </strong>
                . {year.zodiac.blurb}
              </p>
            </section>
          )}

          {table.length > 0 && year && (
            <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
                Bố mẹ 12 con giáp × bé tuổi {year.zodiac.ten} ({year.year})
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Đối chiếu theo quan niệm Can Chi — nhóm "lưu ý" chỉ là lời nhắc dung hoà, không phải
                điềm xấu.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {table.map(({ zodiac, copy }) => (
                  <div key={zodiac.slug} className="flex items-baseline gap-2 rounded-md border border-border bg-background/40 px-3 py-2 text-sm">
                    <span className="shrink-0 font-medium text-foreground">
                      <span aria-hidden="true">{zodiac.emoji}</span> {zodiac.ten}
                    </span>
                    <span
                      className={
                        copy.tone === 'hop'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : copy.tone === 'luu-y'
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-muted-foreground'
                      }
                    >
                      {copy.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Những điều nên biết
            </h2>
            <ul className="mt-3 space-y-1.5 pl-5 text-sm text-muted-foreground list-disc">
              {v.considerations.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Câu hỏi thường gặp
            </h2>
            <dl className="mt-4 space-y-4">
              {v.faqs.map((f, i) => (
                <div key={i}>
                  <dt className="font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Nhận nhắc theo mùa
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source={`sinh-con-${slug}`}
                capturedEvent="lead_capture_sinh_con"
                capturedProps={{ slug }}
                blurb="Để lại email, chúng tôi sẽ báo bạn khi có bản đầy đủ cùng nội dung mới về năm và ngày tốt sinh con theo mùa. Thi thoảng thôi, không spam."
                cta="Nhận nhắc"
              />
            </div>
          </section>

          <nav aria-label="Sinh con theo nhu cầu khác" className="text-sm">
            <span className="text-muted-foreground">Xem thêm: </span>
            <Link href="/sinh-con" className="text-gold hover:underline">
              Sinh con theo năm (tổng quan)
            </Link>
            {VARIANTS.filter((o) => o.slug !== v.slug).map((o) => (
              <span key={o.slug}>
                {', '}
                <Link href={`/sinh-con/${o.slug}`} className="text-gold hover:underline">
                  {o.label}
                </Link>
              </span>
            ))}
          </nav>
        </section>
      </ToolPageShell>
    </>
  );
}
