/**
 * Nội dung "học chủ động" cho trang /learn/thien-van.
 *
 * GROUNDING — số lần sự kiện và nhãn từng loại được ĐẾM/ĐỌC từ dữ liệu lúc
 * render, không gõ tay. Nguồn: lib/sky-events.ts (SKY_EVENTS 2026–2030 tính sẵn
 * bằng thư viện mã-nguồn-mở astronomy-engine, quy về giờ VN; LUNAR_META /
 * SOLAR_META / SEASON_META) và trang công cụ app/thien-van/page.tsx (nhật thực
 * lọc theo người quan sát tại Hà Nội; nguyệt thực toàn cầu, xem được khi Trăng
 * trên đường chân trời; cảnh báo KHÔNG nhìn thẳng Mặt Trời).
 *
 * Hằng số thiên văn phổ thông (sách giáo khoa, không phải dữ liệu riêng của
 * lib): tuần trăng ~29,53 ngày; quỹ đạo Mặt Trăng nghiêng ~5,1° so với hoàng
 * đạo; chu kỳ Saros ~18 năm 11 ngày; trục Trái Đất nghiêng ~23,4°.
 *
 * PHÂN VAI (chống trùng nội dung): bài này sở hữu CƠ CHẾ nhật/nguyệt thực và ý
 * nghĩa thiên văn của bốn điểm phân – chí. KHÔNG giảng lại 9 sao Cửu Diệu
 * (/learn/sao-han), tháng nhuận – âm dương lịch (/learn/lich-am-duong), chọn
 * ngày (/learn/trach-cat) — chỉ nhắc tên kèm link.
 *
 * Giọng: hiện tượng ĐO ĐƯỢC và TÍNH TRƯỚC ĐƯỢC. Tầng "điềm báo" là văn hoá,
 * nói rõ ra chứ không trộn vào tầng khoa học, và không chế nhạo người tin.
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
import { SKY_EVENTS, LUNAR_META, SOLAR_META } from '@/lib/sky-events';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// Đếm từ chính dữ liệu — bài học không được nói khác công cụ.
const LUNAR = SKY_EVENTS.filter((e) => e.type === 'lunar');
const LUNAR_COUNT = LUNAR.length;
const SOLAR_COUNT = SKY_EVENTS.filter((e) => e.type === 'solar').length;
const SEASON_COUNT = SKY_EVENTS.filter((e) => e.type === 'season').length;

/** Nhãn mức nguyệt thực — đọc từ LUNAR_META, không gõ tay. */
const lunarLabel = (kind: string) => LUNAR_META[kind]?.label ?? kind;

/** Các mức nguyệt thực THỰC SỰ có trong dữ liệu, theo thứ tự xuất hiện. */
const LUNAR_KINDS = Array.from(new Set(LUNAR.map((e) => e.kind)));

export function ThienVanFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Một tin nhắn chuyền đi trong nhóm chat gia đình:{' '}
          {strong('“sắp có trăng máu, kiêng ra đường”')}. Không ai giải thích được vì sao Trăng đỏ, vì
          sao lần này có mà tháng trước không — nên người đọc chỉ còn hai lựa chọn: tin hoặc bỏ qua.
        </>
      }
      why={
        <>
          Vì đây là {strong('hiện tượng tự nhiên đo được')}, không phải chuyện phải tin hay không tin.
          Ngày, giờ, mức che đều {strong('tính trước được hàng nghìn năm')} và ai cũng kiểm chứng được
          bằng cách ra sân ngước lên đúng giờ.
        </>
      }
      what={
        <>
          Nhật thực là {strong('Mặt Trăng che Mặt Trời')}; nguyệt thực là{' '}
          {strong('Trái Đất đổ bóng lên Mặt Trăng')}. Bốn điểm phân – chí là bốn mốc trên hành trình
          Trái Đất quanh Mặt Trời, sinh ra từ việc trục Trái Đất nghiêng.
        </>
      }
      how={
        <>
          Quỹ đạo Mặt Trăng {strong('nghiêng ~5,1°')} so với mặt phẳng quỹ đạo Trái Đất, nên hầu hết
          các tháng Trăng trượt trên hoặc dưới bóng. Chỉ khi trăng tròn hay trăng non rơi đúng lúc
          Trăng ở {strong('giao điểm')} — nơi hai mặt phẳng cắt nhau — mới có thực.
        </>
      }
      soWhat={
        <>
          Để bạn {strong('tách được hai tầng')}: hiện tượng là thật và tính trước được; lớp “điềm báo”
          gắn lên nó là văn hoá. Biết rồi thì lần sau nhận tin “trăng máu”, bạn tra giờ rồi{' '}
          {strong('ra ngắm')} thay vì lo.
        </>
      }
    />
  );
}

