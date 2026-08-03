/**
 * "Học chủ động" cho /learn/nghe-nghiep, kiêm nơi khai báo MIRROR của engine để
 * page.tsx dùng chung (một nguồn, không chép hai bản).
 *
 * CÔNG CỤ ĐÍCH /career-fit — trang công cụ chỉ dựng form rồi gửi
 * `POST /tools/career-fit`; engine ở repo backend, file
 * `infra/cloudflare/workers/api-gateway/src/tools/career-fit.ts`. Đọc code engine
 * (không đoán): đầu vào = ngày sinh + giới tính + ĐÚNG 5 lựa chọn tự khai; mỗi
 * nhóm nghề khởi đầu ở điểm nền 4 → cộng/trừ hệ số từng lựa chọn → cộng 1 nếu
 * mệnh (suy từ NĂM dương lịch) nằm trong mệnh ưu tiên của nhóm → làm tròn, kẹp
 * về 1–10 → xếp hạng 5 nhóm → lấy 3 nhóm đầu. KHÔNG mô hình ngôn ngữ (câu "vì
 * sao hợp" là chuỗi mẫu theo bậc điểm, phần lưu ý là 3 câu cố định); KHÔNG đọc
 * giờ sinh; ngày và tháng sinh bị bỏ qua; giới tính bắt buộc nhập nhưng KHÔNG
 * vào bất kỳ bước tính điểm nào.
 *
 * MIRROR: hằng số dưới đây chép đúng MỘT cột hệ số của engine (nhóm "Sáng tạo
 * độc lập") để bài TỰ TÍNH ví dụ thay vì gõ tay kết quả — engine đổi hệ số thì
 * phải sửa mirror.
 *
 * PHẠM VI: KHÔNG dạy lại MBTI / DISC / Big Five (mỗi hệ có bài riêng, chỉ link);
 * KHÔNG lấn /learn/ra-quyet-dinh và /learn/so-sanh-lang-kinh.
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
import { canChiOfYear } from '@/lib/xem-tuoi-cuoi';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── Mirror của engine ────────────────────────────────────────────────

/** Điểm nền mà MỌI nhóm nghề khởi đầu, trước khi cộng hệ số. */
export const BASELINE = 4;
/** Điểm thưởng khi mệnh của người dùng nằm trong mệnh ưu tiên của nhóm. */
export const ELEMENT_BONUS = 1;
/** Hai đầu thang hiển thị — engine kẹp mọi điểm thô vào khoảng này. */
export const SCORE_MIN = 1;
export const SCORE_MAX = 10;
/** Số nhóm được đưa lên phần nổi bật của kết quả. */
export const TOP_N = 3;

export type PrefKey =
  | 'autonomyLevel' | 'riskAppetite' | 'socialIntensity' | 'creativityLevel' | 'structurePreference';

/** Một lựa chọn tự khai; `coeff` là hệ số của nó với nhóm mẫu (cột được mirror). */
export interface PrefOption { value: string; label: string; coeff: number }
export interface PrefGroup { key: PrefKey; label: string; options: PrefOption[] }

/**
 * Năm câu tự khai — toàn bộ phần "bạn" trong đầu vào. Nhãn lấy đúng chữ trên
 * trang /career-fit; hệ số lấy đúng cột nhóm "Sáng tạo độc lập" của engine.
 */
const PREF_ROWS: [PrefKey, string, [string, string, number][]][] = [
  ['autonomyLevel', 'Mức tự chủ bạn muốn', [['low', 'Có người dẫn dắt', -2], ['medium', 'Vừa đủ', 0], ['high', 'Tự chủ tối đa', 3]]],
  ['riskAppetite', 'Mức chấp nhận rủi ro', [['low', 'Thấp — cần ổn định', -2], ['medium', 'Trung bình', 0], ['high', 'Cao — đổi lấy upside', 2]]],
  ['socialIntensity', 'Cường độ giao tiếp', [['solo', 'Một mình', 3], ['team', 'Nhóm nhỏ', 0], ['large_org', 'Tổ chức lớn', -2]]],
  ['creativityLevel', 'Mức sáng tạo', [['low', 'Thấp — theo chuẩn', -3], ['medium', 'Trung bình', 1], ['high', 'Cao — sáng tạo là cốt', 3]]],
  ['structurePreference', 'Mức cấu trúc bạn thích', [['rigid', 'Chặt chẽ', -2], ['flexible', 'Linh hoạt', 1], ['chaotic_ok', 'Hỗn loạn cũng ok', 2]]],
];

