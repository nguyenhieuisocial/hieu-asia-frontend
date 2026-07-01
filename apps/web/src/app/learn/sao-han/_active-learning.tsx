/**
 * Nội dung "học chủ động" cho trang /learn/sao-han.
 *
 * TẤT CẢ grounded từ chính công cụ /sao-han và lib/sao-han.ts (9 sao Cửu Diệu,
 * cách tính theo tuổi mụ + giới tính, phân loại tốt/trung/xấu, nguồn gốc
 * Navagraha, La Hầu / Kế Đô là giao điểm chứ không phải sao thật). KHÔNG thêm dữ
 * kiện mới. Giữ giọng "tham khảo, không phán định — không mê tín, không bán lễ".
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

export function SaoHanFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Đầu năm nhiều người muốn biết {strong('“năm nay nên lưu ý điều gì”')} — một lời nhắc theo
          phong tục để sống chủ động hơn, thay vì lo lắng mơ hồ hay nghe theo lời phán số mệnh.
        </>
      }
      why={
        <>
          Sao hạn (Cửu Diệu niên hạn) là cách người xưa gửi lời nhắc ấy {strong('lên bầu trời')}: mỗi
          năm có một trong 9 sao “chiếu” vào mỗi người. Nó tồn tại như một{' '}
          {strong('di sản văn hoá tín ngưỡng')}, không phải án phạt định sẵn.
        </>
      }
      what={
        <>
          9 sao {strong('Cửu Diệu')}: 3 sao tốt (Thái Dương, Thái Âm, Mộc Đức), 3 trung tính (Thổ Tú,
          Thủy Diệu, Vân Hớn), 3 sao xấu (La Hầu, Kế Đô, Thái Bạch). {strong('Không phải')} lời phán
          may – rủi chắc chắn — chỉ là một góc nhìn để tham khảo.
        </>
      }
      how={
        <>
          Lấy {strong('tuổi mụ')} (≈ năm xem − năm sinh + 1), rồi lấy phần dư khi chia cho 9; đối chiếu
          vào {strong('bảng riêng cho nam và nữ')} — cùng một tuổi, sao chiếu của nam và nữ khác nhau.
          Công cụ tự tính khi bạn nhập năm sinh + giới tính.
        </>
      }
      soWhat={
        <>
          Để biết năm nay {strong('nên cẩn trọng điều gì')} (lời nói, tiền bạc – giấy tờ, sức khoẻ) và
          chủ động hơn — gặp sao xấu không phải điều đáng sợ, gặp sao tốt cũng không nên buông lơi.
        </>
      }
    />
  );
}

export function SaoHanDepth() {
  return (
    <DepthTabs
      topicId="sao-han"
      concept="Vì sao “sao xấu” không có nghĩa là chắc chắn gặp xui"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Sao hạn giống như dự báo thời tiết: năm “trời có thể mưa” thì mình mang theo ô cho chắc,
              chứ không phải chắc chắn ướt. {strong('Sao xấu')} chỉ là lời nhắc “năm nay cẩn thận hơn”,
              không phải điều đáng sợ.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                9 sao chia làm ba nhóm: {strong('cát tinh')} (Thái Dương, Thái Âm, Mộc Đức) hàm ý năm
                hanh thông; {strong('trung tính')} (Thổ Tú, Thủy Diệu, Vân Hớn) nhẹ nhàng, có vài điều
                cần chú ý; {strong('hung tinh')} (La Hầu, Kế Đô, Thái Bạch) hàm ý năm nên thận trọng.
              </p>
              <p>
                Nhưng “hung tinh” chỉ gợi ý {strong('nên cẩn trọng')} — giữ lời nói, thận trọng tiền
                bạc – giấy tờ, chú ý sức khoẻ. Sống cẩn thận và chủ động vẫn quan trọng hơn mọi điềm
                báo.
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
                Sao được suy từ {strong('tuổi mụ')} (năm xem − năm sinh + 1) lấy phần dư khi chia 9, rồi
                đối chiếu bảng {strong('riêng theo giới tính')}. Ví dụ với nam: dư 1 → La Hầu, dư 5 →
                Thái Dương, chia hết cho 9 → Mộc Đức; nữ có bảng khác (dư 1 → Kế Đô…). Cùng một tuổi,
                sao của nam và nữ do đó không giống nhau.
              </p>
              <p>
                Điểm cần hiểu để giữ tỉnh táo: {strong('La Hầu và Kế Đô không phải sao thật')} — là hai
                giao điểm nơi quỹ đạo Mặt Trăng cắt hoàng đạo (vùng trời xảy ra nhật thực, nguyệt
                thực). 7 “sao” còn lại mới là thiên thể thật (Mặt Trời, Mặt Trăng và 5 hành tinh). Biết
                nguồn gốc rồi thì không cần sợ, càng không cần tốn tiền “giải” một giao điểm hình học.
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
    prompt: 'Cách tính sao hạn dựa trên hai thông tin nào của một người?',
    answer: (
      <>
        Dựa trên {strong('tuổi mụ')} (tuổi âm ≈ năm xem − năm sinh + 1) và {strong('giới tính')}. Lấy
        tuổi mụ chia 9 lấy phần dư, rồi đối chiếu vào bảng riêng cho nam và nữ — vì cùng một tuổi, sao
        chiếu mệnh của nam và nữ khác nhau.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Ba sao nào thuộc nhóm cát tinh (tốt) trong Cửu Diệu?',
    choices: [
      { text: 'La Hầu, Kế Đô, Thái Bạch', note: 'Đây là ba hung tinh (nhóm cần thận trọng).' },
      {
        text: 'Thái Dương, Thái Âm, Mộc Đức',
        correct: true,
        note: 'Đúng — ba cát tinh: mặt trời, mặt trăng và sao Mộc.',
      },
      { text: 'Thổ Tú, Thủy Diệu, Vân Hớn', note: 'Đây là ba sao trung tính.' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'La Hầu và Kế Đô thực chất là gì?',
    choices: [
      {
        text: 'Hai giao điểm nơi quỹ đạo Mặt Trăng cắt hoàng đạo — vùng trời xảy ra nhật/nguyệt thực',
        correct: true,
        note: 'Đúng — không phải sao thật; đó là Rahu và Ketu.',
      },
      { text: 'Hai ngôi sao chổi cổ đại', note: 'Không — chúng không phải thiên thể có thật.' },
      { text: 'Hai hành tinh trong hệ Mặt Trời', note: 'Không — 5 hành tinh thật ứng với các sao khác.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Gặp năm có sao xấu (La Hầu, Kế Đô, Thái Bạch) thì nên hiểu thế nào?',
    choices: [
      {
        text: 'Chắc chắn sẽ gặp xui, nên làm lễ giải hạn cho an tâm',
        note: 'Không — sao xấu không đồng nghĩa chắc chắn gặp rủi; hieu.asia không bán lễ giải.',
      },
      {
        text: 'Là lời nhắc nên cẩn trọng hơn (lời nói, tiền bạc – giấy tờ, sức khoẻ); chủ động vẫn là điều quan trọng nhất',
        correct: true,
        note: 'Đúng — tham khảo để sống chủ động, không phải điềm báo cố định.',
      },
      { text: 'Cả năm không nên làm việc gì lớn', note: 'Không — phong tục chỉ gợi ý thận trọng, không cấm đoán.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Vì sao cùng sinh một năm, hai anh em (một nam một nữ) lại có sao hạn khác nhau trong cùng một năm xem?',
    answer: (
      <>
        Vì sao hạn tra theo {strong('bảng riêng cho nam và nữ')}. Dù tuổi mụ (và phần dư khi chia 9)
        giống nhau, bảng nam và bảng nữ ánh xạ phần dư đó sang các sao khác nhau — nên cùng một tuổi,
        nam và nữ chiếu hai sao khác nhau.
      </>
    ),
  },
];

export function SaoHanRecall() {
  return <ActiveRecall topicId="sao-han" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được sao hạn dùng để làm gì (lời nhắc theo phong tục “năm nay nên lưu ý điều gì”) — và nó KHÔNG hứa gì (không phán may – rủi chắc chắn).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả cách suy ra sao: tuổi mụ (năm xem − năm sinh + 1) → chia 9 lấy dư → đối chiếu bảng riêng nam/nữ.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể được 9 sao Cửu Diệu và chia đúng 3 nhóm: cát tinh, trung tính, hung tinh.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói được vì sao cùng tuổi nhưng nam và nữ lại có sao chiếu khác nhau.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra La Hầu và Kế Đô không phải sao thật (là giao điểm hoàng đạo), 7 “sao” còn lại mới là thiên thể thật.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao “sao xấu” không = chắc chắn gặp xui, và vì sao không cần sợ hay tốn tiền giải hạn.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người thân “sao hạn là gì và nên hiểu ra sao” bằng lời của bạn, giữ giọng tham khảo.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được phần nào (vd nguồn gốc Navagraha, bảng nam/nữ) bạn vẫn còn thấy mơ hồ.',
  },
];

export function SaoHanChecklist() {
  return <UnderstandingChecklist topicId="sao-han" facets={FACETS} />;
}

export function SaoHanWhys() {
  return (
    <FiveWhys
      topicId="sao-han"
      start={
        <>
          Đầu năm, một người tra thấy mình gặp sao Thái Bạch (“Thái Bạch quét sạch cửa nhà”), liền lo
          lắng cả năm sẽ mất mát, tính đi làm lễ giải hạn cho yên tâm.
        </>
      }
      chain={[
        {
          question: 'Vì sao thấy sao xấu rồi lo lắng cả năm lại là phản ứng chưa hợp lý?',
          because: <>Vì sao xấu {strong('không')} có nghĩa là chắc chắn gặp xui.</>,
        },
        {
          question: 'Vì sao sao xấu không đồng nghĩa với chắc chắn gặp xui?',
          because: (
            <>
              Vì theo quan niệm dân gian, đó chỉ là năm {strong('nên cẩn trọng hơn')} — giữ lời nói,
              thận trọng tiền bạc – giấy tờ, chú ý sức khoẻ.
            </>
          ),
        },
        {
          question: 'Vì sao lại chỉ là một lời nhắc “cẩn trọng”, không phải án phạt?',
          because: (
            <>
              Vì sao hạn là cách người xưa gửi lời nhắc {strong('“năm nay nên lưu ý điều gì”')} lên
              bầu trời — một di sản văn hoá, mang tính tham khảo.
            </>
          ),
        },
        {
          question: 'Vì sao lại là văn hoá tham khảo chứ không phải quy luật tất định?',
          because: (
            <>
              Vì bản thân các “sao” không quyết định đời ai — thậm chí La Hầu và Kế Đô{' '}
              {strong('không phải sao thật')}, chỉ là giao điểm hình học nơi xảy ra nhật/nguyệt thực.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên phản ứng với sao hạn?',
          because: (
            <>
              Vì hiểu nguồn gốc rồi thì {strong('không cần sợ')}, càng không cần tốn tiền “giải” một
              giao điểm — điều thực sự quyết định là sống cẩn thận và chủ động.
            </>
          ),
        },
      ]}
      root={
        <>
          Sao hạn là một nét văn hoá lâu đời để nhắc nhau sống cẩn trọng theo từng năm, không phải bản
          án. Gặp sao tốt đừng buông lơi, gặp sao xấu cũng không đáng sợ — hãy dùng nó như một góc nhìn
          để chủ động hơn, {strong('tham khảo, không phán định')}.
        </>
      }
    />
  );
}
