/**
 * Engine "Xem tuổi khai trương / mở hàng đầu năm" — kiểm tra một NĂM dự định
 * khai trương theo năm sinh chủ (người đứng tên kinh doanh).
 *
 * Tục lệ khai trương KHÁC làm nhà / cưới hỏi:
 *  - Hạn chính dân gian xét cho việc KHỞI SỰ KINH DOANH là **Tam Tai** (3 năm
 *    liên tiếp của mỗi nhóm tam hợp — kiêng làm việc lớn, mở mang) và **xung
 *    Thái Tuế** (chi năm lục xung chi tuổi — năm "khắc" tuổi).
 *  - **Kim Lâu** và **Hoang Ốc** vốn dành cho XÂY NHÀ / CƯỚI HỎI (Kim Lâu Thê –
 *    Tử – Lục Súc – Bản Mệnh; Hoang Ốc là vòng tốt/xấu của việc dựng nhà). Khai
 *    trương dân gian KHÔNG xét hai hạn này → engine cố ý LOẠI để khỏi doạ sai,
 *    và trang nói rõ lý do (minh bạch "nói có sách", giống trang xem tuổi cưới
 *    đã loại Hoang Ốc).
 *
 * TÁI DÙNG primitives từ lib/xem-tuoi-cuoi.ts (Tam Tai / xung năm / can chi) —
 * cùng một công thức, không chép lại bảng tra.
 *
 * Brand voice: tập tục được tính minh bạch để THAM KHẢO, không phải lời phán —
 * không doạ, không bán "giải hạn". Chọn NGÀY giờ khai trương là tầng khác
 * (hoàng đạo) → trang link sang /xem-ngay.
 */

import {
  canChiOfYear,
  checkTamTai,
  checkXungNam,
  type CanChi,
  type TamTaiResult,
  type XungNamResult,
} from './xem-tuoi-cuoi';

export { canChiOfYear, TAM_TAI_YEARS } from './xem-tuoi-cuoi';
export type { CanChi, TamTaiResult, XungNamResult } from './xem-tuoi-cuoi';

// ── Tổng hợp cho một năm khai trương ────────────────────────────────

export type OpeningVerdict = 'thuan' | 'can-nhac' | 'pham';

export const OPENING_VERDICT_LABEL: Record<OpeningVerdict, string> = {
  'thuan': 'Hợp tuổi khai trương — không vướng Tam Tai hay xung tuổi',
  'can-nhac': 'Cần cân nhắc — năm xung tuổi',
  'pham': 'Vướng Tam Tai — dân gian kiêng khởi sự lớn',
};

export interface OpeningYearResult {
  birthYear: number;
  birthCanChi: CanChi;
  targetYear: number;
  targetCanChi: CanChi;
  tamTai: TamTaiResult;
  xung: XungNamResult;
  verdict: OpeningVerdict;
  /** Diễn giải từng kết luận, tiếng Việt thường. */
  reasons: string[];
}

/**
 * Kiểm tra một năm khai trương cho chủ kinh doanh. Theo tục: xét tuổi người
 * đứng tên; vướng Tam Tai = "kiêng", chỉ xung tuổi = "cân nhắc", sạch =
 * "hợp tuổi". KHÔNG xét Kim Lâu / Hoang Ốc (dành cho xây nhà / cưới).
 */
export function checkOpeningYear(birthYear: number, targetYear: number): OpeningYearResult {
  const tamTai = checkTamTai(birthYear, targetYear);
  const xung = checkXungNam(birthYear, targetYear);
  const reasons: string[] = [];

  if (tamTai.isTamTai) {
    reasons.push(
      `Năm ${tamTai.yearChi} nằm trong 3 năm Tam Tai (${tamTai.tamTaiChis.join(', ')}) của nhóm tuổi ${tamTai.birthChi} — dân gian kiêng khởi sự, mở mang trong 3 năm này.`,
    );
  } else {
    reasons.push(
      `Năm ${tamTai.yearChi} không thuộc 3 năm Tam Tai (${tamTai.tamTaiChis.join(', ')}) của tuổi ${tamTai.birthChi}.`,
    );
  }

  if (xung.isXung) {
    reasons.push(
      `Chi năm ${xung.yearChi} lục xung với chi tuổi ${xung.birthChi} (năm "khắc" tuổi) — nhiều người tránh mở hàng năm này.`,
    );
  } else if (xung.isNamTuoi) {
    reasons.push(
      `Năm ${xung.yearChi} trùng chi tuổi (năm tuổi / Thái Tuế) — chỉ là lưu ý nhẹ, không phải hạn cấm khai trương.`,
    );
  } else {
    reasons.push(`Chi năm ${xung.yearChi} không xung với chi tuổi ${xung.birthChi}.`);
  }

  reasons.push(
    'Khai trương không xét Kim Lâu / Hoang Ốc — hai hạn đó dành cho việc xây nhà và cưới hỏi.',
  );

  const verdict: OpeningVerdict = tamTai.isTamTai ? 'pham' : xung.isXung ? 'can-nhac' : 'thuan';

  return {
    birthYear,
    birthCanChi: canChiOfYear(birthYear),
    targetYear,
    targetCanChi: canChiOfYear(targetYear),
    tamTai,
    xung,
    verdict,
    reasons,
  };
}

/** Quét một dải năm liên tiếp cho cùng một năm sinh. */
export function scanOpeningYears(birthYear: number, fromYear: number, count: number): OpeningYearResult[] {
  return Array.from({ length: count }, (_, i) => checkOpeningYear(birthYear, fromYear + i));
}

/**
 * Các năm "hợp tuổi khai trương" gần nhất tính từ fromYear. Khai trương chỉ
 * xét Tam Tai (3/12 năm) + xung (1/12) nên năm hợp khá nhiều — quét 8 năm là đủ.
 */
export function goodOpeningYearsFrom(birthYear: number, fromYear: number, limit = 4): number[] {
  return scanOpeningYears(birthYear, fromYear, 8)
    .filter((r) => r.verdict === 'thuan')
    .slice(0, limit)
    .map((r) => r.targetYear);
}
