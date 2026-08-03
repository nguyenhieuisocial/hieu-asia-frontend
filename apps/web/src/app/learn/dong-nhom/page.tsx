/**
 * Bài học /learn/dong-nhom — bài CHÍNH THỨC về "hợp cả nhóm" trên hieu.asia.
 * Công cụ đích: /xem-hop-nhom.
 *
 * GROUNDING — đọc HẾT trang công cụ và engine đứng sau nó, không đoán:
 *   • app/xem-hop-nhom/page.tsx — form (MIN_MEMBERS = 3, MAX_MEMBERS = 6; mỗi
 *     người: tên tuỳ chọn + NGÀY SINH + giới tính, KHÔNG có ô giờ sinh), POST
 *     /tools/compatibility-group, và toàn bộ phần hiển thị: điểm nhóm /10 +
 *     summary, thẻ "Vai trò trong nhóm" (display · zodiac · avgScore · role),
 *     danh sách "Mức hợp từng cặp" SẮP GIẢM DẦN theo score, khối "Cặp nên chú ý"
 *     (chỉ hiện khi report.friction.length > 0), footer caveats.
 *   • app/xem-hop-nhom/layout.tsx — metadata, xác nhận phạm vi 3–6 người.
 *   • ../backend/infra/cloudflare/workers/api-gateway/src/tools/compatibility-group.ts
 *     — buildCompatibilityGroup(): MIN_GROUP=3, MAX_GROUP=6; hai vòng lặp i<j
 *     chấm MỌI cặp bằng buildCompatibilityPair; groupScore = clamp(1..10) của
 *     Math.round(trung bình điểm CÁC CẶP); avgScore mỗi người = trung bình các
 *     cặp có người đó, làm tròn 1 chữ số thập phân; role mặc định "Hoà nhịp ổn
 *     với cả nhóm", chỉ khi spread (avg cao nhất − avg thấp nhất) >= 1.5 mới gán
 *     "Chất keo gắn kết…" cho người cao nhất và "Cần thêm cầu nối…" cho người
 *     thấp nhất; signalOfOverall: >=8 "thuận", <=4 "cần chú ý", còn lại "trung
 *     tính"; friction = 2 cặp thấp nhất LỌC score <= 6; note mỗi cặp = 'Dễ lệch
 *     nhất ở "<chiều yếu nhất>".'; 3 câu caveats cố định.
 *   • .../src/tools/compatibility-pair.ts — buildCompatibilityPair(): 5 chiều
 *     (Tính cách, Giao tiếp, Mục tiêu, Tài chính, Gia đình), overallScore =
 *     clamp(trung bình 5 chiều). CHỈ đọc con giáp của NĂM sinh + giới tính +
 *     chuỗi ngày sinh; KHÔNG đọc giờ sinh, KHÔNG lập lá số, KHÔNG gọi LLM.
 *
 * CÔNG CỤ THẬT SỰ LÀM GÌ / KHÔNG LÀM (đọc code, không đoán):
 *   CÓ — chấm từng cặp, gộp thành một điểm nhóm bằng TRUNG BÌNH CÁC CẶP, tính
 *   điểm trung bình của từng người, nêu tối đa 2 cặp yếu kèm gợi ý câu nói.
 *   KHÔNG — không có phép nào xét ba người trở lên CÙNG LÚC (không "tam hợp trọn
 *   nhóm"); không có bộ vai trò kiểu khởi xướng / kết nối / giữ nhịp / soi lỗi —
 *   engine chỉ có ĐÚNG BA nhãn vai trò và hai trong ba là có điều kiện; không đo
 *   chất lượng quyết định của nhóm; không xếp hạng ai nên rời nhóm.
 *
 * KIỂM CHỨNG SỐ LIỆU (chạy lại được bằng chính các hàm khai báo dưới đây, và đã
 * đối chiếu với công thức trong compatibility-group.ts): nhóm 3 người = 3 cặp,
 * 6 người = 15 cặp; kịch bản "mọi cặp 8 điểm, đúng một cặp 3 điểm" cho điểm nhóm
 * 6 với nhóm 3 người nhưng 8 với nhóm 6 người; ở nhóm 6 người chênh lệch trung
 * bình cá nhân chỉ 1,0 < 1,5 nên công cụ KHÔNG gán nhãn vai trò nào.
 *
 * PHẠM VI: cách chấm MỘT cặp thuộc bài Hợp đôi (chỉ nhắc TÊN, chưa có route nên
 * KHÔNG link); bảng hợp/khắc 12 con giáp thuộc /learn/hop-tuoi; hình học vòng 12
 * chi thuộc /learn/tam-hop-luc-xung (được link). Giọng: trung thực về giới hạn,
 * không doạ, không phán số mệnh, không dán nhãn ai.
 */

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import {
  DongNhomFrame,
  DongNhomDepth,
  DongNhomRecall,
  DongNhomChecklist,
  DongNhomWhys,
  MIN_GROUP,
  MAX_GROUP,
  SPREAD_THRESHOLD,
  FRICTION_MAX_SCORE,
  FRICTION_SLOTS,
  DIMENSIONS,
  ROLE_DEFAULT,
  ROLE_TOP,
  ROLE_BOTTOM,
  GROUP_SIZES,
  pairCount,
  bandOf,
  round1,
  vn,
  WEAK_CASES,
  CASE_MIN,
  CASE_MAX,
  CASE_HIGH,
  CASE_LOW,
  SIGNAL_CHU_Y_MAX,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Hợp nhóm: vì sao hợp từng cặp không cộng lại',
  description:
    'Công cụ xem hợp nhóm chấm từng cặp rồi lấy trung bình — nhóm 6 người có 15 cặp. Bài này chỉ ra trung bình che mất cặp lệch, và cách đọc kết quả cho đúng.',
  alternates: { canonical: 'https://hieu.asia/learn/dong-nhom' },
};

