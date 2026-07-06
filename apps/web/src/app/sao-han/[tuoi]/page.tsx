import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SaoHanCalculator } from '@/components/sao-han/SaoHanCalculator';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { computeSaoHan, currentViewYear, type SaoType } from '@/lib/sao-han';

// Tính theo năm hiện tại tại thời điểm truy cập (sao đổi theo năm).
export const dynamic = 'force-dynamic';

interface ConGiap {
  slug: string;
  ten: string;
  con: string;
  idx: number; // (năm - 4) mod 12
}

const CON_GIAP: ConGiap[] = [
  { slug: 'ty', ten: 'Tý', con: 'Chuột', idx: 0 },
  { slug: 'suu', ten: 'Sửu', con: 'Trâu', idx: 1 },
  { slug: 'dan', ten: 'Dần', con: 'Hổ', idx: 2 },
  { slug: 'mao', ten: 'Mão', con: 'Mèo', idx: 3 },
  { slug: 'thin', ten: 'Thìn', con: 'Rồng', idx: 4 },
  { slug: 'ti', ten: 'Tỵ', con: 'Rắn', idx: 5 },
  { slug: 'ngo', ten: 'Ngọ', con: 'Ngựa', idx: 6 },
  { slug: 'mui', ten: 'Mùi', con: 'Dê', idx: 7 },
  { slug: 'than', ten: 'Thân', con: 'Khỉ', idx: 8 },
  { slug: 'dau', ten: 'Dậu', con: 'Gà', idx: 9 },
  { slug: 'tuat', ten: 'Tuất', con: 'Chó', idx: 10 },
  { slug: 'hoi', ten: 'Hợi', con: 'Lợn', idx: 11 },
];

function getConGiap(slug: string): ConGiap | undefined {
  return CON_GIAP.find((c) => c.slug === slug);
}

// Con giáp của một năm dương lịch.
function conGiapOfYear(year: number): number {
  return (((year - 4) % 12) + 12) % 12;
}

