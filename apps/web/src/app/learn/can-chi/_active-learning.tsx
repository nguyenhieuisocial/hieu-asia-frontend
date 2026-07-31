/**
 * Nội dung "học chủ động" cho trang /learn/can-chi.
 *
 * GROUNDING — mọi dữ kiện đều suy từ code có thật (chi tiết đầy đủ ghi ở đầu
 * page.tsx cùng thư mục):
 *   • lib/bazi.ts → `CAN` (10 Thiên Can), `CHI` (12 Địa Chi), `ELEMENTS`; âm/dương
 *     theo CAN_YANG = [true,false,…] (chỉ số 0-based chẵn = Dương), hành của can
 *     = ELEMENTS[floor(i/2)], hành của chi = CHI_ELEMENT (trùng ZODIAC.nguHanh).
 *   • lib/hop-tuoi-pairs.ts → `ZODIAC`; lib/con-giap-animal.ts → `conVatOf`.
 *   • lib/dat-ten-ngu-hanh.ts → `yearCanChi`: can = (năm − 4) mod 10,
 *     chi = (năm − 4) mod 12; lib/sinh-con.ts → `yearProfile` để đối chiếu.
 *   • trang công cụ app/luc-thap-hoa-giap/page.tsx — bảng tra trọn 60 Can Chi.
 *
 * PHẠM VI: chỉ nói về BỘ MÁY can chi (10 can, 12 chi, luật ghép cùng tính
 * âm/dương, vì sao ra 60, suy can chi của một năm). KHÔNG giảng nạp âm / ngũ hành
 * bản mệnh (→ /ban-menh), tính cách 12 con giáp (→ /learn/con-giap), tam hợp –
 * lục xung (→ /tuong-hop-12-con-giap), lập tứ trụ (→ /learn/bat-tu).
 *
 * Giọng: can chi là một HỆ ĐÁNH SỐ thời gian — dữ kiện lịch pháp để tra cứu,
 * không phán định con người.
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

export function CanChiFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn gặp những cái tên như {strong('Giáp Tý')}, {strong('Bính Ngọ')},{' '}
          {strong('Quý Hợi')} ở khắp nơi — năm sinh của ông bà, tên một sự kiện lịch sử, dòng đầu
          của một lá số. Nhưng gần như không ai nói cho bạn biết những chữ ấy được tạo ra thế nào,
          nên chúng cứ như mật mã phải học thuộc.
        </>
      }
      why={
        <>
          Vì can chi là {strong('cách người xưa đánh số thời gian')} — vai trò giống hệt con số
          “2026” trong lịch dương. Mọi thứ dựng trên lịch âm (tuổi, nạp âm, lá số, ngày giờ tốt xấu)
          đều đọc thời gian bằng bộ chữ này, nên không hiểu can chi thì mọi thứ phía trên đều là hộp
          đen.
        </>
      }
      what={
        <>
          Hai dãy tên ghép lại: {strong('10 Thiên Can')} (Giáp, Ất, Bính… Quý) và{' '}
          {strong('12 Địa Chi')} (Tý, Sửu, Dần… Hợi). Mỗi can và mỗi chi mang một{' '}
          {strong('tính âm hoặc dương')} và một hành. Ghép một can với một chi được một tên, ví dụ
          Giáp Tý. {strong('Không phải')} một lời phán về người mang tên năm đó.
        </>
      }
      how={
        <>
          Luật ghép chỉ có một câu: {strong('dương ghép với dương, âm ghép với âm')}. Vì thế mỗi can
          chỉ đi được với 6 chi cùng tính, ra {strong('10 × 6 = 60 cặp')} chứ không phải 120. Sáu
          mươi cặp ấy chạy hết một vòng rồi lặp lại — đó chính là vòng 60 năm.
        </>
      }
      soWhat={
        <>
          Bạn tự suy được can chi của bất kỳ năm nào bằng hai phép chia lấy dư, biết ngay một cặp
          như “Giáp Sửu” là {strong('không tồn tại')}, và quan trọng nhất: hiểu rằng can chi chỉ{' '}
          {strong('đánh số thời gian')} — mọi diễn giải vận mệnh là tầng gán thêm phía trên.
        </>
      }
    />
  );
}

export function CanChiDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="can-chi"
        concept="Can chi là gì — hai dãy tên chạy song song"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Tưởng tượng hai bánh răng lắp cạnh nhau. Bánh nhỏ có {strong('10 răng')}, mỗi răng
                khắc một chữ: Giáp, Ất, Bính… Bánh lớn có {strong('12 răng')}: Tý, Sửu, Dần… Mỗi năm
                cả hai bánh cùng quay đúng một răng, và tên của năm là{' '}
                {strong('hai chữ đang gặp nhau')}.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Thiên Can')} là dãy 10 tên: Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân,
                  Nhâm, Quý. {strong('Địa Chi')} là dãy 12 tên: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ,
                  Mùi, Thân, Dậu, Tuất, Hợi — và 12 chi này chính là 12 con giáp quen thuộc.
                </p>
                <p>
                  Tên một năm luôn là {strong('can trước, chi sau')}: Giáp Tý, Ất Sửu, Bính Dần…
                  Mỗi năm cả hai dãy cùng nhích một bước. Dãy can hết 10 thì quay về Giáp, dãy chi
                  hết 12 thì quay về Tý — hai dãy lệch nhịp nhau, và chính chỗ lệch đó tạo ra vòng
                  60.
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
                  Trong code, hai dãy là hai mảng thứ tự cố định: {strong('CAN')} có 10 phần tử,{' '}
                  {strong('CHI')} có 12. Bước thứ k của vòng lấy{' '}
                  {strong('CAN[k mod 10] + CHI[k mod 12]')}. Không có bảng tra 60 dòng nào cần gõ
                  tay — cả 60 tên đều sinh ra từ hai chỉ số này.
                </p>
                <p>
                  Điều đáng nói: can chi là một hệ {strong('tuần hoàn, không tuyến tính')}. Lịch
                  dương đếm 2025 → 2026 → 2027 tăng mãi; can chi thì quay vòng, nên tên năm{' '}
                  {strong('không cho biết đó là năm nào trong lịch sử')} nếu không biết thêm thế kỷ.
                  Đây là đặc tính kỹ thuật, cũng là giới hạn thật của hệ này.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="can-chi"
        concept="Âm/dương của can và chi — thứ quyết định luật ghép"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi chữ trong hai dãy đều đeo một cái nhãn: {strong('Dương')} hoặc {strong('Âm')}.
                Nhãn xen kẽ đều tăm tắp — chữ thứ nhất Dương, chữ thứ hai Âm, chữ thứ ba lại
                Dương… Chỉ có vậy, không cần nhớ gì thêm.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Quy ước rất máy móc: đếm vị trí trong dãy, {strong('vị trí lẻ là Dương')}, vị trí
                  chẵn là Âm. Giáp đứng thứ 1 nên Dương; Ất đứng thứ 2 nên Âm; Bính thứ 3 lại
                  Dương. Bên địa chi cũng thế: Tý (thứ 1) Dương, Sửu (thứ 2) Âm, Dần (thứ 3) Dương…
                </p>
                <p>
                  Vì cả hai dãy đều có {strong('số phần tử chẵn')} (10 và 12), mỗi dãy chia đôi tròn
                  trịa: {strong('5 can Dương – 5 can Âm')}, {strong('6 chi Dương – 6 chi Âm')}. Nhớ
                  hai con số 5 và 6 này, vì lát nữa chúng giải thích luôn vì sao có đúng 60 cặp.
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
                  Trong engine, âm/dương của can là mảng{' '}
                  {strong('[true, false, true, false, …]')} — tức đúng bằng tính chẵn/lẻ của chỉ số
                  0-based. Không có ngoại lệ nào, nên bạn không cần tra bảng: chỉ cần biết một
                  can/chi đứng thứ mấy là suy ra ngay tính âm/dương của nó.
                </p>
                <p>
                  Cần tách bạch hai chuyện hay bị gộp: {strong('âm/dương')} là tính chất dùng cho{' '}
                  {strong('luật ghép')}, còn {strong('ngũ hành')} của can/chi là một lớp thông tin
                  khác, dùng khi luận sinh khắc. Bài này chỉ cần lớp thứ nhất; lớp thứ hai thuộc về
                  các môn dựng phía trên can chi.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="can-chi"
        concept="Vì sao đúng 60 chứ không phải 120"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hai bánh răng quay cùng nhau, một bánh 10 răng, một bánh 12 răng. Chúng phải quay
                một lúc khá lâu mới cùng lúc về đúng chỗ xuất phát. “Khá lâu” ở đây là đúng{' '}
                {strong('60 bước')} — không sớm hơn, không muộn hơn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Nếu ghép tự do, 10 can × 12 chi sẽ ra {strong('120 cặp')}. Nhưng luật ghép cấm
                  trộn: {strong('dương chỉ đi với dương, âm chỉ đi với âm')}. Một can Dương như Giáp
                  chỉ được ghép với 6 chi Dương (Tý, Dần, Thìn, Ngọ, Thân, Tuất), tức{' '}
                  {strong('6 cặp')} thay vì 12.
                </p>
                <p>
                  10 can, mỗi can 6 lựa chọn hợp lệ → {strong('10 × 6 = 60')}. Đúng một nửa của 120,
                  vì luật ghép đã loại đi đúng một nửa số tổ hợp. Đây là toàn bộ bí mật của con số
                  60.
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
                  Có hai cách chứng minh, và cả hai ra cùng một số. Cách đếm: 5 can Dương × 6 chi
                  Dương = 30, cộng 5 can Âm × 6 chi Âm = 30, tổng {strong('60')}. Cách chu kỳ: hai
                  chỉ số cùng tăng 1 mỗi bước nên chúng chỉ đồng thời trở về 0 sau{' '}
                  {strong('bội chung nhỏ nhất của 10 và 12, tức 60')} bước.
                </p>
                <p>
                  Hai cách này không phải trùng hợp: chính vì 10 và 12 có ước chung là 2 nên
                  BCNN chỉ bằng 60 chứ không bằng 120, và cũng chính ước chung 2 ấy làm cho tính
                  âm/dương của can và chi {strong('luôn khớp nhau')} ở mọi bước của vòng. Nói cách
                  khác: luật “cùng âm cùng dương” không phải điều cấm áp từ ngoài vào —{' '}
                  {strong('nó là hệ quả tự nhiên của việc hai dãy cùng chạy')}.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="can-chi"
        concept="Can chi nói gì — và tuyệt đối không nói gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Can chi giống {strong('số nhà')}. Số nhà cho biết bạn ở đâu trên phố, nhưng không
                nói bạn tốt bụng hay xấu tính. Tên can chi của một năm cũng vậy: nó chỉ ra chỗ đứng
                của năm ấy trong vòng 60.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Bản thân can chi là một {strong('hệ đánh số thời gian')}, đúng như “năm 2026” hay
                  “thứ Ba”. Nó không chứa lời khen chê nào. Mọi câu kiểu “tuổi này hợp tuổi kia”,
                  “năm nay hạn nặng” đều đến từ {strong('các môn dựng thêm phía trên')} can chi, mỗi
                  môn một luật riêng.
                </p>
                <p>
                  Phân biệt được hai tầng này là bạn đã tránh được phần lớn ngộ nhận: tầng dưới
                  (can chi) là {strong('quy ước lịch pháp, kiểm chứng được')}; tầng trên (luận giải)
                  là {strong('diễn giải văn hoá, để tham khảo')}.
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
                  Cách kiểm nhanh một khẳng định về can chi: hỏi xem nó có suy ra được từ hai mảng
                  CAN/CHI và phép chia lấy dư không. Nếu có — như “2026 là Bính Ngọ” — thì đó là{' '}
                  {strong('dữ kiện')}, ai tính cũng ra một kết quả. Nếu không, nó thuộc tầng diễn
                  giải và cần được đọc như {strong('quan niệm, không phải kết luận')}.
                </p>
                <p>
                  hieu.asia giữ ranh giới ấy có chủ đích: phần tính toán công khai và tái lập được;
                  phần diễn giải nói rõ là tham khảo. Một hệ đánh số không thể biết gì về một con
                  người cụ thể — {strong('mọi người sinh cùng năm đều chung một can chi năm')}, mà
                  cuộc đời họ thì rõ ràng không giống nhau.
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
    prompt: 'Một tên can chi như “Bính Ngọ” được tạo ra từ đâu? Hai phần đó là gì?',
    answer: (
      <>
        Từ hai dãy tên chạy song song: {strong('10 Thiên Can')} (Giáp, Ất, Bính… Quý) và{' '}
        {strong('12 Địa Chi')} (Tý, Sửu, Dần… Hợi). Luôn viết {strong('can trước, chi sau')}, nên
        “Bính” là Thiên Can và “Ngọ” là Địa Chi. Mỗi bước thời gian, cả hai dãy cùng nhích một tên.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Vì sao vòng can chi có đúng 60 cặp mà không phải 120?',
    choices: [
      {
        text: 'Vì luật ghép chỉ cho phép dương với dương, âm với âm — nên mỗi can chỉ đi được với 6 chi cùng tính, 10 × 6 = 60',
        correct: true,
        note: 'Đúng — cũng có thể nói theo chu kỳ: bội chung nhỏ nhất của 10 và 12 là 60.',
      },
      {
        text: 'Vì người xưa cắt bớt cho gọn, lấy tròn 60 cho dễ nhớ',
        note: 'Không — 60 là kết quả bắt buộc của luật ghép, không ai chọn con số này cho tròn.',
      },
      {
        text: 'Vì mỗi cặp phải dùng đủ 60 năm mới hết ý nghĩa',
        note: 'Không — con số 60 thuần tuý đến từ cách hai dãy 10 và 12 khớp nhau, không liên quan ý nghĩa.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Cặp nào sau đây KHÔNG tồn tại trong vòng 60 can chi?',
    choices: [
      { text: 'Giáp Tý', note: 'Có — Giáp (Dương) ghép Tý (Dương), hợp luật, và là cặp mở đầu vòng.' },
      {
        text: 'Giáp Sửu',
        correct: true,
        note: 'Đúng — Giáp là can Dương còn Sửu là chi Âm, trái luật “cùng âm cùng dương” nên cặp này không bao giờ xuất hiện.',
      },
      { text: 'Quý Hợi', note: 'Có — Quý (Âm) ghép Hợi (Âm), hợp luật, và là cặp cuối cùng của vòng.' },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt: 'Làm sao biết một can hay một chi là Âm hay Dương mà không cần tra bảng?',
    answer: (
      <>
        Đếm vị trí của nó trong dãy: {strong('vị trí lẻ là Dương, vị trí chẵn là Âm')}, xen kẽ đều
        và không có ngoại lệ. Giáp đứng thứ 1 nên Dương, Ất thứ 2 nên Âm; Tý thứ 1 nên Dương, Sửu
        thứ 2 nên Âm. Vì 10 và 12 đều chẵn nên chia ra {strong('5 can Dương – 5 can Âm')} và{' '}
        {strong('6 chi Dương – 6 chi Âm')}.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Muốn suy can chi của một năm dương lịch, bạn làm gì?',
    choices: [
      {
        text: 'Lấy (năm − 4) chia 10 lấy dư để ra can, rồi (năm − 4) chia 12 lấy dư để ra chi',
        correct: true,
        note: 'Đúng — hai phép chia độc lập trên cùng một số (năm − 4). Đây chính là công thức engine dùng.',
      },
      {
        text: 'Lấy năm chia 60 lấy dư rồi tra một bảng 60 dòng thuộc lòng',
        note: 'Cách này cũng ra kết quả nhưng bắt buộc phải có bảng; hai phép chia lấy dư thì tính nhẩm được.',
      },
      {
        text: 'Lấy năm chia 12 để ra can và chia 10 để ra chi',
        note: 'Ngược rồi — 10 là số can nên chia 10 mới ra can; 12 là số chi nên chia 12 mới ra chi.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'open',
    prompt: 'Vận dụng: hãy tự suy can chi của năm 2000, từng bước.',
    answer: (
      <>
        Bước 1: {strong('2000 − 4 = 1996')}. Bước 2: 1996 chia 10 dư {strong('6')} → can thứ 7 trong
        dãy (đếm từ 0) là {strong('Canh')}. Bước 3: 1996 chia 12 dư {strong('4')} → chi thứ 5 là{' '}
        {strong('Thìn')}. Vậy năm 2000 là {strong('Canh Thìn')}. Kiểm nhanh: Canh ở vị trí lẻ thứ 7
        nên Dương, Thìn ở vị trí lẻ thứ 5 nên cũng Dương — hợp luật.
      </>
    ),
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Bộ can chi dùng được cho những tầng thời gian nào?',
    choices: [
      { text: 'Chỉ cho năm — tháng, ngày, giờ dùng hệ khác', note: 'Không — cùng một bộ can chi được dùng cho cả bốn tầng.' },
      {
        text: 'Cho năm, tháng, ngày và giờ — cùng một bộ chữ, nhưng luật suy ra của mỗi tầng khác nhau',
        correct: true,
        note: 'Đúng — bốn cặp can chi của bốn tầng chính là “tứ trụ” trong Bát Tự.',
      },
      { text: 'Cho năm và ngày, còn tháng và giờ thì đánh số bằng con số thường', note: 'Không — cả tháng và giờ đều có can chi riêng.' },
    ],
  },
  {
    id: 'q8',
    type: 'mcq',
    prompt: 'Biết một người sinh năm Bính Ngọ, ta suy ra được điều gì về người đó?',
    choices: [
      {
        text: 'Suy ra được vị trí năm sinh của họ trong vòng 60 — không suy ra được tính cách hay vận mệnh',
        correct: true,
        note: 'Đúng — can chi là hệ đánh số thời gian; mọi diễn giải về người là tầng gán thêm phía trên.',
      },
      {
        text: 'Suy ra được tính cách cơ bản của họ',
        note: 'Không — mọi người sinh cùng năm đều chung một can chi năm, mà tính cách họ rõ ràng khác nhau.',
      },
      {
        text: 'Suy ra chính xác họ sinh năm nào theo dương lịch',
        note: 'Không — can chi tuần hoàn, cùng một tên lặp lại mỗi 60 năm nên còn phải biết thêm thế kỷ.',
      },
    ],
  },
];

export function CanChiRecall() {
  return <ActiveRecall topicId="can-chi" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được can chi sinh ra để làm gì (đánh số thời gian, vai trò như con số của năm dương lịch) — và vì sao mọi thứ dựng trên lịch âm đều phải đọc qua nó.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể được 10 Thiên Can và 12 Địa Chi theo đúng thứ tự, và nói được tên một năm luôn viết can trước chi sau.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Xác định được âm/dương của bất kỳ can hay chi nào chỉ bằng vị trí của nó trong dãy (lẻ Dương, chẵn Âm), không cần tra bảng.',
  },
  {
    id: 'why-60',
    facet: 'Vì sao 60',
    can: 'Giải thích được vì sao chỉ có 60 cặp chứ không phải 120, bằng cả hai đường: 10 × 6 cặp hợp luật, và bội chung nhỏ nhất của 10 và 12 bằng 60.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nhìn một cặp bất kỳ là biết ngay nó hợp luật hay không (Giáp Tý có thật, Giáp Sửu không tồn tại) và nói được lý do.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Tự suy can chi của một năm dương lịch bất kỳ bằng hai phép chia lấy dư, rồi tự kiểm lại bằng luật cùng âm/dương.',
  },
  {
    id: 'scope',
    facet: 'Phạm vi',
    can: 'Nói được cùng bộ can chi ấy còn dùng cho tháng, ngày, giờ — và biết rằng luật suy ra của mỗi tầng khác nhau, không suy từ tầng năm được.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra can chi chỉ là hệ ĐÁNH SỐ thời gian: bản thân nó không phán gì về người, mọi diễn giải vận mệnh là tầng gán thêm phía trên.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nhớ rằng can chi tuần hoàn nên một tên lặp lại mỗi 60 năm, và người sinh sát Tết có thể bị ghi khác nhau tuỳ mốc đổi năm mà nguồn đó dùng.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người khác trong hai phút vì sao vòng can chi dài đúng 60 năm, chỉ dùng hai bánh răng 10 răng và 12 răng làm ví dụ.',
  },
];

export function CanChiChecklist() {
  return <UnderstandingChecklist topicId="can-chi" facets={FACETS} />;
}

export function CanChiWhys() {
  return (
    <FiveWhys
      topicId="can-chi"
      start={
        <>
          Một người tra năm sinh của mình, thấy hiện ra “Canh Ngọ”, rồi lập tức đi tìm xem “tuổi
          Canh Ngọ tính cách thế nào, hợp tuổi gì”. Chữ can chi vừa hiện ra đã được đọc thành một
          lời mô tả về con người.
        </>
      }
      chain={[
        {
          question: 'Vì sao đọc thẳng can chi thành lời mô tả về con người là một bước nhảy?',
          because: (
            <>
              Vì bản thân “Canh Ngọ” chỉ là {strong('một cái tên chỉ vị trí thời gian')} — đúng vai
              trò của con số 1990 trong lịch dương. Nó chưa nói gì về ai cả.
            </>
          ),
        },
        {
          question: 'Vì sao nó chỉ là tên chỉ vị trí?',
          because: (
            <>
              Vì cách nó sinh ra thuần cơ học: ghép {strong('can thứ (năm − 4) mod 10')} với{' '}
              {strong('chi thứ (năm − 4) mod 12')}. Hai phép chia lấy dư, không có chỗ nào chứa
              thông tin về một cá nhân.
            </>
          ),
        },
        {
          question: 'Vậy vì sao người xưa phải dựng ra một hệ tên rắc rối như thế thay vì đếm số?',
          because: (
            <>
              Vì thời chưa có kỷ nguyên đánh số liên tục, người ta cần một cách gọi tên năm{' '}
              {strong('lặp lại theo chu kỳ, dễ nhớ và khó chép nhầm')}. Hai dãy tên chạy song song
              cho ra 60 tên khác nhau — đủ dài để phủ gần trọn một đời người.
            </>
          ),
        },
        {
          question: 'Vì sao lại dừng ở 60 mà không phải một con số khác?',
          because: (
            <>
              Vì luật ghép chỉ cho phép {strong('dương với dương, âm với âm')}, nên mỗi can chỉ đi
              được với 6 chi: 10 × 6 = 60. Nói theo cách khác,{' '}
              {strong('bội chung nhỏ nhất của 10 và 12 là 60')} — hai dãy chỉ cùng lúc về vạch xuất
              phát sau đúng 60 bước.
            </>
          ),
        },
        {
          question: 'Hiểu tới đây thì nên đọc một cái tên can chi thế nào cho đúng?',
          because: (
            <>
              Đọc nó như {strong('một mốc trên trục thời gian')}: cho biết năm ấy đứng ở đâu trong
              vòng 60, và giúp bạn đối chiếu tuổi tác, tra cứu sử liệu, lập lá số. Còn mọi lời luận
              về tính cách hay vận mệnh đều thuộc {strong('tầng diễn giải phía trên')} — đọc như
              quan niệm để tham khảo, và luôn biết mình đang đứng ở tầng nào.
            </>
          ),
        },
      ]}
      root={
        <>
          Gốc rễ của mọi ngộ nhận quanh can chi là gộp hai tầng làm một. Tầng dưới là{' '}
          {strong('lịch pháp — dữ kiện tính được, ai tính cũng ra một kết quả')}. Tầng trên là{' '}
          {strong('diễn giải văn hoá — để tham khảo')}. Tách được hai tầng, bạn vừa dùng can chi
          thoải mái, vừa không bị một cái tên định nghĩa con người mình.
        </>
      }
    />
  );
}
