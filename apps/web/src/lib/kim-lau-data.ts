/**
 * Dữ liệu landing "Kim Lâu" — /kim-lau.
 *
 * THUẦN TÍNH TOÁN — không React/AI/backend. Grounded 100% trên engine đã kiểm
 * chứng `lib/xem-tuoi-cuoi.checkKimLau` (tuổi mụ chia 9, dư 1/3/6/8 → phạm; theo
 * tục cưới hỏi xét chủ yếu tuổi mụ của CÔ DÂU).
 *
 * GIỌNG ON-BRAND: phong tục để THAM KHẢO, không phán số mệnh, không hù doạ,
 * không bán lễ "giải hạn".
 */
import { checkKimLau, type KimLauType } from './xem-tuoi-cuoi';

export interface KimLauTypeInfo {
  /** Số dư tuổi mụ chia 9. */
  remainder: number;
  type: KimLauType;
  /** Ghi chú dân gian (lấy thẳng từ engine, không tự chế). */
  note: string;
}

/**
 * 4 loại Kim Lâu — suy TRỰC TIẾP từ engine (gọi checkKimLau ở tuổi mụ = dư) để
 * không lệch với bảng gốc. ageMu = r (r < 9) ⇒ remainder = r.
 */
export const KIM_LAU_TYPES: KimLauTypeInfo[] = [1, 3, 6, 8].map((r) => {
  const k = checkKimLau(2000, 2000 + r - 1);
  return { remainder: r, type: k.type as KimLauType, note: k.note as string };
});

/** Các tuổi mụ phạm Kim Lâu trong khoảng [1, maxAge] — bảng tham khảo, timeless. */
export function phamAges(maxAge = 49): number[] {
  const out: number[] = [];
  for (let a = 1; a <= maxAge; a += 1) {
    const r = a % 9;
    if (r === 1 || r === 3 || r === 6 || r === 8) out.push(a);
  }
  return out;
}

export interface KimLauYear {
  year: number;
  /** Tuổi mụ của người sinh năm đã cho, tại `year`. */
  ageMu: number;
  isKimLau: boolean;
  type?: KimLauType;
}

/**
 * Cho năm sinh (cô dâu), liệt kê `count` năm kể từ `fromYear` kèm trạng thái
 * Kim Lâu — dùng cho finder ("các năm tới năm nào nên tránh cưới").
 */
export function kimLauYearsAhead(birthYear: number, fromYear: number, count = 8): KimLauYear[] {
  const out: KimLauYear[] = [];
  for (let i = 0; i < count; i += 1) {
    const year = fromYear + i;
    const k = checkKimLau(birthYear, year);
    out.push({ year, ageMu: k.ageMu, isKimLau: Boolean(k.type), type: k.type });
  }
  return out;
}

export const KIM_LAU_FAQS: { q: string; a: string }[] = [
  {
    q: 'Kim Lâu là gì?',
    a: 'Kim Lâu là một quan niệm trong phong tục cưới hỏi: xét tuổi mụ (tuổi âm) của cô dâu trong năm dự định cưới. Nếu tuổi mụ chia 9 dư 1, 3, 6 hoặc 8 thì gọi là "phạm Kim Lâu" và dân gian khuyên cân nhắc. Đây là tục lệ để tham khảo, không phải lời phán số mệnh.',
  },
  {
    q: 'Tuổi mụ là gì và tính thế nào?',
    a: 'Tuổi mụ (tuổi âm) = năm xem − năm sinh + 1, tức tính cả năm sinh là 1 tuổi. Ví dụ sinh năm 2000, xét năm 2026 thì tuổi mụ là 27. Lấy tuổi mụ chia 9, xem số dư có rơi vào 1/3/6/8 không.',
  },
  {
    q: 'Phạm Kim Lâu thì có cưới được không?',
    a: 'Được. Kim Lâu là tục lệ tham khảo, không phải lệnh cấm. Cách phổ biến và nhẹ nhàng nhất là chọn năm cô dâu KHÔNG phạm Kim Lâu (công cụ ở trên cho biết ngay các năm tới năm nào thuận). hieu.asia trình bày cách tính minh bạch để bạn tự quyết, không bán lễ "giải hạn".',
  },
  {
    q: 'Vì sao chỉ xét tuổi cô dâu?',
    a: 'Theo tục cưới hỏi truyền thống, Kim Lâu xét chủ yếu tuổi mụ của cô dâu. Đây là nét phong tục; bạn hoàn toàn có thể coi đó là một thông tin tham khảo bên cạnh nhiều yếu tố thực tế khác khi chọn ngày cưới.',
  },
  {
    q: 'Kim Lâu khác Tam Tai và xung Thái Tuế thế nào?',
    a: 'Cả ba đều là cách xem tuổi cưới theo phong tục nhưng khác nhau: Kim Lâu tính theo tuổi mụ cô dâu chia 9; Tam Tai theo nhóm tam hợp năm sinh (3 năm/chu kỳ 12 năm); xung Thái Tuế là khi con giáp của bạn xung với con giáp của năm. Công cụ Xem tuổi cưới của hieu.asia tính cả ba cùng lúc.',
  },
];
