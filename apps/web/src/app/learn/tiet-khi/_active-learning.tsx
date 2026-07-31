/**
 * Nội dung "học chủ động" cho trang /learn/tiet-khi.
 *
 * GROUNDING — mọi con số đều nội suy từ chính engine mà trang cha dùng, KHÔNG gõ
 * tay: lib/western-astrology.ts (sunLongitude/julianDay → dò 24 mốc 15° bằng
 * phép chia đôi), lib/bazi.ts (monthPillarOf dùng
 * `sector = floor(mod(sunLon − 315, 360)/30)` và `chi = sector + 2` ⇒ trụ tháng
 * đổi tại 12 mốc 30° tức 12 Tiết, gốc 315° = Lập Xuân = tháng Dần;
 * calculateBazi cho ví dụ sát ranh giới), lib/ngay-kieng-ky.ts (solarToLunar).
 *
 * PHÂN VAI: KHÔNG giảng lại tháng nhuận / Meton / múi giờ Tết lệch
 * (/learn/lich-am-duong) và KHÔNG giảng lại cơ chế thiên văn của bốn điểm
 * phân – chí (/learn/thien-van) — chỉ nhắc kèm để nối mạch.
 *
 * Giọng: tách bạch lớp thiên văn đo được với lớp nông lịch – phong tục gắn lên
 * nó. Không phán ngày tốt xấu.
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
import { julianDay, sunLongitude } from '@/lib/western-astrology';
import { calculateBazi, monthPillarOf } from '@/lib/bazi';
import { solarToLunar } from '@/lib/ngay-kieng-ky';

const TOPIC = 'tiet-khi';
const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── Dữ kiện lấy thẳng từ engine ─────────────────────────────────────
// Cùng phép dò tiết khí như trang cha (và như `solarTermJD` trong lib/bazi.ts),
// chỉ chạy cho vài mốc cần trích dẫn ở phần học chủ động.

const pad = (n: number) => String(n).padStart(2, '0');
const vn = (x: number) => x.toFixed(2).replace('.', ',');

function sunDelta(jd: number, lon: number): number {
  let d = sunLongitude(jd) - lon;
  while (d > 180) d -= 360;
  while (d <= -180) d += 360;
  return d;
}

/** Julian Day (UTC) lúc Mặt Trời đi qua hoàng kinh `lon` trong năm `year`. */
function termJd(year: number, lon: number): number {
  const start = julianDay(year, 1, 1, 0);
  const end = julianDay(year + 1, 1, 1, 0);
  for (let jd = start; jd < end; jd += 1) {
    if (sunDelta(jd, lon) < 0 && sunDelta(jd + 1, lon) >= 0) {
      let lo = jd;
      let hi = jd + 1;
      for (let i = 0; i < 50; i++) {
        const mid = (lo + hi) / 2;
        if (sunDelta(lo, lon) * sunDelta(mid, lon) <= 0) hi = mid;
        else lo = mid;
      }
      return (lo + hi) / 2;
    }
  }
  return start;
}

/** Mốc tiết khí quy về giờ Việt Nam (UTC+7). */
function vnLabel(year: number, lon: number): { date: string; time: string } {
  const d = new Date(Math.round(((termJd(year, lon) - 2440587.5) * 1440 + 420) * 60_000));
  return {
    date: `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`,
    time: `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`,
  };
}

const LAP_THU = vnLabel(2026, 135);
const LAP_XUAN = vnLabel(2026, 315);
const DONG_CHI = vnLabel(2026, 270);

/** Trụ tháng / trụ năm của một lá số — chạy qua đúng engine của /la-so-bat-tu. */
const chartAt = (date: string, hour: number) => calculateBazi({ birthSolarDate: date, birthHour: hour });
const monthPillarAt = (date: string, hour: number) => {
  const c = chartAt(date, hour);
  return `${c.month.can} ${c.month.chi}`;
};

const LAP_THU_BEFORE = monthPillarAt('2026-08-07', 17);
const LAP_THU_AFTER = monthPillarAt('2026-08-07', 20);
const LX_BEFORE = chartAt('2026-02-04', 1);
const LX_AFTER = chartAt('2026-02-04', 5);
const LX_YEAR_BEFORE = `${LX_BEFORE.year.can} ${LX_BEFORE.year.chi}`;
const LX_YEAR_AFTER = `${LX_AFTER.year.can} ${LX_AFTER.year.chi}`;

