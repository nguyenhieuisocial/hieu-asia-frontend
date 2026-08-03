/**
 * Bài học /learn/giao-van — "Giao vận: mốc chuyển giữa hai chặng đại vận".
 *
 * GROUNDING — KHÔNG gõ tay con số nào mà engine tính ra được. Mọi ví dụ (tuổi
 * khởi vận, bộ mốc, nhãn chặng, Thập Thần của chuỗi, chặng ứng với hai quy ước
 * tuổi) SUY TẠI RUNTIME bằng `calculateBazi()` của src/lib/bazi.ts. Bài còn đặt
 * vài `throw` ở tầng module: engine đổi mà ví dụ hỏng thì build gãy, không âm
 * thầm in số sai.
 *
 * NGUỒN (đều trong repo):
 *   • src/lib/bazi.ts — computeDaiVan(): startAge = Math.max(1, Math.round(số
 *     ngày từ sinh tới tiết kế nếu thuận / tiết trước nếu nghịch ÷ 3)); 9 trụ
 *     vận bước ±1 từ trụ THÁNG trên vòng can chi, mỗi trụ phủ 10 năm tuổi, chặng
 *     sau nối ngay chặng trước; tenGod = Thập Thần của can vận so với Nhật Chủ.
 *     CAN_ELEMENT xếp đúng thứ tự tương sinh, mỗi hành 2 can → bước ±1 chỉ cho
 *     "cùng hành" hoặc "lệch một bước tương sinh" (sweep 2304 cặp trụ liền kề,
 *     0 ngoại lệ). 9 trụ = 9 can liên tiếp bỏ chính can tháng → 9 Thập Thần khác
 *     nhau, thiếu đúng Thập Thần của trụ tháng (kiểm bằng sweep).
 *   • src/app/dai-van-hien-tai/form.tsx — tuổi = năm hiện tại trừ năm sinh.
 *   • src/components/time-flow/TimeFlowChecker.tsx (island của /timeline) —
 *     ageFromDate() TRỪ THÊM 1 nếu chưa qua sinh nhật; DecadalResult render CẢ
 *     CHUỖI đại vận với chặng hiện tại tô sáng, PDF ghi "đọc theo trình tự
 *     tuổi… khung tham khảo để soi nhịp dài hạn, không phải dự đoán may rủi".
 *   • src/app/timeline/page.tsx — đại vận = 10 năm, lưu niên = năm, lưu nguyệt
 *     = tháng; mốc tuổi thật phụ thuộc ngày giờ sinh.
 *
 * CÔNG CỤ KHÔNG TÍNH THÌ BÀI KHÔNG DẠY: không trang nào xuất ra NGÀY GIỜ giao
 * vận (engine chỉ cho mốc theo tuổi tròn), cũng không có tham số "vùng giao
 * vận" nào trong repo — bài nói thẳng thay vì bịa một cách bấm ngày.
 *
 * PHẠM VI: đại vận là gì / vì sao 10 năm / hai hệ lệch mốc → một câu + link
 * /learn/dai-van. Kiểm chứng một dự đoán là chủ đề riêng: chỉ nêu tên, KHÔNG
 * link vì trang đó chưa tồn tại.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import { calculateBazi, type DaiVanPillar } from '@/lib/bazi';
import {
  GiaoVanFrame,
  GiaoVanDepth,
  GiaoVanRecall,
  GiaoVanChecklist,
  GiaoVanWhys,
} from './_active-learning';

export const metadata: Metadata = {
  // ≤48 ký tự: root layout nối thêm " · hieu.asia" (12) và seo-guard chặn ở 60.
  title: 'Giao vận — mốc chuyển giữa hai chặng',
  // ≤160 ký tự: dài hơn thì Google cắt mất câu chốt.
  description:
    'Giao vận là mốc chuyển giữa hai chặng đại vận. Mốc đó ra từ một phép chia rồi làm tròn — nên hãy đọc xu hướng cả chuỗi, đừng đọc nó như một công tắc.',
  alternates: { canonical: 'https://hieu.asia/learn/giao-van' },
};

/**
 * Ngày tham chiếu CỐ ĐỊNH cho các ví dụ. Cố ý không lấy ngày hệ thống: ví dụ
 * trong bài học phải đọc lại sau vài tháng vẫn ra đúng con số đã in. Hai công cụ
 * thật thì ngược lại — chúng lấy `new Date()`.
 */
const REF = { year: 2026, month: 3, day: 15 } as const;
const REF_LABEL = `${String(REF.day).padStart(2, '0')}/${String(REF.month).padStart(2, '0')}/${REF.year}`;

interface Person {
  /** Nhãn ngày sinh hiển thị, vd "20/11/1990". */
  birthLabel: string;
  hourLabel: string;
  genderLabel: string;
  yearPillar: string;
  /** Trụ tháng — điểm khởi của chuỗi trụ vận. */
  monthPillar: string;
  /** Thập Thần của can trụ tháng so với Nhật Chủ. */
  monthTenGod: string;
  dayMaster: string;
  forward: boolean;
  startAge: number;
  pillars: DaiVanPillar[];
  /** Tuổi theo quy ước của /dai-van-hien-tai: năm tham chiếu trừ năm sinh. */
  ageYearOnly: number;
  /** Tuổi theo quy ước của /timeline: trừ thêm 1 nếu chưa qua sinh nhật. */
  ageBirthday: number;
}

