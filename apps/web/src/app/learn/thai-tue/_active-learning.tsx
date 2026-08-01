/**
 * Nội dung "học chủ động" cho trang /learn/thai-tue — bài CHÍNH THỨC về Thái Tuế.
 *
 * GROUNDING — mọi con số can chi trên file này đều SUY TẠI RUNTIME, không gõ tay:
 *   • lib/xem-tuoi-cuoi.ts — CHI (12 địa chi), LUC_XUNG (6 cặp lục xung),
 *     ANIMAL_BY_CHI, canChiOfYear(year) = mốc (year − 4) % 12, 1900 = Tý.
 *   • lib/hop-tuoi-pairs.ts — ZODIAC + relationOf(): phân 6 loại quan hệ giữa hai
 *     chi (dong-tuoi / tam-hop / luc-hop / luc-xung / luc-hai / binh-hoa). KHÔNG
 *     có lớp Tương Hình trong tập này.
 *   • app/tu-vi-2026/con-giap-data.ts — công cụ /tu-vi-2026: YEAR, YEAR_CANCHI.
 *
 * CÔNG CỤ TÍNH GÌ (đọc code, không đoán): trùng Thái Tuế → CÓ; xung Thái Tuế →
 * CÓ; hại Thái Tuế → CÓ nhưng hiển thị dưới tên "Lục Hại với năm"; hình Thái Tuế
 * (Tương Hình) → KHÔNG tính ở bất kỳ đâu trong repo (grep 'Tương Hình' chỉ ra các
 * bài Học ghi rõ công cụ chưa tính lớp này).
 *
 * PHẠM VI: KHÔNG dạy lại hình học vòng 12 chi (bài /learn/tam-hop-luc-xung),
 * KHÔNG dạy lại cách chọn năm mở hàng (bài /learn/khai-truong), KHÔNG dạy bảng
 * Tương Hình (kiến thức nền ở /learn/hop-tuoi).
 *
 * Giọng: Thái Tuế là QUY ƯỚC LỊCH PHÁP – PHONG TỤC để tham khảo, không phải một
 * lực tác động; năm tuổi không phải năm xui; không doạ, không bán giải hạn.
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
import { CHI, LUC_XUNG, ANIMAL_BY_CHI, canChiOfYear, type Chi } from '@/lib/xem-tuoi-cuoi';
import { ZODIAC, relationOf } from '@/lib/hop-tuoi-pairs';
import { YEAR as TOOL_YEAR, YEAR_CANCHI, YEAR_CHI } from '@/app/tu-vi-2026/con-giap-data';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── Suy dữ kiện từ lib (không gõ tay con số nào) ─────────────────────

/** Khoảng cách bước trên vòng 12 chi giữa một chi và chi xung với nó. */
const XUNG_STEPS = (() => {
  const steps = new Set(
    CHI.map((c) => ((CHI.indexOf(LUC_XUNG[c]) - CHI.indexOf(c)) % CHI.length + CHI.length) % CHI.length),
  );
  return steps.size === 1 ? [...steps][0] : undefined;
})();

/** `count` năm gần nhất từ `from` có địa chi đúng bằng `chi`. */
function nextYearsWithChi(chi: Chi, from: number, count: number): number[] {
  const out: number[] = [];
  for (let y = from; out.length < count; y += 1) {
    if (canChiOfYear(y).chi === chi) out.push(y);
  }
  return out;
}

/** Số năm trong một vòng 12 mà một tuổi bất kỳ dính trùng / xung / hại. */
const HIT_YEARS = (() => {
  const self = ZODIAC[0];
  if (!self) return 0;
  return ZODIAC.filter((z) => {
    const r = relationOf(self.slug, z.slug);
    return r === 'dong-tuoi' || r === 'luc-xung' || r === 'luc-hai';
  }).length;
})();

const FREE_YEARS = CHI.length - HIT_YEARS;

/** Ba năm sinh làm ví dụ — mỗi năm rơi vào một quan hệ khác nhau với năm công cụ. */
const CASE_TRUNG = 1990;
const CASE_XUNG = 1996;
const CASE_BINH_HOA = 2000;

const CHI_TRUNG = canChiOfYear(CASE_TRUNG).chi;
const CHI_XUNG = canChiOfYear(CASE_XUNG).chi;
const CHI_BINH_HOA = canChiOfYear(CASE_BINH_HOA).chi;

