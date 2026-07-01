/**
 * Nội dung "học chủ động" cho trang /learn/palm — Xem chỉ tay (chiromancy).
 *
 * TẤT CẢ grounded từ chính bài viết Xem chỉ tay (7 đường chính, ba đường trục —
 * tâm đạo / trí đạo / sinh đạo, gò & hình dáng bàn tay, và các ngộ nhận phổ biến
 * trong FAQ: sinh đạo ngắn ≠ sống ngắn, trí đạo dài ≠ thông minh hơn, đếm vạch
 * hôn nhân, đường "sức khoẻ" ≠ chẩn bệnh). KHÔNG thêm dữ kiện mới. Giữ giọng
 * "bàn tay là bản đồ sống — tham khảo / góc nhìn, không phán định số mệnh".
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

export function PalmFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bàn tay có hàng trăm đường nét — làm sao đọc được vài đường lớn nhất để nhận ra{' '}
          {strong('khuynh hướng')} tính cách, cách yêu, cách nghĩ, cách dùng năng lượng của mình, mà
          không rơi vào phán số mệnh?
        </>
      }
      why={
        <>
          Xem chỉ tay (chiromancy / palmistry) xuất hiện độc lập ở nhiều nền văn hóa cổ đại — Ấn Độ,
          Trung Hoa, Hy Lạp; hệ thống phương Tây hiện đại phổ biến từ thế kỷ 19. Nó tồn tại như một{' '}
          {strong('bản đồ sống để hiểu mình')}, không phải kịch bản định sẵn.
        </>
      }
      what={
        <>
          Bàn tay có {strong('7 đường chính')} (tâm đạo, trí đạo, sinh đạo, số mệnh, mặt trời, thuỷ
          tinh, kim tinh), cùng các gò và hình dáng tổng thể. {strong('Không phải')} để đoán sự kiện
          hay tuổi thọ — nét tay phản ánh nếp sống hiện tại và thay đổi theo thời gian.
        </>
      }
      how={
        <>
          Đọc theo {strong('tổ hợp')}: hình dạng, độ rõ, nhánh phụ và chỗ bắt đầu của mỗi đường —
          không đọc độ dài đơn lẻ. Trước khi luận đường, định "khung" bằng gò (độ đầy đặn) và hình
          dáng bàn tay. Thường xem cả hai tay để so sánh tiềm năng bẩm sinh với con người đang trở
          thành.
        </>
      }
      soWhat={
        <>
          Để nhận ra thiên hướng và điểm mù rồi {strong('sống có ý thức hơn')} — không dự đoán sự
          kiện, không chẩn bệnh, không thay thế lời khuyên chuyên môn. Nhân tướng học là quan sát
          kinh nghiệm dân gian, chưa được khoa học kiểm chứng.
        </>
      }
    />
  );
}

export function PalmDepth() {
  return (
    <DepthTabs
      topicId="palm"
      concept="Vì sao không đọc độ dài đơn lẻ — đọc “tổ hợp” của một đường"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Đừng chê một cái cây chỉ vì nó thấp. Một đường trên bàn tay cũng vậy: thấy đường{' '}
              {strong('ngắn')} rồi kết luận vội là sai. Phải nhìn cả {strong('hình dáng')} — đậm hay
              mờ, cong hay thẳng, có nhánh, bắt đầu từ đâu — mới ra bức tranh thật.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Mỗi đường phải đọc theo {strong('tổ hợp')}: hình dạng + độ rõ + nhánh phụ + chỗ bắt
                đầu — cả bốn yếu tố cộng lại mới có nghĩa, không phải riêng độ dài.
              </p>
              <p>
                Ví dụ {strong('sinh đạo ngắn')} không có nghĩa “sống ngắn”, mà có thể chỉ năng lượng
                tập trung; {strong('trí đạo ngắn')} không phải “kém thông minh”, mà là quyết nhanh, đi
                thẳng vào việc. Đoạn đứt hay nhánh được truyền thống đọc là giai đoạn chuyển biến, chứ
                không phải tai hoạ.
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
                Trình tự đọc có cơ sở: trước hết định "khung" bằng {strong('gò')} (đọc theo độ đầy
                đặn — gò nổi gợi năng lượng vùng đó trội, gò lép gợi khuynh hướng nhẹ, không phải
                “thiếu sót”) và {strong('hình dáng bàn tay')}; rồi mới luận từng đường theo tổ hợp
                hình dạng / độ rõ / nhánh / gốc; thường {strong('xem cả hai tay')} — tay không thuận
                cho tiềm năng bẩm sinh, tay thuận cho con người đang trở thành.
              </p>
              <p>
                Lưu ý ranh giới hệ thống: hình dáng bàn tay có hai hệ{' '}
                {strong('không tương ứng 1-1')} — hệ phương Tây bốn yếu tố (Đất – Khí – Lửa – Nước)
                và hệ Đông Á Ngũ hành thủ năm loại — không nên trộn lẫn. Và vì gò khó thấy chính xác
                qua ảnh phẳng, chỉ nên nhận xét khi gò rõ ràng nổi hoặc lép.
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
    prompt: 'Vì sao “thấy một đường ngắn rồi kết luận vội” là cách xem chỉ tay sai?',
    answer: (
      <>
        Vì một đường không đọc bằng độ dài đơn lẻ. Phải đọc {strong('tổ hợp')}: hình dạng, độ rõ,
        nhánh phụ và chỗ bắt đầu — cả bốn yếu tố cộng lại mới có nghĩa. Độ dài một mình không quyết
        định “thọ” hay “tài”.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Đường sinh đạo ngắn nói lên điều gì?',
    choices: [
      { text: 'Chắc chắn là “sống ngắn”, tuổi thọ thấp', note: 'Sai — đây là hiểu lầm phổ biến nhất về xem chỉ tay.' },
      {
        text: 'Nói về sức sống, năng lượng và các bước ngoặt lớn — đường ngắn có thể chỉ năng lượng tập trung',
        correct: true,
        note: 'Đúng — sinh đạo không nói về tuổi thọ.',
      },
      { text: 'Cho biết chính xác sẽ sống bao nhiêu năm', note: 'Không — không đường nào dự đoán chính xác sự kiện cụ thể.' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Trí đạo dài có nghĩa là thông minh hơn không?',
    choices: [
      {
        text: 'Không — trí đạo nói về phong cách tư duy, không phải mức IQ',
        correct: true,
        note: 'Đúng — thẳng-ngang thiên tư duy thực tế; dốc xuống thiên tưởng tượng, sáng tạo.',
      },
      { text: 'Có — đường càng dài thì IQ càng cao', note: 'Sai — độ dài trí đạo không đo trí thông minh.' },
      { text: 'Trí đạo ngắn nghĩa là “kém thông minh”', note: 'Không — trí đạo ngắn nghĩa là quyết nhanh, đi thẳng vào việc.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Đường “sức khoẻ” (Thuỷ Tinh) trên tay có chẩn được bệnh không?',
    choices: [
      { text: 'Có — nó cho biết bạn đang có bệnh gì', note: 'Tuyệt đối không — xem chỉ tay không có cơ sở y học.' },
      {
        text: 'Không — nó chỉ nói về khuynh hướng giao tiếp và sự nhạy bén; lo ngại sức khoẻ nên gặp bác sĩ',
        correct: true,
        note: 'Đúng — không thay thế chuyên môn y tế.',
      },
      { text: 'Có, nhưng chỉ với bệnh nhẹ', note: 'Không — nó không chẩn đoán y học ở bất kỳ mức nào.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Vì sao cùng một người, xem tay hôm nay và vài năm sau lại có thể ra nhận xét hơi khác? Và vì sao thường xem cả hai tay?',
    answer: (
      <>
        Vì bàn tay là {strong('bản đồ sống')}: đường nhỏ thay đổi theo thói quen tay, sức khỏe,
        stress; đường chính ổn định hơn nhưng vẫn đậm/nhạt theo thời gian. Xem {strong('cả hai tay')}{' '}
        để so sánh: tay không thuận phản ánh tiềm năng bẩm sinh, tay thuận phản ánh con người bạn
        đang trở thành.
      </>
    ),
  },
];

export function PalmRecall() {
  return <ActiveRecall topicId="palm" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được xem chỉ tay dùng để làm gì (đọc khuynh hướng qua bản đồ bàn tay) — và nó KHÔNG hứa gì (không đoán sự kiện, không chẩn bệnh, không thay chuyên môn).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả cách đọc: định “khung” bằng gò và hình dáng bàn tay → luận từng đường theo tổ hợp hình dạng / độ rõ / nhánh / chỗ bắt đầu → so sánh hai tay.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói được vì sao KHÔNG đọc độ dài đơn lẻ — vai trò của “tổ hợp” khi luận một đường.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra giới hạn của xem chỉ tay (quan sát dân gian, chưa được khoa học kiểm chứng) và vì sao hai hệ hình dáng bàn tay không nên trộn lẫn.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Giải thích vì sao nét tay thay đổi theo thời gian và vì sao thường xem cả hai tay (bẩm sinh vs con người đang trở thành).',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao sinh đạo ngắn không = sống ngắn, trí đạo dài không = thông minh hơn, đếm vạch không ra số lần kết hôn, đường “sức khoẻ” không chẩn bệnh.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại “đọc tổ hợp thay vì độ dài” cho một người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd các gò, hai hệ hình dáng bàn tay) bạn vẫn còn thấy mơ hồ.',
  },
];

export function PalmChecklist() {
  return <UnderstandingChecklist topicId="palm" facets={FACETS} />;
}

export function PalmWhys() {
  return (
    <FiveWhys
      topicId="palm"
      start={
        <>
          Người mới xem tay thấy đường sinh đạo của mình ngắn, liền hoảng “chẳng lẽ mình sống ngắn?”.
        </>
      }
      chain={[
        {
          question: 'Vì sao thấy đường sinh đạo ngắn rồi hoảng lại là sai?',
          because: <>Vì sinh đạo {strong('không nói về tuổi thọ')}.</>,
        },
        {
          question: 'Vậy đường sinh đạo thật ra nói về điều gì?',
          because: (
            <>
              Về {strong('sức sống, năng lượng và các bước ngoặt lớn')} — đường ngắn có thể chỉ năng
              lượng tập trung, gọn gàng.
            </>
          ),
        },
        {
          question: 'Vì sao chỉ nhìn độ dài lại không đủ để kết luận?',
          because: (
            <>
              Vì phải đọc {strong('tổ hợp')}: hình dạng, độ rõ, nhánh phụ và chỗ bắt đầu — độ dài một
              mình không quyết định “thọ” hay “tài”.
            </>
          ),
        },
        {
          question: 'Vì sao một nét tay lại không thể đóng đinh một kết luận?',
          because: (
            <>
              Vì bàn tay là {strong('bản đồ sống')}: đường nhỏ đổi theo thói quen, sức khỏe, stress;
              cả đường chính cũng đậm/nhạt theo thời gian.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên xem tay?',
          because: (
            <>
              Vì mục đích là thấy {strong('khuynh hướng')} để hiểu mình, không bắt một đường chịu
              trách nhiệm cho cả số mệnh — và không dự đoán sự kiện hay chẩn bệnh.
            </>
          ),
        },
      ]}
      root={
        <>
          Bàn tay là một bản đồ sống, đọc theo tổ hợp chứ không phải độ dài đơn lẻ. Một đường đứng
          riêng chưa nói lên điều gì — kết luận vội từ một nét là cách chắc chắn nhất để đọc sai. Luôn
          đặt nó trong hình dạng, độ rõ, nhánh, gốc và cả khung gò · hình bàn tay.
        </>
      }
    />
  );
}
