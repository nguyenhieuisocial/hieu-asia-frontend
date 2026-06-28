/**
 * Nội dung "học chủ động" cho trang /learn/bat-tu — bài exemplar.
 *
 * TẤT CẢ grounded từ chính bài viết bat-tu (Nhật Chủ vượng/nhược, Thập Thần,
 * Dụng Thần, Thần Sát) — KHÔNG thêm dữ kiện mới. Giữ giọng "góc nhìn tham khảo,
 * không phán định". Mỗi khối là một wrapper mỏng quanh component dùng chung, để
 * page.tsx chỉ cần thả vào mảng sections.
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

export function BatTuFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao biết năng lượng bẩm sinh của mình thiên về đâu — mạnh ở mặt nào, thiếu ở mặt
          nào — để hiểu mình rõ hơn và chọn hướng đi hợp lý hơn?
        </>
      }
      why={
        <>
          Bát Tự ra đời từ lịch Can–Chi của người xưa: quy thời khắc sinh thành một bộ mã Ngũ
          Hành để soi xu hướng. Nó tồn tại vì con người luôn muốn một tấm bản đồ để tự hiểu — không
          phải để “biết trước số phận”.
        </>
      }
      what={
        <>
          8 chữ = 4 trụ ({strong('Năm, Tháng, Ngày, Giờ')}), mỗi trụ một Thiên Can + một Địa Chi.
          Đây là bản đồ năng lượng Ngũ Hành tại thời điểm bạn sinh ra — {strong('không phải')} một
          lời phán định mệnh.
        </>
      }
      how={
        <>
          Lấy Can ngày làm {strong('Nhật Chủ')} (“tôi”) → xét tôi {strong('vượng hay nhược')} theo
          mùa sinh, gốc rễ và vây cánh → quy 7 chữ còn lại thành {strong('Thập Thần')} → chọn{' '}
          {strong('Dụng Thần')} (hành giúp lá số cân bằng).
        </>
      }
      soWhat={
        <>
          Để hiểu thiên hướng và điểm cân bằng của mình rồi {strong('tự quyết')} — không phải để
          “đổi mệnh, giải hạn”. Một bài đọc tử tế luôn nói rõ đây là cách luận có cơ sở, không tuyệt
          đối.
        </>
      }
    />
  );
}

export function BatTuDepth() {
  return (
    <DepthTabs
      concept="Nhật Chủ vượng hay nhược — vì sao đây là bước đầu tiên"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Hãy tưởng tượng “tôi” là một cái cây. Cây khoẻ hay yếu tuỳ vào: có trồng đúng mùa
              không, rễ có bám đất không, xung quanh có nhiều cây cùng phe nâng đỡ không. Cây{' '}
              {strong('khoẻ')} thì cần bớt tưới; cây {strong('yếu')} thì cần thêm nước, thêm nắng.
              Bát Tự xem “cái tôi” của bạn đang là cây khoẻ hay cây yếu.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                {strong('Nhật Chủ')} là Thiên Can của ngày sinh — đại diện cho “bạn”. Trước khi nói
                tốt hay xấu, phải biết Nhật Chủ {strong('mạnh (vượng)')} hay {strong('yếu (nhược)')},
                vì cùng một quan hệ Ngũ Hành nhưng người mạnh và người yếu lại luận theo hướng khác
                nhau, đôi khi ngược hẳn.
              </p>
              <p>
                Ba căn cứ chính: {strong('mùa sinh')} (mạnh nhất), {strong('gốc rễ')} trong các chi,
                và số {strong('“đồng minh”')} so với {strong('“đối thủ”')} trong lá số.
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
                Phán định vượng–nhược dựa trên ba lớp: {strong('đắc lệnh')} (trạng thái mùa của Nhật
                Chủ qua Chi Tháng — Vượng / Tướng / Hưu / Tù / Tử), {strong('đắc địa')} (thông căn —
                tàng can các chi cùng hành hoặc hành sinh Nhật Chủ), và {strong('đắc thế')} (so lực
                phe Tỷ Kiếp + Ấn với phe Quan Sát + Tài + Thực Thương).
              </p>
              <p>
                Chỉ “đếm số chữ mỗi hành” là cách thô và dễ sai — phải xét cả tổ hợp, hội cục, can
                hợp hoá. Đây là bước nền để chọn Dụng Thần, và cũng là chỗ các trường phái có thể
                kết luận khác nhau cho cùng một lá số.
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
    prompt:
      'Vì sao trước khi nói một lá Bát Tự “tốt” hay “xấu”, người luận phải biết Nhật Chủ vượng hay nhược trước?',
    answer: (
      <>
        Vì cùng một quan hệ Ngũ Hành (cùng một Thập Thần) nhưng với thân vượng và thân nhược lại
        luận theo hướng khác nhau, đôi khi ngược hẳn. “Tốt/xấu” phụ thuộc lá số đang cần thêm hay
        cần bớt hành đó — nên phải biết vượng/nhược trước khi kết luận.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Trong ba căn cứ đánh giá Nhật Chủ mạnh–yếu, yếu tố nào ảnh hưởng MẠNH nhất?',
    choices: [
      {
        text: 'Số lượng chữ cùng hành với Nhật Chủ (đếm cho nhanh)',
        note: 'Đếm số chữ chỉ là gợi ý thô và dễ sai.',
      },
      {
        text: 'Mùa sinh — tức Chi Tháng (đắc lệnh)',
        correct: true,
        note: 'Đúng: mùa sinh (đắc lệnh) là yếu tố mạnh nhất trong ba căn cứ.',
      },
      {
        text: 'Có sao Đào Hoa hay Quý Nhân hay không',
        note: 'Thần Sát chỉ là lớp phụ “tô màu”, không quyết định vượng/nhược.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Dụng Thần là gì?',
    choices: [
      {
        text: 'Hành giúp lá số cân bằng và vận hành tốt nhất — ví như “vị thuốc”',
        correct: true,
        note: 'Đúng. Thân nhược thường dùng hành sinh/trợ; thân vượng thường dùng hành tiết/khắc/hao.',
      },
      {
        text: 'Ngôi sao tốt nhất, quyền lực nhất trong lá số',
        note: 'Dụng Thần là một HÀNH cân bằng lá số, không phải một ngôi sao.',
      },
      {
        text: 'Một phép “giải hạn, đổi mệnh” cho người xấu số',
        note: 'Một bài đọc tử tế không bán chuyện “đổi mệnh, giải hạn”.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Thần Sát (Đào Hoa, Quý Nhân…) có quyết định số mệnh không?',
    choices: [
      {
        text: 'Có — đó là phần lõi, quan trọng nhất của lá số',
        note: 'Không. Phần lõi là Thập Thần và Dụng Thần.',
      },
      {
        text: 'Không — chỉ là lớp phụ “tô màu”, tra theo bảng cố định',
        correct: true,
        note: 'Đúng. Thần Sát không thay phần lõi, chỉ nên dùng để tham khảo thêm.',
      },
      {
        text: 'Có — chỉ riêng Đào Hoa là đủ để luận chuyện tình duyên',
        note: 'Không nên dùng riêng một Thần Sát để phán hay hù doạ.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Hai người cùng có “Tài” (sao tiền bạc) mạnh trong lá số. Vì sao chưa chắc cả hai đều luận giống nhau, hay đều “giàu”?',
    answer: (
      <>
        Vì còn tuỳ Nhật Chủ vượng hay nhược. Thân vượng gặp Tài thì đủ sức “gánh” được Tài (thường
        luận thuận); còn thân nhược mà Tài quá vượng thì rơi vào cảnh “thân nhược tài đa” — đuối sức,
        khó giữ. Luận chuẩn là {strong('Thập Thần × vượng/nhược × Dụng Thần')}, không đọc một ngôi
        sao một cách máy móc.
      </>
    ),
  },
];

export function BatTuRecall() {
  return <ActiveRecall questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Bát Tự sinh ra để trả lời câu hỏi gì — và nó KHÔNG hứa hẹn điều gì.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả lại mạch luận: Nhật Chủ → vượng/nhược → Thập Thần → Dụng Thần.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Chỉ ra Bát Tự khác Tử Vi ở đâu (cân bằng Ngũ Hành trong 4 trụ vs hệ sao trên 12 cung).',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Nói được chỗ luận dễ sai nhất (chọn Dụng Thần) và vì sao các trường phái có thể khác nhau.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Giải thích vì sao cùng một Thập Thần lại luận khác nhau giữa thân vượng và thân nhược.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao Thần Sát hay việc “đếm số chữ” không quyết định số mệnh.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại khái niệm “Nhật Chủ vượng/nhược” cho một người chưa biết gì, bằng lời của bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào trong bài bạn vẫn còn thấy mơ hồ, cần đọc lại.',
  },
];

export function BatTuChecklist() {
  return <UnderstandingChecklist topicId="bat-tu" facets={FACETS} />;
}
