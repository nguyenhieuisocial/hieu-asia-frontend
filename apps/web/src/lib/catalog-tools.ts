// Rollback snapshot of the /cong-cu catalog list (the 4th of the four lists
// unified into site-registry.ts by S9/T10). Kept for one release + consumed by
// the parity test; delete once the registry is trusted live.
import type { ExplorerTool } from '@/components/tools/CongCuExplorer';

export const CATALOG_TOOLS_LEGACY: ExplorerTool[] = [
  {
    "cat": "la-so",
    "href": "/la-so-tu-vi",
    "emoji": "☯",
    "name": "Xem lá số Tử Vi",
    "desc": "Lập lá số Tử Vi miễn phí: 12 cung, 121 sao, độ sáng, cách cục — con số thật."
  },
  {
    "cat": "la-so",
    "href": "/la-so-bat-tu",
    "emoji": "☯",
    "name": "Xem lá số Bát Tự",
    "desc": "Lập lá số Bát Tự (Tứ Trụ) miễn phí: 8 chữ, ngũ hành, Nhật Chủ, Thập Thần — tính theo tiết khí."
  },
  {
    "cat": "la-so",
    "href": "/tinh-menh-cuc",
    "emoji": "🧮",
    "name": "Tuổi mệnh cục",
    "desc": "Tính Mệnh và Cục từ ngày giờ sinh — nền tảng để lập lá số Tử Vi."
  },
  {
    "cat": "la-so",
    "href": "/ban-menh",
    "emoji": "🪙",
    "name": "Ngũ hành bản mệnh",
    "desc": "Sinh năm nào mệnh gì: tra nạp âm, hành bản mệnh và màu hợp theo năm sinh."
  },
  {
    "cat": "la-so",
    "href": "/bang-chung",
    "emoji": "✓",
    "name": "Bằng Chứng",
    "desc": "Kiểm chứng lá số bằng quá khứ thật của bạn — nhập sự kiện đã xảy ra, xem lá số có ghi dấu không. Không bói mù."
  },
  {
    "cat": "van-trinh",
    "href": "/dai-van-hien-tai",
    "emoji": "🧭",
    "name": "Đại vận hiện tại",
    "desc": "Bạn đang ở đại vận (10 năm) nào — chủ đề lớn của giai đoạn hiện tại."
  },
  {
    "cat": "van-trinh",
    "href": "/timeline",
    "emoji": "📈",
    "name": "Timeline Đại Vận",
    "desc": "Xem đại vận 10 năm vận hành thế nào theo dòng thời gian — các mốc chuyển vận lớn."
  },
  {
    "cat": "van-trinh",
    "href": "/tu-vi-nghe-nghiep",
    "emoji": "💼",
    "name": "Tử Vi Nghề Nghiệp",
    "desc": "Lá số nói gì về sự nghiệp: hợp ngành nào, vai trò nào, điểm mạnh khi làm việc."
  },
  {
    "cat": "van-trinh",
    "href": "/tu-vi-tinh-yeu",
    "emoji": "❤️",
    "name": "Tử Vi Tình Yêu",
    "desc": "Lá số về tình cảm: cách bạn gắn bó, thể hiện cảm xúc và mẫu xung đột thường gặp."
  },
  {
    "cat": "van-trinh",
    "href": "/tu-vi-tai-chinh",
    "emoji": "💰",
    "name": "Tử Vi Tài Chính",
    "desc": "Lá số về tiền bạc: cách kiếm tiền, thói quen quản lý và điểm rủi ro cần lưu ý."
  },
  {
    "cat": "van-trinh",
    "href": "/tu-vi-hom-nay",
    "emoji": "📅",
    "name": "Tử Vi hôm nay",
    "desc": "Vận trình hôm nay theo 12 con giáp — màu sắc, giờ tốt, điều nên/nên tránh."
  },
  {
    "cat": "van-trinh",
    "href": "/tu-vi-2026",
    "emoji": "🐎",
    "name": "Tử Vi 2026",
    "desc": "Tử Vi năm Bính Ngọ 2026 cho 12 con giáp — công việc, tài lộc, tình cảm."
  },
  {
    "cat": "van-trinh",
    "href": "/tu-vi-2027",
    "emoji": "🐐",
    "name": "Tử Vi 2027",
    "desc": "Tử Vi năm Đinh Mùi 2027 cho 12 con giáp — sao hạn, vận trình từng tuổi."
  },
  {
    "cat": "van-trinh",
    "href": "/sao-han",
    "emoji": "⭐",
    "name": "Xem Sao Hạn",
    "desc": "Tra sao chiếu mệnh (Cửu Diệu) theo tuổi và giới tính — tham khảo theo phong tục."
  },
  {
    "cat": "hieu-ban-than",
    "href": "/mbti",
    "emoji": "🧠",
    "name": "MBTI",
    "desc": "16 kiểu tâm trí trên 4 trục — bản đồ thiên hướng nội tại."
  },
  {
    "cat": "hieu-ban-than",
    "href": "/big-five",
    "emoji": "📊",
    "name": "Big Five",
    "desc": "Mô hình 5 nhân tố: OCEAN — chuẩn mực tâm lý học hiện đại."
  },
  {
    "cat": "hieu-ban-than",
    "href": "/disc",
    "emoji": "🎯",
    "name": "DISC",
    "desc": "Bốn phong cách hành vi: Dominance, Influence, Steadiness, Compliance."
  },
  {
    "cat": "hieu-ban-than",
    "href": "/enneagram",
    "emoji": "🌀",
    "name": "Enneagram",
    "desc": "Chín nhóm tính cách — khám phá động cơ và nỗi sợ cốt lõi của bạn."
  },
  {
    "cat": "hieu-ban-than",
    "href": "/than-so-hoc",
    "emoji": "🔢",
    "name": "Thần Số Học",
    "desc": "Con số cuộc đời, sứ mệnh, linh hồn."
  },
  {
    "cat": "hieu-ban-than",
    "href": "/xem-tuong",
    "emoji": "🖐️",
    "name": "Xem Chỉ Tay & Tướng Mặt",
    "desc": "Tải ảnh lòng bàn tay hoặc khuôn mặt — AI phân tích xu hướng tính cách theo tướng số học."
  },
  {
    "cat": "chiem-tinh",
    "href": "/ban-do-sao",
    "emoji": "🔭",
    "name": "Bản đồ sao",
    "desc": "Chiêm tinh phương Tây: cung Mặt Trời, Mặt Trăng & cung Mọc từ ngày giờ sinh — bản đồ sao cá nhân."
  },
  {
    "cat": "chiem-tinh",
    "href": "/cung-hoang-dao",
    "emoji": "♌",
    "name": "Cung hoàng đạo",
    "desc": "12 cung hoàng đạo: tra cung theo ngày sinh, tính cách, nguyên tố và cung hợp nhau."
  },
  {
    "cat": "chiem-tinh",
    "href": "/tarot",
    "emoji": "🃏",
    "name": "Tarot",
    "desc": "78 lá bài — ngôn ngữ biểu tượng để đặt câu hỏi sâu hơn."
  },
  {
    "cat": "ngay-gio",
    "href": "/lich-van-nien",
    "emoji": "📅",
    "name": "Lịch Vạn Niên",
    "desc": "Tra cứu ngày tốt xấu, giờ hoàng đạo, lịch âm dương đầy đủ."
  },
  {
    "cat": "ngay-gio",
    "href": "/xem-ngay",
    "emoji": "📅",
    "name": "Xem Ngày Tốt",
    "desc": "Chọn ngày đẹp cho cưới hỏi, khai trương, động thổ, nhập trạch… theo lịch vạn niên."
  },
  {
    "cat": "ngay-gio",
    "href": "/gio-hoang-dao",
    "emoji": "🕐",
    "name": "Giờ Hoàng Đạo",
    "desc": "Tra giờ tốt (hoàng đạo) trong ngày — đổi theo từng ngày, kèm gợi ý giờ tốt kế tiếp."
  },
  {
    "cat": "ngay-gio",
    "href": "/xuat-hanh",
    "emoji": "🧭",
    "name": "Hướng & Giờ Xuất Hành",
    "desc": "Tra hướng Hỷ Thần, Tài Thần và giờ hoàng đạo để xuất hành — tính theo Can-Chi từng ngày."
  },
  {
    "cat": "ngay-gio",
    "href": "/ngay-kieng-ky",
    "emoji": "🗓️",
    "name": "Ngày Kiêng Kỵ",
    "desc": "Tra ngày Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật — ngày nên tránh việc lớn theo phong tục."
  },
  {
    "cat": "ngay-gio",
    "href": "/thien-van",
    "emoji": "🌘",
    "name": "Lịch thiên văn",
    "desc": "Nhật thực, nguyệt thực và bốn điểm phân–chí 2026–2030 quan sát tại Việt Nam."
  },
  {
    "cat": "xem-tuoi",
    "href": "/xem-tuoi-cuoi",
    "emoji": "💍",
    "name": "Xem Tuổi Cưới",
    "desc": "Năm này có thuận để cưới không? Tính Kim Lâu, Tam Tai, xung năm theo năm sinh — minh bạch từng bước."
  },
  {
    "cat": "xem-tuoi",
    "href": "/xem-tuoi-lam-nha",
    "emoji": "🏠",
    "name": "Xem Tuổi Làm Nhà",
    "desc": "Năm này có được tuổi xây/sửa nhà không? Tính Kim Lâu, Hoang Ốc, Tam Tai — kèm cách kiểm tra người mượn tuổi."
  },
  {
    "cat": "xem-tuoi",
    "href": "/khai-truong",
    "emoji": "🎉",
    "name": "Xem Tuổi Khai Trương",
    "desc": "Năm này có hợp tuổi khai trương / mở hàng không? Tính Tam Tai, xung Thái Tuế theo tuổi chủ — minh bạch từng bước."
  },
  {
    "cat": "xem-tuoi",
    "href": "/tam-tai",
    "emoji": "🗓️",
    "name": "Tam Tai",
    "desc": "Tuổi nào phạm Tam Tai và vào những năm nào? Tra theo nhóm tam hợp năm sinh — phong tục để tham khảo, không hù dọa."
  },
  {
    "cat": "xem-tuoi",
    "href": "/kim-lau",
    "emoji": "💍",
    "name": "Kim Lâu",
    "desc": "Tuổi Kim Lâu cô dâu là gì, năm nào phạm? Tra theo tuổi mụ (chia 9) — phong tục cưới hỏi để tham khảo, không hù dọa."
  },
  {
    "cat": "xem-tuoi",
    "href": "/xong-dat",
    "emoji": "🧧",
    "name": "Tuổi Xông Đất",
    "desc": "Gợi ý tuổi xông đất Tết Đinh Mùi 2027 theo tam hợp, lục hợp & ngũ hành — minh bạch, tham khảo."
  },
  {
    "cat": "xem-tuoi",
    "href": "/hop-tuoi",
    "emoji": "💑",
    "name": "Hợp Tuổi",
    "desc": "Kiểm tra hợp tuổi vợ chồng, xây dựng, xuất hành theo tam hợp."
  },
  {
    "cat": "xem-tuoi",
    "href": "/huong-nha",
    "emoji": "🧭",
    "name": "Xem Hướng Nhà",
    "desc": "Hướng nhà hợp tuổi theo Bát Trạch (cung phi): 4 hướng tốt – 4 hướng tránh cho cửa, giường, bếp."
  },
  {
    "cat": "xem-tuoi",
    "href": "/thuoc-lo-ban",
    "emoji": "📐",
    "name": "Thước Lỗ Ban",
    "desc": "Đo kích thước cát hung theo thước phong thủy truyền thống."
  },
  {
    "cat": "xem-tuoi",
    "href": "/phi-tinh",
    "emoji": "🧭",
    "name": "Huyền Không Phi Tinh",
    "desc": "Lập bàn phi tinh 9 cung theo nguyên vận + hướng nhà: vận/sơn/hướng tinh, phán Vượng sơn Vượng hướng. Lý khí, con số thật."
  },
  {
    "cat": "xem-tuoi",
    "href": "/mau-xe-hop-menh",
    "emoji": "🚗",
    "name": "Màu Xe Hợp Mệnh",
    "desc": "Sinh năm nào hợp màu xe gì? Tra theo ngũ hành bản mệnh — màu hợp và màu nên cân nhắc, để tham khảo, không hù dọa."
  },
  {
    "cat": "xem-tuoi",
    "href": "/huong-ban-lam-viec",
    "emoji": "🪑",
    "name": "Hướng Bàn Làm Việc",
    "desc": "Nên ngồi quay mặt về hướng nào khi làm việc, khi học? Tra theo Bát Trạch (cung phi) từ năm sinh — để tham khảo, không hù dọa."
  },
  {
    "cat": "quan-he",
    "href": "/compatibility",
    "emoji": "💞",
    "name": "Hợp Đôi",
    "desc": "Đo độ hợp giữa hai người — tính cách, cảm xúc và mẫu hình tương tác."
  },
  {
    "cat": "quan-he",
    "href": "/xem-hop-nhom",
    "emoji": "👨‍👩‍👧‍👦",
    "name": "Xem Hợp Nhóm",
    "desc": "Thêm 3–6 người (gia đình, nhóm bạn) — điểm hoà hợp chung, từng cặp và gợi ý phối hợp."
  },
  {
    "cat": "quan-he",
    "href": "/family-profiles",
    "emoji": "👪",
    "name": "Hồ Sơ Gia Đình",
    "desc": "Lưu hồ sơ cả nhà một chỗ — hiểu tính cách, hợp khắc và cách phối hợp giữa các thành viên."
  },
  {
    "cat": "quan-he",
    "href": "/sinh-con",
    "emoji": "👶",
    "name": "Sinh Con Theo Năm",
    "desc": "Mệnh & con giáp của bé theo năm sinh + đối chiếu tuổi bố mẹ — tham khảo phong tục."
  },
  {
    "cat": "quan-he",
    "href": "/dat-ten-ngu-hanh",
    "emoji": "🌱",
    "name": "Đặt Tên Ngũ Hành",
    "desc": "Tra mệnh ngũ hành của bé theo ngày sinh + gợi ý tên hợp mệnh — gợi ý tham khảo."
  },
  {
    "cat": "kham-pha",
    "href": "/so-sanh",
    "emoji": "🪞",
    "name": "So Sánh Lăng Kính",
    "desc": "Đặt hai lăng kính cạnh nhau — MBTI vs Big Five, Tử Vi vs Bát Tự… thấy rõ mỗi hệ soi sáng điều gì."
  },
  {
    "cat": "kham-pha",
    "href": "/decision-simulator",
    "emoji": "🔀",
    "name": "Mô Phỏng Quyết Định",
    "desc": "Đặt 2 lựa chọn cạnh nhau — đối chiếu theo lá số để thấy mỗi hướng nghiêng về điều gì."
  },
  {
    "cat": "kham-pha",
    "href": "/career-fit",
    "emoji": "🧩",
    "name": "Nhóm Nghề",
    "desc": "Gợi ý nhóm ngành nghề hợp với thiên hướng của bạn — từ tính cách và lá số."
  },
  {
    "cat": "kham-pha",
    "href": "/gieo-que",
    "emoji": "🪬",
    "name": "Gieo Quẻ",
    "desc": "Kinh Dịch 64 quẻ — hỏi thời thế, nhận chỉ dẫn từ âm dương."
  },
  {
    "cat": "kham-pha",
    "href": "/can-xuong",
    "emoji": "⚖️",
    "name": "Cân Xương",
    "desc": "Luận cân nặng xương theo ngày sinh — luận mệnh dân gian."
  },
  {
    "cat": "kham-pha",
    "href": "/hoi-dap",
    "emoji": "💬",
    "name": "Hỏi Đáp",
    "desc": "Giải đáp ngắn gọn những thắc mắc thường gặp về tử vi, bát tự và các công cụ tâm lý."
  },
  {
    "cat": "kham-pha",
    "href": "/tu-kiem",
    "emoji": "🪞",
    "name": "Tự kiểm — Đừng tin mù",
    "desc": "Bài 1 phút: vì sao lời bói luôn thấy \"đúng ghê\" và cách không bị lừa."
  }
];
