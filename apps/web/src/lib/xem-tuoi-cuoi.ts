/**
 * Engine "Xem tuổi cưới" — kiểm tra một NĂM dự định cưới theo năm sinh:
 * Kim Lâu (tuổi mụ chia 9), Tam Tai (nhóm tam hợp), Lục Xung / năm tuổi.
 *
 * Công thức mirror đúng worker backend (tools/lich-van-nien.ts) để hai nơi
 * không nói hai kiểu: Kim Lâu dư 1/3/6/8; Tam Tai theo nhóm tam hợp năm sinh;
 * mốc chi năm tính theo (year - 4) % 12 (1900 = Tý).
 *
 * Brand voice: đây là tập tục dân gian được tính minh bạch để THAM KHẢO,
 * không phải lời phán — không bán "giải hạn".
 */

export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const;
export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;

export type Can = (typeof CAN)[number];
export type Chi = (typeof CHI)[number];

export const ANIMAL_BY_CHI: Record<Chi, string> = {
  'Tý': 'Chuột', 'Sửu': 'Trâu', 'Dần': 'Hổ', 'Mão': 'Mèo', 'Thìn': 'Rồng', 'Tỵ': 'Rắn',
  'Ngọ': 'Ngựa', 'Mùi': 'Dê', 'Thân': 'Khỉ', 'Dậu': 'Gà', 'Tuất': 'Chó', 'Hợi': 'Lợn',
};

export interface CanChi {
  can: Can;
  chi: Chi;
  /** Ví dụ "Canh Ngọ". */
  name: string;
  animal: string;
}

export function canChiOfYear(year: number): CanChi {
  // Modulo luôn cho chỉ số 0–9 / 0–11 nên phần tử chắc chắn tồn tại.
  const can = CAN[((year - 4) % 10 + 10) % 10] as Can;
  const chi = CHI[((year - 4) % 12 + 12) % 12] as Chi;
  return { can, chi, name: `${can} ${chi}`, animal: ANIMAL_BY_CHI[chi] };
}

// ── Kim Lâu ─────────────────────────────────────────────────────────
// Tuổi mụ chia 9, dư 1/3/6/8 → phạm. Theo tục, cưới hỏi xét chủ yếu
// tuổi mụ của CÔ DÂU.

export type KimLauType = 'Kim Lâu Thân' | 'Kim Lâu Thê' | 'Kim Lâu Tử' | 'Kim Lâu Lục Súc';

const KIM_LAU_BY_REMAINDER: Record<number, { type: KimLauType; note: string }> = {
  1: { type: 'Kim Lâu Thân', note: 'kiêng vì lo ảnh hưởng chính bản thân' },
  3: { type: 'Kim Lâu Thê', note: 'kiêng vì lo ảnh hưởng vợ/chồng' },
  6: { type: 'Kim Lâu Tử', note: 'kiêng vì lo ảnh hưởng đường con cái' },
  8: { type: 'Kim Lâu Lục Súc', note: 'kiêng vì lo ảnh hưởng tài sản, vật nuôi' },
};

export interface KimLauResult {
  /** Tuổi mụ = năm xem − năm sinh + 1. */
  ageMu: number;
  /** Số dư tuổi mụ chia 9 (0–8). */
  remainder: number;
  /** undefined = không phạm. */
  type?: KimLauType;
  note?: string;
}

export function checkKimLau(birthYear: number, targetYear: number): KimLauResult {
  const ageMu = targetYear - birthYear + 1;
  const remainder = ageMu % 9;
  const hit = KIM_LAU_BY_REMAINDER[remainder];
  return { ageMu, remainder, type: hit?.type, note: hit?.note };
}

// ── Tam Tai ─────────────────────────────────────────────────────────
// Mỗi nhóm tam hợp năm sinh gặp Tam Tai vào 3 năm liền nhau cố định.

export const TAM_TAI_YEARS: Record<Chi, Chi[]> = {
  'Thân': ['Dần', 'Mão', 'Thìn'], 'Tý': ['Dần', 'Mão', 'Thìn'], 'Thìn': ['Dần', 'Mão', 'Thìn'],
  'Dần': ['Thân', 'Dậu', 'Tuất'], 'Ngọ': ['Thân', 'Dậu', 'Tuất'], 'Tuất': ['Thân', 'Dậu', 'Tuất'],
  'Tỵ': ['Hợi', 'Tý', 'Sửu'], 'Dậu': ['Hợi', 'Tý', 'Sửu'], 'Sửu': ['Hợi', 'Tý', 'Sửu'],
  'Hợi': ['Tỵ', 'Ngọ', 'Mùi'], 'Mão': ['Tỵ', 'Ngọ', 'Mùi'], 'Mùi': ['Tỵ', 'Ngọ', 'Mùi'],
};

export interface TamTaiResult {
  isTamTai: boolean;
  birthChi: Chi;
  yearChi: Chi;
  /** 3 chi năm Tam Tai của nhóm tuổi này. */
  tamTaiChis: Chi[];
}

export function checkTamTai(birthYear: number, targetYear: number): TamTaiResult {
  const birthChi = canChiOfYear(birthYear).chi;
  const yearChi = canChiOfYear(targetYear).chi;
  const tamTaiChis = TAM_TAI_YEARS[birthChi];
  return { isTamTai: tamTaiChis.includes(yearChi), birthChi, yearChi, tamTaiChis };
}

