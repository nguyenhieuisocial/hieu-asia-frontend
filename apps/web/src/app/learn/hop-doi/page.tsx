/**
 * Bài học /learn/hop-doi — bài CHÍNH THỨC về ĐIỂM HỢP ĐÔI của công cụ
 * /compatibility ("So sánh 2 người").
 *
 * GROUNDING — đọc code, không đoán:
 *   • app/compatibility/page.tsx — form (tên, ngày sinh, GIỜ SINH, giới tính) →
 *     POST {API}/tools/compatibility-pair → overallScore trong vòng tròn "x/10",
 *     khối "5 chiều cộng hưởng" (dimension / score / signal / note), khối "Gợi ý
 *     giao tiếp" (vulnerability / reframe / suggestedPhrase), footer `caveats`.
 *   • PHÉP CHẤM KHÔNG NẰM TRONG REPO NÀY — nó ở worker backend, file
 *     backend/infra/cloudflare/workers/api-gateway/src/tools/compatibility-pair.ts
 *     → buildCompatibilityPair(): thuần tất định, KHÔNG gọi LLM. Khác repo nên
 *     KHÔNG import được; khối "MIRROR ENGINE" bên dưới chép ĐÚNG bảng và công
 *     thức của file ấy, và MỌI con số trên trang đều CHẠY LẠI từ khối đó.
 *     ⚠️ Sửa công thức ở worker thì phải sửa mirror ở đây VÀ ở _active-learning.
 *   • lib/xem-tuoi-cuoi.ts — CHI + canChiOfYear(): mốc (year − 4) % 12 trùng
 *     khít zodiacOfYear() của worker, nên dùng luôn thay vì chép bảng thứ hai.
 *
 * CÔNG CỤ THẬT SỰ TÍNH GÌ: CÓ — con giáp theo NĂM sinh; quan hệ ngũ hành giữa
 * hai địa chi; tam hợp, lục xung, trùng chi; khác giới tính hay không (+1 đúng
 * một trục); mã băm hai chuỗi ngày sinh (trục "Mục tiêu"). KHÔNG — giờ sinh
 * (form có ô nhập, phép chấm không đụng tới); lá số Tử Vi; tứ trụ; cung mệnh;
 * cung phi; lục hợp; lục hại; tương hình; nạp âm; mốc Tết âm lịch (chi lấy theo
 * NĂM DƯƠNG LỊCH). Trang nói thẳng từng khoản không tính.
 *
 * PHẠM VI: vì sao hai chi tam hợp hay lục xung thuộc /learn/tam-hop-luc-xung và
 * /learn/hop-tuoi — ở đây một câu + link. Nhóm 3 người trở lên thuộc bài
 * /learn/dong-nhom (bài ấy nay đã xuất bản → LINK thật, không nhắc suông).
 * Giọng: trung thực về giới hạn, không doạ — điểm cao không bảo chứng quan hệ
 * tốt, điểm thấp không phải lý do chia tay.
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
import { CHI, canChiOfYear, type Chi } from '@/lib/xem-tuoi-cuoi';
import {
  HopDoiFrame,
  HopDoiDepth,
  HopDoiRecall,
  HopDoiChecklist,
  HopDoiWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Điểm hợp đôi nói gì — và không nói gì',
  description:
    'Công cụ hợp đôi chấm 5 trục từ con giáp năm sinh của hai người. Điểm chỉ đo mức giống hoặc bổ trợ trên vài trục hẹp, không đo cách hai người xử lý xung đột.',
  alternates: { canonical: 'https://hieu.asia/learn/hop-doi' },
};

// ── MIRROR ENGINE — chép đúng backend tools/compatibility-pair.ts ────────────
type Hanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
type HanhRel = 'same' | 'generative' | 'controlling' | 'neutral';

const HANH_BY_CHI: Record<Chi, Hanh> = {
  'Tý': 'Thủy', 'Hợi': 'Thủy', 'Dần': 'Mộc', 'Mão': 'Mộc', 'Tỵ': 'Hỏa', 'Ngọ': 'Hỏa',
  'Thân': 'Kim', 'Dậu': 'Kim', 'Thìn': 'Thổ', 'Tuất': 'Thổ', 'Sửu': 'Thổ', 'Mùi': 'Thổ',
};
const SINH: Record<Hanh, Hanh> = { 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim', 'Kim': 'Thủy', 'Thủy': 'Mộc' };
const KHAC: Record<Hanh, Hanh> = { 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim', 'Kim': 'Mộc' };
const TAM_HOP: readonly (readonly Chi[])[] = [
  ['Thân', 'Tý', 'Thìn'], ['Dần', 'Ngọ', 'Tuất'], ['Hợi', 'Mão', 'Mùi'], ['Tỵ', 'Dậu', 'Sửu'],
];
const LUC_XUNG: readonly (readonly [Chi, Chi])[] = [
  ['Tý', 'Ngọ'], ['Sửu', 'Mùi'], ['Dần', 'Thân'], ['Mão', 'Dậu'], ['Thìn', 'Tuất'], ['Tỵ', 'Hợi'],
];

/** Điểm gốc + toàn bộ mức cộng trừ — một nguồn cho mọi con số của trang. */
const BASE = 6;
const D_TINH_CACH: Record<HanhRel, number> = { same: 3, generative: 3, neutral: 1, controlling: -2 };
const D_TAI_CHINH: Record<HanhRel, number> = { generative: 3, same: 2, neutral: 1, controlling: -2 };
const D_TAM_HOP_GT = 3;
const D_LUC_XUNG_GT = -3;
const D_KHAC_GIOI = 1;
const D_TAM_HOP_GD = 2;
const D_TRUNG_CHI_GD = 1;
const D_LUC_XUNG_GD = -3;
const SEED_MOD = 6;
const SEED_OFFSET = 2;
/** Ngưỡng đổi nhãn tín hiệu mà công cụ in kèm mỗi trục. */
const SIGNAL_THUAN_FROM = 8;
const SIGNAL_CHU_Y_UPTO = 3;

