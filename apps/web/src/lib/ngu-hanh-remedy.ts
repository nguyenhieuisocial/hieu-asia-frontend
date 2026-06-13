/**
 * Gợi ý bổ khuyết ngũ hành theo lá số Tử Vi.
 *
 * Quy tắc ngũ hành dùng ở đây:
 *   Tương sinh: Mộc → Hỏa → Thổ → Kim → Thủy → Mộc
 *   Tương khắc: Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa,
 *               Hỏa khắc Kim, Kim khắc Mộc
 *
 * Nguồn quy tắc: Ngũ Hành học cổ điển Trung Hoa (Bộ sưu tập Huangdi Neijing
 * + Dong Zhongshu "Chun Qiu Fan Lu"); bảng hướng/màu theo truyền thống
 * Phong Thủy và Tứ Trụ phổ biến nhất tại Việt Nam.
 *
 * Lưu ý thương hiệu: đây là GỢI Ý THAM KHẢO, không phải lời phán về số mệnh.
 */

export type HanhCore = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

export interface NguHanhRemedy {
  /** Hành chủ đạo của lá số (từ Cục). */
  hanh: HanhCore;
  /** Màu sắc hợp theo hành chủ đạo + hành sinh ra nó. */
  mauHop: string[];
  /** Hướng tốt theo hành. */
  huongTot: string[];
  /** Nhóm nghề phù hợp với hành. */
  ngheHop: string[];
  /** Vật phẩm / môi trường hỗ trợ hành. */
  vatPham: string[];
  /** 1–2 lời khuyên hành động. */
  loiKhuyen: string[];
}

/**
 * Map tra cứu toàn bộ gợi ý theo hành.
 *
 * Màu sắc:
 *   Kim → trắng, bạc, vàng kim (Kim + Thổ sinh Kim → thêm màu vàng đất)
 *   Mộc → xanh lá, xanh lục (Thủy sinh Mộc → thêm màu xanh non)
 *   Thủy → đen, xanh đen, xanh đậm (Kim sinh Thủy → thêm màu bạc)
 *   Hỏa → đỏ, cam, hồng (Hỏa = nhiệt, ánh sáng — đỏ/cam/hồng đậm/hồng)
 *   Thổ → vàng, nâu, cam đất (Hỏa sinh Thổ → thêm màu đỏ đất)
 *
 * Hướng theo Ngũ Hành / Phong Thủy:
 *   Kim → Tây, Tây Bắc
 *   Mộc → Đông, Đông Nam
 *   Thủy → Bắc
 *   Hỏa → Nam
 *   Thổ → Trung tâm, Đông Bắc, Tây Nam
 */
