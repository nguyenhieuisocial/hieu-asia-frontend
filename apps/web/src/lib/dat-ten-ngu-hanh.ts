/**
 * Đặt tên con theo ngũ hành — tra mệnh ngũ hành (nạp âm) theo ngày sinh + gợi ý
 * tên theo hành tương sinh.
 *
 * Thuần tính toán, không React. Phần LÕI (năm sinh → mệnh) là bảng nạp âm cổ
 * điển, deterministic, đối chiếu nhiều nguồn nhất trí. Phần gợi ý tên là tham
 * khảo theo nghĩa chữ Hán-Việt (phổ biến nhất, KHÔNG phải chuẩn tuyệt đối).
 *
 * Mệnh tính theo NĂM ÂM LỊCH (đổi vào Tết) → nhận ngày sinh dương, đổi qua âm.
 *
 * Định vị thương hiệu: gợi ý tham khảo theo phong tục — KHÔNG phán số mệnh đứa
 * trẻ. Tên đẹp, ý nghĩa tốt và tâm ý cha mẹ mới là điều quan trọng nhất.
 */

import { solarToLunar } from './ngay-kieng-ky';

export type Element = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';

const STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const BRANCHES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// 30 cặp nạp âm (vòng 60 Giáp Tý) — đối chiếu nhiều nguồn nhất trí 100%.
const NAP_AM: Array<{ name: string; element: Element }> = [
  { name: 'Hải Trung Kim', element: 'kim' }, // Giáp Tý · Ất Sửu
  { name: 'Lô Trung Hỏa', element: 'hoa' }, // Bính Dần · Đinh Mão
  { name: 'Đại Lâm Mộc', element: 'moc' }, // Mậu Thìn · Kỷ Tỵ
  { name: 'Lộ Bàng Thổ', element: 'tho' }, // Canh Ngọ · Tân Mùi
  { name: 'Kiếm Phong Kim', element: 'kim' }, // Nhâm Thân · Quý Dậu
  { name: 'Sơn Đầu Hỏa', element: 'hoa' }, // Giáp Tuất · Ất Hợi
  { name: 'Giản Hạ Thủy', element: 'thuy' }, // Bính Tý · Đinh Sửu
  { name: 'Thành Đầu Thổ', element: 'tho' }, // Mậu Dần · Kỷ Mão
  { name: 'Bạch Lạp Kim', element: 'kim' }, // Canh Thìn · Tân Tỵ
  { name: 'Dương Liễu Mộc', element: 'moc' }, // Nhâm Ngọ · Quý Mùi
  { name: 'Tuyền Trung Thủy', element: 'thuy' }, // Giáp Thân · Ất Dậu
  { name: 'Ốc Thượng Thổ', element: 'tho' }, // Bính Tuất · Đinh Hợi
  { name: 'Tích Lịch Hỏa', element: 'hoa' }, // Mậu Tý · Kỷ Sửu
  { name: 'Tùng Bách Mộc', element: 'moc' }, // Canh Dần · Tân Mão
  { name: 'Trường Lưu Thủy', element: 'thuy' }, // Nhâm Thìn · Quý Tỵ
  { name: 'Sa Trung Kim', element: 'kim' }, // Giáp Ngọ · Ất Mùi
  { name: 'Sơn Hạ Hỏa', element: 'hoa' }, // Bính Thân · Đinh Dậu
  { name: 'Bình Địa Mộc', element: 'moc' }, // Mậu Tuất · Kỷ Hợi
  { name: 'Bích Thượng Thổ', element: 'tho' }, // Canh Tý · Tân Sửu
  { name: 'Kim Bạch Kim', element: 'kim' }, // Nhâm Dần · Quý Mão
  { name: 'Phú Đăng Hỏa', element: 'hoa' }, // Giáp Thìn · Ất Tỵ
  { name: 'Thiên Hà Thủy', element: 'thuy' }, // Bính Ngọ · Đinh Mùi
  { name: 'Đại Trạch Thổ', element: 'tho' }, // Mậu Thân · Kỷ Dậu
  { name: 'Thoa Xuyến Kim', element: 'kim' }, // Canh Tuất · Tân Hợi
  { name: 'Tang Đố Mộc', element: 'moc' }, // Nhâm Tý · Quý Sửu
  { name: 'Đại Khê Thủy', element: 'thuy' }, // Giáp Dần · Ất Mão
  { name: 'Sa Trung Thổ', element: 'tho' }, // Bính Thìn · Đinh Tỵ
  { name: 'Thiên Thượng Hỏa', element: 'hoa' }, // Mậu Ngọ · Kỷ Mùi
  { name: 'Thạch Lựu Mộc', element: 'moc' }, // Canh Thân · Tân Dậu
  { name: 'Đại Hải Thủy', element: 'thuy' }, // Nhâm Tuất · Quý Hợi
];

