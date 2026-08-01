/**
 * /learn/huyen-khong-phi-tinh — bài chuyên sâu về Huyền Không Phi Tinh (玄空飛星).
 *
 * GROUNDING (không có con số nào ngoài các nguồn này):
 *   • src/lib/phi-tinh.ts — MOUNTAINS (24 sơn: độ, quái, tam nguyên long, âm–dương),
 *     PALACES (9 cung Lạc Thư), flyPlate() (phi thuận/nghịch), yunOfYear()
 *     (nguyên vận 1864–2043), computeFlyingStarChart() (vận → sơn → hướng tinh).
 *   • src/lib/phi-tinh.test.ts — Bát vận Sửu sơn Mùi hướng = Vượng sơn Vượng hướng
 *     (lá số kinh điển 《沈氏玄空学》); vận 2,3,4,6,7,8 chia đều 6/6/6/6; vận 1 và 9
 *     KHÔNG có Vượng sơn Vượng hướng / Thượng sơn Hạ thủy; vận 5 đặc biệt.
 *   • src/app/phi-tinh/page.tsx + components/phi-tinh/PhiTinhChecker.tsx — cách đọc
 *     ba tầng số, STAR_NATURE, PATTERN_NOTE, VAN_OPTIONS, và ghi chú "chỉ làm Hạ
 *     Quái, không làm Thế quái vì các phái bất đồng".
 *
 * MỌI bảng số đều DẪN THẲNG từ engine (import + render), không chép tay → bài học
 * và công cụ /phi-tinh không thể lệch nhau. PHẠM VI: chỉ Phi Tinh (thời gian + tọa
 * hướng của NHÀ); cung phi / Đông–Tây tứ mệnh thuộc /learn/bat-trach.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import {
  MOUNTAINS,
  PALACES,
  computeFlyingStarChart,
  flyPlate,
  yunOfYear,
  type FlyingStarChart,
  type FlyingStarPattern,
  type Mountain,
} from '@/lib/phi-tinh';
import {
  PhiTinhFrame,
  PhiTinhDepth,
  PhiTinhRecall,
  PhiTinhChecklist,
  PhiTinhWhys,
} from './_active-learning';

export const metadata: Metadata = {
  // Tiêu đề phải để RENDER ra ≤60 ký tự (layout nối thêm hậu tố site ~13 ký tự,
  // TITLE_MAX = 60 trong lib/seo/constants). Bản đầu dài 59 ký tự → render ra 72,
  // Google cắt mất vế sau. Giữ ngắn, phần "tam nguyên" đã nằm trong description.
  title: 'Huyền Không Phi Tinh — cửu vận và tinh bàn',
  // ≤160 ký tự: dài hơn thì Google cắt mất câu chốt.
  description:
    'Huyền Không Phi Tinh: tam nguyên cửu vận, cách lập tinh bàn 9 cung với vận tinh – sơn tinh – hướng tinh, bay thuận nghịch và các cách cục. Tham khảo.',
  alternates: { canonical: 'https://hieu.asia/learn/huyen-khong-phi-tinh' },
};

/** Năm mốc để nói "hiện đang ở vận nào" — cố định theo lần cập nhật bài. */
const REFERENCE_YEAR = 2026;
const CURRENT_YUN = yunOfYear(REFERENCE_YEAR);

/** Tên 9 vận — khớp VAN_OPTIONS trong components/phi-tinh/PhiTinhChecker.tsx. */
const YUN_NAMES = ['Nhất', 'Nhị', 'Tam', 'Tứ', 'Ngũ', 'Lục', 'Thất', 'Bát', 'Cửu'];
/** Nhãn tam nguyên long — khớp type YuanLong (0/1/2) trong lib/phi-tinh.ts. */
const YUAN_LABEL = ['Địa nguyên long', 'Thiên nguyên long', 'Nhân nguyên long'];

// Khoảng năm mỗi vận suy THẲNG từ yunOfYear(): vận n = 20 năm, mốc gốc 1864
// (yunOfYear(1864) = 1, yunOfYear(2024) = 9, yunOfYear(2043) = 9).
const yunStart = (yun: number) => 1864 + 20 * (yun - 1);
const yunEnd = (yun: number) => yunStart(yun) + 19;
const nguyenOf = (yun: number) =>
  yun <= 3 ? 'Thượng nguyên' : yun <= 6 ? 'Trung nguyên' : 'Hạ nguyên';
const yuanOf = (m: Mountain) => YUAN_LABEL[m.yuanLong]!;

const PATTERN_ORDER: FlyingStarPattern[] = [
  'vuong-son-vuong-huong',
  'thuong-son-ha-thuy',
  'song-tinh-dao-huong',
  'song-tinh-dao-toa',
  'ngu-van',
];

/**
 * Đếm 24 sơn của từng vận rơi vào cách cục nào — chạy THẲNG engine (9 × 24 = 216
 * cục). Nhãn cách cục cũng lấy từ chart.patternLabel để không chép tay.
 */
function buildPatternMatrix() {
  const labels = new Map<FlyingStarPattern, string>();
  const rows = Array.from({ length: 9 }, (_, i) => {
    const yun = i + 1;
    const counts: Partial<Record<FlyingStarPattern, number>> = {};
    for (const m of MOUNTAINS) {
      const c = computeFlyingStarChart(yun, m.name);
      counts[c.pattern] = (counts[c.pattern] ?? 0) + 1;
      labels.set(c.pattern, c.patternLabel);
    }
    return { yun, counts };
  });
  return { rows, labels };
}

/** 8 quái theo chiều kim đồng hồ, suy từ sơn Thiên nguyên long của mỗi quái. */
const GUA_ORDER = MOUNTAINS.filter((m) => m.yuanLong === 1).map((m) => m.gua);
const DIR_OF_GUA = new Map(PALACES.map((p) => [p.gua, p.dir]));
const GRID_OF_GUA = new Map(PALACES.map((p) => [p.gua, p.grid]));
/** Đường phi bố Lạc Thư: trung → 6 → 7 → 8 → 9 → 1 → 2 → 3 → 4 (theo flyPlate). */
const FLY_PATH = [...PALACES].sort(
  (a, b) => ((a.luoshu - 5 + 9) % 9) - ((b.luoshu - 5 + 9) % 9),
);