export const PREF_GROUPS: PrefGroup[] = PREF_ROWS.map(([key, label, opts]) => ({
  key,
  label,
  options: opts.map(([value, optLabel, coeff]) => ({ value, label: optLabel, coeff })),
}));

/** `elements` = mệnh được cộng thưởng; `examples` = vài nghề (công cụ hiện nhiều hơn). */
export interface CategoryDef { name: string; elements: string[]; examples: string }

/** Năm nhóm nghề mà công cụ luôn xếp hạng — danh sách đóng, không tuỳ biến. */
export const CATEGORIES: CategoryDef[] = [
  { name: 'Sáng tạo độc lập', elements: ['Mộc', 'Hỏa'], examples: 'freelance thiết kế, viết lách, nhiếp ảnh, studio một người' },
  { name: 'Vận hành quy trình', elements: ['Thổ', 'Kim'], examples: 'vận hành, quản lý dự án, kế toán, kiểm soát chất lượng, logistics' },
  { name: 'Bán hàng quan hệ', elements: ['Hỏa', 'Thủy'], examples: 'account manager, sales, phát triển kinh doanh, đối tác chiến lược' },
  { name: 'Phân tích kỹ thuật', elements: ['Kim', 'Thủy'], examples: 'lập trình, phân tích dữ liệu, kỹ sư, nghiên cứu phát triển' },
  { name: 'Lãnh đạo người', elements: ['Hỏa', 'Thổ'], examples: 'trưởng nhóm, trưởng phòng, quản lý chi nhánh, chủ doanh nghiệp nhỏ' },
];

/** Nhóm dùng làm cột mẫu — cũng là nhóm mà mirror hệ số thuộc về. */
export const SAMPLE_CATEGORY = CATEGORIES[0];

/** Mệnh suy từ địa chi, đúng bảng engine dùng (không phải nạp âm). */
const ELEMENT_BY_CHI: Record<string, string> = {
  Tý: 'Thủy', Hợi: 'Thủy', Dần: 'Mộc', Mão: 'Mộc', Tỵ: 'Hỏa', Ngọ: 'Hỏa',
  Thân: 'Kim', Dậu: 'Kim', Thìn: 'Thổ', Tuất: 'Thổ', Sửu: 'Thổ', Mùi: 'Thổ',
};

// ── Dữ kiện suy ra (không gõ tay con số nào) ─────────────────────────

const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);

const MAX_PREF_TOTAL = sum(PREF_GROUPS.map((g) => Math.max(...g.options.map((o) => o.coeff))));
const MIN_PREF_TOTAL = sum(PREF_GROUPS.map((g) => Math.min(...g.options.map((o) => o.coeff))));

/** Bề rộng ảnh hưởng của 5 câu tự khai, tính bằng điểm. */
export const PREF_SWING = MAX_PREF_TOTAL - MIN_PREF_TOTAL;
/** Số lần mà 5 câu tự khai nặng hơn điểm thưởng mệnh. */
export const SWING_VS_ELEMENT = PREF_SWING / ELEMENT_BONUS;

/** Hai đầu của điểm THÔ, trước khi kẹp về thang hiển thị. */
export const RAW_MAX = BASELINE + MAX_PREF_TOTAL + ELEMENT_BONUS;
export const RAW_MIN = BASELINE + MIN_PREF_TOTAL;
export const RAW_SPAN = RAW_MAX - RAW_MIN;
/** Bao nhiêu giá trị điểm thô cùng bị đẩy về đúng một bậc ở mỗi đầu thang. */
export const RAW_AT_CEILING = RAW_MAX - SCORE_MAX + 1;
export const RAW_AT_FLOOR = SCORE_MIN - RAW_MIN + 1;

/** Mệnh mà engine gán cho một năm sinh dương lịch. */
function elementOfYear(year: number): string {
  return ELEMENT_BY_CHI[canChiOfYear(year).chi] ?? 'Thổ';
}

