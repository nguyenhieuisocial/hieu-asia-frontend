/**
 * Nội dung "học chủ động" cho trang /learn/luu-nien — bài về LỚP LƯU NIÊN và
 * cách ba lớp thời gian chồng lên nhau.
 *
 * GROUNDING — không gõ tay con số nào mà engine tính ra được:
 *   • src/lib/bazi.ts — calculateBazi({ birthSolarDate, birthHour, gender, asOf })
 *     trả 4 trụ gốc + dayMaster (lớp nền), daiVan (9 chặng × 10 năm tuổi) và
 *     luuNien = { year, can, chi, tenGod }; year lấy qua solarYearOf() → mốc đổi
 *     năm là LẬP XUÂN, và tenGod = Thập Thần của CAN NĂM so với Nhật Chủ.
 *   • src/lib/xem-tuoi-cuoi.ts — CAN (10), CHI (12).
 *   • src/app/tu-vi-2027/con-giap-data.ts + src/lib/hop-tuoi-pairs.ts — công cụ
 *     đích và lớp CON GIÁP của nó: buildConGiap2027(slug).relationLabel, ZODIAC.
 *
 * CÔNG CỤ /tu-vi-2027 TÍNH GÌ (đọc code): lớp CON GIÁP đọc đúng một dữ kiện là
 * năm sinh (quan hệ chi ↔ chi của năm, Tam Tai, ngũ hành, sao hạn Cửu Diệu) nên
 * cả nhóm tuổi nhận chung một câu; lớp CÁ NHÂN do TimeFlowChecker (scope
 * "yearly") lập lá số thật rồi trả lưu niên can chi + Tứ Hóa lưu niên. Trang
 * KHÔNG hiển thị đại vận, và engine lưu vận của site dừng ở lớp THÁNG —
 * TuViHoroscope chỉ có decadal / yearly / monthly, không có lớp ngày hay giờ.
 *
 * PHẠM VI (không lấn bài anh em): chặng 10 năm thuộc /learn/dai-van; Thái Tuế và
 * "năm tuổi" thuộc /learn/thai-tue; sao hạn Cửu Diệu thuộc /learn/sao-han — ở
 * đây chúng chỉ là MỘT TẦNG trong chồng lớp, không được dạy lại.
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
import { calculateBazi, type DaiVanPillar, type LuuNien } from '@/lib/bazi';
import { CAN, CHI } from '@/lib/xem-tuoi-cuoi';
import { ZODIAC } from '@/lib/hop-tuoi-pairs';
import {
  buildConGiap2027,
  YEAR as TOOL_YEAR,
  YEAR_CANCHI,
  YEAR_CHI,
} from '@/app/tu-vi-2027/con-giap-data';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── Dữ kiện suy từ engine (không gõ tay con số nào) ──────────────────

/** Chu kỳ lặp của can chi = bội chung nhỏ nhất của 10 can và 12 chi. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const CYCLE = (CAN.length * CHI.length) / gcd(CAN.length, CHI.length);

interface Person {
  birthDate: string;
  birthYear: number;
  hour: number;
  gender: 'M' | 'F';
}

const P1: Person = { birthDate: '1990-05-20', birthYear: 1990, hour: 9, gender: 'M' };
const P2: Person = { birthDate: '2002-11-08', birthYear: 2002, hour: 20, gender: 'F' };
const P3: Person = { birthDate: '1990-12-03', birthYear: 1990, hour: 3, gender: 'F' };

interface Snapshot {
  yearChi: string;
  dayMaster: string;
  startAge: number;
  age: number;
  daiVan: DaiVanPillar | null;
  luuNien: LuuNien;
  /** Nhãn mà lớp CON GIÁP của /tu-vi-2027 phát cho tuổi này. */
  toolLabel: string;
}

