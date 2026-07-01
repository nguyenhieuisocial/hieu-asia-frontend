/**
 * Nội dung "học chủ động" cho trang /learn/disc.
 *
 * TẤT CẢ grounded từ chính bài viết DISC (hai trục nhịp độ × trọng tâm, bốn nhóm
 * D/I/S/C, mỗi người là pha trộn cả bốn, DISC đo hành vi quan sát được chứ không
 * phải năng lực/giá trị và không cố định cả đời, so sánh với MBTI/Big Five) và
 * lib/disc-type-data.ts. KHÔNG thêm dữ kiện mới. Giữ giọng "tham khảo / góc nhìn,
 * không phán định": DISC mô tả xu hướng hành vi, không dán nhãn con người.
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

export function DiscFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao hiểu {strong('cách bạn cư xử')} trước thử thách và trước con người — và vì sao cùng
          một tình huống, người này đẩy việc về đích còn người kia lo giữ hoà khí — để giao tiếp và
          làm việc nhóm hợp hơn?
        </>
      }
      why={
        <>
          DISC là mô hình hành vi của {strong('William Marston')} (1928, thuộc miền công cộng). Nó tồn
          tại để mô tả {strong('hành vi quan sát được')} — cách ta cư xử ở công sở, trong nhóm — nên
          rất hợp cho việc cải thiện giao tiếp, chứ không phải để phán số mệnh.
        </>
      }
      what={
        <>
          DISC chia thiên hướng hành vi thành {strong('bốn nhóm')}: Thống trị (D), Ảnh hưởng (I), Kiên
          định (S), Tuân thủ (C). Mỗi người là một {strong('pha trộn')} của cả bốn ở mức khác nhau —{' '}
          {strong('không')} phải một cái ô cố định, và không nhóm nào tốt hay xấu hơn.
        </>
      }
      how={
        <>
          Bốn nhóm nằm trên {strong('hai trục')}: nhịp độ (nhanh–quyết liệt ↔ chậm–ôn hoà) và trọng
          tâm (việc ↔ người). D = nhanh + việc, I = nhanh + người, S = chậm + người, C = chậm + việc.
          Hiểu hai trục là đủ để đoán phong cách người đối diện.
        </>
      }
      soWhat={
        <>
          Để hiểu mình, đoán phong cách người khác và {strong('điều chỉnh cách giao tiếp')} cho hợp —
          không dùng để dán nhãn, đánh giá hay đo năng lực / giá trị của ai.
        </>
      }
    />
  );
}

export function DiscDepth() {
  return (
    <DepthTabs
      topicId="disc"
      concept="Vì sao chỉ cần hai trục là suy ra được cả bốn nhóm"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Hình dung một tờ giấy chia bốn ô bằng hai đường kẻ. Một đường hỏi:{' '}
              {strong('bạn làm nhanh hay từ tốn?')} Đường kia hỏi: {strong('bạn để ý việc hay để ý người?')}{' '}
              Mỗi người rơi vào một góc, và bốn góc đó chính là D, I, S, C.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Hai trục là {strong('nhịp độ')} (nhanh–quyết liệt ↔ chậm–ôn hoà) và {strong('trọng tâm')}{' '}
                (việc ↔ người). Ghép hai trục ra bốn góc: D = nhanh + việc, I = nhanh + người, S = chậm
                + người, C = chậm + việc.
              </p>
              <p>
                Vì cùng nằm trên hai trục nên các nhóm có {strong('liền kề')} và {strong('đối nhau')}:
                D và S đối nhau (nhanh-việc vs chậm-người), I và C đối nhau. Biết một người ở góc nào,
                bạn đoán được họ thích trao đổi ngắn gọn hay cần hàn huyên, muốn số liệu hay muốn cảm
                giác an toàn.
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
                Hai trục sinh ra một {strong('vòng tròn')} D → I → S → C: đi vòng thì mỗi bước chỉ đổi
                một trục, còn hai nhóm đối tâm thì khác nhau ở {strong('cả hai')} trục. Đây là lý do
                DISC dễ vận dụng: chỉ cần định vị người đối diện trên hai câu hỏi là ra cách tiếp cận.
              </p>
              <p>
                Nhưng phải nhớ đây là {strong('phổ, không phải ô')}: DISC đo tỉ lệ, hầu hết mọi người
                mạnh ở một–hai nhóm và nhạt hơn ở phần còn lại, nên có thể {strong('vừa D vừa S')}.
                Phong cách còn đổi theo vai trò (ở nhà khác ở công ty) và theo lúc căng thẳng — nên
                “góc” của một người là điểm tham khảo, không phải nhãn cứng.
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
    prompt: 'Hai trục làm nền cho DISC là gì, và bốn nhóm rơi vào đâu trên hai trục đó?',
    answer: (
      <>
        Hai trục là {strong('nhịp độ')} (nhanh–quyết liệt ↔ chậm–ôn hoà) và {strong('trọng tâm')}{' '}
        (việc ↔ người). D = nhanh + việc, I = nhanh + người, S = chậm + người, C = chậm + việc. Biết
        một người ở góc nào là đủ để đoán phong cách giao tiếp của họ.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Nhóm nào hướng con người và có nhịp nhanh, quyết liệt?',
    choices: [
      {
        text: 'I (Ảnh hưởng)',
        correct: true,
        note: 'Đúng — I = nhanh + người: cởi mở, nhiệt tình, giỏi kết nối và truyền cảm hứng.',
      },
      { text: 'C (Tuân thủ)', note: 'C là chậm + việc: cẩn thận, chính xác, coi trọng quy chuẩn.' },
      { text: 'S (Kiên định)', note: 'S cũng hướng người nhưng nhịp chậm, ôn hoà — không phải nhanh.' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Một người “vừa mạnh D vừa mạnh S” có mâu thuẫn với DISC không?',
    choices: [
      {
        text: 'Không — DISC đo tỉ lệ cả bốn nhóm, nhiều người mạnh ở một–hai nhóm chứ không bị xếp vào một ô duy nhất',
        correct: true,
        note: 'Đúng — DISC là phổ, không phải cái ô cố định.',
      },
      { text: 'Có — mỗi người chỉ được thuộc đúng một nhóm', note: 'Không — DISC không xếp bạn vào một ô duy nhất.' },
      { text: 'Có — D và S không bao giờ xuất hiện cùng nhau', note: 'Không — dù D và S là hai nhóm đối nhau, một người vẫn có thể có cả hai ở mức khác nhau.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'DISC khác MBTI và Big Five ở điểm cốt lõi nào?',
    choices: [
      {
        text: 'DISC tập trung vào hành vi quan sát được (cách cư xử ở công sở, nhóm); MBTI thiên về cách suy nghĩ, Big Five đo tính cách nền có cơ sở khoa học',
        correct: true,
        note: 'Đúng — ba lăng kính bổ sung nhau, hieu.asia đọc cả ba như những góc nhìn khác nhau.',
      },
      { text: 'DISC đo chỉ số thông minh, hai cái kia đo tính cách', note: 'Không — DISC không đo trí thông minh; nó mô tả phong cách hành vi.' },
      { text: 'Cả ba thực chất giống hệt nhau, chỉ khác tên gọi', note: 'Không — mỗi mô hình soi một mặt khác của con người.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: đồng nghiệp nghiêng nhóm C (Tuân thủ) và bạn nghiêng nhóm D (Thống trị). Bạn nên điều chỉnh cách trao đổi thế nào, và vì sao?',
    answer: (
      <>
        Người nhóm C {strong('thích thông tin rõ ràng, có dữ liệu')} và cần thời gian phân tích, nên
        thay vì thúc quyết nhanh kiểu D, bạn nên chuẩn bị kỹ, đưa số liệu và cho họ khoảng lặng để
        cân nhắc. Lý do: D và C ở hai góc khác nhau trên hai trục (nhanh vs chậm) — {strong('điều chỉnh nhịp')}{' '}
        cho hợp phong cách người đối diện chính là mục đích thực dụng của DISC.
      </>
    ),
  },
];

export function DiscRecall() {
  return <ActiveRecall topicId="disc" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được DISC dùng để làm gì (hiểu cách mình cư xử, giao tiếp và làm việc nhóm hợp hơn) — và nó KHÔNG hứa gì (không đo năng lực/giá trị, không phán số mệnh).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả hai trục (nhịp độ × trọng tâm) và ghép ra bốn nhóm: D = nhanh+việc, I = nhanh+người, S = chậm+người, C = chậm+việc.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói được DISC khác MBTI và Big Five ở đâu (hành vi quan sát được vs cách suy nghĩ vs tính cách nền).',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra giới hạn của DISC: đo phong cách ở thời điểm làm bài, không cố định cả đời, có thể đổi theo vai trò.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Giải thích cách điều chỉnh giao tiếp khi làm việc với một nhóm khác mình (vd nhịp nhanh của D vs cần dữ liệu của C).',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao không nhóm nào “tốt/xấu” hơn, vì sao có thể vừa D vừa S, và vì sao không dùng DISC để dán nhãn ai.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại “hai trục ra bốn nhóm” cho một người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd nhóm liền kề/đối nhau, hay ranh giới với Big Five) bạn vẫn còn thấy mơ hồ.',
  },
];

export function DiscChecklist() {
  return <UnderstandingChecklist topicId="disc" facets={FACETS} />;
}

export function DiscWhys() {
  return (
    <FiveWhys
      topicId="disc"
      start={
        <>
          Một người làm trắc nghiệm DISC ra nhóm D, liền nghĩ “vậy mình là kiểu người thống trị, chắc
          cả đời sẽ vậy”.
        </>
      }
      chain={[
        {
          question: 'Vì sao “cả đời sẽ vậy” là cách hiểu chưa đúng về kết quả DISC?',
          because: (
            <>
              Vì DISC mô tả {strong('phong cách hành vi ở thời điểm làm bài')}, không phải một nhãn cố
              định cả đời.
            </>
          ),
        },
        {
          question: 'Vì sao phong cách đó lại không cố định?',
          because: (
            <>
              Vì phong cách có thể {strong('đổi theo vai trò')} — cách bạn cư xử ở nhà khác ở công ty
              — và DISC đo tỉ lệ cả bốn nhóm chứ không xếp bạn vào một ô duy nhất.
            </>
          ),
        },
        {
          question: 'Vì sao DISC lại đo được như một tỉ lệ thay đổi được?',
          because: (
            <>
              Vì nó chỉ soi {strong('hành vi quan sát được')} — cách bạn cư xử — chứ không đo năng lực
              hay giá trị con người, mà hành vi thì linh hoạt theo hoàn cảnh.
            </>
          ),
        },
        {
          question: 'Vì sao lại chỉ soi hành vi mà không đo giá trị con người?',
          because: (
            <>
              Vì đó là {strong('mục đích thiết kế')} của DISC: giúp cải thiện giao tiếp và làm việc
              nhóm, không phải để đánh giá hơn–kém.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên dùng kết quả DISC?',
          because: (
            <>
              Vì nếu là công cụ {strong('để hiểu và điều chỉnh')} chứ không phải để phán, thì ta dùng
              nó để tự quyết và giao tiếp tốt hơn — không để dán nhãn mình hay người khác.
            </>
          ),
        },
      ]}
      root={
        <>
          DISC là một góc nhìn về hành vi có thể đổi theo hoàn cảnh, không phải bản án tính cách. Dùng
          nó để hiểu mình, đoán phong cách người đối diện và điều chỉnh cách giao tiếp — chứ không để
          nhốt ai (kể cả chính mình) vào một cái ô cố định.
        </>
      }
    />
  );
}
