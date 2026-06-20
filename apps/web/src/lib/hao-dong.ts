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

/**
 * Loại "trọng tâm nên đọc" theo luật Chu Hy (朱熹《易學啟蒙》 — phép xét theo SỐ hào động).
 *  - 'gua-primary': đọc lời QUẺ (thoán/quái từ) của quẻ CHÍNH.
 *  - 'line':        đọc HÀO TỪ của các hào (động hoặc tĩnh tuỳ trường hợp).
 *  - 'gua-changed': đọc lời QUẺ của quẻ BIẾN.
 *  - 'dung':        đọc lời "dụng cửu / dụng lục" (chỉ Thuần Càn / Thuần Khôn khi 6 hào động).
 */
export type ReadingFocusKind = 'gua-primary' | 'line' | 'gua-changed' | 'dung';

export interface ReadingFocus {
  /** Tên luật theo số hào động (vd "0 hào động", "2 hào động"). */
  rule: string;
  /** Loại văn bản nên đọc làm trọng tâm. */
  primary: ReadingFocusKind;
  /**
   * Các SỐ HÀO (1–6) cần đọc hào-từ, nếu có. Sắp tăng dần.
   * Rỗng với các trường hợp đọc lời quẻ ('gua-primary'/'gua-changed'/'dung').
   * Với primary === 'line', phần tử ĐẦU là hào chủ đạo? Không — xem `chuDao`.
   */
  lines: number[];
  /**
   * Hào CHỦ ĐẠO (1–6) khi phải so sánh nhiều hào (2 hào động → hào trên;
   * 4 hào động → hào tĩnh dưới). null nếu không áp dụng (chỉ 1 hào, hoặc đọc lời quẻ).
   */
  chuDao: number | null;
  /** Giải thích ngắn bằng tiếng Việt, giọng gợi mở (không phán quyết). */
  note: string;
}

/**
 * Xác định TRỌNG TÂM nên đọc theo luật Chu Hy 朱熹《易學啟蒙》, hoàn toàn TẤT ĐỊNH
 * từ SỐ hào động (count-based method).
 *
 * Luật (số hào động → đọc gì, hào nào chủ đạo):
 *  - 0: đọc lời quẻ (thoán) của quẻ CHÍNH.
 *  - 1: đọc hào-từ của ĐÚNG hào động đó (chính nó là chủ đạo).
 *  - 2: đọc hào-từ của CẢ HAI hào động; hào TRÊN (số lớn hơn) là chủ đạo.
 *  - 3: đọc lời quẻ của CẢ quẻ chính và quẻ biến; quẻ CHÍNH chủ đạo.
 *  - 4: đọc hào-từ của 2 hào TĨNH (không động) trên QUẺ BIẾN; hào DƯỚI (số nhỏ hơn) chủ đạo.
 *  - 5: đọc hào-từ của 1 hào TĨNH duy nhất trên QUẺ BIẾN.
 *  - 6: nếu là Thuần Càn / Thuần Khôn → đọc "dụng cửu / dụng lục";
 *       ngược lại → đọc lời quẻ của QUẺ BIẾN.
 *
 * @param movingLineIndexes Mảng SỐ HÀO động (1–6). Thứ tự đầu vào không quan trọng.
 * @param isPrimaryQianKun  true nếu quẻ CHÍNH là Thuần Càn hoặc Thuần Khôn (chỉ ảnh hưởng case 6 hào).
 *
 * @remarks `lines` cho case 4/5 là các hào TĨNH (đọc trên quẻ biến). Để suy ra,
 *          ta lấy phần bù của tập hào động trong {1..6}.
 */
