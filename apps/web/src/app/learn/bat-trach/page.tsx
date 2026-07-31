/**
 * /learn/bat-trach — bài chuyên sâu về Bát Trạch (八宅 / Eight Mansions).
 *
 * GROUNDING (không có con số nào ngoài các nguồn này):
 *   • src/lib/huong-nha.ts — engine thật: cungPhi() (bảng CUNG_PHI_NAM /
 *     CUNG_PHI_NU + sumDigits), DONG_TU_MENH / TAY_TU_MENH, menhGroup(),
 *     groupLabel(), batTrachMap() (thuật toán biến hào du niên), STAR_INFO
 *     (8 du niên tinh + cờ good), DIRECTION_ORDER.
 *   • src/app/huong-nha/page.tsx — bảng tra nhanh 8 cung phi, mục "Cách tính",
 *     FAQ (hướng cửa hay tọa; cung phi nam/nữ khác nhau; lưu ý năm âm lịch:
 *     sinh trước Tết nhập lùi 1 năm).
 *   • src/app/huong-nha/[tuoi]/page.tsx + years.ts — FAQ "vợ chồng khác mệnh";
 *     Sinh Khí → cửa chính / bàn làm việc, Thiên Y → giường, bếp.
 *   • src/components/huong-nha/HuongNhaChecker.tsx — câu nhóm mệnh hợp 4 hướng
 *     và đoạn giới hạn ("tập tục phong thủy để tham khảo… không bán hóa giải").
 *
 * Bảng 8 cung phi ↔ hướng được DẪN THẲNG từ engine (batTrachMap + STAR_INFO),
 * đúng cách trang /huong-nha dựng bảng tra nhanh → bài học và công cụ không thể
 * lệch nhau. Bảng "số rút gọn → cung phi" chép đúng CUNG_PHI_NAM / CUNG_PHI_NU.
 *
 * PHẠM VI: dừng ở cung phi + Đông/Tây tứ mệnh + áp cho cửa – bếp – giường. Ý
 * nghĩa chi tiết từng du niên tinh thuộc bài riêng (công cụ tương ứng:
 * /huong-ban-lam-viec); Huyền Không Phi Tinh thuộc /phi-tinh.
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
  batTrachMap,
  menhGroup,
  groupLabel,
  STAR_INFO,
  DIRECTION_ORDER,
  DONG_TU_MENH,
  TAY_TU_MENH,
  type Quai,
  type Direction,
  type StarKey,
} from '@/lib/huong-nha';
import {
  BatTrachFrame,
  BatTrachDepth,
  BatTrachRecall,
  BatTrachChecklist,
  BatTrachWhys,
} from './_active-learning';

export const metadata: Metadata = {
  // ≤48 ký tự: root layout nối thêm " · hieu.asia" (12) và seo-guard chặn ở 60.
  title: 'Bát Trạch — cung phi và hướng nhà hợp tuổi',
  // ≤160 ký tự: dài hơn thì Google cắt mất câu chốt.
  description:
    'Bát Trạch: tính cung phi từ năm sinh và giới tính, chia Đông tứ mệnh – Tây tứ mệnh, ghép 4 hướng tốt – 4 hướng tránh cho cửa, bếp, giường. Tham khảo.',
  alternates: { canonical: 'https://hieu.asia/learn/bat-trach' },
};

// CHÉP ĐÚNG từ CUNG_PHI_NAM / CUNG_PHI_NU trong lib/huong-nha.ts (bảng
// direct-lookup, mirror worker tools/hop-tuoi.ts) — không tự tính lại. Chỉ liệt
// kê 1–9: cộng dồn chữ số của một năm 4 chữ số luôn rơi vào 1–9.
const CUNG_PHI_TABLE: { digit: number; nam: Quai; nu: Quai }[] = [
  { digit: 1, nam: 'Khảm', nu: 'Cấn' },
  { digit: 2, nam: 'Ly', nu: 'Càn' },
  { digit: 3, nam: 'Cấn', nu: 'Đoài' },
  { digit: 4, nam: 'Đoài', nu: 'Cấn' },
  { digit: 5, nam: 'Càn', nu: 'Ly' },
  { digit: 6, nam: 'Khôn', nu: 'Khảm' },
  { digit: 7, nam: 'Tốn', nu: 'Khôn' },
  { digit: 8, nam: 'Chấn', nu: 'Chấn' },
  { digit: 9, nam: 'Khôn', nu: 'Tốn' },
];

// Bảng 8 cung phi ↔ hướng — DẪN từ engine, không chép tay.
interface QuaiRow {
  quai: Quai;
  group: 'Đông' | 'Tây';
  /** hướng tọa của quẻ mệnh (nơi rơi sao Phục Vị). */
  toa: Direction;
  good: Direction[];
  bad: Direction[];
  /** hướng mang Sinh Khí — hướng tốt số 1. */
  best: Direction;
  /** hướng mang Thiên Y — hướng tốt số 2. */
  health: Direction;
}

