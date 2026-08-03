'use client';

/**
 * Nội dung "học chủ động" cho trang /learn/hop-doi — bài về ĐIỂM HỢP ĐÔI.
 *
 * GROUNDING — công cụ đích là /compatibility:
 *   • app/compatibility/page.tsx — form (tên, ngày sinh, GIỜ SINH, giới tính) →
 *     POST {API}/tools/compatibility-pair → render overallScore, 5 `scores`
 *     (dimension / score / signal / note), `communication` và `caveats`.
 *   • Phép chấm KHÔNG nằm trong repo frontend. Nó ở worker backend:
 *     backend/infra/cloudflare/workers/api-gateway/src/tools/compatibility-pair.ts
 *     → buildCompatibilityPair(). Khác repo nên KHÔNG import được; khối "MIRROR
 *     ENGINE" bên dưới chép ĐÚNG bảng và công thức của file đó, và mọi con số
 *     hiển thị đều CHẠY LẠI từ khối ấy chứ không gõ tay.
 *     ⚠️ Sửa công thức ở worker thì phải sửa khối mirror ở đây VÀ ở page.tsx.
 *   • lib/xem-tuoi-cuoi.ts — CHI + canChiOfYear(): trùng khít mốc (year − 4) % 12
 *     mà worker dùng, nên dùng luôn thay vì chép bảng con giáp thứ hai.
 *
 * CÔNG CỤ THẬT SỰ TÍNH GÌ (đọc code, không đoán): CÓ — con giáp theo NĂM sinh;
 * quan hệ ngũ hành giữa hai địa chi; tam hợp / lục xung / trùng chi; khác giới
 * tính hay không (+1 đúng một trục); mã băm hai chuỗi ngày sinh (trục "Mục
 * tiêu"). KHÔNG — giờ sinh (form có ô nhập, phép chấm không đụng tới); lá số Tử
 * Vi; tứ trụ Bát Tự; cung mệnh; lục hợp; lục hại; tương hình; mốc Tết âm lịch;
 * và không có LLM — mọi câu chữ đều từ bảng mẫu cố định.
 *
 * PHẠM VI: KHÔNG dạy lại quan hệ can chi giữa hai con giáp (bài /learn/hop-tuoi,
 * /learn/tam-hop-luc-xung), KHÔNG lấn bài /learn/dong-nhom (nhóm 3 người trở lên).
 * Giọng: điểm chỉ đo mức GIỐNG hoặc BỔ TRỢ trên vài trục hẹp — điểm cao không
 * bảo chứng quan hệ tốt, điểm thấp không phải lý do chia tay. Không doạ.
 */

import * as React from 'react';
import { LearnFrame } from '@/components/learn/active/LearnFrame';
import { DepthTabs } from '@/components/learn/active/DepthTabs';
import { FiveWhys } from '@/components/learn/active/FiveWhys';
import { ActiveRecall, type RecallQuestion } from '@/components/learn/active/ActiveRecall';
import {
  UnderstandingChecklist,
  type UnderstandingFacet,
} from '@/components/learn/active/UnderstandingChecklist';
import { CHI, canChiOfYear, type Chi } from '@/lib/xem-tuoi-cuoi';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── MIRROR ENGINE ───────────────────────────────────────────────────────────
// Chép đúng backend tools/compatibility-pair.ts (xem chú thích đầu file).

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

/** Điểm gốc + toàn bộ mức cộng trừ. Một nguồn cho mọi con số của bài. */
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

/** Mã băm tất định của chuỗi ngày sinh — chạy riêng trục "Mục tiêu". */
function dateSeed(d: string): number {
  let sum = 0;
  for (let i = 0; i < d.length; i += 1) sum = (sum + d.charCodeAt(i) * (i + 1)) % 997;
  return sum;
}

/** Đúng bốn dữ kiện chạy vào điểm, không hơn. */
interface Features {
  rel: HanhRel;
  tamHop: boolean;
  lucXung: boolean;
  sameChi: boolean;
  diffGender: boolean;
  seed: number;
}

/** Năm trục theo đúng thứ tự công cụ hiển thị. */
const AXES = ['Tính cách', 'Giao tiếp', 'Mục tiêu', 'Tài chính', 'Gia đình'] as const;

