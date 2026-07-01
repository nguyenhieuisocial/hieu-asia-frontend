import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import {
  ArrowRight,
  Sparkles,
  Users,
  Swords,
  TrendingUp,
  Compass,
  Heart,
  Briefcase,
  CalendarDays,
} from 'lucide-react';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import {
  buildConGiap,
  CON_GIAP_SLUGS,
  type ChiRef,
} from '@/lib/con-giap-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return CON_GIAP_SLUGS.map((slug) => ({ slug }));
}

/** Hiển thị "Mão (Mèo)" cho địa chi Mão — con giáp thứ 4 trong tiếng Việt là Mèo. */
function displayTen(slug: string, ten: string): string {
  return slug === 'mao' ? `${ten} (Mèo)` : ten;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = buildConGiap(slug);
  if (!d) return { title: '12 Con Giáp' };
  const url = `https://hieu.asia/learn/con-giap/${slug}`;
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

function ChiChip({ c }: { c: ChiRef }) {
  return (
    <Link
      href={`/learn/con-giap/${c.slug}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
    >
      <span aria-hidden="true" className="text-base">
        {c.emoji}
      </span>
      {displayTen(c.slug, c.ten)}
    </Link>
  );
}

export default async function ConGiapDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = buildConGiap(slug);
  if (!d) notFound();

  const { z, extra, tamHop, tuHanhXung, exampleYears, others, faqs } = d;
  const ten = displayTen(z.slug, z.ten);
  const tamHopNames = tamHop.map((t) => t.ten).join(', ');

  const JSONLD = [
    article({
      headline: d.seoTitle,
      description: d.seoDescription,
      url: `/learn/con-giap/${slug}`,
      image: '/og-image.jpg',
      datePublished: '2026-06-22',
      dateModified: '2026-06-22',
      type: 'Article',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Học huyền học', url: '/learn' },
      { name: '12 Con Giáp', url: '/learn/con-giap' },
      { name: `Tuổi ${z.ten}`, url: `/learn/con-giap/${slug}` },
    ]),
    faqPage(faqs),
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
          <Link href="/learn/con-giap" className="hover:text-gold">
            12 Con Giáp
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground/70">Tuổi {z.ten}</span>
        </nav>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
          12 Con Giáp · Địa Chi {z.ten} · Hành {z.nguHanh}
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
          <span aria-hidden="true" className="mr-3">
            {z.emoji}
          </span>
          Tuổi {ten}
        </h1>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/[0.06] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700">
          Ngũ hành {z.nguHanh}
        </p>
        <p className="mt-4 text-base leading-relaxed text-foreground/80 sm:text-lg">
          {extra.tagline}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/hop-tuoi">Xem hợp tuổi</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/learn/con-giap">Cả 12 con giáp</Link>
          </Button>
        </div>
      </section>

      {/* Thẻ dữ kiện */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Sparkles className="h-4 w-4 text-gold" aria-hidden /> Ngũ hành
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              Hành {z.nguHanh}
              <span className="block text-xs text-muted-foreground/80">
                của Địa Chi {z.ten}
              </span>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Users className="h-4 w-4 text-gold" aria-hidden /> Tam Hợp
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {tamHopNames}
              <span className="block text-xs text-muted-foreground/80">
                nhóm hợp nhịp, bổ trợ
              </span>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Swords className="h-4 w-4 text-gold" aria-hidden /> Tứ hành xung
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {tuHanhXung.ten}
              <span className="block text-xs text-muted-foreground/80">
                khác nhịp, cần dung hoà
              </span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tính cách */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-3 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Tuổi {z.ten} là người thế nào?
        </h2>
        <p className="text-base leading-relaxed text-foreground/85">{z.blurb}</p>
      </section>

      {/* Điểm mạnh + Điều nên luyện */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <TrendingUp className="h-4 w-4 text-emerald-400" aria-hidden /> Điểm mạnh nổi bật
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-foreground/80">
              <ul className="space-y-1.5">
                {extra.strengths.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden="true" className="mt-1 text-emerald-400">
                      •
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Compass className="h-4 w-4 text-amber-400" aria-hidden /> Điều nên luyện
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-foreground/80">
              <ul className="space-y-1.5">
                {extra.growthEdges.map((g) => (
                  <li key={g} className="flex gap-2">
                    <span aria-hidden="true" className="mt-1 text-amber-400">
                      •
                    </span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Điểm mạnh và điều nên luyện là <strong>xu hướng</strong> theo con giáp, không phải lời phán
          cố định. Mỗi người đều có thể rèn giũa theo hướng mình muốn.
        </p>
      </section>

      {/* Công việc */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          <Briefcase className="h-5 w-5 text-gold" aria-hidden /> Tuổi {z.ten} trong công việc
        </h2>
        <Card className="border-border bg-card/40">
          <CardContent className="pt-6 text-base leading-relaxed text-foreground/85">
            {extra.career}
          </CardContent>
        </Card>
      </section>

      {/* Tình cảm */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          <Heart className="h-5 w-5 text-gold" aria-hidden /> Tuổi {z.ten} trong tình cảm
        </h2>
        <Card className="border-border bg-card/40">
          <CardContent className="pt-6 text-base leading-relaxed text-foreground/85">
            {extra.love}
          </CardContent>
        </Card>
      </section>

      {/* Tam Hợp */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Tam Hợp với tuổi {z.ten}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Ba con giáp cách đều 4 ngôi hội thành một cục ngũ hành — cùng nhóm thường dễ đồng điệu, bổ trợ
          nhau. Đây là xu hướng tham khảo, không phải đảm bảo.
        </p>
        <div className="flex flex-wrap gap-2">
          {tamHop.map((c) => (
            <ChiChip key={c.slug} c={c} />
          ))}
        </div>
      </section>

      {/* Tứ hành xung */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Tứ hành xung với tuổi {z.ten}
        </h2>
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <ChiChip c={tuHanhXung} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/85">
            Tuổi {z.ten} và tuổi {tuHanhXung.ten} là cặp{' '}
            <strong className="text-foreground">khác nhịp</strong> (đối xứng 180° trên vòng). “Xung”
            không có nghĩa là xấu — nó chỉ gợi ý hai nếp sống khác nhau, đôi khi dễ va quan điểm và cần
            dung hoà nhiều hơn. Rất nhiều cặp “xung” vẫn rất bền khi khác biệt đúng cách trở thành bổ
            sung. Không cần kiêng kỵ, không hoãn cưới, không đổi tuổi.
          </p>
          <Link
            href="/learn/hop-tuoi"
            className="mt-4 inline-flex items-center text-sm text-gold hover:underline"
          >
            Hiểu vì sao “xung” không phải điềm xấu <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* Năm sinh ví dụ */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="rounded-xl border border-border bg-card/40 p-5">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700">
            <CalendarDays className="h-4 w-4" aria-hidden /> Một số năm sinh tuổi {z.ten}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            {exampleYears.join(', ')}. Con giáp lặp lại theo chu kỳ 12 năm, nên cứ cộng hoặc trừ 12 để
            ra thêm.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Câu hỏi thường gặp
        </h2>
        <div className="space-y-3">
          {faqs.map((f) => (
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
            Nhận bài về 12 con giáp &amp; hiểu mình
          </h2>
          <OccasionLeadCapture
            source={`con-giap-${z.slug}`}
            capturedEvent="lead_capture_con_giap"
            capturedProps={{ slug: z.slug }}
            blurb={`Để lại email, thi thoảng chúng tôi gửi bài giúp bạn hiểu sâu hơn về tuổi ${z.ten}, 12 con giáp và cách áp dụng vào đời sống. Không spam.`}
            cta="Nhận bài"
          />
        </div>
      </section>

      {/* CTA → công cụ */}
      <section className="relative mx-auto max-w-3xl px-6 pb-10">
        <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Tuổi {z.ten} hợp với ai?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
            Trang này mô tả xu hướng của tuổi {z.ten} theo con giáp. Để xem cụ thể hai tuổi hợp hay khác
            nhịp ở đâu — đối chiếu Can Chi và nạp âm, kèm hướng dung hoà — hãy dùng công cụ hợp tuổi miễn
            phí.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/hop-tuoi">Xem hợp tuổi</Link>
            </Button>
            <Link
              href="/learn/con-giap"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
            >
              Tìm hiểu cả 12 con giáp <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 11 con giáp còn lại */}
      <section className="relative mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Các con giáp khác</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((c) => (
            <ChiChip key={c.slug} c={c} />
          ))}
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          12 con giáp là tri thức dân gian (miền công cộng) — mô tả xu hướng tính cách theo năm sinh,
          một lát cắt rất thô, không phải nhãn cố định hay lời phán số mệnh.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-12">
        <RelatedTools
          links={[
            { href: '/hop-tuoi', label: 'Xem hợp tuổi' },
            { href: '/learn/hop-tuoi', label: 'Tìm hiểu hợp tuổi' },
            { href: '/learn/con-giap', label: '12 Con Giáp' },
          ]}
        />
      </div>

      <StickyMobileCta href="/hop-tuoi" label="Xem hợp tuổi" trackId={`con-giap-${z.slug}`} />
    </>
  );
}
