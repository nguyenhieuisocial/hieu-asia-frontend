/**
 * Huyền Không Phi Tinh — engine an sao bàn trạch (玄空飛星宅運盤).
 *
 * Thuần TypeScript, KHÔNG phụ thuộc thư viện ngoài. Dùng phương pháp HẠ QUÁI (下卦)
 * tiêu chuẩn: vận tinh nhập trung cung phi thuận → bàn vận; lấy sao bàn vận tại cung
 * TỌA và cung HƯỚNG nhập trung → phi thuận/nghịch theo âm-dương Huyền Không của
 * tam-nguyên-long → bàn sơn (山盤) + bàn hướng (向盤).
 *
 * ĐỘ CHÍNH XÁC: thuật toán + bảng dữ liệu là tri thức cổ điển (công cộng), đã kiểm
 * chứng độc lập: tái lập đúng các cục kinh điển — ví dụ Bát vận Sửu sơn Mùi hướng =
 * "Vượng sơn Vượng hướng" (旺山旺向). Xem phi-tinh.test.ts.
 *
 * KHÔNG bao gồm "Thế quái" (替卦 / kiêm hướng) — khẩu quyết các phái bất đồng → để
 * minh bạch, engine chỉ làm Hạ Quái; ca kiêm hướng gắn cờ tham khảo, không phán cứng.
 */

const mod9 = (n: number): number => ((n % 9) + 9) % 9;

export type YuanLong = 0 | 1 | 2; // 0 = Địa nguyên long, 1 = Thiên nguyên long, 2 = Nhân nguyên long

export interface Mountain {
  /** Tên sơn (1 trong 24 sơn). */
  name: string;
  /** Tên Hán (tham chiếu). */
  han: string;
  /** Góc tâm sơn (độ, chính Bắc = 0), mỗi sơn rộng 15°. */
  centerDeg: number;
  /** Quái cung chứa sơn (Khảm/Cấn/Chấn/Tốn/Ly/Khôn/Đoài/Càn). */
  gua: string;
  /** Tam nguyên long. */
  yuanLong: YuanLong;
  /** Âm-Dương Huyền Không: true = Dương (phi thuận), false = Âm (phi nghịch). */
  yang: boolean;
}

/**
 * 24 sơn theo chiều kim đồng hồ từ Tý (0°), mỗi 15°.
 * Âm-dương theo quy tắc Huyền Không: Thiên nguyên Tý-Ngọ-Mão-Dậu âm / Càn-Khôn-Cấn-Tốn
 * dương; Nhân nguyên Ất-Tân-Đinh-Quý âm / Dần-Thân-Tỵ-Hợi dương; Địa nguyên
 * Thìn-Tuất-Sửu-Mùi âm / Giáp-Canh-Nhâm-Bính dương.
 */