/** Ngày âm lịch của 04/02/2026 — chứng minh lúc đó còn xa Tết. */
const LX_LUNAR = solarToLunar(4, 2, 2026);

/** Trụ tháng ngày đầu và ngày cuối tháng 8/2026 — hai trụ khác nhau. */
const AUG_FIRST = monthPillarOf(2026, 8, 1).label;
const AUG_LAST = monthPillarOf(2026, 8, 31).label;

/** Khoảng cách ngắn nhất / dài nhất / trung bình giữa hai tiết khí (2020–2035). */
const GAP_STATS = (() => {
  const seq: number[] = [];
  for (let y = 2020; y <= 2035; y++) {
    for (let i = 0; i < 24; i++) seq.push(termJd(y, i * 15));
  }
  seq.sort((a, b) => a - b);
  const gaps = seq.slice(1).map((jd, i) => jd - seq[i]!);
  return {
    min: Math.min(...gaps),
    max: Math.max(...gaps),
    mean: gaps.reduce((s, g) => s + g, 0) / gaps.length,
  };
})();

/** 360° chia cho 24 mốc — hằng số định nghĩa của hệ tiết khí. */
const STEP_DEG = 360 / 24;

/** Gói 3 tầng độ sâu cho gọn: mọi khối ở đây đều dùng đúng bộ nhãn này. */
function Depth({
  concept,
  eli5,
  eli14,
  expert,
}: {
  concept: string;
  eli5: React.ReactNode;
  eli14: React.ReactNode;
  expert: React.ReactNode;
}) {
  return (
    <DepthTabs
      topicId={TOPIC}
      concept={concept}
      levels={[
        { id: 'eli5', label: 'Trẻ 5 tuổi', content: eli5 },
        { id: 'eli14', label: 'Người 14 tuổi', content: eli14 },
        { id: 'expert', label: 'Chuyên gia', content: expert },
      ]}
    />
  );
}

export function TietKhiFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn tra ngày sinh và thấy hai nơi ghi hai {strong('trụ tháng')} khác nhau; hoặc quen nghĩ
          tháng âm bắt đầu từ mùng 1 rồi lại thấy lá số đổi tháng vào giữa tháng dương. Gốc của mọi
          lẫn lộn ấy nằm ở một hệ mốc mà hầu như không ai được giải thích: {strong('24 tiết khí')}.
        </>
      }
      why={
        <>
          Vì tiết khí là {strong('bộ khung thời gian')} mà cả Bát Tự lẫn lịch âm dương đều dựa vào.
          Không biết nó, bạn sẽ đọc sai ranh giới tháng, sai cả ranh giới năm — và không phân biệt
          được đâu là dữ kiện thiên văn, đâu là kinh nghiệm nhà nông gắn thêm.
        </>
      }
      what={
        <>
          {strong('24 mốc chia đều đường đi biểu kiến của Mặt Trời')}, mỗi mốc cách nhau{' '}
          {strong(`${STEP_DEG}° hoàng kinh`)}. Vì chỉ Mặt Trời quyết định, tiết khí thuộc về{' '}
          {strong('lịch dương')} — {strong('không phải')} lịch âm, dù tên gọi rất Hán Việt. Cũng{' '}
          {strong('không phải')} bảng ngày tốt xấu.
        </>
      }
      how={
        <>
          Mỗi lần Mặt Trời vượt thêm {STEP_DEG}°, ta có một tiết khí. 24 mốc chia thành hai nhóm xen
          kẽ: {strong('12 Tiết')} mở 12 tháng của Bát Tự, {strong('12 Trung khí')} nằm giữa tháng và
          được lịch âm dương dùng để đặt tháng nhuận.
        </>
      }
      soWhat={
        <>
          Bạn đọc được ranh giới thật của trụ tháng: nó đổi tại tiết khí, {strong('không')} đổi vào
          mùng 1 âm lịch. Và bạn tách được hai lớp — mốc thiên văn tính trước được, với lớp phong tục
          gắn lên nó.
        </>
      }
    />
  );
}