function buildQuaiRows(): QuaiRow[] {
  return [...DONG_TU_MENH, ...TAY_TU_MENH].map((quai) => {
    const map = batTrachMap(quai);
    const dirOf = (star: StarKey) => DIRECTION_ORDER.find((d) => map[d] === star) as Direction;
    return {
      quai,
      group: menhGroup(quai),
      toa: dirOf('phuc_vi'),
      good: DIRECTION_ORDER.filter((d) => STAR_INFO[map[d]].good),
      bad: DIRECTION_ORDER.filter((d) => !STAR_INFO[map[d]].good),
      best: dirOf('sinh_khi'),
      health: dirOf('thien_y'),
    };
  });
}

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Bát Trạch là gì?',
    a: 'Bát Trạch (八宅, "tám trạch" — tiếng Anh gọi Eight Mansions) là một trường phái thuộc nhánh Lý Khí của phong thủy. Nó ghép hai vế: mệnh của người (cung phi, suy từ năm sinh và giới tính) và trạch của ngôi nhà (hướng). Tám quẻ chia làm hai nhóm — Đông tứ mệnh (Khảm, Ly, Chấn, Tốn) và Tây tứ mệnh (Càn, Khôn, Cấn, Đoài) — mỗi nhóm hợp bốn hướng cùng nhóm. Đây là hệ quy ước để tham khảo khi chọn hướng, không phải lời phán giàu nghèo.',
  },
  {
    q: 'Cách tính cung phi từ năm sinh như thế nào?',
    a: 'Hai bước. Bước một: cộng dồn các chữ số của năm sinh dương lịch, nếu ra số hai chữ số thì cộng tiếp cho tới khi còn một số từ 1 đến 9. Bước hai: tra bảng theo giới tính, vì nam và nữ dùng hai bảng khác nhau. Ví dụ 1985: 1+9+8+5 = 23 → 2+3 = 5; tra bảng thì nam ra cung Càn (Tây tứ mệnh), nữ ra cung Ly (Đông tứ mệnh).',
  },
  {
    q: 'Vì sao cùng năm sinh mà nam và nữ lại khác cung phi?',
    a: 'Vì cung phi tra theo hai bảng riêng cho nam và nữ. Cùng một số rút gọn, bảng nam và bảng nữ ánh xạ sang hai quẻ khác nhau, nên hai anh em sinh cùng năm thường thuộc hai nhóm mệnh khác nhau và hợp hai bộ hướng khác nhau. Đây là quy ước truyền lại trong sách phong thủy, không có cơ sở thiên văn hay vật lý. Chỉ số rút gọn 8 là trường hợp nam và nữ trùng nhau — cả hai đều ra cung Chấn.',
  },
  {
    q: 'Đông tứ mệnh và Tây tứ mệnh khác nhau thế nào?',
    a: 'Đông tứ mệnh gồm Khảm, Ly, Chấn, Tốn — hợp bốn hướng Bắc, Đông, Đông Nam, Nam. Tây tứ mệnh gồm Càn, Khôn, Cấn, Đoài — hợp bốn hướng Đông Bắc, Tây Nam, Tây, Tây Bắc. Nguyên tắc gọn là "mệnh nào trạch nấy": người nhóm nào thì bốn hướng cùng nhóm mang toàn sao tốt, bốn hướng nhóm kia thành sao xấu. Bốn người cùng nhóm có chung một bộ bốn hướng tốt, chỉ khác nhau ở thứ tự ưu tiên trong bốn hướng đó.',
  },
  {
    q: 'Hướng nhà là hướng cửa hay hướng lưng nhà?',
    a: 'Tùy trường phái. Phổ biến nhất là tính theo hướng cửa chính nhìn ra; một số tính theo "tọa" (hướng lưng nhà dựa vào). Bảng Bát Trạch cho biết hướng nào mang sao tốt, hướng nào mang sao xấu với cung phi của bạn — bạn áp cho cửa chính, hướng giường hoặc bàn làm việc tùy nhu cầu. Vì các phái bất đồng ở chính điểm này, đừng coi một con số duy nhất là chân lý.',
  },
  {
    q: 'Bát Trạch áp cho cửa, bếp và giường ra sao?',
    a: 'Theo truyền thống, ba thứ được ưu tiên nhất là cửa chính, bếp và giường ngủ. Cửa chính và bàn làm việc thường hướng về hướng tốt nhất (sao Sinh Khí). Giường ngủ và bàn ăn thường lấy hướng sao Thiên Y. Riêng bếp có quy tắc riêng gọi là "tọa hung — hướng cát": đặt bếp ở vùng mang sao xấu nhưng miệng bếp quay về hướng có sao tốt. Tất cả là gợi ý bố trí để tham khảo, không phải bảo đảm kết quả.',
  },
  {
    q: 'Nhà đã xây rồi, không đổi được hướng cửa thì làm sao?',
    a: 'Không cần đập đi làm lại. Thứ tự hợp lý là làm những gì di chuyển được trước: xoay hướng giường, hướng bàn làm việc, chỗ ngồi ăn — đây là phần rẻ và đảo ngược được. Cửa chính và bếp chỉ động tới khi đằng nào cũng sửa nhà. Nếu vợ chồng khác nhóm mệnh, cách thường dùng là ưu tiên tuổi người đứng tên nhà cho hướng cửa chính, rồi bố trí giường, bếp, bàn làm việc sao cho mỗi người vẫn được một hướng tốt của riêng mình.',
  },
  {
    q: 'Cung phi tính theo năm dương hay năm âm lịch?',
    a: 'Bảng cung phi cổ điển vốn tính theo năm âm lịch, đổi mốc quanh Tết Nguyên Đán, nên người sinh tháng 1 hoặc tháng 2 dương lịch trước Tết thì thuộc năm âm liền trước và cần nhập lùi một năm. Công cụ trên hieu.asia nhận năm dương lịch cho nhất quán toàn site, vì vậy ai sinh sát Tết nên thử cả hai năm rồi tự đối chiếu — đây là chỗ các trường phái có thể tính khác nhau.',
  },
  {
    q: 'Bát Trạch có khác Huyền Không Phi Tinh không?',
    a: 'Khác hẳn. Bát Trạch tính theo người: từ năm sinh và giới tính ra mệnh quái, kết quả cố định cả đời, không đổi theo thời gian. Huyền Không Phi Tinh tính theo thời gian (các Vận 20 năm) cùng tọa – hướng của ngôi nhà, và không dùng năm sinh chủ nhà. Hai phương pháp trả lời hai câu hỏi khác nhau nên không thay thế nhau, cũng không nên gộp kết quả vào một câu kết luận chung.',
  },
  {
    q: 'Hướng nhà xấu thì có phải bỏ căn nhà đó không?',
    a: 'Không. Bát Trạch là tập tục tham khảo, chưa có bằng chứng khoa học; nó chỉ dùng đúng hai dữ kiện là năm sinh và giới tính nên rất thô. Những thứ đo được và ảnh hưởng thật tới sức khỏe cùng tâm trạng — ánh sáng tự nhiên, thông gió, tiếng ồn, độ ẩm — nên được cân nhắc trước. Bỏ một căn nhà vừa túi tiền, gần chỗ làm, gần trường học chỉ vì hướng thường là đánh đổi thiệt hơn. hieu.asia nêu rõ quy tắc để bạn tự quyết, không phán giàu nghèo và không bán "hóa giải".',
  },
];

