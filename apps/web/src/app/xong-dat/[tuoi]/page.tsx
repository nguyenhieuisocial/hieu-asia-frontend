import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { XongDatChecker } from '@/components/xong-dat/XongDatChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { HOST_YEARS, TARGET_YEAR, buildHostPage, slugOf, yearFromSlug } from '../years';

// Fixed set of SEO landing slugs — unknown slugs 404 instead of rendering.
export const dynamicParams = false;

export function generateStaticParams() {
  return HOST_YEARS.map((y) => ({ tuoi: slugOf(y) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tuoi: string }>;
}): Promise<Metadata> {
  const { tuoi } = await params;
  const year = yearFromSlug(tuoi);
  // notFound() ngay trong generateMetadata → 404 thật trước first flush
  // (site render động vì next-intl; notFound() trong page chỉ ra soft-404).
  if (!year) notFound();
  const data = buildHostPage(year);
  const url = `https://hieu.asia/xong-dat/${data.slug}`;
  return {
    title: data.seoTitle,
    description: data.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: data.seoTitle,
      description: data.seoDescription,
      url,
      type: 'website' as const,
    },
  };
}

export default async function XongDatHostYearPage({
  params,
}: {
  params: Promise<{ tuoi: string }>;
}) {
  const { tuoi } = await params;
  const year = yearFromSlug(tuoi);
  if (!year) notFound();
  const data = buildHostPage(year);
  const neighbors = HOST_YEARS.filter((y) => y !== year && Math.abs(y - year) <= 2);

  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: data.seoTitle,
            description: data.seoDescription,
            url: `/xong-dat/${data.slug}`,
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tuổi xông đất', url: '/xong-dat' },
            { name: `Gia chủ sinh ${year}`, url: `/xong-dat/${data.slug}` },
          ]),
          faqPage(data.faqs),
        ]}
      />
      <ToolPageShell
        eyebrow={`Tết ${TARGET_YEAR} · Gia chủ sinh ${year}`}
        icon={<span aria-hidden="true">🧧</span>}
        title={
          <>
            <GoldAccent>Tuổi xông đất {TARGET_YEAR}</GoldAccent> cho gia chủ sinh năm {year}
          </>
        }
        description={`Gia chủ sinh ${year} (${data.host.canChi}) đón Tết ${data.target.canChi}: gợi ý tuổi xông đất chấm minh bạch theo tam hợp, lục hợp và ngũ hành — tham khảo phong tục, không phán định.`}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tuổi xông đất', href: '/xong-dat' },
          { label: `Sinh năm ${year}` },
        ]}
      >
        <section className="space-y-8">
          <XongDatChecker defaultHostYear={year} />

          {data.caution.length > 0 && (
            <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
              <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
                Nhóm tuổi nên cân nhắc — gia chủ {data.host.canChi} {year}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Theo tục, các nhóm dưới đây thường được dè dặt khi chọn xông đất — là lời nhắc tham
                khảo, không phải điềm xấu.
              </p>
              <ul className="mt-3 space-y-1.5 pl-5 text-sm text-muted-foreground list-disc">
                {data.caution.map((c) => (
                  <li key={c.zodiac.slug}>
                    <strong className="text-foreground">
                      Tuổi {c.zodiac.ten} <span aria-hidden="true">{c.zodiac.emoji}</span>
                    </strong>
                    {' — '}
                    {c.reasons.join('; ')}.
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Những điều nên biết
            </h2>
            <ul className="mt-3 space-y-1.5 pl-5 text-sm text-muted-foreground list-disc">
              {data.considerations.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Câu hỏi thường gặp
            </h2>
            <dl className="mt-4 space-y-4">
              {data.faqs.map((f, i) => (
                <div key={i}>
                  <dt className="font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Nhận nhắc theo mùa
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source={`xong-dat-${tuoi}`}
                capturedEvent="lead_capture_xong_dat"
                capturedProps={{ tuoi }}
                blurb={`Để lại email nếu bạn muốn được báo khi có bản gợi ý tuổi xông đất đầy đủ hơn cho gia chủ sinh ${year}, cùng nội dung mới theo mùa Tết. Thi thoảng thôi, không spam.`}
                cta="Nhận nhắc"
              />
            </div>
          </section>

          <nav aria-label="Tuổi xông đất theo năm sinh khác" className="text-sm">
            <span className="text-muted-foreground">Xem thêm: </span>
            <Link href="/xong-dat" className="text-gold hover:underline">
              Tuổi xông đất {TARGET_YEAR} (tổng quan)
            </Link>
            {neighbors.map((y) => (
              <span key={y}>
                {', '}
                <Link href={`/xong-dat/${slugOf(y)}`} className="text-gold hover:underline">
                  gia chủ sinh {y}
                </Link>
              </span>
            ))}
          </nav>
        </section>
      </ToolPageShell>
    </>
  );
}