// Ví dụ lập bàn: LÁ SỐ KINH ĐIỂN đã khoá trong phi-tinh.test.ts.
const EXAMPLE = computeFlyingStarChart(8, 'Sửu');
// Cùng một ngôi nhà, hai vận khác nhau → minh hoạ "phong thuỷ theo thời gian".
const TY_VAN8 = computeFlyingStarChart(8, 'Tý');
const TY_VAN9 = computeFlyingStarChart(9, 'Tý');

// Bản chất 9 sao — CHÉP ĐÚNG từ STAR_NATURE trong
// src/components/phi-tinh/PhiTinhChecker.tsx (chỉ bỏ chữ in hoa nhấn mạnh).
const STAR_NATURE: { num: number; name: string; element: string; note: string }[] = [
  { num: 1, name: 'Nhất Bạch', element: 'Thủy', note: 'Văn chương, công danh, đào hoa; đương vận chủ trí tuệ, thăng tiến.' },
  { num: 2, name: 'Nhị Hắc', element: 'Thổ', note: 'Bệnh phù; đương vận chủ điền sản, mất vận dễ bệnh tật, lo âu.' },
  { num: 3, name: 'Tam Bích', element: 'Mộc', note: 'Tranh đấu, thị phi; đương vận chủ khai sáng, mất vận dễ kiện tụng.' },
  { num: 4, name: 'Tứ Lục', element: 'Mộc', note: 'Văn xương, học hành, quan hệ; lợi thi cử, sáng tạo.' },
  { num: 5, name: 'Ngũ Hoàng', element: 'Thổ', note: 'Sao mạnh nhất, dễ thành hung khi động; nên tĩnh, kỵ tu sửa nơi sao tới.' },
  { num: 6, name: 'Lục Bạch', element: 'Kim', note: 'Quyền uy, võ quý, chính tài; đương vận chủ địa vị, lộc.' },
  { num: 7, name: 'Thất Xích', element: 'Kim', note: 'Khẩu tài, thiên tài; mất vận (hiện đã thoái) dễ thị phi, hao tài.' },
  { num: 8, name: 'Bát Bạch', element: 'Thổ', note: 'Tài tinh đương vận trước (đến 2023); chủ phú quý, vượng tài đinh.' },
  { num: 9, name: 'Cửu Tử', element: 'Hỏa', note: 'Sao đương vận (2024–2043); chủ hỷ khánh, văn chương, thăng hoa.' },
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Huyền Không Phi Tinh là gì?',
    a: 'Huyền Không Phi Tinh (玄空飛星) là một trường phái thuộc nhánh Lý Khí của phong thủy, đặc điểm lớn nhất là xét theo thời gian. Nó chia dòng thời gian thành các nguyên vận, mỗi vận 20 năm, rồi kết hợp vận với tọa và hướng của chính ngôi nhà để an chín con số vào chín cung. Mỗi cung có ba số: vận tinh, sơn tinh, hướng tinh. Đây là hệ quy ước cổ điển để tham khảo khi bố trí không gian, không phải lời phán về số mệnh.',
  },
  {
    q: 'Tam nguyên cửu vận là gì, hiện đang ở vận nào?',
    a: 'Tam nguyên cửu vận là cách chia thời gian của Huyền Không: chín vận, mỗi vận 20 năm, gộp thành ba nguyên (Thượng, Trung, Hạ) mỗi nguyên 60 năm, tổng cộng một vòng 180 năm. Vòng mà công cụ hieu.asia phủ là 1864 đến 2043. Hiện tại là Cửu vận, kéo dài từ 2024 đến 2043, nên sao đương vận là số 9 (Cửu Tử). Trước đó là Bát vận, từ 2004 đến 2023, với sao đương vận là số 8.',
  },
  {
    q: 'Vận tinh, sơn tinh và hướng tinh khác nhau thế nào?',
    a: 'Mỗi cung có ba số. Vận tinh (số ở giữa) là khí của nguyên vận tại cung đó, an trước tiên bằng cách cho số vận nhập trung cung rồi bay thuận. Sơn tinh (góc trái) chủ về người, sức khỏe, nhân đinh. Hướng tinh (góc phải) chủ về tài lộc, cơ hội. Sơn tinh và hướng tinh được an sau: lấy chính con số của bàn vận đang nằm ở cung tọa và ở cung hướng, cho từng số đó nhập trung cung rồi bay tiếp, mỗi bàn có chiều bay riêng.',
  },
  {
    q: 'Vì sao có bàn bay thuận, có bàn bay nghịch?',
    a: 'Chiều bay do âm dương Huyền Không của sơn quyết định. Vòng la bàn chia 24 sơn, mỗi sơn 15 độ, cứ ba sơn thuộc một quái và mang ba tam nguyên long khác nhau: Địa nguyên, Thiên nguyên, Nhân nguyên. Khi một con số của bàn vận nhập trung cung, người ta xét sơn cùng tam nguyên long với tọa hoặc hướng trong quái ứng với số đó: sơn thuộc Dương thì bay thuận, thuộc Âm thì bay nghịch. Đây là lý do hai ngôi nhà lệch nhau 15 độ có thể ra hai tinh bàn hoàn toàn khác nhau.',
  },
  {
    // Khác câu trên trang công cụ /phi-tinh (cùng phát FAQPage JSON-LD): trang đó
    // giữ định nghĩa ngắn, bài Học trả lời "vì sao được coi là đẹp nhất".
    q: 'Vì sao Vượng sơn Vượng hướng được coi là cách cục đẹp nhất?',
    a: 'Là cách cục mà sao đương vận bay tới đúng hai chỗ đắc địa nhất: sơn tinh đương vận rơi vào cung tọa (chủ người) và hướng tinh đương vận rơi vào cung hướng (chủ của). Ví dụ kinh điển là Bát vận tọa Sửu hướng Mùi. Nhưng cách cục chỉ là một nửa: nó cần phối đúng địa hình, tức phía sau cao và vững, phía trước thoáng, thì mới phát huy theo lý thuyết cổ.',
  },
  {
    q: 'Nhà tôi lập bàn ở Cửu vận, vì sao không bao giờ ra Vượng sơn Vượng hướng?',
    a: 'Không phải nhà bạn có vấn đề. Đó là tính chất toán học của hệ: chạy đủ 24 sơn của Cửu vận thì không có sơn nào cho ra Vượng sơn Vượng hướng, cũng không có Thượng sơn Hạ thủy; toàn bộ chia đôi thành 12 Song tinh đáo hướng và 12 Song tinh đáo tọa. Vận 1 cũng vậy. Riêng vận 5 là trường hợp đặc biệt, không có chính quái. Người xưa đã ghi nhận điều này bằng câu nhất vận và cửu vận không có cục Vượng sơn Vượng hướng.',
  },
  {
    q: 'Nhà xây đã lâu thì lấy vận nào để lập bàn?',
    a: 'Thông lệ phổ biến là lấy nguyên vận tại thời điểm ngôi nhà thành hình, tức năm xây xong hoặc lần sửa chữa lớn gần nhất, chứ không phải năm bạn dọn vào. Nhưng đây chính là chỗ các trường phái bất đồng: thế nào là sửa lớn đủ để đổi vận thì mỗi sách nói một kiểu. Nếu không chắc, hãy lập cả bàn theo vận xây lẫn bàn theo vận hiện tại rồi đọc như hai góc nhìn, thay vì tin tuyệt đối vào một bàn.',
  },
  {
    q: 'Phi Tinh khác Bát Trạch thế nào?',
    a: 'Hai hệ trả lời hai câu hỏi khác nhau. Bát Trạch xét người và tĩnh: từ năm sinh và giới tính ra cung phi, chia Đông tứ mệnh và Tây tứ mệnh, kết quả gắn với người và không đổi theo thời gian. Phi Tinh xét nhà và đổi theo vận: dùng tọa hướng của ngôi nhà cùng nguyên vận 20 năm, không dùng năm sinh chủ nhà. Vì vậy đừng gộp kết quả hai hệ vào một câu kết luận chung.',
  },
  {
    q: 'Thế quái (kiêm hướng) là gì, vì sao hieu.asia không làm?',
    a: 'Khi hướng nhà đo được nằm sát ranh giữa hai sơn, một số trường phái không dùng phép an bàn thông thường (gọi là Hạ Quái) mà thay số theo khẩu quyết riêng, gọi là Thế quái hay kiêm hướng. Vấn đề là khẩu quyết này các phái ghi khác nhau, chưa thống nhất. hieu.asia chỉ dựng phương pháp Hạ Quái tiêu chuẩn và nói rõ giới hạn đó, vì thà thiếu còn hơn bịa ra một con số không kiểm chứng được.',
  },
  {
    q: 'Lập xong tinh bàn thì có phải sửa nhà không?',
    a: 'Không. Phần an bàn là tính toán xác định, nhưng phần luận giải chỉ là gợi ý xu hướng theo quy ước cổ, chưa có bằng chứng khoa học, và mới là một nửa của phong thủy vì còn thiếu loan đầu, tức địa hình, dòng nước, đường đi, nhà xung quanh mà công cụ web không thấy được. Cách dùng hợp lý là ưu tiên những thứ dịch chuyển được như bàn làm việc, giường, chỗ ngồi. Đừng đập phá nhà cửa theo một tinh bàn, và hieu.asia không bán dịch vụ hóa giải.',
  },
];