/** Ảnh chụp cả ba lớp của một người tại một năm — mọi trường do engine tính. */
function snapshot(p: Person, year: number): Snapshot {
  const chart = calculateBazi({
    birthSolarDate: p.birthDate,
    birthHour: p.hour,
    gender: p.gender,
    asOf: `${year}-07-01`,
  });
  const dv = chart.daiVan;
  const ln = chart.luuNien;
  if (!dv || !ln) {
    throw new Error('calculateBazi phải trả cả daiVan lẫn luuNien khi có gender + asOf');
  }
  const age = year - p.birthYear;
  const slug = ZODIAC.find((z) => z.ten === chart.year.chi)?.slug;
  return {
    yearChi: chart.year.chi,
    dayMaster: chart.dayMaster.can,
    startAge: dv.startAge,
    age,
    daiVan: dv.pillars.find((x) => age >= x.startAge && age <= x.endAge) ?? null,
    luuNien: ln,
    toolLabel: (slug ? buildConGiap2027(slug)?.relationLabel : undefined) ?? '—',
  };
}

const NOW_1 = snapshot(P1, TOOL_YEAR);
const NOW_2 = snapshot(P2, TOOL_YEAR);
const NOW_3 = snapshot(P3, TOOL_YEAR);
const NEXT_1 = snapshot(P1, TOOL_YEAR + 1);

/** Độ dài một chặng đại vận, đọc thẳng từ dữ liệu engine. */
const DV_SPAN = NOW_1.daiVan ? NOW_1.daiVan.endAge - NOW_1.daiVan.startAge + 1 : 0;

/**
 * Ba người trên phải CÙNG một con giáp thì ví dụ mới minh hoạ được điều đang
 * nói ("lớp con giáp gom cả nhóm vào một câu"). Chặn tại lúc dựng trang.
 */
if (NOW_1.yearChi !== NOW_2.yearChi || NOW_1.yearChi !== NOW_3.yearChi) {
  throw new Error('Ba người ví dụ phải cùng chi năm sinh thì lớp con giáp mới trùng nhau');
}
if (NOW_1.luuNien.tenGod === NOW_2.luuNien.tenGod) {
  throw new Error('Hai người ví dụ phải khác Thập Thần lưu niên thì mới thấy lớp nền quyết định nghĩa');
}

const LN_NOW = `${NOW_1.luuNien.can} ${NOW_1.luuNien.chi}`;
const LN_NEXT = `${NEXT_1.luuNien.can} ${NEXT_1.luuNien.chi}`;
const DV_NOW = NOW_1.daiVan ? `${NOW_1.daiVan.can} ${NOW_1.daiVan.chi}` : '—';
const DV_RANGE = NOW_1.daiVan ? `${NOW_1.daiVan.startAge}–${NOW_1.daiVan.endAge} tuổi` : '—';

/**
 * Trong CÙNG một năm, lớp lưu niên của Bát Tự sinh ra bao nhiêu kiểu đọc khác
 * nhau cho toàn bộ người đang sống? Thập Thần của lưu niên chỉ phụ thuộc can
 * Ngày (Nhật Chủ), mà can Ngày chạy hết một vòng sau đúng 10 ngày liên tiếp —
 * nên 10 ngày sinh liền nhau là đủ gom hết mọi Nhật Chủ có thể có.
 */
const LN_BUCKETS = (() => {
  const base = Date.UTC(1980, 0, 1);
  const kinds = new Set<string>();
  for (let i = 0; i < CAN.length; i += 1) {
    const iso = new Date(base + i * 86400000).toISOString().slice(0, 10);
    const c = calculateBazi({ birthSolarDate: iso, birthHour: 12, asOf: `${TOOL_YEAR}-07-01` });
    if (c.luuNien) kinds.add(c.luuNien.tenGod);
  }
  return kinds.size;
})();

/** Số nhãn quan hệ KHÁC NHAU mà lớp con giáp của công cụ phát cho 12 con giáp. */
const TOOL_LABEL_KINDS = new Set(
  ZODIAC.map((z) => buildConGiap2027(z.slug)?.relationLabel ?? '—'),
).size;

