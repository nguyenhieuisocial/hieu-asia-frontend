/**
 * Bát Tự (Tứ Trụ) — engine tính 4 trụ CHUẨN, thuần TypeScript.
 *
 * Khác bộ lịch âm thông thường ở chỗ trụ NĂM + THÁNG tính theo **tiết khí**
 * (đúng chuẩn mệnh lý Bát Tự), không theo tháng âm lịch:
 *   - Trụ năm đổi tại **Lập Xuân** (Mặt Trời tới kinh độ hoàng đạo 315°).
 *   - Trụ tháng theo 12 "tiết" (mỗi 30° kinh độ Mặt Trời), can tháng suy theo
 *     Ngũ Hổ Độn từ can năm.
 *   - Trụ ngày: chu kỳ 60 ngày liên tục (neo theo một ngày đã biết, kiểm chứng).
 *   - Trụ giờ: can giờ suy theo Ngũ Thử Độn từ can ngày.
 *
 * Vị trí Mặt Trời lấy từ `lib/western-astrology.ts` (thuật toán Meeus, đã kiểm
 * chứng sai số < 0.01°). Toàn bộ là DỮ KIỆN tính được, kiểm chứng được — không
 * bói toán.
 */

import { julianDay, sunLongitude } from './western-astrology';

export const CAN = [
  'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý',
] as const;
export const CHI = [
  'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi',
] as const;

