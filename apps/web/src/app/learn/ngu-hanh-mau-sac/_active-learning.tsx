/**
 * Nội dung "học chủ động" cho trang /learn/ngu-hanh-mau-sac.
 *
 * GROUNDING (chống bịa — mọi khẳng định về hành/màu đều truy được về lib):
 *  - `lib/dat-ten-ngu-hanh` → bảng `ELEMENTS`: tên hành, blurb ("Tượng kim loại",
 *    "Tượng cây cối", "Tượng nước", "Tượng lửa", "Tượng đất") và bốn quan hệ
 *    sinhBy / sinhTo / khac / khacBy → hai vòng tương sinh, tương khắc.
 *  - `lib/ban-menh-data` → `ELEMENT_COLORS`: nhóm màu của từng hành.
 *  - `lib/mau-xe-data` → `CAR_COLORS` (12 màu sơn xe phổ biến → hành) và
 *    `buildMauXe(year)` (luật hợp = hành bản mệnh + hành sinh mệnh; kỵ = hành
 *    khắc mệnh) — chính engine mà công cụ /mau-xe-hop-menh đang chạy.
 *  - `lib/ngu-hanh-remedy` → phát biểu vòng sinh/khắc và bảng màu theo hành.
 *  - Câu về AN TOÀN (xe màu sáng dễ nhận biết khi thiếu sáng) lấy đúng chữ đã
 *    dùng ở trang công cụ /mau-xe-hop-menh — KHÔNG thêm con số nào.
 *
 * KHÔNG lấn sân: đặt tên theo ngũ hành → /learn/dat-ten-ngu-hanh; cách tra nạp âm
 * → công cụ /ban-menh; hướng nhà → /learn/bat-trach.
 *
 * Giọng: vui, dễ hiểu nhưng trung thực — đây là hệ biểu tượng văn hoá, và AN TOÀN
 * đứng trước phong thuỷ.
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

export function MauSacFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Đứng trước bảng màu xe ở showroom, ai cũng có lúc khựng lại:{' '}
          {strong('“màu này có hợp mệnh mình không?”')} — rồi mỗi người nói một kiểu, người bảo hợp,
          người bảo kỵ, không ai giải thích được vì sao.
        </>
      }
      why={
        <>
          Vì người xưa xếp mọi thứ trong tự nhiên vào {strong('năm hành')} — Kim, Mộc, Thuỷ, Hoả,
          Thổ — và màu sắc cũng được xếp vào đó theo{' '}
          {strong('hình ảnh tự nhiên')}: lửa thì đỏ, nước thì đen sẫm, cây thì xanh lá, kim loại thì
          trắng sáng, đất thì vàng nâu. Đây là một {strong('hệ biểu tượng văn hoá')}, không phải quy
          luật vật lý.
        </>
      }
      what={
        <>
          Một bảng {strong('5 hành ↔ 5 nhóm màu')}, cộng hai vòng quan hệ: {strong('tương sinh')}{' '}
          (Mộc → Hoả → Thổ → Kim → Thuỷ → Mộc) và {strong('tương khắc')} (Mộc khắc Thổ, Thổ khắc
          Thuỷ, Thuỷ khắc Hoả, Hoả khắc Kim, Kim khắc Mộc). {strong('Không phải')} lời hứa về tài
          lộc, cũng không phải điều cấm.
        </>
      }
      how={
        <>
          Tra hành bản mệnh của bạn theo năm sinh (làm tại <code>/ban-menh</code>), rồi áp đúng hai
          câu: màu nên chọn = màu của {strong('hành mình')} + màu của {strong('hành sinh ra mình')};
          màu nên cân nhắc = màu của {strong('hành khắc mình')}. Công cụ màu xe chạy đúng luật này,
          không có bảng chép tay.
        </>
      }
      soWhat={
        <>
          Bạn rút được danh sách {strong('12 màu xe phổ biến')} xuống vài lựa chọn để ngắm cho vui,
          và quan trọng hơn — bạn biết cái gì là biểu tượng, cái gì là thật. {strong('An toàn')} (xe
          màu sáng dễ được nhận biết khi thiếu sáng) và giá bán lại là thứ ảnh hưởng thật, nên đứng
          trước hợp mệnh.
        </>
      }
    />
  );
}

export function MauSacDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="ngu-hanh-mau-sac"
        concept="Vì sao Hoả là màu đỏ, Thuỷ là màu đen — bảng màu này ở đâu ra?"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Người xưa đặt tên màu theo {strong('thứ mà họ nhìn thấy')}. Lửa cháy màu đỏ cam, nên
                hành Hoả là màu đỏ. Nước ở giếng sâu, ở biển đêm nhìn đen thẫm, nên hành Thuỷ là màu
                đen và xanh nước biển. Lá cây màu xanh lá, nên Mộc là xanh lá. Con dao, cái nồi sáng
                bóng nên Kim là trắng bạc. Đất thì vàng nâu, nên Thổ là vàng nâu. Chỉ vậy thôi — dễ
                nhớ như đặt tên cho bạn cùng lớp theo cái áo hay mặc.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Bảng màu này là {strong('phép ẩn dụ có hệ thống')}. Mỗi hành vốn được mô tả bằng
                  một hình ảnh tự nhiên: Kim là {strong('tượng kim loại')}, Mộc là{' '}
                  {strong('tượng cây cối')}, Thuỷ là {strong('tượng nước')}, Hoả là{' '}
                  {strong('tượng lửa')}, Thổ là {strong('tượng đất')}. Màu của hành chính là màu của
                  hình ảnh đó.
                </p>
                <p>
                  Vì thế bảng màu không cần học thuộc: nhìn thấy vật là suy ra được màu. Ngược lại,
                  gặp một màu lạ (ví dụ màu xe “xanh rêu”) bạn cũng tự xếp được — rêu là cây cỏ, nên
                  nó thuộc Mộc.
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
                  Điểm cần tỉnh táo: đây là {strong('quan hệ tương ứng (correspondence)')}, không
                  phải quan hệ nhân quả. Ngũ hành là một khung phân loại vũ trụ quan cổ, gán mọi
                  phạm trù — màu, mùa, phương hướng, tạng phủ — vào năm ô. Màu được gán vào hành vì{' '}
                  {strong('giống nhau về hình ảnh')}, chứ không phải vì có cơ chế nào khiến màu đỏ
                  toả nhiệt hơn màu xanh.
                </p>
                <p>
                  Hệ quả: bảng màu có thể sai khác đôi chút giữa các tài liệu (hồng, tím được xếp vào
                  Hoả ở hệ này nhưng có sách xếp khác), và đó là chuyện bình thường của một hệ biểu
                  tượng. hieu.asia chốt một bảng duy nhất dùng cho toàn site để bạn không nhận hai kết
                  quả mâu thuẫn giữa các công cụ.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="ngu-hanh-mau-sac"
        concept="Hai vòng quan hệ, đọc bằng MÀU thay vì bằng tên hành"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Thử đọc vòng ngũ hành bằng {strong('màu')} xem nhé:{' '}
                {strong('xanh lá')} bén lửa thành {strong('đỏ')}; đỏ cháy hết còn lại tro{' '}
                {strong('vàng nâu')}; đào lớp vàng nâu ấy lên thì gặp ánh {strong('trắng bạc')} của
                kim loại; mặt kim loại lạnh thì đọng thành giọt {strong('đen')} bóng; và chỗ nào ẩm
                thì lại mọc ra {strong('xanh lá')}. Năm màu nối đuôi nhau thành một vòng tròn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Vòng vừa đọc chính là {strong('tương sinh')}: Mộc → Hoả → Thổ → Kim → Thuỷ → quay
                  lại Mộc. “A sinh B” nghĩa là A nuôi B, làm B mạnh lên.
                </p>
                <p>
                  Vòng còn lại là {strong('tương khắc')}: Mộc khắc Thổ, Thổ khắc Thuỷ, Thuỷ khắc Hoả,
                  Hoả khắc Kim, Kim khắc Mộc. “A khắc B” nghĩa là A kìm hãm B.
                </p>
                <p>
                  Mẹo nhớ hình học: xếp năm hành lên một vòng tròn theo thứ tự tương sinh, thì vòng
                  sinh đi {strong('sát nhau')} (vẽ ra là đường tròn), còn vòng khắc{' '}
                  {strong('nhảy cách một hành')} (vẽ ra là ngôi sao năm cánh nằm trong đường tròn
                  đó). Một hình duy nhất chứa cả hai vòng.
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
                  Mỗi hành nằm trong {strong('bốn quan hệ')} chứ không phải hai: hành sinh ra nó (mẹ),
                  hành nó sinh ra (con), hành nó khắc, và hành khắc nó. Khi chọn màu, thứ ta dùng là
                  hai quan hệ hướng {strong('vào mình')}: hành sinh ra mình (bổ trợ) và hành khắc
                  mình (nên cân nhắc).
                </p>
                <p>
                  Đây là chỗ dễ nhầm nhất:{' '}
                  {strong('“Hoả khắc Kim” và “Hoả bị Thuỷ khắc” là hai câu khác nhau')} — một bên là
                  hành mình khắc, một bên là hành khắc mình. Người mệnh Hoả cần để ý màu Thuỷ (đen,
                  xanh dương) vì Thuỷ khắc mình; còn người mệnh Kim mới là người bị Hoả khắc, nên họ
                  để ý màu đỏ – cam – tím. Đảo chiều một lần là ra kết quả ngược hoàn toàn.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="ngu-hanh-mau-sac"
        concept="Nguyên tắc chọn màu: hành của mình + hành sinh ra mình"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cách chọn màu giống như chọn chỗ ngồi: ngồi cạnh{' '}
                {strong('người hợp với mình')} và cạnh {strong('người hay giúp mình')} thì thoải mái
                nhất. Màu của chính hành mình là “người hợp”, màu của hành sinh ra mình là “người
                giúp”. Còn màu của hành hay bắt nạt mình thì cân nhắc — nhưng không ai cấm bạn ngồi
                cạnh cả.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>Chỉ có hai câu cần nhớ, đúng cho mọi mệnh:</p>
                <p>
                  1. {strong('Màu nên chọn')} = màu của hành bản mệnh + màu của hành sinh ra bản
                  mệnh. Ví dụ mệnh Mộc: Thuỷ sinh Mộc, nên nhóm màu là xanh lá (Mộc) cộng đen và xanh
                  dương (Thuỷ).
                </p>
                <p>
                  2. {strong('Màu nên cân nhắc')} = màu của hành khắc bản mệnh. Vẫn mệnh Mộc: Kim
                  khắc Mộc, nên đó là trắng, bạc, xám. Các màu còn lại là{' '}
                  {strong('trung tính')} — không xung, không đặc biệt hợp, chọn thoải mái.
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
                  Vì sao chỉ lấy hành sinh mình mà không lấy hành mình sinh ra? Vì theo cách hiểu phổ
                  biến, hành mình sinh ra là hành {strong('nhận')} năng lượng từ mình — hài hoà,
                  nhưng không được xem là bổ trợ. Bảng gợi ý ở hieu.asia vì thế chỉ đưa hai nhóm vào
                  cột “hợp”, phần còn lại xếp {strong('trung tính')} thay vì cố gán tốt/xấu cho đủ 12
                  màu.
                </p>
                <p>
                  Một quan sát rút ra từ chính bảng 12 màu xe: số màu “nên cân nhắc” của mỗi mệnh{' '}
                  {strong('không bằng nhau')}. Mệnh Thổ chỉ vướng đúng một màu (xanh lá – hành Mộc),
                  trong khi mệnh Kim vướng ba màu (đỏ, cam, tím – hành Hoả). Đó không phải vì Thổ
                  “may” hơn, mà chỉ vì thị trường xe hơi có nhiều sắc đỏ – cam – tím hơn sắc xanh lá.
                  Một chi tiết nhắc ta: cái bảng này phản ánh {strong('thị trường sơn xe')} nhiều
                  không kém phản ánh cổ học.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="ngu-hanh-mau-sac"
        concept="Chỗ nào là biểu tượng, chỗ nào là ảnh hưởng thật của màu xe"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Màu xe hợp mệnh là chuyện {strong('cho vui và cho ưng mắt')}. Nhưng có một chuyện màu
                xe ảnh hưởng thật: {strong('xe màu sáng thì người khác dễ nhìn thấy hơn')} khi trời
                tối hay mưa mù. Dễ nhìn thấy nghĩa là an toàn hơn — cái đó mới đáng để ý nhất.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Tách làm hai cột cho rõ. Cột {strong('biểu tượng')}: hợp mệnh, tương sinh, tương
                  khắc — giá trị của nó là giúp bạn thu hẹp lựa chọn và thấy yên tâm với quyết định
                  của mình. Không có gì đảm bảo về tài lộc hay may mắn.
                </p>
                <p>
                  Cột {strong('ảnh hưởng thật')}: các nghiên cứu giao thông cho thấy xe màu sáng
                  (đặc biệt trắng và vàng) {strong('dễ được nhận biết hơn')} trong điều kiện thiếu
                  sáng hoặc thời tiết xấu. Ngoài ra màu phổ thông thường dễ bán lại hơn màu hiếm, vì
                  người mua sau cũng thích màu an toàn thị hiếu.
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
                  Khi hai cột xung đột — ví dụ mệnh Hoả được gợi ý tránh màu đen, nhưng bạn đang cân
                  nhắc một chiếc màu đen vì thích — hãy xếp thứ tự thế này:{' '}
                  {strong('an toàn → nhu cầu dùng và chi phí giữ gìn → giá bán lại → sở thích → phong thuỷ')}
                  . Phong thuỷ đứng cuối không phải vì nó vô giá trị, mà vì bốn thứ trước có hậu quả
                  đo được, còn nó thì không.
                </p>
                <p>
                  Cách dùng lành mạnh nhất của bảng màu này: dùng nó để{' '}
                  {strong('chọn giữa những phương án đã ngang nhau')} về giá, an toàn và sở thích —
                  chứ không dùng nó để loại một chiếc xe bạn thực sự cần, và càng không để ai lấy nó
                  làm cớ bán thêm cho bạn thứ gì.
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
    prompt: 'Đọc thuộc vòng tương sinh và vòng tương khắc của ngũ hành.',
    answer: (
      <>
        {strong('Tương sinh')}: Mộc → Hoả → Thổ → Kim → Thuỷ → quay lại Mộc (mỗi hành nuôi hành kế
        tiếp). {strong('Tương khắc')}: Mộc khắc Thổ, Thổ khắc Thuỷ, Thuỷ khắc Hoả, Hoả khắc Kim, Kim
        khắc Mộc (mỗi hành kìm hành cách nó một bậc trên vòng tròn).
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Trong bảng màu xe dùng tại hieu.asia, màu VÀNG (vàng cát) thuộc hành nào?',
    choices: [
      {
        text: 'Hành Kim — vì ta hay nói “vàng kim”',
        note: 'Không — đây đúng là cái bẫy chữ nghĩa. Màu đại diện của Kim là trắng, bạc, xám/ghi.',
      },
      {
        text: 'Hành Thổ — vàng là màu của đất',
        correct: true,
        note: 'Đúng — Thổ gồm vàng / vàng cát, nâu và be/kem.',
      },
      {
        text: 'Hành Hoả — vì vàng là màu nóng',
        note: 'Không — Hoả gồm đỏ, cam và tím trong bảng màu xe.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Nguyên tắc chọn màu theo mệnh gồm những nhóm nào?',
    choices: [
      {
        text: 'Chỉ lấy đúng màu của hành bản mệnh, mọi màu khác đều nên tránh',
        note: 'Không — như vậy quá hẹp; hành sinh ra mệnh cũng được xem là bổ trợ, và phần lớn màu còn lại là trung tính.',
      },
      {
        text: 'Lấy màu của hành bản mệnh và hành sinh ra bản mệnh; cân nhắc màu của hành khắc bản mệnh',
        correct: true,
        note: 'Đúng — đây chính là luật mà công cụ màu xe đang chạy, các màu còn lại xếp trung tính.',
      },
      {
        text: 'Lấy màu của hành mà bản mệnh khắc được, vì mình mạnh hơn nó',
        note: 'Không — quan hệ “mình khắc nó” không được dùng để chọn màu; chỉ hai quan hệ hướng vào mình mới được dùng.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Người mệnh Hoả nên cân nhắc nhóm màu xe nào, và vì sao?',
    choices: [
      {
        text: 'Đen và xanh dương — vì Thuỷ khắc Hoả',
        correct: true,
        note: 'Đúng — hành khắc mệnh Hoả là Thuỷ, mà màu của Thuỷ là đen và xanh dương / xanh lam.',
      },
      {
        text: 'Trắng, bạc, xám — vì Hoả khắc Kim',
        note: 'Ngược chiều rồi: “Hoả khắc Kim” nghĩa là người mệnh KIM mới phải để ý màu đỏ – cam – tím.',
      },
      {
        text: 'Xanh lá — vì Mộc và Hoả xung nhau',
        note: 'Không — Mộc sinh Hoả, nên xanh lá lại nằm trong nhóm màu bổ trợ cho mệnh Hoả.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: bạn ưng một chiếc xe màu đen, giá tốt, nhưng tra ra thì màu đen nằm trong nhóm “nên cân nhắc” của mệnh bạn. Nên xử lý thế nào?',
    answer: (
      <>
        Cứ mua nếu bạn thích. “Nên cân nhắc” là {strong('gợi ý phong thuỷ')}, không phải điều cấm và
        không định đoạt may rủi. Thứ đáng cân nhắc thật nằm ở chỗ khác: xe màu tối{' '}
        {strong('khó được nhận biết hơn')} khi thiếu sáng, nên nếu bạn hay chạy đêm hoặc đường trường
        thì hãy bù bằng thói quen bật đèn sớm, dán phản quang, giữ khoảng cách. Đó mới là điều chỉnh
        có tác dụng thật.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Cách phát biểu nào đúng về bản chất của bảng “hành ↔ màu”?',
    choices: [
      {
        text: 'Là quy luật vật lý đã được kiểm chứng: màu thuộc hành nào sẽ phát ra năng lượng của hành đó',
        note: 'Không — không có cơ chế vật lý nào như vậy; nói thế là gán khoa học cho một hệ biểu tượng.',
      },
      {
        text: 'Là hệ biểu tượng văn hoá, gán màu vào hành theo hình ảnh tự nhiên (lửa đỏ, nước đen, cây xanh, kim loại trắng, đất vàng nâu)',
        correct: true,
        note: 'Đúng — quan hệ tương ứng theo hình ảnh, không phải quan hệ nhân quả.',
      },
      {
        text: 'Là quy ước ngẫu nhiên, không có logic nào phía sau',
        note: 'Cũng không đúng — logic có thật và rất nhất quán, chỉ là logic hình ảnh chứ không phải logic vật lý.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vì sao khi chọn màu xe, yếu tố an toàn nên được xếp trước yếu tố hợp mệnh — nói bằng lời của bạn?',
    answer: (
      <>
        Vì hai thứ này khác nhau về {strong('bằng chứng')}. Màu sáng dễ được nhận biết hơn khi thiếu
        sáng hoặc thời tiết xấu — đó là ảnh hưởng {strong('đo được')} và liên quan trực tiếp tới tính
        mạng. Còn hợp mệnh là một hệ biểu tượng để tham khảo, giúp bạn ưng ý với lựa chọn của mình,
        nhưng {strong('không có gì đảm bảo')} về tài lộc hay may mắn. Khi hai thứ mâu thuẫn, thứ có
        hậu quả đo được phải thắng.
      </>
    ),
  },
];

export function MauSacRecall() {
  return <ActiveRecall topicId="ngu-hanh-mau-sac" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được bảng “hành ↔ màu” dùng để làm gì (thu hẹp lựa chọn màu cho ưng ý) và nó KHÔNG hứa gì (không hứa tài lộc, không cấm màu nào).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Đọc trôi cả hai vòng: tương sinh (Mộc → Hoả → Thổ → Kim → Thuỷ → Mộc) và tương khắc (Mộc khắc Thổ, Thổ khắc Thuỷ, Thuỷ khắc Hoả, Hoả khắc Kim, Kim khắc Mộc).',
  },
  {
    id: 'origin',
    facet: 'Nguồn gốc',
    can: 'Giải thích được VÌ SAO mỗi hành ứng với nhóm màu đó bằng hình ảnh tự nhiên: lửa đỏ, nước đen/xanh dương, cây xanh lá, kim loại trắng bạc, đất vàng nâu.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Áp được hai câu quy tắc cho một năm sinh bất kỳ: màu nên chọn = hành mình + hành sinh mình; màu nên cân nhắc = hành khắc mình.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Không lẫn ba cái bẫy chữ nghĩa: xanh lá (Mộc) khác xanh dương (Thuỷ); vàng thuộc Thổ chứ không thuộc Kim; tím thuộc Hoả chứ không thuộc Thuỷ.',
  },
  {
    id: 'direction',
    facet: 'Chiều quan hệ',
    can: 'Phân biệt được “mình khắc nó” và “nó khắc mình” — chỉ quan hệ hướng vào mình mới dùng để chọn màu.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra được đây là hệ biểu tượng văn hoá (quan hệ tương ứng theo hình ảnh), không phải quy luật vật lý — và nói được điều gì về màu xe là ảnh hưởng THẬT.',
  },
  {
    id: 'priority',
    facet: 'Thứ tự ưu tiên',
    can: 'Nói được vì sao an toàn và giá bán lại phải đứng trước hợp mệnh khi chọn màu xe, và xử lý ra sao khi hai bên mâu thuẫn.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người thân “vì sao mệnh này hợp màu kia” trong khoảng một phút, giữ giọng tham khảo, không hù doạ.',
  },
];

export function MauSacChecklist() {
  return <UnderstandingChecklist topicId="ngu-hanh-mau-sac" facets={FACETS} />;
}

export function MauSacWhys() {
  return (
    <FiveWhys
      topicId="ngu-hanh-mau-sac"
      start={
        <>
          Một người mệnh Kim đã chốt mua chiếc xe màu đỏ vì thích, giá tốt, đúng phiên bản cần. Đến
          phút cuối có người nói “đỏ là Hoả, Hoả khắc Kim, mua là xui cả năm” — thế là huỷ cọc, đổi
          sang màu khác đắt hơn và không ưng bằng.
        </>
      }
      chain={[
        {
          question: 'Vì sao huỷ một chiếc xe đã ưng chỉ vì màu “khắc mệnh” là phản ứng chưa hợp lý?',
          because: (
            <>
              Vì {strong('“khắc mệnh” không phải điều cấm')} — nó là một gợi ý để cân nhắc, không
              định đoạt may rủi và không có gì đảm bảo về tài lộc.
            </>
          ),
        },
        {
          question: 'Vì sao nó chỉ là gợi ý cân nhắc, không phải quy luật?',
          because: (
            <>
              Vì quan hệ “Hoả khắc Kim” là một quan hệ trong{' '}
              {strong('hệ biểu tượng ngũ hành')} — cách người xưa sắp xếp thế giới thành năm nhóm,
              chứ không phải cơ chế vật lý tác động lên chiếc xe hay lên chủ xe.
            </>
          ),
        },
        {
          question: 'Vì sao màu lại được xếp vào hệ biểu tượng ấy ngay từ đầu?',
          because: (
            <>
              Vì màu được gán vào hành theo {strong('hình ảnh tự nhiên')}: lửa cháy đỏ nên đỏ thuộc
              Hoả, kim loại sáng bóng nên trắng bạc thuộc Kim. Đó là quan hệ{' '}
              {strong('giống nhau về hình ảnh')}, không phải quan hệ nhân quả.
            </>
          ),
        },
        {
          question: 'Vì sao phân biệt “giống hình ảnh” với “nhân quả” lại quan trọng đến vậy?',
          because: (
            <>
              Vì nếu tưởng đó là nhân quả, ta sẽ để nó{' '}
              {strong('lấn át những yếu tố có hậu quả đo được')} — an toàn khi lái, chi phí, giá bán
              lại — và đưa ra quyết định tệ hơn về mặt thực tế.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên dùng bảng màu ngũ hành?',
          because: (
            <>
              Vì dùng đúng thì nó là {strong('bộ lọc phụ')}: khi vài phương án đã ngang nhau về an
              toàn, giá và sở thích, bảng màu giúp bạn chốt cho ưng ý. Còn để nó phủ quyết một lựa
              chọn tốt hơn hẳn thì là dùng sai.
            </>
          ),
        },
      ]}
      root={
        <>
          Ngũ hành – màu sắc là một hệ biểu tượng đẹp và mạch lạc để{' '}
          {strong('thu hẹp lựa chọn cho ưng ý')}, không phải bộ luật thưởng phạt. Với một món lớn như
          chiếc xe, hãy để {strong('an toàn đứng trước phong thuỷ')} — rồi trong những phương án còn
          lại, cứ chọn màu bạn thấy hợp với mình.
        </>
      }
    />
  );
}
