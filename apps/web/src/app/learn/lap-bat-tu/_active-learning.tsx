/**
 * Nội dung "học chủ động" cho trang /learn/lap-bat-tu.
 *
 * GROUNDING — mọi cặp can chi xuất hiện ở đây do CHÍNH engine sinh ra lúc build,
 * không gõ tay chữ nào:
 *   • lib/bazi.ts → calculateBazi(): trụ NĂM đổi tại Lập Xuân (Mặt Trời tới kinh
 *     độ hoàng đạo 315°), KHÔNG đổi ở Tết; trụ THÁNG theo 12 "tiết" (mỗi cung 30°
 *     kinh độ Mặt Trời), can tháng suy từ can năm theo Ngũ Hổ Độn; trụ NGÀY chạy
 *     theo chu kỳ 60 ngày liên tục (neo 1990-05-20 = Ất Dậu, đối chiếu với engine
 *     lịch âm sẵn có); trụ GIỜ: chi = floor(((giờ + 1) % 24) / 2) nên 23h đã là
 *     giờ Tý, can giờ suy từ can ngày theo Ngũ Thử Độn. Giờ nhập được engine hiểu
 *     là giờ Việt Nam (UTC+7) — xem `julianDay(Y, M, D, hour - 7, minute)`.
 *   • trang công cụ app/la-so-bat-tu/page.tsx: nhập ngày sinh dương lịch + giờ +
 *     giới tính; ba trụ năm/tháng/ngày không phụ thuộc giờ, chỉ trụ giờ phụ thuộc.
 *
 * PHÂN VAI (không lấn bài khác): trang này CHỈ dạy QUY TRÌNH LẬP tứ trụ.
 *   – Nhật Chủ, Thập Thần, vượng/nhược, Dụng Thần → /learn/bat-tu.
 *   – Bộ máy 10 can × 12 chi và vòng 60 → /learn/can-chi.
 *   – 24 tiết khí → /learn/tiet-khi.
 *
 * Giọng: lập trụ là phép PHIÊN DỊCH thời điểm, tính được và kiểm được — không
 * phán số mệnh, không hù doạ.
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
import { calculateBazi } from '@/lib/bazi';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── Dữ kiện lấy THẲNG từ engine (chạy lúc build) ────────────────────────────
const chartOf = (date: string, hour: number, minute = 0) =>
  calculateBazi({ birthSolarDate: date, birthHour: hour, birthMinute: minute });

const label = (p: { can: string; chi: string }) => `${p.can} ${p.chi}`;

// Mùng 1 Tết Quý Mùi rơi vào 01/02/2003, nhưng Lập Xuân 2003 đến sau đó vài
// ngày → engine vẫn xếp người sinh hôm Tết vào trụ năm CŨ.
const TET_2003 = label(chartOf('2003-02-01', 12).year);
const SAU_LAP_XUAN_2003 = label(chartOf('2003-02-05', 12).year);

// Hai ca sinh cách nhau đúng một tiếng, nhưng vắt qua nửa đêm dương lịch.
const DEM_TRUOC = chartOf('2026-03-10', 23, 30);
const DEM_SAU = chartOf('2026-03-11', 0, 30);

// Trụ tháng quanh mốc tiết Bạch Lộ 2026 (lấy mốc 12h trưa giờ VN) — mùng 1
// tháng 8 âm năm ấy rơi vào 11/09, tức SAU khi trụ tháng đã đổi.
const THANG_TRUOC_TIET = label(chartOf('2026-09-07', 12).month);
const THANG_SAU_TIET = label(chartOf('2026-09-08', 12).month);

export function LapBatTuFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn nhập cùng một ngày giờ sinh vào hai trang khác nhau và nhận về{' '}
          {strong('hai lá Bát Tự không giống nhau')} — trụ năm lệch một bậc, hoặc trụ tháng lệch
          hẳn. Không ai giải thích vì sao, nên bạn không biết tin bên nào.
        </>
      }
      why={
        <>
          Vì trước khi luận được bất cứ điều gì, người ta phải {strong('lập')} tứ trụ đã. Bước lập
          này có vài {strong('mốc quy ước')} mà mỗi nơi chọn một kiểu. Không biết mốc, bạn không có
          cách nào kiểm tra kết quả — và cũng không biết hai bên đang khác nhau ở đâu.
        </>
      }
      what={
        <>
          Lập tứ trụ là {strong('phiên dịch một thời điểm sang bốn cặp tên')}: từ ngày giờ sinh
          dương lịch ra trụ năm, trụ tháng, trụ ngày, trụ giờ. Nó là một phép tính lịch pháp có đáp
          án xác định — {strong('không phải phần luận giải')}, cũng chưa nói gì về con người bạn.
        </>
      }
      how={
        <>
          Bốn trụ suy từ bốn nguồn khác nhau: trụ năm đổi ở {strong('Lập Xuân')}, trụ tháng đổi theo{' '}
          {strong('tiết khí')}, trụ ngày chạy theo {strong('chu kỳ 60 ngày liên tục')}, còn can trụ
          giờ suy từ {strong('can ngày')} theo phép Ngũ Thử Độn.
        </>
      }
      soWhat={
        <>
          Để bạn {strong('tự kiểm được lá số của mình')}: biết chỗ nào dễ lệch, biết hỏi một nguồn
          đúng ba câu (đổi trụ năm ở đâu, đổi trụ tháng theo gì, giờ nhập là múi giờ nào) là đủ để
          phân biệt “khác quy ước” với “tính sai”.
        </>
      }
    />
  );
}

export function LapBatTuDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="lap-bat-tu"
        concept="Lập tứ trụ = phiên dịch một thời điểm sang 4 cặp tên"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy tưởng tượng bạn viết địa chỉ nhà: số nhà, tên ngõ, tên phố, tên phường — bốn
                mảnh ghép lại chỉ đúng một chỗ. Lập tứ trụ cũng vậy, chỉ là{' '}
                {strong('địa chỉ của một khoảnh khắc')}: năm nào, tháng nào, ngày nào, giờ nào. Mỗi
                mảnh viết bằng hai chữ, bốn mảnh thành tám chữ.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Bạn đưa vào {strong('ngày sinh dương lịch và giờ sinh')}; máy trả ra bốn cặp
                  can–chi. Đó là một phép đổi hệ đơn vị, giống đổi từ mét sang inch: cùng một thời
                  điểm, viết bằng bộ chữ khác.
                </p>
                <p>
                  Điều quan trọng cần tách bạch: bước này{' '}
                  {strong('chưa nói gì về tính cách hay số phận')}. Nó chỉ trả lời “thời điểm ấy tên
                  là gì”. Việc đọc bốn cặp tên ấy ra ý nghĩa là một môn khác, đứng sau, và có luật
                  riêng.
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
                  Đầu vào của engine đúng ba thứ: ngày dương lịch, giờ, phút. Đầu ra là bốn cặp
                  can–chi cùng vài dữ kiện tra bảng đi kèm. Toàn bộ là{' '}
                  {strong('hàm xác định')} — cùng đầu vào luôn ra cùng đầu ra, và bất kỳ ai cũng
                  kiểm lại được.
                </p>
                <p>
                  Hệ quả thực hành: nếu hai nguồn cho hai kết quả khác nhau,{' '}
                  {strong('chắc chắn có một khác biệt về quy ước hoặc về đầu vào')} — mốc đổi năm,
                  cách xác định tháng, múi giờ, hay mốc đổi ngày. Không có chỗ cho “mỗi thầy một
                  kiểu” ở bước này.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="lap-bat-tu"
        concept="Vì sao trụ năm và trụ tháng bám Mặt Trời, không bám Mặt Trăng"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Có hai cách chia một năm. Cách thứ nhất đếm theo {strong('trăng tròn trăng khuyết')}
                . Cách thứ hai đếm theo {strong('mùa')} — trời ấm dần hay lạnh dần. Tứ trụ chọn cách
                thứ hai, vì nó nói chuyện mùa màng chứ không nói chuyện trăng.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Lịch âm dân dụng chia năm theo tuần trăng, nên ngày Tết trôi qua lại trong khoảng
                  một tháng dương lịch. Còn tứ trụ chia năm theo{' '}
                  {strong('vị trí thật của Mặt Trời')}: cứ Mặt Trời đi thêm 30° trên vòng hoàng đạo
                  là sang một tháng mới, và mốc mở đầu vòng là Lập Xuân.
                </p>
                <p>
                  Vì thế trụ năm {strong('không đổi vào mùng 1 Tết')} và trụ tháng{' '}
                  {strong('không đổi vào mùng 1 âm lịch')}. Hai hệ chạy song song, thỉnh thoảng rơi
                  gần nhau nên dễ tưởng là một.
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
                  Engine tính kinh độ hoàng đạo của Mặt Trời rồi cắt vòng tròn thành 12 cung 30°,
                  lấy 315° (Lập Xuân) làm mốc mở đầu cung Dần. Trụ năm đổi đúng tại 315°; trụ tháng
                  đổi tại mỗi bội số 30° kế tiếp. Đây là{' '}
                  {strong('mốc theo giây, không phải theo ngày')}: crossing rơi vào giữa ngày thì
                  nửa ngày trước và nửa ngày sau thuộc hai trụ khác nhau.
                </p>
                <p>
                  Đó là lý do phải nhập giờ, và nhập giờ đúng múi. Với người sinh sát mốc, chênh vài
                  chục phút đủ để đổi trụ — trường hợp hiếm, nhưng có thật, và{' '}
                  {strong('không có mẹo nhẩm nào thay được việc tra')}. Chi tiết 24 tiết khí là chủ
                  đề của một bài riêng; ở đây chỉ cần nhớ đúng vai trò của chúng trong việc lập trụ.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="lap-bat-tu"
        concept="Trụ ngày — sợi dây 60 chạy không nghỉ"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy tưởng tượng một xâu hạt gồm 60 hạt, mỗi hạt một cái tên, xâu thành vòng tròn.
                Mỗi ngày trôi qua bạn nhích sang {strong('đúng một hạt')}. Hết vòng thì quay lại hạt
                đầu, và cứ thế mãi — không dừng vào Tết, không dừng vào đầu tháng.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Trụ ngày là trụ {strong('đơn giản nhất mà cũng khó tự nhẩm nhất')}. Đơn giản vì
                  luật chỉ có một câu: mỗi ngày tiến một bước trong vòng 60, không có ngoại lệ nào.
                  Khó vì muốn biết hôm nay là ngày gì thì phải đếm từ một ngày đã biết.
                </p>
                <p>
                  Điểm cần nhớ: trụ ngày {strong('hoàn toàn không phụ thuộc')} trụ năm hay trụ
                  tháng. Nó không “khởi lại” vào Lập Xuân, cũng không quan tâm tháng âm nào. Đó là
                  một cái đồng hồ riêng, chạy đều từ rất lâu trước khi bạn sinh ra.
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
                  Engine neo vào một ngày đã đối chiếu được, rồi lấy hiệu số ngày Julius để suy vị
                  trí trong vòng 60. Vì vậy trụ ngày là{' '}
                  {strong('phép đếm thuần tuý, không dính tiết khí')} — nó chỉ cần biết ngày dương
                  lịch, không cần biết giờ.
                </p>
                <p>
                  Chỗ duy nhất giờ sinh chen vào là {strong('mốc đổi ngày')}. Công cụ này đổi trụ
                  ngày lúc 0h dương lịch. Một số trường phái đổi ngay từ 23h — cùng một người sinh
                  lúc 23h30 sẽ nhận hai trụ ngày khác nhau ở hai hệ. Khác quy ước, không phải bên
                  nào tính sai; và người sinh trong khung 23h–24h nên biết mình đang ở đúng chỗ nhạy
                  cảm đó.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="lap-bat-tu"
        concept="Ngũ Thử Độn — vì sao can giờ phải hỏi can ngày"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mười hai khung giờ trong ngày đã có sẵn tên chi: Tý, Sửu, Dần… Nhưng để gọi đủ tên
                một khung giờ, người ta cần thêm một chữ nữa ở phía trước.{' '}
                {strong('Chữ ấy mượn từ tên của ngày hôm đó')} — nên biết hôm nay là ngày gì thì
                mới gọi đúng tên giờ.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Chi giờ dễ: cứ hai tiếng một khung, cố định quanh năm. Còn can giờ thì{' '}
                  {strong('thay đổi theo từng ngày')}. Luật gọi là Ngũ Thử Độn: can ngày quyết định
                  can của giờ Tý, rồi từ đó chạy tiếp theo thứ tự cho 11 khung còn lại.
                </p>
                <p>
                  Hệ quả cần nhớ: {strong('sai trụ ngày là sai luôn cả trụ giờ')}. Hai trụ này nối
                  nhau, không độc lập. Đó cũng là lý do người ta hay nói trụ ngày là mắt xích quan
                  trọng nhất về mặt kỹ thuật khi lập lá số.
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
                  Vì 10 can và 12 khung giờ không chia hết cho nhau, sau một ngày (12 khung) dãy can
                  đã nhích đi 2 bước. Nên can của giờ Tý lặp lại{' '}
                  {strong('sau mỗi 5 ngày')}, và đó là lý do bảng tra chỉ cần 5 nhóm can ngày thay
                  vì 10.
                </p>
                <p>
                  Engine làm đúng như vậy: lấy can khởi của giờ Tý theo can ngày, rồi cộng chỉ số
                  khung giờ. Bảng tra ở phần dưới của bài{' '}
                  {strong('được sinh ra từ chính engine lúc dựng trang')}, nên không thể lệch với
                  kết quả bạn thấy trong công cụ.
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
    prompt: 'Kể tên nguồn dữ liệu riêng của từng trụ: năm, tháng, ngày, giờ suy ra từ đâu?',
    answer: (
      <>
        {strong('Trụ năm')}: đổi tại Lập Xuân, tức theo vị trí Mặt Trời chứ không theo Tết.{' '}
        {strong('Trụ tháng')}: theo tiết khí (mỗi cung 30° của Mặt Trời), can tháng suy từ can năm.{' '}
        {strong('Trụ ngày')}: đếm liên tục trong vòng 60 ngày, không phụ thuộc năm hay tháng.{' '}
        {strong('Trụ giờ')}: chi lấy theo khung hai tiếng, can suy từ can ngày theo Ngũ Thử Độn.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Một người sinh đúng mùng 1 Tết. Trụ năm của người đó là năm nào?',
    choices: [
      {
        text: 'Có thể vẫn là năm cũ — vì trụ năm đổi ở Lập Xuân, không đổi ở Tết',
        correct: true,
        note: `Đúng — sinh mùng 1 Tết Quý Mùi (01/02/2003), engine vẫn trả trụ năm ${TET_2003}; phải qua Lập Xuân mới thành ${SAU_LAP_XUAN_2003}.`,
      },
      {
        text: 'Luôn là năm mới — vì Tết là mốc đổi năm của lịch truyền thống',
        note: 'Không — đó là mốc của lịch âm dân dụng. Mệnh lý Bát Tự dùng mốc Lập Xuân, và hai mốc có thể cách nhau tới vài tuần.',
      },
      {
        text: 'Luôn là năm cũ — vì Lập Xuân luôn đến sau Tết',
        note: 'Không — thứ tự hai mốc thay đổi theo từng năm: có năm Tết đến trước Lập Xuân, có năm ngược lại.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Trụ tháng đổi vào thời điểm nào?',
    choices: [
      {
        text: 'Vào mùng 1 âm lịch hằng tháng',
        note: 'Không — đó là mốc của lịch âm. Trụ tháng không quan tâm tuần trăng.',
      },
      {
        text: 'Vào ngày 1 dương lịch hằng tháng',
        note: 'Không — trụ tháng cũng không bám lịch dương; hai hệ chỉ tình cờ gần nhau.',
      },
      {
        text: 'Vào thời điểm bắt đầu mỗi tiết (mỗi khi Mặt Trời đi thêm 30°)',
        correct: true,
        note: `Đúng — ví dụ quanh mốc tiết đầu tháng 9/2026: ngày 07/09 còn là ${THANG_TRUOC_TIET}, ngày 08/09 đã sang ${THANG_SAU_TIET}, dù âm lịch vẫn đang trong cùng một tháng.`,
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Muốn biết can của trụ giờ, bạn cần biết trước điều gì?',
    choices: [
      { text: 'Can của trụ năm', note: 'Không — can năm dùng để suy can THÁNG (Ngũ Hổ Độn), không dùng cho giờ.' },
      {
        text: 'Can của trụ ngày',
        correct: true,
        note: 'Đúng — đó là phép Ngũ Thử Độn: can ngày quyết định can của giờ Tý, rồi chạy tiếp cho 11 khung còn lại.',
      },
      {
        text: 'Không cần gì thêm — mỗi khung giờ có một can cố định',
        note: 'Không — chỉ CHI giờ là cố định theo khung hai tiếng; can giờ đổi theo từng ngày.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vì sao sai giờ sinh một chút lại có thể làm lệch nhiều hơn một trụ, dù chỉ trụ giờ mới nhìn tới giờ?',
    answer: (
      <>
        Vì có hai chỗ giờ sinh chen vào. Thứ nhất, {strong('mốc đổi ngày')}: sinh sát nửa đêm thì
        lệch một chút là đổi trụ ngày, mà đổi trụ ngày thì can giờ cũng đổi theo (Ngũ Thử Độn). Thứ
        hai, {strong('mốc tiết khí')}: các mốc này rơi vào một thời điểm cụ thể trong ngày, nên
        người sinh sát mốc có thể đổi cả trụ tháng, thậm chí trụ năm nếu là mốc Lập Xuân.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt:
      'Hai trang web cho hai lá Bát Tự khác nhau từ cùng một ngày giờ sinh. Cách hiểu đúng nhất?',
    choices: [
      {
        text: 'Chắc chắn một bên tính sai, bên còn lại đúng',
        note: 'Chưa chắc — khác biệt phổ biến nhất đến từ quy ước (mốc đổi năm, mốc đổi ngày, múi giờ), không phải từ lỗi tính.',
      },
      {
        text: 'Bát Tự vốn mỗi thầy một kiểu nên khác nhau là bình thường',
        note: 'Không — bước LẬP trụ là phép tính xác định, không có chỗ cho cảm tính. Chỉ phần luận giải mới có nhiều trường phái.',
      },
      {
        text: 'Nên hỏi mỗi nguồn: đổi trụ năm ở Tết hay Lập Xuân, trụ tháng theo tiết khí hay theo tháng âm, và giờ nhập là múi giờ nào',
        correct: true,
        note: 'Đúng — ba câu đó gần như luôn chỉ ra chỗ lệch, và giúp bạn phân biệt “khác quy ước” với “tính sai”.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vận dụng: sinh 23h30 ngày 10/03/2026 và sinh 00h30 ngày 11/03/2026 — cách nhau đúng một tiếng. Trên công cụ này, hai người khác nhau ở trụ nào?',
    answer: (
      <>
        Khác ở {strong('cả trụ ngày lẫn trụ giờ')}. Người trước có trụ ngày{' '}
        {strong(label(DEM_TRUOC.day))} và trụ giờ {strong(label(DEM_TRUOC.hour))}; người sau có trụ
        ngày {strong(label(DEM_SAU.day))} và trụ giờ {strong(label(DEM_SAU.hour))}. Hai trụ năm và
        tháng giữ nguyên. Chú ý: {strong('chi giờ của cả hai đều là Tý')} — vì khung Tý bắt đầu từ
        23h — nhưng vì trụ ngày đã sang ngày mới nên can giờ đổi theo.
      </>
    ),
  },
];

export function LapBatTuRecall() {
  return <ActiveRecall topicId="lap-bat-tu" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được lập tứ trụ giải quyết việc gì (đổi một thời điểm sinh thành 4 cặp can chi) và nó KHÔNG làm gì (chưa luận, chưa phán về con người).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Chỉ ra được mỗi trụ lấy dữ liệu từ đâu: trụ năm và trụ tháng bám vị trí Mặt Trời, trụ ngày bám phép đếm liên tục, trụ giờ bám khung hai tiếng cộng can ngày.',
  },
  {
    id: 'year-boundary',
    facet: 'Mốc trụ năm',
    can: 'Giải thích được vì sao trụ năm đổi ở Lập Xuân chứ không ở Tết, và vì sao có người sinh sau Tết mà trụ năm vẫn là năm cũ (hoặc ngược lại).',
  },
  {
    id: 'month-boundary',
    facet: 'Mốc trụ tháng',
    can: 'Nói được trụ tháng đổi theo tiết khí, không đổi vào mùng 1 âm lịch — và nêu được một ví dụ hai mốc lệch nhau.',
  },
  {
    id: 'chain',
    facet: 'Chuỗi phụ thuộc',
    can: 'Vẽ được dây chuyền: can năm → can tháng (Ngũ Hổ Độn), can ngày → can giờ (Ngũ Thử Độn) — nên sai một mắt là lệch cả chuỗi.',
  },
  {
    id: 'hour',
    facet: 'Trụ giờ',
    can: 'Biết chi giờ chia theo khung hai tiếng bắt đầu từ 23h, và biết can giờ phải tra từ can ngày chứ không cố định.',
  },
  {
    id: 'boundary-risk',
    facet: 'Ca sát ranh giới',
    can: 'Nhận ra mình có phải ca nhạy cảm không: sinh quanh nửa đêm, sinh sát một mốc tiết khí, hoặc sinh ở múi giờ khác Việt Nam.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt được “hai nguồn khác quy ước” với “một nguồn tính sai”, và biết hỏi đúng ba câu để tìm ra chỗ lệch.',
  },
  {
    id: 'limits',
    facet: 'Ranh giới',
    can: 'Nói rõ lập trụ đúng KHÔNG làm cho phần luận giải trở thành phép đo — đây là hệ đặt tên mang tính biểu tượng, không phán số mệnh.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người khác trong hai phút: bốn trụ ra từ đâu, hai cái bẫy thời điểm nằm ở chỗ nào, và khi nào cần cẩn thận với giờ sinh.',
  },
];

export function LapBatTuChecklist() {
  return <UnderstandingChecklist topicId="lap-bat-tu" facets={FACETS} />;
}

export function LapBatTuWhys() {
  return (
    <FiveWhys
      topicId="lap-bat-tu"
      start={
        <>
          Một người nhập cùng ngày giờ sinh vào hai trang Bát Tự và nhận hai kết quả khác nhau: một
          bên ghi trụ năm là năm này, bên kia ghi năm liền trước. Kết luận vội thường là “một bên
          lừa đảo”.
        </>
      }
      chain={[
        {
          question: 'Vì sao kết luận “một bên lừa đảo” là vội?',
          because: (
            <>
              Vì việc lập trụ là {strong('phép tính xác định')} — không ai bịa ra được. Khác nhau ở
              bước này gần như luôn là {strong('khác quy ước')}, và quy ước thì tra ra được.
            </>
          ),
        },
        {
          question: 'Quy ước nào có thể khác nhau tới mức đổi cả trụ năm?',
          because: (
            <>
              {strong('Mốc đổi năm')}. Lịch âm dân dụng đổi năm vào Tết; mệnh lý Bát Tự đổi trụ năm
              tại {strong('Lập Xuân')}. Hai mốc này không trùng nhau và thứ tự trước–sau còn thay
              đổi theo từng năm.
            </>
          ),
        },
        {
          question: 'Vì sao mệnh lý lại chọn Lập Xuân chứ không chọn Tết cho gọn?',
          because: (
            <>
              Vì tứ trụ đọc thời điểm theo {strong('mùa và khí')} — tức theo vị trí Mặt Trời. Tết
              neo vào tuần trăng nên trôi qua lại trong khoảng một tháng dương lịch, không dùng làm
              mốc mùa được. Lập Xuân thì luôn ứng với đúng một vị trí Mặt Trời.
            </>
          ),
        },
        {
          question: 'Vì sao lệch một mốc lại kéo theo lệch nhiều hơn một trụ?',
          because: (
            <>
              Vì các trụ {strong('nối vào nhau')}: can năm quyết định can tháng, can ngày quyết định
              can giờ. Đổi trụ năm là đổi luôn can tháng; đổi trụ ngày là đổi luôn can giờ. Một mắt
              xích sai kéo theo cả chuỗi.
            </>
          ),
        },
        {
          question: 'Hiểu tới đây thì nên làm gì khi gặp hai kết quả khác nhau?',
          because: (
            <>
              Hỏi mỗi nguồn đúng ba câu: {strong('đổi trụ năm ở Tết hay Lập Xuân')},{' '}
              {strong('trụ tháng theo tiết khí hay theo tháng âm')}, và{' '}
              {strong('giờ nhập được hiểu theo múi giờ nào')}. Nguồn nào không trả lời được thì đó
              mới là dấu hiệu đáng ngại — chứ không phải việc nó ra kết quả khác.
            </>
          ),
        },
      ]}
      root={
        <>
          Lập tứ trụ không phải chỗ để tin hay không tin: nó là một phép phiên dịch có luật, kiểm
          được từng bước. Hiểu luật ấy, bạn {strong('cầm được lá số của chính mình')} — biết nó đúng
          ở đâu, nhạy cảm ở đâu — trước khi bước sang phần luận giải, nơi mới thật sự cần thận trọng.
        </>
      }
    />
  );
}
