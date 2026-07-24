/**
 * Dữ liệu cho cụm trang "Tử vi tháng [M] tuổi [con giáp]" (/tu-vi-thang/…).
 *
 * THUẦN TÍNH TOÁN — không React, không gọi AI, không gọi backend. Mọi dữ kiện
 * lấy từ các engine đã có sẵn và đã được kiểm chứng trong repo:
 *   - monthPillarOf          (lib/bazi.ts)          → trụ tháng theo TIẾT KHÍ
 *   - dayCanChi              (lib/gio-hoang-dao.ts) → can chi từng ngày
 *   - relationOf, ZODIAC     (lib/hop-tuoi-pairs.ts)→ Tam Hợp/Lục Hợp/Xung/Hại
 *   - canChiOfYear, TAM_TAI_YEARS (lib/xem-tuoi-cuoi.ts)
 *
 * VÌ SAO 144 TRANG KHÔNG PHẢI NỘI DUNG RÁC: mỗi trang = 1 tháng × 1 con giáp,
 * và phần thân trang được sinh từ 6 trục dữ kiện khác nhau, trong đó có 1 trục
 * là BẢNG NGÀY tính riêng cho từng cặp (tháng, tuổi):
 *   1. Trụ tháng theo tiết khí (can + chi + nạp âm) — khác nhau từng tháng.
 *   2. Quan hệ địa chi tuổi ↔ chi tháng — 6 nhóm.
 *   3. Ngũ hành chi tuổi ↔ ngũ hành CHI tháng — 5 thế.
 *   4. Ngũ hành chi tuổi ↔ ngũ hành CAN tháng — 5 thế (diễn đạt khác trục 3).
 *   5. Bối cảnh năm chứa tháng đó (đổi tại Lập Xuân) + Tam Tai.
 *   6. Danh sách NGÀY trong tháng hợp / xung / hại với chi tuổi — tính từ can
 *      chi ngày, nên mỗi trang có một bảng ngày riêng, không trang nào trùng.
 *
 * GIỌNG ON-BRAND: tra cứu phong tục Can Chi để THAM KHẢO. Nói rõ căn cứ, nói rõ
 * giới hạn, không phán số mệnh, không hù doạ, không bán lễ giải hạn.
 */

import { monthPillarOf, type MonthPillarInfo } from './bazi';
import { dayCanChi } from './gio-hoang-dao';
import {
  ZODIAC,
  findZodiac,
  relationOf,
  type Zodiac,
  type RelationKind,
  type NguHanh,
} from './hop-tuoi-pairs';
import { canChiOfYear, TAM_TAI_YEARS, ANIMAL_BY_CHI, type Chi } from './xem-tuoi-cuoi';

// ── Cửa sổ tháng được xuất bản ──────────────────────────────────────
// Cụm này SINH DẦN THEO LỊCH. Hai quy tắc:
//
//  1. Không lùi về quá khứ. Cụm mở tháng 8/2026, nên lần dựng đầu tiên (23/07/
//     2026) KHÔNG sinh trang cho tháng 7 — tháng đó đã trôi mất 3/4, đăng lên là
//     lỗi thời ngay. `LAUNCH_MONTH` chốt mốc này.
//  2. Một tháng sống tới khi HẾT tháng, không phải tới khi tháng bắt đầu. Trang
//     "tử vi tháng 8" có ích nhất trong chính tháng 8, nên nó ở lại sitemap suốt
//     tháng 8 rồi mới rụng từ 01/9.

/** Tháng đầu tiên của cụm — không sinh trang cho tháng trước mốc này. */
export const LAUNCH_MONTH: MonthKey = { year: 2026, month: 8 };

/** Số tháng TƯƠNG LAI được xuất bản thêm, ngoài tháng đang diễn ra. */
export const WINDOW_MONTHS = 6;

/**
 * Số tháng đã qua vẫn được dựng — CHỈ để 308 về evergreen, không render nội
 * dung. Nhờ vậy URL từng nằm trong sitemap không rơi thẳng vào 404 sau khi hết
 * tháng (301/308 giữ được backlink, 404 thì mất).
 */
export const GRACE_MONTHS = 6;

