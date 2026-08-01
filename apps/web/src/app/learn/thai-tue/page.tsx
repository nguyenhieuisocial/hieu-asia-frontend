/**
 * Bài học /learn/thai-tue — bài CHÍNH THỨC về Thái Tuế trên hieu.asia.
 *
 * GROUNDING — không gõ tay bảng nào, mọi chi và mọi năm đều SUY TẠI RUNTIME:
 *   • lib/xem-tuoi-cuoi.ts — CHI (12 địa chi), LUC_XUNG (6 cặp lục xung),
 *     ANIMAL_BY_CHI, canChiOfYear(y) = can (y−4)%10 + chi (y−4)%12.
 *   • lib/hop-tuoi-pairs.ts — ZODIAC, relationOf() phân SÁU loại quan hệ giữa hai
 *     chi (dong-tuoi / tam-hop / luc-hop / luc-xung / luc-hai / binh-hoa) và
 *     RELATION_COPY[kind].label. Tập này KHÔNG có lớp Tương Hình.
 *   • app/tu-vi-2026/con-giap-data.ts — công cụ đích: YEAR, YEAR_CANCHI, YEAR_CHI,
 *     YEAR_RANGE, buildConGiap2026(slug).relationLabel — bảng "công cụ tính gì"
 *     render THẲNG nhãn mà trang công cụ hiển thị, không chép tay.
 *   • lib/khai-truong.ts — checkOpeningYear() chỉ xét Tam Tai + checkXungNam()
 *     (trùng chi và lục xung); KHÔNG xét lục hại, KHÔNG xét Tương Hình.
 *
 * CÔNG CỤ THẬT SỰ TÍNH GÌ (đọc code, không đoán):
 *   trùng Thái Tuế → CÓ (/tu-vi-2026 + /khai-truong); xung Thái Tuế → CÓ (cả hai);
 *   hại Thái Tuế → CÓ ở /tu-vi-2026 dưới tên "Lục Hại với năm", KHÔNG ở
 *   /khai-truong; hình Thái Tuế (Tương Hình) → KHÔNG tính ở bất kỳ đâu trong repo,
 *   và trang nói thẳng điều đó thay vì trình bày như thể có.
 *
 * KIỂM CHỨNG SỐ LIỆU (chạy lại được bằng chính các hàm trên): canChiOfYear(2026)
 * = Bính Ngọ; sinh 1990 → chi Ngọ (trùng), 1996 → chi Tý (xung), 2000 → chi Thìn
 * (bình hoà). Khoảng cách năm tuổi ↔ năm xung = 6 với cả 12 chi. Mộc tinh chu kỳ
 * 11,862 năm → lệch trọn một chi so với vòng 12 quy ước sau ~86 năm.
 *
 * PHẠM VI: hình học vòng 12 chi thuộc /learn/tam-hop-luc-xung (ở đây MỘT câu +
 * link); chọn năm mở hàng thuộc /learn/khai-truong (MỘT câu + link); bảng Tương
 * Hình thuộc /learn/hop-tuoi. Giọng: Thái Tuế là QUY ƯỚC LỊCH PHÁP – PHONG TỤC để
 * tham khảo, không phải lực tác động; năm tuổi không phải năm xui; không doạ,
 * không bán giải hạn.
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
import { CHI, LUC_XUNG, ANIMAL_BY_CHI, canChiOfYear, type Chi } from '@/lib/xem-tuoi-cuoi';
import { ZODIAC, relationOf, type RelationKind } from '@/lib/hop-tuoi-pairs';
import {
  buildConGiap2026,
  YEAR as TOOL_YEAR,
  YEAR_CANCHI,
  YEAR_CHI,
  YEAR_RANGE,
} from '@/app/tu-vi-2026/con-giap-data';
import {
  ThaiTueFrame,
  ThaiTueDepth,
  ThaiTueRecall,
  ThaiTueChecklist,
  ThaiTueWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Thái Tuế là gì — năm tuổi và xung Thái Tuế',
  description:
    'Thái Tuế là địa chi của năm âm lịch. Trùng Thái Tuế là năm tuổi, xung Thái Tuế là chi năm đối chi tuổi — quy ước lịch pháp tham khảo, không phải năm xui.',
  alternates: { canonical: 'https://hieu.asia/learn/thai-tue' },
};

// --- Dữ kiện suy từ lib ------------------------------------------------------

/** Tra con giáp theo tên địa chi — ZODIAC.ten dùng đúng bộ chữ với CHI. */
const ZODIAC_BY_CHI = new Map(ZODIAC.map((z) => [z.ten, z]));

const YEAR_ZODIAC = ZODIAC_BY_CHI.get(YEAR_CHI);
const YEAR_ANIMAL = ANIMAL_BY_CHI[YEAR_CHI];
const PREV_YEAR_CANCHI = canChiOfYear(TOOL_YEAR - 1);

/** Chi ở quan hệ `kind` với `chi`, suy từ relationOf() thay vì chép bảng. */
function partnerOf(chi: Chi, kind: RelationKind): Chi | undefined {
  const self = ZODIAC_BY_CHI.get(chi);
  if (!self) return undefined;
  const hit = ZODIAC.find((z) => z.slug !== self.slug && relationOf(self.slug, z.slug) === kind);
  return hit?.ten as Chi | undefined;
}