/** Làm tròn rồi kẹp — đúng hàm clamp của engine. */
function clampScore(raw: number): number {
  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, Math.round(raw)));
}

/** Nhãn tiếng Việt của một lựa chọn, để bảng ví dụ không phải gõ lại. */
export function pickLabel(key: PrefKey, value: string): string {
  const group = PREF_GROUPS.find((g) => g.key === key);
  return group?.options.find((o) => o.value === value)?.label ?? '—';
}

const BIRTH_YEAR = 1998;

/** Ba hồ sơ ví dụ — cùng năm sinh, chỉ khác phần tự khai. */
const PROFILE_ROWS: [string, [string, string, string, string, string]][] = [
  ['Mai', ['high', 'high', 'solo', 'high', 'chaotic_ok']],
  ['Mai (đổi đúng một câu)', ['high', 'medium', 'solo', 'high', 'chaotic_ok']],
  ['Nam', ['medium', 'medium', 'team', 'medium', 'flexible']],
];

export const SCORED_PROFILES = PROFILE_ROWS.map(([name, values]) => {
  const picks = Object.fromEntries(
    PREF_GROUPS.map((g, i) => [g.key, values[i] ?? '']),
  ) as Record<PrefKey, string>;
  const prefTotal = sum(
    PREF_GROUPS.map((g) => g.options.find((o) => o.value === picks[g.key])?.coeff ?? 0),
  );
  const element = elementOfYear(BIRTH_YEAR);
  const bonus = SAMPLE_CATEGORY?.elements.includes(element) ? ELEMENT_BONUS : 0;
  const raw = BASELINE + prefTotal + bonus;
  return { name, picks, element, raw, score: clampScore(raw) };
});

const CASE_A = SCORED_PROFILES[0];
const CASE_A2 = SCORED_PROFILES[1];
const CASE_B = SCORED_PROFILES[2];

/** Mệnh của cùng một người nếu tính theo năm âm lịch (sinh trước Tết). */
export const BIRTH_YEAR_SAMPLE = BIRTH_YEAR;
export const CHI_BY_SOLAR_YEAR = canChiOfYear(BIRTH_YEAR).chi;
export const CHI_BY_LUNAR_YEAR = canChiOfYear(BIRTH_YEAR - 1).chi;
export const ELEMENT_BY_SOLAR_YEAR = elementOfYear(BIRTH_YEAR);
export const ELEMENT_BY_LUNAR_YEAR = elementOfYear(BIRTH_YEAR - 1);

export function NgheNghiepFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn làm một bài trắc nghiệm hướng nghiệp, nhận về {strong('ba nhóm nghề')} kèm điểm số, rồi
          đứng hình: có nên nghỉ việc theo nó không? Nếu bài khác cho kết quả khác thì tin bài nào? Và
          vì sao một cái máy chưa từng gặp bạn lại dám xếp hạng cả sự nghiệp của bạn?
        </>
      }
      why={
        <>
          Vì loại kết quả này {strong('rất dễ bị đọc quá tay')}. Nó được trình bày như một đáp án — có
          thứ hạng, có điểm trên thang mười — trong khi thứ nó đo được chỉ là mấy câu bạn vừa tự khai
          về cách mình thích làm việc. Đọc sai một lần ở đây có thể đổi cả một quyết định lớn.
        </>
      }
      what={
        <>
          Mọi mô hình gợi ý nghề đều đo {strong('sở thích và thiên hướng')} — bạn muốn tự chủ tới đâu,
          chịu được rủi ro tới đâu, thích làm việc một mình hay giữa đám đông. Chúng{' '}
          {strong('không đo năng lực')} và càng không dự báo thành công. Công cụ Nhóm Nghề của
          hieu.asia cũng vậy: {PREF_GROUPS.length} câu tự khai cộng một tín hiệu nhẹ từ năm sinh.
        </>
      }
      how={
        <>
          Mỗi nhóm nghề khởi đầu ở điểm nền {BASELINE}; mỗi câu bạn chọn cộng hoặc trừ một hệ số cố
          định; mệnh khớp thì cộng thêm {ELEMENT_BONUS}; cuối cùng kẹp về thang{' '}
          {SCORE_MIN}–{SCORE_MAX}, xếp hạng {CATEGORIES.length} nhóm rồi lấy {TOP_N} nhóm đầu. Không
          bí ẩn — đây là {strong('một phép cộng')}.
        </>
      }
      soWhat={
        <>
          Để bạn đọc kết quả như đọc một {strong('phân bố')} chứ không phải một đáp án: nhìn cả dải
          điểm thay vì chỉ nhìn nhóm đứng đầu, biết chênh lệch nhỏ thì không có nghĩa, và{' '}
          {strong('không lấy một dòng chữ làm lý do bỏ dở')} thứ mình đang xây.
        </>
      }
    />
  );
}

