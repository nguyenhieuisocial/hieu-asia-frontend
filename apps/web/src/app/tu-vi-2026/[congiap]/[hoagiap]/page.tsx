import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ArrowRight, Sparkles, ShieldAlert, Compass, Palette, Users } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { DownloadToolPdfButton, type ToolPdfPayload } from '@/components/tools/DownloadToolPdfButton';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { CON_GIAP_SLUGS, YEAR_RANGE } from '../../con-giap-data';
import {
  ALL_LIVE_HOA_GIAP,
  buildHoaGiap2026,
  hoaGiapParamSlug,
  parseHoaGiapParam,
} from '../../hoa-giap-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_LIVE_HOA_GIAP.flatMap((h) =>
    (['nam', 'nu'] as const).map((g) => ({
      congiap: h.zodiac.slug,
      hoagiap: hoaGiapParamSlug(h.slug, g),
    })),
  );
}

function resolve(congiap: string, hoagiap: string) {
  if (!CON_GIAP_SLUGS.includes(congiap)) return null;
  const parsed = parseHoaGiapParam(hoagiap);
  if (!parsed) return null;
  return buildHoaGiap2026(congiap, parsed.hoaGiapSlug, parsed.gender);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ congiap: string; hoagiap: string }>;
}): Promise<Metadata> {
  const { congiap, hoagiap } = await params;
  const d = resolve(congiap, hoagiap);
  if (!d) return { title: 'Tử Vi 2026 theo hoa giáp' };
  const url = `https://hieu.asia/tu-vi-2026/${congiap}/${hoagiap}`;
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

const TYPE_BADGE: Record<string, string> = {
  tot: 'text-emerald-400',
  trung: 'text-amber-400',
  xau: 'text-rose-400',
};
const TYPE_WORD: Record<string, string> = { tot: 'cát', trung: 'trung', xau: 'hung' };

export default async function TuVi2026HoaGiapPage({
  params,
}: {
  params: Promise<{ congiap: string; hoagiap: string }>;
}) {
  const { congiap, hoagiap } = await params;
  const d = resolve(congiap, hoagiap);
  if (!d) notFound();

  const JSONLD = [
    article({
      headline: d.seoTitle,
      description: d.seoDescription,
      url: `/tu-vi-2026/${congiap}/${hoagiap}`,
      image: '/og-image.jpg',
      datePublished: '2026-08-04',
      dateModified: '2026-08-04',
      type: 'Article',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Tử Vi 2026', url: '/tu-vi-2026' },
      { name: `Tuổi ${d.hoaGiap.zodiac.ten}`, url: `/tu-vi-2026/${congiap}` },
      { name: `${d.hoaGiap.canChi} ${d.genderMangLabel}`, url: `/tu-vi-2026/${congiap}/${hoagiap}` },
    ]),
    faqPage(d.faqs),
  ];

  const hanLines = [
    d.isNamTuoi ? '• Năm tuổi (Bản Mệnh) — đúng con giáp của mình.' : '',
    d.isXungThaiTue ? '• Xung Thái Tuế — năm dễ nhiều thay đổi, nên chủ động & cẩn trọng.' : '',
    d.isTamTai ? `• Tam Tai — năm 2026 (nhóm ${d.tamTaiChis.join(', ')}).` : '',
  ].filter(Boolean);
  const pdfPayload: ToolPdfPayload = {
    title: `Tử Vi 2026 — ${d.hoaGiap.canChi} ${d.genderMangLabel} — hieu.asia`,
    subtitle: `Mệnh ${d.hoaGiap.napAmName} · ${d.relationLabel}`,
    hero: {
      big: `Tử Vi 2026 — ${d.hoaGiap.canChi} ${d.genderMangLabel}`,
      small: `Mệnh ${d.hoaGiap.napAmName} (hành ${d.hoaGiap.elementName}) · năm Bính Ngọ (Hỏa)`,
    },
    sections: [
      { heading: 'Tổng quan năm 2026', text: d.verdictShort },
      { heading: d.relationLabel, text: d.relationLine },
      { heading: `Ngũ hành tuổi ${d.hoaGiap.zodiac.ten} với năm`, text: d.nguHanhLine },
      ...(hanLines.length > 0 ? [{ heading: 'Hạn cần lưu ý (phong tục)', text: hanLines.join('\n') }] : []),
      {
        heading: 'Lưu ý',
        text: 'Đây là gợi ý chung theo hoa giáp — vận thật còn tùy ngày giờ sinh và cách bạn hành động trong năm, không phải tiên đoán số mệnh.',
      },
    ],
    cta: { text: 'Lập lá số Tử Vi của riêng tôi (miễn phí)', url: 'https://hieu.asia/onboarding?intent=tu-vi-2026' },
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
          <p className="font-mono text-eyebrow uppercase text-gold/80">
            Tử Vi 2026 · Năm Bính Ngọ hành Hỏa · {YEAR_RANGE}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            <span aria-hidden="true" className="mr-2">
              {d.hoaGiap.zodiac.emoji}
            </span>
            Tử Vi {d.hoaGiap.canChi} 2026 {d.genderMangLabel}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">{d.verdictShort}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding?intent=tu-vi-2026">Xem tử vi 2026 của riêng tôi</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={`/tu-vi-2026/${congiap}`}>Tuổi {d.hoaGiap.zodiac.ten} tổng quan</Link>
            </Button>
            <DownloadToolPdfButton
              source="pdf-tu-vi-2026-hoagiap"
              label="Tải PDF tử vi 2026"
              payload={pdfPayload}
            />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Bạn tuổi {d.hoaGiap.canChi} nhưng {d.genderLabel === 'Nam' ? 'là nữ' : 'là nam'}?{' '}
            <Link href={d.otherGenderHref} className="text-gold hover:underline">
              Xem bản {d.genderLabel === 'Nam' ? 'Nữ Mạng' : 'Nam Mạng'}
            </Link>
            .
          </p>
        </section>

        {/* Mệnh nạp âm */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <Card className="border-border bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                <Palette className="h-4 w-4 text-gold" aria-hidden /> Mệnh nạp âm: {d.hoaGiap.napAmName}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {d.elementInfo.blurb} Hành {d.hoaGiap.elementName} hợp với hành sinh ra nó và hành nó sinh ra;
              nên hạn chế phối hợp lớn với hành khắc nó. Xem chi tiết ở câu hỏi thường gặp bên dưới.
            </CardContent>
          </Card>
        </section>

        {/* Quan hệ tuổi với năm + ngũ hành */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                  <Compass className="h-4 w-4 text-gold" aria-hidden /> {d.relationLabel}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">{d.relationLine}</CardContent>
            </Card>
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                  <Sparkles className="h-4 w-4 text-gold" aria-hidden /> Ngũ hành tuổi {d.hoaGiap.zodiac.ten} với
                  năm Hỏa
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">{d.nguHanhLine}</CardContent>
            </Card>
          </div>

          {(d.isTamTai || d.isXungThaiTue || d.isNamTuoi) && (
            <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/[0.06] p-4">
              <p className="flex items-center gap-2 font-heading text-sm font-semibold text-amber-300">
                <ShieldAlert className="h-4 w-4" aria-hidden /> Lưu ý phong tục năm 2026
              </p>
              <ul className="mt-2 space-y-1 text-sm leading-relaxed text-foreground/80">
                {d.isNamTuoi && (
                  <li>
                    2026 là <strong>năm tuổi</strong> của bạn (Bản Mệnh Thái Tuế). Theo tục, nên giữ ổn định,
                    làm việc chắc tay. Đây là lưu ý nhẹ, không phải hạn nặng.
                  </li>
                )}
                {d.isXungThaiTue && (
                  <li>
                    Tuổi {d.hoaGiap.canChi} <strong>xung Thái Tuế</strong> năm Ngọ — năm nhiều thay đổi, tránh
                    quyết định lớn lúc nóng vội.
                  </li>
                )}
                {d.isTamTai && (
                  <li>
                    Tuổi {d.hoaGiap.canChi} <strong>có Tam Tai</strong> năm 2026 (nhóm 3 năm{' '}
                    {d.tamTaiChis.join(', ')}). Nên thận trọng khi khởi sự lớn — tham khảo, không phải định
                    mệnh.
                  </li>
                )}
              </ul>
            </div>
          )}
        </section>

        {/* Bảng sao hạn theo năm sinh, MỘT giới */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Sao hạn 2026 cho {d.hoaGiap.canChi} {d.genderMangLabel}
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            {d.birthRows.length > 0
              ? `Trong khoảng năm sinh còn phổ biến (1936–2020), tuổi ${d.hoaGiap.canChi} rơi vào ${d.birthRows.length === 1 ? 'năm sinh sau' : 'các năm sinh sau'}. Sao hạn (Cửu Diệu) tính theo tuổi mụ và giới tính cho năm 2026.`
              : `Sao hạn (Cửu Diệu) tính theo tuổi mụ và giới tính, đổi mỗi năm.`}
          </p>
          {d.birthRows.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">
                      Năm sinh
                    </th>
                    <th scope="col" className="px-3 py-2 font-medium">
                      Tuổi mụ
                    </th>
                    <th scope="col" className="px-3 py-2 font-medium">
                      Sao chiếu
                    </th>
                    <th scope="col" className="px-3 py-2 font-medium">
                      Loại
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {d.birthRows.map((r) => (
                    <tr key={r.birthYear} className="text-foreground/85">
                      <td className="px-3 py-2 font-mono">{r.birthYear}</td>
                      <td className="px-3 py-2">{r.tuoiMu}</td>
                      <td className="px-3 py-2">
                        <span className={TYPE_BADGE[r.sao.type]}>{r.sao.name}</span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">({TYPE_WORD[r.sao.type]})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          <p className="mt-3 text-xs text-muted-foreground">
            Muốn xem chi tiết từng sao (ý nghĩa, tháng cần lưu ý) thì tra ở trang{' '}
            <Link href={`/sao-han/${congiap}`} className="text-gold hover:underline">
              Sao hạn tuổi {d.hoaGiap.zodiac.ten}
            </Link>
            {d.banMenhHref ? (
              <>
                {' '}
                · xem thêm{' '}
                <Link href={d.banMenhHref} className="text-gold hover:underline">
                  ngũ hành bản mệnh sinh năm {d.birthRows[0]!.birthYear}
                </Link>
              </>
            ) : null}
            .
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
                <CardContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bắt email */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-border bg-card/40 p-6">
            <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
              Nhận nhắc theo mùa cho tuổi {d.hoaGiap.canChi}
            </h2>
            <OccasionLeadCapture
              source={`tu-vi-2026-${congiap}-${hoagiap}`}
              capturedEvent="lead_capture_tu_vi_2026"
              capturedProps={{ congiap, hoagiap, gender: d.gender }}
              blurb={`Chưa muốn xem chi tiết ngay? Để lại email, chúng tôi báo bạn khi có bản tử vi 2026 đầy đủ cho tuổi ${d.hoaGiap.canChi} và các bài theo mùa (sao hạn, ngày tốt, xem ngày). Thi thoảng thôi, không spam.`}
              cta="Nhận thông báo"
            />
          </div>
        </section>

        {/* CTA cá nhân hoá */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Tử Vi 2026 riêng bạn, không chỉ theo hoa giáp
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Khung theo hoa giáp ở trên là chung cho mọi {d.genderMangLabel.toLowerCase()} tuổi{' '}
              {d.hoaGiap.canChi}. Lá số riêng của bạn còn phụ thuộc ngày giờ sinh, đại vận và lưu niên cá nhân.
              Lập lá số 2 phút để xem chi tiết thật của riêng mình.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/onboarding?intent=tu-vi-2026">Lập lá số miễn phí</Link>
              </Button>
              <Link
                href="/tu-vi"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Cẩm nang Tử Vi <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* Liên kết chéo */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Xem thêm</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/tu-vi-2026/${congiap}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
            >
              <span aria-hidden="true">{d.hoaGiap.zodiac.emoji}</span> Tuổi {d.hoaGiap.zodiac.ten} (tổng quan)
            </Link>
            <Link
              href={d.otherGenderHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
            >
              <Users className="h-3.5 w-3.5" aria-hidden /> {d.hoaGiap.canChi}{' '}
              {d.genderLabel === 'Nam' ? 'Nữ Mạng' : 'Nam Mạng'}
            </Link>
            <Link
              href={`/sao-han/${congiap}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
            >
              Sao hạn tuổi {d.hoaGiap.zodiac.ten}
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            hieu.asia tính các yếu tố Can Chi (hợp xung năm, Tam Tai, sao hạn, mệnh nạp âm) một cách minh bạch
            để bạn tham khảo. Đây là phong tục dân gian, không phải lời phán số mệnh, và hieu.asia không bán lễ
            giải hạn.
          </p>
        </section>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools current="/tu-vi-2026" />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/onboarding?intent=tu-vi-2026" trackId={`tu-vi-2026-${congiap}-${hoagiap}`} />
    </div>
  );
}
