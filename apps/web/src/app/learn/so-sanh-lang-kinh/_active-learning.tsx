/**
 * Nội dung "học chủ động" cho trang /learn/so-sanh-lang-kinh.
 *
 * GROUNDING — MỘT nguồn duy nhất là `lib/so-sanh.ts` (COMPARISONS, đọc HẾT). Mọi
 * con số và mọi câu trích đều SUY / RÚT TẠI RUNTIME từ đó, không gõ tay: số cặp
 * và số công cụ (PAIR_COUNT, TOOLS, POSSIBLE_PAIRS), thống kê các "trục"
 * Comparison.dims[].aspect (DIM_COUNT, AXES, SHARED_AXES, SINGLE_FAMILY_AXES),
 * và các câu trích nguyên văn (dims, bottomLine, faqs). cellFor() rút đúng ô của
 * một công cụ trên một trục, không phụ thuộc nó nằm ở vế a hay vế b của cặp.
 *
 * CÁCH GOM NHÓM (khai báo rõ): chia các công cụ thành hai họ — "suy từ dữ kiện
 * sinh" và "rút từ câu trả lời của bạn" — là của BÀI NÀY, không có trong lib.
 * Căn cứ: lib chỉ ghi trục "Dữ liệu cần" (ngày/giờ sinh, họ tên) cho ba hệ Tử Vi,
 * Bát Tự, Thần Số Học. Công cụ chưa xếp được hiện nhãn "Chưa xếp", không bị gộp im.
 *
 * CÔNG CỤ /so-sanh THẬT SỰ LÀM GÌ (đọc app/so-sanh/page.tsx + app/so-sanh/[cap]):
 * hiển thị các cặp ĐÃ SOẠN SẴN — giới thiệu, bảng đối chiếu theo trục, "chọn A
 * khi…", "chọn B khi…", kết luận, FAQ, link sang hai công cụ. Nó KHÔNG nhận dữ
 * liệu người dùng, KHÔNG đọc kết quả bạn đã làm, KHÔNG đối chiếu hai kết quả CỦA
 * BẠN, KHÔNG chấm điểm trùng khớp và KHÔNG xếp hạng tổng thể — phần "đối chiếu
 * hai kết quả" trong bài là KỸ NĂNG ĐỌC bạn tự làm, bài nói thẳng như vậy.
 *
 * PHẠM VI: KHÔNG dạy lại vì sao lời chung chung nghe đúng (/learn/barnum), cách
 * kiểm một khẳng định (/learn/kiem-chung), hay nội dung từng hệ (bài riêng — chỉ
 * link). Giọng: không hệ nào "thắng"; mâu thuẫn là dấu hiệu câu hỏi đặt sai.
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
import { COMPARISONS, type Comparison } from '@/lib/so-sanh';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── Suy dữ kiện từ lib/so-sanh.ts (không gõ tay con số nào) ──────────────────

export const PAIR_COUNT = COMPARISONS.length;

/** `tag` = mô tả một dòng mà chính lib gắn cho công cụ (lần xuất hiện đầu). */
export interface ToolInPairs {
  href: string;
  ten: string;
  tag: string;
}

/** Các công cụ được nêu tên trong các cặp, gộp theo href (một href = một công cụ). */
export const TOOLS: ToolInPairs[] = (() => {
  const m = new Map<string, ToolInPairs>();
  for (const c of COMPARISONS) {
    for (const t of [c.a, c.b]) if (!m.has(t.href)) m.set(t.href, { ...t });
  }
  return [...m.values()];
})();

export const TOOL_COUNT = TOOLS.length;
/** Số cặp ghép được từ chừng ấy công cụ — để đối chiếu với số cặp công cụ đang có. */
export const POSSIBLE_PAIRS = (TOOL_COUNT * (TOOL_COUNT - 1)) / 2;

export type Family = 'du-kien-sinh' | 'bang-hoi' | 'chua-xep';

/** Ba hệ mà lib ghi rõ trục "Dữ liệu cần" là ngày/giờ sinh hoặc họ tên. */
const DU_KIEN_SINH = new Set(['/tu-vi', '/bat-tu', '/than-so-hoc']);
const BANG_HOI = new Set(['/mbti', '/big-five', '/disc', '/enneagram']);

export const familyOf = (href: string): Family =>
  DU_KIEN_SINH.has(href) ? 'du-kien-sinh' : BANG_HOI.has(href) ? 'bang-hoi' : 'chua-xep';