export interface ElementInfo {
  key: Element;
  name: string;
  /** Hành sinh ra mệnh này (bố mẹ của hành — bổ trợ tốt khi đặt tên). */
  sinhBy: Element;
  /** Hành mà mệnh này sinh ra (con — cũng được coi là hài hoà). */
  sinhTo: Element;
  /** Hành mà mệnh này khắc. */
  khac: Element;
  /** Hành khắc mệnh này. */
  khacBy: Element;
  blurb: string;
}

export const ELEMENTS: Record<Element, ElementInfo> = {
  kim: { key: 'kim', name: 'Kim', sinhBy: 'tho', sinhTo: 'thuy', khac: 'moc', khacBy: 'hoa', blurb: 'Tượng kim loại — sắc bén, quyết đoán, trọng nghĩa.' },
  moc: { key: 'moc', name: 'Mộc', sinhBy: 'thuy', sinhTo: 'hoa', khac: 'tho', khacBy: 'kim', blurb: 'Tượng cây cối — sinh sôi, nhân hậu, vươn lên.' },
  thuy: { key: 'thuy', name: 'Thủy', sinhBy: 'kim', sinhTo: 'moc', khac: 'hoa', khacBy: 'tho', blurb: 'Tượng nước — linh hoạt, trí tuệ, bao dung.' },
  hoa: { key: 'hoa', name: 'Hỏa', sinhBy: 'moc', sinhTo: 'tho', khac: 'kim', khacBy: 'thuy', blurb: 'Tượng lửa — nhiệt huyết, sáng rõ, lễ nghĩa.' },
  tho: { key: 'tho', name: 'Thổ', sinhBy: 'hoa', sinhTo: 'kim', khac: 'thuy', khacBy: 'moc', blurb: 'Tượng đất — vững vàng, đôn hậu, đáng tin.' },
};

export interface NameSuggestion {
  name: string;
  meaning: string;
  gender: 'nam' | 'nu' | 'ca';
}

