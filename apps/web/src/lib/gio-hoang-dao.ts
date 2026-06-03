/**
 * Giờ hoàng đạo — 12 canh giờ trong ngày, giờ nào tốt (hoàng đạo) / xấu (hắc đạo).
 *
 * Thuần tính toán, không React, không phụ thuộc backend. Mỗi ngày có 6 giờ
 * hoàng đạo + 6 giờ hắc đạo, ĐỔI theo Địa Chi của NGÀY (không theo tháng).
 *
 * Cách tính (đối chiếu KHỚP lịch vạn niên hieu.asia + bài quyết cổ):
 *   - Can/Chi ngày suy từ số ngày Julian: chi = (JDN+1)%12, can = (JDN+9)%10.
 *   - Mốc sao Thanh Long theo Chi NGÀY (bài quyết "Dần Thân gia Tý, Mão Dậu Dần,
 *     Thìn Tuất Thìn, Tỵ Hợi Ngọ, Tý Ngọ Thân, Sửu Mùi Tuất").
 *   - Xếp 12 sao (vòng cố định) lên 12 giờ; 6 sao tốt = giờ hoàng đạo.
 *
 * Định vị thương hiệu: TRA CỨU PHONG TỤC để tham khảo — không phán số mệnh.
 */

const INT = Math.floor;

export const BRANCHES = [
  'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi',
] as const;
export type Branch = (typeof BRANCHES)[number];

const STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

/** Khung giờ đồng hồ của 12 canh giờ. */
export const HOUR_RANGE: Record<Branch, string> = {
  Tý: '23h–1h', Sửu: '1h–3h', Dần: '3h–5h', Mão: '5h–7h',
  Thìn: '7h–9h', Tỵ: '9h–11h', Ngọ: '11h–13h', Mùi: '13h–15h',
  Thân: '15h–17h', Dậu: '17h–19h', Tuất: '19h–21h', Hợi: '21h–23h',
};

export interface StarDef {
  name: string;
  good: boolean;
  /** Ý nghĩa ngắn theo phong tục. */
  meaning: string;
  /** Việc thường được nhắc là hợp (chỉ cho giờ tốt). */
  suits?: string;
}

// Vòng 12 sao cố định (thứ tự xếp). 6 hoàng đạo (good) xen 6 hắc đạo.
const STARS: StarDef[] = [
  { name: 'Thanh Long', good: true, meaning: 'Đại cát, may mắn toàn diện.', suits: 'Cưới hỏi, khởi công, khai trương, xuất hành.' },
  { name: 'Minh Đường', good: true, meaning: 'Được quý nhân phù trợ, hanh thông.', suits: 'Gặp đối tác, đàm phán, xin việc, giao dịch.' },
  { name: 'Thiên Hình', good: false, meaning: 'Dễ vướng kiện tụng, va chạm — nên tránh việc lớn.' },
  { name: 'Chu Tước', good: false, meaning: 'Dễ thị phi, cãi vã, lời tiếng — nên tránh giao dịch lớn.' },
  { name: 'Kim Quỹ', good: true, meaning: 'Tài lộc, phúc đức, con cái.', suits: 'Việc tiền bạc, mở hàng, cầu tài, việc gia đạo.' },
  { name: 'Thiên Đức', good: true, meaning: 'Được che chở, hoá giải điều xấu (còn gọi Bảo Quang).', suits: 'Cầu an, lễ bái, việc cần bình an.' },
  { name: 'Bạch Hổ', good: false, meaning: 'Dễ hao tổn, thương tật — nên tránh việc hệ trọng.' },
  { name: 'Ngọc Đường', good: true, meaning: 'Thanh quý, sáng sủa, học hành hanh thông.', suits: 'Ký kết, học tập, thi cử, lập nghiệp.' },
  { name: 'Thiên Lao', good: false, meaning: 'Dễ trói buộc, bế tắc — nên tránh khởi sự mới.' },
  { name: 'Huyền Vũ', good: false, meaning: 'Dễ mất mát, gặp tiểu nhân — nên cẩn trọng tiền bạc.' },
  { name: 'Tư Mệnh', good: true, meaning: 'Thuận lợi, được hộ trì (ban ngày càng tốt).', suits: 'Giấy tờ, đăng ký, buôn bán, việc hành chính.' },
  { name: 'Câu Trận', good: false, meaning: 'Dễ vướng mắc, rối ren — nên tránh di chuyển, khởi công.' },
];

