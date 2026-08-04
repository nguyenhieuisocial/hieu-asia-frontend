/**
 * Bài học /learn/sinh-con — bài CHÍNH THỨC về "chọn năm sinh con theo mệnh".
 *
 * GROUNDING — không gõ tay bảng nào, mọi can chi / mệnh / quan hệ đều SUY TẠI RUNTIME:
 *   • lib/sinh-con.ts (nguồn sự thật của công cụ /sinh-con) — yearProfile(year),
 *     checkParentChild(parentYear, childYear), zodiacRelationTable(childYear),
 *     menhRelation(pEl, cEl), PARENT_CHILD_COPY (SÁU nhóm quan hệ con giáp).
 *   • lib/dat-ten-ngu-hanh.ts — ELEMENTS (5 hành, sinhTo / khac) cho ma trận mệnh.
 *   • app/sinh-con/page.tsx + components/sinh-con/SinhConChecker.tsx — công cụ đích.
 *
 * CÔNG CỤ /sinh-con THẬT SỰ LÀM GÌ (đọc code, không đoán):
 *   CÓ — đúng BA ô, đều theo NĂM ÂM, nhưng KHÔNG cùng kiểu: năm bé là ô CHỌN (<Select>) chỉ
 *   mở đúng ba năm trong `CHILD_YEARS` của SinhConChecker, còn năm sinh mẹ và năm sinh bố là
 *   hai ô NHẬP số tự do; tra can chi + con giáp + nạp âm + mệnh của bé; đối chiếu TỪNG phụ
 *   huynh với bé theo HAI lớp (quan hệ 12 con giáp; tương sinh – tương khắc giữa hai mệnh nạp
 *   âm); xuất PDF.
 *   KHÔNG — không nhận tháng/ngày/giờ sinh, giới tính, tuổi mẹ tại thời điểm sinh, dữ kiện
 *   sức khoẻ hay kinh tế; không chấm điểm, không xếp hạng năm; không đối chiếu bố với mẹ;
 *   không lập lá số / Bát Tự cho bé; không xét Tam Tai / Kim Lâu / Hoang Ốc. Khoảng năm hợp
 *   lệ 1900–2100 là literal trong parseYear(), mà parseYear() CHỈ chạy cho hai ô năm sinh bố
 *   mẹ — ô năm bé không đi qua nó, nên đừng gán khoảng đó cho cả ba ô.
 *
 * KIỂM CHỨNG (đã chạy thật bằng chính các hàm trên): 2027 = Đinh Mùi, tuổi Mùi, Thiên Hà
 * Thủy, mệnh Thủy; sườn đếm 12 con giáp bố mẹ là 3 hợp / 2 lưu ý / 7 trung tính với cả ba
 * năm mà ô chọn đang mở; mẹ 1996 ra Lục Hại + cùng mệnh, bố 1993 ra Bình hoà + Kim sinh
 * Thủy (hai lớp đổi sắc thái, đúng thứ bài đang minh hoạ); và trong SÁU nhánh quan hệ mệnh
 * mà menhRelation() viết ra, vòng 5 hành chỉ sinh ra được NĂM.
 *
 * PHẠM VI — không lấn bài đã có, chỉ link: /learn/nap-am, /learn/tam-hop-luc-xung (mỗi bài
 * MỘT câu), /learn/dat-ten-ngu-hanh, /learn/hieu-nguoi-than, /learn/ra-quyet-dinh,
 * /learn/kiem-chung, /learn/lich-am-duong. Giọng: bảng tra là NÉT VĂN HOÁ
 * để tham khảo, không phải tiêu chí sàng lọc. Lõi đạo đức: sức khoẻ mẹ, tuổi mẹ, điều kiện
 * kinh tế và sự sẵn sàng của cả hai người quan trọng hơn mọi bảng tra; và tuyệt đối không
 * dùng bảng này để trách một đứa trẻ đã sinh ra.
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
import { ELEMENTS, type Element } from '@/lib/dat-ten-ngu-hanh';
import {
  yearProfile,
  checkParentChild,
  zodiacRelationTable,
  menhRelation,
  PARENT_CHILD_COPY,
  type MenhRelationKind,
  type RelationTone,
} from '@/lib/sinh-con';
import {
  SinhConFrame,
  SinhConDepth,
  SinhConRecall,
  SinhConChecklist,
  SinhConWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Chọn năm sinh con theo mệnh — và ranh giới',
  description:
    'Công cụ tra mệnh nạp âm và con giáp của bé theo năm sinh rồi đối chiếu tuổi bố mẹ. Bài này giải thích cơ chế đó và nói thẳng ranh giới của việc chọn năm.',
  alternates: { canonical: 'https://hieu.asia/learn/sinh-con' },
};

// --- Dữ kiện suy từ lib ------------------------------------------------------

/**
 * Bản sao có chủ đích của `CHILD_YEARS` trong SinhConChecker.tsx (const nội bộ, không
 * export nên không import được). Chỉ ba con số năm này là chép; mọi thứ khác suy từ lib.
 */
const TOOL_CHILD_YEARS = [2026, 2027, 2028] as const;

/** Năm bé làm ví dụ; hai năm sinh phụ huynh chọn để hai lớp KHÔNG cùng sắc thái. */
const FOCUS_YEAR = 2027;
const MOTHER_YEAR = 1996;
const FATHER_YEAR = 1993;

