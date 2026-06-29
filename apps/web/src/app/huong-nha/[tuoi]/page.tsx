import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { HuongNhaChecker } from '@/components/huong-nha/HuongNhaChecker';
import { groupLabel, STAR_INFO, type HuongNhaResult } from '@/lib/huong-nha';
import { BIRTH_YEARS, buildYearPage, slugOf, yearFromSlug } from '../years';

export const dynamicParams = false;

export function generateStaticParams() {
  return BIRTH_YEARS.map((y) => ({ tuoi: slugOf(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ tuoi: string }> }): Promise<Metadata> {
  const { tuoi } = await params;
  const year = yearFromSlug(tuoi);
  if (!year) return { title: 'Xem hướng nhà hợp tuổi' };
  const d = buildYearPage(year);
  const url = `https://hieu.asia/huong-nha/${d.slug}`;
  return {
    title: d.seoTitle,
    description: d.seoDescription,
    alternates: { canonical: url },
    openGraph: { title: d.seoTitle, description: d.seoDescription, url, type: 'website' as const },
  };
}

function ResultBlock({ label, r }: { label: string; r: HuongNhaResult }) {
  return (
    <div className="rounded-lg border bg-card/40 p-4">
      <p className="text-sm text-muted-foreground">
        {label} — cung <strong className="text-gold">{r.cungPhi}</strong> ({groupLabel(r.group)})
      </p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Hướng tốt</div>
          <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
            {r.good.map((d) => (
              <li key={d.direction} className="mb-1.5">
                <strong className="text-foreground">{d.direction}</strong> — {STAR_INFO[d.star].name}
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground/80">
                  {STAR_INFO[d.star].blurb}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-rose-700 dark:text-rose-300">Hướng tránh</div>
          <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
            {r.bad.map((d) => (
              <li key={d.direction} className="mb-1.5">
                <strong className="text-foreground">{d.direction}</strong> — {STAR_INFO[d.star].name}
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground/80">
                  {STAR_INFO[d.star].blurb}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default async function HuongNhaYearPage({ params }: { params: Promise<{ tuoi: string }> }) {
  const { tuoi } = await params;
  const year = yearFromSlug(tuoi);
  if (!year) notFound();
  const d = buildYearPage(year);

  return (
    <>
      <JsonLd
        data={[
          webPage({ name: d.seoTitle, description: d.seoDescription, url: `/huong-nha/${d.slug}` }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xem hướng nhà', url: '/huong-nha' },
            { name: `Tuổi ${d.year}`, url: `/huong-nha/${d.slug}` },
          ]),
          faqPage(d.faqs),
        ]}
      />
      <ToolPageShell
        eyebrow={`Hướng nhà · Tuổi ${d.year}`}
        icon={<span aria-hidden="true">🧭</span>}
        title={
          <>
            Sinh năm {d.year} <GoldAccent>hợp hướng nhà nào?</GoldAccent>
          </>
        }
        description={`Gia chủ sinh năm ${d.year}: nam thuộc cung ${d.nam.cungPhi}, nữ thuộc cung ${d.nu.cungPhi}. Dưới đây là 4 hướng tốt – 4 hướng nên tránh cho từng giới, tính theo Bát Trạch. Tham khảo theo phong tục, quyết định là của bạn.`}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Xem hướng nhà', href: '/huong-nha' },
          { label: `Tuổi ${d.year}` },
        ]}
      >
        <section className="space-y-8">
          <section className="space-y-3">
            <ResultBlock label={`Gia chủ NAM sinh ${d.year}`} r={d.nam} />
            <ResultBlock label={`Gia chủ NỮ sinh ${d.year}`} r={d.nu} />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Hướng tốt nhất (Sinh Khí) hợp đặt cửa chính hoặc bàn làm việc; Thiên Y hợp hướng giường,
              bếp. Bát Trạch là tập tục tham khảo — không phán giàu nghèo. Cung phi tính theo năm âm
              lịch (sinh trước Tết nhập lùi 1 năm).
            </p>
          </section>

          <HuongNhaChecker defaultYear={d.year} defaultGender="nam" />

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
              Câu hỏi thường gặp — sinh năm {d.year}
            </h2>
            <dl className="mt-4 space-y-4">
              {d.faqs.map((f, i) => (
                <div key={i}>
                  <dt className="font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
              Nhận nhắc theo mùa
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source={`huong-nha-${tuoi}`}
                capturedEvent="lead_capture_huong_nha"
                capturedProps={{ tuoi }}
                blurb={`Để lại email, chúng tôi sẽ báo bạn khi có bản hướng nhà hợp tuổi ${d.year} đầy đủ hơn và nội dung phong thuỷ mới theo mùa. Thi thoảng thôi, không spam.`}
                cta="Nhận nhắc"
              />
            </div>
          </section>

          <nav aria-label="Xem hướng nhà tuổi khác" className="text-sm leading-7">
            <span className="text-muted-foreground">Bước tiếp: </span>
            <Link href="/xem-tuoi-lam-nha" className="text-gold hover:underline">
              Xem tuổi làm nhà {d.year}
            </Link>
            {', '}
            <Link href="/xem-ngay/dong-tho" className="text-gold hover:underline">
              chọn ngày động thổ
            </Link>
            <br />
            <span className="text-muted-foreground">Tuổi khác: </span>
            <Link href="/huong-nha" className="text-gold hover:underline">
              Bảng tổng quan
            </Link>
            {BIRTH_YEARS.filter((y) => y !== d.year).map((y) => (
              <span key={y}>
                {', '}
                <Link href={`/huong-nha/${slugOf(y)}`} className="text-gold hover:underline">
                  {y}
                </Link>
              </span>
            ))}
          </nav>
        </section>
      </ToolPageShell>
    </>
  );
}
