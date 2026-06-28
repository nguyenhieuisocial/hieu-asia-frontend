/**
 * Nội dung "học chủ động" cho trang /learn/tu-vi — bài flagship.
 *
 * TẤT CẢ grounded từ chính bài viết Tử Vi (12 cung, tam phương tứ chính, trình
 * tự luận, 14 chính tinh + độ sáng + phụ tinh, Tứ Hóa, vô chính diệu). KHÔNG
 * thêm dữ kiện mới. Giữ giọng "lá số là bản đồ, không phải kịch bản".
 */

import * as React from 'react';
import { LearnFrame } from '@/components/learn/active/LearnFrame';
import { DepthTabs } from '@/components/learn/active/DepthTabs';
import { ActiveRecall, type RecallQuestion } from '@/components/learn/active/ActiveRecall';
import {
  UnderstandingChecklist,
  type UnderstandingFacet,
} from '@/components/learn/active/UnderstandingChecklist';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

export function TuViFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao có một tấm bản đồ phân vùng đời sống — sức khỏe, tiền bạc, tình cảm, sự nghiệp — để
          biết mình mạnh ở mảng nào, dễ vấp ở mảng nào, mà ra quyết định hợp lý hơn?
        </>
      }
      why={
        <>
          Tử Vi Đẩu Số khởi từ Trung Hoa thời Tống, tương truyền do Trần Đoàn hệ thống hóa: vị trí
          các sao quanh sao Tử Vi tại thời khắc sinh phản ánh cấu trúc số mệnh. Nó tồn tại như một{' '}
          {strong('bản đồ để hiểu mình')}, không phải kịch bản định sẵn.
        </>
      }
      what={
        <>
          Lá số chia đời người thành {strong('12 cung')} (Mệnh, Tài Bạch, Phu Thê, Quan Lộc…), mỗi
          cung một lĩnh vực, có các sao đóng vào. {strong('Không phải')} để biết tương lai cố định —
          lá số là bản đồ, không phải kịch bản.
        </>
      }
      how={
        <>
          Nhập ngày giờ sinh → an 14 chính tinh + phụ tinh vào 12 cung. Luận một cung{' '}
          {strong('không bao giờ đọc lẻ')}: phải gộp tam phương tứ chính. Trình tự: chính tinh + độ
          sáng + Cục → tam phương tứ chính → Tứ Hóa → phụ tinh → lớp thời gian (đại vận, lưu niên).
        </>
      }
      soWhat={
        <>
          Để nhận diện thiên hướng, điểm mạnh, điểm dễ vấp rồi {strong('quyết định phù hợp hơn')} —
          không dự đoán trúng số, không thay thế lời khuyên y tế / pháp lý / tài chính.
        </>
      }
    />
  );
}

