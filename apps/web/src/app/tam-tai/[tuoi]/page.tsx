import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { TamTaiFinder } from '@/components/tam-tai/TamTaiFinder';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';
import { buildTamTai, listTamTai, TAM_TAI_SLUGS, CALENDAR_FROM, CALENDAR_TO } from '@/lib/tam-tai-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return TAM_TAI_SLUGS.map((tuoi) => ({ tuoi }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tuoi: string }>;
}): Promise<Metadata> {
  const { tuoi } = await params;
  const d = buildTamTai(tuoi);
  if (!d) return { title: 'Tam Tai theo tuổi' };
  const url = `https://hieu.asia/tam-tai/${tuoi}`;
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

export default async function TamTaiConGiapPage({
  params,
}: {
  params: Promise<{ tuoi: string }>;
}) {
  const { tuoi } = await params;
  const d = buildTamTai(tuoi);
  if (!d) notFound();

  const { z, animal, groupMembers, tamTaiChis, calendarYears, faqs } = d;
  const memberNames = groupMembers.map((m) => m.ten).join(', ');
  const others = listTamTai().filter((o) => o.slug !== z.slug);

  return (
    <>
      <JsonLd
        data={[
          article({
            headline: d.seoTitle,
            description: d.seoDescription,
            url: `/tam-tai/${tuoi}`,
            image: '/og-image.jpg',
            datePublished: '2026-06-23',
            dateModified: '2026-06-23',
            type: 'Article',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tam Tai', url: '/tam-tai' },
            { name: `Tuổi ${z.ten}`, url: `/tam-tai/${tuoi}` },
          ]),
          faqPage(faqs),
        ]}
      />
      <ToolPageShell
        eyebrow={`Tam Tai · Tuổi ${z.ten}`}
        icon={<span aria-hidden="true">🗓️</span>}
        title={
          <>
            Tuổi <GoldAccent>{z.ten}</GoldAccent> phạm Tam Tai năm nào?
          </>
        }
        description={`Tuổi ${z.ten} (con ${animal}) thuộc nhóm Tam Hợp ${memberNames}, gặp Tam Tai vào các năm ${tamTaiChis.join(', ')}. Tra theo phong tục để tham khảo — không hù dọa, không bán giải hạn.`}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tam Tai', href: '/tam-tai' },
          { label: `Tuổi ${z.ten}` },
        ]}
      >
        <section className="space-y-8">
          <div className="flex flex-wrap gap-3">
            <ShareResultButton
              path={`/tam-tai/${tuoi}`}
              title={`Tam Tai tuổi ${z.ten}`}
              text={`Tuổi ${z.ten} phạm Tam Tai vào những năm nào? Xem trên hieu.asia.`}
              trackId="tam-tai-tuoi"
            />
          </div>

          {/* Dữ kiện chính */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Tuổi {z.ten} và Tam Tai
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/85">
              <li>
                <span className="text-muted-foreground">Nhóm Tam Hợp:</span>{' '}
                <strong>{memberNames}</strong> (ba con giáp cùng bước vào Tam Tai một lúc).
              </li>
              <li>
                <span className="text-muted-foreground">Năm Tam Tai (địa chi):</span>{' '}
                <strong>{tamTaiChis.join(', ')}</strong>.
              </li>
              <li>
                <span className="text-muted-foreground">
                  Các năm dương lịch Tam Tai ({CALENDAR_FROM}–{CALENDAR_TO}):
                </span>{' '}
                <strong className="tabular-nums">{calendarYears.join(', ')}</strong>.
              </li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Đây là cách tính theo phong tục Can Chi để <strong>tham khảo</strong>. Phạm Tam Tai
              không phải điềm gở cố định — ý nghĩa thực dụng là nhắc bạn thận trọng hơn với việc trọng
              đại (cưới hỏi, làm nhà, khai trương, đầu tư lớn) trong các năm này — nên cân nhắc kỹ
              trước khi quyết, đừng vội. hieu.asia không bán lễ &ldquo;giải hạn&rdquo;.
            </p>
          </section>

          <TamTaiFinder />

          {/* FAQ */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Câu hỏi thường gặp
            </h2>
            <dl className="mt-4 space-y-4">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Email */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Nhận nhắc theo mùa cho tuổi {z.ten}
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source={`tam-tai-${tuoi}`}
                capturedEvent="lead_capture_tam_tai"
                capturedProps={{ tuoi }}
                blurb={`Để lại email, chúng tôi báo khi có nội dung mới theo mùa cho tuổi ${z.ten} (xem tuổi, ngày tốt, sao hạn). Thi thoảng thôi, không spam.`}
                cta="Nhận nhắc"
              />
            </div>
          </section>

          {/* Điều hướng */}
          <nav aria-label="Tam Tai các tuổi khác" className="text-sm">
            <span className="text-muted-foreground">Tam Tai tuổi khác: </span>
            {others.map((o, i, arr) => (
              <span key={o.slug}>
                <Link href={`/tam-tai/${o.slug}`} className="text-gold hover:underline">
                  {o.ten}
                </Link>
                {i < arr.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </nav>
          <p className="text-sm">
            <Link href="/tam-tai" className="text-gold hover:underline">
              ← Về trang Tam Tai (giải thích & tra theo năm sinh)
            </Link>
          </p>
        </section>
      </ToolPageShell>
    </>
  );
}
