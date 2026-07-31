/**
 * Nội dung "học chủ động" cho trang /learn/tam-hop-luc-xung.
 *
 * GROUNDING — mọi cặp/nhóm nhắc trong file này đều lấy từ:
 *   • lib/hop-tuoi-pairs.ts → ZODIAC (12 địa chi ĐÚNG thứ tự Tý…Hợi) và
 *     relationOf() — hàm phân loại 6 loại quan hệ mà công cụ
 *     /tuong-hop-12-con-giap dùng để dựng ma trận 12×12.
 *   • trang công cụ app/tuong-hop-12-con-giap/page.tsx (giọng: "xung"/"hại"
 *     KHÔNG phải điềm xấu; con giáp tính theo năm âm lịch, đổi vào Tết).
 *
 * Các phát biểu hình học trong bài đều kiểm được bằng chính bảng của công cụ:
 *   – tam hợp  = 3 chi cách nhau 4 bước (chỉ số cùng số dư khi chia 4);
 *   – lục xung = 2 chi cách nhau 6 bước (đối đỉnh);
 *   – lục hợp  = phép soi gương qua trục Tý|Sửu — Ngọ|Mùi (tổng số thứ tự 1–12
 *     của hai chi luôn là 3 hoặc 15);
 *   – lục hại  = phép soi gương qua trục Mão|Thìn — Dậu|Tuất (tổng là 9 hoặc 21);
 *   – hệ quả: lục hại của một chi = chi xung với lục hợp của nó (đúng cả 12/12).
 *
 * PHÂN VAI (chống trùng nội dung):
 *   – /learn/hop-tuoi   sở hữu: xem hợp tuổi vợ chồng/làm ăn, cách dùng kết quả.
 *   – /learn/con-giap   sở hữu: tính cách – sở trường từng con giáp, cục ngũ hành.
 *   – Bài NÀY sở hữu: HÌNH HỌC của vòng 12 địa chi. Lời khuyên quan hệ chỉ được
 *     nhắc đúng một câu rồi link sang /hop-tuoi.
 *
 * Giọng: đây là một hệ đối xứng do con người thiết kế — quy ước văn hoá để
 * tham khảo, không phán định, không hù doạ.
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

const TOPIC = 'tam-hop-luc-xung';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

export function TamHopFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn nghe “Thân – Tý – Thìn tam hợp”, “Tý xung Ngọ”, “Mão hại Thìn” — và mỗi lần cần dùng
          lại phải mở bảng tra hoặc hỏi người khác. Các danh sách ấy{' '}
          {strong('trông như phải học thuộc lòng')}, nên học xong vài hôm là quên.
        </>
      }
      why={
        <>
          Thực ra chúng không phải những mẩu rời rạc. Bốn nhóm tam hợp, sáu cặp lục xung, sáu cặp lục
          hợp và sáu cặp lục hại đều sinh ra từ {strong('đúng một thứ')}: cách 12 địa chi được xếp
          đều nhau trên một vòng tròn.
        </>
      }
      what={
        <>
          Bài này nói về {strong('hình học của vòng 12 địa chi')} — khoảng cách bước và tính đối
          xứng. Nó {strong('không phải')} bài tư vấn nên hay không nên yêu ai, cưới ai, làm ăn với ai
          — phần đó thuộc bài Hợp tuổi.
        </>
      }
      how={
        <>
          Đánh số 12 chi từ 1 (Tý) đến 12 (Hợi) rồi xếp lên một vòng tròn. Cách nhau{' '}
          {strong('4 bước')} → tam hợp. Cách nhau {strong('6 bước')} (đối đỉnh) → lục xung. Soi gương
          qua khe Tý|Sửu → lục hợp. Soi gương qua khe Mão|Thìn → lục hại.
        </>
      }
      soWhat={
        <>
          Bạn nhớ {strong('bốn quy tắc')} thay vì ba mươi cặp rời, tự suy được quan hệ của bất kỳ hai
          con giáp nào mà không cần bảng, và {strong('tự kiểm được mọi bảng tra')} bạn gặp trên mạng —
          rất nhiều bảng chép sai.
        </>
      }
    />
  );
}

export function TamHopDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId={TOPIC}
        concept="Vì sao chỉ cần đếm bước là ra quan hệ"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy tưởng tượng {strong('mười hai bạn nhỏ ngồi thành vòng tròn')}, cách đều nhau như
                các số trên mặt đồng hồ. Muốn biết bạn của mình quan hệ thế nào với một bạn khác, bạn
                chỉ cần {strong('đếm xem đi mấy bước là tới')}. Không cần nhớ tên ai cả — chỉ cần
                đếm.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Đánh số 12 địa chi theo đúng thứ tự: Tý là 1, Sửu là 2, Dần là 3… cho tới Hợi là
                  12. Vì là vòng tròn nên đi hết 12 thì {strong('quay lại số 1')} — giống kim đồng hồ
                  quay hết một vòng.
                </p>
                <p>
                  Khoảng cách giữa hai chi vì thế luôn đi được theo hai chiều, và ta lấy{' '}
                  {strong('chiều ngắn hơn')}. Hệ quả: khoảng cách lớn nhất có thể là{' '}
                  {strong('6 bước')} — xa hơn nữa thì đi vòng ngược lại sẽ gần hơn.
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
                  Nói bằng ngôn ngữ toán: 12 địa chi là các phần tử của một hệ đếm{' '}
                  {strong('xoay vòng theo modulo 12')}. Tam hợp và lục xung chỉ phụ thuộc{' '}
                  {strong('hiệu')} của hai số thứ tự — nên chúng bất biến khi ta xoay cả vòng tròn.
                </p>
                <p>
                  Lục hợp và lục hại thì khác: chúng phụ thuộc {strong('tổng')} của hai số, tức là
                  các phép {strong('soi gương')} (phản chiếu) chứ không phải phép xoay. Đây là lý do
                  hai họ quan hệ này hành xử khác nhau và không thể suy cái này ra cái kia bằng cách
                  “cộng thêm mấy bước”.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId={TOPIC}
        concept="Tam hợp = một tam giác đều trên vòng 12"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Có 12 cái kẹo chia đều cho {strong('3 bạn')} thì mỗi bạn được 4 cái. Tam hợp cũng
                vậy: ba con giáp đứng cách nhau {strong('4 bước')} trên vòng tròn, nối lại thành một{' '}
                {strong('hình tam giác đều')} — ba góc bằng nhau, không ai gần ai hơn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  12 chia cho 3 bằng 4, nên muốn đặt ba chi cách đều nhau trên vòng 12 thì khoảng
                  cách bắt buộc là {strong('4 bước')}. Từ một chi bất kỳ, cộng 4 rồi cộng 4 nữa là ra
                  hai bạn còn lại của nhóm.
                </p>
                <p>
                  Giờ xoay tam giác ấy đi 1 bước — ta được một nhóm mới. Xoay tiếp 1 bước nữa, lại
                  một nhóm mới. Nhưng xoay tới lần thứ 4 thì {strong('tam giác trùng lại chính nó')}.
                  Vì thế có đúng {strong('4 nhóm tam hợp')}, và 4 nhóm ấy phủ kín cả 12 con giáp,
                  không thừa không thiếu.
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
                  Ba chi cách nhau 4 bước là {strong('cùng số dư khi chia 4')}: 4 số dư 0/1/2/3 cho
                  đúng 4 nhóm, mỗi nhóm 3 chi. Không có cách chia nào khác — đây là kết quả bắt buộc
                  của con số 12, không phải lựa chọn của người xưa.
                </p>
                <p>
                  Một chi tiết đẹp và kiểm được: chi đứng đầu mỗi nhóm theo cách gọi quen thuộc (Thân
                  – Tý – Thìn, Dần – Ngọ – Tuất, Tỵ – Dậu – Sửu, Hợi – Mão – Mùi) luôn là một trong
                  bốn chi {strong('Dần, Thân, Tỵ, Hợi')}. Bốn chi này chính là bốn đỉnh của một hình
                  vuông trên vòng tròn — bạn sẽ gặp lại chúng ở phần “tứ hành xung”. Còn vì sao mỗi
                  nhóm được gọi là một “cục” ngũ hành thì thuộc phần ý nghĩa, đọc ở bài 12 con giáp.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId={TOPIC}
        concept="Lục xung = hai chi đối đỉnh"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Trong vòng tròn 12 bạn, mỗi bạn có {strong('đúng một bạn ngồi đối diện')} mình qua
                tâm — như hai đầu của một cây gậy đặt ngang qua giữa vòng. Cặp đối diện ấy gọi là
                “xung”. Chỉ là {strong('đứng đối nhau')}, không phải chuyện xấu.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  12 chia cho 2 bằng 6, nên chi đối đỉnh của bạn là chi{' '}
                  {strong('cộng thêm 6')} (quá 12 thì trừ đi 12). Tý là 1, cộng 6 ra 7 là Ngọ. Mão là
                  4, cộng 6 ra 10 là Dậu.
                </p>
                <p>
                  Vì cộng 6 rồi cộng 6 nữa là quay lại chỗ cũ, quan hệ này{' '}
                  {strong('luôn đi thành cặp')} và không bao giờ có “ba chi cùng xung nhau”. Mỗi chi
                  có đúng một bạn đối đỉnh, 12 chi ghép đôi hết thì ra {strong('6 cặp')} — đó chính
                  là chữ “lục” trong lục xung.
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
                  Lục xung là {strong('phép quay 180°')}. Nó là phép quay duy nhất khác phép đứng yên
                  mà mọi chi đều bị ghép đôi gọn ghẽ với một chi khác — nên nó là quan hệ “đối” tự
                  nhiên nhất mà một vòng 12 có thể có.
                </p>
                <p>
                  Hệ quả ít người để ý: quay 180° biến một nhóm tam hợp thành{' '}
                  {strong('một nhóm tam hợp khác')}, chứ không phá vỡ nó — Thân–Tý–Thìn quay nửa vòng
                  ra đúng Dần–Ngọ–Tuất, Tỵ–Dậu–Sửu ra đúng Hợi–Mão–Mùi. Nói cách khác, bốn nhóm tam
                  hợp tự bắt cặp thành {strong('hai cặp nhóm đối nhau')}, và mọi thành viên của nhóm
                  này đều xung với đúng một thành viên của nhóm kia.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId={TOPIC}
        concept="Lục hợp và lục hại = hai trục gương"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Lấy một tờ giấy tròn có 12 bạn, rồi {strong('gấp đôi lại')}. Hai bạn nào chồng lên
                nhau thì thành một cặp. Gấp theo một nếp thì ra sáu cặp “hợp”; gấp theo{' '}
                {strong('một nếp khác')} thì ra sáu cặp “hại”. Vẫn là mười hai bạn ấy, chỉ khác chỗ
                gấp.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Nếp gấp của {strong('lục hợp')} đi qua khe giữa Tý và Sửu, xuyên sang khe giữa Ngọ
                  và Mùi. Soi gương qua nếp ấy: Tý gặp Sửu, Dần gặp Hợi, Mão gặp Tuất, Thìn gặp Dậu,
                  Tỵ gặp Thân, Ngọ gặp Mùi. Mẹo kiểm nhanh: cộng hai số thứ tự luôn ra{' '}
                  {strong('3 hoặc 15')}.
                </p>
                <p>
                  Nếp gấp của {strong('lục hại')} đi qua khe giữa Mão và Thìn, xuyên sang khe giữa
                  Dậu và Tuất. Soi gương qua nếp này: Tý gặp Mùi, Sửu gặp Ngọ, Dần gặp Tỵ, Mão gặp
                  Thìn, Thân gặp Hợi, Dậu gặp Tuất. Mẹo kiểm nhanh: cộng hai số luôn ra{' '}
                  {strong('9 hoặc 21')}.
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
                  Hai trục gương ấy {strong('lệch nhau đúng 3 bước')}, tức 90°. Mà soi gương hai lần
                  qua hai trục lệch nhau 90° thì bằng {strong('quay 180°')} — chính là lục xung. Cụ
                  thể: tổng của cặp hại (9 hoặc 21) hơn tổng của cặp hợp (3 hoặc 15) đúng 6 đơn vị.
                </p>
                <p>
                  Nên có một công thức gọn mà bảng tra không nói ra:{' '}
                  {strong('lục hại của một chi = chi xung với lục hợp của chi đó')}. Ví dụ Tý hợp
                  Sửu, mà Sửu xung Mùi, nên Tý hại Mùi. Kiểm với cả 12 chi bằng chính bảng của công
                  cụ đều khớp — đây là quan hệ dẫn xuất, không phải một danh sách độc lập cần học
                  thuộc.
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
    prompt:
      'Đánh số Tý = 1, Sửu = 2… Hợi = 12. Cần cộng thêm bao nhiêu để ra con giáp xung với mình — và vì sao lại là con số đó?',
    answer: (
      <>
        Cộng {strong('6')} (nếu vượt quá 12 thì trừ đi 12). Vì 12 chi xếp đều trên một vòng tròn nên
        chi đối đỉnh nằm cách đúng nửa vòng, mà nửa của 12 là 6. Ví dụ Mão là 4, cộng 6 ra 10 tức
        Dậu.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Ba con giáp trong một nhóm tam hợp cách nhau bao nhiêu bước trên vòng 12?',
    choices: [
      { text: '3 bước', note: 'Không — cách 3 bước là bốn chi tạo thành hình vuông, không phải tam hợp.' },
      {
        text: '4 bước',
        correct: true,
        note: 'Đúng — 12 chia 3 bằng 4, nên ba chi cách đều nhau phải cách 4 bước và nối lại thành tam giác đều.',
      },
      { text: '6 bước', note: 'Không — cách 6 bước là hai chi đối đỉnh, tức cặp lục xung.' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Vì sao vòng 12 địa chi có đúng 6 cặp lục xung, không nhiều hơn không ít hơn?',
    choices: [
      {
        text: 'Vì mỗi chi có đúng một chi đối đỉnh, nên 12 chi ghép đôi hết thành 12 ÷ 2 = 6 cặp',
        correct: true,
        note: 'Đúng — đó cũng là lý do có chữ “lục” (sáu) trong tên gọi.',
      },
      {
        text: 'Vì người xưa chọn ra sáu cặp đáng lưu ý nhất trong số rất nhiều cặp',
        note: 'Không — con số 6 là kết quả bắt buộc của hình học, không phải một lựa chọn.',
      },
      {
        text: 'Vì có sáu hành trong ngũ hành',
        note: 'Không — ngũ hành có năm hành, và con số 6 ở đây đến từ việc chia đôi vòng 12.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt:
      'Bạn tuổi Mão (số 4). Chỉ dùng hình học, hãy suy ra: chi nào xung, hai chi nào tam hợp, chi nào lục hợp, chi nào lục hại?',
    answer: (
      <>
        Xung: 4 + 6 = 10 → {strong('Dậu')}. Tam hợp: 4 + 4 = 8 → Mùi và 4 + 8 = 12 → Hợi, tức nhóm{' '}
        {strong('Hợi – Mão – Mùi')}. Lục hợp: tổng phải là 3 hoặc 15, mà 15 − 4 = 11 →{' '}
        {strong('Tuất')}. Lục hại: tổng phải là 9 hoặc 21, mà 9 − 4 = 5 → {strong('Thìn')}. Bốn kết
        quả này khớp đúng bảng tra của công cụ.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt:
      'Trong nhóm bốn con giáp Tý – Mão – Ngọ – Dậu (một “tứ hành xung” quen thuộc), quan hệ giữa Tý và Mão theo bảng tra là gì?',
    choices: [
      {
        text: 'Lục xung — vì cả bốn con trong nhóm đều xung nhau',
        note: 'Không — chỉ hai đường chéo mới là cặp xung: Tý–Ngọ và Mão–Dậu.',
      },
      {
        text: 'Bình hoà — vì Tý và Mão chỉ cách nhau 3 bước, không phải 6',
        correct: true,
        note: 'Đúng — đây là chỗ cụm “tứ hành xung” hay gây hiểu nhầm: nhóm bốn chứa hai cặp xung, chứ không phải bốn con cùng xung nhau.',
      },
      {
        text: 'Tam hợp — vì cùng nằm trong một nhóm có tên',
        note: 'Không — tam hợp là ba chi cách nhau 4 bước; Tý và Mão cách 3 bước.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Lục hại của một con giáp có thể suy ra từ đâu?',
    choices: [
      {
        text: 'Từ chính nó — lấy con lục hợp của nó, rồi lấy con xung với con lục hợp ấy',
        correct: true,
        note: 'Đúng — ví dụ Tý hợp Sửu, Sửu xung Mùi, nên Tý hại Mùi. Đúng cho cả 12 chi.',
      },
      {
        text: 'Không suy được — phải học thuộc riêng sáu cặp hại',
        note: 'Không — lục hại là quan hệ dẫn xuất, vì hai trục gương lệch nhau đúng 90°.',
      },
      {
        text: 'Lấy con giáp đứng liền kề mình trên vòng tròn',
        note: 'Không — chi liền kề nói chung là bình hoà; riêng Tý–Sửu và Ngọ–Mùi liền kề lại là lục hợp.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vì sao cùng một vòng 12 lại chia được thành 4 nhóm ba (tam hợp) và 3 nhóm bốn (“tứ hành xung”)?',
    answer: (
      <>
        Vì {strong('12 = 4 × 3 = 3 × 4')}. Chia thành các nhóm ba cách đều thì mỗi bước là 4 và được
        4 nhóm; chia thành các nhóm bốn cách đều thì mỗi bước là 3 và được 3 nhóm. Cả hai cách chia
        đều phủ kín 12 chi và không phụ thuộc vào nhau — đó là lý do một con giáp vừa có nhóm tam hợp
        vừa nằm trong một nhóm bốn.
      </>
    ),
  },
  {
    id: 'q8',
    type: 'mcq',
    prompt: 'Câu nào mô tả đúng nhất bản chất của hệ tam hợp – lục xung?',
    choices: [
      {
        text: 'Một hệ đối xứng do con người thiết kế trên vòng 12 chi — quy ước văn hoá để tham khảo',
        correct: true,
        note: 'Đúng — hình học thì chặt chẽ và kiểm được, còn ý nghĩa gán cho nó là quy ước văn hoá.',
      },
      {
        text: 'Một quy luật đo được về tính cách và số phận con người',
        note: 'Không — không có gì trong hình học của một vòng tròn nói được điều đó về hai con người cụ thể.',
      },
      {
        text: 'Một danh sách ngẫu nhiên do các sách chép lại khác nhau',
        note: 'Không — bốn nhóm quan hệ đều suy ra được từ một vòng tròn, nên chúng rất nhất quán giữa các nguồn.',
      },
    ],
  },
];

export function TamHopRecall() {
  return <ActiveRecall topicId={TOPIC} questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được bài này giải quyết gì (không phải học thuộc bảng, mà đọc ra quan hệ từ vị trí trên vòng 12) — và nó KHÔNG trả lời câu “hai người có hợp nhau không”.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Giải thích được vì sao chỉ cần biết khoảng cách bước giữa hai chi là đủ để gọi tên quan hệ, và vì sao khoảng cách lớn nhất trên vòng 12 là 6.',
  },
  {
    id: 'tam-hop',
    facet: 'Tam hợp',
    can: 'Chứng minh được tam hợp phải là 3 chi cách nhau 4 bước (12 ÷ 3 = 4), và vì sao có đúng 4 nhóm phủ kín 12 chi.',
  },
  {
    id: 'luc-xung',
    facet: 'Lục xung',
    can: 'Chứng minh được lục xung là 2 chi đối đỉnh (cộng 6), và vì sao mỗi chi có đúng một chi xung nên tổng cộng chỉ có 6 cặp.',
  },
  {
    id: 'guong',
    facet: 'Hai trục gương',
    can: 'Nói được lục hợp và lục hại là hai phép soi gương qua hai trục khác nhau, và kiểm được bằng mẹo cộng số thứ tự (tổng 3/15 với hợp, 9/21 với hại).',
  },
  {
    id: 'derive',
    facet: 'Suy dẫn',
    can: 'Suy được lục hại từ lục hợp và lục xung (hại = xung của hợp), thay vì học thuộc sáu cặp hại như một danh sách riêng.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt được “tứ hành xung” (nhóm bốn chi hình vuông, cách nhau 3 bước) với lục xung thật (cặp đối đỉnh) — và biết hai chi cạnh nhau trong nhóm bốn là bình hoà.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra hình học chỉ nói về cấu trúc, không nói gì về hai con người cụ thể; và biết ý nghĩa gán cho từng quan hệ là quy ước văn hoá, không phải quy luật.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Vẽ một vòng tròn 12 điểm và giải thích cho người khác trong hai phút: tam giác là tam hợp, đường kính là lục xung, hai nếp gấp là lục hợp và lục hại.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Nói được phần nào bạn vẫn thấy mơ hồ (vd vì sao trục gương lại đặt ở khe Tý|Sửu chứ không phải khe khác) — và chấp nhận rằng phần đó là quy ước được truyền lại.',
  },
];

export function TamHopChecklist() {
  return <UnderstandingChecklist topicId={TOPIC} facets={FACETS} />;
}

export function TamHopWhys() {
  return (
    <FiveWhys
      topicId={TOPIC}
      start={
        <>
          Bạn ngồi học thuộc bảng tam hợp – lục xung: bốn nhóm tam hợp, sáu cặp xung, sáu cặp hợp,
          sáu cặp hại. Học xong thì thuộc, nhưng vài hôm sau đã lẫn — và mỗi lần cần lại phải đi tra.
        </>
      }
      chain={[
        {
          question: 'Vì sao học thuộc theo kiểu liệt kê lại chóng quên đến vậy?',
          because: (
            <>
              Vì bạn đang cố nhớ {strong('ba mươi mẩu rời rạc')} không có mối liên hệ nào với nhau —
              trong khi thật ra chúng không hề rời rạc.
            </>
          ),
        },
        {
          question: 'Vì sao chúng không rời rạc?',
          because: (
            <>
              Vì cả bốn họ quan hệ đều mọc ra từ {strong('một vòng tròn 12 vị trí cách đều nhau')}.
              Mỗi cặp con giáp chỉ khác nhau ở chỗ chúng cách nhau mấy bước, hoặc nằm đối xứng qua
              trục nào.
            </>
          ),
        },
        {
          question: 'Vì sao một vòng tròn lại đẻ ra đúng bốn họ quan hệ ấy?',
          because: (
            <>
              Vì 12 chia hết cho 2, 3, 4 và 6 — nên trên vòng 12 vẽ được{' '}
              {strong('đường kính (2), tam giác đều (3), hình vuông (4)')}, và ngoài ra còn hai phép
              soi gương. Đường kính cho lục xung, tam giác cho tam hợp, hai phép soi gương cho lục
              hợp và lục hại.
            </>
          ),
        },
        {
          question: 'Vậy vì sao lại là con số 12 chứ không phải một số khác?',
          because: (
            <>
              Vì 12 địa chi vốn là {strong('bộ ký hiệu lịch pháp')} — 12 tháng, 12 canh giờ, 12
              phương vị — chứ không sinh ra để làm bảng hợp khắc. Cấu trúc đối xứng đẹp là{' '}
              {strong('hệ quả')} của con số 12, và các bản truyền lại không ghi lý do gốc vì sao lại
              gán ý nghĩa “hợp” cho tam giác và “xung” cho đường kính.
            </>
          ),
        },
        {
          question: 'Hiểu tới gốc rồi thì thay đổi được điều gì?',
          because: (
            <>
              Hai điều. Một: bạn nhớ {strong('bốn quy tắc')} thay vì ba mươi cặp, và tự kiểm được mọi
              bảng tra bạn gặp. Hai: bạn thấy rõ đây là một{' '}
              {strong('hệ đối xứng do con người thiết kế')} — hình học thì chặt chẽ, còn ý nghĩa gán
              cho nó là quy ước văn hoá để tham khảo.
            </>
          ),
        },
      ]}
      root={
        <>
          Tam hợp – lục xung không phải một danh sách phải thuộc lòng, mà là{' '}
          {strong('hình học của một vòng tròn 12 điểm')}. Hiểu cái vòng ấy rồi thì bảng tra chỉ còn
          là chỗ đối chiếu, và bạn đọc mọi quan hệ bằng hiểu biết của mình — tham khảo, không phán
          định.
        </>
      }
    />
  );
}