export interface MonthKey {
  year: number;
  /** 1–12. */
  month: number;
}

/** "8-2026" — số tháng đứng trước cho khớp cách người Việt đọc URL. */
export function monthSlug(k: MonthKey): string {
  return `${k.month}-${k.year}`;
}

export function parseMonthSlug(slug: string): MonthKey | null {
  const m = /^(\d{1,2})-(\d{4})$/.exec(slug);
  if (!m) return null;
  const month = Number(m[1]);
  const year = Number(m[2]);
  if (month < 1 || month > 12) return null;
  // Chặn không gian URL vô hạn (dynamicParams tắt nhưng vẫn phòng khi mở lại).
  if (year < 2020 || year > 2035) return null;
  return { year, month };
}

function shiftMonth(k: MonthKey, delta: number): MonthKey {
  const zero = k.year * 12 + (k.month - 1) + delta;
  return { year: Math.floor(zero / 12), month: (zero % 12) + 1 };
}

function monthOf(now: Date): MonthKey {
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
}

/** Số thứ tự tuyệt đối của một tháng — để so sánh / cộng trừ. */
function ordinal(k: MonthKey): number {
  return k.year * 12 + (k.month - 1);
}

/**
 * Các tháng ĐANG SỐNG tại thời điểm `now`: từ tháng hiện tại (nhưng không sớm
 * hơn `LAUNCH_MONTH`) tới `count` tháng phía trước. Đây chính là tập được đưa
 * vào sitemap và được liên kết nội bộ.
 *
 * Ở mốc 23/07/2026 hàm trả về đúng 8/2026 → 1/2027 (không có tháng 7).
 */
export function liveMonths(now: Date = new Date(), count = WINDOW_MONTHS): MonthKey[] {
  const current = monthOf(now);
  const start = Math.max(ordinal(current), ordinal(LAUNCH_MONTH));
  const end = ordinal(current) + count;
  const out: MonthKey[] = [];
  for (let o = start; o <= end; o++) out.push({ year: Math.floor(o / 12), month: (o % 12) + 1 });
  return out;
}

/** `count` tháng ĐÃ HẾT gần nhất — chỉ dùng làm chặng 308, không render nội dung. */
export function pastMonths(now: Date = new Date(), count = GRACE_MONTHS): MonthKey[] {
  const base = monthOf(now);
  return Array.from({ length: count }, (_, i) => shiftMonth(base, -(i + 1)));
}

/** Tất cả tháng cần dựng route (đang sống + chặng 308 đã hết). */
export function buildableMonths(now: Date = new Date()): MonthKey[] {
  const seen = new Set<string>();
  return [...liveMonths(now), ...pastMonths(now)].filter((k) => {
    const s = monthSlug(k);
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  });
}

// ── Tiện ích lịch ───────────────────────────────────────────────────