// --- Dữ kiện suy từ công thức của engine (không gõ tay bảng nào) -------------

/** Bảng "nhóm càng đông thì càng nhiều quan hệ" — mọi cột đều tính, không chép. */
const SIZE_ROWS = GROUP_SIZES.map((size) => ({
  size,
  pairs: pairCount(size),
  /** Thêm một người vào nhóm size − 1 thì sinh thêm bao nhiêu cặp mới. */
  added: pairCount(size) - pairCount(size - 1),
  /** Trọng số của MỘT cặp trong trung bình nhóm, tính theo phần trăm. */
  weight: vn((100 / pairCount(size)), 1),
}));

/** Bảng kịch bản "mọi cặp 8 điểm, đúng một cặp 3 điểm" cho từng cỡ nhóm. */
const WEAK_ROWS = WEAK_CASES;

/** Số cặp mà một người bất kỳ tham gia trong nhóm n người = n − 1. */
const pairsPerMember = (n: number) => n - 1;

/**
 * Điểm trung bình của MỘT người thuộc cặp lệch, trong kịch bản "mọi cặp
 * CASE_HIGH điểm, đúng một cặp CASE_LOW điểm": người đó có (n − 2) cặp tốt cộng
 * đúng một cặp hỏng. Làm tròn 1 chữ số thập phân đúng như engine.
 */
const memberAvg = (n: number) =>
  round1((CASE_HIGH * (pairsPerMember(n) - 1) + CASE_LOW) / pairsPerMember(n));

const TD = 'px-4 py-2 text-muted-foreground';
const A = 'text-gold-700 underline-offset-4 hover:underline';