export const MOUNTAINS: ReadonlyArray<Mountain> = [
  { name: 'Tý', han: '子', centerDeg: 0, gua: 'Khảm', yuanLong: 1, yang: false },
  { name: 'Quý', han: '癸', centerDeg: 15, gua: 'Khảm', yuanLong: 2, yang: false },
  { name: 'Sửu', han: '丑', centerDeg: 30, gua: 'Cấn', yuanLong: 0, yang: false },
  { name: 'Cấn', han: '艮', centerDeg: 45, gua: 'Cấn', yuanLong: 1, yang: true },
  { name: 'Dần', han: '寅', centerDeg: 60, gua: 'Cấn', yuanLong: 2, yang: true },
  { name: 'Giáp', han: '甲', centerDeg: 75, gua: 'Chấn', yuanLong: 0, yang: true },
  { name: 'Mão', han: '卯', centerDeg: 90, gua: 'Chấn', yuanLong: 1, yang: false },
  { name: 'Ất', han: '乙', centerDeg: 105, gua: 'Chấn', yuanLong: 2, yang: false },
  { name: 'Thìn', han: '辰', centerDeg: 120, gua: 'Tốn', yuanLong: 0, yang: false },
  { name: 'Tốn', han: '巽', centerDeg: 135, gua: 'Tốn', yuanLong: 1, yang: true },
  { name: 'Tỵ', han: '巳', centerDeg: 150, gua: 'Tốn', yuanLong: 2, yang: true },
  { name: 'Bính', han: '丙', centerDeg: 165, gua: 'Ly', yuanLong: 0, yang: true },
  { name: 'Ngọ', han: '午', centerDeg: 180, gua: 'Ly', yuanLong: 1, yang: false },
  { name: 'Đinh', han: '丁', centerDeg: 195, gua: 'Ly', yuanLong: 2, yang: false },
  { name: 'Mùi', han: '未', centerDeg: 210, gua: 'Khôn', yuanLong: 0, yang: false },
  { name: 'Khôn', han: '坤', centerDeg: 225, gua: 'Khôn', yuanLong: 1, yang: true },
  { name: 'Thân', han: '申', centerDeg: 240, gua: 'Khôn', yuanLong: 2, yang: true },
  { name: 'Canh', han: '庚', centerDeg: 255, gua: 'Đoài', yuanLong: 0, yang: true },
  { name: 'Dậu', han: '酉', centerDeg: 270, gua: 'Đoài', yuanLong: 1, yang: false },
  { name: 'Tân', han: '辛', centerDeg: 285, gua: 'Đoài', yuanLong: 2, yang: false },
  { name: 'Tuất', han: '戌', centerDeg: 300, gua: 'Càn', yuanLong: 0, yang: false },
  { name: 'Càn', han: '乾', centerDeg: 315, gua: 'Càn', yuanLong: 1, yang: true },
  { name: 'Hợi', han: '亥', centerDeg: 330, gua: 'Càn', yuanLong: 2, yang: true },
  { name: 'Nhâm', han: '壬', centerDeg: 345, gua: 'Khảm', yuanLong: 0, yang: true },
];

const MOUNTAIN_BY_NAME = new Map(MOUNTAINS.map((m) => [m.name, m]));

export interface Palace {
  /** Vị trí ô lưới 3×3 (row-major 0..8): trên Nam, dưới Bắc, trái Đông, phải Tây. */
  grid: number;
  /** Quái cung. */
  gua: string;
  /** Phương vị. */
  dir: string;
  /** Số Lạc Thư (địa bàn cố định). */
  luoshu: number;
}

/**
 * 9 cung theo quy ước bàn Huyền Không (trên Nam, dưới Bắc, trái Đông, phải Tây):
 *   Tốn(4)  Ly(9)   Khôn(2)
 *   Chấn(3) Trung(5) Đoài(7)
 *   Cấn(8)  Khảm(1) Càn(6)
 */
export const PALACES: ReadonlyArray<Palace> = [
  { grid: 0, gua: 'Tốn', dir: 'Đông Nam', luoshu: 4 },
  { grid: 1, gua: 'Ly', dir: 'Nam', luoshu: 9 },
  { grid: 2, gua: 'Khôn', dir: 'Tây Nam', luoshu: 2 },
  { grid: 3, gua: 'Chấn', dir: 'Đông', luoshu: 3 },
  { grid: 4, gua: 'Trung', dir: 'Trung cung', luoshu: 5 },
  { grid: 5, gua: 'Đoài', dir: 'Tây', luoshu: 7 },
  { grid: 6, gua: 'Cấn', dir: 'Đông Bắc', luoshu: 8 },
  { grid: 7, gua: 'Khảm', dir: 'Bắc', luoshu: 1 },
  { grid: 8, gua: 'Càn', dir: 'Tây Bắc', luoshu: 6 },
];

const GUA_TO_GRID = new Map(PALACES.map((p) => [p.gua, p.grid]));

/** Số Lạc Thư → Hậu Thiên Quái (5 không có quái). */
const NUM_TO_GUA: Record<number, string> = {
  1: 'Khảm', 2: 'Khôn', 3: 'Chấn', 4: 'Tốn', 6: 'Càn', 7: 'Đoài', 8: 'Cấn', 9: 'Ly',
};