const JSONLD = [
  article({
    headline: 'Huyền Không Phi Tinh: tam nguyên cửu vận, lập tinh bàn 9 cung và các cách cục',
    description:
      'Huyền Không Phi Tinh chuyên sâu: tam nguyên cửu vận, cách lập tinh bàn từ vận tinh đến sơn tinh và hướng tinh, quy tắc bay thuận nghịch, các cách cục và giới hạn của phương pháp.',
    url: '/learn/huyen-khong-phi-tinh',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Huyền Không Phi Tinh', url: '/learn/huyen-khong-phi-tinh' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Huyền Không Phi Tinh — tam nguyên cửu vận & lập tinh bàn',
    description:
      'Học Huyền Không Phi Tinh từ đầu: hiểu tam nguyên cửu vận, tự lập tinh bàn 9 cung với vận tinh – sơn tinh – hướng tinh, đọc cách cục và biết rõ giới hạn của hệ này.',
    url: '/learn/huyen-khong-phi-tinh',
  }),
];

const TH = 'px-4 py-2.5 font-semibold text-foreground';
const TD = 'px-4 py-2 text-muted-foreground';
const CELL = 'flex aspect-square flex-col items-center justify-center rounded-lg bg-card/60 p-1 text-center';
const NUM = 'font-heading text-xl font-semibold text-foreground';
const GUA_TXT = 'mt-0.5 text-[11px] leading-tight text-muted-foreground';
const CAP = 'mt-2 text-center text-xs text-muted-foreground';

/** Một bàn đơn (vận / sơn / hướng) trên lưới 3×3 chuẩn Huyền Không. */
function PlateGrid({ plate, caption }: { plate: number[]; caption: string }) {
  return (
    <figure className="mx-auto max-w-[280px]">
      <div className="grid grid-cols-3 gap-1.5">
        {PALACES.map((p) => (
          <div key={p.grid} className={`${CELL} border border-border`}>
            <span className={NUM}>{plate[p.grid]!}</span>
            <span className={GUA_TXT}>{p.gua}</span>
          </div>
        ))}
      </div>
      <figcaption className={CAP}>{caption}</figcaption>
    </figure>
  );
}

/** Tinh bàn đủ ba tầng số, bố cục giống công cụ /phi-tinh. */
function ChartGrid({ chart, caption }: { chart: FlyingStarChart; caption: string }) {
  const sitGrid = GRID_OF_GUA.get(chart.sitting.gua);
  const faceGrid = GRID_OF_GUA.get(chart.facing.gua);
  return (
    <figure className="mx-auto max-w-[330px]">
      <div className="grid grid-cols-3 gap-1.5">
        {chart.palaces.map((ps) => {
          const sit = ps.palace.grid === sitGrid;
          const face = ps.palace.grid === faceGrid;
          const ring = sit ? 'border-primary' : face ? 'border-gold/60' : 'border-border';
          return (
            <div key={ps.palace.grid} className={`relative border ${ring} ${CELL}`}>
              <span className="absolute left-1.5 top-1 text-[11px] font-semibold text-primary">{ps.son}</span>
              <span className="absolute right-1.5 top-1 text-[11px] font-semibold text-gold-700">{ps.huong}</span>
              <span className={NUM}>{ps.van}</span>
              <span className={GUA_TXT}>{ps.palace.gua}</span>
              {sit ? <span className="absolute bottom-0.5 text-[10px] font-semibold text-primary">TỌA</span> : null}
              {face ? <span className="absolute bottom-0.5 text-[10px] font-semibold text-gold-700">HƯỚNG</span> : null}
            </div>
          );
        })}
      </div>
      <figcaption className={CAP}>{caption}</figcaption>
    </figure>
  );
}