function hanhRelation(a: Chi, b: Chi): HanhRel {
  const ea = HANH_BY_CHI[a];
  const eb = HANH_BY_CHI[b];
  if (ea === eb) return 'same';
  if (SINH[ea] === eb || SINH[eb] === ea) return 'generative';
  if (KHAC[ea] === eb || KHAC[eb] === ea) return 'controlling';
  return 'neutral';
}
const isTamHop = (a: Chi, b: Chi) => TAM_HOP.some((g) => g.includes(a) && g.includes(b) && a !== b);
const isLucXung = (a: Chi, b: Chi) =>
  LUC_XUNG.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
const clamp = (n: number) => Math.max(1, Math.min(10, Math.round(n)));
const signalOf = (s: number) =>
  s >= SIGNAL_THUAN_FROM ? 'thuận' : s <= SIGNAL_CHU_Y_UPTO ? 'cần chú ý' : 'trung tính';

/** Mã băm tất định của chuỗi ngày sinh — chạy riêng trục "Mục tiêu". */
function dateSeed(d: string): number {
  let sum = 0;
  for (let i = 0; i < d.length; i += 1) sum = (sum + d.charCodeAt(i) * (i + 1)) % 997;
  return sum;
}

/** Đúng bốn dữ kiện chạy vào điểm, không hơn. */
interface Features {
  rel: HanhRel; tamHop: boolean; lucXung: boolean;
  sameChi: boolean; diffGender: boolean; seed: number;
}

const AXES = ['Tính cách', 'Giao tiếp', 'Mục tiêu', 'Tài chính', 'Gia đình'] as const;
function scoreAxes(f: Features): number[] {
  const gt = (f.tamHop ? D_TAM_HOP_GT : f.lucXung ? D_LUC_XUNG_GT : 0) + (f.diffGender ? D_KHAC_GIOI : 0);
  const gd =
    (f.tamHop ? D_TAM_HOP_GD : 0) + (f.sameChi ? D_TRUNG_CHI_GD : 0) + (f.lucXung ? D_LUC_XUNG_GD : 0);
  return [
    BASE + D_TINH_CACH[f.rel], BASE + gt, BASE + (f.seed - SEED_OFFSET),
    BASE + D_TAI_CHINH[f.rel], BASE + gd,
  ].map(clamp);
}
const meanOf = (s: number[]) => s.reduce((x, n) => x + n, 0) / s.length;
const overallOf = (s: number[]) => clamp(meanOf(s));
interface Person { birthDate: string; gender: 'male' | 'female' }
interface PairResult extends Features {
  chiA: Chi; chiB: Chi; scores: number[]; mean: number; overall: number;
}

function scorePair(a: Person, b: Person): PairResult {
  const chiA = canChiOfYear(Number(a.birthDate.slice(0, 4))).chi;
  const chiB = canChiOfYear(Number(b.birthDate.slice(0, 4))).chi;
  const f: Features = {
    rel: hanhRelation(chiA, chiB), tamHop: isTamHop(chiA, chiB), lucXung: isLucXung(chiA, chiB),
    sameChi: chiA === chiB, diffGender: a.gender !== b.gender,
    seed: (dateSeed(a.birthDate) + dateSeed(b.birthDate)) % SEED_MOD,
  };
  const scores = scoreAxes(f);
  return { ...f, chiA, chiB, scores, mean: meanOf(scores), overall: overallOf(scores) };
}

// ── Dữ kiện suy ra ──────────────────────────────────────────────────────────
/** Số thập phân HIỂN THỊ phải dùng dấu phẩy kiểu Việt (6.4 → "6,4"). */
const vn = (n: number) => n.toFixed(1).replace('.', ',');
/** Mức cộng trừ hiển thị kèm dấu, dùng dấu trừ thật (−) chứ không phải gạch nối. */
const sgn = (n: number) => (n >= 0 ? `+${n}` : `−${Math.abs(n)}`);
const dmy = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

/** Quét MỌI cấu hình có thể: 12 × 12 chi × 2 giới tính × 6 giá trị mã băm. */
const ALL_CONFIGS: Features[] = CHI.flatMap((a) =>
  CHI.flatMap((b) =>
    [false, true].flatMap((diffGender) =>
      Array.from({ length: SEED_MOD }, (_, seed): Features => ({
        rel: hanhRelation(a, b), tamHop: isTamHop(a, b), lucXung: isLucXung(a, b),
        sameChi: a === b, diffGender, seed,
      })),
    ),
  ),
);

const sortedUnique = (ns: number[]) => [...new Set(ns)].sort((x, y) => x - y);
const OVERALL_VALUES = sortedUnique(ALL_CONFIGS.map((f) => overallOf(scoreAxes(f))));
const OVERALL_MIN = OVERALL_VALUES[0] ?? 0;
const OVERALL_MAX = OVERALL_VALUES[OVERALL_VALUES.length - 1] ?? 0;
/** Tập giá trị mỗi trục có thể nhận. */
const AXIS_VALUES = AXES.map((_, i) => sortedUnique(ALL_CONFIGS.map((f) => scoreAxes(f)[i] ?? 0)));