/**
 * Nhãn quan hệ tuổi ↔ năm mà CHÍNH trang công cụ hiển thị, tra theo chi tuổi.
 * Đọc thẳng từ engine của /tu-vi-2026 → công cụ đổi cách gọi thì trang này đổi theo.
 */
const TOOL_LABEL_BY_CHI = new Map(
  ZODIAC.map((z) => [z.ten, buildConGiap2026(z.slug)?.relationLabel ?? '—']),
);

/** Nhãn công cụ dùng cho một loại quan hệ với năm đang xét. */
function toolLabelFor(kind: RelationKind): string | undefined {
  if (!YEAR_ZODIAC) return undefined;
  const hit = ZODIAC.find((z) => relationOf(z.slug, YEAR_ZODIAC.slug) === kind);
  return hit ? TOOL_LABEL_BY_CHI.get(hit.ten) : undefined;
}

const LABEL_TRUNG = toolLabelFor('dong-tuoi');
const LABEL_XUNG = toolLabelFor('luc-xung');
const LABEL_HAI = toolLabelFor('luc-hai');

/** Khoảng cách bước trên vòng 12 chi giữa một chi và chi xung với nó. */
const stepsToXung = (c: Chi) =>
  (((CHI.indexOf(LUC_XUNG[c]) - CHI.indexOf(c)) % CHI.length) + CHI.length) % CHI.length;
const XUNG_STEP_SET = new Set(CHI.map(stepsToXung));
const XUNG_STEPS = XUNG_STEP_SET.size === 1 ? [...XUNG_STEP_SET][0] : undefined;

/** Số năm trong mỗi vòng 12 mà MỘT tuổi bất kỳ dính trùng / xung / hại. */
const HIT_YEARS = (() => {
  const self = ZODIAC[0];
  if (!self) return 0;
  return ZODIAC.filter((z) => {
    const r = relationOf(self.slug, z.slug);
    return r === 'dong-tuoi' || r === 'luc-xung' || r === 'luc-hai';
  }).length;
})();

const FREE_YEARS = CHI.length - HIT_YEARS;

/** `count` năm gần nhất từ `from` có địa chi đúng bằng `chi`. */
function nextYearsWithChi(chi: Chi, from: number, count: number): number[] {
  const out: number[] = [];
  for (let y = from; out.length < count; y += 1) {
    if (canChiOfYear(y).chi === chi) out.push(y);
  }
  return out;
}

/** Bảng tra 12 chi: chi năm gây trùng / xung / hại, và quan hệ với năm công cụ. */
const LOOKUP_ROWS = CHI.map((chi) => ({
  chi,
  animal: ANIMAL_BY_CHI[chi],
  trung: chi,
  xung: LUC_XUNG[chi],
  hai: partnerOf(chi, 'luc-hai'),
  thisYear: TOOL_LABEL_BY_CHI.get(chi) ?? '—',
}));

/** Bốn quan hệ quanh chữ Thái Tuế. `toolLabel` rỗng = công cụ KHÔNG tính. */
interface RelationRow {
  ten: string; tenKhac: string; cachDoc: string; toolLabel?: string; ghiChu: string;
}

const FOUR_RELATIONS: RelationRow[] = [
  {
    ten: 'Trùng Thái Tuế',
    tenKhac: 'năm tuổi',
    cachDoc: 'Chi của năm TRÙNG chi tuổi bạn',
    toolLabel: LABEL_TRUNG,
    ghiChu: 'Được tính ở cả trang tử vi năm lẫn trang xem tuổi khai trương, và ở cả hai nơi đều chỉ là một dòng lưu ý nhẹ.',
  },
  {
    ten: 'Xung Thái Tuế',
    tenKhac: 'tuế phá, năm xung tuổi',
    cachDoc: 'Chi của năm ĐỐI chi tuổi bạn trên vòng 12 chi',
    toolLabel: LABEL_XUNG,
    ghiChu: 'Được tính ở cả hai công cụ. Là quan hệ duy nhất trong bốn cái làm trang xem tuổi khai trương hạ một bậc kết luận.',
  },
  {
    ten: 'Hình Thái Tuế',
    tenKhac: 'Tương Hình',
    cachDoc: 'Chi năm và chi tuổi cùng thuộc một nhóm Hình theo canon',
    ghiChu: 'KHÔNG được tính ở bất kỳ công cụ nào của hieu.asia. Phong tục có nhắc, nhưng tên gọi các nhóm Hình còn khác nhau giữa các bản in nên site chưa đưa vào phép tính.',
  },
  {
    ten: 'Hại Thái Tuế',
    tenKhac: 'Lục Hại',
    cachDoc: 'Chi năm và chi tuổi thuộc một trong sáu cặp lục hại',
    toolLabel: LABEL_HAI,
    ghiChu: 'Trang tử vi năm CÓ tính, nhưng hiển thị dưới tên Lục Hại chứ không gọi là hại Thái Tuế. Trang xem tuổi khai trương thì không xét lớp này.',
  },
];

/** Ba năm sinh ví dụ — mỗi năm rơi vào một quan hệ khác nhau với năm công cụ. */
const EXAMPLE_BIRTH_YEARS = [1990, 1996, 2000];

