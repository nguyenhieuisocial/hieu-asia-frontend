/**
 * Sao hạn (Cửu Diệu niên hạn) — sao chiếu mệnh theo tuổi âm + giới tính.
 *
 * Thuần tính toán, không React, không phụ thuộc backend (công thức truyền thống,
 * công khai). Định vị thương hiệu: TRA CỨU PHONG TỤC để tham khảo — không phán
 * số mệnh, không bán lễ giải hạn.
 *
 * Bảng đã đối chiếu với nguồn tra cứu công khai (15 trường hợp năm 2026, nam &
 * nữ, khớp). Quy luật: theo tuổi mụ (= năm xem − năm sinh + 1), lấy `tuổi % 9`.
 *
 *   Nam:  1 La Hầu · 2 Thổ Tú · 3 Thủy Diệu · 4 Thái Bạch · 5 Thái Dương ·
 *         6 Vân Hớn · 7 Kế Đô · 8 Thái Âm · 0 Mộc Đức
 *   Nữ:   1 Kế Đô · 2 Vân Hớn · 3 Mộc Đức · 4 Thái Âm · 5 Thổ Tú ·
 *         6 La Hầu · 7 Thái Dương · 8 Thái Bạch · 0 Thủy Diệu
 */

export type Gender = 'nam' | 'nu';

export type SaoKey =
  | 'la_hau'
  | 'ke_do'
  | 'thai_bach'
  | 'thai_duong'
  | 'thai_am'
  | 'moc_duc'
  | 'tho_tu'
  | 'thuy_dieu'
  | 'van_hon';

export type SaoType = 'tot' | 'trung' | 'xau';

// age % 9  →  sao  (0 = bội số của 9, tức tuổi 9/18/27…)
const NAM_BY_MOD: Record<number, SaoKey> = {
  1: 'la_hau',
  2: 'tho_tu',
  3: 'thuy_dieu',
  4: 'thai_bach',
  5: 'thai_duong',
  6: 'van_hon',
  7: 'ke_do',
  8: 'thai_am',
  0: 'moc_duc',
};

const NU_BY_MOD: Record<number, SaoKey> = {
  1: 'ke_do',
  2: 'van_hon',
  3: 'moc_duc',
  4: 'thai_am',
  5: 'tho_tu',
  6: 'la_hau',
  7: 'thai_duong',
  8: 'thai_bach',
  0: 'thuy_dieu',
};

export interface SaoInfo {
  key: SaoKey;
  name: string;
  type: SaoType;
  /** Mô tả trung tính theo truyền thống. */
  summary: string;
  /** Lời khuyên thực tế, không mê tín. */
  advice: string;
  /** Tháng âm thường được nhắc là cần lưu ý / thuận lợi (theo phong tục). */
  thang: string;
}