/** Cặp chi khác nhau + các cấu hình hai quy tắc nói ngược nhau. */
const CHI_PAIRS = CHI.flatMap((a, i) => CHI.slice(i + 1).map((b) => [a, b] as const));
const NEUTRAL_PAIRS = CHI_PAIRS.filter(([a, b]) => hanhRelation(a, b) === 'neutral').length;
const TAM_HOP_PAIRS = CHI_PAIRS.filter(([a, b]) => isTamHop(a, b)).length;
const TAM_HOP_NHUNG_KHAC = CHI_PAIRS.filter(
  ([a, b]) => isTamHop(a, b) && hanhRelation(a, b) === 'controlling',
).length;
const LUC_XUNG_NHUNG_CUNG_HANH = CHI_PAIRS.filter(
  ([a, b]) => isLucXung(a, b) && hanhRelation(a, b) === 'same',
).length;
/** Lệch mốc Tết = bị gán chi của năm liền sau. Cặp chi LIỀN NHAU cùng một hành
 * thì quan hệ ngũ hành không đổi, nên "lệch một chi" KHÔNG luôn sai đủ bốn trục. */
const NEIGHBOUR_SAME_HANH = CHI.map(
  (c, i) => [c, CHI[(i + 1) % CHI.length] as Chi] as const,
).filter(([a, b]) => HANH_BY_CHI[a] === HANH_BY_CHI[b]);

/** Bảng "mỗi trục đọc ra từ đâu". */
const AXIS_ROWS = [
  { ten: AXES[0], nguon: 'Quan hệ ngũ hành giữa hai địa chi',
    luat: `cùng hành hoặc sinh nhau ${sgn(D_TINH_CACH.same)}; khắc nhau ${sgn(D_TINH_CACH.controlling)}` },
  { ten: AXES[1], nguon: 'Tam hợp / lục xung, cộng một tham số giới tính',
    luat: `tam hợp ${sgn(D_TAM_HOP_GT)}; lục xung ${sgn(D_LUC_XUNG_GT)}; khác giới ${sgn(D_KHAC_GIOI)}` },
  { ten: AXES[2], nguon: 'Mã băm hai chuỗi ngày sinh — không đọc từ can chi nào',
    luat: `theo phần dư chia ${SEED_MOD} của mã băm, từ ${sgn(-SEED_OFFSET)} tới ${sgn(SEED_MOD - 1 - SEED_OFFSET)}` },
  { ten: AXES[3], nguon: 'Quan hệ ngũ hành (cùng dữ kiện với trục đầu)',
    luat: `sinh nhau ${sgn(D_TAI_CHINH.generative)}; cùng hành ${sgn(D_TAI_CHINH.same)}; khắc nhau ${sgn(D_TAI_CHINH.controlling)}` },
  { ten: AXES[4], nguon: `Tam hợp / lục xung (như trục ${AXES[1]}), cộng trùng chi`,
    luat: `tam hợp ${sgn(D_TAM_HOP_GD)}; trùng chi ${sgn(D_TRUNG_CHI_GD)}; lục xung ${sgn(D_LUC_XUNG_GD)}` },
];

/** Bảng "form hỏi gì, phép chấm dùng gì"; `manh` = in đậm cột kết luận. */
const INPUT_ROWS = [
  { ten: 'Ngày sinh — phần NĂM', manh: true,
    dung: 'Suy ra con giáp, rồi ra quan hệ ngũ hành và tam hợp / lục xung / trùng chi',
    anhHuong: `Có — chi phối 4 trong ${AXES.length} trục` },
  { ten: 'Ngày sinh — phần NGÀY và THÁNG', manh: false,
    dung: `Chỉ chạy vào mã băm của trục ${AXES[2]}`, anhHuong: 'Có, nhưng đúng một trục' },
  { ten: 'Giới tính', manh: false,
    dung: `Chỉ xét hai người giống hay khác giới; khác thì trục ${AXES[1]} cộng ${D_KHAC_GIOI} điểm`,
    anhHuong: `Có, đúng ${D_KHAC_GIOI} điểm` },
  { ten: 'Giờ sinh', manh: true,
    dung: 'Được gửi lên máy chủ, nhưng hàm tính điểm không đọc tới ở bất kỳ trục nào',
    anhHuong: 'Không — nhập hay bỏ trống đều ra cùng kết quả' },
  { ten: 'Tên gọi', manh: false,
    dung: 'Chỉ để hiển thị trong tiêu đề kết quả', anhHuong: 'Không' },
];

/** Bốn ví dụ — chỉ ngày sinh là dữ kiện nhập, giới tính cố định nam × nữ để
 * chênh lệch chỉ đến từ can chi. Điểm và nhãn năm đều suy ra từ đó. */
interface Example extends PairResult { label: string }
function ex(aDate: string, bDate: string): Example {
  const r = scorePair({ birthDate: aDate, gender: 'male' }, { birthDate: bDate, gender: 'female' });
  return { ...r, label: `${aDate.slice(0, 4)} × ${bDate.slice(0, 4)}` };
}
const EX_HOP = ex('1992-06-15', '1996-06-15');
const EX_XUNG_CUNG_HANH = ex('1997-06-15', '1991-06-15');
const EX_TAM_HOP_KHAC = ex('1996-06-15', '2000-06-15');
const EX_DAY = ex('1990-06-15', '1996-06-15');
const EXAMPLES: Example[] = [EX_HOP, EX_XUNG_CUNG_HANH, EX_TAM_HOP_KHAC, EX_DAY];
const SAME_SCORE_DIFFERENT_PAIRS = EX_XUNG_CUNG_HANH.overall === EX_TAM_HOP_KHAC.overall;