export const FAMILY_LABEL: Record<Family, string> = {
  'du-kien-sinh': 'Suy từ dữ kiện sinh',
  'bang-hoi': 'Rút từ câu trả lời của bạn',
  'chua-xep': 'Chưa xếp',
};

/** Cặp nằm gọn trong một họ, hay bắc cầu giữa hai họ. */
export function pairFamily(c: Comparison): Family | 'bac-cau' {
  const fa = familyOf(c.a.href);
  return fa === familyOf(c.b.href) ? fa : 'bac-cau';
}

export const CROSS_FAMILY_PAIRS = COMPARISONS.filter((c) => pairFamily(c) === 'bac-cau').length;
export const DIM_COUNT = COMPARISONS.reduce((n, c) => n + c.dims.length, 0);
export interface AxisStat {
  aspect: string;
  /** Slug các cặp dùng trục này, và các họ mà trục này xuất hiện. */
  slugs: string[];
  families: Set<Family | 'bac-cau'>;
}

/** Mọi "trục" đối chiếu công cụ dùng, xếp theo số cặp dùng nó. */
export const AXES: AxisStat[] = (() => {
  const m = new Map<string, AxisStat>();
  for (const c of COMPARISONS) {
    const fam = pairFamily(c);
    for (const d of c.dims) {
      const e = m.get(d.aspect) ?? { aspect: d.aspect, slugs: [], families: new Set() };
      e.slugs.push(c.slug);
      e.families.add(fam);
      m.set(d.aspect, e);
    }
  }
  return [...m.values()].sort((x, y) => y.slugs.length - x.slugs.length);
})();

export const AXIS_COUNT = AXES.length;
/** Trục xuất hiện ở cả hai họ — cùng TÊN, chưa chắc cùng THANG ĐO. */
export const SHARED_AXES = AXES.filter((a) => a.families.size > 1);
export const SINGLE_FAMILY_AXES = AXIS_COUNT - SHARED_AXES.length;

/** Trục mà công cụ dùng để nói thẳng bên nào có nền nghiên cứu vững hơn. */
export const SCIENCE_AXIS = 'Cơ sở khoa học';
export const SCIENCE_PAIRS = COMPARISONS.filter((c) =>
  c.dims.some((d) => d.aspect === SCIENCE_AXIS),
);

const bySlug = (slug: string) => COMPARISONS.find((c) => c.slug === slug);
export const MBTI_BIG_FIVE = bySlug('mbti-vs-big-five');
export const TU_VI_BAT_TU = bySlug('tu-vi-vs-bat-tu');
export const THAN_SO_TU_VI = bySlug('than-so-hoc-vs-tu-vi');
export const MBTI_ENNEAGRAM = bySlug('mbti-vs-enneagram');

/**
 * Ô của MỘT công cụ trên MỘT trục. Tra theo href nên không lệ thuộc công cụ đó
 * đứng ở vế a hay vế b (Tử Vi là vế a khi đi với Bát Tự, vế b khi đi với Thần Số).
 */
export function cellFor(c: Comparison | undefined, aspect: string, href: string) {
  const d = c?.dims.find((x) => x.aspect === aspect);
  if (!c || !d) return undefined;
  return c.a.href === href ? d.a : c.b.href === href ? d.b : undefined;
}

/**
 * Một trục DÙNG CHUNG ở cả hai họ, kèm hai ô nguyên văn ở hai họ khác nhau — bằng
 * chứng cho câu "cùng tên trục không có nghĩa cùng thang đo". Tìm tại runtime nên
 * không phụ thuộc lib đặt tên trục nào.
 */
export const SHARED_AXIS_DEMO = (() => {
  for (const { aspect, slugs } of SHARED_AXES) {
    const used = (f: Family) =>
      COMPARISONS.find((c) => slugs.includes(c.slug) && pairFamily(c) === f);
    const birth = used('du-kien-sinh');
    const quiz = used('bang-hoi');
    const birthCell = birth?.dims.find((d) => d.aspect === aspect)?.a;
    const quizCell = quiz?.dims.find((d) => d.aspect === aspect)?.a;
    if (birth && quiz && birthCell && quizCell) return { aspect, birth, birthCell, quiz, quizCell };
  }
  return undefined;
})();

