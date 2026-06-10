/**
 * Tuổi xông đất đầu năm — ghép 3 nguồn sự thật có sẵn, KHÔNG viết lại bảng tra:
 *  - Hồ sơ năm âm (can chi / con giáp / nạp âm): yearProfile (lib/sinh-con).
 *  - Quan hệ 12 con giáp (Tam Hợp / Lục Hợp / Lục Xung / Lục Hại): relationOf
 *    (lib/hop-tuoi-pairs).
 *  - Vòng tương sinh – tương khắc ngũ hành: ELEMENTS (lib/dat-ten-ngu-hanh).
 *
 * Cách chấm CÔNG KHAI trên trang (3 lớp, mỗi lớp là quy tắc cổ điển kiểm chứng
 * được; trọng số là lựa chọn biên tập để XẾP HẠNG, hiển thị rõ):
 *  1. Chi người xông đất × chi NĂM (vd Đinh Mùi 2027): tam hợp/lục hợp +2 ·
 *     bình hoà 0 · lục hại −1 · trùng chi năm (dân gian gọi là phạm Thái Tuế)
 *     −2 · lục xung −3.
 *  2. Chi người xông đất × chi GIA CHỦ: tam hợp/lục hợp +2 · cùng tuổi/bình
 *     hoà 0 · lục hại −1 · lục xung −3.
 *  3. Mệnh nạp âm người xông đất × gia chủ: khách sinh chủ +2 · chủ sinh khách
 *     +1 · đồng mệnh 0 · chủ khắc khách −2 · khách khắc chủ −3.
 * Lớp nào chạm −3 (xung chi năm, xung gia chủ, khách khắc mệnh chủ) thì xếp
 * thẳng nhóm "nên cân nhắc" — đúng thói quen kiêng phổ biến.
 *
 * Định vị thương hiệu: gợi ý THAM KHẢO theo phong tục — người xông đất quý nhất
 * vẫn là người vui vẻ, xởi lởi, quý gia đình; không có chuyện "mời sai tuổi thì
 * xui cả năm".
 *
 * Quy ước dân gian: tuổi tính theo NĂM ÂM LỊCH. Người sinh tháng 1–2 dương
 * (trước Tết) có thể thuộc năm âm liền trước — trang dùng lib này phải nêu rõ.
 */

import { ELEMENTS } from './dat-ten-ngu-hanh';
import { relationOf, ZODIAC, type RelationKind, type Zodiac } from './hop-tuoi-pairs';
import { yearProfile, type RelationTone, type YearProfile } from './sinh-con';

/** Tết gần nhất kế tiếp: Đinh Mùi — mùng 1 = 06/02/2027 (verify-xong-dat.ts). */
export const DEFAULT_TARGET_YEAR = 2027;

/** Các năm có thể chọn trong checker (đều tính từ engine, không viết tay). */
export const TARGET_YEARS = [2027, 2028] as const;

export type XongDatTier = 'rat-hop' | 'hop' | 'binh' | 'nen-can-nhac';

export const TIER_META: Record<XongDatTier, { label: string; tone: RelationTone }> = {
  'rat-hop': { label: 'Rất hợp', tone: 'hop' },
  hop: { label: 'Hợp', tone: 'hop' },
  binh: { label: 'Bình hoà', tone: 'trung-tinh' },
  'nen-can-nhac': { label: 'Nên cân nhắc', tone: 'luu-y' },
};

export interface AxisResult {
  /** Điểm của lớp này theo thang công khai ở đầu file. */
  score: number;
  tone: RelationTone;
  /** Nhãn ngắn cho dòng tóm tắt, vd "Tam hợp với chi năm". */
  label: string;
  /** 1 câu diễn giải, giọng dung hoà. */
  text: string;
}

export interface XongDatResult {
  guest: YearProfile;
  host: YearProfile;
  target: YearProfile;
  /** Lớp 1 — chi người xông đất × chi năm. */
  chiNam: AxisResult;
  /** Lớp 2 — chi người xông đất × chi gia chủ. */
  chiChu: AxisResult;
  /** Lớp 3 — mệnh nạp âm người xông đất × gia chủ. */
  menhChu: AxisResult;
  total: number;
  tier: XongDatTier;
}

// --- Lớp 1: chi khách × chi năm ----------------------------------------------

