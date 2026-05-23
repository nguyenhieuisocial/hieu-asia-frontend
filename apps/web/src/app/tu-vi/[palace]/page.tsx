import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@hieu-asia/ui';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { PALACES_CONTENT, findPalaceContent } from '@/lib/tuvi-content';

export function generateStaticParams() {
  return PALACES_CONTENT.map((p) => ({ palace: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ palace: string }> },
): Promise<Metadata> {
  const { palace } = await params;
  const data = findPalaceContent(palace);
  if (!data) return {};
  return {
    title: `Cung ${data.name} là gì? Cách luận trong Tử Vi Đẩu Số`,
    description: `${data.overview.slice(0, 155)}`,
    alternates: { canonical: `https://hieu.asia/tu-vi/${data.slug}` },
    openGraph: {
      title: `Cung ${data.name}`,
      description: data.overview.slice(0, 200),
      url: `https://hieu.asia/tu-vi/${data.slug}`,
      type: 'article',
    },
  };
}

export default async function PalacePage({
  params,
}: {
  params: Promise<{ palace: string }>;
}) {
  const { palace } = await params;
  const data = findPalaceContent(palace);
  if (!data) notFound();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
      { '@type': 'ListItem', position: 2, name: 'Tử Vi', item: 'https://hieu.asia/tu-vi' },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Cung ${data.name}`,
        item: `https://hieu.asia/tu-vi/${data.slug}`,
      },
    ],
  };

  const faqJsonLd = data.faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <ChevronRight className="mx-1 h-3 w-3" aria-hidden />
            <Link href="/tu-vi" className="hover:text-gold">
              Tử Vi
            </Link>
            <ChevronRight className="mx-1 h-3 w-3" aria-hidden />
            <span className="text-muted-foreground">Cung {data.name}</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            {data.fullName} · {data.domain}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Cung {data.name} là gì?
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">{data.overview}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/onboarding">
              <Button size="lg">Lập lá số xem cung {data.name} của tôi</Button>
            </Link>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <Card className="border-border bg-card/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Cung {data.name} đại diện gì
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
                {data.whatItRepresents.map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gold">→</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <Card className="border-border bg-card/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Cách đọc cung {data.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
                {data.howToRead.map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gold/80">{i + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <Card className="border-border bg-card/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Tam phương tứ chính của cung {data.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Trong Tử Vi, không cung nào được luận một mình. Cung {data.name} luôn đọc
                cùng nhóm tam phương tứ chính dưới đây — một bộ {data.trigon.length} cung
                liên quan tạo nên ngữ cảnh để luận sâu.
              </p>
              <div className="flex flex-wrap gap-2">
                {data.trigon.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1 font-mono text-xs text-gold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <Card className="border-border bg-card/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground sm:text-2xl">
                Sao thường gặp tại cung {data.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.commonStars.map((s) => {
                  const slug = s
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[̀-ͯ]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
                  return (
                    <Link
                      key={s}
                      href={`/tu-vi/sao/${slug}`}
                      className="rounded-full border border-border bg-card/40 px-3 py-1 font-mono text-xs text-foreground/80 transition-colors hover:border-gold/50 hover:text-gold"
                    >
                      {s}
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {data.faq.length > 0 && (
          <section className="relative mx-auto max-w-3xl px-6 pb-12">
            <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Câu hỏi thường gặp
            </h2>
            <div className="space-y-3">
              {data.faq.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-lg border border-border bg-card/40 p-4 open:border-gold/30 open:bg-gold/[0.03]"
                >
                  <summary className="cursor-pointer list-none text-sm font-semibold text-foreground marker:hidden sm:text-base">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Xem cung {data.name} của bạn — miễn phí
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Bài viết này là kiến thức nền. Để xem cung {data.name} CỦA BẠN có sao nào,
              tam phương tứ chính ra sao, đại vận hiện tại thế nào — lập lá số (mất 2
              phút, không cần đăng ký).
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/onboarding">
                <Button size="lg">Lập lá số miễn phí</Button>
              </Link>
              <Link
                href="/tu-vi"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Quay về cẩm nang Tử Vi
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