const NEXT_TRUNG_YEARS = nextYearsWithChi(CHI_TRUNG, TOOL_YEAR, 3);
const NEXT_XUNG_YEARS = nextYearsWithChi(LUC_XUNG[CHI_TRUNG], TOOL_YEAR, 2);

const YEAR_ANIMAL = ANIMAL_BY_CHI[YEAR_CHI];
const PREV_YEAR_CANCHI = canChiOfYear(TOOL_YEAR - 1);

/**
 * Chu kỳ quỹ đạo (sidereal) của Mộc tinh, tính bằng năm. Hằng số thiên văn —
 * không có lib nào của site suy ra được, nên khai báo tại đây và MỌI con số về
 * độ lệch bên dưới đều tính từ nó.
 */
const JUPITER_PERIOD_YEARS = 11.862;
// Nhãn hiển thị dùng dấu PHẨY — xem chú thích cùng tên ở page.tsx: in thẳng số JS
// ra tiếng Việt sẽ đọc thành "mười một nghìn tám trăm sáu mươi hai năm".
const JUPITER_LABEL = '11,862';

/** Sau bao nhiêu năm thì Mộc tinh thật lệch trọn MỘT chi so với vòng 12 quy ước. */
const DRIFT_ONE_BRANCH_YEARS = Math.round(
  1 / (1 / JUPITER_PERIOD_YEARS - 1 / CHI.length) / CHI.length,
);

export function ThaiTueFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Cứ gần Tết là bạn nghe những câu như {strong('“năm nay tuổi bạn phạm Thái Tuế”')} hay “năm
          tuổi phải kiêng việc lớn”. Không ai nói rõ Thái Tuế là cái gì, đo bằng gì, và vì sao nó lại
          rơi trúng bạn năm nay chứ không phải năm khác.
        </>
      }
      why={
        <>
          Vì đây là {strong('khái niệm nền')} nằm dưới rất nhiều trang tra cứu: tử vi năm, chọn tuổi
          mở hàng, chọn người xông đất. Hiểu sai một lần ở đây thì đọc sai ở mọi chỗ sau — và người ta
          thường sai theo hướng lo nhiều hơn mức cần thiết.
        </>
      }
      what={
        <>
          Thái Tuế của một năm chính là {strong('địa chi của năm âm lịch đó')}. Năm {TOOL_YEAR} là{' '}
          {YEAR_CANCHI.name}, chi {YEAR_CHI} — nên Thái Tuế năm nay là {YEAR_CHI}, con {YEAR_ANIMAL}.
          Nó là {strong('một ô lịch')}, không phải một lực, cũng không phải một ngôi sao đang chiếu
          xuống ai.
        </>
      }
      how={
        <>
          Đặt chi của năm cạnh chi tuổi bạn rồi đọc quan hệ giữa hai chi. Bốn quan hệ hay được nhắc:{' '}
          {strong('trùng')} (năm tuổi), {strong('xung')} (tuế phá), {strong('hình')} và{' '}
          {strong('hại')}. Trong đó công cụ của hieu.asia tính ba, và{' '}
          {strong('không tính hình Thái Tuế')}.
        </>
      }
      soWhat={
        <>
          Để bạn đọc dòng “Thái Tuế” trong mọi kết quả tra cứu như đọc một{' '}
          {strong('nhãn lịch')} chứ không phải một lời phán: biết nó được tính từ đâu, biết nó không
          nói gì về chuyện sẽ xảy ra, và không hoãn việc của đời mình chỉ vì một con giáp trùng nhau.
        </>
      }
    />
  );
}

