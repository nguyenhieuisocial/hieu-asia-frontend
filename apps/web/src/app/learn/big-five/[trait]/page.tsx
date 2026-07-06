import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ArrowRight, ArrowUp, ArrowDown, Layers, Scale, Briefcase } from 'lucide-react';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { buildTrait, listTraits, BIG_FIVE_SLUGS, type TraitRef } from '@/lib/big-five-trait-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return BIG_FIVE_SLUGS.map((trait) => ({ trait }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trait: string }>;
}): Promise<Metadata> {
  const { trait } = await params;
  const d = buildTrait(trait);
  if (!d) return { title: 'Big Five' };
  const url = `https://hieu.asia/learn/big-five/${d.slug}`;
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

function TraitChip({ t }: { t: TraitRef }) {
  return (
    <Link
      href={`/learn/big-five/${t.slug}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
    >
      <span className="font-heading text-sm font-semibold text-gold-700">{t.letter}</span>
      <span className="text-muted-foreground">{t.vi}</span>
    </Link>
  );
}

export default async function BigFiveTraitPage({
  params,
}: {
  params: Promise<{ trait: string }>;
}) {
  const { trait } = await params;
  const d = buildTrait(trait);
  if (!d) notFound();

  const others = listTraits().filter((t) => t.slug !== d.slug);

  const JSONLD = [
    article({
      headline: d.seoTitle,
      description: d.seoDescription,
      url: `/learn/big-five/${d.slug}`,
      image: '/og-image.jpg',
      datePublished: '2026-06-22',
      dateModified: '2026-06-22',
      type: 'Article',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Học huyền học', url: '/learn' },
      { name: 'Big Five', url: '/learn/big-five' },
      { name: d.vi, url: `/learn/big-five/${d.slug}` },
    ]),
    faqPage(d.faqs),
  ];

  return (
    <>
      <JsonLd data={JSONLD} />

      {/* Hero */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="mb-5 text-xs text-muted-foreground">
          <Link href="/learn" className="hover:text-gold">
            Học huyền học
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/learn/big-five" className="hover:text-gold">
            Big Five
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground/70">{d.vi}</span>
        </nav>
        <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
          Big Five · OCEAN · Chiều {d.letter}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
          {d.vi}
        </h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {d.en}
        </p>
        <p className="mt-4 text-base leading-relaxed text-foreground/80 sm:text-lg">{d.tagline}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/big-five">Làm trắc nghiệm Big Five</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/learn/big-five">Cả 5 chiều</Link>
          </Button>
        </div>
      </section>

      {/* Tổng quan */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-3 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          {d.vi} đo điều gì?
        </h2>
        <p className="text-base leading-relaxed text-foreground/85">{d.overview}</p>
      </section>

      {/* Hai đầu của dải: Cao / Thấp */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-3 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Hai đầu của dải
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="border-emerald-500/20 bg-emerald-500/[0.04]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-emerald-300">
                <ArrowUp className="h-4 w-4" aria-hidden /> Điểm cao
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm leading-relaxed text-foreground/80">
                {d.highProfile.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden className="text-emerald-400">
                      •
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{d.highContext}</p>
            </CardContent>
          </Card>
          <Card className="border-sky-500/20 bg-sky-500/[0.04]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-sky-300">
                <ArrowDown className="h-4 w-4" aria-hidden /> Điểm thấp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm leading-relaxed text-foreground/80">
                {d.lowProfile.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden className="text-sky-400">
                      •
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{d.lowContext}</p>
            </CardContent>
          </Card>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Đây là một <strong>dải liên tục</strong> — hầu hết mọi người nằm đâu đó ở giữa. Không đầu
          nào tốt hay xấu hơn; mỗi đầu là một thiên hướng hợp với những bối cảnh khác nhau.
        </p>
      </section>

      {/* Facet */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          <Layers className="h-5 w-5 text-gold" aria-hidden /> Các khía cạnh (facet)
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Mỗi chiều lớn gồm nhiều facet nhỏ. Hai người cùng điểm tổng vẫn có thể khác nhau ở từng
          facet — đó là lý do Big Five mô tả con người tinh tế hơn các bài "đóng hộp".
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {d.facets.map((f) => (
            <div
              key={f.label}
              className="rounded-lg border border-border bg-card/40 px-4 py-3 text-sm"
            >
              <span className="font-medium text-foreground">{f.label}</span>
              <span className="text-muted-foreground"> — {f.gloss}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ứng dụng công việc */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          <Briefcase className="h-5 w-5 text-sky-400" aria-hidden /> {d.vi} trong công việc
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <p className="rounded-lg border border-border bg-card/40 px-4 py-3 text-sm leading-relaxed text-foreground/85">
            <span className="font-medium text-emerald-300">Thiên về cao · </span>
            {d.highContext}
          </p>
          <p className="rounded-lg border border-border bg-card/40 px-4 py-3 text-sm leading-relaxed text-foreground/85">
            <span className="font-medium text-sky-300">Thiên về thấp · </span>
            {d.lowContext}
          </p>
        </div>
      </section>

      {/* Cân bằng */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <Card className="border-gold/25 bg-gold/[0.04]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-heading text-base text-gold-700">
              <Scale className="h-4 w-4 text-gold" aria-hidden /> Điểm cân bằng
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-foreground/80">
            {d.balanceNote}
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
            Nhận bài về Big Five &amp; hiểu mình
          </h2>
          <OccasionLeadCapture
            source={`big-five-${d.slug}`}
            capturedEvent="lead_capture_big_five_trait"
            capturedProps={{ trait: d.slug }}
            blurb={`Để lại email, thi thoảng chúng tôi gửi bài giúp bạn hiểu sâu hơn về chiều ${d.vi}, năm chiều Big Five và cách áp dụng vào đời sống. Không spam.`}
            cta="Nhận bài"
          />
        </div>
      </section>

      {/* CTA → trắc nghiệm */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Bạn đứng đâu trên dải {d.vi}?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
            Trang này mô tả chiều {d.vi} ({d.en}). Để xem điểm của riêng bạn trên cả năm chiều, hãy
            làm bộ trắc nghiệm Big Five khoảng 4 phút — kết quả ngay, miễn phí, có nền khoa học.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/big-five">Làm trắc nghiệm Big Five</Link>
            </Button>
            <Link
              href="/learn/big-five"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
            >
              Tìm hiểu cả 5 chiều <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 chiều còn lại */}
      <section className="relative mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Các chiều khác</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((t) => (
            <TraitChip key={t.slug} t={t} />
          ))}
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Big Five (OCEAN) là mô hình tính cách có nền thực nghiệm vững nhất — đo xu hướng trên dải
          liên tục, không phải nhãn cố định hay lời phán số mệnh; điểm có thể đổi theo giai đoạn.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-12">
        <RelatedTools
          links={[
            { href: '/big-five', label: 'Trắc nghiệm Big Five' },
            { href: '/learn/big-five', label: 'Tìm hiểu Big Five' },
            { href: '/mbti', label: 'Trắc nghiệm MBTI' },
          ]}
        />
      </div>

      <StickyMobileCta href="/big-five" label="Làm trắc nghiệm" trackId={`big-five-${d.slug}`} />
    </>
  );
}