/** Trọng tâm của MBTI và điểm mạnh của Tử Vi — nguyên văn lib, dùng làm ví dụ lõi. */
export const MBTI_TRONG_TAM = cellFor(MBTI_ENNEAGRAM, 'Trọng tâm', '/mbti');
export const TU_VI_MANH_O = cellFor(TU_VI_BAT_TU, 'Mạnh ở', '/tu-vi');

/**
 * Trục "Trả lời câu hỏi" — chính công cụ đã phân biệt hai hệ theo LOẠI câu hỏi.
 * QUESTION_PAIR để nói rõ trục này nằm ở cặp nào: nó chỉ có ở MỘT cặp và cả hai
 * vế đều thuộc họ bảng hỏi, nên nó minh hoạ nguyên tắc chứ KHÔNG phải bằng chứng
 * cho ranh giới giữa hai họ.
 */
export const QUESTION_AXIS = 'Trả lời câu hỏi';
export const QUESTION_PAIR = COMPARISONS.find((c) =>
  c.dims.some((d) => d.aspect === QUESTION_AXIS),
);
export const QUESTION_DIM = QUESTION_PAIR?.dims.find((d) => d.aspect === QUESTION_AXIS);

/** Câu FAQ của lib nói thẳng vì sao MBTI và Big Five hiếm khi mâu thuẫn. */
export const OVERLAP_FAQ = MBTI_BIG_FIVE?.faqs.find((f) => f.q.includes('mâu thuẫn'));

// ── Các khối học chủ động ────────────────────────────────────────────────────

export function SoSanhFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn làm trắc nghiệm ra nhãn {strong('“thiên về hướng nội”')}, rồi xem lá số thấy đời mình
          mạnh ở khoản giao thiệp. Hai câu nghe như cãi nhau, và bạn phải chọn: tin cái nào, bỏ cái
          nào, hay cộng lại chia đôi.
        </>
      }
      why={
        <>
          Vì cả ba lựa chọn ấy sai cùng một kiểu: chúng giả định hai hệ đang{' '}
          {strong('đo cùng một thứ')} nên buộc phải có một bên đúng. Thực ra mỗi hệ trả lời một LOẠI
          câu hỏi khác nhau — chưa đối chiếu được thì chưa có gì để chọn.
        </>
      }
      what={
        <>
          So sánh hai lăng kính là đặt chúng cạnh nhau trên những{' '}
          {strong('trục mà cả hai đều định nghĩa được')}. Không có trục chung thì không có phép so
          sánh — không phải vì thiếu dữ liệu, mà vì câu hỏi không có nghĩa trong ít nhất một hệ.
        </>
      }
      how={
        <>
          Ba bước: hỏi mỗi hệ {strong('trả lời loại câu hỏi nào')}; tìm trục chung, không có thì
          dừng chứ đừng xếp hạng; rồi {strong('dịch cả hai sang một ngôn ngữ')} và tìm chỗ chúng nói
          cùng một điều — thay vì cộng điểm hay lấy trung bình.
        </>
      }
      soWhat={
        <>
          Để bạn giữ được cả hai kết quả mà không phải bỏ cái nào, và để khi chúng mâu thuẫn thì bạn
          nhìn lại {strong('câu hỏi mình đang hỏi')} trước khi nhìn lại hai hệ. Đây là kỹ năng đọc;
          công cụ trên web không làm hộ phần này.
        </>
      }
    />
  );
}