export function LuuNienFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn mở trang tử vi năm, đọc một dòng về tuổi mình, rồi mở lá số cá nhân thì thấy một dòng
          khác hẳn — cả hai đều nói về {strong('cùng một năm')} của{' '}
          {strong('cùng một người')}. Không ai chỉ cho bạn hai dòng đó đứng ở đâu so với nhau.
        </>
      }
      why={
        <>
          Vì mọi trang vận theo thời gian đều là {strong('nhiều lớp chồng lên nhau')}, và người ta
          gần như luôn đọc sai theo cùng một kiểu: lấy lớp hẹp nhất làm câu kết luận rồi bỏ qua lớp
          nền. Sai ở đây kéo theo sai ở mọi trang tử vi năm về sau.
        </>
      }
      what={
        <>
          {strong('Lưu')} nghĩa là trôi. {strong('Lưu niên')} là cái mốc trôi theo từng năm, đối lại
          với lá số gốc đứng yên cả đời. Lưu niên của năm {TOOL_YEAR} là {YEAR_CANCHI.name} —{' '}
          {strong('giống hệt nhau với mọi người đang sống')}. Cái riêng của bạn không nằm ở can chi
          ấy, mà ở chỗ nó gặp lá số gốc của bạn ra sao.
        </>
      }
      how={
        <>
          Ba lớp xếp từ rộng tới hẹp: {strong('lá số gốc')} (cả đời, không đổi) →{' '}
          {strong('đại vận')} (mỗi chặng {DV_SPAN} năm) → {strong('lưu niên')} (1 năm). Quy tắc đọc
          gọn trong một câu: {strong('lớp hẹp không xoá lớp rộng')}, nó chỉ tô đậm hoặc làm nhạt một
          phần của lớp rộng.
        </>
      }
      soWhat={
        <>
          Để bạn không đổi kết luận về đời mình mỗi lần sang năm mới, và để bạn nhìn ra một điều ít
          ai nói thẳng: {strong('chia thời gian nhỏ hơn không làm phép tra biết thêm gì về bạn')} —
          đầu vào vẫn là ngày giờ sinh cộng đúng một con số mà cả thế giới dùng chung.
        </>
      }
    />
  );
}

