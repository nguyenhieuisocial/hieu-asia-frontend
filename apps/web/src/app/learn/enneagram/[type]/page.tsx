import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import {
  ArrowRight,
  Sparkles,
  Compass,
  TrendingUp,
  Heart,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import {
  buildType,
  listTypes,
  ENNEAGRAM_SLUGS,
  type TypeRef,
} from '@/lib/enneagram-type-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return ENNEAGRAM_SLUGS.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const d = buildType(type);
  if (!d) return { title: 'Enneagram' };
  const url = `https://hieu.asia/learn/enneagram/${type}`;
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

function TypeChip({ t }: { t: TypeRef }) {
  return (
    <Link
      href={`/learn/enneagram/${t.slug}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
    >
      <span
        aria-hidden="true"
        className="flex h-5 w-5 items-center justify-center rounded-full border border-gold/40 font-heading text-[13px] text-gold-700"
      >
        {t.n}
      </span>
      {t.name}
    </Link>
  );
}

export default async function EnneagramTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const d = buildType(type);
  if (!d) notFound();

  const { n, meta } = d;
  const others = listTypes().filter((t) => t.n !== n);

  const JSONLD = [
    article({
      headline: d.seoTitle,
      description: d.seoDescription,
      url: `/learn/enneagram/${type}`,
      image: '/og-image.jpg',
      datePublished: '2026-06-22',
      dateModified: '2026-06-22',
      type: 'Article',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Học huyền học', url: '/learn' },
      { name: 'Enneagram', url: '/learn/enneagram' },
      { name: `Nhóm ${n} — ${meta.name}`, url: `/learn/enneagram/${type}` },
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
          <Link href="/learn/enneagram" className="hover:text-gold">
            Enneagram
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground/70">Nhóm {n}</span>
        </nav>
        <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
          Enneagram · Trung tâm {meta.center} · Nhóm {n}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
          <span aria-hidden="true" className="mr-3 text-gold">
            {n}
          </span>
          {meta.name}
        </h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {meta.nick}
        </p>
        <p className="mt-4 text-base leading-relaxed text-foreground/80 sm:text-lg">
          {meta.tagline}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/enneagram">Làm trắc nghiệm Enneagram</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/learn/enneagram">Cả 9 nhóm &amp; 3 trung tâm</Link>
          </Button>
        </div>
      </section>

      {/* Thẻ dữ kiện */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Sparkles className="h-4 w-4 text-gold" aria-hidden /> Trung tâm
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {meta.center}
              <span className="block text-xs text-muted-foreground/80">
                cùng nhóm {d.centerMates.map((t) => t.n).join(' · ')}
              </span>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Compass className="h-4 w-4 text-gold" aria-hidden /> Cánh (wing)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {n}w{d.wingLeft.n} hoặc {n}w{d.wingRight.n}
              <span className="block text-xs text-muted-foreground/80">
                nghiêng về {d.wingLeft.name} hoặc {d.wingRight.name}
              </span>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Heart className="h-4 w-4 text-gold" aria-hidden /> Cốt lõi
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              Khao khát &amp; nỗi sợ là động cơ sâu nhất của nhóm {n}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Động lực: khao khát & nỗi sợ */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-3 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Nhóm {n} là người thế nào?
        </h2>
        <p className="text-base leading-relaxed text-foreground/85">{meta.tagline}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base text-emerald-300">
                Khao khát cốt lõi
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {meta.desire}
            </CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base text-rose-300">Nỗi sợ nền tảng</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {meta.fear}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Điểm mạnh + Hướng phát triển */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <TrendingUp className="h-4 w-4 text-emerald-400" aria-hidden /> Điểm mạnh nổi bật
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-foreground/80">
              {meta.strengths}
            </CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Compass className="h-4 w-4 text-amber-400" aria-hidden /> Hướng phát triển
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-foreground/80">
              {meta.growth}
            </CardContent>
          </Card>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Điểm mạnh và hướng phát triển là <strong>xu hướng</strong> của nhóm {n}, không phải lời
          phán cố định. Mỗi người đều có thể rèn giũa theo hướng mình muốn.
        </p>
      </section>

      {/* Khi tốt nhất / khi căng thẳng */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="border-emerald-500/20 bg-emerald-500/[0.04]">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base text-emerald-300">
                Khi ở trạng thái tốt nhất
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-foreground/80">
              {meta.atBest}
            </CardContent>
          </Card>
          <Card className="border-amber-500/20 bg-amber-500/[0.04]">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base text-amber-300">Khi căng thẳng</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-foreground/80">
              {meta.underStress}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mũi tên phát triển & áp lực */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Mũi tên phát triển &amp; áp lực
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Theo Riso–Hudson, mỗi nhóm nối với hai nhóm khác: một hướng phát triển (khi an toàn,
          trưởng thành) và một hướng áp lực (khi căng thẳng).
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={`/learn/enneagram/${d.growthArrow.slug}`}
            className="group rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-4 transition hover:border-emerald-400/50"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
              <ArrowUpRight className="h-4 w-4" aria-hidden /> Khi phát triển → hấp thụ nét tốt của
            </div>
            <p className="mt-1 font-heading text-base text-foreground group-hover:text-gold">
              Nhóm {d.growthArrow.n} — {d.growthArrow.name}
            </p>
          </Link>
          <Link
            href={`/learn/enneagram/${d.stressArrow.slug}`}
            className="group rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-4 transition hover:border-amber-400/50"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-amber-300">
              <ArrowDownRight className="h-4 w-4" aria-hidden /> Khi căng thẳng → ngả sang mặt kém của
            </div>
            <p className="mt-1 font-heading text-base text-foreground group-hover:text-gold">
              Nhóm {d.stressArrow.n} — {d.stressArrow.name}
            </p>
          </Link>
        </div>
      </section>

      {/* Cánh (wing) */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Hai cánh của nhóm {n}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Cánh là nhóm liền kề mà bạn nghiêng về, tạo nên sắc thái riêng cho hai người cùng nhóm {n}.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/learn/enneagram/${d.wingLeft.slug}`}
            className="group rounded-lg border border-border bg-card/40 px-4 py-3 transition hover:border-gold/40"
          >
            <span className="font-heading text-base text-foreground group-hover:text-gold">
              {n}w{d.wingLeft.n}
            </span>
            <span className="ml-2 text-sm text-muted-foreground">pha nét {d.wingLeft.name}</span>
          </Link>
          <Link
            href={`/learn/enneagram/${d.wingRight.slug}`}
            className="group rounded-lg border border-border bg-card/40 px-4 py-3 transition hover:border-gold/40"
          >
            <span className="font-heading text-base text-foreground group-hover:text-gold">
              {n}w{d.wingRight.n}
            </span>
            <span className="ml-2 text-sm text-muted-foreground">pha nét {d.wingRight.name}</span>
          </Link>
        </div>
      </section>

      {/* Công việc */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          <Briefcase className="h-5 w-5 text-gold" aria-hidden /> Nhóm {n} trong công việc
        </h2>
        <p className="text-base leading-relaxed text-foreground/85">{d.workStyle}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Đây là xu hướng tham khảo theo khung Enneagram, không phải giới hạn nghề nghiệp.
        </p>
      </section>

      {/* Cùng trung tâm */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
          Cùng trung tâm {meta.center}
        </h2>
        <div className="flex flex-wrap gap-2">
          {d.centerMates.map((t) => (
            <TypeChip key={t.slug} t={t} />
          ))}
        </div>
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
            Nhận bài về Enneagram &amp; hiểu mình
          </h2>
          <OccasionLeadCapture
            source={`enneagram-type-${n}`}
            capturedEvent="lead_capture_enneagram_type"
            capturedProps={{ type: String(n) }}
            blurb={`Để lại email, thi thoảng chúng tôi gửi bài giúp bạn hiểu sâu hơn về nhóm ${n}, các nhóm Enneagram và cách áp dụng vào đời sống. Không spam.`}
            cta="Nhận bài"
          />
        </div>
      </section>

      {/* CTA → trắc nghiệm */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Bạn có phải nhóm {n} không?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
            Trang này mô tả nhóm {n} ({meta.name}). Để biết nhóm chính của riêng bạn cùng cánh
            (wing), hãy làm bộ trắc nghiệm 36 câu — kết quả ngay, miễn phí, kèm luận giải về động lực,
            điểm mạnh và hướng phát triển của bạn.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/enneagram">Làm trắc nghiệm Enneagram</Link>
            </Button>
            <Link
              href="/learn/enneagram"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
            >
              Tìm hiểu cả 9 nhóm <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 8 nhóm còn lại */}
      <section className="relative mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Các nhóm khác</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((t) => (
            <TypeChip key={t.slug} t={t} />
          ))}
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Enneagram là bản đồ phát triển bản thân (miền công cộng) — mô tả động lực và xu hướng tâm
          lý trên một phổ, không phải nhãn cố định hay lời phán số mệnh.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-12">
        <RelatedTools
          links={[
            { href: '/enneagram', label: 'Trắc nghiệm Enneagram' },
            { href: '/learn/enneagram', label: 'Tìm hiểu Enneagram' },
            { href: '/mbti', label: 'Trắc nghiệm MBTI' },
          ]}
        />
      </div>

      <StickyMobileCta href="/enneagram" label="Làm trắc nghiệm" trackId={`enneagram-type-${n}`} />
    </>
  );
}