export type Element = 'Mộc' | 'Hỏa' | 'Thổ' | 'Kim' | 'Thủy';
export const ELEMENTS: Element[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'];

// Ngũ hành + âm/dương của 10 Thiên Can (true = Dương).
const CAN_ELEMENT: Element[] = ['Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy'];
const CAN_YANG: boolean[] = [true, false, true, false, true, false, true, false, true, false];

// Ngũ hành + âm/dương của 12 Địa Chi.
const CHI_ELEMENT: Element[] = ['Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];

// Quan hệ ngũ hành.
const SHENG: Record<Element, Element> = { Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc' };
const KE: Record<Element, Element> = { Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc' };

/**
 * Thập Thần — quan hệ của một Thiên Can với Nhật Chủ (can trụ ngày).
 * Chính (正) = khác âm dương; Thiên/Thất (偏) = cùng âm dương.
 */
function thapThan(dmEl: Element, dmYang: boolean, el: Element, yang: boolean): string {
  const same = dmYang === yang;
  if (el === dmEl) return same ? 'Tỷ Kiên' : 'Kiếp Tài';
  if (SHENG[dmEl] === el) return same ? 'Thực Thần' : 'Thương Quan'; // Nhật Chủ sinh nó
  if (KE[el] === dmEl) return same ? 'Thất Sát' : 'Chính Quan'; // Nó khắc Nhật Chủ
  if (KE[dmEl] === el) return same ? 'Thiên Tài' : 'Chính Tài'; // Nhật Chủ khắc nó
  if (SHENG[el] === dmEl) return same ? 'Thiên Ấn' : 'Chính Ấn'; // Nó sinh Nhật Chủ
  return '';
}

// Ngũ Hổ Độn — can của tháng Dần ứng với từng can năm (index theo can năm).
const NGU_HO_DAN_STEM = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
// Ngũ Thử Độn — can của giờ Tý ứng với từng can ngày (index theo can ngày).
const NGU_THU_TY_STEM = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];

// Neo trụ ngày: 1990-05-20 = Ất Dậu (chỉ số 21 trong vòng 60) — đối chiếu với
// engine lịch âm sẵn có của hệ thống (trụ ngày hai hệ giống nhau).
const ANCHOR_JDN = Math.floor(julianDay(1990, 5, 20, 12) + 0.5);
const ANCHOR_DAY_INDEX = 21;

const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Tìm thời điểm (JD) Mặt Trời tới kinh độ `targetLon`, quanh ngày xấp xỉ. */
function solarTermJD(year: number, targetLon: number, approxMonth: number, approxDay: number): number {
  const center = julianDay(year, approxMonth, approxDay);
  let lo = center - 6;
  let hi = center + 6;
  const f = (jd: number) => {
    let d = sunLongitude(jd) - targetLon;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    return d;
  };
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (f(lo) * f(mid) <= 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

export interface BaziPillar {
  label: string; // "Năm" | "Tháng" | "Ngày" | "Giờ"
  can: string;
  chi: string;
  canElement: Element;
  chiElement: Element;
  /** Thập Thần của CAN trụ này so với Nhật Chủ. Trụ ngày = "Nhật Chủ". */
  tenGod: string;
}

export interface BaziChart {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
  dayMaster: { can: string; element: Element; yang: boolean };
  /** Đếm ngũ hành trên 8 chữ (4 can + 4 chi). */
  elementCount: Record<Element, number>;
  /** Hành thiếu (đếm = 0). */
  missing: Element[];
  /** Hành nhiều nhất. */
  strongest: Element;
  meta: { solarDate: string; hour: number; solarYearForPillar: number };
  /** Đại vận (vận 10 năm) — null nếu không truyền giới tính. */
  daiVan?: DaiVan | null;
}

export interface BaziInput {
  birthSolarDate: string; // "YYYY-MM-DD"
  birthHour: number; // 0–23
  birthMinute?: number; // 0–59 (mặc định 0)
  gender?: 'M' | 'F'; // cần cho hướng đại vận (thuận/nghịch); thiếu → bỏ đại vận
}

function makePillar(label: string, canIdx: number, chiIdx: number, dm: { el: Element; yang: boolean } | null): BaziPillar {
  return {
    label,
    can: CAN[canIdx]!,
    chi: CHI[chiIdx]!,
    canElement: CAN_ELEMENT[canIdx]!,
    chiElement: CHI_ELEMENT[chiIdx]!,
    tenGod: dm ? thapThan(dm.el, dm.yang, CAN_ELEMENT[canIdx]!, CAN_YANG[canIdx]!) : 'Nhật Chủ',
  };
}

export interface DaiVanPillar {
  index: number;
  startAge: number;
  endAge: number;
  can: string;
  chi: string;
  canElement: Element;
  chiElement: Element;
  tenGod: string;
}

export interface DaiVan {
  forward: boolean; // thuận (true) / nghịch (false)
  startAge: number; // tuổi khởi vận (xấp xỉ, 3 ngày tới tiết = 1 tuổi)
  pillars: DaiVanPillar[];
}

/** Tìm JD Mặt Trời tới `targetLon` trong [jdStart, jdEnd] (giả định đúng 1 lần cắt). */
function findTermCrossing(jdStart: number, jdEnd: number, targetLon: number): number {
  const f = (jd: number) => {
    let d = sunLongitude(jd) - targetLon;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    return d;
  };
  let lo = jdStart;
  let hi = jdEnd;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (f(lo) * f(mid) <= 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Đại vận (vận 10 năm). Hướng: dương-nam / âm-nữ → thuận; âm-nam / dương-nữ → nghịch.
 * Tuổi khởi vận = số ngày từ sinh tới tiết kế (thuận) / tiết trước (nghịch) chia 3.
 * Các trụ vận bước ±1 từ trụ THÁNG theo vòng can chi, mỗi trụ 10 năm.
 */
function computeDaiVan(
  jdBirthUTC: number,
  sector: number,
  monthCan: number,
  monthChi: number,
  yearCan: number,
  dm: { el: Element; yang: boolean },
  gender: 'M' | 'F',
): DaiVan {
  const yangYear = CAN_YANG[yearCan]!;
  const forward = (yangYear && gender === 'M') || (!yangYear && gender === 'F');

  const curLon = mod(315 + sector * 30, 360); // tiết khởi đầu tháng sinh
  let days: number;
  if (forward) {
    const jdNext = findTermCrossing(jdBirthUTC, jdBirthUTC + 32, mod(curLon + 30, 360));
    days = jdNext - jdBirthUTC;
  } else {
    const jdPrev = findTermCrossing(jdBirthUTC - 32, jdBirthUTC, curLon);
    days = jdBirthUTC - jdPrev;
  }
  const startAge = Math.max(1, Math.round(days / 3));

  const dir = forward ? 1 : -1;
  const pillars: DaiVanPillar[] = [];
  for (let k = 1; k <= 9; k++) {
    const c = mod(monthCan + dir * k, 10);
    const ch = mod(monthChi + dir * k, 12);
    const start = startAge + (k - 1) * 10;
    pillars.push({
      index: k,
      startAge: start,
      endAge: start + 9,
      can: CAN[c]!,
      chi: CHI[ch]!,
      canElement: CAN_ELEMENT[c]!,
      chiElement: CHI_ELEMENT[ch]!,
      tenGod: thapThan(dm.el, dm.yang, CAN_ELEMENT[c]!, CAN_YANG[c]!),
    });
  }
  return { forward, startAge, pillars };
}

export function calculateBazi(input: BaziInput): BaziChart {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec((input.birthSolarDate ?? '').trim());
  if (!m) throw new Error('birthSolarDate phải dạng YYYY-MM-DD');
  const Y = Number(m[1]);
  const M = Number(m[2]);
  const D = Number(m[3]);
  const hour = Number.isFinite(input.birthHour) ? input.birthHour : 12;
  const minute = input.birthMinute ?? 0;

  // Thời điểm sinh quy về UTC (giờ VN = UTC+7) — dùng cho ranh giới tiết khí.
  const jdUTC = julianDay(Y, M, D, hour - 7, minute);

  // --- Trụ NĂM: đổi tại Lập Xuân (Mặt Trời = 315°) ---
  const lapXuan = solarTermJD(Y, 315, 2, 4);
  const solarYear = jdUTC >= lapXuan ? Y : Y - 1;
  const yearCan = mod(solarYear - 4, 10);
  const yearChi = mod(solarYear - 4, 12);

  // --- Trụ THÁNG: theo "tiết" (12 cung 30° tính từ 315° = Dần) ---
  const sun = sunLongitude(jdUTC);
  const sector = Math.floor(mod(sun - 315, 360) / 30); // 0 = Dần … 11 = Sửu
  const monthChi = mod(sector + 2, 12); // Dần = chi index 2
  const monthCan = mod(NGU_HO_DAN_STEM[yearCan]! + sector, 10);

  // --- Trụ NGÀY: chu kỳ 60 ngày liên tục từ ngày neo ---
  const jdn = Math.floor(julianDay(Y, M, D, 12) + 0.5);
  const dayIndex = mod(ANCHOR_DAY_INDEX + (jdn - ANCHOR_JDN), 60);
  const dayCan = dayIndex % 10;
  const dayChi = dayIndex % 12;

  // --- Trụ GIỜ ---
  const hourChi = Math.floor(mod(hour + 1, 24) / 2); // 23–1 = Tý (0)
  const hourCan = mod(NGU_THU_TY_STEM[dayCan]! + hourChi, 10);

  const dm = { el: CAN_ELEMENT[dayCan]!, yang: CAN_YANG[dayCan]! };

  const year = makePillar('Năm', yearCan, yearChi, dm);
  const month = makePillar('Tháng', monthCan, monthChi, dm);
  const day = makePillar('Ngày', dayCan, dayChi, null);
  const hourP = makePillar('Giờ', hourCan, hourChi, dm);

  // Đếm ngũ hành trên 8 chữ.
  const elementCount: Record<Element, number> = { Mộc: 0, Hỏa: 0, Thổ: 0, Kim: 0, Thủy: 0 };
  for (const p of [year, month, day, hourP]) {
    elementCount[p.canElement] += 1;
    elementCount[p.chiElement] += 1;
  }
  const missing = ELEMENTS.filter((e) => elementCount[e] === 0);
  const strongest = ELEMENTS.reduce((a, b) => (elementCount[b] > elementCount[a] ? b : a), ELEMENTS[0]!);

  const gender = input.gender === 'F' ? 'F' : input.gender === 'M' ? 'M' : null;
  const daiVan = gender ? computeDaiVan(jdUTC, sector, monthCan, monthChi, yearCan, dm, gender) : null;

  return {
    year,
    month,
    day,
    hour: hourP,
    dayMaster: { can: CAN[dayCan]!, element: dm.el, yang: dm.yang },
    elementCount,
    missing,
    strongest,
    daiVan,
    meta: { solarDate: input.birthSolarDate, hour, solarYearForPillar: solarYear },
  };
}