/** Sơn cùng quái + cùng tam-nguyên-long (để định thuận/nghịch sơn-hướng tinh). */
function mountainOf(gua: string, yuanLong: YuanLong): Mountain | undefined {
  return MOUNTAINS.find((m) => m.gua === gua && m.yuanLong === yuanLong);
}

/**
 * Phi bố: số `center` nhập trung, `forward=true` phi thuận / false phi nghịch.
 * Trả mảng 9 sao theo grid 0..8.
 * Thuận: trung→6→7→8→9→1→2→3→4 (theo thứ tự số Lạc Thư của cung). Nghịch: ngược lại.
 */
export function flyPlate(center: number, forward: boolean): number[] {
  const plate = new Array<number>(9);
  for (const p of PALACES) {
    const offset = mod9(p.luoshu - 5);
    plate[p.grid] = forward ? mod9(center - 1 + offset) + 1 : mod9(center - 1 - offset) + 1;
  }
  return plate;
}

/** Hướng = đối cung của tọa (+180°). */
export function facingOf(sitting: Mountain): Mountain {
  const deg = (sitting.centerDeg + 180) % 360;
  return MOUNTAINS.find((m) => m.centerDeg === deg)!;
}

/**
 * Định thuận/nghịch: sao bàn vận `centerStar` nhập trung ứng một quái; lấy sơn cùng
 * tam-nguyên-long với tọa/hướng trong quái đó, xét âm-dương Huyền Không. center=5 vô
 * quái → mượn âm-dương của chính sơn tọa/hướng. Dương → thuận (true), Âm → nghịch.
 */
function swingForward(centerStar: number, origin: Mountain): boolean {
  if (centerStar === 5) return origin.yang;
  const gua = NUM_TO_GUA[centerStar];
  if (!gua) return origin.yang;
  return mountainOf(gua, origin.yuanLong)?.yang ?? origin.yang;
}

export type FlyingStarPattern =
  | 'vuong-son-vuong-huong'
  | 'thuong-son-ha-thuy'
  | 'song-tinh-dao-huong'
  | 'song-tinh-dao-toa'
  | 'thong-thuong'
  | 'ngu-van';

export interface PalaceStars {
  palace: Palace;
  /** Vận tinh (bàn vận). */
  van: number;
  /** Sơn tinh (bàn sơn). */
  son: number;
  /** Hướng tinh (bàn hướng). */
  huong: number;
}

export interface FlyingStarChart {
  yun: number;
  sitting: Mountain;
  facing: Mountain;
  vanPlate: number[];
  sonPlate: number[];
  huongPlate: number[];
  sonForward: boolean;
  huongForward: boolean;
  pattern: FlyingStarPattern;
  patternLabel: string;
  /** 1 = cát, 0 = bình/trung, -1 = hung. */
  patternLuck: number;
  /** Cờ đặc biệt: hợp thập (sơn/hướng), phụ mẫu tam ban quái. */
  notes: string[];
  palaces: PalaceStars[];
}

const PATTERN_LABEL: Record<FlyingStarPattern, string> = {
  'vuong-son-vuong-huong': 'Vượng sơn Vượng hướng (旺山旺向)',
  'thuong-son-ha-thuy': 'Thượng sơn Hạ thủy (上山下水)',
  'song-tinh-dao-huong': 'Song tinh đáo hướng (雙星到向)',
  'song-tinh-dao-toa': 'Song tinh đáo tọa (雙星到坐)',
  'thong-thuong': 'Cục thông thường',
  'ngu-van': 'Ngũ vận',
};