function buildPerson(birthSolarDate: string, hour: number, gender: 'M' | 'F'): Person {
  const chart = calculateBazi({ birthSolarDate, birthHour: hour, gender });
  const dv = chart.daiVan;
  if (!dv) throw new Error('calculateBazi phải trả đại vận khi đã truyền gender');
  const [y, m, d] = birthSolarDate.split('-') as [string, string, string];
  const ageYearOnly = REF.year - Number(y);
  const passed = REF.month > Number(m) || (REF.month === Number(m) && REF.day >= Number(d));
  return {
    birthLabel: `${d}/${m}/${y}`,
    hourLabel: `${String(hour).padStart(2, '0')}:00`,
    genderLabel: gender === 'M' ? 'Nam' : 'Nữ',
    yearPillar: `${chart.year.can} ${chart.year.chi}`,
    monthPillar: `${chart.month.can} ${chart.month.chi}`,
    monthTenGod: chart.month.tenGod,
    dayMaster: chart.dayMaster.can,
    forward: dv.forward,
    startAge: dv.startAge,
    pillars: dv.pillars,
    ageYearOnly,
    ageBirthday: passed ? ageYearOnly : ageYearOnly - 1,
  };
}

/** Chặng chứa `age`. Ném ở tầng module nếu ví dụ của bài rơi ra ngoài mọi chặng. */
function pillarAt(p: Person, age: number): DaiVanPillar {
  const found = p.pillars.find((x) => age >= x.startAge && age <= x.endAge);
  if (!found) throw new Error(`Ví dụ của bài phải rơi vào một chặng — tuổi ${age} thì không`);
  return found;
}

