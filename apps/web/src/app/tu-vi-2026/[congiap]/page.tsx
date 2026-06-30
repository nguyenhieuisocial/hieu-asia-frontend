import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ArrowRight, Sparkles, ShieldAlert, Compass } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { DownloadToolPdfButton, type ToolPdfPayload } from '@/components/tools/DownloadToolPdfButton';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { ZODIAC } from '@/lib/hop-tuoi-pairs';
import { buildConGiap2026, CON_GIAP_SLUGS, YEAR_RANGE } from '../con-giap-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return CON_GIAP_SLUGS.map((congiap) => ({ congiap }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ congiap: string }>;
}): Promise<Metadata> {
  const { congiap } = await params;
  const d = buildConGiap2026(congiap);
  if (!d) return { title: 'Tử Vi 2026 theo con giáp' };
  const url = `https://hieu.asia/tu-vi-2026/${congiap}`;
  return {
    title: d.seoTitle,
    description: d.seoDescription,
    alternates: { canonical: url },
    // Route-level openGraph REPLACES root-layout openGraph — must re-declare
    // images or social previews render blank.
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

export default async function TuVi2026ConGiapPage({
  params,
}: {
  params: Promise<{ congiap: string }>;
}) {
  const { congiap } = await params;
  const d = buildConGiap2026(congiap);
  if (!d) notFound();

  const others = ZODIAC.filter((z) => z.slug !== congiap);

  const JSONLD = [
    article({
      headline: d.seoTitle,
      description: d.seoDescription,
      url: `/tu-vi-2026/${congiap}`,
      image: '/og-image.jpg',
      datePublished: '2025-12-01',
      dateModified: '2026-06-19',
      type: 'Article',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Tử Vi 2026', url: '/tu-vi-2026' },
      { name: `Tuổi ${d.z.ten}`, url: `/tu-vi-2026/${congiap}` },
    ]),
    faqPage(d.faqs),
  ];

  const hanLines = [
    d.isNamTuoi ? '• Năm tuổi (Bản Mệnh) — đúng con giáp của mình.' : '',
    d.isXungThaiTue ? '• Xung Thái Tuế — năm dễ nhiều thay đổi, nên chủ động & cẩn trọng.' : '',
    d.isTamTai ? `• Tam Tai — năm 2026 (nhóm ${d.tamTaiChis.join(', ')}).` : '',
  ].filter(Boolean);
  const pdfPayload: ToolPdfPayload = {
    title: `Tử Vi 2026 (Bính Ngọ) — tuổi ${d.z.ten} — hieu.asia`,
    subtitle: `Con ${d.animal} · ${d.relationLabel}`,
    hero: { big: `Tử Vi 2026 — tuổi ${d.z.ten}`, small: `Con ${d.animal} · năm Bính Ngọ (Hỏa)` },
    sections: [
      { heading: 'Tổng quan năm 2026', text: d.verdictShort },
      { heading: d.relationLabel, text: d.relationLine },
      { heading: `Ngũ hành tuổi ${d.z.ten} với năm`, text: d.nguHanhLine },
      ...(hanLines.length > 0 ? [{ heading: 'Hạn cần lưu ý (phong tục)', text: hanLines.join('\n') }] : []),
      {
        heading: 'Lưu ý',
        text: 'Đây là gợi ý chung theo con giáp — vận thật còn tùy ngày giờ sinh và cách bạn hành động trong năm, không phải tiên đoán số mệnh.',
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
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
            Tử Vi 2026 · Năm Bính Ngọ hành Hỏa · {YEAR_RANGE}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            <span aria-hidden="true" className="mr-2">
              {d.z.emoji}
            </span>
            Tử Vi 2026 tuổi {d.z.ten} (con {d.animal})
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            {d.verdictShort}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding?intent=tu-vi-2026">Xem tử vi 2026 của riêng tôi</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/tu-vi-2026">Tổng quan năm Bính Ngọ</Link>
            </Button>
            <DownloadToolPdfButton source="pdf-tu-vi-2026" label="Tải PDF tử vi 2026" payload={pdfPayload} />
          </div>
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
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {d.relationLine}
              </CardContent>
            </Card>
            <Card className="border-border bg-card/40">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 font-heading text-base text-foreground">
                  <Sparkles className="h-4 w-4 text-gold" aria-hidden /> Ngũ hành tuổi {d.z.ten} với
                  năm Hỏa
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {d.nguHanhLine}
              </CardContent>
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
                    2026 là <strong>năm tuổi</strong> của bạn (Bản Mệnh Thái Tuế). Theo tục, nên giữ
                    ổn định, làm việc chắc tay. Đây là lưu ý nhẹ, không phải hạn nặng.
                  </li>
                )}
                {d.isXungThaiTue && (
                  <li>
                    Tuổi {d.z.ten} <strong>xung Thái Tuế</strong> năm Ngọ — năm nhiều thay đổi, tránh
                    quyết định lớn lúc nóng vội.
                  </li>
                )}
                {d.isTamTai && (
                  <li>
                    Tuổi {d.z.ten} <strong>có Tam Tai</strong> năm 2026 (nhóm 3 năm{' '}
                    {d.tamTaiChis.join(', ')}). Nên thận trọng khi khởi sự lớn — tham khảo, không phải
                    định mệnh.
                  </li>
                )}
              </ul>
            </div>
          )}
        </section>

        {/* Bảng sao hạn theo năm sinh */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Sao hạn 2026 cho tuổi {d.z.ten} theo từng năm sinh
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            Sao hạn (Cửu Diệu) đổi mỗi năm theo tuổi mụ và giới tính, nên cùng tuổi {d.z.ten} nhưng
            khác năm sinh sẽ gặp sao khác nhau. Bảng dưới tính cho năm 2026, tham khảo theo phong tục.
          </p>
          {/* Mobile: danh sách thẻ xếp dọc (4 cột tràn ở 390px) */}
          <ul className="space-y-2 sm:hidden">
            {d.cohorts.map((c) => (
              <li
                key={c.birthYear}
                className="rounded-lg border border-border bg-card/40 p-3 text-foreground/85"
              >
                <p className="flex items-baseline justify-between">
                  <span className="font-mono font-medium">{c.birthYear}</span>
                  <span className="text-xs text-muted-foreground">Tuổi mụ {c.tuoiMu}</span>
                </p>
                <p className="mt-1.5 text-sm">
                  <span className="text-muted-foreground">Nam: </span>
                  <span className={TYPE_BADGE[c.saoNam.type]}>{c.saoNam.name}</span>{' '}
                  <span className="text-muted-foreground">({TYPE_WORD[c.saoNam.type]})</span>
                </p>
                <p className="mt-0.5 text-sm">
                  <span className="text-muted-foreground">Nữ: </span>
                  <span className={TYPE_BADGE[c.saoNu.type]}>{c.saoNu.name}</span>{' '}
                  <span className="text-muted-foreground">({TYPE_WORD[c.saoNu.type]})</span>
                </p>
              </li>
            ))}
          </ul>
          {/* Desktop: bảng đầy đủ */}
          <div className="hidden overflow-x-auto rounded-lg border border-border sm:block">
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
                    Nam — sao chiếu
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Nữ — sao chiếu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {d.cohorts.map((c) => (
                  <tr key={c.birthYear} className="text-foreground/85">
                    <td className="px-3 py-2 font-mono">{c.birthYear}</td>
                    <td className="px-3 py-2">{c.tuoiMu}</td>
                    <td className="px-3 py-2">
                      <span className={TYPE_BADGE[c.saoNam.type]}>{c.saoNam.name}</span>{' '}
                      <span className="text-muted-foreground">({TYPE_WORD[c.saoNam.type]})</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={TYPE_BADGE[c.saoNu.type]}>{c.saoNu.name}</span>{' '}
                      <span className="text-muted-foreground">({TYPE_WORD[c.saoNu.type]})</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Muốn xem chi tiết từng sao (ý nghĩa, tháng cần lưu ý) thì tra ở trang{' '}
            <Link href={`/sao-han/${congiap}`} className="text-gold hover:underline">
              Sao hạn tuổi {d.z.ten}
            </Link>
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
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bắt email — người quan tâm nhưng chưa sẵn sàng xem chi tiết */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-border bg-card/40 p-6">
            <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
              Nhận nhắc theo mùa cho tuổi {d.z.ten}
            </h2>
            <OccasionLeadCapture
              source={`tu-vi-2026-${congiap}`}
              capturedEvent="lead_capture_tu_vi_2026"
              capturedProps={{ congiap }}
              blurb={`Chưa muốn xem chi tiết ngay? Để lại email, chúng tôi báo bạn khi có bản tử vi 2026 đầy đủ cho tuổi ${d.z.ten} và các bài theo mùa (sao hạn, ngày tốt, xem ngày). Thi thoảng thôi, không spam.`}
              cta="Nhận thông báo"
            />
          </div>
        </section>

        {/* CTA cá nhân hoá */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Tử Vi 2026 riêng bạn, không chỉ theo con giáp
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Khung theo con giáp ở trên là chung cho mọi người tuổi {d.z.ten}. Lá số riêng của bạn
              còn phụ thuộc ngày giờ sinh, đại vận và lưu niên cá nhân. Lập lá số 2 phút để xem chi
              tiết thật của riêng mình.
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

        {/* Liên kết 11 con giáp còn lại */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Tử Vi 2026 cho các tuổi khác
          </h2>
          <div className="flex flex-wrap gap-2">
            {others.map((z) => (
              <Link
                key={z.slug}
                href={`/tu-vi-2026/${z.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
              >
                <span aria-hidden="true">{z.emoji}</span> Tuổi {z.ten}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            hieu.asia tính các yếu tố Can Chi (hợp xung năm, Tam Tai, sao hạn) một cách minh bạch để
            bạn tham khảo. Đây là phong tục dân gian, không phải lời phán số mệnh, và hieu.asia không
            bán lễ giải hạn.
          </p>
        </section>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools current="/tu-vi-2026" />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/onboarding?intent=tu-vi-2026" trackId={`tu-vi-2026-${congiap}`} />
    </div>
  );
}
