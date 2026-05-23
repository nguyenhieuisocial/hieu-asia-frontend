import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@hieu-asia/ui';
import { ChevronRight, ArrowRight, Sparkles, ShieldAlert } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { ALL_STARS_CONTENT, findStarContent } from '@/lib/tuvi-content';

export function generateStaticParams() {
  return ALL_STARS_CONTENT.map((s) => ({ star: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ star: string }> },
): Promise<Metadata> {
  const { star } = await params;
  const data = findStarContent(star);
  if (!data) return {};
  return {
    title: `Sao ${data.name} trong Tử Vi: ý nghĩa, vị trí và cách luận`,
    description: `${data.archetype} Ý nghĩa khi đứng tại cung Mệnh, Quan Lộc, Tài Bạch — hieu.asia`,
    alternates: { canonical: `https://hieu.asia/tu-vi/sao/${data.slug}` },
    openGraph: {
      title: `Sao ${data.name}`,
      description: data.archetype,
      url: `https://hieu.asia/tu-vi/sao/${data.slug}`,
      type: 'article',
    },
  };
}

export default async function StarPage({
  params,
}: {
  params: Promise<{ star: string }>;
}) {
  const { star } = await params;
  const data = findStarContent(star);
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
        name: `Sao ${data.name}`,
        item: `https://hieu.asia/tu-vi/sao/${data.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <ChevronRight className="mx-1 h-3 w-3" aria-hidden />
            <Link href="/tu-vi" className="hover:text-gold">
              Tử Vi
            </Link>
            <ChevronRight className="mx-1 h-3 w-3" aria-hidden />
            <span className="text-muted-foreground">Sao {data.name}</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            {data.category === 'major' ? 'Chính tinh' : 'Phụ tinh'}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Sao {data.name}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            {data.archetype}
          </p>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-jade/30 bg-jade/[0.04]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-jade-50">
                  <Sparkles className="h-4 w-4" aria-hidden /> Điểm mạnh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm leading-relaxed text-foreground/80">
                  {data.positive.map((p, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-jade-50">+</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-amber-700/40 bg-amber-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-amber-200">
                  <ShieldAlert className="h-4 w-4" aria-hidden /> Điểm cần chú ý
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm leading-relaxed text-foreground/80">
                  {data.caution.map((p, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-amber-300">!</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Sao {data.name} tại các cung
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Cùng một sao đứng ở cung khác nhau cho nghĩa khác nhau. Đây là cách đọc cơ
            bản — luận đầy đủ cần xét cát/sát tinh đi kèm, tứ hoá và đại vận.
          </p>
          <div className="space-y-3">
            {data.byPalace.map((p, i) => (
              <Card key={i} className="border-border bg-card/40">
                <CardContent className="pt-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">
                    Cung {p.palace}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85 sm:text-base">
                    {p.reading}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {data.withMutagen && data.withMutagen.length > 0 && (
          <section className="relative mx-auto max-w-3xl px-6 pb-12">
            <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Khi gặp tứ hoá
            </h2>
            <div className="space-y-3">
              {data.withMutagen.map((m, i) => (
                <Card key={i} className="border-gold/20 bg-gold/[0.03]">
                  <CardContent className="pt-5">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
                      Hoá {m.type}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/85 sm:text-base">
                      {m.reading}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Xem sao {data.name} có nằm trong lá số của bạn không
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Lập lá số để xem {data.name} đứng tại cung nào trong 12 cung của bạn, có
              tứ hoá không, đại vận đến hỗ trợ hay xung khắc.
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
