/**
 * Nội dung "học chủ động" cho trang /learn/mbti — bài flagship.
 *
 * TẤT CẢ grounded từ chính bài viết MBTI (4 trục I/E·N/S·T/F·J/P, 16 nhóm,
 * chức năng nhận thức, phản biện độ tin cậy, "thiên hướng không phải nhãn").
 * KHÔNG thêm dữ kiện mới. Giữ giọng "khung để hiểu mình, không phán/dán nhãn".
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

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

export function MbtiFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Vì sao có người “sạc pin” bằng tụ tập đông vui, còn bạn cần ở một mình mới lại sức? Làm
          sao mô tả thiên hướng tâm lý của mình một cách có hệ thống — để hiểu mình và hợp tác với
          người khác tốt hơn?
        </>
      }
      why={
        <>
          MBTI dựng trên thuyết tâm lý của Carl Jung, được Myers–Briggs hệ thống thành 4 trục dễ
          dùng. Nó tồn tại vì người ta cần một {strong('ngôn ngữ chung')} để nói về khác biệt tính
          cách mà không phán “ai đúng ai sai”.
        </>
      }
      what={
        <>
          4 trục lưỡng cực (I/E, N/S, T/F, J/P) ghép thành {strong('16 nhóm')}. Đây là{' '}
          {strong('thiên hướng tự nhiên')} — {strong('không phải')} “ô đóng”, không phải chẩn đoán,
          và không đo năng lực.
        </>
      }
      how={
        <>
          Trả lời bộ câu hỏi → mỗi trục nghiêng về một bên → ghép 4 chữ thành 1 trong 16 nhóm. Mỗi
          nhóm còn có một chuỗi {strong('chức năng nhận thức')} (theo Jung) lý giải vì sao nó vận
          hành như vậy.
        </>
      }
      soWhat={
        <>
          Để hiểu cách mình nạp năng lượng, chú ý, quyết định, sắp xếp — và hiểu người khác vận hành
          khác mình ra sao. Dùng để {strong('cảm thông và hợp tác')}, không để dán nhãn hay phán xét.
        </>
      }
    />
  );
}

export function MbtiDepth() {
  return (
    <DepthTabs
      topicId="mbti"
      concept="“Thiên hướng”, không phải năng lực, cũng không phải nhãn cố định"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Bạn thuận tay phải, nhưng tay trái vẫn viết được — chỉ là không quen bằng. MBTI nói về{' '}
              {strong('“tay thuận” trong tâm lý')}: bạn nghiêng về kiểu nào một cách tự nhiên, chứ
              không phải bạn “chỉ làm được mỗi kiểu đó”.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Mỗi trục MBTI là một {strong('thiên hướng')}, như chuyện thuận tay: ai cũng dùng được
                cả hai bên, chỉ là một bên thấy tự nhiên và đỡ tốn sức hơn.
              </p>
              <p>
                Vì vậy “I” (hướng nội) không có nghĩa bạn không bao giờ thích giao tiếp; “T” (lý trí)
                không có nghĩa bạn vô cảm. Và vì là thiên hướng chứ không phải nhãn khắc đá,{' '}
                {strong('kết quả có thể đổi theo giai đoạn cuộc đời')}.
              </p>
            </>
          ),
        },
        {
          id: 'expert',
          label: 'Chuyên gia',
          content: (
            <>
              <p>
                MBTI mô tả {strong('preference')} (thiên hướng) giữa hai cực, không đo năng lực hay
                cường độ đặc điểm. Mỗi loại còn gắn một chuỗi {strong('chức năng nhận thức')} theo
                Jung — ví dụ INTJ dẫn đầu bằng Trực giác hướng nội (Ni) rồi Tư duy hướng ngoại (Te) —
                giúp lý giải vì sao hai loại trông gần giống nhau lại vận hành khác.
              </p>
              <p>
                Lưu ý quan trọng: MBTI {strong('bị nhiều nhà tâm lý phản biện')} về độ tin cậy
                (test–retest reliability). Nên dùng như khung tự phản tỉnh và đối thoại, kết hợp với
                các góc nhìn khác — không như một chẩn đoán.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

const RECALL_QUESTIONS: RecallQuestion[] = [
  {
    id: 'q1',
    type: 'open',
    prompt: 'Vì sao nói chữ “I” (hướng nội) là một THIÊN HƯỚNG, chứ không phải một cái nhãn cố định?',
    answer: (
      <>
        Vì mỗi trục là thiên hướng tự nhiên (như chuyện thuận tay): người hướng nội vẫn giao tiếp
        được, chỉ là nạp lại năng lượng bằng thời gian ở một mình. Và vì là thiên hướng chứ không
        phải “ô đóng”, kết quả có thể thay đổi theo giai đoạn cuộc đời.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Trục N/S nói về điều gì?',
    choices: [
      { text: 'Hướng nội vs hướng ngoại', note: 'Đó là trục I/E (nguồn năng lượng).' },
      {
        text: 'Chú ý vào khả năng & mẫu hình (Trực giác) vs vào chi tiết & dữ kiện (Cảm nhận)',
        correct: true,
        note: 'Đúng. N = iNtuition, S = Sensing.',
      },
      { text: 'Quyết định theo logic vs theo cảm xúc', note: 'Đó là trục T/F (cách quyết định).' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'MBTI có phải một công cụ chẩn đoán đã được khoa học kiểm chứng chắc chắn không?',
    choices: [
      {
        text: 'Không — nó bị nhiều nhà tâm lý phản biện về độ tin cậy; dùng tốt nhất như khung tự phản tỉnh, kết hợp góc nhìn khác',
        correct: true,
        note: 'Đúng. MBTI là khung phân loại, không phải chẩn đoán.',
      },
      { text: 'Có, đây là chẩn đoán tâm lý y khoa chính thức', note: 'Không — MBTI không phải chẩn đoán.' },
      {
        text: 'Có, và kết quả của một người không bao giờ thay đổi',
        note: 'Không — kết quả có thể đổi theo giai đoạn cuộc đời.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Dùng MBTI thế nào cho đúng tinh thần?',
    choices: [
      { text: 'Để dán nhãn và phán xét người khác', note: 'Bài viết nói thẳng: đừng dùng MBTI để dán nhãn.' },
      {
        text: 'Để hiểu cách mình & người khác vận hành tự nhiên, từ đó cảm thông và hợp tác',
        correct: true,
        note: 'Đúng — đây là mục đích lành mạnh của MBTI.',
      },
      {
        text: 'Để biết chắc chắn nghề nào mình hợp và chốt luôn',
        note: 'MBTI gợi ý thiên hướng, không “chốt” số phận hay nghề nghiệp.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Một bạn ENFP và một bạn INTJ làm chung nhóm và hay xích mích. Dùng khung MBTI, giải thích vì sao họ dễ va nhau — và họ có thể bổ trợ nhau thế nào?',
    answer: (
      <>
        Cả hai cùng nghiêng {strong('N')} (thích ý tưởng, mẫu hình) nên dễ hợp về tầm nhìn. Nhưng họ
        khác ở {strong('T/F')} (INTJ quyết theo logic, ENFP cân nhắc giá trị/cảm xúc) và {strong('J/P')}{' '}
        (INTJ thích đóng kế hoạch, ENFP thích để mở, ứng biến) — nên dễ va khi một bên muốn chốt còn
        bên kia muốn linh hoạt. Bổ trợ: INTJ giúp cấu trúc và hoàn tất, ENFP giúp mở rộng ý tưởng và
        gắn kết mọi người. Nhớ: đây là thiên hướng để cảm thông, không phải lý do dán nhãn.
      </>
    ),
  },
];

export function MbtiRecall() {
  return <ActiveRecall topicId="mbti" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được MBTI giúp trả lời câu hỏi gì về bản thân — và nó KHÔNG đo năng lực, không chẩn đoán.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả 4 trục (I/E, N/S, T/F, J/P) nói về điều gì và ghép thành 16 nhóm ra sao.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt “thiên hướng” với “năng lực” và với “nhãn cố định” — vì sao “I” không có nghĩa không thể giao tiếp.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Nói được vì sao MBTI bị phản biện về độ tin cậy, và nên dùng kết hợp các góc nhìn khác.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Dùng MBTI để giải thích vì sao hai người làm việc / ra quyết định khác nhau, và bổ trợ nhau thế nào.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao KHÔNG nên dùng MBTI để dán nhãn, phán xét, hay “chốt” số phận / nghề nghiệp.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại ý nghĩa một trục (vd N/S) cho người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd chuỗi chức năng nhận thức) bạn vẫn còn thấy mơ hồ.',
  },
];

export function MbtiChecklist() {
  return <UnderstandingChecklist topicId="mbti" facets={FACETS} />;
}

export function MbtiWhys() {
  return (
    <FiveWhys
      topicId="mbti"
      start={<>Một người có kết quả “INTP” nhưng tuần này thấy mình hành xử khác hẳn mô tả INTP.</>}
      chain={[
        {
          question: 'Vì sao một người “INTP” lại có lúc hành xử khác hẳn mô tả?',
          because: (
            <>
              Vì MBTI đo {strong('thiên hướng')}, không phải một khuôn cố định buộc người ta hành xử
              theo.
            </>
          ),
        },
        {
          question: 'Vì sao thiên hướng lại cho phép hành xử khác đi?',
          because: (
            <>
              Vì thiên hướng như {strong('“tay thuận”')} — bạn vẫn dùng được cả hai bên, chỉ là một
              bên thấy tự nhiên hơn.
            </>
          ),
        },
        {
          question: 'Vì sao con người không bị khóa vào một bên?',
          because: <>Vì người ta thích nghi theo hoàn cảnh; bối cảnh khác nhau gọi ra mặt khác nhau.</>,
        },
        {
          question: 'Vì sao kết quả lại có thể đổi theo thời gian?',
          because: <>Vì thiên hướng có thể dịch chuyển theo {strong('giai đoạn cuộc đời')} và trải nghiệm.</>,
        },
        {
          question: 'Vì sao vậy thì không nên dùng MBTI để “chốt” một người?',
          because: (
            <>
              Vì MBTI là khung {strong('tự phản tỉnh')} (còn bị phản biện về độ tin cậy), không phải
              chẩn đoán cố định.
            </>
          ),
        },
      ]}
      root={
        <>
          MBTI mô tả thiên hướng linh hoạt, không phải bản chất khắc đá. Dùng nó để hiểu và cảm thông
          cách mình & người khác vận hành — {strong('đừng')} dùng để dán nhãn hay khóa chặt ai vào
          một loại.
        </>
      }
    />
  );
}
