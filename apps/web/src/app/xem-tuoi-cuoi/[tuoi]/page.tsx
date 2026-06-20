import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { XemTuoiCuoiChecker } from '@/components/xem-tuoi-cuoi/XemTuoiCuoiChecker';
import { VERDICT_LABEL } from '@/lib/xem-tuoi-cuoi';
import { BIRTH_YEARS, TARGET_YEAR, buildYearPage, slugOf, yearFromSlug } from '../years';

// Fixed set of SEO landing slugs — unknown slugs 404 instead of rendering.
export const dynamicParams = false;

export function generateStaticParams() {
  return BIRTH_YEARS.map((y) => ({ tuoi: slugOf(y) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tuoi: string }>;
}): Promise<Metadata> {
  const { tuoi } = await params;
  const year = yearFromSlug(tuoi);
  if (!year) return { title: 'Xem tuổi cưới' };
  const d = buildYearPage(year);
  const url = `https://hieu.asia/xem-tuoi-cuoi/${d.slug}`;
  return {
    title: d.seoTitle,
    description: d.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: d.seoTitle,
      description: d.seoDescription,
      url,
      type: 'website' as const,
    },
  };
}

const VERDICT_TEXT_CLASS: Record<string, string> = {
  'thuan': 'text-emerald-700 dark:text-emerald-300',
  'can-nhac': 'text-amber-700 dark:text-amber-300',
  'pham': 'text-rose-700 dark:text-rose-300',
};

export default async function XemTuoiCuoiYearPage({
  params,
}: {
  params: Promise<{ tuoi: string }>;
}) {
  const { tuoi } = await params;
  const year = yearFromSlug(tuoi);
  if (!year) notFound();
  const d = buildYearPage(year);

  return (
    <>
      <JsonLd
        data={[
          webPage({ name: d.seoTitle, description: d.seoDescription, url: `/xem-tuoi-cuoi/${d.slug}` }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xem tuổi cưới', url: '/xem-tuoi-cuoi' },
            { name: `Sinh năm ${d.birthYear}`, url: `/xem-tuoi-cuoi/${d.slug}` },
          ]),
          faqPage(d.faqs),
        ]}
      />
      <ToolPageShell
        eyebrow={`Xem tuổi cưới · Sinh năm ${d.birthYear}`}
        icon={<span aria-hidden="true">💍</span>}
        title={
          <>
            Sinh năm {d.birthYear} <GoldAccent>cưới năm {TARGET_YEAR}</GoldAccent> được không?
          </>
        }
        description={`Cô dâu sinh năm ${d.birthYear} (${d.main.birthCanChi.name} — tuổi ${d.main.birthCanChi.animal}) cưới năm ${TARGET_YEAR} (${d.main.targetCanChi.name}): ${d.verdictShort}. Dưới đây là phép tính cụ thể từng bước để bạn tự kiểm chứng — tham khảo theo tập tục, quyết định là của bạn.`}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Xem tuổi cưới', href: '/xem-tuoi-cuoi' },
          { label: `Sinh năm ${d.birthYear}` },
        ]}
      >
        <section className="space-y-8">
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Kết quả cho cô dâu sinh {d.birthYear} — cưới năm {TARGET_YEAR}
            </h2>
            <p className={`mt-3 text-lg font-semibold ${VERDICT_TEXT_CLASS[d.main.verdict]}`}>
              {VERDICT_LABEL[d.main.verdict]}
            </p>
            <ul className="mt-3 space-y-1.5 pl-5 text-sm text-muted-foreground list-disc">
              {d.main.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Theo tục phổ biến, Kim Lâu xét chủ yếu tuổi cô dâu; Tam Tai và xung năm có thể xét cho
              cả chú rể (nhập năm sinh chú rể ở công cụ bên dưới). Tuổi mụ tính theo năm âm lịch —
              sinh tháng 1–2 trước Tết thì thuộc năm âm liền trước.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              So sánh các năm gần: {TARGET_YEAR}–{TARGET_YEAR + 5}
            </h2>
            <div className="mt-4 overflow-x-auto">
              {/* No min-width: on mobile the 4th column (Kết luận — the actual
                  answer) was pushed off-screen behind a horizontal scroll most
                  users never discover. Letting the table fit + wrap keeps the
                  verdict visible without scrolling; desktop has ample width. */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Năm cưới</th>
                    <th className="py-2 pr-3 font-medium">Can chi</th>
                    <th className="py-2 pr-3 font-medium">Tuổi mụ</th>
                    <th className="py-2 font-medium">Kết luận cho cô dâu {d.birthYear}</th>
                  </tr>
                </thead>
                <tbody>
                  {d.scan.map((r) => (
                    <tr key={r.targetYear} className="border-b border-border/50">
                      <td className="py-2 pr-3 font-medium text-foreground">{r.targetYear}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{r.targetCanChi.name}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{r.kimLau.ageMu}</td>
                      <td className="py-2">
                        <span className={VERDICT_TEXT_CLASS[r.verdict]}>
                          {r.verdict === 'pham'
                            ? r.kimLau.type && r.tamTai.isTamTai
                              ? `Phạm ${r.kimLau.type} + Tam Tai`
                              : r.kimLau.type
                                ? `Phạm ${r.kimLau.type}`
                                : 'Phạm Tam Tai'
                            : VERDICT_LABEL[r.verdict]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {d.goodYears.length > 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                Các năm gần nhất <strong className="text-foreground">không phạm hạn thường xét</strong>{' '}
                cho cô dâu {d.birthYear}: {d.goodYears.join(', ')}.
              </p>
            )}
          </section>

          <XemTuoiCuoiChecker defaultBrideYear={d.birthYear} defaultTargetYear={TARGET_YEAR} />

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Câu hỏi thường gặp — sinh năm {d.birthYear}
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
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Nhận nhắc theo mùa
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source={`xem-tuoi-cuoi-${tuoi}`}
                capturedEvent="lead_capture_xem_tuoi_cuoi"
                capturedProps={{ tuoi }}
                blurb={`Để lại email, mình sẽ báo bạn khi có bản đầy đủ về năm tốt cưới hỏi cho tuổi ${d.birthYear} và những nội dung mới chọn ngày tốt theo mùa. Thi thoảng thôi, không spam.`}
                cta="Nhận nhắc"
              />
            </div>
          </section>

          <nav aria-label="Xem tuổi cưới các năm sinh khác" className="text-sm leading-7">
            <span className="text-muted-foreground">Bước tiếp theo: </span>
            <Link href="/xem-ngay/cuoi-hoi" className="text-gold hover:underline">
              Chọn ngày cưới đẹp (chấm điểm từng ngày)
            </Link>
            {', '}
            <Link href="/hop-tuoi" className="text-gold hover:underline">
              Hợp tuổi hai bạn
            </Link>
            {', '}
            <Link href="/gio-hoang-dao" className="text-gold hover:underline">
              Giờ hoàng đạo đón dâu
            </Link>
            <br />
            <span className="text-muted-foreground">Năm sinh khác: </span>
            <Link href="/xem-tuoi-cuoi" className="text-gold hover:underline">
              Bảng tổng quan
            </Link>
            {BIRTH_YEARS.filter((y) => y !== d.birthYear).map((y) => (
              <span key={y}>
                {', '}
                <Link href={`/xem-tuoi-cuoi/${slugOf(y)}`} className="text-gold hover:underline">
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
