/**
 * "Bằng Chứng" Phase 2 — locked, pre-registered tables for honest scoring.
 *
 * Per the grounding workflow (2 canon researchers + 1 Barnum skeptic), the verifier
 * is only legitimate (not cold-reading) if the category→palace map and the Tứ Hóa
 * stem table are FIXED IN ADVANCE — never chosen after seeing which palaces lit up.
 * These constants are that pre-registration. They must not be edited per-case.
 */

import type { LifeCategory } from './backtest-core';

/**
 * Fixed circular palace order (cung Mệnh first). Used for geometry: a palace's
 * xung chiếu (opposition) is +6, its tam hợp (trine) is +4 and +8. Matches the
 * order in reading-orchestrate/tuvi-facts.ts.
 */
export const PALACE_ORDER = [
  'Mệnh',
  'Phụ Mẫu',
  'Phúc Đức',
  'Điền Trạch',
  'Quan Lộc',
  'Nô Bộc',
  'Thiên Di',
  'Tật Ách',
  'Tài Bạch',
  'Tử Tức',
  'Phu Thê',
  'Huynh Đệ',
] as const;

export type PalaceName = (typeof PALACE_ORDER)[number];

/** Opposition (xung chiếu) palace — 6 houses across. */
export function oppositePalace(p: string): PalaceName | null {
  const i = PALACE_ORDER.indexOf(p as PalaceName);
  return i < 0 ? null : PALACE_ORDER[(i + 6) % 12]!;
}

/** Trine (tam hợp) palaces — +4 and +8 houses. */
export function trinePalaces(p: string): PalaceName[] {
  const i = PALACE_ORDER.indexOf(p as PalaceName);
  if (i < 0) return [];
  return [PALACE_ORDER[(i + 4) % 12]!, PALACE_ORDER[(i + 8) % 12]!];
}

/**
 * For "loss", the governing palace depends on WHAT was lost (no single loss
 * palace exists). The user must specify; we never pick after seeing the chart.
 */
export type LossTarget = 'parent' | 'spouse' | 'sibling' | 'child' | 'self' | 'money';

const LOSS_PALACE: Record<LossTarget, PalaceName> = {
  parent: 'Phụ Mẫu',
  spouse: 'Phu Thê',
  sibling: 'Huynh Đệ',
  child: 'Tử Tức',
  self: 'Tật Ách',
  money: 'Tài Bạch',
};

/**
 * Canonical category → governing palace(s). The FIRST entry is the primary
 * (locked) governing palace; the rest are classical secondaries (a secondary-only
 * activation never scores STRONG). Grounded in Tử Vi Đẩu Số 12-cung domains.
 */
const CATEGORY_PALACES: Record<Exclude<LifeCategory, 'loss'>, PalaceName[]> = {
  career: ['Quan Lộc', 'Mệnh', 'Tài Bạch'], // Mệnh-Tài-Quan career triangle
  wealth: ['Tài Bạch', 'Điền Trạch'], // Điền Trạch = treasury (kho tài)
  relationship: ['Phu Thê', 'Phúc Đức'],
  health: ['Tật Ách', 'Mệnh'],
  relocation: ['Thiên Di', 'Điền Trạch'],
  childbirth: ['Tử Tức', 'Phu Thê'],
  study: ['Quan Lộc', 'Phụ Mẫu'], // no dedicated study palace — medium confidence
};

/**
 * Resolve the governing palaces for an event. For "loss", lossTarget is required;
 * returns null if missing (the caller must ask the user what was lost).
 */
export function governingPalaces(
  category: LifeCategory,
  lossTarget?: LossTarget,
): PalaceName[] | null {
  if (category === 'loss') {
    if (!lossTarget) return null;
    return [LOSS_PALACE[lossTarget]];
  }
  return CATEGORY_PALACES[category];
}

/**
 * iztro's stem → Tứ Hóa table, in mutagen order [Hóa Lộc, Hóa Quyền, Hóa Khoa,
 * Hóa Kỵ]. EMPIRICALLY VERIFIED against the live engine for ALL TEN stems
 * (captured 2026-06-18 via /tools/tuvi-v2 horoscope; matches the standard
 * Bắc-phái table, including the spellings "Tả Phù" / "Hữu Bật"). Used to compute
 * the per-chart base rate analytically (which palaces a year's Tứ Hóa can land in,
 * across all 10 possible year-stems) WITHOUT extra engine calls.
 */
export const TU_HOA_BY_STEM: Record<string, [string, string, string, string]> = {
  Giáp: ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],
  Ất: ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],
  Bính: ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'],
  Đinh: ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],
  Mậu: ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],
  Kỷ: ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],
  Canh: ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],
  Tân: ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],
  Nhâm: ['Thiên Lương', 'Tử Vi', 'Tả Phù', 'Vũ Khúc'],
  Quý: ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'],
};

export const ALL_STEMS = Object.keys(TU_HOA_BY_STEM);

/** Valence of a Tứ Hóa transform: Lộc/Quyền/Khoa constructive, Kỵ afflictive. */
export function hoaValence(hoa: string): 'positive' | 'negative' {
  return hoa === 'Kỵ' ? 'negative' : 'positive';
}

/**
 * Categories with an inherent valence — used ONLY to flag a polarity mismatch
 * (e.g. a "loss" year showing pure Hóa Lộc and no Kỵ/sát is suspicious). Most
 * categories are valence-ambiguous (a "relationship" hit fits marriage OR divorce),
 * so they are intentionally absent here and never auto-downgraded on valence.
 */
export const CATEGORY_VALENCE: Partial<Record<LifeCategory, 'positive' | 'negative'>> = {
  loss: 'negative',
  childbirth: 'positive',
};

/** Human labels (vi-VN) for categories — for honest, plain UI copy. */
export const CATEGORY_LABEL: Record<LifeCategory, string> = {
  career: 'Sự nghiệp / công việc',
  wealth: 'Tài chính',
  relationship: 'Tình cảm / hôn nhân',
  health: 'Sức khỏe',
  relocation: 'Chuyển nhà / đi xa',
  loss: 'Mất mát',
  study: 'Học hành / thi cử',
  childbirth: 'Sinh con',
};
