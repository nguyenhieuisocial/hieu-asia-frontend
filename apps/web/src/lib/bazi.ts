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

/**
 * Tàng Can (人元/藏干) — các Thiên Can ẩn bên trong mỗi Địa Chi, theo CHỈ SỐ can.
 * Bản khí (can đầu) đứng trước, rồi trung khí / dư khí. Bảng cố định, kiểm chứng được.
 * Index theo CHI (0 = Tý … 11 = Hợi).
 */
const TANG_CAN: number[][] = [
  [9], // Tý: Quý
  [5, 9, 7], // Sửu: Kỷ, Quý, Tân
  [0, 2, 4], // Dần: Giáp, Bính, Mậu
  [1], // Mão: Ất
  [4, 1, 9], // Thìn: Mậu, Ất, Quý
  [2, 4, 6], // Tỵ: Bính, Mậu, Canh
  [3, 5], // Ngọ: Đinh, Kỷ
  [5, 3, 1], // Mùi: Kỷ, Đinh, Ất
  [6, 8, 4], // Thân: Canh, Nhâm, Mậu
  [7], // Dậu: Tân
  [4, 7, 3], // Tuất: Mậu, Tân, Đinh
  [8, 0], // Hợi: Nhâm, Giáp
];

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

/**
 * Nạp Âm (納音) — "mệnh" theo 60 hoa giáp. Mỗi tên phủ 2 trụ liên tiếp trong
 * vòng 60, nên có đúng 30 mục (theo thứ tự Giáp Tý → Quý Hợi). Bảng cố định.
 */
const NAP_AM: { name: string; element: Element }[] = [
  { name: 'Hải Trung Kim', element: 'Kim' }, // Giáp Tý · Ất Sửu
  { name: 'Lô Trung Hỏa', element: 'Hỏa' }, // Bính Dần · Đinh Mão
  { name: 'Đại Lâm Mộc', element: 'Mộc' }, // Mậu Thìn · Kỷ Tỵ
  { name: 'Lộ Bàng Thổ', element: 'Thổ' }, // Canh Ngọ · Tân Mùi
  { name: 'Kiếm Phong Kim', element: 'Kim' }, // Nhâm Thân · Quý Dậu
  { name: 'Sơn Đầu Hỏa', element: 'Hỏa' }, // Giáp Tuất · Ất Hợi
  { name: 'Giản Hạ Thủy', element: 'Thủy' }, // Bính Tý · Đinh Sửu
  { name: 'Thành Đầu Thổ', element: 'Thổ' }, // Mậu Dần · Kỷ Mão
  { name: 'Bạch Lạp Kim', element: 'Kim' }, // Canh Thìn · Tân Tỵ
  { name: 'Dương Liễu Mộc', element: 'Mộc' }, // Nhâm Ngọ · Quý Mùi
  { name: 'Tuyền Trung Thủy', element: 'Thủy' }, // Giáp Thân · Ất Dậu
  { name: 'Ốc Thượng Thổ', element: 'Thổ' }, // Bính Tuất · Đinh Hợi
  { name: 'Tích Lịch Hỏa', element: 'Hỏa' }, // Mậu Tý · Kỷ Sửu
  { name: 'Tùng Bách Mộc', element: 'Mộc' }, // Canh Dần · Tân Mão
  { name: 'Trường Lưu Thủy', element: 'Thủy' }, // Nhâm Thìn · Quý Tỵ
  { name: 'Sa Trung Kim', element: 'Kim' }, // Giáp Ngọ · Ất Mùi
  { name: 'Sơn Hạ Hỏa', element: 'Hỏa' }, // Bính Thân · Đinh Dậu
  { name: 'Bình Địa Mộc', element: 'Mộc' }, // Mậu Tuất · Kỷ Hợi
  { name: 'Bích Thượng Thổ', element: 'Thổ' }, // Canh Tý · Tân Sửu
  { name: 'Kim Bạch Kim', element: 'Kim' }, // Nhâm Dần · Quý Mão
  { name: 'Phú Đăng Hỏa', element: 'Hỏa' }, // Giáp Thìn · Ất Tỵ
  { name: 'Thiên Hà Thủy', element: 'Thủy' }, // Bính Ngọ · Đinh Mùi
  { name: 'Đại Dịch Thổ', element: 'Thổ' }, // Mậu Thân · Kỷ Dậu
  { name: 'Thoa Xuyến Kim', element: 'Kim' }, // Canh Tuất · Tân Hợi
  { name: 'Tang Đố Mộc', element: 'Mộc' }, // Nhâm Tý · Quý Sửu
  { name: 'Đại Khê Thủy', element: 'Thủy' }, // Giáp Dần · Ất Mão
  { name: 'Sa Trung Thổ', element: 'Thổ' }, // Bính Thìn · Đinh Tỵ
  { name: 'Thiên Thượng Hỏa', element: 'Hỏa' }, // Mậu Ngọ · Kỷ Mùi
  { name: 'Thạch Lựu Mộc', element: 'Mộc' }, // Canh Thân · Tân Dậu
  { name: 'Đại Hải Thủy', element: 'Thủy' }, // Nhâm Tuất · Quý Hợi
];

