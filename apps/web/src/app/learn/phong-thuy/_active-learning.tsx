/**
 * Nội dung "học chủ động" cho trang /learn/phong-thuy.
 *
 * TẤT CẢ grounded từ chính bài viết Phong Thủy (hai nhánh Loan Đầu / Lý Khí; Bát
 * Trạch: Cung Phi → Đông tứ / Tây tứ mệnh → 8 hướng, 4 du niên tinh cát + 4 hung;
 * ngũ hành tương sinh / tương khắc; chọn ngày–giờ; xem tuổi & thước Lỗ Ban).
 * KHÔNG thêm dữ kiện mới, không phán họa phúc. Giữ giọng "quy tắc minh bạch để
 * tham khảo, không phán số mệnh".
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

export function PhongThuyFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao có một bộ quy tắc minh bạch để cân nhắc khi chọn hướng nhà, chọn ngày–giờ khởi sự,
          xem tuổi hay chọn kích thước — thay vì đoán mò hoặc tin lời phán mơ hồ?
        </>
      }
      why={
        <>
          Phong thủy (風水, "gió – nước") là tri thức cổ truyền về sắp đặt không gian sống hài hòa với
          môi trường và với {strong('khí')} (氣). Nó tồn tại như một{' '}
          {strong('khung tham khảo để cân nhắc')}, không phải bảo đảm họa phúc.
        </>
      }
      what={
        <>
          Truyền thống chia hai nhánh: {strong('Loan Đầu')} (quan sát hình thế thực địa) và{' '}
          {strong('Lý Khí')} (dùng la bàn và công thức tính hướng, tính sao). Công cụ web đi theo Lý
          Khí — {strong('không phải')} để "đổi mệnh / giải hạn / trấn yểm".
        </>
      }
      how={
        <>
          Với hướng nhà, dùng {strong('Bát Trạch')}: từ năm sinh + giới tính suy ra Cung Phi → biết
          bạn thuộc Đông tứ hay Tây tứ mệnh → lập bảng 8 hướng, mỗi hướng mang một du niên tinh (4
          cát, 4 hung). Ngũ hành tương sinh / tương khắc là gốc để suy màu hợp, hướng hợp.
        </>
      }
      soWhat={
        <>
          Để chọn hướng cát, chọn ngày tốt rồi giờ hoàng đạo, biết mình có phạm hạn dân gian nào rồi{' '}
          {strong('tự quyết định')} — không phán giàu/nghèo, không thay lời khuyên pháp lý / an toàn.
        </>
      }
    />
  );
}

export function PhongThuyDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="phong-thuy"
        concept="Vì sao cùng một hướng lại “cát” với người này mà “hung” với người kia"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cùng một chiếc áo, người này mặc vừa, người kia mặc chật. Hướng nhà cũng vậy: hướng Nam
                không phải {strong('“tốt cho tất cả mọi người”')} — nó tốt hay không là tùy{' '}
                {strong('bạn là ai')} (sinh năm nào), nên phải xem của riêng bạn trước.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Từ năm sinh + giới tính, Bát Trạch suy ra {strong('Cung Phi')} (mệnh quái) của bạn.
                  Tám quẻ chia hai nhóm "đồng khí": {strong('Đông tứ mệnh')} (Khảm, Ly, Chấn, Tốn) hợp
                  Bắc, Nam, Đông, Đông Nam; {strong('Tây tứ mệnh')} (Càn, Khôn, Cấn, Đoài) hợp Tây Bắc,
                  Tây Nam, Đông Bắc, Tây.
                </p>
                <p>
                  Bạn thuộc nhóm nào thì 4 hướng cùng nhóm gặp toàn sao cát, còn 4 hướng nhóm kia thành
                  sao hung. Vì thế cùng một hướng có thể là cát cho người Đông tứ mà là hung cho người
                  Tây tứ — bước đầu tiên luôn là xác định bạn thuộc nhóm nào.
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
                  Mỗi hướng so với mệnh quái mang một {strong('du niên tinh')}. Bốn sao cát (giảm dần):
                  Sinh Khí, Thiên Y, Diên Niên, Phục Vị; bốn sao hung (nặng giảm dần): Tuyệt Mệnh, Ngũ
                  Quỷ, Lục Sát, Họa Hại. Trong Bát Trạch, "tốt/xấu" gắn với{' '}
                  {strong('việc gì đặt ở đâu')}, không phải dán nhãn số phận — ví dụ quy tắc bếp truyền
                  thống là "tọa hung – hướng cát".
                </p>
                <p>
                  Một lưu ý: bảng Cung Phi cổ điển vốn tính theo năm âm lịch, nên người sinh sát Tết nên
                  tự đối chiếu thêm — đây là chỗ các trường phái có thể khác nhau. Tất cả là gợi ý bố trí
                  để tham khảo, không phải bảo đảm kết quả.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="phong-thuy"
        concept="Cung Phi là gì và tính ra sao"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cung Phi giống một {strong('“số riêng”')} của mỗi người, lấy từ năm bạn sinh ra và bạn
                là con trai hay con gái. Biết số đó rồi mới biết hướng nào hợp với bạn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Cung Phi')} (命卦, mệnh quái) là một trong tám quẻ. Cách tính: cộng dồn các
                  chữ số của năm sinh dương lịch, rút gọn về một số từ 1 đến 9, rồi tra bảng theo giới
                  tính. Ví dụ năm 1990: 1 + 9 + 9 + 0 = 19 → 1 + 9 = 10 → 1 + 0 = 1.
                </p>
                <p>
                  Với số 1, nam ra quẻ {strong('Khảm')} (thuộc Đông tứ mệnh), nữ ra quẻ{' '}
                  {strong('Cấn')} (thuộc Tây tứ mệnh). Cùng một năm sinh, nam và nữ có thể ra hai quẻ
                  khác nhóm — nên giới tính là một phần của phép tính, không bỏ được.
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
                  Cung Phi là mệnh quái đại diện cho một người, gốc ở Lạc Thư và Cửu cung. Có hai chỗ
                  các phái tính khác nhau. Thứ nhất, bảng cổ điển vốn lấy {strong('năm âm lịch')} (đổi
                  mốc quanh Tết), nên người sinh sát Tết có thể lệch một năm nếu chỉ lấy năm dương;
                  công cụ chốt dùng năm dương lịch cho nhất quán.
                </p>
                <p>
                  Thứ hai, {strong('số 5')} ở trung cung Lạc Thư không ứng quẻ nào; tục lệ quy nam số 5
                  về Khôn (có phái dùng Cấn), nữ về Cấn (hoặc Khôn). Bảng tra trực tiếp mà công cụ dùng
                  chốt nam số 5 ra {strong('Càn')}, nữ số 5 ra {strong('Ly')} — cứ bám kết quả công cụ,
                  đây là chỗ có trường phái tính khác.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="phong-thuy"
        concept="Vì sao bếp lại đặt ở hướng hung (“tọa hung – hướng cát”)"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cái bếp hơi đặc biệt: người ta đặt nó ở góc {strong('“xấu”')} nhưng cho miệng bếp quay
                về phía {strong('“tốt”')}. Giống như đứng ở chỗ tối mà nhìn ra phía sáng.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Trong Bát Trạch, "tốt/xấu" gắn với {strong('việc gì đặt ở đâu')}, không phải nhãn số
                  phận dán lên một hướng. Bếp theo quy tắc {strong('"tọa hung – hướng cát"')}: đặt ở
                  vùng mang sao hung, nhưng miệng bếp (cửa bếp) quay về hướng có sao cát.
                </p>
                <p>
                  Nhờ vậy, ngay cả một vùng "hung" vẫn có công năng riêng. Đây là gợi ý bố trí, không
                  có nghĩa vùng đó "xui xẻo chắc chắn".
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
                  Ý niệm truyền thống: ngọn lửa của bếp {strong('“đè”')} được vùng khí xấu, còn nguồn
                  khí đi vào qua miệng bếp thì lấy từ hướng cát. Vì thế bố trí bếp không phải "tránh
                  hướng hung" một cách máy móc, mà là dùng đúng vùng hung cho đúng vật.
                </p>
                <p>
                  Điều này cho thấy Bát Trạch là bộ {strong('quy tắc bố trí để tham khảo')}, không phải
                  định luật số mệnh — và là điểm rất dễ nói nhầm khi tư vấn cho người mới.
                </p>
              </>
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
    prompt: 'Vì sao không thể nói một hướng (ví dụ hướng Nam) là “tốt cho tất cả mọi người”?',
    answer: (
      <>
        Vì trong Bát Trạch, một hướng cát hay hung là {strong('tùy Cung Phi của từng người')}. Người{' '}
        Đông tứ mệnh và người Tây tứ mệnh có bộ 4 hướng cát khác nhau; cùng một hướng có thể cát với
        người này mà hung với người kia. Bước đầu là xác định bạn thuộc Đông tứ hay Tây tứ.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Bát Trạch suy ra Cung Phi (mệnh quái) của một người từ đâu?',
    choices: [
      {
        text: 'Từ ngày và giờ sinh chính xác tới phút',
        note: 'Không — đó gần với cách lập lá số Tử Vi / Bát Tự, không phải Cung Phi Bát Trạch.',
      },
      {
        text: 'Từ năm sinh và giới tính',
        correct: true,
        note: 'Đúng — từ năm sinh + giới tính suy ra mệnh quái, rồi lập bảng 8 hướng.',
      },
      {
        text: 'Từ hướng ngôi nhà đang ở',
        note: 'Không — hướng nhà là thứ đem so với Cung Phi, chứ không dùng để tính ra Cung Phi.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Nhóm nào sau đây là bốn sao CÁT trong tám du niên tinh của Bát Trạch?',
    choices: [
      {
        text: 'Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại',
        note: 'Đây lại là bốn sao HUNG (nặng giảm dần), không phải sao cát.',
      },
      {
        text: 'Khảm, Ly, Chấn, Tốn',
        note: 'Đây là bốn quẻ của nhóm Đông tứ mệnh, không phải du niên tinh.',
      },
      {
        text: 'Sinh Khí, Thiên Y, Diên Niên, Phục Vị',
        correct: true,
        note: 'Đúng — bốn sao cát, tốt giảm dần từ Sinh Khí đến Phục Vị.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Trong Bát Trạch, câu “tọa hung – hướng cát” khi đặt bếp nói lên điều gì?',
    choices: [
      {
        text: '"Tốt/xấu" gắn với việc gì đặt ở đâu, không phải dán nhãn số phận cho một hướng',
        correct: true,
        note: 'Đúng — đặt bếp ở vùng xấu nhưng miệng bếp quay về hướng tốt; là gợi ý bố trí.',
      },
      {
        text: 'Một hướng đã hung thì mãi mãi hung, không dùng vào việc gì được',
        note: 'Không — vùng hung vẫn có cách bố trí (đặt bếp) để hóa giải theo quy ước.',
      },
      {
        text: 'Phải trấn yểm mới dùng được vùng hung',
        note: 'Không — công cụ chỉ gợi ý bố trí tham khảo, không bán dịch vụ trấn yểm.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: hai nơi (hoặc hai hệ) cho ra “hành chủ đạo” của bạn khác nhau, hay tính Kim Lâu ra kết quả khác nhau. Nên hiểu thế nào?',
    answer: (
      <>
        Không phải "một bên sai". Hành chủ đạo có thể tính khác nhau giữa các hệ (qua Cục trong Tử Vi,
        hay Nhật Chủ + Dụng Thần trong Bát Tự); Kim Lâu cũng có phái tính theo tuổi cô dâu, phái tính
        theo chú rể, phái xét cả hai. Đó là {strong('do phương pháp khác nhau')}, không phải lỗi — và
        vì thế mọi con số ở đây là {strong('quy tắc để tham khảo')}, bạn biết rồi tự cân nhắc.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Cung Phi mà công cụ tính dựa trên loại năm nào?',
    choices: [
      {
        text: 'Luôn là năm âm lịch, đổi mốc đúng giao thừa Tết Nguyên Đán',
        note: 'Không — bảng cổ điển vốn theo năm âm, nhưng công cụ này chốt dùng năm dương lịch.',
      },
      {
        text: 'Năm dương lịch — công cụ chốt dùng năm dương cho nhất quán',
        correct: true,
        note: 'Đúng — bảng cổ điển vốn tính theo năm âm, nên người sinh sát Tết nên tự đối chiếu thêm.',
      },
      {
        text: 'Tùy ngày và giờ sinh chính xác tới phút',
        note: 'Không — Cung Phi chỉ cần năm sinh và giới tính, không cần ngày giờ.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Điểm khác cốt lõi giữa Huyền Không Phi Tinh và Bát Trạch là gì?',
    choices: [
      {
        text: 'Cả hai đều chỉ tính theo năm sinh của chủ nhà',
        note: 'Không — Phi Tinh không dùng năm sinh, mà dùng Vận (chu kỳ 20 năm) cùng tọa hướng nhà.',
      },
      {
        text: 'Phi Tinh chỉ là tên gọi khác của Bát Trạch',
        note: 'Không — hai phương pháp khác nhau cả về đầu vào lẫn cách lập bàn.',
      },
      {
        text: 'Bát Trạch tĩnh theo người (mệnh quái); Phi Tinh động theo thời gian (vận) và tọa hướng nhà',
        correct: true,
        note: 'Đúng — Phi Tinh thêm lớp thời gian và hướng nhà mà Bát Trạch không xét.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'mcq',
    prompt: 'Trên thước Lỗ Ban, đâu là nhóm bốn cung TỐT trong bộ 8 cung?',
    choices: [
      {
        text: 'Tài, Nghĩa, Quan, Bản',
        correct: true,
        note: 'Đúng — bốn cung tốt xen kẽ với bốn cung xấu trong bộ 8 cung kinh điển.',
      },
      {
        text: 'Bệnh, Ly, Kiếp, Hại',
        note: 'Đây lại là bốn cung XẤU của thước Lỗ Ban.',
      },
      {
        text: 'Sinh Khí, Thiên Y, Diên Niên, Phục Vị',
        note: 'Đây là bốn du niên tinh cát của Bát Trạch, không phải cung trên thước Lỗ Ban.',
      },
    ],
  },
];

export function PhongThuyRecall() {
  return <ActiveRecall topicId="phong-thuy" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được phong thủy ứng dụng dùng để làm gì (quy tắc minh bạch để chọn hướng / ngày–giờ / tuổi / kích thước) — và nó KHÔNG hứa gì (không phán họa phúc, không "đổi mệnh / giải hạn").',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả mạch Bát Trạch: năm sinh + giới tính → Cung Phi → Đông tứ / Tây tứ mệnh → bảng 8 hướng với 4 du niên tinh cát và 4 hung.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt hai nhánh Loan Đầu (hình thế) và Lý Khí (la bàn, công thức), và vì sao công cụ web chỉ làm phần Lý Khí.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra những gì ngoài phạm vi công cụ (Loan Đầu, trấn yểm, vật phẩm, Thế quái) và vì sao xem ngày không thay luật sư hay an toàn.',
  },
  {
    id: 'cung-phi',
    facet: 'Tự tính Cung Phi',
    can: 'Tự cộng dồn năm sinh về một số 1–9, tra bảng theo giới tính ra Cung Phi, và nêu được hai lưu ý (mốc năm âm/dương sát Tết; số 5 quy ước tùy phái).',
  },
  {
    id: 'phi-tinh',
    facet: 'Lớp thời gian',
    can: 'Phân biệt Bát Trạch (tĩnh theo người) với Huyền Không Phi Tinh (động theo Vận và tọa hướng nhà), và biết công cụ /phi-tinh làm Hạ Quái chuẩn, không làm Thế quái.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Giải thích vì sao hai hệ cho ra hành chủ đạo khác nhau, hay Kim Lâu tính khác nhau, là do phương pháp — không phải lỗi.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao "tốt/xấu" trong Bát Trạch là việc-gì-đặt-ở-đâu (tọa hung – hướng cát), và vì sao nhãn "phạm" hạn dân gian không phải định luật.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người chưa biết vì sao cùng một hướng lại cát với người này mà hung với người kia, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd Huyền Không Phi Tinh, Thập nhị trực, thước Lỗ Ban) bạn vẫn còn thấy mơ hồ.',
  },
];

export function PhongThuyChecklist() {
  return <UnderstandingChecklist topicId="phong-thuy" facets={FACETS} />;
}

export function PhongThuyWhys() {
  return (
    <FiveWhys
      topicId="phong-thuy"
      start={
        <>
          Nhiều người nghe "hướng Nam là hướng đẹp" liền muốn xoay nhà về hướng Nam, tin rằng hướng đó
          tốt cho bất kỳ ai.
        </>
      }
      chain={[
        {
          question: 'Vì sao không thể nói một hướng là “tốt cho tất cả mọi người”?',
          because: (
            <>
              Vì trong Bát Trạch, một hướng cát hay hung là {strong('tùy Cung Phi của từng người')}.
            </>
          ),
        },
        {
          question: 'Vì sao Cung Phi lại quyết định hướng cát / hung?',
          because: (
            <>
              Vì Cung Phi xếp bạn vào {strong('Đông tứ mệnh')} hoặc {strong('Tây tứ mệnh')}, mỗi nhóm
              có bộ 4 hướng cát riêng.
            </>
          ),
        },
        {
          question: 'Vì sao hai nhóm mệnh lại hợp bộ hướng khác nhau?',
          because: (
            <>
              Vì mỗi hướng so với mệnh quái mang một {strong('du niên tinh')} (4 cát: Sinh Khí, Thiên
              Y, Diên Niên, Phục Vị; 4 hung: Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại), suy từ ngũ hành
              của quẻ.
            </>
          ),
        },
        {
          question: 'Vì sao ngay cả một hướng “hung” vẫn có cách dùng?',
          because: (
            <>
              Vì "tốt/xấu" gắn với {strong('việc gì đặt ở đâu')}, không dán nhãn số phận — ví dụ bếp
              theo quy tắc "tọa hung – hướng cát".
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên dùng phong thủy?',
          because: (
            <>
              Vì đây là {strong('quy tắc bố trí để tham khảo')}, giúp bạn tự cân nhắc — không phải lời
              phán bảo đảm họa phúc.
            </>
          ),
        },
      ]}
      root={
        <>
          Không có hướng "tốt cho tất cả". Hướng cát / hung là tương đối với Cung Phi từng người, và
          "tốt/xấu" thật ra nói về việc-gì-đặt-ở-đâu. Xác định mình thuộc Đông tứ hay Tây tứ trước, rồi
          dùng bảng 8 hướng như gợi ý bố trí — không phải định luật số mệnh.
        </>
      }
    />
  );
}
