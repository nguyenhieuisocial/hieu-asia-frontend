/**
 * Nội dung "học chủ động" + TOÀN BỘ SỐ LIỆU cho trang /learn/cuoi-hoi.
 *
 * GROUNDING — mọi con số ở đây (và trong page.tsx, qua `WEDDING_STATS`) đều
 * TÍNH LẠI bằng chính engine, không gõ tay: lib/xem-tuoi-cuoi.ts → checkKimLau()
 * (tuổi mụ = năm cưới − năm sinh + 1, dư 1/3/6/8 là phạm) · checkTamTai() (chi
 * năm cưới nằm trong 3 chi Tam Tai của nhóm tuổi) · checkXungNam() (lục xung /
 * trùng chi = "năm tuổi") · checkWeddingYear() GỘP ba thứ đó thành MỘT verdict
 * đúng một dòng `kimLau || tamTai → 'pham'; ngược lại xung → 'can-nhac'; còn lại
 * 'thuan'` · VERDICT_LABEL (chữ hiển thị, nguyên văn) · goodYearsFrom() (quét 8
 * năm, lấy tối đa 3 năm 'thuan'). Trang công cụ app/xem-tuoi-cuoi/page.tsx +
 * components/xem-tuoi-cuoi/XemTuoiCuoiChecker.tsx: ô cô dâu bắt buộc, ô chú rể
 * tuỳ chọn (Kim Lâu chú rể in ra nhưng ghi rõ "chỉ để tham khảo"); Hoang Ốc CỐ Ý
 * không gộp vì theo tục dùng khi làm nhà. PHÂN VAI: bài này sở hữu phần GỘP và
 * xác suất còn lại; cơ chế từng hạn thuộc bài riêng (/learn/kim-lau,
 * /learn/tam-tai, /learn/hoang-oc) nên ở đây mỗi hạn chỉ 1–2 câu kèm link. Giọng:
 * phong tục để THAM KHẢO, không hù doạ, không bán lễ "giải hạn".
 */

import * as React from 'react';
import {
  CHI,
  LUC_XUNG,
  TAM_TAI_YEARS,
  VERDICT_LABEL,
  checkKimLau,
  checkTamTai,
  checkWeddingYear,
  checkXungNam,
  goodYearsFrom,
  type Chi,
} from '@/lib/xem-tuoi-cuoi';
import { LearnFrame } from '@/components/learn/active/LearnFrame';
import { DepthTabs } from '@/components/learn/active/DepthTabs';
import { FiveWhys } from '@/components/learn/active/FiveWhys';
import { ActiveRecall, type RecallQuestion } from '@/components/learn/active/ActiveRecall';
import {
  UnderstandingChecklist,
  type UnderstandingFacet,
} from '@/components/learn/active/UnderstandingChecklist';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── SỐ LIỆU: QUÉT BẰNG ENGINE, KHÔNG ƯỚC LƯỢNG ───────────────────────
// ANCHOR = năm neo để quét (cả ba hạn đều tuần hoàn nên quét trọn một chu kỳ ở
// đâu cũng ra cùng tỉ lệ). SAMPLE = năm sinh mẫu chỉ dùng để DÒ độ dài chu kỳ.
const ANCHOR = 2026;
const SAMPLE = 2000;

/** Chu kỳ lặp nhỏ nhất của một hạn — DÒ bằng engine thay vì gõ 9 hay 12. */
function cycleOf(hit: (targetYear: number) => boolean): number {
  for (let k = 1; k <= 60; k += 1) {
    let same = true;
    for (let t = ANCHOR; t < ANCHOR + 72; t += 1) {
      if (hit(t) !== hit(t + k)) {
        same = false;
        break;
      }
    }
    if (same) return k;
  }
  return 0;
}

