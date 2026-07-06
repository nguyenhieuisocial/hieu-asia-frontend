import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { KhaiTruongChecker } from '@/components/khai-truong/KhaiTruongChecker';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { OPENING_VERDICT_LABEL } from '@/lib/khai-truong';
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
  // notFound() ngay trong generateMetadata → 404 thật trước first flush
  // (site render động vì next-intl; notFound() trong page chỉ ra soft-404).
  if (!year) notFound();
  const d = buildYearPage(year);
  const url = `https://hieu.asia/khai-truong/${d.slug}`;
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

export default async function KhaiTruongYearPage({
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
          webPage({ name: d.seoTitle, description: d.seoDescription, url: `/khai-truong/${d.slug}` }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xem tuổi khai trương', url: '/khai-truong' },
            { name: `Sinh năm ${d.birthYear}`, url: `/khai-truong/${d.slug}` },
          ]),
          faqPage(d.faqs),
        ]}
      />
      <ToolPageShell
        eyebrow={`Xem tuổi khai trương · Sinh năm ${d.birthYear}`}
        icon={<span aria-hidden="true">🎉</span>}
        title={
          <>
            Sinh năm {d.birthYear} <GoldAccent>khai trương năm {TARGET_YEAR}</GoldAccent> được không?
          </>
        }
        description={`Chủ kinh doanh sinh năm ${d.birthYear} (${d.main.birthCanChi.name} — tuổi ${d.main.birthCanChi.animal}) khai trương năm ${TARGET_YEAR} (${d.main.targetCanChi.name}): ${d.verdictShort}. Dưới đây là phép tính cụ thể từng bước để bạn tự kiểm chứng — tham khảo theo tập tục, quyết định là của bạn.`}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Xem tuổi khai trương', href: '/khai-truong' },
          { label: `Sinh năm ${d.birthYear}` },
        ]}
      >
        <section className="space-y-8">
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Kết quả cho chủ sinh {d.birthYear} — khai trương năm {TARGET_YEAR}
            </h2>
            <p className={`mt-3 text-lg font-semibold ${VERDICT_TEXT_CLASS[d.main.verdict]}`}>
              {OPENING_VERDICT_LABEL[d.main.verdict]}
            </p>
            <ul className="mt-3 space-y-1.5 pl-5 text-sm text-muted-foreground list-disc">
              {d.main.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Theo tục phổ biến, xét tuổi của người đứng tên kinh doanh (chủ cửa hàng / doanh
              nghiệp). Tuổi tính theo năm âm lịch — sinh tháng 1–2 trước Tết thì thuộc năm âm liền
              trước. Xem tuổi khai trương không xét Kim Lâu / Hoang Ốc (hai hạn đó dành cho xây nhà
              và cưới hỏi).
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              So sánh các năm gần: {TARGET_YEAR}–{TARGET_YEAR + 5}
            </h2>
            <div className="mt-4 overflow-x-auto">
              {/* No min-width: keep the "Kết luận" column on-screen on mobile
                  (was pushed behind an undiscovered horizontal scroll). */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Năm khai trương</th>
                    <th className="py-2 pr-3 font-medium">Can chi</th>
                    <th className="py-2 font-medium">Kết luận cho chủ {d.birthYear}</th>
                  </tr>
                </thead>
                <tbody>
                  {d.scan.map((r) => {
                    const hits: string[] = [];
                    if (r.tamTai.isTamTai) hits.push('Tam Tai');
                    if (r.xung.isXung) hits.push('xung tuổi');
                    return (
                      <tr key={r.targetYear} className="border-b border-border/50">
                        <td className="py-2 pr-3 font-medium text-foreground">{r.targetYear}</td>
                        <td className="py-2 pr-3 text-muted-foreground">{r.targetCanChi.name}</td>
                        <td className="py-2">
                          <span className={VERDICT_TEXT_CLASS[r.verdict]}>
                            {r.verdict === 'thuan'
                              ? OPENING_VERDICT_LABEL[r.verdict]
                              : `${OPENING_VERDICT_LABEL[r.verdict]} (${hits.join(' + ')})`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {d.goodYears.length > 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                Các năm gần nhất <strong className="text-foreground">hợp tuổi khai trương</strong>{' '}
                cho chủ {d.birthYear}: {d.goodYears.join(', ')}.
              </p>
            )}
          </section>

          <KhaiTruongChecker defaultBirthYear={d.birthYear} defaultTargetYear={TARGET_YEAR} />

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
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
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Nhận nhắc theo mùa
            </h2>
            <p className="mt-2 text-sm font-medium text-foreground">
              Để lại email cho chủ sinh năm {d.birthYear}
            </p>
            <div className="mt-4">
              <OccasionLeadCapture
                source={`khai-truong-${tuoi}`}
                capturedEvent="lead_capture_khai_truong"
                capturedProps={{ tuoi }}
                blurb={`Bạn quan tâm tới ngày tốt khai trương theo tuổi? Để lại email, chúng tôi sẽ báo bạn khi có bản đầy đủ và nội dung mới theo mùa cho chủ sinh năm ${d.birthYear}. Thi thoảng thôi, không spam.`}
                cta="Nhận nhắc"
              />
            </div>
          </section>

          <nav aria-label="Xem tuổi khai trương các năm sinh khác" className="text-sm leading-7">
            <span className="text-muted-foreground">Bước tiếp theo: </span>
            <Link href="/xem-ngay/khai-truong" className="text-gold hover:underline">
              Chọn ngày khai trương đẹp (chấm điểm từng ngày)
            </Link>
            {', '}
            <Link href="/gio-hoang-dao" className="text-gold hover:underline">
              Giờ hoàng đạo mở hàng
            </Link>
            <br />
            <span className="text-muted-foreground">Năm sinh khác: </span>
            <Link href="/khai-truong" className="text-gold hover:underline">
              Bảng tổng quan
            </Link>
            {BIRTH_YEARS.filter((y) => y !== d.birthYear).map((y) => (
              <span key={y}>
                {', '}
                <Link href={`/khai-truong/${slugOf(y)}`} className="text-gold hover:underline">
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
