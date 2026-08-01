/**
 * Bài học /learn/luu-nien — bài CHÍNH THỨC về lớp lưu niên và CÁCH CHỒNG LỚP.
 *
 * LÕI RIÊNG (không lấn bài anh em): "lưu" = mốc TRÔI theo năm, khác lá số gốc
 * đứng yên; ba lớp lá số gốc → đại vận → lưu niên; quy tắc "lớp hẹp không xoá lớp
 * rộng, chỉ tô đậm hoặc làm nhạt"; vì sao cùng một lá số mà mỗi năm luận khác
 * nhau; và điểm trung thực: chia thời gian càng nhỏ thì độ chắc càng GIẢM. Chặng
 * 10 năm là /learn/dai-van, Thái Tuế và "năm tuổi" là /learn/thai-tue, sao hạn
 * Cửu Diệu là /learn/sao-han — mỗi bài chỉ được nhắc MỘT câu kèm link.
 *
 * GROUNDING — không gõ tay con số nào mà engine tính ra được:
 *   • src/lib/bazi.ts — calculateBazi({ birthSolarDate, birthHour, gender, asOf }):
 *     4 trụ gốc + dayMaster (lớp nền), daiVan (9 chặng, endAge = startAge + 9),
 *     luuNien = { year, can, chi, tenGod }. Năm của luuNien lấy qua solarYearOf()
 *     → MỐC ĐỔI LÀ LẬP XUÂN, không phải 01/01; tenGod = Thập Thần của CAN NĂM so
 *     với Nhật Chủ. Mốc Lập Xuân trong bài được DÒ lại bằng chính engine.
 *   • src/lib/xem-tuoi-cuoi.ts — CAN (10), CHI (12); src/lib/hop-tuoi-pairs.ts — ZODIAC.
 *   • src/app/tu-vi-2027/con-giap-data.ts — công cụ đích: YEAR, YEAR_CANCHI,
 *     YEAR_CHI, YEAR_RANGE, buildConGiap2027(slug) → relationLabel + isTamTai.
 *
 * CÔNG CỤ /tu-vi-2027 TÍNH GÌ (đọc code, kể cả component con): lớp CON GIÁP đọc đúng
 * MỘT dữ kiện là năm sinh — quan hệ chi ↔ chi của năm, Tam Tai, ngũ hành, bảng sao hạn
 * Cửu Diệu theo năm sinh và giới; lớp CÁ NHÂN do TimeFlowChecker (scope="yearly") lập
 * lá số Tử Vi thật qua lib/tuvi-client.ts rồi trả lưu niên can chi + Tứ Hóa lưu niên.
 * Trang KHÔNG hiển thị đại vận (đó là /timeline, /dai-van-hien-tai), và engine lưu vận
 * của site dừng ở lớp THÁNG — TuViHoroscope chỉ có decadal / yearly / monthly, KHÔNG
 * có lớp ngày hay giờ.
 */

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import { calculateBazi, type DaiVanPillar, type LuuNien } from '@/lib/bazi';
import { CAN, CHI } from '@/lib/xem-tuoi-cuoi';
import { ZODIAC } from '@/lib/hop-tuoi-pairs';
import {
  buildConGiap2027,
  YEAR as TOOL_YEAR,
  YEAR_CANCHI,
  YEAR_CHI,
  YEAR_RANGE,
} from '@/app/tu-vi-2027/con-giap-data';
import {
  LuuNienFrame,
  LuuNienDepth,
  LuuNienRecall,
  LuuNienChecklist,
  LuuNienWhys,
} from './_active-learning';

export const metadata: Metadata = {
  // title ≤48 ký tự (root layout nối " · hieu.asia", seo-guard chặn ở 60); description ≤160.
  title: 'Lưu niên là gì — lớp vận theo từng năm',
  description:
    'Lưu niên là lớp vận một năm chồng lên đại vận 10 năm và lá số gốc. Cách đọc ba lớp đúng thứ tự, và vì sao chia thời gian càng nhỏ thì độ chắc càng giảm.',
  alternates: { canonical: 'https://hieu.asia/learn/luu-nien' },
};

// ── Dữ kiện suy từ engine ────────────────────────────────────────────
/** Chu kỳ lặp can chi = BCNN(10 can, 12 chi). */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const CYCLE = (CAN.length * CHI.length) / gcd(CAN.length, CHI.length);

/** Người tham chiếu — dữ kiện đầu vào DUY NHẤT của mọi ví dụ trong bài. */
const REF = { birthDate: '1990-05-20', birthYear: 1990, hour: 9, gender: 'M' as const };

const ddmmyyyy = (iso: string) => iso.split('-').reverse().join('/');
const REF_BIRTH_LABEL = ddmmyyyy(REF.birthDate);
const REF_HOUR_LABEL = `${String(REF.hour).padStart(2, '0')}:00`;
/** Ba lớp tại một năm; `daiVan` null nghĩa là chưa vào chặng nào. */
interface YearLayer {
  year: number;
  age: number;
  daiVan: DaiVanPillar | null;
  luuNien: LuuNien;
}

const REF_ARGS = { birthSolarDate: REF.birthDate, birthHour: REF.hour, gender: REF.gender };
const REF_DAI_VAN = calculateBazi(REF_ARGS).daiVan;
if (!REF_DAI_VAN) throw new Error('calculateBazi phải trả đại vận khi đã truyền gender');
const REF_PILLARS = REF_DAI_VAN.pillars;
const FIRST_PILLAR = REF_PILLARS[0];
if (!FIRST_PILLAR) throw new Error('Engine phải dựng ít nhất một chặng đại vận');