const EXAMPLES = EXAMPLE_BIRTH_YEARS.map((birthYear) => {
  const canChi = canChiOfYear(birthYear);
  return {
    birthYear,
    canChi,
    namTuoi: nextYearsWithChi(canChi.chi, TOOL_YEAR, 3),
    namXung: nextYearsWithChi(LUC_XUNG[canChi.chi], TOOL_YEAR, 2),
    thisYear: TOOL_LABEL_BY_CHI.get(canChi.chi) ?? '—',
  };
});

const CASE_TRUNG = EXAMPLES[0];
const CASE_XUNG = EXAMPLES[1];
const CASE_BINH_HOA = EXAMPLES[2];

/**
 * Chu kỳ quỹ đạo (sidereal) của Mộc tinh, tính bằng năm. Hằng số thiên văn —
 * không lib nào của site suy ra được, nên khai báo tại đây và MỌI con số về độ
 * lệch bên dưới đều tính từ nó.
 */
const JUPITER_PERIOD_YEARS = 11.862;
// NHÃN HIỂN THỊ phải dùng dấu PHẨY: trong tiếng Việt dấu chấm là phân cách nghìn,
// nên in thẳng số JS ra sẽ thành "11.862 năm" và người đọc hiểu là mười một nghìn
// — sai gấp 1000 lần, lại nằm trong FAQPage mà Google và trợ lý AI trích lại.
// Cùng quy ước với /learn/lich-am-duong ("29,53 ngày", "365,2422 ngày").
const JUPITER_LABEL = '11,862';

/** Sau bao nhiêu năm thì Mộc tinh thật lệch trọn MỘT chi so với vòng 12 quy ước. */
const DRIFT_ONE_BRANCH_YEARS = Math.round(
  1 / (1 / JUPITER_PERIOD_YEARS - 1 / CHI.length) / CHI.length,
);

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ schema ===
// chữ trên trang. Câu hỏi cố ý KHÁC bộ FAQ của /tu-vi-2026/[con-giap] (ở đó hỏi
// "tuổi X hợp hay xung", "có Tam Tai không", "gặp sao gì") và KHÁC bộ FAQ của
// /learn/khai-truong (ở đó hỏi Thái Tuế trong ngữ cảnh mở hàng).
const FAQS = [
  {
    q: 'Thái Tuế có phải một ngôi sao đang chiếu xuống người ta không?',
    a: `Không. Thái Tuế của một năm chính là địa chi của năm âm lịch đó — năm ${TOOL_YEAR} là ${YEAR_CANCHI.name} nên Thái Tuế năm ${TOOL_YEAR} là ${YEAR_CHI}, con ${YEAR_ANIMAL}. Phép tính chỉ cần đúng một dữ kiện là năm, không cần giờ sinh, không cần giới tính, không cần vị trí thiên thể nào. Nói cách khác đây là một ô trong bảng lịch can chi, và mọi người sinh cùng một năm âm lịch đều có cùng quan hệ với Thái Tuế của mọi năm.`,
  },
  {
    q: 'Vậy vì sao cái tên lại gắn với Mộc tinh?',
    a: `Vì gốc của nó đúng là thiên văn. Người xưa gọi Mộc tinh là Tuế Tinh, tức sao của năm, do Mộc tinh đi hết một vòng trong khoảng ${JUPITER_LABEL} năm nên mỗi năm nhích được chừng một phần ${CHI.length} bầu trời — rất tiện để đặt tên năm. Vấn đề là Mộc tinh chạy ngược chiều đếm 12 chi, nên người xưa dựng ra một điểm tưởng tượng chạy ngược lại và làm tròn đúng ${CHI.length} năm một vòng, gọi là Thái Tuế. Chu kỳ ${JUPITER_LABEL} năm là thiên văn; con số ${CHI.length} chẵn và chiều chạy là quy ước.`,
  },
  {
    q: 'Trùng, xung, hình, hại — hieu.asia thật sự tính những quan hệ nào?',
    a: `Trùng Thái Tuế và xung Thái Tuế được tính ở cả trang tử vi năm lẫn trang xem tuổi khai trương. Lớp hại được trang tử vi năm tính nhưng hiển thị dưới tên "${LABEL_HAI ?? 'Lục Hại với năm'}" chứ không gọi là hại Thái Tuế, còn trang xem tuổi khai trương thì không xét lớp này. Riêng hình Thái Tuế, tức Tương Hình, thì không công cụ nào của hieu.asia tính — phong tục có nhắc tới nhưng tên gọi các nhóm Hình còn khác nhau giữa các bản in, nên site chưa đưa vào phép tính và nói thẳng điều đó thay vì trình bày như thể có.`,
  },
  {
    q: 'Năm tuổi có phải là năm xui không?',
    a: `Không. "Năm tuổi" chỉ có nghĩa là chi của năm trùng chi tuổi bạn, tức bạn vừa đi trọn một vòng ${CHI.length} con giáp. Trong phép tính ấy không có bất cứ thông tin nào về việc sẽ xảy ra: nó không biết bạn làm nghề gì, đang chuẩn bị việc gì, sức khoẻ ra sao. Lý do nó vẫn được tin là vì nó không thể sai — năm nào cũng có chuyện không như ý, và người đang cảnh giác thì nhớ những chuyện ấy kỹ hơn rồi nối vào cái nhãn. Giữ tục lệ nếu bạn thấy an tâm, nhưng đừng đọc nó như một dự báo.`,
  },
  {
    q: 'Năm tuổi tính từ ngày 1 tháng 1 hay từ Tết?',
    a: `Từ Tết. Chi của năm đổi theo năm âm lịch, không theo mốc dương lịch — năm ${YEAR_CANCHI.name} chạy từ ${YEAR_RANGE}. Vì vậy người sinh trong tháng 1 hoặc đầu tháng 2 dương lịch của năm ${TOOL_YEAR} vẫn thuộc năm âm ${PREV_YEAR_CANCHI.name}, tức mang chi ${PREV_YEAR_CANCHI.chi} chứ không phải ${YEAR_CHI}. Đây là chỗ sai phổ biến nhất khi tự tra: lệch một con giáp là lệch toàn bộ quan hệ trùng, xung và hại của mọi năm về sau.`,
  },
  {
    q: `Trong ${CHI.length} năm thì một người dính Thái Tuế mấy năm?`,
    a: `Đúng ${HIT_YEARS} năm, và ${FREE_YEARS} năm còn lại không rơi vào quan hệ nào trong ba quan hệ được tính. Cách đếm rất gọn: chi năm chạy hết một vòng ${CHI.length} chi thì chi trùng chi tuổi bạn xuất hiện một lần, chi đối cũng một lần, chi ở thế lục hại một lần. Vì ba quan hệ này thuộc các nhóm rời nhau nên chúng không bao giờ rơi vào cùng một năm — và vì lục xung là hai chi đối đỉnh nên năm tuổi với năm xung của cùng một người luôn cách nhau ${XUNG_STEPS ?? 0} năm.`,
  },
  {
    q: 'Có cần cúng giải hạn hay mua vật phẩm hoá giải Thái Tuế không?',
    a: 'hieu.asia không bán và không khuyên mua bất cứ thứ gì để "hoá giải" Thái Tuế. Lý do rất đơn giản: cái được gọi là Thái Tuế ở đây là một nhãn lịch, và không có phép đo nào cho thấy nó tác động lên đời sống, nên cũng không có gì để hoá giải. Nếu việc thắp nén nhang đầu năm khiến bạn thấy yên tâm và gắn kết với gia đình thì đó là giá trị văn hoá, hoàn toàn đáng giữ. Chỉ nên cảnh giác khi ai đó dùng nỗi lo về Thái Tuế để bán cho bạn một dịch vụ.',
  },
  {
    q: 'Đang định làm việc lớn mà rơi đúng năm trùng chi tuổi thì có nên hoãn không?',
    a: `Không nên hoãn chỉ vì lý do đó. Hoãn một năm là mất một năm thật — tiền thuê, đà chuẩn bị, cơ hội — để đổi lấy sự an tâm về một quy ước lịch; và năm sau lại có một nhãn kiêng khác đang chờ. Việc nhờ người khác đứng tên cũng không đổi được gì, vì nó chỉ đổi cái nhãn chứ không đổi rủi ro thật của việc. Nếu bạn muốn một tiêu chí thật sự hữu ích để cân nhắc thời điểm, hãy nhìn vào dòng tiền dự phòng, mức độ chuẩn bị và thị trường — đó mới là những thứ quyết định.`,
  },
];

