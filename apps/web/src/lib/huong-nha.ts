/**
 * Engine "Xem hướng nhà hợp tuổi" — Bát Trạch (8 trạch / Eight Mansions).
 *
 * Từ năm sinh + giới tính → Cung Phi (mệnh quái) → 8 hướng, mỗi hướng mang một
 * trong 8 du-niên-tinh (4 cát, 4 hung). Đông tứ mệnh hợp 4 hướng Đông, Tây tứ
 * mệnh hợp 4 hướng Tây.
 *
 * - Cung Phi: MIRROR đúng công thức worker `tools/hop-tuoi.ts` (cungPhi) để toàn
 *   site nhất quán — không tự bịa bảng khác.
 * - Bảng hướng (sao theo hướng): sinh bằng THUẬT TOÁN biến hào du niên (lật từng
 *   hào theo thứ tự cố định), KHÔNG chép tay → tránh sai số. Đã kiểm chứng đủ 8
 *   hướng của mệnh Khảm khớp bảng bát trạch cổ điển (xem scripts verify).
 *
 * Brand: con số/quy tắc minh bạch để THAM KHẢO khi chọn hướng nhà, KHÔNG phán
 * giàu nghèo; không bán "hóa giải".
 */

export type Gender = 'nam' | 'nu';

export type Quai = 'Càn' | 'Khảm' | 'Cấn' | 'Chấn' | 'Tốn' | 'Ly' | 'Khôn' | 'Đoài';

export type Direction =
  | 'Bắc'
  | 'Đông Bắc'
  | 'Đông'
  | 'Đông Nam'
  | 'Nam'
  | 'Tây Nam'
  | 'Tây'
  | 'Tây Bắc';

/** Thứ tự la bàn để hiển thị nhất quán (Bắc → xoay theo chiều kim đồng hồ). */
export const DIRECTION_ORDER: Direction[] = [
  'Bắc',
  'Đông Bắc',
  'Đông',
  'Đông Nam',
  'Nam',
  'Tây Nam',
  'Tây',
  'Tây Bắc',
];

// Quẻ → 3 hào (dưới, giữa, trên); dương = 1, âm = 0.
const QUAI_LINES: Record<Quai, [number, number, number]> = {
  'Càn': [1, 1, 1],
  'Đoài': [1, 1, 0],
  'Ly': [1, 0, 1],
  'Chấn': [1, 0, 0],
  'Tốn': [0, 1, 1],
  'Khảm': [0, 1, 0],
  'Cấn': [0, 0, 1],
  'Khôn': [0, 0, 0],
};

// Mỗi quẻ "tọa" tại một hướng la bàn (hậu thiên bát quái).
const QUAI_DIRECTION: Record<Quai, Direction> = {
  'Khảm': 'Bắc',
  'Cấn': 'Đông Bắc',
  'Chấn': 'Đông',
  'Tốn': 'Đông Nam',
  'Ly': 'Nam',
  'Khôn': 'Tây Nam',
  'Đoài': 'Tây',
  'Càn': 'Tây Bắc',
};

function linesToQuai(lines: [number, number, number]): Quai {
  const key = lines.join('');
  for (const q of Object.keys(QUAI_LINES) as Quai[]) {
    if (QUAI_LINES[q].join('') === key) return q;
  }
  throw new Error(`Bad trigram lines: ${key}`);
}

export const DONG_TU_MENH: Quai[] = ['Khảm', 'Ly', 'Chấn', 'Tốn'];
export const TAY_TU_MENH: Quai[] = ['Càn', 'Khôn', 'Cấn', 'Đoài'];

export function menhGroup(q: Quai): 'Đông' | 'Tây' {
  return DONG_TU_MENH.includes(q) ? 'Đông' : 'Tây';
}

// ── Cung Phi (mệnh quái) — MIRROR worker tools/hop-tuoi.ts ──────────────
const CUNG_PHI_NAM: Record<number, Quai> = {
  1: 'Khảm', 2: 'Ly', 3: 'Cấn', 4: 'Đoài', 5: 'Càn',
  6: 'Khôn', 7: 'Tốn', 8: 'Chấn', 9: 'Khôn', 0: 'Ly',
};
const CUNG_PHI_NU: Record<number, Quai> = {
  1: 'Cấn', 2: 'Càn', 3: 'Đoài', 4: 'Cấn', 5: 'Ly',
  6: 'Khảm', 7: 'Khôn', 8: 'Chấn', 9: 'Tốn', 0: 'Cấn',
};

function sumDigits(n: number): number {
  let s = 0;
  let x = Math.abs(n);
  while (x > 0) {
    s += x % 10;
    x = Math.floor(x / 10);
  }
  return s >= 10 ? sumDigits(s) : s;
}

export function cungPhi(year: number, gender: Gender): Quai {
  const digit = sumDigits(year); // 0–9, mọi key đều có trong bảng
  return (gender === 'nam' ? CUNG_PHI_NAM[digit] : CUNG_PHI_NU[digit]) as Quai;
}

// ── 8 du niên tinh ─────────────────────────────────────────────────────
export type StarKey =
  | 'sinh_khi'
  | 'thien_y'
  | 'dien_nien'
  | 'phuc_vi'
  | 'tuyet_menh'
  | 'ngu_quy'
  | 'luc_sat'
  | 'hoa_hai';