function scoreAxes(f: Features): number[] {
  return [
    BASE + D_TINH_CACH[f.rel],
    BASE +
      (f.tamHop ? D_TAM_HOP_GT : f.lucXung ? D_LUC_XUNG_GT : 0) +
      (f.diffGender ? D_KHAC_GIOI : 0),
    BASE + (f.seed - SEED_OFFSET),
    BASE + D_TAI_CHINH[f.rel],
    BASE +
      (f.tamHop ? D_TAM_HOP_GD : 0) +
      (f.sameChi ? D_TRUNG_CHI_GD : 0) +
      (f.lucXung ? D_LUC_XUNG_GD : 0),
  ].map(clamp);
}
const overallOf = (s: number[]) => clamp(s.reduce((x, n) => x + n, 0) / s.length);

interface Person { birthDate: string; gender: 'male' | 'female' }
interface PairResult extends Features { chiA: Chi; chiB: Chi; scores: number[]; overall: number }

const chiOfDate = (d: string) => canChiOfYear(Number(d.slice(0, 4))).chi;

function scorePair(a: Person, b: Person): PairResult {
  const chiA = chiOfDate(a.birthDate);
  const chiB = chiOfDate(b.birthDate);
  const f: Features = {
    rel: hanhRelation(chiA, chiB),
    tamHop: isTamHop(chiA, chiB),
    lucXung: isLucXung(chiA, chiB),
    sameChi: chiA === chiB,
    diffGender: a.gender !== b.gender,
    seed: (dateSeed(a.birthDate) + dateSeed(b.birthDate)) % SEED_MOD,
  };
  const scores = scoreAxes(f);
  return { ...f, chiA, chiB, scores, overall: overallOf(scores) };
}

// ── Dữ kiện suy ra (không gõ tay con số nào) ────────────────────────────────

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
const TINH_CACH_VALUES = sortedUnique(ALL_CONFIGS.map((f) => scoreAxes(f)[0] ?? 0));

/** Cặp chi KHÁC nhau, và bao nhiêu cặp rơi vào nhánh ngũ hành "trung tính". */
const CHI_PAIRS = CHI.flatMap((a, i) => CHI.slice(i + 1).map((b) => [a, b] as const));
const NEUTRAL_PAIRS = CHI_PAIRS.filter(([a, b]) => hanhRelation(a, b) === 'neutral').length;

/** Lệch mốc Tết = bị gán chi của năm liền sau. Cặp chi LIỀN NHAU cùng một hành
 * thì quan hệ ngũ hành không đổi, nên "lệch một chi" KHÔNG luôn sai đủ bốn trục. */
const NEIGHBOUR_SAME_HANH = CHI.map(
  (c, i) => [c, CHI[(i + 1) % CHI.length] as Chi] as const,
).filter(([a, b]) => HANH_BY_CHI[a] === HANH_BY_CHI[b]);

// Ví dụ. Chỉ NGÀY SINH và giới tính là dữ kiện nhập; điểm do khối mirror tính.
// Cặp 1: lục xung nhưng CÙNG hành → bảng điểm tự mâu thuẫn.
const PAIR_XUNG_CUNG_HANH = scorePair(
  { birthDate: '1997-06-15', gender: 'male' },
  { birthDate: '1991-06-15', gender: 'female' },
);
// Cặp 2 và 3: CÙNG năm sinh (cùng chi), khác ngày → chỉ trục "Mục tiêu" đổi.
const PARTNER: Person = { birthDate: '1996-06-15', gender: 'female' };
const SEED_LOW = scorePair({ birthDate: '1990-01-05', gender: 'male' }, PARTNER);
const SEED_HIGH = scorePair({ birthDate: '1990-03-21', gender: 'male' }, PARTNER);

