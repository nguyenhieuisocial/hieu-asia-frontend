/**
 * Nội dung "học chủ động" cho trang /learn/con-giap.
 *
 * TẤT CẢ grounded từ chính bài viết 12 Con Giáp trên hub (12 địa chi, ngũ hành
 * của từng chi, Tam Hợp = ba chi cách đều 4 ngôi hội thành cục, Tứ hành xung =
 * cặp lục xung đối nhịp 180°, và lưu ý con giáp thứ 4 trong tiếng Việt là Mèo
 * chứ không phải Thỏ). KHÔNG thêm dữ kiện mới. Giữ giọng "góc nhìn tham khảo,
 * không phán định — không kiêng kỵ, không hù doạ".
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

export function ConGiapFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao có một khung nhẹ nhàng để phác nhanh xu hướng tính cách của một người theo năm sinh,
          và đoán trước hai người dễ bắt nhịp hay dễ lệch nhịp ở đâu — mà không rơi vào kiêng kỵ hay
          phán số mệnh?
        </>
      }
      why={
        <>
          12 con giáp là {strong('12 Địa Chi')} của lịch pháp Á Đông, mỗi năm gắn một con giáp và một{' '}
          {strong('ngũ hành')} (Kim – Mộc – Thủy – Hỏa – Thổ). Người xưa dùng nó như một{' '}
          {strong('khung trò chuyện tham khảo')} về xu hướng tính cách và “nhịp” giữa người với người —
          không phải phán quyết số phận.
        </>
      }
      what={
        <>
          Là 12 nhóm theo năm sinh, mỗi con giáp có một xu hướng tính cách, một hành ngũ hành, cùng hai
          quan hệ hay nhắc tới: {strong('Tam Hợp')} (nhóm hợp nhịp) và {strong('Tứ hành xung')} (cặp
          khác nhịp). {strong('Không phải')} công cụ khuyên ai “đừng cưới / đừng hợp tác” — nó chỉ chia
          loài người thành vỏn vẹn 12 nhóm nên rất thô.
        </>
      }
      how={
        <>
          Từ năm sinh → ra con giáp (Địa Chi) + hành của nó. Xét con giáp rơi vào nhóm Tam Hợp nào (ba
          chi cách đều 4 ngôi, hội thành một cục ngũ hành), và cặp {strong('Tứ hành xung')} đối nhịp
          (hai chi đối xứng 180° trên vòng). Đọc xu hướng tính cách theo hành, rồi soi quan hệ để biết
          chỗ dễ hợp và chỗ cần dung hoà.
        </>
      }
      soWhat={
        <>
          Để hiểu nhanh xu hướng của mình và người quanh mình, biết một cặp dễ ăn ý ở đâu, dễ lệch nhịp
          ở đâu, rồi {strong('chủ động dung hoà bằng thái độ')} — không kiêng kỵ, không hoãn cưới,
          không đổi tuổi. Muốn sâu và đáng tin hơn thì xem lá số đầy đủ (Bát Tự / Tử Vi).
        </>
      }
    />
  );
}

export function ConGiapDepth() {
  return (
    <DepthTabs
      topicId="con-giap"
      concept="Con giáp thứ 4: người Việt là Mèo, người Trung Quốc là Thỏ — cùng một Địa Chi Mão"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Có 12 con vật thay phiên nhau làm “con giáp” mỗi năm. Con thứ tư ở Việt Nam là{' '}
              {strong('con Mèo')} 🐰, còn ở Trung Quốc lại là con Thỏ. Hai nước kể hơi khác nhau một
              chút, nhưng vẫn là cùng một ô trên vòng 12 con giáp.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                12 con giáp thật ra là 12 {strong('Địa Chi')}: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi,
                Thân, Dậu, Tuất, Hợi. Ô thứ tư tên chữ là {strong('Mão')}. Người Việt gán con Mèo cho ô
                này, người Trung Quốc gán con Thỏ — nên khi ai đó nói “tuổi Thỏ”, với mình đó chính là{' '}
                {strong('tuổi Mèo (Mão)')}.
              </p>
              <p>
                Điều quan trọng là dù gọi Mèo hay Thỏ, {strong('ngũ hành và các quan hệ vẫn giữ nguyên')}{' '}
                (Mão thuộc hành Mộc, nằm cùng một chỗ trên vòng). Tên con vật chỉ là cách kể của mỗi văn
                hoá, không đổi bản chất địa chi.
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
                Hệ 12 con giáp gốc là 12 Địa Chi, mỗi chi mang một hành cố định (vd Tý – Thủy, Mão –
                Mộc, Ngọ – Hỏa). {strong('Tam Hợp')} là ba chi cách đều 4 ngôi hội thành một cục ngũ
                hành (Thân–Tý–Thìn = Thủy; Dần–Ngọ–Tuất = Hỏa; Tỵ–Dậu–Sửu = Kim; Hợi–Mão–Mùi = Mộc).
              </p>
              <p>
                {strong('Tứ hành xung')} là cách nói dân gian cho các cặp lục xung — hai chi đối xứng
                180° trên vòng (Tý–Ngọ, Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi). “Xung” chỉ là{' '}
                {strong('khác nhịp cần dung hoà')}, không phải điềm xấu. Việc con thứ tư là Mèo (VN) hay
                Thỏ (TQ) chỉ là khác biệt biểu tượng văn hoá — Địa Chi Mão, hành Mộc và mọi quan hệ Tam
                Hợp / xung của nó không hề đổi.
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
    prompt: 'Vì sao xem tính cách theo 12 con giáp được coi là một lát cắt rất “thô”?',
    answer: (
      <>
        Vì nó {strong('chỉ dùng năm sinh')} nên chia loài người thành vỏn vẹn 12 nhóm. Lá số đầy đủ
        (Bát Tự / Tử Vi) dùng cả năm – tháng – ngày – giờ cùng yếu tố con người nên chi tiết và đáng tin
        hơn nhiều. Con giáp hữu ích như một “khung trò chuyện” để hiểu xu hướng, không phải phán quyết.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Con giáp thứ tư trong tiếng Việt là con gì?',
    choices: [
      {
        text: 'Con Mèo — cùng một Địa Chi Mão, người Trung Quốc gọi là Thỏ',
        correct: true,
        note: 'Đúng — người Việt gán con Mèo cho Địa Chi Mão; người Trung Quốc gán con Thỏ. Cùng một ô, chỉ khác biểu tượng.',
      },
      {
        text: 'Con Thỏ — tiếng Việt và tiếng Trung giống hệt nhau',
        note: 'Không — trong tiếng Việt con thứ tư là Mèo, khác với Thỏ của Trung Quốc.',
      },
      {
        text: 'Con Rồng',
        note: 'Không — Rồng (Thìn) là con thứ năm.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Tam Hợp được tạo thành như thế nào?',
    choices: [
      {
        text: 'Ba con giáp cách đều 4 ngôi, hội tụ thành một cục ngũ hành (vd Hợi–Mão–Mùi = Mộc)',
        correct: true,
        note: 'Đúng — bốn nhóm: Thân–Tý–Thìn (Thủy), Dần–Ngọ–Tuất (Hỏa), Tỵ–Dậu–Sửu (Kim), Hợi–Mão–Mùi (Mộc).',
      },
      {
        text: 'Hai con giáp đối xứng 180° trên vòng',
        note: 'Đó là mô tả của Tứ hành xung (cặp đối nhịp), không phải Tam Hợp.',
      },
      {
        text: 'Ba con giáp cùng một hành chính giống nhau sẵn',
        note: 'Không — Tam Hợp là ba chi cách đều 4 ngôi hội thành cục, không cần cùng hành từ trước.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Hai người thuộc cặp “tứ hành xung” thì có nên cưới hoặc hợp tác không?',
    choices: [
      {
        text: 'Không nên — cần hoãn cưới hoặc đổi tuổi cho hợp',
        note: 'Sai với tinh thần bài: dứt khoát không kiêng kỵ, không hoãn cưới, không đổi tuổi.',
      },
      {
        text: 'Có — “xung” chỉ là khác nhịp cần thấu hiểu; nhiều cặp xung vẫn rất bền',
        correct: true,
        note: 'Đúng. Điều quyết định là thiện chí, giao tiếp, giá trị chung và năng lực thật.',
      },
      {
        text: 'Tùy — phải làm lễ giải xung trước đã',
        note: 'Không — hướng hoá giải lành mạnh là chủ động hiểu nhau, không phải làm lễ giải.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Một người nói “tôi tuổi Thỏ”. Với hệ con giáp Việt Nam, họ thuộc con giáp và ngũ hành nào?',
    answer: (
      <>
        Họ thuộc tuổi {strong('Mèo (Mão)')} — cùng một Địa Chi với “tuổi Thỏ” của Trung Quốc, chỉ khác
        biểu tượng con vật. Mão thuộc hành {strong('Mộc')}, và mọi quan hệ Tam Hợp (Hợi–Mão–Mùi) hay
        tứ hành xung (Mão–Dậu) của nó đều giữ nguyên dù gọi là Mèo hay Thỏ.
      </>
    ),
  },
];

export function ConGiapRecall() {
  return <ActiveRecall topicId="con-giap" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được 12 con giáp dùng để làm gì (khung tham khảo về xu hướng tính cách + “nhịp” giữa hai người) — và nó KHÔNG hứa gì (không phán số mệnh, không khuyên kiêng cưới / kiêng hợp tác).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả mạch xét: từ năm sinh ra con giáp (Địa Chi) + ngũ hành của nó → đọc xu hướng tính cách → soi Tam Hợp và Tứ hành xung để biết chỗ hợp nhịp / lệch nhịp.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt được Tam Hợp (ba chi cách đều 4 ngôi hội thành cục ngũ hành) với Tứ hành xung (cặp hai chi đối xứng 180°, khác nhịp).',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra giới hạn của con giáp (chỉ dùng năm sinh, chia thô 12 nhóm) và vì sao nó chỉ là tham khảo, không thay được lá số đầy đủ theo giờ – ngày – tháng.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Áp dụng cho tình cảm / làm ăn: cặp khác nhịp chỉ nghĩa là cần thấu hiểu và phân vai rõ, chứ tình cảm và hợp tác do thiện chí, giá trị chung và năng lực quyết định.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao “tứ hành xung” không = xấu, và vì sao con giáp thứ tư là Mèo (VN) hay Thỏ (TQ) chỉ là khác biểu tượng — cùng một Địa Chi Mão, hành Mộc.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người chưa biết vì sao một cặp “xung” vẫn có thể rất bền, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd Tam Hợp hội cục, tứ hành xung, hay ngũ hành của từng chi) bạn vẫn còn thấy mơ hồ.',
  },
];

export function ConGiapChecklist() {
  return <UnderstandingChecklist topicId="con-giap" facets={FACETS} />;
}

export function ConGiapWhys() {
  return (
    <FiveWhys
      topicId="con-giap"
      start={
        <>
          Một cặp đang yêu tra bảng thấy hai con giáp thuộc “tứ hành xung”, liền lo lắng “chắc không nên
          cưới, phải hoãn hoặc đổi tuổi”.
        </>
      }
      chain={[
        {
          question: 'Vì sao lo lắng “xung tuổi nên đừng cưới” lại là hiểu sai?',
          because: <>Vì {strong('“xung” không có nghĩa là xấu')} hay không thể đi cùng nhau.</>,
        },
        {
          question: 'Vì sao “xung” lại không phải là xấu?',
          because: (
            <>
              Vì nó chỉ gợi ý {strong('hai nhịp sống khác nhau')}, đôi khi dễ va quan điểm — thực tế rất
              nhiều cặp “xung” lại rất bền.
            </>
          ),
        },
        {
          question: 'Vì sao khác nhịp lại có thể thành một cặp bền?',
          because: (
            <>
              Vì {strong('khác biệt đúng cách trở thành bổ sung')} — người tiến – người giữ, người nóng
              – người nguội bù trừ cho nhau.
            </>
          ),
        },
        {
          question: 'Vì sao con giáp không đủ để phán chuyện cưới xin?',
          because: (
            <>
              Vì con giáp {strong('chỉ dùng năm sinh')}, chia loài người thành vỏn vẹn 12 nhóm — một lát
              cắt rất thô.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên dùng con giáp?',
          because: (
            <>
              Vì thứ quyết định là {strong('thiện chí, giao tiếp, giá trị chung và năng lực thật')},
              không phải năm sinh — nên con giáp chỉ nên là khung để hiểu xu hướng, kèm hướng dung hoà
              bằng thái độ.
            </>
          ),
        },
      ]}
      root={
        <>
          12 con giáp là một lát cắt tham khảo rất nhỏ theo năm sinh. “Tứ hành xung” chỉ là khác nhịp,
          không phải điềm xấu — nhiều cặp khác nhịp lại rất bền. Đừng để năm sinh quyết định thay cho
          thiện chí, giao tiếp và giá trị chung; tuyệt đối không kiêng kỵ, không hoãn cưới, không đổi
          tuổi.
        </>
      }
    />
  );
}
