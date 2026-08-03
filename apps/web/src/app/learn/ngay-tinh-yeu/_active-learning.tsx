/**
 * Nội dung "học chủ động" cho trang /learn/ngay-tinh-yeu.
 *
 * GROUNDING — mọi ngày tháng SUY TẠI RUNTIME, không gõ tay: lib/ngay-kieng-ky.ts
 * (solarToLunar, thuật toán lịch âm Hồ Ngọc Đức, múi giờ +7 — đúng engine mà chú
 * thích đầu app/valentine-2027/page.tsx dẫn ra) và lib/xem-tuoi-cuoi.ts
 * (canChiOfYear để gọi tên năm âm). Repo không có hàm âm → dương nên ngày dương
 * của một ngày âm được tìm bằng cách quét ngược chính solarToLunar.
 *
 * NGUỒN CÔNG CỤ: app/valentine-2027/page.tsx — trang đích của bài. Trang đó NÊU
 * mốc ngày, GIẢI THÍCH ba lớp mà "hợp tuổi" đối chiếu, TỪ CHỐI gộp thành một con
 * số phần trăm, và CHỈ ĐƯỜNG sang các công cụ. Trang đó KHÔNG tính gì về Thất
 * Tịch, KHÔNG chấm điểm ngày lễ, và không công cụ nào nhận "ngày bạn đang xem"
 * làm đầu vào — bài vì thế không dạy phần đó.
 *
 * PHẠM VI: KHÔNG lấn /learn/that-tich (đang viết song song — chỉ nhắc tên, không
 * link), KHÔNG dạy lại cách chấm hợp đôi (/learn/hop-doi) hay bảng quan hệ 12 chi
 * (/learn/hop-tuoi). Giọng: ngày lễ là QUY ƯỚC XÃ HỘI đáng giữ, không phải mốc
 * vận mệnh; nói thẳng nhưng không mỉa mai người đọc và không doạ.
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
import { solarToLunar } from '@/lib/ngay-kieng-ky';
import { canChiOfYear } from '@/lib/xem-tuoi-cuoi';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── Suy dữ kiện từ engine lịch (không gõ tay ngày nào) ───────────────

const TOPIC = 'ngay-tinh-yeu';

/** Ngày dương cố định của Valentine, và ngày âm cố định của Thất Tịch. */
const VALENTINE_DAY = 14;
const VALENTINE_MONTH = 2;
const THAT_TICH_LUNAR_DAY = 7;
const THAT_TICH_LUNAR_MONTH = 7;

/** Năm đích của trang công cụ /valentine-2027. */
const TOOL_YEAR = 2027;

const daysInMonth = (month: number, year: number) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

// prettier-ignore
const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'] as const;

/** Thứ trong tuần của một ngày dương lịch. Dùng UTC để không lệ thuộc múi giờ. */
function weekdayOf(dd: number, mm: number, yy: number): string {
  return WEEKDAYS[new Date(Date.UTC(yy, mm - 1, dd)).getUTCDay()] ?? '';
}

/**
 * Ngày dương ứng với một ngày âm của năm âm `lunarYear`. Repo không có hàm
 * âm → dương, nên quét các ngày dương trong khoảng tháng khả dĩ rồi hỏi ngược
 * solarToLunar — vẫn là một nguồn sự thật duy nhất.
 */
function solarDateOfLunar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  fromMonth: number,
  toMonth: number,
): { dd: number; mm: number } | undefined {
  for (let mm = fromMonth; mm <= toMonth; mm += 1) {
    for (let dd = 1; dd <= daysInMonth(mm, lunarYear); dd += 1) {
      const l = solarToLunar(dd, mm, lunarYear);
      if (!l.leap && l.year === lunarYear && l.month === lunarMonth && l.day === lunarDay) {
        return { dd, mm };
      }
    }
  }
  return undefined;
}

/** Valentine của năm công cụ, đổi sang âm lịch. */
const VALENTINE_LUNAR = solarToLunar(VALENTINE_DAY, VALENTINE_MONTH, TOOL_YEAR);
const VALENTINE_WEEKDAY = weekdayOf(VALENTINE_DAY, VALENTINE_MONTH, TOOL_YEAR);
const VALENTINE_LUNAR_YEAR_NAME = canChiOfYear(VALENTINE_LUNAR.year).name;