const CHI_NAM_RULE: Record<RelationKind, { score: number; tone: RelationTone; label: string }> = {
  'tam-hop': { score: 2, tone: 'hop', label: 'Tam hợp với chi năm' },
  'luc-hop': { score: 2, tone: 'hop', label: 'Lục hợp với chi năm' },
  'binh-hoa': { score: 0, tone: 'trung-tinh', label: 'Bình hoà với chi năm' },
  'luc-hai': { score: -1, tone: 'luu-y', label: 'Lục hại với chi năm' },
  'dong-tuoi': { score: -2, tone: 'luu-y', label: 'Trùng chi năm (Thái Tuế)' },
  'luc-xung': { score: -3, tone: 'luu-y', label: 'Lục xung với chi năm' },
};

function chiNamAxis(guest: YearProfile, target: YearProfile): AxisResult {
  const kind = relationOf(guest.zodiac.slug, target.zodiac.slug);
  const rule = CHI_NAM_RULE[kind];
  const texts: Record<RelationKind, string> = {
    'tam-hop': `Tuổi ${guest.zodiac.ten} thuộc nhóm tam hợp với chi năm ${target.zodiac.ten} (${target.canChi}) — tín hiệu tham khảo đẹp cho việc mở đầu năm mới.`,
    'luc-hop': `Tuổi ${guest.zodiac.ten} tạo cặp lục hợp với chi năm ${target.zodiac.ten} (${target.canChi}) — quan niệm xưa xem là sự bổ trợ thuận cho năm mới.`,
    'binh-hoa': `Tuổi ${guest.zodiac.ten} bình hoà với chi năm ${target.zodiac.ten} — không hợp đặc biệt, cũng không thuộc nhóm cần lưu ý.`,
    'luc-hai': `Tuổi ${guest.zodiac.ten} thuộc cặp lục hại với chi năm ${target.zodiac.ten} — dân gian thường dè dặt hơn một chút; là lời nhắc tham khảo, không phải điềm xấu.`,
    'dong-tuoi': `Tuổi ${guest.zodiac.ten} trùng với chi năm ${target.canChi} — dân gian gọi là "phạm Thái Tuế" và thường tránh chọn xông đất; đây là tập tục tham khảo.`,
    'luc-xung': `Tuổi ${guest.zodiac.ten} thuộc cặp lục xung với chi năm ${target.zodiac.ten} — theo tục, tuổi xung chi năm thường không được chọn xông đất; tham khảo, không phải lời phán.`,
  };
  return { ...rule, text: texts[kind] };
}

// --- Lớp 2: chi khách × chi gia chủ ------------------------------------------

const CHI_CHU_RULE: Record<RelationKind, { score: number; tone: RelationTone; label: string }> = {
  'tam-hop': { score: 2, tone: 'hop', label: 'Tam hợp với gia chủ' },
  'luc-hop': { score: 2, tone: 'hop', label: 'Lục hợp với gia chủ' },
  'dong-tuoi': { score: 0, tone: 'trung-tinh', label: 'Cùng con giáp với gia chủ' },
  'binh-hoa': { score: 0, tone: 'trung-tinh', label: 'Bình hoà với gia chủ' },
  'luc-hai': { score: -1, tone: 'luu-y', label: 'Lục hại với gia chủ' },
  'luc-xung': { score: -3, tone: 'luu-y', label: 'Lục xung với gia chủ' },
};

function chiChuAxis(guest: YearProfile, host: YearProfile): AxisResult {
  const kind = relationOf(guest.zodiac.slug, host.zodiac.slug);
  const rule = CHI_CHU_RULE[kind];
  const texts: Record<RelationKind, string> = {
    'tam-hop': `Tuổi ${guest.zodiac.ten} cùng nhóm tam hợp với tuổi ${host.zodiac.ten} của gia chủ — hai tuổi "cùng nhịp", dễ mang lại cảm giác khởi đầu thuận.`,
    'luc-hop': `Tuổi ${guest.zodiac.ten} tạo cặp lục hợp với tuổi ${host.zodiac.ten} của gia chủ — quan niệm xưa xem là sự bổ trợ tốt.`,
    'dong-tuoi': `Người xông đất cùng tuổi ${guest.zodiac.ten} với gia chủ — dân gian xem là trung tính, "cùng tạng" nên dễ đồng cảm.`,
    'binh-hoa': `Tuổi ${guest.zodiac.ten} và tuổi ${host.zodiac.ten} của gia chủ ở thế bình hoà — không thuộc nhóm hợp đặc biệt, cũng không cần lưu ý.`,
    'luc-hai': `Tuổi ${guest.zodiac.ten} thuộc cặp lục hại với tuổi ${host.zodiac.ten} của gia chủ — lời nhắc tham khảo "lệch kênh đôi chút", không phải điềm xấu.`,
    'luc-xung': `Tuổi ${guest.zodiac.ten} thuộc cặp lục xung với tuổi ${host.zodiac.ten} của gia chủ — theo tục, đây là nhóm thường tránh khi chọn người xông đất; tham khảo, không phải lời phán.`,
  };
  return { ...rule, text: texts[kind] };
}

