// hieu.asia — Tiện ích học lý Kinh Dịch: Bát Quái + ý nghĩa vị trí hào động.
// Giọng: cấu trúc học (không phải hào-từ cổ văn → tránh bản quyền),
//        trung lập, gợi mở suy ngẫm.

/** Thông tin một quái trong Bát Quái cơ bản. */
export interface Trigram {
  /** Tên quái: Càn, Khôn, Chấn, Tốn, Khảm, Ly, Cấn, Đoài. */
  ten: string;
  /** Biểu tượng thiên nhiên: Trời, Đất, Sấm, Gió, Nước, Lửa, Núi, Đầm. */
  tuong: string;
  /** Ngũ hành: Kim, Thổ, Mộc, Thủy, Hỏa. */
  hanh: string;
  /** Emoji biểu tượng. */
  icon: string;
}

/**
 * Map 3-bit → Bát Quái.
 * Quy ước bit: đọc theo thứ tự HÀO (hào 6→4 cho Thượng quái; hào 3→1 cho Hạ quái).
 * Trong binary của quẻ: binary.slice(0,3) = Thượng quái, binary.slice(3,6) = Hạ quái.
 * Key "1" = dương (nét liền), "0" = âm (nét đứt).
 *
 * Kiểm tra:
 * - Thái (#11) binary="000111" → upper="000"=Khôn, lower="111"=Càn → Địa Thiên Thái ✓
 * - Truân (#3) binary="010001" → upper="010"=Khảm, lower="001"=Chấn → Thủy Lôi Truân ✓
 */
export const BAT_QUAI: Record<string, Trigram> = {
  '111': { ten: 'Càn',  tuong: 'Trời', hanh: 'Kim',   icon: '☰' },
  '011': { ten: 'Đoài', tuong: 'Đầm',  hanh: 'Kim',   icon: '☱' },
  '101': { ten: 'Ly',   tuong: 'Lửa',  hanh: 'Hỏa',   icon: '☲' },
  '001': { ten: 'Chấn', tuong: 'Sấm',  hanh: 'Mộc',   icon: '☳' },
  '110': { ten: 'Tốn',  tuong: 'Gió',  hanh: 'Mộc',   icon: '☴' },
  '010': { ten: 'Khảm', tuong: 'Nước', hanh: 'Thủy',  icon: '☵' },
  '100': { ten: 'Cấn',  tuong: 'Núi',  hanh: 'Thổ',   icon: '☶' },
  '000': { ten: 'Khôn', tuong: 'Đất',  hanh: 'Thổ',   icon: '☷' },
};

/** Lấy Thượng quái và Hạ quái từ chuỗi binary 6 ký tự. */
export function parseTrigrams(binary: string): { upper: Trigram; lower: Trigram } | null {
  if (binary.length !== 6) return null;
  const upper = BAT_QUAI[binary.slice(0, 3)];
  const lower = BAT_QUAI[binary.slice(3, 6)];
  if (!upper || !lower) return null;
  return { upper, lower };
}

/** Ý nghĩa học lý của từng VỊ TRÍ hào trong quẻ (1–6).
 *  Căn cứ cấu trúc hệ thống (vị trí không gian + thời gian trong quẻ).
 *  KHÔNG phải hào-từ của từng quẻ cụ thể; KHÔNG phải nguyên văn cổ.
 */
export const HAO_VI_TRI: Record<number, { ten: string; mo_ta: string }> = {
  1: {
    ten: 'Sơ hào (hào 1 — đáy quẻ)',
    mo_ta:
      'Vị trí khởi đầu, gần nhất với nền móng. Thường chỉ giai đoạn mới bắt đầu: còn thiếu kinh nghiệm nhưng giàu tiềm năng. Lúc này ẩn mình quan sát và xây nền quan trọng hơn vội tiến.',
  },
  2: {
    ten: 'Nhị hào (hào 2)',
    mo_ta:
      'Vị trí giữa Hạ quái — trọng tâm của nửa dưới. Thường biểu trưng cho người nội tâm vững, có khả năng điều hòa bên trong. Ở đây có thể hành động mà không cần phô trương nhiều.',
  },
  3: {
    ten: 'Tam hào (hào 3 — giao điểm)',
    mo_ta:
      'Vị trí trên cùng của Hạ quái — nơi chuyển tiếp sang Thượng quái. Đây thường là điểm căng thẳng: đã ở giới hạn dưới mà chưa thuộc hẳn tầng trên, dễ gặp cọ xát và áp lực. Thận trọng ở ngưỡng cửa chuyển đổi.',
  },
  4: {
    ten: 'Tứ hào (hào 4)',
    mo_ta:
      'Vị trí đầu tiên trong Thượng quái — vừa bước vào tầng trên, gần với vị trí cao nhất nhưng chưa phải đỉnh. Cần linh hoạt và khiêm nhường để tránh xung đột với những vị trí quyền lực ở tầng trên.',
  },
  5: {
    ten: 'Ngũ hào (hào 5 — vị trung chính)',
    mo_ta:
      'Vị trí giữa Thượng quái, thường được coi là vị trí lý tưởng nhất: đủ cao để nhìn xa, đủ trung để không lệch cực. Chỉ cảnh huống mà tình thế chín muồi, việc có thể hành động với tầm ảnh hưởng rộng.',
  },
  6: {
    ten: 'Thượng hào (hào 6 — đỉnh quẻ)',
    mo_ta:
      'Vị trí cao nhất — đã vượt qua toàn bộ chu kỳ. Đây có thể là điểm hoàn thành, nhưng cũng là lúc cực thịnh bắt đầu chuyển. Truyền thống thường nhắc: đỉnh không phải nơi cố trụ, mà là nơi chuẩn bị thoái hoặc chuyển sang chu kỳ mới.',
  },
};

/** Lấy mô tả vị trí hào động, trả null nếu số hào ngoài 1–6. */
export function getHaoDongMota(haoSo: number): { ten: string; mo_ta: string } | null {
  return HAO_VI_TRI[haoSo] ?? null;
}