/** Mùng 1 Tết của năm âm ấy — để thấy Valentine 2027 nằm sát Tết. */
const TET_TOOL_YEAR = solarDateOfLunar(TOOL_YEAR, 1, 1, 1, 3);

/** Số ngày từ mùng 1 Tết tới Valentine trong năm công cụ. */
const TET_TO_VALENTINE_DAYS = TET_TOOL_YEAR
  ? Math.round(
      (Date.UTC(TOOL_YEAR, VALENTINE_MONTH - 1, VALENTINE_DAY) -
        Date.UTC(TOOL_YEAR, TET_TOOL_YEAR.mm - 1, TET_TOOL_YEAR.dd)) /
        86400000,
    )
  : undefined;

/** Thất Tịch (mùng 7 tháng 7 âm) — luôn rơi vào khoảng tháng 7–10 dương lịch. */
const thatTichOf = (y: number) =>
  solarDateOfLunar(y, THAT_TICH_LUNAR_MONTH, THAT_TICH_LUNAR_DAY, 7, 10);

const fmt = (s?: { dd: number; mm: number }) => (s ? `${s.dd}/${s.mm}` : '—');

const THAT_TICH_TOOL_YEAR = thatTichOf(TOOL_YEAR);
const THAT_TICH_PREV = thatTichOf(TOOL_YEAR - 1);

/** Khoảng cách ngày giữa Thất Tịch hai năm liền — cho thấy nó trôi bao nhiêu. */
const THAT_TICH_SHIFT = (() => {
  if (!THAT_TICH_TOOL_YEAR || !THAT_TICH_PREV) return undefined;
  const a = Date.UTC(TOOL_YEAR, THAT_TICH_TOOL_YEAR.mm - 1, THAT_TICH_TOOL_YEAR.dd);
  const aDoy = Math.round((a - Date.UTC(TOOL_YEAR, 0, 1)) / 86400000);
  const b = Date.UTC(TOOL_YEAR - 1, THAT_TICH_PREV.mm - 1, THAT_TICH_PREV.dd);
  const bDoy = Math.round((b - Date.UTC(TOOL_YEAR - 1, 0, 1)) / 86400000);
  return Math.abs(aDoy - bDoy);
})();

export function NgayTinhYeuFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Mỗi năm có hai đợt “ngày của tình yêu”: một đợt vào{' '}
          {strong(`${VALENTINE_DAY}/${VALENTINE_MONTH} dương lịch`)}, một đợt vào{' '}
          {strong(`mùng ${THAT_TICH_LUNAR_DAY} tháng ${THAT_TICH_LUNAR_MONTH} âm lịch`)}. Kèm theo
          là hàng loạt lời mời “xem tình duyên đúng ngày”. Ít ai nói rõ hai ngày ấy từ đâu ra, và vì
          sao một ngày thì năm nào cũng đứng yên còn ngày kia thì năm nào cũng nhảy đi chỗ khác.
        </>
      }
      why={
        <>
          Vì khi không biết một ngày lễ được {strong('cộng đồng chọn ra')} như thế nào, người ta rất
          dễ đọc nó như một {strong('mốc có sẵn trong tự nhiên')} — rồi từ đó tin rằng làm việc gì
          “đúng ngày” sẽ khác đi. Đó là chỗ nhiều dịch vụ bám vào để bán, và cũng là chỗ khiến người
          ta buồn vô cớ khi ngày lễ trôi qua không như hình dung.
        </>
      }
      what={
        <>
          Cả hai đều là {strong('ngày đánh dấu')}, tức một thoả thuận xã hội về việc “hôm nay chúng
          ta cùng nghĩ về chuyện tình cảm”. Khác nhau ở chỗ neo: Valentine neo vào{' '}
          {strong('lịch dương')} nên cố định ngày {VALENTINE_DAY}/{VALENTINE_MONTH}; Thất Tịch neo
          vào {strong('lịch âm')} nên trên lịch dương nó trôi — năm {TOOL_YEAR - 1} rơi ngày{' '}
          {fmt(THAT_TICH_PREV)}, năm {TOOL_YEAR} rơi ngày {fmt(THAT_TICH_TOOL_YEAR)}.
        </>
      }
      how={
        <>
          Muốn biết một ngày âm rơi vào ngày dương nào (hoặc ngược lại) thì chỉ có một việc:{' '}
          {strong('đổi lịch')}. Mọi ngày trong bài này được đổi bằng đúng engine lịch mà hieu.asia
          dùng cho các trang tra ngày — Valentine {TOOL_YEAR} là {VALENTINE_WEEKDAY}, nhằm mùng{' '}
          {VALENTINE_LUNAR.day} tháng {VALENTINE_LUNAR.month} âm lịch năm{' '}
          {VALENTINE_LUNAR_YEAR_NAME}.
        </>
      }
      soWhat={
        <>
          Để bạn giữ ngày lễ đúng chỗ của nó: một {strong('cái hẹn chung')} rất đáng có, nhưng không
          phải một dữ kiện về vận mệnh. Cụ thể hơn: biết vì sao “xem hợp đôi đúng ngày Valentine”
          không thể chuẩn hơn xem vào hôm sau, vì{' '}
          {strong('không phép tính nào ở đây nhận ngày bạn bấm làm đầu vào')}.
        </>
      }
    />
  );
}