/** Hai người CÙNG năm sinh, khác ngày → chỉ trục mã băm đổi. */
const PARTNER: Person = { birthDate: '1996-06-15', gender: 'female' };
const SEED_DATE_LOW = '1990-01-05';
const SEED_DATE_HIGH = '1990-03-21';
const SEED_LOW = scorePair({ birthDate: SEED_DATE_LOW, gender: 'male' }, PARTNER);
const SEED_HIGH = scorePair({ birthDate: SEED_DATE_HIGH, gender: 'male' }, PARTNER);
const SEED_ROWS = [
  { date: SEED_DATE_LOW, r: SEED_LOW },
  { date: SEED_DATE_HIGH, r: SEED_HIGH },
];
const GOAL_INDEX = AXES.indexOf('Mục tiêu');
const GOAL_LOW = SEED_LOW.scores[GOAL_INDEX] ?? 0;
const GOAL_HIGH = SEED_HIGH.scores[GOAL_INDEX] ?? 0;

const FAQS = [
  {
    q: 'Công cụ hợp đôi của hieu.asia dựa trên lá số Tử Vi hay Bát Tự?',
    a: `Không. Phép chấm chỉ lấy đúng một thứ từ ngày sinh: con giáp theo năm. Nó không dựng lá số Tử Vi, không lập tứ trụ Bát Tự, không tính cung mệnh hay cung phi. Từ hai con giáp ấy, công cụ đọc ra hai quan hệ — ngũ hành cùng nhau / sinh / khắc, và tam hợp / lục xung / trùng chi — rồi cộng trừ ra ${AXES.length} trục điểm. Toàn bộ phép tính là tất định và không có mô hình ngôn ngữ nào tham gia: mọi câu mô tả bạn đọc đều lấy từ bảng mẫu viết sẵn.`,
  },
  {
    q: 'Vậy ô giờ sinh trong form dùng để làm gì?',
    a: 'Hiện tại thì không dùng để làm gì trong phần chấm điểm. Form có ô nhập giờ sinh và giá trị ấy vẫn được gửi lên máy chủ, nhưng hàm tính điểm không đọc tới nó ở bất kỳ trục nào. Nói cách khác, bạn nhập giờ sinh hay bỏ trống thì kết quả y hệt nhau. Đây là điều nên biết trước khi cất công đi hỏi lại giờ sinh của người kia.',
  },
  {
    q: 'Điểm tổng có chạy hết thang 1 đến 10 không?',
    a: `Không. Quét toàn bộ cấu hình đầu vào có thể có — mọi cặp con giáp, cả hai kịch bản giới tính, mọi giá trị của mã băm ngày sinh — thì điểm tổng chỉ nhận được các giá trị ${OVERALL_VALUES.join(', ')}. Tức là thang thật chạy từ ${OVERALL_MIN} tới ${OVERALL_MAX}. Vì vậy ${OVERALL_MIN}/10 không phải "gần chạm đáy" mà chính là đáy của công cụ, còn ${OVERALL_MAX}/10 là trần. Biết dải này rồi thì bạn sẽ không hoảng vì một con số nghe có vẻ thấp.`,
  },
  {
    q: 'Vì sao trục “Mục tiêu” lại được nói là không mang thông tin?',
    a: `Vì nó không đọc từ quan hệ can chi nào cả. Công cụ lấy hai chuỗi ngày sinh, chạy qua một phép băm tất định, rồi cộng trừ điểm gốc theo phần dư. Hệ quả kiểm được ngay: hai người sinh cùng một năm nhưng khác ngày, cùng đem so với một người thứ ba, sẽ có bốn trục giống hệt nhau nhưng trục "Mục tiêu" đổi từ ${GOAL_LOW} thành ${GOAL_HIGH}, kéo điểm tổng từ ${SEED_LOW.overall} lên ${SEED_HIGH.overall}. Con số nhúc nhích vì một lý do không liên quan gì tới chuyện hợp đôi.`,
  },
  {
    q: 'Điểm cao thì quan hệ có chắc tốt không, và điểm thấp thì có nên dừng lại không?',
    a: `Cả hai đều không. Điểm đo mức giống nhau hoặc bổ trợ giữa hai ô trong bảng can chi, chứ không đo hai con người: đầu vào không chứa bất cứ thông tin nào về việc hai người cãi nhau thế nào, ai chịu nói trước, có giữ lời không, có chịu sửa không — và hàng triệu người sinh cùng cặp năm ấy đều nhận đúng bốn trục giống hệt nhau. Một điểm ${OVERALL_MIN}/10 chỉ có nghĩa là hai con giáp rơi vào cấu hình bị trừ nhiều nhất trong bảng. Nếu bạn đang phân vân sẵn thì con số thấp rất dễ trở thành cái cớ, còn con số cao lại rất dễ khiến bạn bỏ qua một dấu hiệu thật; cả hai chiều đều là dùng sai công cụ. Thứ thật sự giữ một mối quan hệ là cách xử lý xung đột và mức cam kết — hai thứ công cụ không có dữ kiện để biết.`,
  },
  {
    q: 'Vậy phần nào của kết quả là dùng được?',
    a: 'Phần chữ. Mỗi trục kèm một dòng mô tả, và bên dưới là các gợi ý giao tiếp gồm ba phần: chỗ dễ trục trặc, cách diễn đạt lại, và một câu để thử nói. Những gợi ý ấy được chọn theo trục thấp điểm nhất — chỉ khi trục ấy có đúng một mẫu viết sẵn thì công cụ mới lấy thêm từ trục thấp thứ nhì. Giá trị của chúng không phụ thuộc vào việc điểm số có đúng hay không: chúng chỉ là cớ để mở một cuộc trò chuyện mà cặp nào cũng nên có. Cách dùng lành mạnh là bỏ qua vòng tròn điểm, đọc phần mô tả, rồi mang câu gợi ý ra nói thật và xem phản ứng.',
  },
];

