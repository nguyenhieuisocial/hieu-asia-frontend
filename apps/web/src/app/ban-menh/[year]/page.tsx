import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ArrowRight, ArrowLeft, Sparkles, Palette, ShieldCheck } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import {
  buildBanMenh,
  BIRTH_YEARS,
  COLOR_HEX,
  FROM_YEAR,
  TO_YEAR,
} from '@/lib/ban-menh-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return BIRTH_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  const d = buildBanMenh(Number(year));
  if (!d) return { title: 'Ngũ hành bản mệnh theo năm sinh' };
  const url = `https://hieu.asia/ban-menh/${year}`;
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

function ColorChips({ colors }: { colors: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-2.5 py-1 text-sm text-foreground/85"
        >
          <span
            aria-hidden
            className="h-3.5 w-3.5 rounded-full border border-white/20"
            style={{ backgroundColor: COLOR_HEX[c] ?? '#888' }}
          />
          {c}
        </span>
      ))}
    </div>
  );
}

export default async function BanMenhYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const y = Number(year);
  const d = buildBanMenh(y);
  if (!d) notFound();

  const prev = y > FROM_YEAR ? y - 1 : null;
  const next = y < TO_YEAR ? y + 1 : null;

  const JSONLD = [
    article({
      headline: d.seoTitle,
      description: d.seoDescription,
      url: `/ban-menh/${year}`,
      image: '/og-image.jpg',
      datePublished: '2026-06-22',
      dateModified: '2026-06-22',
      type: 'Article',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Ngũ hành bản mệnh', url: '/ban-menh' },
      { name: `Sinh năm ${year}`, url: `/ban-menh/${year}` },
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
        <section className="relative mx-auto max-w-3xl px-6 pb-10 pt-12 sm:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Ngũ hành bản mệnh · Tuổi {d.canChi}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Sinh năm {year} mệnh gì?
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Người sinh năm {year} cầm tinh con{' '}
            <span aria-hidden>{d.zodiac.emoji}</span> {d.zodiac.ten}, nạp âm{' '}
            <strong className="text-foreground">{d.napAmName}</strong> — thuộc hành{' '}
            <strong className="text-gold">{d.elementName}</strong>.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/la-so-bat-tu">Xem lá số Bát Tự của tôi</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/ban-menh">Tra năm sinh khác</Link>
            </Button>
          </div>
        </section>

        {/* Thẻ dữ kiện */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                  <Sparkles className="h-4 w-4 text-gold" aria-hidden /> Can chi · con giáp
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {d.canChi} · cầm tinh con {d.zodiac.ten}
              </CardContent>
            </Card>
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                  <ShieldCheck className="h-4 w-4 text-gold" aria-hidden /> Nạp âm
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {d.napAmName}
              </CardContent>
            </Card>
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                  <Sparkles className="h-4 w-4 text-gold" aria-hidden /> Hành bản mệnh
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {d.elementName} — {d.elementBlurb}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Màu sắc hợp / kỵ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            <Palette className="h-6 w-6 text-gold" aria-hidden /> Sinh năm {year} hợp màu gì?
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            Theo quan niệm ngũ hành (tương sinh – tương khắc), người mệnh {d.elementName} thường
            được khuyên dùng các màu dưới đây. Đây là gợi ý tham khảo cho lựa chọn màu sắc thường
            ngày, không phải điều bắt buộc.
          </p>
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.05] p-4">
              <p className="mb-2 text-sm font-medium text-emerald-300">
                Màu bản mệnh (hành {d.elementName})
              </p>
              <ColorChips colors={d.banMenhColors} />
            </div>
            <div className="rounded-lg border border-sky-500/30 bg-sky-500/[0.05] p-4">
              <p className="mb-2 text-sm font-medium text-sky-300">
                Màu tương sinh — nên dùng (hành {d.sinhElementName} sinh {d.elementName})
              </p>
              <ColorChips colors={d.hopColors} />
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.05] p-4">
              <p className="mb-2 text-sm font-medium text-amber-300">
                Màu nên hạn chế (hành {d.khacElementName} khắc {d.elementName})
              </p>
              <ColorChips colors={d.avoidColors} />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Còn muốn xem hướng nhà, hướng bàn làm việc hợp tuổi? Dùng công cụ{' '}
            <Link href="/huong-nha" className="text-gold hover:underline">
              Hướng nhà hợp tuổi
            </Link>{' '}
            (tính theo Bát Trạch, có phân biệt nam/nữ).
          </p>
        </section>

        {/* Lưu ý Tết */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-lg border border-border bg-card/40 p-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground/90">Lưu ý:</strong> tuổi và mệnh tính theo{' '}
              <strong>năm âm lịch</strong> (đổi vào Tết Nguyên đán). Nếu bạn sinh trong tháng 1 hoặc
              đầu tháng 2 dương lịch (trước Tết năm {year}), rất có thể bạn vẫn thuộc tuổi và mệnh của
              năm {y - 1}. Hãy đối chiếu ngày Tết của năm sinh để chắc chắn.
            </p>
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
              Nhận bài về tử vi & phong thủy hợp tuổi {d.canChi}
            </h2>
            <OccasionLeadCapture
              source={`ban-menh-${year}`}
              capturedEvent="lead_capture_ban_menh"
              capturedProps={{ year }}
              blurb={`Để lại email, thi thoảng chúng tôi gửi bài giúp bạn dùng ngũ hành bản mệnh vào đời sống (màu sắc, hướng, chọn ngày) cho người tuổi ${d.canChi}. Không spam.`}
              cta="Nhận bài"
            />
          </div>
        </section>

        {/* CTA → lá số đầy đủ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Mệnh theo năm chỉ là một lát cắt
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Nạp âm theo năm sinh cho biết hành bản mệnh chung. Nhưng lá số Bát Tự (Tứ Trụ) đầy đủ
              tính cả giờ – ngày – tháng sinh, cho thấy ngũ hành nào vượng, nào thiếu trong chính bạn.
              Lập lá số 2 phút để xem bức tranh thật của riêng mình — miễn phí.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/la-so-bat-tu">Lập lá số Bát Tự miễn phí</Link>
              </Button>
              <Link
                href="/dat-ten-ngu-hanh"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Đặt tên con theo ngũ hành <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* Điều hướng năm trước / sau */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <div className="flex items-center justify-between gap-3 text-sm">
            {prev ? (
              <Link
                href={`/ban-menh/${prev}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/40 px-3 py-2 text-foreground/80 transition hover:border-gold/40 hover:text-gold"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> Sinh năm {prev}
              </Link>
            ) : (
              <span />
            )}
            <Link href="/ban-menh" className="text-muted-foreground hover:text-gold">
              Tất cả năm sinh
            </Link>
            {next ? (
              <Link
                href={`/ban-menh/${next}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/40 px-3 py-2 text-foreground/80 transition hover:border-gold/40 hover:text-gold"
              >
                Sinh năm {next} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : (
              <span />
            )}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            hieu.asia tính nạp âm theo chu kỳ 60 Giáp Tý và suy màu hợp theo luật ngũ hành tương sinh
            – tương khắc, trình bày minh bạch để bạn tham khảo. Đây không phải lời phán số mệnh, và
            chúng tôi không bán lễ "đổi mệnh".
          </p>
        </section>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools
            links={[
              { href: '/la-so-bat-tu', label: 'Lá số Bát Tự (Tứ Trụ) đầy đủ' },
              { href: '/dat-ten-ngu-hanh', label: 'Đặt tên con theo ngũ hành' },
              { href: '/huong-nha', label: 'Hướng nhà hợp tuổi' },
              { href: `/tu-vi-2026/${d.zodiac.slug}`, label: `Tử Vi 2026 tuổi ${d.zodiac.ten}` },
            ]}
          />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/la-so-bat-tu" trackId={`ban-menh-${year}`} />
    </div>
  );
}