export function ThienVanDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="thien-van"
        concept="Vì sao không phải tháng nào cũng có nhật thực"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy tưởng tượng hai chiếc vòng đặt lệch nhau, không nằm phẳng cùng một mặt bàn. Mỗi
                tháng Mặt Trăng đi hết vòng của mình, nhưng vì hai vòng {strong('lệch nhau')} nên phần
                lớn thời gian nó đi {strong('hơi cao hơn hoặc hơi thấp hơn')} chỗ cần đứng để che Mặt
                Trời. Chỉ đôi lần trong năm nó mới đi đúng chỗ.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi {strong('~29,53 ngày')} (một tuần trăng) luôn có đúng một lần trăng non và một
                  lần trăng tròn. Nếu quỹ đạo Mặt Trăng nằm trùng mặt phẳng quỹ đạo Trái Đất thì{' '}
                  {strong('tháng nào cũng có cả nhật thực lẫn nguyệt thực')} — mỗi tháng một cặp, đều
                  đặn.
                </p>
                <p>
                  Nhưng quỹ đạo Mặt Trăng {strong('nghiêng khoảng 5,1°')} — chỉ hơn năm độ mà đủ để
                  cái bóng trượt hụt: trăng non thường đi ngang bên trên hoặc bên dưới đĩa Mặt Trời,
                  trăng tròn thường đi lệch khỏi bóng Trái Đất.
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
                  Hai mặt phẳng nghiêng nhau thì cắt nhau theo một đường thẳng, và đường đó gặp quỹ
                  đạo ở đúng {strong('hai điểm — gọi là giao điểm')}. Thực chỉ xảy ra khi pha sóc
                  (trăng non) hoặc pha vọng (trăng tròn) rơi{' '}
                  {strong('đủ gần một trong hai giao điểm')} — khoảng thời gian ấy gọi là “mùa thực”,
                  đến vài lần mỗi năm chứ không phải mỗi tháng.
                </p>
                <p>
                  Hệ quả: mọi lần thực trong lịch sử loài người đều xảy ra ở{' '}
                  {strong('đúng hai vùng trời')} đó — chính là chi tiết sẽ quay lại ở phần La Hầu – Kế
                  Đô, nơi người xưa đặt tên thần cho hai giao điểm này.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="thien-van"
        concept="Ba mức nguyệt thực: toàn phần, một phần, nửa tối"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bóng của Trái Đất không phải một khối đen duy nhất. Nó có{' '}
                {strong('lõi rất tối')} ở giữa và một {strong('viền mờ mờ')} bao quanh. Mặt Trăng đi
                trọn vào lõi thì tối hẳn và ngả đỏ; chỉ chạm mép lõi thì khuyết một miếng; chỉ đi qua
                viền mờ thì hơi xỉn đi, khó mà nhận ra.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Ba mức ứng đúng ba nhãn trong lịch: {strong(lunarLabel('total'))},{' '}
                  {strong(lunarLabel('partial'))} và {strong(lunarLabel('penumbral'))}. Lõi tối gọi
                  là vùng bóng tối, viền mờ gọi là vùng nửa tối.
                </p>
                <p>
                  Vì sao toàn phần lại {strong('đỏ chứ không biến mất')}? Vì khí quyển Trái Đất bẻ
                  cong ánh sáng Mặt Trời vòng vào trong bóng và lọc mất phần ánh sáng xanh. Thứ bạn
                  nhìn thấy là {strong('toàn bộ hoàng hôn và bình minh trên Trái Đất')} hắt lên đó.
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
                  Mức thực phụ thuộc khoảng cách từ tâm Mặt Trăng tới trục bóng lúc đỉnh: càng gần
                  giao điểm thì càng “ăn sâu” vào bóng tối. Vì thế{' '}
                  {strong('mức thực là hệ quả hình học')}, không phải thang đo mức độ nghiêm trọng.
                  Điểm dễ nhầm: {strong('nguyệt thực nửa tối gần như không nhìn ra')} bằng mắt thường
                  — lịch vẫn liệt kê để bạn không tưởng là bỏ sót, nhưng đừng kỳ vọng một cảnh tượng.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="thien-van"
        concept="Bốn điểm phân – chí sinh ra từ trục nghiêng của Trái Đất"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Trái Đất quay như một con quay bị {strong('nghiêng đi một chút')}, và nó giữ nguyên
                kiểu nghiêng đó suốt vòng đi quanh Mặt Trời. Nửa năm thì nơi ta ở{' '}
                {strong('ngả về phía Mặt Trời')} — ngày dài, trời nóng. Nửa năm còn lại thì ngả ra xa
                — ngày ngắn, trời lạnh.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Trục Trái Đất nghiêng {strong('khoảng 23,4°')}. Trên hành trình một năm có hai lúc
                  trục không nghiêng về phía nào so với Mặt Trời — {strong('xuân phân và thu phân')},
                  ngày và đêm dài gần bằng nhau ở khắp nơi.
                </p>
                <p>
                  Hai lúc còn lại là khi độ nghiêng đạt cực đại về một phía:{' '}
                  {strong('hạ chí')} (ngày dài nhất ở bắc bán cầu) và {strong('đông chí')} (đêm dài
                  nhất). Bốn mốc ấy chia vòng quay một năm thành bốn phần gần đều nhau.
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
                  Nói chính xác hơn: phân – chí được định nghĩa theo{' '}
                  {strong('vị trí biểu kiến của Mặt Trời trên hoàng đạo')}. Điểm phân là lúc Mặt Trời
                  cắt qua xích đạo trời; điểm chí là lúc Mặt Trời đạt độ lệch xa xích đạo trời nhất về
                  bắc hoặc về nam. Vì thế mỗi mốc là {strong('một thời điểm cụ thể tới từng phút')},
                  không phải trọn một ngày.
                </p>
                <p>
                  Đó là lý do lịch ghi cả giờ, và vì sao có năm đông chí rơi vào ngày 21 còn năm khác
                  rơi ngày 22 theo giờ Việt Nam — thời điểm nhích dần vì một năm không dài đúng số
                  nguyên ngày. Việc âm dương lịch {strong('dùng')} mốc đông chí để đặt tháng 11 thuộc
                  về lịch pháp, không phải thiên văn thuần tuý.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="thien-van"
        concept="Vì sao nhật thực tính trước được hàng nghìn năm"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mặt Trăng và Trái Đất đi theo đường của mình rất đều, giống như hai chiếc kim đồng hồ.
                Biết chúng đang ở đâu hôm nay thì {strong('tính ra được chúng ở đâu ngày mai')}, năm
                sau, và cả trăm năm sau. Không cần đoán.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Người xưa phát hiện các lần thực {strong('lặp lại theo chu kỳ Saros')} — khoảng{' '}
                  {strong('18 năm 11 ngày')}. Sau mỗi chu kỳ, lần thực gần như lặp lại, chỉ dịch sang
                  vùng khác trên Trái Đất. Nhờ mẫu lặp này mà người ta dự báo được thực từ rất lâu
                  trước khi có kính thiên văn.
                </p>
                <p>
                  Ngày nay không cần mẫu lặp nữa: máy tính giải thẳng chuyển động của ba thiên thể, ra{' '}
                  {strong('ngày, giờ, phút và mức che')}. Lịch trong công cụ hieu.asia tính bằng một
                  thư viện thiên văn mã nguồn mở, nên đối chiếu nguồn nào cũng khớp.
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
                  Khả năng dự báo này là{' '}
                  {strong('bằng chứng mạnh nhất rằng đây không phải chuyện huyền bí')}: mô hình sai sẽ
                  lệch dần và lộ ra sau vài chu kỳ, còn mô hình cơ học thiên thể thì khớp tới từng
                  phút qua hàng thế kỷ và tính ngược được cho các lần thực ghi trong sử sách. Cũng vì
                  thế, câu “thực báo hiệu biến cố” không đứng vững ngay từ logic:{' '}
                  {strong('một sự kiện đã biết trước hàng thế kỷ thì không báo hiệu điều gì')}.
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
    prompt: 'Nói gọn: nhật thực và nguyệt thực khác nhau ở chỗ nào?',
    answer: (
      <>
        {strong('Nhật thực')}: Mặt Trăng đi vào giữa, che Mặt Trời — xảy ra vào ngày trăng non.{' '}
        {strong('Nguyệt thực')}: Trái Đất đi vào giữa, đổ bóng lên Mặt Trăng — xảy ra vào đêm trăng
        tròn. Hệ quả thực hành: nhật thực phụ thuộc nơi bạn đứng (bóng Trăng chỉ quét một dải hẹp),
        còn nguyệt thực thì ai đang thấy Mặt Trăng trên bầu trời đều xem được.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Vì sao không phải tháng nào cũng có nhật thực và nguyệt thực?',
    choices: [
      {
        text: 'Vì quỹ đạo Mặt Trăng nghiêng ~5,1° so với mặt phẳng quỹ đạo Trái Đất, nên phần lớn các tháng Trăng đi lệch trên hoặc dưới bóng',
        correct: true,
        note: 'Đúng — thực chỉ xảy ra khi trăng non/trăng tròn rơi đủ gần một giao điểm của hai mặt phẳng.',
      },
      {
        text: 'Vì Mặt Trăng có tháng không tròn và không có trăng non',
        note: 'Không — mỗi tuần trăng ~29,53 ngày luôn có đúng một lần trăng non và một lần trăng tròn.',
      },
      {
        text: 'Vì Trái Đất quay quanh trục nên có tháng bóng không đổ tới',
        note: 'Không — chuyện này do độ nghiêng quỹ đạo Mặt Trăng, không liên quan tới vòng quay ngày đêm.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Nguyệt thực toàn phần: vì sao Mặt Trăng ngả đỏ thay vì biến mất hẳn?',
    choices: [
      {
        text: 'Vì khí quyển Trái Đất bẻ cong ánh sáng Mặt Trời vòng vào trong bóng và lọc mất phần ánh sáng xanh',
        correct: true,
        note: 'Đúng — thứ hắt lên Mặt Trăng lúc đó chính là ánh hoàng hôn và bình minh của cả Trái Đất.',
      },
      {
        text: 'Vì bề mặt Mặt Trăng tự phát ra ánh sáng đỏ khi lạnh đi',
        note: 'Không — Mặt Trăng không tự phát sáng, nó chỉ phản chiếu.',
      },
      {
        text: 'Vì bụi vũ trụ giữa Trái Đất và Mặt Trăng nhuộm đỏ ánh sáng',
        note: 'Không — nguyên nhân nằm ở khí quyển Trái Đất, không phải bụi giữa hai thiên thể.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Trong ba mức nguyệt thực, mức nào gần như không nhận ra bằng mắt thường?',
    choices: [
      { text: 'Nguyệt thực toàn phần', note: 'Ngược lại — mức dễ thấy nhất, Mặt Trăng ngả đỏ đồng.' },
      { text: 'Nguyệt thực một phần', note: 'Không — mức này khuyết một mảng rõ, thấy được bằng mắt thường.' },
      { text: 'Nguyệt thực nửa tối', correct: true, note: 'Đúng — Trăng chỉ đi qua vùng nửa tối nên chỉ mờ đi nhẹ.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: 'Bốn điểm phân – chí là gì, và chúng đến từ đâu?',
    answer: (
      <>
        Là bốn mốc trên hành trình một năm của Trái Đất quanh Mặt Trời, sinh ra vì{' '}
        {strong('trục Trái Đất nghiêng ~23,4°')}. Hai điểm {strong('phân')} (xuân phân, thu phân) là
        lúc Mặt Trời cắt qua xích đạo trời — ngày và đêm dài gần bằng nhau. Hai điểm {strong('chí')}{' '}
        (hạ chí, đông chí) là lúc Mặt Trời lệch xa xích đạo trời nhất — ngày dài nhất và đêm dài nhất
        trong năm ở bắc bán cầu.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'La Hầu và Kế Đô trong tục sao hạn thực chất là gì?',
    choices: [
      {
        text: 'Hai giao điểm nơi quỹ đạo Mặt Trăng cắt hoàng đạo — đúng nơi xảy ra nhật thực và nguyệt thực',
        correct: true,
        note: 'Đúng — không phải thiên thể; đó là hai điểm hình học, và người xưa dựng thần thoại quanh chúng vì thấy Mặt Trời, Mặt Trăng “bị nuốt” ở đó.',
      },
      {
        text: 'Hai hành tinh nhỏ chỉ nhìn thấy được lúc có thực',
        note: 'Không — không có thiên thể nào tương ứng; đây là hai giao điểm quỹ đạo.',
      },
      {
        text: 'Hai ngôi sao trong chòm sao gần hoàng đạo',
        note: 'Không — chúng không phải sao, mà là điểm cắt của hai mặt phẳng quỹ đạo.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Xem nhật thực thế nào cho an toàn?',
    choices: [
      {
        text: 'Dùng kính lọc chuyên dụng — tuyệt đối không nhìn thẳng Mặt Trời bằng mắt thường',
        correct: true,
        note: 'Đúng — cảnh báo này có ngay trong mô tả nhật thực của công cụ. Nguyệt thực thì ngược lại: nhìn bằng mắt thường hoàn toàn an toàn.',
      },
      {
        text: 'Nheo mắt nhìn nhanh vài giây thì không sao',
        note: 'Không — tổn thương võng mạc có thể xảy ra mà bạn không thấy đau, vì võng mạc không có thụ thể đau.',
      },
      {
        text: 'Nhìn qua kính râm hoặc phim chụp X-quang là đủ',
        note: 'Không — kính râm thông thường không chặn đủ; phải là kính lọc chuyên dụng cho quan sát Mặt Trời.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'open',
    prompt:
      'Vận dụng: một người nói “sắp có nguyệt thực, chắc năm nay có biến”. Bạn trả lời thế nào cho vừa đúng vừa tử tế?',
    answer: (
      <>
        Đại ý: lần nguyệt thực đó {strong('đã được tính từ rất lâu trước')} và ai cũng đối chiếu được.
        Một sự kiện biết trước hàng thế kỷ thì {strong('không báo hiệu điều gì')} — nó chỉ báo rằng ba
        thiên thể sắp thẳng hàng. Phần “điềm báo” là {strong('lớp văn hoá')} người xưa gắn lên khi
        chưa biết cơ chế: ghi nhận như một câu chuyện đẹp, nhưng đừng để nó quyết định việc của mình.
        Rồi rủ họ ra sân xem cùng.
      </>
    ),
  },
];

export function ThienVanRecall() {
  return <ActiveRecall topicId="thien-van" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được lịch thiên văn dùng để làm gì (biết trước ngày giờ các hiện tượng xem được tại Việt Nam) — và nó KHÔNG dùng để làm gì (không phải lịch chọn ngày tốt, không phải bảng điềm báo).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả được thứ tự thẳng hàng của hai loại thực: nhật thực có Mặt Trăng ở giữa vào ngày trăng non; nguyệt thực có Trái Đất ở giữa vào đêm trăng tròn.',
  },
  {
    id: 'key-insight',
    facet: 'Chốt lõi',
    can: 'Giải thích được vì sao không có thực mỗi tháng: quỹ đạo Mặt Trăng nghiêng ~5,1°, nên chỉ khi pha trăng rơi gần một giao điểm mới xảy ra thực.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Phân biệt ba mức nguyệt thực (toàn phần, một phần, nửa tối) theo việc Trăng đi vào vùng bóng tối hay chỉ vùng nửa tối.',
  },
  {
    id: 'seasons',
    facet: 'Phân – chí',
    can: 'Nói được bốn điểm phân – chí đến từ trục nghiêng ~23,4° của Trái Đất, và mỗi mốc là một thời điểm cụ thể tới từng phút chứ không phải trọn một ngày.',
  },
  {
    id: 'prediction',
    facet: 'Tính trước được',
    can: 'Giải thích vì sao thực dự báo được hàng nghìn năm (chuyển động cơ học đều đặn, chu kỳ Saros ~18 năm 11 ngày) — và vì sao điều đó bác bỏ cách đọc “điềm báo”.',
  },
  {
    id: 'bridge',
    facet: 'Cây cầu văn hoá',
    can: 'Chỉ ra La Hầu và Kế Đô trong tục sao hạn chính là hai giao điểm quỹ đạo, và tách được hai tầng: hiện tượng có thật, cách diễn giải là văn hoá.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Nói được lịch này KHÔNG trả lời chuyện tháng nhuận hay chọn ngày tốt, và biết những câu đó thuộc về bài khác.',
  },
  {
    id: 'safety',
    facet: 'An toàn',
    can: 'Nhớ rằng quan sát nhật thực phải dùng kính lọc chuyên dụng, tuyệt đối không nhìn thẳng Mặt Trời — còn nguyệt thực thì xem bằng mắt thường hoàn toàn an toàn.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người thân trong một phút vì sao “trăng máu” không phải điềm dữ, bằng giọng bình tĩnh chứ không chế nhạo niềm tin của họ.',
  },
];

export function ThienVanChecklist() {
  return <UnderstandingChecklist topicId="thien-van" facets={FACETS} />;
}

export function ThienVanWhys() {
  return (
    <FiveWhys
      topicId="thien-van"
      start={
        <>
          Một tin nhắn lan trong nhóm chat: “tối nay có trăng máu, kiêng ra ngoài, kiêng ký kết”. Vài
          người chuyển tiếp cho cả nhà, vài người thấy vô lý nhưng không biết nói lại thế nào.
        </>
      }
      chain={[
        {
          question: 'Vì sao không có lý do gì phải kiêng vì một lần nguyệt thực?',
          because: (
            <>
              Vì nguyệt thực chỉ là {strong('bóng của Trái Đất đổ lên Mặt Trăng')} — một hiện tượng
              quang học. Không có cơ chế nào để cái bóng đó tác động tới một buổi ký kết hay một
              chuyến đi.
            </>
          ),
        },
        {
          question: 'Vì sao ta chắc chắn đó chỉ là chuyện hình học, không phải điều gì bí ẩn?',
          because: (
            <>
              Vì nó {strong('tính trước được tới từng phút')}, hàng thế kỷ trước khi xảy ra, và tính
              ngược lại được cho các lần thực ghi trong sử sách. Một mô hình sai sẽ lệch dần và lộ ra;
              mô hình này thì khớp mãi.
            </>
          ),
        },
        {
          question: 'Vậy vì sao thực không xảy ra đều đặn mỗi tháng như trăng tròn?',
          because: (
            <>
              Vì quỹ đạo Mặt Trăng {strong('nghiêng ~5,1°')} so với mặt phẳng quỹ đạo Trái Đất, nên
              hầu hết các tháng Trăng đi trượt trên hoặc dưới bóng. Chỉ khi pha trăng rơi gần{' '}
              {strong('giao điểm')} của hai mặt phẳng mới có thực.
            </>
          ),
        },
        {
          question: 'Nếu đơn giản vậy, vì sao người xưa lại sợ đến mức dựng thành thần thoại?',
          because: (
            <>
              Vì họ chưa có mô hình giải thích, mà lại {strong('quan sát rất chính xác')}: mọi lần
              “nuốt” đều xảy ra ở đúng hai vùng trời. Họ đặt tên cho hai vùng đó —{' '}
              {strong('La Hầu và Kế Đô')} — rồi gán cho chúng tính che khuất, xáo trộn.
            </>
          ),
        },
        {
          question: 'Hiểu tới đây thì nên phản ứng thế nào cho đúng?',
          because: (
            <>
              {strong('Tách hai tầng')}: giữ câu chuyện La Hầu – Kế Đô như một di sản văn hoá đáng
              trân trọng, nhưng đừng để nó quyết định việc thật của mình. Cách phản hồi tử tế nhất
              không phải chê người gửi tin mê tín, mà là{' '}
              {strong('mở lịch ra, chỉ giờ đỉnh thực, rồi rủ nhau cùng xem')}.
            </>
          ),
        },
      ]}
      root={
        <>
          Bầu trời không gửi thông điệp cho ai — nó chỉ chuyển động, đều đặn tới mức con người tính
          trước được hàng nghìn năm. Hiểu điều đó, bạn giữ được cả{' '}
          {strong('sự tôn trọng dành cho tri thức người xưa')} lẫn{' '}
          {strong('sự bình tĩnh của người biết chuyện gì đang xảy ra')}.
        </>
      }
    />
  );
}

/** Ghi chú nguồn dưới bảng sự kiện (page.tsx) — mọi con số đếm từ SKY_EVENTS. */
export function ThienVanDataNote() {
  return (
    <p className="text-sm text-foreground/70">
      Toàn bộ bảng trong bài lấy thẳng từ dữ liệu của công cụ <strong>lịch thiên văn</strong>:{' '}
      {LUNAR_COUNT} lần nguyệt thực, {SOLAR_COUNT} lần nhật thực quan sát được từ Việt Nam và{' '}
      {SEASON_COUNT} mốc phân – chí. Nhãn từng loại cũng là nhãn công cụ dùng (
      {LUNAR_KINDS.map(lunarLabel).join(' · ')} · {SOLAR_META.label}) — hai nơi không thể nói hai
      kiểu.
    </p>
  );
}