/** Vị trí (0–59) của cặp can-chi trong vòng 60 hoa giáp. */
function sexagenaryIndex(canIdx: number, chiIdx: number): number {
  for (let t = 0; t < 6; t++) {
    const s = canIdx + 10 * t;
    if (s % 12 === chiIdx) return s;
  }
  return 0; // không xảy ra với cặp can-chi hợp lệ (cùng tính âm/dương)
}

/** Nạp âm của một trụ (can-chi). */
function napAmOf(canIdx: number, chiIdx: number): { name: string; element: Element } {
  return NAP_AM[Math.floor(sexagenaryIndex(canIdx, chiIdx) / 2)]!;
}

// Quan hệ giữa các Địa Chi (bảng cố định, theo chỉ số chi 0=Tý … 11=Hợi).
// Lục Xung = hai chi đối nhau (cách 6). Các bảng còn lại liệt kê cặp.
const LUC_HOP_PAIRS: [number, number][] = [
  [0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7], // Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
];
const LUC_HAI_PAIRS: [number, number][] = [
  [0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10], // Tý-Mùi, Sửu-Ngọ, Dần-Tỵ, Mão-Thìn, Thân-Hợi, Dậu-Tuất
];
const TAM_HOP_GROUPS: { chi: [number, number, number]; element: Element; center: number }[] = [
  { chi: [8, 0, 4], element: 'Thủy', center: 0 }, // Thân-Tý-Thìn
  { chi: [5, 9, 1], element: 'Kim', center: 9 }, // Tỵ-Dậu-Sửu
  { chi: [2, 6, 10], element: 'Hỏa', center: 6 }, // Dần-Ngọ-Tuất
  { chi: [11, 3, 7], element: 'Mộc', center: 3 }, // Hợi-Mão-Mùi
];

export interface PillarRelation {
  type: 'Lục Hợp' | 'Lục Xung' | 'Lục Hại' | 'Tam Hợp' | 'Bán Tam Hợp';
  pillars: string; // nhãn các trụ tham gia, vd "Tháng–Giờ"
  chi: string; // chi tham gia, vd "Tỵ–Thân"
  detail: string; // mô tả trung lập (không bói toán)
}

const pairKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