// ── Lục Xung năm / năm tuổi ─────────────────────────────────────────

export const LUC_XUNG: Record<Chi, Chi> = {
  'Tý': 'Ngọ', 'Ngọ': 'Tý',
  'Sửu': 'Mùi', 'Mùi': 'Sửu',
  'Dần': 'Thân', 'Thân': 'Dần',
  'Mão': 'Dậu', 'Dậu': 'Mão',
  'Thìn': 'Tuất', 'Tuất': 'Thìn',
  'Tỵ': 'Hợi', 'Hợi': 'Tỵ',
};

export interface XungNamResult {
  /** Chi năm xem lục xung với chi năm sinh. */
  isXung: boolean;
  /** Năm xem trùng chi năm sinh ("năm tuổi") — lưu ý nhẹ, không tính là phạm. */
  isNamTuoi: boolean;
  birthChi: Chi;
  yearChi: Chi;
}

export function checkXungNam(birthYear: number, targetYear: number): XungNamResult {
  const birthChi = canChiOfYear(birthYear).chi;
  const yearChi = canChiOfYear(targetYear).chi;
  return {
    isXung: LUC_XUNG[birthChi] === yearChi,
    isNamTuoi: birthChi === yearChi,
    birthChi,
    yearChi,
  };
}

// ── Tổng hợp cho một năm cưới ───────────────────────────────────────

export type WeddingVerdict = 'thuan' | 'can-nhac' | 'pham';

export const VERDICT_LABEL: Record<WeddingVerdict, string> = {
  'thuan': 'Không phạm hạn thường xét',
  'can-nhac': 'Cần cân nhắc',
  'pham': 'Phạm hạn theo quan niệm dân gian',
};

export interface WeddingYearResult {
  birthYear: number;
  birthCanChi: CanChi;
  targetYear: number;
  targetCanChi: CanChi;
  kimLau: KimLauResult;
  tamTai: TamTaiResult;
  xung: XungNamResult;
  verdict: WeddingVerdict;
  /** Diễn giải từng kết luận, tiếng Việt thường. */
  reasons: string[];
}

/**
 * Kiểm tra một năm cưới cho một người. Theo tục: Kim Lâu xét chủ yếu tuổi
 * cô dâu; Tam Tai và xung năm xét được cho cả hai người.
 */
export function checkWeddingYear(birthYear: number, targetYear: number): WeddingYearResult {
  const kimLau = checkKimLau(birthYear, targetYear);
  const tamTai = checkTamTai(birthYear, targetYear);
  const xung = checkXungNam(birthYear, targetYear);
  const reasons: string[] = [];

  if (kimLau.type) {
    reasons.push(
      `Tuổi mụ ${kimLau.ageMu} chia 9 dư ${kimLau.remainder} → phạm ${kimLau.type} (${KIM_LAU_BY_REMAINDER[kimLau.remainder]?.note}).`,
    );
  } else {
    reasons.push(`Tuổi mụ ${kimLau.ageMu} chia 9 dư ${kimLau.remainder} → không phạm Kim Lâu.`);
  }

  if (tamTai.isTamTai) {
    reasons.push(
      `Năm ${tamTai.yearChi} nằm trong 3 năm Tam Tai (${tamTai.tamTaiChis.join(', ')}) của nhóm tuổi ${tamTai.birthChi}.`,
    );
  } else {
    reasons.push(`Năm ${tamTai.yearChi} không thuộc 3 năm Tam Tai (${tamTai.tamTaiChis.join(', ')}) của tuổi ${tamTai.birthChi}.`);
  }

  if (xung.isXung) {
    reasons.push(`Chi năm ${xung.yearChi} lục xung với chi tuổi ${xung.birthChi} — nhiều nhà xem là điểm trừ.`);
  } else if (xung.isNamTuoi) {
    reasons.push(`Năm ${xung.yearChi} trùng chi tuổi (năm tuổi) — chỉ là lưu ý nhẹ, không phải hạn.`);
  } else {
    reasons.push(`Chi năm ${xung.yearChi} không xung với chi tuổi ${xung.birthChi}.`);
  }

  const verdict: WeddingVerdict = kimLau.type || tamTai.isTamTai ? 'pham' : xung.isXung ? 'can-nhac' : 'thuan';

  return {
    birthYear,
    birthCanChi: canChiOfYear(birthYear),
    targetYear,
    targetCanChi: canChiOfYear(targetYear),
    kimLau,
    tamTai,
    xung,
    verdict,
    reasons,
  };
}

/** Quét một dải năm liên tiếp (vd 2026–2031) cho cùng một năm sinh. */
export function scanYears(birthYear: number, fromYear: number, count: number): WeddingYearResult[] {
  return Array.from({ length: count }, (_, i) => checkWeddingYear(birthYear, fromYear + i));
}

/** Các năm "thuận" gần nhất tính từ fromYear (tối đa `limit` năm, quét 8 năm). */
export function goodYearsFrom(birthYear: number, fromYear: number, limit = 3): number[] {
  return scanYears(birthYear, fromYear, 8)
    .filter((r) => r.verdict === 'thuan')
    .slice(0, limit)
    .map((r) => r.targetYear);
}
