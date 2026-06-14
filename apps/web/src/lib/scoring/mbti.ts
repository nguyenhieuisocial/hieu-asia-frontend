// hieu.asia — MBTI (Jung-based) scoring + question set.
//
// Self-contained: the 24-item Likert quiz (6 per axis) + the scorer that maps
// answers → a 4-letter type. Mirrors lib/scoring/disc.ts in shape. (24 items
// gives steadier results for near-neutral profiles than the old 16.)
//
// NOT licensed MBTI® — these are open self-reflection items grounded in the four
// Jungian dichotomies (E/I · S/N · T/F · J/P), phrased as "không bói toán":
// tendencies on a spectrum, not fixed labels. The deep reading is generated
// server-side from the resulting type (`/tools/mbti-read`, corpus/mbti).

import type { QuizPage, QuizChoice } from '@/components/tools/PersonalityQuiz';

export type MbtiAxis = 'EI' | 'SN' | 'TF' | 'JP';

// Each axis has a positive pole (high Likert agreement on a `pos` item → this
// letter) and a negative pole. Order here = order of letters in the final type.
const AXIS_POLES: Record<MbtiAxis, { positive: string; negative: string }> = {
  EI: { positive: 'E', negative: 'I' },
  SN: { positive: 'S', negative: 'N' },
  TF: { positive: 'T', negative: 'F' },
  JP: { positive: 'J', negative: 'P' },
};
const AXIS_ORDER: MbtiAxis[] = ['EI', 'SN', 'TF', 'JP'];

interface MbtiItem {
  name: string;
  axis: MbtiAxis;
  toward: 'pos' | 'neg'; // which pole high agreement (5) leans toward
  title: string;
}

// 24 items, 6 per axis, balanced 3 `pos` / 3 `neg` to cut acquiescence bias.
// Ordered axis-interleaved so each page of 4 mixes all four axes (no page
// telegraphs a single axis).
export const QUESTIONS: MbtiItem[] = [
  // — page 1 —
  { name: 'mbti_ei_01', axis: 'EI', toward: 'pos', title: 'Tôi thấy được tiếp thêm năng lượng sau khi gặp gỡ và trò chuyện với nhiều người.' },
  { name: 'mbti_sn_01', axis: 'SN', toward: 'pos', title: 'Tôi tin vào dữ kiện cụ thể và kinh nghiệm thực tế hơn là linh cảm.' },
  { name: 'mbti_tf_01', axis: 'TF', toward: 'pos', title: 'Khi quyết định, tôi ưu tiên logic và sự nhất quán hơn là cảm xúc.' },
  { name: 'mbti_jp_01', axis: 'JP', toward: 'pos', title: 'Tôi thích lên kế hoạch và chốt mọi việc sớm, gọn gàng.' },
  // — page 2 —
  { name: 'mbti_ei_02', axis: 'EI', toward: 'pos', title: 'Tôi thường nghĩ thành lời — vừa nói vừa làm rõ suy nghĩ của mình.' },
  { name: 'mbti_sn_02', axis: 'SN', toward: 'pos', title: 'Tôi chú ý tới chi tiết và các bước thực hiện rõ ràng.' },
  { name: 'mbti_tf_02', axis: 'TF', toward: 'pos', title: 'Tôi thấy bình thường khi phân tích đúng–sai một cách thẳng thắn, khách quan.' },
  { name: 'mbti_jp_02', axis: 'JP', toward: 'pos', title: 'Tôi thấy dễ chịu khi mọi thứ được sắp xếp và biết trước điều gì sẽ tới.' },
  // — page 3 —
  { name: 'mbti_ei_03', axis: 'EI', toward: 'neg', title: 'Sau một ngày nhiều tương tác, tôi cần ở một mình để hồi lại sức.' },
  { name: 'mbti_sn_03', axis: 'SN', toward: 'neg', title: 'Tôi thường bị cuốn vào ý tưởng, khả năng và bức tranh tương lai.' },
  { name: 'mbti_tf_03', axis: 'TF', toward: 'neg', title: 'Tôi cân nhắc kỹ quyết định của mình ảnh hưởng thế nào tới cảm xúc người khác.' },
  { name: 'mbti_jp_03', axis: 'JP', toward: 'neg', title: 'Tôi thích để ngỏ lựa chọn và linh hoạt theo tình huống.' },
  // — page 4 —
  { name: 'mbti_ei_04', axis: 'EI', toward: 'neg', title: 'Tôi thích suy nghĩ thật kỹ trong đầu trước khi lên tiếng.' },
  { name: 'mbti_sn_04', axis: 'SN', toward: 'neg', title: 'Tôi hay đọc ra ý nghĩa hoặc mẫu hình ẩn phía sau sự việc.' },
  { name: 'mbti_tf_04', axis: 'TF', toward: 'neg', title: 'Sự hoà hợp và giá trị con người thường dẫn dắt lựa chọn của tôi.' },
  { name: 'mbti_jp_04', axis: 'JP', toward: 'neg', title: 'Tôi làm việc tốt nhất khi được ứng biến, hơn là bám một kế hoạch cứng.' },
  // — page 5 —
  { name: 'mbti_ei_05', axis: 'EI', toward: 'pos', title: 'Tôi dễ bắt chuyện với người lạ và thấy thoải mái giữa đám đông.' },
  { name: 'mbti_sn_05', axis: 'SN', toward: 'pos', title: 'Tôi nhớ rõ chi tiết cụ thể (con số, việc đã xảy ra) hơn là ấn tượng chung chung.' },
  { name: 'mbti_tf_05', axis: 'TF', toward: 'pos', title: 'Tôi thấy một lời góp ý thẳng thắn thường hữu ích hơn một lời an ủi.' },
  { name: 'mbti_jp_05', axis: 'JP', toward: 'pos', title: 'Tôi hay lập danh sách việc cần làm và thấy thoả mãn khi gạch xong từng mục.' },
  // — page 6 —
  { name: 'mbti_ei_06', axis: 'EI', toward: 'neg', title: 'Tôi thích trò chuyện sâu 1-1 hơn là dự tiệc đông người.' },
  { name: 'mbti_sn_06', axis: 'SN', toward: 'neg', title: 'Tôi hay nghĩ về "sẽ ra sao nếu…" và những khả năng chưa xảy ra.' },
  { name: 'mbti_tf_06', axis: 'TF', toward: 'neg', title: 'Trước khi phản hồi, tôi cân nhắc người kia sẽ cảm thấy thế nào.' },
  { name: 'mbti_jp_06', axis: 'JP', toward: 'neg', title: 'Tôi thường quyết vào phút chót mà vẫn xoay xở tốt.' },
];