/**
 * Khoảng năm hợp lệ (literal trong parseYear()) — CHỈ áp cho hai ô nhập năm sinh bố mẹ.
 * INPUT_COUNT là tổng số ô của công cụ: 1 ô chọn năm bé + 2 ô nhập năm sinh bố mẹ.
 */
const YEAR_MIN = 1900;
const YEAR_MAX = 2100;
const PARENT_INPUT_COUNT = 2;
const INPUT_COUNT = PARENT_INPUT_COUNT + 1;

const FOCUS = yearProfile(FOCUS_YEAR);
const FOCUS_CANCHI = FOCUS?.canChi ?? '—';
const FOCUS_TEN = FOCUS?.zodiac.ten ?? '—';
const FOCUS_NAPAM = FOCUS?.napAmName ?? '—';
const FOCUS_MENH = FOCUS ? ELEMENTS[FOCUS.element].name : '—';

const TONE_LABEL: Record<RelationTone, string> = {
  hop: 'Hợp',
  'luu-y': 'Lưu ý',
  'trung-tinh': 'Trung tính',
};

/** Nhãn hiển thị cho từng nhánh quan hệ mệnh của menhRelation(). */
const MENH_KIND_LABEL: Record<MenhRelationKind, string> = {
  'dong-menh': 'Cùng mệnh',
  'cha-me-sinh-con': 'Bố/mẹ sinh bé',
  'con-sinh-cha-me': 'Bé sinh bố/mẹ',
  'cha-me-khac-con': 'Bố/mẹ khắc bé',
  'con-khac-cha-me': 'Bé khắc bố/mẹ',
  'trung-tinh': 'Không sinh không khắc',
};

/** Sáu nhóm quan hệ con giáp mà công cụ phân biệt — đọc thẳng từ PARENT_CHILD_COPY. */
const RELATION_LABELS = Object.values(PARENT_CHILD_COPY).map((c) => c.label);

/** 12 con giáp bố/mẹ × quan hệ với bé sinh năm FOCUS_YEAR. */
const ZODIAC_ROWS = zodiacRelationTable(FOCUS_YEAR);

const countTone = (rows: typeof ZODIAC_ROWS, tone: RelationTone) =>
  rows.filter((r) => r.copy.tone === tone).length;

const COUNT_HOP = countTone(ZODIAC_ROWS, 'hop');
const COUNT_LUU_Y = countTone(ZODIAC_ROWS, 'luu-y');
const COUNT_TRUNG_TINH = countTone(ZODIAC_ROWS, 'trung-tinh');

/**
 * Ba năm mà ô chọn của công cụ đang mở — mỗi năm một can chi và một con giáp, nhưng KHÔNG
 * phải mỗi năm một mệnh: nạp âm gán theo cặp hai năm liền nhau nên hai trong ba năm này
 * trùng nạp âm (xem SAME_NAPAM bên dưới, suy tại runtime chứ không gõ tay).
 */
const YEAR_ROWS = TOOL_CHILD_YEARS.map((y) => {
  const p = yearProfile(y);
  const rows = zodiacRelationTable(y);
  return {
    year: y,
    canChi: p?.canChi ?? '—',
    ten: p?.zodiac.ten ?? '—',
    napAm: p?.napAmName ?? '—',
    menh: p ? ELEMENTS[p.element].name : '—',
    hop: countTone(rows, 'hop'),
    luuY: countTone(rows, 'luu-y'),
    trungTinh: countTone(rows, 'trung-tinh'),
  };
});

/**
 * Cặp năm liền nhau TRONG ô chọn dùng chung một tên nạp âm — null nếu ba năm đang mở không
 * có cặp nào như vậy. Dùng để câu văn nói đúng thứ bảng ngay dưới nó đang in ra.
 */
const SAME_NAPAM_SECOND = YEAR_ROWS.findIndex(
  (r, i) => i > 0 && YEAR_ROWS[i - 1]!.napAm === r.napAm,
);
const SAME_NAPAM =
  SAME_NAPAM_SECOND > 0
    ? { a: YEAR_ROWS[SAME_NAPAM_SECOND - 1]!, b: YEAR_ROWS[SAME_NAPAM_SECOND]! }
    : null;

/** Ma trận 5 hành bố/mẹ × 5 hành bé — mọi ô do menhRelation() sinh ra. */
const ELEMENT_KEYS = Object.keys(ELEMENTS) as Element[];

const MENH_MATRIX = ELEMENT_KEYS.map((parentEl) => ({
  parentEl,
  cells: ELEMENT_KEYS.map((childEl) => ({ childEl, rel: menhRelation(parentEl, childEl) })),
}));

const MENH_KINDS_ALL = Object.keys(MENH_KIND_LABEL) as MenhRelationKind[];
const MENH_KINDS_SEEN = [...new Set(MENH_MATRIX.flatMap((r) => r.cells.map((c) => c.rel.kind)))];
const MENH_KINDS_UNREACHABLE = MENH_KINDS_ALL.filter((k) => !MENH_KINDS_SEEN.includes(k));

/** Hai phụ huynh ví dụ, đối chiếu với bé sinh năm FOCUS_YEAR. */
const PARENT_CASES = [
  { role: 'Mẹ', year: MOTHER_YEAR },
  { role: 'Bố', year: FATHER_YEAR },
].map(({ role, year }) => ({ role, year, check: checkParentChild(year, FOCUS_YEAR) }));