export function ThaiTueDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="thai-tue"
        concept="Thái Tuế là gì — đọc theo đúng nghĩa đen"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi năm có một con vật cầm cờ. Năm {TOOL_YEAR} là con {YEAR_ANIMAL} cầm cờ. Người xưa
                gọi bạn cầm cờ của năm là {strong('Thái Tuế')}. Chỉ vậy thôi — giống như lớp mình mỗi
                tuần đổi một bạn trực nhật.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Lịch can chi ghép 10 Thiên Can với 12 Địa Chi. Phần {strong('địa chi')} của một năm
                  chính là con giáp của năm đó, và người xưa gọi con giáp cầm cờ ấy là Thái Tuế. Năm{' '}
                  {TOOL_YEAR} là {YEAR_CANCHI.name} nên Thái Tuế năm {TOOL_YEAR} là {YEAR_CHI}.
                </p>
                <p>
                  Tuổi bạn cũng có một chi — chi của năm sinh. Mọi câu chuyện “phạm Thái Tuế” chỉ là{' '}
                  {strong('đặt hai chi cạnh nhau')} rồi xem chúng ở quan hệ nào: trùng nhau, đối
                  nhau, hay không dính gì.
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
                  Trong mã của hieu.asia, chi của năm ra từ đúng một phép:{' '}
                  {strong('canChiOfYear(năm)')} lấy phần dư của (năm − 4) chia 12. Không có tham số
                  nào khác — không giờ sinh, không giới tính, không vị trí thiên thể. Vì vậy Thái Tuế
                  là một đại lượng của {strong('lịch')}, không phải của bạn.
                </p>
                <p>
                  Hệ quả cần nhớ: mọi người sinh cùng một năm âm lịch có cùng quan hệ với Thái Tuế
                  của mọi năm. Đây là {strong('lát cắt thô nhất')} trong các phép tra — nó gom hàng
                  triệu người vào chung một ô, nên không thể dùng để nói bất cứ điều gì riêng về một
                  người.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="thai-tue"
        concept="Vì sao lại có cái tên “Thái Tuế”"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Ngày xưa chưa có lịch treo tường, người ta nhìn một{' '}
                {strong('ngôi sao đi rất chậm')} trên trời để biết đã qua mấy năm. Ngôi sao ấy đi gần
                hết một vòng trong khoảng mười hai năm, nên nó thành cái lịch của cả làng.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Ngôi sao đó là {strong('Mộc tinh')} — người xưa gọi là Tuế Tinh, tức “sao của năm”.
                  Mộc tinh đi hết một vòng quanh Mặt Trời trong khoảng{' '}
                  {JUPITER_LABEL} năm, tức mỗi năm nhích được khoảng một phần {CHI.length} bầu
                  trời. Rất tiện để đặt tên năm.
                </p>
                <p>
                  Nhưng Mộc tinh đi {strong('ngược chiều')} với chiều đếm 12 chi mà người xưa quen
                  dùng. Nên họ tưởng tượng ra một điểm chạy ngược lại, đúng {CHI.length} năm một vòng,
                  và đặt tên là {strong('Thái Tuế')} — “cái tuế lớn”. Thái Tuế sinh ra để cho phép
                  đếm gọn, chứ không phải để mô tả một vật thể có thật.
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
                  Chỗ cần tách bạch: {strong('chu kỳ ' + JUPITER_LABEL + ' năm là thiên văn')},
                  còn con số {CHI.length} chẵn và chiều chạy là {strong('quy ước')}. Hai thứ đó không
                  bằng nhau, và lịch can chi từ lâu đã không hiệu chỉnh theo vị trí thật của Mộc tinh
                  nữa.
                </p>
                <p>
                  Đo được luôn độ lệch: mỗi vòng quy ước {CHI.length} năm thì Mộc tinh thật đi hơi
                  quá, nên sau khoảng {strong(DRIFT_ONE_BRANCH_YEARS + ' năm')} nó lệch trọn một chi
                  so với Thái Tuế của lịch. Nói cách khác, “Thái Tuế” hôm nay là một{' '}
                  {strong('ô trong bảng lịch')} — cái tên còn giữ gốc thiên văn, nội dung thì không.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="thai-tue"
        concept="Bốn quan hệ — và cái mà công cụ KHÔNG tính"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Con giáp của bạn và con giáp của năm có thể {strong('giống nhau')}, có thể{' '}
                {strong('ngồi đối diện nhau')} trên vòng tròn, hoặc chẳng liên quan gì. Người lớn đặt
                cho mỗi trường hợp một cái tên, thế thôi.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Bốn cái tên hay gặp: {strong('trùng Thái Tuế')} là chi năm trùng chi tuổi (dân gian
                  gọi là “năm tuổi”); {strong('xung Thái Tuế')} là chi năm đối chi tuổi, còn gọi là
                  tuế phá; {strong('hình')} và {strong('hại')} là hai lớp phụ, ít thống nhất hơn.
                </p>
                <p>
                  Điều đáng nhớ nhất: hieu.asia {strong('không tính hình Thái Tuế')}. Trang tử vi năm
                  có tính lớp hại, nhưng hiển thị dưới tên “Lục Hại với năm”. Cái gì công cụ không
                  tính thì trang này nói thẳng là không tính, thay vì viết mập mờ cho đủ bốn.
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
                  Tập quan hệ trong mã nguồn là sáu loại rời nhau: cùng tuổi, tam hợp, lục hợp, lục
                  xung, lục hại, bình hoà. {strong('Tương Hình không nằm trong tập này')} — grep toàn
                  repo chỉ ra các bài Học ghi rõ “công cụ chưa tính lớp Tương Hình”. Đó là lựa chọn có
                  chủ ý, vì tên gọi các nhóm Hình còn khác nhau giữa các bản in.
                </p>
                <p>
                  Vì sáu loại rời nhau nên {strong('trùng và xung không bao giờ rơi vào cùng một năm')}.
                  Với một tuổi bất kỳ, trong mỗi vòng {CHI.length} năm chỉ có {HIT_YEARS} năm dính một
                  trong ba quan hệ được tính, còn lại {FREE_YEARS} năm là bình hoà hoặc thuộc nhóm hợp.
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
    prompt: 'Thái Tuế của một năm được xác định bằng dữ kiện gì — và KHÔNG cần dữ kiện gì?',
    answer: (
      <>
        Chỉ cần {strong('địa chi của năm âm lịch')} đó. Năm {TOOL_YEAR} là {YEAR_CANCHI.name} nên
        Thái Tuế là {YEAR_CHI}. Phép tính không cần giờ sinh, không cần giới tính, không cần vị trí
        thiên thể nào — nó đọc thẳng từ bảng lịch can chi, nên là đại lượng của lịch chứ không phải
        của riêng ai.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Cái tên “Thái Tuế” liên quan thế nào tới Mộc tinh?',
    choices: [
      {
        text: `Mộc tinh đi hết một vòng trong khoảng ${JUPITER_LABEL} năm nên được dùng để đếm năm; Thái Tuế là điểm tưởng tượng chạy ngược lại, làm tròn đúng ${CHI.length} năm một vòng`,
        correct: true,
        note: 'Đúng — chu kỳ là thiên văn, con số 12 chẵn và chiều chạy là quy ước cho dễ đếm.',
      },
      {
        text: 'Thái Tuế chính là Mộc tinh, chỉ là tên gọi khác',
        note: `Không — nếu là một thứ thì lịch đã phải trôi theo Mộc tinh. Thực tế sau khoảng ${DRIFT_ONE_BRANCH_YEARS} năm, Mộc tinh thật lệch trọn một chi so với vòng quy ước.`,
      },
      {
        text: 'Không liên quan gì tới thiên văn, tên gọi thuần tuý dân gian',
        note: 'Không — gốc tên đúng là từ Tuế Tinh, tức Mộc tinh. Chỉ có nội dung ngày nay là quy ước lịch pháp.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Trong bốn quan hệ trùng – xung – hình – hại, công cụ của hieu.asia tính những cái nào?',
    choices: [
      {
        text: 'Tính trùng và xung; có tính lớp hại nhưng gọi là “Lục Hại với năm”; KHÔNG tính hình',
        correct: true,
        note: 'Đúng — và trang nói thẳng chỗ không tính thay vì viết mập mờ cho đủ bốn.',
      },
      {
        text: 'Tính cả bốn, chỉ khác tên gọi',
        note: 'Không — lớp Tương Hình không có trong tập quan hệ của mã nguồn; các bài Học khác cũng ghi rõ điều này.',
      },
      {
        text: 'Chỉ tính trùng, ba cái còn lại đều không',
        note: 'Không — xung Thái Tuế là quan hệ được tính ở cả trang tử vi năm lẫn trang xem tuổi khai trương.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: `Người sinh năm ${CASE_XUNG} (chi ${CHI_XUNG}) đứng ở quan hệ nào với năm ${TOOL_YEAR} (chi ${YEAR_CHI})?`,
    choices: [
      {
        text: `Xung Thái Tuế — vì ${CHI_XUNG} và ${YEAR_CHI} là một cặp đối trên vòng ${CHI.length} chi`,
        correct: true,
        note: `Đúng. Còn người sinh ${CASE_TRUNG} (chi ${CHI_TRUNG}) thì năm ${TOOL_YEAR} lại là năm tuổi — hai chuyện khác nhau, không bao giờ rơi vào cùng một người trong cùng một năm.`,
      },
      {
        text: 'Trùng Thái Tuế, tức năm tuổi',
        note: `Không — năm tuổi là khi chi năm TRÙNG chi tuổi. Năm ${TOOL_YEAR} là năm tuổi của người chi ${YEAR_CHI}.`,
      },
      {
        text: 'Bình hoà, không dính quan hệ nào',
        note: `Không — bình hoà là ví dụ của người sinh ${CASE_BINH_HOA} (chi ${CHI_BINH_HOA}) trong năm ${TOOL_YEAR}.`,
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: 'Vì sao năm tuổi lặp lại đúng 12 năm một lần, và vì sao nó luôn cách năm xung 6 năm?',
    answer: (
      <>
        Vì chi của năm chạy trên một vòng {CHI.length} chi rồi lặp lại, nên chi trùng chi tuổi bạn
        xuất hiện đúng một lần mỗi vòng. Còn lục xung là {strong('hai chi đối đỉnh')}, cách nhau{' '}
        {XUNG_STEPS ?? 0} bước trên vòng đó, nên năm xung luôn nằm cách năm tuổi {XUNG_STEPS ?? 0}{' '}
        năm. Người sinh {CASE_TRUNG} có năm tuổi {NEXT_TRUNG_YEARS[0]} và năm xung{' '}
        {NEXT_XUNG_YEARS[0]}.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Bạn đã chốt lịch mở một lớp học vào năm trùng chi tuổi mình. Nên xử lý thế nào?',
    choices: [
      {
        text: 'Cứ làm — trùng chi là một nhãn lịch, không phải dữ kiện nói việc sẽ thành hay bại',
        correct: true,
        note: 'Đúng. Chuẩn bị, dòng tiền và năng lực mới là thứ quyết định; phép tra không biết gì về những thứ đó.',
      },
      {
        text: 'Hoãn sang năm sau cho chắc',
        note: 'Không nên. Hoãn vì một con giáp trùng nhau là trả giá thật cho một quy ước — và năm sau lại có lý do kiêng khác.',
      },
      {
        text: 'Nhờ người khác đứng tên để tránh Thái Tuế',
        note: 'Không giải quyết gì. Người đứng tên đổi thì nhãn lịch đổi, còn rủi ro thật của việc thì vẫn nguyên.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt: `Vận dụng: bạn sinh đầu tháng 2 năm ${TOOL_YEAR} dương lịch. Chi tuổi bạn là gì, và vì sao dễ tra nhầm?`,
    answer: (
      <>
        Là {PREV_YEAR_CANCHI.chi}, chứ không phải {YEAR_CHI}. Vì mốc đổi chi là{' '}
        {strong('Tết âm lịch')} chứ không phải ngày 1 tháng 1: sinh trước Tết thì vẫn thuộc năm âm
        liền trước, tức {PREV_YEAR_CANCHI.name}. Tra nhầm chỗ này là lệch hẳn một con giáp, kéo theo
        sai cả quan hệ trùng – xung – hại của mọi năm về sau.
      </>
    ),
  },
];

export function ThaiTueRecall() {
  return <ActiveRecall topicId="thai-tue" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'definition',
    facet: 'Định nghĩa',
    can: 'Nói được Thái Tuế của một năm chính là địa chi của năm âm lịch đó, và phép tính chỉ cần đúng một dữ kiện là năm — không cần giờ sinh, giới tính hay vị trí thiên thể.',
  },
  {
    id: 'origin',
    facet: 'Nguồn gốc tên gọi',
    can: 'Kể được vì sao tên gọi gắn với Mộc tinh (Tuế Tinh), và tách được đâu là thiên văn (chu kỳ quỹ đạo) với đâu là quy ước (làm tròn 12 năm, chạy ngược chiều).',
  },
  {
    id: 'relations',
    facet: 'Bốn quan hệ',
    can: 'Phân biệt trùng Thái Tuế (năm tuổi), xung Thái Tuế (tuế phá), hình Thái Tuế và hại Thái Tuế — biết mỗi cái được đọc ra từ vị trí nào giữa chi năm và chi tuổi.',
  },
  {
    id: 'tool-scope',
    facet: 'Công cụ tính gì',
    can: 'Nói đúng cái nào hieu.asia thật sự tính: trùng và xung có, lớp hại có nhưng hiển thị dưới tên Lục Hại, còn hình Thái Tuế thì không tính ở bất kỳ đâu.',
  },
  {
    id: 'cycle',
    facet: 'Chu kỳ',
    can: 'Giải thích vì sao năm tuổi lặp lại 12 năm một lần, vì sao nó luôn cách năm xung 6 năm, và tra được năm tuổi kế tiếp của một năm sinh bất kỳ.',
  },
  {
    id: 'boundary-date',
    facet: 'Mốc đổi năm',
    can: 'Nhớ rằng chi của năm đổi ở Tết âm lịch chứ không phải ngày 1 tháng 1, nên người sinh trước Tết vẫn mang chi của năm âm liền trước.',
  },
  {
    id: 'not-a-force',
    facet: 'Ranh giới',
    can: 'Chỉ ra Thái Tuế là quy ước lịch pháp – phong tục chứ không phải một lực tác động, và năm tuổi không phải năm xui — nó không nói gì về việc sẽ xảy ra.',
  },
  {
    id: 'decision',
    facet: 'Quyết định',
    can: 'Nói được vì sao không nên hoãn một việc lớn chỉ vì năm đó trùng chi tuổi, và vì sao “nhờ người hợp tuổi đứng tên” không đổi được rủi ro thật của việc.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người thân trong một phút, bằng lời thường: Thái Tuế là gì, vì sao năm tuổi tới 12 năm một lần, và vì sao đó không phải chuyện đáng sợ.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Nói được phần nào bạn chưa nắm — ví dụ vì sao lục xung lại là hai chi đối đỉnh — và biết bài nào trên hieu.asia lấp phần đó.',
  },
];

export function ThaiTueChecklist() {
  return <UnderstandingChecklist topicId="thai-tue" facets={FACETS} />;
}

export function ThaiTueWhys() {
  return (
    <FiveWhys
      topicId="thai-tue"
      start={
        <>
          Một người sinh năm {CASE_TRUNG} nghe nói {TOOL_YEAR} là năm tuổi của mình, liền hoãn việc
          mở một cửa hàng đã chuẩn bị xong sang năm sau. Người ấy tin rằng năm tuổi là năm xui.
        </>
      }
      chain={[
        {
          question: 'Vì sao gọi đó là “năm tuổi”?',
          because: (
            <>
              Vì chi của năm {TOOL_YEAR} là {YEAR_CHI}, mà người sinh {CASE_TRUNG} cũng mang chi{' '}
              {CHI_TRUNG}. {strong('Hai chi trùng nhau')} — dân gian gọi trường hợp này là năm tuổi,
              hay trùng Thái Tuế. Đó là toàn bộ nội dung của phép tính.
            </>
          ),
        },
        {
          question: 'Vì sao hai chi trùng nhau lại được đặt tên riêng?',
          because: (
            <>
              Vì vòng địa chi có {CHI.length} ô, nên việc trùng chi chỉ xảy ra{' '}
              {strong('một lần mỗi ' + CHI.length + ' năm')}. Cái gì hiếm và đều đặn thì dễ được đặt
              tên và dễ được gán ý nghĩa — đó là cách hầu hết các mốc phong tục ra đời.
            </>
          ),
        },
        {
          question: 'Vì sao cái tên ấy lại kéo theo nghĩa “nên kiêng”?',
          because: (
            <>
              Vì Thái Tuế vốn được hình dung như {strong('vị cầm cờ của năm')}, nên “đứng cùng ô với
              người cầm cờ” được diễn giải là dễ va chạm. Đây là một{' '}
              {strong('phép ẩn dụ')}, không phải một quan sát — không có phép đo nào đứng sau nó.
            </>
          ),
        },
        {
          question: 'Vì sao ẩn dụ đó vẫn được tin, kể cả khi biết nó là ẩn dụ?',
          because: (
            <>
              Vì nó {strong('không thể sai')}. Năm nào cũng có chuyện không như ý; ai đang cảnh giác
              thì nhớ những chuyện ấy kỹ hơn và nối chúng vào nhãn “năm tuổi”. Còn năm tuổi trôi qua
              êm thì không ai kể lại. Bộ đếm chỉ chạy theo một chiều.
            </>
          ),
        },
        {
          question: 'Vậy hoãn cửa hàng sang năm sau thì được gì và mất gì?',
          because: (
            <>
              Được một cảm giác an tâm, mất một năm thật của đời mình — tiền thuê, đà chuẩn bị, cơ
              hội. Và năm sau lại có nhãn kiêng khác đang chờ. {strong('Cái giá là thật')}, còn cái
              được thì nằm trong một quy ước lịch.
            </>
          ),
        },
      ]}
      root={
        <>
          Thái Tuế là một cách gọi tên ô lịch, không phải một lực tác động. Hiểu tới đây thì bạn vẫn
          có thể giữ tục lệ nếu muốn — thắp nén nhang, làm việc chắc tay hơn — nhưng{' '}
          {strong('không trả giá thật cho một cái nhãn')}, và không để ai bán cho bạn cách hoá giải
          một thứ vốn chỉ là phép đếm.
        </>
      }
    />
  );
}