const JSONLD = [
  article({
    headline: 'Thái Tuế là gì: năm tuổi, xung Thái Tuế và bốn quan hệ với chi của năm',
    description:
      'Thái Tuế của một năm là địa chi của năm âm lịch đó. Bài giải thích tên gọi đến từ chu kỳ Mộc tinh, bốn quan hệ trùng – xung – hình – hại, và cái nào công cụ thật sự tính.',
    url: '/learn/thai-tue',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Thái Tuế', url: '/learn/thai-tue' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Thái Tuế — năm tuổi, xung Thái Tuế và cách đọc cho đúng',
    description:
      'Thái Tuế là địa chi của năm âm lịch. Trùng Thái Tuế là năm tuổi, xung Thái Tuế là chi năm đối chi tuổi — quy ước lịch pháp tham khảo, không phải năm xui.',
    url: '/learn/thai-tue',
  }),
];

const TD = 'px-4 py-2 text-muted-foreground';
const A = 'text-gold-700 underline-offset-4 hover:underline';

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

export default function LearnThaiTuePage() {
  return (
    <LearnArticle
      eyebrow="CAN CHI · LỊCH PHÁP"
      title={
        <>
          Thái Tuế{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">(chi của năm)</span>
        </>
      }
      standfirst={
        <>
          Gần Tết là lại nghe “năm nay tuổi bạn phạm Thái Tuế”. Nhưng Thái Tuế đo bằng gì, tên ấy từ
          đâu ra, và trong bốn quan hệ mà sách vở hay kể thì công cụ trên web này thật sự tính được
          mấy cái? Bài này trả lời cả ba câu, và nói thẳng chỗ nào là quy ước chứ không phải phép đo.
        </>
      }
      readMeta="12 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Thái Tuế' },
      ]}
      relatedLenses={relatedLearnLenses('thai-tue')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb: `Trang Tử Vi ${TOOL_YEAR} cho biết tuổi bạn đang ở quan hệ nào với chi của năm — trùng, xung, hại hay bình hoà — kèm Tam Tai và bảng sao hạn theo từng năm sinh.`,
        href: '/tu-vi-2026',
        label: `Tra quan hệ tuổi với năm ${TOOL_YEAR}`,
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <ThaiTueFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Thái Tuế là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Lịch can chi ghép 10 Thiên Can với {CHI.length} Địa Chi thành vòng 60 năm. Phần{' '}
                <strong>địa chi</strong> của một năm chính là con giáp của năm đó, và người xưa gọi
                con giáp cầm cờ ấy là <strong>Thái Tuế</strong>. Năm {TOOL_YEAR} là{' '}
                {YEAR_CANCHI.name}, chi {YEAR_CHI} — nên Thái Tuế năm {TOOL_YEAR} là {YEAR_CHI}, con{' '}
                {YEAR_ANIMAL}.
              </p>
              <p>
                Tuổi bạn cũng có một chi: chi của năm sinh âm lịch. Toàn bộ những câu “phạm Thái Tuế”
                chỉ là <strong>đặt hai chi cạnh nhau rồi đọc quan hệ giữa chúng</strong>. Bốn quan hệ
                hay được nhắc là <strong>trùng</strong> (năm tuổi), <strong>xung</strong> (tuế phá),{' '}
                <strong>hình</strong> và <strong>hại</strong>.
              </p>
              <p>Cần chốt ngay bốn điều Thái Tuế KHÔNG phải:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải một ngôi sao đang chiếu xuống ai.</strong> Cái tên có gốc thiên
                  văn thật, nhưng thứ được tính ngày nay là một ô trong bảng lịch — phép tính chỉ cần
                  đúng một dữ kiện là năm.
                </li>
                <li>
                  <strong>Không phải một lực tác động.</strong> Đây là quy ước lịch pháp cộng phong
                  tục. Không có đại lượng nào ngoài đời tương ứng với “xung Thái Tuế”, nên cũng không
                  có gì để đo và không có gì để hoá giải.
                </li>
                <li>
                  <strong>Không phải thông tin riêng của bạn.</strong> Mọi người sinh cùng một năm âm
                  lịch đều có cùng quan hệ với Thái Tuế của mọi năm. Đây là lát cắt thô nhất trong
                  các phép tra, gom hàng triệu người vào chung một ô.
                </li>
                <li>
                  <strong>Năm tuổi không phải năm xui.</strong> Nó chỉ nghĩa là bạn vừa đi trọn một
                  vòng {CHI.length} con giáp. Mục{' '}
                  <Link href="#gioi-han" className={A}>giới hạn</Link> ở cuối bài nói kỹ chỗ này.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Hai phạm vi bài này cố ý không lấn: vì sao lục xung lại là hai chi đối đỉnh và tam
                hợp là tam giác đều thuộc bài{' '}
                <Link href="/learn/tam-hop-luc-xung" className={A}>Tam hợp – Lục xung</Link>; còn cách
                dùng Thái Tuế để chọn năm mở hàng thuộc bài{' '}
                <Link href="/learn/khai-truong" className={A}>Xem tuổi khai trương</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <ThaiTueDepth />,
        },
        {
          id: 'ten-goi-tu-dau',
          tocLabel: 'Tên gọi từ đâu',
          heading: 'Cái tên “Thái Tuế” đến từ đâu — phần nào là thiên văn, phần nào là quy ước',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Trước khi có lịch in, người ta cần một cái đồng hồ đủ chậm để đếm năm. Mộc tinh làm
                được việc đó: nó đi hết một vòng quanh Mặt Trời trong khoảng{' '}
                <strong>{JUPITER_LABEL} năm</strong>, tức mỗi năm nhích được xấp xỉ một phần{' '}
                {CHI.length} bầu trời. Người xưa gọi nó là <strong>Tuế Tinh</strong> — sao của năm —
                và dùng vị trí của nó để đặt tên cho từng năm.
              </p>
              <p>
                Vướng mắc nằm ở chiều đi: Mộc tinh di chuyển <strong>ngược chiều</strong> với chiều
                đếm {CHI.length} địa chi mà người xưa quen dùng, nên tra tới tra lui rất rối. Cách xử
                lý của họ là dựng ra một điểm tưởng tượng chạy <strong>ngược lại Mộc tinh</strong>,
                đi đúng {CHI.length} năm một vòng — và gọi điểm ấy là <strong>Thái Tuế</strong>, “cái
                tuế lớn”. Thái Tuế sinh ra để cho phép đếm gọn lại, không phải để mô tả một vật thể.
              </p>
              <p>Từ đó tách được rành mạch hai lớp:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Phần thiên văn:</strong> chu kỳ {JUPITER_LABEL} năm của Mộc tinh là
                  một số đo thật, kiểm được bằng quan sát và ngày nay bằng cơ học thiên thể.
                </li>
                <li>
                  <strong>Phần quy ước:</strong> việc làm tròn thành {CHI.length} năm chẵn, việc cho
                  Thái Tuế chạy ngược chiều Mộc tinh, và việc gán cho mỗi ô một con giáp — cả ba đều
                  là lựa chọn của con người để lịch dễ dùng.
                </li>
              </ul>
              <p>
                Chênh lệch giữa hai lớp đó đo được. Mỗi vòng {CHI.length} năm quy ước thì Mộc tinh
                thật đi hơi quá một chút, nên sau khoảng{' '}
                <strong>{DRIFT_ONE_BRANCH_YEARS} năm</strong> nó lệch trọn một chi so với Thái Tuế
                của lịch. Lịch can chi từ lâu không hiệu chỉnh theo vị trí thật của Mộc tinh nữa, nên
                hôm nay <strong>Thái Tuế là một ô lịch</strong>: cái tên còn giữ gốc thiên văn, nội
                dung thì không.
              </p>
              <p className="text-sm text-foreground/70">
                Đây là kiểu quan hệ rất hay gặp giữa thiên văn và huyền học phương Đông — bắt đầu từ
                một quan sát thật rồi đông cứng thành quy ước. Bài{' '}
                <Link href="/learn/thien-van" className={A}>Lịch thiên văn</Link> đi vào phần bầu trời
                thật, còn bài{' '}
                <Link href="/learn/can-chi" className={A}>Thiên can – Địa chi</Link> đi vào cấu tạo
                của vòng 60 năm.
              </p>
            </div>
          ),
        },
        {
          id: 'bon-quan-he',
          tocLabel: '4 quan hệ',
          heading: 'Bốn quan hệ quanh chữ Thái Tuế — và cái nào web này thật sự tính',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Sách vở dân gian gọi tên rất nhiều biến thể quanh chữ Thái Tuế, nhưng bốn cái sau là
                những cái bạn sẽ gặp thường xuyên nhất. Cột cuối là phần quan trọng nhất của bài:{' '}
                <strong>công cụ trên hieu.asia có tính hay không, và hiển thị dưới tên gì</strong>.
              </p>
              <Scroller minWidth="min-w-[760px]">
                <TableHead
                  cols={['Quan hệ', 'Còn gọi là', 'Đọc ra từ đâu', 'Công cụ hieu.asia', 'Ghi chú']}
                />
                <tbody>
                  {FOUR_RELATIONS.map((r) => (
                    <tr key={r.ten} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {r.ten}
                      </th>
                      <td className={TD}>{r.tenKhac}</td>
                      <td className={TD}>{r.cachDoc}</td>
                      <td className="px-4 py-2 text-foreground">
                        {r.toolLabel ? (
                          `Có — hiển thị là “${r.toolLabel}”`
                        ) : (
                          <strong>Không tính</strong>
                        )}
                      </td>
                      <td className={TD}>{r.ghiChu}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p className="text-sm text-foreground/70">
                Ba nhãn trong cột “Công cụ hieu.asia” không phải chữ do bài này nghĩ ra: chúng được
                đọc thẳng từ mã của trang{' '}
                <Link href="/tu-vi-2026" className={A}>Tử Vi {TOOL_YEAR}</Link>, nên nếu công cụ đổi
                cách gọi thì bảng trên đổi theo.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bảng tra: tuổi bạn gặp Thái Tuế vào những chi năm nào
              </h3>
              <p>
                Ba cột giữa trả lời câu “chi năm nào thì tôi rơi vào quan hệ đó”. Cột cuối là nguyên
                văn dòng mà công cụ hiển thị cho năm {TOOL_YEAR} ({YEAR_CANCHI.name}, chi {YEAR_CHI}
                ), để bạn đối chiếu ngay. Cột Hình cố ý vắng mặt vì không công cụ nào tính lớp đó.
              </p>
              <Scroller minWidth="min-w-[840px]">
                <TableHead
                  cols={[
                    'Chi tuổi',
                    'Trùng khi gặp năm',
                    'Xung khi gặp năm',
                    'Hại khi gặp năm',
                    `Công cụ ghi gì cho năm ${TOOL_YEAR} (${YEAR_CHI})`,
                  ]}
                />
                <tbody>
                  {LOOKUP_ROWS.map((row) => (
                    <tr key={row.chi} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {row.chi} <span className="text-muted-foreground">({row.animal})</span>
                      </th>
                      <td className={TD}>{row.trung}</td>
                      <td className={TD}>{row.xung}</td>
                      <td className={TD}>{row.hai ?? '—'}</td>
                      <td className="px-4 py-2 text-foreground">{row.thisYear}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p className="text-sm text-foreground/70">
                Đọc bảng theo hàng: người tuổi {CASE_XUNG?.canChi.chi} gặp năm chi{' '}
                {LUC_XUNG[CASE_XUNG?.canChi.chi ?? CHI[0]]} là xung Thái Tuế — mà{' '}
                {LUC_XUNG[CASE_XUNG?.canChi.chi ?? CHI[0]]} đúng là chi của năm {TOOL_YEAR}, nên cột
                cuối của hàng đó ghi “{CASE_XUNG?.thisYear}”. Vì các loại quan hệ trong bảng là
                những nhóm rời nhau nên{' '}
                <strong>trùng và xung không bao giờ rơi vào cùng một năm</strong> với cùng một người.
              </p>
              <p className="text-sm text-foreground/70">
                Vì sao lại là những cặp chi đó chứ không phải cặp khác — tam hợp là tam giác đều, lục
                xung là hai chi đối đỉnh, lục hại là một phép soi gương — thuộc bài{' '}
                <Link href="/learn/tam-hop-luc-xung" className={A}>Tam hợp – Lục xung</Link>. Còn lớp
                Tương Hình, thứ mà công cụ không tính, được nêu như kiến thức nền ở bài{' '}
                <Link href="/learn/hop-tuoi" className={A}>Hợp tuổi 12 con giáp</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-tuoi',
          tocLabel: '“Năm tuổi” là gì',
          heading: '“Năm tuổi”: một vòng 12 chi, không hơn',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                “Năm tuổi” là cách gọi dân gian của <strong>trùng Thái Tuế</strong>: chi của năm
                trùng đúng chi năm sinh của bạn. Vì vòng địa chi có {CHI.length} ô và chi của năm
                chạy hết vòng đó rồi lặp lại, nên năm tuổi đến{' '}
                <strong>đúng {CHI.length} năm một lần</strong> — tính theo tuổi mụ (năm đang xét trừ
                năm sinh rồi cộng 1, đúng cách mà mọi công cụ của hieu.asia dùng) thì rơi vào các mốc{' '}
                {CHI.length + 1}, {CHI.length * 2 + 1}, {CHI.length * 3 + 1}, {CHI.length * 4 + 1} và
                cứ thế. Lấy chênh lệch năm sinh thay vì tuổi mụ thì các mốc lùi đi một, thành{' '}
                {CHI.length}, {CHI.length * 2}, {CHI.length * 3} — cùng những năm ấy, chỉ khác cách
                gọi tuổi.
              </p>
              <p>Tra tay chỉ ba bước:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Lấy <strong>chi của năm sinh âm lịch</strong>. Nhớ mốc đổi là Tết, không phải ngày
                  1 tháng 1 — năm {YEAR_CANCHI.name} chạy từ {YEAR_RANGE}. Tra nhanh ở{' '}
                  <Link href="/tra-cuu-tuoi" className={A}>công cụ tra cứu tuổi</Link>.
                </li>
                <li>
                  Lấy <strong>chi của năm định xem</strong>. Cùng một bảng lịch, cùng một phép tra.
                </li>
                <li>
                  Đặt hai chi cạnh nhau. Trùng nhau là năm tuổi; đối nhau là xung Thái Tuế; rơi vào
                  một cặp lục hại thì công cụ ghi là Lục Hại; còn lại là không dính gì.
                </li>
              </ol>

              <h3 className="text-lg font-semibold text-foreground">Ba ví dụ tra tay</h3>
              <p>
                Chỉ cột <strong>năm sinh</strong> là dữ kiện đầu vào; mọi cột còn lại do trang này
                suy lại bằng đúng bảng can chi mà các công cụ đang dùng. Ba người này rơi vào ba
                trường hợp khác nhau trong cùng năm {TOOL_YEAR}.
              </p>
              <Scroller minWidth="min-w-[880px]">
                <TableHead
                  cols={[
                    'Năm sinh',
                    'Can chi năm sinh',
                    'Chi tuổi',
                    `Ba năm tuổi kể từ ${TOOL_YEAR}`,
                    'Năm xung kế tiếp',
                    `Công cụ ghi gì cho ${TOOL_YEAR}`,
                  ]}
                />
                <tbody>
                  {EXAMPLES.map((ex) => (
                    <tr key={ex.birthYear} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-2 tabular-nums font-medium text-foreground">
                        {ex.birthYear}
                      </td>
                      <td className={TD}>{ex.canChi.name}</td>
                      <td className={TD}>
                        {ex.canChi.chi} ({ex.canChi.animal})
                      </td>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">
                        {ex.namTuoi.join(', ')}
                      </td>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">
                        {ex.namXung[0]}
                      </td>
                      <td className="px-4 py-2 text-foreground">{ex.thisYear}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Sinh {CASE_TRUNG?.birthYear} ({CASE_TRUNG?.canChi.name}):</strong> chi tuổi
                  là {CASE_TRUNG?.canChi.chi}, trùng đúng chi của năm {TOOL_YEAR} — nên{' '}
                  {TOOL_YEAR} là <strong>năm tuổi</strong> của người này. Lần kế tiếp là{' '}
                  {CASE_TRUNG?.namTuoi[1]}.
                </li>
                <li>
                  <strong>Sinh {CASE_XUNG?.birthYear} ({CASE_XUNG?.canChi.name}):</strong> chi tuổi
                  là {CASE_XUNG?.canChi.chi}, đối với chi của năm {TOOL_YEAR} — nên đây là{' '}
                  <strong>năm xung Thái Tuế</strong>, còn năm tuổi của người này phải chờ tới{' '}
                  {CASE_XUNG?.namTuoi[0]}.
                </li>
                <li>
                  <strong>Sinh {CASE_BINH_HOA?.birthYear} ({CASE_BINH_HOA?.canChi.name}):</strong>{' '}
                  chi tuổi là {CASE_BINH_HOA?.canChi.chi}, không trùng cũng không đối chi của năm{' '}
                  {TOOL_YEAR} — công cụ ghi “{CASE_BINH_HOA?.thisYear}”. Đây mới là trường hợp phổ
                  biến nhất.
                </li>
              </ul>
              <p>
                Hai con số đáng nhớ, cả hai đều suy được chứ không phải học thuộc. Thứ nhất: vì lục
                xung là hai chi đối đỉnh, cách nhau {XUNG_STEPS ?? 0} bước trên vòng {CHI.length},
                nên <strong>năm tuổi và năm xung luôn cách nhau {XUNG_STEPS ?? 0} năm</strong> — nhìn
                cột 4 và cột 5 của bảng trên là thấy. Thứ hai: trong mỗi {CHI.length} năm, một người
                chỉ dính <strong>{HIT_YEARS} năm</strong> vào ba quan hệ được tính, còn lại{' '}
                <strong>{FREE_YEARS} năm</strong> là bình hoà hoặc thuộc nhóm hợp.
              </p>
              <p className="text-sm text-foreground/70">
                Nói cách khác, kể cả khi bạn xem trọng phong tục thì phần lớn thời gian vẫn là “không
                có gì để kiêng”. Đó là lý do không ai phải hoãn việc của mình vô thời hạn.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: đây là quy ước lịch pháp, không phải một lực tác động',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần này nói thẳng, vì đây là chủ đề bị dùng để doạ người nhiều nhất trong cả khu tra
                cứu. Thái Tuế là một <strong>quy ước lịch pháp cộng phong tục</strong>. Nó không đo
                được gì cả: không có đại lượng nào ngoài đời tương ứng với “xung Thái Tuế”, và không
                có phép kiểm nào cho thấy năm trùng chi khác các năm còn lại.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Năm tuổi không phải năm xui.</strong> Nó chỉ có nghĩa là bạn vừa đi trọn
                  một vòng {CHI.length} con giáp. Lý do nó vẫn được tin là vì nó{' '}
                  <strong>không thể sai</strong>: năm nào cũng có chuyện không như ý, người đang cảnh
                  giác thì nhớ kỹ hơn và nối vào cái nhãn, còn năm tuổi trôi qua êm thì không ai kể
                  lại. Bộ đếm chỉ chạy một chiều.
                </li>
                <li>
                  <strong>Đừng hoãn việc lớn chỉ vì trùng chi.</strong> Hoãn một năm là mất một năm
                  thật — tiền thuê, đà chuẩn bị, cơ hội — để đổi lấy sự an tâm về một ô lịch, và năm
                  sau lại có nhãn kiêng khác đang chờ. Nhờ người khác đứng tên cũng vậy: nó đổi cái
                  nhãn chứ không đổi vốn, thị trường hay năng lực vận hành.
                </li>
                <li>
                  <strong>Sách vở không thống nhất.</strong> Riêng quanh chữ Thái Tuế đã có nhiều
                  biến thể, và tên gọi các nhóm Hình còn khác nhau giữa các bản in. hieu.asia chọn
                  tính đúng những quan hệ đọc được rõ ràng từ vòng địa chi, và ghi rõ phần không tính
                  — thay vì trình bày đủ bốn cho “trọn bộ”.
                </li>
                <li>
                  <strong>Không có gì để “hoá giải”.</strong> Vì không có tác động nào được đo, nên
                  cũng không có dịch vụ nào cần mua. Thắp nén nhang đầu năm cho yên tâm là giá trị
                  văn hoá, hoàn toàn đáng giữ; chỉ nên cảnh giác khi nỗi lo về Thái Tuế được ai đó
                  dùng để bán hàng.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh: xem Thái Tuế như một{' '}
                <strong>nhãn lịch có màu sắc văn hoá</strong> — biết nó được tính từ đâu, biết nó
                không nói gì về việc sẽ xảy ra, và giữ tục lệ ở mức bạn thấy có ý nghĩa. Nó không
                thay được lời khuyên y tế, pháp lý hay tài chính: không dời lịch khám bệnh và không
                đổi quyết định tiền bạc vì một con giáp trùng nhau.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <ThaiTueWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <ThaiTueRecall />,
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
                Thái Tuế chỉ là một lớp trong hệ can chi. Muốn hiểu cái đứng dưới nó, đọc{' '}
                <Link href="/learn/can-chi" className={A}>bài Thiên can – Địa chi</Link> về vòng 60
                năm; muốn hiểu vì sao các cặp chi lại hợp hay xung như vậy, đọc{' '}
                <Link href="/learn/tam-hop-luc-xung" className={A}>bài Tam hợp – Lục xung</Link>. Một
                hạn khác thường bị gộp nhầm với Thái Tuế là Tam Tai, ba năm liền của mỗi nhóm tam
                hợp — bài{' '}
                <Link href="/learn/tam-tai" className={A}>Tam Tai</Link> nói riêng phần đó.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Muốn biết tuổi mình đứng ở đâu trong năm {TOOL_YEAR}?{' '}
                <Link href="/tu-vi-2026" className={A}>
                  Xem Tử Vi {TOOL_YEAR} theo con giáp →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/tu-vi-2026', label: `Tử Vi ${TOOL_YEAR} theo con giáp` },
                    { href: '/tra-cuu-tuoi', label: 'Tra cứu tuổi và can chi' },
                    { href: '/tam-tai', label: 'Tra Tam Tai theo tuổi' },
                    { href: '/khai-truong', label: 'Xem tuổi khai trương' },
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
          children: <ThaiTueChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