function judgePattern(
  yun: number, son: number[], huong: number[], sitGrid: number, faceGrid: number,
): { pattern: FlyingStarPattern; luck: number } {
  if (yun === 5) return { pattern: 'ngu-van', luck: 0 };
  const sSon = son[sitGrid]!, sHuong = huong[sitGrid]!;
  const fSon = son[faceGrid]!, fHuong = huong[faceGrid]!;
  if (sSon === yun && fHuong === yun) return { pattern: 'vuong-son-vuong-huong', luck: 1 };
  if (sHuong === yun && fSon === yun) return { pattern: 'thuong-son-ha-thuy', luck: -1 };
  if (fSon === yun && fHuong === yun) return { pattern: 'song-tinh-dao-huong', luck: 0 };
  if (sSon === yun && sHuong === yun) return { pattern: 'song-tinh-dao-toa', luck: 0 };
  return { pattern: 'thong-thuong', luck: 0 };
}

function detectNotes(van: number[], son: number[], huong: number[]): string[] {
  const notes: string[] = [];
  let sonHopThap = true, huongHopThap = true;
  for (let g = 0; g < 9; g++) {
    if (van[g]! + son[g]! !== 10) sonHopThap = false;
    if (van[g]! + huong[g]! !== 10) huongHopThap = false;
  }
  if (sonHopThap) notes.push('Bàn sơn hợp thập với bàn vận — chủ đinh (người) vượng.');
  if (huongHopThap) notes.push('Bàn hướng hợp thập với bàn vận — chủ tài (của) vượng.');

  const triads = [new Set([1, 4, 7]), new Set([2, 5, 8]), new Set([3, 6, 9])];
  let sanBan = true;
  for (let g = 0; g < 9; g++) {
    const trio = new Set([van[g]!, son[g]!, huong[g]!]);
    if (!triads.some((t) => trio.size === 3 && [...trio].every((x) => t.has(x)))) { sanBan = false; break; }
  }
  if (sanBan) notes.push('Phụ mẫu tam ban quái (1-4-7 / 2-5-8 / 3-6-9) — cách quý hiếm, chủ thông suốt.');
  return notes;
}

/**
 * An bàn Phi Tinh cho một trạch.
 * @param yun Nguyên vận 1..9 (Bát vận = 2004–2023, Cửu vận = 2024–2043).
 * @param sittingName Tên sơn TỌA (1 trong 24 sơn). Hướng tự suy = đối cung.
 */
export function computeFlyingStarChart(yun: number, sittingName: string): FlyingStarChart {
  const sitting = MOUNTAIN_BY_NAME.get(sittingName) ?? MOUNTAINS[0]!;
  const facing = facingOf(sitting);

  const vanPlate = flyPlate(yun, true);
  const sitGrid = GUA_TO_GRID.get(sitting.gua)!;
  const faceGrid = GUA_TO_GRID.get(facing.gua)!;

  const sonCenter = vanPlate[sitGrid]!; // sao bàn vận tại cung tọa nhập trung → bàn sơn
  const huongCenter = vanPlate[faceGrid]!; // sao bàn vận tại cung hướng nhập trung → bàn hướng
  const sonForward = swingForward(sonCenter, sitting);
  const huongForward = swingForward(huongCenter, facing);

  const sonPlate = flyPlate(sonCenter, sonForward);
  const huongPlate = flyPlate(huongCenter, huongForward);

  const { pattern, luck } = judgePattern(yun, sonPlate, huongPlate, sitGrid, faceGrid);

  return {
    yun,
    sitting,
    facing,
    vanPlate,
    sonPlate,
    huongPlate,
    sonForward,
    huongForward,
    pattern,
    patternLabel: PATTERN_LABEL[pattern],
    patternLuck: luck,
    notes: detectNotes(vanPlate, sonPlate, huongPlate),
    palaces: PALACES.map((p) => ({
      palace: p,
      van: vanPlate[p.grid]!,
      son: sonPlate[p.grid]!,
      huong: huongPlate[p.grid]!,
    })),
  };
}

/** Tên 24 sơn (cho bộ chọn). */
export function mountainNames(): string[] {
  return MOUNTAINS.map((m) => m.name);
}

/** Nguyên vận theo năm dương lịch (1864–2043; ngoài dải → cận điểm). */
export function yunOfYear(year: number): number {
  if (year < 1864) return 1;
  if (year > 2043) return 9;
  return Math.floor((year - 1864) / 20) + 1;
}