const GOAL_INDEX = AXES.indexOf('Mục tiêu');
const GOAL_LOW = SEED_LOW.scores[GOAL_INDEX] ?? 0;
const GOAL_HIGH = SEED_HIGH.scores[GOAL_INDEX] ?? 0;
const S_TINH_CACH = PAIR_XUNG_CUNG_HANH.scores[0] ?? 0;
const S_GIAO_TIEP = PAIR_XUNG_CUNG_HANH.scores[1] ?? 0;
const S_GIA_DINH = PAIR_XUNG_CUNG_HANH.scores[4] ?? 0;
const CHI_A = PAIR_XUNG_CUNG_HANH.chiA;
const CHI_B = PAIR_XUNG_CUNG_HANH.chiB;
const HANH_CHUNG = HANH_BY_CHI[CHI_A];

export function HopDoiFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn nhập ngày sinh hai người, bấm một nút, và nhận về một con số như{' '}
          {strong(`${PAIR_XUNG_CUNG_HANH.overall}/10`)}. Câu hỏi không ai trả lời giúp bạn: con số
          ấy đo cái gì, và nó có quyền nói gì về hai con người thật đang sống với nhau?
        </>
      }
      why={
        <>
          Vì đây là loại kết quả {strong('dễ bị dùng để ra quyết định lớn')} nhất — cưới hay không,
          hợp tác hay thôi. Một con số trông có vẻ chính xác thì rất dễ được tin quá mức nó xứng
          đáng, nhất là khi bạn đang phân vân sẵn.
        </>
      }
      what={
        <>
          Điểm hợp đôi là {strong('trung bình của năm trục')} chấm từ 1 đến 10. Bốn trục đọc ra từ
          đúng hai quan hệ giữa hai con giáp năm sinh; trục thứ năm chạy bằng một{' '}
          {strong('mã băm của hai chuỗi ngày sinh')}. Không lá số, không giờ sinh, không LLM.
        </>
      }
      how={
        <>
          Công cụ lấy con giáp theo năm sinh mỗi người, xem hai chi ấy{' '}
          {strong('cùng hành / sinh nhau / khắc nhau')}, rồi xem chúng{' '}
          {strong('tam hợp / lục xung / trùng chi')}. Cộng trừ từ điểm gốc {BASE}, cắt vào khoảng
          1–10, lấy trung bình. Vì biên cộng trừ hẹp, điểm tổng thực tế chỉ chạy trong khoảng{' '}
          {strong(`${OVERALL_MIN}–${OVERALL_MAX}`)}.
        </>
      }
      soWhat={
        <>
          Để bạn đọc kết quả đúng tầm của nó: con số đo {strong('mức giống hoặc bổ trợ')} trên vài
          trục hẹp, còn thứ giữ một mối quan hệ là cách hai người xử lý xung đột và mức cam kết —
          hai thứ mà phép tính {strong('không có dữ kiện nào để biết')}. Phần dùng được của công cụ
          nằm ở mô tả và gợi ý câu nói, không nằm ở con số.
        </>
      }
    />
  );
}

