/**
 * Nội dung "học chủ động" cho trang /learn/huyen-khong-phi-tinh.
 *
 * GROUNDING (không thêm dữ kiện mới): src/lib/phi-tinh.ts — tam nguyên cửu vận
 * (yunOfYear, mỗi vận 20 năm, 1864–2043), 24 sơn × 15° + tam nguyên long + âm–dương
 * (MOUNTAINS), 9 cung Lạc Thư (PALACES), phi thuận/nghịch (flyPlate), thứ tự an bàn
 * vận → sơn → hướng (computeFlyingStarChart), 4 cách cục + Ngũ vận. src/lib/
 * phi-tinh.test.ts — Bát vận tọa Sửu hướng Mùi = Vượng sơn Vượng hướng; vận
 * 2,3,4,6,7,8 chia đều 6/6/6/6; vận 1 và 9 KHÔNG có Vượng sơn Vượng hướng / Thượng
 * sơn Hạ thủy; vận 5 đặc biệt. /phi-tinh + PhiTinhChecker — cách đọc ba tầng số,
 * bản chất 9 sao, "an bàn là số liệu xác định, luận giải là xu hướng tham khảo,
 * cần phối loan đầu", "chỉ làm Hạ Quái, không làm Thế quái vì các phái bất đồng".
 *
 * Giữ giọng "tham khảo, không phán định — không hù doạ, không bán hoá giải".
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

const TOPIC = 'huyen-khong-phi-tinh';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

export function PhiTinhFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn có một ngôi nhà cụ thể và muốn biết {strong('nên dùng góc nào cho việc gì')} — chỗ nào
          hợp làm phòng làm việc, chỗ nào hợp nghỉ ngơi — theo một hệ quy tắc rõ ràng thay vì cảm
          tính hay lời đồn.
        </>
      }
      why={
        <>
          Huyền Không Phi Tinh tồn tại vì nó đưa được {strong('thời gian')} vào phong thủy: khí của
          một ngôi nhà được xem là đổi theo chu kỳ {strong('20 năm mỗi vận')}. Đây là trường phái
          hiếm hoi thừa nhận rằng một kết luận phong thủy có tuổi thọ, chứ không đúng mãi mãi.
        </>
      }
      what={
        <>
          Một {strong('tinh bàn 9 cung')}, mỗi cung ba số: {strong('vận tinh')} (khí của nguyên vận),{' '}
          {strong('sơn tinh')} (chủ người, sức khỏe) và {strong('hướng tinh')} (chủ tài lộc, cơ hội).{' '}
          {strong('Không phải')} lời phán số mệnh, và cũng không dùng tới năm sinh của bạn.
        </>
      }
      how={
        <>
          Hai dữ kiện đầu vào: {strong('nguyên vận')} (nhà thành hình vào vận nào) và{' '}
          {strong('tọa – hướng')} đo chính xác tới 1 trong 24 sơn, mỗi sơn 15°. Từ đó an lần lượt
          bàn vận, bàn sơn, bàn hướng — mỗi bàn có chiều bay thuận hoặc nghịch riêng.
        </>
      }
      soWhat={
        <>
          Để đọc được tấm bản đồ khí của ngôi nhà theo quy ước cổ và bố trí{' '}
          {strong('những thứ dịch chuyển được')} (bàn làm việc, giường, chỗ sinh hoạt). Không phải để
          đập tường, đổi cửa hay mua vật phẩm hóa giải.
        </>
      }
    />
  );
}

export function PhiTinhDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId={TOPIC}
        concept="Vì sao Huyền Không phải đưa thời gian vào công thức"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy tưởng tượng ngôi nhà như một cái sân chơi. Buổi sáng nắng chiếu góc này, buổi
                chiều nắng chuyển sang góc kia — {strong('chỗ đẹp nhất không cố định')}. Huyền Không
                cũng nghĩ vậy về ngôi nhà, chỉ khác là "buổi sáng" của nó dài tận 20 năm.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Thời gian được chia thành {strong('9 vận, mỗi vận 20 năm')}; ba vận gộp thành một
                  nguyên 60 năm, ba nguyên khép lại một vòng {strong('180 năm')} — nên mới gọi là
                  tam nguyên cửu vận.
                </p>
                <p>
                  Mỗi vận có một {strong('sao đương vận')} riêng. Giai đoạn 2004–2023 là Bát vận nên
                  sao số 8 vượng; từ 2024 đã sang Cửu vận nên sao số 9 mới là sao đương vận. Rất
                  nhiều bài viết phong thủy trên mạng vẫn nói "số 8 là tài tinh" — câu đó đúng cho
                  vận trước, không còn đúng cho hôm nay.
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
                  Vòng 180 năm mà công cụ phủ là {strong('1864–2043')}, chia đúng 9 khoảng 20 năm.
                  Nguyên vận của một trạch được lấy tại thời điểm ngôi nhà thành hình (năm xây xong
                  hoặc lần sửa lớn gần nhất), không phải năm chủ nhà dọn vào.
                </p>
                <p>
                  Chính chỗ này là một trong những điểm {strong('các phái bất đồng')}: thế nào là
                  "sửa lớn" đủ để đổi vận thì mỗi sách một chuẩn. Cách xử lý minh bạch nhất khi
                  không chắc là lập cả hai bàn — theo vận xây và theo vận hiện tại — rồi đọc như hai
                  góc nhìn, thay vì tin tuyệt đối vào một bàn.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId={TOPIC}
        concept="Ba con số trong một cung: vận tinh – sơn tinh – hướng tinh"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi ô trong bảng có ba con số, giống như ba bạn nhỏ đứng chung một ô. Bạn ở giữa nói
                về {strong('thời gian')}, bạn góc trái nói về {strong('người')}, bạn góc phải nói về{' '}
                {strong('tiền')}. Muốn hiểu ô đó thì phải nghe cả ba, không chỉ nghe một bạn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Vận tinh')} nằm giữa ô, là khí của nguyên vận tại cung đó — an trước
                  tiên. {strong('Sơn tinh')} ở góc trái, chủ về người, sức khỏe, nhân đinh.{' '}
                  {strong('Hướng tinh')} ở góc phải, chủ về tài lộc, cơ hội.
                </p>
                <p>
                  Chữ "sơn" và "hướng" ở đây không có nghĩa là núi hay phương hướng của cung đó. Nó
                  ghi nhớ {strong('nguồn gốc')} của con số: bàn sơn sinh ra từ cung tọa, bàn hướng
                  sinh ra từ cung hướng của ngôi nhà.
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
                  Thứ tự an bàn là một chuỗi có phụ thuộc: số vận nhập trung bay thuận ra{' '}
                  {strong('bàn vận')}; lấy con số của bàn vận đang nằm ở {strong('cung tọa')} nhập
                  trung → bàn sơn; lấy con số ở {strong('cung hướng')} nhập trung → bàn hướng. Sai
                  bàn vận thì hai bàn sau sai theo toàn bộ.
                </p>
                <p>
                  Vì vậy, đọc một cung không bao giờ nên chỉ nhìn một số. Cặp{' '}
                  {strong('sơn – hướng')} tại mỗi cung mới là thứ gợi ý nên dùng không gian ấy ra
                  sao, còn vận tinh cho biết cung đó đang được khí của thời kỳ nào. Toàn bộ lớp ý
                  nghĩa này là quy ước cổ điển — tham khảo, không phải phán định.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId={TOPIC}
        concept="Vì sao có bàn bay thuận, có bàn bay nghịch"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Chín con số đi vòng quanh chín ô theo một {strong('lối đi cố định')}, giống trò chơi
                cá ngựa. Có ván các số đi xuôi theo lối ấy, có ván đi ngược lại. Đi xuôi hay đi ngược
                là do một {strong('cái nhãn')} dán sẵn trên hướng nhà quyết định, không phải do ai
                thích chọn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Vòng la bàn 360° chia thành {strong('24 sơn, mỗi sơn 15°')}. Ba sơn liền nhau
                  thuộc cùng một quái và mang ba {strong('tam nguyên long')} khác nhau: Địa nguyên,
                  Thiên nguyên, Nhân nguyên. Mỗi sơn được gán sẵn {strong('Âm')} hoặc{' '}
                  {strong('Dương')} theo quy ước Huyền Không.
                </p>
                <p>
                  Quy tắc gọn: khi một con số nhập trung cung, người ta tra sơn cùng tam nguyên long
                  trong quái ứng với số đó. Sơn ấy {strong('Dương thì bay thuận')}, {strong('Âm thì bay nghịch')}.
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
                  Hai hệ quả đáng nhớ. Thứ nhất, {strong('bàn sơn và bàn hướng có thể bay ngược chiều nhau')}{' '}
                  vì chúng tra hai sơn khác nhau (tọa và hướng). Thứ hai, số{' '}
                  {strong('5 nhập trung là ngoại lệ')}: 5 nằm ở trung cung Lạc Thư và không ứng quái
                  nào, nên phải mượn âm dương của chính sơn tọa hoặc sơn hướng đang xét.
                </p>
                <p>
                  Đây cũng là lý do hai ngôi nhà cạnh nhau, chỉ lệch nhau một sơn (15°), có thể ra
                  hai tinh bàn khác hẳn: đổi sơn là có thể đổi cả tam nguyên long lẫn âm dương, tức
                  đổi luôn chiều bay của cả một bàn.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId={TOPIC}
        concept="Vượng sơn Vượng hướng thật ra nói điều gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Trong chín con số có một số đang là {strong('số mạnh nhất của thời kỳ này')}. Nếu số
                mạnh ấy tình cờ đứng đúng hai chỗ quan trọng — phía lưng nhà và phía mặt nhà — thì
                người xưa gọi đó là thế đẹp. Chỉ vậy thôi, không có gì huyền bí.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Vượng sơn Vượng hướng')} nghĩa là sơn tinh đương vận rơi vào cung tọa
                  (chủ người) và hướng tinh đương vận rơi vào cung hướng (chủ của). Ví dụ kinh điển:
                  Bát vận, tọa Sửu hướng Mùi.
                </p>
                <p>
                  Nhưng tên cách cục mới là một nửa. Lý thuyết cổ đòi thêm điều kiện{' '}
                  {strong('tọa thực hướng không')}: phía sau nhà cao và vững, phía trước thoáng.
                  Không có địa hình phù hợp thì cái tên đẹp cũng không tự phát huy.
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
                  Bốn cách cục chính là {strong('Vượng sơn Vượng hướng')},{' '}
                  {strong('Thượng sơn Hạ thủy')} (hai sao đương vận đảo vị),{' '}
                  {strong('Song tinh đáo hướng')} và {strong('Song tinh đáo tọa')}. Chạy đủ 9 vận ×
                  24 sơn cho thấy các vận 2, 3, 4, 6, 7, 8 chia đều 6 – 6 – 6 – 6.
                </p>
                <p>
                  Điều ít được nói: ở {strong('Nhất vận và Cửu vận')} — tức cả giai đoạn 2024–2043 —
                  không có sơn nào cho ra Vượng sơn Vượng hướng, cũng không có Thượng sơn Hạ thủy;
                  toàn bộ chia đôi thành 12 song tinh đáo hướng và 12 song tinh đáo tọa. Riêng Ngũ
                  vận không có chính quái nên được xếp riêng. Ai chào bán "nhà Vượng sơn Vượng
                  hướng cho Cửu vận" thì con số đó không đến từ phép Hạ Quái tiêu chuẩn.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId={TOPIC}
        concept="Vì sao đo lệch một chút là hỏng cả tinh bàn"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Vòng tròn hướng nhà được cắt thành 24 miếng bánh nhỏ. Nếu bạn chỉ nhầm sang{' '}
                {strong('miếng bên cạnh')}, cả bảng số sẽ được vẽ lại theo kiểu khác. Nên bước đo là
                bước phải làm cẩn thận nhất.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi sơn chỉ rộng {strong('15°')}. La bàn điện thoại lệch vài độ, đứng gần cột
                  thép, tủ lạnh hay xe máy, hoặc nhầm mép cửa với mặt tiền toàn khối — đều đủ để rơi
                  sang sơn kế bên.
                </p>
                <p>
                  Và nhớ đúng định nghĩa: {strong('sơn tọa là hướng lưng nhà quay về')}, còn hướng
                  nhà là phía đối diện, cộng 180°. Nhập nhầm hai thứ này là lập ra tinh bàn của một
                  ngôi nhà khác.
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
                  Rủi ro lớn nhất của Phi Tinh không nằm ở thuật toán mà ở{' '}
                  {strong('chất lượng dữ liệu đầu vào')}. Bàn tính đúng trên số đo sai vẫn là kết
                  quả sai, và nó vẫn trông rất thuyết phục vì đầy con số.
                </p>
                <p>
                  Khi số đo rơi sát ranh hai sơn, một số phái chuyển sang phép{' '}
                  {strong('Thế quái (kiêm hướng)')} thay vì Hạ Quái. Khẩu quyết Thế quái giữa các
                  phái chưa thống nhất, nên hieu.asia chỉ dựng Hạ Quái tiêu chuẩn và nói rõ giới hạn
                  — thà thiếu còn hơn bịa một con số không kiểm chứng được.
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
    prompt: 'Để lập một tinh bàn Phi Tinh, cần đúng hai dữ kiện nào?',
    answer: (
      <>
        {strong('Nguyên vận')} (ngôi nhà thành hình vào vận nào — suy từ năm xây hoặc lần sửa lớn
        gần nhất) và {strong('tọa – hướng')} của ngôi nhà, đo chính xác tới 1 trong 24 sơn (mỗi sơn
        15°). Đáng chú ý: {strong('không dùng năm sinh')} của chủ nhà — đó là dữ kiện của Bát Trạch,
        không phải Phi Tinh.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Trong một cung, sơn tinh và hướng tinh chủ về điều gì?',
    choices: [
      {
        text: 'Sơn tinh chủ người – sức khỏe – nhân đinh; hướng tinh chủ tài lộc – cơ hội',
        correct: true,
        note: 'Đúng — còn vận tinh ở giữa là khí của nguyên vận tại cung đó.',
      },
      {
        text: 'Sơn tinh chủ phía sau nhà; hướng tinh chủ phía trước nhà',
        note: 'Không — tên gọi ghi nhớ nguồn gốc con số (từ cung tọa và cung hướng), không phải vị trí trong cung.',
      },
      {
        text: 'Sơn tinh chủ nam giới; hướng tinh chủ nữ giới',
        note: 'Không — Phi Tinh không phân theo giới tính người ở.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Điều gì quyết định một bàn bay thuận hay bay nghịch?',
    choices: [
      {
        text: 'Số vận chẵn thì thuận, lẻ thì nghịch',
        note: 'Không — chiều bay không liên quan tới tính chẵn lẻ của số vận.',
      },
      {
        text: 'Âm – dương Huyền Không của sơn cùng tam nguyên long với tọa (hoặc hướng): Dương thì thuận, Âm thì nghịch',
        correct: true,
        note: 'Đúng — và khi số 5 nhập trung (không ứng quái nào) thì mượn âm dương của chính sơn tọa hoặc sơn hướng.',
      },
      {
        text: 'Giới tính của gia chủ',
        note: 'Không — Phi Tinh hoàn toàn không dùng dữ kiện của người ở.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Cách cục Vượng sơn Vượng hướng nghĩa là gì?',
    choices: [
      {
        text: 'Nhà có nhiều sao tốt nhất trong 9 cung',
        note: 'Không — cách cục chỉ xét vị trí của sao đương vận tại hai cung tọa và hướng.',
      },
      {
        text: 'Sơn tinh đương vận tới cung tọa và hướng tinh đương vận tới cung hướng',
        correct: true,
        note: 'Đúng — và vẫn cần phối địa hình "tọa thực hướng không" thì theo lý thuyết cổ mới phát huy.',
      },
      {
        text: 'Nhà quay đúng về hướng Nam',
        note: 'Không — cách cục không gắn với một phương vị cố định nào.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt:
      'Ở Cửu vận (2024–2043), trong 24 sơn có bao nhiêu sơn cho ra cách cục Vượng sơn Vượng hướng?',
    choices: [
      {
        text: '6 sơn, giống các vận khác',
        note: 'Không — phân bố 6/6/6/6 chỉ đúng với các vận 2, 3, 4, 6, 7, 8.',
      },
      {
        text: 'Không sơn nào — Cửu vận (và Nhất vận) chỉ có song tinh đáo hướng hoặc đáo tọa',
        correct: true,
        note: 'Đúng — 12 sơn đáo hướng và 12 sơn đáo tọa; người xưa ghi nhận "nhất vận, cửu vận không có cục Vượng sơn Vượng hướng".',
      },
      {
        text: '24 sơn, vì Cửu vận là vận mạnh nhất',
        note: 'Không — không có vận nào cho toàn bộ 24 sơn cùng một cách cục, trừ Ngũ vận (trường hợp đặc biệt).',
      },
    ],
  },
  {
    id: 'q6',
    type: 'open',
    prompt:
      'Vận dụng: cùng một ngôi nhà không sửa gì, vì sao tinh bàn ở Bát vận và ở Cửu vận lại khác nhau?',
    answer: (
      <>
        Vì {strong('số nhập trung cung của bàn vận đổi')} theo nguyên vận (8 rồi tới 9). Bàn vận đổi
        kéo theo con số tại cung tọa và cung hướng đổi, nên tâm của bàn sơn và bàn hướng cũng đổi —
        thậm chí chiều bay thuận/nghịch có thể đảo. Kết quả là cả ba tầng số và cả tên cách cục đều
        có thể khác. Đó chính là ý "phong thủy theo thời gian" của Huyền Không.
      </>
    ),
  },
  {
    id: 'q7',
    type: 'open',
    prompt: 'Nói trong hai câu: Phi Tinh khác Bát Trạch ở chỗ nào?',
    answer: (
      <>
        Bát Trạch xét {strong('người')} và {strong('tĩnh')}: từ năm sinh và giới tính ra cung phi,
        kết quả gắn với người, không đổi theo thời gian. Phi Tinh xét {strong('nhà')} và{' '}
        {strong('đổi theo vận')}: dùng tọa – hướng của ngôi nhà cùng nguyên vận 20 năm, không dùng
        năm sinh chủ nhà. Hai hệ trả lời hai câu hỏi khác nhau nên không thay thế nhau.
      </>
    ),
  },
];

export function PhiTinhRecall() {
  return <ActiveRecall topicId={TOPIC} questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Phi Tinh dùng để làm gì (đọc bản đồ khí của một ngôi nhà theo từng vận) và nó KHÔNG hứa gì (không phán số mệnh, không đảm bảo tài lộc).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả đúng thứ tự lập bàn: số vận nhập trung bay thuận ra bàn vận → lấy số ở cung tọa và cung hướng nhập trung → an bàn sơn và bàn hướng.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Chỉ ra ba số trong một cung và vai trò từng số: vận tinh (khí của vận), sơn tinh (người), hướng tinh (tài).',
  },
  {
    id: 'time',
    facet: 'Trục thời gian',
    can: 'Giải thích tam nguyên cửu vận (9 vận × 20 năm = 180 năm), biết hiện đang ở Cửu vận 2024–2043 và vì sao "số 8 là tài tinh" đã hết hạn.',
  },
  {
    id: 'direction',
    facet: 'Thuận / nghịch',
    can: 'Nói được vì sao có bàn bay thuận, có bàn bay nghịch (âm – dương Huyền Không của sơn cùng tam nguyên long) và ngoại lệ số 5 nhập trung.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt rõ Phi Tinh (xét NHÀ, đổi theo vận) với Bát Trạch (xét NGƯỜI, tĩnh cả đời) mà không trộn kết quả hai hệ.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Tách được lớp an bàn (phép tính xác định) khỏi lớp luận giải (quy ước), và biết Phi Tinh mới là lý khí — còn thiếu loan đầu.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Giải thích vì sao Cửu vận không có cục Vượng sơn Vượng hướng, và vì sao không nên đập nhà hay mua hóa giải theo một tinh bàn.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người thân "tinh bàn phi tinh là gì và nên hiểu tới đâu" bằng lời của bạn, giữ giọng tham khảo.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được phần nào (vd cách xác định vận của nhà cũ, quy tắc thuận nghịch, Thế quái) bạn vẫn còn thấy mơ hồ.',
  },
];

export function PhiTinhChecklist() {
  return <UnderstandingChecklist topicId={TOPIC} facets={FACETS} />;
}

export function PhiTinhWhys() {
  return (
    <FiveWhys
      topicId={TOPIC}
      start={
        <>
          Một người lập bàn cho căn nhà mới mua, kết quả hiện ra “Thượng sơn Hạ thủy”. Đọc thấy hai
          chữ bất lợi, họ lo mất ăn mất ngủ, tính chuyện bán lại nhà hoặc tìm mua vật phẩm hóa giải.
        </>
      }
      chain={[
        {
          question: 'Vì sao hoảng lên vì một tên cách cục lại là phản ứng chưa hợp lý?',
          because: (
            <>
              Vì tên cách cục chỉ mô tả {strong('vị trí của hai con số')} trong bàn — nó chưa nói gì
              về ngôi nhà thật đang đứng trên mảnh đất thật.
            </>
          ),
        },
        {
          question: 'Vì sao vị trí hai con số lại chưa nói được gì về ngôi nhà thật?',
          because: (
            <>
              Vì theo chính lý thuyết cổ, cách cục chỉ có nghĩa khi {strong('phối với địa hình')}.
              Thượng sơn Hạ thủy bất lợi khi địa hình cũng ngược (sau thấp trống, trước cao bịt); phối
              đúng thì vẫn hóa giải được bằng bố trí.
            </>
          ),
        },
        {
          question: 'Vì sao phần địa hình lại quyết định tới mức đó?',
          because: (
            <>
              Vì Phi Tinh mới là phần {strong('lý khí')} — một nửa của phong thủy. Nửa còn lại là{' '}
              {strong('loan đầu')} (thế đất, dòng nước, đường đi, nhà xung quanh), nằm ngoài công
              thức và công cụ web không nhìn thấy.
            </>
          ),
        },
        {
          question: 'Vì sao chỉ nắm một nửa mà lớp luận giải vẫn nghe rất thuyết phục?',
          because: (
            <>
              Vì lớp an bàn là {strong('phép tính xác định')}, ai làm cũng ra y hệt — và sự chính xác
              đó dễ khiến người đọc tin luôn lớp luận giải đi kèm, vốn chỉ là{' '}
              {strong('quy ước chưa có bằng chứng khoa học')}.
            </>
          ),
        },
        {
          question: 'Vì sao phân biệt được hai lớp lại đổi cách ta phản ứng?',
          because: (
            <>
              Vì khi biết cái gì chắc và cái gì là quy ước, ta dùng tinh bàn đúng tầm: sắp xếp{' '}
              {strong('những thứ dịch chuyển được')} (bàn làm việc, giường, chỗ sinh hoạt), thay vì
              đập tường, bán nhà hay mua vật phẩm hóa giải.
            </>
          ),
        },
      ]}
      root={
        <>
          Tinh bàn là một tấm bản đồ khí theo quy ước cổ, tính ra bằng công thức minh bạch và{' '}
          {strong('đổi theo từng vận 20 năm')} — nên nó không thể là phán quyết vĩnh viễn về một
          ngôi nhà. Hãy đọc nó như gợi ý bố trí, đối chiếu với địa hình và với những thứ đo được
          (ánh sáng, thông gió, tiếng ồn): {strong('tham khảo, không phán định')}.
        </>
      }
    />
  );
}
