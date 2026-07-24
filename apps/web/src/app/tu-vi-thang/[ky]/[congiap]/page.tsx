import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ArrowRight, CalendarDays, Compass, Sparkles } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { expiredMonthTarget } from '@/lib/seasonal';
import { ZODIAC } from '@/lib/hop-tuoi-pairs';
import {
  buildThangConGiap,
  buildableMonths,
  liveMonths,
  monthSlug,
  parseMonthSlug,
  spanNote,
  type DayNote,
} from '@/lib/tu-vi-thang-data';

export const dynamicParams = false;

// PHẢI sinh CẢ HAI segment ở đây. `[ky]/page.tsx` là một route khác (không phải
// layout) nên Next KHÔNG ghép generateStaticParams của nó xuống route con —
// trả về mỗi { congiap } thì route này không được prerender trang nào.
// Danh sách gồm cả tháng đã qua: chúng chỉ 308 về evergreen (xem bên dưới).
export function generateStaticParams() {
  return buildableMonths().flatMap((k) => {
    const ky = monthSlug(k);
    return ZODIAC.map((z) => ({ ky, congiap: z.slug }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ky: string; congiap: string }>;
}): Promise<Metadata> {
  const { ky, congiap } = await params;
  const k = parseMonthSlug(ky);
  if (!k) notFound();
  const d = buildThangConGiap(k, congiap);
  if (!d) notFound();
  const url = `https://hieu.asia/tu-vi-thang/${ky}/${congiap}`;
  return {
    title: d.seoTitle,
    description: d.seoDescription,
    alternates: { canonical: url },
    // Route-level openGraph THAY THẾ openGraph của root layout — phải khai lại
    // images, nếu không preview mạng xã hội sẽ trắng.
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

function DayChips({ days, month }: { days: DayNote[]; month: number }) {
  if (days.length === 0) {
    return <p className="mt-2 text-sm text-muted-foreground">Tháng này không có ngày nào.</p>;
  }
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {days.map((d) => (
        <li
          key={d.day}
          className="rounded-lg border border-border bg-card/40 px-2.5 py-1.5 text-sm text-foreground/85"
        >
          <span className="font-mono font-medium">
            {d.day}/{month}
          </span>{' '}
          <span className="text-muted-foreground">
            {d.weekday} · {d.canChi}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function TuViThangConGiapPage({
  params,
}: {
  params: Promise<{ ky: string; congiap: string }>;
}) {
  const { ky, congiap } = await params;
  const k = parseMonthSlug(ky);
  if (!k) notFound();

  // Mùa vụ: hết tháng → 308 về evergreen (file vẫn giữ, không mất backlink).
  const evergreen = expiredMonthTarget(k.year, k.month);
  if (evergreen) permanentRedirect(evergreen);

  const d = buildThangConGiap(k, congiap);
  if (!d) notFound();

  const m = d.month;
  const otherZodiacs = ZODIAC.filter((z) => z.slug !== congiap);
  const otherMonths = liveMonths().filter((x) => monthSlug(x) !== m.slug);
  const hopDays = [...d.days.tamHop, ...d.days.lucHop].sort((a, b) => a.day - b.day);

  const JSONLD = [
    article({
      headline: d.seoTitle,
      description: d.seoDescription,
      url: `/tu-vi-thang/${ky}/${congiap}`,
      image: '/og-image.jpg',
      type: 'Article',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Tử vi tháng', url: '/tu-vi-thang' },
      { name: `Tháng ${k.month}/${k.year}`, url: `/tu-vi-thang/${ky}` },
      { name: `Tuổi ${d.z.ten}`, url: `/tu-vi-thang/${ky}/${congiap}` },
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
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/tu-vi-thang" className="hover:text-gold">
              Tử vi tháng
            </Link>
            <span className="mx-1.5">/</span>
            <Link href={`/tu-vi-thang/${ky}`} className="hover:text-gold">
              Tháng {k.month}/{k.year}
            </Link>
            <span className="mx-1.5">/</span>
            <span>Tuổi {d.z.ten}</span>
          </nav>
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
            Trụ tháng {m.main.label} · nạp âm {m.main.napAm.name} · năm {m.yearCanChi.name}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            <span aria-hidden="true" className="mr-2">
              {d.z.emoji}
            </span>
            Tử vi tháng {k.month}/{k.year} tuổi {d.z.ten} (con {d.animal})
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            {d.verdictShort}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/la-so-tu-vi">Lập lá số Tử Vi của bạn</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/hop-tuoi">Xem hợp tuổi</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{spanNote(m)}</p>
        </section>

        {/* Quan hệ chi + ngũ hành */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Tuổi {d.z.ten} với trụ tháng {m.main.label}
          </h2>
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
                  <Sparkles className="h-4 w-4 text-gold" aria-hidden /> Ngũ hành với chi tháng{' '}
                  {m.main.chi}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {d.chiElementLine}
              </CardContent>
            </Card>
            <Card className="border-border bg-card/40 sm:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-base text-foreground">
                  Can tháng {m.main.can} — bối cảnh bên ngoài
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {d.canElementLine}
              </CardContent>
            </Card>
          </div>
          <div className="mt-3 rounded-lg border border-border bg-card/40 p-4">
            <p className="font-heading text-sm font-semibold text-foreground">
              Bối cảnh năm chứa tháng này
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {d.yearContextLine}
            </p>
          </div>
        </section>

        {/* Bảng ngày trong tháng */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-2 flex items-center gap-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            <CalendarDays className="h-5 w-5 text-gold" aria-hidden />
            Ngày đáng chú ý trong tháng {k.month}/{k.year} cho tuổi {d.z.ten}
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            Mỗi ngày có một địa chi riêng. Dưới đây là các ngày trong tháng {k.month}/{k.year} có
            địa chi đứng ở thế đặc biệt so với chi tuổi {d.z.ten} — tính trực tiếp từ can chi ngày,
            bạn đối chiếu lại với lịch vạn niên được.
          </p>

          <div className="space-y-5">
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">
                Ngày hợp chi tuổi ({hopDays.length} ngày)
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Địa chi ngày Tam Hợp hoặc Lục Hợp với chi {d.z.ten}. Theo tục, đây là những ngày
                hợp để bàn việc cần người khác đồng thuận.
              </p>
              <DayChips days={hopDays} month={k.month} />
            </div>

            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">
                Ngày xung chi tuổi ({d.days.lucXung.length} ngày)
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Địa chi ngày Lục Xung với chi {d.z.ten}. Không phải ngày xấu tuyệt đối — chỉ là gợi
                ý nên để dư thời gian và tránh chốt việc lớn khi đang vội.
              </p>
              <DayChips days={d.days.lucXung} month={k.month} />
            </div>

            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">
                Ngày dễ hiểu lầm ({d.days.lucHai.length} ngày)
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Địa chi ngày Lục Hại với chi {d.z.ten} — kiểu vướng vặt: sai hẹn, thiếu giấy tờ,
                nói một đằng hiểu một nẻo. Xác nhận lại bằng văn bản là đủ.
              </p>
              <DayChips days={d.days.lucHai} month={k.month} />
            </div>

            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">
                Ngày trùng chi tuổi ({d.days.trungChi.length} ngày)
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ngày mang đúng chi {d.z.ten}. Không phải hạn; dân gian xem đây là ngày việc của bạn
                dễ nổi lên rõ hơn.
              </p>
              <DayChips days={d.days.trungChi} month={k.month} />
            </div>
          </div>

          <p className="mt-5 rounded-lg border border-border bg-card/40 p-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Giới hạn của bảng này:</strong> nó chỉ xét MỘT yếu
            tố — quan hệ địa chi của ngày với chi tuổi bạn. Một ngày tốt cho việc cụ thể (cưới hỏi,
            khai trương, ký kết) còn xét trực, sao, giờ và mục đích. Tra đầy đủ ở{' '}
            <Link href="/xem-ngay" className="text-gold hover:underline">
              Xem ngày tốt
            </Link>{' '}
            hoặc{' '}
            <Link href="/lich-van-nien" className="text-gold hover:underline">
              Lịch vạn niên
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

        {/* Bắt email theo mùa */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-border bg-card/40 p-6">
            <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
              Nhận nhắc tháng sau cho tuổi {d.z.ten}
            </h2>
            <OccasionLeadCapture
              source={`tu-vi-thang-${ky}-${congiap}`}
              capturedEvent="lead_capture_tu_vi_thang"
              capturedProps={{ ky, congiap }}
              blurb={`Để lại email nếu bạn muốn được báo khi trang tử vi tháng kế tiếp cho tuổi ${d.z.ten} lên sóng. Mỗi tháng một lần, không spam.`}
              cta="Nhận nhắc"
            />
          </div>
        </section>

        {/* CTA cá nhân hoá */}
        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Tháng {k.month}/{k.year} của riêng bạn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Mọi người tuổi {d.z.ten} đọc chung trang này, vì nó chỉ dùng một dữ kiện là con giáp.
              Lá số theo ngày giờ sinh mới cho biết tháng này rơi vào cung nào, đại vận nào của
              riêng bạn. Lập lá số mất khoảng hai phút và miễn phí.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/la-so-tu-vi">Lập lá số Tử Vi</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/hop-tuoi">Xem hợp tuổi</Link>
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

        {/* Điều hướng nội bộ */}
        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
            Tháng {k.month}/{k.year} cho các tuổi khác
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherZodiacs.map((z) => (
              <Link
                key={z.slug}
                href={`/tu-vi-thang/${ky}/${z.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
              >
                <span aria-hidden="true">{z.emoji}</span> Tuổi {z.ten}
              </Link>
            ))}
          </div>

          {otherMonths.length > 0 && (
            <>
              <h2 className="mb-3 mt-8 font-heading text-lg font-semibold text-foreground">
                Tuổi {d.z.ten} ở các tháng khác
              </h2>
              <div className="flex flex-wrap gap-2">
                {otherMonths.map((o) => (
                  <Link
                    key={monthSlug(o)}
                    href={`/tu-vi-thang/${monthSlug(o)}/${congiap}`}
                    className="inline-flex items-center rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
                  >
                    Tháng {o.month}/{o.year}
                  </Link>
                ))}
              </div>
            </>
          )}

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            hieu.asia tính các yếu tố Can Chi (trụ tháng theo tiết khí, hợp xung, can chi ngày) một
            cách minh bạch để bạn tham khảo khi sắp lịch. Đây là phong tục dân gian, không phải lời
            phán về số mệnh, và hieu.asia không bán lễ giải hạn.
          </p>
        </section>

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools current="/tu-vi-thang" />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/la-so-tu-vi" trackId={`tu-vi-thang-${ky}-${congiap}`} />
    </div>
  );
}