const TYPE_TEXT: Record<SaoType, string> = {
  tot: 'text-emerald-700 dark:text-emerald-300',
  trung: 'text-amber-700 dark:text-amber-300',
  xau: 'text-rose-700 dark:text-rose-300',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tuoi: string }>;
}): Promise<Metadata> {
  const { tuoi } = await params;
  const cg = getConGiap(tuoi);
  if (!cg) return { title: 'Sao hạn theo tuổi' };
  const year = currentViewYear();
  const title = `Sao hạn tuổi ${cg.ten} ${year} — sao chiếu mệnh nam & nữ`;
  const description = `Tra sao hạn (sao chiếu mệnh) năm ${year} cho tuổi ${cg.ten} (con ${cg.con}) theo từng năm sinh, cả nam và nữ. Tham khảo theo phong tục, không bói toán.`;
  const url = `https://hieu.asia/sao-han/${tuoi}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' as const },
  };
}

export default async function SaoHanConGiapPage({
  params,
}: {
  params: Promise<{ tuoi: string }>;
}) {
  const { tuoi } = await params;
  const cg = getConGiap(tuoi);
  if (!cg) notFound();
  const year = currentViewYear();

  // Các năm sinh thuộc con giáp này (tuổi mụ ~7..91).
  const rows: Array<{
    birthYear: number;
    tuoiMu: number;
    nam: ReturnType<typeof computeSaoHan>;
    nu: ReturnType<typeof computeSaoHan>;
  }> = [];
  for (let by = year - 5; by >= year - 92; by--) {
    if (conGiapOfYear(by) !== cg.idx) continue;
    rows.push({
      birthYear: by,
      tuoiMu: year - by + 1,
      nam: computeSaoHan(by, 'nam', year),
      nu: computeSaoHan(by, 'nu', year),
    });
  }

  const faqs = [
    {
      q: `Tuổi ${cg.ten} năm ${year} sao gì chiếu mệnh?`,
      a: `Tuổi ${cg.ten} gồm nhiều năm sinh khác nhau, mỗi năm sinh có sao chiếu mệnh riêng trong năm ${year} (nam và nữ cũng khác nhau). Bảng bên trên liệt kê theo từng năm sinh; bạn cũng có thể nhập chính xác năm sinh vào ô tra cứu.`,
    },
    {
      q: 'Sao hạn có quyết định cả năm của tôi không?',
      a: 'Không. Đây là cách tra cứu theo phong tục để tham khảo. Sao tốt hay xấu chỉ là một góc nhìn để mình chủ động hơn, không phải lời phán số mệnh.',
    },
    {
      q: 'Vì sao nam và nữ cùng tuổi lại khác sao?',
      a: 'Theo cách tính Cửu Diệu truyền thống, bảng sao cho nam và nữ khác nhau — nên cùng một năm sinh, nam và nữ có thể gặp sao khác nhau.',
    },
  ];

  const title = `Sao hạn tuổi ${cg.ten} ${year}`;

  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: title,
            description: `Sao hạn ${year} cho tuổi ${cg.ten} theo năm sinh, nam & nữ.`,
            url: `/sao-han/${tuoi}`,
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xem sao hạn', url: '/sao-han' },
            { name: `Tuổi ${cg.ten}`, url: `/sao-han/${tuoi}` },
          ]),
          faqPage(faqs),
        ]}
      />
      <ToolPageShell
        eyebrow={`Sao hạn · Tuổi ${cg.ten}`}
        icon={<span aria-hidden="true">⭐</span>}
        title={
          <>
            Sao hạn tuổi <GoldAccent>{cg.ten}</GoldAccent> {year}
          </>
        }
        description={`Sao chiếu mệnh năm ${year} cho người tuổi ${cg.ten} (con ${cg.con}) theo từng năm sinh, cả nam và nữ. Tra cứu theo phong tục để tham khảo — không phán số mệnh.`}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Xem sao hạn', href: '/sao-han' },
          { label: `Tuổi ${cg.ten}` },
        ]}
      >
        <section className="space-y-8">
          <div className="flex flex-wrap gap-3">
            <ShareResultButton
              path={`/sao-han/${tuoi}`}
              title="Sao hạn năm nay"
              text="Mình vừa xem sao hạn năm nay trên hieu.asia — bạn xem thử nhé!"
              trackId="sao-han-tuoi"
            />
          </div>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Sao hạn {year} — tuổi {cg.ten} theo năm sinh
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Năm sinh</th>
                    <th className="py-2 pr-4 font-medium">Tuổi mụ</th>
                    <th className="py-2 pr-4 font-medium">Nam</th>
                    <th className="py-2 font-medium">Nữ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.birthYear} className="border-b border-border/50">
                      <td className="py-2 pr-4 tabular-nums">{r.birthYear}</td>
                      <td className="py-2 pr-4 tabular-nums text-muted-foreground">{r.tuoiMu}</td>
                      <td className={`py-2 pr-4 ${r.nam ? TYPE_TEXT[r.nam.sao.type] : ''}`}>
                        {r.nam?.sao.name ?? '—'}
                      </td>
                      <td className={`py-2 ${r.nu ? TYPE_TEXT[r.nu.sao.type] : ''}`}>
                        {r.nu?.sao.name ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Màu xanh = cát tinh (tốt) · vàng = trung tính · đỏ = hung tinh (cần thận trọng). Tuổi mụ =
              tuổi âm, tính theo năm {year}.
            </p>
          </section>

          <SaoHanCalculator />

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Câu hỏi thường gặp
            </h2>
            <dl className="mt-4 space-y-4">
              {faqs.map((f, i) => (
                <div key={i}>
                  <dt className="font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Nhận nhắc theo mùa cho tuổi {cg.ten}
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source={`sao-han-${tuoi}`}
                capturedEvent="lead_capture_sao_han"
                capturedProps={{ tuoi }}
                blurb={`Để lại email, chúng tôi báo khi có nội dung mới theo mùa cho tuổi ${cg.ten} (sao hạn năm mới, ngày tốt, xem ngày). Thi thoảng thôi, không spam.`}
                cta="Nhận nhắc"
              />
            </div>
          </section>

          <nav aria-label="Sao hạn các tuổi khác" className="text-sm">
            <span className="text-muted-foreground">Sao hạn tuổi khác: </span>
            {CON_GIAP.filter((o) => o.slug !== cg.slug).map((o, i, arr) => (
              <span key={o.slug}>
                <Link href={`/sao-han/${o.slug}`} className="text-gold hover:underline">
                  {o.ten}
                </Link>
                {i < arr.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </nav>
          <p className="text-sm">
            <Link href="/sao-han" className="text-gold hover:underline">
              ← Về trang Xem sao hạn (tra theo năm sinh bất kỳ)
            </Link>
          </p>
        </section>
      </ToolPageShell>
    </>
  );
}