/** 6 sao hoàng đạo (giờ tốt) — để giới thiệu trên trang. */
export const HOANG_DAO_STARS: StarDef[] = STARS.filter((s) => s.good);

// Mốc khởi sao Thanh Long theo Chi NGÀY (bài quyết cổ "Dần Thân gia Tý…").
const THANH_LONG_OFFSET: Record<Branch, number> = {
  Dần: 0, Thân: 0,
  Mão: 2, Dậu: 2,
  Thìn: 4, Tuất: 4,
  Tỵ: 6, Hợi: 6,
  Ngọ: 8, Tý: 8,
  Mùi: 10, Sửu: 10,
};

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

export interface DayCanChi {
  stem: string;
  branch: Branch;
  stemIndex: number;
  branchIndex: number;
  label: string;
}

/** Can Chi của ngày dương (dd/mm/yy) — suy từ số ngày Julian. */
export function dayCanChi(dd: number, mm: number, yy: number): DayCanChi {
  const jd = jdFromDate(dd, mm, yy);
  const branchIndex = ((jd + 1) % 12 + 12) % 12;
  const stemIndex = ((jd + 9) % 10 + 10) % 10;
  const stem = STEMS[stemIndex]!;
  const branch = BRANCHES[branchIndex]!;
  return { stem, branch, stemIndex, branchIndex, label: `${stem} ${branch}` };
}

export interface HourInfo {
  branch: Branch;
  /** Khung giờ đồng hồ, vd "23h–1h". */
  range: string;
  /** Can Chi của giờ, vd "Nhâm Tý". */
  canChi: string;
  star: string;
  good: boolean;
  meaning: string;
  /** Việc hợp (giờ tốt) hoặc lời nhắc (giờ xấu). */
  note: string;
}

export interface GioHoangDaoResult {
  solar: { day: number; month: number; year: number };
  dayCanChi: DayCanChi;
  hours: HourInfo[];
}

function isValid(dd: number, mm: number, yy: number): boolean {
  if (!Number.isFinite(dd) || !Number.isFinite(mm) || !Number.isFinite(yy)) return false;
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31 || yy < 1900 || yy > 2100) return false;
  const dt = new Date(Date.UTC(yy, mm - 1, dd));
  return dt.getUTCFullYear() === yy && dt.getUTCMonth() === mm - 1 && dt.getUTCDate() === dd;
}

/** Tính 12 canh giờ tốt/xấu cho một ngày dương lịch. */
export function computeGioHoangDao(dd: number, mm: number, yy: number): GioHoangDaoResult | null {
  if (!isValid(dd, mm, yy)) return null;
  const dc = dayCanChi(dd, mm, yy);
  const offset = THANH_LONG_OFFSET[dc.branch];
  const hourStemBase = (dc.stemIndex % 5) * 2; // Ngũ Thử Độn: can giờ Tý theo can ngày.

  const hours: HourInfo[] = BRANCHES.map((b, h) => {
    const star = STARS[((h - offset) % 12 + 12) % 12]!;
    const hourStem = STEMS[(hourStemBase + h) % 10]!;
    return {
      branch: b,
      range: HOUR_RANGE[b],
      canChi: `${hourStem} ${b}`,
      star: star.name,
      good: star.good,
      meaning: star.meaning,
      note: star.good ? (star.suits ?? '') : 'Nên tránh việc trọng đại.',
    };
  });

  return { solar: { day: dd, month: mm, year: yy }, dayCanChi: dc, hours };
}

/** Chỉ số canh giờ (0=Tý…11=Hợi) chứa thời điểm `now`. */
export function currentHourIndex(now: Date): number {
  const h = now.getHours();
  return INT(((h + 1) % 24) / 2);
}

/**
 * Giờ hoàng đạo kế tiếp tính từ `now` (trong ngày). Trả về giờ tốt đang diễn ra
 * hoặc sắp tới gần nhất; null nếu hôm nay không còn giờ tốt nào phía sau.
 */
export function nextGoodHour(
  result: GioHoangDaoResult,
  now: Date,
): { hour: HourInfo; active: boolean } | null {
  const cur = currentHourIndex(now);
  for (let i = 0; i < 12; i++) {
    const idx = (cur + i) % 12;
    if (idx < cur && i > 0) break; // không vòng sang ngày hôm sau
    const hour = result.hours[idx]!;
    if (hour.good) return { hour, active: i === 0 };
  }
  return null;
}