// --- Lớp 3: mệnh nạp âm khách × gia chủ --------------------------------------

function menhChuAxis(guest: YearProfile, host: YearProfile): AxisResult {
  const g = ELEMENTS[guest.element];
  const h = ELEMENTS[host.element];
  if (guest.element === host.element) {
    return {
      score: 0,
      tone: 'trung-tinh',
      label: `Đồng mệnh ${g.name}`,
      text: `Hai bên cùng mệnh ${g.name} — thế "tỵ hoà", dân gian xem là êm, không sinh không khắc.`,
    };
  }
  if (g.sinhTo === host.element) {
    return {
      score: 2,
      tone: 'hop',
      label: `Mệnh ${g.name} sinh mệnh ${h.name} của gia chủ`,
      text: `Mệnh ${g.name} (${guest.napAmName}) tương sinh cho mệnh ${h.name} của gia chủ — theo vòng ngũ hành, người xông đất "tiếp khí" cho nhà; đây là tín hiệu được chuộng nhất.`,
    };
  }
  if (h.sinhTo === guest.element) {
    return {
      score: 1,
      tone: 'hop',
      label: `Mệnh gia chủ sinh mệnh ${g.name}`,
      text: `Mệnh ${h.name} của gia chủ tương sinh cho mệnh ${g.name} của khách — vẫn là cặp tương sinh theo vòng ngũ hành, thuận hoà.`,
    };
  }
  if (g.khac === host.element) {
    return {
      score: -3,
      tone: 'luu-y',
      label: `Mệnh ${g.name} khắc mệnh ${h.name} của gia chủ`,
      text: `Theo vòng ngũ hành, mệnh ${g.name} khắc mệnh ${h.name} của gia chủ — dân gian thường tránh chọn; là quan niệm tham khảo, không phải lời phán về phúc hoạ.`,
    };
  }
  if (h.khac === guest.element) {
    return {
      score: -2,
      tone: 'luu-y',
      label: `Mệnh gia chủ khắc mệnh ${g.name}`,
      text: `Mệnh ${h.name} của gia chủ khắc mệnh ${g.name} của khách theo vòng ngũ hành — thế tương khắc, dân gian thường dè dặt; tham khảo có chừng mực.`,
    };
  }
  return {
    score: 0,
    tone: 'trung-tinh',
    label: 'Mệnh trung tính',
    text: `Mệnh ${g.name} và mệnh ${h.name} không sinh không khắc rõ rệt.`,
  };
}

// --- Đối chiếu tổng hợp -------------------------------------------------------

function tierOf(total: number, hardFlag: boolean): XongDatTier {
  if (hardFlag) return 'nen-can-nhac';
  if (total >= 4) return 'rat-hop';
  if (total >= 2) return 'hop';
  if (total >= 0) return 'binh';
  return 'nen-can-nhac';
}

/**
 * Đối chiếu 1 người xông đất (năm âm) với gia chủ (năm âm) cho Tết `targetYear`.
 * Null nếu năm ngoài 1900–2100.
 */
export function checkXongDat(
  guestYear: number,
  hostYear: number,
  targetYear: number = DEFAULT_TARGET_YEAR,
): XongDatResult | null {
  const guest = yearProfile(guestYear);
  const host = yearProfile(hostYear);
  const target = yearProfile(targetYear);
  if (!guest || !host || !target) return null;
  const chiNam = chiNamAxis(guest, target);
  const chiChu = chiChuAxis(guest, host);
  const menhChu = menhChuAxis(guest, host);
  const total = chiNam.score + chiChu.score + menhChu.score;
  const hardFlag = chiNam.score <= -3 || chiChu.score <= -3 || menhChu.score <= -3;
  return { guest, host, target, chiNam, chiChu, menhChu, total, tier: tierOf(total, hardFlag) };
}

