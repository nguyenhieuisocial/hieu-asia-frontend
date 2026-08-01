/**
 * Nội dung "học chủ động" cho trang /learn/bat-trach.
 *
 * GROUNDING: toàn bộ dữ kiện lấy từ chính công cụ /huong-nha và lib/huong-nha.ts
 *   • cungPhi() — cộng dồn chữ số năm sinh dương lịch (sumDigits, rút gọn đệ quy)
 *     rồi tra bảng CUNG_PHI_NAM / CUNG_PHI_NU (nam và nữ hai bảng khác nhau).
 *   • DONG_TU_MENH = Khảm, Ly, Chấn, Tốn — hợp Bắc, Đông, Đông Nam, Nam.
 *     TAY_TU_MENH  = Càn, Khôn, Cấn, Đoài — hợp Đông Bắc, Tây Nam, Tây, Tây Bắc.
 *   • batTrachMap() — thuật toán biến hào du niên; Phục Vị luôn rơi vào hướng tọa
 *     của chính quẻ mệnh; 4 sao tốt xếp Sinh Khí → Thiên Y → Diên Niên → Phục Vị,
 *     4 sao xấu xếp Tuyệt Mệnh → Ngũ Quỷ → Lục Sát → Họa Hại.
 *   • Trang /huong-nha: lưu ý năm âm lịch (sinh trước Tết nhập lùi 1 năm), FAQ
 *     "hướng cửa hay tọa", FAQ vợ chồng khác mệnh, đoạn giới hạn của checker.
 *
 * KHÔNG thêm dữ kiện mới. KHÔNG đi vào ý nghĩa riêng của từng du niên tinh (bài
 * khác) và KHÔNG đụng tới Huyền Không Phi Tinh (bài khác). Giữ giọng "tham khảo,
 * không phán định — không hù doạ, không bán hoá giải".
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

export function BatTrachFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Sắp mua, thuê hay sửa nhà, bạn nghe câu {strong('“nhà này có hợp tuổi không”')} — nhưng
          không ai giải thích được con số đó ở đâu ra, chỉ nói “thầy bảo thế”.
        </>
      }
      why={
        <>
          Bát Trạch tồn tại để trả lời câu đó bằng một {strong('quy tắc tra được')}: ghép mệnh của
          người với hướng của ngôi nhà. Biết cách tính thì bạn tự kiểm chứng được, thay vì phải tin
          một kết quả không giải thích.
        </>
      }
      what={
        <>
          Từ năm sinh và giới tính → {strong('cung phi')} (một trong 8 quẻ) → thuộc{' '}
          {strong('Đông tứ mệnh')} hoặc {strong('Tây tứ mệnh')} → 4 hướng hợp, 4 hướng tránh.{' '}
          {strong('Không phải')} lời phán giàu nghèo, cũng không phải toàn bộ phong thủy.
        </>
      }
      how={
        <>
          Cộng dồn chữ số năm sinh dương lịch tới khi còn một số 1–9, tra bảng{' '}
          {strong('riêng cho nam và nữ')} ra cung phi. Đông tứ mệnh hợp Bắc – Đông – Đông Nam – Nam;
          Tây tứ mệnh hợp Đông Bắc – Tây Nam – Tây – Tây Bắc. {strong('“Mệnh nào trạch nấy.”')}
        </>
      }
      soWhat={
        <>
          Để biết nên xoay {strong('cửa – bếp – giường')} thế nào, và ưu tiên gì khi nhà đã xây
          không đổi được hướng. Đây là hệ quy ước để tham khảo — ánh sáng, thông gió, tiếng ồn mới
          là thứ đo được và nên xét trước.
        </>
      }
    />
  );
}

export function BatTrachDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="bat-trach"
        concept="Vì sao chỉ cần năm sinh và giới tính là ra được “hướng hợp”"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Giống như xếp cả lớp thành {strong('hai đội')} rồi phát cho mỗi đội một góc sân riêng
                để chơi. Muốn biết mình đội nào, chỉ cần nhìn hai thứ: {strong('sinh năm nào')} và{' '}
                {strong('bạn là bạn trai hay bạn gái')}. Biết đội rồi là biết góc sân của mình.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Bát Trạch chỉ nhận đúng hai dữ kiện. Cộng dồn các chữ số của{' '}
                  {strong('năm sinh dương lịch')} cho tới khi còn một số từ 1 đến 9, rồi tra bảng
                  theo {strong('giới tính')} — ra một trong 8 quẻ, gọi là cung phi.
                </p>
                <p>
                  Tám quẻ ấy chia sẵn làm hai nhóm: Đông tứ mệnh (Khảm, Ly, Chấn, Tốn) và Tây tứ mệnh
                  (Càn, Khôn, Cấn, Đoài). Biết mình nhóm nào là biết luôn bốn hướng hợp — không cần
                  đo đạc gì thêm.
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
                  Chính vì đầu vào chỉ có hai biến, không gian kết quả bị nén xuống còn{' '}
                  {strong('8 nhóm')} cho toàn bộ loài người. Hai người sinh cùng năm, cùng giới sẽ
                  nhận bảng hướng y hệt nhau — bất kể nhà ở đâu, tầng mấy, quay ra mặt phố hay mặt
                  hồ. Đó là đặc điểm cấu trúc của hệ, không phải lỗi.
                </p>
                <p>
                  Hệ quả cần nhớ: Bát Trạch là hệ {strong('tĩnh')}, gắn với người và không đổi theo
                  thời gian. Nó cố tình không xét bất kỳ thuộc tính nào của căn nhà ngoài hướng — nên
                  đừng kỳ vọng nó nói được điều gì về thế đất, kết cấu, hay chất lượng sống thực tế
                  của nơi đó.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="bat-trach"
        concept="“Mệnh nào trạch nấy” — Đông tứ và Tây tứ nghĩa là gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bốn hướng {strong('Bắc, Đông, Đông Nam, Nam')} là một nhà; bốn hướng{' '}
                {strong('Đông Bắc, Tây Nam, Tây, Tây Bắc')} là nhà kia. Ai thuộc nhà nào thì chơi ở
                nhà đó cho vui. Chỉ có hai nhà thôi, không có nhà thứ ba.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  “Trạch” là hướng của ngôi nhà, cũng quy về 8 quẻ như mệnh người.{' '}
                  {strong('Đông tứ trạch')} gồm bốn hướng Bắc, Đông, Đông Nam, Nam;{' '}
                  {strong('Tây tứ trạch')} gồm Đông Bắc, Tây Nam, Tây, Tây Bắc.
                </p>
                <p>
                  Nguyên tắc gọn: người Đông tứ mệnh hợp Đông tứ trạch, người Tây tứ mệnh hợp Tây tứ
                  trạch. Bốn hướng cùng nhóm mang toàn sao tốt, bốn hướng nhóm kia thành sao xấu —
                  chia đôi dứt khoát {strong('4 – 4')}, không có vùng xám.
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
                  Cách chia hai nhóm không tùy tiện: bốn hướng Đông tứ nằm liền kề nhau trên la bàn
                  (Bắc → Đông → Đông Nam → Nam), bốn hướng Tây tứ chiếm nửa còn lại. Trong bảng du
                  niên, sao {strong('Phục Vị')} luôn rơi đúng vào hướng tọa của chính quẻ mệnh — nên
                  hướng gốc của bạn bao giờ cũng nằm trong nhóm tốt, không bao giờ rơi vào nhóm xấu.
                </p>
                <p>
                  Điều này cũng giải thích vì sao không thể “nửa hợp nửa không”: thuật toán sinh bảng
                  đảm bảo đúng 4 sao tốt và 4 sao xấu cho mọi cung phi. Nếu ở đâu đó bạn thấy một
                  bảng chia 5 – 3, đó là bảng sai hoặc thuộc trường phái khác hẳn.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="bat-trach"
        concept="Vì sao bốn người khác cung phi lại chung một bộ bốn hướng tốt"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bốn bạn cùng một đội thì chơi chung một góc sân. Nhưng trong góc sân đó, mỗi bạn lại
                thích một {strong('chỗ khác nhau nhất')} — bạn thích gốc cây, bạn thích cái xích đu.
                Cùng góc sân, khác chỗ ruột.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Đúng vậy: người cung Khảm, Ly, Chấn hay Tốn đều hợp cùng bốn hướng Bắc, Đông, Đông
                  Nam, Nam. Vậy biết cung phi cụ thể để làm gì? Để biết{' '}
                  {strong('thứ tự ưu tiên')} bên trong bốn hướng ấy.
                </p>
                <p>
                  Bốn sao tốt xếp hạng giảm dần: Sinh Khí → Thiên Y → Diên Niên → Phục Vị. Cùng nhóm
                  nhưng khác cung phi thì bốn sao này rơi vào bốn hướng theo{' '}
                  {strong('thứ tự khác nhau')} — nên “hướng số 1” của mỗi người mỗi khác.
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
                  Nói chính xác: nhóm mệnh quyết định {strong('tập hợp')} bốn hướng tốt, còn cung phi
                  quyết định {strong('hoán vị')} của bốn sao trên tập hợp đó. Đây là chỗ nhiều bài
                  viết trên mạng nhập nhằng — họ chỉ nói “Đông tứ mệnh hợp 4 hướng Đông” rồi dừng,
                  khiến người đọc tưởng cung phi không có tác dụng gì thêm.
                </p>
                <p>
                  Hệ quả thực hành: nếu bạn chỉ cần biết “căn nhà này có nằm trong nhóm hợp không”
                  thì nhóm mệnh là đủ. Nhưng khi phải chọn {strong('một')} hướng cho cửa chính hoặc
                  đầu giường trong bốn hướng đều tốt, lúc đó thứ tự do cung phi quyết định mới có ý
                  nghĩa.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="bat-trach"
        concept="Vì sao bếp lại đặt ở hướng xấu — “tọa hung, hướng cát”"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bếp là chỗ có {strong('lửa')}. Người xưa nghĩ: đặt lửa lên chỗ xấu để lửa “đè” chỗ
                xấu xuống, nhưng cho {strong('miệng bếp')} quay về chỗ đẹp để đồ ăn nấu ra được ngon
                lành. Nên bếp là món duy nhất làm ngược với mọi thứ khác trong nhà.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Quy tắc gọi là {strong('“tọa hung — hướng cát”')}: <em>đặt</em> bếp ở vùng mang sao
                  xấu, nhưng <em>miệng bếp quay về</em> hướng có sao tốt. Cửa chính và giường thì
                  ngược lại — cả vị trí lẫn hướng đều nhắm vào hướng tốt.
                </p>
                <p>
                  Đây là chỗ rất nhiều người nói nhầm thành “bếp phải đặt ở hướng tốt”. Nhớ được sự
                  khác biệt này là bạn đã đọc Bát Trạch kỹ hơn phần lớn bài viết trên mạng.
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
                  Điểm cần rút ra: trong Bát Trạch, “tốt/xấu” gắn với{' '}
                  {strong('việc gì đặt ở đâu')}, không phải nhãn số phận dán lên một góc nhà. Cùng
                  một hướng mang sao xấu có thể là chỗ tệ để kê giường nhưng lại là chỗ hợp lý cho
                  kho hoặc nhà vệ sinh — những khu vực ít ở.
                </p>
                <p>
                  Vì thế, khi một căn nhà “toàn hướng xấu” với cung phi của bạn, cách xử lý không
                  phải là bỏ nhà, mà là phân bổ lại công năng: dồn phần hướng xấu cho khu vực ít
                  dùng, giữ phần hướng tốt cho chỗ ngủ và chỗ làm việc. Vẫn là{' '}
                  {strong('gợi ý bố trí để tham khảo')}, không phải bảo đảm kết quả.
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
    prompt: 'Cung phi được tính từ những dữ kiện nào, và theo mấy bước?',
    answer: (
      <>
        Từ đúng hai dữ kiện: {strong('năm sinh dương lịch')} và {strong('giới tính')}. Hai bước: (1)
        cộng dồn các chữ số của năm sinh cho tới khi còn một số từ 1 đến 9; (2) tra bảng theo giới
        tính — nam và nữ dùng hai bảng khác nhau — để ra một trong 8 quẻ.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Bốn quẻ nào thuộc Đông tứ mệnh?',
    choices: [
      {
        text: 'Khảm, Ly, Chấn, Tốn',
        correct: true,
        note: 'Đúng — Đông tứ mệnh hợp 4 hướng Bắc, Đông, Đông Nam, Nam.',
      },
      {
        text: 'Càn, Khôn, Cấn, Đoài',
        note: 'Đây là Tây tứ mệnh — hợp Đông Bắc, Tây Nam, Tây, Tây Bắc.',
      },
      {
        text: 'Khảm, Càn, Chấn, Đoài',
        note: 'Không — đây là hỗn hợp hai nhóm; mỗi nhóm gồm đúng 4 quẻ cố định.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Người sinh 1985 có số rút gọn là bao nhiêu, và ra cung phi nào?',
    choices: [
      {
        text: '1 + 9 + 8 + 5 = 23 → 2 + 3 = 5; nam ra Càn (Tây tứ), nữ ra Ly (Đông tứ)',
        correct: true,
        note: 'Đúng — và đây là ví dụ điển hình của cặp vợ chồng cùng tuổi nhưng khác nhóm mệnh.',
      },
      {
        text: '1 + 9 + 8 + 5 = 23; dừng ở 23 rồi tra bảng',
        note: 'Không — phải cộng tiếp tới khi còn một số từ 1 đến 9; bảng chỉ có 9 hàng.',
      },
      {
        text: 'Lấy 1985 chia 9 lấy phần dư',
        note: 'Không — đó là cách tính của hệ khác (vd Kim Lâu, sao hạn). Bát Trạch cộng dồn chữ số.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt:
      'Hai người cùng thuộc Tây tứ mệnh nhưng khác cung phi (một Đoài, một Cấn). Điều gì đúng?',
    choices: [
      {
        text: 'Họ có chung một bộ 4 hướng tốt, chỉ khác thứ tự ưu tiên bên trong 4 hướng đó',
        correct: true,
        note: 'Đúng — nhóm mệnh quyết định tập hợp hướng, cung phi quyết định hướng nào là số 1.',
      },
      {
        text: 'Bộ 4 hướng tốt của họ hoàn toàn khác nhau',
        note: 'Không — mọi người Tây tứ mệnh đều hợp Đông Bắc, Tây Nam, Tây, Tây Bắc.',
      },
      {
        text: 'Cung phi không có tác dụng gì thêm ngoài việc xác định nhóm',
        note: 'Không — cung phi quyết định thứ tự ưu tiên, tức hướng nào nên dành cho cửa, cho giường.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Quy tắc đặt bếp trong Bát Trạch là gì?',
    choices: [
      {
        text: 'Đặt bếp ở vùng có sao xấu, nhưng miệng bếp quay về hướng có sao tốt ("tọa hung — hướng cát")',
        correct: true,
        note: 'Đúng — bếp là ngoại lệ, làm ngược với cửa chính và giường.',
      },
      {
        text: 'Đặt bếp ở hướng tốt nhất, giống cửa chính',
        note: 'Không — đây chính là chỗ hay bị nói nhầm; bếp có quy tắc riêng.',
      },
      {
        text: 'Bếp không nằm trong phạm vi Bát Trạch',
        note: 'Không — cửa chính, bếp và giường là ba thứ được ưu tiên xét nhất.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'open',
    prompt:
      'Vận dụng: nhà bạn đã xây xong, cửa chính rơi vào hướng xấu, không thể đổi. Nên làm gì trước tiên?',
    answer: (
      <>
        Làm những gì {strong('rẻ và đảo ngược được')} trước: xoay hướng giường, hướng bàn làm việc,
        chỗ ngồi ăn — đổi trong một buổi chiều, sai thì xoay lại. Chỉ động tới bếp và cửa khi đằng
        nào cũng cải tạo nhà. Nếu buộc phải chọn trong nhóm hướng xấu, chọn hướng ở cuối danh sách
        nặng dần (Tuyệt Mệnh → Ngũ Quỷ → Lục Sát → Họa Hại), và dồn phần hướng xấu cho khu vực ít ở
        như kho hoặc nhà vệ sinh.
      </>
    ),
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Đâu là cách nói đúng về giới hạn của Bát Trạch?',
    choices: [
      {
        text: 'Là hệ quy ước truyền thống, chưa có bằng chứng khoa học; ánh sáng, thông gió, tiếng ồn mới là thứ đo được',
        correct: true,
        note: 'Đúng — biết quy tắc để tự quyết, không phán giàu nghèo, không cần "hóa giải".',
      },
      {
        text: 'Là quy luật tự nhiên đã được kiểm chứng, nên phải tuân thủ tuyệt đối',
        note: 'Không — không có nghiên cứu nào cho thấy hướng cửa quyết định tài lộc hay sức khỏe.',
      },
      {
        text: 'Hoàn toàn vô nghĩa, không có gì đáng đọc',
        note: 'Cũng không — nhiều lời khuyên cổ điển trùng với yếu tố đo được (nắng, gió), và nó là một phần văn hóa đáng biết.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'open',
    prompt:
      'Vận dụng: bạn sinh sát Tết (tháng 1 dương lịch). Có gì cần cẩn thận khi tra cung phi?',
    answer: (
      <>
        Bảng cung phi cổ điển vốn tính theo {strong('năm âm lịch')}, đổi mốc quanh Tết Nguyên Đán.
        Sinh tháng 1 hoặc tháng 2 dương lịch <em>trước Tết</em> thì thuộc năm âm liền trước, phải{' '}
        {strong('nhập lùi một năm')}. Công cụ nhận năm dương lịch cho nhất quán, nên hãy thử cả hai
        năm rồi tự đối chiếu — đây là chỗ các trường phái tính khác nhau, không phải lỗi.
      </>
    ),
  },
];

export function BatTrachRecall() {
  return <ActiveRecall topicId="bat-trach" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Bát Trạch dùng để làm gì (ghép mệnh của người với hướng của nhà để biết 4 hướng hợp) — và nó KHÔNG hứa gì (không phán giàu nghèo, không bảo đảm kết quả).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Tự tính được cung phi bằng giấy bút: cộng dồn chữ số năm sinh dương lịch → còn một số 1–9 → tra bảng theo giới tính.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể đúng 4 quẻ Đông tứ mệnh (Khảm, Ly, Chấn, Tốn) và 4 quẻ Tây tứ mệnh (Càn, Khôn, Cấn, Đoài), kèm bộ 4 hướng của mỗi nhóm.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói được vì sao 4 người cùng nhóm chung một bộ 4 hướng tốt, và cung phi cụ thể còn quyết định thêm điều gì (thứ tự ưu tiên).',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Phân biệt Bát Trạch (tĩnh, tính theo người) với Huyền Không Phi Tinh (động, tính theo thời gian và tọa – hướng nhà), và biết Loan Đầu nằm ngoài phạm vi công cụ.',
  },
  {
    id: 'application',
    facet: 'Ứng dụng',
    can: 'Nói được nên áp hướng tốt số 1 và số 2 cho những gì (cửa chính, bàn làm việc; giường, bàn ăn) và vì sao bếp lại theo quy tắc ngược “tọa hung — hướng cát”.',
  },
  {
    id: 'tradeoff',
    facet: 'Đánh đổi',
    can: 'Đưa ra được thứ tự ưu tiên khi nhà đã xây không đổi được hướng, và giải thích vì sao không nên bỏ một căn nhà phù hợp chỉ vì hướng.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Chỉ ra 3 chỗ các trường phái bất đồng (hướng cửa hay tọa; năm âm hay năm dương; số 5 quy về quẻ nào) và vì sao điều đó khiến ta không nên đọc Bát Trạch như chân lý.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho người thân “cung phi là gì và nhà hợp hướng nào” bằng lời của bạn, giữ giọng tham khảo, không hù doạ.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được phần nào (vd thứ tự du niên, cách xử lý khi vợ chồng khác nhóm mệnh) bạn vẫn còn thấy mơ hồ.',
  },
];

export function BatTrachChecklist() {
  return <UnderstandingChecklist topicId="bat-trach" facets={FACETS} />;
}

export function BatTrachWhys() {
  return (
    <FiveWhys
      topicId="bat-trach"
      start={
        <>
          Một người tìm được căn hộ vừa ý — vừa túi tiền, gần chỗ làm, phòng ngủ thoáng và yên. Tra
          Bát Trạch thấy cửa chính rơi vào hướng xấu với cung phi của mình, liền định bỏ cọc để tìm
          căn khác “hợp hướng”.
        </>
      }
      chain={[
        {
          question: 'Vì sao bỏ cọc một căn nhà vừa ý chỉ vì hướng lại là quyết định vội?',
          because: (
            <>
              Vì hướng cửa không phải thứ {strong('duy nhất')} — và cũng không phải thứ quan trọng
              nhất — quyết định chất lượng sống trong căn nhà đó.
            </>
          ),
        },
        {
          question: 'Vì sao hướng cửa không phải thứ quan trọng nhất?',
          because: (
            <>
              Vì những thứ ảnh hưởng thật tới sức khỏe và tâm trạng hằng ngày —{' '}
              {strong('ánh sáng, thông gió, tiếng ồn, độ ẩm')} — đều đo được và kiểm chứng được,
              trong khi hướng hợp là một nhãn tra bảng.
            </>
          ),
        },
        {
          question: 'Vì sao “hướng hợp” lại chỉ là một nhãn tra bảng?',
          because: (
            <>
              Vì Bát Trạch chỉ dùng đúng hai dữ kiện là {strong('năm sinh và giới tính')} — chia toàn
              bộ loài người thành 8 nhóm. Nó không biết gì về chính căn hộ đó ngoài một con số hướng.
            </>
          ),
        },
        {
          question: 'Vì sao một hệ thô như vậy vẫn được truyền lại và dùng rộng rãi?',
          because: (
            <>
              Vì nó là {strong('tri thức truyền thống được hệ thống hóa')}: một cách người xưa gói
              kinh nghiệm sắp đặt chỗ ở thành quy tắc dễ nhớ, dễ truyền. Đáng biết như một phần văn
              hóa — nhưng chính những người trong nghề còn bất đồng ở ba điểm gốc (hướng cửa hay tọa;
              năm âm hay năm dương; số 5 quy về quẻ nào).
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên dùng Bát Trạch?',
          because: (
            <>
              Vì đã hiểu nó là {strong('quy ước để tham khảo')} thì cách dùng đúng là: giữ căn nhà
              tốt, rồi xoay những gì xoay được — giường, bàn làm việc, chỗ ngồi ăn. Rẻ, đảo ngược
              được, và không phải đánh đổi thứ gì thật sự quan trọng.
            </>
          ),
        },
      ]}
      root={
        <>
          Bát Trạch là một bảng quy ước để bạn có thêm một góc cân nhắc khi chọn và sắp đặt chỗ ở —
          không phải bản án dán lên một căn nhà. Dùng nó ở bước bố trí nội thất, đừng để nó phủ quyết
          những yếu tố đo được và những ràng buộc thật của đời sống.{' '}
          {strong('Tham khảo, không phán định')} — và không cần “hóa giải” gì cả.
        </>
      }
    />
  );
}
