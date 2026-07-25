import type { Metadata } from 'next';
import Link from 'next/link';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { XongDatChecker } from '@/components/xong-dat/XongDatChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';
import { ELEMENTS } from '@/lib/dat-ten-ngu-hanh';
import { yearProfile } from '@/lib/sinh-con';
import { yearChiGroups, tetMoc, type TetMoc } from '@/lib/xong-dat';
import { HOST_YEARS, targetYear, slugOf } from './years';

// Năm mục tiêu lật vào mùng 1 Tết nên MỌI chỗ dùng nó phải tính lúc render —
// hằng số cấp module chỉ được tính một lần cho mỗi tiến trình máy chủ. Vì vậy
// tiêu đề/mô tả/FAQ đều là HÀM nhận năm, và metadata dùng `generateMetadata()`.
const DESC = (y: number) =>
  `Gợi ý tuổi xông đất ${y} theo năm sinh gia chủ: chấm 3 lớp — tam hợp/lục hợp chi năm, tuổi gia chủ và ngũ hành. Tham khảo phong tục, không phán định.`;
const TITLE = (y: number) => `Tuổi xông đất Tết ${y} — tam hợp & ngũ hành`;
const OG_TITLE = (y: number, canChi: string) =>
  `Xem tuổi xông đất Tết ${y} (${canChi}) — gợi ý theo tam hợp & ngũ hành`;

// Không có dòng này thì năm vẫn bị nướng vào HTML từ lúc build và Tết qua rồi
// trang vẫn ghi năm cũ — đúng lỗi đang sửa.
export const revalidate = 86400;

export function generateMetadata(): Metadata {
  const y = targetYear();
  const canChi = yearProfile(y)!.canChi;
  return {
    title: TITLE(y),
    description: DESC(y),
    alternates: { canonical: 'https://hieu.asia/xong-dat' },
    openGraph: {
      title: OG_TITLE(y, canChi),
      description: DESC(y),
      url: 'https://hieu.asia/xong-dat',
      type: 'website' as const,
      images: OG_DEFAULT_IMAGES,
    },
  };
}

type ChiGroups = NonNullable<ReturnType<typeof yearChiGroups>>;