/** Độ dài + số chặng, đọc thẳng từ dữ liệu engine. */
const DV_SPAN = FIRST_PILLAR.endAge - FIRST_PILLAR.startAge + 1;
const DV_COUNT = REF_PILLARS.length;

/** Ba lớp của người tham chiếu tại một năm. */
function layerAt(year: number): YearLayer {
  const ln = calculateBazi({ ...REF_ARGS, asOf: `${year}-07-01` }).luuNien;
  if (!ln) throw new Error('calculateBazi phải trả lưu niên khi đã truyền asOf');
  const age = year - REF.birthYear;
  return {
    year,
    age,
    daiVan: REF_PILLARS.find((p) => age >= p.startAge && age <= p.endAge) ?? null,
    luuNien: ln,
  };
}

/** Cửa sổ 6 năm quanh năm công cụ đang tính. */
const ROWS: YearLayer[] = Array.from({ length: 6 }, (_, i) => layerAt(TOOL_YEAR - 2 + i));

const dvKey = (r: YearLayer) => (r.daiVan ? String(r.daiVan.startAge) : 'chua-vao-chang');
const dvLabel = (r: YearLayer) => (r.daiVan ? `${r.daiVan.can} ${r.daiVan.chi}` : '—');
const dvRange = (r: YearLayer) => (r.daiVan ? `${r.daiVan.startAge}–${r.daiVan.endAge} tuổi` : '—');
const dvTenGod = (r: YearLayer) => r.daiVan?.tenGod ?? '—';
const lnLabel = (r: YearLayer) => `${r.luuNien.can} ${r.luuNien.chi}`;

type Pair = { a: YearLayer; b: YearLayer };
const PAIRS: Pair[] = ROWS.slice(0, -1).map((a, i) => ({ a, b: ROWS[i + 1]! }));

/** Cặp năm liền nhau CÙNG một chặng đại vận (ưu tiên cặp bắt đầu từ năm công cụ). */
const SAME_DV =
  PAIRS.find((p) => dvKey(p.a) === dvKey(p.b) && p.a.year >= TOOL_YEAR) ??
  PAIRS.find((p) => dvKey(p.a) === dvKey(p.b));
/** Cặp năm liền nhau ĐỔI chặng đại vận. */
const DIFF_DV = PAIRS.find((p) => dvKey(p.a) !== dvKey(p.b));
if (!SAME_DV || !DIFF_DV) {
  throw new Error(
    'Cửa sổ năm của ví dụ phải chứa cả một cặp năm cùng đại vận lẫn một cặp năm đổi đại vận',
  );
}
// Hằng KHÔNG-nullable: TS không mang thu hẹp kiểu vào thân component bên dưới.
const PAIR_SAME: Pair = SAME_DV;
const PAIR_DIFF: Pair = DIFF_DV;

/** Mốc engine đổi năm can chi (Lập Xuân) — DÒ bằng chính engine, không chép lịch. */
function boundaryOf(year: number): string {
  for (let d = 1; d <= 15; d += 1) {
    const iso = `${year}-02-${String(d).padStart(2, '0')}`;
    if (calculateBazi({ ...REF_ARGS, asOf: iso }).luuNien?.year === year) return iso;
  }
  throw new Error('Không dò được mốc đổi năm can chi của engine trong nửa đầu tháng 2');
}
const LAP_XUAN_ISO = boundaryOf(TOOL_YEAR);
const LAP_XUAN_LABEL = ddmmyyyy(LAP_XUAN_ISO);

/** Mốc Tết mà trang công cụ ghi (YEAR_RANGE) và độ lệch so với mốc Lập Xuân. */
const TET = (() => {
  const m = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(YEAR_RANGE);
  if (!m) return null;
  const lx = LAP_XUAN_ISO.split('-');
  const toDays = (y: number, mo: number, d: number) => Date.UTC(y, mo - 1, d) / 86400000;
  const gap =
    toDays(Number(m[3]), Number(m[2]), Number(m[1])) -
    toDays(Number(lx[0]), Number(lx[1]), Number(lx[2]));
  return { label: `${m[1]}/${m[2]}/${m[3]}`, gap: Math.abs(gap) };
})();

/**
 * Số kiểu đọc lưu niên khác nhau trong CÙNG một năm cho toàn bộ người đang sống.
 * Thập Thần lưu niên chỉ phụ thuộc can Ngày, mà can Ngày chạy hết vòng sau 10 ngày.
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

/** Hai lớp trên site đổi năm ở hai mốc khác nhau — câu này in ra độ lệch thật. */
const BOUNDARY_NOTE = TET
  ? `dò bằng chính engine thì Bát Tự đổi năm can chi tại Lập Xuân ${LAP_XUAN_LABEL}, trong khi năm âm lịch ${YEAR_CANCHI.name} mà trang tử vi năm ghi lại bắt đầu ngày ${TET.label} — lệch ${TET.gap} ngày.`
  : `Bát Tự đổi năm can chi tại Lập Xuân ${LAP_XUAN_LABEL}, còn lớp con giáp chạy theo năm âm lịch ${YEAR_RANGE}.`;

/** Vốn từ của lớp con giáp: 12 con giáp phát ra bao nhiêu nhãn quan hệ khác nhau. */
const TOOL_LABELS = ZODIAC.map((z) => buildConGiap2027(z.slug)?.relationLabel ?? '—');
const TOOL_LABEL_KINDS = new Set(TOOL_LABELS).size;
const TAM_TAI_COUNT = ZODIAC.filter((z) => buildConGiap2027(z.slug)?.isTamTai).length;

