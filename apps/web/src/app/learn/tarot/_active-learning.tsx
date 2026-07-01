/**
 * Nội dung "học chủ động" cho trang /learn/tarot.
 *
 * TẤT CẢ grounded từ chính bài viết Tarot (78 lá = 22 Ẩn Chính + 56 Ẩn Phụ,
 * bốn chất Gậy–Cốc–Kiếm–Tiền, hành trình Gã Khờ, các lá hay bị hù dọa, lá ngược,
 * các kiểu trải bài, đọc tổng thể). KHÔNG thêm dữ kiện mới. Giữ giọng "lá bài là
 * lăng kính để hiểu mình, không phán số mệnh" — tham khảo / góc nhìn, không phán định.
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

export function TarotFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao dừng lại soi một tình huống đang rối — nên nghĩ gì, cảm gì, làm gì — để hiểu mình rõ
          hơn rồi tự ra quyết định, thay vì cứ luẩn quẩn trong đầu?
        </>
      }
      why={
        <>
          Tarot ra đời khoảng thế kỷ 15 ở Ý như bài chơi, mãi cuối thế kỷ 18 mới được gán nghĩa bói
          toán. Ở đây nó tồn tại như một {strong('lăng kính để tự suy ngẫm')} — mỗi lá gợi một câu
          hỏi, không phải lời tiên tri.
        </>
      }
      what={
        <>
          Một bộ {strong('78 lá')}: 22 Ẩn Chính (chủ đề lớn, bước ngoặt) và 56 Ẩn Phụ (đời sống
          thường ngày, chia 4 chất). {strong('Không phải')} công cụ bói tương lai hay phán “sắp giàu /
          sắp chia tay / gặp hạn” — lá bài gợi câu hỏi, bạn giữ câu trả lời.
        </>
      }
      how={
        <>
          Đặt một câu hỏi mở trong lòng → rút lá (một lá, ba lá, hoặc trải sâu hơn) → đọc. Người đọc
          giỏi {strong('không đọc từng lá rời')}: nhìn bức tranh chung trước — tỉ lệ Ẩn Chính / Ẩn
          Phụ, chất nào áp đảo — rồi mới soi từng lá trong ngữ cảnh câu hỏi.
        </>
      }
      soWhat={
        <>
          Để {strong('hiểu mình và ra quyết định tỉnh táo hơn')} — không đổi vận, không giải hạn,
          không thay lời khuyên y tế / pháp lý / tài chính. Kết quả luôn là “xu hướng nếu giữ nguyên
          hướng đi”, không phải định mệnh cứng.
        </>
      }
    />
  );
}

export function TarotDepth() {
  return (
    <DepthTabs
      topicId="tarot"
      concept="Vì sao không đọc từng lá rời — đọc cả bức tranh chung"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Đừng đoán cả câu chuyện chỉ bằng một bức tranh. Rút được một lá trông “đáng sợ” rồi
              hoảng là sai. Phải nhìn {strong('cả bộ tranh vừa rút')} cùng nhau — và nhớ mình đang hỏi
              điều gì — mới ra ý nghĩa thật.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Người đọc giỏi nhìn {strong('bức tranh chung')} trước khi chốt từng lá: nhiều Ẩn Chính
                nghĩa là chủ đề lớn, bài học sâu; toàn Ẩn Phụ nghĩa là chuyện đời thường trong tầm
                xoay xở.
              </p>
              <p>
                {strong('Chất')} nào áp đảo cho biết trọng tâm: nhiều Kiếm → nặng về đầu óc / xung
                đột; nhiều Cốc → cảm xúc / quan hệ; nhiều Gậy → hành động; nhiều Tiền → tiền bạc /
                thực tế. Cùng một lá, đặt cạnh các lá khác và gắn vào câu hỏi của bạn, sẽ mang sắc
                thái khác nhau.
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
                Một mạch đọc có lớp lang: (1) đọc tỉ lệ {strong('Ẩn Chính / Ẩn Phụ')} để định độ lớn
                của chủ đề; (2) xem chất nào áp đảo để định trọng tâm (Gậy Lửa, Cốc Nước, Kiếm Khí,
                Tiền Đất — theo chuẩn RWS/Golden Dawn); (3) với Ẩn Phụ có thể mượn “cốt truyện số”
                Át→10; (4) đọc từng lá trong ngữ cảnh vị trí trải bài và câu hỏi.
              </p>
              <p>
                Và “lá nặng” không đồng nghĩa với điềm xấu: {strong('Cái Chết')} là chuyển hóa,{' '}
                {strong('Tòa Tháp')} là phơi bày nền móng sai để xây lại đúng. {strong('Lá ngược')}{' '}
                cũng không tự động xấu — thường là năng lượng bị nghẽn / hướng vào trong, và với các lá
                nặng chiều ngược hay là dấu phục hồi. Có trường phái đọc tất cả như xuôi; đó là lựa
                chọn hợp lệ.
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
    prompt: 'Vì sao “rút được một lá trông đáng sợ rồi hoảng” là cách đọc Tarot sai?',
    answer: (
      <>
        Vì không đọc từng lá rời. Người đọc giỏi nhìn {strong('bức tranh chung')} trước — tỉ lệ Ẩn
        Chính / Ẩn Phụ, chất nào áp đảo — rồi mới soi từng lá trong ngữ cảnh câu hỏi. Một lá đứng
        riêng, tách khỏi các lá khác và khỏi câu hỏi, chưa nói lên điều gì.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Bốn chất Gậy – Cốc – Kiếm – Tiền ứng với nguyên tố nào (theo chuẩn RWS/Golden Dawn)?',
    choices: [
      {
        text: 'Gậy = Lửa, Cốc = Nước, Kiếm = Khí, Tiền = Đất',
        correct: true,
        note: 'Đúng — hieu.asia theo chuẩn RWS/Golden Dawn.',
      },
      {
        text: 'Gậy = Khí, Cốc = Nước, Kiếm = Lửa, Tiền = Đất',
        note: 'Đây là biến thể ảnh hưởng từ Aleister Crowley (đảo Gậy và Kiếm), không phải chuẩn dùng ở đây.',
      },
      {
        text: 'Cả bốn chất đều ứng chung một nguyên tố',
        note: 'Không — mỗi chất ứng một nguyên tố và một lĩnh vực đời sống riêng.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Lá 13 Cái Chết trong Tarot thường nói về điều gì?',
    choices: [
      {
        text: 'Sự chuyển hóa — một giai đoạn / vai trò kết thúc để mở chỗ cho cái mới',
        correct: true,
        note: 'Đúng — gần như không bao giờ nói về cái chết thật.',
      },
      { text: 'Một điềm báo cái chết thật sắp xảy ra', note: 'Không — đây chính là ngộ nhận phổ biến nhất về lá này.' },
      { text: 'Lá bài đã bị rút sai, cần xáo lại', note: 'Không — Cái Chết là một lá hợp lệ trong 22 Ẩn Chính.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Lá ngược (reversed) có phải luôn mang nghĩa xấu không?',
    choices: [
      {
        text: 'Có — lá ngược luôn là điềm xấu',
        note: 'Sai — lá ngược không tự động xấu.',
      },
      {
        text: 'Không — thường là năng lượng bị nghẽn / hướng vào trong; với các lá “nặng” chiều ngược hay là dấu phục hồi',
        correct: true,
        note: 'Đúng. Có trường phái còn đọc tất cả như xuôi, đó cũng là lựa chọn hợp lệ.',
      },
      { text: 'Lá ngược không có nghĩa gì, luôn bỏ qua', note: 'Không — nó mang sắc thái riêng, chỉ là không tự động xấu.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Cùng một câu hỏi, hai lượt rút cho ra các lá khác nhau; một buổi đọc tử tế vẫn dẫn tới ý nghĩa khác nhau. Nêu ít nhất một lý do.',
    answer: (
      <>
        Lý do rõ nhất là {strong('bức tranh chung')} khác nhau: tỉ lệ Ẩn Chính / Ẩn Phụ cho biết chủ
        đề lớn hay chuyện đời thường, và {strong('chất áp đảo')} định trọng tâm (nhiều Kiếm → đầu óc /
        xung đột, nhiều Cốc → cảm xúc, nhiều Gậy → hành động, nhiều Tiền → thực tế). Ngoài ra{' '}
        {strong('vị trí trải bài')} và {strong('câu hỏi')} bạn đặt cũng làm cùng một lá mang nghĩa
        khác — vì mỗi lần rút phản ánh câu hỏi và tâm thế ngay lúc đó.
      </>
    ),
  },
];

export function TarotRecall() {
  return <ActiveRecall topicId="tarot" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Tarot dùng để làm gì (lăng kính dừng lại soi một tình huống để hiểu mình) — và nó KHÔNG hứa gì (không bói tương lai, không đổi vận, không thay y tế/pháp lý/tài chính).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả mạch đọc: nhìn bức tranh chung (tỉ lệ Ẩn Chính/Ẩn Phụ, chất áp đảo) trước → rồi soi từng lá trong ngữ cảnh vị trí trải bài và câu hỏi.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt 22 Ẩn Chính (chủ đề lớn, bước ngoặt) với 56 Ẩn Phụ (đời sống thường ngày, 4 chất) — và nói được vì sao KHÔNG đọc một lá rời.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra giới hạn của Tarot và vì sao có dị biệt giữa các trường phái (đánh số Sức Mạnh/Công Lý, nguyên tố Gậy/Kiếm, dùng hay không dùng lá ngược) — tham khảo, không tuyệt đối.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Giải thích vì sao cùng một câu hỏi mà hai lượt rút vẫn dẫn tới ý nghĩa khác nhau (bức tranh chung, chất áp đảo, vị trí trải bài, tâm thế lúc rút).',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao Cái Chết không = chết thật, Tòa Tháp/Ác Quỷ/Mặt Trăng không = điềm gở, và lá ngược không = luôn xấu.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại “đọc cả bức tranh, không đọc từng lá rời” cho một người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd bốn chất, mạch số Át→10, hành trình Gã Khờ) bạn vẫn còn thấy mơ hồ.',
  },
];

export function TarotChecklist() {
  return <UnderstandingChecklist topicId="tarot" facets={FACETS} />;
}

export function TarotWhys() {
  return (
    <FiveWhys
      topicId="tarot"
      start={
        <>
          Người mới rút bài thấy lá Cái Chết hiện lên, liền hoảng “sắp có chuyện chẳng lành”.
        </>
      }
      chain={[
        {
          question: 'Vì sao thấy lá Cái Chết rồi hoảng lại là sai?',
          because: (
            <>
              Vì lá Cái Chết gần như {strong('không bao giờ')} nói về cái chết thật — nó là chuyển
              hóa, một giai đoạn kết thúc để mở chỗ cho cái mới.
            </>
          ),
        },
        {
          question: 'Vì sao không được kết luận chỉ từ một lá như vậy?',
          because: (
            <>
              Vì Tarot {strong('không đọc từng lá rời')}: phải nhìn bức tranh chung — tỉ lệ Ẩn Chính /
              Ẩn Phụ, chất nào áp đảo — rồi mới soi từng lá.
            </>
          ),
        },
        {
          question: 'Vì sao phải nhìn cả bức tranh chung?',
          because: (
            <>
              Vì các lá {strong('bổ nghĩa cho nhau')}: cùng một lá đặt cạnh các lá khác, ở vị trí trải
              bài khác, sẽ mang sắc thái khác.
            </>
          ),
        },
        {
          question: 'Vì sao ngữ cảnh lại đổi nghĩa một lá như vậy?',
          because: (
            <>
              Vì mỗi lần rút phản ánh {strong('câu hỏi và tâm thế ngay lúc đó')} — lá bài là lăng kính
              để soi tình huống của bạn, không phải lời phán cố định.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên đọc Tarot?',
          because: (
            <>
              Vì mục đích là {strong('hiểu mình để tự quyết định')}, không bắt một lá bài phán số mệnh
              — bạn vẫn luôn là người giữ câu trả lời.
            </>
          ),
        },
      ]}
      root={
        <>
          Tarot là một lăng kính phản tư, không phải lời tiên tri. Một lá đứng riêng chưa nói lên điều
          gì — đọc lẻ một lá và hù dọa chính mình là cách chắc chắn nhất để hiểu sai. Luôn đặt nó
          trong cả bức tranh chung và câu hỏi bạn đang soi.
        </>
      }
    />
  );
}