/** Dải năm sinh ứng viên mặc định: 18–65 tuổi (dương) tại năm xông đất. */
export function candidateYears(targetYear: number = DEFAULT_TARGET_YEAR): number[] {
  const out: number[] = [];
  for (let y = targetYear - 65; y <= targetYear - 18; y++) out.push(y);
  return out;
}

/**
 * Xếp hạng toàn bộ ứng viên cho 1 gia chủ: điểm giảm dần, cùng điểm thì người
 * lớn tuổi đứng trước (thuận lệ "trọng tuổi" khi đi chúc Tết).
 */
export function rankCandidates(
  hostYear: number,
  targetYear: number = DEFAULT_TARGET_YEAR,
): XongDatResult[] {
  return candidateYears(targetYear)
    .map((y) => checkXongDat(y, hostYear, targetYear))
    .filter((r): r is XongDatResult => r !== null)
    .sort((a, b) => b.total - a.total || a.guest.year - b.guest.year);
}

/**
 * Top gợi ý để hiển thị — giới hạn tối đa 2 năm mỗi con giáp cho đa dạng nhóm
 * tuổi (các năm cùng chi cách nhau 12 năm có cùng quan hệ chi, chỉ khác mệnh).
 */
export function topCandidates(
  hostYear: number,
  targetYear: number = DEFAULT_TARGET_YEAR,
  count = 6,
): XongDatResult[] {
  const perChi = new Map<string, number>();
  const out: XongDatResult[] = [];
  for (const r of rankCandidates(hostYear, targetYear)) {
    if (r.tier === 'nen-can-nhac' || r.tier === 'binh') continue;
    const used = perChi.get(r.guest.zodiac.slug) ?? 0;
    if (used >= 2) continue;
    perChi.set(r.guest.zodiac.slug, used + 1);
    out.push(r);
    if (out.length >= count) break;
  }
  return out;
}

/** Các nhóm con giáp "nên cân nhắc" cho 1 gia chủ (mức chi, kèm lý do). */
export function cautionChis(
  hostYear: number,
  targetYear: number = DEFAULT_TARGET_YEAR,
): Array<{ zodiac: Zodiac; reasons: string[] }> {
  const host = yearProfile(hostYear);
  const target = yearProfile(targetYear);
  if (!host || !target) return [];
  return ZODIAC.map((z) => {
    const reasons: string[] = [];
    const vsNam = relationOf(z.slug, target.zodiac.slug);
    const vsChu = relationOf(z.slug, host.zodiac.slug);
    if (vsNam === 'luc-xung') reasons.push(`lục xung với chi năm ${target.canChi}`);
    if (vsNam === 'dong-tuoi') reasons.push(`trùng chi năm ${target.canChi} (Thái Tuế)`);
    if (vsNam === 'luc-hai') reasons.push(`lục hại với chi năm ${target.canChi}`);
    if (vsChu === 'luc-xung') reasons.push(`lục xung với tuổi ${host.zodiac.ten} của gia chủ`);
    if (vsChu === 'luc-hai') reasons.push(`lục hại với tuổi ${host.zodiac.ten} của gia chủ`);
    return { zodiac: z, reasons };
  }).filter((e) => e.reasons.length > 0);
}

/** Nhóm con giáp theo quan hệ với chi NĂM — cho nội dung trang năm. */
export function yearChiGroups(targetYear: number = DEFAULT_TARGET_YEAR): {
  target: YearProfile;
  tamHop: Zodiac[];
  lucHop: Zodiac[];
  xung: Zodiac[];
  hai: Zodiac[];
  trung: Zodiac[];
} | null {
  const target = yearProfile(targetYear);
  if (!target) return null;
  const by = (kind: RelationKind) =>
    ZODIAC.filter((z) => relationOf(z.slug, target.zodiac.slug) === kind);
  return {
    target,
    tamHop: by('tam-hop'),
    lucHop: by('luc-hop'),
    xung: by('luc-xung'),
    hai: by('luc-hai'),
    trung: by('dong-tuoi'),
  };
}
