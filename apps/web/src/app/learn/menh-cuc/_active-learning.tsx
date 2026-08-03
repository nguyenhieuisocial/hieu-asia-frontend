/**
 * Nội dung "học chủ động" cho trang /learn/menh-cuc — bài về CỤC của lá số.
 *
 * GROUNDING (mọi khẳng định trên file này truy được về nguồn trong repo):
 *   • app/tinh-menh-cuc/form.tsx — trang công cụ: 5 Cục là Thủy nhị / Mộc tam /
 *     Kim tứ / Thổ ngũ / Hỏa lục; "Cục được xác định từ can năm sinh kết hợp vị
 *     trí cung Mệnh"; con số của Cục là tuổi bắt đầu đại vận (2/3/4/5/6); Cục
 *     quyết định nhịp an sao Tử Vi.
 *   • app/methodology/tu-vi/page.tsx — Cục "xác định qua thiên can năm sinh kết
 *     hợp với cung Mệnh — bảng nạp âm Lục Thập Hoa Giáp"; sao Tử Vi an theo
 *     "Cục + ngày âm" (ngày sinh chia cho Cục số, thương quyết định vị trí Tử
 *     Vi); 13 chính tinh còn lại an theo bảng cố định quanh Tử Vi.
 *   • lib/tuvi-client.ts — TuViChartMeta.fiveElementsClass là trường Cục mà
 *     engine trả về; palace.decadal.range là khoảng tuổi của đại vận.
 *   • lib/dat-ten-ngu-hanh.ts + lib/sinh-con.ts — bảng nạp âm Lục Thập Hoa Giáp
 *     của chính site (page.tsx dùng để suy Cục tại runtime, không gõ tay).
 *
 * KIỂM CHỨNG BẰNG ENGINE (POST /tools/tuvi-v2, chạy 2026-08-01):
 *   • 60/60 lá số ngẫu nhiên: nạp âm của can-chi CUNG MỆNH → đúng Cục engine trả.
 *   • 300/300 cung: can của cung suy từ can năm theo Ngũ Hổ Độn → khớp engine.
 *   • 15/15 cặp nam–nữ cùng ngày giờ: Cục và tuổi khởi đại vận GIỐNG nhau.
 *   • Cùng ngày 15/05/1990, đổi giờ sinh → Cục chạy qua đủ cả 5 giá trị.
 *
 * PHẠM VI (chống trùng bài khác):
 *   • KHÔNG giảng lại 30 nạp âm và mệnh ngũ hành năm sinh — bài /learn/nap-am.
 *   • KHÔNG giảng lại 12 cung, chính tinh, Tứ Hoá — bài /learn/tu-vi.
 *   • KHÔNG giảng quy trình lập lá số — bài /learn/lap-la-so.
 *
 * Giọng: Cục là QUY ƯỚC KỸ THUẬT của hệ Tử Vi để đặt sao và chia nhịp thời
 * gian — không phải điểm số, không phán mệnh tốt xấu.
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

export function MenhCucFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn tra thử một công cụ Tử Vi và nhận về một dòng lạ: {strong('“Cục: Hỏa Lục Cục”')}. Không
          ai nói con số 6 ở đâu ra, cũng không ai nói nó khác gì với câu “nhà mình mệnh Thổ” mà bà
          vẫn bảo. Hai chữ nghe giống nhau, thực ra là hai thứ khác hẳn.
        </>
      }
      why={
        <>
          Vì Cục là {strong('mắt xích bắt buộc')} của một lá số: chưa có Cục thì chưa đặt được sao Tử
          Vi, mà chưa có sao Tử Vi thì 13 chính tinh còn lại không có chỗ bám. Đây là chỗ mà hầu hết
          bài viết trên mạng nhắc tên rồi bỏ qua.
        </>
      }
      what={
        <>
          Cục là {strong('ngũ hành cục của lá số')} — một trong năm giá trị Thủy Nhị Cục, Mộc Tam
          Cục, Kim Tứ Cục, Thổ Ngũ Cục, Hỏa Lục Cục. Nó {strong('không phải')} mệnh ngũ hành của năm
          sinh, và {strong('không phải')} thước đo tốt xấu.
        </>
      }
      how={
        <>
          Lấy {strong('can chi của cung Mệnh')} trên lá số (chi do ngày và giờ sinh quyết định, can
          suy từ can năm sinh), tra bảng nạp âm Lục Thập Hoa Giáp ra một hành — hành đó chính là Cục.
          Mỗi hành đi kèm một con số cố định: Thủy 2, Mộc 3, Kim 4, Thổ 5, Hỏa 6.
        </>
      }
      soWhat={
        <>
          Để bạn đọc được dòng “Cục” trong kết quả mà {strong('không hiểu nhầm nó thành lời phán')}:
          con số đó là nhịp — nhịp đặt sao và tuổi khởi đại vận đầu tiên — chứ không phải điểm số của
          cuộc đời bạn.
        </>
      }
    />
  );
}

export function MenhCucDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="menh-cuc"
        concept="Cục là gì — và vì sao nó không phải “mệnh” của bạn"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy tưởng tượng lá số là một bàn cờ tròn 12 ô, và bạn phải đặt quân cờ quan trọng
                nhất xuống trước. Cục là {strong('tờ hướng dẫn')} nói cho bạn biết đếm theo nhịp mấy
                ô một để tìm đúng chỗ đặt quân đó. Nó là luật đặt cờ, không phải điểm của người chơi.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Có ba thứ hay bị gộp làm một. {strong('Cung Mệnh')} là một ô trên lá số.{' '}
                  {strong('Mệnh ngũ hành')} là câu “tôi mệnh Kim / mệnh Thổ”, suy từ năm sinh.{' '}
                  {strong('Cục')} là thứ thứ ba: ngũ hành cục của riêng lá số, đi kèm một con số.
                </p>
                <p>
                  Chỉ có đúng năm giá trị: Thủy Nhị Cục, Mộc Tam Cục, Kim Tứ Cục, Thổ Ngũ Cục và Hỏa
                  Lục Cục. Cùng một hành thì luôn cùng một con số — không có chuyện “Hỏa Ngũ Cục”.
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
                  Trong dữ liệu engine trả về, Cục nằm ở trường {strong('fiveElementsClass')} của lá
                  số — cùng cấp với cung Mệnh và cung Thân, tức thuộc lớp {strong('khung')} chứ chưa
                  phải lớp sao. Trang công cụ Tính Mệnh Cục đọc thẳng trường này ra ô “Cục”.
                </p>
                <p>
                  Vì thuộc lớp khung nên Cục {strong('không mang nội dung luận giải')}: nó không nói
                  bạn giàu nghèo, hợp nghề gì, năm nay ra sao. Nó chỉ trả lời hai câu hỏi kỹ thuật —
                  đặt sao Tử Vi ở đâu, và đại vận đầu tiên khởi từ mấy tuổi.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="menh-cuc"
        concept="Con số 2 – 3 – 4 – 5 – 6 nghĩa là gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Con số ấy giống {strong('bước nhảy lò cò')}: người thì nhảy hai ô một, người thì nhảy
                sáu ô một. Nhảy bước ngắn hay bước dài đều tới đích, không ai hơn ai — chỉ là nhịp
                chân khác nhau thôi.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Con số có {strong('hai công dụng')}. Một: nó là số dùng để chia ngày sinh âm lịch
                  khi đặt sao Tử Vi lên bàn 12 cung. Hai: nó chính là{' '}
                  {strong('tuổi bắt đầu đại vận đầu tiên')} — Thủy Nhị Cục khởi vận quanh 2 tuổi, Hỏa
                  Lục Cục quanh 6 tuổi, mỗi đại vận sau đó kéo 10 năm.
                </p>
                <p>
                  Vì vậy số lớn {strong('không có nghĩa là mạnh hơn')}. Nó chỉ nói vận đến sớm hay
                  muộn hơn vài năm ở đoạn đầu đời — quãng mà phần lớn chúng ta còn chưa đi học.
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
                  Kiểm được ngay trên dữ liệu: khoảng tuổi của đại vận đóng tại cung Mệnh luôn bắt
                  đầu đúng bằng Cục số và kéo dài 10 năm — {strong('Thủy Nhị Cục ra 2–11')}, Kim Tứ
                  Cục ra 4–13, Hỏa Lục Cục ra 6–15. Đây là quan hệ máy móc, không có ngoại lệ.
                </p>
                <p>
                  Cần tách bạch hai lớp: {strong('tuổi khởi')} vận do Cục quyết định, còn{' '}
                  {strong('chiều đi')} của đại vận (thuận hay nghịch) lại do cặp âm dương can năm
                  sinh kết hợp giới tính quyết định. Hai người cùng ngày giờ sinh khác giới tính có
                  cùng Cục, cùng tuổi khởi vận, nhưng chuỗi đại vận chạy ngược chiều nhau.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="menh-cuc"
        concept="Vì sao Cục tra nạp âm của cung Mệnh, không phải của năm sinh"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cả lớp cùng sinh một năm thì cùng một “mệnh”. Nhưng lá số cần một thứ{' '}
                {strong('phân biệt được từng bạn')}, nên nó không hỏi “bạn sinh năm nào” mà hỏi “ô
                Mệnh của bạn nằm ở đâu” — mỗi bạn một chỗ khác nhau.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Cả hai đều tra cùng một bảng — bảng nạp âm Lục Thập Hoa Giáp. Khác nhau ở chỗ{' '}
                  {strong('tra cho cặp can chi nào')}: mệnh ngũ hành tra can chi của{' '}
                  {strong('năm sinh')}, còn Cục tra can chi của {strong('cung Mệnh')}.
                </p>
                <p>
                  Cung Mệnh có địa chi riêng (do tháng và giờ sinh định ra) và một thiên can riêng
                  (suy từ can năm sinh). Ghép lại thành một cặp can chi mới — và cặp đó thường không
                  trùng với can chi năm sinh.
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
                  Đây là điểm mấu chốt và cũng là chỗ dễ sai nhất khi tra tay. Ví dụ người sinh năm{' '}
                  {strong('Canh Ngọ')} có mệnh nạp âm là Lộ Bàng Thổ; nhưng nếu cung Mệnh của người
                  đó đóng tại Tý thì cặp can chi cung Mệnh là {strong('Mậu Tý')} → nạp âm Tích Lịch
                  Hỏa → {strong('Hỏa Lục Cục')}. Mệnh Thổ, Cục Hỏa — cả hai đều đúng, vì chúng trả
                  lời hai câu hỏi khác nhau.
                </p>
                <p>
                  Hệ quả: {strong('mệnh ngũ hành không suy ra được Cục')} và ngược lại. Ai đưa bạn
                  một bảng “năm sinh → Cục” là đang bỏ mất giờ sinh, tức bỏ mất đúng thứ làm nên sự
                  khác biệt giữa hai người cùng tuổi.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="menh-cuc"
        concept="Vì sao đổi giờ sinh là đổi luôn Cục"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Ô Mệnh giống {strong('kim đồng hồ')}: giờ sinh khác thì kim chỉ sang ô khác. Kim
                chuyển ô thì cái tên gắn với ô đó cũng đổi, nên Cục đổi theo.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Cung Mệnh được an từ {strong('tháng âm lịch và giờ sinh')}. Đổi giờ sinh là đổi vị
                  trí cung Mệnh; đổi vị trí cung Mệnh là đổi cặp can chi của nó; đổi cặp can chi là
                  đổi nạp âm, và cuối chuỗi là đổi Cục.
                </p>
                <p>
                  Chuỗi domino này giải thích vì sao công cụ hỏi giờ sinh chứ không chỉ hỏi năm. Nếu
                  bạn không nhớ giờ, công cụ dùng tạm 12:00 và ghi rõ độ chính xác thấp hơn — vì cung
                  Mệnh, và do đó Cục, có thể lệch.
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
                  Thử nghiệm sạch: giữ nguyên ngày 15/05/1990 và chỉ đổi giờ sinh, Cục chạy qua{' '}
                  {strong('đủ cả năm giá trị')} — Kim Tứ Cục ở giờ Tý và giờ Sửu, Thổ Ngũ Cục ở giờ
                  Dần, Hỏa Lục Cục ở giờ Tỵ, Thủy Nhị Cục ở giờ Thân, Mộc Tam Cục ở giờ Tuất. Cùng
                  một ngày, năm kết quả khác nhau.
                </p>
                <p>
                  Ngược lại, {strong('giới tính không làm đổi Cục')}: cùng ngày giờ sinh thì nam và
                  nữ ra cùng cung Mệnh, cùng Cục, cùng tuổi khởi đại vận. Giới tính chỉ đổi chiều
                  chạy của chuỗi đại vận. Trộn hai chuyện này là hiểu sai công cụ hỏi giới tính để
                  làm gì.
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
    prompt: 'Cục được suy ra từ nạp âm của cặp can chi nào — và vì sao lại là cặp đó?',
    answer: (
      <>
        Từ nạp âm của {strong('can chi cung Mệnh')}, không phải can chi năm sinh. Vì lá số cần một
        giá trị phân biệt được từng người: mọi người sinh cùng năm âm có cùng can chi năm, nhưng cung
        Mệnh thì phụ thuộc tháng và giờ sinh nên mỗi người một khác.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Có đúng bao nhiêu giá trị Cục, và con số đi kèm mỗi hành có cố định không?',
    choices: [
      {
        text: 'Năm giá trị, mỗi hành gắn cố định một con số: Thủy 2, Mộc 3, Kim 4, Thổ 5, Hỏa 6',
        correct: true,
        note: 'Đúng — nên nghe tên là biết số, và nghe số là biết hành. Không có tổ hợp nào khác.',
      },
      {
        text: 'Năm hành nhưng con số thay đổi tuỳ từng lá số',
        note: 'Không — con số dính liền với hành, đó là lý do tên Cục luôn gồm cả hành lẫn số.',
      },
      {
        text: 'Sáu giá trị, vì con số chạy từ 1 đến 6',
        note: 'Không — không có Cục số 1. Dải số là 2 đến 6, ứng đúng năm hành.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Hai chị em sinh cùng ngày cùng giờ, một nam một nữ. Cục của họ thế nào?',
    choices: [
      {
        text: 'Giống hệt nhau — giới tính chỉ đổi chiều chạy của đại vận, không đổi Cục',
        correct: true,
        note: 'Đúng — cùng ngày giờ sinh thì cùng cung Mệnh, cùng Cục, cùng tuổi khởi vận.',
      },
      {
        text: 'Khác nhau, vì nam và nữ có cách tính Cục riêng',
        note: 'Không — không có bảng Cục riêng theo giới tính. Cục chỉ phụ thuộc can năm và vị trí cung Mệnh.',
      },
      {
        text: 'Khác nhau, vì nam khởi đại vận sớm hơn nữ',
        note: 'Không — tuổi khởi vận bằng Cục số nên hai người bằng nhau; chỉ chiều đại vận là ngược nhau.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Người sinh năm Canh Ngọ có mệnh nạp âm Lộ Bàng Thổ, nhưng công cụ báo Hỏa Lục Cục. Nên hiểu thế nào?',
    choices: [
      {
        text: 'Cả hai đều đúng — mệnh tra can chi năm sinh, Cục tra can chi cung Mệnh',
        correct: true,
        note: 'Đúng — hai đại lượng khác nhau, dùng chung một bảng nạp âm nhưng tra cho hai cặp can chi khác nhau.',
      },
      {
        text: 'Công cụ tính sai, vì mệnh Thổ thì phải ra Thổ Ngũ Cục',
        note: 'Không — không có quy tắc nào bắt Cục trùng hành với mệnh năm sinh. Trùng nhau chỉ là ngẫu nhiên.',
      },
      {
        text: 'Phải chọn một trong hai, cái còn lại bỏ đi',
        note: 'Không — hai giá trị dùng cho hai việc khác nhau, giữ cả hai và nhớ rõ cái nào dùng ở đâu.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: 'Vì sao thiếu Cục thì không thể an sao trên lá số?',
    answer: (
      <>
        Vì sao Tử Vi — sao gốc của cả lá số — được an theo {strong('Cục cùng ngày sinh âm lịch')}: số
        ngày sinh chia cho Cục số, thương quyết định vị trí đặt Tử Vi trên vòng 12 cung. Đặt xong Tử
        Vi thì 13 chính tinh còn lại mới an theo bảng cố định quanh nó. Không có Cục là không có số
        chia, tức không có điểm khởi, tức không có lá số.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Câu nào dưới đây là cách đọc con số của Cục cho đúng?',
    choices: [
      {
        text: 'Nó là nhịp kỹ thuật: số chia khi đặt sao Tử Vi, và tuổi khởi đại vận đầu tiên',
        correct: true,
        note: 'Đúng — đó là toàn bộ công dụng của con số, không hơn.',
      },
      {
        text: 'Số càng lớn thì mệnh càng mạnh',
        note: 'Không — đây là ngộ nhận phổ biến nhất. Con số không xếp hạng bất cứ thứ gì.',
      },
      {
        text: 'Nó cho biết bạn sẽ giàu ở tuổi nào',
        note: 'Không — Cục thuộc lớp khung của lá số, hoàn toàn không mang nội dung luận giải.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt: 'Vận dụng: bạn nhớ ngày sinh nhưng không nhớ giờ. Điều gì xảy ra với Cục, và nên làm gì?',
    answer: (
      <>
        Không có giờ sinh thì {strong('cung Mệnh có thể lệch ô')}, mà lệch ô là đổi can chi cung
        Mệnh, đổi nạp âm và đổi luôn Cục — cùng một ngày 15/05/1990, đổi giờ sinh có thể ra cả năm
        Cục khác nhau. Công cụ sẽ dùng tạm 12:00 và báo rõ độ chính xác thấp hơn. Cách xử lý lành
        mạnh: hỏi lại người thân hoặc giấy tờ sinh, hoặc tra thử vài khung giờ để xem kết quả có đổi
        không, thay vì tin chắc vào một con số chưa có cơ sở.
      </>
    ),
  },
];

export function MenhCucRecall() {
  return <ActiveRecall topicId="menh-cuc" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Cục dùng để làm gì trong một lá số (đặt sao Tử Vi và định tuổi khởi đại vận) — và nó KHÔNG hứa gì (không phán mệnh tốt xấu, không dự đoán chuyện đời).',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt rành mạch ba thứ hay bị gộp: cung Mệnh (một ô trên lá số), mệnh ngũ hành (nạp âm năm sinh) và Cục (nạp âm can chi cung Mệnh).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Đi được cả chuỗi: can năm sinh + địa chi cung Mệnh → can chi cung Mệnh → tra nạp âm → ra hành → ra Cục và con số của nó.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể đủ năm Cục kèm đúng con số: Thủy Nhị 2, Mộc Tam 3, Kim Tứ 4, Thổ Ngũ 5, Hỏa Lục 6 — và biết không tồn tại tổ hợp nào khác.',
  },
  {
    id: 'number',
    facet: 'Ý nghĩa con số',
    can: 'Giải thích con số của Cục có đúng hai công dụng (số chia khi an sao Tử Vi, tuổi khởi đại vận đầu tiên) và không phải thang điểm mạnh yếu.',
  },
  {
    id: 'dependency',
    facet: 'Phụ thuộc',
    can: 'Nói được vì sao đổi giờ sinh thì Cục đổi, còn đổi giới tính thì Cục giữ nguyên — và giới tính thật ra ảnh hưởng tới cái gì.',
  },
  {
    id: 'necessity',
    facet: 'Tính bắt buộc',
    can: 'Giải thích vì sao thiếu Cục là không an được sao: Tử Vi là sao gốc, an theo Cục cùng ngày sinh âm, và mọi chính tinh khác bám theo Tử Vi.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra Cục là quy ước của hệ Tử Vi chứ không phải phép đo, rằng các trường phái còn khác nhau ở cách tính và cách phối Cục với Mệnh.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho một người chưa từng xem lá số trong một phút: Cục là gì, con số nghĩa là gì, vì sao nó khác câu “tôi mệnh Kim”.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Nói được phần nào bạn vẫn chưa nắm (ví dụ cách an cung Mệnh, hay bảng tra vị trí sao Tử Vi) và biết bài nào trên hieu.asia lấp phần đó.',
  },
];

export function MenhCucChecklist() {
  return <UnderstandingChecklist topicId="menh-cuc" facets={FACETS} />;
}

export function MenhCucWhys() {
  return (
    <FiveWhys
      topicId="menh-cuc"
      start={
        <>
          Hai người bạn cùng sinh năm 1990, tức cùng năm Canh Ngọ, cùng “mệnh Lộ Bàng Thổ”. Tra công
          cụ thì một người ra Hỏa Lục Cục, người kia ra Thủy Nhị Cục. Cả hai kết luận công cụ tính
          sai.
        </>
      }
      chain={[
        {
          question: 'Vì sao kết luận “công cụ tính sai” là vội?',
          because: (
            <>
              Vì {strong('mệnh ngũ hành')} và {strong('Cục')} là hai đại lượng khác nhau. Hai người
              cùng năm sinh thì chắc chắn cùng mệnh nạp âm, nhưng hoàn toàn có thể khác Cục — đó là
              chuyện bình thường, không phải mâu thuẫn.
            </>
          ),
        },
        {
          question: 'Vì sao hai đại lượng ấy lại khác nhau, khi cùng tra một bảng nạp âm?',
          because: (
            <>
              Vì chúng tra cho {strong('hai cặp can chi khác nhau')}: mệnh tra can chi của năm sinh,
              còn Cục tra can chi của {strong('cung Mệnh')}. Mà cung Mệnh nằm ở đâu là do tháng và
              giờ sinh quyết định, nên hai người cùng năm vẫn ra hai cặp khác nhau.
            </>
          ),
        },
        {
          question: 'Vì sao lá số phải nghĩ ra một đại lượng riêng thay vì dùng luôn mệnh năm sinh?',
          because: (
            <>
              Vì mệnh năm sinh {strong('gom cả triệu người vào chung một nhóm')} — dùng nó thì mọi
              người sinh cùng năm sẽ có lá số giống hệt nhau. Cục thì gắn với vị trí cung Mệnh, tức
              gắn với đúng ngày và giờ sinh của một người.
            </>
          ),
        },
        {
          question: 'Vì sao lá số lại cần đúng một con số như vậy để bắt đầu?',
          because: (
            <>
              Vì sao Tử Vi được an theo {strong('Cục cùng ngày sinh âm lịch')}: ngày sinh chia cho
              Cục số, thương quyết định vị trí đặt Tử Vi. Đặt xong Tử Vi thì 13 chính tinh còn lại
              mới an theo bảng cố định quanh nó — nên thiếu Cục là cả lá số không có điểm khởi.
            </>
          ),
        },
        {
          question: 'Hiểu tới đây thì nên đọc dòng “Cục” trong kết quả thế nào?',
          because: (
            <>
              Đọc nó như một {strong('thông số kỹ thuật')}, không phải một lời phán: nó cho biết sao
              Tử Vi đặt ở đâu và đại vận đầu tiên khởi từ mấy tuổi. Số lớn không phải mệnh mạnh, số
              nhỏ không phải mệnh yếu — cả năm Cục đều bình đẳng.
            </>
          ),
        },
      ]}
      root={
        <>
          Cục là quy ước kỹ thuật giúp lá số có điểm khởi và có nhịp thời gian, không phải bản án
          cũng không phải điểm số. Hiểu đúng chỗ này thì bạn thôi hoảng khi thấy “mệnh một đằng, cục
          một nẻo”, và {strong('đọc lá số như đọc bản đồ')} — biết cái gì là tính toán, cái gì mới là
          diễn giải.
        </>
      }
    />
  );
}
