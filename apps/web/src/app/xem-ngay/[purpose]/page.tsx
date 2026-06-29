import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ActivityChecker } from '@/components/lich-van-nien/ActivityChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { PURPOSES, getPurpose } from '../purposes';

// Fixed set of SEO landing slugs — unknown slugs 404 instead of rendering.
export const dynamicParams = false;

export function generateStaticParams() {
  return PURPOSES.map((p) => ({ purpose: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ purpose: string }>;
}): Promise<Metadata> {
  const { purpose } = await params;
  const p = getPurpose(purpose);
  if (!p) return { title: 'Xem ngày tốt' };
  const url = `https://hieu.asia/xem-ngay/${p.slug}`;
  return {
    title: p.seoTitle,
    description: p.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: p.seoTitle,
      description: p.seoDescription,
      url,
      type: 'website' as const,
    },
  };
}

export default async function XemNgayPurposePage({
  params,
}: {
  params: Promise<{ purpose: string }>;
}) {
  const { purpose } = await params;
  const p = getPurpose(purpose);
  if (!p) notFound();

  return (
    <>
      <JsonLd
        data={[
          webPage({ name: p.seoTitle, description: p.seoDescription, url: `/xem-ngay/${p.slug}` }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xem ngày tốt', url: '/xem-ngay' },
            { name: `Xem ngày ${p.h1Suffix}`, url: `/xem-ngay/${p.slug}` },
          ]),
          faqPage(p.faqs),
        ]}
      />
      <ToolPageShell
        eyebrow={p.eyebrow}
        icon={<span aria-hidden="true">{p.emoji}</span>}
        title={
          <>
            <GoldAccent>Xem ngày</GoldAccent> {p.h1Suffix}
          </>
        }
        description={p.intro}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Xem ngày tốt', href: '/xem-ngay' },
          { label: p.label },
        ]}
      >
        <section className="space-y-8">
          <ActivityChecker defaultActivity={p.activity} />

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
              Yếu tố xét cho ngày {p.h1Suffix}
            </h2>
            <ul className="mt-3 space-y-1.5 pl-5 text-sm text-muted-foreground list-disc">
              {p.considerations.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
              Câu hỏi thường gặp
            </h2>
            <dl className="mt-4 space-y-4">
              {p.faqs.map((f, i) => (
                <div key={i}>
                  <dt className="font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
              Nhận nhắc theo mùa
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source={`xem-ngay-${purpose}`}
                capturedEvent="lead_capture_xem_ngay"
                capturedProps={{ purpose }}
                blurb={`Để lại email, mình sẽ báo bạn khi có nội dung xem ngày ${p.h1Suffix} đầy đủ hơn và các bài xem ngày tốt mới theo mùa. Thi thoảng thôi, không spam.`}
                cta="Nhận nhắc"
              />
            </div>
          </section>

          <nav aria-label="Xem ngày cho việc khác" className="text-sm">
            <span className="text-muted-foreground">Xem ngày cho việc khác: </span>
            {PURPOSES.filter((o) => o.slug !== p.slug).map((o, i, arr) => (
              <span key={o.slug}>
                <Link href={`/xem-ngay/${o.slug}`} className="text-gold hover:underline">
                  {o.label}
                </Link>
                {i < arr.length - 1 ? ', ' : ''}
              </span>
            ))}
          </nav>
        </section>
      </ToolPageShell>
    </>
  );
}