/** Số năm "dính" trong đúng một chu kỳ. */
function hitsIn(cycle: number, hit: (t: number) => boolean): number {
  let n = 0;
  for (let i = 0; i < cycle; i += 1) if (hit(ANCHOR + i)) n += 1;
  return n;
}
const isKimLau = (t: number) => Boolean(checkKimLau(SAMPLE, t).type);
const isTamTai = (t: number) => checkTamTai(SAMPLE, t).isTamTai;
const isXung = (t: number) => checkXungNam(SAMPLE, t).isXung;
const isNamTuoi = (t: number) => checkXungNam(SAMPLE, t).isNamTuoi;

const KIM_LAU_CYCLE = cycleOf(isKimLau);
const TAM_TAI_CYCLE = cycleOf(isTamTai);
const XUNG_CYCLE = cycleOf(isXung);
const NAM_TUOI_CYCLE = cycleOf(isNamTuoi);

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
// FULL_CYCLE = bội chung nhỏ nhất hai chu kỳ chính → lưới quét cho tỉ lệ CHÍNH
// XÁC. GRID_BIRTHS = 12 năm sinh liên tiếp, phủ đủ 12 địa chi. WINDOW = đúng cửa
// sổ mà goodYearsFrom() quét khi công cụ gợi ý năm khác.
const FULL_CYCLE = (KIM_LAU_CYCLE * TAM_TAI_CYCLE) / gcd(KIM_LAU_CYCLE, TAM_TAI_CYCLE);
const GRID_BIRTHS = Array.from({ length: CHI.length }, (_, i) => 1994 + i);
const WINDOW = 8;

const pct = (n: number, d: number) => Math.round((n / d) * 100);

