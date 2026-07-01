/**
 * Nội dung "học chủ động" cho trang /learn/hop-tuoi.
 *
 * TẤT CẢ grounded từ chính bài viết Hợp tuổi (hệ Can Chi, Lục Thập Hoa Giáp,
 * Tam Hợp / Lục Hợp / Lục Xung / Lục Hại, mệnh nạp âm, và tinh thần "con giáp
 * chỉ là một lát cắt rất thô"). KHÔNG thêm dữ kiện mới. Giữ giọng "góc nhìn
 * tham khảo, dung hòa — không phán số mệnh, không kiêng kỵ".
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

export function HopTuoiFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao có một khung nhẹ nhàng để đoán trước hai người (yêu nhau, làm ăn, trong nhà) dễ bắt
          nhịp hay dễ va nhau ở đâu — mà không rơi vào kiêng kỵ hay hù dọa nhau?
        </>
      }
      why={
        <>
          Hợp tuổi dựa trên hệ {strong('Thiên Can – Địa Chi')} của lịch pháp Á Đông: mỗi năm gắn một
          con giáp, một Can và một mệnh nạp âm. Người xưa dùng nó như một{' '}
          {strong('khung trò chuyện tham khảo')} về “nhịp” giữa người với người — không phải phán
          quyết số mệnh.
        </>
      }
      what={
        <>
          Là việc đối chiếu Can Chi năm sinh của hai người để xếp họ vào một{' '}
          {strong('nhóm quan hệ')} (Tam Hợp, Lục Hợp, Lục Xung, Lục Hại) và so lớp mệnh nạp âm.{' '}
          {strong('Không phải')} công cụ khuyên ai “đừng cưới / đừng hợp tác” — nó chỉ chia loài
          người thành vỏn vẹn 12 nhóm theo năm sinh nên rất thô.
        </>
      }
      how={
        <>
          Từ năm sinh → ra con giáp (Địa Chi) + Can + mệnh nạp âm. Xét con giáp rơi vào nhóm nào (Tam
          Hợp / Lục Hợp = dễ chịu; Lục Xung / Lục Hại = khác nhịp cần thấu hiểu), rồi xét thêm{' '}
          {strong('nạp âm')} tương sinh / tương khắc. Luận cần nói rõ đang xét theo lớp nào — nạp âm
          hay chính ngũ hành của con giáp.
        </>
      }
      soWhat={
        <>
          Để biết một cặp dễ ăn ý ở đâu, dễ lệch nhịp ở đâu, rồi {strong('chủ động dung hòa bằng thái độ')} —
          không kiêng kỵ, không hoãn cưới, không đổi tuổi. Muốn sâu và đáng tin hơn thì xem lá số đầy
          đủ (Bát Tự / Tử Vi).
        </>
      }
    />
  );
}

export function HopTuoiDepth() {
  return (
    <DepthTabs
      topicId="hop-tuoi"
      concept="Vì sao “xung tuổi” không có nghĩa là xấu — nhóm quan hệ chỉ là “nhịp”"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Hai người như hai bài hát. Cùng nhịp thì dễ hát chung ({strong('hợp')}); khác nhịp thì
              lúc đầu hơi vấp ({strong('xung')}) — nhưng tập một chút là hát rất hay. Khác nhịp{' '}
              {strong('không phải là hỏng')}.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Các nhóm quan hệ chỉ nói về {strong('nhịp sống')}, không phải tốt hay xấu. Tam Hợp và
                Lục Hợp là “cùng nhịp / bổ trợ” nên dễ chịu; Lục Xung và Lục Hại là “khác nhịp” nên
                đôi khi dễ va quan điểm.
              </p>
              <p>
                Thực tế rất nhiều cặp {strong('“xung”')} lại rất bền, vì khác biệt đúng cách trở thành
                bổ sung (người tiến – người giữ, người nóng – người nguội). Hướng hóa giải lành mạnh
                là chủ động hiểu nhau và nhường nhịn đúng lúc — không phải kiêng nhau hay làm lễ giải.
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
                Lục Xung là sáu cặp Chi đối xứng 180° trên vòng (Tý–Ngọ, Sửu–Mùi, Dần–Thân, Mão–Dậu,
                Thìn–Tuất, Tỵ–Hợi). Có {strong('hai cơ chế')} khác nhau: bốn cặp khác hành xung do
                đối khắc về ngũ hành; còn hai cặp cùng hành Thổ (Sửu–Mùi, Thìn–Tuất) là{' '}
                {strong('“xung mộ khố”')} — các tàng can trong kho Thổ va nhau, không phải đối khắc về
                hành.
              </p>
              <p>
                Lục Hại (Tý–Mùi, Sửu–Ngọ, Dần–Tỵ, Mão–Thìn, Thân–Hợi, Dậu–Tuất) nhẹ hơn Lục Xung về
                “lực”, nhưng kiểu khó chịu là {strong('hiểu lầm âm ỉ')} hơn là va chạm bùng nổ. Dù cơ
                chế khác nhau, kết luận không đổi: đây là tín hiệu “cần thấu hiểu nhiều hơn”, không
                phải điềm xấu để kiêng nhau.
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
    prompt: 'Vì sao hợp tuổi theo con giáp được xem là một lát cắt rất “thô”?',
    answer: (
      <>
        Vì nó {strong('chỉ dùng năm sinh')} nên chia loài người thành vỏn vẹn 12 nhóm. Lá số đầy đủ
        (Bát Tự / Tử Vi) dùng cả năm – tháng – ngày – giờ cùng yếu tố con người nên chi tiết và đáng
        tin hơn nhiều. Hợp tuổi hữu ích như một “khung trò chuyện”, không phải phán quyết.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Tam Hợp được tạo thành như thế nào?',
    choices: [
      {
        text: 'Ba con giáp cách nhau đều 4 ngôi, hội tụ thành một cục ngũ hành (vd Thân–Tý–Thìn = Thủy)',
        correct: true,
        note: 'Đúng — bốn nhóm: Thân–Tý–Thìn (Thủy), Dần–Ngọ–Tuất (Hỏa), Tỵ–Dậu–Sửu (Kim), Hợi–Mão–Mùi (Mộc).',
      },
      {
        text: 'Hai con giáp đối xứng 180° trên vòng',
        note: 'Đó là mô tả của Lục Xung (cặp đối nhịp), không phải Tam Hợp.',
      },
      {
        text: 'Ba con giáp cùng một hành chính giống nhau',
        note: 'Không — Tam Hợp là ba Chi cách đều 4 ngôi hội thành cục, không cần cùng hành sẵn.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Hai người “xung tuổi” thì có nên cưới hoặc hợp tác không?',
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
        note: 'Không — hướng hóa giải lành mạnh là chủ động hiểu nhau, không phải làm lễ giải.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt: 'Khi đối chiếu hai mệnh nạp âm, quan hệ “A khắc B” nên hiểu thế nào?',
    answer: (
      <>
        Không phải điềm xấu. “A khắc B” chỉ là {strong('hai “chất” khác nhau cần dung hòa')} — nhiều
        nhà còn xem là sự bù trừ. Không có chuyện phải “đổi mệnh” cho hợp. Và cần nói rõ đang xét theo
        lớp nào: {strong('nạp âm')} hay chính ngũ hành của con giáp.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Có hai người cùng con giáp Sửu và Mùi (Lục Xung), nhưng cả hai đều cùng hành Thổ. Vì sao vẫn gọi là “xung” dù không đối khắc về ngũ hành?',
    answer: (
      <>
        Vì Lục Xung có {strong('hai cơ chế')}. Sửu–Mùi (và Thìn–Tuất) là cặp cùng hành Thổ nên không
        phải đối khắc về hành, mà là {strong('“xung mộ khố”')} — các tàng can trong kho Thổ va nhau.
        Bốn cặp còn lại (Tý–Ngọ, Dần–Thân, Mão–Dậu, Tỵ–Hợi) mới xung do đối khắc về ngũ hành.
      </>
    ),
  },
];

export function HopTuoiRecall() {
  return <ActiveRecall topicId="hop-tuoi" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được hợp tuổi dùng để làm gì (khung tham khảo về “nhịp” giữa hai người) — và nó KHÔNG hứa gì (không phán số mệnh, không khuyên kiêng cưới / kiêng hợp tác).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả mạch xét: từ năm sinh ra con giáp + Can + mệnh nạp âm → xếp nhóm quan hệ (Tam Hợp / Lục Hợp / Lục Xung / Lục Hại) → so nạp âm tương sinh / tương khắc.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt được Tam Hợp (ba Chi cách đều 4 ngôi thành cục) với Lục Hợp (sáu cặp bổ trợ), và Lục Xung (đối nhịp) với Lục Hại (khác kênh, nhẹ hơn).',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra giới hạn của hợp tuổi (chỉ dùng năm sinh, rất thô) và vì sao Lục Hợp “hóa hành” hay các kiêng kỵ dân gian chỉ là tham khảo (các phái không nhất trí).',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Áp dụng cho vợ chồng / làm ăn / sinh con: nhóm khác nhịp chỉ nghĩa là cần thấu hiểu và phân vai rõ, chứ tình cảm và hợp tác do thiện chí, giá trị chung và năng lực quyết định.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao “xung tuổi” không = xấu, “A khắc B” về nạp âm không = điềm gở, và không có chuyện con “khắc” hay “mang lỗi” với cha mẹ.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người chưa biết vì sao một cặp “xung” vẫn có thể rất bền, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd nạp âm, “xung mộ khố”, hay hai lớp ngũ hành) bạn vẫn còn thấy mơ hồ.',
  },
];

export function HopTuoiChecklist() {
  return <UnderstandingChecklist topicId="hop-tuoi" facets={FACETS} />;
}

export function HopTuoiWhys() {
  return (
    <FiveWhys
      topicId="hop-tuoi"
      start={
        <>
          Một cặp đang yêu tra bảng thấy hai tuổi “xung nhau”, liền lo lắng “chắc không nên cưới, phải
          hoãn hoặc đổi tuổi”.
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
              Vì nó chỉ gợi ý {strong('hai nhịp sống khác nhau')}, đôi khi dễ va quan điểm — thực tế
              rất nhiều cặp “xung” lại rất bền.
            </>
          ),
        },
        {
          question: 'Vì sao khác nhịp lại có thể thành một cặp bền?',
          because: (
            <>
              Vì {strong('khác biệt đúng cách trở thành bổ sung')} — người tiến – người giữ, người
              nóng – người nguội bù trừ cho nhau.
            </>
          ),
        },
        {
          question: 'Vì sao con giáp không đủ để phán chuyện cưới xin?',
          because: (
            <>
              Vì con giáp {strong('chỉ dùng năm sinh')}, chia loài người thành vỏn vẹn 12 nhóm — một
              lát cắt rất thô.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên dùng hợp tuổi?',
          because: (
            <>
              Vì thứ quyết định là {strong('thiện chí, giao tiếp, giá trị chung và năng lực thật')},
              không phải năm sinh — nên hợp tuổi chỉ nên là khung trò chuyện, kèm hướng dung hòa bằng
              thái độ.
            </>
          ),
        },
      ]}
      root={
        <>
          Hợp tuổi là một lát cắt tham khảo rất nhỏ. “Xung” chỉ là khác nhịp, không phải điềm xấu —
          nhiều cặp khác nhịp lại rất bền. Đừng để năm sinh quyết định thay cho thiện chí, giao tiếp
          và giá trị chung; tuyệt đối không kiêng kỵ, không hoãn cưới, không đổi tuổi.
        </>
      }
    />
  );
}