export const SAO_INFO: Record<SaoKey, SaoInfo> = {
  thai_duong: {
    key: 'thai_duong',
    name: 'Thái Dương',
    type: 'tot',
    summary:
      'Cát tinh, tượng mặt trời — theo phong tục là năm hanh thông, gặp quý nhân, công danh sáng sủa; đặc biệt thuận với nam giới.',
    advice: 'Năm thuận để khởi sự, mở rộng việc — cứ tự tin tiến nhưng vẫn giữ chừng mực.',
    thang: 'Tháng tốt thường nhắc: tháng 6 và tháng 10 (âm).',
  },
  thai_am: {
    key: 'thai_am',
    name: 'Thái Âm',
    type: 'tot',
    summary:
      'Cát tinh, tượng mặt trăng — êm đẹp, tài lộc, gặp may về tiền bạc; hợp với nữ giới.',
    advice: 'Năm dễ chịu để vun vén tài chính, gia đạo. Giữ nhịp ổn định là tốt.',
    thang: 'Tháng tốt thường nhắc: tháng 9 (âm).',
  },
  moc_duc: {
    key: 'moc_duc',
    name: 'Mộc Đức',
    type: 'tot',
    summary:
      'Cát tinh — bình an, hỷ sự, thuận hoà, hợp chuyện vui như cưới hỏi, sinh con.',
    advice: 'Năm an lành, hợp việc hỷ. Tận hưởng và giữ gìn sức khoẻ.',
    thang: 'Tháng tốt thường nhắc: tháng 10 và tháng 12 (âm).',
  },
  tho_tu: {
    key: 'tho_tu',
    name: 'Thổ Tú',
    type: 'trung',
    summary:
      'Sao trung bình — theo phong tục thiên về trắc trở vặt, hao hụt nhỏ; đi xa nên cẩn trọng.',
    advice: 'Giữ mọi việc ổn định, tránh thay đổi lớn không cần thiết; cẩn thận khi đi xa.',
    thang: 'Tháng cần lưu ý: tháng 4 và tháng 8 (âm).',
  },
  thuy_dieu: {
    key: 'thuy_dieu',
    name: 'Thủy Diệu',
    type: 'trung',
    summary:
      'Sao trung bình — nhìn chung an lành, lợi cho đi xa; song theo phong tục kỵ sông nước.',
    advice: 'Năm tương đối nhẹ nhàng; cẩn thận các việc liên quan đến nước, bơi lội, đường thuỷ.',
    thang: 'Tháng cần lưu ý: tháng 4 và tháng 8 (âm).',
  },
  van_hon: {
    key: 'van_hon',
    name: 'Vân Hớn',
    type: 'trung',
    summary:
      'Sao trung bình (còn gọi Vân Hán) — theo phong tục dễ nóng giận, vướng thị phi lời nói, đau ốm nhẹ.',
    advice: 'Giữ bình tĩnh, tránh tranh cãi và khẩu thiệt; chú ý sức khoẻ, lời nói.',
    thang: 'Tháng cần lưu ý: tháng 2 và tháng 8 (âm).',
  },
  la_hau: {
    key: 'la_hau',
    name: 'La Hầu',
    type: 'xau',
    summary:
      'Hung tinh — theo quan niệm dân gian thiên về thị phi, miệng tiếng, giấy tờ pháp lý, ốm đau; nặng hơn với nam giới ("nam La Hầu").',
    advice: 'Năm nên giữ lời ăn tiếng nói, cẩn thận giấy tờ – pháp lý, giữ sức khoẻ. Bình tĩnh xử lý mâu thuẫn.',
    thang: 'Tháng thường nhắc cần thận trọng: tháng 1 và tháng 7 (âm).',
  },
  ke_do: {
    key: 'ke_do',
    name: 'Kế Đô',
    type: 'xau',
    summary:
      'Hung tinh — theo quan niệm dân gian thiên về buồn phiền, hao tài, thị phi; nặng hơn với nữ giới ("nữ Kế Đô").',
    advice: 'Giữ tâm an, tránh thị phi và tranh chấp; cẩn trọng tiền bạc và sức khoẻ.',
    thang: 'Tháng thường nhắc cần thận trọng: tháng 3 và tháng 9 (âm).',
  },
  thai_bach: {
    key: 'thai_bach',
    name: 'Thái Bạch',
    type: 'xau',
    summary:
      'Hung tinh về tiền bạc (dân gian có câu "Thái Bạch quét sạch cửa nhà") — thiên về hao tài; nặng hơn với nam giới.',
    advice: 'Năm nên thận trọng chi tiêu, đầu tư, cho vay; tránh quyết định tài chính lớn khi chưa chắc.',
    thang: 'Tháng thường nhắc cần thận trọng: tháng 5 (âm).',
  },
};

/** 9 sao theo thứ tự để liệt kê (tốt → trung → xấu). */
export const SAO_ORDER: SaoKey[] = [
  'thai_duong',
  'thai_am',
  'moc_duc',
  'tho_tu',
  'thuy_dieu',
  'van_hon',
  'la_hau',
  'ke_do',
  'thai_bach',
];

export const TYPE_LABEL: Record<SaoType, string> = {
  tot: 'Cát tinh (tốt)',
  trung: 'Trung tính',
  xau: 'Hung tinh (cần thận trọng)',
};

export interface SaoHanResult {
  /** Tuổi mụ (âm) trong năm xem. */
  tuoiMu: number;
  sao: SaoInfo;
  gender: Gender;
  viewYear: number;
}

/** Năm dương đang dùng để xem hạn (mặc định = năm hiện tại). */
export function currentViewYear(): number {
  return new Date().getFullYear();
}

/**
 * Tính sao hạn cho một người trong một năm dương.
 * @param birthYear năm sinh dương lịch
 * @param gender 'nam' | 'nu'
 * @param viewYear năm xem (dương). Mặc định năm hiện tại.
 */
export function computeSaoHan(
  birthYear: number,
  gender: Gender,
  viewYear: number = currentViewYear(),
): SaoHanResult | null {
  if (!Number.isFinite(birthYear) || birthYear < 1900 || birthYear > viewYear) {
    return null;
  }
  const tuoiMu = viewYear - birthYear + 1; // tuổi âm/mụ
  const mod = ((tuoiMu % 9) + 9) % 9;
  const key = (gender === 'nam' ? NAM_BY_MOD : NU_BY_MOD)[mod];
  if (!key) return null; // không xảy ra: mod luôn trong 0..8
  return { tuoiMu, sao: SAO_INFO[key], gender, viewYear };
}