function buildStats() {
  let total = 0;
  const count = { thuan: 0, pham: 0, canNhac: 0, kimLau: 0, tamTai: 0, xung: 0, both: 0 };
  let thuanMin = Number.POSITIVE_INFINITY;
  let thuanMax = 0;
  let phamMin = Number.POSITIVE_INFINITY;
  let phamMax = 0;
  let maxDrySpell = 0;
  let run = 0;

  for (const b of GRID_BIRTHS) {
    let t = 0;
    let p = 0;
    // Quét 2 chu kỳ: 1 chu kỳ đầu để đếm tỉ lệ, cả 2 để đo chuỗi năm không thuận.
    for (let i = 0; i < FULL_CYCLE * 2; i += 1) {
      const r = checkWeddingYear(b, ANCHOR + i);
      if (r.verdict === 'thuan') run = 0;
      else {
        run += 1;
        maxDrySpell = Math.max(maxDrySpell, run);
      }
      if (i >= FULL_CYCLE) continue;
      total += 1;
      if (r.verdict === 'thuan') {
        count.thuan += 1;
        t += 1;
      } else if (r.verdict === 'pham') {
        count.pham += 1;
        p += 1;
      } else count.canNhac += 1;
      if (r.kimLau.type) count.kimLau += 1;
      if (r.tamTai.isTamTai) count.tamTai += 1;
      if (r.xung.isXung) count.xung += 1;
      if (r.kimLau.type && r.tamTai.isTamTai) count.both += 1;
    }
    thuanMin = Math.min(thuanMin, t);
    thuanMax = Math.max(thuanMax, t);
    phamMin = Math.min(phamMin, p);
    phamMax = Math.max(phamMax, p);
    run = 0;
  }

  // Cửa sổ 8 năm: trung bình có mấy năm thuận, có cửa sổ nào trắng tay không.
  let windows = 0;
  let thuanInWindows = 0;
  let emptyWindows = 0;
  // Gộp cho một CẶP: giữ nguyên quy tắc cho cô dâu, cộng thêm điều kiện chú rể.
  let pairs = 0;
  let brideOk = 0;
  let pairCustom = 0;
  let pairStrict = 0;

  for (const b of GRID_BIRTHS) {
    for (let i = 0; i < FULL_CYCLE; i += 1) {
      let c = 0;
      for (let k = 0; k < WINDOW; k += 1) {
        if (checkWeddingYear(b, ANCHOR + i + k).verdict === 'thuan') c += 1;
      }
      windows += 1;
      thuanInWindows += c;
      if (c === 0) emptyWindows += 1;

      const rb = checkWeddingYear(b, ANCHOR + i);
      for (const g of GRID_BIRTHS) {
        const rg = checkWeddingYear(g, ANCHOR + i);
        pairs += 1;
        if (rb.verdict !== 'thuan') continue;
        brideOk += 1;
        // Đúng tục: Kim Lâu chỉ xét cô dâu → chú rể chỉ cần sạch Tam Tai + xung.
        if (!rg.tamTai.isTamTai && !rg.xung.isXung) pairCustom += 1;
        // Nhà nào xét cả Kim Lâu của chú rể.
        if (rg.verdict === 'thuan') pairStrict += 1;
      }
    }
  }

  const onlyOne = count.kimLau + count.tamTai - 2 * count.both;

  return {
    fullCycle: FULL_CYCLE,
    gridSize: total,
    gridBirths: GRID_BIRTHS.length,
    thuanPct: pct(count.thuan, total),
    phamPct: pct(count.pham, total),
    canNhacPct: pct(count.canNhac, total),
    kimLauPct: pct(count.kimLau, total),
    tamTaiPct: pct(count.tamTai, total),
    xungPct: pct(count.xung, total),
    bothPct: pct(count.both, total),
    /** Trong số năm bị gắn nhãn "phạm", bao nhiêu % chỉ dính đúng MỘT hạn. */
    phamFromOnePct: pct(onlyOne, count.pham),
    thuanMin,
    thuanMax,
    phamMin,
    phamMax,
    kimLauCycle: KIM_LAU_CYCLE,
    kimLauHits: hitsIn(KIM_LAU_CYCLE, isKimLau),
    tamTaiCycle: TAM_TAI_CYCLE,
    tamTaiHits: hitsIn(TAM_TAI_CYCLE, isTamTai),
    xungCycle: XUNG_CYCLE,
    xungHits: hitsIn(XUNG_CYCLE, isXung),
    namTuoiCycle: NAM_TUOI_CYCLE,
    namTuoiHits: hitsIn(NAM_TUOI_CYCLE, isNamTuoi),
    window: WINDOW,
    avgThuanInWindow: (thuanInWindows / windows).toFixed(1).replace('.', ','),
    emptyWindowPct: pct(emptyWindows, windows),
    maxDrySpell,
    coupleBridePct: pct(brideOk, pairs),
    coupleCustomPct: pct(pairCustom, pairs),
    coupleStrictPct: pct(pairStrict, pairs),
    /** Các chi mà năm lục xung LẠI NẰM TRONG chính 3 năm Tam Tai của tuổi đó. */
    xungInsideTamTai: (CHI as readonly Chi[]).filter((c) => TAM_TAI_YEARS[c].includes(LUC_XUNG[c])),
  };
}

export const WEDDING_STATS = buildStats();

// Ca xuyên suốt bài: Kim Lâu SẠCH mà kết luận vẫn là "phạm".
const CASE_BIRTH = 1995;
const CASE_YEAR = 2026;
const CASE = checkWeddingYear(CASE_BIRTH, CASE_YEAR);