/** Dò quan hệ địa chi (Lục Hợp/Xung/Hại + Tam Hợp) giữa 4 trụ. */
function pillarRelations(pillars: { label: string; chi: number }[]): PillarRelation[] {
  const rels: PillarRelation[] = [];
  const hop = new Set(LUC_HOP_PAIRS.map(([a, b]) => pairKey(a, b)));
  const hai = new Set(LUC_HAI_PAIRS.map(([a, b]) => pairKey(a, b)));

  for (let i = 0; i < pillars.length; i++) {
    for (let j = i + 1; j < pillars.length; j++) {
      const a = pillars[i]!;
      const b = pillars[j]!;
      if (a.chi === b.chi) continue; // cùng chi: không xét
      const labels = `${a.label}–${b.label}`;
      const chis = `${CHI[a.chi]!}–${CHI[b.chi]!}`;
      if (Math.abs(a.chi - b.chi) === 6) {
        rels.push({ type: 'Lục Xung', pillars: labels, chi: chis, detail: 'hai chi đối xung — lực động/đối lập giữa hai trụ (không phải điềm xấu)' });
      } else if (hop.has(pairKey(a.chi, b.chi))) {
        rels.push({ type: 'Lục Hợp', pillars: labels, chi: chis, detail: 'hai chi hoà hợp — gắn kết, dễ phối hợp' });
      } else if (hai.has(pairKey(a.chi, b.chi))) {
        rels.push({ type: 'Lục Hại', pillars: labels, chi: chis, detail: 'khắc ngầm nhẹ giữa hai chi' });
      }
    }
  }

  const present = new Map<number, string[]>();
  for (const p of pillars) present.set(p.chi, [...(present.get(p.chi) ?? []), p.label]);
  for (const g of TAM_HOP_GROUPS) {
    const have = g.chi.filter((c) => present.has(c));
    if (have.length === 3) {
      rels.push({
        type: 'Tam Hợp',
        pillars: g.chi.flatMap((c) => present.get(c)!).join('–'),
        chi: g.chi.map((c) => CHI[c]!).join('–'),
        detail: `ba chi tụ thành cục ${g.element} mạnh`,
      });
    } else if (have.length === 2 && have.includes(g.center)) {
      rels.push({
        type: 'Bán Tam Hợp',
        pillars: have.flatMap((c) => present.get(c)!).join('–'),
        chi: have.map((c) => CHI[c]!).join('–'),
        detail: `nửa cục ${g.element} (có trung tâm) — thiên về hành ${g.element}`,
      });
    }
  }
  return rels;
}

/**
 * Vòng Trường Sinh (十二長生) — 12 giai đoạn "đời người" của một Thiên Can khi
 * trải qua 12 Địa Chi. Bảng cố định, tra theo lá số (không bói toán).
 *
 * Thứ tự 12 giai đoạn (index 0 → 11).
 */
export const TRUONG_SINH_STAGES = [
  'Trường Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy',
  'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng',
] as const;

// Chi (index) nơi mỗi can KHỞI "Trường Sinh", theo CHỈ SỐ can (0=Giáp … 9=Quý):
//   Giáp→Hợi(11), Bính/Mậu→Dần(2), Canh→Tỵ(5), Nhâm→Thân(8) — can DƯƠNG đi THUẬN;
//   Ất→Ngọ(6), Đinh/Kỷ→Dậu(9), Tân→Tý(0), Quý→Mão(3) — can ÂM đi NGHỊCH.
const TRUONG_SINH_START: number[] = [11, 6, 2, 9, 2, 9, 5, 0, 8, 3];

/**
 * Giai đoạn Trường Sinh của `dayStem` (chỉ số can 0–9) khi đứng trên `branch`
 * (chỉ số chi 0–11). Can dương đi thuận (start+k), can âm đi nghịch (start−k).
 * Trả về tên 1 trong 12 giai đoạn — tra theo bảng, kiểm chứng được.
 */
export function truongSinh(dayStem: number, branch: number): (typeof TRUONG_SINH_STAGES)[number] {
  const start = TRUONG_SINH_START[dayStem]!;
  const k = CAN_YANG[dayStem] ? mod(branch - start, 12) : mod(start - branch, 12);
  return TRUONG_SINH_STAGES[k]!;
}