/** Ba người CÙNG chi năm sinh — dùng để cho thấy lớp con giáp gom cả nhóm. */
const TRIO_INPUT = [
  { birthDate: '1990-05-20', birthYear: 1990, hour: 9, gender: 'M' as const },
  { birthDate: '2002-11-08', birthYear: 2002, hour: 20, gender: 'F' as const },
  { birthDate: '1990-12-03', birthYear: 1990, hour: 3, gender: 'F' as const },
];

const TRIO = TRIO_INPUT.map((p) => {
  const chart = calculateBazi({
    birthSolarDate: p.birthDate,
    birthHour: p.hour,
    gender: p.gender,
    asOf: `${TOOL_YEAR}-07-01`,
  });
  const { luuNien: ln, daiVan: dv } = chart;
  if (!ln || !dv) throw new Error('calculateBazi phải trả cả lưu niên lẫn đại vận cho bộ ba ví dụ');
  const age = TOOL_YEAR - p.birthYear;
  const slug = ZODIAC.find((z) => z.ten === chart.year.chi)?.slug;
  return {
    birthLabel: `${ddmmyyyy(p.birthDate)} · ${String(p.hour).padStart(2, '0')}:00`,
    yearChi: chart.year.chi,
    dayMaster: chart.dayMaster.can,
    daiVan: dv.pillars.find((x) => age >= x.startAge && age <= x.endAge) ?? null,
    luuNien: ln,
    toolLabel: (slug ? buildConGiap2027(slug)?.relationLabel : undefined) ?? '—',
  };
});

const TRIO_CHI = TRIO[0]?.yearChi ?? '—';
const TRIO_TOOL_LABEL = TRIO[0]?.toolLabel ?? '—';
const TRIO_LN_LABEL = TRIO[0] ? `${TRIO[0].luuNien.can} ${TRIO[0].luuNien.chi}` : '—';

