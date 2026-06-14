/**
 * /community/cases/[slug] — single case study detail.
 *
 * Renders 5-section narrative: persona, insight, decision, reflection,
 * related methodology pages.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb } from '@/lib/seo/jsonld';
import { getCaseStudy, listCaseStudies, ILLUSTRATIVE_LABEL } from '@/lib/case-studies';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return listCaseStudies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) return { title: 'Case study không tìm thấy' };
  return {
    title: `${c.title} — case study`,
    description: c.excerpt,
    alternates: { canonical: `https://hieu.asia/community/cases/${c.slug}` },
    openGraph: {
      title: c.title,
      description: c.excerpt,
      url: `https://hieu.asia/community/cases/${c.slug}`,
      type: 'article',
      publishedTime: c.publishedAt,
      images: OG_DEFAULT_IMAGES,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) notFound();

  return (
    <>
      <SiteNav />
      <JsonLd
        data={[
          article({
            headline: c.title,
            description: c.excerpt,
            url: `/community/cases/${c.slug}`,
            datePublished: c.publishedAt,
            type: 'Article',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Cộng đồng', url: '/community' },
            { name: 'Case studies', url: '/community/cases' },
            { name: c.title, url: `/community/cases/${c.slug}` },
          ]),
        ]}
      />
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-16">
        <article className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
          <Link
            href="/community/cases"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Tất cả case studies
          </Link>

          <header className="mt-8">
            <p className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-medium text-gold/90">
              {c.illustrativeLabel}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-mono uppercase tracking-[0.2em] text-gold/85">
                {c.year}
              </span>
              <span aria-hidden>·</span>
              <span>{c.persona}</span>
            </div>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              {c.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-foreground/85 sm:text-lg">
              {c.excerpt}
            </p>
          </header>

          <div className="my-8 h-px bg-muted/40" />

          <Section title="Lá số nói gì">
            <p>{c.insight}</p>
          </Section>

          <Section title="Quyết định">
            <p>{c.decision}</p>
          </Section>

          <Section title="Chiêm nghiệm (tình huống minh hoạ)">
            <blockquote className="border-l-2 border-gold/40 pl-5 italic text-foreground/85">
              {c.reflection}
            </blockquote>
          </Section>

          <Section title="Methodology liên quan">
            <ul className="space-y-2">
              {c.related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="inline-flex items-center gap-1.5 text-sm text-gold/90 transition-colors hover:text-gold"
                  >
                    → {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>

          <aside className="mt-12 rounded-2xl border border-border bg-card/40 p-6">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold/80" aria-hidden="true" />
              <div className="text-sm leading-relaxed text-muted-foreground">
                <p className="font-medium text-foreground/90">{ILLUSTRATIVE_LABEL}</p>
                <p className="mt-1">
                  Đây là một kịch bản tổng hợp do chúng tôi dựng để minh hoạ quy
                  trình ra quyết định — không phải hồ sơ của một người dùng có
                  thật. Nhân vật, hoàn cảnh và lá số đều là ví dụ, không gắn với
                  bất kỳ cá nhân nào. Đọc thêm{' '}
                  <Link
                    href="/privacy"
                    className="text-gold/90 underline-offset-2 hover:text-gold hover:underline"
                  >
                    chính sách riêng tư
                  </Link>
                  .
                </p>
              </div>
            </div>
          </aside>

          <div className="mt-8 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/8 via-background to-purple/15 p-6 text-center">
            <p className="font-heading text-lg text-foreground">
              Bạn đang ở một ngã rẽ tương tự?
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Bắt đầu bằng Decision Brief — viết câu hỏi của bạn, lá số sẽ giúp
              khung hoá lại.
            </p>
            <Link
              href="/decisions/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-medium text-ink transition-all hover:bg-gold-light"
            >
              Tạo Decision Brief
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
        {title}
      </h2>
      <div className="mt-3 text-base leading-relaxed text-foreground/85">
        {children}
      </div>
    </section>
  );
}