// Nhận năm mục tiêu + nhóm chi của năm đó làm tham số vì chúng lật vào Tết.
const FAQS = (TARGET_YEAR: number, g: ChiGroups, tet: TetMoc) => {
  const ten = (zs: { ten: string }[]) => zs.map((z) => z.ten).join(', ');
  const canChi = g.target.canChi;
  const namTruoc = yearProfile(TARGET_YEAR - 1)!;
  return [
    {
      q: 'Chọn tuổi xông đất dựa trên quy tắc nào?',
      a: `Ba lớp quy tắc cổ điển, công khai thang điểm: (1) chi của người xông đất so với chi năm — Tết ${TARGET_YEAR} là năm ${canChi}, nên tuổi ${ten(g.tamHop)} (tam hợp) và ${ten(g.lucHop)} (lục hợp) được điểm cộng; tuổi ${ten(g.xung)} (xung), ${ten(g.hai)} (hại), ${ten(g.trung)} (trùng Thái Tuế) bị điểm trừ; (2) chi của người xông đất so với tuổi gia chủ — tam hợp/lục hợp cộng, xung/hại trừ; (3) mệnh nạp âm hai bên — khách mang mệnh tương sinh cho mệnh gia chủ được chuộng nhất. Nhập cùng dữ liệu luôn ra cùng kết quả, không "bói mù".`,
    },
    {
      q: `Mùng 1 Tết ${canChi} ${TARGET_YEAR} là ngày nào dương lịch?`,
      a: `Mùng 1 Tết ${canChi} rơi vào ${tet.thu}, ngày ${tet.ngay} dương lịch. Tục xông đất diễn ra từ sau giao thừa đến sáng mùng 1 — người đầu tiên bước vào nhà được xem là "mở khí" cho cả năm.`,
    },
    {
      q: `Năm ${TARGET_YEAR} tuổi nào đẹp để xông đất (xét theo chi năm)?`,
      a: `Xét riêng với chi năm ${g.target.zodiac.ten}: tuổi ${g.tamHop.map((z) => z.ten).join(' và ')} thuộc nhóm tam hợp ${g.boTamHop.map((z) => z.ten).join(' – ')}, tuổi ${ten(g.lucHop)} tạo cặp lục hợp ${g.capLucHop.map((z) => z.ten).join(' – ')} — đều là tín hiệu tham khảo đẹp. Ngược lại tuổi ${ten(g.xung)} (lục xung), ${ten(g.hai)} (lục hại) và ${ten(g.trung)} (trùng chi năm — dân gian gọi là phạm Thái Tuế) thường được cân nhắc. Còn hợp với từng gia chủ thế nào thì cần đối chiếu thêm tuổi và mệnh của gia chủ — nhập năm sinh ở công cụ trên trang.`,
    },
    {
      q: 'Tuổi tính theo năm dương hay năm âm?',
      a: `Theo năm ÂM lịch — đúng quy ước dân gian. Người sinh vào tháng 1 hoặc đầu tháng 2 dương lịch, trước mùng 1 Tết, thuộc năm âm liền trước. Ví dụ: sinh ngày ${tet.ngayTruoc} vẫn thuộc năm ${namTruoc.canChi} ${TARGET_YEAR - 1} vì mùng 1 Tết ${canChi} là ${tet.ngay}.`,
    },
    {
      q: 'Không tìm được người "đúng tuổi đẹp" thì sao?',
      a: 'Hoàn toàn không sao. Xông đất là tập tục "đầu xuôi đuôi lọt" để cả nhà vui và yên tâm — không phải quy luật về phúc hoạ, và không có chuyện "mời sai tuổi thì xui cả năm". Người vui vẻ, xởi lởi, thật lòng quý gia đình là lựa chọn quý nhất; bảng tuổi chỉ là một góc nhìn phong tục để tham khảo thêm khi gia đình đằng nào cũng đang cân nhắc giữa vài người.',
    },
  ];
};