export function NgheNghiepDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="nghe-nghiep"
        concept="Mô hình gợi ý nghề đo cái gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bài test hỏi bạn {strong('thích chơi kiểu nào')} — một mình hay theo nhóm, thích vẽ
                hay thích xếp đồ cho ngay ngắn. Rồi nó nói: những bạn thích giống bạn hay chọn mấy
                việc này. Nó không biết bạn {strong('làm giỏi')} tới đâu, vì nó chưa thấy bạn làm bao
                giờ.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mọi bài trắc nghiệm hướng nghiệp đều đi qua đúng một cửa: {strong('bạn tự khai')}.
                  Nó không đo được bạn viết code nhanh hay chậm, thuyết trình có thuyết phục không,
                  chịu áp lực tới đâu — nó chỉ ghi lại điều bạn nói là mình thích.
                </p>
                <p>
                  Vì vậy phát biểu đúng của kết quả là{' '}
                  {strong('“nghề này hợp với kiểu làm việc bạn mô tả”')}, chứ không phải “bạn sẽ giỏi
                  nghề này” và cũng không phải “bạn sẽ thành công ở nghề này”. Ba câu đó khác nhau rất
                  xa.
                </p>
              </>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <p>
                Sở thích tương đối ổn định nên đo được bằng bảng hỏi; năng lực thì phải đo bằng{' '}
                {strong('mẫu công việc thật')} — bài tập, sản phẩm, kỳ thử việc, và không bảng hỏi nào
                thay được phần đó. Thêm một lớp nữa: kết quả nói về{' '}
                {strong('cái bạn tin về mình')} tại thời điểm điền chứ không phải về bạn. Tâm trạng,
                công việc đang chán, hay câu hỏi đặt hơi khác đi đều làm câu trả lời trượt — và điểm
                số trượt theo.
              </p>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="nghe-nghiep"
        concept="Phần quyết định sự nghiệp nằm ngoài mọi bài test"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bạn có thể rất thích đá bóng. Nhưng đá giỏi hay không còn tuỳ{' '}
                {strong('bạn tập bao nhiêu buổi')}, đội nào nhận bạn, và ai dạy bạn. Bài test chỉ biết
                bạn thích, nó không biết mấy chuyện kia.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Bốn thứ mà không bảng hỏi nào nhìn thấy: {strong('thị trường')} đang tuyển gì,{' '}
                {strong('cơ hội')} nào tình cờ mở ra, {strong('người dẫn dắt')} bạn gặp được, và{' '}
                {strong('số giờ')} bạn đã thật sự bỏ vào việc. Ba thứ đầu phần lớn nằm ngoài tầm kiểm
                soát của bạn; thứ tư thì hoàn toàn trong tay bạn — và đó là lý do một kết quả “không
                hợp” không đáng để bỏ dở việc đang làm.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <p>
                Sở thích giải thích được vì sao bạn {strong('trụ lại')} với một việc, chứ không giải
                thích vì sao bạn giỏi việc đó — thứ tự nhân quả thường ngược với trực giác: làm nhiều
                thì giỏi lên, giỏi lên thì thấy thích. Vậy nên cách dùng đúng của một trắc nghiệm
                hướng nghiệp là {strong('rút ngắn danh sách để đi thử')}, không phải chốt danh sách:
                một hướng chỉ được loại sau khi bạn đã thử nó bằng công việc thật.
              </p>
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
    prompt: 'Trắc nghiệm hướng nghiệp đo được cái gì — và KHÔNG đo được cái gì?',
    answer: (
      <>
        Nó đo {strong('sở thích và thiên hướng')}: bạn muốn tự chủ tới đâu, chịu rủi ro tới đâu, thích
        làm việc một mình hay giữa đám đông. Nó {strong('không đo năng lực')} vì chưa từng thấy bạn
        làm việc thật, và không dự báo thành công vì thành công còn phụ thuộc thị trường, cơ hội,
        người dẫn dắt và số giờ bạn bỏ ra. Phát biểu đúng là “hợp với kiểu làm việc bạn mô tả”, không
        phải “bạn sẽ giỏi” hay “bạn sẽ thành công”.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Công cụ Nhóm Nghề của hieu.asia dựa vào những dữ kiện nào để chấm điểm?',
    choices: [
      {
        text: `${PREF_GROUPS.length} lựa chọn bạn tự khai về cách làm việc, cộng một điểm thưởng nhỏ nếu mệnh (suy từ NĂM sinh) khớp nhóm`,
        correct: true,
        note: `Đúng — điểm nền ${BASELINE} cho mọi nhóm, cộng trừ theo ${PREF_GROUPS.length} câu tự khai, cộng ${ELEMENT_BONUS} nếu mệnh khớp, rồi kẹp về ${SCORE_MIN}–${SCORE_MAX}.`,
      },
      {
        text: 'Lá số đầy đủ theo giờ sinh, có phân tích cung Quan Lộc',
        note: 'Không — công cụ này không hỏi giờ sinh. Cung Quan Lộc thuộc công cụ Tử Vi nghề nghiệp, một phép khác hẳn.',
      },
      {
        text: 'Một mô hình ngôn ngữ đọc hồ sơ rồi viết nhận xét riêng cho bạn',
        note: 'Không — điểm số, thứ hạng và cả câu “vì sao hợp” đều là phép cộng và chuỗi mẫu chọn theo bậc điểm.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: `Nhóm A được ${SCORE_MAX}/${SCORE_MAX}, nhóm B được ${SCORE_MAX - 1}/${SCORE_MAX}. Kết luận nào đúng?`,
    choices: [
      {
        text: 'Hai nhóm gần như ngang nhau — đổi một câu trả lời là chúng hoán chỗ, nên coi cả hai là hướng đáng thử',
        correct: true,
        note: `Đúng. Riêng điểm thưởng mệnh đã là ${ELEMENT_BONUS} điểm, đủ để đảo thứ hạng của hai nhóm cách nhau đúng chừng đó.`,
      },
      {
        text: 'A hợp hơn B một cách rõ ràng, nên tập trung vào A',
        note: 'Không — chênh lệch một điểm nằm trong sai số của chính cách chấm, chưa kể điểm còn bị làm tròn và bị kẹp.',
      },
      {
        text: `B bị loại vì không nằm trong ${TOP_N} nhóm đầu`,
        note: `Sai ở dữ kiện: ${SCORE_MAX - 1} điểm gần như chắc chắn vẫn nằm trong ${TOP_N} nhóm đầu. Và “không vào top” cũng không có nghĩa là bị loại.`,
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt: `Vì sao hai người cùng nhận ${SCORE_MAX}/${SCORE_MAX} vẫn có thể khác nhau khá xa?`,
    answer: (
      <>
        Vì thang hiển thị hẹp hơn phép tính. Ở nhóm mẫu, điểm thô chạy từ {RAW_MIN} tới {RAW_MAX},
        rộng {RAW_SPAN} điểm, rồi bị kẹp về {SCORE_MIN}–{SCORE_MAX}. Kết quả là{' '}
        {strong(RAW_AT_CEILING + ' giá trị thô khác nhau')} cùng hiện thành {SCORE_MAX}/{SCORE_MAX}.
        Trong ví dụ của bài, {CASE_A?.name} được {CASE_A?.raw} điểm thô và hiện {CASE_A?.score}; đổi
        đúng một câu trả lời còn {CASE_A2?.raw} điểm thô thì màn hình vẫn ghi{' '}
        {CASE_A2?.score}/{SCORE_MAX}.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Trong đầu vào của công cụ, dữ kiện nào KHÔNG hề tham gia vào điểm số?',
    choices: [
      {
        text: 'Giới tính — bắt buộc nhập nhưng không xuất hiện ở bất kỳ bước tính điểm nào',
        correct: true,
        note: 'Đúng. Ngày và tháng sinh cũng vậy: chỉ NĂM được dùng, để suy ra mệnh.',
      },
      {
        text: 'Mức chấp nhận rủi ro',
        note: 'Không — đây là một trong năm câu tự khai, và nó cộng trừ điểm ở cả năm nhóm.',
      },
      {
        text: 'Năm sinh',
        note: `Không — năm sinh được dùng để suy ra mệnh, thứ mang lại điểm thưởng ${ELEMENT_BONUS} khi khớp nhóm.`,
      },
    ],
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt:
      'Bạn đang theo một nghề được hai năm thì làm bài test, và nghề đó chỉ đứng thứ tư trong bảng. Nên làm gì?',
    choices: [
      {
        text: 'Giữ nguyên hướng đang đi, dùng kết quả để tìm phần việc trong nghề hợp với mình hơn',
        correct: true,
        note: 'Đúng. Hai năm là số giờ đã tích luỹ thật — bài test không nhìn thấy nó, nên không đủ tư cách xoá nó.',
      },
      {
        text: 'Bỏ ngay để chuyển sang nhóm đứng đầu bảng',
        note: 'Không. Bảng xếp hạng đo sở thích tự khai; đổi hướng vì nó là đánh đổi một tài sản thật lấy một dòng chữ.',
      },
      {
        text: 'Làm lại bài test tới khi nghề mình đang theo lên đầu bảng',
        note: 'Cũng không. Điền lại để ra kết quả mong muốn thì kết quả hết giá trị — bạn chỉ đang tự xác nhận lựa chọn có sẵn.',
      },
    ],
  },
];

export function NgheNghiepRecall() {
  return <ActiveRecall topicId="nghe-nghiep" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'what-it-measures',
    facet: 'Đo cái gì',
    can: 'Nói được trắc nghiệm hướng nghiệp đo sở thích và thiên hướng tự khai, không đo năng lực và không dự báo thành công — ba phát biểu khác hẳn nhau.',
  },
  {
    id: 'tool-input',
    facet: 'Công cụ đọc gì',
    can: `Kể đúng đầu vào của công cụ Nhóm Nghề: ${PREF_GROUPS.length} lựa chọn tự khai cộng năm sinh; không có giờ sinh; giới tính bắt nhập nhưng không vào điểm.`,
  },
  {
    id: 'tool-math',
    facet: 'Công cụ tính ra sao',
    can: `Mô tả được phép cộng: điểm nền ${BASELINE} cho mỗi nhóm, cộng trừ theo từng lựa chọn, cộng ${ELEMENT_BONUS} nếu mệnh khớp, kẹp về ${SCORE_MIN}–${SCORE_MAX} rồi xếp hạng ${CATEGORIES.length} nhóm.`,
  },
  {
    id: 'distribution',
    facet: 'Phân bố, không phải đáp án',
    can: `Giải thích vì sao phải đọc cả dải điểm chứ không chỉ nhóm đứng đầu, và vì sao chênh lệch ${ELEMENT_BONUS} điểm giữa hai nhóm gần như không mang thông tin.`,
  },
  {
    id: 'clamp',
    facet: 'Thang điểm mất thông tin',
    can: `Chỉ ra rằng điểm thô rộng hơn thang hiển thị nên ${RAW_AT_CEILING} giá trị thô khác nhau cùng hiện thành ${SCORE_MAX}/${SCORE_MAX} — điểm tối đa không có nghĩa là hoàn hảo.`,
  },
  {
    id: 'cross-check',
    facet: 'Đối chiếu nhiều nguồn',
    can: 'Biết cách gộp gợi ý từ nhiều bài: giữ phần trùng nhau, biến phần khác nhau thành một phép thử có thời hạn thay vì chọn bài dễ nghe nhất.',
  },
  {
    id: 'outside-the-test',
    facet: 'Phần nằm ngoài bài test',
    can: 'Kể được bốn thứ quyết định sự nghiệp mà không bảng hỏi nào nhìn thấy: thị trường, cơ hội, người dẫn dắt và số giờ đã bỏ ra.',
  },
  {
    id: 'not-an-exit',
    facet: 'Không dùng làm cái cớ',
    can: 'Nói được vì sao một kết quả “không hợp” không phải lý do bỏ dở việc đang làm, và vì sao làm lại bài tới khi ra kết quả mong muốn thì kết quả hết giá trị.',
  },
];

export function NgheNghiepChecklist() {
  return <UnderstandingChecklist topicId="nghe-nghiep" facets={FACETS} />;
}

export function NgheNghiepWhys() {
  return (
    <FiveWhys
      topicId="nghe-nghiep"
      start={
        <>
          {CASE_B?.name} làm bài trắc nghiệm hướng nghiệp, thấy nhóm mình đang theo đuổi chỉ được{' '}
          {CASE_B?.score}/{SCORE_MAX} trong khi một nhóm khác được {CASE_A?.score}/{SCORE_MAX}. Anh
          nộp đơn nghỉ việc ngay tuần đó.
        </>
      }
      chain={[
        {
          question: 'Vì sao hai con số đó lại khác nhau?',
          because: (
            <>
              Vì {CASE_B?.name} chọn {strong('phương án ở giữa')} ở cả {PREF_GROUPS.length} câu, còn
              hồ sơ kia chọn phương án cực ở cả {PREF_GROUPS.length} câu. Toàn bộ chênh lệch đến
              từ đó — {strong('không có dữ kiện nào khác')} tham gia.
            </>
          ),
        },
        {
          question: 'Vì sao vài lựa chọn lại tạo ra chênh lệch lớn tới vậy?',
          because: (
            <>
              Vì mỗi lựa chọn cộng hoặc trừ một hệ số cố định, và {PREF_GROUPS.length} câu cộng lại có
              thể dịch chuyển tới {strong(PREF_SWING + ' điểm')} — rộng hơn cả thang hiển thị. Con số
              trông “khoa học” chỉ vì nó là một phép cộng, chứ không vì nó đo được điều gì sâu xa.
            </>
          ),
        },
        {
          question: 'Vì sao một phép cộng như vậy vẫn được đọc như một lời phán?',
          because: (
            <>
              Vì {strong('hình thức của con số')} đánh lừa: có thang mười, có thứ hạng — trông giống
              kết quả xét nghiệm. Nhưng xét nghiệm đo một đại lượng ngoài đời, còn ở đây đầu vào chính
              là câu bạn vừa tự khai. Máy chỉ sắp lại chính lời bạn nói.
            </>
          ),
        },
        {
          question: `Vì sao ${CASE_B?.name ?? 'người ấy'} lại thấy nó đáng tin hơn hai năm kinh nghiệm của mình?`,
          because: (
            <>
              Vì kinh nghiệm thì mơ hồ và có cả ngày tệ lẫn ngày ổn, còn con số thì{' '}
              {strong('gọn và dứt khoát')}. Khi đang mệt, người ta bám vào cái dứt khoát. Đó cũng là
              lúc dễ đọc một gợi ý thành một sự cho phép — nó không xui bạn nghỉ việc, nó chỉ tiện tay
              cho bạn một lý do.
            </>
          ),
        },
        {
          question: 'Vậy điều gì đã bị bỏ ra ngoài phép tính?',
          because: (
            <>
              {strong('Số giờ đã bỏ ra')} — thứ duy nhất trong bốn yếu tố quyết định mà anh kiểm soát
              được, và cũng là thứ bài test hoàn toàn không nhìn thấy. Cùng với nó là thị trường đang
              tuyển gì, cơ hội nào đang mở và ai đang sẵn sàng dẫn dắt anh.
            </>
          ),
        },
      ]}
      root={
        <>
          Một gợi ý nghề là {strong('điểm khởi đầu để đi thử')}, không phải giấy phép để dừng. Cách
          dùng lành mạnh: giữ việc đang làm, cắt ra một phép thử có thời hạn cho hướng mới, và để{' '}
          {strong('kết quả của phép thử')} — chứ không phải điểm số — quyết định bước tiếp theo.
        </>
      }
    />
  );
}