export function TietKhiDepth() {
  return (
    <div className="space-y-6">
      <Depth
        concept="Vì sao tiết khí là chuyện của Mặt Trời, không phải của Mặt Trăng"
        eli5={
          <p>
            Tưởng tượng Mặt Trời đi trọn một vòng tròn quanh bầu trời trong một năm. Người xưa vẽ{' '}
            {strong('24 vạch chia đều')} lên vòng tròn đó, và mỗi lần Mặt Trời đi qua một vạch là một
            tiết khí. Mặt Trăng không tham gia gì cả — nên đây là chuyện của Mặt Trời.
          </p>
        }
        eli14={
          <>
            <p>
              Vòng tròn ấy có 360°, chia cho 24 vạch là {strong(`${STEP_DEG}° mỗi chặng`)}. Vị trí
              Mặt Trời trên vòng tròn gọi là {strong('hoàng kinh')}, và mỗi tiết khí đơn giản là{' '}
              {strong('một giá trị hoàng kinh cụ thể')}: Xuân Phân 0°, Lập Hạ 45°, Đông Chí 270°, Lập
              Xuân 315°…
            </p>
            <p>
              Vì lịch dương (lịch tây) cũng được thiết kế để bám vòng đi của Mặt Trời, hai hệ trôi
              cùng nhịp. Đó là lý do mọi tiết khí đều rơi vào{' '}
              {strong('gần như đúng một ngày dương lịch mỗi năm')} — trong khi mùng 1 hay ngày rằm
              thì chạy khắp nơi.
            </p>
          </>
        }
        expert={
          <>
            <p>
              Trong code, tiết khí không hề là một bảng tra: engine tính{' '}
              {strong('kinh độ hoàng đạo biểu kiến của Mặt Trời')} theo thuật toán Meeus rồi dò thời
              điểm nó chạm đúng bội số của {STEP_DEG}° bằng phép chia đôi. Không hằng số ngày nào
              được nhập tay, nên bảng đúng cho mọi năm chứ không chỉ vài năm được liệt kê.
            </p>
            <p>
              Hệ quả cần nhớ: tiết khí là {strong('một thời khắc, không phải một ngày')}. Đông Chí
              2026 rơi lúc {DONG_CHI.time} ngày {DONG_CHI.date} giờ Việt Nam — đọc ở múi giờ khác có
              thể ra ngày liền kề. Chuyện lịch âm dương {strong('dùng')} Đông Chí làm mốc neo tháng
              11 là lịch pháp, không phải bản thân hiện tượng, và phần đó thuộc bài Lịch âm dương.
            </p>
          </>
        }
      />

      <Depth
        concept="Chia đều theo góc — nhưng không đều theo số ngày"
        eli5={
          <p>
            Hai vạch nào trên vòng tròn cũng cách nhau đúng bằng nhau. Nhưng Trái Đất{' '}
            {strong('lúc đi nhanh, lúc đi chậm')}, nên có chặng nó chạy qua trong ít ngày hơn — giống
            như đi bộ trên con đường có đoạn xuống dốc.
          </p>
        }
        eli14={
          <>
            <p>
              Nếu chia đều theo thời gian thì chặng nào cũng phải dài {vn(GAP_STATS.mean)} ngày. Đo
              thật thì chặng ngắn nhất chỉ {strong(`${vn(GAP_STATS.min)} ngày`)} còn chặng dài nhất
              tới {strong(`${vn(GAP_STATS.max)} ngày`)} — chênh nhau hơn một ngày.
            </p>
            <p>
              Lý do: quỹ đạo Trái Đất là {strong('hình elip')}, không phải hình tròn. Khi ở gần Mặt
              Trời nhất (khoảng đầu tháng 1) Trái Đất đi nhanh nhất nên vượt {STEP_DEG}° trong ít
              ngày nhất; khi ở xa nhất (khoảng đầu tháng 7) nó đi chậm nhất.
            </p>
          </>
        }
        expert={
          <>
            <p>
              Đây là hệ quả trực tiếp của định luật thứ hai Kepler: vật thể quét những diện tích bằng
              nhau trong những khoảng thời gian bằng nhau, nên{' '}
              {strong('tốc độ góc lớn nhất ở điểm gần nhất và nhỏ nhất ở điểm xa nhất')}.
            </p>
            <p>
              Hai cách chia có tên riêng: chia đều theo góc là {strong('định khí')} (lịch hiện đại và
              engine hieu.asia dùng cách này), chia đều theo thời gian là {strong('bình khí')} — lấy
              độ dài năm chia cho 24. Sách lịch cũ dùng bình khí nên ngày tiết khí trong đó có thể
              lệch với bảng tính theo định khí.
            </p>
          </>
        }
      />

      <Depth
        concept="Tiết và Trung khí: vì sao 24 mốc lại chia đôi 12 – 12"
        eli5={
          <p>
            Cứ một vạch lại tới một vạch khác, đan xen như răng lược. Nhóm vạch thứ nhất là{' '}
            {strong('cửa mở')} của mỗi tháng; nhóm vạch thứ hai nằm ngay {strong('giữa phòng')}. Hai
            nhóm làm hai việc khác nhau.
          </p>
        }
        eli14={
          <>
            <p>
              Một tháng theo Mặt Trời dài 30°, tức bằng 2 chặng {STEP_DEG}°. Vậy mỗi tháng có đúng
              hai mốc: một mốc ở {strong('đầu tháng')} gọi là {strong('Tiết')}, một mốc ở{' '}
              {strong('giữa tháng')} gọi là {strong('Trung khí')}. Cứ thế 12 tháng cho ra 12 + 12 =
              24.
            </p>
            <p>
              Bát Tự cần biết tháng {strong('bắt đầu')} ở đâu nên dùng 12 Tiết. Lịch âm dương cần một
              điểm neo {strong('ở giữa')} để kiểm tra xem một tháng trăng có “ôm” được mốc Mặt Trời
              nào không, nên dùng 12 Trung khí. Chi tiết quy tắc nhuận nằm ở bài Lịch âm dương.
            </p>
          </>
        }
        expert={
          <>
            <p>
              Trong lib/bazi.ts, phép chọn cung tháng là{' '}
              {strong('sector = floor(mod(hoàng kinh − 315°, 360°) / 30°)')} rồi{' '}
              {strong('chi = sector + 2')} (cung 0 là tháng Dần). Chia cho 30° nghĩa là engine chỉ
              nhìn 12 mốc — đúng 12 Tiết. 12 Trung khí không xuất hiện trong phép tính Bát Tự, và
              ngược lại 12 Tiết không tham gia quy tắc tháng nhuận.
            </p>
            <p>
              Nói cách khác, hai nhóm {strong('không phải hai loại quan trọng khác nhau')} mà là hai
              vai trò hình học: điểm mở và điểm giữa của cùng một chặng 30°. Bốn điểm phân – chí đều
              là Trung khí, nên không mốc nào trong bốn mốc đó đổi trụ tháng — chi tiết mà nhiều bảng
              tra ngoài kia làm sai.
            </p>
          </>
        }
      />

      <Depth
        concept="Ranh giới trụ tháng cắt ngang giữa một ngày"
        eli5={
          <p>
            Cái “tháng” trong lá số không đổi lúc nửa đêm. Nó đổi{' '}
            {strong('đúng lúc Mặt Trời chạm vạch')} — có thể là buổi chiều, có thể là nửa đêm. Nên
            hai em bé sinh cùng một ngày vẫn có thể thuộc hai tháng khác nhau.
          </p>
        }
        eli14={
          <>
            <p>
              Lập Thu năm 2026 rơi vào {strong(`${LAP_THU.time} ngày ${LAP_THU.date}`)} giờ Việt Nam.
              Người sinh 17:00 hôm đó có trụ tháng {strong(LAP_THU_BEFORE)}; người sinh 20:00 cùng
              ngày đã sang {strong(LAP_THU_AFTER)}. Cùng ngày, cùng trụ ngày, khác trụ tháng.
            </p>
            <p>
              Đó cũng là lý do một tháng dương lịch thường nằm vắt qua {strong('hai trụ tháng')}:
              ngày 1/8/2026 mang trụ {strong(AUG_FIRST)} còn ngày 31/8/2026 đã là {strong(AUG_LAST)}.
            </p>
          </>
        }
        expert={
          <>
            <p>
              Lập Xuân là ca đặc biệt vì nó đổi {strong('cả trụ năm lẫn trụ tháng')}. Năm 2026 nó rơi
              lúc {LAP_XUAN.time} ngày {LAP_XUAN.date}: sinh 01:00 hôm đó vẫn thuộc năm{' '}
              {strong(LX_YEAR_BEFORE)}, sinh 05:00 đã sang năm {strong(LX_YEAR_AFTER)}.
            </p>
            <p>
              Đáng nói là hôm ấy theo âm lịch mới là ngày {LX_LUNAR.day}/{LX_LUNAR.month}, tức{' '}
              {strong('còn chưa tới Tết')}. Bát Tự đổi năm tại Lập Xuân, lịch âm đổi năm tại mùng 1
              Tết — {strong('hai quy ước khác nhau, không phải một bên sai')}. Khi tư vấn cho người
              sinh sát ranh giới, phải nói rõ mình đang dùng quy ước nào thay vì để họ tự suy.
            </p>
          </>
        }
      />
    </div>
  );
}

