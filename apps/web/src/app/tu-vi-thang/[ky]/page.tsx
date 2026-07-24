import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { Button } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, faqPage, itemList, webPage } from '@/lib/seo/jsonld';
import { expiredMonthTarget } from '@/lib/seasonal';
import {
  buildMonthOverview,
  buildMonthTable,
  buildableMonths,
  liveMonths,
  monthSlug,
  parseMonthSlug,
  spanNote,
} from '@/lib/tu-vi-thang-data';

// Tập slug cố định tại build. Gồm cả vài tháng ĐÃ QUA — không phải để hiển thị
// (chúng 308 ngay ở dòng đầu component), mà để URL từng nằm trong sitemap không
// rơi vào 404 sau khi hết tháng.
export const dynamicParams = false;

export function generateStaticParams() {
  return buildableMonths().map((k) => ({ ky: monthSlug(k) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ky: string }>;
}): Promise<Metadata> {
  const { ky } = await params;
  const k = parseMonthSlug(ky);
  if (!k) notFound();
  const m = buildMonthOverview(k);
  const title = `Tử vi tháng ${k.month}/${k.year} cho 12 con giáp (tháng ${m.main.label})`;
  const description = `Tháng ${k.month}/${k.year} mang trụ tháng ${m.main.label} — can ${m.main.can} hành ${m.main.canElement}, chi ${m.main.chi} hành ${m.main.chiElement}. Bảng đối chiếu 12 con giáp với chi tháng và số ngày hợp/xung trong tháng.`;
  const url = `https://hieu.asia/tu-vi-thang/${m.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', locale: 'vi_VN' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function TuViThangMonthPage({
  params,
}: {
  params: Promise<{ ky: string }>;
}) {
  const { ky } = await params;
  const k = parseMonthSlug(ky);
  if (!k) notFound();

  // Mùa vụ: hết tháng → 308 về evergreen, file vẫn giữ để không mất backlink.
  const evergreen = expiredMonthTarget(k.year, k.month);
  if (evergreen) permanentRedirect(evergreen);

  const m = buildMonthOverview(k);
  const rows = buildMonthTable(k);
  const others = liveMonths().filter((x) => monthSlug(x) !== m.slug);

  const faqs = [
    {
      q: `Tháng ${k.month}/${k.year} là tháng can chi gì?`,
      a: `${spanNote(m)} Trụ tháng ${m.main.label}: can ${m.main.can} hành ${m.main.canElement}, chi ${m.main.chi} hành ${m.main.chiElement}, nạp âm ${m.main.napAm.name} — hành ${m.main.napAm.element}.`,
    },
    {
      q: `Tháng ${k.month}/${k.year} thuộc năm can chi nào?`,
      a: `Thuộc năm ${m.yearCanChi.name} (${m.yearNumber}). Trụ năm trong Bát Tự đổi tại Lập Xuân chứ không đổi ngày 01/01, nên tháng 1 và đầu tháng 2 dương lịch vẫn tính vào năm can chi liền trước — chi tiết này nhiều nơi làm sai.`,
    },
    {
      q: `Tuổi nào hợp tháng ${k.month}/${k.year} nhất?`,
      a: `Theo quan hệ địa chi với chi tháng ${m.main.chi}: ${rows
        .filter((r) => r.relation === 'tam-hop' || r.relation === 'luc-hop')
        .map((r) => `tuổi ${r.z.ten} (${r.relationLabel.replace(' với tháng', '')})`)
        .join(', ')}. Đây là một tín hiệu tham khảo trong nhiều tín hiệu, không phải bảo đảm tháng đó mọi việc sẽ thuận.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <JsonLd
        data={[
          webPage({
            name: `Tử vi tháng ${k.month}/${k.year} cho 12 con giáp`,
            url: `/tu-vi-thang/${m.slug}`,
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tử vi tháng', url: '/tu-vi-thang' },
            { name: `Tháng ${k.month}/${k.year}`, url: `/tu-vi-thang/${m.slug}` },
          ]),
          itemList(
            rows.map((r) => ({
              name: `Tử vi tháng ${k.month}/${k.year} tuổi ${r.z.ten}`,
              url: `/tu-vi-thang/${m.slug}/${r.z.slug}`,
            })),
          ),
          faqPage(faqs),
        ]}
      />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

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
            <span>Tháng {k.month}/{k.year}</span>
          </nav>
          <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
            Trụ tháng {m.main.label} · nạp âm {m.main.napAm.name} · năm {m.yearCanChi.name}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Tử vi tháng {k.month}/{k.year} cho 12 con giáp
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            {spanNote(m)}
          </p>
          <p className="mt-3 text-base leading-relaxed text-foreground/80">
            Can {m.main.can} mang hành {m.main.canElement}, chi {m.main.chi} mang hành{' '}
            {m.main.chiElement}, nạp âm của trụ tháng là {m.main.napAm.name} — hành{' '}
            {m.main.napAm.element}. Bảng dưới đối chiếu chi tháng với từng con giáp; bấm vào một
            tuổi để xem chi tiết kèm danh sách ngày trong tháng.
          </p>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            12 con giáp với chi tháng {m.main.chi}
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Quan hệ địa chi của 12 con giáp với chi tháng {m.main.chi} và số ngày hợp / xung
                trong tháng {k.month}/{k.year}
              </caption>
              <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">Tuổi</th>
                  <th scope="col" className="px-3 py-2 font-medium">Quan hệ với chi tháng</th>
                  <th scope="col" className="px-3 py-2 font-medium">Ngày hợp</th>
                  <th scope="col" className="px-3 py-2 font-medium">Ngày xung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.z.slug} className="text-foreground/85">
                    <td className="px-3 py-2">
                      <Link
                        href={`/tu-vi-thang/${m.slug}/${r.z.slug}`}
                        className="text-gold hover:underline"
                      >
                        <span aria-hidden="true">{r.z.emoji}</span> {r.z.ten}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{r.relationLabel.replace(' với tháng', '')}</td>
                    <td className="px-3 py-2 font-mono">{r.thuanDays}</td>
                    <td className="px-3 py-2 font-mono">{r.xungDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            "Ngày hợp" = ngày có địa chi Tam Hợp hoặc Lục Hợp với chi tuổi; "ngày xung" = ngày Lục
            Xung. Đây mới là một yếu tố. Ngày tốt cho một việc cụ thể còn xét trực, sao và mục đích
            — tra ở{' '}
            <Link href="/xem-ngay" className="text-gold hover:underline">
              Xem ngày tốt
            </Link>
            .
          </p>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Câu hỏi thường gặp
          </h2>
          <dl className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card/40 p-5">
                <dt className="font-heading text-base font-semibold text-foreground">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-10">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Tháng của bạn, không phải tháng của cả nhóm tuổi
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Trang này gộp mọi người cùng con giáp vào một khung. Lá số theo ngày giờ sinh mới cho
              biết tháng này rơi vào cung nào của riêng bạn.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/la-so-tu-vi">Lập lá số Tử Vi</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/hop-tuoi">Xem hợp tuổi</Link>
              </Button>
            </div>
          </div>
        </section>

        {others.length > 0 && (
          <section className="relative mx-auto max-w-3xl px-6 pb-12">
            <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
              Các tháng khác
            </h2>
            <div className="flex flex-wrap gap-2">
              {others.map((o) => (
                <Link
                  key={monthSlug(o)}
                  href={`/tu-vi-thang/${monthSlug(o)}`}
                  className="inline-flex items-center rounded-full border border-border bg-card/40 px-3 py-1.5 text-sm text-foreground/80 transition hover:border-gold/40 hover:text-gold"
                >
                  Tháng {o.month}/{o.year}
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mx-auto max-w-6xl px-6 pb-12">
          <RelatedTools current="/tu-vi-thang" />
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta href="/la-so-tu-vi" trackId={`tu-vi-thang-${m.slug}`} />
    </div>
  );
}