/** Bộ ba chỉ minh hoạ được điều đang nói khi cùng con giáp mà khác Thập Thần. */
if (
  new Set(TRIO.map((t) => t.yearChi)).size !== 1 ||
  new Set(TRIO.map((t) => t.luuNien.tenGod)).size !== TRIO.length
) {
  throw new Error('Ba người ví dụ phải CÙNG chi năm sinh nhưng KHÁC Thập Thần lưu niên');
}

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ schema ===
// chữ trên trang. Câu hỏi cố ý KHÁC /tu-vi-2027 (năm con gì, tuổi nào xung Thái
// Tuế, con giáp có chính xác không), KHÁC /tu-vi-2027/[congiap] (hợp hay xung, có
// Tam Tai không, gặp sao gì), KHÁC /tu-vi-2026, KHÁC /learn/thai-tue (Thái Tuế là
// sao gì, năm tuổi có xui, tính từ Tết hay 1/1) và KHÁC /learn/dai-van (hai hệ
// lệch mốc, đại vận khác lưu niên thế nào). Trục riêng của bộ này: CHỒNG LỚP.
const FAQS = [
  {
    q: 'Lưu niên của tôi có khác lưu niên của người khác không?',
    a: `Phần can chi thì không — nó là thuộc tính của cái năm, không phải của bạn. Năm ${TOOL_YEAR} là ${YEAR_CANCHI.name}, và mọi người đang sống đều mang cùng cặp can chi ấy trong năm đó. Cái khác nhau nằm ở chỗ cặp can chi đó gặp lá số gốc của bạn ra sao. Kiểm được bằng engine của site: ba người trong bài đều cùng chi năm sinh ${TRIO_CHI}, cùng lưu niên ${TRIO_LN_LABEL}, nhưng Thập Thần của họ lần lượt là ${TRIO.map((t) => t.luuNien.tenGod).join(', ')} vì Nhật Chủ khác nhau. Nói cách khác, lưu niên một mình nó không nói được gì riêng về bạn.`,
  },
  {
    q: 'Nên đọc lưu niên trước hay đọc lá số gốc trước?',
    a: 'Đọc từ lớp rộng xuống lớp hẹp: lá số gốc trước, rồi đại vận, rồi lưu niên. Lý do rất thực dụng: lớp hẹp chỉ có nghĩa khi đã biết nó đang chiếu vào cái gì. Đọc ngược lại thì mỗi lần sang năm mới bạn lại thấy như mình vừa thành người khác, trong khi thứ vừa đổi chỉ là lớp mỏng nhất trong ba lớp. Một cách nhớ: lá số gốc trả lời "tôi là ai", đại vận trả lời "quãng này xoay quanh chuyện gì", lưu niên chỉ trả lời "năm nay phần nào được chiếu sáng".',
  },
  {
    q: 'Lưu niên có xoá được điều mà lá số gốc nói không?',
    a: 'Không. Quy tắc gọn trong một câu: lớp hẹp không xoá lớp rộng, nó chỉ tô đậm hoặc làm nhạt một phần của lớp rộng. Bằng chứng nằm ngay trong cách engine tính: lưu niên không sinh ra dữ kiện mới nào về bạn, nó chỉ đặt can chi của năm cạnh lá số gốc rồi đọc quan hệ giữa hai thứ. Nếu một câu luận nghe như thể năm nay bạn có một lá số khác, thì câu đó đã đọc sai lớp.',
  },
  {
    q: 'Lớp lưu niên đổi vào ngày nào — mùng một Tết hay một mốc khác?',
    a: TET
      ? `Tuỳ lớp, và đây là chỗ hay gây nhầm. Engine Bát Tự của site đổi năm can chi tại Lập Xuân — dò lại bằng chính engine thì mốc của năm ${TOOL_YEAR} rơi vào ${LAP_XUAN_LABEL}. Còn năm âm lịch ${YEAR_CANCHI.name} mà trang tử vi năm ghi thì chạy từ ${YEAR_RANGE}, tức bắt đầu ngày ${TET.label}. Hai mốc lệch nhau ${TET.gap} ngày, nên ai rơi đúng vào khoảng lệch ấy sẽ thấy hai lớp nói hai năm khác nhau. Đó không phải lỗi: hai lớp vốn đếm theo hai lịch khác nhau, và bạn chỉ cần biết mình đang đọc lớp nào.`
      : `Tuỳ lớp. Engine Bát Tự của site đổi năm can chi tại Lập Xuân — dò lại bằng chính engine thì mốc của năm ${TOOL_YEAR} rơi vào ${LAP_XUAN_LABEL}. Còn lớp con giáp của trang tử vi năm chạy theo năm âm lịch ${YEAR_CANCHI.name} (${YEAR_RANGE}). Hai lớp đếm theo hai lịch khác nhau, nên điều cần nhớ là biết mình đang đọc lớp nào.`,
  },
  {
    q: 'Trang tử vi theo con giáp có phải là lưu niên của tôi không?',
    a: `Không, đó là một lớp thô hơn hẳn. Lớp con giáp chỉ đọc đúng một dữ kiện là năm sinh, rồi so chi năm sinh với chi của năm — nên toàn bộ ${CHI.length} nhóm tuổi chỉ nhận được ${TOOL_LABEL_KINDS} nhãn quan hệ khác nhau, và hàng chục triệu người cùng tuổi nhận chung một câu. Lưu niên cá nhân thì cần lá số thật, tức cần ngày sinh, giờ sinh và giới tính. Trên chính trang tử vi năm có ô nhập ngày giờ để đổi từ lớp con giáp sang lớp cá nhân — đó là hai lớp khác nhau đặt cạnh nhau, không phải hai phiên bản của cùng một phép tra.`,
  },
  {
    q: `Vì sao cùng một lá số mà năm nay luận khác năm ngoái?`,
    a: `Vì chỉ lớp hẹp nhất đổi, còn lá số gốc vẫn nguyên. Ví dụ chạy bằng engine: người sinh ${REF_BIRTH_LABEL} ở hai năm ${SAME_DV.a.year} và ${SAME_DV.b.year} vẫn nằm trong cùng một chặng đại vận (${dvRange(SAME_DV.a)}, trụ vận ${dvLabel(SAME_DV.a)}), nhưng lưu niên đổi từ ${lnLabel(SAME_DV.a)} sang ${lnLabel(SAME_DV.b)} và Thập Thần đổi từ ${SAME_DV.a.luuNien.tenGod} sang ${SAME_DV.b.luuNien.tenGod}. Cùng một người, cùng một lá số, hai năm hai cách đọc — mà không có gì trong lá số phải thay đổi cả.`,
  },
  {
    q: 'Chia nhỏ tới lớp tháng, lớp ngày thì có chính xác hơn không?',
    a: 'Không, và nên nói thẳng chỗ này. Engine lưu vận của hieu.asia dừng ở lớp tháng: nó tính đại vận, lưu niên và lưu nguyệt, không có lớp ngày và không có lớp giờ. Quan trọng hơn, chia nhỏ hơn cũng không thêm được thông tin nào về bạn — đầu vào vẫn là ngày giờ sinh, cộng đúng một con số chỉ thời điểm mà cả thế giới dùng chung. Kết luận hẹp dần trong khi bằng chứng đứng yên thì độ chắc phải giảm, dù cảm giác chủ quan lại đi ngược chiều vì càng cụ thể càng nghe như càng trúng.',
  },
  {
    q: 'Đại vận nói thuận mà lưu niên nói khó thì tin lớp nào?',
    a: 'Không phải chọn một bỏ một, vì hai lớp không nói cùng một chuyện. Đại vận nói về trọng tâm của cả một quãng dài; lưu niên chỉ nói phần nào của quãng đó đang được tô đậm hay làm nhạt trong đúng một năm. Đọc đúng là ghi nhận cả hai theo thứ tự rộng trước hẹp sau. Nếu bạn thấy mình đang chọn lớp nào nghe dễ chịu hơn rồi bỏ lớp kia, thì kết quả không còn nói gì về đời bạn nữa — nó chỉ đang phản chiếu điều bạn muốn nghe.',
  },
];

const JSONLD = [
  article({
    headline: 'Lưu niên: lớp vận một năm và cách đọc ba lớp chồng nhau',
    description:
      'Lưu niên là mốc trôi theo từng năm, chồng lên đại vận và lá số gốc. Bài giải thích ba lớp khác nhau ở đâu, quy tắc đọc chồng lớp, và vì sao chia thời gian càng nhỏ thì độ chắc càng giảm.',
    url: '/learn/luu-nien',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Lưu niên', url: '/learn/luu-nien' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Lưu niên — lớp vận một năm và cách chồng lớp',
    description:
      'Học cách đọc vận theo thời gian như nhiều lớp chồng nhau: lá số gốc cả đời, đại vận 10 năm, lưu niên một năm — và vì sao lớp hẹp không xoá lớp rộng.',
    url: '/learn/luu-nien',
  }),
];