export function TuViDepth() {
  return (
    <DepthTabs
      topicId="tu-vi"
      concept="Vì sao không bao giờ đọc một cung lẻ — “tam phương tứ chính”"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Đừng chấm điểm một cầu thủ chỉ bằng một pha bóng. Một cung trong lá số cũng vậy: thấy
              một sao “xấu” ở một cung rồi hoảng là sai. Phải nhìn cả {strong('“đội hình”')} — cung
              đó cùng các cung liên quan — mới ra bức tranh thật.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Mỗi cung phải đọc cùng {strong('tam phương tứ chính')}: chính cung + cung đối diện
                (xung chiếu) + hai cung tam hợp — bốn cung chiếu vào nhau và cùng tạo nên bức tranh.
              </p>
              <p>
                Ví dụ xét sự nghiệp thì đọc cả bộ {strong('Mệnh · Quan Lộc · Tài Bạch · Thiên Di')},
                chứ không chỉ cung Quan Lộc. Nhờ vậy một cung Mệnh hơi yếu nhưng cung Thiên Di đối
                diện tốt vẫn luận được “đi xa thì khá hơn ở nhà”.
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
                Trình tự luận có cơ sở: (1) định sao thủ Mệnh + {strong('độ sáng')} (miếu / vượng /
                đắc / bình / hãm) + Cục (nhịp đại vận); (2) đọc Mệnh trong tam phương tứ chính; (3)
                phủ {strong('Tứ Hóa')} gốc để thấy thế mạnh và nút thắt; (4) phụ tinh tô màu; (5) áp
                lớp thời gian (đại vận, lưu niên).
              </p>
              <p>
                Khoảng 30% lá số có Mệnh {strong('vô chính diệu')} (không có chính tinh) — không xấu,
                cách luận là mượn sao cung đối diện rồi xét phụ tinh. Và “hãm” không đồng nghĩa với
                xấu, “miếu” không đồng nghĩa với tốt: còn tùy cát tinh / sát tinh đi kèm.
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
    prompt: 'Vì sao “thấy một sao xấu ở một cung rồi hoảng” là cách đọc lá số sai?',
    answer: (
      <>
        Vì một cung không bao giờ luận đơn lẻ. Phải đọc cùng {strong('tam phương tứ chính')} (chính
        cung + cung xung chiếu + hai cung tam hợp); bốn cung chiếu vào nhau mới tạo nên bức tranh.
        Một sao đứng riêng chưa nói lên điều gì.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Tam phương tứ chính gồm những cung nào?',
    choices: [
      { text: 'Chỉ riêng cung đang xét', note: 'Đọc một cung lẻ chính là sai lầm phổ biến nhất.' },
      {
        text: 'Chính cung + cung xung chiếu (đối diện) + hai cung tam hợp',
        correct: true,
        note: 'Đúng — bốn cung này chiếu vào nhau.',
      },
      { text: 'Cả 12 cung cùng một lúc', note: 'Không phải tất cả 12 cung, mà là bộ bốn cung liên quan.' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Cung Mệnh “vô chính diệu” (không có chính tinh nào đóng) nghĩa là gì?',
    choices: [
      {
        text: 'Khoảng 30% lá số có; luận bằng cách mượn sao cung đối diện + xét phụ tinh; thường là người linh hoạt theo hoàn cảnh',
        correct: true,
        note: 'Đúng — không phải dấu hiệu xấu.',
      },
      { text: 'Một dấu hiệu xấu, báo đời lận đận', note: 'Không — vô chính diệu không phải điềm xấu.' },
      { text: 'Lá số đã bị tính sai, cần lập lại', note: 'Không — đây là trường hợp hợp lệ và khá phổ biến.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Sao “hãm” (độ sáng yếu) có đồng nghĩa với “xấu” không?',
    choices: [
      {
        text: 'Có — sao hãm luôn xấu, sao miếu luôn tốt',
        note: 'Sai — độ sáng là cường độ biểu hiện, không phải tốt/xấu cố định.',
      },
      {
        text: 'Không — sao hãm gặp cát tinh vẫn dùng được, sao miếu gặp sát tinh nặng vẫn trục trặc',
        correct: true,
        note: 'Đúng. Phải xét cát / sát tinh đi kèm.',
      },
      { text: 'Độ sáng của sao không ảnh hưởng gì tới cách luận', note: 'Không — độ sáng cho biết cường độ biểu hiện mạnh hay yếu.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Hai người có lá số trông gần giống nhau trên giấy (các sao chính ở cùng cung), nhưng một buổi luận tử tế vẫn luận khác nhau. Nêu ít nhất một lý do.',
    answer: (
      <>
        Lý do rõ nhất là {strong('Tứ Hóa')} (Hóa Lộc / Quyền / Khoa / Kỵ gắn vào sao tùy Thiên Can
        năm sinh) — chính phần này làm hai lá số giống nhau trên giấy lại luận khác nhau, và làm mỗi
        năm có một chủ đề riêng. Ngoài ra {strong('độ sáng')} của sao (miếu / vượng / hãm), Cục, và
        lớp {strong('thời gian')} (đại vận, lưu niên) cũng khiến cùng cấu trúc nhưng nhịp vận khác.
      </>
    ),
  },
];

export function TuViRecall() {
  return <ActiveRecall topicId="tu-vi" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được lá số Tử Vi dùng để làm gì (bản đồ phân vùng đời sống) — và nó KHÔNG hứa gì (không dự đoán trúng số, không thay y tế/pháp lý).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả mạch luận: chính tinh + độ sáng + Cục → tam phương tứ chính → Tứ Hóa → phụ tinh → lớp thời gian.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói được vì sao KHÔNG đọc một cung lẻ — vai trò của tam phương tứ chính.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra giới hạn của Tử Vi và vì sao Tứ Hóa có dị biệt giữa các phái (tham khảo, không tuyệt đối).',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Giải thích vì sao hai lá số giống nhau trên giấy vẫn luận khác nhau (Tứ Hóa, độ sáng, lớp thời gian).',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao “sao hãm” không = xấu, Mệnh vô chính diệu không = xấu, Hóa Kỵ không = mạt vận.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại “tam phương tứ chính” cho một người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd Cục, Tứ Hóa) bạn vẫn còn thấy mơ hồ.',
  },
];

export function TuViChecklist() {
  return <UnderstandingChecklist topicId="tu-vi" facets={FACETS} />;
}