// FAQ khai báo MỘT lần cho CẢ FAQPage JSON-LD lẫn accordion → chữ schema === chữ trên
// trang. Câu hỏi cố ý KHÁC bộ FAQ của trang công cụ /sinh-con: ở đây hỏi vào cơ chế và
// vào ranh giới, không lặp lại "công cụ tính gì / âm hay dương / làm gì tiếp".
const FAQS = [
  {
    q: 'Chọn năm sinh con theo mệnh có thay đổi được điều gì cho em bé không?',
    a: `Không có bằng chứng nào cho thấy có. Phép tính chỉ nhận đúng một dữ kiện cho mỗi người là NĂM ÂM LỊCH, rồi đọc quan hệ giữa hai nhãn lịch — nó không biết em bé sẽ khoẻ ra sao, học hành thế nào, hay gia đình sẽ nuôi con bằng cách gì. Vì vậy cách dùng đúng là xem nó như một nét văn hoá để gia đình thêm một góc nhìn khi đằng nào cũng đang cân nhắc giữa vài thời điểm, chứ không phải một cánh cửa sàng lọc. Nếu bảng tra khiến bạn định dời một quyết định lớn của đời mình, thì nó đang được dùng sai.`,
  },
  {
    q: 'Công cụ sinh con của hieu.asia đối chiếu những lớp nào — và không đối chiếu gì?',
    a: `Đúng hai lớp. Lớp thứ nhất là quan hệ 12 con giáp giữa tuổi bố/mẹ và tuổi bé, phân thành ${RELATION_LABELS.length} nhóm: ${RELATION_LABELS.join(', ')}. Lớp thứ hai là tương sinh – tương khắc giữa mệnh nạp âm của bố/mẹ và mệnh nạp âm của bé. Ngoài hai lớp đó thì không có gì thêm: công cụ không nhận tháng, ngày hay giờ sinh, không nhận giới tính, không lập lá số hay Bát Tự cho bé, không xét Tam Tai hay Kim Lâu, và không đối chiếu bố với mẹ. Nó cũng không chấm điểm và không xếp hạng năm nào tốt hơn năm nào — nó mô tả quan hệ, rồi dừng lại ở đó.`,
  },
  {
    q: 'Kết quả ra nhóm “lưu ý” thì có nên đổi sang năm khác không?',
    a: `Không nên đổi chỉ vì lý do đó. Với bé sinh năm ${FOCUS_CANCHI}, trong ${ZODIAC_ROWS.length} con giáp bố mẹ có ${COUNT_LUU_Y} con giáp rơi vào nhóm lưu ý — và điều đó chỉ có nghĩa là hai chi ở thế lục xung hoặc lục hại theo Can Chi, thứ mà chính trang công cụ gọi là lời nhắc “khác nhịp, cần dung hoà”: lục xung được diễn giải là hai “nhịp” tính cách khác nhau, lục hại là “lệch kênh” giao tiếp đôi chút. Nó không nói gì về sức khoẻ của mẹ, về tài chính của gia đình, hay về việc em bé sẽ lớn lên thế nào. Đổi năm là một cái giá thật: thêm một năm chờ, thêm tuổi cho mẹ, thêm rủi ro y khoa nếu mẹ đã lớn tuổi. Đừng trả giá thật cho một nhãn.`,
  },
  {
    q: 'Vì sao lệch một ngày sinh quanh Tết lại đổi cả kết quả đối chiếu?',
    a: `Vì toàn bộ phép tính chạy trên NĂM ÂM LỊCH, mà năm âm đổi ở mùng 1 Tết chứ không phải ngày 1 tháng 1 dương lịch. Bé sinh trong tháng 1 hoặc đầu tháng 2 dương lịch, trước Tết, vẫn thuộc năm âm liền trước — nên mang con giáp và mệnh nạp âm của năm trước, không phải của năm dương đang chạy. Lệch một con giáp là lệch toàn bộ quan hệ ở lớp thứ nhất, và lệch nạp âm thì lệch luôn lớp thứ hai. Đây là chỗ tra nhầm phổ biến nhất, và nó áp dụng cho cả năm sinh của bố mẹ chứ không riêng năm của bé.`,
  },
  {
    q: 'Hai lớp cho ra hai hướng khác nhau thì tin lớp nào?',
    a: `Không lớp nào “thắng” lớp nào, và công cụ cố tình không gộp hai lớp thành một điểm số. Lý do rất thực tế: hai lớp đến từ hai hệ khác nhau — một bên là vòng 12 địa chi, một bên là vòng 5 hành qua bảng nạp âm — nên không có một quy tắc cộng điểm nào được cả hai truyền thống công nhận. Bất kỳ con số tổng nào cũng là do người viết công cụ tự đặt ra. Khi hai lớp ngược hướng, cách đọc lành mạnh là: quan niệm xưa không có câu trả lời dứt khoát cho trường hợp này, và đó chính là dấu hiệu bạn nên quay về những tiêu chí đo được.`,
  },
  {
    q: 'Tuổi mẹ và sức khoẻ của mẹ có nằm trong phép tính không?',
    a: `Không, và đây là điều quan trọng nhất cần biết trước khi dùng bảng tra. Công cụ có đúng ${INPUT_COUNT} ô, mỗi ô chỉ chứa được một con số năm: một ô chọn năm bé — hiện chỉ mở ${TOOL_CHILD_YEARS.length} năm ${TOOL_CHILD_YEARS[0]}–${TOOL_CHILD_YEARS[TOOL_CHILD_YEARS.length - 1]} — và ${PARENT_INPUT_COUNT} ô nhập năm sinh của mẹ và của bố. Nó không hỏi tuổi mẹ tại thời điểm sinh, không hỏi tiền sử thai sản, không hỏi thu nhập, không hỏi hai người đã sẵn sàng chưa. Nhưng chính bốn thứ đó mới là thứ ảnh hưởng thật tới một lần sinh nở và tới những năm đầu đời của em bé. Bảng tra im lặng về chúng không phải vì chúng không quan trọng, mà vì phép tính không có chỗ để chứa chúng.`,
  },
  {
    q: 'Con tôi đã sinh vào năm bị coi là “không hợp” thì sao?',
    a: `Thì không sao cả, và xin nói thật rõ: bảng tra này tuyệt đối không được dùng để trách một đứa trẻ đã sinh ra. Trang công cụ in nguyên câu này ngay dưới mỗi kết quả: nhóm “lưu ý” chỉ gợi ý bố mẹ thêm kiên nhẫn, tuyệt đối không có chuyện con “khắc” hay mang lỗi với cha mẹ. Một đứa trẻ không chọn năm sinh của mình, và việc gắn cho bé nguyên nhân của những chuyện không may trong nhà là bất công với một người chưa đủ lớn để tự bênh vực. Nếu ai đó trong gia đình đang nói theo hướng ấy, phần “không trách một đứa trẻ” trong bài này viết ra để bạn đưa cho họ đọc.`,
  },
];

