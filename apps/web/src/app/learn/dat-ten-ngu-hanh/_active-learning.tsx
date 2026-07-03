/**
 * Nội dung "học chủ động" cho trang /learn/dat-ten-ngu-hanh.
 *
 * TẤT CẢ grounded từ quan niệm đặt tên theo Ngũ Hành: chọn tên bổ trợ hành
 * đang thiếu / là dụng thần trong Bát Tự bé, nhận biết hành của chữ qua bộ thủ
 * chữ Hán hoặc nghĩa, rồi ghép thành tên hay (nghĩa đẹp + âm hài hoà + hợp
 * phong tục). KHÔNG thêm dữ kiện mới. Giữ giọng "tham khảo theo phong tục,
 * không máy móc" — đề cao NGHĨA + ÂM + tình cảm gia đình hơn quy tắc cứng, và
 * trung thực về giới hạn (ngũ hành trong tên không quyết định vận mệnh).
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

export function DatTenFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bố mẹ muốn đặt cho con một cái tên {strong('vừa hay vừa có ý nghĩa')}, và nghe nói “nên chọn
          tên hợp ngũ hành” — nhưng không biết bắt đầu từ đâu, sợ chọn sai hoặc chọn chữ khó đọc chỉ
          để “đủ hành”.
        </>
      }
      why={
        <>
          Đặt tên theo Ngũ Hành là một {strong('nét văn hoá phương Đông')}: chọn tên sao cho hành của
          nó bổ trợ cho lá số Bát Tự của bé — bổ hành đang thiếu, tránh hành gây xung khắc, giúp cân
          bằng Kim – Mộc – Thủy – Hỏa – Thổ. Đây là một lớp tham khảo, không phải luật bắt buộc.
        </>
      }
      what={
        <>
          Một cái tên hay trước hết là {strong('nghĩa đẹp + âm dễ thương + tình cảm gia đình gửi gắm')}.
          Ngũ hành chỉ là {strong('lớp tham khảo bổ sung')} — không nên máy móc chọn chữ khó đọc, khó
          hiểu chỉ để cho “đủ hành”.
        </>
      }
      how={
        <>
          Ba bước: (1) {strong('lập Bát Tự bé')} để xem hành nào thiếu (dụng thần); (2){' '}
          {strong('chọn chữ mang hành cần bổ')} — nhận biết qua bộ thủ chữ Hán hoặc qua nghĩa/âm; (3){' '}
          {strong('ghép thành tên hay')}: nghĩa đẹp, âm hài hoà, hợp họ và phong tục gia đình.
        </>
      }
      soWhat={
        <>
          Để chọn được một cái tên {strong('theo con cả đời')} mà bé sống thoải mái, tự hào — dùng ngũ
          hành như một góc gợi ý để tham khảo, chứ không để áp lực “đúng hành” lấn át ý nghĩa và sự dễ
          thương của tên.
        </>
      }
    />
  );
}

export function DatTenDepth() {
  return (
    <DepthTabs
      topicId="dat-ten-ngu-hanh"
      concept="Vì sao ngũ hành chỉ là lớp tham khảo, còn nghĩa và âm mới là cái gốc của một tên hay"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Đặt tên cho em bé giống như tặng một món quà đi theo cả đời. Món quà ấy cần{' '}
              {strong('dễ thương và dễ gọi')} trước đã. Có người còn xem thêm “em bé thiếu chất gì” để
              chọn chữ hợp — nhưng đó chỉ là {strong('điểm cộng thêm')}, không phải điều quan trọng nhất.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Người ta lập {strong('Bát Tự')} của bé (từ giờ – ngày – tháng – năm sinh) để xem trong
                năm hành Kim – Mộc – Thủy – Hỏa – Thổ, hành nào đang {strong('thiếu')} hoặc cần bổ (gọi
                là dụng thần). Rồi chọn chữ mang hành đó để đặt tên, giúp lá số cân bằng hơn.
              </p>
              <p>
                Nhận biết hành của một chữ thường qua {strong('bộ thủ chữ Hán')}: chữ có bộ Thủy (氵)
                thuộc hành Thủy, bộ Mộc (木) thuộc hành Mộc… Nhưng quy tắc này chỉ để tham khảo — chọn
                chữ mà {strong('nghĩa đẹp, âm hay')} vẫn quan trọng hơn là ép cho đủ hành.
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
                Quy trình đầy đủ: lập Bát Tự → xét vượng – nhược của Nhật Chủ và ngũ hành trong tứ trụ →
                xác định {strong('dụng thần')} (hành cần bổ), tránh hành gây xung khắc. Sau đó chọn chữ
                mang hành cần bổ, nhận biết qua {strong('bộ thủ')} (Thủy 氵: Giang, Hà, Hải, Khê; Mộc 木:
                Lâm, Nam, Bách, Kha; Hỏa 火/日: Huân, Dương, Minh; Kim 金: Ngân, Cẩm, Chung; Thổ 土/山:
                Sơn, Khôn, Phong) hoặc qua nghĩa/âm gợi hành.
              </p>
              <p>
                Một số trường phái thêm lớp {strong('số nét chữ')} (Thiên/Địa/Nhân/Tổng cách, tam tài) —
                phức tạp, tuỳ hệ, chỉ nên xem là {strong('lớp tham khảo phụ')}. Điều cần giữ tỉnh táo:
                ngũ hành trong tên là quan niệm văn hoá, {strong('không có bằng chứng quyết định vận mệnh')}.
                Đừng để áp lực “chọn đúng hành” lấn át nghĩa đẹp, âm hay và sự thoải mái của bé.
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
    prompt: 'Ý tưởng cốt lõi của đặt tên theo Ngũ Hành là gì?',
    answer: (
      <>
        Chọn tên (tên đệm + tên chính) sao cho {strong('hành của tên bổ trợ cho lá số Bát Tự của bé')} —
        bổ hành đang thiếu / là dụng thần, tránh hành gây xung khắc — để cân bằng Kim – Mộc – Thủy –
        Hỏa – Thổ. Đây là một lớp tham khảo, không phải luật bắt buộc.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Làm sao biết bé đang thiếu hành nào để bổ?',
    choices: [
      {
        text: 'Lập Bát Tự của bé từ giờ – ngày – tháng – năm sinh, xem hành nào vượng/nhược, thiếu hành nào (dụng thần)',
        correct: true,
        note: 'Đúng — đó là bước 1, xác định hành cần bổ.',
      },
      { text: 'Nhìn vào họ của bố để suy ra', note: 'Không — họ không cho biết hành thiếu; phải xét Bát Tự.' },
      { text: 'Chọn đại một hành cho đẹp', note: 'Không — cần lập Bát Tự để biết hành nào cần bổ.' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Có bắt buộc phải đặt tên theo ngũ hành không?',
    choices: [
      {
        text: 'Không — một tên hay trước hết là nghĩa đẹp + âm dễ thương + tình cảm gia đình; ngũ hành chỉ là lớp tham khảo',
        correct: true,
        note: 'Đúng — ngũ hành là điểm cộng thêm, không phải luật cứng.',
      },
      { text: 'Có — nếu không hợp hành thì bé sẽ gặp xui', note: 'Không — ngũ hành trong tên không quyết định vận mệnh.' },
      { text: 'Có — mọi cái tên đều phải đủ 5 hành', note: 'Không — không có quy tắc “đủ 5 hành” bắt buộc.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Có nên chọn một chữ khó đọc, khó hiểu chỉ để cho “đủ hành” không?',
    choices: [
      {
        text: 'Không — tên theo con cả đời, nên ưu tiên để bé đọc – viết dễ, sống thoải mái; đừng máy móc vì đủ hành',
        correct: true,
        note: 'Đúng — nghĩa đẹp và âm hay quan trọng hơn việc ép đủ hành.',
      },
      {
        text: 'Có — miễn đủ hành là được, khó đọc cũng không sao',
        note: 'Không — chọn chữ khó chỉ để đủ hành là máy móc, dễ khiến bé chịu thiệt.',
      },
      { text: 'Có — chữ càng lạ càng quý', note: 'Không — lạ không đồng nghĩa với hay; dễ đọc dễ viết mới lợi cho bé.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Bát Tự bé cho thấy thiếu hành Thủy. Bạn sẽ chọn chữ theo hướng nào, và cần cân nhắc thêm điều gì trước khi chốt tên?',
    answer: (
      <>
        Ưu tiên chữ mang {strong('hành Thủy')} — nhận biết qua bộ thủ Thủy (氵) như Giang, Hà, Hải,
        Khê, hoặc qua nghĩa/âm gợi Thủy. Nhưng trước khi chốt vẫn cần cân nhắc: {strong('nghĩa đẹp')},{' '}
        {strong('âm hài hoà')} với họ (thanh điệu dễ nghe), dễ đọc dễ viết, không phạm huý / trùng tên
        người trên trong nhà. Nếu chữ hợp hành nhưng khó đọc hoặc nghĩa không hay, nên chọn phương án
        khác — vì tên đi theo con cả đời.
      </>
    ),
  },
];

export function DatTenRecall() {
  return <ActiveRecall topicId="dat-ten-ngu-hanh" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được đặt tên theo ngũ hành dùng để làm gì (chọn tên bổ hành thiếu trong Bát Tự bé) — và nó KHÔNG hứa gì (không quyết định vận mệnh, không bắt buộc).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả được quy trình 3 bước: lập Bát Tự tìm hành cần bổ → chọn chữ mang hành đó → ghép thành tên hay.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Nhận biết hành của một chữ qua bộ thủ chữ Hán (Thủy 氵, Mộc 木, Hỏa 火/日, Kim 金, Thổ 土/山) hoặc qua nghĩa/âm gợi hành.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt được “tên hợp hành” với “tên hay”: một tên hay cần nghĩa đẹp + âm hài hoà + hợp phong tục, ngũ hành chỉ là lớp thêm.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra lớp số nét chữ (tam tài, tứ cách) chỉ là tham khảo phụ, tuỳ hệ; và ngũ hành trong tên là quan niệm văn hoá, không có bằng chứng quyết định vận mệnh.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao KHÔNG nên chọn chữ khó đọc / khó hiểu chỉ để “đủ hành”, và vì sao không cần lo sợ nếu tên chưa “đúng hành”.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người thân “đặt tên theo ngũ hành là gì và nên hiểu ra sao” bằng lời của bạn, giữ giọng tham khảo, đề cao nghĩa và âm.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được phần nào (vd cách lập Bát Tự, xác định dụng thần, đọc bộ thủ) bạn vẫn còn thấy mơ hồ.',
  },
];

export function DatTenChecklist() {
  return <UnderstandingChecklist topicId="dat-ten-ngu-hanh" facets={FACETS} />;
}

export function DatTenWhys() {
  return (
    <FiveWhys
      topicId="dat-ten-ngu-hanh"
      start={
        <>
          Một cặp bố mẹ nghe nói con “thiếu hành Kim”, liền định chọn một chữ Hán rất lạ và khó đọc chỉ
          vì nó mang bộ Kim — dù cả nhà thấy tên ấy trúc trắc, khó gọi và nghĩa không rõ.
        </>
      }
      chain={[
        {
          question: 'Vì sao chọn một chữ khó đọc chỉ vì nó “đủ hành” lại là quyết định chưa hợp lý?',
          because: (
            <>
              Vì một cái tên hay trước hết là {strong('nghĩa đẹp + âm dễ thương')}, chứ không phải chỉ
              cần mang đúng hành.
            </>
          ),
        },
        {
          question: 'Vì sao nghĩa và âm lại quan trọng hơn việc “đủ hành”?',
          because: (
            <>
              Vì tên là {strong('món quà theo con cả đời')} — bé sẽ đọc, viết, giới thiệu tên mình mỗi
              ngày; dễ đọc dễ hiểu và tự hào với tên mới là điều bé cần.
            </>
          ),
        },
        {
          question: 'Vì sao ngũ hành lại chỉ nên là một lớp tham khảo, không phải luật bắt buộc?',
          because: (
            <>
              Vì ngũ hành trong tên là {strong('quan niệm văn hoá')}, không có bằng chứng quyết định vận
              mệnh — nó gợi ý để cân bằng, không phải điều kiện để bé được hạnh phúc.
            </>
          ),
        },
        {
          question: 'Vì sao vẫn có người muốn xem ngũ hành khi đặt tên?',
          because: (
            <>
              Vì đó là một {strong('nét văn hoá đẹp')}: bố mẹ gửi mong muốn con được cân bằng, may mắn
              vào cái tên. Dùng như lời chúc để tham khảo thì rất ý nghĩa.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên đặt tên cho con?',
          because: (
            <>
              Vì hiểu vậy rồi thì ta {strong('không máy móc')}: lấy nghĩa đẹp – âm hay – tình cảm gia
              đình làm gốc, xem ngũ hành như một góc gợi ý; nếu chữ hợp hành mà khó đọc hoặc nghĩa
              không hay thì chọn phương án khác.
            </>
          ),
        },
      ]}
      root={
        <>
          Đặt tên theo ngũ hành là một nét văn hoá đáng trân trọng để gửi lời chúc cân bằng vào tên
          con, nhưng không phải bản án. Hãy để {strong('nghĩa đẹp, âm hay và tình cảm gia đình')} làm
          gốc, ngũ hành là lớp tham khảo — {strong('tham khảo, không máy móc')}.
        </>
      }
    />
  );
}