export interface StarInfo {
  name: string;
  good: boolean;
  /** Hướng này tốt/xấu cho việc gì (ngắn gọn, tham khảo). */
  blurb: string;
}

export const STAR_INFO: Record<StarKey, StarInfo> = {
  sinh_khi: { name: 'Sinh Khí', good: true, blurb: 'Hướng tốt nhất — thuận công danh, tài lộc, sức sống. Hợp đặt cửa chính, bàn làm việc.' },
  thien_y: { name: 'Thiên Y', good: true, blurb: 'Tốt cho sức khỏe, quý nhân. Hợp hướng giường ngủ, bếp.' },
  dien_nien: { name: 'Diên Niên', good: true, blurb: 'Tốt cho hòa thuận, hôn nhân, quan hệ. Hợp phòng ngủ, phòng khách.' },
  phuc_vi: { name: 'Phục Vị', good: true, blurb: 'Bình ổn, củng cố — hợp bàn thờ, phòng học, nơi cần sự yên định.' },
  tuyet_menh: { name: 'Tuyệt Mệnh', good: false, blurb: 'Hướng xấu nhất theo quan niệm — nên tránh đặt cửa chính, giường.' },
  ngu_quy: { name: 'Ngũ Quỷ', good: false, blurb: 'Dễ thị phi, hao tán — thường tránh cho cửa và bếp.' },
  luc_sat: { name: 'Lục Sát', good: false, blurb: 'Hay vướng mắc, trục trặc — nên tránh hướng cửa, giường.' },
  hoa_hai: { name: 'Họa Hại', good: false, blurb: 'Hao hụt nhẹ, lục đục — hướng kém, nên tránh nếu có lựa chọn khác.' },
};

// Thuật toán biến hào du niên: bắt đầu từ quẻ mệnh (Phục Vị), lật hào theo
// thứ tự cố định [trên, giữa, dưới, giữa, trên, giữa, dưới] sinh 7 quẻ kế,
// gán nhãn [Sinh Khí, Ngũ Quỷ, Diên Niên, Lục Sát, Họa Hại, Thiên Y, Tuyệt Mệnh].
const FLIP_SEQUENCE = [2, 1, 0, 1, 2, 1, 0]; // 0=hào dưới, 1=giữa, 2=trên
const FLIP_LABELS: StarKey[] = ['sinh_khi', 'ngu_quy', 'dien_nien', 'luc_sat', 'hoa_hai', 'thien_y', 'tuyet_menh'];

/** Bảng hướng → sao cho một mệnh quái. */
export function batTrachMap(natal: Quai): Record<Direction, StarKey> {
  const map = {} as Record<Direction, StarKey>;
  map[QUAI_DIRECTION[natal]] = 'phuc_vi';
  const cur: [number, number, number] = [...QUAI_LINES[natal]];
  for (let i = 0; i < FLIP_SEQUENCE.length; i++) {
    const idx = FLIP_SEQUENCE[i]!;
    cur[idx] = cur[idx] === 1 ? 0 : 1;
    const q = linesToQuai(cur);
    map[QUAI_DIRECTION[q]] = FLIP_LABELS[i]!;
  }
  return map;
}

// ── Kết quả tổng hợp ─────────────────────────────────────────────────────
export interface DirectionResult {
  direction: Direction;
  star: StarKey;
  good: boolean;
}

export interface HuongNhaResult {
  year: number;
  gender: Gender;
  cungPhi: Quai;
  group: 'Đông' | 'Tây';
  /** 8 hướng theo thứ tự la bàn. */
  directions: DirectionResult[];
  /** 4 hướng tốt (đã xếp Sinh Khí → Thiên Y → Diên Niên → Phục Vị). */
  good: DirectionResult[];
  /** 4 hướng xấu (đã xếp nhẹ → nặng đảo lại: Tuyệt Mệnh nặng nhất trước). */
  bad: DirectionResult[];
}

const GOOD_RANK: StarKey[] = ['sinh_khi', 'thien_y', 'dien_nien', 'phuc_vi'];
const BAD_RANK: StarKey[] = ['tuyet_menh', 'ngu_quy', 'luc_sat', 'hoa_hai'];

export function computeHuongNha(year: number, gender: Gender): HuongNhaResult {
  const cp = cungPhi(year, gender);
  const map = batTrachMap(cp);
  const directions: DirectionResult[] = DIRECTION_ORDER.map((d) => ({
    direction: d,
    star: map[d],
    good: STAR_INFO[map[d]].good,
  }));
  const good = [...directions]
    .filter((d) => d.good)
    .sort((a, b) => GOOD_RANK.indexOf(a.star) - GOOD_RANK.indexOf(b.star));
  const bad = [...directions]
    .filter((d) => !d.good)
    .sort((a, b) => BAD_RANK.indexOf(a.star) - BAD_RANK.indexOf(b.star));
  return { year, gender, cungPhi: cp, group: menhGroup(cp), directions, good, bad };
}

/** Nhãn nhóm đầy đủ, vd "Đông tứ mệnh". */
export function groupLabel(g: 'Đông' | 'Tây'): string {
  return g === 'Đông' ? 'Đông tứ mệnh' : 'Tây tứ mệnh';
}