const JSONLD = [
  article({
    headline: 'Điểm hợp đôi thật ra nói gì: năm trục, hai quan hệ và một con số',
    description:
      'Công cụ so sánh hai người chấm năm trục từ con giáp năm sinh. Bài giải thích mỗi trục đọc ra từ đâu, vì sao điểm cao không bảo chứng quan hệ tốt, và cách dùng lành mạnh.',
    url: '/learn/hop-doi',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Điểm hợp đôi', url: '/learn/hop-doi' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Điểm hợp đôi — đọc một bảng điểm tương hợp cho đúng',
    description:
      'Công cụ hợp đôi chấm 5 trục từ con giáp năm sinh của hai người. Điểm chỉ đo mức giống hoặc bổ trợ trên vài trục hẹp, không đo cách hai người xử lý xung đột.',
    url: '/learn/hop-doi',
  }),
];
const TD = 'px-4 py-2 text-muted-foreground';
const NUM = 'px-4 py-2 tabular-nums text-foreground';
const A = 'text-gold-700 underline-offset-4 hover:underline';
/** Bảng cuộn ngang + hàng tiêu đề; `children` là phần `<tbody>`. */
function Table({ minWidth, cols, children }: { minWidth: string; cols: string[]; children: ReactNode }) {
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
        {children}
      </table>
    </div>
  );
}