const JSONLD = [
  article({
    headline: 'Chọn năm sinh con theo mệnh: công cụ tính gì, và ranh giới của việc chọn năm',
    description:
      'Công cụ /sinh-con tra can chi, con giáp và mệnh nạp âm của bé theo năm sinh rồi đối chiếu với tuổi bố mẹ theo hai lớp. Bài giải thích cơ chế đó và nói thẳng những thứ quan trọng hơn bảng tra.',
    url: '/learn/sinh-con',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Sinh con theo năm', url: '/learn/sinh-con' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Chọn năm sinh con theo mệnh — cơ chế đối chiếu và ranh giới đạo đức',
    description:
      'Hiểu hai lớp đối chiếu mà công cụ sinh con thật sự tính, biết nó không tính gì, và biết vì sao sức khoẻ của mẹ cùng sự sẵn sàng của gia đình quan trọng hơn mọi bảng tra.',
    url: '/learn/sinh-con',
  }),
];

const TD = 'px-4 py-2 text-muted-foreground';
const TH_ROW = 'px-4 py-2 text-left font-medium text-foreground';
const A = 'text-gold-700 underline-offset-4 hover:underline';

/** Bảng cuộn ngang dùng chung; ô đầu mỗi hàng là <th scope="row">. */
function DataTable({
  minWidth,
  cols,
  rows,
}: {
  minWidth: string;
  cols: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className={`w-full ${minWidth} text-left text-sm`}>
        <thead>
          <tr className="border-b border-border bg-card/60">
            {cols.map((c) => (
              <th key={c} scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/60 last:border-b-0">
              {row.map((cell, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className={TH_ROW}>
                    {cell}
                  </th>
                ) : (
                  <td key={j} className={TD}>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LearnSinhConPage() {
  return (
    <LearnArticle
      eyebrow="GIA ĐÌNH · CAN CHI"
      title={
        <>
          Chọn năm sinh con theo mệnh{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">— và ranh giới</span>
        </>
      }
      standfirst={
        <>
          Nhiều gia đình muốn biết bé sinh năm nào thì “hợp tuổi bố mẹ”. Bài này chỉ rõ công cụ trên
          web này thật sự tính gì để trả lời câu đó, nó bỏ qua những gì, và — phần quan trọng nhất —
          vì sao có những thứ nặng hơn mọi bảng tra rất nhiều.
        </>
      }
      readMeta="13 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Sinh con theo năm' },
      ]}
      relatedLenses={relatedLearnLenses('sinh-con')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb: `Chọn năm bé dự kiến sinh trong ${TOOL_CHILD_YEARS.length} năm công cụ đang mở rồi nhập năm sinh của mẹ và của bố; công cụ hiển thị can chi, con giáp và mệnh nạp âm của bé, kèm hai lớp đối chiếu với từng người — nguyên văn quy tắc, không chấm điểm.`,
        href: '/sinh-con',
        label: 'Đối chiếu năm sinh của bé với tuổi bố mẹ',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <SinhConFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Chọn năm sinh con theo mệnh là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Mỗi <strong>năm âm lịch</strong> mang một cặp can chi, từ đó suy ra{' '}
                <strong>con giáp</strong> và <strong>mệnh nạp âm</strong> của năm. Bé sinh năm{' '}
                {FOCUS_YEAR} chẳng hạn — năm âm {FOCUS_CANCHI}, tuổi {FOCUS_TEN}, nạp âm{' '}
                {FOCUS_NAPAM}, tức mệnh {FOCUS_MENH}. Bố mẹ cũng có hai nhãn y hệt. Toàn bộ chuyện
                “chọn năm sinh con theo mệnh” chỉ là{' '}
                <strong>đặt các nhãn ấy cạnh nhau rồi đọc quan hệ giữa chúng</strong> — và công cụ{' '}
                <Link href="/sinh-con" className={A}>
                  Sinh con theo năm
                </Link>{' '}
                làm đúng việc đó, không gì hơn: {INPUT_COUNT} ô, mỗi ô đúng một con số năm — một
                ô chọn năm bé (hiện chỉ mở {TOOL_CHILD_YEARS.length} năm{' '}
                {TOOL_CHILD_YEARS[0]}–{TOOL_CHILD_YEARS[TOOL_CHILD_YEARS.length - 1]}) và{' '}
                {PARENT_INPUT_COUNT} ô nhập năm sinh của mẹ và của bố.
              </p>
              <p>Cần chốt ngay bốn điều phép tra này KHÔNG phải:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải một dự báo về em bé.</strong> Phép tính không nhận dữ kiện nào
                  về sức khoẻ, gia đình hay tương lai — nó đọc nhãn lịch, mà nhãn lịch không chứa
                  thông tin về một con người cụ thể.
                </li>
                <li>
                  <strong>Không phải một điểm số.</strong> Công cụ cố ý không gộp hai lớp thành một
                  con số “hợp bao nhiêu phần trăm”. Hai lớp có thể ngược hướng, và khi đó không có
                  câu trả lời dứt khoát nào cả.
                </li>
                <li>
                  <strong>Không phải thông tin riêng của nhà bạn.</strong> Mọi em bé sinh cùng một
                  năm âm lịch đều có cùng con giáp và cùng mệnh — lát cắt thô nhất trong các phép
                  tra, gom hàng triệu đứa trẻ vào chung một ô.
                </li>
                <li>
                  <strong>Không phải tiêu chí để sàng lọc.</strong> Hai mục{' '}
                  <Link href="#quan-trong-hon-bang-tra" className={A}>
                    nặng hơn bảng tra
                  </Link>{' '}
                  và{' '}
                  <Link href="#khong-trach-em-be" className={A}>
                    không trách một đứa trẻ
                  </Link>{' '}
                  nói thẳng phần khó nói nhất.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Ba phạm vi bài này cố ý không lấn — vì sao {FOCUS_CANCHI} lại ra {FOCUS_NAPAM}, vì
                sao các cặp con giáp lại hợp hay xung như vậy, và chuyện chọn tên hợp mệnh sau khi
                bé chào đời — đều có bài riêng, được dẫn đúng chỗ ở các mục bên dưới.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <SinhConDepth />,
        },
        {
          id: 'hai-lop-doi-chieu',
          tocLabel: 'Hai lớp đối chiếu',
          heading: 'Lớp 1 — quan hệ 12 con giáp giữa tuổi bố mẹ và tuổi bé',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Lớp thứ nhất chỉ nhìn <strong>con giáp</strong>. Công cụ phân quan hệ giữa tuổi
                bố/mẹ và tuổi bé thành đúng {RELATION_LABELS.length} nhóm:{' '}
                <strong>{RELATION_LABELS.join(', ')}</strong>. Ba sắc thái đi kèm là{' '}
                {TONE_LABEL.hop}, {TONE_LABEL['luu-y']} và {TONE_LABEL['trung-tinh']} — không nhóm
                nào bị gọi là xấu. Trên trang công cụ, sắc thái được thể hiện bằng{' '}
                <strong>màu khung kết quả</strong> chứ không in ra thành chữ; ba tên gọi dưới đây
                là cách bài này đặt tên cho ba mức đó. Bảng dưới là toàn bộ lớp thứ nhất cho một em
                bé sinh năm {FOCUS_CANCHI} (tuổi {FOCUS_TEN}); cả nhãn lẫn sắc thái đều đọc thẳng từ
                bộ quy tắc mà công cụ đang chạy.
              </p>
              <DataTable
                minWidth="min-w-[620px]"
                cols={[
                  'Con giáp bố / mẹ',
                  `Quan hệ với bé tuổi ${FOCUS_TEN}`,
                  'Sắc thái trong bộ quy tắc',
                ]}
                rows={ZODIAC_ROWS.map((row) => [
                  <>
                    {row.zodiac.ten} <span aria-hidden="true">{row.zodiac.emoji}</span>
                  </>,
                  row.copy.label,
                  TONE_LABEL[row.copy.tone],
                ])}
              />
              <p>
                Đếm lại bảng trên: {COUNT_HOP} con giáp thuộc nhóm {TONE_LABEL.hop.toLowerCase()},{' '}
                {COUNT_LUU_Y} thuộc nhóm {TONE_LABEL['luu-y'].toLowerCase()}, {COUNT_TRUNG_TINH} còn
                lại thuộc nhóm {TONE_LABEL['trung-tinh'].toLowerCase()} — trên tổng{' '}
                {ZODIAC_ROWS.length}. Nói cách khác,{' '}
                <strong>
                  phần lớn tổ hợp bố mẹ – con không được xếp vào nhóm hợp mà cũng không bị xếp vào
                  nhóm lưu ý
                </strong>
                . Đó đã là câu trả lời cho phần lớn gia đình đang lo lắng.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Đổi sang năm khác thì bảng có rộng ra không
              </h3>
              <p>
                Không. Ba năm mà ô chọn của công cụ đang mở cho thấy điều đó: can chi đổi, con giáp
                đổi
                {SAME_NAPAM ? (
                  <>
                    , còn mệnh thì chưa chắc — {SAME_NAPAM.a.year} và {SAME_NAPAM.b.year} cùng mang
                    nạp âm {SAME_NAPAM.a.napAm}, tức cùng mệnh {SAME_NAPAM.a.menh}, vì mỗi tên nạp
                    âm trong vòng 60 Giáp Tý phủ đúng hai năm liền nhau
                  </>
                ) : (
                  <>, mệnh đổi</>
                )}{' '}
                — nhưng sườn đếm giữ nguyên, vì mỗi con giáp luôn có đúng một bạn Lục Hợp, một bạn
                Lục Xung, một bạn Lục Hại và hai bạn Tam Hợp.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                {YEAR_ROWS.map((r) => (
                  <li key={r.year}>
                    <strong>
                      {r.year} — {r.canChi}
                    </strong>
                    , tuổi {r.ten}, {r.napAm} (mệnh {r.menh}): {r.hop} con giáp bố mẹ thuộc nhóm{' '}
                    {TONE_LABEL.hop.toLowerCase()}, {r.luuY} thuộc nhóm{' '}
                    {TONE_LABEL['luu-y'].toLowerCase()}, {r.trungTinh} thuộc nhóm{' '}
                    {TONE_LABEL['trung-tinh'].toLowerCase()}.
                  </li>
                ))}
              </ul>
              <p className="text-sm text-foreground/70">
                Hệ quả cần nhớ: dời năm sinh không làm bạn “thoát” khỏi bảng, nó chỉ xoay bảng đi —
                một năm hợp với mẹ có thể lại rơi vào nhóm lưu ý với bố. Vì sao lại là những cặp con
                giáp đó chứ không phải cặp khác thì thuộc bài{' '}
                <Link href="/learn/tam-hop-luc-xung" className={A}>
                  Tam hợp – Lục xung
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'lop-menh-nap-am',
          tocLabel: 'Lớp mệnh nạp âm',
          heading: 'Lớp 2 — mệnh nạp âm, và chỗ hai lớp không cùng hướng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Lớp thứ hai bỏ qua con giáp và chỉ nhìn <strong>mệnh nạp âm</strong>: mỗi năm âm ứng
                một tên nạp âm trong vòng 60 Giáp Tý, và mỗi tên thuộc một trong năm hành. Cách vòng
                60 tên ấy được dựng nên thuộc bài{' '}
                <Link href="/learn/nap-am" className={A}>
                  Nạp âm 60 Giáp Tý
                </Link>
                ; ở đây chỉ cần kết quả — năm {FOCUS_CANCHI} cho ra {FOCUS_NAPAM}, tức mệnh{' '}
                {FOCUS_MENH}. Có hai hành thì đọc được quan hệ, và bảng dưới là{' '}
                <strong>toàn bộ</strong> lớp thứ hai: {ELEMENT_KEYS.length} hành của bố/mẹ nhân{' '}
                {ELEMENT_KEYS.length} hành của bé, tức {ELEMENT_KEYS.length * ELEMENT_KEYS.length}{' '}
                ô, mọi ô đều do đúng hàm mà công cụ gọi sinh ra.
              </p>
              <DataTable
                minWidth="min-w-[700px]"
                cols={[
                  'Mệnh bố / mẹ ↓ · Mệnh bé →',
                  ...ELEMENT_KEYS.map((el) => ELEMENTS[el].name),
                ]}
                rows={MENH_MATRIX.map((row) => [
                  ELEMENTS[row.parentEl].name,
                  ...row.cells.map((cell) => MENH_KIND_LABEL[cell.rel.kind]),
                ])}
              />
              <p>
                Một chi tiết chỉ đọc mã nguồn mới thấy: hàm tính quan hệ mệnh viết ra{' '}
                {MENH_KINDS_ALL.length} nhánh, nhưng vòng ngũ hành chỉ sinh ra được{' '}
                {MENH_KINDS_SEEN.length} — với năm hành, hai hành khác nhau bất kỳ luôn ở thế sinh
                hoặc thế khắc, không bao giờ “không dính gì”. Nhánh{' '}
                {MENH_KINDS_UNREACHABLE.map((k) => (
                  <strong key={k}>“{MENH_KIND_LABEL[k]}”</strong>
                ))}{' '}
                vì thế nằm trong mã như một lối thoát mà thực tế không bao giờ chạy tới.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Một nhà thật: hai lớp cho hai sắc thái khác nhau
              </h3>
              <p>
                Chỉ <strong>năm sinh</strong> là dữ kiện đầu vào; mọi thứ còn lại do trang này suy
                lại bằng đúng bộ quy tắc mà công cụ đang chạy. Bé giả định sinh năm {FOCUS_CANCHI},
                tuổi {FOCUS_TEN}, mệnh {FOCUS_MENH}.
              </p>
              <DataTable
                minWidth="min-w-[780px]"
                cols={[
                  'Người',
                  'Năm sinh âm',
                  'Can chi — con giáp',
                  'Nạp âm — mệnh',
                  'Lớp 1',
                  'Lớp 2',
                ]}
                rows={PARENT_CASES.map(({ role, year, check }) => [
                  role,
                  year,
                  `${check?.parent.canChi ?? '—'} — ${check?.parent.zodiac.ten ?? '—'}`,
                  `${check?.parent.napAmName ?? '—'} — ${check ? ELEMENTS[check.parent.element].name : '—'}`,
                  `${check?.relationCopy.label ?? '—'} (${check ? TONE_LABEL[check.relationCopy.tone].toLowerCase() : '—'})`,
                  `${check ? MENH_KIND_LABEL[check.menh.kind] : '—'} (${check ? TONE_LABEL[check.menh.tone].toLowerCase() : '—'})`,
                ])}
              />
              <p>
                Bài học chính của mục này:{' '}
                <strong>hai lớp không bắt buộc phải cùng sắc thái</strong> — với cả hai người trong
                ví dụ, sắc thái đổi khi chuyển từ lớp con giáp sang lớp mệnh. Công cụ để cả hai dòng
                cạnh nhau và <strong>không cộng lại</strong>: không quy tắc cộng điểm nào được cả
                hai truyền thống công nhận, nên mọi con số tổng đều do người viết công cụ tự đặt.
              </p>
              <p className="text-sm text-foreground/70">
                Chỗ hai lớp mâu thuẫn chính là lúc nên dừng lại: quan niệm xưa không có câu trả lời
                cho trường hợp của bạn. Cách xử lý lành mạnh nằm ở{' '}
                <Link href="/learn/ra-quyet-dinh" className={A}>
                  bài về ra quyết định
                </Link>{' '}
                — dùng lăng kính để mở góc nhìn, rồi quyết bằng tiêu chí đo được.
              </p>
            </div>
          ),
        },
        {
          id: 'quan-trong-hon-bang-tra',
          tocLabel: 'Nặng hơn bảng tra',
          heading: 'Bốn thứ nặng hơn mọi bảng tra — và bảng tra không biết gì về chúng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là mục quan trọng nhất của bài. Công cụ có đúng {INPUT_COUNT} ô, mỗi ô là một
                con số năm: ô chọn năm bé hiện chỉ mở {TOOL_CHILD_YEARS.length} năm{' '}
                {TOOL_CHILD_YEARS[0]}–{TOOL_CHILD_YEARS[TOOL_CHILD_YEARS.length - 1]}, còn{' '}
                {PARENT_INPUT_COUNT} ô nhập năm sinh bố mẹ nhận năm trong khoảng {YEAR_MIN}–
                {YEAR_MAX}. Nó{' '}
                <strong>không có chỗ nào để nhận</strong> bốn thứ dưới đây — không phải vì chúng
                không quan trọng, mà vì phép tính không chứa được chúng. Trong khi đó đúng bốn thứ
                này mới ảnh hưởng thật tới một lần sinh nở và tới những năm đầu đời của em bé.
              </p>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  <strong>Sức khoẻ của mẹ.</strong> Tiền sử thai sản, bệnh nền, kết quả khám tiền
                  sản — những thứ quyết định một thai kỳ an toàn hay không, và chỉ bác sĩ mới đọc
                  được. Không nhóm Tam Hợp nào bù được cho một chỉ định y khoa bị bỏ qua.
                </li>
                <li>
                  <strong>Tuổi của mẹ.</strong> Chỗ dời năm gây hại rõ nhất: chờ thêm một năm cho
                  “hợp tuổi” nghĩa là mẹ thêm một tuổi khi mang thai — mà rủi ro thai sản tăng theo
                  tuổi mẹ là điều y học đo được, còn lợi ích của việc trùng nhóm con giáp thì chưa
                  ai đo được. Đổi thứ đo được lấy thứ không đo được là một cuộc trao đổi tồi.
                </li>
                <li>
                  <strong>Điều kiện kinh tế.</strong> Chi phí sinh nở, thu nhập khi một người phải
                  nghỉ, chỗ ở, người phụ chăm bé — thứ gia đình cảm nhận mỗi ngày trong ba năm đầu,
                  và không dòng nào trong bảng tra chạm tới.
                </li>
                <li>
                  <strong>Sự sẵn sàng của cả hai người.</strong> Cả hai có thật sự muốn không, có
                  thống nhất cách nuôi con không. Một em bé sinh ra giữa hai người chưa đồng thuận
                  sẽ khó hơn rất nhiều so với một em bé sinh vào năm “không hợp” nhưng được cả hai
                  mong.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh gọn trong một câu:{' '}
                <strong>quyết bằng bốn thứ trên trước, rồi mới mở bảng tra nếu vẫn thấy vui</strong>
                . Nếu bảng tra đang là lý do khiến bạn dời một quyết định lớn thì thứ tự đã bị đảo
                ngược.
              </p>
              <p className="text-sm text-foreground/70">
                hieu.asia không bán và không khuyên mua bất cứ thứ gì để “hoá giải” một năm sinh —
                không có tác động nào được đo thì cũng không có gì để hoá giải. Ai dùng nỗi lo về
                tuổi con để bán cho bạn một dịch vụ là lúc nên dừng lại.
              </p>
            </div>
          ),
        },
        {
          id: 'khong-trach-em-be',
          tocLabel: 'Không trách một đứa trẻ',
          heading: 'Điều tuyệt đối không được làm với bảng này',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Có một cách dùng bảng tra mà bài này phản đối thẳng, không kèm điều kiện:{' '}
                <strong>
                  dùng nó để trách một đứa trẻ đã sinh ra vào năm bị coi là “không hợp”
                </strong>
                . Chuyện này xảy ra thật, và thường không bắt đầu bằng ác ý: nhà gặp một năm khó —
                mất việc, ốm đau, làm ăn thất bát — rồi ai đó nhớ ra đứa cháu sinh năm ấy “xung tuổi
                bố”, thế là mọi chuyện không may đều có chỗ để quy về. Đứa trẻ lớn lên nghe câu đó
                lặp lại, và tin.
              </p>
              <p>Ba lý do khiến cách dùng đó vừa sai về kỹ thuật vừa bất công:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Chính bộ quy tắc không nói vậy.</strong> Trong lời diễn giải mà công cụ
                  hiển thị, nhóm lưu ý chỉ là lời nhắc “khác nhịp, cần dung hoà” — lục xung được
                  giải thích là hai “nhịp” tính cách khác nhau, lục hại là “lệch kênh” giao tiếp
                  đôi chút — kèm câu khẳng định rõ rằng không có chuyện con “khắc” hay mang lỗi với
                  cha mẹ. Người trách đứa trẻ đang thêm vào bảng một nội dung nó không có.
                </li>
                <li>
                  <strong>Quan hệ trong bảng là hai chiều.</strong> Lục Xung là một cặp: nếu đó là
                  lỗi thì lỗi thuộc về cả hai phía như nhau. Chỉ mỗi đứa trẻ bị mang tiếng là vì nó
                  yếu thế nhất trong nhà, không phải vì phép tính chỉ vào nó.
                </li>
                <li>
                  <strong>Đứa trẻ không chọn năm sinh của mình.</strong> Câu ngắn nhất và cũng là
                  câu đủ. Trách một người vì dữ kiện họ không có phần nào trong đó là bất công, và
                  với một đứa trẻ thì đó còn là vết thương kéo dài nhiều năm.
                </li>
              </ul>
              <p>
                Câu trả lời gọn nhất khi trong nhà có người nói vậy: bảng tra mô tả quan hệ giữa hai
                nhãn lịch, nó không cấp cho ai quyền phân xử một đứa trẻ. Và nếu bạn từng bị nói như
                thế khi còn nhỏ — điều đó không đúng, không phải lỗi của bạn, và một phép tra dựa
                trên đúng một con số năm không đủ tư cách để định nghĩa bạn.
              </p>
              <p className="text-sm text-foreground/70">
                Muốn dùng các lăng kính này theo hướng ngược lại — để hiểu và thông cảm với người
                thân thay vì để quy trách nhiệm — thì bài{' '}
                <Link href="/learn/hieu-nguoi-than" className={A}>
                  Hiểu người thân qua lăng kính
                </Link>{' '}
                viết riêng cho việc đó.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: bảng tra biết rất ít, và biết rất thô',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>Ngoài chuyện đạo đức ở hai mục trên, bản thân phép tính cũng có giới hạn.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Đầu vào thô nhất có thể.</strong> Mỗi người chỉ được mô tả bằng đúng một
                  con số: năm sinh âm lịch. Mọi em bé sinh cùng năm đều có cùng con giáp và cùng
                  mệnh, nên kết quả không thể nói điều gì riêng về một gia đình cụ thể.
                </li>
                <li>
                  <strong>Không có phép đo nào đứng sau.</strong> Không có đại lượng ngoài đời tương
                  ứng với “hợp mệnh bố mẹ” nên cũng không có gì để kiểm chứng — vì sao một quy tắc
                  không kiểm được vẫn thuyết phục thì bài{' '}
                  <Link href="/learn/kiem-chung" className={A}>
                    Kiểm chứng huyền học
                  </Link>{' '}
                  nói riêng phần đó.
                </li>
                <li>
                  <strong>Mốc năm âm là chỗ dễ sai nhất.</strong> Năm âm đổi ở Tết, không phải ngày
                  1 tháng 1. Sinh trước Tết là thuộc năm âm liền trước — lệch một con giáp thì lệch
                  cả hai lớp. Cơ chế lệch giữa hai loại lịch thuộc bài{' '}
                  <Link href="/learn/lich-am-duong" className={A}>
                    Lịch âm – lịch dương
                  </Link>
                  ; tra nhanh can chi một năm thì dùng{' '}
                  <Link href="/tra-cuu-tuoi" className={A}>
                    công cụ tra cứu tuổi
                  </Link>
                  .
                </li>
                <li>
                  <strong>
                    Sách vở không thống nhất, và đây không phải lời khuyên chuyên môn.
                  </strong>{' '}
                  Các bản in xếp nhóm khác nhau, có bản còn thêm lớp mà công cụ này không tính;
                  hieu.asia chọn tính đúng hai lớp đọc được rõ ràng và ghi rõ phần không tính. Dù
                  vậy đây vẫn là nội dung văn hoá — không thay được bác sĩ sản khoa, và không nên là
                  lý do dời hay đẩy nhanh bất kỳ kế hoạch sinh con nào.
                </li>
              </ul>
              <p>
                Cách đọc lành mạnh: xem kết quả như một{' '}
                <strong>câu chuyện văn hoá về năm sinh</strong>, giống như biết bé cầm tinh con gì
                để kể cho bé nghe sau này. Giữ ở mức đó thì nó là một nét vui; đẩy lên thành tiêu
                chí quyết định thì nó bắt đầu gây hại.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <SinhConWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <SinhConRecall />,
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
                Khi bé đã chào đời và bạn muốn chọn tên theo mệnh, phần đó nằm ở bài{' '}
                <Link href="/learn/dat-ten-ngu-hanh" className={A}>
                  Đặt tên theo ngũ hành
                </Link>
                . Còn muốn xem bức tranh của cả nhà chứ không chỉ từng cặp bố mẹ – con?{' '}
                <Link href="/xem-hop-nhom" className={A}>
                  Xem hợp cả nhà từ ba người trở lên →
                </Link>
              </p>
              <RelatedTools
                links={[
                  { href: '/sinh-con', label: 'Sinh con theo năm — đối chiếu tuổi bố mẹ' },
                  { href: '/dat-ten-ngu-hanh', label: 'Đặt tên hợp mệnh cho bé' },
                  { href: '/xem-hop-nhom', label: 'Xem hợp cả nhà' },
                  { href: '/tra-cuu-tuoi', label: 'Tra cứu tuổi và can chi' },
                ]}
              />
            </>
          ),
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <SinhConChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