const TD = 'px-4 py-2 text-muted-foreground';
const A = 'text-gold-700 underline-offset-4 hover:underline';

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="border-b border-border bg-card/60">
        {cols.map((c) => (
          <th key={c} scope="col" className="px-4 py-2.5 font-semibold text-foreground">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Scroller({ minWidth, children }: { minWidth: string; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className={`w-full ${minWidth} text-left text-sm`}>{children}</table>
    </div>
  );
}

const H3 = ({ children }: { children: ReactNode }) => (
  <h3 className="pt-2 text-lg font-semibold text-foreground">{children}</h3>
);

/** Bảng so sánh ba lớp — mỗi hàng là một câu hỏi đặt cho cả ba lớp. */
const LAYER_ROWS: readonly (readonly [string, ReactNode, ReactNode, ReactNode])[] = [
  ['Đơn vị thời gian', 'Cả đời — dựng một lần', `${DV_SPAN} năm mỗi chặng`, '1 năm'],
  [
    'Đổi khi nào',
    'Không bao giờ',
    `Mỗi ${DV_SPAN} năm, tại mốc tuổi riêng của bạn`,
    `Mỗi năm, tại mốc đổi năm can chi (${LAP_XUAN_LABEL} cho năm ${TOOL_YEAR})`,
  ],
  [
    'Dựng từ dữ kiện gì',
    'Ngày sinh, giờ sinh, giới tính',
    'Đúng bộ dữ kiện đó — không thêm gì mới',
    'Thêm đúng một con số: năm đang xét',
  ],
  [
    'Riêng bạn tới đâu',
    'Riêng theo từng ngày giờ sinh',
    'Riêng — mốc tuổi và nhãn chặng khác nhau giữa hai người',
    'Can chi giống hệt mọi người; chỉ NGHĨA của nó mới riêng',
  ],
  [
    'Dùng để làm gì',
    'Đọc khuynh hướng nền, cái không đổi',
    'Đặt trọng tâm cho một quãng dài',
    'Soi phần nào của nền đang được tô đậm trong năm đó',
  ],
  [
    'Engine dựng bao nhiêu mốc',
    '4 trụ can chi',
    `${DV_COUNT} chặng, phủ ${DV_COUNT * DV_SPAN} năm tuổi`,
    `Mỗi năm một mốc, chuỗi lặp lại sau ${CYCLE} năm`,
  ],
];

export default function LearnLuuNienPage() {
  return (
    <LearnArticle
      eyebrow="LỚP THỜI GIAN · 1 NĂM"
      title={
        <>
          Lưu niên{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">(lớp vận một năm)</span>
        </>
      }
      standfirst={
        <>
          Cùng một lá số, năm nay luận một kiểu, sang năm luận kiểu khác — mà lá số không đổi một nét
          nào. Bài này giải thích cơ chế đứng sau:{' '}
          <strong>vận theo thời gian là nhiều lớp chồng lên nhau</strong>, kèm quy tắc đọc khiến ba
          lớp không đá nhau, và một điểm ít ai nói thẳng: chia thời gian càng nhỏ thì độ chắc càng
          giảm, chứ không tăng.
        </>
      }
      readMeta="12 phút đọc · Ví dụ chạy bằng engine của site"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Lưu niên' },
      ]}
      relatedLenses={relatedLearnLenses('luu-nien')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb: `Trang Tử Vi ${TOOL_YEAR} đặt cạnh nhau đúng hai lớp mà bài này nói: lớp con giáp chung cho cả nhóm tuổi, và ô nhập ngày giờ để đổi sang lưu niên cá nhân theo lá số thật của bạn.`,
        href: '/tu-vi-2027',
        label: `Xem vận năm ${TOOL_YEAR} theo tuổi`,
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <LuuNienFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Lưu niên là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                <strong>Lưu</strong> nghĩa là trôi, <strong>niên</strong> là năm — nên{' '}
                <strong>lưu niên</strong> là cái mốc <strong>trôi theo từng năm</strong>, đặt cạnh
                một thứ đứng yên là lá số gốc. Đó là toàn bộ khái niệm: lá số gốc dựng một lần từ
                ngày giờ sinh rồi không đổi nữa, còn lưu niên mỗi năm thay một cặp can chi mới. Năm{' '}
                {TOOL_YEAR} là {YEAR_CANCHI.name}, chi {YEAR_CHI} — nên lưu niên của năm đó là{' '}
                {YEAR_CANCHI.name}. Cứ thấy chữ “lưu” thì hiểu là <strong>một lớp trôi</strong>:{' '}
                <em>lưu niên</em> trôi theo năm, <em>lưu nguyệt</em> trôi theo tháng.
              </p>
              <p>Bốn điều lưu niên KHÔNG phải, chốt ngay để khỏi đọc sai về sau:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải một lá số mới.</strong> Lá số gốc không đổi khi sang năm; lưu niên
                  là một lớp đặt lên trên, không phải bản thay thế.
                </li>
                <li>
                  <strong>Không phải thông tin riêng của bạn — ít nhất là phần can chi.</strong> Cặp
                  can chi của năm giống hệt nhau với mọi người đang sống.
                </li>
                <li>
                  <strong>Không phải một dự báo.</strong> Nó cho biết phần nào của cái nền đang được
                  chiếu sáng trong năm đó, không cho biết kết quả của bất cứ việc gì.
                </li>
                <li>
                  <strong>Không phải “tử vi năm theo con giáp”.</strong> Trang con giáp đọc đúng một
                  dữ kiện là năm sinh; lưu niên cá nhân cần lá số thật.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Hai phạm vi bài này cố ý không lấn: cách xác định chặng {DV_SPAN} năm của riêng bạn
                thuộc bài <Link href="/learn/dai-van" className={A}>Đại vận</Link>, còn Thái Tuế và
                “năm tuổi” — một cách đọc riêng của lớp con giáp — thuộc bài{' '}
                <Link href="/learn/thai-tue" className={A}>Thái Tuế</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <LuuNienDepth />,
        },
        {
          id: 'ba-lop-chong-nhau',
          tocLabel: 'Ba lớp chồng nhau',
          heading: 'Ba lớp: lá số gốc, đại vận, lưu niên',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Thống nhất cách gọi trước cho khỏi rối:{' '}
                <strong>lớp rộng là lớp phủ nhiều thời gian hơn</strong> — lá số gốc rộng nhất, đại
                vận ở giữa, lưu niên hẹp nhất. Lớp hẹp luôn nằm gọn bên trong lớp rộng: một năm nằm
                trong một chặng, một chặng nằm trong một đời.
              </p>
              <Scroller minWidth="min-w-[820px]">
                <TableHead cols={['Khía cạnh', 'Lá số gốc', 'Đại vận', 'Lưu niên']} />
                <tbody>
                  {LAYER_ROWS.map(([khiaCanh, goc, dv, ln]) => (
                    <tr key={khiaCanh} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {khiaCanh}
                      </th>
                      <td className={TD}>{goc}</td>
                      <td className={TD}>{dv}</td>
                      <td className="px-4 py-2 text-foreground">{ln}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Hàng quan trọng nhất là <strong>“dựng từ dữ kiện gì”</strong>. Lá số gốc và đại vận
                dùng <strong>chung một bộ dữ kiện</strong> — đại vận chỉ là một cách chia lại đúng lá
                số ấy. Lưu niên thêm đúng <strong>một</strong> con số: năm đang xét, mà con số ấy cả
                thế giới dùng chung. Hệ quả: đi từ lớp rộng xuống lớp hẹp,{' '}
                <strong>số ô để chia thì tăng, còn lượng thông tin về bạn thì không</strong>.
              </p>
              <p className="text-sm text-foreground/70">
                Trang tử vi năm còn hiển thị một lớp nữa không thuộc bài này: bảng sao hạn Cửu Diệu,
                đếm theo tuổi mụ và giới tính chứ không theo can chi — cách nó chạy thuộc bài{' '}
                <Link href="/learn/sao-han" className={A}>Sao hạn</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'doc-lop-nao-truoc',
          tocLabel: 'Đọc lớp nào trước',
          heading: 'Quy tắc đọc chồng lớp — và hai ví dụ chạy bằng engine',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>Cả cách đọc gói trong bốn câu:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Đọc từ lớp rộng xuống lớp hẹp.</strong> Lá số gốc trước, rồi đại vận, rồi
                  lưu niên — lớp hẹp chỉ có nghĩa khi đã biết nó đang chiếu vào cái gì.
                </li>
                <li>
                  <strong>Lớp hẹp không xoá lớp rộng.</strong> Nó chỉ{' '}
                  <strong>tô đậm hoặc làm nhạt</strong> một phần của lớp rộng; không có năm nào biến
                  bạn thành người mang lá số khác.
                </li>
                <li>
                  <strong>Hai lớp lệch nhau không phải mâu thuẫn.</strong> Chúng nói ở hai độ phân
                  giải khác nhau, như bản đồ tỉnh và bản đồ phường không đá nhau.
                </li>
                <li>
                  <strong>Đừng lấy lớp hẹp làm câu kết luận về cả đời.</strong> Lớp mỏng nhất cũng là
                  lớp ít nói về bạn nhất.
                </li>
              </ol>

              <H3>Ba lớp của một người, {ROWS.length} năm liên tiếp</H3>
              <p>
                Chỉ ngày sinh, giờ sinh và giới tính là đầu vào; mọi cột còn lại do engine Bát Tự của
                chính site tính lại mỗi lần trang được dựng. Người trong ví dụ sinh{' '}
                <strong>{REF_BIRTH_LABEL}</strong> lúc <strong>{REF_HOUR_LABEL}</strong>, nam.
              </p>
              <Scroller minWidth="min-w-[860px]">
                <TableHead
                  cols={['Năm', 'Tuổi', 'Lá số gốc', 'Đại vận (lớp giữa)', 'Lưu niên (lớp hẹp)']}
                />
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.year} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-2 font-medium tabular-nums text-foreground">{r.year}</td>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">{r.age}</td>
                      <td className={TD}>không đổi</td>
                      <td className={TD}>
                        {dvRange(r)} · {dvLabel(r)} ({dvTenGod(r)})
                      </td>
                      <td className="px-4 py-2 text-foreground">
                        {lnLabel(r)} ({r.luuNien.tenGod})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>

              <H3>Ví dụ 1 — hai năm liền, chỉ lớp hẹp đổi</H3>
              <p>
                Năm {PAIR_SAME.a.year} và năm {PAIR_SAME.b.year}: người này vẫn nằm trong{' '}
                <strong>cùng một chặng đại vận</strong> ({dvRange(PAIR_SAME.a)}, trụ vận{' '}
                {dvLabel(PAIR_SAME.a)}), lá số gốc thì dĩ nhiên không đổi. Thứ duy nhất đổi là lớp
                hẹp nhất: lưu niên đi từ <strong>{lnLabel(PAIR_SAME.a)}</strong> (
                {PAIR_SAME.a.luuNien.tenGod}) sang <strong>{lnLabel(PAIR_SAME.b)}</strong> (
                {PAIR_SAME.b.luuNien.tenGod}). Hai năm ấy luận khác nhau — nhưng khác ở{' '}
                <strong>đúng một lớp trên cùng</strong>. Ai nghe hai bản luận rồi kết luận “tử vi mâu
                thuẫn” là bỏ qua chi tiết đó: chúng nói về hai tấm kính màu khác nhau đặt trên cùng
                một bức tranh.
              </p>

              <H3>Ví dụ 2 — hai năm liền, đổi luôn cả lớp giữa</H3>
              <p>
                Năm {PAIR_DIFF.a.year} và năm {PAIR_DIFF.b.year} là chỗ hiếm hơn: người này bước qua
                ranh giới một chặng. Đại vận đổi từ <strong>{dvRange(PAIR_DIFF.a)}</strong>, trụ vận{' '}
                {dvLabel(PAIR_DIFF.a)} ({dvTenGod(PAIR_DIFF.a)}) sang{' '}
                <strong>{dvRange(PAIR_DIFF.b)}</strong>, trụ vận {dvLabel(PAIR_DIFF.b)} (
                {dvTenGod(PAIR_DIFF.b)}); đồng thời lưu niên đổi từ {lnLabel(PAIR_DIFF.a)} sang{' '}
                {lnLabel(PAIR_DIFF.b)}. <strong>Hai lớp đổi cùng lúc, lớp nền vẫn nguyên.</strong>
              </p>
              <p>
                Đối chiếu hai ví dụ là thấy nhịp của từng lớp: trong cửa sổ {ROWS.length} năm ở bảng
                trên, lưu niên đổi <strong>{ROWS.length - 1} lần</strong> còn đại vận đổi{' '}
                <strong>{PAIRS.filter((p) => dvKey(p.a) !== dvKey(p.b)).length} lần</strong> — lớp
                càng rộng càng ít biến động, và đó là lý do nó đáng được đọc trước.
              </p>
              <p className="text-sm text-foreground/70">
                Mọi con số ở đây là output của <code>calculateBazi()</code>. Trang tự kiểm lúc dựng:
                nếu cửa sổ năm không còn chứa cả một cặp năm cùng chặng lẫn một cặp năm đổi chặng
                thì nó báo lỗi, thay vì in ra ví dụ không minh hoạ được điều đang nói.
              </p>
            </div>
          ),
        },
        {
          id: 'cang-chia-nho-cang-mo',
          tocLabel: 'Càng chia nhỏ càng mờ',
          heading: 'Vì sao chia thời gian càng nhỏ thì độ chắc càng GIẢM',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Trực giác nói ngược lại: nói về một năm cụ thể nghe “sát” hơn nói về mười năm, nên
                hẳn đáng tin hơn. Đây là chỗ trực giác sai —{' '}
                <strong>hẹp hơn nghĩa là nói mạnh hơn với cùng một lượng bằng chứng</strong>. Bốn lý
                do, cả bốn đều kiểm được.
              </p>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  <strong>Đầu vào đứng yên trong khi kết luận hẹp dần.</strong> Đại vận không thêm dữ
                  kiện nào ngoài lá số gốc; lưu niên thêm đúng một con số mà cả thế giới dùng chung.
                  Chi tiết nhiều hơn ở đây là <em>chia nhỏ hơn</em>, không phải <em>biết thêm</em>.
                </li>
                <li>
                  <strong>Lớp hẹp lại là lớp thô nhất về mặt phân loại.</strong> Thập Thần của lưu
                  niên chỉ phụ thuộc can Ngày, mà can Ngày có {CAN.length} giá trị — nên lớp lưu niên
                  của Bát Tự chỉ sinh ra đúng <strong>{LN_BUCKETS} kiểu đọc</strong> cho toàn bộ
                  người đang sống. Lớp con giáp còn thô hơn: {CHI.length} nhóm tuổi chỉ nhận{' '}
                  <strong>{TOOL_LABEL_KINDS} nhãn</strong> khác nhau.
                </li>
                <li>
                  <strong>Lớp càng hẹp thì một sai lệch mốc càng đắt.</strong> Nhầm ranh giới đi một
                  năm thì với chặng {DV_SPAN} năm bạn mất một phần, với lớp một năm thì mất trọn cả
                  lớp. Mà ranh giới ấy không chỉ có một — {BOUNDARY_NOTE}
                </li>
                <li>
                  <strong>Càng nhiều lớp thì càng luôn có một lớp để chỉ vào.</strong> Ba lớp nhân
                  nhau cho rất nhiều tổ hợp, nên sau khi một chuyện đã xảy ra thì gần như bao giờ
                  cũng tìm được một lớp “khớp”. Cảm giác “nói trúng quá” phần lớn sinh ra ở đây — đó
                  là đặc điểm của hệ nhiều lớp, không phải bằng chứng rằng hệ đúng.
                </li>
              </ul>

              <H3>Bằng chứng: ba người, một con giáp, ba cách đọc</H3>
              <p>
                Ba người dưới đây cùng chi năm sinh <strong>{TRIO_CHI}</strong>, nên lớp con giáp
                phát cho cả ba đúng một câu: “{TRIO_TOOL_LABEL}”. Cùng năm {TOOL_YEAR}, cả ba cũng
                mang cùng một lưu niên <strong>{TRIO_LN_LABEL}</strong>. Chỉ khi đặt nó cạnh lá số
                gốc thì ba kết quả mới tách ra:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                {TRIO.map((t) => (
                  <li key={t.birthLabel}>
                    <strong>{t.birthLabel}</strong> — Nhật Chủ {t.dayMaster}, đại vận{' '}
                    {t.daiVan
                      ? `${t.daiVan.startAge}–${t.daiVan.endAge} tuổi (${t.daiVan.can} ${t.daiVan.chi})`
                      : 'chưa vào chặng nào'}
                    , Thập Thần lưu niên <strong>{t.luuNien.tenGod}</strong>.
                  </li>
                ))}
              </ul>
              <p>
                Cùng một lưu niên mà ra{' '}
                <strong>{new Set(TRIO.map((t) => t.luuNien.tenGod)).size} kết quả khác nhau</strong>,
                chỉ vì Nhật Chủ khác nhau — vừa là bằng chứng cho quy tắc “lớp hẹp không xoá lớp
                rộng”, vừa cho thấy lớp năm không mang thông tin riêng nào:{' '}
                <strong>nó vay toàn bộ ý nghĩa từ lớp nằm dưới</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: một năm “xấu” không phải bản án',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Nói thẳng, vì lưu niên là lớp bị dùng để doạ người nhiều nhất — cuối năm nào cũng có
                một mùa “tuổi bạn năm tới phải kiêng”.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Một năm bị luận là xấu không phải bản án.</strong> Nó là một lớp mỏng đặt
                  lên cái nền của bạn, và nó không biết bạn làm nghề gì, đang chuẩn bị việc gì, có
                  bao nhiêu tiền dự phòng. Chính công cụ trên site cũng ghi đúng như vậy ở từng dòng
                  kết quả: tham khảo theo phong tục, không phải lời phán số mệnh.
                </li>
                <li>
                  <strong>Đừng hoãn việc lớn để chờ một năm đẹp.</strong> Hoãn một năm là mất một năm
                  thật — tiền thuê, đà chuẩn bị, cơ hội, sức khoẻ — để đổi lấy sự an tâm về một lớp
                  quy ước. Tệ nhất là hoãn đi khám bệnh: có triệu chứng thì đi bác sĩ, có hợp đồng
                  thì hỏi luật sư — lưu niên không có thẩm quyền với những việc đó.
                </li>
                <li>
                  <strong>“Năm đẹp” theo lớp nào?</strong> Câu hỏi này luôn thiếu một vế: lớp con
                  giáp có thể nói thuận trong khi lưu niên cá nhân nói khác. Riêng lớp con giáp của
                  năm {TOOL_YEAR} đã cho {TOOL_LABEL_KINDS} nhãn khác nhau và {TAM_TAI_COUNT} trong{' '}
                  {CHI.length} nhóm tuổi rơi vào Tam Tai — năm nào cũng có sẵn một lớp trông xấu cho
                  ai đó, nên chờ một năm mà mọi lớp đều đẹp là chờ một thứ không tồn tại.
                </li>
                <li>
                  <strong>Ranh giới sắc trên bảng, không sắc ngoài đời.</strong> Bảng ghi lưu niên
                  đổi đúng một ngày, đại vận đổi đúng một tuổi; đời không có công tắc bật tắt ở đúng
                  những mốc ấy — nhất là khi hai lớp đã dùng hai mốc đổi năm khác nhau.
                </li>
                <li>
                  <strong>Không có gì để “hoá giải”.</strong> hieu.asia không bán và không khuyên mua
                  bất cứ thứ gì để hoá giải một lớp lịch.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh: dùng lưu niên để{' '}
                <strong>đặt câu hỏi cho năm trước mặt</strong> — năm này mình muốn dồn sức vào đâu —
                chứ không để nó <strong>trả lời thay</strong> những quyết định mà chỉ bạn có đủ dữ kiện.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <LuuNienWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <LuuNienRecall />,
        },
        {
          id: 'faq',
          tocLabel: 'Câu hỏi thường gặp',
          heading: 'Câu hỏi thường gặp',
          children: (
            <>
              <Accordion type="single" collapsible className="space-y-2">
                {FAQS.map((f, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded border border-border px-4"
                  >
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Cái nền mà lưu niên chiếu lên nằm ở{' '}
                <Link href="/learn/bat-tu" className={A}>bài Bát Tự</Link>; vì sao mỗi năm mang một
                cặp can chi và vì sao chuỗi lặp lại sau {CYCLE} năm thì ở{' '}
                <Link href="/learn/can-chi" className={A}>bài Thiên can – Địa chi</Link>; còn mốc đổi
                năm mà bài này chỉ nêu để cảnh báo nằm ở bài{' '}
                <Link href="/learn/tiet-khi" className={A}>24 tiết khí</Link> và{' '}
                <Link href="/learn/lich-am-duong" className={A}>Lịch âm dương</Link>. Xem cả hai lớp
                của chính mình:{' '}
                <Link href="/tu-vi-2027" className={A}>Mở trang Tử Vi {TOOL_YEAR} →</Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/tu-vi-2027', label: `Tử Vi ${TOOL_YEAR} theo con giáp` },
                    { href: '/dai-van-hien-tai', label: 'Đại vận hiện tại' },
                    { href: '/timeline', label: 'Timeline đại vận' },
                    { href: '/la-so-bat-tu', label: 'Lá số Bát Tự' },
                  ]}
                />
              </div>
            </>
          ),
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <LuuNienChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
