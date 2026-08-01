/**
 * Nội dung "học chủ động" cho trang /learn/kim-lau.
 *
 * TẤT CẢ grounded từ chính công cụ /kim-lau và hai file dữ liệu của nó:
 *   • lib/xem-tuoi-cuoi.ts  → checkKimLau: tuổi mụ = năm xem − năm sinh + 1;
 *     remainder = tuổi mụ % 9; phạm khi dư 1/3/6/8; KIM_LAU_BY_REMAINDER cho
 *     4 tên gọi + ghi chú dân gian (Thân / Thê / Tử / Lục Súc).
 *   • lib/kim-lau-data.ts   → KIM_LAU_TYPES (suy thẳng từ engine), phamAges(),
 *     kimLauYearsAhead(), KIM_LAU_FAQS; theo tục cưới hỏi xét chủ yếu tuổi mụ
 *     của CÔ DÂU.
 * Các con số ví dụ đều tính lại bằng đúng công thức trên. KHÔNG thêm dữ kiện
 * mới, KHÔNG lấn sang Tam Tai / Hoang Ốc / sao hạn Cửu Diệu.
 *
 * Giọng: phong tục để THAM KHẢO, không phán số mệnh, không hù doạ, không bán
 * lễ "giải hạn".
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

export function KimLauFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Hai bên gia đình đang chọn năm cưới, và ai đó hỏi một câu quen thuộc:{' '}
          {strong('“cô dâu năm nay có phạm Kim Lâu không?”')} — thường thì không ai giải thích được
          con số ấy ở đâu ra, nên người trong cuộc chỉ còn cách lo hoặc nghe theo.
        </>
      }
      why={
        <>
          Kim Lâu là một nét trong {strong('phong tục cưới hỏi của người Việt')}: một quy ước để nhắc
          nhau cân nhắc thêm khi chọn năm cưới. Nó là {strong('tục lệ để tham khảo')}, không phải lời
          phán số mệnh và không phải điều cấm.
        </>
      }
      what={
        <>
          Một phép xét rất gọn: lấy {strong('tuổi mụ của cô dâu')} trong năm định cưới, chia 9; nếu số
          dư là {strong('1, 3, 6 hoặc 8')} thì gọi là “phạm Kim Lâu”, ứng với 4 tên gọi Kim Lâu Thân /
          Thê / Tử / Lục Súc. {strong('Không phải')} một dự báo điều sẽ xảy ra.
        </>
      }
      how={
        <>
          {strong('Tuổi mụ = năm định cưới − năm sinh + 1')}, rồi lấy tuổi mụ chia 9 giữ phần dư (0
          đến 8). Dư rơi vào 1/3/6/8 là phạm, các số dư còn lại (0, 2, 4, 5, 7) là không phạm. Công cụ
          tự tính khi bạn nhập năm sinh cô dâu.
        </>
      }
      soWhat={
        <>
          Để bạn {strong('tự quyết trong hiểu biết')}: biết chính xác vì sao một năm bị gọi là phạm,
          và biết cách nhẹ nhàng nhất là chọn một năm cô dâu không phạm — thay vì hoãn cưới vô thời
          hạn hay tốn tiền mua lễ “giải hạn”.
        </>
      }
    />
  );
}

export function KimLauDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="kim-lau"
        concept="Vì sao lại là “chia 9 lấy dư”"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy tưởng tượng một vòng tròn có {strong('9 ô')}, mỗi năm bạn bước sang ô kế tiếp. Đi
                hết 9 ô thì quay lại ô đầu. Trong 9 ô ấy có {strong('4 ô')} được người xưa dặn “năm
                này nên cân nhắc thêm chuyện cưới xin”. Kim Lâu chỉ là chuyện bạn đang đứng ở ô nào
                thôi.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  “Chia 9 lấy dư” nghĩa là bỏ đi các nhóm 9 tuổi trọn vẹn, chỉ giữ phần lẻ. Tuổi mụ 28
                  gồm ba nhóm 9 (27) và lẻ ra 1, nên {strong('28 chia 9 dư 1')}. Cũng vì thế tuổi mụ
                  1, 10, 19, 28, 37, 46… đều cùng một số dư.
                </p>
                <p>
                  Phần dư chạy vòng 0 → 1 → 2 → … → 8 rồi lại về 0. Bốn số dư{' '}
                  {strong('1, 3, 6, 8')} được coi là phạm; năm số dư còn lại (0, 2, 4, 5, 7) là không
                  phạm. Đúng nghĩa một chiếc đồng hồ 9 vạch.
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
                  Công cụ dùng đúng phép này: {strong('ageMu = năm xem − năm sinh + 1')}, rồi{' '}
                  {strong('remainder = ageMu % 9')}. Bảng tra chỉ có 4 khoá 1 / 3 / 6 / 8; mọi số dư
                  khác không có mục trong bảng nên trả về “không phạm”.
                </p>
                <p>
                  Hệ quả cần nhớ: {strong('dư 0 không phải là phạm')}. Tuổi mụ 9, 18, 27, 36, 45 chia
                  hết cho 9 nên dư 0 — đây là chỗ nhiều người tra tay nhầm, vì quen nghĩ “chia hết cho
                  9 thì chắc dính”. Bản thân phép chia 9 không mang ý nghĩa gì thần bí: nó chỉ là cách
                  quy ước xưa gom mọi tuổi về 9 nhóm.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="kim-lau"
        concept="4 loại Kim Lâu: Thân / Thê / Tử / Lục Súc"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bốn ô “nên cân nhắc” không giống nhau: người xưa đặt cho mỗi ô một{' '}
                {strong('cái tên')} theo điều họ lo — lo cho bản thân mình, lo cho người bạn đời, lo
                cho con cái, lo cho của cải trong nhà. Chỉ là bốn cái tên, không phải bốn lời tiên
                đoán.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Số dư quyết định tên gọi: dư 1 là {strong('Kim Lâu Thân')} (kiêng vì lo ảnh hưởng
                  chính bản thân), dư 3 là {strong('Kim Lâu Thê')} (lo ảnh hưởng vợ/chồng), dư 6 là{' '}
                  {strong('Kim Lâu Tử')} (lo ảnh hưởng đường con cái), dư 8 là{' '}
                  {strong('Kim Lâu Lục Súc')} (lo ảnh hưởng tài sản, vật nuôi).
                </p>
                <p>
                  “Lục súc” là cách gọi cũ chỉ vật nuôi trong nhà — thời mà đàn gia súc chính là tài
                  sản lớn của một gia đình. Đọc bốn cái tên này như{' '}
                  {strong('cách dân gian phân loại')}, không phải dự báo điều sẽ xảy ra.
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
                  Bốn nhãn phủ trọn bốn mối bận tâm của một gia đình truyền thống: bản thân người
                  cưới, bạn đời, con cái, và của cải. Không có tài liệu truyền lại nào giải thích{' '}
                  {strong('vì sao dư 1 lại là Thân mà không phải Tử')} — thứ tự này được truyền theo
                  quy ước, không kèm lập luận.
                </p>
                <p>
                  Vì vậy đừng đọc bốn tên gọi như bốn chẩn đoán khác nhau về mức nặng nhẹ. Trong công
                  cụ, cả bốn đều dẫn tới cùng một kết luận: {strong('“phạm — nên cân nhắc”')}, và cách
                  xử lý cũng như nhau (cân nhắc năm khác nếu bạn muốn theo tục).
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="kim-lau"
        concept="Vì sao tục cưới hỏi Việt chủ yếu xét tuổi cô dâu"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Trong tục cưới hỏi xưa, khi tính Kim Lâu người ta {strong('đếm tuổi cô dâu')}, chứ
                không đếm tuổi chú rể. Đó là {strong('luật của trò chơi')} mà người xưa đặt ra — giống
                như mỗi trò có luật riêng, không phải vì cô dâu quan trọng hơn hay yếu hơn ai cả.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Theo tục cưới hỏi truyền thống, Kim Lâu {strong('xét chủ yếu tuổi mụ của cô dâu')}.
                  Công cụ /kim-lau vì thế chỉ hỏi một ô: năm sinh cô dâu.
                </p>
                <p>
                  Nói cho rõ: đây là một {strong('nét phong tục')}, không phải kết luận về ai quan
                  trọng hơn ai trong hôn nhân. Bạn hoàn toàn có thể coi đó là một thông tin tham khảo
                  bên cạnh nhiều yếu tố thực tế khác khi chọn ngày cưới — tài chính, công việc, sức
                  khoẻ, lịch của hai họ.
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
                  Điểm cần trung thực: các bản truyền lại{' '}
                  {strong('không ghi lý do gốc')} vì sao Kim Lâu chỉ xét một phía. hieu.asia giữ đúng
                  quy ước truyền thống để bạn tra cứu được phong tục, đồng thời nói thẳng đây là{' '}
                  {strong('quy ước văn hoá, không phải quy luật tự nhiên')} — không có cơ sở nào khiến
                  năm sinh của một người tự nó quyết định hôn nhân của hai người.
                </p>
                <p>
                  Thực hành: nếu gia đình bạn có thói quen xét cả tuổi chú rể, đó là biến thể vùng
                  miền — cứ ghi nhận, nhưng đừng nhầm nó với cách tính trong công cụ này. Công cụ tính
                  đúng một quy ước và nói rõ mình đang tính quy ước nào, để bạn không phải nhận một
                  kết quả “hộp đen”.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="kim-lau"
        concept="Vì sao hạn này lặp lại đúng chu kỳ 9 năm"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi năm bạn bước một ô trên vòng tròn 9 ô. Đi đủ {strong('9 bước')} là về đúng ô cũ.
                Nên nếu năm nay rơi vào ô “cân nhắc”, thì 9 năm nữa lại rơi đúng ô đó — không sớm hơn,
                không muộn hơn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi năm trôi qua, tuổi mụ tăng đúng 1, nên số dư khi chia 9 cũng tăng 1 rồi quay về
                  0 sau mỗi 9 năm. Số dư lặp lại thì kết luận cũng lặp lại:{' '}
                  {strong('cùng một cô dâu, cứ 9 năm lại gặp đúng loại Kim Lâu cũ')}.
                </p>
                <p>
                  Trong mỗi 9 năm liên tiếp luôn có đúng {strong('4 năm phạm')} (dư 1, 3, 6, 8) và{' '}
                  {strong('5 năm không phạm')} (dư 0, 2, 4, 5, 7). Nghĩa là năm “thuận” theo tục lệ
                  không hề hiếm — quá nửa số năm là không phạm.
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
                  Đây là số học thuần tuý: hàm số dư theo modulo 9 có{' '}
                  {strong('chu kỳ đúng bằng 9')}. Cô dâu sinh 1999 phạm Kim Lâu Thân ở năm 2026 (tuổi
                  mụ 28, dư 1); cộng 9 năm ra 2035 (tuổi mụ 37, dư 1) — vẫn Kim Lâu Thân. Không cần
                  tra bảng, chỉ cần cộng 9.
                </p>
                <p>
                  Hệ quả thực hành rất nhẹ nhõm: vì các năm phạm nằm rải trong chu kỳ 9 năm,{' '}
                  {strong('năm không phạm gần nhất thường chỉ cách 1–2 năm')}. Không có ai “phạm Kim
                  Lâu suốt đời”, cũng không có tình huống phải hoãn cưới vô thời hạn.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="kim-lau"
        concept="Tuổi mụ — chỗ sai phổ biến nhất khi tra tay"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                {strong('Tuổi mụ')} là cách đếm tuổi của ông bà mình: em bé vừa chào đời đã được tính
                1 tuổi. Vì vậy tuổi mụ thường lớn hơn tuổi ghi trên giấy khai sinh một chút. Kim Lâu
                đếm theo kiểu này.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Công thức trong công cụ: {strong('tuổi mụ = năm định cưới − năm sinh + 1')}. Cô dâu
                  sinh 2000, xét năm 2026 thì tuổi mụ là 27 — dù tuổi dương mới 26.
                </p>
                <p>
                  Nhập nhầm tuổi dương là lệch nguyên một bậc trong vòng 9 ô, và kết luận có thể đảo
                  ngược hoàn toàn. Ví dụ tuổi mụ 27 dư 0 → không phạm, nhưng 28 dư 1 → phạm Kim Lâu
                  Thân. {strong('Chênh một tuổi là đổi kết luận.')}
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
                  Cần phân biệt hai bước dễ bị gộp: (1) đổi năm sinh → tuổi mụ, (2) tuổi mụ → số dư.
                  Sai ở bước 1 thì bước 2 dù đúng vẫn ra kết quả sai. Khi kết quả tra tay lệch với
                  công cụ, {strong('hãy kiểm bước tính tuổi mụ trước')} — đó gần như luôn là nguyên
                  nhân.
                </p>
                <p>
                  Một lưu ý về ranh giới năm: công cụ tính theo{' '}
                  {strong('năm sinh dương lịch')} bạn nhập (chấp nhận 1900–2100), tức lấy trọn năm để
                  quy ra tuổi mụ. Với người sinh sát Tết, các gia đình xưa có thể quy tuổi âm khác một
                  chút — nếu nhà bạn theo cách ấy, cứ tra thêm năm liền kề để xem kết luận có đổi
                  không, thay vì tranh cãi con số.
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
    prompt: 'Muốn xét Kim Lâu, bạn cần đúng hai dữ kiện nào — và làm gì với chúng?',
    answer: (
      <>
        Cần {strong('năm sinh của cô dâu')} và {strong('năm định cưới')}. Lấy tuổi mụ = năm định cưới
        − năm sinh + 1, rồi chia 9 giữ phần dư. Dư rơi vào 1, 3, 6 hoặc 8 thì gọi là phạm Kim Lâu;
        các số dư còn lại là không phạm.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Những số dư nào (tuổi mụ chia 9) bị coi là phạm Kim Lâu?',
    choices: [
      {
        text: '1, 3, 6 và 8',
        correct: true,
        note: 'Đúng — đúng bốn số dư này, ứng với 4 loại Kim Lâu Thân / Thê / Tử / Lục Súc.',
      },
      { text: '2, 4, 5 và 7', note: 'Ngược lại — đây là các số dư KHÔNG phạm.' },
      {
        text: 'Mọi số dư lẻ (1, 3, 5, 7)',
        note: 'Không — 5 và 7 không phạm, còn 6 và 8 là số chẵn nhưng lại phạm.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Tuổi mụ chia 9 dư 6 thì ứng với loại Kim Lâu nào?',
    choices: [
      { text: 'Kim Lâu Thân', note: 'Không — Thân ứng với số dư 1 (lo ảnh hưởng chính bản thân).' },
      {
        text: 'Kim Lâu Tử',
        correct: true,
        note: 'Đúng — dư 6 là Kim Lâu Tử, kiêng vì lo ảnh hưởng đường con cái.',
      },
      {
        text: 'Kim Lâu Lục Súc',
        note: 'Không — Lục Súc ứng với số dư 8 (lo ảnh hưởng tài sản, vật nuôi).',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Cô dâu có tuổi mụ 27 trong năm định cưới. Kết luận là gì?',
    choices: [
      {
        text: 'Không phạm — vì 27 chia 9 dư 0, mà 0 không nằm trong nhóm 1/3/6/8',
        correct: true,
        note: 'Đúng — dư 0 là không phạm. Tuổi mụ 9, 18, 27, 36, 45 đều rơi vào trường hợp này.',
      },
      {
        text: 'Phạm — vì 27 chia hết cho 9',
        note: 'Không — chia hết nghĩa là dư 0, và dư 0 không thuộc nhóm phạm. Đây là chỗ hay nhầm nhất.',
      },
      {
        text: 'Không xác định được nếu chưa biết tuổi chú rể',
        note: 'Không — theo tục, Kim Lâu xét chủ yếu tuổi mụ của cô dâu.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: 'Vì sao Kim Lâu lặp lại đúng theo chu kỳ 9 năm?',
    answer: (
      <>
        Vì mỗi năm tuổi mụ tăng đúng 1, nên {strong('số dư khi chia 9 chạy vòng 0 → 8 rồi quay lại')}.
        Sau đúng 9 năm, số dư trở về giá trị cũ nên kết luận cũng lặp lại — kể cả tên loại Kim Lâu.
        Trong mỗi 9 năm luôn có 4 năm phạm và 5 năm không phạm.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: '“Phạm Kim Lâu” nên được hiểu như thế nào?',
    choices: [
      {
        text: 'Là điều cấm — không được cưới, phải làm lễ giải hạn mới yên',
        note: 'Không — Kim Lâu là tục lệ tham khảo, không phải lệnh cấm; hieu.asia không bán lễ “giải hạn”.',
      },
      {
        text: 'Là lời nhắc cân nhắc theo phong tục; muốn theo tục thì cách nhẹ nhàng nhất là chọn năm cô dâu không phạm',
        correct: true,
        note: 'Đúng — công cụ liệt kê sẵn các năm tới để bạn tự quyết.',
      },
      {
        text: 'Là dự báo chắc chắn về chuyện sẽ xảy ra với gia đình',
        note: 'Không — bốn tên gọi chỉ là cách dân gian phân loại, không phải dự báo.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vận dụng: cô dâu sinh 1999. Xét năm 2026 và năm 2027, năm nào phạm Kim Lâu và phạm loại gì?',
    answer: (
      <>
        Năm 2026: tuổi mụ = 2026 − 1999 + 1 = {strong('28')}, chia 9 dư 1 → phạm{' '}
        {strong('Kim Lâu Thân')}. Năm 2027: tuổi mụ = {strong('29')}, chia 9 dư 2 →{' '}
        {strong('không phạm')}. Chỉ cần lùi/đẩy một năm là kết luận đã đổi — đó là lý do không cần
        hoãn cưới vô thời hạn.
      </>
    ),
  },
];

export function KimLauRecall() {
  return <ActiveRecall topicId="kim-lau" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Kim Lâu dùng để làm gì (một lời nhắc theo phong tục khi chọn năm cưới) — và nó KHÔNG hứa gì (không cấm cưới, không dự báo điều sẽ xảy ra).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Tính được từ đầu đến cuối: tuổi mụ = năm định cưới − năm sinh + 1 → chia 9 lấy dư → dư 1/3/6/8 là phạm.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể đúng 4 loại Kim Lâu theo số dư: 1 Thân, 3 Thê, 6 Tử, 8 Lục Súc — kèm điều dân gian lo ở mỗi loại.',
  },
  {
    id: 'cycle',
    facet: 'Chu kỳ',
    can: 'Giải thích vì sao hạn này lặp lại đúng 9 năm, và vì sao trong mỗi 9 năm luôn có 4 năm phạm, 5 năm không phạm.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói được vì sao tục cưới hỏi xét chủ yếu tuổi mụ của cô dâu, và vì sao đó là quy ước văn hoá chứ không phải quy luật tự nhiên.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra Kim Lâu chỉ dùng năm sinh và năm cưới nên rất thô, và nó không nói gì về các cách xem tuổi cưới khác.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nhớ rằng số dư 0 (tuổi mụ 9, 18, 27…) KHÔNG phạm, và nhầm tuổi dương với tuổi mụ sẽ lệch nguyên một bậc.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người thân trong một phút: Kim Lâu tính thế nào, phạm thì nên làm gì — giữ giọng tham khảo, không hù doạ.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Nói được phần nào bạn vẫn thấy mơ hồ (vd vì sao lại là 9, vì sao chọn đúng bốn số dư ấy) — và chấp nhận rằng tài liệu truyền lại không giải thích.',
  },
];

export function KimLauChecklist() {
  return <UnderstandingChecklist topicId="kim-lau" facets={FACETS} />;
}

export function KimLauWhys() {
  return (
    <FiveWhys
      topicId="kim-lau"
      start={
        <>
          Một cặp đôi định cưới năm sau. Tra thử thì thấy cô dâu “phạm Kim Lâu”, cả nhà hoang mang:
          người bảo hoãn cưới, người bảo đi tìm thầy làm lễ “giải hạn” cho yên tâm.
        </>
      }
      chain={[
        {
          question: 'Vì sao hoảng lên rồi tính chuyện hoãn cưới hay mua lễ giải hạn là phản ứng vội?',
          because: (
            <>
              Vì “phạm Kim Lâu” là {strong('lời nhắc cân nhắc theo phong tục')}, không phải điều cấm
              và không phải lời phán số mệnh.
            </>
          ),
        },
        {
          question: 'Vì sao nó chỉ là lời nhắc chứ không phải một kết luận nặng nề?',
          because: (
            <>
              Vì kết luận ấy sinh ra từ một phép tính rất gọn:{' '}
              {strong('tuổi mụ của cô dâu chia 9, xem số dư có phải 1, 3, 6 hay 8 không')} — chỉ vậy
              thôi.
            </>
          ),
        },
        {
          question: 'Vì sao một phép tính như thế lại không đủ để phán về một cuộc hôn nhân?',
          because: (
            <>
              Vì nó chỉ dùng {strong('năm sinh và năm cưới')} — chia mọi cô dâu trên đời vào vỏn vẹn 9
              nhóm, trong đó 4 nhóm bị gọi là phạm. Một phép chia không biết gì về hai con người cụ
              thể.
            </>
          ),
        },
        {
          question: 'Vậy vì sao quy ước thô như vậy vẫn được truyền lại tới hôm nay?',
          because: (
            <>
              Vì giá trị của nó là {strong('văn hoá')}, không phải dự báo: bốn tên gọi Thân – Thê – Tử
              – Lục Súc gói lại bốn mối bận tâm của một gia đình. Các bản truyền lại{' '}
              {strong('không ghi lý do gốc')} vì sao là 9 và vì sao là bốn số dư ấy.
            </>
          ),
        },
        {
          question: 'Hiểu tới đây thì nên phản ứng thế nào cho đúng?',
          because: (
            <>
              Nếu muốn theo tục, cách nhẹ nhàng nhất là{' '}
              {strong('chọn một năm cô dâu không phạm')} — trong mỗi 9 năm luôn có 5 năm như vậy, nên
              năm gần nhất thường chỉ cách 1–2 năm. Không cần hoãn vô thời hạn, càng không cần tốn
              tiền “giải” một phép chia.
            </>
          ),
        },
      ]}
      root={
        <>
          Kim Lâu là một quy ước cưới hỏi để nhắc nhau cân nhắc, không phải bản án. Hiểu đúng phép
          tính rồi thì bạn giữ được cả hai điều: tôn trọng phong tục của gia đình và{' '}
          {strong('tự quyết trong hiểu biết')} — tham khảo, không phán định.
        </>
      }
    />
  );
}