/** `n` ngày dương lịch liên tiếp kể từ `start`, trả nhãn "dd/mm/yyyy". */
function dayWindow(start: string, n: number): { label: string; startAge: number }[] {
  const [y, m, d] = start.split('-').map(Number) as [number, number, number];
  return Array.from({ length: n }, (_, i) => {
    const t = new Date(Date.UTC(y, m - 1, d + i));
    const [yy, mm, dd] = [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()];
    const iso = `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
    return {
      label: `${String(dd).padStart(2, '0')}/${String(mm).padStart(2, '0')}/${yy}`,
      startAge: buildPerson(iso, 9, 'M').startAge,
    };
  });
}

// --- Ví dụ 1: hai ngày sinh LIỀN NHAU, cùng giờ, cùng giới → lệch cả bộ mốc.
const SHIFT_EARLY = buildPerson('1988-03-15', 9, 'M');
const SHIFT_LATE = buildPerson('1988-03-16', 9, 'M');
if (SHIFT_EARLY.startAge === SHIFT_LATE.startAge)
  throw new Error('Ví dụ 1 phải là cặp ngày liền nhau CÓ lệch tuổi khởi vận');

// Cửa sổ 7 ngày quanh cặp trên — để thấy mốc nhảy theo bậc, không trôi mượt.
const WINDOW = dayWindow('1988-03-13', 7);

/** Số ngày sinh liên tiếp cùng chung một tuổi khởi vận (dài nhất trong cửa sổ). */
const RUN_DAYS = WINDOW.reduce(
  (acc, w, i) => {
    const run = i > 0 && w.startAge === WINDOW[i - 1]!.startAge ? acc.run + 1 : 1;
    return { run, best: Math.max(acc.best, run) };
  },
  { run: 0, best: 0 },
).best;

// --- Ví dụ 2: cùng một người, cùng ngày tra, hai quy ước tuổi → hai chặng.
const MAIN = buildPerson('1990-11-20', 9, 'M');
const MAIN_YEARONLY = pillarAt(MAIN, MAIN.ageYearOnly);
const MAIN_BIRTHDAY = pillarAt(MAIN, MAIN.ageBirthday);
if (MAIN_YEARONLY.index === MAIN_BIRTHDAY.index)
  throw new Error('Ví dụ 2 phải là trường hợp hai quy ước tuổi cho HAI chặng khác nhau');

/** Độ dài một chặng, số chặng và tầm phủ — lấy từ dữ liệu engine thay vì gõ tay. */
const SPAN = MAIN.pillars[0]!.endAge - MAIN.pillars[0]!.startAge + 1;
const N_CHANG = MAIN.pillars.length;
const COVER_FROM = MAIN.pillars[0]!.startAge;
const COVER_TO = MAIN.pillars[N_CHANG - 1]!.endAge;
/** Số mốc chuyển trong một chuỗi: giữa chặng 1–2, 2–3… nên ít hơn số chặng 1. */
const N_MOC = N_CHANG - 1;

const TEN_GODS_IN_CHAIN = new Set(MAIN.pillars.map((p) => p.tenGod));
if (TEN_GODS_IN_CHAIN.has(MAIN.monthTenGod))
  throw new Error('Chuỗi đại vận phải thiếu đúng Thập Thần của trụ tháng');
const N_TEN_GOD = TEN_GODS_IN_CHAIN.size;

/** Bề rộng "vùng giao vận" khi người đọc tự nới mốc ra mỗi bên bao nhiêu năm. */
const widthOf = (each: number) => each * 2 + 1;
const pctOfSpan = (width: number) => Math.round((width / SPAN) * 100);
const NARROW = widthOf(1);
const WIDE = widthOf(2);

const label = (p: DaiVanPillar) => `${p.can} ${p.chi}`;
const rangeOf = (p: DaiVanPillar) => `${p.startAge}–${p.endAge} tuổi`;
const dirOf = (p: Person) => (p.forward ? 'thuận' : 'nghịch');
/** Các tuổi có mốc chuyển của một người (bỏ chặng đầu — nó là điểm khởi). */
const mocOf = (p: Person) => p.pillars.slice(1).map((x) => x.startAge).join(', ');

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ schema ===
// chữ hiển thị (chống cloaking). Câu hỏi cố ý KHÔNG trùng FAQ của
// /dai-van-hien-tai (tuổi khởi vận khác nhau vì sao; thuận nghịch dựa vào đâu;
// vận xấu có phải 10 năm đen; bản rút gọn khác lá số đầy đủ; không nhớ giờ
// sinh), không trùng /timeline (trang đó không có khối FAQ), và không trùng
// /learn/dai-van (hai hệ lệch mốc; đổi giới tính; chồng/hở; nhỏ hơn tuổi khởi
// vận; khoảng 2–6; sai giờ sinh; khác lưu niên; dùng vào việc gì; chọn hệ dễ chịu).
const FAQS = [
  {
    q: 'Giao vận có ngày giờ cụ thể không — công cụ trên hieu.asia có tính ra ngày đó không?',
    a: `Không. Engine Bát Tự của site chỉ cho mốc theo TUỔI TRÒN: chặng này hết ở một tuổi, chặng kế bắt đầu ở tuổi liền sau. Không có trường ngày giờ giao vận nào trong kết quả, và không phải vì khó tính — mà vì phép tính đã làm tròn ngay từ đầu: nó lấy số ngày từ lúc sinh tới mốc tiết khí gần nhất, chia ba, rồi lấy số nguyên. Phần lẻ bị bỏ và không có chỗ nào trả lại. Ai đưa bạn một ngày giờ giao vận chính xác tới phút thì con số đó đến từ một quy ước khác, không phải từ phép tính đang chạy ở đây.`,
  },
  {
    q: 'Vùng giao vận kéo dài bao lâu — một năm, hai năm hay ba năm?',
    a: `Không có con số nào trong công cụ trả lời được câu này, vì engine không định nghĩa "vùng" nào cả — nó chỉ có mốc. Con số bạn nghe được là do người đọc tự nới ra, và đây là chỗ cần tỉnh: nới mốc thêm một năm mỗi bên đã thành ${NARROW} năm trong mỗi ${SPAN} năm của chặng, tức khoảng ${pctOfSpan(NARROW)} phần trăm; nới hai năm mỗi bên thành ${WIDE} năm, tức khoảng ${pctOfSpan(WIDE)} phần trăm. Nới đủ rộng thì gần như mọi biến cố trong đời đều rơi vào trong vùng ấy — và một cái vùng hầu như không trật được thì cũng không nói được gì.`,
  },
  {
    q: 'Vì sao hai người sinh cách nhau đúng một ngày lại đổi chặng ở hai tuổi khác nhau?',
    a: `Vì tuổi khởi vận là số ngày tới mốc tiết khí chia ba rồi làm tròn, nên cứ khoảng ${RUN_DAYS} ngày sinh lệch là con số ấy đổi một đơn vị — và cả bộ mốc dịch theo nguyên một năm. Ví dụ chạy bằng engine của site: sinh ${SHIFT_EARLY.birthLabel} lúc ${SHIFT_EARLY.hourLabel} thì khởi vận ${SHIFT_EARLY.startAge} tuổi, còn sinh ${SHIFT_LATE.birthLabel} cùng giờ, cùng giới thì khởi vận ${SHIFT_LATE.startAge} tuổi. Nhãn ${N_CHANG} chặng của hai người giống hệt nhau, chỉ mọi mốc lệch một năm. Đó là dấu hiệu rõ nhất cho thấy mốc là kết quả của cách chia, không phải một thời điểm được đo.`,
  },
  {
    q: 'Cùng một người mà hai công cụ trên hieu.asia báo hai chặng khác nhau thì sai ở đâu?',
    a: `Không bên nào sai phép tính — hai bên dùng hai quy ước tuổi khác nhau. Trang đại vận hiện tại lấy năm hiện tại trừ năm sinh. Trang timeline thì trừ thêm một nếu bạn chưa qua sinh nhật trong năm. Trong quãng từ đầu năm dương lịch tới trước sinh nhật của bạn, hai cách này lệch nhau đúng một tuổi; qua sinh nhật rồi thì chúng trùng nhau; nếu tuổi của bạn lại đang nằm sát mốc chuyển thì hai công cụ chỉ vào hai chặng. Cách xử lý: xem con số tuổi mà công cụ đang dùng trước khi tin vào cái chặng nó trả về.`,
  },
  {
    q: 'Năm giao vận có nên tránh việc lớn không?',
    a: 'Không, và nói thẳng là cũng đừng làm ngược lại — đừng dồn việc lớn vào đúng năm chuyển để "mở vận". Cả hai đều là giao quyết định cho một con số tuổi ra từ phép chia. Ranh giới đó đã nhoè sẵn ít nhất một năm ngay trong cách tính, chưa kể mỗi hệ đặt mốc ở một chỗ. Việc lớn nên được quyết bằng thứ kiểm được: sức khoẻ thì đi khám, hợp đồng thì đọc kỹ, tiền thì tính dòng tiền. Mốc chuyển không có thẩm quyền với những việc đó.',
  },
  {
    q: 'Nhìn lại thấy đúng mốc giao vận là có biến — vậy chẳng phải đã kiểm chứng rồi sao?',
    a: `Chưa. Nhìn lại quá khứ thì gần như ai cũng thấy "đúng lúc giao vận có biến", vì ba lý do cộng lại: vùng được coi là giao vận rất rộng (nới hai năm mỗi bên đã phủ khoảng ${pctOfSpan(WIDE)} phần trăm số năm của chặng), bản thân mốc đã nhoè một năm vì làm tròn và vì hai quy ước tuổi, và chuỗi ${N_CHANG} chặng quét tới ${N_TEN_GOD} trong 10 nhãn của hệ nên gần như chuyện gì cũng tìm được nhãn khớp. Thêm nữa, ta chỉ nhớ những lần trùng và không đếm những mốc trôi qua trong yên ắng. Đó là cách bộ não gán nghĩa cho một dãy số, không phải bằng chứng.`,
  },
  {
    q: 'Chặng liền sau có phải luôn trái ngược với chặng đang ở không?',
    a: `Không. Mỗi chặng chỉ bước đúng một bước trên vòng can chi so với chặng liền trước, nên hai chặng cạnh nhau là cặp gần nhau nhất mà hệ này tạo ra được. Vì bảng ngũ hành của 10 thiên can xếp theo đúng thứ tự tương sinh và mỗi hành có hai can, hành của can vận giữa hai chặng liền nhau hoặc giữ nguyên, hoặc dịch đúng một bước trên vòng tương sinh — không nhảy sang hành khắc. Trong ví dụ chạy bằng engine ở bài, hai chặng hai bên mốc còn trùng cả hành can lẫn hành chi, chỉ khác âm dương của can.`,
  },
  {
    q: 'Đọc cả chuỗi thay vì soi một điểm thì cụ thể là làm gì?',
    a: `Ba việc, làm được bằng mắt trên chính bảng chuỗi. Một: đọc theo cụm hai chặng liền nhau thay vì từng chặng, vì can đi theo cặp nên đúng một nửa số cặp chặng liền nhau là chung hành can — nhìn cụm ${SPAN * 2} năm thay vì ${SPAN} năm. Hai: đọc chiều trượt của cả dãy, xem hành của can đang đi về phía nào, thay vì chấm điểm từng chặng. Ba: để ý cái mà chuỗi KHÔNG chứa — chuỗi ${N_CHANG} chặng quét ${N_TEN_GOD} trong 10 nhãn, thiếu đúng một, và điều này đúng với mọi lá số; nên sự có mặt của một nhãn gần như không phân biệt được ai với ai, thứ mang thông tin là nhãn đó rơi vào quãng tuổi nào.`,
  },
  {
    q: 'Vậy chuỗi đại vận còn dùng được vào việc gì?',
    a: 'Dùng để nhìn nhịp dài: trọng tâm của đời bạn đang trượt dần về phía nào qua vài chục năm, và giai đoạn sắp tới nghiêng về chủ đề gì so với giai đoạn vừa rồi. Đó là câu hỏi mà một dãy nối tiếp trả lời được. Câu hỏi mà nó không trả lời được là "đúng năm nào thì đổi" và "chuyện gì sẽ xảy ra" — hai câu này vượt quá thứ mà phép tính có trong tay, vốn chỉ gồm ngày sinh, giờ sinh và giới tính.',
  },
];

const JSONLD = [
  article({
    headline: 'Giao vận: mốc chuyển giữa hai chặng đại vận và cách đọc một dòng thời gian',
    description:
      'Giao vận là mốc chuyển giữa hai chặng đại vận. Bài này chỉ chỗ mốc đó nằm, vì sao nó nhoè sẵn ít nhất một năm, cách đọc xu hướng cả chuỗi thay vì soi một điểm, và vì sao nhìn lại quá khứ lúc nào cũng thấy trùng.',
    url: '/learn/giao-van',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Giao vận', url: '/learn/giao-van' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Giao vận — mốc chuyển giữa hai chặng',
    description:
      'Học mốc chuyển giữa hai chặng đại vận: mốc nằm ở đâu và tính thế nào, vì sao vùng giáp ranh khó đọc, cách đọc xu hướng của cả một dòng thời gian vận trình, và cạm bẫy hồi cứu khi nhìn lại quá khứ.',
    url: '/learn/giao-van',
  }),
];

const LINK = 'text-gold-700 underline-offset-4 hover:underline';
const TH = 'px-4 py-2.5 font-semibold text-foreground';
const TD = 'px-4 py-2 text-muted-foreground';

/** Hàng tiêu đề bảng — gom lại để hai bảng trong bài không lặp 15 dòng markup. */
const Thead = ({ cols }: { cols: readonly string[] }) => (
  <thead>
    <tr className="border-b border-border bg-card/60">
      {cols.map((c) => (
        <th key={c} scope="col" className={TH}>
          {c}
        </th>
      ))}
    </tr>
  </thead>
);

export default function LearnGiaoVanPage() {
  return (
    <LearnArticle
      eyebrow="LỚP THỜI GIAN · MỐC CHUYỂN"
      title={
        <>
          Giao vận{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (mốc chuyển giữa hai chặng)
          </span>
        </>
      }
      standfirst={
        <>
          Biết mình đang ở chặng nào là một chuyện. Chuyện khó hơn nằm ở chỗ hai chặng gặp
          nhau: người ta gom mọi thay đổi lớn trong đời về đúng cái mốc ấy. Bài này chỉ bạn mốc
          đó thật ra nằm ở đâu, vì sao nó đã nhoè sẵn trước khi ai kịp diễn giải, và cách đọc
          xu hướng của cả một dòng thời gian thay vì soi một điểm cắt.{' '}
          <Link href="/timeline" className={LINK}>
            Xem cả chuỗi đại vận trên timeline →
          </Link>
        </>
      }
      readMeta="12 phút đọc · Cập nhật 2026 · Ví dụ chạy bằng engine của site"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Giao vận' },
      ]}
      relatedLenses={relatedLearnLenses('giao-van')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập ngày giờ sinh và giới tính, công cụ dựng lá số rồi trải cả chuỗi đại vận theo trình tự tuổi — chặng hiện tại được tô sáng, để bạn nhìn xu hướng cả dãy chứ không chỉ một chặng.',
        href: '/timeline',
        label: 'Mở Timeline Đại Vận',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <GiaoVanFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Giao vận là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                <strong>Giao vận</strong> là <strong>mốc chuyển</strong> từ chặng đại vận này
                sang chặng kế tiếp — cái tên đặt cho chỗ hai chặng gặp nhau. Chưa nắm chặng{' '}
                {SPAN} năm là gì thì đọc bài{' '}
                <Link href="/learn/dai-van" className={LINK}>
                  Đại vận
                </Link>{' '}
                trước; bài này bắt đầu từ chỗ bộ chặng đã có sẵn. Trên bảng tính của site, mốc
                ấy là một <strong>con số tuổi</strong>: chặng đang diễn ra kết thúc ở một tuổi,
                chặng kế bắt đầu ở tuổi liền sau — chuỗi {N_CHANG} chặng thì có{' '}
                <strong>{N_MOC} mốc chuyển</strong>.
              </p>
              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Và đây là những gì giao vận KHÔNG phải
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải một ngày giờ.</strong> Không công cụ nào trên hieu.asia
                  xuất ra ngày giao vận, vì phép tính đã làm tròn về năm nguyên ngay từ bước
                  đầu. Công cụ không tính phần đó nên bài này không dạy cách bấm ngày.
                </li>
                <li>
                  <strong>Không phải một cái công tắc.</strong> Hai chặng cạnh nhau chỉ cách
                  nhau <em>một bước</em> trên vòng can chi — cặp gần nhau nhất mà hệ này tạo ra
                  được, chứ không phải hai thái cực.
                </li>
                <li>
                  <strong>Không phải nguyên nhân của biến cố.</strong> Mốc là chỗ đặt dao để
                  chia, không phải chỗ đời người gãy — mục bẫy hồi cứu bên dưới mổ riêng phần{' '}
                  <em>vì sao ta cứ thấy nó trùng</em>.
                </li>
                <li>
                  <strong>Không phải lớp vận từng năm.</strong> Lớp từng năm gọi là{' '}
                  <em>lưu niên</em>, dưới nữa là <em>lưu nguyệt</em> theo tháng. Chúng nằm bên
                  trong một chặng, không phải chỗ nối giữa hai chặng.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Ba việc bài này sẽ dạy bạn làm được: chỉ ra mốc chuyển nằm ở đâu và vì sao nó ở
                đó, đọc xu hướng của cả một chuỗi thay vì chấm điểm từng chặng, và nhận ra bẫy
                hồi cứu khi nhìn lại quá khứ.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <GiaoVanDepth />,
        },
        {
          id: 'moc-chuyen',
          tocLabel: 'Mốc chuyển ở đâu',
          heading: 'Mốc chuyển nằm ở đâu và tính thế nào',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Cả chuỗi neo vào <strong>một con số duy nhất</strong>: tuổi khởi vận. Có nó là
                có hết, vì mỗi chặng phủ đúng {SPAN} năm và nối ngay chặng trước. Bên Bát Tự,
                con số ấy tính bằng ba bước — và ba bước này là toàn bộ câu chuyện:
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Đếm số ngày</strong> từ lúc sinh tới mốc{' '}
                  <Link href="/learn/tiet-khi" className={LINK}>
                    tiết khí
                  </Link>{' '}
                  gần nhất — tiết kế nếu vận đi thuận, tiết trước nếu đi nghịch.
                </li>
                <li>
                  <strong>Chia cho ba.</strong> Đây là quy ước của hệ: ba ngày ứng với một năm
                  vận.
                </li>
                <li>
                  <strong>Làm tròn</strong> thành một số tuổi nguyên. Toàn bộ phần lẻ bị bỏ ở
                  đây và không có chỗ nào trả nó lại — nên mốc chuyển{' '}
                  <strong>không thể</strong> sắc nét hơn một năm, ngay cả về mặt số học.
                </li>
              </ol>
              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Ví dụ 1 — sinh lệch một ngày, cả bộ mốc dịch một năm
              </h3>
              <p>
                Hai lá số dưới đây do engine Bát Tự của chính site tính, cho hai ngày sinh{' '}
                <strong>liền nhau</strong>, cùng giờ <strong>{SHIFT_EARLY.hourLabel}</strong>,
                cùng giới <strong>{SHIFT_EARLY.genderLabel.toLowerCase()}</strong>, cùng trụ
                năm {SHIFT_EARLY.yearPillar} và cùng trụ tháng {SHIFT_EARLY.monthPillar}, cùng
                đi {dirOf(SHIFT_EARLY)}:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Sinh <strong>{SHIFT_EARLY.birthLabel}</strong> — khởi vận{' '}
                  <strong>{SHIFT_EARLY.startAge} tuổi</strong>, {N_MOC} mốc chuyển rơi vào tuổi{' '}
                  {mocOf(SHIFT_EARLY)}.
                </li>
                <li>
                  Sinh <strong>{SHIFT_LATE.birthLabel}</strong> — khởi vận{' '}
                  <strong>{SHIFT_LATE.startAge} tuổi</strong>, {N_MOC} mốc chuyển rơi vào tuổi{' '}
                  {mocOf(SHIFT_LATE)}.
                </li>
              </ul>
              <p>
                <strong>Nhãn can chi</strong> của {N_CHANG} chặng thì{' '}
                <strong>giống hệt nhau</strong> ở cả hai người:{' '}
                {SHIFT_EARLY.pillars.map(label).join(' · ')}. Chỉ mọi mốc lệch đi một năm — tức là
                cùng một bộ nhãn nhưng <em>chỗ đặt dao</em> khác.
              </p>
              <p className="text-sm text-foreground/70">
                Nói cho hết: lệch một ngày sinh thì <strong>trụ Ngày cũng đổi</strong>, kéo theo Nhật
                Chủ đổi từ {SHIFT_EARLY.dayMaster} sang {SHIFT_LATE.dayMaster} — nên Thập Thần của
                từng chặng đổi hết, dù nhãn can chi giữ nguyên. Ví dụ này chỉ dùng để nói về{' '}
                <strong>vị trí các mốc</strong>, không phải để nói nội dung luận không đổi. Muốn thấy
                riêng hiệu ứng dịch mốc mà giữ nguyên mọi thứ khác thì so hai người sinh{' '}
                <strong>cùng ngày, lệch giờ</strong> — trường hợp đó trụ Ngày mới đứng yên.
              </p>
              <p>Nhìn cả cửa sổ {WINDOW.length} ngày liên tiếp thì thấy rõ mốc nhảy theo bậc:</p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <Thead cols={['Ngày sinh', 'Tuổi khởi vận', 'Mốc chuyển đầu tiên']} />
                  <tbody>
                    {WINDOW.map((w) => (
                      <tr key={w.label} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-foreground">{w.label}</td>
                        <td className={TD}>{w.startAge} tuổi</td>
                        <td className={TD}>{w.startAge + SPAN} tuổi</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Cứ khoảng <strong>{RUN_DAYS} ngày</strong> sinh liên tiếp thì chung một tuổi
                khởi vận, rồi nhảy sang bậc kế — phép chia cho ba và một lần làm tròn, nhìn từ
                ngoài vào.
              </p>
              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Ví dụ 2 — cùng một người, hai quy ước tuổi, hai chặng
              </h3>
              <p>
                Mốc là một con số tuổi, nên nó chỉ sắc nét khi <em>tuổi</em> sắc nét. Mà tuổi
                thì có hai cách tính, và hai công cụ trên chính hieu.asia đang dùng hai cách
                khác nhau: trang{' '}
                <Link href="/dai-van-hien-tai" className={LINK}>
                  đại vận hiện tại
                </Link>{' '}
                lấy năm hiện tại trừ năm sinh; còn công cụ trên{' '}
                <Link href="/timeline" className={LINK}>
                  timeline
                </Link>{' '}
                trừ thêm một nếu bạn chưa qua sinh nhật trong năm.
              </p>
              <p>
                Lấy một người sinh <strong>{MAIN.birthLabel}</strong> lúc{' '}
                <strong>{MAIN.hourLabel}</strong>, {MAIN.genderLabel.toLowerCase()} (trụ năm{' '}
                {MAIN.yearPillar}, trụ tháng {MAIN.monthPillar}, Nhật Chủ {MAIN.dayMaster}, đi{' '}
                {dirOf(MAIN)}, khởi vận {MAIN.startAge} tuổi) và tra vào ngày tham chiếu{' '}
                <strong>{REF_LABEL}</strong>:
              </p>
              <p className="text-sm text-foreground/70">
                Một lưu ý để khỏi hiểu nhầm: hai công cụ nói trên chạy chuỗi đại vận của{' '}
                <strong>Tử Vi</strong>, còn ví dụ dưới đây minh hoạ bằng chuỗi <strong>Bát Tự</strong>{' '}
                cho gọn — hai hệ có hai bộ mốc riêng. Thứ đang được minh hoạ không phải cặp trụ vận cụ
                thể, mà là <strong>cơ chế lệch một tuổi</strong>: cơ chế ấy y hệt nhau ở cả hai hệ, vì
                nó nằm ở khâu quy đổi tuổi chứ không nằm ở khâu chia chặng.
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Cách <strong>năm trừ năm</strong> cho tuổi{' '}
                  <strong>{MAIN.ageYearOnly}</strong> → rơi vào chặng thứ{' '}
                  {MAIN_YEARONLY.index}, {rangeOf(MAIN_YEARONLY)}, trụ vận{' '}
                  <strong>{label(MAIN_YEARONLY)}</strong> ({MAIN_YEARONLY.tenGod}).
                </li>
                <li>
                  Cách <strong>đã qua sinh nhật chưa</strong> cho tuổi{' '}
                  <strong>{MAIN.ageBirthday}</strong> → rơi vào chặng thứ{' '}
                  {MAIN_BIRTHDAY.index}, {rangeOf(MAIN_BIRTHDAY)}, trụ vận{' '}
                  <strong>{label(MAIN_BIRTHDAY)}</strong> ({MAIN_BIRTHDAY.tenGod}).
                </li>
              </ul>
              <p>
                Cùng một người, cùng một ngày tra, hai con số tuổi đều hợp lệ —{' '}
                <strong>hai chặng khác nhau</strong>. Đây không phải lỗi của công cụ nào; đây là
                bằng chứng rằng ranh giới đã <strong>nhoè sẵn một năm</strong> trước khi có ai
                diễn giải rộng thêm.
              </p>
              <p>
                Và nếu bạn nghĩ hai chặng hai bên mốc phải rất khác nhau thì nhìn kỹ cặp này:{' '}
                {label(MAIN_BIRTHDAY)} (can hành {MAIN_BIRTHDAY.canElement}, chi hành{' '}
                {MAIN_BIRTHDAY.chiElement}) rồi {label(MAIN_YEARONLY)} (can hành{' '}
                {MAIN_YEARONLY.canElement}, chi hành {MAIN_YEARONLY.chiElement}) — trùng cả hành
                can lẫn hành chi, chỉ khác âm dương của can.{' '}
                <strong>Cái mốc mà người ta sợ đang chia đôi hai chặng giống nhau nhất</strong>{' '}
                trong cả chuỗi này.
              </p>
              <p className="text-sm text-foreground/70">
                Mọi con số ở hai ví dụ là output của <code>calculateBazi()</code> trong{' '}
                <code>lib/bazi.ts</code>, tính lại mỗi lần trang được dựng. Bên Tử Vi, tuổi khởi
                vận đến từ Cục chứ không từ phép chia này, nên bộ mốc là một bộ khác — xem bài{' '}
                <Link href="/learn/dai-van" className={LINK}>
                  Đại vận
                </Link>
                ; nó chỉ làm ranh giới nhoè thêm chứ không rõ hơn.
              </p>
            </div>
          ),
        },
        {
          id: 'doc-ca-chuoi',
          tocLabel: 'Đọc cả chuỗi',
          heading: 'Đọc một dòng thời gian: nhìn cả dãy thay vì soi một điểm',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Nếu mốc chuyển đã nhoè thì thứ gì trong chuỗi còn đọc được? Câu trả lời:{' '}
                <strong>thứ tự và chiều trượt</strong>. Dưới đây là trọn {N_CHANG} chặng của
                người ở ví dụ 2, do engine dựng — phủ từ {COVER_FROM} tới {COVER_TO} tuổi.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <Thead cols={['Chặng', 'Tuổi', 'Trụ vận', 'Hành can · hành chi', 'Thập Thần']} />
                  <tbody>
                    {MAIN.pillars.map((p) => (
                      <tr key={p.index} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-foreground">{p.index}</td>
                        <td className={TD}>{rangeOf(p)}</td>
                        <td className={TD}>{label(p)}</td>
                        <td className={TD}>
                          {p.canElement} · {p.chiElement}
                        </td>
                        <td className={TD}>{p.tenGod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>Có ba cách đọc dãy này mà soi từng chặng không cho được:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Đọc theo cụm hai chặng.</strong> Mười thiên can đi theo cặp — hai can
                  liền nhau chung một hành — nên đúng một nửa số cặp chặng liền nhau trong chuỗi
                  là <em>chung hành can</em>. Nhìn cụm {SPAN * 2} năm thay vì {SPAN} năm thì mốc
                  nằm giữa một cụm như thế tự nhiên mất hết vẻ quan trọng.
                </li>
                <li>
                  <strong>Đọc chiều trượt.</strong> Bảng ngũ hành của 10 can xếp đúng theo thứ
                  tự tương sinh, nên bước một bước chỉ cho ra hai khả năng: giữ nguyên hành,
                  hoặc dịch <em>đúng một bước</em> trên vòng tương sinh. Không bao giờ nhảy sang
                  hành khắc. Chuỗi vì thế là một đường trượt đều, không phải chuỗi cú sốc — cứ
                  đọc cột hành can trong bảng trên từ trên xuống là thấy.
                </li>
                <li>
                  <strong>Đọc cái mà chuỗi không chứa.</strong> {N_CHANG} chặng quét qua{' '}
                  <strong>{N_TEN_GOD} trong 10</strong> Thập Thần, thiếu đúng một cái — ở lá số
                  này là {MAIN.monthTenGod}, tức cái ứng với trụ tháng. Điều này đúng với{' '}
                  <em>mọi</em> lá số, vì {N_CHANG} trụ vận là {N_CHANG} thiên can liên tiếp bỏ
                  chính can tháng.
                </li>
              </ol>
              <p>
                Ý thứ ba đáng dừng lại lâu hơn hai ý kia: nó nói rằng{' '}
                <strong>sự có mặt của một cái nhãn gần như không phân biệt được ai với ai</strong>{' '}
                — gần như ai cũng có gần hết bộ nhãn ở đâu đó trong chuỗi của mình. Thứ mang
                thông tin là <strong>nhãn nào rơi vào quãng tuổi nào</strong>. Vì vậy câu hỏi
                “chặng này tốt hay xấu” hỏi sai chỗ; câu hỏi đúng là{' '}
                <strong>trọng tâm đang trượt về đâu</strong>.
              </p>
              <p className="text-sm text-foreground/70">
                Công cụ{' '}
                <Link href="/timeline" className={LINK}>
                  timeline
                </Link>{' '}
                trải cả chuỗi theo trình tự tuổi và tô sáng chặng hiện tại — đúng kiểu đọc này.
                Nó dựng chuỗi theo lá số Tử Vi (các cung), bảng trên là chuỗi Bát Tự (các cặp
                Can-Chi): hai chuỗi khác nhau, cách đọc giống nhau — theo dãy, không theo điểm.
              </p>
            </div>
          ),
        },
        {
          id: 'bay-hoi-cuu',
          tocLabel: 'Bẫy hồi cứu',
          heading: 'Vì sao nhìn lại lúc nào cũng thấy “đúng lúc giao vận có biến”',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Đây là trải nghiệm gần như ai cũng có: mở lại bộ mốc của mình, rà qua quá khứ,
                thấy các biến cố lớn nằm sát những mốc chuyển. Nói thẳng ngay từ đầu:{' '}
                <strong>đó không phải bằng chứng</strong> — đó là kết quả gần như chắc chắn của
                bốn thứ cộng lại.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Cửa sổ quá rộng.</strong> Mốc là một con số tuổi trơ trọi, nên người
                  đọc tự cho nó vùng đệm. Nới một năm mỗi bên đã thành {NARROW} năm trong mỗi{' '}
                  {SPAN} năm của chặng, tức khoảng <strong>{pctOfSpan(NARROW)}%</strong>. Nới
                  hai năm mỗi bên thành {WIDE} năm, tức khoảng{' '}
                  <strong>{pctOfSpan(WIDE)}%</strong> — một nửa số năm trong mỗi chặng đã được
                  xếp vào loại “gần mốc”.
                </li>
                <li>
                  <strong>Bản thân mốc đã nhoè.</strong> Làm tròn trong phép tính cộng với hai
                  quy ước tuổi khác nhau, như hai ví dụ ở trên, đủ để “đúng năm” xê dịch mà
                  không ai thấy sai.
                </li>
                <li>
                  <strong>Bộ nhãn gần như đầy đủ.</strong> Chuỗi quét {N_TEN_GOD} trong 10 nhãn
                  của hệ, nên gần như chuyện gì đã xảy ra cũng tìm được một nhãn nghe hợp. Một
                  lời giải thích hầu như không trật được cũng là một lời giải thích không nói
                  được gì.
                </li>
                <li>
                  <strong>Đời ai cũng có biến cố rải đều.</strong> Đổi việc, chuyển nhà, chia
                  tay, người thân ốm, một cú tài chính — cộng lại thì trong bất kỳ quãng vài
                  năm nào cũng có ít nhất một chuyện đáng kể để gắn vào mốc.
                </li>
              </ul>
              <p>
                Cộng bốn thứ đó lại, việc <em>không</em> tìm thấy trùng khớp mới là chuyện khó.
                Còn một lớp nữa nằm ở phía người đọc: ta{' '}
                <strong>chỉ đếm những lần trúng</strong> — không ai lập bảng những mốc đã trôi
                qua trong yên ắng, cũng không ai đếm những biến cố lớn rơi vào giữa chặng, nơi
                lẽ ra phải yên. Bỏ hai cột đó ra khỏi bảng thì tỷ lệ trúng nào cũng đẹp.
              </p>
              <p>
                Nói vậy không phải để phủ nhận trải nghiệm của bạn: những biến cố ấy có thật và
                quan trọng thật. Cái không đứng vững là bước suy luận nối chúng với một con số
                tuổi. Đây là <strong>cách bộ não gán nghĩa cho một dãy số</strong> — nó tìm mẫu
                hình rất giỏi, kể cả khi dãy số không chứa mẫu hình nào.
              </p>
              <p className="text-sm text-foreground/70">
                Muốn biến cảm giác trùng khớp thành thứ kiểm được thì phải đổi luật chơi: nói{' '}
                <em>trước</em>, nói cụ thể tới mức có thể sai, và đếm cả lần trật. Đó là một chủ
                đề riêng — kiểm chứng một dự đoán — bài này không dạy, chỉ nêu tên để bạn biết
                nó tồn tại.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: ranh giới là quy ước chia, không phải công tắc',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>Phần này quan trọng ngang phần cách tính, nên nói thẳng.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Mốc là vết dao, không phải vạch có sẵn.</strong> Ba dấu hiệu kiểm
                  được, cả ba đều có trong bài: phép tính làm tròn về năm nguyên; sinh lệch vài
                  ngày là cả bộ mốc dịch một năm trong khi nhãn chặng không đổi; và hai công cụ
                  của cùng một site cho hai chặng khác nhau vì hai quy ước tuổi.
                </li>
                <li>
                  <strong>Hai bên mốc không phải hai thái cực.</strong> Mỗi chặng chỉ bước một
                  bước trên vòng can chi. Trong ví dụ ở bài, hai chặng hai bên mốc còn trùng cả
                  hành can lẫn hành chi. Một ranh giới chia đôi hai thứ giống nhau thì không thể
                  là chỗ đổi đời.
                </li>
                <li>
                  <strong>Đừng dồn quyết định lớn vào một mốc — và cũng đừng né nó.</strong> Nói
                  thẳng vì cả hai đều tốn kém: hoãn cưới, hoãn đổi việc, hoãn mở quán, tệ nhất
                  là hoãn đi khám để chờ qua mốc; hoặc ngược lại, ép mọi việc lớn vào đúng năm
                  chuyển để “mở vận”. Cả hai đều là giao quyết định cho một con số ra từ phép
                  chia. Có triệu chứng thì đi bác sĩ. Có hợp đồng thì đọc kỹ và hỏi luật sư.
                </li>
                <li>
                  <strong>Không có “ngày giao vận” để mà chọn.</strong> Engine không xuất ra
                  ngày giờ nào, cũng không đánh dấu vùng nào là vùng giao vận. Ai đưa bạn một
                  ngày giờ chính xác tới phút thì con số đó không đến từ phép tính này.
                </li>
                <li>
                  <strong>Đầu vào rất thô.</strong> Cả bộ mốc dựng từ đúng ba dữ kiện: ngày
                  sinh, giờ sinh, giới tính. Hai người sinh cùng lúc, cùng giới nhận bộ mốc y
                  hệt nhau — dù hoàn cảnh và lựa chọn của họ khác nhau hoàn toàn. Và sai giờ
                  sinh là lệch mốc, vì giờ sinh đổi chính cái khoảng cách được chia cho ba: chỉ
                  nhớ áng chừng thì hãy coi bộ mốc đọc ra là <em>một khả năng</em>.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh gói trong một câu: chuỗi đại vận hợp để{' '}
                <strong>nhìn nhịp dài</strong> — trọng tâm đang trượt về đâu qua vài chục năm —
                chứ không hợp để chọn năm, và càng không hợp để trì hoãn.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <GiaoVanWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <GiaoVanRecall />,
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
                Muốn nhìn cả dãy chặng của chính mình thay vì đoán quanh một mốc?{' '}
                <Link href="/timeline" className={LINK}>
                  Trải chuỗi đại vận miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/timeline', label: 'Timeline đại vận' },
                    { href: '/dai-van-hien-tai', label: 'Đại vận hiện tại' },
                    { href: '/bat-tu', label: 'Bát Tự Tứ Trụ' },
                    { href: '/la-so-tu-vi', label: 'Lá số Tử Vi' },
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
          children: <GiaoVanChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