/**
 * Thần Sát (神煞) — các sao tượng trưng, TRA THEO BẢNG cố định (Tam Mệnh Thông
 * Hội / Uyên Hải Tử Bình). Không bói toán: chỉ là dữ kiện tra cứu, kèm nghĩa
 * trung lập (không định mệnh).
 *
 * Nhóm tam-hợp của một chi (để tra Đào Hoa / Dịch Mã / Hoa Cái) — index chi
 * 0..11 → 0..3 (Thân-Tý-Thìn, Tỵ-Dậu-Sửu, Dần-Ngọ-Tuất, Hợi-Mão-Mùi).
 */
const TAM_HOP_GROUP_OF: number[] = (() => {
  const g: number[] = new Array(12).fill(0);
  const groups: number[][] = [
    [8, 0, 4], // 0: Thân-Tý-Thìn (Thủy)
    [5, 9, 1], // 1: Tỵ-Dậu-Sửu (Kim)
    [2, 6, 10], // 2: Dần-Ngọ-Tuất (Hỏa)
    [11, 3, 7], // 3: Hợi-Mão-Mùi (Mộc)
  ];
  groups.forEach((grp, gi) => grp.forEach((c) => (g[c] = gi)));
  return g;
})();

// Đào Hoa / Dịch Mã / Hoa Cái: chi mục tiêu theo NHÓM tam-hợp (index nhóm 0..3).
const DAO_HOA_BY_GROUP = [9, 6, 3, 0]; // → Dậu, Ngọ, Mão, Tý
const DICH_MA_BY_GROUP = [2, 11, 8, 5]; // → Dần, Hợi, Thân, Tỵ
const HOA_CAI_BY_GROUP = [4, 1, 10, 7]; // → Thìn, Sửu, Tuất, Mùi

// Thiên Ất Quý Nhân — cặp chi quý nhân theo CAN NGÀY (index can 0..9).
const THIEN_AT_BY_STEM: number[][] = [
  [1, 7], // Giáp → Sửu, Mùi
  [0, 8], // Ất → Tý, Thân
  [11, 9], // Bính → Hợi, Dậu
  [11, 9], // Đinh → Hợi, Dậu
  [1, 7], // Mậu → Sửu, Mùi
  [0, 8], // Kỷ → Tý, Thân
  [6, 2], // Canh → Ngọ, Dần
  [6, 2], // Tân → Ngọ, Dần
  [5, 3], // Nhâm → Tỵ, Mão
  [5, 3], // Quý → Tỵ, Mão
];

// Văn Xương — chi theo CAN NGÀY (index can 0..9).
const VAN_XUONG_BY_STEM: number[] = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];
// Giáp→Tỵ, Ất→Ngọ, Bính→Thân, Đinh→Dậu, Mậu→Thân, Kỷ→Dậu, Canh→Hợi, Tân→Tý, Nhâm→Dần, Quý→Mão.

export interface ThanSat {
  name: string; // tên thần sát, vd "Đào Hoa"
  pillars: string; // nhãn các trụ trúng, vd "Năm · Giờ"
  chi: string; // chi của thần sát, vd "Dậu"
  meaning: string; // nghĩa trung lập (không định mệnh)
}

/**
 * Dò Thần Sát trên 4 trụ. Tra theo:
 *  - Đào Hoa / Dịch Mã / Hoa Cái: theo tam-hợp của chi NĂM hoặc chi NGÀY.
 *  - Thiên Ất Quý Nhân / Văn Xương: theo CAN NGÀY (Nhật Chủ).
 * Mỗi thần sát gom các trụ có chi trúng. Bảng cố định, kiểm chứng được.
 */