export default function LearnHuyenKhongPhiTinhPage() {
  const { rows: patternRows, labels: patternLabels } = buildPatternMatrix();
  const labelOf = (p: FlyingStarPattern) => patternLabels.get(p) ?? p;
  const exSitGrid = GRID_OF_GUA.get(EXAMPLE.sitting.gua)!;
  const exFaceGrid = GRID_OF_GUA.get(EXAMPLE.facing.gua)!;

  return (
    <LearnArticle
      eyebrow="PHONG THỦY · HUYỀN KHÔNG"
      title={
        <>
          Huyền Không{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">Phi Tinh</span>
        </>
      }
      standfirst={
        <>
          Đây là trường phái phong thủy đặt <strong>thời gian</strong> vào công thức: mỗi 20 năm đổi
          một vận, và cùng một ngôi nhà sẽ có tinh bàn khác nhau ở hai vận khác nhau. Bài này chỉ
          bạn tự lập một tinh bàn 9 cung bằng tay, đọc đúng ba tầng số, và biết rõ hệ này nói được
          gì — cũng như không nói được gì.
        </>
      }
      readMeta="13 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Huyền Không Phi Tinh' },
      ]}
      relatedLenses={relatedLearnLenses('huyen-khong-phi-tinh')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Chọn nguyên vận và sơn tọa của ngôi nhà, hệ thống an đủ vận tinh – sơn tinh – hướng tinh cho 9 cung và phán cách cục. Cùng một thuật toán bài này vừa mô tả.',
        href: '/phi-tinh',
        label: 'Lập bàn Phi Tinh',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <PhiTinhFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Huyền Không Phi Tinh là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Huyền Không Phi Tinh</strong> (玄空飛星) là một trường phái thuộc nhánh{' '}
                <strong>Lý Khí</strong> của phong thủy — nhánh dùng la bàn và công thức để tính. Cái
                tên mô tả đúng việc nó làm: chín con số <em>bay</em> (phi) vào chín cung theo một
                đường đi cố định.
              </p>
              <p>
                Điểm khiến nó khác hẳn mọi hệ phong thủy khác nằm ở một chữ:{' '}
                <strong>thời gian</strong>. Huyền Không cho rằng khí của không gian không đứng yên
                mà đổi theo chu kỳ — mỗi <strong>vận 20 năm</strong> một lần. Vì vậy đầu vào của nó
                chỉ có hai thứ, và cả hai đều thuộc về <em>ngôi nhà</em>, không thuộc về người ở:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Nguyên vận</strong> — ngôi nhà thành hình vào vận nào (suy từ năm xây hoặc
                  lần sửa lớn gần nhất).
                </li>
                <li>
                  <strong>Tọa và hướng</strong> — lưng nhà dựa về đâu, mặt nhà nhìn về đâu, đo chính
                  xác tới 1 trong <strong>24 sơn</strong> (mỗi sơn 15°).
                </li>
              </ul>
              <p>
                Kết quả là một <strong>tinh bàn</strong> 9 ô. Mỗi ô có ba con số:{' '}
                <strong>vận tinh</strong> (giữa) là khí của nguyên vận tại cung đó,{' '}
                <strong>sơn tinh</strong> (góc trái) chủ về người – sức khỏe – nhân đinh, và{' '}
                <strong>hướng tinh</strong> (góc phải) chủ về tài lộc – cơ hội.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Và đây là những gì Phi Tinh KHÔNG phải
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải Bát Trạch.</strong> Bát Trạch xét <em>người</em> và <em>tĩnh</em>:
                  từ năm sinh và giới tính ra cung phi, chia Đông – Tây tứ mệnh, kết quả gắn với
                  người và không đổi theo thời gian. Phi Tinh xét <em>nhà</em> và <em>đổi theo vận</em>,
                  hoàn toàn không dùng năm sinh chủ nhà. Muốn phần cung phi và bốn hướng hợp tuổi thì
                  xem bài{' '}
                  <Link href="/learn/bat-trach" className="text-gold-700 underline-offset-4 hover:underline">
                    Bát Trạch
                  </Link>{' '}
                  và công cụ{' '}
                  <Link href="/huong-nha" className="text-gold-700 underline-offset-4 hover:underline">
                    hướng nhà hợp tuổi
                  </Link>
                  .
                </li>
                <li>
                  <strong>Không phải toàn bộ phong thủy.</strong> Đây mới là phần lý khí. Phần{' '}
                  <strong>loan đầu</strong> — thế đất, dòng nước, đường đi, nhà xung quanh — nằm
                  ngoài công thức và phải khảo sát tại chỗ. Một tinh bàn đẹp đặt trên địa hình ngược
                  thì theo chính lý thuyết cổ cũng không phát huy.
                </li>
                <li>
                  <strong>Không phải hệ đã thống nhất.</strong> hieu.asia chỉ dựng phương pháp{' '}
                  <strong>Hạ Quái</strong> (下卦) tiêu chuẩn, không làm phần <strong>Thế quái</strong>{' '}
                  (kiêm hướng) vì khẩu quyết các phái còn bất đồng — thà thiếu còn hơn bịa.
                </li>
                <li>
                  <strong>Không phải lời phán số mệnh.</strong> Phần an bàn là con số xác định; phần
                  luận giải chỉ là xu hướng tham khảo để bố trí không gian. Bài này không dạy cách
                  "hóa giải" bằng vật phẩm và hieu.asia không bán dịch vụ hóa giải.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Ba việc bài này sẽ dạy bạn làm được: biết mình đang ở vận nào, tự lập một tinh bàn 9
                cung bằng giấy bút, và đọc được tên cách cục mà công cụ trả về.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <PhiTinhDepth />,
        },
        {
          id: 'tam-nguyen-cuu-van',
          tocLabel: 'Tam nguyên cửu vận',
          heading: 'Tam nguyên cửu vận: chiếc đồng hồ 180 năm',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Trước khi lập bàn phải trả lời câu hỏi đầu tiên: <strong>đang ở vận nào</strong>.
                Huyền Không chia dòng thời gian thành <strong>9 vận</strong>, mỗi vận{' '}
                <strong>20 năm</strong>. Ba vận gộp thành một <strong>nguyên</strong> 60 năm, và ba
                nguyên — Thượng, Trung, Hạ — khép lại một vòng <strong>180 năm</strong>. Đó là ý
                nghĩa của cái tên <em>tam nguyên cửu vận</em>. Vòng mà công cụ hieu.asia phủ là{' '}
                <strong>{yunStart(1)}–{yunEnd(9)}</strong> — đúng 180 năm, tròn một vòng.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[460px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>Nguyên</th>
                      <th scope="col" className={TH}>Vận</th>
                      <th scope="col" className={TH}>Khoảng năm</th>
                      <th scope="col" className={TH}>Sao đương vận</th>
                    </tr>
                  </thead>
                  <tbody>
                    {YUN_NAMES.map((name, i) => {
                      const yun = i + 1;
                      const isNow = yun === CURRENT_YUN;
                      return (
                        <tr key={yun} className={`border-b border-border/60 last:border-b-0 ${isNow ? 'bg-gold/10' : ''}`}>
                          <td className={TD}>{nguyenOf(yun)}</td>
                          <td className="px-4 py-2 font-medium text-foreground">
                            {name} vận
                            {isNow ? (
                              <span className="ml-2 rounded bg-gold/20 px-1.5 py-0.5 text-[11px] font-semibold text-gold-700">
                                đương vận
                              </span>
                            ) : null}
                          </td>
                          <td className={TD}>{yunStart(yun)}–{yunEnd(yun)}</td>
                          <td className={TD}>{yun} · {STAR_NATURE[i]!.name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p>
                Tính tới năm {REFERENCE_YEAR}, chúng ta đang ở{' '}
                <strong>
                  {YUN_NAMES[CURRENT_YUN - 1]} vận ({yunStart(CURRENT_YUN)}–{yunEnd(CURRENT_YUN)})
                </strong>{' '}
                thuộc {nguyenOf(CURRENT_YUN)} — sao đương vận là số{' '}
                <strong>{CURRENT_YUN} ({STAR_NATURE[CURRENT_YUN - 1]!.name})</strong>. Vận liền trước
                là Bát vận (2004–2023) với sao đương vận số 8; đó là lý do rất nhiều tài liệu phong
                thủy viết trước 2024 nói "số 8 là tài tinh" — câu đó <strong>đã hết hạn</strong> từ
                2024.
              </p>
              <p>
                Đây chính là điểm đáng giá nhất của Huyền Không, cũng là điểm dễ gây khó chịu nhất:
                nó thừa nhận rằng <strong>một kết luận phong thủy có tuổi thọ</strong>. Một cách bố
                trí "đúng" ở Bát vận không đương nhiên còn đúng ở Cửu vận.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">Bản chất 9 sao (tham khảo)</h3>
              <p>
                Chín con số trong tinh bàn không phải số đếm, chúng là tên chín sao. Đây là mô tả
                ngắn theo tri thức cổ điển — đọc như <em>xu hướng</em>, không phải phán hung cát
                tuyệt đối:
              </p>
              <ul className="space-y-1.5 rounded-xl border border-border bg-card/40 p-4 text-sm text-muted-foreground">
                {STAR_NATURE.map((s) => (
                  <li key={s.num}>
                    <strong className="text-foreground">{s.num} · {s.name}</strong> ({s.element}) — {s.note}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-foreground/70">
                Một sao "tốt hay xấu" trong Huyền Không phụ thuộc vào <strong>vận</strong>: sao đang
                đương vận thì vượng, sao đã qua vận thì thoái. Đó là lý do số 7 (Thất Xích) từng là
                sao vượng giai đoạn 1984–2003 và nay đã thoái.
              </p>
            </div>
          ),
        },
        {
          id: 'lap-tinh-ban',
          tocLabel: 'Lập tinh bàn',
          heading: 'Lập tinh bàn từng bước: vận tinh → sơn tinh → hướng tinh',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần này là lõi của cả bài. Lập một tinh bàn gồm bốn bước, và bạn hoàn toàn làm được
                bằng giấy bút nếu chịu khó đi chậm.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 1 — Dựng địa bàn 9 cung theo Lạc Thư
              </h3>
              <p>
                Tấm nền cố định là <strong>Lạc Thư</strong>: 9 cung, mỗi cung một quái và một số bất
                biến. Lưu ý quy ước vẽ của Huyền Không:{' '}
                <strong>trên là Nam, dưới là Bắc, trái là Đông, phải là Tây</strong> — ngược với bản
                đồ địa lý hiện đại, và đây là chỗ người mới hay đọc sai.
              </p>
              <div className="rounded-xl border border-border bg-card/40 p-4">
                <PlateGrid
                  plate={PALACES.map((p) => p.luoshu)}
                  caption="Địa bàn Lạc Thư — số cố định của 9 cung (trên Nam, dưới Bắc)"
                />
                <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                  {PALACES.map((p) => `${p.gua} ${p.luoshu} (${p.dir})`).join(' · ')}
                </p>
              </div>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Bước 2 — An bàn vận: số vận nhập trung, bay thuận
              </h3>
              <p>
                Lấy <strong>số của nguyên vận</strong> đặt vào trung cung, rồi bay theo đúng đường
                Lạc Thư. Đường bay thuận đi như sau (bay nghịch là đúng đường này đi ngược lại), mỗi
                bước sang cung kế tiếp thì số cộng thêm 1, quá 9 thì quay về 1:
              </p>
              <p className="rounded-xl border border-border bg-card/40 px-4 py-3 font-mono text-[13px] leading-relaxed text-muted-foreground">
                {FLY_PATH.map((p, i) => (
                  <span key={p.grid}>
                    {i > 0 ? ' → ' : ''}
                    <span className="text-foreground">{p.gua}</span> ({p.dir})
                  </span>
                ))}
              </p>
              <div className="rounded-xl border border-border bg-card/40 p-4">
                <PlateGrid plate={flyPlate(8, true)} caption="Bàn vận của Bát vận — 8 nhập trung, phi thuận" />
              </div>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Bước 3 — Xác định tọa và hướng trong 24 sơn
              </h3>
              <p>
                Vòng la bàn 360° được chia thành <strong>24 sơn</strong>, mỗi sơn <strong>15°</strong>.
                Cứ ba sơn thuộc một quái, và ba sơn đó mang ba <strong>tam nguyên long</strong> khác
                nhau: Địa – Thiên – Nhân. Mỗi sơn lại mang thuộc tính <strong>Âm</strong> hoặc{' '}
                <strong>Dương</strong> theo quy ước Huyền Không — thuộc tính này chính là thứ quyết
                định chiều bay ở bước 4.
              </p>
              <p className="font-mono text-[13px] text-muted-foreground sm:hidden" aria-hidden="true">
                ← vuốt ngang →
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>Quái · phương vị</th>
                      <th scope="col" className={TH}>Địa nguyên long</th>
                      <th scope="col" className={TH}>Thiên nguyên long</th>
                      <th scope="col" className={TH}>Nhân nguyên long</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GUA_ORDER.map((gua) => {
                      const three = MOUNTAINS.filter((m) => m.gua === gua);
                      return (
                        <tr key={gua} className="border-b border-border/60 last:border-b-0">
                          <td className="px-4 py-2 font-medium text-foreground">
                            {gua} <span className="text-xs text-muted-foreground">({DIR_OF_GUA.get(gua)})</span>
                          </td>
                          {[0, 1, 2].map((yl) => {
                            const m = three.find((x) => x.yuanLong === yl)!;
                            return (
                              <td key={yl} className={TD}>
                                <span className="text-foreground">{m.name}</span> ({m.han}) · {m.centerDeg}° ·{' '}
                                <span className={m.yang ? 'text-amber-700 dark:text-amber-300' : 'text-sky-700 dark:text-sky-300'}>
                                  {m.yang ? 'Dương' : 'Âm'}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Bảng này dựng thẳng từ dữ liệu của engine (<code className="font-mono text-[13px]">MOUNTAINS</code>{' '}
                trong <code className="font-mono text-[13px]">lib/phi-tinh.ts</code>), không chép tay.{' '}
                <strong>Sơn tọa</strong> là hướng lưng nhà quay về;{' '}
                <strong>hướng nhà là đối diện</strong>, tức cộng 180°.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Bước 4 — An bàn sơn và bàn hướng
              </h3>
              <p>Đây là bước nhiều người tắc. Quy tắc gọn trong bốn câu:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Nhìn vào <strong>bàn vận</strong>, lấy con số đang nằm ở <strong>cung tọa</strong>.
                  Cho số đó nhập trung cung → đây là tâm của <strong>bàn sơn</strong>.
                </li>
                <li>
                  Lấy con số đang nằm ở <strong>cung hướng</strong> của bàn vận. Cho số đó nhập trung
                  cung → tâm của <strong>bàn hướng</strong>.
                </li>
                <li>
                  Mỗi bàn bay theo chiều riêng. Số vừa nhập trung ứng với một quái; trong quái đó lấy
                  sơn <strong>cùng tam nguyên long</strong> với sơn tọa (hoặc sơn hướng) rồi xét âm
                  dương: <strong>Dương → bay thuận</strong>, <strong>Âm → bay nghịch</strong>.
                </li>
                <li>
                  Trường hợp số nhập trung là <strong>5</strong> thì không có quái nào ứng, nên mượn
                  luôn âm dương của chính sơn tọa hoặc sơn hướng đang xét.
                </li>
              </ol>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Ví dụ đầy đủ: {YUN_NAMES[EXAMPLE.yun - 1]} vận, tọa {EXAMPLE.sitting.name} hướng{' '}
                {EXAMPLE.facing.name}
              </h3>
              <p>
                Đây là một trong những lá số mẫu kinh điển nhất của Huyền Không, vẫn được dùng để
                kiểm tra xem một người (hay một phần mềm) an bàn có đúng không.
              </p>
              <div className="space-y-3 rounded-xl border border-border bg-card/40 p-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <strong className="text-foreground">Dữ kiện.</strong> Vận {YUN_NAMES[EXAMPLE.yun - 1]}{' '}
                  ({yunStart(EXAMPLE.yun)}–{yunEnd(EXAMPLE.yun)}). Tọa{' '}
                  <strong className="text-foreground">{EXAMPLE.sitting.name}</strong> ({EXAMPLE.sitting.han}) ở{' '}
                  {EXAMPLE.sitting.centerDeg}°, thuộc cung {EXAMPLE.sitting.gua}, {yuanOf(EXAMPLE.sitting)},{' '}
                  {EXAMPLE.sitting.yang ? 'Dương' : 'Âm'}. Hướng đối diện là{' '}
                  <strong className="text-foreground">{EXAMPLE.facing.name}</strong> ({EXAMPLE.facing.han}) ở{' '}
                  {EXAMPLE.facing.centerDeg}°, cung {EXAMPLE.facing.gua}.
                </p>
                <p>
                  <strong className="text-foreground">Bàn vận.</strong> Số {EXAMPLE.yun} nhập trung, bay
                  thuận. Tại cung tọa ({EXAMPLE.sitting.gua}) bàn vận cho số{' '}
                  <strong className="text-foreground">{EXAMPLE.vanPlate[exSitGrid]!}</strong>; tại cung
                  hướng ({EXAMPLE.facing.gua}) cho số{' '}
                  <strong className="text-foreground">{EXAMPLE.vanPlate[exFaceGrid]!}</strong>.
                </p>
                <p>
                  <strong className="text-foreground">Hai bàn còn lại.</strong> Số {EXAMPLE.sonPlate[4]!}{' '}
                  nhập trung cho bàn sơn: số này ứng quái Khôn, sơn cùng {yuanOf(EXAMPLE.sitting)} trong
                  quái Khôn là Mùi, thuộc Âm →{' '}
                  <strong className="text-foreground">{EXAMPLE.sonForward ? 'bay thuận' : 'bay nghịch'}</strong>.
                  Số {EXAMPLE.huongPlate[4]!} nhập trung cho bàn hướng: số 5 không có quái nên mượn âm
                  dương của chính sơn hướng {EXAMPLE.facing.name} ({EXAMPLE.facing.yang ? 'Dương' : 'Âm'}) →{' '}
                  <strong className="text-foreground">{EXAMPLE.huongForward ? 'bay thuận' : 'bay nghịch'}</strong>.
                </p>
                <p>
                  <strong className="text-foreground">Kết quả.</strong> Sơn tinh{' '}
                  {EXAMPLE.sonPlate[exSitGrid]!} rơi đúng vào cung tọa, hướng tinh{' '}
                  {EXAMPLE.huongPlate[exFaceGrid]!} rơi đúng vào cung hướng — cả hai đều là sao đương
                  vận của {YUN_NAMES[EXAMPLE.yun - 1]} vận. Cách cục:{' '}
                  <strong className="text-foreground">{EXAMPLE.patternLabel}</strong>.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card/40 p-4">
                <ChartGrid
                  chart={EXAMPLE}
                  caption={`Tinh bàn ${YUN_NAMES[EXAMPLE.yun - 1]} vận, tọa ${EXAMPLE.sitting.name} hướng ${EXAMPLE.facing.name}`}
                />
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Góc trái = sơn tinh · số lớn ở giữa = vận tinh · góc phải = hướng tinh
                </p>
              </div>
              <p className="text-sm text-foreground/70">
                Toàn bộ con số trong ví dụ này được engine tính tại chỗ, không gõ tay — nên nó trùng
                khít với kết quả bạn nhận được khi nhập cùng dữ kiện vào công cụ{' '}
                <Link href="/phi-tinh" className="text-gold-700 underline-offset-4 hover:underline">
                  lập bàn Phi Tinh
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'cach-cuc',
          tocLabel: 'Các cách cục',
          heading: 'Bốn cách cục chính và điều ít ai nói',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Lập bàn xong, việc đầu tiên là nhìn <strong>hai ô</strong>: ô cung tọa và ô cung
                hướng. Câu hỏi duy nhất: <strong>sao đương vận đang ở đâu?</strong> Bốn khả năng
                chính:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>{labelOf('vuong-son-vuong-huong')}</strong> — sơn tinh đương vận tới cung
                  tọa <em>và</em> hướng tinh đương vận tới cung hướng. Đây là cách được xem là tốt
                  nhất: hợp thì cả người lẫn của đều vượng. Điều kiện đi kèm:{' '}
                  <strong>tọa thực hướng không</strong> — phía sau cao và vững, phía trước thoáng.
                </li>
                <li>
                  <strong>{labelOf('thuong-son-ha-thuy')}</strong> — hai sao đương vận đảo vị: sao
                  chủ người ra trước, sao chủ của ra sau. Nếu địa hình cũng ngược (sau thấp hoặc
                  trống, trước cao hoặc bịt) thì bất lợi; phối đúng địa hình thì theo lý thuyết cổ
                  vẫn hóa giải được. Đây <em>không phải</em> bản án.
                </li>
                <li>
                  <strong>{labelOf('song-tinh-dao-huong')}</strong> — cả sơn tinh lẫn hướng tinh
                  đương vận đều dồn về cung hướng: lợi về <strong>tài</strong>, phía trước nên thoáng
                  hoặc có thủy; phần người hơi yếu, cần bù.
                </li>
                <li>
                  <strong>{labelOf('song-tinh-dao-toa')}</strong> — cả hai dồn về cung tọa: lợi về{' '}
                  <strong>đinh</strong> (người, sức khỏe); phía sau nên có điểm tựa để thu khí.
                </li>
              </ul>
              <p>
                Ngoài bốn cách trên, engine còn gắn cờ vài trường hợp hiếm gặp như{' '}
                <strong>hợp thập</strong> (bàn sơn hoặc bàn hướng cộng với bàn vận đều ra 10) và{' '}
                <strong>phụ mẫu tam ban quái</strong> (mỗi cung đủ bộ 1-4-7 / 2-5-8 / 3-6-9).
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Điều ít ai nói: cách cục không rải đều giữa các vận
              </h3>
              <p>
                Chạy engine qua đủ <strong>9 vận × 24 sơn = 216 cục</strong> sẽ thấy một sự thật mà
                nhiều lời quảng cáo phong thủy lờ đi:
              </p>
              <p className="font-mono text-[13px] text-muted-foreground sm:hidden" aria-hidden="true">
                ← vuốt ngang →
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>Vận</th>
                      {PATTERN_ORDER.map((p) => (
                        <th key={p} scope="col" className={TH}>{labelOf(p).replace(/\s*\(.*\)$/, '')}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patternRows.map((row) => (
                      <tr
                        key={row.yun}
                        className={`border-b border-border/60 last:border-b-0 ${row.yun === CURRENT_YUN ? 'bg-gold/10' : ''}`}
                      >
                        <td className="px-4 py-2 font-medium text-foreground">
                          {YUN_NAMES[row.yun - 1]} vận{' '}
                          <span className="text-xs text-muted-foreground">
                            ({yunStart(row.yun)}–{yunEnd(row.yun)})
                          </span>
                        </td>
                        {PATTERN_ORDER.map((p) => (
                          <td key={p} className={`px-4 py-2 ${row.counts[p] ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                            {row.counts[p] ?? '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Bảng này cho ba điều đáng nhớ. Thứ nhất, ở các vận 2, 3, 4, 6, 7, 8 thì 24 sơn chia{' '}
                <strong>đều tăm tắp 6 – 6 – 6 – 6</strong> cho bốn cách. Thứ hai, ở{' '}
                <strong>Nhất vận và Cửu vận</strong> — tức cả giai đoạn {yunStart(9)}–{yunEnd(9)}{' '}
                chúng ta đang sống —{' '}
                <strong>không có bất kỳ sơn nào cho ra Vượng sơn Vượng hướng</strong>, cũng không có
                Thượng sơn Hạ thủy; toàn bộ chia đôi thành song tinh đáo hướng và song tinh đáo tọa.
                Người xưa đã đúc thành câu: <em>nhất vận, cửu vận không có cục Vượng sơn Vượng hướng</em>.
                Thứ ba, <strong>Ngũ vận</strong> là ngoại lệ: số 5 không có chính quái nên toàn bộ 24
                sơn được xếp riêng.
              </p>
              <p className="text-sm text-foreground/70">
                Hệ quả rất thực tế: nếu ai đó chào bán cho bạn một căn nhà "Vượng sơn Vượng hướng"
                cho Cửu vận, con số đó không thể đến từ phép Hạ Quái tiêu chuẩn.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Cùng một ngôi nhà, đổi vận là đổi bàn
              </h3>
              <p>
                Đây là điều làm Huyền Không khác mọi hệ khác. Lấy đúng một ngôi nhà tọa{' '}
                {TY_VAN8.sitting.name} hướng {TY_VAN8.facing.name}, chỉ đổi nguyên vận:
              </p>
              <div className="grid gap-4 rounded-xl border border-border bg-card/40 p-4 sm:grid-cols-2">
                <ChartGrid
                  chart={TY_VAN8}
                  caption={`${YUN_NAMES[7]} vận (${yunStart(8)}–${yunEnd(8)}) → ${TY_VAN8.patternLabel}`}
                />
                <ChartGrid
                  chart={TY_VAN9}
                  caption={`${YUN_NAMES[8]} vận (${yunStart(9)}–${yunEnd(9)}) → ${TY_VAN9.patternLabel}`}
                />
              </div>
              <p>
                Ngôi nhà không xê dịch một centimet, la bàn vẫn chỉ đúng chỗ cũ, vậy mà cả ba tầng số
                đều đổi và tên cách cục cũng đổi. Với người theo Huyền Không, đó là điểm mạnh: hệ
                thừa nhận thời gian có vai trò. Với người hoài nghi, đó lại là điểm yếu: một hệ mà
                kết luận tự lật sau 20 năm thì rất khó kiểm chứng. Cả hai cách đọc đều hợp lý, và bạn
                nên biết cả hai.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: cái gì là phép tính, cái gì là quy ước',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Cần tách bạch hai lớp, vì chúng có độ tin cậy rất khác nhau.{' '}
                <strong>Lớp an bàn</strong> — từ vận và tọa hướng ra 27 con số — là phép tính xác
                định, ai làm cũng ra kết quả y hệt, kiểm chứng được bằng các lá số mẫu.{' '}
                <strong>Lớp luận giải</strong> — sao này chủ việc gì, tổ hợp kia nên bố trí ra sao —
                là quy ước truyền thống, không có thứ gì tương đương một phép chứng minh.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Chưa có bằng chứng khoa học.</strong> Không có nghiên cứu nào cho thấy vị
                  trí các con số trong tinh bàn ảnh hưởng tới tài lộc hay sức khỏe. Đây là tri thức
                  truyền thống được hệ thống hóa rất công phu — đáng biết như một phần văn hóa, không
                  phải định luật tự nhiên.
                </li>
                <li>
                  <strong>Hệ quy ước phức tạp và các phái bất đồng ngay ở gốc.</strong> Lấy vận theo
                  năm xây hay năm sửa lớn? Sửa tới mức nào thì đổi vận? Hướng nhà là hướng cửa chính
                  hay mặt tiền toàn khối? Nhà chung cư thì tính cả tòa hay từng căn? Mỗi câu có nhiều
                  đáp án tùy sách. Một hệ mà người trong nghề còn chưa thống nhất ở nền thì không nên
                  đọc như chân lý.
                </li>
                <li>
                  <strong>Thế quái (kiêm hướng) là vùng xám thật sự.</strong> Khi hướng đo được nằm
                  sát ranh hai sơn, một số phái thay số theo khẩu quyết riêng — và các khẩu quyết đó
                  khác nhau. hieu.asia chỉ làm <strong>Hạ Quái</strong> tiêu chuẩn và nói thẳng giới
                  hạn này, thay vì đưa ra một con số không kiểm chứng được.
                </li>
                <li>
                  <strong>Sai số đo là rủi ro lớn nhất.</strong> Mỗi sơn chỉ rộng 15°. La bàn điện
                  thoại lệch vài độ, đứng gần cột thép hay tủ lạnh, hoặc nhầm giữa mép cửa và mặt
                  tiền toàn khối — là bạn có thể rơi sang sơn bên cạnh và nhận một tinh bàn khác hẳn.
                  Bàn tính đúng trên dữ liệu sai vẫn là kết quả sai.
                </li>
                <li>
                  <strong>Mới là một nửa của phong thủy.</strong> Toàn bộ phần loan đầu — địa hình,
                  dòng nước, đường đi, nhà xung quanh — nằm ngoài công thức và công cụ web không thấy
                  được. Chính lý thuyết cổ cũng nói cách cục phải phối với địa hình mới có nghĩa.
                </li>
              </ul>

              <h3 className="pt-2 text-lg font-semibold text-foreground">Đừng đập nhà theo tinh bàn</h3>
              <p>
                Nếu bàn ra một cách cục nghe không hay, việc <strong>không</strong> nên làm là đục
                tường, xoay cửa, hay bỏ căn nhà. Thứ tự hợp lý luôn là{' '}
                <strong>làm những gì rẻ và đảo ngược được trước</strong>: đổi chỗ kê bàn làm việc,
                xoay giường, chọn phòng sinh hoạt chính. Những thay đổi này tốn một buổi chiều, sai
                thì xoay lại.
              </p>
              <p>
                Và khi phải cân nhắc đánh đổi, hãy ưu tiên những thứ <em>đo được</em> và ảnh hưởng
                thật tới sức khỏe: ánh sáng tự nhiên, thông gió, tiếng ồn, độ ẩm. Một phòng ngủ "đúng
                sao" nhưng bí gió và ồn suốt đêm thì tệ hơn hẳn một phòng lệch sao mà thoáng và yên.
              </p>
              <p className="text-sm text-foreground/70">
                hieu.asia trình bày đủ thuật toán để bạn <strong>tự lập bàn và tự quyết định</strong> —
                không phán số mệnh, không dọa họa phúc, và không bán vật phẩm "hóa giải".
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <PhiTinhWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <PhiTinhRecall />,
        },
        {
          id: 'faq',
          tocLabel: 'Câu hỏi thường gặp',
          heading: 'Câu hỏi thường gặp',
          children: (
            <>
              <Accordion type="single" collapsible className="space-y-2">
                {FAQS.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="rounded border border-border px-4">
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Muốn thấy tinh bàn của chính ngôi nhà mình thay vì tính tay?{' '}
                <Link href="/phi-tinh" className="text-gold-700 underline-offset-4 hover:underline">
                  Lập bàn Phi Tinh miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/phi-tinh', label: 'Lập bàn Huyền Không Phi Tinh' },
                    { href: '/huong-nha', label: 'Xem hướng nhà hợp tuổi' },
                    { href: '/xem-tuoi-lam-nha', label: 'Xem tuổi làm nhà' },
                    { href: '/thuoc-lo-ban', label: 'Thước Lỗ Ban' },
                  ]}
                />
              </div>
            </>
          ),
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <PhiTinhChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