export function HopDoiDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="hop-doi"
        concept="Công cụ hợp đôi thật sự chấm cái gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi người có một con vật của năm sinh. Máy nhìn hai con vật xem chúng{' '}
                {strong('có hay chơi với nhau không')}, rồi cho điểm. Máy không biết hai người thật
                sự đối xử với nhau ra sao — nó chưa từng gặp họ.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Từ ngày sinh, công cụ chỉ lấy ra {strong('con giáp của năm')}. Rồi nó hỏi hai câu về
                hai con giáp đó: hai hành cùng nhau, sinh nhau hay khắc nhau; và chúng có tam hợp,
                lục xung hay trùng chi không. Hai câu trả lời ấy chạy bốn trục điểm. Trục thứ năm —
                “Mục tiêu” — không đọc từ can chi nào cả: nó là{' '}
                {strong('một mã băm của hai chuỗi ngày sinh')}. Cuối cùng máy lấy trung bình năm
                trục ra một con số.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Phép chấm là hàm thuần, tất định, {strong('không gọi LLM')}: mỗi trục bắt đầu ở{' '}
                  {BASE} rồi cộng trừ theo vài điều kiện, cắt vào 1–10, điểm tổng là trung bình làm
                  tròn. Vì biên cộng trừ hẹp, điểm tổng chỉ nhận được các giá trị{' '}
                  {strong(OVERALL_VALUES.join(', '))} — thang “trên 10” không bao giờ chạm hai đầu.
                </p>
                <p>
                  Một chi tiết đáng biết: trong {CHI_PAIRS.length} cặp chi khác nhau,{' '}
                  {strong(`${NEUTRAL_PAIRS} cặp`)} rơi vào nhánh “ngũ hành trung tính”. Nhánh
                  đó có trong mã nhưng {strong('không bao giờ chạy')}, vì hai hành khác nhau thì
                  luôn hoặc sinh hoặc khắc. Hệ quả: trục “Tính cách” chỉ nhận đúng{' '}
                  {TINH_CACH_VALUES.length} giá trị — {strong(TINH_CACH_VALUES.join(' hoặc '))}. Và
                  vì thang thật chỉ chạy {OVERALL_MIN}–{OVERALL_MAX}, điểm {OVERALL_MIN}/10 là{' '}
                  {strong('đáy thực tế của công cụ')} chứ không phải “gần đáy thang 10”.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="hop-doi"
        concept="Năm cái tên, nhưng không phải năm phép đo"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bảng điểm ghi năm dòng khác nhau, nghe như máy đã xem xét năm chuyện. Nhưng nhiều
                dòng {strong('chép lại từ cùng một câu trả lời')} — giống như hỏi một bạn năm lần
                rồi ghi thành năm ý kiến.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Năm trục tên là Tính cách, Giao tiếp, Mục tiêu, Tài chính, Gia đình — nghe như năm
                mặt khác nhau của một mối quan hệ. Nhưng Tính cách và Tài chính cùng đọc từ{' '}
                {strong('quan hệ ngũ hành')}; Giao tiếp và Gia đình cùng đọc từ{' '}
                {strong('tam hợp / lục xung')}. Nên khi hai chi khắc nhau, Tính cách và Tài chính
                cùng tụt một lượt — không phải vì hai chuyện đó cùng có vấn đề, mà vì chúng{' '}
                {strong('dùng chung một dữ kiện')}.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Đây là chỗ bảng điểm dễ gây hiểu nhầm nhất. Năm dòng trông như năm quan sát độc
                  lập, nên người đọc tự động thấy kết luận “được xác nhận nhiều lần”. Thực tế chỉ có{' '}
                  {strong('hai quan sát')} về hai con giáp, cộng một tham số giới tính chạm đúng một
                  trục, cộng một mã băm chạy trục còn lại.
                </p>
                <p>
                  Cặp {CHI_A} – {CHI_B} là ví dụ sạch nhất: hai chi này{' '}
                  {strong('cùng hành ' + HANH_CHUNG)} nên trục Tính cách được{' '}
                  {strong(String(S_TINH_CACH))}, nhưng chúng lại là một {strong('cặp lục xung')} nên
                  Giao tiếp còn {S_GIAO_TIEP} và Gia đình còn {S_GIA_DINH} — một bảng điểm{' '}
                  {strong('tự mâu thuẫn')}, và phép trung bình xoá sạch mâu thuẫn đó thành{' '}
                  {PAIR_XUNG_CUNG_HANH.overall}/10. Nói cho gọn: cả năm trục chỉ đang đo{' '}
                  {strong('mức giống nhau')} (cùng hành, trùng chi) và {strong('mức bổ trợ')} (ngũ
                  hành sinh, tam hợp) giữa hai ô trong bảng can chi — không phải giữa hai con người.
                </p>
              </>
            ),
          },
        ]}
      />

    </div>
  );
}

