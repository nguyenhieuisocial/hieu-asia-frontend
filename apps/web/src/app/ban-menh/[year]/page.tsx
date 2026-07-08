import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ArrowRight, ArrowLeft, Sparkles, Palette, ShieldCheck, Briefcase, Compass } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { DownloadToolPdfButton, type ToolPdfPayload } from '@/components/tools/DownloadToolPdfButton';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import {
  buildBanMenh,
  BIRTH_YEARS,
  COLOR_HEX,
  FROM_YEAR,
  TO_YEAR,
} from '@/lib/ban-menh-data';
// Cross-link theo TUỔI này sang các công cụ cũng keyed theo năm sinh (giảm near-dup
// giữa các trang /ban-menh + internal-link các trang sâu để Google phát hiện/crawl).
import { BIRTH_YEARS as LAM_NHA_YEARS, slugOf as lamNhaSlug } from '@/app/xem-tuoi-lam-nha/years';
import { HOST_YEARS as XONG_DAT_YEARS, slugOf as xongDatSlug } from '@/app/xong-dat/years';
import { BIRTH_YEARS as KHAI_TRUONG_YEARS, slugOf as khaiTruongSlug } from '@/app/khai-truong/years';
import { BIRTH_YEARS as HUONG_NHA_YEARS, slugOf as huongNhaSlug } from '@/app/huong-nha/years';
import { BIRTH_YEARS as CUOI_YEARS, slugOf as cuoiSlug } from '@/app/xem-tuoi-cuoi/years';

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
            className="h-3.5 w-3.5 rounded-full border border-border"
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

  // Cross-link "theo tuổi này" — chỉ phát link tới công cụ có ĐÚNG năm sinh này
  // trong danh sách năm của nó (guard .includes) để không bao giờ trỏ tới trang
  // không tồn tại. Mỗi trang /ban-menh/<year> nhờ đó có bộ link riêng → giảm
  // near-dup + đưa Googlebot vào các trang sâu (làm nhà/cưới/khai trương/hướng/xông đất).
  const sameAgeLinks = [
    { href: `/tra-cuu-tuoi?year=${y}`, label: `Tra cứu trọn đời tuổi ${d.canChi}` },
    LAM_NHA_YEARS.includes(y)
      ? { href: `/xem-tuoi-lam-nha/${lamNhaSlug(y)}`, label: `Tuổi ${d.canChi} làm nhà năm nào tốt?` }
      : null,
    CUOI_YEARS.includes(y)
      ? { href: `/xem-tuoi-cuoi/${cuoiSlug(y)}`, label: `Tuổi ${d.canChi} cưới năm nào đẹp?` }
      : null,
    KHAI_TRUONG_YEARS.includes(y)
      ? { href: `/khai-truong/${khaiTruongSlug(y)}`, label: `Tuổi ${d.canChi} khai trương năm nào hợp?` }
      : null,
    HUONG_NHA_YEARS.includes(y)
      ? { href: `/huong-nha/${huongNhaSlug(y)}`, label: `Tuổi ${d.canChi} hợp hướng nhà nào?` }
      : null,
    XONG_DAT_YEARS.includes(y)
      ? { href: `/xong-dat/${xongDatSlug(y)}`, label: `Gia chủ ${d.canChi} chọn tuổi xông đất 2027` }
      : null,
  ].filter((l): l is { href: string; label: string } => l !== null);

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

  const pdfPayload: ToolPdfPayload = {
    title: `Ngũ hành bản mệnh — sinh năm ${year} — hieu.asia`,
    subtitle: `Tuổi ${d.canChi} · cầm tinh ${d.zodiac.ten} · nạp âm ${d.napAmName}`,
    hero: { big: `Mệnh ${d.elementName}`, small: `Sinh năm ${year} · nạp âm ${d.napAmName}` },
    sections: [
      {
        heading: 'Bản mệnh',
        rows: [
          { label: 'Năm sinh', value: String(year) },
          { label: 'Can Chi', value: d.canChi },
          { label: 'Con giáp', value: `${d.zodiac.emoji} ${d.zodiac.ten}` },
          { label: 'Nạp âm', value: d.napAmName },
          { label: 'Hành bản mệnh', value: d.elementName },
        ],
      },
      { heading: `Hành ${d.elementName}`, text: d.elementBlurb },
      {
        heading: 'Màu sắc theo ngũ hành',
        rows: [
          { label: `Màu bản mệnh (hành ${d.elementName})`, value: d.banMenhColors.join(', ') },
          { label: `Màu tương sinh nên dùng (hành ${d.sinhElementName})`, value: d.hopColors.join(', ') },
          { label: `Màu nên hạn chế (hành ${d.khacElementName} khắc)`, value: d.avoidColors.join(', ') },
        ],
      },
      ...(d.careers.length > 0
        ? [{ heading: 'Nhóm nghề hợp mệnh (tham khảo)', text: d.careers.join(' · ') }]
        : []),
      {
        heading: 'Lưu ý',
        text: 'Ngũ hành bản mệnh (nạp âm) là quan niệm dân gian để tham khảo — màu sắc & nghề hợp suy theo luật tương sinh – tương khắc, không phải định mệnh. Bạn vẫn là người quyết định.',
      },
    ],
    cta: { text: 'Lập lá số Bát Tự đầy đủ (miễn phí)', url: 'https://hieu.asia/la-so-bat-tu' },
  };

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
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
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
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/la-so-bat-tu">Xem lá số Bát Tự của tôi</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/ban-menh">Tra năm sinh khác</Link>
            </Button>
            <DownloadToolPdfButton source="pdf-ban-menh" label="Tải PDF bản mệnh" payload={pdfPayload} />
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

        {/* Nghề/ngành hợp mệnh */}
        {d.careers.length > 0 && (
          <section className="relative mx-auto max-w-3xl px-6 pb-10">
            <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              <Briefcase className="h-6 w-6 text-gold" aria-hidden /> Sinh năm {year} hợp nghề gì?
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Theo quan niệm ngũ hành, người mệnh {d.elementName} thường hợp với các nhóm nghề dưới
              đây. Đây là gợi ý định hướng để tham khảo — nghề phù hợp thật sự còn tùy năng lực, sở
              thích và hoàn cảnh của bạn.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {d.careers.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-2 rounded-lg border border-border bg-card/40 p-3 text-sm leading-relaxed text-foreground/85"
                >
                  <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Muốn gợi ý nghề theo cả tính cách và năng lực của riêng bạn? Thử{' '}
              <Link href="/career-fit" className="text-gold hover:underline">
                công cụ định hướng nghề
              </Link>
              .
            </p>
          </section>
        )}

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

        {/* Cross-tool theo tuổi này — link các trang sâu cùng năm sinh */}
        {sameAgeLinks.length > 0 && (
          <section className="relative mx-auto max-w-3xl px-6 pb-10">
            <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              <Compass className="h-6 w-6 text-gold" aria-hidden /> Xem thêm cho tuổi {d.canChi} (sinh năm {year})
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Cùng tuổi {d.canChi} — sinh năm {year} — bạn có thể tra nhanh các việc trọng đại theo
              đúng năm sinh này. Mỗi liên kết dưới đây mở trang tính riêng cho tuổi {d.canChi}, minh
              bạch từng bước để tham khảo.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {sameAgeLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex items-start gap-2 rounded-lg border border-border bg-card/40 p-3 text-sm leading-relaxed text-foreground/85 transition hover:border-gold/40 hover:text-gold"
                  >
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" aria-hidden />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

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
