import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ArrowRight, Heart, Sparkles, Users } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { listCung, CUNG_SLUGS } from '@/lib/cung-hoang-dao-data';
import { buildPair, ALL_PAIRS, pairSlug, RELATION_SHORT } from '@/lib/cung-hoang-dao-hop-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_PAIRS.map((pair) => ({ pair }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const d = buildPair(pair);
  if (!d) return { title: 'Độ hợp cung hoàng đạo' };
  const url = `https://hieu.asia/cung-hoang-dao/hop/${pair}`;
  return {
    title: d.seoTitle,
    description: d.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: d.seoTitle,
      description: d.seoDescription,
      url,
      type: 'article',
      locale: 'vi_VN',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: d.seoTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: d.seoTitle,
      description: d.seoDescription,
      images: [{ url: '/og-image.jpg', alt: d.seoTitle }],
    },
  };
}

const REL_COLOR: Record<string, string> = {
  'same-sign': 'text-sky-300 border-sky-500/40 bg-sky-500/[0.06]',
  'same-element': 'text-emerald-300 border-emerald-500/40 bg-emerald-500/[0.06]',
  support: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/[0.06]',
  opposite: 'text-amber-300 border-amber-500/40 bg-amber-500/[0.06]',
  different: 'text-foreground/80 border-border bg-card/40',
};

export default async function PairPage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const d = buildPair(pair);
  if (!d) notFound();

  const { a, b } = d;
  const all = listCung();
  // "A hợp với các cung khác" — liên kết nội bộ.
  const otherPairs = all
    .filter((s) => s.slug !== a.slug)
    .map((s) => ({
      name: s.name,
      symbol: s.symbol,
      slug: pairSlug(a.z.idx, CUNG_SLUGS.indexOf(s.slug as (typeof CUNG_SLUGS)[number])),
    }));

  const JSONLD = [
    article({
      headline: d.seoTitle,
      description: d.seoDescription,
      url: `/cung-hoang-dao/hop/${pair}`,
      image: '/og-image.jpg',
      datePublished: '2026-06-22',
      dateModified: '2026-06-22',
      type: 'Article',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Cung hoàng đạo', url: '/cung-hoang-dao' },
      { name: 'Độ hợp', url: '/cung-hoang-dao/hop' },
      { name: `${a.z.name} & ${b.z.name}`, url: `/cung-hoang-dao/hop/${pair}` },
    ]),
    faqPage(d.faqs),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <JsonLd data={JSONLD} />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        {/* Hero */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-6 sm:pt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
            Độ hợp cung hoàng đạo
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            <span aria-hidden className="mr-1 text-gold">
              {a.z.symbol}
            </span>
            Cung {a.z.name} và {b.z.name}
            <span aria-hidden className="ml-1 text-gold">
              {b.z.symbol}
            </span>{' '}
            có hợp nhau không?
          </h1>
          <div
            className={`mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${REL_COLOR[d.relation]}`}
          >
            <Sparkles className="h-4 w-4" aria-hidden /> {d.relLabel}
          </div>
          <p className="mt-4 text-base leading-relaxed text-foreground/85">{d.relBlurb}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/ban-do-sao">Xem bản đồ sao của tôi</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/cung-hoang-dao/hop">Tra cặp khác</Link>
            </Button>
          </div>
        </section>

        {/* Hai cung trong mối quan hệ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="grid gap-3 sm:grid-cols-2">
            {[a, b].map((s) => (
              <Card key={s.slug} className="border-border bg-card/40">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                    <Heart className="h-4 w-4 text-rose-400" aria-hidden /> {s.z.symbol} {s.z.name}{' '}
                    trong tình cảm
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                  <p>{s.extra.love}</p>
                  <p className="text-foreground/75">
                    <span className="text-foreground/90">Khí chất:</span> {s.extra.tagline} (nguyên tố{' '}
                    {s.z.element}, {s.z.quality})
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-3 border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Users className="h-4 w-4 text-gold" aria-hidden /> Khi hai người ở bên nhau
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {d.relBlurb} Hãy xem đây là gợi ý để hiểu nhau hơn — điều quan trọng nhất vẫn là cách
              hai người lắng nghe và tôn trọng nhau, không phải cung nào "hợp" hay "khắc".
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-3">
            {d.faqs.map((f) => (
              <Card key={f.q} className="border-border bg-card/40">
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-base text-foreground">{f.q}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bắt email */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-border bg-card/40 p-6">
            <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
              Nhận bài về độ hợp & chiêm tinh
            </h2>
            <OccasionLeadCapture
              source={`cung-hop-${pair}`}
              capturedEvent="lead_capture_cung_hop"
              capturedProps={{ pair }}
              blurb={`Để lại email, thi thoảng chúng tôi gửi bài giúp bạn hiểu sâu hơn về độ hợp cung hoàng đạo, bản đồ sao đôi và cách áp dụng vào mối quan hệ. Không spam.`}
              cta="Nhận bài"
            />
          </div>
        </section>

        {/* CTA → bản đồ sao đôi */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Độ hợp thật cần cả hai bản đồ sao
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              So cung Mặt Trời chỉ là bước đầu. Độ hợp thật của hai người phụ thuộc cả cung Mọc, Mặt
              Trăng và vị trí các hành tinh của từng người — vốn cần giờ và nơi sinh. Lập bản đồ sao
              cho cả hai để xem bức tranh đầy đủ, miễn phí.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/ban-do-sao">Lập bản đồ sao miễn phí</Link>
              </Button>
              <Link
                href={`/cung-hoang-dao/${a.slug}`}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Tìm hiểu cung {a.z.name} <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* A hợp với các cung khác */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Cung {a.z.name} hợp với các cung khác
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherPairs.map((p) => (
              <Link
                key={p.slug}
                href={`/cung-hoang-dao/hop/${p.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
              >
                <span aria-hidden>{p.symbol}</span> {a.z.name} &amp; {p.name}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            hieu.asia phân loại độ hợp theo khung nguyên tố của chiêm tinh ({RELATION_SHORT['same-element']},{' '}
            {RELATION_SHORT.support}, {RELATION_SHORT.opposite}, {RELATION_SHORT.different}) để bạn
            tham khảo. Đây không phải lời phán về mối quan hệ.
          </p>
        </section>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools
            links={[
              { href: '/cung-hoang-dao/hop', label: 'Tra độ hợp 12 cung' },
              { href: `/cung-hoang-dao/${a.slug}`, label: `Cung ${a.z.name}` },
              { href: `/cung-hoang-dao/${b.slug}`, label: `Cung ${b.z.name}` },
              { href: '/ban-do-sao', label: 'Bản đồ sao đầy đủ' },
            ]}
          />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/ban-do-sao" trackId={`cung-hop-${pair}`} />
    </div>
  );
}