const RECALL_QUESTIONS: RecallQuestion[] = [
  {
    id: 'q1',
    type: 'open',
    prompt:
      'Trong bốn thứ bạn nhập vào công cụ — tên, ngày sinh, giờ sinh, giới tính — cái nào thật sự chạy vào điểm số?',
    answer: (
      <>
        {strong('Ngày sinh')} chạy vào theo hai đường: phần năm cho ra con giáp (thứ chi phối bốn
        trục), phần ngày và tháng chỉ vào mã băm của trục “Mục tiêu”. {strong('Giới tính')} chỉ được
        dùng ở một chỗ: khác giới thì trục “Giao tiếp” cộng {D_KHAC_GIOI} điểm. {strong('Tên')} chỉ
        để hiển thị. Còn {strong('giờ sinh')} — dù form có ô nhập và vẫn gửi lên máy chủ —{' '}
        {strong('không được phép chấm dùng tới')} lần nào.
      </>
    ),
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt:
      'Hai người cùng sinh năm 1990 nhưng khác ngày, cùng so với một người sinh 1996. Kết quả có khác nhau không?',
    choices: [
      {
        text: `Có — con giáp giống hệt nên bốn trục giữ nguyên, riêng “Mục tiêu” đổi từ ${GOAL_LOW} lên ${GOAL_HIGH}, kéo điểm tổng từ ${SEED_LOW.overall} lên ${SEED_HIGH.overall}`,
        correct: true,
        note: 'Đúng, và đây là phép thử đáng nhớ nhất của bài: hai người có cùng mọi dữ kiện huyền học vẫn nhận điểm tổng khác nhau, chỉ vì ngày trong tháng khác nhau. Con số nhúc nhích vì một lý do không liên quan gì tới hợp đôi.',
      },
      {
        text: 'Không — cùng con giáp thì mọi trục và điểm tổng đều y hệt',
        note: 'Không. Bốn trục thì y hệt thật, nhưng trục “Mục tiêu” chạy bằng mã băm của chuỗi ngày sinh nên đổi theo ngày và tháng.',
      },
      {
        text: 'Có — vì tuổi chênh nhau nên cung mệnh khác',
        note: 'Không — công cụ không dựng cung mệnh, không dựng lá số. Nó chỉ lấy con giáp theo năm.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: `Cặp ${CHI_A} – ${CHI_B} được ${S_TINH_CACH} điểm “Tính cách” nhưng chỉ ${S_GIAO_TIEP} điểm “Giao tiếp” và ${S_GIA_DINH} điểm “Gia đình”. Vì sao?`,
    choices: [
      {
        text: `Vì hai chi này cùng hành ${HANH_CHUNG} (kéo trục ngũ hành lên) nhưng lại là một cặp lục xung (kéo hai trục kia xuống)`,
        correct: true,
        note: `Đúng — hai quy tắc trong cùng một bảng nói ngược nhau về cùng một cặp. Phép trung bình gộp chúng thành ${PAIR_XUNG_CUNG_HANH.overall}/10, một con số không mô tả đúng bên nào cả.`,
      },
      {
        text: 'Vì công cụ đã cân nhắc rằng họ hợp tính nhưng khó nói chuyện',
        note: 'Không — công cụ không có dữ kiện nào về tính cách hay cách nói chuyện của hai người. Nó chỉ đang phát ra hai quy tắc bảng biểu mâu thuẫn nhau.',
      },
      {
        text: 'Vì giờ sinh của hai người lệch nhau',
        note: 'Không — giờ sinh không tham gia phép chấm.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: 'Vì sao một điểm hợp đôi rất cao vẫn không bảo chứng được một mối quan hệ tốt?',
    answer: (
      <>
        Vì đầu vào không chứa thông tin nào về hai người đang sống thế nào. Điểm cao chỉ nói được
        một câu: {strong('hai con giáp năm sinh rơi vào ô hợp của bảng')} — và hàng triệu người sinh
        cùng cặp năm ấy đều nhận đúng bốn trục giống hệt. Thứ thật sự giữ một mối quan hệ là{' '}
        {strong('cách hai người xử lý xung đột')} và {strong('mức cam kết')} họ chịu bỏ ra, mà không
        trục nào trong năm trục đo được vì công cụ không được nhập gì về chúng.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: `Bạn nhận ${OVERALL_MIN}/10 và thấy hoang mang, thậm chí nghĩ tới chuyện dừng lại. Nên làm gì?`,
    choices: [
      {
        text: 'Bỏ qua con số, đọc năm dòng mô tả và mang câu gợi ý ra nói chuyện thật với người kia',
        correct: true,
        note: 'Đúng. Phần dùng được của công cụ là mô tả và câu gợi ý — chúng là cớ để mở một cuộc nói chuyện, và giá trị của chúng không phụ thuộc vào việc điểm số có đúng hay không.',
      },
      {
        text: `Coi ${OVERALL_MIN}/10 là dấu hiệu nghiêm trọng vì nó gần đáy thang 10`,
        note: `Đọc sai đơn vị. Thang thật chỉ chạy ${OVERALL_MIN}–${OVERALL_MAX}, nên ${OVERALL_MIN} là đáy thực tế chứ không phải mức bất thường — phần lớn cặp lục xung khắc hành đều rơi vào đó.`,
      },
      {
        text: 'Nhập lại với giờ sinh khác để tìm kết quả tốt hơn',
        note: 'Không đổi được gì — giờ sinh không tham gia phép chấm, nên kết quả sẽ y nguyên.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt: 'Bạn sinh cuối tháng 1 dương lịch. Công cụ có lấy đúng con giáp của bạn không?',
    answer: (
      <>
        Không chắc — đây là một giới hạn thật. Phép chấm lấy con giáp theo{' '}
        {strong('năm dương lịch')} của ngày sinh, trong khi tục lệ đổi con giáp ở{' '}
        {strong('Tết âm lịch')}. Người sinh đầu năm dương trước Tết vì vậy bị gán con giáp của năm
        sau, {strong('lệch trọn một chi')} — mà lệch một chi thì có thể đổi cả quan hệ ngũ hành lẫn
        tam hợp / lục xung, tức {strong('sai tới bốn trong năm trục')}. Không phải lúc nào cũng đủ
        bốn: {NEIGHBOUR_SAME_HANH.length} trong {CHI.length} cặp chi liền nhau lại cùng một hành (
        {NEIGHBOUR_SAME_HANH.map(([x, y]) => `${x}–${y}`).join(', ')}), nên hai trục đọc ngũ hành có
        khi giữ nguyên.
      </>
    ),
  },
];

export function HopDoiRecall() {
  return <ActiveRecall topicId="hop-doi" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'definition',
    facet: 'Định nghĩa',
    can: 'Nói được điểm hợp đôi là trung bình của năm trục chấm từ 1 đến 10, và toàn bộ phần huyền học của nó chỉ dựa trên con giáp theo năm sinh của hai người.',
  },
  {
    id: 'inputs',
    facet: 'Đầu vào',
    can: 'Phân biệt được dữ kiện thật sự chạy vào điểm (năm sinh, ngày–tháng qua mã băm, giới tính giống hay khác) với dữ kiện chỉ nằm đó (tên hiển thị, giờ sinh không được dùng).',
  },
  {
    id: 'axes',
    facet: 'Năm trục',
    can: 'Chỉ ra mỗi trục đọc từ nguồn nào: Tính cách và Tài chính từ quan hệ ngũ hành, Giao tiếp và Gia đình từ tam hợp / lục xung / trùng chi, còn Mục tiêu từ mã băm ngày sinh.',
  },
  {
    id: 'hash-axis',
    facet: 'Trục không mang tin',
    can: 'Giải thích được vì sao trục “Mục tiêu” không nói gì về hai người, và chứng minh bằng hai người cùng năm sinh khác ngày lại ra điểm tổng khác nhau.',
  },
  {
    id: 'scale',
    facet: 'Thang điểm',
    can: 'Nhớ rằng điểm tổng chỉ chạy trong một dải hẹp chứ không phải 1–10 đầy đủ, nên không đọc điểm thấp như “gần chạm đáy” hay điểm cao như “gần tuyệt đối”.',
  },
  {
    id: 'averaging',
    facet: 'Trung bình che gì',
    can: 'Nêu được một cặp mà bảng điểm tự mâu thuẫn (một trục rất cao, hai trục rất thấp) và giải thích vì sao con số trung bình không mô tả đúng bên nào.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Nói rõ điểm cao không bảo chứng quan hệ tốt và điểm thấp không phải lý do chia tay, vì phép tính không có dữ kiện nào về cách hai người xử lý xung đột hay mức cam kết.',
  },
  {
    id: 'healthy-use',
    facet: 'Dùng lành mạnh',
    can: 'Mô tả được cách dùng có ích: bỏ qua vòng tròn điểm, đọc phần mô tả khác biệt, rồi mang câu gợi ý ra nói chuyện thật và xem phản ứng.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho một người bạn đang lo vì điểm thấp, trong một phút, bằng lời thường: con số ấy được tính từ đâu và vì sao nó không biết gì về hai người. Và nói được phần nào bạn chưa nắm — ví dụ vì sao hai chi lại được xếp là tam hợp hay lục xung — cùng bài nào trên hieu.asia lấp phần đó.',
  },
];

export function HopDoiChecklist() {
  return <UnderstandingChecklist topicId="hop-doi" facets={FACETS} />;
}

export function HopDoiWhys() {
  return (
    <FiveWhys
      topicId="hop-doi"
      start={
        <>
          Một cặp đang yêu nhau bình thường nhập ngày sinh vào công cụ và nhận{' '}
          {PAIR_XUNG_CUNG_HANH.overall}/10. Cả hai im lặng suốt buổi tối, rồi soi lại xem “dấu hiệu
          không hợp” nằm ở đâu.
        </>
      }
      chain={[
        {
          question: 'Vì sao lại ra đúng con số đó?',
          because: (
            <>
              Vì hai con giáp năm sinh của họ là {CHI_A} và {CHI_B} — một {strong('cặp lục xung')}.
              Quy tắc lục xung trừ điểm trục Giao tiếp và trục Gia đình, nên hai trục đó rơi xuống{' '}
              {S_GIAO_TIEP} và {S_GIA_DINH}, kéo trung bình xuống theo. Hết.
            </>
          ),
        },
        {
          question: 'Vì sao chỉ một quan hệ giữa hai con giáp lại kéo được nhiều trục cùng lúc?',
          because: (
            <>
              Vì các trục {strong('không độc lập với nhau')}: năm trục mang năm cái tên đời sống,
              nhưng bốn trong số đó đọc ra từ đúng hai quan hệ can chi. Một quan hệ đổi thì hai trục
              đổi theo — vì chúng dùng chung một nguồn dữ kiện, không phải vì hai mặt của đời sống
              cùng có vấn đề.
            </>
          ),
        },
        {
          question: 'Vì sao lại tách một nguồn dữ kiện thành năm cái tên?',
          because: (
            <>
              Vì {strong('một bảng năm dòng đọc thuyết phục hơn một dòng')}. “Hai chi này lục xung”
              là câu khô khan ai cũng biết cách bỏ qua. Còn một bảng có Tính cách, Giao tiếp, Mục
              tiêu, Tài chính, Gia đình thì trông như đã xem xét từ năm phía, và cảm giác được xác
              nhận nhiều lần khiến người đọc tin sâu hơn.
            </>
          ),
        },
        {
          question: 'Vì sao cảm giác ấy nguy hiểm hơn là vô hại?',
          because: (
            <>
              Vì nó {strong('thay câu hỏi')}. Câu hỏi thật của cặp đôi kia là “tuần rồi mình cãi
              nhau vì chuyện gì, và đã xử lý ra sao”. Con số thay nó bằng “tuổi tụi mình có hợp
              không” — nghe nghiêm trọng hơn nhưng không dẫn tới hành động nào.
            </>
          ),
        },
        {
          question: 'Vậy thứ gì mới quyết định mối quan hệ đó đi tới đâu?',
          because: (
            <>
              {strong('Cách hai người xử lý lúc bất đồng')} và {strong('mức cam kết')} họ chịu bỏ
              ra: ai chịu nói trước, có nghe hết câu không, có sửa thật không, có giữ lời không —
              những thứ thay đổi được bằng nỗ lực, và cũng chính là những thứ mà công cụ{' '}
              {strong('không được nhập một dữ kiện nào')} để mà biết.
            </>
          ),
        },
      ]}
      root={
        <>
          Điểm hợp đôi là bản tóm tắt hai quan hệ giữa hai con giáp, viết dưới dạng một con số. Hiểu
          tới đây thì bạn vẫn dùng công cụ được — nhưng dùng đúng chỗ có ích:{' '}
          {strong('đọc phần mô tả khác biệt')} và mang câu gợi ý ra nói chuyện.
        </>
      }
    />
  );
}