// FAQ khai báo MỘT lần — dùng cho CẢ FAQPage JSON-LD lẫn accordion hiển thị, nên
// chữ trong schema luôn đúng bằng chữ trên trang. Câu hỏi cố ý KHÁC bộ FAQ của
// /learn/hop-tuoi (ở đó hỏi hợp/khắc giữa hai con giáp) và KHÁC bài Hợp đôi.
const FAQS = [
  {
    q: 'Công cụ xem hợp nhóm thật sự tính cái gì?',
    a: `Nó chấm điểm TỪNG CẶP trong nhóm rồi gộp lại. Với nhóm ${MAX_GROUP} người, đó là ${pairCount(MAX_GROUP)} lần chấm cặp; điểm nhóm bạn nhìn thấy là trung bình của ${pairCount(MAX_GROUP)} con số đó, làm tròn về số nguyên trong khoảng 1 đến 10. Ngoài ra công cụ tính điểm trung bình của từng người với phần còn lại của nhóm, sắp danh sách cặp từ cao xuống thấp, và nêu tối đa ${FRICTION_SLOTS} cặp yếu kèm gợi ý câu nói. Không có phép tính nào xét ba người trở lên cùng một lúc — mọi thứ đều đi qua cặp.`,
  },
  {
    q: `Nhóm ${MAX_GROUP} người thì có bao nhiêu quan hệ cần xét?`,
    a: `${pairCount(MAX_GROUP)} quan hệ, theo công thức số cặp của nhóm n người là n nhân (n trừ 1) chia 2. Nhóm ${MIN_GROUP} người chỉ có ${pairCount(MIN_GROUP)} cặp, nhưng thêm người thì số cặp phình nhanh hơn số người rất nhiều: người thứ tư mang thêm ${pairCount(4) - pairCount(3)} quan hệ mới, người thứ sáu mang thêm ${pairCount(6) - pairCount(5)} quan hệ mới. Đây là lý do một nhóm đông không đơn giản là "nhiều người hơn" mà là một mạng quan hệ dày hơn hẳn.`,
  },
  {
    q: 'Vì sao điểm nhóm cao mà trong bảng vẫn có cặp lệch nặng?',
    a: `Vì điểm nhóm là một phép TRUNG BÌNH, mà trung bình thì làm loãng chỗ lệch. Thử một kịch bản tính được: mọi cặp đều ${CASE_HIGH} điểm, đúng một cặp ${CASE_LOW} điểm. Với nhóm ${CASE_MIN.size} người, một cặp chiếm ${vn(100 / CASE_MIN.pairs, 1)}% trọng số nên điểm nhóm rơi xuống ${CASE_MIN.groupScore}. Với nhóm ${CASE_MAX.size} người, đúng cặp lệch ấy chỉ còn ${vn(100 / CASE_MAX.pairs, 1)}% trọng số nên điểm nhóm vẫn là ${CASE_MAX.groupScore} — mức mà công cụ gọi là "${CASE_MAX.band}". Cùng một mâu thuẫn, hai dòng tiêu đề trái ngược. Bảng từng cặp và mục cặp nên chú ý mới là chỗ giữ thông tin đó.`,
  },
  {
    q: 'Công cụ có gán cho mỗi người một vai trò trong nhóm không?',
    a: `Không theo cách nhiều người tưởng. Engine chỉ có ĐÚNG BA nhãn: mặc định là "${ROLE_DEFAULT}", và chỉ khi chênh lệch giữa người có điểm trung bình cao nhất với người thấp nhất đạt ${vn(SPREAD_THRESHOLD, 1)} trở lên thì mới gán thêm hai nhãn "${ROLE_TOP}" và "${ROLE_BOTTOM}" cho đúng hai người ở hai đầu. Những vai kiểu người khởi xướng, người kết nối, người giữ nhịp hay người soi lỗi mà các bài viết về làm việc nhóm hay dùng thì công cụ KHÔNG tính — bài này nói thẳng chứ không gán cho công cụ thứ nó không làm.`,
  },
  {
    q: 'Có nên dùng điểm hợp nhóm để chọn hoặc loại người khỏi một đội không?',
    a: `Không, và chính công cụ cũng ghi điều đó trong phần lưu ý cuối trang: kết quả là gợi ý cách phối hợp, không phải căn cứ để dán nhãn hay loại trừ một thành viên. Có hai lý do kỹ thuật rất cụ thể. Thứ nhất, toàn bộ phép tính chỉ đọc con giáp của năm sinh, giới tính và chuỗi ngày sinh — nó không biết người đó làm được việc gì. Thứ hai, điểm thấp trong bảng nghĩa là "dự đoán có ma sát", mà nhóm ít ma sát không đồng nghĩa với nhóm ra quyết định tốt.`,
  },
  {
    q: 'Công cụ có dùng giờ sinh hay lá số không?',
    a: `Không. Biểu mẫu chỉ hỏi tên gọi (tuỳ chọn), ngày sinh và giới tính — không có ô giờ sinh, và engine cũng không lập lá số hay tứ trụ cho bất kỳ ai. Nó cũng không gọi mô hình ngôn ngữ nào: cùng một danh sách người thì luôn cho ra cùng một kết quả, chạy lại bao nhiêu lần cũng vậy. Đổi lại, kết quả thô đúng bằng mức thô của dữ kiện đầu vào — phần lớn điểm số đến từ con giáp của năm sinh, thứ mà hàng triệu người sinh cùng năm đều giống nhau.`,
  },
  {
    q: `Nhóm ít hơn ${MIN_GROUP} người hoặc nhiều hơn ${MAX_GROUP} người thì sao?`,
    a: `Công cụ từ chối, kèm câu báo lỗi ghi rõ số người đang có. Giới hạn dưới là ${MIN_GROUP} vì với 2 người thì chỉ có đúng một cặp, và phép gộp nhóm không còn ý nghĩa gì. Giới hạn trên là ${MAX_GROUP} vì số cặp tăng theo bình phương: ${MAX_GROUP} người đã là ${pairCount(MAX_GROUP)} cặp, thêm nữa thì bảng kết quả dài tới mức không ai đọc hết — mà đọc bảng cặp mới là phần có giá trị nhất.`,
  },
];

