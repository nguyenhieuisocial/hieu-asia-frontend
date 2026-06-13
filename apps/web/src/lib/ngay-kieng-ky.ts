/**
 * Ngày kiêng kỵ dân gian — Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật.
 *
 * Thuần tính toán, không React, không phụ thuộc backend. Đổi dương → âm bằng
 * thuật toán lịch âm Việt Nam của Hồ Ngọc Đức (công khai), múi giờ +7.
 *
 * Các ngày kiêng theo NGÀY ÂM cố định — đối chiếu nhiều nguồn dân gian:
 *   - Tam Nương:           mùng 3, 7, 13, 18, 22, 27
 *   - Nguyệt Kỵ:           mùng 5, 14, 23  ("Mùng năm, mười bốn, hai ba…")
 *   - Dương Công Kỵ Nhật (theo tháng âm): 1→13 · 2→11 · 3→9 · 4→7 · 5→5 ·
 *       6→3 · 7→8 và 29 · 8→27 · 9→25 · 10→23 · 11→21 · 12→19
 *
 * Định vị thương hiệu: TRA CỨU PHONG TỤC để tham khảo — không phán số mệnh,
 * không gieo sợ hãi. Đây là nét văn hoá để cân nhắc, không phải điều bắt buộc.
 */

const TIMEZONE = 7; // Việt Nam (ICT)

const INT = Math.floor;

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  leap: boolean;
}

// ── Thuật toán lịch âm Hồ Ngọc Đức (công khai) ────────────────────────────

function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd =
    dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat: number;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  const JdNew = Jd1 + C1 - deltat;
  return INT(JdNew + 0.5 + timeZone / 24);
}

function getSunLongitude(jdn: number, timeZone: number): number {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - Math.PI * 2 * INT(L / (Math.PI * 2));
  return INT((L / Math.PI) * 6);
}

function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/** Đổi một ngày dương lịch (dd/mm/yy) sang âm lịch. */
export function solarToLunar(dd: number, mm: number, yy: number): LunarDate {
  const timeZone = TIMEZONE;
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = 1;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap === 1 };
}

// ── Ngày kiêng kỵ ─────────────────────────────────────────────────────────

export type KiengKyKey = 'tam_nuong' | 'nguyet_ky' | 'duong_cong' | 'nguyet_tan';

/** Tam Nương: 6 ngày âm cố định mỗi tháng. */
export const TAM_NUONG_DAYS = [3, 7, 13, 18, 22, 27];

/** Nguyệt Kỵ: mùng 5, 14, 23 âm lịch. */
export const NGUYET_KY_DAYS = [5, 14, 23];

/** Dương Công Kỵ Nhật: theo tháng âm, mỗi tháng một ngày, riêng tháng 7 có hai. */
export const DUONG_CONG_BY_MONTH: Record<number, number[]> = {
  1: [13],
  2: [11],
  3: [9],
  4: [7],
  5: [5],
  6: [3],
  7: [8, 29],
  8: [27],
  9: [25],
  10: [23],
  11: [21],
  12: [19],
};

export interface KiengKyInfo {
  key: KiengKyKey;
  name: string;
  /** Mô tả ngắn các ngày áp dụng. */
  days: string;
  /** Mô tả trung tính theo phong tục. */
  summary: string;
  /** Gợi ý thực tế, không mê tín. */
  advice: string;
}

