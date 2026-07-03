/**
 * Diễn giải Bát Tự bằng NGÔN NGỮ ĐỜI THƯỜNG — nguồn dùng chung cho teaser
 * OracleBrain (và các UI Bát Tự khác khi cần).
 *
 * Nguyên tắc biên tập (đồng bộ con-giap-data / cung-hoang-dao-data):
 *  - Hình ảnh + nghĩa theo SÁCH VỞ PHỔ BIẾN của môn Bát Tự (thiên can = 10 hình
 *    tượng kinh điển; Thập Thần = 10 vai trò chuẩn) — KHÔNG phán định, trình bày
 *    dạng "xu hướng tham khảo".
 *  - Key PHẢI khớp 100% chuỗi engine `bazi.ts` sinh ra (CAN[], thapThan()) —
 *    có test bao phủ để không bao giờ lệch.
 */

/** Hình tượng + nghĩa đời thường của 10 Thiên Can (Nhật Chủ = "chất gốc" của bạn). */
export const CAN_PLAIN: Record<string, { hinh: string; blurb: string }> = {
  Giáp: {
    hinh: 'cây đại thụ',
    blurb: 'Vươn thẳng, kiên định, thích dẫn đầu và che chở người khác; hợp vai trò mở đường.',
  },
  Ất: {
    hinh: 'hoa cỏ, dây leo',
    blurb: 'Mềm dẻo, khéo thích nghi, bền bỉ len lỏi qua khó khăn; mạnh về sự tinh tế và kết nối.',
  },
  Bính: {
    hinh: 'mặt trời',
    blurb: 'Ấm áp, hào phóng, tỏa năng lượng cho người xung quanh; hợp việc cần nhiệt huyết và sân khấu.',
  },
  Đinh: {
    hinh: 'ngọn đèn, lửa nến',
    blurb: 'Sáng âm ỉ mà bền, tinh tế và sâu sắc; giỏi truyền cảm hứng gần gũi, một-kèm-một.',
  },
  Mậu: {
    hinh: 'núi lớn, đất dày',
    blurb: 'Vững chãi, đáng tin, chịu áp lực tốt; là chỗ dựa của tập thể, hợp việc cần độ ổn định.',
  },
  Kỷ: {
    hinh: 'đất ruộng màu mỡ',
    blurb: 'Nuôi dưỡng, chu đáo, âm thầm vun bồi cho người khác lớn lên; mạnh về chăm sóc và tổ chức.',
  },
  Canh: {
    hinh: 'kim loại thô, thanh kiếm',
    blurb: 'Quyết đoán, thẳng thắn, càng va đập càng sắc bén; hợp môi trường thử thách, cần kỷ luật.',
  },
  Tân: {
    hinh: 'kim tinh luyện, trang sức',
    blurb: 'Tinh xảo, chuộng chất lượng và thẩm mỹ, để ý chi tiết; tỏa sáng khi được mài giũa đúng chỗ.',
  },
  Nhâm: {
    hinh: 'sông lớn, biển cả',
    blurb: 'Thông minh, linh hoạt, tầm nhìn rộng và thích tự do; mạnh về chiến lược và giao thương.',
  },
  Quý: {
    hinh: 'mưa xuân, sương sớm',
    blurb: 'Nhạy cảm, trực giác tốt, thấm sâu bền bỉ; giỏi quan sát và nuôi ý tưởng lặng lẽ thành hình.',
  },
};

/** Nghĩa đời thường của 10 Thập Thần (vai trò của một trụ so với Nhật Chủ). */
export const TEN_GOD_PLAIN: Record<string, string> = {
  'Tỷ Kiên': 'năng lượng tự lập, tự đứng trên đôi chân mình; mạnh về cạnh tranh lành mạnh và tình bạn đồng vai.',
  'Kiếp Tài': 'năng lượng hành động nhanh, dám tranh thủ cơ hội; cần học cách giữ nhịp chi tiêu và hợp tác.',
  'Thực Thần': 'năng lượng sáng tạo, hưởng thụ và thể hiện; hợp nghệ thuật, ẩm thực, những gì làm bằng cảm hứng.',
  'Thương Quan': 'năng lượng phá cách, nói thẳng và đổi mới; tài năng lộ rõ nhưng nên khéo với khuôn phép.',
  'Chính Tài': 'năng lượng tích lũy chắc chắn, quản lý tiền bạc và cam kết đều đặn; hợp làm ăn bài bản.',
  'Thiên Tài': 'năng lượng kiếm cơ hội nhạy bén, tiền vào theo dòng linh hoạt; hợp kinh doanh, đầu tư xoay nhanh.',
  'Chính Quan': 'năng lượng kỷ luật, trách nhiệm và uy tín; hợp môi trường có cấu trúc, thăng tiến theo bậc thang.',
  'Thất Sát': 'năng lượng quyết liệt, dám đương đầu áp lực lớn; là "tướng trận" khi được rèn đúng hướng.',
  'Chính Ấn': 'năng lượng học vấn, được nâng đỡ và bảo chứng; hợp con đường tri thức, chuyên môn sâu.',
  'Thiên Ấn': 'năng lượng trực giác, tư duy khác lối mòn; hợp nghiên cứu độc lập, nghề đặc thù ít người đi.',
  'Nhật Chủ': 'chính là bạn — điểm neo để đọc mọi trụ còn lại.',
};

/** Nghĩa đời thường của 5 hành khi VƯỢNG (trội) hoặc THIẾU trong lá số. */
export const NGU_HANH_PLAIN: Record<string, { vuong: string; thieu: string }> = {
  Mộc: {
    vuong: 'giàu ý tưởng phát triển, thích học hỏi vươn lên',
    thieu: 'nên bổ trợ chất "mộc": màu xanh lá, cây cối, thói quen học đều',
  },
  Hỏa: {
    vuong: 'nhiệt huyết, truyền lửa, hành động nhanh',
    thieu: 'nên bổ trợ chất "hỏa": màu đỏ/cam, vận động, sự sôi nổi',
  },
  Thổ: {
    vuong: 'ổn định, thực tế, đáng tin cậy',
    thieu: 'nên bổ trợ chất "thổ": màu vàng/nâu, nếp sinh hoạt đều đặn',
  },
  Kim: {
    vuong: 'kỷ luật, quyết đoán, chuộng sự chuẩn xác',
    thieu: 'nên bổ trợ chất "kim": màu trắng/xám, rèn sự dứt khoát',
  },
  Thủy: {
    vuong: 'linh hoạt, sâu sắc, giỏi thích nghi',
    thieu: 'nên bổ trợ chất "thủy": màu đen/xanh dương, không gian tĩnh để suy nghĩ',
  },
};
