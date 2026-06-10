/**
 * Engine "Xem tuổi làm nhà" — kiểm tra một NĂM dự định xây/sửa nhà theo năm
 * sinh chủ nhà: Kim Lâu (tuổi mụ chia 9), Hoang Ốc (tuổi mụ chia 6), Tam Tai
 * (nhóm tam hợp) + lưu ý chi năm xung tuổi.
 *
 * TÁI DÙNG primitives từ lib/xem-tuoi-cuoi.ts (Kim Lâu / Tam Tai / xung năm —
 * cùng một công thức, không chép lại bảng tra). Hoang Ốc mirror đúng worker
 * backend (tools/lich-van-nien.ts): tuổi mụ chia 6, dư 1=Nhất Cát, 2=Nhì Nghi,
 * 3=Tam Địa Sát, 4=Tứ Tấn Tài, 5=Ngũ Thọ Tử, 0/6=Lục Hoang Ốc; phạm 3/5/6.
 *
 * Brand voice: tập tục dân gian được tính minh bạch để THAM KHẢO, không phải
 * lời phán — không doạ, không bán "giải hạn".
 */

import {
  canChiOfYear,
  checkKimLau,
  checkTamTai,
  checkXungNam,
  type CanChi,
  type KimLauResult,
  type TamTaiResult,
  type XungNamResult,
} from './xem-tuoi-cuoi';

// Re-export cho trang dùng một đầu mối, khỏi import chéo hai lib.
export { canChiOfYear, TAM_TAI_YEARS } from './xem-tuoi-cuoi';
export type { CanChi, KimLauResult, TamTaiResult, XungNamResult } from './xem-tuoi-cuoi';

// ── Hoang Ốc ────────────────────────────────────────────────────────
// Tuổi mụ chia 6 (dư 0 tính là 6): 1=Nhất Cát, 2=Nhì Nghi, 3=Tam Địa Sát,
// 4=Tứ Tấn Tài, 5=Ngũ Thọ Tử, 6=Lục Hoang Ốc. Cung xấu: 3/5/6.

export type HoangOcCung =
  | 'Nhất Cát'
  | 'Nhì Nghi'
  | 'Tam Địa Sát'
  | 'Tứ Tấn Tài'
  | 'Ngũ Thọ Tử'
  | 'Lục Hoang Ốc';

const HOANG_OC_BY_STEP: Record<number, { cung: HoangOcCung; good: boolean; note: string }> = {
  1: { cung: 'Nhất Cát', good: true, note: 'cung tốt — khởi công được coi là thuận' },
  2: { cung: 'Nhì Nghi', good: true, note: 'cung tốt — chủ về thuận lợi, có lộc' },
  3: { cung: 'Tam Địa Sát', good: false, note: 'cung xấu — dân gian kiêng khởi công năm này' },
  4: { cung: 'Tứ Tấn Tài', good: true, note: 'cung tốt — chủ về tài lộc vào nhà' },
  5: { cung: 'Ngũ Thọ Tử', good: false, note: 'cung xấu — dân gian kiêng khởi công năm này' },
  6: { cung: 'Lục Hoang Ốc', good: false, note: 'cung xấu — dân gian kiêng khởi công năm này' },
};

export interface HoangOcResult {
  /** Tuổi mụ = năm xem − năm sinh + 1. */
  ageMu: number;
  /** Bước 1–6 trên vòng Hoang Ốc (tuổi mụ chia 6, dư 0 tính là 6). */
  step: number;
  cung: HoangOcCung;
  /** true = rơi cung xấu (Tam Địa Sát / Ngũ Thọ Tử / Lục Hoang Ốc). */
  isPham: boolean;
  note: string;
}

export function checkHoangOc(birthYear: number, targetYear: number): HoangOcResult {
  const ageMu = targetYear - birthYear + 1;
  const step = ageMu % 6 || 6;
  // step luôn 1–6 nên phần tử chắc chắn tồn tại.
  const m = HOANG_OC_BY_STEP[step] as { cung: HoangOcCung; good: boolean; note: string };
  return { ageMu, step, cung: m.cung, isPham: !m.good, note: m.note };
}

// ── Tổng hợp cho một năm làm nhà ────────────────────────────────────

export type BuildVerdict = 'thuan' | 'can-nhac' | 'pham';