export default function LearnHopDoiPage() {
  return (
    <LearnArticle
      eyebrow="QUAN HỆ · ĐỌC KẾT QUẢ"
      title={
        <>
          Điểm hợp đôi{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">nói gì về hai người</span>
        </>
      }
      standfirst={
        <>
          Nhập hai ngày sinh, nhận về một con số trên 10. Bài này mở nắp phép tính ấy ra:{' '}
          {AXES.length} trục chấm từ đâu, dữ kiện nào bạn nhập mà công cụ không hề dùng, và vì sao
          điểm cao không bảo chứng điều gì còn điểm thấp không phải lý do dừng lại.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Điểm hợp đôi' },
      ]}
      relatedLenses={relatedLearnLenses('hop-doi')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb: `Công cụ So sánh 2 người chấm ${AXES.length} trục từ con giáp năm sinh, kèm mô tả khác biệt và những câu gợi ý để mở chuyện — phần đáng đọc nhất của kết quả.`,
        href: '/compatibility',
        label: `Chấm ${AXES.length} trục cho hai người`,
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <HopDoiFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Điểm hợp đôi là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Công cụ <Link href="/compatibility" className={A}>So sánh 2 người</Link> nhận ngày
                sinh và giới tính của hai người, rồi trả về{' '}
                <strong>điểm tổng trên thang 10</strong>, {AXES.length} trục điểm kèm mô tả và một
                khối gợi ý giao tiếp. Phép tính đằng sau gọn hơn vẻ ngoài nhiều: lấy{' '}
                <strong>con giáp theo năm sinh</strong> của mỗi người, đọc ra hai quan hệ giữa hai
                con giáp ấy, cộng trừ từ điểm gốc {BASE}, rồi lấy trung bình.
              </p>
              <p>Ba điều cần chốt ngay về cái mà điểm này KHÔNG phải:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải một phép so lá số.</strong> Không dựng lá số Tử Vi, không lập
                  tứ trụ, không tính cung mệnh — chỉ dùng con giáp của năm sinh.
                </li>
                <li>
                  <strong>Không phải một phép đo mối quan hệ.</strong> Đầu vào không chứa thông tin
                  nào về hai người đang sống ra sao — cái nó so là{' '}
                  <strong>hai ô trong bảng can chi</strong>. Cũng không phải một dự báo: không mốc
                  thời gian, không kết cục, và chính công cụ cũng in sẵn lưu ý rằng đây là khung
                  tham khảo.
                </li>
                <li>
                  <strong>Không phải thang 1–10 đầy đủ.</strong> Quét toàn bộ cấu hình đầu vào thì
                  điểm tổng chỉ nhận được <strong>{OVERALL_VALUES.join(', ')}</strong> — thang thật
                  chạy từ {OVERALL_MIN} tới {OVERALL_MAX}. Mục{' '}
                  <Link href="#con-so-noi-gi" className={A}>một điểm nói gì</Link> nói kỹ hệ quả.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Ba phạm vi bài này cố ý không lấn: vì sao hai chi được xếp là tam hợp hay lục xung
                thuộc bài{' '}
                <Link href="/learn/tam-hop-luc-xung" className={A}>Tam hợp – Lục xung</Link>; hợp
                tuổi theo can chi cho từng việc thuộc bài{' '}
                <Link href="/learn/hop-tuoi" className={A}>Hợp tuổi 12 con giáp</Link>. Nhóm từ ba
                người trở lên do{' '}
                <Link href="/xem-hop-nhom" className={A}>Xem hợp nhóm / gia đình</Link> lo, và phép
                gộp nhiều cặp thành một điểm nhóm nằm ở bài{' '}
                <Link href="/learn/dong-nhom" className={A}>Hợp nhóm và phép trung bình</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <HopDoiDepth />,
        },
        {
          id: 'nam-truc',
          tocLabel: `${AXES.length} trục`,
          heading: `${AXES.length} trục công cụ chấm — mỗi trục đọc ra từ đâu`,
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Kết quả hiển thị {AXES.length} dòng mang tên {AXES.join(', ')} — nghe như{' '}
                {AXES.length} mặt khác nhau của một mối quan hệ. Bảng dưới cho thấy điều quan trọng
                hơn: <strong>mỗi trục thật sự đọc từ dữ kiện nào</strong>, và tập giá trị trục đó có
                thể nhận (quét toàn bộ cấu hình đầu vào).
              </p>
              <Table minWidth="min-w-[840px]" cols={['Trục', 'Đọc ra từ dữ kiện nào', 'Mức cộng trừ', 'Giá trị có thể']}>
                <tbody>
                  {AXIS_ROWS.map((row, i) => (
                    <tr key={row.ten} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {row.ten}
                      </th>
                      <td className={TD}>{row.nguon}</td>
                      <td className={TD}>
                        điểm gốc {BASE}; {row.luat}
                      </td>
                      <td className={NUM}>{(AXIS_VALUES[i] ?? []).join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <p>
                Đọc cột thứ hai sẽ thấy điều bảng điểm không nói ra:{' '}
                <strong>{AXES.length} cái tên nhưng chỉ có hai quan sát về hai con giáp</strong>.
                Trục {AXES[0]} và {AXES[3]} cùng đọc từ quan hệ ngũ hành; trục {AXES[1]} và{' '}
                {AXES[4]} cùng đọc từ tam hợp / lục xung — {AXES[4]} xét thêm trùng chi, {AXES[1]}{' '}
                xét thêm giới tính. Nên khi hai chi khắc nhau, hai
                trục tụt cùng lúc — vì dùng chung một dữ kiện, không phải vì hai mặt của đời sống
                cùng có vấn đề. Mỗi trục còn được dán nhãn theo ngưỡng cố định: từ{' '}
                {SIGNAL_THUAN_FROM} điểm trở lên là “{signalOf(SIGNAL_THUAN_FROM)}”, từ{' '}
                {SIGNAL_CHU_Y_UPTO} trở xuống là “{signalOf(SIGNAL_CHU_Y_UPTO)}”, ở giữa là “
                {signalOf(BASE)}”. Riêng trục {AXES[2]} cần nói thẳng:{' '}
                <strong>nó không đọc từ quan hệ can chi nào cả</strong> — công cụ băm hai chuỗi ngày
                sinh rồi cộng trừ theo phần dư, tất định nhưng không có quy tắc huyền học nào đứng
                sau.
              </p>
              <p className="text-sm text-foreground/70">
                Bảng ngũ hành ở đây gán hành thẳng theo địa chi, không tra{' '}
                <Link href="/learn/nap-am" className={A}>nạp âm</Link>. Vì hai hành khác nhau thì
                luôn hoặc sinh hoặc khắc, nhánh “trung tính” trong mã{' '}
                <strong>không bao giờ chạy</strong> — đúng {NEUTRAL_PAIRS} trên {CHI_PAIRS.length}{' '}
                cặp chi rơi vào nhánh đó, nên trục {AXES[0]} chỉ nhận{' '}
                {(AXIS_VALUES[0] ?? []).length} giá trị. Nền sinh khắc ở bài{' '}
                <Link href="/learn/ngu-hanh-mau-sac" className={A}>Ngũ hành và màu sắc</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'dau-vao-that',
          tocLabel: 'Dùng gì, bỏ gì',
          heading: 'Công cụ dùng dữ kiện nào — và bỏ qua dữ kiện nào',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Form hỏi bốn thứ cho mỗi người, nhưng không phải thứ nào cũng chạy vào điểm. Bảng
                dưới tách ngày sinh thành hai dòng, vì hai phần của nó đi vào hai chỗ khác nhau.
              </p>
              <Table minWidth="min-w-[760px]" cols={['Bạn nhập', 'Công cụ làm gì với nó', 'Ảnh hưởng điểm?']}>
                <tbody>
                  {INPUT_ROWS.map((row) => (
                    <tr key={row.ten} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {row.ten}
                      </th>
                      <td className={TD}>{row.dung}</td>
                      <td className="px-4 py-2 text-foreground">
                        {row.manh ? <strong>{row.anhHuong}</strong> : row.anhHuong}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h3 className="text-lg font-semibold text-foreground">
                Phép thử: đổi ngày sinh mà giữ nguyên con giáp
              </h3>
              <p>
                Nếu trục {AXES[2]} thật sự nói điều gì về hai người thì đổi ngày sinh trong cùng một
                năm không được phép làm nó nhảy. Thử: hai người cùng sinh{' '}
                {SEED_DATE_LOW.slice(0, 4)}, cùng so với một người sinh{' '}
                {PARTNER.birthDate.slice(0, 4)}.
              </p>
              <Table minWidth="min-w-[720px]" cols={['Ngày sinh người A', 'Chi hai người', `Trục ${AXES[2]}`, 'Tổng']}>
                <tbody>
                  {SEED_ROWS.map(({ date, r }) => (
                    <tr key={date} className="border-b border-border/60 last:border-b-0">
                      <td className={`${NUM} font-medium`}>{dmy(date)}</td>
                      <td className={TD}>
                        {r.chiA} × {r.chiB}
                      </td>
                      <td className={NUM}>{r.scores[GOAL_INDEX] ?? 0}</td>
                      <td className={NUM}>{r.overall}/10</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <p>
                Hai người này có <strong>mọi dữ kiện huyền học giống hệt nhau</strong> nên bốn trục
                kia y nguyên. Vậy mà trục {AXES[2]} đổi từ {GOAL_LOW} thành {GOAL_HIGH}, kéo điểm
                tổng từ {SEED_LOW.overall} lên {SEED_HIGH.overall} — con số nhúc nhích vì{' '}
                <strong>ngày trong tháng khác nhau</strong>, không vì điều gì về hợp đôi.
              </p>
              <p className="text-sm text-foreground/70">
                Một khoản nữa công cụ không xử lý: <strong>mốc Tết âm lịch</strong>. Con giáp lấy
                theo năm dương lịch, nên người sinh đầu năm dương trước Tết bị gán con giáp của năm
                sau — lệch trọn một chi, sai <strong>tới bốn trục</strong> đọc can chi. Không phải
                lúc nào cũng đủ bốn: {NEIGHBOUR_SAME_HANH.length} trong {CHI.length} cặp chi liền
                nhau lại cùng một hành ({NEIGHBOUR_SAME_HANH.map(([x, y]) => `${x}–${y}`).join(', ')}
                ), nên hai trục đọc ngũ hành có khi giữ nguyên. Tra đúng chi năm sinh ở{' '}
                <Link href="/tra-cuu-tuoi" className={A}>công cụ tra cứu tuổi</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'con-so-noi-gi',
          tocLabel: 'Con số nói gì',
          heading: 'Một điểm hợp đôi thật ra nói gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Điểm tổng là trung bình {AXES.length} trục rồi làm tròn. Bốn ví dụ dưới giữ nguyên
                ngày trong năm, chỉ khác năm sinh. Chỉ cột đầu là dữ kiện nhập; mọi cột còn lại do
                trang này chạy lại bằng đúng công thức của công cụ.
              </p>
              <Table minWidth="min-w-[980px]" cols={['Hai năm sinh', 'Hai chi', 'Quan hệ', ...AXES, 'Tổng']}>
                <tbody>
                  {EXAMPLES.map((e) => (
                    <tr key={e.label} className="border-b border-border/60 last:border-b-0">
                      <td className={`${NUM} font-medium`}>{e.label}</td>
                      <td className={TD}>
                        {e.chiA} × {e.chiB}
                      </td>
                      <td className={TD}>
                        {e.tamHop ? 'tam hợp' : e.lucXung ? 'lục xung' : 'không'},{' '}
                        {e.rel === 'same' ? 'cùng hành' : e.rel === 'generative' ? 'hành sinh' : 'hành khắc'}
                      </td>
                      {e.scores.map((s, i) => (
                        <td key={AXES[i]} className="px-4 py-2 tabular-nums text-muted-foreground">
                          {s}
                        </td>
                      ))}
                      <td className={`${NUM} font-semibold`}>{e.overall}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Hàng {EX_XUNG_CUNG_HANH.chiA} × {EX_XUNG_CUNG_HANH.chiB}:</strong> hai chi vừa <strong>cùng hành</strong> vừa là một <strong>cặp lục xung</strong>,
                  nên bảng điểm tự cãi nhau — trục {AXES[0]} được{' '}
                  {EX_XUNG_CUNG_HANH.scores[0] ?? 0} trong khi trục {AXES[4]} chỉ còn{' '}
                  {EX_XUNG_CUNG_HANH.scores[4] ?? 0}. Trung bình {vn(EX_XUNG_CUNG_HANH.mean)} làm
                  tròn thành {EX_XUNG_CUNG_HANH.overall}, một con số{' '}
                  <strong>không mô tả đúng bên nào</strong>. Không hiếm:{' '}
                  {LUC_XUNG_NHUNG_CUNG_HANH} trong {LUC_XUNG.length} cặp lục xung ở thế này.
                </li>
                <li>
                  <strong>Hàng {EX_TAM_HOP_KHAC.chiA} × {EX_TAM_HOP_KHAC.chiB}:</strong> mâu thuẫn ngược lại — tam hợp nên trục {AXES[1]} lên tới{' '}
                  {EX_TAM_HOP_KHAC.scores[1] ?? 0}, nhưng hai hành khắc nhau nên trục {AXES[0]} rơi
                  xuống {EX_TAM_HOP_KHAC.scores[0] ?? 0}. Cũng phổ biến: {TAM_HOP_NHUNG_KHAC} trong{' '}
                  {TAM_HOP_PAIRS} cặp tam hợp có ngũ hành khắc nhau.
                  {SAME_SCORE_DIFFERENT_PAIRS ? (
                    <>
                      {' '}
                      Và hai hàng ấy <strong>ra cùng một điểm tổng</strong> —{' '}
                      {EX_XUNG_CUNG_HANH.overall}/10 — bằng chứng gọn nhất rằng phép trung bình{' '}
                      <strong>xoá thông tin</strong> chứ không tổng hợp nó.
                    </>
                  ) : null}
                </li>
                <li>
                  <strong>Hai đầu của thang:</strong> trần thực tế là {OVERALL_MAX}/10, đáy thực tế
                  là {OVERALL_MIN}/10 — nên{' '}
                  <strong>đừng đọc {OVERALL_MIN}/10 như “sắp chạm 0”</strong>.
                </li>
              </ul>
              <p>
                Gộp lại, một điểm hợp đôi nói được đúng một câu:{' '}
                <strong>hai con giáp năm sinh giống hoặc bổ trợ nhau tới mức nào</strong> — “giống”
                là cùng hành hoặc trùng chi, “bổ trợ” là ngũ hành sinh hoặc tam hợp. Đó là phát biểu
                về hai ô trong một bảng lịch: hàng triệu người sinh cùng cặp năm ấy đều nhận đúng
                bốn trục giống hệt. Vì vậy{' '}
                <strong>điểm cao không đồng nghĩa với một mối quan hệ tốt</strong> và{' '}
                <strong>điểm thấp không phải lý do chia tay</strong>. Thứ thật sự giữ một mối quan
                hệ là <strong>cách hai người xử lý xung đột</strong> và <strong>mức cam kết</strong>{' '}
                họ chịu bỏ ra — hai thứ thay đổi được bằng nỗ lực, và cũng là hai thứ không trục nào
                trong bảng đo được.
              </p>
              <p className="text-sm text-foreground/70">
                Thấy phần mô tả “đúng y” về hai người? Đọc bài{' '}
                <Link href="/learn/barnum" className={A}>Hiệu ứng Barnum</Link> — câu mô tả đủ rộng
                để hợp với gần như mọi cặp đôi vẫn tạo cảm giác chính xác rất mạnh.
              </p>
            </div>
          ),
        },
        {
          id: 'doc-cho-dung',
          tocLabel: 'Dùng cho đúng',
          heading: 'Cách dùng lành mạnh: đọc phần mô tả, đừng nhìn con số',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Công cụ không đo được mối quan hệ, nhưng không vì thế mà vô dụng. Phần dùng được nằm
                ở <strong>chữ</strong> chứ không ở số — và giá trị của phần chữ ấy{' '}
                <strong>không phụ thuộc vào việc điểm có đúng hay không</strong>.
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Bỏ qua vòng tròn điểm</strong> — nó chạy trong khoảng {OVERALL_MIN}–
                  {OVERALL_MAX} và là trung bình của {AXES.length} trục có thể mâu thuẫn nhau. Đọc{' '}
                  {AXES.length} dòng mô tả khác biệt như một <em>danh sách chủ đề cần bàn</em>,
                  không như phán quyết.
                </li>
                <li>
                  <strong>Lấy phần “Thử nói” ra dùng thật.</strong> Mỗi gợi ý có chỗ dễ trục trặc,
                  cách diễn đạt lại và một câu mở lời; chúng được chọn theo{' '}
                  <strong>trục thấp điểm nhất</strong>, và chỉ lấn sang trục thấp thứ nhì khi trục
                  thấp nhất có đúng một mẫu viết sẵn.
                </li>
                <li>
                  <strong>Xem phản ứng, không xem điểm</strong> — người kia có chịu nói không, có
                  nghe hết câu không, có nhớ lần sau không.
                </li>
              </ol>
              <p>
                Hai dấu hiệu bạn đang dùng sai công cụ:{' '}
                <strong>điểm thấp làm bạn muốn dừng lại</strong>, hoặc{' '}
                <strong>điểm cao làm bạn bỏ qua một dấu hiệu thật</strong> — cả hai đều là một con
                số vừa được phép quyết định thay bạn một việc nó không có dữ kiện để biết.
              </p>
              <p className="text-sm text-foreground/70">
                Công cụ cũng tự in ba dòng lưu ý cố định ở cuối mỗi kết quả: đây là khung tham khảo,
                cách hai người cư xử mỗi tuần mới quyết định, và quyết định lớn thì nên kết hợp đối
                thoại trực tiếp. Ba dòng ấy là phần đúng nhất của trang kết quả.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: cái công cụ không tính, và cái nó không thể tính',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>Liệt kê thẳng, vì hợp đôi là chủ đề dễ bị dùng để ép người khác nhất:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Chưa có phép kiểm nào đứng sau:</strong> không có bằng chứng cho thấy con
                  giáp năm sinh dự báo được chất lượng một mối quan hệ. Cách đặt niềm tin kiểu này
                  vào thế kiểm được ở bài{' '}
                  <Link href="/learn/kiem-chung" className={A}>Kiểm chứng dự đoán</Link>.
                </li>
                <li>
                  <strong>Một trục không mang thông tin.</strong> Trục {AXES[2]} chạy bằng mã băm
                  ngày sinh nên vẫn kéo điểm tổng lên xuống dù không nói gì về hai người.
                </li>
                <li>
                  <strong>Nhiều lớp quan hệ can chi không được xét:</strong> chỉ có tam hợp, lục
                  xung, trùng chi. Lục hợp, lục hại, tương hình đều{' '}
                  <strong>không được tính</strong>. Lục hợp và lục hại thì{' '}
                  <Link href="/hop-tuoi" className={A}>công cụ hợp tuổi theo can chi</Link> có xét;
                  riêng tương hình thì chưa công cụ nào của hieu.asia tính — bài{' '}
                  <Link href="/learn/hop-tuoi" className={A}>Hợp tuổi 12 con giáp</Link> nói rõ
                  khoản đó.
                </li>
                <li>
                  <strong>Mốc đổi năm là dương lịch, không phải Tết</strong> — người sinh đầu năm
                  dương trước Tết bị gán lệch một con giáp, kéo theo sai tới bốn trục.
                </li>
                <li>
                  <strong>Giới tính chỉ được dùng ở mức thô nhất:</strong> hỏi hai người giống hay
                  khác giới rồi cộng {D_KHAC_GIOI} điểm cho một trục, không hơn.
                </li>
                <li>
                  <strong>Không thay được tư vấn.</strong> Quan hệ đang có bạo hành, kiểm soát hay
                  bế tắc kéo dài thì chỗ cần tìm là chuyên gia tâm lý, không phải bảng điểm.
                </li>
              </ul>
              <p>
                Cách đọc lành mạnh gói trong một câu: xem điểm hợp đôi như{' '}
                <strong>một cái cớ để nói chuyện</strong>, không phải một kết luận — đừng dùng nó để
                quyết định cưới hay chia tay, cũng đừng dùng nó để thuyết phục người khác về một
                quyết định bạn đã tự có sẵn.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <HopDoiWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <HopDoiRecall />,
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
                Vì sao hai chi được xếp là tam hợp hay lục xung:{' '}
                <Link href="/learn/tam-hop-luc-xung" className={A}>bài Tam hợp – Lục xung</Link>.
                Hợp tuổi theo can chi cho từng việc:{' '}
                <Link href="/learn/hop-tuoi" className={A}>bài Hợp tuổi 12 con giáp</Link>. Đang
                tính chuyện cưới hỏi thì phần chọn năm và các tục kiêng ở{' '}
                <Link href="/learn/cuoi-hoi" className={A}>bài Xem tuổi cưới</Link>.
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/compatibility', label: 'So sánh 2 người' },
                    { href: '/hop-tuoi', label: 'Hợp tuổi theo can chi' },
                    { href: '/xem-hop-nhom', label: 'Xem hợp nhóm / gia đình' },
                    { href: '/tuong-hop-12-con-giap', label: 'Tương hợp 12 con giáp' },
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
          children: <HopDoiChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
