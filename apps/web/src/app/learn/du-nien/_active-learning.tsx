/**
 * Nội dung "học chủ động" cho trang /learn/du-nien — 8 du niên tinh (bát biến
 * du niên) và cách dùng chúng cho chỗ ngồi làm việc / bàn học.
 *
 * GROUNDING (không có dữ kiện nào ngoài các nguồn này):
 *   • src/lib/huong-nha.ts — STAR_INFO (8 sao: tên, cờ `good`, blurb "hướng này
 *     tốt/xấu cho việc gì"), thuật toán biến hào du niên trong batTrachMap()
 *     (bắt đầu từ quẻ mệnh = Phục Vị, lật hào theo thứ tự [trên, giữa, dưới,
 *     giữa, trên, giữa, dưới] sinh 7 quẻ kế, gán nhãn [Sinh Khí, Ngũ Quỷ, Diên
 *     Niên, Lục Sát, Họa Hại, Thiên Y, Tuyệt Mệnh]), thứ tự xếp hạng GOOD_RANK
 *     (Sinh Khí → Thiên Y → Diên Niên → Phục Vị) và BAD_RANK (Tuyệt Mệnh → Ngũ
 *     Quỷ → Lục Sát → Họa Hại) mà computeHuongNha() dùng để sort.
 *   • src/lib/huong-ban-data.ts — DESK_USE (mỗi cát tinh hợp loại việc gì TRÊN
 *     BÀN), workDir = sao Sinh Khí, studyDir = sao Phục Vị.
 *   • src/app/huong-ban-lam-viec/page.tsx + components/huong-ban/
 *     DeskDirectionChecker.tsx — "xét hướng người ngồi quay MẶT về (hướng
 *     nhìn)"; khi không xoay được bàn thì ưu tiên: bàn đủ sáng, lưng có điểm tựa
 *     (tường), không quay lưng ra cửa/lối đi, màn hình không chói.
 *
 * PHÂN VAI: cách TÍNH cung phi và Đông/Tây tứ mệnh thuộc bài /learn/bat-trach —
 * ở đây chỉ nhắc "bạn cần biết cung phi của mình trước". Không đụng Huyền Không
 * Phi Tinh (/phi-tinh). Giọng: tham khảo, không phán định, không bán "hóa giải".
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

export function DuNienFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn đã biết bốn hướng hợp tuổi mình, nhưng bàn làm việc chỉ quay được về{' '}
          {strong('một hướng')}. Chọn hướng nào trong bốn — và chọn theo tiêu chí gì?
        </>
      }
      why={
        <>
          Vì bốn hướng tốt {strong('không giống nhau')}. Mỗi hướng mang một du niên tinh riêng, mỗi
          sao ứng một loại việc: có sao hợp việc cần bung sức, có sao hợp việc cần ngồi yên. Không
          biết tám du niên thì bảng hướng chỉ còn là bốn ô "tốt" như nhau.
        </>
      }
      what={
        <>
          Tám nhãn gán cho tám hướng của một cung phi: bốn cát tinh{' '}
          {strong('Sinh Khí, Thiên Y, Diên Niên, Phục Vị')} và bốn hung tinh{' '}
          {strong('Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại')}. {strong('Không phải')} thiên thể trên
          trời, cũng không phải lời phán thành bại.
        </>
      }
      how={
        <>
          Từ quẻ mệnh (cung phi), thuật toán {strong('lật từng hào')} sinh ra bảy quẻ kế tiếp; mỗi quẻ
          rơi vào một hướng và nhận một nhãn. Quẻ gốc chưa lật hào nào giữ nhãn{' '}
          {strong('Phục Vị')} — nên hướng tọa của chính bạn luôn là một hướng tốt.
        </>
      }
      soWhat={
        <>
          Để chọn hướng ngồi {strong('theo mục tiêu')}: làm việc quay về Sinh Khí, học và cần tập
          trung quay về Phục Vị, việc nhiều giao tiếp quay về Diên Niên. Và để biết ưu tiên gì khi
          căn phòng không cho xoay bàn.
        </>
      }
    />
  );
}

export function DuNienDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="du-nien"
        concept="Tám cái tên ấy ở đâu ra — du niên được sinh thế nào"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi người có một {strong('hình ba vạch')} của riêng mình. Người xưa lần lượt đổi từng
                vạch để tạo ra bảy hình khác, mỗi hình đứng ở một hướng. Rồi họ đặt cho tám hướng ấy
                tám cái tên — bốn tên dễ chịu, bốn tên nên tránh. Tám cái tên đó gọi là{' '}
                {strong('du niên')}.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Quẻ mệnh của bạn (cung phi) gồm ba hào. Giữ nguyên quẻ gốc, hướng tọa của nó nhận
                  nhãn {strong('Phục Vị')}. Sau đó lật lần lượt từng hào theo một trình tự cố định,
                  mỗi lần lật ra một quẻ mới, quẻ mới nằm ở một hướng mới và nhận nhãn tiếp theo.
                </p>
                <p>
                  Bảy lần lật là đủ phủ kín bảy hướng còn lại. Kết quả luôn là{' '}
                  {strong('4 cát tinh và 4 hung tinh')} — không cung phi nào lệch khỏi tỷ lệ này, vì
                  trình tự lật giống hệt nhau cho cả tám quẻ.
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
                  Trình tự lật là {strong('trên → giữa → dưới → giữa → trên → giữa → dưới')}, gán nhãn
                  lần lượt: Sinh Khí, Ngũ Quỷ, Diên Niên, Lục Sát, Họa Hại, Thiên Y, Tuyệt Mệnh. Đây
                  là thuật toán engine của hieu.asia chạy thật, không phải bảng chép tay — nên bảng
                  hướng trong bài và kết quả công cụ không thể lệch nhau.
                </p>
                <p>
                  Điều cần rút ra để giữ tỉnh táo: du niên {strong('không phải thiên thể')}. Chúng là
                  nhãn do một phép biến đổi trên ba hào sinh ra, rồi được gán vào hướng la bàn. Chữ
                  "tinh" ở đây là cách gọi ước lệ, không có vật thể nào trên trời tương ứng — khác hẳn
                  chín sao Cửu Diệu vốn có bảy thiên thể thật.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="du-nien"
        concept="Chọn hướng ngồi theo mục tiêu, không phải theo “hướng nào tốt nhất”"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bàn để {strong('làm việc')} thì quay về hướng "hăng hái". Bàn để {strong('học bài')}{' '}
                thì quay về hướng "yên tĩnh". Cùng một người, hai loại bàn, hai hướng khác nhau — và
                cả hai đều là hướng tốt.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Bốn cát tinh ứng bốn loại việc khác nhau. {strong('Sinh Khí')} chủ công danh, tài
                  lộc, thăng tiến — hợp bàn làm việc. {strong('Diên Niên')} chủ hòa hợp, quan hệ — hợp
                  công việc phải giao tiếp, gặp đối tác, khách hàng.
                </p>
                <p>
                  {strong('Thiên Y')} chủ sức khỏe và quý nhân nâng đỡ, tính chất dịu và bền.{' '}
                  {strong('Phục Vị')} chủ ổn định, tĩnh tâm, tập trung — chính là hướng công cụ chỉ
                  đích danh cho bàn học.
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
                  Điểm dễ nhầm nhất: Sinh Khí là cát tinh {strong('xếp số 1')} trong bảng xếp hạng
                  chung, nhưng "số 1" không có nghĩa là luôn chọn nó cho mọi loại bàn. Xếp hạng nói về
                  mức cát theo quan niệm chung; còn chọn hướng ngồi là chọn theo{' '}
                  {strong('loại việc chiếm nhiều thời gian nhất')} trên chiếc bàn đó.
                </p>
                <p>
                  Bằng chứng nằm ngay trong công cụ: với bàn học, nó không chỉ về Sinh Khí mà chỉ về{' '}
                  {strong('Phục Vị')} — sao xếp cuối trong bốn cát tinh. Một chiếc bàn chỉ có một
                  hướng nhìn, nên nếu bạn vừa làm việc vừa học trên cùng một bàn, hãy chọn theo việc
                  bạn ngồi nhiều giờ hơn, đừng cố dung hòa.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="du-nien"
        concept="Bốn hung tinh không nặng bằng nhau"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bốn cái tên "nên tránh" cũng có {strong('nặng và nhẹ')}. Nếu chỉ tránh được một thì
                tránh cái nặng nhất. Còn nếu hết cách, đành ngồi cái nhẹ nhất — vẫn hơn ngồi cái nặng.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Thứ tự nặng giảm dần: {strong('Tuyệt Mệnh → Ngũ Quỷ → Lục Sát → Họa Hại')}. Tuyệt
                  Mệnh được xem là hung tinh nặng nhất; Họa Hại là hướng kém nhưng nhẹ nhất trong bốn.
                </p>
                <p>
                  Vì thế câu "bốn hướng còn lại đều xấu như nhau" là sai. Khi phòng chật và không còn
                  hướng tốt nào, thứ tự này chính là thứ giúp bạn chọn được phương án{' '}
                  {strong('ít tệ nhất')} thay vì chọn bừa.
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
                  Với bàn làm việc, phạm vi xử lý hẹp hơn hẳn so với cả ngôi nhà: một chiếc bàn chỉ có{' '}
                  {strong('một hướng nhìn')}, không có mẹo kiểu "tọa hung hướng cát" như bếp. Nên chỉ
                  còn hai cách thật sự: xoay hướng ngồi, hoặc dời chỗ đặt bàn. Hết hai cách đó thì thứ
                  hạng nặng – nhẹ mới là thứ có ích.
                </p>
                <p>
                  Theo đúng logic mô tả của Ngũ Quỷ — hướng có thể dùng cho kho, nhà vệ sinh, tức
                  những nơi {strong('ít ở')} — thì trong một phòng làm việc, phần không gian mang hung
                  tinh hợp để đặt tủ hồ sơ, máy in, kệ đồ hơn là đặt chỗ ngồi. Đây là suy luận theo
                  cùng nguyên tắc, không phải một quy tắc riêng của cổ thư.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="du-nien"
        concept="Vì sao Phục Vị luôn rơi đúng vào hướng tọa của cung phi"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Sao {strong('“ngồi yên”')} nằm đúng ở chỗ của chính mình — vì đó là chỗ chưa đổi gì
                cả. Nên hướng gốc của bạn bao giờ cũng là một hướng tốt, không bao giờ là hướng xấu.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Thuật toán bắt đầu từ chính quẻ mệnh khi {strong('chưa lật hào nào')}. Quẻ ấy tọa ở
                  một hướng cố định trên la bàn, và hướng đó nhận nhãn Phục Vị — nghĩa là "trở về chỗ
                  cũ, giữ nguyên".
                </p>
                <p>
                  Hệ quả tiện dụng: nếu bạn nhớ được hướng tọa của quẻ mệnh mình, bạn đã biết luôn{' '}
                  {strong('hướng ngồi học')} của mình mà không cần tra bảng.
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
                  Phục Vị xếp {strong('cuối')} trong bốn cát tinh nên rất hay bị bỏ qua — nhiều bài
                  viết chỉ nhắc Sinh Khí rồi dừng. Nhưng "xếp hạng thấp nhất trong nhóm tốt" không
                  đồng nghĩa "ít dùng nhất": đúng tính chất ổn định, tĩnh tâm của nó mới là thứ một
                  bàn học cần.
                </p>
                <p>
                  Ghi nhớ một câu cho gọn: hướng {strong('bung sức')} là Sinh Khí, hướng{' '}
                  {strong('ngồi yên')} là Phục Vị. Cả hai đều tốt, chỉ khác việc — và vì Phục Vị luôn
                  trùng hướng tọa của quẻ mệnh, nó là hướng dễ nhớ nhất trong cả tám.
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
    prompt: 'Tám du niên gồm những sao nào, chia làm mấy phe?',
    answer: (
      <>
        Hai phe, mỗi phe bốn sao. {strong('Bốn cát tinh')}: Sinh Khí, Thiên Y, Diên Niên, Phục Vị.{' '}
        {strong('Bốn hung tinh')}: Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại. Mọi cung phi đều nhận đúng
        tỷ lệ 4 – 4 này, vì thuật toán sinh bảng giống nhau cho cả tám quẻ.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Ngồi học hoặc làm việc cần tập trung sâu thì nên quay mặt về hướng mang sao nào?',
    choices: [
      {
        text: 'Sinh Khí — vì đó là cát tinh số 1',
        note: 'Không — Sinh Khí xếp số 1 về mức cát, nhưng nó chủ công danh, tài lộc, thăng tiến; đó là hướng cho bàn làm việc.',
      },
      {
        text: 'Phục Vị — chủ ổn định, tĩnh tâm, tập trung',
        correct: true,
        note: 'Đúng — công cụ chỉ đích danh Phục Vị cho bàn học, dù nó xếp cuối trong bốn cát tinh.',
      },
      {
        text: 'Thiên Y — chủ sức khỏe và quý nhân',
        note: 'Không — Thiên Y hợp khi cần sức khỏe, được nâng đỡ; tính chất dịu và bền, không phải sao của sự tập trung.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Bốn cát tinh xếp theo mức tốt giảm dần là thứ tự nào?',
    choices: [
      {
        text: 'Phục Vị → Diên Niên → Thiên Y → Sinh Khí',
        note: 'Ngược rồi — đây đúng là thứ tự đảo của bảng xếp hạng.',
      },
      {
        text: 'Sinh Khí → Thiên Y → Diên Niên → Phục Vị',
        correct: true,
        note: 'Đúng — đây là thứ tự engine dùng để sắp bốn hướng tốt trong mọi kết quả tra cứu.',
      },
      {
        text: 'Sinh Khí → Diên Niên → Phục Vị → Thiên Y',
        note: 'Không — Thiên Y đứng ngay sau Sinh Khí, không phải cuối bảng.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Bốn hung tinh xếp theo mức nặng giảm dần là thứ tự nào?',
    choices: [
      {
        text: 'Tuyệt Mệnh → Ngũ Quỷ → Lục Sát → Họa Hại',
        correct: true,
        note: 'Đúng — Tuyệt Mệnh nặng nhất, Họa Hại nhẹ nhất. Buộc phải chọn thì chọn ở cuối danh sách.',
      },
      {
        text: 'Ngũ Quỷ → Tuyệt Mệnh → Họa Hại → Lục Sát',
        note: 'Không — Tuyệt Mệnh mới là hung tinh nặng nhất theo quan niệm.',
      },
      {
        text: 'Bốn sao xấu nặng như nhau, không có thứ tự',
        note: 'Không — chính thứ tự này là thứ giúp bạn chọn phương án ít tệ nhất khi hết hướng tốt.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Với bàn làm việc, "hướng" được xét là hướng nào?',
    choices: [
      {
        text: 'Hướng người ngồi quay mặt về (hướng nhìn)',
        correct: true,
        note: 'Đúng — với bàn làm việc và bàn học, người ta xét hướng nhìn của người ngồi.',
      },
      {
        text: 'Hướng lưng ghế dựa vào',
        note: 'Không — lưng có điểm tựa là một lưu ý thực dụng riêng, không phải cách xác định hướng bàn.',
      },
      {
        text: 'Hướng cửa phòng làm việc nhìn ra',
        note: 'Không — đó là cách tính cho cửa nhà, thuộc phạm vi khác.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Vì sao Phục Vị luôn rơi vào hướng tọa của chính quẻ mệnh?',
    choices: [
      {
        text: 'Vì Phục Vị được gán cho quẻ gốc — trạng thái chưa lật hào nào',
        correct: true,
        note: 'Đúng — bảy nhãn còn lại mới sinh ra sau mỗi lần lật hào. Nên hướng gốc của bạn luôn là hướng tốt.',
      },
      {
        text: 'Vì Phục Vị là cát tinh mạnh nhất nên được xếp trước',
        note: 'Không — Phục Vị xếp cuối trong bốn cát tinh; vị trí của nó do thuật toán, không do mức cát.',
      },
      {
        text: 'Đó là quy ước riêng của Đông tứ mệnh',
        note: 'Không — đúng với cả tám cung phi, vì thuật toán giống hệt nhau cho mọi quẻ.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vận dụng: bàn của bạn cần tiếp khách và họp với đối tác gần như cả ngày. Nên ưu tiên hướng mang sao nào, vì sao?',
    answer: (
      <>
        Ưu tiên {strong('Diên Niên')} — sao chủ hòa hợp, quan hệ; hợp đúng loại công việc cần giao
        tiếp, đối tác, khách hàng. Nguyên tắc chung: chọn theo{' '}
        {strong('loại việc chiếm nhiều thời gian nhất')} trên chiếc bàn đó, chứ không mặc định lấy
        Sinh Khí chỉ vì nó xếp số 1.
      </>
    ),
  },
  {
    id: 'q8',
    type: 'open',
    prompt:
      'Vận dụng: hướng Sinh Khí của bạn lại là chỗ màn hình bị chói nắng chiều và lưng quay ra lối đi. Xử lý thế nào?',
    answer: (
      <>
        Ưu tiên phần {strong('đo được')} trước: bàn đủ sáng nhưng không chói, lưng có điểm tựa
        (tường), không quay lưng ra cửa hay lối đi. Sau khi loại các vị trí vi phạm những điều đó,
        trong số chỗ còn lại mới chọn hướng theo du niên. Nếu không còn hướng tốt nào, chọn hung tinh
        ở cuối bảng nặng dần (Họa Hại nhẹ nhất) — du niên là {strong('bước tinh chỉnh cuối')}, không
        phải ràng buộc đầu tiên.
      </>
    ),
  },
];

export function DuNienRecall() {
  return <ActiveRecall topicId="du-nien" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được du niên dùng để làm gì: phân biệt bốn hướng tốt với nhau để chọn được MỘT hướng ngồi theo mục tiêu — và nó KHÔNG hứa gì về thành bại.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể đủ tên 8 du niên và xếp đúng hai phe: 4 cát tinh (Sinh Khí, Thiên Y, Diên Niên, Phục Vị) và 4 hung tinh (Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Giải thích được tám nhãn ấy sinh ra thế nào: từ quẻ mệnh, lật lần lượt từng hào để ra bảy quẻ kế tiếp, mỗi quẻ rơi vào một hướng và nhận một nhãn.',
  },
  {
    id: 'ranking',
    facet: 'Xếp hạng',
    can: 'Nêu đúng thứ tự tốt giảm dần (Sinh Khí → Thiên Y → Diên Niên → Phục Vị) và nặng giảm dần (Tuyệt Mệnh → Ngũ Quỷ → Lục Sát → Họa Hại).',
  },
  {
    id: 'application',
    facet: 'Ứng dụng',
    can: 'Chọn đúng hướng ngồi theo mục tiêu: làm việc → Sinh Khí, học và cần tập trung → Phục Vị, việc nhiều giao tiếp → Diên Niên, cần dịu và bền → Thiên Y.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói được vì sao "cát tinh số 1" không đồng nghĩa "luôn chọn cho mọi loại bàn", và vì sao bàn học lại lấy Phục Vị — sao xếp cuối nhóm tốt.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra du niên không phải thiên thể mà là nhãn do thuật toán biến hào sinh ra, và biết cách tính cung phi thuộc bài Bát Trạch chứ không phải bài này.',
  },
  {
    id: 'tradeoff',
    facet: 'Đánh đổi',
    can: 'Nêu được thứ tự ưu tiên khi phòng không cho xoay bàn: ánh sáng không chói, lưng có điểm tựa, không quay lưng ra lối đi — rồi mới tới hướng.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Giải thích được vì sao ngồi vào hướng Sinh Khí không bảo đảm thăng tiến, và vì sao không cần mua "hóa giải" khi bàn rơi vào hướng xấu.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người bạn "tám du niên là gì và nên kê bàn quay về đâu" bằng lời của mình, giữ giọng tham khảo.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được phần nào (vd trình tự lật hào, cách chọn khi một bàn dùng cho cả làm việc lẫn học) bạn vẫn còn thấy mơ hồ.',
  },
];

export function DuNienChecklist() {
  return <UnderstandingChecklist topicId="du-nien" facets={FACETS} />;
}

export function DuNienWhys() {
  return (
    <FiveWhys
      topicId="du-nien"
      start={
        <>
          Một người tra được hướng Sinh Khí của mình, kê bàn quay đúng về đó. Nhưng chỗ ấy màn hình
          hứng nắng chiều chói cả buổi, lưng lại quay ra lối đi. Ngồi ba tuần thấy mỏi mắt và khó tập
          trung, vẫn không dám xoay bàn vì "sợ mất hướng tốt".
        </>
      }
      chain={[
        {
          question: 'Vì sao giữ nguyên chiếc bàn trong tình trạng đó là lựa chọn chưa hợp lý?',
          because: (
            <>
              Vì thứ đang phá sự tập trung của họ là {strong('màn hình chói và lối đi sau lưng')},
              không phải hướng bàn.
            </>
          ),
        },
        {
          question: 'Vì sao hai thứ đó lại nặng ký hơn hướng ngồi?',
          because: (
            <>
              Vì đó là những yếu tố {strong('đo được và ai cũng kiểm chứng được')} — độ chói, tiếng
              ồn, tư thế ngồi — trong khi hướng tốt là một nhãn tra từ bảng.
            </>
          ),
        },
        {
          question: 'Vì sao du niên chỉ là một nhãn tra từ bảng?',
          because: (
            <>
              Vì tám du niên sinh ra bằng cách {strong('lật hào')} trên quẻ mệnh rồi gán tên cho tám
              hướng. Chúng không phải thiên thể, cũng không có đại lượng nào đo được đứng sau.
            </>
          ),
        },
        {
          question: 'Vậy vì sao một hệ như thế vẫn đáng biết?',
          because: (
            <>
              Vì khi vài phương án kê bàn đã {strong('ngang nhau')} về ánh sáng, tiếng ồn và chỗ tựa
              lưng, bạn vẫn phải chọn một. Lúc đó chọn theo du niên không mất gì, lại cho bạn một tiêu
              chí rõ ràng thay vì chọn bừa.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi thứ tự các bước khi kê bàn?',
          because: (
            <>
              Vì thứ tự đúng là: lo phần đo được trước (đủ sáng, không chói, lưng có điểm tựa, không
              quay lưng ra lối đi), rồi mới chọn hướng trong số vị trí còn lại. Du niên là{' '}
              {strong('bước tinh chỉnh cuối')}, không phải ràng buộc đầu tiên.
            </>
          ),
        },
      ]}
      root={
        <>
          Tám du niên cho bạn một tiêu chí có sẵn để chọn hướng ngồi khi các yếu tố thật đã ngang
          nhau — không phải một mệnh lệnh bắt bạn ngồi vào chỗ chói mắt. Dùng nó ở bước cuối, giữ
          những gì đo được ở bước đầu. {strong('Tham khảo, không phán định')} — và không cần "hóa
          giải" gì cả.
        </>
      }
    />
  );
}