const WEEKDAY = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function weekdayOf(year: number, month: number, day: number): string {
  return WEEKDAY[new Date(Date.UTC(year, month - 1, day)).getUTCDay()]!;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** "07/08/2026". */
function fmtDate(year: number, month: number, day: number): string {
  return `${pad(day)}/${pad(month)}/${year}`;
}

// ── Ngũ hành: thế tương tác giữa hai hành ───────────────────────────

const SINH_NEXT: Record<NguHanh, NguHanh> = {
  Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc',
};
const KHAC_NEXT: Record<NguHanh, NguHanh> = {
  Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc',
};

/** Thế của hành `mine` so với hành `other`. */
export type ElementStance = 'dong-hanh' | 'ta-sinh' | 'duoc-sinh' | 'ta-khac' | 'bi-khac';

export function elementStance(mine: NguHanh, other: NguHanh): ElementStance {
  if (mine === other) return 'dong-hanh';
  if (SINH_NEXT[mine] === other) return 'ta-sinh';
  if (SINH_NEXT[other] === mine) return 'duoc-sinh';
  if (KHAC_NEXT[mine] === other) return 'ta-khac';
  return 'bi-khac';
}

// ── Bảng chữ: quan hệ chi tuổi ↔ chi tháng ──────────────────────────
// Diễn đạt theo ngữ cảnh THÁNG (nhịp việc trong 30 ngày), cố ý khác với bản
// theo NĂM ở /tu-vi-2026 và bản theo CẶP NGƯỜI ở /hop-tuoi để không lặp chữ.

interface RelationCopy {
  label: string;
  /** Cụm ngắn để ghép vào câu chốt, vd "Tam Hợp". */
  short: string;
  line: (tuoi: string, chiThang: string, thangLabel: string) => string;
}

const MONTH_RELATION: Record<RelationKind, RelationCopy> = {
  'tam-hop': {
    label: 'Tam Hợp với tháng',
    short: 'Tam Hợp',
    line: (t, c, m) =>
      `Chi tháng ${c} cùng nhóm Tam Hợp với chi tuổi ${t}. Theo Can Chi, đây là tín hiệu tham khảo thuận cho ${m}: nhịp của tháng dễ ăn khớp với bạn, hợp để chốt những việc đã chuẩn bị sẵn và rủ người cùng làm, hơn là khởi sự một thứ hoàn toàn mới.`,
  },
  'luc-hop': {
    label: 'Lục Hợp với tháng',
    short: 'Lục Hợp',
    line: (t, c, m) =>
      `Chi tháng ${c} và chi tuổi ${t} tạo thành một cặp Lục Hợp. Gợi ý cho ${m}: những việc cần người khác gật đầu — xin ý kiến, thương lượng, nối lại một liên lạc đang dở — thường trôi hơn bình thường, miễn là bạn chịu mở lời trước.`,
  },
  'luc-xung': {
    label: 'Lục Xung với tháng',
    short: 'Lục Xung',
    line: (t, c, m) =>
      `Chi tháng ${c} lục xung với chi tuổi ${t}. Nói cho đúng: đây không phải "tháng xấu". Nó là lời nhắc rằng trong ${m} bạn dễ gặp việc đổi hướng gấp và va chạm quan điểm hơn thường lệ. Cách xử lý thực tế là để dư thời gian cho mỗi việc và tránh chốt chuyện lớn lúc đang mệt.`,
  },
  'luc-hai': {
    label: 'Lục Hại với tháng',
    short: 'Lục Hại',
    line: (t, c, m) =>
      `Chi tháng ${c} và chi tuổi ${t} ở thế Lục Hại. Kiểu vướng của thế này thường là chuyện vặt: hiểu nhầm, sai hẹn, giấy tờ thiếu một mục. Trong ${m}, viết rõ ra thay vì nói miệng và xác nhận lại trước khi làm sẽ tiết kiệm cho bạn khá nhiều thời gian.`,
  },
  'dong-tuoi': {
    label: 'Tháng trùng chi tuổi',
    short: 'trùng chi tuổi',
    line: (t, c, m) =>
      `${m.charAt(0).toUpperCase()}${m.slice(1)} mang đúng địa chi ${c} của tuổi ${t} — dân gian gọi là tháng trùng chi bản mệnh. Đây không phải hạn. Nó chỉ gợi ý rằng việc của bạn trong tháng dễ nổi lên và dễ được để ý hơn, nên làm gì cũng nên chắc tay và nói trước cho rõ.`,
  },
  'binh-hoa': {
    label: 'Bình hoà với tháng',
    short: 'bình hoà',
    line: (t, c, m) =>
      `Chi tháng ${c} không hợp cũng không xung với chi tuổi ${t}. Theo Can Chi, ${m} là một tháng "bình" với bạn: không có lực đẩy cũng không có lực cản rõ rệt đến từ tuổi. Nói cách khác, tháng này ra sao gần như hoàn toàn nằm ở việc bạn chọn làm gì.`,
  },
};

/** Ngũ hành chi tuổi so với ngũ hành CHI tháng — nói về nhịp việc bên trong. */
const CHI_ELEMENT_LINE: Record<ElementStance, (pe: NguHanh, me: NguHanh) => string> = {
  'dong-hanh': (pe) =>
    `Chi tuổi bạn và chi tháng cùng hành ${pe}, năng lượng cộng hưởng nên bạn dễ vào guồng nhanh. Mặt trái là dễ nhận quá nhiều việc trong vài ngày đầu rồi đuối ở nửa sau tháng.`,
  'ta-sinh': (pe, me) =>
    `Hành ${pe} của chi tuổi sinh cho hành ${me} của chi tháng — bạn ở thế cho đi. Tháng này bạn dễ là người bỏ công cho việc chung và được ghi nhận, nhưng cũng dễ hụt sức. Chừa lại một phần cho việc của chính mình.`,
  'duoc-sinh': (pe, me) =>
    `Hành ${me} của chi tháng sinh cho hành ${pe} của chi tuổi — thế được nâng đỡ. Đây là tháng hợp để tích luỹ, học thêm một thứ đang dở, hoặc nhận sự giúp đỡ mà trước giờ bạn ngại hỏi.`,
  'ta-khac': (pe, me) =>
    `Hành ${pe} của chi tuổi khắc hành ${me} của chi tháng — bạn chủ động điều tiết được nhịp tháng, nhưng cũng dễ cọ xát vì muốn mọi thứ theo ý mình. Chọn trận mà đánh, đừng ôm hết.`,
  'bi-khac': (pe, me) =>
    `Hành ${me} của chi tháng khắc hành ${pe} của chi tuổi — tháng dễ thấy áp lực và bị thử. Xem đó là lực rèn: đi chậm mà chắc, để dành sức cho một việc quan trọng nhất thay vì dàn đều.`,
};

/** Ngũ hành chi tuổi so với ngũ hành CAN tháng — nói về bối cảnh bên ngoài. */
const CAN_ELEMENT_LINE: Record<ElementStance, (can: string, ce: NguHanh, pe: NguHanh) => string> = {
  'dong-hanh': (can, ce) =>
    `Can tháng là ${can} (hành ${ce}), cùng hành với chi tuổi bạn — bối cảnh chung của tháng khá "cùng tông" với bạn, nói gì cũng dễ được hiểu đúng ý.`,
  'ta-sinh': (can, ce) =>
    `Can tháng ${can} mang hành ${ce}, được hành của tuổi bạn sinh — bạn dễ thành người kéo việc trong tháng. Đặt giới hạn trước khi nhận thêm, đừng đợi tới lúc quá tải mới nói.`,
  'duoc-sinh': (can, ce, pe) =>
    `Can tháng ${can} mang hành ${ce}, sinh cho hành ${pe} của tuổi bạn — bối cảnh tháng tương đối ủng hộ. Cơ hội tháng này thường đến từ bên ngoài, nên đừng đóng cửa với lời rủ.`,
  'ta-khac': (can, ce) =>
    `Hành của tuổi bạn khắc hành ${ce} của can tháng ${can} — bạn có xu hướng muốn thay đổi cách mọi việc đang chạy. Muốn đề xuất được nghe thì nên kèm số liệu, đừng chỉ nói cảm giác.`,
  'bi-khac': (can, ce, pe) =>
    `Can tháng ${can} mang hành ${ce}, khắc hành ${pe} của tuổi bạn — dễ gặp yêu cầu khó chịu đến từ bên ngoài. Đừng nhận nó về mình như chuyện cá nhân; xử lý theo quy trình sẽ nhẹ hơn.`,
};

// ── Tra chi → con giáp ──────────────────────────────────────────────

const ZODIAC_BY_CHI: ReadonlyMap<string, Zodiac> = new Map(ZODIAC.map((z) => [z.ten, z]));

// ── Tổng quan một tháng (không phụ thuộc con giáp) ──────────────────

export interface MonthPillarSpan {
  pillar: MonthPillarInfo;
  /** Ngày đầu tiên (trong tháng dương) thuộc trụ này. */
  fromDay: number;
  /** Ngày cuối cùng (trong tháng dương) thuộc trụ này. */
  toDay: number;
}

export interface MonthOverview {
  key: MonthKey;
  slug: string;
  /** "tháng 8/2026". */
  label: string;
  daysCount: number;
  /** Các đoạn trụ tháng phủ tháng dương này (1 hoặc 2 đoạn — ranh giới tiết khí). */
  spans: MonthPillarSpan[];
  /** Trụ tháng chiếm phần lớn tháng dương — dùng làm trụ đại diện. */
  main: MonthPillarInfo;
  /** Số ngày trụ đại diện chiếm trong tháng dương. */
  mainDays: number;
  /** Năm can chi chứa phần lớn tháng này (đổi tại Lập Xuân, không phải 01/01). */
  yearCanChi: ReturnType<typeof canChiOfYear>;
  yearNumber: number;
}

const overviewCache = new Map<string, MonthOverview>();

export function buildMonthOverview(k: MonthKey): MonthOverview {
  const slug = monthSlug(k);
  const cached = overviewCache.get(slug);
  if (cached) return cached;

  const daysCount = daysInMonth(k.year, k.month);
  const spans: MonthPillarSpan[] = [];
  for (let d = 1; d <= daysCount; d++) {
    const p = monthPillarOf(k.year, k.month, d);
    const last = spans[spans.length - 1];
    if (last && last.pillar.label === p.label) last.toDay = d;
    else spans.push({ pillar: p, fromDay: d, toDay: d });
  }

  const biggest = spans.reduce((a, b) =>
    b.toDay - b.fromDay > a.toDay - a.fromDay ? b : a,
  );
  const overview: MonthOverview = {
    key: k,
    slug,
    label: `tháng ${k.month}/${k.year}`,
    daysCount,
    spans,
    main: biggest.pillar,
    mainDays: biggest.toDay - biggest.fromDay + 1,
    yearCanChi: canChiOfYear(biggest.pillar.solarYear),
    yearNumber: biggest.pillar.solarYear,
  };
  overviewCache.set(slug, overview);
  return overview;
}

/** Câu mô tả ranh giới tiết khí trong tháng — nói rõ giới hạn, không giấu. */
export function spanNote(o: MonthOverview): string {
  if (o.spans.length === 1) {
    return `Trọn ${o.label} nằm trong tiết tháng ${o.main.label} (trụ tháng theo Bát Tự đổi tại tiết khí, không đổi vào ngày 1 dương lịch).`;
  }
  const parts = o.spans.map(
    (s) =>
      `${fmtDate(o.key.year, o.key.month, s.fromDay)}–${fmtDate(o.key.year, o.key.month, s.toDay)} thuộc tiết tháng ${s.pillar.label}`,
  );
  return `Trụ tháng theo Bát Tự đổi tại tiết khí chứ không đổi vào ngày 1 dương lịch, nên ${o.label} bị cắt làm hai đoạn: ${parts.join('; ')}. Trang này lấy ${o.main.label} làm trụ đại diện vì nó chiếm ${o.mainDays}/${o.daysCount} ngày.`;
}

// ── Bảng ngày trong tháng theo chi tuổi ─────────────────────────────

export interface DayNote {
  day: number;
  weekday: string;
  /** Can chi ngày, vd "Giáp Tý". */
  canChi: string;
  chi: string;
}

export interface DayBuckets {
  tamHop: DayNote[];
  lucHop: DayNote[];
  lucXung: DayNote[];
  lucHai: DayNote[];
  trungChi: DayNote[];
}

function bucketDays(k: MonthKey, z: Zodiac): DayBuckets {
  const out: DayBuckets = { tamHop: [], lucHop: [], lucXung: [], lucHai: [], trungChi: [] };
  const total = daysInMonth(k.year, k.month);
  for (let d = 1; d <= total; d++) {
    const dc = dayCanChi(d, k.month, k.year);
    const dayZ = ZODIAC_BY_CHI.get(dc.branch);
    if (!dayZ) continue;
    const note: DayNote = {
      day: d,
      weekday: weekdayOf(k.year, k.month, d),
      canChi: dc.label,
      chi: dc.branch,
    };
    switch (relationOf(dayZ.slug, z.slug)) {
      case 'tam-hop': out.tamHop.push(note); break;
      case 'luc-hop': out.lucHop.push(note); break;
      case 'luc-xung': out.lucXung.push(note); break;
      case 'luc-hai': out.lucHai.push(note); break;
      case 'dong-tuoi': out.trungChi.push(note); break;
      default: break;
    }
  }
  return out;
}

const dayList = (days: DayNote[]): string => days.map((d) => d.day).join(', ');

// ── Tổng hợp một trang (tháng × con giáp) ───────────────────────────

export interface ThangConGiap {
  z: Zodiac;
  animal: string;
  month: MonthOverview;
  relation: RelationKind;
  relationLabel: string;
  relationLine: string;
  chiElementLine: string;
  canElementLine: string;
  /** Bối cảnh năm chứa tháng này (quan hệ tuổi ↔ năm + Tam Tai). */
  yearContextLine: string;
  isTamTaiYear: boolean;
  tamTaiChis: string[];
  days: DayBuckets;
  verdictShort: string;
  seoTitle: string;
  seoDescription: string;
  faqs: { q: string; a: string }[];
}

export function buildThangConGiap(k: MonthKey, slug: string): ThangConGiap | null {
  const z = findZodiac(slug);
  if (!z) return null;

  const month = buildMonthOverview(k);
  const monthChiZ = ZODIAC_BY_CHI.get(month.main.chi);
  if (!monthChiZ) return null;

  const relation = relationOf(z.slug, monthChiZ.slug);
  const relCopy = MONTH_RELATION[relation];
  const relationLine = relCopy.line(z.ten, month.main.chi, month.label);

  const chiStance = elementStance(z.nguHanh, monthChiZ.nguHanh);
  const chiElementLine = CHI_ELEMENT_LINE[chiStance](z.nguHanh, monthChiZ.nguHanh);

  const canElement = month.main.canElement as NguHanh;
  const canStance = elementStance(z.nguHanh, canElement);
  const canElementLine = CAN_ELEMENT_LINE[canStance](month.main.can, canElement, z.nguHanh);

  // Bối cảnh năm: dùng đúng năm can chi CHỨA tháng (đổi tại Lập Xuân) — nên
  // tháng 1/2027 vẫn thuộc năm Bính Ngọ, đây là chi tiết nhiều nơi làm sai.
  const yearChiZ = ZODIAC_BY_CHI.get(month.yearCanChi.chi)!;
  const yearRelation = relationOf(z.slug, yearChiZ.slug);
  const tamTaiChis = TAM_TAI_YEARS[z.ten as Chi];
  const isTamTaiYear = tamTaiChis.includes(month.yearCanChi.chi as Chi);
  const yearRelWord: Record<RelationKind, string> = {
    'tam-hop': `nằm trong nhóm Tam Hợp với năm`,
    'luc-hop': `ở thế Lục Hợp với năm`,
    'luc-xung': `xung với năm (dân gian gọi là xung Thái Tuế)`,
    'luc-hai': `ở thế Lục Hại với năm`,
    'dong-tuoi': `đúng vào năm tuổi của mình`,
    'binh-hoa': `ở thế bình hoà với năm`,
  };
  const yearContextLine = `Xét theo tiết khí, ${month.label} thuộc năm ${month.yearCanChi.name} (${month.yearNumber}) — trụ năm đổi tại Lập Xuân chứ không đổi ngày 01/01. Trong năm này tuổi ${z.ten} ${yearRelWord[yearRelation]}, và ${
    isTamTaiYear
      ? `năm ${month.yearCanChi.chi} nằm trong ba năm Tam Tai (${tamTaiChis.join(', ')}) của nhóm tuổi ${z.ten}`
      : `không rơi vào Tam Tai (nhóm tuổi ${z.ten} gặp Tam Tai vào ba năm ${tamTaiChis.join(', ')})`
  }. Đây là bối cảnh nền, còn phần thay đổi theo từng tháng nằm ở các mục bên dưới.`;

  const days = bucketDays(k, z);
  const thuanCount = days.tamHop.length + days.lucHop.length;

  const verdictShort = `${month.label.charAt(0).toUpperCase()}${month.label.slice(1)} mang trụ tháng ${month.main.label} (nạp âm ${month.main.napAm.name}). Với tuổi ${z.ten}, chi tháng ${month.main.chi} ở thế ${relCopy.short}; trong tháng có ${thuanCount} ngày hợp chi tuổi và ${days.lucXung.length} ngày xung chi tuổi. Đây là tra cứu theo phong tục Can Chi để tham khảo, không phải lời phán.`;

  const seoTitle = `Tử vi tháng ${k.month}/${k.year} tuổi ${z.ten}: hợp xung, ngày đáng chú ý`;
  const seoDescription = `Tử vi ${month.label} cho tuổi ${z.ten} (con ${ANIMAL_BY_CHI[z.ten as Chi]}): trụ tháng ${month.main.label}, ${relCopy.label.toLowerCase()}, kèm danh sách ${thuanCount} ngày hợp và ${days.lucXung.length} ngày xung chi tuổi. Tính từ can chi, tham khảo chứ không phán số mệnh.`;

  const faqs: { q: string; a: string }[] = [
    {
      q: `Tháng ${k.month}/${k.year} là tháng gì theo can chi?`,
      a: `${spanNote(month)} Trụ tháng ${month.main.label} có can ${month.main.can} (hành ${month.main.canElement}), chi ${month.main.chi} (hành ${month.main.chiElement}), nạp âm ${month.main.napAm.name} — hành ${month.main.napAm.element}.`,
    },
    {
      q: `Tuổi ${z.ten} tháng ${k.month}/${k.year} hợp hay xung?`,
      a: relationLine,
    },
    {
      q: `Tuổi ${z.ten} nên chú ý ngày nào trong tháng ${k.month}/${k.year}?`,
      a:
        (thuanCount > 0
          ? `Các ngày có địa chi hợp với chi tuổi ${z.ten}: ${[...days.tamHop, ...days.lucHop]
              .map((d) => `${d.day}/${k.month} (${d.canChi})`)
              .join(', ')}. `
          : `Tháng này không có ngày nào hợp chi tuổi ${z.ten} theo Tam Hợp hay Lục Hợp. `) +
        (days.lucXung.length > 0
          ? `Các ngày xung chi tuổi, nên để dư thời gian và tránh chốt việc lớn: ${dayList(days.lucXung)}. `
          : `Tháng này không có ngày nào xung chi tuổi ${z.ten}. `) +
        `Lưu ý: đây mới chỉ là MỘT yếu tố (quan hệ địa chi ngày với chi tuổi). Ngày tốt cho một việc cụ thể còn xét thêm trực, sao, giờ và mục đích — tra ở công cụ Xem ngày tốt.`,
    },
    {
      q: `Tháng ${k.month}/${k.year} thuộc năm can chi nào?`,
      a: yearContextLine,
    },
    {
      q: `Xem tử vi theo tháng như thế này có chính xác cho riêng tôi không?`,
      a: `Không, và chúng tôi nói thẳng điều đó. Trang này chỉ dùng một dữ kiện của bạn là con giáp, nên mọi người tuổi ${z.ten} đều đọc chung một nội dung. Nó hữu ích ở chỗ cho bạn khung thời gian và vài mốc ngày để tự sắp việc. Muốn sát hơn thì cần lá số theo ngày giờ sinh — lúc đó mới có đại vận, lưu niên và cung Mệnh của riêng bạn.`,
    },
  ];

  return {
    z,
    animal: ANIMAL_BY_CHI[z.ten as Chi],
    month,
    relation,
    relationLabel: relCopy.label,
    relationLine,
    chiElementLine,
    canElementLine,
    yearContextLine,
    isTamTaiYear,
    tamTaiChis,
    days,
    verdictShort,
    seoTitle,
    seoDescription,
    faqs,
  };
}

// ── Tóm tắt cho trang tổng quan tháng (12 con giáp một bảng) ────────

export interface MonthZodiacRow {
  z: Zodiac;
  relation: RelationKind;
  relationLabel: string;
  thuanDays: number;
  xungDays: number;
}

export function buildMonthTable(k: MonthKey): MonthZodiacRow[] {
  const month = buildMonthOverview(k);
  const monthChiZ = ZODIAC_BY_CHI.get(month.main.chi)!;
  return ZODIAC.map((z) => {
    const relation = relationOf(z.slug, monthChiZ.slug);
    const days = bucketDays(k, z);
    return {
      z,
      relation,
      relationLabel: MONTH_RELATION[relation].label,
      thuanDays: days.tamHop.length + days.lucHop.length,
      xungDays: days.lucXung.length,
    };
  });
}