const JSONLD = [
  article({
    headline: 'Hợp nhóm: vì sao điểm hợp của từng cặp không cộng lại thành hợp cả nhóm',
    description:
      'Công cụ xem hợp nhóm của hieu.asia chấm từng cặp rồi lấy trung bình. Bài giải thích số cặp tăng theo n(n−1)/2, vì sao trung bình che mất cặp lệch, và công cụ có gì / không có gì.',
    url: '/learn/dong-nhom',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Hợp nhóm', url: '/learn/dong-nhom' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Hợp nhóm — đọc điểm hoà hợp của một nhóm 3–6 người cho đúng',
    description:
      'Công cụ xem hợp nhóm chấm từng cặp rồi lấy trung bình — nhóm 6 người có 15 cặp. Bài này chỉ ra trung bình che mất cặp lệch, và cách đọc kết quả cho đúng.',
    url: '/learn/dong-nhom',
  }),
];

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="border-b border-border bg-card/60">
        {cols.map((c) => (
          <th key={c} scope="col" className="px-4 py-2.5 font-semibold text-foreground">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Scroller({ minWidth, children }: { minWidth: string; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className={`w-full ${minWidth} text-left text-sm`}>{children}</table>
    </div>
  );
}

export default function LearnDongNhomPage() {
  return (
    <LearnArticle
      eyebrow="QUAN HỆ · NHÓM"
      title={
        <>
          Hợp nhóm{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (và phép trung bình)
          </span>
        </>
      }
      standfirst={
        <>
          Nhập cả nhà vào một công cụ, nhận về một con số cho cả nhóm — nghe như đã có câu trả lời.
          Nhưng con số ấy được gộp từ đâu, nó giữ lại gì và làm mất gì? Bài này mổ đúng phép gộp đó,
          bằng chính công thức mà công cụ đang chạy.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Hợp nhóm' },
      ]}
      relatedLenses={relatedLearnLenses('dong-nhom')}
      tryCta={{
        heading: 'Thử với nhóm của bạn',
        blurb: `Nhập từ ${MIN_GROUP} đến ${MAX_GROUP} người để xem điểm hoà hợp chung, mức hợp của từng cặp, điểm trung bình mỗi người và những cặp nên chú ý cách nói chuyện.`,
        href: '/xem-hop-nhom',
        label: `Phân tích hoà hợp nhóm ${MIN_GROUP}–${MAX_GROUP} người`,
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <DongNhomFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Hợp nhóm là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Trong huyền học phương Đông, cái có sẵn từ cổ thư là{' '}
                <strong>quan hệ giữa HAI địa chi</strong>: tam hợp, lục xung, lục hại, ngũ hành sinh
                khắc. Không có bảng nào định nghĩa “quan hệ của sáu con giáp cùng lúc”. Nghĩa là mọi
                con số dành cho cả một nhóm đều phải do người viết công cụ{' '}
                <strong>tự nghĩ ra một phép gộp</strong> — và phép gộp ấy là thứ bài này mổ.
              </p>
              <p>
                Công cụ <Link href="/xem-hop-nhom" className={A}>Xem hợp nhóm / gia đình</Link> nhận
                từ {MIN_GROUP} đến {MAX_GROUP} người. Với mỗi người bạn nhập tên gọi (tuỳ chọn), ngày
                sinh và giới tính. Sau đó nó làm đúng ba việc, theo thứ tự:
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Chấm mọi cặp.</strong> Nhóm {MAX_GROUP} người thì chấm{' '}
                  {pairCount(MAX_GROUP)} cặp. Mỗi cặp được chấm trên {DIMENSIONS.length} chiều —{' '}
                  {DIMENSIONS.join(', ')} — rồi lấy trung bình {DIMENSIONS.length} chiều đó thành
                  điểm của cặp, thang 1 đến 10.
                </li>
                <li>
                  <strong>Gộp các cặp thành một điểm nhóm.</strong> Cộng điểm của tất cả các cặp,
                  chia cho số cặp, làm tròn về số nguyên. Đó là toàn bộ phép gộp — không có gì tinh
                  vi hơn.
                </li>
                <li>
                  <strong>Tách lại thành từng dòng để đọc.</strong> Điểm trung bình của mỗi người với
                  phần còn lại của nhóm, danh sách cặp sắp từ cao xuống thấp, và tối đa{' '}
                  {FRICTION_SLOTS} cặp yếu kèm gợi ý câu nói.
                </li>
              </ol>
              <p>Bốn điều cần chốt ngay về cái mà công cụ này KHÔNG làm:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không có phép nào xét ba người trở lên cùng lúc.</strong> Không có “tam hợp
                  trọn nhóm”, không có điểm thưởng cho việc cả nhóm cùng một hành. Mọi thứ đều đi qua
                  cặp rồi mới được gộp.
                </li>
                <li>
                  <strong>Không dùng giờ sinh, không lập lá số.</strong> Biểu mẫu không có ô giờ
                  sinh. Phần lớn điểm số đến từ con giáp của <strong>năm</strong> sinh — thứ mà hàng
                  triệu người sinh cùng năm đều giống nhau.
                </li>
                <li>
                  <strong>Không đo chất lượng quyết định của nhóm.</strong> {DIMENSIONS.length} chiều
                  chấm cặp nói về ma sát dự đoán trong sinh hoạt, không có chiều nào nói nhóm này ra
                  quyết định tốt hay tệ.
                </li>
                <li>
                  <strong>Không xếp hạng để loại ai.</strong> Chính công cụ ghi trong phần lưu ý rằng
                  đừng dùng kết quả để dán nhãn hay loại trừ một thành viên.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Hai phạm vi bài này cố ý không lấn: cách chấm điểm cho <em>một cặp</em> là chủ đề của
                bài Hợp đôi, còn bảng hợp – khắc giữa hai con giáp nằm ở bài{' '}
                <Link href="/learn/hop-tuoi" className={A}>Hợp tuổi 12 con giáp</Link>. Ở đây chỉ bàn
                đúng một chuyện: <strong>gộp nhiều cặp lại thì được gì và mất gì</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <DongNhomDepth />,
        },
        {
          id: 'so-cap-trong-nhom',
          tocLabel: 'Số cặp phình ra sao',
          heading: 'Thêm một người, thêm nhiều quan hệ hơn bạn tưởng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Số cặp trong nhóm n người là <strong>n × (n − 1) ÷ 2</strong>. Công thức này không
                phải lý thuyết suông: nó chính là hai vòng lặp lồng nhau trong engine, chạy qua mọi
                i &lt; j. Hệ quả là <strong>số quan hệ tăng nhanh hơn số người</strong>, và đó là lý
                do một nhóm đông khó điều phối hơn hẳn.
              </p>
              <Scroller minWidth="min-w-[680px]">
                <TableHead
                  cols={[
                    'Số người',
                    'Số cặp công cụ chấm',
                    'Người vừa thêm mang theo',
                    'Mỗi người dính vào',
                    'Một cặp chiếm bao nhiêu trong điểm nhóm',
                  ]}
                />
                <tbody>
                  {SIZE_ROWS.map((row) => (
                    <tr key={row.size} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {row.size} người
                      </th>
                      <td className="px-4 py-2 tabular-nums text-foreground">{row.pairs} cặp</td>
                      <td className={TD}>+{row.added} cặp mới</td>
                      <td className={TD}>{pairsPerMember(row.size)} cặp</td>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">
                        {row.weight}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Đọc bảng theo cột thứ ba: người thứ tư bước vào nhóm không mang theo một quan hệ mới,
                mà mang theo <strong>{pairCount(4) - pairCount(3)} quan hệ mới</strong> — với từng
                người đã có mặt. Người thứ {MAX_GROUP} mang theo{' '}
                <strong>{pairCount(MAX_GROUP) - pairCount(MAX_GROUP - 1)} quan hệ mới</strong>. Từ{' '}
                {MIN_GROUP} người lên {MAX_GROUP} người, số người tăng gấp đôi còn số quan hệ tăng từ{' '}
                {pairCount(MIN_GROUP)} lên {pairCount(MAX_GROUP)} — gấp{' '}
                {pairCount(MAX_GROUP) / pairCount(MIN_GROUP)} lần.
              </p>
              <p>
                Cột cuối là chỗ quan trọng nhất và sẽ được dùng lại ở mục sau. Vì điểm nhóm là trung
                bình của tất cả các cặp, <strong>một cặp bất kỳ chỉ nắm 1 phần số cặp</strong> trong
                con số cuối cùng. Ở nhóm {MIN_GROUP} người con số đó là {SIZE_ROWS[0]?.weight}%; ở
                nhóm {MAX_GROUP} người nó tụt xuống {SIZE_ROWS[SIZE_ROWS.length - 1]?.weight}%. Nhóm
                càng đông thì tiếng nói của một mâu thuẫn trong con số chung càng nhỏ.
              </p>
              <p className="text-sm text-foreground/70">
                Vì sao hai con giáp lại được xếp là hợp hay xung ngay từ đầu — tam hợp là tam giác
                đều, lục xung là hai chi đối đỉnh — thuộc bài{' '}
                <Link href="/learn/tam-hop-luc-xung" className={A}>Tam hợp – Lục xung</Link>. Bài này
                nhận điểm cặp như một đầu vào đã có và chỉ xét phép gộp.
              </p>
            </div>
          ),
        },
        {
          id: 'trung-binh-che-gi',
          tocLabel: 'Trung bình che gì',
          heading: 'Cùng một cặp lệch, hai kết luận trái ngược',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là lõi của bài. Hãy dựng một kịch bản đơn giản đến mức kiểm tay được:{' '}
                <strong>
                  mọi cặp trong nhóm đều {CASE_HIGH} điểm, đúng một cặp {CASE_LOW} điểm
                </strong>{' '}
                — hai người cuối danh sách lệch nhau nặng. Giữ nguyên cặp lệch ấy, chỉ đổi cỡ nhóm,
                rồi xem điểm nhóm đi đâu. Mọi ô dưới đây tính bằng đúng công thức của engine, không
                chép tay.
              </p>
              <Scroller minWidth="min-w-[760px]">
                <TableHead
                  cols={[
                    'Cỡ nhóm',
                    'Số cặp',
                    'Trung bình thật',
                    'Điểm nhóm hiển thị',
                    'Công cụ gọi mức này là',
                    'Có gán nhãn vai trò không',
                  ]}
                />
                <tbody>
                  {WEAK_ROWS.map((row) => (
                    <tr key={row.size} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {row.size} người
                      </th>
                      <td className={TD}>{row.pairs}</td>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">{row.meanLabel}</td>
                      <td className="px-4 py-2 tabular-nums font-semibold text-foreground">
                        {row.groupScore}/10
                      </td>
                      <td className={TD}>{row.band}</td>
                      <td className={TD}>
                        {row.labelled
                          ? `Có — chênh lệch ${row.spreadLabel}`
                          : `Không — chênh lệch chỉ ${row.spreadLabel}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Nhìn cột thứ tư: <strong>cùng một cặp {CASE_LOW} điểm</strong>, nhóm{' '}
                {CASE_MIN.size} người ra {CASE_MIN.groupScore}/10 còn nhóm {CASE_MAX.size} người ra{' '}
                {CASE_MAX.groupScore}/10. Ở nhóm {CASE_MAX.size} người, con số ấy nằm đúng trong
                ngưỡng mà engine gọi là “{CASE_MAX.band}” và câu tóm tắt tự động sẽ nói nhóm có nền
                cộng hưởng tốt — trong khi ngay bên dưới, bảng từng cặp vẫn hiện một cặp {CASE_LOW}
                /10 gắn nhãn “{bandOf(CASE_LOW)}”. Hai dòng đó không mâu thuẫn nhau; chúng chỉ đang
                trả lời hai câu hỏi khác nhau, và{' '}
                <strong>con số to trả lời câu hỏi ít hữu ích hơn</strong>.
              </p>
              <p>
                Cột cuối còn một chỗ bất ngờ hơn. Nhãn vai trò chỉ được gán khi chênh lệch giữa người
                có điểm trung bình cao nhất và thấp nhất đạt <strong>{vn(SPREAD_THRESHOLD, 1)}</strong>{' '}
                trở lên. Trong kịch bản này, nhóm {CASE_MAX.size} người có chênh lệch chỉ{' '}
                {CASE_MAX.spreadLabel} — <strong>không ai được gán nhãn gì</strong>, kể cả hai người
                đang thật sự lệch nhau. Càng đông thì mọi cá nhân càng bị kéo về giữa.
              </p>
              <p>
                Vì sao lại thế, tính ra ngay được: trong nhóm {CASE_MAX.size} người mỗi người dính{' '}
                {pairsPerMember(CASE_MAX.size)} cặp, nên người trong cặp lệch có điểm trung bình{' '}
                {vn(memberAvg(CASE_MAX.size), 1)} còn người ngoài cuộc là {vn(CASE_HIGH, 1)}. Chênh
                nhau đúng {CASE_MAX.spreadLabel}. Ở nhóm {CASE_MIN.size} người thì mỗi người chỉ
                dính {pairsPerMember(CASE_MIN.size)} cặp, một cặp hỏng kéo tụt hẳn nửa phần điểm của
                người đó — điểm trung bình chỉ còn {vn(memberAvg(CASE_MIN.size), 1)}, nên chênh lệch
                vọt lên {CASE_MIN.spreadLabel} và nhãn xuất hiện.
              </p>
              <div className="rounded-card-editorial border border-gold/25 bg-gold/5 p-5">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                  Rút ra
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  <strong>Hợp từng cặp không cộng dồn thành hợp cả nhóm.</strong> Trung bình là một
                  phép nén: nó đổi {pairCount(MAX_GROUP)} con số lấy một con số, và cái bị vứt đi
                  chính là chỗ lệch. Đọc bản nén thay cho bản gốc là chỗ mất thông tin — trong khi
                  bản gốc vẫn nằm ngay đó, ở bảng “Mức hợp từng cặp”.
                </p>
              </div>
              <p>
                Công cụ có lường trước chuyện này. Đó là lý do nó luôn tách riêng khối{' '}
                <strong>“Cặp nên chú ý”</strong>: lấy {FRICTION_SLOTS} cặp thấp nhất rồi{' '}
                <em>lọc tiếp</em>, chỉ giữ cặp nào từ {FRICTION_MAX_SCORE} điểm trở xuống. Hai điều
                cần biết khi đọc khối này:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không thấy khối đó không có nghĩa là nhóm không có va chạm.</strong> Nó chỉ
                  có nghĩa là hai cặp thấp nhất đều trên {FRICTION_MAX_SCORE} điểm.
                </li>
                <li>
                  <strong>
                    Một cặp có thể mang nhãn “{bandOf(FRICTION_MAX_SCORE)}” mà vẫn lọt vào khối này.
                  </strong>{' '}
                  Ngưỡng gắn nhãn cặp và ngưỡng lọc cặp yếu là hai ngưỡng khác nhau: nhãn “
                  {bandOf(CASE_LOW)}” chỉ dành cho cặp từ {SIGNAL_CHU_Y_MAX} điểm trở xuống, còn
                  khối cặp nên chú ý nhận tới {FRICTION_MAX_SCORE} điểm.
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'vai-tro-trong-nhom',
          tocLabel: 'Vai trò trong nhóm',
          heading: 'Vai trò: công cụ có đúng ba nhãn, không phải bốn kiểu người',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Trang kết quả có một khối tên là “Vai trò trong nhóm”, và đây là chỗ dễ đọc quá tay
                nhất. Nhiều bài viết về làm việc nhóm mô tả các vai bổ trợ như{' '}
                <em>người khởi xướng</em>, <em>người kết nối</em>, <em>người giữ nhịp</em>,{' '}
                <em>người soi lỗi</em>. Bốn vai đó nghe rất hợp lý —{' '}
                <strong>và công cụ này không tính vai nào trong số đó</strong>. Nói thẳng như vậy tốt
                hơn là để bạn tự suy diễn.
              </p>
              <p>Engine chỉ có ba nhãn, và cách chọn nhãn thì máy móc đến mức đơn giản:</p>
              <Scroller minWidth="min-w-[720px]">
                <TableHead cols={['Nhãn công cụ hiển thị', 'Ai nhận', 'Điều kiện']} />
                <tbody>
                  <tr className="border-b border-border/60">
                    <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                      {ROLE_DEFAULT}
                    </th>
                    <td className={TD}>Mặc định cho tất cả mọi người</td>
                    <td className={TD}>
                      Luôn là nhãn khởi điểm; giữ nguyên nếu điều kiện dưới không đạt
                    </td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                      {ROLE_TOP}
                    </th>
                    <td className={TD}>Đúng một người: điểm trung bình cao nhất</td>
                    <td className={TD}>
                      Chỉ khi chênh lệch cao nhất − thấp nhất đạt {vn(SPREAD_THRESHOLD, 1)} trở lên
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                      {ROLE_BOTTOM}
                    </th>
                    <td className={TD}>Đúng một người: điểm trung bình thấp nhất</td>
                    <td className={TD}>Cùng một điều kiện chênh lệch</td>
                  </tr>
                </tbody>
              </Scroller>
              <p>
                Nghĩa là ba điều. Thứ nhất, <strong>vai trò không mô tả tính cách</strong> — nó chỉ
                nói vị trí của một người trong bảng điểm trung bình, và bảng đó suy ra từ con giáp
                năm sinh. Thứ hai, <strong>vai trò là tương đối với đúng nhóm này</strong>: giữ
                nguyên ngày sinh mà đổi người thứ ba, nhãn của bạn có thể đổi theo. Thứ ba,{' '}
                <strong>phần lớn trường hợp sẽ không có nhãn nào</strong> — như đúng kịch bản ở mục
                trên, nhóm {CASE_MAX.size} người chênh lệch {CASE_MAX.spreadLabel} nên cả nhóm cùng
                nhận nhãn mặc định.
              </p>
              <p>
                Ngưỡng {vn(SPREAD_THRESHOLD, 1)} là một lựa chọn có chủ ý và đáng khen: nó tránh việc
                gán nhãn “cần thêm cầu nối” cho một người chỉ vì người đó thấp hơn người khác{' '}
                {vn(0.1, 1)} điểm. Dán nhãn nhầm trong một gia đình gây hại thật, còn không dán nhãn
                thì chỉ mất một dòng chữ.
              </p>
              <p className="text-sm text-foreground/70">
                Cách đọc lành mạnh: xem “Vai trò trong nhóm” như <strong>một cách sắp xếp bảng số</strong>,
                không phải một bản mô tả con người. Nếu bạn thấy tên mình dưới nhãn “{ROLE_BOTTOM}”,
                điều duy nhất nó nói là điểm trung bình của bạn trong bảng này thấp nhất — chứ không
                phải bạn khó chơi.
              </p>
            </div>
          ),
        },
        {
          id: 'nhom-toan-hop',
          tocLabel: 'Nhóm “toàn người hợp”',
          heading: 'Vì sao nhóm “toàn người hợp nhau” không phải nhóm ra quyết định tốt',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Mục này nói rõ trước: <strong>đây là phần bài học suy luận, không phải phần công cụ
                tính</strong>. Trong {DIMENSIONS.length} chiều chấm cặp — {DIMENSIONS.join(', ')} —
                không có chiều nào tên là “chất lượng quyết định”. Nên đừng chờ công cụ trả lời câu
                hỏi này; nó không được thiết kế để trả lời.
              </p>
              <p>
                Nhưng câu hỏi vẫn đáng đặt, vì rất nhiều người dùng kiểu công cụ này theo hướng{' '}
                <em>chọn người</em>: gõ thử vài tổ hợp, giữ lại tổ hợp nào ra điểm cao nhất. Vấn đề
                nằm ở chỗ điểm cao trong bảng này có nghĩa là gì. Nó có nghĩa là{' '}
                <strong>ít ma sát dự đoán</strong> — dễ nói chuyện, ít va chạm phong cách. Nó không
                có nghĩa là nhóm sẽ nghĩ ra phương án tốt hơn.
              </p>
              <p>Ba chỗ mà “ít ma sát” và “quyết định tốt” tách nhau ra:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Lấy “ít ma sát” làm tiêu chí lọc là tự loại người phản biện.</strong> Công
                  cụ không biết ai hay phản biện — nó chỉ đọc năm sinh. Nhưng nếu bạn quyết định giữ
                  tổ hợp nào “êm” nhất, dù dựa vào con số này hay vào cảm giác, thì thứ bạn đang tối
                  ưu là sự dễ chịu, và người khiến bạn phải giải thích lại giả định sẽ là người bị
                  loại sớm nhất.
                </li>
                <li>
                  <strong>Đồng thuận nhanh không phải bằng chứng đúng.</strong> Một nhóm gật đầu
                  trong ba phút và một nhóm tranh luận trong ba giờ có thể cùng đi tới một kết luận;
                  chỉ nhóm thứ hai biết vì sao các phương án khác bị loại.
                </li>
                <li>
                  <strong>Thang điểm này không nhìn thấy năng lực.</strong> Nó không biết ai từng làm
                  việc đó rồi, ai giữ được tiền, ai chịu nói câu khó nghe. Đó mới là những thứ quyết
                  định kết quả của một dự án hay một chuyến đi.
                </li>
              </ul>
              <p>
                Vậy dùng công cụ thế nào cho có ích? <strong>Không dùng để chọn người, dùng để chuẩn
                bị.</strong> Nhóm đã có sẵn — gia đình, nhóm bạn thân, đội đang làm chung — thì phần
                giá trị nằm ở khối cặp nên chú ý: nó chỉ ra tối đa {FRICTION_SLOTS} cặp có khả năng
                lệch sóng và đưa một câu gợi ý để mở lời. Câu gợi ý ấy đúng hay không thì bạn là
                người kiểm, không phải công cụ.
              </p>
              <p className="text-sm text-foreground/70">
                Vì sao một mô tả chung chung lại dễ khiến ta gật đầu — kể cả khi nó đúng với gần như
                mọi nhóm — là nội dung bài{' '}
                <Link href="/learn/barnum" className={A}>Hiệu ứng Barnum</Link>. Còn cách tự kiểm một
                dự đoán trước khi tin nó nằm ở bài{' '}
                <Link href="/learn/kiem-chung" className={A}>Kiểm chứng dự đoán</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: nói thẳng những chỗ phép gộp này còn thô',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Công cụ này minh bạch hơn nhiều thứ cùng loại — nó cho xem thẳng bảng từng cặp thay
                vì chỉ ném ra một con số. Nhưng vẫn có những chỗ cần biết trước khi tin:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Phép gộp là do người viết công cụ chọn, không phải của cổ thư.</strong>{' '}
                  Trung bình cộng các cặp là một lựa chọn hợp lý và dễ kiểm, nhưng nó không có gốc
                  trong bất kỳ sách nào. Một phép gộp khác — chẳng hạn lấy cặp thấp nhất làm điểm
                  nhóm — cũng biện minh được, và sẽ ra con số hoàn toàn khác.
                </li>
                <li>
                  <strong>Đầu vào rất thô.</strong> Công cụ đọc đúng ba thứ: ngày sinh, giới tính và
                  tên gọi để hiển thị. Trong {DIMENSIONS.length} chiều chấm cặp, bốn chiều đọc từ con
                  giáp của <em>năm</em> sinh — nghĩa là hai người sinh cùng năm cho kết quả gần như
                  nhau, dù họ khác nhau thế nào ngoài đời. Cơ chế chi tiết của từng chiều là chủ đề
                  của bài Hợp đôi, không lặp lại ở đây.
                </li>
                <li>
                  <strong>Có một chỗ kém chặt khi hai người bằng điểm nhau.</strong> Nhãn “
                  {ROLE_BOTTOM}” chỉ được gán cho <em>một</em> người. Trong nhóm {CASE_MIN.size}{' '}
                  người ở kịch bản trên, hai người thuộc cặp lệch có điểm trung bình bằng nhau đúng{' '}
                  {vn(memberAvg(CASE_MIN.size), 1)} — nhưng chỉ người đứng sau trong danh sách nhập
                  nhận nhãn. Đổi thứ tự nhập thì nhãn chuyển sang người kia.
                  Nếu bạn thấy nhãn rơi vào mình, hãy nhớ nó có thể chỉ là thứ tự gõ tên.
                </li>
                <li>
                  <strong>Không có phép kiểm nào cho thấy con số này dự đoán được thực tế.</strong>{' '}
                  Không ai theo dõi các nhóm điểm cao và các nhóm điểm thấp rồi so kết quả sau một
                  năm. Đây là khung tham chiếu văn hoá để nói chuyện với nhau, không phải phép đo.
                </li>
                <li>
                  <strong>Kết quả cố định theo dữ kiện, không cố định theo con người.</strong> Cùng
                  danh sách người thì luôn ra cùng con số, chạy lại bao nhiêu lần cũng vậy — vì không
                  có yếu tố ngẫu nhiên và không gọi mô hình ngôn ngữ nào. Nhưng chính điều đó cho
                  thấy nó không thể phản ánh việc quan hệ giữa mọi người thay đổi theo tháng.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh mà công cụ tự nêu trong phần lưu ý: xem đây là gợi ý cách phối
                hợp, không phải căn cứ để dán nhãn hay loại trừ một thành viên. Và nó không thay được
                lời khuyên y tế, pháp lý hay tài chính — đừng đổi một quyết định lớn của gia đình vì
                một con số trên thang mười.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <DongNhomWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <DongNhomRecall />,
        },
        {
          id: 'faq',
          tocLabel: 'Câu hỏi thường gặp',
          heading: 'Câu hỏi thường gặp',
          children: (
            <>
              <Accordion type="single" collapsible className="space-y-2">
                {FAQS.map((f, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded border border-border px-4"
                  >
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Muốn hiểu vì sao hai con giáp được xếp là hợp hay xung ngay từ đầu, đọc{' '}
                <Link href="/learn/hop-tuoi" className={A}>bài Hợp tuổi 12 con giáp</Link>; muốn thấy
                hình học đứng sau các cặp đó, đọc{' '}
                <Link href="/learn/tam-hop-luc-xung" className={A}>bài Tam hợp – Lục xung</Link>. Còn
                nếu bạn muốn biết vì sao một nhận xét chung chung lại thấy đúng với cả nhóm mình, đọc{' '}
                <Link href="/learn/barnum" className={A}>bài Hiệu ứng Barnum</Link>.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Muốn xem bảng cặp của chính nhóm mình?{' '}
                <Link href="/xem-hop-nhom" className={A}>
                  Mở công cụ xem hợp nhóm →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/xem-hop-nhom', label: 'Xem hợp nhóm / gia đình' },
                    { href: '/hop-tuoi', label: 'Xem hợp tuổi' },
                    { href: '/tuong-hop-12-con-giap', label: 'Bản đồ tương hợp 12 con giáp' },
                    { href: '/tra-cuu-tuoi', label: 'Tra cứu tuổi và can chi' },
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
          children: <DongNhomChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