export function CuoiHoiFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Hai họ vừa chốt được năm cưới thì ai đó tra thử và đọc lên một câu gọn lỏn:{' '}
          {strong('“năm này không được tuổi”')}. Không ai nói rõ là không được vì hạn nào, và vì sao
          chỉ một hạn dính đã đủ để cả năm bị gạch tên.
        </>
      }
      why={
        <>
          Vì “xem tuổi cưới” không phải một phép tính, mà là{' '}
          {strong('vài quy ước rời rạc bị gộp lại')} thành một câu duy nhất. Hiểu cách gộp thì bạn
          đọc được kết luận như một bản kê điều kiện, thay vì nhận một lời phán không lần ngược được.
        </>
      }
      what={
        <>
          Công cụ xét {strong('ba hạn')}: Kim Lâu (theo tuổi mụ cô dâu), Tam Tai (theo nhóm tuổi tam
          hợp) và chi năm lục xung chi tuổi — rút về {strong('một trong ba mức')}: thuận, cần cân
          nhắc, hoặc phạm.
        </>
      }
      how={
        <>
          Quy tắc gộp đúng một dòng: {strong('phạm Kim Lâu HOẶC phạm Tam Tai → “phạm”')}; nếu cả hai
          sạch mà năm cưới xung chi tuổi → “cần cân nhắc”; sạch cả ba → “thuận”. Không cộng điểm,
          không hạn nào “nặng hơn” hạn nào.
        </>
      }
      soWhat={
        <>
          Vì gộp kiểu HOẶC nên mỗi hạn thêm vào chỉ làm cửa hẹp lại. Quét trọn chu kỳ{' '}
          {WEDDING_STATS.fullCycle} năm bằng chính engine:{' '}
          {strong(`chỉ ${WEDDING_STATS.thuanPct}% số năm sạch cả ba hạn`)} — “năm nào cũng phạm gì
          đó” là chuyện bình thường về số học, không phải điềm gở.
        </>
      }
      caption="Bài này dạy phần GỘP; cơ chế từng hạn có bài riêng, dẫn link ở mục 4."
    />
  );
}