export function readingFocus(
  movingLineIndexes: number[],
  isPrimaryQianKun = false,
): ReadingFocus {
  // Chuẩn hoá: lọc giá trị hợp lệ 1–6, loại trùng, sắp tăng dần — bảo đảm tất định.
  const moving = Array.from(new Set(movingLineIndexes.filter((n) => n >= 1 && n <= 6))).sort(
    (a, b) => a - b,
  );
  const count = moving.length;
  // Hào tĩnh = phần bù của hào động trong {1,2,3,4,5,6}, sắp tăng dần.
  const staticLines = [1, 2, 3, 4, 5, 6].filter((n) => !moving.includes(n));

  switch (count) {
    case 0:
      return {
        rule: '0 hào động',
        primary: 'gua-primary',
        lines: [],
        chuDao: null,
        note: 'Quẻ tĩnh — không có hào nào đang chuyển. Theo phép Chu Hy, hãy đọc LỜI QUẺ (thoán từ) của quẻ chính để soi thế cục chung.',
      };
    case 1: {
      // count === 1 đảm bảo moving = [hao]; destructure để TS biết hao là number.
      const [hao] = moving as [number];
      return {
        rule: '1 hào động',
        primary: 'line',
        lines: [hao],
        chuDao: hao,
        note: `Đúng một hào động — hào ${hao} là trọng tâm. Hãy đọc hào-từ của riêng hào này; nó là nơi tình huống đang chuyển rõ nhất.`,
      };
    }
    case 2: {
      const [lower, upper] = moving as [number, number]; // upper = hào trên (số lớn hơn)
      return {
        rule: '2 hào động',
        primary: 'line',
        lines: moving,
        chuDao: upper,
        note: `Hai hào động (${lower} và ${upper}) — đọc cả hai hào-từ, nhưng lấy hào TRÊN (hào ${upper}) làm chủ đạo khi cân nhắc.`,
      };
    }
    case 3:
      return {
        rule: '3 hào động',
        primary: 'gua-primary',
        lines: [],
        chuDao: null,
        note: 'Ba hào động — đọc LỜI QUẺ của cả quẻ chính lẫn quẻ biến; quẻ CHÍNH giữ vai chủ đạo (thế cục hiện tại trọng hơn hướng chuyển).',
      };
    case 4: {
      // count === 4 → đúng 2 hào tĩnh; hào dưới = số nhỏ hơn.
      const [lowerStatic, upperStatic] = staticLines as [number, number];
      return {
        rule: '4 hào động',
        primary: 'line',
        lines: staticLines, // 2 hào tĩnh, đọc trên QUẺ BIẾN
        chuDao: lowerStatic,
        note: `Bốn hào động — chuyển trọng tâm sang QUẺ BIẾN: đọc hào-từ của 2 hào TĨNH (hào ${lowerStatic} và hào ${upperStatic}) trên quẻ biến, lấy hào DƯỚI (hào ${lowerStatic}) làm chủ đạo.`,
      };
    }
    case 5: {
      // count === 5 → đúng 1 hào tĩnh.
      const [onlyStatic] = staticLines as [number];
      return {
        rule: '5 hào động',
        primary: 'line',
        lines: staticLines, // 1 hào tĩnh duy nhất, đọc trên QUẺ BIẾN
        chuDao: onlyStatic,
        note: `Năm hào động — đọc hào-từ của hào TĨNH duy nhất còn lại (hào ${onlyStatic}) trên QUẺ BIẾN; đó là điểm tựa duy nhất chưa chuyển.`,
      };
    }
    case 6:
      if (isPrimaryQianKun) {
        return {
          rule: '6 hào động · Thuần Càn/Khôn',
          primary: 'dung',
          lines: [],
          chuDao: null,
          note: 'Sáu hào đều động ở Thuần Càn hoặc Thuần Khôn — trường hợp đặc biệt: đọc lời "dụng cửu" (Càn) hoặc "dụng lục" (Khôn), thay vì lời quẻ thường.',
        };
      }
      return {
        rule: '6 hào động',
        primary: 'gua-changed',
        lines: [],
        chuDao: null,
        note: 'Sáu hào đều động — toàn bộ thế cục đã lật. Đọc LỜI QUẺ của quẻ BIẾN; tình huống đã chuyển hẳn sang trạng thái mới.',
      };
    default:
      // Không thể xảy ra với mảng 6 hào, nhưng giữ tất định để TS yên tâm.
      return {
        rule: `${count} hào động`,
        primary: 'gua-primary',
        lines: [],
        chuDao: null,
        note: 'Số hào động ngoài phạm vi 0–6 — quay về đọc lời quẻ của quẻ chính.',
      };
  }
}
