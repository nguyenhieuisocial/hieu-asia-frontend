/**
 * Nội dung "học chủ động" cho trang /learn/thuoc-lo-ban.
 *
 * GROUNDING (không có dữ kiện nào nằm ngoài hai nguồn này):
 *   1. Trang công cụ  — apps/web/src/app/thuoc-lo-ban/page.tsx
 *      (4 lựa chọn thước + nhãn + gợi ý dùng cho vật gì, cách đo lọt lòng /
 *      phủ bì, luồng nhập cm → tra cung → gợi ý kích thước tốt gần nhất).
 *   2. Bộ dữ liệu thật của công cụ — backend repo, file
 *      infra/cloudflare/workers/api-gateway/src/tools/thuoc-lo-ban.ts
 *      (4 RulerDef: chiều dài chu kỳ, 8 cung, 4 ô con mỗi cung, tính chất
 *      Tốt/Xấu, ý nghĩa cung; hàm lookupAt lấy phần dư theo chu kỳ; quy tắc
 *      "Tốt khi và chỉ khi cả cung lẫn ô con đều Tốt"; findNearestGood dò theo
 *      bước 0.1 cm, tối đa 1000 bước mỗi phía).
 *
 * Mọi con số ví dụ trong file này đã được tính lại bằng đúng thuật toán của
 * công cụ trước khi viết. KHÔNG thêm dữ kiện mới. Giữ giọng "quy ước nghề mộc,
 * tham khảo — công năng đứng trước phong thuỷ".
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

export function LoBanFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn đang đặt cửa, đóng giường, làm bàn thờ và thợ hỏi {strong('“lấy số đẹp nhé?”')}. Không
          biết cây thước đó đo theo quy ước nào thì rất dễ nhận một con số mà chính mình không hiểu
          vì sao lại “đẹp”.
        </>
      }
      why={
        <>
          Thước Lỗ Ban là {strong('quy ước của nghề mộc cổ truyền')}: chia chiều dài thành các cung
          Tốt – Xấu, đo xong thì cố chọn kích thước rơi vào cung tốt. Nó tồn tại như một tập tục nghề
          nghiệp — không phải định luật, cũng không phải tiêu chuẩn xây dựng.
        </>
      }
      what={
        <>
          {strong('Bốn cây thước khác nhau')}, mỗi cây một chu kỳ riêng: 42.9 cm (thông thuỷ — cửa,
          cổng, bàn thờ), 38.8 cm (dương trạch — đồ vật, giường, tủ), 52.2 cm (âm trạch — mộ phần),
          Đinh Lan 38.4 cm (quan tài, mộ phần). Mỗi cây chia làm {strong('8 cung')}, mỗi cung lại chia
          làm {strong('4 ô con')}.
        </>
      }
      how={
        <>
          Kích thước thật thường dài hơn cây thước, nên công cụ lấy {strong('phần dư trong chu kỳ')}{' '}
          của cây thước bạn chọn, xem phần dư đó rơi vào cung nào, ô con nào. Kết quả là{' '}
          {strong('Tốt')} chỉ khi cả cung lẫn ô con đều tốt; nếu xấu, công cụ gợi ý kích thước tốt gần
          nhất nhỏ hơn và lớn hơn.
        </>
      }
      soWhat={
        <>
          Để bạn {strong('chọn đúng cây thước cho đúng thứ mình đo')}, đo đúng quy ước (lọt lòng với
          cửa, phủ bì với đồ vật), và hiểu vì sao cùng một con số lại “tốt” ở thước này mà “xấu” ở
          thước kia — thay vì cãi nhau vài milimet.
        </>
      }
    />
  );
}

export function LoBanDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="thuoc-lo-ban"
        concept="Vì sao cùng một kích thước lại “tốt” ở thước này mà “xấu” ở thước kia"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy tưởng tượng có hai cây thước dây khác nhau, một cây dài 42.9 cm rồi lặp lại, một
                cây dài 38.8 cm rồi lặp lại. Cùng quấn quanh một cánh cửa, {strong('điểm cuối')} của
                hai cây sẽ dừng ở hai chỗ khác nhau. Chỗ dừng khác nhau thì ô màu bạn đọc được cũng
                khác nhau — thế thôi.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi cây thước có một {strong('chu kỳ')} riêng. Kết quả không phụ thuộc con số thô mà
                  phụ thuộc {strong('phần dư')} của con số đó trong chu kỳ.
                </p>
                <p>
                  Ví dụ chiều rộng 90 cm. Trên thước 42.9 cm: 90 − 42.9 × 2 = 4.2 cm, rơi vào cung{' '}
                  {strong('Quý Nhân')} (cung tốt). Trên thước 38.8 cm: 90 − 38.8 × 2 = 12.4 cm, rơi vào
                  cung {strong('Ly')} (cung xấu). Cùng một cánh cửa, hai câu trả lời trái ngược — vì
                  bạn đã hỏi hai cây thước khác nhau.
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
                  Công cụ tính vị trí bằng phép chia lấy dư theo chiều dài chu kỳ, rồi chia chu kỳ đó
                  làm 8 cung đều nhau và mỗi cung làm 4 ô con đều nhau. Nghĩa là{' '}
                  {strong('“tốt/xấu” không phải thuộc tính của con số')}, mà của cặp (con số, cây
                  thước). Đổi thước là đổi hệ quy chiếu.
                </p>
                <p>
                  Chiều ngược lại cũng đúng: 120 cm trên thước 42.9 cm cho phần dư 34.2 cm → cung{' '}
                  {strong('Thiên Tặc')} (xấu); vẫn 120 cm trên thước 38.8 cm cho phần dư 3.6 cm → cung{' '}
                  {strong('Tài')} (tốt). Vì thế câu hỏi đầu tiên luôn là “tôi đang đo cái gì”, không
                  phải “số này đẹp không”.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="thuoc-lo-ban"
        concept="Chu kỳ và phần dư: vì sao cửa cao 2 mét vẫn tra được bằng cây thước 42.9 cm"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cây thước ngắn hơn cánh cửa rất nhiều, nên người ta {strong('đặt nối tiếp')} nhiều lần
                dọc theo cửa. Chỉ có {strong('đoạn thừa cuối cùng')} là quan trọng — nó dừng ở ô nào
                thì đọc ô đó.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Cửa cao 212 cm, thước thông thuỷ 42.9 cm: đặt được 4 lần (4 × 42.9 = 171.6 cm), còn
                  thừa {strong('40.4 cm')}. Chính 40.4 cm này quyết định kết quả — nó nằm trong cung{' '}
                  {strong('Tể Tướng')}, ô con {strong('Quý tử')}, và cung Tể Tướng là cung tốt.
                </p>
                <p>
                  Vì vậy trên màn hình kết quả có dòng “vị trí trong chu kỳ” — đó chính là đoạn thừa
                  ấy, kèm chiều dài đầy đủ của chu kỳ để bạn đối chiếu.
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
                  Hệ quả của phép lấy dư: các kích thước {strong('cách nhau đúng một chu kỳ')} luôn cho
                  cùng một kết quả. Trên thước 42.9 cm, 38.1 cm và 81 cm và 123.9 cm đều rơi vào Tể
                  Tướng · Đăng khoa. Đây là lý do một “bộ số đẹp” của thợ thường lặp lại theo bước
                  42.9 cm hoặc 38.8 cm.
                </p>
                <p>
                  Hệ quả thứ hai, ít người để ý: {strong('mỗi chiều phải tra riêng')}. Một cánh cửa có
                  chiều rộng và chiều cao khác nhau, nên nó có hai phần dư khác nhau và hoàn toàn có
                  thể rộng thì tốt mà cao thì xấu.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="thuoc-lo-ban"
        concept="Đo thông thuỷ hay đo phủ bì — đo sai thì tra đúng cũng vô nghĩa"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Với cái cửa, người ta đo {strong('khoảng trống')} mà mình chui qua được. Với cái tủ,
                người ta đo {strong('cả cái tủ')} từ mép ngoài bên này sang mép ngoài bên kia. Hai cách
                đo khác nhau cho hai con số khác nhau.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Thông thuỷ')} (còn gọi lọt lòng) là phần trống thật sự — với cửa, cổng thì
                  đó là khoảng ánh sáng đi lọt qua, đo từ mép trong khuôn bên này sang mép trong khuôn
                  bên kia, không tính bề dày khuôn. Đây là quy ước của thước 42.9 cm.
                </p>
                <p>
                  {strong('Phủ bì')} là đo trọn vật, tính cả phần khung viền. Đây là quy ước của thước
                  38.8 cm dùng cho đồ vật: giường, tủ, bàn.
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
                  Sai lệch giữa hai cách đo không hề nhỏ. Một khuôn cửa dày vài centimet mỗi bên là đủ
                  đẩy kích thước sang ô con khác — vì trên thước 42.9 cm, {strong('mỗi ô con chỉ rộng khoảng 1.34 cm')}
                  , còn trên thước 38.8 cm là khoảng 1.21 cm.
                </p>
                <p>
                  Nói cách khác: {strong('độ chính xác của phép đo phải nhỏ hơn ô con')} thì kết quả mới
                  có nghĩa. Đo bằng thước dây võng, đo qua lớp sơn chưa hoàn thiện, hay đo phủ bì rồi
                  tra bằng thước thông thuỷ — cả ba đều làm kết quả mất giá trị, dù công cụ vẫn trả về
                  một câu trả lời trông rất chắc chắn.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="thuoc-lo-ban"
        concept="Cung mẹ và ô con: cái nào quyết định tốt – xấu"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cây thước chia làm 8 ô lớn, mỗi ô lớn lại chia làm 4 ô nhỏ. Ô lớn cho biết{' '}
                {strong('tốt hay xấu')}; ô nhỏ chỉ nói {strong('tốt kiểu gì, xấu kiểu gì')}.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Công cụ kết luận {strong('Tốt')} chỉ khi cả cung lớn và ô con đều tốt — chỉ cần một
                  trong hai là xấu thì kết quả là Xấu. Trong bộ dữ liệu công cụ đang dùng, cả 4 ô con
                  của một cung luôn mang cùng tính chất với cung mẹ, nên trên thực tế{' '}
                  {strong('cung lớn là thứ quyết định')}.
                </p>
                <p>
                  Ô con vẫn đáng đọc, vì nó cho biết sắc thái: cùng cung Tể Tướng nhưng rơi vào ô Đăng
                  khoa hay ô Đại cát là hai lời chúc khác nhau.
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
                  Cái bẫy nằm ở chỗ {strong('tên ô con không suy ra được tốt – xấu')}. Trên thước 42.9
                  cm, cung {strong('Thiên Tai')} là cung xấu, nhưng bốn ô con của nó lại tên là Hỉ sự,
                  Hoạnh tài, Quan tước, Quan lộc — toàn chữ nghe rất thuận tai. Đọc lướt thấy “Hoạnh
                  tài” mà tưởng trúng số là hiểu ngược hoàn toàn.
                </p>
                <p>
                  Vì vậy khi đọc kết quả, hãy đọc theo thứ tự: {strong('nhãn Tốt/Xấu')} trước, rồi mới
                  tới tên cung và tên ô con. Nhãn là thứ công cụ tính ra; hai cái tên chỉ là mô tả.
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
    type: 'mcq',
    prompt: 'Bạn sắp đặt một bộ cửa chính. Nên tra bằng cây thước nào?',
    choices: [
      {
        text: 'Thước 38.8 cm (dương trạch), vì cửa cũng là đồ gỗ',
        note: 'Không — 38.8 cm dành cho đồ vật như giường, tủ, bàn; cửa và cổng dùng thước thông thuỷ.',
      },
      {
        text: 'Thước 42.9 cm (thông thuỷ), và đo khoảng lọt lòng của cửa',
        correct: true,
        note: 'Đúng — thước 42.9 cm là thước thông thuỷ, dùng cho cửa, cổng, bàn thờ; đo phần trống lọt lòng.',
      },
      {
        text: 'Thước Đinh Lan 38.4 cm, vì nó gần với 38.8 cm',
        note: 'Không — Đinh Lan 38.4 cm dùng cho quan tài và mộ phần, không dùng cho cửa nhà ở.',
      },
    ],
  },
  {
    id: 'q2',
    type: 'open',
    prompt:
      'Cửa cao 212 cm, tra bằng thước thông thuỷ 42.9 cm. Con số nào mới thực sự quyết định kết quả, và vì sao?',
    answer: (
      <>
        Là {strong('phần dư trong chu kỳ')}: 212 − 42.9 × 4 = 40.4 cm. Vì kích thước thật dài hơn cây
        thước nhiều lần, công cụ đặt thước nối tiếp rồi chỉ đọc đoạn thừa cuối cùng. 40.4 cm rơi vào
        cung Tể Tướng, ô con Quý tử — cung tốt. Màn hình kết quả hiển thị đúng con số này ở dòng “vị
        trí trong chu kỳ”.
      </>
    ),
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Chiều rộng 90 cm cho kết quả Tốt trên thước 42.9 cm nhưng Xấu trên thước 38.8 cm. Vì sao?',
    choices: [
      {
        text: 'Vì hai cây thước có chu kỳ khác nhau nên phần dư khác nhau: 4.2 cm so với 12.4 cm',
        correct: true,
        note: 'Đúng — 4.2 cm rơi vào cung Quý Nhân (tốt), còn 12.4 cm rơi vào cung Ly (xấu).',
      },
      {
        text: 'Vì một trong hai cây thước bị sai, phải chọn cây “chuẩn” hơn',
        note: 'Không — cả hai đều đúng trong phạm vi của nó; chúng đo hai loại đối tượng khác nhau.',
      },
      {
        text: 'Vì thước 38.8 cm khắt khe hơn nên số nào cũng dễ ra xấu',
        note: 'Không — chiều ngược lại vẫn xảy ra: 120 cm là xấu trên thước 42.9 cm nhưng tốt trên thước 38.8 cm.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Kết quả hiện cung Thiên Tai, ô con “Hoạnh tài”. Nên hiểu thế nào?',
    choices: [
      {
        text: 'Ô con tên đẹp nên coi như trung tính, không cần chỉnh',
        note: 'Không — tên ô con không quyết định gì; cung Thiên Tai là cung xấu nên kết quả là Xấu.',
      },
      {
        text: 'Đây là kết quả Xấu — tên ô con nghe thuận tai không đổi được tính chất của cung',
        correct: true,
        note: 'Đúng — cả 4 ô con của cung Thiên Tai (Hỉ sự, Hoạnh tài, Quan tước, Quan lộc) đều thuộc cung xấu.',
      },
      {
        text: 'Ô con luôn thắng cung mẹ, nên đây là kết quả Tốt',
        note: 'Không — công cụ chỉ kết luận Tốt khi CẢ cung lẫn ô con đều tốt.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Khi kết quả là Xấu, công cụ đưa thêm hai con số “nhỏ hơn” và “lớn hơn”. Đó là gì và dùng thế nào?',
    answer: (
      <>
        Đó là {strong('kích thước tốt gần nhất')} về hai phía: công cụ dò dần theo bước 0.1 cm sang
        trái và sang phải cho tới khi gặp một điểm mà cả cung lẫn ô con đều tốt. Cách dùng thực dụng:
        chọn phía nào {strong('ít ảnh hưởng tới công năng')} hơn. Ví dụ cửa rộng 100 cm trên thước
        42.9 cm là Xấu, hai lựa chọn gần nhất là 91.1 cm và 101.9 cm — nới ra 1.9 cm thường dễ hơn thu
        vào gần 9 cm. Hai gợi ý này chỉ xuất hiện khi kết quả là Xấu.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Đã đóng xong cánh cửa, đo lại thấy lệch 1 cm sang cung xấu. Xử lý hợp lý nhất là gì?',
    choices: [
      {
        text: 'Tháo ra làm lại cho bằng được kích thước đẹp',
        note: 'Không cân xứng — đây là quy ước tham khảo, không đáng để đánh đổi chi phí và kết cấu.',
      },
      {
        text: 'Ghi nhận, cân nhắc chỉnh nếu còn dễ chỉnh; nếu không thì thôi, giữ nguyên',
        correct: true,
        note: 'Đúng — kích thước công năng và độ chắc chắn quan trọng hơn; thước Lỗ Ban chỉ là một yếu tố tham khảo.',
      },
      {
        text: 'Đổi sang tra bằng cây thước khác cho tới khi ra kết quả tốt',
        note: 'Không — mỗi cây thước gắn với một loại đối tượng đo; chọn thước theo kết quả mong muốn là tự đánh lừa mình.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vận dụng: hai người tra cùng một cánh cửa rộng 81 cm, một người nói “Tể Tướng, tốt”, người kia nói con số phải là 43 cm chứ không phải 42.9 cm. Ai đúng?',
    answer: (
      <>
        Cả hai đều đang nói thật, chỉ khác {strong('bộ số gốc')}. Các xưởng và sách ghi chiều dài chu
        kỳ hơi khác nhau (ví dụ 42.9 so với 43 cm), nên cùng một kích thước có thể ra cung khác ở
        nguồn khác. Công cụ của hieu.asia chốt theo một bộ số đã cấu hình và tra nhất quán theo bộ đó
        — nên hãy đọc kết quả như “theo bộ thước này”, và đừng biến chênh lệch vài milimet thành tranh
        cãi.
      </>
    ),
  },
];

export function LoBanRecall() {
  return <ActiveRecall topicId="thuoc-lo-ban" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được thước Lỗ Ban dùng để làm gì (chọn kích thước theo quy ước nghề mộc) và nó KHÔNG phải gì (không phải tiêu chuẩn xây dựng, không phải định luật).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả được cách tra: lấy phần dư của kích thước trong chu kỳ cây thước → xem rơi vào cung nào, ô con nào → đọc nhãn Tốt/Xấu.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể được bốn cây thước và mục đích riêng của từng cây, cùng cấu trúc 8 cung × 4 ô con.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Giải thích được vì sao cùng một kích thước lại tốt ở thước này mà xấu ở thước kia, bằng chính con số phần dư.',
  },
  {
    id: 'measure',
    facet: 'Thao tác',
    can: 'Biết khi nào đo thông thuỷ (lọt lòng) và khi nào đo phủ bì, và vì sao đo sai quy ước thì kết quả mất nghĩa.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra được thước Lỗ Ban chỉ nói về KÍCH THƯỚC — không nói về hướng nhà, phi tinh hay ngày giờ, đó là các hệ khác.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao tên ô con nghe hay không có nghĩa là tốt, và vì sao không nên phá đi làm lại vì lệch một hai centimet.',
  },
  {
    id: 'priority',
    facet: 'Thứ tự ưu tiên',
    can: 'Nêu được thứ tự đúng: kích thước công năng và an toàn trước, kích thước phong thuỷ sau — và giải thích vì sao không đảo ngược được.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho người thợ hoặc người nhà “vì sao chọn cây thước này chứ không phải cây kia” bằng lời của bạn.',
  },
];

export function LoBanChecklist() {
  return <UnderstandingChecklist topicId="thuoc-lo-ban" facets={FACETS} />;
}

export function LoBanWhys() {
  return (
    <FiveWhys
      topicId="thuoc-lo-ban"
      start={
        <>
          Cùng một cánh cửa rộng 90 cm: người thợ mộc tra ra “cung Quý Nhân, tốt”, người bán cửa tra
          ra “cung Ly, xấu”. Chủ nhà hoang mang không biết tin ai.
        </>
      }
      chain={[
        {
          question: 'Vì sao hai người tra cùng một con số lại ra hai kết quả trái ngược?',
          because: (
            <>
              Vì họ dùng {strong('hai cây thước khác nhau')}: một người dùng thước thông thuỷ 42.9 cm,
              người kia dùng thước dương trạch 38.8 cm.
            </>
          ),
        },
        {
          question: 'Vì sao đổi cây thước lại đổi kết quả của cùng một con số?',
          because: (
            <>
              Vì kết quả không đọc từ con số thô mà từ {strong('phần dư trong chu kỳ')}: 90 cm để lại
              4.2 cm trên thước 42.9 cm (rơi vào cung Quý Nhân, tốt), nhưng để lại 12.4 cm trên thước
              38.8 cm (rơi vào cung Ly, xấu).
            </>
          ),
        },
        {
          question: 'Vì sao mỗi cây thước lại có một chu kỳ riêng?',
          because: (
            <>
              Vì mỗi cây được lập cho {strong('một loại đối tượng đo khác nhau')} — khoảng thông thuỷ
              của cửa cổng, đồ vật trong nhà, mộ phần, quan tài — và mỗi cây mang một bộ 8 cung riêng
              với tên gọi riêng.
            </>
          ),
        },
        {
          question: 'Vì sao lại chia thành 8 cung rồi mỗi cung thêm 4 ô con?',
          because: (
            <>
              Vì đây là {strong('quy ước phân chia của nghề mộc')}: cắt chu kỳ thành 8 phần đều nhau,
              gán nhãn tốt – xấu cho từng phần, rồi chia nhỏ mỗi phần làm 4 để nói rõ sắc thái. Nó là
              cách đặt tên cho các đoạn của cây thước, không phải phát hiện về vật liệu hay kết cấu.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên dùng thước Lỗ Ban?',
          because: (
            <>
              Vì “tốt/xấu” là thuộc tính của {strong('cặp (kích thước, cây thước)')}, không phải của
              riêng kích thước. Nên việc cần làm là chọn đúng thước và đo đúng quy ước — còn khi kích
              thước phong thuỷ đụng độ kích thước công năng thì {strong('công năng phải thắng')}.
            </>
          ),
        },
      ]}
      root={
        <>
          Thước Lỗ Ban là một cách đặt tên đẹp cho các đoạn của cây thước theo tập tục nghề mộc, không
          phải một quy luật của vật liệu. Dùng nó để chọn giữa vài phương án đều hợp lý về công năng
          thì hay; dùng nó để phủ quyết một kích thước an toàn, hoặc để phá đi làm lại vì lệch một
          centimet, thì đã đi quá xa — {strong('tham khảo, không phán định')}.
        </>
      }
    />
  );
}