const likert = (): QuizChoice[] => [
  { value: 1, text: 'Rất không đồng ý' },
  { value: 2, text: 'Không đồng ý' },
  { value: 3, text: 'Trung lập' },
  { value: 4, text: 'Đồng ý' },
  { value: 5, text: 'Rất đồng ý' },
];

// 6 pages × 4 questions; each page interleaves all four axes.
export const MBTI_PAGES: QuizPage[] = [0, 1, 2, 3, 4, 5].map((pageIdx) => ({
  name: `mbti_p${pageIdx + 1}`,
  title: `Phần ${pageIdx + 1}/6`,
  elements: QUESTIONS.slice(pageIdx * 4, pageIdx * 4 + 4).map((q) => ({
    name: q.name,
    title: q.title,
    choices: likert(),
  })),
}));

export interface MbtiAxisScore {
  score: number; // 0–100 toward the positive pole
  letter: string; // chosen pole letter for this axis
  positive: string;
  negative: string;
}

export interface MbtiScoreWithMeta {
  type: string; // e.g. "INTJ"
  axes: Record<MbtiAxis, MbtiAxisScore>;
  total_items: number;
  total_answered: number;
}

/**
 * Sum Likert-1-5 responses per axis (flipping `neg`-leaning items), normalize to
 * 0–100 toward the positive pole, pick the letter (≥50 → positive), concatenate
 * into a 4-letter type. Robust to missing answers (an unanswered axis → 50 → the
 * positive pole as a neutral default).
 */
export function scoreMbti(answers: Record<string, number>): MbtiScoreWithMeta {
  const raw: Record<MbtiAxis, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const items: Record<MbtiAxis, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  let total_items = 0;
  let total_answered = 0;

  for (const q of QUESTIONS) {
    total_items += 1;
    const r = answers[q.name];
    if (typeof r !== 'number' || r < 1 || r > 5) continue;
    total_answered += 1;
    raw[q.axis] += q.toward === 'pos' ? r : 6 - r;
    items[q.axis] += 1;
  }

  const axes = {} as Record<MbtiAxis, MbtiAxisScore>;
  let type = '';
  for (const axis of AXIS_ORDER) {
    const n = items[axis];
    const score = n > 0 ? Math.round(((raw[axis] - n) / (n * 4)) * 100) : 50;
    const { positive, negative } = AXIS_POLES[axis];
    const letter = score >= 50 ? positive : negative;
    axes[axis] = { score, letter, positive, negative };
    type += letter;
  }

  return { type, axes, total_items, total_answered };
}

/** Rebuild a result from a shared "/mbti?r=E-S-T-J" score string (4 ints 0–100). */
export function scoreFromShare(scores: number[]): MbtiScoreWithMeta | null {
  if (scores.length !== 4 || scores.some((n) => !Number.isFinite(n) || n < 0 || n > 100)) return null;
  const axes = {} as Record<MbtiAxis, MbtiAxisScore>;
  let type = '';
  AXIS_ORDER.forEach((axis, i) => {
    const score = scores[i] ?? 50;
    const { positive, negative } = AXIS_POLES[axis];
    const letter = score >= 50 ? positive : negative;
    axes[axis] = { score, letter, positive, negative };
    type += letter;
  });
  return { type, axes, total_items: 24, total_answered: 24 };
}