// Gợi ý tên theo NGHĨA chữ Hán-Việt (phổ biến nhất — không phải chuẩn tuyệt đối).
export const NAME_SUGGESTIONS: Record<Element, NameSuggestion[]> = {
  kim: [
    { name: 'Kim', meaning: 'vàng, kim loại quý', gender: 'ca' },
    { name: 'Ngân', meaning: 'bạc, trắng sáng', gender: 'nu' },
    { name: 'Ngọc', meaning: 'ngọc quý, trong sáng', gender: 'ca' },
    { name: 'Cương', meaning: 'cứng cỏi, bền vững', gender: 'nam' },
    { name: 'Chung', meaning: 'chuông vàng, tiếng vang', gender: 'ca' },
    { name: 'Nguyên', meaning: 'nguồn gốc, thuần khiết', gender: 'ca' },
    { name: 'Nghĩa', meaning: 'đạo lý, danh dự', gender: 'nam' },
    { name: 'Mỹ', meaning: 'đẹp, thuần mỹ', gender: 'nu' },
    { name: 'Xuyến', meaning: 'vòng trang sức', gender: 'nu' },
    { name: 'Hiền', meaning: 'hiền tài, đức hạnh', gender: 'nu' },
  ],
  moc: [
    { name: 'Lâm', meaning: 'rừng, rậm rạp', gender: 'nam' },
    { name: 'Tùng', meaning: 'cây tùng, kiên trung', gender: 'nam' },
    { name: 'Mai', meaning: 'hoa mai, thanh khiết', gender: 'nu' },
    { name: 'Trúc', meaning: 'cây trúc, cứng cỏi', gender: 'ca' },
    { name: 'Thảo', meaning: 'cỏ cây, hiền hoà', gender: 'nu' },
    { name: 'Lan', meaning: 'hoa lan, quý phái', gender: 'nu' },
    { name: 'Xuân', meaning: 'mùa xuân, sinh trưởng', gender: 'ca' },
    { name: 'Quỳnh', meaning: 'hoa quỳnh, cao quý', gender: 'nu' },
    { name: 'Nam', meaning: 'phương Nam, sinh khí', gender: 'nam' },
    { name: 'Hương', meaning: 'hương thơm cây cỏ', gender: 'nu' },
  ],
  thuy: [
    { name: 'Hà', meaning: 'sông, dòng chảy', gender: 'nu' },
    { name: 'Giang', meaning: 'sông lớn, bao la', gender: 'ca' },
    { name: 'Hải', meaning: 'biển, rộng lớn', gender: 'nam' },
    { name: 'Vân', meaning: 'mây, bay bổng', gender: 'nu' },
    { name: 'Vũ', meaning: 'mưa, mát lành', gender: 'nam' },
    { name: 'Thủy', meaning: 'nước, thuần khiết', gender: 'nu' },
    { name: 'Khê', meaning: 'suối nhỏ, trong vắt', gender: 'ca' },
    { name: 'Trí', meaning: 'trí tuệ, sâu sắc', gender: 'nam' },
    { name: 'Băng', meaning: 'băng trong, tinh khiết', gender: 'nu' },
    { name: 'Loan', meaning: 'chim loan bên nước', gender: 'nu' },
  ],
  hoa: [
    { name: 'Minh', meaning: 'sáng sủa, trí tuệ', gender: 'ca' },
    { name: 'Quang', meaning: 'ánh sáng, hào quang', gender: 'nam' },
    { name: 'Nhật', meaning: 'mặt trời, rực sáng', gender: 'nam' },
    { name: 'Đăng', meaning: 'ngọn đèn, soi đường', gender: 'nam' },
    { name: 'Huy', meaning: 'ánh sáng rực rỡ', gender: 'nam' },
    { name: 'Ánh', meaning: 'ánh sáng, tươi sáng', gender: 'nu' },
    { name: 'Dương', meaning: 'mặt trời, dương khí', gender: 'nam' },
    { name: 'Hồng', meaning: 'đỏ tươi, rạng rỡ', gender: 'nu' },
    { name: 'Đan', meaning: 'đỏ son, chân thành', gender: 'ca' },
    { name: 'Vinh', meaning: 'rực rỡ, vinh quang', gender: 'nam' },
  ],
  tho: [
    { name: 'Sơn', meaning: 'núi, vững chắc', gender: 'nam' },
    { name: 'Điền', meaning: 'ruộng đất, màu mỡ', gender: 'ca' },
    { name: 'Thành', meaning: 'thành trì, kiên cố', gender: 'nam' },
    { name: 'Bảo', meaning: 'quý báu, trân trọng', gender: 'ca' },
    { name: 'Châu', meaning: 'châu báu, viên ngọc', gender: 'nu' },
    { name: 'Kiên', meaning: 'kiên cường, bền vững', gender: 'nam' },
    { name: 'Cát', meaning: 'may mắn, tốt lành', gender: 'ca' },
    { name: 'Bích', meaning: 'ngọc bích xanh sáng', gender: 'nu' },
    { name: 'Trân', meaning: 'quý hiếm, trân trọng', gender: 'nu' },
    { name: 'Anh', meaning: 'tinh anh, tài hoa', gender: 'ca' },
  ],
};

export interface BanMenhResult {
  solar: { day: number; month: number; year: number };
  lunarYear: number;
  canChi: string;
  napAmName: string;
  element: Element;
  /** Hành hợp để đặt tên (sinh ra mệnh + đồng mệnh). */
  hopElements: Element[];
  /** Hành thường tránh (mệnh khắc + khắc mệnh). */
  avoidElements: Element[];
}

function yearCanChi(lunarYear: number): string {
  const c = ((lunarYear - 4) % 10 + 10) % 10;
  const b = ((lunarYear - 4) % 12 + 12) % 12;
  return `${STEMS[c]} ${BRANCHES[b]}`;
}

/** Tra mệnh ngũ hành (nạp âm) theo ngày sinh dương lịch. */
export function computeBanMenh(dd: number, mm: number, yy: number): BanMenhResult | null {
  if (
    !Number.isFinite(dd) || !Number.isFinite(mm) || !Number.isFinite(yy) ||
    mm < 1 || mm > 12 || dd < 1 || dd > 31 || yy < 1900 || yy > 2100
  ) {
    return null;
  }
  const lunar = solarToLunar(dd, mm, yy);
  const lunarYear = lunar.year;
  const cycle = ((lunarYear - 4) % 60 + 60) % 60;
  const napAm = NAP_AM[Math.floor(cycle / 2)]!;
  const info = ELEMENTS[napAm.element];
  return {
    solar: { day: dd, month: mm, year: yy },
    lunarYear,
    canChi: yearCanChi(lunarYear),
    napAmName: napAm.name,
    element: napAm.element,
    hopElements: [info.sinhBy, info.key],
    avoidElements: [info.khac, info.khacBy],
  };
}