const RECALL_QUESTIONS: RecallQuestion[] = [
  {
    id: 'q1',
    type: 'open',
    prompt:
      '24 tiết khí được định nghĩa bằng cái gì — và vì sao điều đó quyết định chúng thuộc lịch nào?',
    answer: (
      <>
        Bằng {strong('vị trí Mặt Trời')}: 24 mốc chia đều vòng đi biểu kiến của Mặt Trời, mỗi mốc
        cách nhau {STEP_DEG}° hoàng kinh. Vì Mặt Trăng không tham gia định nghĩa, tiết khí thuộc về{' '}
        {strong('lịch dương')}. Đó là lý do mỗi tiết khí rơi vào gần như đúng một ngày dương lịch mỗi
        năm.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Hai tiết khí liên tiếp cách nhau bao nhiêu?',
    choices: [
      {
        text: 'Đúng 15 ngày, không đổi',
        note: `Không — chia đều theo GÓC chứ không theo thời gian. Đo thật: ngắn nhất ${vn(GAP_STATS.min)} ngày, dài nhất ${vn(GAP_STATS.max)} ngày.`,
      },
      {
        text: `Đúng ${STEP_DEG}° hoàng kinh, còn số ngày thì thay đổi trong năm`,
        correct: true,
        note: 'Đúng — quỹ đạo Trái Đất hình elip nên tốc độ đi thay đổi: nhanh nhất khoảng đầu tháng 1, chậm nhất khoảng đầu tháng 7.',
      },
      {
        text: 'Đúng một tháng âm lịch',
        note: 'Không — tháng âm dựa vào chu kỳ Mặt Trăng, hoàn toàn không liên quan tới định nghĩa của tiết khí.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Nhóm nào trong 24 tiết khí quyết định ranh giới trụ tháng của Bát Tự?',
    choices: [
      {
        text: '12 Trung khí (Vũ Thủy, Xuân Phân, Hạ Chí, Đông Chí…)',
        note: 'Không — 12 Trung khí nằm GIỮA tháng và được lịch âm dương dùng để đặt tháng nhuận, không đổi trụ tháng.',
      },
      {
        text: 'Cả 24 mốc, mỗi mốc một nửa tháng',
        note: 'Không — engine chia hoàng kinh cho 30°, tức chỉ nhìn 12 mốc chứ không phải 24.',
      },
      {
        text: '12 Tiết (Lập Xuân, Kinh Trập, Thanh Minh, Lập Hạ…)',
        correct: true,
        note: 'Đúng — 12 Tiết là các mốc MỞ tháng, cách nhau 30°, bắt đầu từ Lập Xuân = tháng Dần.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Bốn điểm phân – chí (Xuân Phân, Hạ Chí, Thu Phân, Đông Chí) là Tiết hay Trung khí?',
    choices: [
      {
        text: 'Cả bốn đều là Trung khí, nên không mốc nào đổi trụ tháng',
        correct: true,
        note: 'Đúng — chúng nằm giữa tháng. Ý nghĩa thiên văn của bốn mốc này thuộc bài Lịch thiên văn.',
      },
      {
        text: 'Cả bốn đều là Tiết, vì chúng mở bốn mùa',
        note: 'Không — mở bốn mùa theo nông lịch là Lập Xuân, Lập Hạ, Lập Thu, Lập Đông; bốn mốc đó mới là Tiết.',
      },
      {
        text: 'Hai điểm phân là Tiết, hai điểm chí là Trung khí',
        note: 'Không — cả bốn cùng nhóm. Hoàng kinh của chúng là 0°, 90°, 180°, 270°, đều lệch 15° so với mốc mở tháng.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: 'Vì sao dùng mùng 1 âm lịch làm ranh giới trụ tháng trong Bát Tự là sai?',
    answer: (
      <>
        Vì trụ tháng đổi tại {strong('mốc Tiết')} — một vị trí của Mặt Trời — nên nó bám ngày dương
        lịch. Còn mùng 1 âm lịch bám {strong('ngày sóc')} của Mặt Trăng nên lùi dần suốt năm. Hai
        nhịp hoàn toàn khác nhau, và trong một năm chúng gần như không bao giờ rơi trùng ngày.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'open',
    prompt: `Vận dụng: một người sinh ngày ${LAP_THU.date}. Vì sao chỉ biết ngày sinh là chưa đủ để lập lá số?`,
    answer: (
      <>
        Vì hôm đó có mốc {strong('Lập Thu')} lúc {strong(LAP_THU.time)} giờ Việt Nam. Sinh 17:00 thì
        trụ tháng là {strong(LAP_THU_BEFORE)}; sinh 20:00 thì đã là {strong(LAP_THU_AFTER)}. Cùng
        ngày, cùng trụ ngày, nhưng khác trụ tháng — nên {strong('giờ sinh là bắt buộc')} với người
        sinh sát ranh giới tiết khí.
      </>
    ),
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Lập Xuân và mùng 1 Tết có phải là một không?',
    choices: [
      {
        text: 'Có — Lập Xuân chính là ngày đầu năm âm lịch',
        note: 'Không — Lập Xuân luôn quanh đầu tháng 2 dương lịch, còn Tết trôi trong khoảng gần một tháng.',
      },
      {
        text: 'Không — Lập Xuân là mốc đổi trụ năm trong Bát Tự, Tết là mốc đổi năm của lịch âm',
        correct: true,
        note: `Đúng — năm 2026, Lập Xuân rơi ${LAP_XUAN.date} trong khi hôm đó âm lịch mới là ngày ${LX_LUNAR.day}/${LX_LUNAR.month}, tức chưa tới Tết.`,
      },
      {
        text: 'Không — Lập Xuân là một Trung khí nên không liên quan tới năm',
        note: 'Sai ở chỗ phân loại: Lập Xuân là một TIẾT (hoàng kinh 315°), và nó chính là mốc đổi cả trụ năm lẫn trụ tháng.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'open',
    prompt: 'Tên “Tiểu Tuyết”, “Đại Tuyết” nói gì về giới hạn của hệ tiết khí khi dùng ở Việt Nam?',
    answer: (
      <>
        Rằng hệ này {strong('hình thành từ khí hậu lưu vực Hoàng Hà')}, nơi mùa đông có tuyết. Phần{' '}
        {strong('thiên văn')} đúng ở mọi nơi trên Trái Đất vì nó chỉ nói về vị trí Mặt Trời; phần{' '}
        {strong('mô tả thời tiết')} thì gắn với một toạ độ cụ thể. Đọc bảng 24 tiết khí phải tách hai
        lớp đó ra.
      </>
    ),
  },
];

export function TietKhiRecall() {
  return <ActiveRecall topicId={TOPIC} questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được tiết khí dùng để làm gì (bộ khung thời gian cho Bát Tự và lịch âm dương) — và nó KHÔNG hứa gì (không phải bảng ngày tốt xấu, không phải dự báo thời tiết).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: `Giải thích được định nghĩa từ đầu: 24 mốc chia đều vòng đi biểu kiến của Mặt Trời, mỗi mốc cách nhau ${STEP_DEG}° hoàng kinh.`,
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Chỉ ra được vì sao tiết khí thuộc lịch DƯƠNG chứ không phải lịch âm, kèm bằng chứng: ngày dương lịch của mỗi tiết gần như không đổi, trong khi mùng 1 Tết trôi gần một tháng.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Phân biệt 12 Tiết với 12 Trung khí: nhóm nào mở tháng Bát Tự, nhóm nào được lịch âm dương dùng để đặt tháng nhuận, và vì sao hai vai trò đó nảy ra từ một chặng 30°.',
  },
  {
    id: 'unevenness',
    facet: 'Chỗ phản trực giác',
    can: 'Giải thích được vì sao chia đều theo GÓC không kéo theo chia đều theo NGÀY, và vì sao chặng ngắn nhất rơi vào khoảng đầu tháng 1.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Nói được trụ tháng Bát Tự đổi tại mốc Tiết chứ không đổi vào mùng 1 âm lịch hay ngày 1 dương lịch, và vì sao người sinh sát ranh giới bắt buộc phải có giờ sinh.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Tách được lớp đo được (thời khắc, ngày, ranh giới trụ) khỏi lớp quy ước (ý nghĩa nông lịch, tục lệ, lời khuyên nên làm gì) — và nhận ra lớp thứ hai có nhiều dị bản.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nhớ rằng Lập Xuân không phải Tết, bốn điểm phân – chí đều là Trung khí nên không đổi trụ tháng, và tên gọi 24 tiết mô tả khí hậu Hoàng Hà chứ không phải Việt Nam.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người thân trong một phút: tiết khí là gì, vì sao nó là lịch dương, và vì sao lá số đổi tháng vào giữa tháng dương chứ không vào mùng 1 âm.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Nói được phần nào bạn vẫn thấy mơ hồ (vd định khí và bình khí khác nhau ra sao, hay vì sao sai số vài phút lại quan trọng) — và biết chỗ để tra tiếp.',
  },
];

export function TietKhiChecklist() {
  return <UnderstandingChecklist topicId={TOPIC} facets={FACETS} />;
}

export function TietKhiWhys() {
  return (
    <FiveWhys
      topicId={TOPIC}
      start={
        <>
          Một người tra lá số Bát Tự cho con sinh ngày {LAP_THU.date} và thấy trụ tháng khác hẳn bản
          mà người quen tra hộ. Cả nhà nghĩ có một bên tính sai, thậm chí nghi công cụ hỏng.
        </>
      }
      chain={[
        {
          question: 'Vì sao hai bản có thể khác nhau mà không bên nào tính sai?',
          because: (
            <>
              Vì hôm đó có mốc {strong('Lập Thu')} lúc {strong(LAP_THU.time)} giờ Việt Nam. Một bên
              nhập giờ sinh trước mốc ({LAP_THU_BEFORE}), bên kia nhập sau mốc ({LAP_THU_AFTER}).
            </>
          ),
        },
        {
          question: 'Vì sao một cái mốc giữa ngày lại đổi được cả trụ tháng?',
          because: (
            <>
              Vì trong Bát Tự, {strong('trụ tháng đổi tại tiết khí')} — không đổi lúc nửa đêm, không
              đổi vào ngày 1 dương lịch, cũng không đổi vào mùng 1 âm lịch.
            </>
          ),
        },
        {
          question: 'Vì sao lại lấy tiết khí làm ranh giới, thay vì lấy tháng âm cho tiện?',
          because: (
            <>
              Vì tiết khí đo {strong('vị trí Mặt Trời')}, mà mùa vụ và khí hậu đi theo Mặt Trời chứ
              không theo Mặt Trăng. Một hệ mệnh lý xây trên nhịp mùa thì phải neo vào cái tạo ra mùa.
            </>
          ),
        },
        {
          question: 'Vậy vì sao tới giờ vẫn nhiều người tưởng tiết khí thuộc lịch âm?',
          because: (
            <>
              Vì cái tên. Lập Xuân, Thanh Minh, Đông Chí nghe rất Hán Việt và luôn được in trên tờ
              lịch bloc ngay cạnh ngày âm, nên người đọc mặc định xếp chung một rổ. Nhưng{' '}
              {strong('Mặt Trăng không có mặt trong định nghĩa của bất kỳ tiết khí nào')} — lịch âm
              dương chỉ {strong('mượn')} chúng làm khung.
            </>
          ),
        },
        {
          question: 'Hiểu tới đây thì nên làm gì cho đúng?',
          because: (
            <>
              Khi lập lá số, {strong('luôn hỏi giờ sinh')} — nhất là với người sinh quanh đầu tháng
              dương lịch, nơi các mốc Tiết rơi vào. Và khi đọc bất kỳ bảng tiết khí nào, tách phần
              thời khắc (đo được) khỏi phần “tháng này nên làm gì” (phong tục).
            </>
          ),
        },
      ]}
      root={
        <>
          24 tiết khí là {strong('lịch của Mặt Trời')} nằm ẩn bên trong cuốn lịch mà người Việt vẫn
          quen gọi là lịch âm. Nhìn ra điều đó thì mọi mâu thuẫn tưởng như bí ẩn — trụ tháng đổi giữa
          tháng, Lập Xuân không trùng Tết, tuổi âm khác trụ năm — đều trở thành{' '}
          {strong('hai quy ước rõ ràng đặt cạnh nhau')}, không phải chuyện đúng sai.
        </>
      }
    />
  );
}
