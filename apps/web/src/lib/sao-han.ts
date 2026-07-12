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

import { getVietnamDateParts } from './vn-date';

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
  /** "Sao" này thực chất là gì trong thiên văn — Cửu Diệu gốc là Navagraha (Ấn Độ). */
  origin: string;
  /**
   * Đoạn đọc sâu cho trang học (/learn/sao-han): dân gian thường đọc năm gặp sao
   * này thế nào, nên chủ động gì, ngộ nhận cần tránh. Giọng "chu kỳ tham khảo,
   * không phải án" — không nhắc lễ dâng sao như giải pháp.
   */
  deepDive: string;
}

export const SAO_INFO: Record<SaoKey, SaoInfo> = {
  thai_duong: {
    key: 'thai_duong',
    name: 'Thái Dương',
    type: 'tot',
    summary:
      'Cát tinh, tượng mặt trời — theo phong tục là năm hanh thông, gặp quý nhân, công danh sáng sủa; đặc biệt thuận với nam giới. Với nữ giới, dương khí mạnh đôi khi dễ va chạm gia đạo nhỏ — giữ hoà khí là ổn.',
    advice: 'Năm thuận để khởi sự, mở rộng việc — cứ tự tin tiến nhưng vẫn giữ chừng mực.',
    thang: 'Tháng tốt thường nhắc: tháng 6 và tháng 10 (âm).',
    origin: 'Mặt Trời — Surya trong Navagraha (9 thiên thể của thiên văn Ấn Độ cổ).',
    deepDive:
      'Năm Thái Dương thường được dân gian đọc là năm sáng sủa: công việc chạy, dễ gặp người giúp đỡ, hợp khởi sự hay mở rộng. Với nam giới, lời truyền còn nhấn mạnh hơn về công danh; với nữ giới, một số nơi dặn thêm chuyện giữ hoà khí trong nhà. Nên chủ động điều gì? Tận dụng đà thuận để làm những việc đã ấp ủ, nhưng vẫn giữ chừng mực, vì sao tốt không phải tấm khiên. Ngộ nhận cần tránh: coi năm sao tốt là năm "muốn làm gì cũng được" rồi buông lơi. Sao hạn lặp lại theo chu kỳ 9 năm theo tuổi, nên đọc như lời nhắc tham khảo, không phải án định trước.',
  },
  thai_am: {
    key: 'thai_am',
    name: 'Thái Âm',
    type: 'tot',
    summary:
      'Cát tinh, tượng mặt trăng — êm đẹp, tài lộc, gặp may về tiền bạc; hợp với nữ giới.',
    advice: 'Năm dễ chịu để vun vén tài chính, gia đạo. Giữ nhịp ổn định là tốt.',
    thang: 'Tháng tốt thường nhắc: tháng 9 (âm); tháng 11 nên chú ý sức khoẻ.',
    origin: 'Mặt Trăng — Chandra trong Navagraha.',
    deepDive:
      'Dân gian đọc năm Thái Âm là năm êm: tiền bạc có lộc, gia đạo thuận, và theo lời truyền thì đặc biệt dễ chịu với nữ giới. Đây thường được xem là năm hợp để vun vén, tích luỹ, sắp xếp lại tài chính trong nhà. Nên chủ động: giữ nhịp đều đặn, tận dụng sự yên ổn để lo những việc cần bền bỉ, và để ý sức khoẻ vào khoảng cuối năm như phong tục vẫn dặn. Ngộ nhận cần tránh: nghĩ "sao tốt chiếu" nghĩa là tiền tự đến. Lời truyền chỉ nói xu hướng thuận, phần còn lại vẫn do tay mình làm. Đọc theo hướng tham khảo thì Thái Âm là một quãng dễ thở trong chu kỳ 9 năm, không phải lời hứa.',
  },
  moc_duc: {
    key: 'moc_duc',
    name: 'Mộc Đức',
    type: 'tot',
    summary:
      'Cát tinh — bình an, hỷ sự, thuận hoà, hợp chuyện vui như cưới hỏi, sinh con.',
    advice: 'Năm an lành, hợp việc hỷ. Tận hưởng và giữ gìn sức khoẻ.',
    thang: 'Tháng tốt thường nhắc: tháng 10 và tháng 12 (âm).',
    origin: 'Mộc tinh (sao Mộc) — Brihaspati trong Navagraha.',
    deepDive:
      'Mộc Đức được dân gian xem là sao của chuyện vui: năm bình an, thuận hoà, hợp cưới hỏi, sinh con. Nhiều gia đình khi tính chuyện hỷ vẫn hay nhìn xem năm đó ai trong nhà "được" Mộc Đức chiếu. Nên chủ động: nếu có việc vui đã định thì đây là năm tâm lý thoải mái để tiến hành; đồng thời giữ gìn sức khoẻ để hưởng trọn sự an lành. Ngộ nhận cần tránh: chờ đúng năm Mộc Đức mới dám làm việc lớn, hoặc ngược lại tin rằng năm này miễn nhiễm mọi trục trặc. Sao chỉ là lời nhắc theo chu kỳ 9 năm, mang tính tham khảo; việc hệ trọng vẫn cần chuẩn bị kỹ như mọi năm khác.',
  },
  tho_tu: {
    key: 'tho_tu',
    name: 'Thổ Tú',
    type: 'trung',
    summary:
      'Sao trung bình — theo phong tục thiên về trắc trở vặt, hao hụt nhỏ; đi xa nên cẩn trọng.',
    advice: 'Giữ mọi việc ổn định, tránh thay đổi lớn không cần thiết; cẩn thận khi đi xa.',
    thang: 'Tháng cần lưu ý: tháng 4 và tháng 8 (âm).',
    origin: 'Thổ tinh (sao Thổ) — Shani trong Navagraha.',
    deepDive:
      'Thổ Tú thường được dân gian đọc là năm lắt nhắt: không có biến cố lớn nhưng dễ gặp trắc trở vặt, hao hụt nhỏ, việc chậm hơn dự tính. Lời truyền hay dặn thêm chuyện cẩn trọng khi đi xa. Nên chủ động: giữ mọi thứ ổn định, hoãn những thay đổi lớn không thật cần thiết, kiểm tra kỹ trước mỗi chuyến đi dài. Đây là kiểu năm hợp với việc củng cố hơn là bung sức. Ngộ nhận cần tránh: xếp Thổ Tú vào nhóm "sao xấu" rồi lo lắng quá mức. Nó là sao trung tính, nghĩa là năm bình thường có vài điểm cần để ý, không phải điềm dữ. Hãy đọc như lời nhắc của một chu kỳ lặp lại, không phải án.',
  },
  thuy_dieu: {
    key: 'thuy_dieu',
    name: 'Thủy Diệu',
    type: 'trung',
    summary:
      'Sao trung bình (một số trường phái xem là cát tinh nhẹ) — nhìn chung an lành, lợi cho đi xa và buôn bán; song theo phong tục kỵ sông nước.',
    advice: 'Năm tương đối nhẹ nhàng; cẩn thận các việc liên quan đến nước, bơi lội, đường thuỷ.',
    thang: 'Tháng cần lưu ý: tháng 4 và tháng 8 (âm).',
    origin: 'Thủy tinh (sao Thủy) — Budha trong Navagraha.',
    deepDive:
      'Thủy Diệu là sao trung tính, thậm chí có trường phái xem là cát tinh nhẹ: năm nhìn chung an lành, lợi cho việc đi lại, buôn bán. Điểm dặn dò quen thuộc nhất của dân gian là chuyện sông nước: bơi lội, tàu thuyền, đường thuỷ nên cẩn thận hơn. Nên chủ động: cứ làm việc bình thường, tận dụng sự nhẹ nhàng của năm; riêng các hoạt động gắn với nước thì thêm một lớp phòng bị, vốn là việc nên làm bất kể sao nào chiếu. Ngộ nhận cần tránh: vì chữ "kỵ nước" mà sợ hãi, không dám đi đâu. Lời truyền là nhắc phòng xa, không phải lệnh cấm. Một năm Thủy Diệu, về cơ bản, là năm dễ thở trong chu kỳ 9 năm.',
  },
  van_hon: {
    key: 'van_hon',
    name: 'Vân Hớn',
    type: 'trung',
    summary:
      'Sao trung bình (còn gọi Vân Hán, thuộc hành Hỏa) — theo phong tục dễ nóng giận, vướng thị phi lời nói, đau ốm nhẹ; nên cẩn thận lửa, điện, xe cộ.',
    advice: 'Giữ bình tĩnh, tránh tranh cãi và khẩu thiệt; chú ý sức khoẻ, lời nói.',
    thang: 'Tháng cần lưu ý: tháng 2 và tháng 8 (âm).',
    origin: 'Hỏa tinh (sao Hỏa) — Mangala trong Navagraha.',
    deepDive:
      'Vân Hớn (có nơi gọi Vân Hán) mang hình ảnh của lửa: dân gian đọc năm này là năm dễ nóng trong người, dễ to tiếng, vướng thị phi từ lời nói, đôi khi đau ốm vặt. Lời dặn đi kèm thường là cẩn thận lửa, điện, xe cộ. Nên chủ động: tập thói quen chậm lại một nhịp trước khi nói, nhất là lúc bực; chú ý an toàn khi dùng bếp, điện và khi đi đường. Đó đều là việc tốt cho bất kỳ năm nào, sao chỉ là cái cớ để bắt đầu. Ngộ nhận cần tránh: tưởng Vân Hớn là hung tinh. Theo cách chia phổ biến, nó thuộc nhóm trung tính, nghĩa là năm bình thường với vài điểm cần giữ ý, không phải năm đen đủi định sẵn.',
  },
  la_hau: {
    key: 'la_hau',
    name: 'La Hầu',
    type: 'xau',
    summary:
      'Hung tinh — theo quan niệm dân gian thiên về thị phi, miệng tiếng, giấy tờ pháp lý, và sức khoẻ (chú ý mắt, tai, máu huyết); nặng hơn với nam giới ("nam La Hầu").',
    advice: 'Năm nên giữ lời ăn tiếng nói, cẩn thận giấy tờ – pháp lý, giữ sức khoẻ. Bình tĩnh xử lý mâu thuẫn.',
    thang: 'Tháng thường nhắc cần thận trọng: tháng 1 và tháng 7 (âm).',
    origin:
      'Không phải sao thật: giao điểm Bắc nơi quỹ đạo Mặt Trăng cắt hoàng đạo (Rahu) — vùng trời xảy ra nhật thực, nguyệt thực.',
    deepDive:
      'La Hầu là cái tên khiến nhiều người lo nhất, phần vì câu truyền miệng "nam La Hầu" ám chỉ hạn nặng hơn với nam giới. Dân gian đọc năm này thiên về miệng tiếng, thị phi, rắc rối giấy tờ, và nhắc chú ý mắt, tai, máu huyết. Nên chủ động: nói ít lại ở chỗ dễ va chạm, đọc kỹ trước khi ký, khám sức khoẻ định kỳ. Toàn việc trong tầm tay. Ngộ nhận cần tránh: tin rằng gặp La Hầu là chắc chắn gặp hoạ nên phải "giải" cho bằng được. Nên nhớ La Hầu không phải sao thật, chỉ là giao điểm nơi quỹ đạo Mặt Trăng cắt hoàng đạo, vùng trời xảy ra nhật thực, nguyệt thực. Một chu kỳ tham khảo, không phải bản án.',
  },
  ke_do: {
    key: 'ke_do',
    name: 'Kế Đô',
    type: 'xau',
    summary:
      'Hung tinh — theo quan niệm dân gian thiên về buồn phiền, hao tài, thị phi, chuyện tang sự – âm phần; nặng hơn với nữ giới ("nữ Kế Đô"), nữ nên chú ý sức khoẻ và chuyện thai sản.',
    advice: 'Giữ tâm an, tránh thị phi và tranh chấp; cẩn trọng tiền bạc và sức khoẻ.',
    thang: 'Tháng thường nhắc cần thận trọng: tháng 3 và tháng 9 (âm).',
    origin:
      'Không phải sao thật: giao điểm Nam của quỹ đạo Mặt Trăng (Ketu) — cặp đối xứng với La Hầu.',
    deepDive:
      'Kế Đô đi thành cặp với La Hầu, và lời truyền dặn nặng hơn với nữ giới, quen thuộc qua câu "nữ Kế Đô". Năm này thường được đọc là năm dễ buồn phiền, hao tài, vướng thị phi; phụ nữ được nhắc chú ý sức khoẻ, nhất là chuyện thai sản. Nên chủ động: giữ tâm ổn, bớt tham gia tranh chấp, quản chi tiêu chặt hơn, khám sức khoẻ đều đặn. Ngộ nhận cần tránh: đọc thấy chữ "tang sự" trong sách phong tục rồi hoảng sợ chuyện dữ sắp đến. Lời truyền là lời nhắc giữ gìn, không phải tiên đoán. Cũng như La Hầu, Kế Đô không phải sao thật mà là giao điểm Nam của quỹ đạo Mặt Trăng. Hiểu vậy rồi sẽ thấy đây là chu kỳ tham khảo, không phải án treo.',
  },
  thai_bach: {
    key: 'thai_bach',
    name: 'Thái Bạch',
    type: 'xau',
    summary:
      'Hung tinh (dân gian có câu "Thái Bạch quét sạch cửa nhà") — thiên về hao tài, mất mát; cổ truyền còn nhắc cẩn thận đao thương, tai nạn. Nặng hơn với nam giới.',
    advice: 'Năm nên thận trọng chi tiêu, đầu tư, cho vay; tránh quyết định tài chính lớn khi chưa chắc.',
    thang: 'Tháng thường nhắc cần thận trọng: tháng 5 (âm); một số nguồn cổ nhắc thêm tháng 2 và 8.',
    origin: 'Kim tinh (sao Kim) — Shukra trong Navagraha; "sao Thái Bạch" chính là Kim tinh lúc rạng sáng/chập tối.',
    deepDive:
      'Thái Bạch nổi tiếng vì câu "Thái Bạch quét sạch cửa nhà", nên dân gian đọc năm này là năm phải giữ túi tiền: hạn chế đầu tư liều, cân nhắc khi cho vay, tránh quyết định tài chính lớn lúc chưa chắc chắn. Sách cổ truyền còn dặn cẩn thận đao thương, tai nạn. Nên chủ động: lập kế hoạch chi tiêu rõ ràng từ đầu năm, việc tiền bạc lớn thì hỏi thêm người có chuyên môn, đi lại chú ý an toàn. Ngộ nhận cần tránh: nghĩ rằng đã "bị" Thái Bạch thì giữ mấy cũng mất, buông xuôi hoặc hoảng loạn. Thái Bạch thực chất là Kim tinh, ngôi sao sáng lúc rạng sáng và chập tối. Hãy đọc nó như lời nhắc trong một chu kỳ 9 năm, không phải án phạt định sẵn.',
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

/** Năm dương đang dùng để xem hạn (mặc định = năm hiện tại theo giờ VN). */
export function currentViewYear(): number {
  return getVietnamDateParts().year;
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
