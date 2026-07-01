/**
 * Nội dung "học chủ động" cho trang /learn/enneagram.
 *
 * TẤT CẢ grounded từ chính bài viết Enneagram (9 nhóm theo động lực sâu, 3 trung
 * tâm Bản năng/Tình cảm/Lý trí, cánh — wing, mũi tên phát triển/căng thẳng theo
 * Riso–Hudson) và lib nội dung (lib/scoring/enneagram.ts, lib/enneagram-type-data.ts).
 * KHÔNG thêm dữ kiện mới. Giữ giọng "bản đồ để hiểu mình, không phải cái hộp để
 * nhốt" — tham khảo / góc nhìn, không phán định.
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

export function EnneagramFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao hiểu được {strong('vì sao mình lại phản ứng như vậy')} — điều gì thật sự thôi thúc
          mình phía sau hành vi — để bớt tự trách, hiểu người khác hơn và biết mình nên luyện gì?
        </>
      }
      why={
        <>
          Enneagram xếp con người thành chín nhóm dựa trên {strong('động lực sâu bên trong')} — điều
          bạn khao khát và điều bạn sợ — chứ không phải hành vi bề mặt. Nó tồn tại như một{' '}
          {strong('bản đồ để hiểu mình')}, không phải chiếc hộp để nhốt.
        </>
      }
      what={
        <>
          Chín nhóm chia theo {strong('3 trung tâm')} (Bản năng · Tình cảm · Lý trí), mỗi nhóm có một
          khao khát và một nỗi sợ cốt lõi. {strong('Không phải')} nhãn để dán hay lời tiên tri — đó là
          lý do hai người trông rất khác nhau vẫn có thể cùng một nhóm.
        </>
      }
      how={
        <>
          Nhận diện nhóm chính qua động lực (sợ gì / muốn gì), rồi đọc thêm ba lớp:{' '}
          {strong('cánh')} (nghiêng về một nhóm liền kề) và {strong('mũi tên')} (khi phát triển hấp
          thụ nét tốt của một nhóm khác, khi căng thẳng ngả sang mặt kém của một nhóm khác).
        </>
      }
      soWhat={
        <>
          Để {strong('hiểu động cơ, điểm mạnh và điều cần luyện')} rồi tự quyết mình muốn trở thành ai
          — không dùng số nhóm để bào chữa, không đóng khung người khác, không thay lời khuyên chuyên
          môn.
        </>
      }
    />
  );
}

export function EnneagramDepth() {
  return (
    <DepthTabs
      topicId="enneagram"
      concept="Vì sao Enneagram không phải cái nhãn cố định — “mũi tên” phát triển và căng thẳng"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Bạn không phải lúc nào cũng giống hệt nhau. Lúc {strong('vui khỏe')} bạn hiện ra phiên
              bản đẹp hơn; lúc {strong('mệt và căng')} bạn dễ lộ ra mặt xấu. Enneagram nói mỗi nhóm
              cũng vậy — nên số nhóm không phải cái tên cố định dán lên bạn mãi mãi.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Mỗi nhóm nối với hai nhóm khác bằng {strong('mũi tên')}: khi bạn thoải mái và trưởng
                thành, bạn {strong('hấp thụ nét tốt')} của một nhóm; khi căng thẳng, bạn ngả sang{' '}
                {strong('mặt kém')} của một nhóm khác.
              </p>
              <p>
                Ví dụ nhóm 9 (Ôn hoà) lúc phát triển mượn nét chủ động, quyết đoán của nhóm 3; lúc
                stress lại ngả sang mặt lo xa, hoài nghi của nhóm 6. Chính vì có đường đi này mà
                Enneagram thiên về {strong('phát triển')} hơn là dán nhãn.
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
                Theo mô hình mũi tên của {strong('Riso–Hudson')}, mỗi nhóm có một hướng{' '}
                {strong('phát triển (integration)')} khi an toàn, lành mạnh và một hướng{' '}
                {strong('áp lực (disintegration)')} khi căng thẳng. Đọc một người là đọc cả trục
                động: nhóm chính + cánh (nghiêng về một nhóm liền kề) + vị trí trên hai mũi tên.
              </p>
              <p>
                Vì thế cùng một số nhóm vẫn cho ra nhiều sắc thái: cánh khác nhau, và mức lành
                mạnh/căng thẳng khác nhau kéo người ta về hai đầu mũi tên khác nhau. Enneagram mô tả{' '}
                {strong('xu hướng động lực trên một phổ')}, không phải phép đo khoa học như xét nghiệm.
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
    prompt: 'Enneagram phân nhóm con người dựa trên điều gì — và điều đó khác gì với việc mô tả hành vi bề mặt?',
    answer: (
      <>
        Dựa trên {strong('động lực sâu bên trong')}: điều bạn khao khát và điều bạn sợ, chứ không phải
        hành vi bề mặt. Đó là lý do hai người trông rất khác nhau vẫn có thể cùng một nhóm — vì cùng
        một động cơ cốt lõi đứng phía sau.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Ba trung tâm (triad) của Enneagram là gì, và nhóm nào thuộc trung tâm nào?',
    choices: [
      {
        text: 'Bản năng (8·9·1) · Tình cảm (2·3·4) · Lý trí (5·6·7)',
        correct: true,
        note: 'Đúng — Bản năng (bụng), Tình cảm (tim), Lý trí (đầu).',
      },
      {
        text: 'Hướng nội · Hướng ngoại · Trung tính, chia đều 3 nhóm mỗi bên',
        note: 'Đó là kiểu chia của mô hình khác; Enneagram chia theo Bản năng / Tình cảm / Lý trí.',
      },
      {
        text: 'Quá khứ · Hiện tại · Tương lai',
        note: 'Không — ba trung tâm nói về nguồn phản ứng (bản năng, cảm xúc, suy nghĩ), không phải thời gian.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: '“Cánh” (wing) trong Enneagram nghĩa là gì?',
    choices: [
      { text: 'Một nhóm thứ hai mạnh ngang nhóm chính, khiến bạn thuộc cả hai nhóm', note: 'Không — cánh chỉ pha thêm sắc thái, không thay nhóm chính.' },
      {
        text: 'Ảnh hưởng từ một trong hai nhóm liền kề trên vòng tròn, tạo nên sắc thái riêng',
        correct: true,
        note: 'Đúng — ví dụ nhóm 9 có thể nghiêng cánh 1 hoặc cánh 8.',
      },
      { text: 'Nhóm bạn sẽ chuyển sang khi trưởng thành', note: 'Đó là mũi tên phát triển, không phải cánh.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Theo các “mũi tên” của Riso–Hudson, một người thay đổi thế nào khi phát triển so với khi căng thẳng?',
    choices: [
      { text: 'Khi nào cũng giữ nguyên một kiểu — nhóm là cố định, không đổi', note: 'Không — chính mũi tên khiến Enneagram thiên về phát triển, không cố định.' },
      { text: 'Khi phát triển ngả sang mặt kém của nhóm khác; khi căng thẳng hấp thụ nét tốt', note: 'Ngược rồi — phát triển hấp thụ nét TỐT, căng thẳng ngả sang mặt KÉM.' },
      {
        text: 'Khi an toàn, trưởng thành thì hấp thụ nét tốt của một nhóm; khi căng thẳng thì ngả sang mặt kém của một nhóm khác',
        correct: true,
        note: 'Đúng — đó là hai hướng integration / disintegration.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Một người nói “tôi nhóm 8 nên mới gắt, chịu thôi”. Vì sao đây là cách dùng Enneagram sai?',
    answer: (
      <>
        Vì Enneagram là {strong('bản đồ để soi mình, không phải lời tiên tri')} hay cái cớ. Dùng số
        nhóm để {strong('bào chữa')} là biến một công cụ tự nhận thức thành nhãn để nhốt mình. Đúng
        tinh thần là: nhận ra động lực và mặt dễ vấp của nhóm 8 (dễ áp đặt khi căng thẳng) rồi{' '}
        {strong('chủ động luyện')} hướng phát triển — chứ không phải đóng khung “tôi vốn thế”.
      </>
    ),
  },
];

export function EnneagramRecall() {
  return <ActiveRecall topicId="enneagram" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Bạn hiểu nếu giải thích được Enneagram dùng để làm gì (bản đồ hiểu động cơ của mình) — và nó KHÔNG hứa gì (không phải lời tiên tri, không thay lời khuyên chuyên môn).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Bạn hiểu nếu mô tả được cách đọc một nhóm: động lực cốt lõi (sợ gì / muốn gì) → trung tâm → cánh → hai mũi tên phát triển và căng thẳng.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Bạn hiểu nếu nói được vì sao Enneagram (đào vào động lực, nỗi sợ cốt lõi) khác MBTI (mô tả cách tư duy, tiếp nhận thông tin) và vì sao chúng bổ sung nhau.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Bạn hiểu nếu chỉ ra được giới hạn của Enneagram — là góc nhìn tham khảo trên một phổ, không phải phép đo khoa học như xét nghiệm.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Bạn hiểu nếu giải thích được vì sao hai người trông rất khác nhau vẫn có thể cùng một nhóm (cùng động lực cốt lõi, khác cánh và mức lành mạnh/căng thẳng).',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Bạn hiểu nếu nói được vì sao không được dùng số nhóm để bào chữa hay đóng khung người khác — và vì sao không nhóm nào “tốt/xấu” hơn nhóm nào.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Bạn hiểu nếu giảng lại được “cánh” và “mũi tên” cho một người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Bạn hiểu nếu chỉ ra được khái niệm nào (vd trung tâm, cánh, hay hai mũi tên) bạn vẫn còn thấy mơ hồ.',
  },
];

export function EnneagramChecklist() {
  return <UnderstandingChecklist topicId="enneagram" facets={FACETS} />;
}

export function EnneagramWhys() {
  return (
    <FiveWhys
      topicId="enneagram"
      start={
        <>
          Ai đó tự nhận “tôi nhóm 8 nên mới gắt, chịu thôi” — dùng số nhóm Enneagram như một cái cớ.
        </>
      }
      chain={[
        {
          question: 'Vì sao lấy số nhóm ra bào chữa lại là dùng Enneagram sai?',
          because: (
            <>
              Vì Enneagram là {strong('bản đồ để soi mình, không phải lời tiên tri')} hay cái cớ để
              khỏi thay đổi.
            </>
          ),
        },
        {
          question: 'Vì sao nó chỉ là bản đồ chứ không phải điều cố định?',
          because: (
            <>
              Vì mỗi nhóm có {strong('mũi tên')}: khi phát triển hấp thụ nét tốt của một nhóm, khi
              căng thẳng ngả sang mặt kém của nhóm khác — bạn không đứng yên một chỗ.
            </>
          ),
        },
        {
          question: 'Vì sao Enneagram mô tả động cơ có thể dịch chuyển như vậy?',
          because: (
            <>
              Vì nó phân nhóm theo {strong('động lực sâu bên trong')} (sợ gì / muốn gì), chứ không
              phải khoá bạn vào một tập hành vi bề mặt.
            </>
          ),
        },
        {
          question: 'Vì sao nhìn vào động lực lại quan trọng hơn nhìn hành vi?',
          because: (
            <>
              Vì cùng một động cơ có thể hiện ra rất nhiều hành vi khác nhau — đó là lý do hai người
              trông khác nhau vẫn {strong('cùng một nhóm')}, và một người vẫn thay đổi được cách biểu
              hiện.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên dùng Enneagram?',
          because: (
            <>
              Vì mục đích là {strong('hiểu động cơ để chủ động luyện và trưởng thành')}, không phải
              dán một cái nhãn rồi nhốt mình (hay người khác) trong đó.
            </>
          ),
        },
      ]}
      root={
        <>
          Enneagram là bản đồ động lực để phát triển, không phải cái hộp để nhốt. Số nhóm cho biết
          bạn thường bắt đầu từ đâu và dễ vấp ở đâu — nhưng cánh, hai mũi tên và lựa chọn của bạn mới
          quyết định bạn trở thành ai. Dùng nó để soi mình rồi hành động, đừng dùng để bào chữa.
        </>
      }
    />
  );
}