export function CuoiHoiDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="cuoi-hoi"
        concept="Cổng HOẶC: vì sao một hạn dính là đủ đổi kết luận"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hình dung ba cái chuông treo trước cửa. Chỉ cần {strong('một cái')} kêu là cả nhà nói
                “năm nay có chuông”. Không cần cả ba cùng kêu, và chuông kêu to hay nhỏ thì câu nói
                vẫn y như vậy.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Công cụ {strong('không cộng điểm')}. Nó hỏi lần lượt: năm này có phạm Kim Lâu không?
                Có phạm Tam Tai không? Chỉ cần một câu trả lời là “có”, kết luận lập tức thành “
                {VERDICT_LABEL['pham']}”. Xung năm là cửa thứ ba và nhẹ hơn hẳn: nó chỉ được xét{' '}
                {strong('khi hai hạn trên đều sạch')}, và lúc đó kết luận hạ xuống “
                {VERDICT_LABEL['can-nhac']}” chứ không thành “phạm”.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Nguyên văn quy tắc trong engine:{' '}
                  {strong('phạm Kim Lâu HOẶC phạm Tam Tai → “phạm”; nếu không, xung năm → “cần cân nhắc”; còn lại → “thuận”')}
                  . Một cổng HOẶC nối tiếp một cổng dự phòng, không phải thang điểm.
                </p>
                <p>
                  Hệ quả quan trọng nhất: {strong('dính hai hạn cùng lúc không nặng hơn dính một')} —
                  cùng một nhãn, cùng một lời khuyên. Trên lưới quét trọn chu kỳ, chỉ{' '}
                  {WEDDING_STATS.bothPct}% số năm dính cả Kim Lâu lẫn Tam Tai, trong khi{' '}
                  {strong(`${WEDDING_STATS.phamFromOnePct}% số năm bị gắn nhãn “phạm” chỉ dính đúng một hạn`)}
                  .
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="cuoi-hoi"
        concept="Hạn nào áp cho ai — và chuyện gì xảy ra khi gộp cho một CẶP"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Trong ba cái chuông thì {strong('một cái chỉ nghe tuổi cô dâu')}, hai cái còn lại
                nghe được cả hai người. Vì thế ô năm sinh cô dâu là bắt buộc, còn ô chú rể có thể để
                trống.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Theo tục cưới hỏi, {strong('Kim Lâu xét chủ yếu tuổi mụ của cô dâu')} — nên công cụ
                bắt buộc nhập năm sinh cô dâu; nếu nhập thêm chú rể, dòng Kim Lâu của chú rể vẫn hiện
                nhưng {strong('ghi rõ chỉ để tham khảo')}. Tam Tai và xung năm thì xét được cho cả
                hai vì chỉ cần chi của năm sinh. Công cụ trả về {strong('hai kết luận riêng')},
                không tự trộn thành một — trộn hay không là quyết định của gia đình, không phải của
                máy.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Cái giá của việc thêm người vào phép gộp đo được. Quét mọi cặp nhóm tuổi trên trọn
                  chu kỳ: chỉ xét cô dâu thì {strong(`${WEDDING_STATS.coupleBridePct}% số năm sạch`)}
                  ; thêm Tam Tai và xung năm của chú rể còn{' '}
                  {strong(`${WEDDING_STATS.coupleCustomPct}%`)}; xét cả Kim Lâu của chú rể thì chỉ
                  còn {strong(`${WEDDING_STATS.coupleStrictPct}%`)}.
                </p>
                <p>
                  Đây là số học của cổng HOẶC, không phải điềm báo:{' '}
                  {strong('mỗi điều kiện thêm vào chỉ có thể làm hẹp cửa, không bao giờ mở rộng')}.
                  Nên câu hỏi đúng lúc bàn bạc không phải “năm nào sạch tuyệt đối”, mà là “nhà mình
                  thật sự kiêng hạn nào”.
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
    prompt: 'Công cụ xem tuổi cưới xét những hạn nào, và gộp chúng lại theo quy tắc gì?',
    answer: (
      <>
        Ba hạn: {strong('Kim Lâu')} (theo tuổi mụ cô dâu), {strong('Tam Tai')} (theo nhóm tuổi tam
        hợp) và {strong('lục xung năm')}. Quy tắc gộp: phạm Kim Lâu HOẶC Tam Tai thì kết luận là
        “phạm”; nếu cả hai sạch mà năm cưới xung chi tuổi thì “cần cân nhắc”; sạch cả ba thì
        “thuận”. Không cộng điểm.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt:
      'Cô dâu KHÔNG phạm Kim Lâu nhưng năm cưới rơi vào Tam Tai của tuổi cô. Kết luận của công cụ là gì?',
    choices: [
      {
        text: 'Phạm — vì chỉ cần một trong hai hạn chính dính là đủ',
        correct: true,
        note: 'Đúng — đây là cổng HOẶC. Kim Lâu sạch không cứu được năm bị Tam Tai.',
      },
      {
        text: 'Thuận — vì Kim Lâu là hạn quan trọng nhất khi cưới',
        note: 'Không — công cụ không xếp hạng; hai hạn chính đứng ngang nhau.',
      },
      {
        text: 'Cần cân nhắc — vì chỉ dính một trong hai',
        note: 'Không — mức “cần cân nhắc” chỉ dành cho ca hai hạn chính đều sạch mà năm cưới xung chi tuổi.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Năm cưới dính CẢ Kim Lâu lẫn Tam Tai thì kết luận có nặng hơn năm chỉ dính một hạn?',
    choices: [
      {
        text: 'Không — cùng một nhãn “phạm”, vì phép gộp không cộng dồn mức nặng',
        correct: true,
        note: `Đúng. Và trên lưới quét trọn chu kỳ, ${WEDDING_STATS.phamFromOnePct}% số năm bị gọi là phạm thật ra chỉ dính đúng một hạn.`,
      },
      {
        text: 'Có — dính hai hạn thì bị xếp mức nghiêm trọng hơn',
        note: 'Không — engine chỉ có ba mức; dính một hay hai hạn chính đều ra cùng một mức.',
      },
      {
        text: 'Có — công cụ cộng điểm rồi xếp hạng các năm',
        note: 'Không — không có điểm số nào ở đây, chỉ có ba nhãn.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Năm cưới trùng chi năm sinh (“năm tuổi”) ảnh hưởng thế nào tới kết luận?',
    choices: [
      {
        text: 'Chỉ được ghi ra như một lưu ý, không hạ kết luận xuống bậc nào',
        correct: true,
        note: 'Đúng — trong công cụ này, năm tuổi không được tính là hạn.',
      },
      {
        text: 'Bị tính là phạm, ngang Kim Lâu và Tam Tai',
        note: 'Không — chỉ Kim Lâu và Tam Tai mới đẩy kết luận thành “phạm”.',
      },
      {
        text: 'Bị tính là “cần cân nhắc” như lục xung',
        note: 'Không — lục xung mới hạ xuống “cần cân nhắc”; năm tuổi thì không.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: 'Vì sao kiêng đủ mọi hạn thì gần như năm nào cũng “phạm” gì đó?',
    answer: (
      <>
        Vì phép gộp là {strong('cổng HOẶC')}: mỗi hạn thêm vào chỉ cắt bớt số năm còn lại. Quét trọn
        chu kỳ {WEDDING_STATS.fullCycle} năm bằng chính engine: chỉ{' '}
        {strong(`${WEDDING_STATS.thuanPct}% số năm sạch cả ba hạn`)} cho riêng cô dâu; thêm Tam Tai
        và xung năm của chú rể còn {strong(`${WEDDING_STATS.coupleCustomPct}%`)}; xét cả Kim Lâu chú
        rể thì còn {strong(`${WEDDING_STATS.coupleStrictPct}%`)}.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'open',
    prompt:
      'Vận dụng: nhà bạn chỉ kiêng Tam Tai, không kiêng Kim Lâu. Bạn nên đọc kết quả công cụ thế nào?',
    answer: (
      <>
        Đừng dừng ở nhãn tổng — nhãn ấy là {strong('kết quả HOẶC của cả ba hạn')}, nên nó có thể đỏ
        chỉ vì Kim Lâu, thứ nhà bạn không kiêng. Công cụ in ra{' '}
        {strong('từng dòng lý do riêng cho mỗi hạn')}: đọc đúng dòng Tam Tai và bỏ qua phần còn lại,
        thì số năm mở ra cho gia đình bạn rộng hơn nhiều.
      </>
    ),
  },
];

export function CuoiHoiRecall() {
  return <ActiveRecall topicId="cuoi-hoi" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được “xem tuổi cưới” trả lời câu hỏi gì (NĂM này có thuận theo tục không) và không trả lời câu hỏi gì (chọn ngày cưới, hai người có hợp nhau không).',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể đủ ba hạn công cụ xét — Kim Lâu, Tam Tai, lục xung năm — và nói được mỗi hạn tra theo dữ kiện gì, hạn nào bị cố ý để ngoài.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế gộp',
    can: 'Đọc thuộc quy tắc gộp: Kim Lâu HOẶC Tam Tai → phạm; nếu không mà xung năm → cần cân nhắc; còn lại → thuận.',
  },
  {
    id: 'conflict',
    facet: 'Khi các hạn mâu thuẫn',
    can: 'Xử lý được ca hạn này phạm, hạn kia sạch — biết kết luận vẫn là “phạm”, và biết vì sao dính hai hạn không nặng hơn dính một.',
  },
  {
    id: 'scope',
    facet: 'Phạm vi',
    can: 'Giải thích vì sao Kim Lâu chỉ áp cho cô dâu, Tam Tai và xung năm áp được cho cả hai, còn Hoang Ốc bị cố ý để ngoài.',
  },
  {
    id: 'probability',
    facet: 'Xác suất',
    can: 'Nêu được tỉ lệ năm “sạch” khi cộng dồn điều kiện, và giải thích vì sao mỗi điều kiện thêm vào chỉ làm cửa hẹp lại.',
  },
  {
    id: 'reading',
    facet: 'Đọc kết quả',
    can: 'Biết đọc từng dòng lý do thay vì chỉ nhìn nhãn tổng — để lọc đúng những hạn gia đình mình thật sự kiêng.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Nói rõ đây là phong tục tham khảo, không phải điều kiện của một cuộc hôn nhân tốt; sự đồng thuận của hai gia đình và sự sẵn sàng của hai người quan trọng hơn.',
  },
];

export function CuoiHoiChecklist() {
  return <UnderstandingChecklist topicId="cuoi-hoi" facets={FACETS} />;
}

export function CuoiHoiWhys() {
  const goodYears = goodYearsFrom(CASE_BIRTH, CASE_YEAR);

  return (
    <FiveWhys
      topicId="cuoi-hoi"
      start={
        <>
          Cô dâu sinh {CASE_BIRTH} ({CASE.birthCanChi.name}) định cưới năm {CASE_YEAR} (
          {CASE.targetCanChi.name}). Nhà đã tra Kim Lâu trước và thấy sạch — tuổi mụ{' '}
          {CASE.kimLau.ageMu}, chia {WEDDING_STATS.kimLauCycle} dư {CASE.kimLau.remainder}. Vậy mà
          công cụ xem tuổi cưới vẫn báo “{VERDICT_LABEL[CASE.verdict]}”. Bác cả bảo máy sai.
        </>
      }
      chain={[
        {
          question: 'Vì sao máy không sai, dù Kim Lâu đã sạch?',
          because: (
            <>
              Vì kết luận không chỉ đến từ Kim Lâu. Công cụ xét {strong('ba hạn')}, và ở ca này
              chính Tam Tai mới là thứ dính: năm {CASE.tamTai.yearChi} nằm trong ba năm Tam Tai (
              {CASE.tamTai.tamTaiChis.join(', ')}) của nhóm tuổi {CASE.tamTai.birthChi}.
            </>
          ),
        },
        {
          question: 'Vì sao chỉ một hạn dính đã đủ lật ngược cả kết luận?',
          because: (
            <>
              Vì các hạn được gộp bằng {strong('phép HOẶC')}, không phải phép cộng điểm. Chỉ cần Kim
              Lâu hoặc Tam Tai trả lời “có”, nhãn tổng lập tức thành “{VERDICT_LABEL['pham']}” — hạn
              còn lại sạch cũng không kéo lại được.
            </>
          ),
        },
        {
          question: 'Vì sao lại gộp kiểu HOẶC, thay vì chấm điểm cho công bằng hơn?',
          because: (
            <>
              Vì {strong('không có thang đo chung')}: dân gian truyền lại từng hạn riêng lẻ, không hề
              nói hạn nào nặng hơn hạn nào bao nhiêu lần. Bịa ra thang điểm sẽ tạo cảm giác chính xác
              giả; gộp HOẶC thô hơn nhưng {strong('trung thực đúng mức tài liệu cho phép')}.
            </>
          ),
        },
        {
          question: 'Vì sao cách gộp ấy khiến năm “sạch” hiếm đi nhanh đến thế?',
          because: (
            <>
              Vì mỗi hạn cắt một phần khác nhau của dòng thời gian, và cổng HOẶC{' '}
              {strong('chỉ đi một chiều')}: thêm điều kiện thì chỉ mất năm. Quét trọn chu kỳ{' '}
              {WEDDING_STATS.fullCycle} năm, chỉ{' '}
              {strong(`${WEDDING_STATS.thuanPct}% số năm sạch cả ba hạn`)}.
            </>
          ),
        },
        {
          question: 'Hiểu tới đây thì nên làm gì cho đúng?',
          because: (
            <>
              Đọc kết quả như một {strong('bản kê điều kiện')}, không phải điểm số: năm này dính đúng
              hạn nào, và nhà mình có thật sự kiêng hạn đó không. Nếu có, công cụ liệt kê sẵn các năm
              không phạm gần nhất — ca này là {strong(goodYears.join(', '))}. Không cần hoãn vô thời
              hạn, càng không cần mua lễ “giải hạn”.
            </>
          ),
        },
      ]}
      root={
        <>
          “Được tuổi / không được tuổi” không phải một phán quyết, mà là{' '}
          {strong('kết quả HOẶC của vài quy ước rời rạc')}. Biết đúng cấu tạo ấy, bạn giữ được cả
          hai: tôn trọng phong tục của gia đình và {strong('tự quyết trong hiểu biết')}.
        </>
      }
    />
  );
}