function thanSat(
  dayStem: number,
  yearChi: number,
  dayChi: number,
  pillars: { label: string; chi: number }[],
): ThanSat[] {
  const out: ThanSat[] = [];
  // Chi trúng theo từng trụ — gom nhãn trụ + chi.
  const collect = (name: string, targets: number[], meaning: string) => {
    const set = new Set(targets);
    const hits = pillars.filter((p) => set.has(p.chi));
    if (hits.length === 0) return;
    out.push({
      name,
      pillars: hits.map((p) => p.label).join(' · '),
      chi: [...new Set(hits.map((p) => CHI[p.chi]!))].join('–'),
      meaning,
    });
  };

  // Tam-hợp lấy theo CẢ chi năm và chi ngày (chuẩn dùng cả hai làm "bản mệnh").
  const groups = new Set([TAM_HOP_GROUP_OF[yearChi]!, TAM_HOP_GROUP_OF[dayChi]!]);
  const daoHoa = [...groups].map((g) => DAO_HOA_BY_GROUP[g]!);
  const dichMa = [...groups].map((g) => DICH_MA_BY_GROUP[g]!);
  const hoaCai = [...groups].map((g) => HOA_CAI_BY_GROUP[g]!);

  collect('Đào Hoa', daoHoa, 'duyên dáng, sức hút, thẩm mỹ — KHÔNG phải "lăng nhăng"');
  collect('Dịch Mã', dichMa, 'di chuyển, thay đổi, năng động — hợp việc đi lại/giao tiếp');
  collect('Hoa Cái', hoaCai, 'tài hoa nghệ thuật, thiên về tâm linh/độc lập — đôi khi thích ở một mình');
  collect('Thiên Ất Quý Nhân', THIEN_AT_BY_STEM[dayStem]!, 'quý nhân phù trợ — dễ gặp người giúp đỡ lúc khó');
  collect('Văn Xương', [VAN_XUONG_BY_STEM[dayStem]!], 'học hành, văn chương, thi cử — thuận đường chữ nghĩa');

  return out;
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

export interface HiddenStem {
  can: string;
  element: Element;
  /** Thập Thần của can ẩn này so với Nhật Chủ. */
  tenGod: string;
}

export interface BaziPillar {
  label: string; // "Năm" | "Tháng" | "Ngày" | "Giờ"
  can: string;
  chi: string;
  canElement: Element;
  chiElement: Element;
  /** Thập Thần của CAN trụ này so với Nhật Chủ. Trụ ngày = "Nhật Chủ". */
  tenGod: string;
  /** Tàng can — các can ẩn trong địa chi của trụ (bản khí đứng đầu). */
  hiddenStems: HiddenStem[];
  /** Nạp âm ("mệnh" theo 60 hoa giáp) của trụ. */
  napAm: { name: string; element: Element };
  /** Giai đoạn Vòng Trường Sinh của Nhật Chủ trên chi của trụ này (tra theo bảng). */
  truongSinh: (typeof TRUONG_SINH_STAGES)[number];
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
  /** Quan hệ địa chi giữa 4 trụ (Lục Hợp/Xung/Hại + Tam Hợp). */
  relations: PillarRelation[];
  /** Thần Sát (sao tượng trưng) trên 4 trụ — tra theo bảng cố định. */
  thanSat: ThanSat[];
  meta: { solarDate: string; hour: number; solarYearForPillar: number };
  /** Đại vận (vận 10 năm) — null nếu không truyền giới tính. */
  daiVan?: DaiVan | null;
  /** Lưu niên (vận năm) cho `asOf` — null nếu không truyền asOf. */
  luuNien?: LuuNien | null;
}

export interface BaziInput {
  birthSolarDate: string; // "YYYY-MM-DD"
  birthHour: number; // 0–23
  birthMinute?: number; // 0–59 (mặc định 0)
  gender?: 'M' | 'F'; // cần cho hướng đại vận (thuận/nghịch); thiếu → bỏ đại vận
  asOf?: string; // ngày tham chiếu "YYYY-MM-DD" để tính lưu niên (vận năm); thiếu → bỏ lưu niên
}

function makePillar(
  label: string,
  canIdx: number,
  chiIdx: number,
  dm: { el: Element; yang: boolean },
  dayStem: number,
  isDayStem = false,
): BaziPillar {
  const hiddenStems: HiddenStem[] = (TANG_CAN[chiIdx] ?? []).map((hc) => ({
    can: CAN[hc]!,
    element: CAN_ELEMENT[hc]!,
    tenGod: thapThan(dm.el, dm.yang, CAN_ELEMENT[hc]!, CAN_YANG[hc]!),
  }));
  return {
    label,
    can: CAN[canIdx]!,
    chi: CHI[chiIdx]!,
    canElement: CAN_ELEMENT[canIdx]!,
    chiElement: CHI_ELEMENT[chiIdx]!,
    tenGod: isDayStem ? 'Nhật Chủ' : thapThan(dm.el, dm.yang, CAN_ELEMENT[canIdx]!, CAN_YANG[canIdx]!),
    hiddenStems,
    napAm: napAmOf(canIdx, chiIdx),
    truongSinh: truongSinh(dayStem, chiIdx),
  };
}

export interface LuuNien {
  year: number; // năm dương lịch (theo ranh giới Lập Xuân)
  can: string;
  chi: string;
  canElement: Element;
  chiElement: Element;
  tenGod: string; // can năm so với Nhật Chủ
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

/** Năm can chi (Bát Tự) chứa ngày (Y,M,D) — đổi tại Lập Xuân. */
function solarYearOf(Y: number, M: number, D: number): number {
  const jd = julianDay(Y, M, D, 5); // ~giữa trưa giờ VN (UTC+7) ≈ 05:00 UTC
  const lx = solarTermJD(Y, 315, 2, 4);
  return jd >= lx ? Y : Y - 1;
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
  const minute = Number.isFinite(input.birthMinute) ? input.birthMinute! : 0; // guard NaN (?? chỉ chặn null/undefined)

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

  const year = makePillar('Năm', yearCan, yearChi, dm, dayCan);
  const month = makePillar('Tháng', monthCan, monthChi, dm, dayCan);
  const day = makePillar('Ngày', dayCan, dayChi, dm, dayCan, true);
  const hourP = makePillar('Giờ', hourCan, hourChi, dm, dayCan);

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

  let luuNien: LuuNien | null = null;
  const am = input.asOf ? /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(input.asOf.trim()) : null;
  if (am) {
    const sy = solarYearOf(Number(am[1]), Number(am[2]), Number(am[3]));
    const lc = mod(sy - 4, 10);
    const lch = mod(sy - 4, 12);
    luuNien = {
      year: sy,
      can: CAN[lc]!,
      chi: CHI[lch]!,
      canElement: CAN_ELEMENT[lc]!,
      chiElement: CHI_ELEMENT[lch]!,
      tenGod: thapThan(dm.el, dm.yang, CAN_ELEMENT[lc]!, CAN_YANG[lc]!),
    };
  }

  return {
    year,
    month,
    day,
    hour: hourP,
    dayMaster: { can: CAN[dayCan]!, element: dm.el, yang: dm.yang },
    elementCount,
    missing,
    strongest,
    relations: pillarRelations([
      { label: 'Năm', chi: yearChi },
      { label: 'Tháng', chi: monthChi },
      { label: 'Ngày', chi: dayChi },
      { label: 'Giờ', chi: hourChi },
    ]),
    thanSat: thanSat(dayCan, yearChi, dayChi, [
      { label: 'Năm', chi: yearChi },
      { label: 'Tháng', chi: monthChi },
      { label: 'Ngày', chi: dayChi },
      { label: 'Giờ', chi: hourChi },
    ]),
    daiVan,
    luuNien,
    meta: { solarDate: input.birthSolarDate, hour, solarYearForPillar: solarYear },
  };
}
