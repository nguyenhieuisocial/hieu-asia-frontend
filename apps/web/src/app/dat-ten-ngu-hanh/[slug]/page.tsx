import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DatTenNguHanhChecker } from '@/components/dat-ten-ngu-hanh/DatTenNguHanhChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
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
  if (!v) return { title: 'Đặt tên con theo ngũ hành' };
  const url = `https://hieu.asia/dat-ten-ngu-hanh/${v.slug}`;
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

export default async function DatTenVariantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = getVariant(slug);
  if (!v) notFound();

  return (
    <>
      <JsonLd
        data={[
          webPage({ name: v.seoTitle, description: v.seoDescription, url: `/dat-ten-ngu-hanh/${v.slug}` }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Đặt tên ngũ hành', url: '/dat-ten-ngu-hanh' },
            { name: v.label, url: `/dat-ten-ngu-hanh/${v.slug}` },
          ]),
          faqPage(v.faqs),
        ]}
      />
      <ToolPageShell
        eyebrow={v.eyebrow}
        icon={<span aria-hidden="true">{v.emoji}</span>}
        title={
          <>
            <GoldAccent>Đặt tên</GoldAccent> {v.h1Suffix}
          </>
        }
        description={v.intro}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Đặt tên ngũ hành', href: '/dat-ten-ngu-hanh' },
          { label: v.label },
        ]}
      >
        <section className="space-y-8">
          <DatTenNguHanhChecker defaultGender={v.defaultGender} />

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Lưu ý khi đặt tên {v.label.toLowerCase()}
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

          <nav aria-label="Đặt tên theo nhu cầu khác" className="text-sm">
            <span className="text-muted-foreground">Xem thêm: </span>
            <Link href="/dat-ten-ngu-hanh" className="text-gold hover:underline">
              Đặt tên theo ngũ hành (tổng quan)
            </Link>
            {VARIANTS.filter((o) => o.slug !== v.slug).map((o) => (
              <span key={o.slug}>
                {', '}
                <Link href={`/dat-ten-ngu-hanh/${o.slug}`} className="text-gold hover:underline">
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
