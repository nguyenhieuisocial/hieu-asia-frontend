/**
 * Nội dung "học chủ động" cho trang /learn/than-so-hoc.
 *
 * TẤT CẢ grounded từ chính bài viết Thần Số Học (Pythagoras: rút số chủ đạo từ
 * ngày sinh; bốn con số lõi từ tên — Vận Mệnh/Biểu Đạt, Linh Hồn, Nhân Cách,
 * Ngày Sinh; đọc cộng hưởng; số bậc thầy 11/22/33; số Nợ Nghiệp 13/14/16/19;
 * Bài Học Nghiệp; quy ước bỏ dấu tên Việt & chữ Y; định vị pseudoscience). KHÔNG
 * thêm dữ kiện mới, KHÔNG bịa số/ngày/dẫn nguồn. Giữ giọng "tham khảo / góc nhìn,
 * không phán định — một lăng kính để hiểu mình".
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

export function ThanSoHocFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao có một bản phác họa nhanh về tính cách bẩm sinh, thiên hướng và vùng dễ vấp của một
          người — chỉ cần {strong('ngày sinh và tên đầy đủ')} — để hiểu mình rõ hơn và ra quyết định
          hợp lý hơn?
        </>
      }
      why={
        <>
          Từ Pythagoras (~570 TCN), có niềm tin rằng số không chỉ để đếm vật mà còn mang “linh hồn”
          riêng phản ánh quy luật vũ trụ. Thần Số Học tồn tại như một {strong('lăng kính biểu tượng')}{' '}
          để phản tư về mình, không phải một dự báo tương lai.
        </>
      }
      what={
        <>
          Là cách rút {strong('số chủ đạo')} (Đường Đời) từ ngày sinh và {strong('bốn con số lõi')} từ
          tên (Vận Mệnh, Linh Hồn, Nhân Cách, Ngày Sinh), mỗi số 1–9 mang một nguồn năng lượng.{' '}
          {strong('Không phải')} khoa học và không phải lời phán định mệnh — chỉ là một cách chơi với
          con số để soi mình.
        </>
      }
      how={
        <>
          Cộng các chữ số trong ngày sinh rồi rút gọn về một chữ số (riêng 11, 22, 33 giữ nguyên); gán
          mỗi chữ cái một số theo bảng Pythagoras để tính các số từ tên. Cách dùng hay nhất là{' '}
          {strong('đọc cộng hưởng')}: xem các con số cùng hướng hay lệch nhau, chứ không đọc từng số
          rời rạc.
        </>
      }
      soWhat={
        <>
          Để nhận diện thiên hướng, khao khát nội tâm và những vùng cần rèn, rồi{' '}
          {strong('đặt câu hỏi để hiểu mình hơn')} — không đoán trúng tương lai, không thay lời khuyên
          y tế / pháp lý / tài chính, và không có “giải nghiệp”.
        </>
      }
    />
  );
}

export function ThanSoHocDepth() {
  return (
    <DepthTabs
      topicId="than-so-hoc"
      concept="Vì sao nên “đọc cộng hưởng” nhiều con số, đừng đọc một số lẻ"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Đừng đoán một bài hát chỉ bằng một nốt nhạc. Một con số trong lá số thần số cũng vậy: chỉ
              nhìn một số rồi kết luận về cả con người là thiếu. Phải nghe {strong('cả bản nhạc')} —
              nhiều con số cùng lúc — mới ra giai điệu thật.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Ngoài Số Đường Đời (rút từ ngày sinh), tên đầy đủ cho thêm {strong('bốn con số lõi')}:
                Vận Mệnh (tất cả chữ cái), Linh Hồn (nguyên âm), Nhân Cách (phụ âm) và Ngày Sinh.
              </p>
              <p>
                Cách dùng hay nhất là {strong('đọc cộng hưởng')}: khi các số cùng hướng thì năng lượng
                nhất quán; khi lệch nhau thì có một “sức kéo nội tâm” đáng soi. Ví dụ khoảng cách giữa
                Nhân Cách (người ta thấy bạn thế nào) và Linh Hồn (bạn thật sự khao khát gì) là một góc
                nhìn rất đắt.
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
                Kỹ thuật nền là {strong('rút gọn')} tổng về một chữ số, trừ khi rơi đúng{' '}
                {strong('11, 22, 33')} thì giữ nguyên (số bậc thầy). Vì nguyên âm + phụ âm = toàn bộ
                chữ, nên TRƯỚC
                khi rút gọn, tổng Linh Hồn và Nhân Cách bằng đúng tổng Vận Mệnh; sau khi rút gọn riêng
                thì cộng trực tiếp thường không còn bằng nhau.
              </p>
              <p>
                Có những điểm là {strong('khác trường phái, không phải sai')}: xếp chữ Y là nguyên âm
                hay phụ âm, công nhận cả 11/22/33 hay chỉ 11/22, có dùng bộ Nợ Nghiệp 13/14/16/19 hay
                không — hieu.asia trình bày theo cách đọc Decoz. Với tên Việt, bảng Pythagoras chỉ có
                26 chữ La-tinh nên phải bỏ dấu (Nguyễn → NGUYEN, Đ → D) — một quy ước thực dụng, không
                phải chân lý.
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
    prompt: 'Vì sao “nhìn một con số rồi kết luận về cả con người” là cách đọc thần số thiếu sót?',
    answer: (
      <>
        Vì cách dùng hay nhất là {strong('đọc cộng hưởng')}: một lá số có Số Đường Đời cộng bốn con số
        lõi từ tên. Phải xem chúng cùng hướng hay lệch nhau — khi lệch thì có một “sức kéo nội tâm”
        đáng soi. Một con số đứng lẻ chưa vẽ đủ chân dung.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Số Linh Hồn (Soul Urge) được tính từ đâu trong tên đầy đủ?',
    choices: [
      { text: 'Tất cả các chữ cái trong tên', note: 'Đó là Số Vận Mệnh / Biểu Đạt, không phải Linh Hồn.' },
      {
        text: 'Chỉ các nguyên âm trong tên',
        correct: true,
        note: 'Đúng — nguyên âm được ví như “âm thanh bên trong”, tượng trưng cho nội tâm và khao khát thật.',
      },
      { text: 'Chỉ các phụ âm trong tên', note: 'Phụ âm cho ra Số Nhân Cách — lớp vỏ ngoài, không phải Linh Hồn.' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Số bậc thầy 11, 22, 33 nghĩa là gì?',
    choices: [
      {
        text: 'Phiên bản cường độ cao của số gốc (2/4/6): tiềm năng lớn hơn nhưng bài tập cũng khó hơn',
        correct: true,
        note: 'Đúng — giữ nguyên không rút gọn, và KHÔNG phải “đẳng cấp cao hơn người”.',
      },
      { text: 'Dấu hiệu bạn đặc biệt và giỏi hơn người thường', note: 'Không — master = tiềm năng cao + bài tập khó, không phải nhãn hơn người.' },
      { text: 'Con số đã bị tính sai, cần rút gọn tiếp về 2/4/6', note: 'Không — đúng 11/22/33 thì giữ nguyên, không rút tiếp.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Số Nợ Nghiệp (13, 14, 16, 19) có phải điềm xấu hay bản án không?',
    choices: [
      {
        text: 'Có — đó là nghiệp nặng từ kiếp trước, cần dịch vụ “giải nghiệp”',
        note: 'Sai — hieu.asia không hù dọa “nghiệp nặng/kiếp trước” và không bán “giải nghiệp”.',
      },
      {
        text: 'Không — là bài học còn dang dở cần hoàn thiện bằng nỗ lực có ý thức, kèm lối đi tới',
        correct: true,
        note: 'Đúng. Đây là đặc trưng của cách đọc Decoz; không phải trường phái nào cũng dùng bộ số này.',
      },
      { text: 'Không có ý nghĩa gì, chỉ là con số ngẫu nhiên', note: 'Không — mỗi số có “điều cần học” kèm “cách đi tới” cụ thể.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Bạn tính số cho một người tên Việt bằng công cụ khác và ra kết quả hơi lệch so với hieu.asia. Nêu ít nhất một lý do vì sao lệch mà chưa chắc ai sai.',
    answer: (
      <>
        Vì có những chỗ là {strong('khác trường phái, không phải sai')}: chữ {strong('Y')} có nơi xếp
        nguyên âm (hieu.asia), nơi xử lý theo phát âm; có hệ công nhận cả 11/22/33, hệ chỉ 11/22; có hệ
        dùng bộ Nợ Nghiệp, hệ bỏ qua. Ngoài ra tên Việt phải {strong('bỏ dấu')} về chữ La-tinh trước
        khi tra bảng Pythagoras — một quy ước thực dụng khiến kết quả có thể khác nhau.
      </>
    ),
  },
];

export function ThanSoHocRecall() {
  return <ActiveRecall topicId="than-so-hoc" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Thần Số Học dùng để làm gì (bản phác họa tính cách/thiên hướng từ ngày sinh + tên) — và nó KHÔNG hứa gì (không dự báo tương lai, không thay y tế/pháp lý).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả cách rút số chủ đạo từ ngày sinh và bốn con số lõi từ tên (Vận Mệnh, Linh Hồn, Nhân Cách, Ngày Sinh), gồm bước rút gọn về một chữ số.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt Vận Mệnh (tất cả chữ cái), Linh Hồn (nguyên âm) và Nhân Cách (phụ âm) — và vì sao khoảng cách Nhân Cách ↔ Linh Hồn đáng soi.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra Thần Số Học bị xếp vào pseudoscience và những chỗ là khác trường phái (chữ Y, master 33, bộ Nợ Nghiệp) — tham khảo, không tuyệt đối.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Giải thích vì sao nên đọc cộng hưởng nhiều con số, và vì sao hai công cụ khác nhau có thể ra kết quả hơi lệch mà chưa chắc ai sai.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao master 11/22/33 không = “hơn người”, và Nợ Nghiệp 13/14/16/19 không = điềm xấu hay bản án cần “giải nghiệp”.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cách tính số chủ đạo (cộng chữ số ngày sinh rồi rút gọn) cho một người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd Bài Học Nghiệp — chữ số thiếu trong tên, hay cách xử lý chữ Y) bạn vẫn còn thấy mơ hồ.',
  },
];

export function ThanSoHocChecklist() {
  return <UnderstandingChecklist topicId="than-so-hoc" facets={FACETS} />;
}

export function ThanSoHocWhys() {
  return (
    <FiveWhys
      topicId="than-so-hoc"
      start={
        <>
          Người mới xem lá số thần số thấy mình có Số Nợ Nghiệp 16, liền hoảng “kiếp này mình mang
          nghiệp nặng”.
        </>
      }
      chain={[
        {
          question: 'Vì sao thấy một Số Nợ Nghiệp rồi hoảng lại là hiểu sai?',
          because: (
            <>
              Vì trong cách đọc Decoz, Nợ Nghiệp {strong('không phải điềm xấu hay bản án')} — mà là bài
              học còn dang dở cần hoàn thiện, luôn kèm một lối đi tới.
            </>
          ),
        },
        {
          question: 'Vì sao lại đóng khung nó là “việc cần rèn” chứ không phải điềm gở?',
          because: (
            <>
              Vì mục đích của hệ này là {strong('tự nhận thức')}: chỉ ra vùng dễ vấp để hành động chủ
              động, không hù dọa và không bán dịch vụ “giải nghiệp”.
            </>
          ),
        },
        {
          question: 'Vì sao nó chỉ dừng ở mức tự nhận thức, không phải phán định?',
          because: (
            <>
              Vì đây là một {strong('lăng kính biểu tượng')} để phản tư — “kiếp trước” chỉ là ẩn dụ
              trong hệ Decoz, không phải khẳng định siêu hình.
            </>
          ),
        },
        {
          question: 'Vì sao chỉ nên coi nó là lăng kính biểu tượng?',
          because: (
            <>
              Vì Thần Số Học bị giới khoa học xếp vào {strong('pseudoscience')} — không có cơ chế nhân
              quả được kiểm chứng.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên đọc một con số?',
          because: (
            <>
              Vì giá trị nằm ở chỗ nó {strong('gợi câu hỏi để hiểu mình')}, không nằm ở chỗ “đoán đúng
              tương lai” — nên đọc để soi mình, không để lo sợ.
            </>
          ),
        },
      ]}
      root={
        <>
          Thần Số Học là một lăng kính biểu tượng để phản tư, không phải dự báo. Một con số — kể cả Nợ
          Nghiệp — chỉ đánh dấu một vùng cần để ý kèm lối đi tới, không phải bản án. Đọc để đặt câu hỏi
          hiểu mình, và luôn nhớ đây là tham khảo, không phán định.
        </>
      }
    />
  );
}