const REMEDY_MAP: Record<HanhCore, Omit<NguHanhRemedy, 'hanh'>> = {
  Kim: {
    mauHop: ['Trắng', 'Bạc', 'Vàng kim', 'Vàng nhạt'],
    huongTot: ['Tây', 'Tây Bắc'],
    ngheHop: [
      'Tài chính, ngân hàng, kế toán',
      'Kỹ thuật, cơ khí, công nghệ phần cứng',
      'Luật, hành chính, tổ chức',
      'Y tế, nha khoa, phẫu thuật',
    ],
    vatPham: [
      'Đồ kim loại (đồng, bạc, thép không gỉ)',
      'Đá trắng, đá cẩm thạch',
      'Không gian thoáng, ngăn nắp, màu trung tính',
      'Nhạc cụ dây kim loại (đàn tranh, violin)',
    ],
    loiKhuyen: [
      'Xây dựng kỷ luật cá nhân và hệ thống làm việc rõ ràng — Kim mạnh ở tổ chức và độ bền.',
      'Chú ý điều chỉnh độ cứng nhắc: hành Kim dễ quá quyết đoán — tập lắng nghe trước khi kết luận.',
    ],
  },
  Mộc: {
    mauHop: ['Xanh lá', 'Xanh lục', 'Xanh ngọc', 'Xanh non'],
    huongTot: ['Đông', 'Đông Nam'],
    ngheHop: [
      'Giáo dục, đào tạo, tư vấn',
      'Nông nghiệp, lâm nghiệp, môi trường',
      'Nghệ thuật, viết lách, xuất bản',
      'Y học cổ truyền, thảo dược',
    ],
    vatPham: [
      'Cây xanh, hoa tươi, chậu cây trong nhà',
      'Đồ gỗ tự nhiên, tre, mây',
      'Không gian có nhiều cửa sổ đón ánh sáng',
      'Màu xanh lá trong trang trí nội thất',
    ],
    loiKhuyen: [
      'Phát triển theo hướng mở rộng và học hỏi liên tục — Mộc tượng trưng cho sự tăng trưởng và vươn lên.',
      'Chú ý dàn trải quá nhiều hướng: tập trung ít lĩnh vực để phát triển chiều sâu trước khi mở rộng.',
    ],
  },
  Thủy: {
    mauHop: ['Đen', 'Xanh đen', 'Xanh đậm', 'Bạc lạnh'],
    huongTot: ['Bắc'],
    ngheHop: [
      'Nghiên cứu, phân tích dữ liệu, khoa học',
      'Vận tải, thương mại quốc tế, logistics',
      'Triết học, tâm lý học, tư vấn tâm lý',
      'Nghệ thuật âm nhạc, điện ảnh, truyền thông',
    ],
    vatPham: [
      'Các vật thể liên quan đến nước: bể cá, đài phun nước nhỏ',
      'Màu tối (xanh navy, xanh đen) trong phòng làm việc',
      'Đồ thủy tinh, gương trang trí',
      'Không gian yên tĩnh, ít ồn để suy nghĩ sâu',
    ],
    loiKhuyen: [
      'Tận dụng khả năng thích nghi và linh hoạt — Thủy chảy quanh mọi chướng ngại vật thay vì đối đầu trực tiếp.',
      'Cẩn thận với xu hướng thiếu quyết đoán: Thủy dễ dao động — đặt mục tiêu rõ ràng và giữ nhất quán theo thời gian.',
    ],
  },
  Hỏa: {
    mauHop: ['Đỏ', 'Cam', 'Hồng đậm', 'Hồng'],
    huongTot: ['Nam'],
    ngheHop: [
      'Truyền thông, marketing, quảng cáo',
      'Giải trí, biểu diễn, nghệ thuật sân khấu',
      'Lãnh đạo, kinh doanh, khởi nghiệp',
      'Thể thao, huấn luyện, năng lượng tái tạo',
    ],
    vatPham: [
      'Nến, đèn ấm, ánh sáng vàng cam',
      'Màu đỏ hoặc cam trong trang phục (không cần toàn thân)',
      'Cây có hoa màu đỏ/cam (hoa hồng đỏ, hoa cúc vạn thọ)',
      'Không gian làm việc sáng, nhiều ánh sáng tự nhiên',
    ],
    loiKhuyen: [
      'Khai thác nhiệt huyết và khả năng truyền cảm hứng cho người xung quanh — Hỏa toả sáng khi đứng trước đám đông.',
      'Chú ý quản lý cảm xúc và năng lượng: Hỏa bùng mạnh nhưng dễ tắt nhanh — xây dựng thói quen duy trì đều đặn.',
    ],
  },
  Thổ: {
    mauHop: ['Vàng', 'Nâu đất', 'Cam đất', 'Be, kem'],
    huongTot: ['Trung tâm', 'Đông Bắc', 'Tây Nam'],
    ngheHop: [
      'Bất động sản, xây dựng, kiến trúc',
      'Nông nghiệp, thực phẩm, nhà hàng',
      'Kế toán, quản lý tài sản, bảo hiểm',
      'Chăm sóc sức khỏe, phục hồi chức năng',
    ],
    vatPham: [
      'Đồ gốm sứ, đá tự nhiên, gạch đất nung',
      'Màu vàng đất, nâu ấm trong nội thất',
      'Cây mọng nước, xương rồng (biểu tượng tích trữ)',
      'Không gian ổn định, ít thay đổi thường xuyên',
    ],
    loiKhuyen: [
      'Phát huy sự ổn định và đáng tin cậy — Thổ là nền tảng giúp mọi thứ xung quanh phát triển vững chắc.',
      'Chú ý tránh quá bảo thủ: Thổ vững nhưng dễ trì trệ — đặt mục tiêu đổi mới nhỏ đều đặn thay vì thay đổi lớn bất ngờ.',
    ],
  },
};

/**
 * Trích xuất hành chủ đạo từ chuỗi `fiveElementsClass` của iztro.
 *
 * iztro trả về định dạng "Thủy Nhị Cục" / "Mộc tam cục" / "Kim tứ cục" /
 * "Thổ ngũ cục" / "Hỏa lục cục" (tiếng Việt).
 * Hàm lấy từ đầu tiên trong chuỗi làm tên hành.
 *
 * @returns HanhCore nếu parse được, null nếu không nhận dạng được.
 */
export function extractHanh(fiveElementsClass: string): HanhCore | null {
  const trimmed = fiveElementsClass.trim();
  if (trimmed.startsWith('Kim')) return 'Kim';
  if (trimmed.startsWith('Mộc')) return 'Mộc';
  if (trimmed.startsWith('Thủy')) return 'Thủy';
  if (trimmed.startsWith('Hỏa')) return 'Hỏa';
  if (trimmed.startsWith('Thổ')) return 'Thổ';
  return null;
}

/**
 * Trả về toàn bộ gợi ý bổ khuyết cho một hành chủ đạo.
 * Input là chuỗi `fiveElementsClass` từ TuViChartMeta.
 *
 * @returns NguHanhRemedy nếu parse được, null nếu hành không xác định.
 */
export function getNguHanhRemedy(fiveElementsClass: string): NguHanhRemedy | null {
  const hanh = extractHanh(fiveElementsClass);
  if (!hanh) return null;
  return { hanh, ...REMEDY_MAP[hanh] };
}