export const BUILD_VERDICT_LABEL: Record<BuildVerdict, string> = {
  'thuan': 'Được tuổi — không phạm hạn thường xét',
  'can-nhac': 'Cần cân nhắc',
  'pham': 'Phạm hạn theo quan niệm dân gian',
};

export interface BuildYearResult {
  birthYear: number;
  birthCanChi: CanChi;
  targetYear: number;
  targetCanChi: CanChi;
  kimLau: KimLauResult;
  hoangOc: HoangOcResult;
  tamTai: TamTaiResult;
  xung: XungNamResult;
  verdict: BuildVerdict;
  /** Diễn giải từng kết luận, tiếng Việt thường. */
  reasons: string[];
}

/**
 * Kiểm tra một năm xây/sửa nhà cho chủ nhà. Theo tục: xét tuổi mụ của người
 * đứng tên khởi công (thường là trụ cột gia đình); phạm cả 3 hạn chính
 * (Kim Lâu, Hoang Ốc, Tam Tai) mới gọi là "không được tuổi".
 */
export function checkBuildYear(birthYear: number, targetYear: number): BuildYearResult {
  const kimLau = checkKimLau(birthYear, targetYear);
  const hoangOc = checkHoangOc(birthYear, targetYear);
  const tamTai = checkTamTai(birthYear, targetYear);
  const xung = checkXungNam(birthYear, targetYear);
  const reasons: string[] = [];

  if (kimLau.type) {
    reasons.push(
      `Tuổi mụ ${kimLau.ageMu} chia 9 dư ${kimLau.remainder} → phạm ${kimLau.type} (${kimLau.note}).`,
    );
  } else {
    reasons.push(`Tuổi mụ ${kimLau.ageMu} chia 9 dư ${kimLau.remainder} → không phạm Kim Lâu.`);
  }

  reasons.push(
    `Tuổi mụ ${hoangOc.ageMu} đếm vòng Hoang Ốc rơi cung ${hoangOc.cung} (bước ${hoangOc.step}/6) → ${
      hoangOc.isPham ? `phạm Hoang Ốc — ${hoangOc.note}` : `không phạm — ${hoangOc.note}`
    }.`,
  );

  if (tamTai.isTamTai) {
    reasons.push(
      `Năm ${tamTai.yearChi} nằm trong 3 năm Tam Tai (${tamTai.tamTaiChis.join(', ')}) của nhóm tuổi ${tamTai.birthChi}.`,
    );
  } else {
    reasons.push(
      `Năm ${tamTai.yearChi} không thuộc 3 năm Tam Tai (${tamTai.tamTaiChis.join(', ')}) của tuổi ${tamTai.birthChi}.`,
    );
  }

  if (xung.isXung) {
    reasons.push(`Chi năm ${xung.yearChi} lục xung với chi tuổi ${xung.birthChi} — nhiều nhà xem là điểm trừ.`);
  } else if (xung.isNamTuoi) {
    reasons.push(`Năm ${xung.yearChi} trùng chi tuổi (năm tuổi) — chỉ là lưu ý nhẹ, không phải hạn.`);
  } else {
    reasons.push(`Chi năm ${xung.yearChi} không xung với chi tuổi ${xung.birthChi}.`);
  }

  const verdict: BuildVerdict =
    kimLau.type || hoangOc.isPham || tamTai.isTamTai ? 'pham' : xung.isXung ? 'can-nhac' : 'thuan';

  return {
    birthYear,
    birthCanChi: canChiOfYear(birthYear),
    targetYear,
    targetCanChi: canChiOfYear(targetYear),
    kimLau,
    hoangOc,
    tamTai,
    xung,
    verdict,
    reasons,
  };
}

/** Quét một dải năm liên tiếp (vd 2026–2031) cho cùng một năm sinh. */
export function scanBuildYears(birthYear: number, fromYear: number, count: number): BuildYearResult[] {
  return Array.from({ length: count }, (_, i) => checkBuildYear(birthYear, fromYear + i));
}

/**
 * Các năm "được tuổi" gần nhất tính từ fromYear. Làm nhà xét 3 hạn cùng lúc
 * nên năm thuận hiếm hơn cưới — quét 12 năm để chắc chắn tìm đủ.
 */
export function goodBuildYearsFrom(birthYear: number, fromYear: number, limit = 3): number[] {
  return scanBuildYears(birthYear, fromYear, 12)
    .filter((r) => r.verdict === 'thuan')
    .slice(0, limit)
    .map((r) => r.targetYear);
}