export function SoSanhDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="so-sanh-lang-kinh"
        concept="Vì sao hai hệ nói khác nhau mà vẫn có thể cùng hữu ích"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hỏi bác sĩ “con cao bao nhiêu” và hỏi cô giáo “con học thế nào” thì hai người trả
                lời khác hẳn nhau. Không ai nói dối cả — chỉ là {strong('hai câu hỏi khác nhau')}.
                Muốn biết cả hai thì nghe cả hai, đừng bắt họ phải nói giống nhau.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Một bài trắc nghiệm tính cách hỏi bạn{' '}
                {strong('thích xử lý thông tin và nạp năng lượng kiểu nào')}. Một lá số hỏi{' '}
                {strong('đời bạn có những lĩnh vực nào nổi bật')}. Hai câu hỏi khác loại, nên hai
                câu trả lời không phủ định nhau — mà cũng không xác nhận được cho nhau. Chính dữ
                liệu trang So sánh viết thẳng điều đó: trọng tâm của MBTI được ghi là “
                {MBTI_TRONG_TAM ?? '—'}”, còn điểm mạnh của Tử Vi được ghi là “
                {TU_VI_MANH_O ?? '—'}” — hai dòng không nằm trên cùng một thang để so hơn kém.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <p>
                Công cụ còn có hẳn một trục tên “{QUESTION_AXIS}” — ở cặp{' '}
                {QUESTION_PAIR?.title ?? '—'}, tức giữa hai hệ cùng họ:{' '}
                {QUESTION_DIM ? `một bên là ${QUESTION_DIM.a}, bên kia là ${QUESTION_DIM.b}` : ''}.
                Vậy là bảng so sánh cũng phân biệt các hệ theo{' '}
                {strong('loại câu hỏi chúng trả lời')}, không phải theo độ đúng. Đọc tiếp cấu trúc
                dữ liệu: trong {PAIR_COUNT} cặp có đúng {strong(CROSS_FAMILY_PAIRS + ' cặp')} bắc
                cầu giữa hai họ. Bài này không đọc được ý định của người dựng bảng, nhưng lý do kỹ
                thuật thì thấy ngay — bảng đối chiếu cần trục mà cả hai vế cùng định nghĩa được, mà{' '}
                {SINGLE_FAMILY_AXES} trên {AXIS_COUNT} trục chỉ sống trong một họ.
              </p>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="so-sanh-lang-kinh"
        concept="Hiệu lực cấu trúc — một mô hình chỉ đo được cái nó định nghĩa được"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cái cân nói bạn nặng bao nhiêu ký, nhưng không nói bạn tốt bụng bao nhiêu. Không
                phải vì cân hỏng, mà vì {strong('trong cân không có chỗ nào để chứa “tốt bụng”')}.
                Hỏi cân câu đó thì nó không trả lời sai — nó không có gì để trả lời.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Mỗi hệ có một bộ khái niệm riêng và{' '}
                {strong('chỉ nói được về những thứ nằm trong bộ khái niệm đó')}. Gọi tính chất ấy là
                hiệu lực cấu trúc: hiệu lực của một mô hình bị chặn bởi chính cấu trúc của nó. Vì
                vậy hỏi một bài trắc nghiệm bốn chữ cái xem cung Tài Bạch của bạn ra sao là câu hỏi
                không có nghĩa — trong hệ đó không tồn tại khái niệm “cung”, và ngược lại cũng thế.
                Câu trả lời nhận được khi ép hỏi thường do{' '}
                {strong('người diễn giải tự thêm vào')}, không phải do hệ suy ra.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <p>
                Bằng chứng nằm ngay trong dữ liệu công cụ: {DIM_COUNT} ô đối chiếu xếp trên{' '}
                {AXIS_COUNT} trục, và {strong(SINGLE_FAMILY_AXES + ' trục')} chỉ xuất hiện trong một
                họ — trục không dùng lại được giữa hai họ chính là hiệu lực cấu trúc hiện ra dưới
                dạng bảng. Còn {SHARED_AXES.length} trục có mặt ở cả hai họ (
                {SHARED_AXES.map((a) => `“${a.aspect}”`).join(' và ')}), nhưng{' '}
                {strong('cùng tên không có nghĩa cùng thang đo')}: hai ô ở hai cặp khác họ cùng đứng
                dưới một tên trục, trông như so được, mà nội dung thuộc hai loại đại lượng khác nhau.
              </p>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="so-sanh-lang-kinh"
        concept="Khi hai hệ mâu thuẫn thì hệ nào thắng"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hai bạn cãi nhau xem quả bóng “to hay nặng”. Cãi mãi không xong, vì{' '}
                {strong('một bạn đang nói về cỡ, một bạn đang nói về cân')}. Không ai thắng, và cũng
                chẳng cần ai thắng.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Khi hai hệ nói ngược nhau, phản xạ thường thấy là chọn bên mình thích rồi bỏ bên
                kia. Nhưng {strong('không có hệ nào thắng')} — mâu thuẫn hầu như luôn là dấu hiệu
                bạn đang hỏi một câu mà chỉ một trong hai hệ có khái niệm để trả lời. Việc cần làm
                không phải chọn phe, mà là hỏi lại: câu tôi đang hỏi thuộc loại nào? Trả lời được câu
                đó thì thường {strong('cái gọi là mâu thuẫn biến mất')}, vì hoá ra chỉ có một hệ
                đang nói về nó.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <p>
                Xếp hạng hai hệ chỉ hợp lệ khi có trục chung được cả hai định nghĩa. Trong dữ liệu
                công cụ, trục “{SCIENCE_AXIS}” chỉ xuất hiện ở{' '}
                {strong(SCIENCE_PAIRS.length + ' cặp')} — và đúng ở đó bảng mới nói bên nào có nền
                vững hơn. Ở cặp giữa hai hệ khác gốc thì công cụ nói thẳng điều ngược lại; nguyên văn
                kết luận của cặp Thần Số Học với Tử Vi:{' '}
                {THAN_SO_TU_VI ? `“${THAN_SO_TU_VI.bottomLine}”` : '—'} Đó không phải né tránh, mà là{' '}
                {strong('nói đúng giới hạn của phép so sánh')}.
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
    prompt: 'Nói lại bằng lời của bạn: “hiệu lực cấu trúc” nghĩa là gì?',
    answer: (
      <>
        Là chuyện một mô hình {strong('chỉ đo được cái mà chính nó định nghĩa được')}. Cái cân không
        nói được bạn tốt bụng bao nhiêu — không phải vì cân hỏng mà vì trong cân không có khái niệm
        ấy. Tương tự, hệ nào không có khái niệm “cung” thì không nói gì về cung được; câu trả lời
        nếu có là do người diễn giải thêm vào.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Hai hệ cho bạn hai kết luận ngược nhau. Việc đầu tiên nên làm là gì?',
    choices: [
      {
        text: 'Chọn hệ nào có nền nghiên cứu vững hơn rồi bỏ hệ kia',
        note: 'Chưa phải. Xếp hạng chỉ hợp lệ khi hai hệ cùng đứng trên một trục; không có trục chung thì “vững hơn” không áp được vào câu bạn đang hỏi.',
      },
      {
        text: 'Xem lại câu hỏi mình đang hỏi thuộc loại nào, và hệ nào có khái niệm để trả lời nó',
        correct: true,
        note: 'Đúng. Mâu thuẫn hầu như luôn là dấu hiệu câu hỏi đặt sai chỗ. Làm rõ loại câu hỏi thì thường chỉ còn một hệ thật sự đang nói về nó.',
      },
      {
        text: 'Lấy trung bình hai kết luận cho cân bằng',
        note: `Không được. Trung bình chỉ có nghĩa khi hai số cùng đơn vị. Bằng chứng: ${DIM_COUNT} ô đối chiếu của công cụ nằm trên ${AXIS_COUNT} trục, mà ${SINGLE_FAMILY_AXES} trục chỉ sống trong một họ — không có đơn vị chung để cộng rồi chia.`,
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Khi nào thì nói “hệ A đáng tin hơn hệ B” là một câu có nghĩa?',
    choices: [
      {
        text: 'Khi cả hai cùng định nghĩa được một trục và câu so sánh nằm trên đúng trục đó',
        correct: true,
        note: `Đúng. Trong dữ liệu công cụ, trục “${SCIENCE_AXIS}” chỉ xuất hiện ở ${SCIENCE_PAIRS.length} cặp — và chỉ ở đó bảng mới nói bên nào có nền vững hơn.`,
      },
      {
        text: 'Bất cứ khi nào một hệ có nhiều nghiên cứu hơn hệ kia',
        note: 'Không đủ. Nhiều nghiên cứu hơn về CÁI NÓ ĐO không làm nó trả lời được câu hỏi thuộc hệ khác.',
      },
      {
        text: 'Khi hệ A cho kết quả khớp với cảm nhận của bạn hơn',
        note: 'Không — đó là cảm giác khớp, không phải phép so sánh. Vì sao cảm giác đó không dùng làm bằng chứng được thì bài Hiệu ứng Barnum nói riêng.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Trang So sánh trên hieu.asia thật sự làm gì cho bạn?',
    choices: [
      {
        text: 'Nhận kết quả hai bài bạn đã làm rồi tự đối chiếu và chấm điểm trùng khớp',
        note: 'Không. Công cụ không nhận dữ liệu của bạn và không đọc kết quả bạn đã làm — nó không chạy phép tính nào cả.',
      },
      {
        text: 'Xếp hạng các lăng kính để bạn biết nên tin cái nào nhất',
        note: 'Không. Không cặp nào kết luận bằng một bên thắng; bảng chỉ nêu mỗi bên mạnh ở đâu và hợp với nhu cầu nào.',
      },
      {
        text: `Hiển thị ${PAIR_COUNT} cặp đã soạn sẵn: bảng đối chiếu theo trục, nên chọn bên nào khi nào, kết luận và câu hỏi thường gặp`,
        correct: true,
        note: 'Đúng — đó là nội dung biên tập. Phần đối chiếu hai kết quả của chính bạn là việc bạn tự làm bằng tay.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt:
      'Bạn ra “thiên về hướng nội” ở bài trắc nghiệm, nhưng lá số nói đời bạn mạnh ở khoản giao thiệp. Đọc thế nào cho đúng?',
    choices: [
      {
        text: 'Hai câu nói về hai chuyện khác nhau — cách bạn nạp năng lượng, và lĩnh vực nổi bật của đời bạn — nên chúng có thể cùng đúng',
        correct: true,
        note: `Đúng. Nguyên văn dữ liệu công cụ: trọng tâm của MBTI là “${MBTI_TRONG_TAM ?? '—'}”, còn Tử Vi mạnh ở “${TU_VI_MANH_O ?? '—'}”. Một người ngại đám đông vẫn có thể làm nghề gặp người suốt ngày.`,
      },
      {
        text: 'Bài trắc nghiệm sai, vì lá số dùng dữ kiện sinh nên khách quan hơn',
        note: 'Không. Dùng dữ kiện có sẵn không làm một hệ đúng hơn về một câu hỏi mà nó không định nghĩa.',
      },
      {
        text: 'Lá số sai, vì trắc nghiệm hỏi thẳng bạn nên sát hơn',
        note: 'Cũng không. Cả hai câu đều không nằm trên một thang chung để mà bác bỏ nhau.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'open',
    prompt:
      'Hai hệ độc lập cùng nói bạn “nhạy cảm và hay nghĩ ngợi”. Đó có phải bằng chứng rằng cả hai đều đúng không?',
    answer: (
      <>
        Chưa chắc, và đây là chỗ dễ hụt chân nhất. Hai lời trùng nhau có thể chỉ vì cả hai đều{' '}
        {strong('mơ hồ đủ để hợp với gần như ai')} — cơ chế đó là chủ đề của bài Hiệu ứng Barnum;
        cũng có thể vì bạn đọc sau khi đã biết rõ mình nên tự nối hai bên lại. Muốn biết một khẳng
        định có đứng được không thì phải kiểm riêng nó (bài Kiểm chứng).
      </>
    ),
  },
];

export function SoSanhRecall() {
  return <ActiveRecall topicId="so-sanh-lang-kinh" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'loai-cau-hoi',
    facet: 'Loại câu hỏi',
    can: 'Nói được mỗi họ lăng kính trả lời một LOẠI câu hỏi khác nhau, và nêu được câu hỏi mà mỗi họ thật sự có khái niệm để trả lời.',
  },
  {
    id: 'hieu-luc-cau-truc',
    facet: 'Hiệu lực cấu trúc',
    can: 'Giải thích được vì sao một mô hình chỉ nói được về những thứ nằm trong bộ khái niệm của nó, kèm một ví dụ câu hỏi vô nghĩa với một hệ cụ thể.',
  },
  {
    id: 'truc-chung',
    facet: 'Trục chung',
    can: 'Nêu được điều kiện để so sánh hai hệ là có trục mà cả hai cùng định nghĩa, và nhận ra khi hai ô cùng tên trục nhưng không cùng thang đo.',
  },
  {
    id: 'mau-thuan',
    facet: 'Khi mâu thuẫn',
    can: 'Nói được vì sao khi hai hệ nói ngược nhau thì không hệ nào “thắng”, và việc đầu tiên cần làm là xem lại câu hỏi mình đang hỏi.',
  },
  {
    id: 'doi-chieu',
    facet: 'Cách đối chiếu',
    can: 'Đối chiếu hai kết quả bằng cách dịch sang một ngôn ngữ rồi tìm chỗ chúng nói cùng một điều — thay vì cộng điểm, lấy trung bình hay bỏ bớt một bên.',
  },
  {
    id: 'trung-khop',
    facet: 'Cạm bẫy trùng khớp',
    can: 'Phân biệt “cùng hữu ích” với “cùng đúng”, và nhận ra hai hệ cùng nói một điều chưa phải bằng chứng vì cả hai có thể cùng mơ hồ — kèm biết bài nào nói riêng về chuyện đó.',
  },
  {
    id: 'cong-cu',
    facet: 'Công cụ làm gì',
    can: 'Nói đúng trang So sánh làm gì và không làm gì: nó hiển thị các cặp đã soạn sẵn, không nhận dữ liệu của bạn và không đối chiếu hai kết quả của bạn.',
  },
  {
    id: 'day-lai',
    facet: 'Dạy lại',
    can: 'Giải thích cho một người bạn trong một phút vì sao kết quả trắc nghiệm và lá số nói khác nhau mà không cái nào phải sai.',
  },
];

export function SoSanhChecklist() {
  return <UnderstandingChecklist topicId="so-sanh-lang-kinh" facets={FACETS} />;
}

export function SoSanhWhys() {
  return (
    <FiveWhys
      topicId="so-sanh-lang-kinh"
      start={
        <>
          Một người làm trắc nghiệm ra kết quả thiên về hướng nội, rồi xem lá số thấy đời mình mạnh ở
          khoản giao thiệp. Kết luận của người ấy: “một trong hai cái này chắc chắn sai” — rồi bỏ hẳn
          một cái.
        </>
      }
      chain={[
        {
          question: 'Vì sao người ấy thấy hai câu đó cãi nhau?',
          because: (
            <>
              Vì cả hai được đọc như hai lời phán về {strong('cùng một đại lượng')}: “rốt cuộc tôi có
              hướng ra ngoài hay không”. Đã quy về một đại lượng thì hai câu ngược nhau buộc phải có
              một cái sai — logic đúng, chỉ tiền đề là sai.
            </>
          ),
        },
        {
          question: 'Vì sao lại dễ quy về cùng một đại lượng như vậy?',
          because: (
            <>
              Vì cả hai hệ đều nói bằng {strong('tiếng Việt đời thường')} chứ không bằng ký hiệu
              riêng. “Hướng nội”, “giao thiệp” là chữ dùng chung, nên người đọc tự nối chúng vào một
              trục duy nhất mà không nhận ra là mình vừa nối.
            </>
          ),
        },
        {
          question: 'Vì sao hai hệ lại không nói về cùng một đại lượng?',
          because: (
            <>
              Vì mỗi hệ chỉ định nghĩa được cái nằm trong bộ khái niệm của nó. Nguyên văn dữ liệu
              công cụ: trọng tâm của MBTI là “{MBTI_TRONG_TAM ?? '—'}”, còn Tử Vi mạnh ở “
              {TU_VI_MANH_O ?? '—'}”. Một bên nói về {strong('cách vận hành bên trong')}, bên kia nói
              về {strong('các lĩnh vực của đời sống')} — hai loại đại lượng khác nhau.
            </>
          ),
        },
        {
          question: 'Vậy vì sao không thể cộng điểm hay lấy trung bình cho công bằng?',
          because: (
            <>
              Vì cộng chỉ có nghĩa khi hai số cùng đơn vị, mà ở đây không có đơn vị chung — đọc được
              ngay trong dữ liệu: {DIM_COUNT} ô đối chiếu nằm trên {AXIS_COUNT} trục, và{' '}
              {strong(SINGLE_FAMILY_AXES + ' trục')} chỉ xuất hiện trong một họ. Trung bình của hai
              thứ khác thang là con số {strong('trông có vẻ khách quan mà rỗng')}.
            </>
          ),
        },
        {
          question: 'Thế thì “mâu thuẫn” ban đầu thật ra là gì?',
          because: (
            <>
              Là dấu hiệu câu hỏi đặt sai chỗ. Nếu câu hỏi là “tôi nạp năng lượng kiểu nào” thì chỉ
              họ bảng hỏi có khái niệm để trả lời; nếu là “đời tôi lĩnh vực nào nổi bật” thì chỉ họ
              lá số mới có khái niệm ấy. {strong('Không có hệ nào thắng')} — chỉ có một câu hỏi cần
              được tách làm hai.
            </>
          ),
        },
      ]}
      root={
        <>
          Hai lăng kính không phải hai lời khai về cùng một sự việc để đối chất xem ai nói thật.
          Chúng là hai bộ khái niệm, mỗi bộ chỉ phủ được phần đời nó định nghĩa được. Hiểu tới đây
          thì bạn {strong('giữ được cả hai mà không mâu thuẫn')} — và cũng không dùng việc chúng hợp
          nhau làm lý do để tin chắc hơn.
        </>
      }
    />
  );
}