export default function XongDatPage() {
  // Đọc một lần đầu hàm render rồi dùng lại — không gán ra cấp module.
  const TARGET_YEAR = targetYear();
  const groups = yearChiGroups(TARGET_YEAR)!;
  const tet = tetMoc(TARGET_YEAR);
  const faqs = FAQS(TARGET_YEAR, groups, tet);
  const names = (zs: { ten: string }[]) => zs.map((z) => z.ten).join(', ');

  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: OG_TITLE(TARGET_YEAR, groups.target.canChi),
            description: DESC(TARGET_YEAR),
            url: '/xong-dat',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tuổi xông đất', url: '/xong-dat' },
          ]),
          faqPage(faqs),
        ]}
      />
      <ToolPageShell
        eyebrow="Tết · Xông đất"
        icon={<span aria-hidden="true">🧧</span>}
        title={
          <>
            Tuổi xông đất Tết {TARGET_YEAR} — <GoldAccent>gợi ý minh bạch</GoldAccent>
          </>
        }
        description={`Nhập năm sinh gia chủ để nhận gợi ý tuổi xông đất Tết ${groups.target.canChi} ${TARGET_YEAR} — chấm công khai theo tam hợp, lục hợp và ngũ hành tương sinh. Tham khảo phong tục, không phán định.`}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tuổi xông đất' },
        ]}
        relatedSlug="/xong-dat"
      >
        <section className="space-y-8">
          <XongDatChecker />

          <nav
            aria-label="Tuổi xông đất theo năm sinh gia chủ"
            className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm"
          >
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Xem nhanh theo năm sinh gia chủ
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
              {HOST_YEARS.map((y) => (
                <Link key={y} href={`/xong-dat/${slugOf(y)}`} className="text-gold hover:underline">
                  {y}
                </Link>
              ))}
            </div>
          </nav>

          {/* Năm đích — nhóm chi tính từ engine */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Năm {groups.target.canChi} {TARGET_YEAR} — nhóm tuổi xét theo chi năm
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Năm {TARGET_YEAR} là năm <strong className="text-foreground">{groups.target.canChi}</strong>{' '}
              — chi {groups.target.zodiac.ten}{' '}
              <span aria-hidden="true">{groups.target.zodiac.emoji}</span>, nạp âm{' '}
              <strong className="text-gold">
                {ELEMENTS[groups.target.element].name} — {groups.target.napAmName}
              </strong>
              . Mùng 1 Tết rơi vào <strong className="text-foreground">{tet.ngay}</strong> dương lịch.
            </p>
            <ul className="mt-3 space-y-1.5 pl-5 text-sm text-muted-foreground list-disc">
              <li>
                Tam hợp với chi năm: <strong className="text-foreground">{names(groups.tamHop)}</strong>{' '}
                · lục hợp: <strong className="text-foreground">{names(groups.lucHop)}</strong> — điểm
                cộng khi chọn người xông đất.
              </li>
              <li>
                Cần cân nhắc theo tục: <strong className="text-foreground">{names(groups.xung)}</strong>{' '}
                (lục xung), <strong className="text-foreground">{names(groups.hai)}</strong> (lục hại),{' '}
                <strong className="text-foreground">{names(groups.trung)}</strong> (trùng chi năm — Thái
                Tuế).
              </li>
              <li>
                Đây mới là lớp "chi × năm" — còn phải đối chiếu với tuổi và mệnh của từng gia chủ để ra
                gợi ý đầy đủ.
              </li>
            </ul>
          </section>

          {/* Phương pháp */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Cách chấm — minh bạch từng quy tắc
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">Lớp 1 — chi × chi năm:</strong> tam hợp/lục hợp với
                chi năm +2 điểm; lục hại −1; trùng chi năm (Thái Tuế) −2; lục xung −3.
              </p>
              <p>
                <strong className="text-foreground">Lớp 2 — chi × gia chủ:</strong> tam hợp/lục hợp +2;
                cùng tuổi hoặc bình hoà 0; lục hại −1; lục xung −3.
              </p>
              <p>
                <strong className="text-foreground">Lớp 3 — mệnh nạp âm × gia chủ:</strong> khách mang
                mệnh tương sinh cho gia chủ +2 (được chuộng nhất); gia chủ sinh cho khách +1; đồng mệnh
                0; tương khắc −2/−3 theo chiều khắc.
              </p>
              <p>
                Tuổi phạm lục xung với chi năm/gia chủ hoặc mệnh khắc gia chủ được xếp thẳng nhóm "nên
                cân nhắc" — đúng thói quen kiêng phổ biến. Mọi quy tắc là phong tục cổ điển, tính ra
                được; trọng số dùng để xếp hạng và được công khai ngay tại đây.
              </p>
            </div>
          </section>

          {/* Một lời nhắn */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Một lời nhắn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Xông đất là một nét đẹp đầu xuân — niềm vui nằm ở lời chúc và sự chân thành của người
              bước vào nhà, không nằm ở bảng tuổi. hieu.asia hiển thị đúng quy tắc phong tục kèm cách
              hiểu dung hoà để bạn tham khảo có chừng mực; nếu người cả nhà quý mến không "đúng tuổi
              đẹp", điều đó tuyệt đối không phải điềm xấu.
            </p>
          </section>

          {/* FAQ */}
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

          {/* Nhận nhắc theo mùa */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-gold/80">
              Nhận nhắc theo mùa
            </h2>
            <div className="mt-3">
              <OccasionLeadCapture
                source="xong-dat-hub"
                capturedEvent="lead_capture_xong_dat_hub"
                blurb="Để lại email, hieu.asia sẽ báo bạn khi có bản gợi ý tuổi xông đất đầy đủ và nội dung mới theo mùa Tết. Thi thoảng thôi, không spam."
                cta="Nhận nhắc"
              />
            </div>
          </section>
        </section>
      </ToolPageShell>
    </>
  );
}