const JSONLD = [
  article({
    headline: 'Bát Trạch: cung phi, Đông tứ mệnh – Tây tứ mệnh và hướng nhà cho người mới',
    description:
      'Bát Trạch chuyên sâu: cách tính cung phi từ năm sinh và giới tính, chia Đông tứ mệnh – Tây tứ mệnh, ghép mệnh với trạch, áp cho cửa – bếp – giường. Tham khảo, không phán số mệnh.',
    url: '/learn/bat-trach',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Bát Trạch', url: '/learn/bat-trach' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Bát Trạch — cung phi, Đông/Tây tứ mệnh & hướng nhà',
    description:
      'Học Bát Trạch từ đầu: tính cung phi từ năm sinh và giới tính, phân Đông tứ mệnh – Tây tứ mệnh, đọc bảng 8 hướng và áp cho cửa chính, bếp, giường. Quy tắc minh bạch để tham khảo.',
    url: '/learn/bat-trach',
  }),
];

const TH = 'px-4 py-2.5 font-semibold text-foreground';

export default function LearnBatTrachPage() {
  const rows = buildQuaiRows();
  const dongGood = rows.find((r) => r.group === 'Đông')?.good.join(', ');
  const tayGood = rows.find((r) => r.group === 'Tây')?.good.join(', ');

  return (
    <LearnArticle
      eyebrow="PHONG THỦY · BÁT TRẠCH"
      title={
        <>
          Bát Trạch{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">(Tám Trạch)</span>
        </>
      }
      standfirst={
        <>
          Bát Trạch ghép hai vế: <strong>mệnh</strong> của người (cung phi, suy từ năm sinh và giới
          tính) với <strong>trạch</strong> của ngôi nhà (hướng). Kết quả là bốn hướng hợp và bốn
          hướng nên tránh. Bài này chỉ bạn tự tính cung phi bằng tay, đọc đúng bảng, và biết rõ hệ
          này nói được gì — cũng như không nói được gì.
        </>
      }
      readMeta="12 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Bát Trạch' },
      ]}
      relatedLenses={relatedLearnLenses('bat-trach')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập năm sinh và giới tính của gia chủ, hệ thống suy ra cung phi và lập bảng 8 hướng theo Bát Trạch: 4 hướng tốt xếp theo mức tốt, 4 hướng nên tránh.',
        href: '/huong-nha',
        label: 'Xem hướng nhà hợp tuổi',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <BatTrachFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Bát Trạch là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Bát Trạch</strong> (八宅, "tám trạch"; tiếng Anh: <em>Eight Mansions</em>) là
                một trường phái thuộc nhánh <strong>Lý Khí</strong> của phong thủy — nhánh dùng la
                bàn và công thức để tính, khác với nhánh Loan Đầu vốn phải ra thực địa quan sát thế
                đất. Cái tên nói đúng cấu trúc của nó: <strong>tám</strong> quẻ, tám hướng, tám kiểu
                "trạch".
              </p>
              <p>Bát Trạch làm đúng một việc: ghép hai vế lại với nhau.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Mệnh</strong> — quẻ đại diện cho <em>người</em>, gọi là{' '}
                  <strong>cung phi</strong> (mệnh quái), suy ra từ đúng hai dữ kiện: năm sinh và giới
                  tính.
                </li>
                <li>
                  <strong>Trạch</strong> — <em>hướng</em> của ngôi nhà, cũng quy về tám quẻ theo tám
                  hướng la bàn.
                </li>
              </ul>
              <p>
                Ghép xong, tám quẻ chia thành hai nhóm "đồng khí": <strong>Đông tứ</strong> và{' '}
                <strong>Tây tứ</strong>. Người Đông tứ mệnh hợp Đông tứ trạch, người Tây tứ mệnh hợp
                Tây tứ trạch — dân gian gọi gọn là <strong>"mệnh nào trạch nấy"</strong>. Đó là toàn
                bộ ý tưởng cốt lõi; phần còn lại chỉ là cách tính và cách áp vào từng vị trí trong
                nhà.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Và đây là những gì Bát Trạch KHÔNG phải
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải toàn bộ phong thủy.</strong> Phần Loan Đầu — thế đất, dòng nước,
                  đường đi, vật cản — nằm ngoài và phải khảo sát tại chỗ. Xem bức tranh tổng thể ở
                  bài{' '}
                  <Link href="/learn/phong-thuy" className="text-gold-700 underline-offset-4 hover:underline">
                    Phong Thủy
                  </Link>
                  .
                </li>
                <li>
                  <strong>Không phải Huyền Không Phi Tinh.</strong> Bát Trạch là hệ <em>tĩnh</em>:
                  cung phi gắn với người, không đổi theo thời gian.{' '}
                  <Link href="/phi-tinh" className="text-gold-700 underline-offset-4 hover:underline">
                    Phi Tinh
                  </Link>{' '}
                  là hệ <em>động</em>: tính theo các Vận 20 năm cùng tọa – hướng nhà, không dùng năm
                  sinh chủ nhà. Hai hệ trả lời hai câu hỏi khác nhau, đừng trộn kết quả.
                </li>
                <li>
                  <strong>Không phải lời phán giàu nghèo.</strong> Hệ này chỉ nói "hướng này ứng sao
                  gì với người có cung phi này" — không hứa tiền bạc, không dọa tai họa, và hieu.asia
                  không bán "hóa giải".
                </li>
                <li>
                  <strong>Không phải bản đồ chi tiết từng du niên.</strong> Tám sao du niên mỗi sao
                  có một lớp ý nghĩa riêng; bài này chỉ dùng chúng để xếp thứ tự ưu tiên.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Ba việc bài này sẽ dạy bạn làm được: tự tính cung phi bằng giấy bút, đọc đúng bảng
                Đông/Tây tứ mệnh, và biết ưu tiên gì khi nhà đã xây xong không đổi được hướng.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <BatTrachDepth />,
        },
        {
          id: 'cung-phi',
          tocLabel: 'Tính cung phi',
          heading: 'Tính cung phi từ năm sinh và giới tính',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Cung phi là <strong>quẻ đại diện cho một người</strong>. Toàn bộ kết quả Bát Trạch
                của bạn phụ thuộc vào con số này, nên đây là bước đáng làm chậm và làm kỹ. Tin tốt:
                chỉ cần giấy bút.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 1 — Cộng dồn chữ số của năm sinh
              </h3>
              <p>
                Lấy <strong>năm sinh dương lịch</strong>, cộng từng chữ số lại. Nếu kết quả vẫn có
                hai chữ số thì cộng tiếp, lặp cho tới khi còn <strong>một số từ 1 đến 9</strong> —
                gọi là "số rút gọn". Với một năm bốn chữ số, kết quả luôn rơi vào 1–9 nên không có
                trường hợp ra 0.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 2 — Tra bảng theo giới tính
              </h3>
              <p>
                Nam và nữ dùng <strong>hai bảng khác nhau</strong>. Cùng một số rút gọn, hai bảng ánh
                xạ sang hai quẻ khác nhau — đây là lý do luôn phải nhập cả năm sinh lẫn giới tính.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[440px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>Số rút gọn</th>
                      <th scope="col" className={TH}>Nam → cung phi</th>
                      <th scope="col" className={TH}>Nữ → cung phi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CUNG_PHI_TABLE.map((r) => (
                      <tr key={r.digit} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-foreground">{r.digit}</td>
                        <td className="px-4 py-2 text-muted-foreground">
                          {r.nam} <span className="text-xs">({groupLabel(menhGroup(r.nam))})</span>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">
                          {r.nu} <span className="text-xs">({groupLabel(menhGroup(r.nu))})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 3 — Xem mình thuộc nhóm nào
              </h3>
              <p>
                Nhìn phần trong ngoặc: quẻ của bạn thuộc <strong>Đông tứ mệnh</strong> hay{' '}
                <strong>Tây tứ mệnh</strong>. Chỉ cần biết đến đây là đã đủ để đọc bảng hướng ở phần
                sau.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">Ba ví dụ tính tay</h3>
              <div className="space-y-3 rounded-xl border border-border bg-card/40 p-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <strong className="text-foreground">Sinh 1985.</strong> 1 + 9 + 8 + 5 = 23; vẫn hai
                  chữ số nên cộng tiếp: 2 + 3 = <strong className="text-foreground">5</strong>. Tra
                  hàng số 5: nam ra cung <strong className="text-foreground">Càn</strong> (Tây tứ
                  mệnh), nữ ra cung <strong className="text-foreground">Ly</strong> (Đông tứ mệnh).
                  Một cặp vợ chồng cùng sinh 1985 sẽ thuộc <em>hai nhóm khác nhau</em> — tình huống
                  rất hay gặp, phần áp dụng bên dưới nói cách xử lý.
                </p>
                <p>
                  <strong className="text-foreground">Sinh 1993.</strong> 1 + 9 + 9 + 3 = 22 → 2 + 2
                  = <strong className="text-foreground">4</strong>. Nam ra cung{' '}
                  <strong className="text-foreground">Đoài</strong>, nữ ra cung{' '}
                  <strong className="text-foreground">Cấn</strong>: hai quẻ khác nhau nhưng{' '}
                  <em>cùng thuộc Tây tứ mệnh</em>, nên bộ bốn hướng hợp của họ giống hệt nhau — chỉ
                  khác thứ tự ưu tiên bên trong bốn hướng đó.
                </p>
                <p>
                  <strong className="text-foreground">Sinh 1988.</strong> 1 + 9 + 8 + 8 = 26 → 2 + 6
                  = <strong className="text-foreground">8</strong>. Số 8 là trường hợp duy nhất
                  trong bảng mà nam và nữ trùng nhau: cả hai đều ra cung{' '}
                  <strong className="text-foreground">Chấn</strong> (Đông tứ mệnh). Ví dụ này để nhớ
                  rằng "nam nữ khác cung phi" là <em>xu hướng</em> của bảng, không phải quy luật
                  tuyệt đối.
                </p>
              </div>

              <h3 className="pt-2 text-lg font-semibold text-foreground">Hai chỗ dễ sai, nói thẳng</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Năm âm hay năm dương.</strong> Bảng cung phi cổ điển vốn tính theo{' '}
                  <strong>năm âm lịch</strong>, đổi mốc quanh Tết Nguyên Đán. Ai sinh tháng 1 hoặc
                  tháng 2 dương lịch <em>trước Tết</em> thì thuộc năm âm liền trước, phải{' '}
                  <strong>nhập lùi một năm</strong>. Công cụ nhận năm dương lịch cho nhất quán toàn
                  site, nên người sinh sát Tết hãy thử cả hai năm rồi tự đối chiếu.
                </li>
                <li>
                  <strong>Số 5 không có quẻ riêng.</strong> Trong Lạc Thư, số 5 nằm ở trung cung và
                  không ứng quẻ nào, nên mỗi trường phái quy nó về một quẻ khác nhau. Bảng công cụ
                  dùng chốt: nam số 5 ra <strong>Càn</strong>, nữ số 5 ra <strong>Ly</strong>. Thấy
                  nơi khác ghi Khôn hoặc Cấn thì đó là khác biệt trường phái, không phải lỗi tính.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Bạn không bắt buộc phải nhớ bảng — công cụ{' '}
                <Link href="/huong-nha" className="text-gold-700 underline-offset-4 hover:underline">
                  xem hướng nhà hợp tuổi
                </Link>{' '}
                tự tính khi bạn nhập năm sinh và giới tính. Phần này để bạn hiểu con số ở đâu ra,
                thay vì nhận một kết quả "hộp đen".
              </p>
            </div>
          ),
        },
        {
          id: 'dong-tay-tu-menh',
          tocLabel: 'Đông / Tây tứ mệnh',
          heading: 'Đông tứ mệnh – Tây tứ mệnh và bảng 8 hướng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Tám quẻ được chia làm hai nhóm "đồng khí". Mỗi quẻ tọa ở một hướng theo Hậu Thiên Bát
                Quái, và bốn quẻ cùng nhóm chiếm trọn bốn hướng liền kề nhau trên la bàn:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card/40 p-4">
                  <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                    Đông tứ mệnh
                  </p>
                  <p className="mt-1.5 font-heading text-base text-foreground">
                    {DONG_TU_MENH.join(' · ')}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Hợp 4 hướng: <strong className="text-foreground">{dongGood}</strong>
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card/40 p-4">
                  <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                    Tây tứ mệnh
                  </p>
                  <p className="mt-1.5 font-heading text-base text-foreground">
                    {TAY_TU_MENH.join(' · ')}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Hợp 4 hướng: <strong className="text-foreground">{tayGood}</strong>
                  </p>
                </div>
              </div>
              <p>
                Nguyên tắc gọn trong một câu: <strong>"mệnh nào trạch nấy"</strong>. Bốn hướng cùng
                nhóm với mệnh của bạn mang toàn sao tốt; bốn hướng của nhóm còn lại thành sao xấu.
                Không có vùng xám — 8 hướng chia đôi dứt khoát 4 – 4.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Bảng đầy đủ: 8 cung phi ↔ 4 hướng tốt – 4 hướng tránh
              </h3>
              <p className="font-mono text-[13px] text-muted-foreground sm:hidden" aria-hidden="true">
                ← vuốt ngang →
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>Cung phi</th>
                      <th scope="col" className={TH}>Nhóm</th>
                      <th scope="col" className={TH}>Tọa</th>
                      <th scope="col" className={TH}>4 hướng tốt</th>
                      <th scope="col" className={TH}>4 hướng tránh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.quai} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-foreground">{r.quai}</td>
                        <td className="px-4 py-2 text-muted-foreground">{groupLabel(r.group)}</td>
                        <td className="px-4 py-2 text-muted-foreground">{r.toa}</td>
                        <td className="px-4 py-2 text-emerald-700 dark:text-emerald-300">
                          {r.good.join(', ')}
                        </td>
                        <td className="px-4 py-2 text-rose-700 dark:text-rose-300">
                          {r.bad.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Bảng này được dựng thẳng từ engine của công cụ (thuật toán biến hào du niên trong{' '}
                <code className="font-mono text-[13px]">lib/huong-nha.ts</code>), không chép tay —
                nên nội dung bài học và kết quả công cụ không thể lệch nhau.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Điều dễ hiểu nhầm nhất ở bảng này
              </h3>
              <p>
                Nhìn kỹ sẽ thấy:{' '}
                <strong>bốn người cùng nhóm có chung y hệt một bộ bốn hướng tốt</strong>. Người cung
                Khảm, Ly, Chấn hay Tốn đều hợp Bắc, Đông, Đông Nam, Nam. Vậy cung phi cụ thể để làm
                gì? Để biết <strong>thứ tự ưu tiên</strong> bên trong bốn hướng ấy — hướng nào là số
                1, hướng nào là số 2. Cột "Tọa" cho biết hướng gốc của chính quẻ mệnh, và đó luôn là
                một trong bốn hướng tốt của bạn.
              </p>
              <p>
                Thứ tự ưu tiên đó do <strong>tám du niên tinh</strong> quyết định. Ở bài này chỉ cần
                nhớ tên và phe của chúng: bốn sao tốt (tốt giảm dần) là{' '}
                <strong>Sinh Khí → Thiên Y → Diên Niên → Phục Vị</strong>; bốn sao xấu (nặng giảm
                dần) là <strong>Tuyệt Mệnh → Ngũ Quỷ → Lục Sát → Họa Hại</strong>.
              </p>
              <p className="text-sm text-foreground/70">
                Ý nghĩa riêng của từng du niên — sao nào chủ việc gì, hợp đặt cái gì — là một lớp nội
                dung riêng, không thuộc bài này. Muốn xem kết quả có sẵn theo từng du niên, dùng công
                cụ{' '}
                <Link href="/huong-ban-lam-viec" className="text-gold-700 underline-offset-4 hover:underline">
                  hướng bàn làm việc
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'ap-dung-cua-bep-giuong',
          tocLabel: 'Áp cho cửa · bếp · giường',
          heading: 'Áp vào thực tế: cửa chính, bếp, giường',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Biết bốn hướng hợp rồi thì áp vào đâu? Truyền thống ưu tiên ba thứ trong một ngôi
                nhà: <strong>cửa chính</strong>, <strong>bếp</strong> và <strong>giường ngủ</strong>.
                Ba thứ này chiếm phần lớn thời gian sinh hoạt nên được xét trước mọi thứ khác.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Cửa chính và bàn làm việc</strong> — thường hướng về{' '}
                  <strong>hướng tốt số 1</strong> (sao Sinh Khí) của gia chủ.
                </li>
                <li>
                  <strong>Giường ngủ và bàn ăn</strong> — thường lấy <strong>hướng tốt số 2</strong>{' '}
                  (sao Thiên Y).
                </li>
                <li>
                  <strong>Bếp</strong> — quy tắc riêng, không giống hai cái trên:{' '}
                  <strong>"tọa hung — hướng cát"</strong>. Nghĩa là <em>đặt</em> bếp ở vùng mang sao
                  xấu, nhưng <em>miệng bếp quay về</em> hướng có sao tốt. Đây là chỗ rất nhiều người
                  nói nhầm thành "bếp phải đặt ở hướng tốt".
                </li>
              </ul>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Hướng số 1 và số 2 theo từng cung phi
              </h3>
              <p className="font-mono text-[13px] text-muted-foreground sm:hidden" aria-hidden="true">
                ← vuốt ngang →
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>Cung phi</th>
                      <th scope="col" className={TH}>Số 1 · Sinh Khí — cửa chính, bàn làm việc</th>
                      <th scope="col" className={TH}>Số 2 · Thiên Y — giường, bàn ăn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.quai} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-foreground">
                          {r.quai}{' '}
                          <span className="text-xs text-muted-foreground">({groupLabel(r.group)})</span>
                        </td>
                        <td className="px-4 py-2 text-emerald-700 dark:text-emerald-300">{r.best}</td>
                        <td className="px-4 py-2 text-emerald-700 dark:text-emerald-300">{r.health}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Khi nhà không thể đổi hướng — thứ tự ưu tiên
              </h3>
              <p>
                Phần lớn người đọc bài này đang ở trong một căn nhà <em>đã xây xong</em>, hoặc đang
                thuê. Cửa chính không đổi được, bếp đục ra làm lại rất tốn kém. Nguyên tắc thực dụng:{' '}
                <strong>làm những gì rẻ và đảo ngược được trước</strong>.
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Xoay những thứ di chuyển được.</strong> Hướng giường, hướng bàn làm việc,
                  chỗ ngồi ăn — đổi trong một buổi chiều, không tốn tiền, sai thì xoay lại. Đây luôn
                  là bước đầu tiên.
                </li>
                <li>
                  <strong>Chỉ động tới bếp và cửa khi đằng nào cũng sửa nhà.</strong> Đang cải tạo
                  hoặc xây mới thì cân nhắc; còn không, đừng đập phá chỉ vì một bảng tra.
                </li>
                <li>
                  <strong>Nếu vợ chồng khác nhóm mệnh</strong> — xem lại ví dụ sinh 1985 ở trên: cách
                  thường dùng là ưu tiên tuổi <strong>người đứng tên nhà</strong> cho hướng cửa
                  chính, rồi bố trí giường, bếp, bàn làm việc sao cho mỗi người vẫn được một hướng
                  tốt riêng. Đây là cân nhắc theo phong tục, không bắt buộc.
                </li>
                <li>
                  <strong>Khi không hướng nào tốt.</strong> Bốn sao xấu không nặng bằng nhau (Tuyệt
                  Mệnh → Ngũ Quỷ → Lục Sát → Họa Hại); buộc phải chọn thì chọn hướng ở cuối danh sách
                  đó. Các vùng ít ở như kho hoặc nhà vệ sinh chính là chỗ hợp lý để "gánh" phần hướng
                  xấu.
                </li>
                <li>
                  <strong>Đừng đánh đổi ngược.</strong> Một phòng ngủ đúng hướng nhưng bí gió, không
                  nắng, ồn suốt đêm thì tệ hơn hẳn một phòng lệch hướng mà thoáng và yên. Hướng là
                  yếu tố cuối cùng trong danh sách, không phải yếu tố đầu tiên.
                </li>
              </ol>
              <p className="text-sm text-foreground/70">
                Muốn xem nhanh bảng của chính mình (và của bạn đời) thay vì tra tay:{' '}
                <Link href="/huong-nha" className="text-gold-700 underline-offset-4 hover:underline">
                  xem hướng nhà hợp tuổi →
                </Link>
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: cái gì đo được, cái gì là quy ước',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>Phần này quan trọng ngang phần cách tính, nên nói thẳng, không vòng vo.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Bát Trạch là một hệ quy ước, chưa có bằng chứng khoa học.</strong> Không có
                  nghiên cứu nào cho thấy hướng cửa quyết định tài lộc hay sức khỏe. Nó là tri thức
                  truyền thống được hệ thống hóa qua sách vở — đáng biết như một phần văn hóa, không
                  phải định luật tự nhiên.
                </li>
                <li>
                  <strong>Đầu vào rất thô.</strong> Toàn bộ hệ chỉ dùng hai dữ kiện: năm sinh và giới
                  tính. Nghĩa là nó chia toàn bộ loài người thành đúng <strong>tám nhóm</strong> — và
                  hai người sinh cùng năm, cùng giới nhận kết quả y hệt nhau, dù ở Hà Nội hay Cần
                  Thơ, nhà mặt phố hay chung cư tầng 20.
                </li>
                <li>
                  <strong>Chính các trường phái cũng bất đồng.</strong> "Hướng nhà" là hướng cửa nhìn
                  ra hay hướng lưng nhà dựa vào? Cung phi tính theo năm âm hay năm dương? Số 5 quy về
                  quẻ nào? Ba câu hỏi nền tảng, ba câu trả lời khác nhau tùy sách. Một hệ mà những
                  người trong nghề còn chưa thống nhất ở gốc thì không nên đọc như chân lý.
                </li>
              </ul>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Còn đây là những thứ đo được
              </h3>
              <p>
                Nếu mục tiêu thật sự là "ở trong căn nhà này thấy dễ chịu và khỏe hơn", có những yếu
                tố đo được bằng thiết bị và ai cũng kiểm chứng được:{' '}
                <strong>ánh sáng tự nhiên</strong> (phòng đủ sáng ban ngày, không phải bật đèn liên
                tục), <strong>thông gió</strong> (có đối lưu, không khí không tù đọng, bếp và phòng
                tắm thoát ẩm được), <strong>tiếng ồn</strong> (phòng ngủ có quay ra mặt đường lớn
                không, đêm ngủ có yên không), và <strong>độ ẩm cùng nắng gắt</strong> (tường có mốc
                không, mặt nào hứng nắng chiều khiến phòng nóng hầm tới khuya).
              </p>
              <p>
                Điều đáng chú ý: rất nhiều lời khuyên phong thủy cổ điển <em>trùng khớp</em> với các
                yếu tố trên — vì người xưa cũng quan sát chính những thứ đó, chỉ diễn đạt bằng ngôn
                ngữ khác. Khi một lời khuyên vừa hợp phong tục vừa hợp thông gió, cứ theo. Khi hai
                bên xung đột, ưu tiên thứ đo được.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">Và điều quan trọng nhất</h3>
              <p>
                <strong>Đừng bỏ một căn nhà phù hợp chỉ vì hướng.</strong> Giá vừa túi tiền, gần chỗ
                làm, gần trường của con, kết cấu chắc chắn, hàng xóm yên — đó là những thứ ảnh hưởng
                tới cuộc sống hằng ngày rõ rệt và có thật. Đổi tất cả những thứ đó để lấy một hướng
                "hợp mệnh" theo một bảng tra là một đánh đổi thiệt hơn.
              </p>
              <p className="text-sm text-foreground/70">
                hieu.asia nêu rõ quy tắc và cách tính để bạn <strong>biết và tự quyết định</strong> —
                không phán giàu nghèo, không dọa họa phúc, và không bán dịch vụ "hóa giải" hay "trấn
                yểm".
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <BatTrachWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <BatTrachRecall />,
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
                Muốn biết cung phi và bốn hướng hợp của chính mình?{' '}
                <Link href="/huong-nha" className="text-gold-700 underline-offset-4 hover:underline">
                  Xem hướng nhà hợp tuổi miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/huong-nha', label: 'Xem hướng nhà hợp tuổi' },
                    { href: '/huong-ban-lam-viec', label: 'Hướng bàn làm việc' },
                    { href: '/phi-tinh', label: 'Huyền Không Phi Tinh' },
                    { href: '/xem-tuoi-lam-nha', label: 'Xem tuổi làm nhà' },
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
          children: <BatTrachChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
