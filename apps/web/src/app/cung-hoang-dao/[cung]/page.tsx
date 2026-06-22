import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ArrowRight, Sparkles, Compass, Heart, Briefcase, Star, TrendingUp } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { buildCung, CUNG_SLUGS, listCung, type SignRef } from '@/lib/cung-hoang-dao-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return CUNG_SLUGS.map((cung) => ({ cung }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cung: string }>;
}): Promise<Metadata> {
  const { cung } = await params;
  const d = buildCung(cung);
  if (!d) return { title: 'Cung hoàng đạo' };
  const url = `https://hieu.asia/cung-hoang-dao/${cung}`;
  return {
    title: d.seoTitle,
    description: d.seoDescription,
    alternates: { canonical: url },
    // Route-level openGraph THAY THẾ openGraph ở root layout → phải khai lại images
    // nếu không bản xem trước khi chia sẻ sẽ trống.
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

function ChipLink({ s }: { s: SignRef }) {
  return (
    <Link
      href={`/cung-hoang-dao/${s.slug}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
    >
      <span aria-hidden="true">{s.symbol}</span> {s.name}
    </Link>
  );
}

export default async function CungDetailPage({
  params,
}: {
  params: Promise<{ cung: string }>;
}) {
  const { cung } = await params;
  const d = buildCung(cung);
  if (!d) notFound();

  const { z, extra } = d;
  const others = listCung().filter((s) => s.slug !== cung);

  const JSONLD = [
    article({
      headline: d.seoTitle,
      description: d.seoDescription,
      url: `/cung-hoang-dao/${cung}`,
      image: '/og-image.jpg',
      datePublished: '2026-06-22',
      dateModified: '2026-06-22',
      type: 'Article',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Cung hoàng đạo', url: '/cung-hoang-dao' },
      { name: `Cung ${z.name}`, url: `/cung-hoang-dao/${cung}` },
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
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Cung hoàng đạo · {extra.english} · {extra.dateLabel}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            <span aria-hidden="true" className="mr-2 text-gold">
              {z.symbol}
            </span>
            Cung {z.name}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/80 sm:text-lg">
            {extra.tagline}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/ban-do-sao">Xem bản đồ sao của tôi</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/cung-hoang-dao">Cả 12 cung</Link>
            </Button>
          </div>
        </section>

        {/* Thẻ dữ kiện thiên văn */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                  <Sparkles className="h-4 w-4 text-gold" aria-hidden /> Nguyên tố
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {z.element} · tính chất {z.quality}
              </CardContent>
            </Card>
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                  <Star className="h-4 w-4 text-gold" aria-hidden /> Hành tinh chủ quản
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {extra.rulingPlanet}
                {extra.rulingPlanetModern && (
                  <span className="block text-xs text-muted-foreground/80">
                    Hiện đại: {extra.rulingPlanetModern}
                  </span>
                )}
              </CardContent>
            </Card>
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                  <Compass className="h-4 w-4 text-gold" aria-hidden /> Khoảng ngày
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {extra.dateLabel}
                <span className="block text-xs text-muted-foreground/80">
                  Sinh sát ranh giới?{' '}
                  <Link href="/cung-hoang-dao#cung-cua-toi" className="text-gold hover:underline">
                    Tra cung chính xác
                  </Link>
                </span>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tính cách */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-3 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Cung {z.name} là người thế nào?
          </h2>
          <p className="text-base leading-relaxed text-foreground/85">{z.blurb}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Là cung thuộc nguyên tố <strong className="text-foreground/90">{z.element}</strong>,{' '}
            {z.name} thường {d.elementTendency}
          </p>
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
                  {extra.strengths.map((s) => (
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
                  <Compass className="h-4 w-4 text-amber-400" aria-hidden /> Điều nên lưu ý
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm leading-relaxed text-foreground/80">
                  {extra.growthEdges.map((s) => (
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
            Điểm mạnh và điều nên lưu ý chỉ là <strong>xu hướng</strong> của cung Mặt Trời — không
            phải lời phán cố định. Mỗi người đều có thể rèn giũa theo hướng mình muốn.
          </p>
        </section>

        {/* Tình yêu + Công việc */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                  <Heart className="h-4 w-4 text-rose-400" aria-hidden /> Trong tình yêu
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {extra.love}
              </CardContent>
            </Card>
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                  <Briefcase className="h-4 w-4 text-sky-400" aria-hidden /> Trong công việc
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {extra.work}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Hợp với cung nào */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Cung {z.name} hợp với cung nào?
          </h2>
          <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
            Theo khung nguyên tố của chiêm tinh, đây là các xu hướng hòa hợp. Độ hợp thật của hai
            người còn tùy lá số đầy đủ — không chỉ cung Mặt Trời.
          </p>
          <p className="mb-5 text-sm">
            <Link href="/cung-hoang-dao/hop" className="text-gold hover:underline">
              Tra độ hợp chi tiết giữa {z.name} và một cung bất kỳ →
            </Link>
          </p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground/90">
                Hòa hợp tự nhiên — cùng nguyên tố {z.element}
              </p>
              <div className="flex flex-wrap gap-2">
                {d.sameElement.map((s) => (
                  <ChipLink key={s.slug} s={s} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-foreground/90">
                Bổ trợ — nguyên tố {d.supportElement}
              </p>
              <div className="flex flex-wrap gap-2">
                {d.support.map((s) => (
                  <ChipLink key={s.slug} s={s} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-foreground/90">
                Cung đối — {d.opposite.name} (vừa cuốn hút, vừa thử thách)
              </p>
              <div className="flex flex-wrap gap-2">
                <ChipLink s={d.opposite} />
              </div>
            </div>
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
              Nhận bài về cung {z.name} và chiêm tinh
            </h2>
            <OccasionLeadCapture
              source={`cung-hoang-dao-${cung}`}
              capturedEvent="lead_capture_cung_hoang_dao"
              capturedProps={{ cung }}
              blurb={`Để lại email, thi thoảng chúng tôi gửi bài giúp bạn hiểu sâu hơn về cung ${z.name}, bản đồ sao và cách áp dụng vào đời sống. Không spam.`}
              cta="Nhận bài"
            />
          </div>
        </section>

        {/* CTA → bản đồ sao đầy đủ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Cung Mặt Trời chỉ là khởi đầu
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Cung {z.name} mô tả "mặt trời" của bạn — phần ý chí và cái tôi. Nhưng bản đồ sao đầy đủ
              còn có cung Mọc (cách bạn xuất hiện), cung Mặt Trăng (đời sống cảm xúc) và các hành tinh
              khác, vốn phụ thuộc giờ và nơi sinh. Nhập ngày giờ sinh để xem bản đồ sao thật của riêng
              bạn — tính theo thiên văn, miễn phí.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/ban-do-sao">Lập bản đồ sao miễn phí</Link>
              </Button>
              <Link
                href="/thien-van"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Bầu trời hôm nay <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* 11 cung còn lại */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Các cung khác</h2>
          <div className="flex flex-wrap gap-2">
            {others.map((s) => (
              <ChipLink key={s.slug} s={s} />
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            hieu.asia tính cung hoàng đạo theo vị trí Mặt Trời thật (thuật toán thiên văn Meeus, đã
            kiểm chứng). Đây là công cụ khám phá bản thân để tham khảo, không phải lời phán số mệnh.
          </p>
        </section>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools
            links={[
              { href: '/ban-do-sao', label: 'Bản đồ sao (lá số chiêm tinh đầy đủ)' },
              { href: '/thien-van', label: 'Thiên văn hôm nay' },
              { href: '/la-so-tu-vi', label: 'Lá số Tử Vi' },
            ]}
          />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/ban-do-sao" trackId={`cung-hoang-dao-${cung}`} />
    </div>
  );
}