export function LuuNienDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="luu-nien"
        concept="“Lưu niên” đọc theo đúng nghĩa đen"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Lá số của bạn giống một bức tranh vẽ xong từ lúc chào đời. Mỗi năm người ta đặt lên
                bức tranh ấy một {strong('tấm kính màu')} khác — kính đổi mỗi năm, tranh thì không
                đổi bao giờ.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Lưu')} nghĩa là trôi, {strong('niên')} là năm. Lưu niên là cái mốc trôi
                  theo năm. Mỗi năm âm lịch có một cặp can chi riêng — năm {TOOL_YEAR} là{' '}
                  {YEAR_CANCHI.name}, chi {YEAR_CHI} — và cặp ấy chính là lưu niên của năm đó.
                </p>
                <p>
                  Điểm dễ bỏ sót: cặp can chi này {strong('giống hệt nhau với tất cả mọi người')} —
                  nó là thuộc tính của cái năm, không phải của bạn.
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
                  Trong mã của site, lưu niên có đúng hai vế. Vế một là{' '}
                  {strong('can chi của năm')}, suy từ số năm — chung cho cả thế giới. Vế hai là{' '}
                  {strong('Thập Thần của can năm so với Nhật Chủ')} của bạn — đây mới là phần riêng.
                </p>
                <p>
                  Và phần riêng ấy thô hơn ta tưởng: Thập Thần của lưu niên chỉ phụ thuộc can Ngày,
                  mà can Ngày có {CAN.length} giá trị — nên trong một năm bất kỳ,{' '}
                  {strong('xét trên trục Thập Thần')}, lớp lưu niên của Bát Tự chỉ sinh ra đúng{' '}
                  {strong(LN_BUCKETS + ' kiểu đọc')} khác nhau cho toàn bộ người đang sống. Chi của
                  năm gặp chi lá số là một trục riêng, không nằm trong con số này.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="luu-nien"
        concept="Ba lớp chồng nhau — cái gì nằm dưới cái gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Tấm bản đồ vẽ cả đời nằm dưới cùng. Trên nó là một tấm phim phủ{' '}
                {strong('mười năm')} một lần. Trên cùng là tấm kính đổi{' '}
                {strong('mỗi năm')} một lần. Nhìn xuyên cả ba mới thấy đúng.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Trong bài này, {strong('lớp rộng')} nghĩa là lớp phủ nhiều thời gian hơn. Lá số gốc
                  rộng nhất (cả đời), đại vận ở giữa ({DV_SPAN} năm mỗi chặng), lưu niên hẹp nhất
                  (một năm) — và lớp hẹp luôn nằm gọn bên trong lớp rộng.
                </p>
                <p>
                  Engine của site tính ra: người sinh{' '}
                  {P1.birthDate.split('-').reverse().join('/')} ở tuổi {NOW_1.age} nằm trong chặng{' '}
                  {DV_RANGE}, trụ vận {DV_NOW}. Chặng ấy giữ nguyên suốt {DV_SPAN} năm, còn lưu niên
                  đã đổi từ {LN_NOW} sang {LN_NEXT} chỉ sau một năm.
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
                  Chỗ đáng nhớ nhất nằm ở {strong('đầu vào')}, không ở đầu ra. Lá số gốc dựng từ ngày
                  sinh, giờ sinh và giới tính. Đại vận dựng từ{' '}
                  {strong('đúng bộ dữ kiện đó, không thêm gì')} — nó là một cách chia lại cùng một lá
                  số. Lưu niên thêm đúng {strong('một')} con số: năm đang xét.
                </p>
                <p>
                  Nói cách khác, đi từ lớp rộng xuống lớp hẹp thì{' '}
                  {strong('lượng thông tin về bạn không tăng')}, chỉ có số ô để chia là tăng. Đó là
                  lý do bài này dành hẳn một mục để nói vì sao chia càng nhỏ thì độ chắc càng giảm.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="luu-nien"
        concept="Quy tắc đọc: lớp hẹp không xoá lớp rộng"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Chiếu đèn màu lên một bức tranh thì tranh vẫn là tranh ấy. Chỉ có chỗ{' '}
                {strong('sáng lên')} và chỗ {strong('mờ đi')} là đổi. Đèn không vẽ thêm được cái gì
                mới lên tranh.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Lưu niên không thêm nội dung mới vào lá số của bạn. Nó chỉ chỉ vào{' '}
                  {strong('phần nào của lá số gốc đang được chiếu sáng')} trong năm đó. Nếu một câu
                  luận nghe như thể năm nay bạn thành người khác, thì câu đó đã đọc sai lớp — một năm
                  xấu không xoá được nền của bạn, và một năm đẹp cũng không dựng cho bạn một cái nền
                  chưa từng có.
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
                  Kiểm được bằng engine. Ba người dưới đây đều {strong('cùng chi năm sinh')} nên lớp
                  con giáp của trang tử vi năm phát cho cả ba đúng một câu: “{NOW_1.toolLabel}”.
                  Nhưng cùng năm {TOOL_YEAR}, cùng lưu niên {LN_NOW}, Thập Thần của họ lại là{' '}
                  {NOW_1.luuNien.tenGod}, {NOW_2.luuNien.tenGod} và {NOW_3.luuNien.tenGod} — ba kiểu
                  khác nhau, vì Nhật Chủ của họ là {NOW_1.dayMaster}, {NOW_2.dayMaster} và{' '}
                  {NOW_3.dayMaster}.
                </p>
                <p>
                  Đó chính là bằng chứng cho quy tắc: nếu lớp lưu niên xoá được lớp nền thì ba người
                  đã phải ra cùng một kết quả. {strong('Nghĩa của lớp hẹp do lớp rộng quyết định')} —
                  đọc ngược thứ tự là đọc sai.
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
    prompt: 'Lưu niên của một năm gồm mấy vế — vế nào chung cho mọi người, vế nào mới là của riêng bạn?',
    answer: (
      <>
        Hai vế. Vế một là {strong('can chi của năm')} — năm {TOOL_YEAR} là {YEAR_CANCHI.name}, và
        con số này giống hệt nhau với mọi người đang sống, nên nó không nói gì riêng về bạn. Vế hai
        là {strong('quan hệ giữa can chi ấy với lá số gốc của bạn')}, trong Bát Tự hiện ra dưới dạng
        Thập Thần của can năm so với Nhật Chủ. Chỉ vế hai mới riêng — và nó cũng chỉ có{' '}
        {LN_BUCKETS} giá trị có thể có.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Ba lớp lá số gốc, đại vận và lưu niên khác nhau ở ĐẦU VÀO thế nào?',
    choices: [
      {
        text: 'Lá số gốc và đại vận dùng chung một bộ dữ kiện (ngày, giờ sinh, giới tính); lưu niên thêm đúng một con số là năm đang xét',
        correct: true,
        note: 'Đúng — nên đi xuống lớp hẹp hơn thì số ô để chia tăng, còn lượng thông tin về bạn thì không.',
      },
      {
        text: 'Mỗi lớp đòi thêm một dữ kiện mới về bạn, nên lớp càng hẹp càng cá nhân hoá hơn',
        note: 'Không. Đại vận suy ra từ đúng lá số gốc, không thêm dữ kiện nào; còn con số mà lưu niên thêm vào thì cả thế giới dùng chung.',
      },
      {
        text: 'Lưu niên cần giờ sinh chính xác hơn hai lớp kia',
        note: 'Không — cả ba lớp cùng dùng một giờ sinh. Giờ sinh sai thì hỏng từ lớp nền, chứ không riêng lớp năm.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: `Ba người cùng chi năm sinh ${NOW_1.yearChi} tra trang tử vi năm ${TOOL_YEAR}. Điều gì đúng?`,
    choices: [
      {
        text: `Lớp con giáp cho cả ba cùng một câu (“${NOW_1.toolLabel}”), nhưng Thập Thần lưu niên của họ khác nhau vì Nhật Chủ khác nhau`,
        correct: true,
        note: `Đúng — engine cho ra ${NOW_1.luuNien.tenGod}, ${NOW_2.luuNien.tenGod} và ${NOW_3.luuNien.tenGod} cho ba người, dù cả ba cùng lưu niên ${LN_NOW}.`,
      },
      {
        text: 'Cả ba nhận kết quả giống hệt nhau ở mọi lớp, vì cùng con giáp',
        note: 'Không. Lớp con giáp chỉ đọc chi năm sinh; lá số gốc còn phụ thuộc ngày, giờ và giới tính.',
      },
      {
        text: 'Cả ba nhận lưu niên can chi khác nhau vì sinh khác ngày',
        note: `Không. Can chi của năm là thuộc tính của năm — cả ba đều là ${LN_NOW}. Cái khác nhau là nghĩa của nó khi đặt cạnh từng lá số.`,
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt: 'Phát biểu lại quy tắc đọc chồng lớp bằng lời của bạn, và nói vì sao nó quan trọng.',
    answer: (
      <>
        {strong('Lớp hẹp không xoá lớp rộng, nó chỉ tô đậm hoặc làm nhạt một phần của lớp rộng.')}{' '}
        Đọc từ rộng tới hẹp: lá số gốc trước, rồi đại vận, rồi lưu niên. Quan trọng vì đọc ngược thứ
        tự sẽ khiến bạn đổi kết luận về cả đời mình mỗi lần sang năm mới — trong khi thứ vừa đổi chỉ
        là lớp mỏng nhất, và là lớp ít riêng tư nhất trong ba lớp.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Vì sao chia thời gian càng nhỏ thì độ chắc lại GIẢM chứ không tăng?',
    choices: [
      {
        text: 'Vì kết luận hẹp dần trong khi dữ kiện đầu vào đứng yên — chi tiết hơn không đồng nghĩa với có thêm bằng chứng',
        correct: true,
        note: 'Đúng. Cảm giác “nói trúng quá” thường đến từ độ cụ thể, không từ độ chính xác.',
      },
      {
        text: 'Vì các lớp hẹp được tính bằng công thức phức tạp hơn nên dễ có lỗi số học',
        note: 'Không — phép tính lớp năm còn đơn giản hơn lớp nền. Vấn đề nằm ở lượng thông tin, không ở độ khó của phép tính.',
      },
      {
        text: 'Không đúng — lớp càng hẹp thì càng sát thực tế nên càng đáng tin',
        note: 'Đây chính là ngộ nhận bài này muốn tháo. Hẹp hơn nghĩa là nói mạnh hơn với cùng một lượng dữ kiện, tức đáng ngờ hơn.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'open',
    prompt: `Vì sao lưu niên lặp lại sau ${CYCLE} năm, mà lần lặp ấy vẫn không cho ra cùng một cách luận?`,
    answer: (
      <>
        Vì can chi ghép {CAN.length} thiên can với {CHI.length} địa chi nên chuỗi lặp lại sau đúng{' '}
        {strong(CYCLE + ' năm')} — đó là bội chung nhỏ nhất của hai con số. Nhưng lưu niên chỉ là lớp
        hẹp nhất: sau {CYCLE} năm bạn đã sang một chặng đại vận khác và ở một tuổi khác, nên{' '}
        {strong('lớp rộng bên dưới đã đổi')}. Cùng một tấm kính màu đặt lên hai chỗ khác nhau của
        bức tranh thì cho ra hai cảnh khác nhau.
      </>
    ),
  },
];

export function LuuNienRecall() {
  return <ActiveRecall topicId="luu-nien" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'definition',
    facet: 'Định nghĩa',
    can: `Nói được "lưu" nghĩa là trôi, và lưu niên là mốc trôi theo từng năm — đối lại với lá số gốc đứng yên cả đời.`,
  },
  {
    id: 'shared-vs-personal',
    facet: 'Chung hay riêng',
    can: 'Tách được hai vế của lưu niên: can chi của năm thì giống hệt nhau với mọi người, còn phần riêng chỉ nằm ở chỗ can chi ấy gặp lá số gốc của bạn.',
  },
  {
    id: 'three-layers',
    facet: 'Ba lớp',
    can: 'Xếp đúng thứ tự lá số gốc → đại vận → lưu niên theo độ rộng thời gian, và nói được mỗi lớp đổi vào lúc nào.',
  },
  {
    id: 'input',
    facet: 'Đầu vào từng lớp',
    can: 'Chỉ ra rằng đại vận không thêm dữ kiện nào ngoài lá số gốc, còn lưu niên chỉ thêm đúng một con số là năm đang xét — con số mà cả thế giới dùng chung.',
  },
  {
    id: 'reading-rule',
    facet: 'Quy tắc đọc',
    can: 'Phát biểu được "lớp hẹp không xoá lớp rộng, chỉ tô đậm hoặc làm nhạt", và nói được vì sao phải đọc từ lớp rộng xuống lớp hẹp.',
  },
  {
    id: 'same-chart-two-years',
    facet: 'Hai năm, một lá số',
    can: 'Giải thích được vì sao cùng một lá số mà hai năm khác nhau lại luận khác nhau, mà không cần giả định lá số đã thay đổi.',
  },
  {
    id: 'resolution',
    facet: 'Độ phân giải',
    can: 'Nói được vì sao chia thời gian càng nhỏ thì độ chắc càng giảm, và vì sao cảm giác "nói trúng quá" thường đến từ độ cụ thể chứ không phải độ chính xác.',
  },
  {
    id: 'tool-scope',
    facet: 'Công cụ tính gì',
    can: 'Phân biệt được lớp con giáp của trang tử vi năm (chỉ đọc năm sinh, cả nhóm tuổi cùng một câu) với lưu niên cá nhân (cần lá số thật từ ngày, giờ, giới tính).',
  },
  {
    id: 'decision',
    facet: 'Quyết định',
    can: 'Nói được vì sao một năm bị luận là xấu không phải bản án, và vì sao hoãn việc lớn để chờ một năm đẹp là trả giá thật cho một quy ước.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người thân trong một phút: lưu niên là gì, ba lớp chồng nhau ra sao, và vì sao lớp mỏng nhất lại là lớp ít nói về bạn nhất.',
  },
];

export function LuuNienChecklist() {
  return <UnderstandingChecklist topicId="luu-nien" facets={FACETS} />;
}

export function LuuNienWhys() {
  return (
    <FiveWhys
      topicId="luu-nien"
      start={
        <>
          Một người mở trang tử vi năm {TOOL_YEAR}, đọc được dòng “{NOW_1.toolLabel}” cho tuổi của
          mình, rồi kết luận: năm nay mình ổn, cứ thế mà làm. Người ấy không mở thêm lớp nào khác.
        </>
      }
      chain={[
        {
          question: 'Vì sao trang đó đưa ra được một dòng như vậy?',
          because: (
            <>
              Vì nó chạy đúng một phép so sánh: đặt {strong('chi của năm sinh')} cạnh{' '}
              {strong('chi của năm đang xét')} rồi đọc quan hệ giữa hai chi. Toàn bộ đầu vào là một
              con số — năm sinh. Không cần ngày, không cần giờ, không cần giới tính.
            </>
          ),
        },
        {
          question: 'Vì sao chỉ một dữ kiện mà vẫn ra được câu nghe như dành cho mình?',
          because: (
            <>
              Vì lớp đó gom cả nhân loại vào {CHI.length} nhóm, và {CHI.length} nhóm ấy chỉ sinh ra{' '}
              {strong(TOOL_LABEL_KINDS + ' nhãn quan hệ')} khác nhau. Hàng chục triệu người nhận
              chung một câu. Câu ấy đúng ở mức nó có thể đúng — nhưng nó chưa hề nhìn thấy bạn.
            </>
          ),
        },
        {
          question: 'Vậy lớp lưu niên cá nhân có khá hơn không?',
          because: (
            <>
              Khá hơn, nhưng ít hơn ta tưởng. Can chi của năm vẫn là {LN_NOW} với mọi người; thứ làm
              nó khác nhau là {strong('lá số gốc bên dưới')}. Ba người cùng chi năm sinh trong bài
              này nhận ba Thập Thần khác nhau — {NOW_1.luuNien.tenGod}, {NOW_2.luuNien.tenGod} và{' '}
              {NOW_3.luuNien.tenGod} — chỉ vì Nhật Chủ của họ khác nhau.
            </>
          ),
        },
        {
          question: 'Thế thì cứ đọc thẳng lưu niên, bỏ qua đại vận và lá số gốc, có được không?',
          because: (
            <>
              Không, vì lưu niên {strong('không tự đứng được')}. Nó chỉ tô đậm hoặc làm nhạt một
              phần của lớp rộng hơn, và cái phần ấy do lớp rộng quy định. Bỏ lớp nền đi thì lưu niên
              còn lại đúng một cặp can chi — cặp mà cả thế giới đang dùng chung trong năm ấy.
            </>
          ),
        },
        {
          question: 'Vì sao càng chia nhỏ thời gian thì càng phải cẩn thận hơn, chứ không phải yên tâm hơn?',
          because: (
            <>
              Vì kết luận hẹp dần trong khi dữ kiện đầu vào đứng yên: lá số gốc và đại vận dùng
              chung một bộ dữ kiện, còn lưu niên chỉ thêm một con số mà cả thế giới dùng chung. Nói
              mạnh hơn với cùng một lượng bằng chứng thì {strong('độ chắc phải giảm')} — dù cảm giác
              chủ quan đi ngược chiều, vì càng cụ thể càng nghe như càng trúng.
            </>
          ),
        },
      ]}
      root={
        <>
          Ba lớp không phải ba nguồn tin độc lập; chúng là{' '}
          {strong('ba độ phân giải của cùng một bộ dữ kiện thô')}. Đọc từ rộng tới hẹp, và nhớ rằng
          lớp hẹp nhất cũng là lớp ít nói về bạn nhất — hiểu tới đây thì bạn vẫn xem tử vi năm cho
          vui được, nhưng sẽ không hoãn một việc thật vì một tấm kính màu đổi mỗi năm một lần.
        </>
      }
    />
  );
}
