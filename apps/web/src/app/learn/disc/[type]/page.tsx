import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import {
  ArrowRight,
  Gauge,
  Target,
  TrendingUp,
  Compass,
  MessageCircle,
  Briefcase,
  Zap,
  Users,
  Eye,
} from 'lucide-react';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { buildStyle, listStyles, DISC_SLUGS, type DiscStyleRef } from '@/lib/disc-type-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return DISC_SLUGS.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const d = buildStyle(type);
  if (!d) return { title: 'DISC' };
  const url = `https://hieu.asia/learn/disc/${d.slug}`;
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

function StyleChip({ s }: { s: DiscStyleRef }) {
  return (
    <Link
      href={`/learn/disc/${s.slug}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
    >
      <span className="font-heading text-sm font-semibold text-gold-700">{s.letter}</span>
      <span className="text-muted-foreground">{s.vi}</span>
    </Link>
  );
}

export default async function DiscStylePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const d = buildStyle(type);
  if (!d) notFound();

  const others = listStyles().filter((s) => s.slug !== d.slug);

  const JSONLD = [
    article({
      headline: d.seoTitle,
      description: d.seoDescription,
      url: `/learn/disc/${d.slug}`,
      image: '/og-image.jpg',
      datePublished: '2026-06-22',
      dateModified: '2026-06-22',
      type: 'Article',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Học huyền học', url: '/learn' },
      { name: 'DISC', url: '/learn/disc' },
      { name: `Nhóm ${d.letter} — ${d.vi}`, url: `/learn/disc/${d.slug}` },
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
          <Link href="/learn/disc" className="hover:text-gold">
            DISC
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground/70">Nhóm {d.letter}</span>
        </nav>
        <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
          DISC · {d.pace} · {d.focus}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
          <span aria-hidden="true" className="mr-3 text-gold">
            {d.letter}
          </span>
          {d.vi}
        </h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {d.en}
        </p>
        <p className="mt-4 text-base leading-relaxed text-foreground/80 sm:text-lg">{d.tagline}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/disc">Làm trắc nghiệm DISC</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/learn/disc">Cả 4 nhóm</Link>
          </Button>
        </div>
      </section>

      {/* Thẻ dữ kiện */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Gauge className="h-4 w-4 text-gold" aria-hidden /> Nhịp độ
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">{d.pace}</CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Target className="h-4 w-4 text-gold" aria-hidden /> Trọng tâm
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">{d.focus}</CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Compass className="h-4 w-4 text-gold" aria-hidden /> Nhóm đối
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {d.oppositeRef.letter} · {d.oppositeRef.vi}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tổng quan */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-3 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Nhóm {d.letter} là người thế nào?
        </h2>
        <p className="text-base leading-relaxed text-foreground/85">{d.overview}</p>
      </section>

      {/* Hay bị hiểu lầm */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <Card className="border-border bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
              <Eye className="h-4 w-4 text-gold" aria-hidden /> Nhóm {d.letter} hay bị hiểu lầm
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-foreground/80">
            {d.misreads}
          </CardContent>
        </Card>
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
            <CardContent>
              <ul className="space-y-1.5 text-sm leading-relaxed text-foreground/80">
                {d.strengths.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden className="text-emerald-400">
                      •
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Compass className="h-4 w-4 text-amber-400" aria-hidden /> Hướng phát triển
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm leading-relaxed text-foreground/80">
                {d.growth.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden className="text-amber-400">
                      •
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Điểm mạnh và hướng phát triển là <strong>xu hướng</strong> hành vi của nhóm {d.letter},
          không phải lời phán cố định. Ai cũng là pha trộn của cả bốn nhóm ở mức khác nhau.
        </p>
      </section>

      {/* Giao tiếp */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          <MessageCircle className="h-5 w-5 text-gold" aria-hidden /> Giao tiếp &amp; làm việc với nhóm {d.letter}
        </h2>
        <p className="text-base leading-relaxed text-foreground/85">{d.communication}</p>
      </section>

      {/* Công việc */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          <Briefcase className="h-5 w-5 text-gold" aria-hidden /> Nhóm {d.letter} trong công việc
        </h2>
        <p className="text-base leading-relaxed text-foreground/85">{d.workStyle}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Đây là xu hướng tham khảo theo khung DISC, không phải giới hạn nghề nghiệp.
        </p>
      </section>

      {/* Khi căng thẳng */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <Card className="border-amber-500/20 bg-amber-500/[0.04]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 font-heading text-base text-amber-300">
              <Zap className="h-4 w-4" aria-hidden /> Khi căng thẳng
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-foreground/80">
            {d.underPressure}
          </CardContent>
        </Card>
      </section>

      {/* Kết hợp & đối lập */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Kết hợp thường gặp
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          DISC đọc theo tỉ lệ: hầu hết mọi người mạnh ở một nhóm chính kèm một nhóm phụ. Nhóm {d.letter}
          thường pha với hai nhóm liền kề trên vòng tròn, và đối lập với nhóm {d.oppositeRef.letter}.
        </p>
        <div className="space-y-3">
          <div>
            <p className="mb-2 text-sm font-medium text-foreground/90">Liền kề (dễ pha trộn)</p>
            <div className="flex flex-wrap gap-2">
              {d.neighborRefs.map((s) => (
                <StyleChip key={s.slug} s={s} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-foreground/90">
              Đối lập — {d.oppositeRef.vi} (khác nhịp &amp; trọng tâm)
            </p>
            <div className="flex flex-wrap gap-2">
              <StyleChip s={d.oppositeRef} />
            </div>
          </div>
        </div>
      </section>

      {/* Phối hợp với ba nhóm còn lại */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          <Users className="h-5 w-5 text-gold" aria-hidden /> Phối hợp với ba nhóm còn lại
        </h2>
        <p className="text-base leading-relaxed text-foreground/85">{d.collaboration}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Không cặp nào &ldquo;khắc&rdquo; nhau — mỗi cặp chỉ cần chỉnh nhịp và trọng tâm cho hợp. Đây
          là chỗ DISC hữu dụng nhất: làm ngôn ngữ chung để một nhóm phối hợp trơn hơn.
        </p>
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
            Nhận bài về DISC &amp; giao tiếp
          </h2>
          <OccasionLeadCapture
            source={`disc-type-${d.slug}`}
            capturedEvent="lead_capture_disc_type"
            capturedProps={{ type: d.letter }}
            blurb={`Để lại email, thi thoảng chúng tôi gửi bài giúp bạn hiểu sâu hơn về nhóm ${d.letter}, bốn nhóm DISC và cách giao tiếp hợp với từng người. Không spam.`}
            cta="Nhận bài"
          />
        </div>
      </section>

      {/* CTA → trắc nghiệm */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Bạn thiên về nhóm nào?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
            Trang này mô tả nhóm {d.letter} ({d.vi}). Để xem tỉ lệ bốn nhóm hành vi của riêng bạn, hãy
            làm bộ trắc nghiệm DISC ngắn — kết quả ngay, miễn phí.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/disc">Làm trắc nghiệm DISC</Link>
            </Button>
            <Link
              href="/learn/disc"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
            >
              Tìm hiểu cả 4 nhóm <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 3 nhóm còn lại */}
      <section className="relative mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Các nhóm khác</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((s) => (
            <StyleChip key={s.slug} s={s} />
          ))}
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          DISC là khung mô tả phong cách hành vi (Marston, 1928 — miền công cộng), không phải chẩn
          đoán tâm lý hay lời phán số mệnh. Mỗi người là pha trộn của cả bốn nhóm và có thể đổi theo
          bối cảnh.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-12">
        <RelatedTools
          links={[
            { href: '/disc', label: 'Trắc nghiệm DISC' },
            { href: '/learn/disc', label: 'Tìm hiểu DISC' },
            { href: '/mbti', label: 'Trắc nghiệm MBTI' },
          ]}
        />
      </div>

      <StickyMobileCta href="/disc" label="Làm trắc nghiệm" trackId={`disc-type-${d.slug}`} />
    </>
  );
}