export function NgayTinhYeuDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId={TOPIC}
        concept="Hai ngày lễ, hai cách neo vào lịch"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Có hai kiểu đánh dấu ngày. Một kiểu là {strong('nhìn tờ lịch')}: cứ tới ô{' '}
                {VALENTINE_DAY}/{VALENTINE_MONTH} là tới ngày, năm nào cũng vậy. Kiểu kia là{' '}
                {strong('nhìn mặt trăng')}: đếm từ hôm trăng non, tới đêm thứ{' '}
                {THAT_TICH_LUNAR_DAY} của tháng thứ {THAT_TICH_LUNAR_MONTH} thì tới ngày. Vì trăng
                không đi đúng nhịp với tờ lịch, nên kiểu thứ hai mỗi năm rơi vào một ô khác.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Valentine là {strong('ngày dương cố định')}: {VALENTINE_DAY}/{VALENTINE_MONTH},
                  không đổi. Thứ trong tuần thì có đổi — năm {TOOL_YEAR} nó rơi vào{' '}
                  {VALENTINE_WEEKDAY} — nhưng số ngày thì đứng yên.
                </p>
                <p>
                  Thất Tịch là {strong('ngày âm cố định')}: mùng {THAT_TICH_LUNAR_DAY} tháng{' '}
                  {THAT_TICH_LUNAR_MONTH} âm lịch. Vì {strong('12 tháng âm ngắn hơn một năm dương')},
                  nên quy sang lịch dương thì nó lùi dần mỗi năm, cho tới khi lịch âm chèn một tháng
                  nhuận và nó nhảy vọt về sau. Giữa năm {TOOL_YEAR - 1} và năm {TOOL_YEAR}, Thất
                  Tịch xê dịch {THAT_TICH_SHIFT ?? 0} ngày trên lịch dương.
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
                  Nói cho chặt: {strong('không ngày nào trong hai ngày này là “ngày thật”')} theo
                  nghĩa thiên văn. Cả hai chỉ là toạ độ trên hai hệ lịch khác nhau — một hệ đếm theo
                  vòng quay của Trái Đất quanh Mặt Trời, một hệ đếm theo tuần trăng rồi hiệu chỉnh
                  bằng tháng nhuận cho khỏi lệch mùa.
                </p>
                <p>
                  Hệ quả kỹ thuật: muốn đặt hai ngày cạnh nhau thì bắt buộc phải{' '}
                  {strong('đổi lịch')}, và phép đổi đó là một thuật toán xác định — cùng đầu vào thì
                  ai chạy cũng ra một kết quả. Ví dụ, Valentine {TOOL_YEAR} nhằm mùng{' '}
                  {VALENTINE_LUNAR.day} tháng {VALENTINE_LUNAR.month} âm lịch năm{' '}
                  {VALENTINE_LUNAR_YEAR_NAME}
                  {TET_TOOL_YEAR && TET_TO_VALENTINE_DAYS !== undefined
                    ? `, tức đúng ${TET_TO_VALENTINE_DAYS} ngày sau mùng 1 Tết (${fmt(TET_TOOL_YEAR)})`
                    : ''}
                  . Cái xác định được là {strong('ngày nào là ngày nào')} — không phải ngày nào tốt
                  hơn ngày nào.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId={TOPIC}
        concept="Vì sao “xem tình duyên đúng ngày lễ” là ghép hai thứ rời nhau"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cái cân đo cân nặng của bạn không quan tâm hôm nay là ngày gì. Đứng lên cân vào ngày
                sinh nhật hay ngày thường thì kim vẫn chỉ một chỗ. Phép xem hợp tuổi cũng vậy: nó chỉ
                nhìn {strong('năm sinh')}, không nhìn tờ lịch hôm bạn xem.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Theo mô tả của chính trang công cụ, thứ bạn nhập vào khi xem hợp tuổi là{' '}
                  {strong('năm sinh của hai người')}. Không có ô nào để nhập “hôm nay là ngày mấy”.
                  Vậy nên kết quả ngày {VALENTINE_DAY}/{VALENTINE_MONTH} và kết quả ngày{' '}
                  {VALENTINE_DAY + 1}/{VALENTINE_MONTH} {strong('giống hệt nhau')}.
                </p>
                <p>
                  Đây là một điều {strong('bạn tự kiểm được')}, không cần tin ai: xem một lần hôm
                  nay, lưu lại, rồi xem lại đúng ngày lễ. Nếu có trang nào cho ra kết quả khác nhau
                  giữa hai lần, thì cái khác nhau đó đến từ chỗ khác chứ không đến từ phép tính.
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
                  Cấu trúc của lỗi này là {strong('ghép hai hệ quy chiếu không liên quan')}: một bên
                  là ngày lễ — quy ước xã hội, do cộng đồng chọn; một bên là phép đối chiếu can chi —
                  hàm của năm sinh. Hai bên không có biến chung, nên không thể có chuyện bên này làm
                  bên kia chính xác hơn.
                </p>
                <p>
                  Cái thật sự đổi vào ngày lễ là {strong('người đọc')}: bạn đang mong chờ nhiều hơn,
                  nên đọc một mô tả chung chung thấy đúng hơn bình thường. Đó là hiệu ứng đã có tên
                  và đo được, và nó là lý do nhiều dịch vụ chọn đúng dịp lễ để chào mời — không phải
                  vì phép tính khác đi.
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
      'Valentine và Thất Tịch được neo vào hai hệ lịch khác nhau. Hệ quả nhìn thấy được của chuyện đó là gì?',
    answer: (
      <>
        Valentine neo vào {strong('lịch dương')} nên số ngày cố định là {VALENTINE_DAY}/
        {VALENTINE_MONTH} — chỉ thứ trong tuần đổi (năm {TOOL_YEAR} là {VALENTINE_WEEKDAY}). Thất
        Tịch neo vào {strong('lịch âm')} ở mùng {THAT_TICH_LUNAR_DAY} tháng {THAT_TICH_LUNAR_MONTH},
        nên trên lịch dương nó trôi: năm {TOOL_YEAR - 1} rơi ngày {fmt(THAT_TICH_PREV)}, năm{' '}
        {TOOL_YEAR} rơi ngày {fmt(THAT_TICH_TOOL_YEAR)} — xê dịch {THAT_TICH_SHIFT ?? 0} ngày.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: `Vì sao ngày âm lại lùi dần trên lịch dương rồi thỉnh thoảng nhảy vọt về sau?`,
    choices: [
      {
        text: 'Vì 12 tháng âm ngắn hơn một năm dương, nên ngày âm lùi dần; khi độ lệch đủ lớn thì lịch âm chèn một tháng nhuận và ngày âm nhảy về sau',
        correct: true,
        note: 'Đúng — tháng nhuận chính là cơ chế kéo lịch âm về đúng mùa, và nó là nguyên nhân của cú nhảy.',
      },
      {
        text: 'Vì mỗi vùng miền tính lịch âm một kiểu nên ngày không thống nhất',
        note: 'Không — phép đổi lịch là một thuật toán xác định, cùng đầu vào thì ra cùng kết quả. Cái trôi là do cấu tạo của hai hệ lịch, không do cách tính khác nhau.',
      },
      {
        text: 'Vì Thất Tịch được ấn định lại mỗi năm theo một hội đồng',
        note: 'Không — ngày âm của Thất Tịch cố định ở mùng 7 tháng 7. Chỉ có hình chiếu của nó lên lịch dương là đổi.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: `Nguồn gốc nghĩa “ngày của tình yêu” của ngày ${VALENTINE_DAY}/${VALENTINE_MONTH} nên được kể thế nào cho đúng?`,
    choices: [
      {
        text: 'Ban đầu là một ngày lễ trong lịch nhà thờ; nghĩa tình yêu được bồi lên rất muộn qua thơ ca trung cổ rồi qua thiệp và thị trường quà tặng',
        correct: true,
        note: 'Đúng — nghĩa hôm nay là kết quả của nhiều lớp chồng lên, không có sẵn từ đầu.',
      },
      {
        text: 'Đó là biến thể trực tiếp của một lễ hội La Mã cổ, có bằng chứng liên tục từ thời cổ đại',
        note: 'Đây là chuỗi kể phổ biến nhưng là liên hệ dựng lại về sau, không có tài liệu đương thời chống lưng. Bài này không dùng nó làm căn cứ.',
      },
      {
        text: 'Do các hãng thiệp chúc mừng ở thế kỷ 19 nghĩ ra hoàn toàn từ con số không',
        note: 'Cũng không — họ khuếch đại một nghĩa đã có sẵn trong thơ ca trước đó, chứ không tạo ra nó từ đầu.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt:
      'Một trang quảng cáo: “Xem hợp đôi đúng ngày Valentine, kết quả chuẩn hơn ngày thường.” Chỗ sai nằm ở đâu?',
    choices: [
      {
        text: 'Đầu vào của phép xem hợp tuổi là năm sinh hai người — không có ô nào nhận ngày bạn đang xem, nên kết quả hai ngày là như nhau',
        correct: true,
        note: 'Đúng, và bạn tự kiểm được: xem hôm nay, lưu lại, xem lại đúng ngày lễ rồi đối chiếu.',
      },
      {
        text: 'Sai vì phải xem vào ngày Thất Tịch mới đúng với người Á Đông',
        note: 'Không — đổi ngày lễ này lấy ngày lễ kia vẫn là cùng một lỗi: phép tính không nhận ngày xem làm đầu vào.',
      },
      {
        text: 'Không sai, vì năng lượng ngày lễ mạnh hơn ngày thường',
        note: 'Không có đại lượng nào như vậy để đo. Cái đổi vào ngày lễ là kỳ vọng của người đọc, không phải phép tính.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: `Trang Valentine ${TOOL_YEAR} của hieu.asia thật sự làm gì, và KHÔNG làm gì?`,
    answer: (
      <>
        Nó {strong('nêu mốc ngày')} (Valentine {TOOL_YEAR} là {VALENTINE_WEEKDAY} {VALENTINE_DAY}/
        {VALENTINE_MONTH}, nhằm mùng {VALENTINE_LUNAR.day} tháng {VALENTINE_LUNAR.month} âm lịch năm{' '}
        {VALENTINE_LUNAR_YEAR_NAME}), {strong('giải thích ba lớp')} mà phép xem hợp tuổi đối chiếu,
        nói rõ vì sao nó từ chối gộp thành một con số phần trăm, rồi{' '}
        {strong('chỉ đường sang các công cụ')}. Nó {strong('không')} tính gì về Thất Tịch, không chấm
        điểm ngày lễ, và không có chỗ nào nhận “ngày bạn đang xem” làm đầu vào.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'open',
    prompt:
      'Nếu ngày lễ chỉ là quy ước, vậy có lý do nào đáng để vẫn giữ nó không? Nói bằng lời của bạn.',
    answer: (
      <>
        Có, và lý do khá thẳng thắn: {strong('con người cần cái hẹn')}. Một ngày được cả cộng đồng
        đồng ý sẽ tạo ra cái cớ chung để người ta chủ động nói điều bình thường ngại nói. Giá trị nằm
        ở {strong('việc bạn thật sự làm trong ngày đó')} — dành thời gian, nói ra điều cần nói — chứ
        không nằm trong bản thân con số trên tờ lịch. Hiểu vậy thì bạn giữ được phần có ích và bỏ
        được phần lo lắng thừa.
      </>
    ),
  },
];

export function NgayTinhYeuRecall() {
  return <ActiveRecall topicId={TOPIC} questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'definition',
    facet: 'Định nghĩa',
    can: 'Nói được ngày lễ tình yêu là một ngày đánh dấu do cộng đồng thoả thuận, chứ không phải một mốc có sẵn trong tự nhiên.',
  },
  {
    id: 'anchor',
    facet: 'Cách neo vào lịch',
    can: `Phân biệt được ngày neo vào lịch dương (Valentine, cố định ${VALENTINE_DAY}/${VALENTINE_MONTH}) với ngày neo vào lịch âm (Thất Tịch, mùng ${THAT_TICH_LUNAR_DAY} tháng ${THAT_TICH_LUNAR_MONTH}) — và biết vì sao chỉ ngày thứ hai mới trôi trên lịch dương.`,
  },
  {
    id: 'drift',
    facet: 'Cơ chế trôi ngày',
    can: 'Giải thích được vì sao ngày âm lùi dần mỗi năm rồi nhảy vọt về sau khi lịch âm chèn tháng nhuận, và tra được ngày dương của một ngày âm cho năm bất kỳ.',
  },
  {
    id: 'origin-west',
    facet: 'Nguồn gốc phương Tây',
    can: 'Kể được đường đi của ngày Valentine: từ một ngày lễ trong lịch nhà thờ, tới nghĩa tình yêu trong thơ ca trung cổ, rồi tới thiệp và thị trường quà tặng.',
  },
  {
    id: 'evidence',
    facet: 'Thận trọng với nguồn',
    can: 'Nhận ra chuỗi kể “Valentine là biến thể của một lễ hội La Mã cổ” là liên hệ dựng lại về sau, và biết vì sao bài này không dùng nó làm căn cứ.',
  },
  {
    id: 'origin-east',
    facet: 'Đối chiếu Thất Tịch',
    can: 'Nói được Thất Tịch là ngày âm gắn với một tích truyện và với hai ngôi sao hai bên dải Ngân Hà — một cách đánh dấu tình yêu ra đời độc lập với phương Tây.',
  },
  {
    id: 'tool-scope',
    facet: 'Công cụ làm gì',
    can: `Nói đúng phần trang Valentine ${TOOL_YEAR} làm (nêu mốc ngày, giải thích ba lớp đối chiếu, chỉ đường sang công cụ) và phần nó không làm (không tính Thất Tịch, không chấm điểm ngày lễ).`,
  },
  {
    id: 'category-error',
    facet: 'Ghép sai phạm trù',
    can: 'Chỉ ra vì sao “xem tình duyên đúng ngày lễ” là ghép hai thứ không có biến chung: ngày lễ là quy ước xã hội, còn phép đối chiếu chỉ nhận năm sinh.',
  },
  {
    id: 'self-check',
    facet: 'Tự kiểm chứng',
    can: 'Mô tả được cách tự kiểm: xem một lần hôm nay, lưu lại, xem lại đúng ngày lễ rồi đối chiếu hai kết quả.',
  },
  {
    id: 'healthy-use',
    facet: 'Dùng cho lành',
    can: 'Nói được vì sao ngày lễ vẫn đáng giữ dù là quy ước, và vì sao giá trị nằm ở việc bạn làm trong ngày đó chứ không ở con số trên tờ lịch.',
  },
];

export function NgayTinhYeuChecklist() {
  return <UnderstandingChecklist topicId={TOPIC} facets={FACETS} />;
}

export function NgayTinhYeuWhys() {
  return (
    <FiveWhys
      topicId={TOPIC}
      start={
        <>
          Một bạn thấy quảng cáo “xem hợp đôi đúng ngày Valentine, chuẩn hơn ngày thường”, liền nhịn
          không xem suốt tuần để đợi tới ngày {VALENTINE_DAY}/{VALENTINE_MONTH}. Bạn ấy tin rằng bấm
          đúng ngày thì kết quả sẽ khác.
        </>
      }
      chain={[
        {
          question: 'Vì sao câu quảng cáo đó nghe có lý?',
          because: (
            <>
              Vì ngày {VALENTINE_DAY}/{VALENTINE_MONTH} đã được gắn sẵn nghĩa “tình yêu” trong đầu
              mọi người. Khi một chủ đề và một ngày{' '}
              {strong('luôn xuất hiện cùng nhau')}, não rất dễ suy ra rằng chúng có liên hệ nhân
              quả — dù chưa ai chỉ ra liên hệ đó là gì.
            </>
          ),
        },
        {
          question: 'Vì sao ngày đó lại mang sẵn nghĩa tình yêu?',
          because: (
            <>
              Vì nghĩa ấy được {strong('bồi lên qua nhiều thế kỷ')}: khởi đầu chỉ là một ngày lễ
              trong lịch nhà thờ, sau đó thơ ca trung cổ gắn nó với chuyện đôi lứa, rồi ngành in
              thiệp và ngành bán lẻ nhân nó lên thành một mùa mua sắm. Đến lượt mình, ở Việt Nam nó
              vào qua báo chí, phim ảnh và các cửa hàng hoa – quà, chứ không phải qua phong tục có
              sẵn.
            </>
          ),
        },
        {
          question: 'Vì sao một quy ước như vậy lại được đọc như mốc vận mệnh?',
          because: (
            <>
              Vì quy ước sống đủ lâu thì {strong('không còn ai nhớ nó là quy ước')}. Ngày lễ đến đều
              đặn như bốn mùa, nên nó có dáng vẻ của một quy luật tự nhiên. Thất Tịch cũng đi con
              đường tương tự ở phía lịch âm, với một tích truyện đứng phía sau — cùng một cơ chế, hai
              nền văn hoá.
            </>
          ),
        },
        {
          question: 'Vì sao cảm giác “bấm đúng ngày nên chuẩn hơn” khó tự phát hiện là sai?',
          because: (
            <>
              Vì nó không tự mâu thuẫn ở đâu cả — trừ khi bạn đi kiểm. Mà kiểm thì rất gọn:{' '}
              {strong('đầu vào của phép xem hợp tuổi là năm sinh hai người')}, không có ô nào nhận
              ngày bạn đang xem. Xem hôm nay và xem đúng ngày lễ sẽ ra cùng một kết quả. Cái thật sự
              đổi là {strong('kỳ vọng của người đọc')}, và kỳ vọng thì không tự khai báo.
            </>
          ),
        },
        {
          question: 'Vậy nhịn cả tuần để đợi đúng ngày thì được gì, mất gì?',
          because: (
            <>
              Được một cảm giác trang trọng, mất một tuần mà lẽ ra đã có thể{' '}
              {strong('nói chuyện thật với người kia')}. Nếu điều bạn cần là hiểu nhau hơn thì tuần
              nào cũng dùng được; nếu điều bạn cần là một dịp để nói, thì{' '}
              {strong('ngày lễ có ích ở chỗ đó')} — nhưng vì nó là cái cớ, không phải vì phép tính
              đổi.
            </>
          ),
        },
      ]}
      root={
        <>
          Ngày lễ là {strong('một cái hẹn chung')} do cộng đồng dựng lên, và đó đã là một giá trị
          thật — nó cho người ta cái cớ để nói điều bình thường ngại nói. Nhưng nó{' '}
          {strong('không phải một biến trong bất kỳ phép tính nào')} trên hieu.asia. Giữ ngày lễ vì
          nó đẹp thì rất nên; đợi ngày lễ để một phép tra trở nên đúng hơn thì không có gì đứng sau.
        </>
      }
    />
  );
}