export const KIENG_KY_INFO: Record<KiengKyKey, KiengKyInfo> = {
  tam_nuong: {
    key: 'tam_nuong',
    name: 'Tam Nương',
    days: 'Mùng 3, 7, 13, 18, 22, 27 (âm lịch)',
    summary:
      'Sáu ngày trong mỗi tháng âm mà theo phong tục người xưa thường tránh khởi sự việc lớn như cưới hỏi, khai trương, động thổ, đi xa. Tên gọi gắn với điển tích ba người phụ nữ trong sử Trung Hoa — Muội Hỷ, Đát Kỷ, Bao Tự — vốn gắn với sự suy vong của các triều đại Hạ, Thương, Chu.',
    advice:
      'Nếu lịch linh hoạt, nhiều người dời việc trọng sang ngày khác cho an tâm. Việc thường ngày thì không cần kiêng.',
  },
  nguyet_ky: {
    key: 'nguyet_ky',
    name: 'Nguyệt Kỵ',
    days: 'Mùng 5, 14, 23 (âm lịch)',
    summary:
      'Ba ngày mà cộng các chữ số đều ra 5 — dân gian có câu "Mùng năm, mười bốn, hai ba; đi chơi cũng thiệt nữa là đi buôn" (dị bản: "…làm gì cũng bại, chẳng ra việc gì"). Thường được nhắc khi xuất hành, buôn bán, ký kết.',
    advice:
      'Người xưa kiêng xuất hành xa, giao dịch lớn vào ngày này. Bạn có thể cân nhắc tuỳ việc, không cần quá lo.',
  },
  duong_cong: {
    key: 'duong_cong',
    name: 'Dương Công Kỵ Nhật',
    days: '13 ngày cố định trong năm (mỗi tháng âm một ngày, riêng tháng 7 có hai ngày)',
    summary:
      'Bộ 13 ngày được nhắc trong lịch pháp cổ (gắn với tên Dương Quân Tùng), thường được khuyên tránh khởi công, xây dựng, cưới hỏi vào những việc trọng đại.',
    advice:
      'Mang tính nhắc nhở thận trọng cho việc lớn; sinh hoạt thường nhật không bị ảnh hưởng.',
  },
  nguyet_tan: {
    key: 'nguyet_tan',
    name: 'Nguyệt Tận',
    days: 'Ngày cuối cùng của tháng âm lịch (30 hoặc 29 âm)',
    summary:
      '"Nguyệt tận" nghĩa là trăng đã hết — ngày khép lại tháng âm. Theo phong tục, người xưa tránh khởi sự việc lớn, xuất hành, cưới hỏi vào ngày này vì coi là thời điểm "tận", chưa trọn vẹn để bắt đầu.',
    advice:
      'Nhiều người tránh bắt đầu việc trọng vào ngày cuối tháng âm; việc thường ngày thì không cần kiêng.',
  },
};

export interface KiengKyResult {
  solar: { day: number; month: number; year: number };
  lunar: LunarDate;
  /** Các loại ngày kiêng mà ngày này rơi vào (có thể nhiều, có thể rỗng). */
  hits: KiengKyKey[];
}

/** Ngày dương hợp lệ trên lịch (chặn rollover, vd 31 của tháng 30 ngày). */
function isValidSolar(dd: number, mm: number, yy: number): boolean {
  if (!Number.isFinite(dd) || !Number.isFinite(mm) || !Number.isFinite(yy)) return false;
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31 || yy < 1900 || yy > 2100) return false;
  const dt = new Date(Date.UTC(yy, mm - 1, dd));
  return dt.getUTCFullYear() === yy && dt.getUTCMonth() === mm - 1 && dt.getUTCDate() === dd;
}

/** Kiểm tra một ngày dương lịch có rơi vào ngày kiêng kỵ nào không. */
export function checkKiengKy(dd: number, mm: number, yy: number): KiengKyResult | null {
  if (!isValidSolar(dd, mm, yy)) {
    return null;
  }
  const lunar = solarToLunar(dd, mm, yy);
  const hits: KiengKyKey[] = [];
  if (TAM_NUONG_DAYS.includes(lunar.day)) hits.push('tam_nuong');
  if (NGUYET_KY_DAYS.includes(lunar.day)) hits.push('nguyet_ky');
  if ((DUONG_CONG_BY_MONTH[lunar.month] ?? []).includes(lunar.day)) hits.push('duong_cong');
  // Nguyệt Tận: ngày cuối tháng âm — hôm sau là mùng 1 âm lịch.
  const next = new Date(Date.UTC(yy, mm - 1, dd + 1));
  const nextLunar = solarToLunar(next.getUTCDate(), next.getUTCMonth() + 1, next.getUTCFullYear());
  if (nextLunar.day === 1) hits.push('nguyet_tan');
  return { solar: { day: dd, month: mm, year: yy }, lunar, hits };
}

/** Liệt kê các ngày kiêng kỵ rơi trong một tháng dương lịch. */
export function kiengKyInSolarMonth(year: number, month: number): KiengKyResult[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const out: KiengKyResult[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const r = checkKiengKy(d, month, year);
    if (r && r.hits.length > 0) out.push(r);
  }
  return out;
}
