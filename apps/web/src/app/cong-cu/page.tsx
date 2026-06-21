import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { CongCuExplorer } from '@/components/tools/CongCuExplorer';

const TOOLS = [
  {
    href: '/tu-vi',
    emoji: '☯️',
    name: 'Tử Vi',
    desc: 'Luận mệnh theo lá số Tử Vi — 12 cung, 14 chính tinh.',
  },
  {
    href: '/bat-tu',
    emoji: '🔯',
    name: 'Bát Tự',
    desc: 'Tứ Trụ Bát Tự: ngày giờ sinh tiết lộ ngũ hành bản mệnh.',
  },
  {
    href: '/than-so-hoc',
    emoji: '🔢',
    name: 'Thần Số Học',
    desc: 'Numerology: con số cuộc đời, sứ mệnh, linh hồn.',
  },
  {
    href: '/ban-do-sao',
    emoji: '🔭',
    name: 'Bản đồ sao',
    desc: 'Chiêm tinh phương Tây: cung Mặt Trời & Mặt Trăng từ ngày giờ sinh.',
  },
  {
    href: '/la-so-tu-vi',
    emoji: '☯',
    name: 'Xem lá số Tử Vi',
    desc: 'Lập lá số Tử Vi miễn phí: 12 cung, 114 sao, độ sáng, cách cục — con số thật.',
  },
  {
    href: '/bang-chung',
    emoji: '✓',
    name: 'Bằng Chứng',
    desc: 'Kiểm chứng lá số bằng quá khứ thật của bạn — nhập sự kiện đã xảy ra, xem lá số có ghi dấu không. Không bói mù.',
  },
  {
    href: '/la-so-bat-tu',
    emoji: '☯',
    name: 'Xem lá số Bát Tự',
    desc: 'Lập lá số Bát Tự (Tứ Trụ) miễn phí: 8 chữ, ngũ hành, Nhật Chủ, Thập Thần — tính theo tiết khí.',
  },
  {
    href: '/tu-vi-nghe-nghiep',
    emoji: '💼',
    name: 'Tử Vi Nghề Nghiệp',
    desc: 'Lá số nói gì về sự nghiệp: hợp ngành nào, vai trò nào, điểm mạnh khi làm việc.',
  },
  {
    href: '/tu-vi-tinh-yeu',
    emoji: '❤️',
    name: 'Tử Vi Tình Yêu',
    desc: 'Lá số về tình cảm: cách bạn gắn bó, thể hiện cảm xúc và mẫu xung đột thường gặp.',
  },
  {
    href: '/tu-vi-tai-chinh',
    emoji: '💰',
    name: 'Tử Vi Tài Chính',
    desc: 'Lá số về tiền bạc: cách kiếm tiền, thói quen quản lý và điểm rủi ro cần lưu ý.',
  },
  {
    href: '/mbti',
    emoji: '🧠',
    name: 'MBTI',
    desc: '16 kiểu tâm trí trên 4 trục — bản đồ thiên hướng nội tại.',
  },
  {
    href: '/big-five',
    emoji: '📊',
    name: 'Big Five',
    desc: 'Mô hình 5 nhân tố: OCEAN — chuẩn mực tâm lý học hiện đại.',
  },
  {
    href: '/disc',
    emoji: '🎯',
    name: 'DISC',
    desc: 'Bốn phong cách hành vi: Dominance, Influence, Steadiness, Compliance.',
  },
  {
    href: '/enneagram',
    emoji: '🌀',
    name: 'Enneagram',
    desc: 'Chín nhóm tính cách — khám phá động cơ và nỗi sợ cốt lõi của bạn.',
  },
  {
    href: '/tarot',
    emoji: '🃏',
    name: 'Tarot',
    desc: '78 lá bài — ngôn ngữ biểu tượng để đặt câu hỏi sâu hơn.',
  },
  {
    href: '/gieo-que',
    emoji: '🪬',
    name: 'Gieo Quẻ',
    desc: 'Kinh Dịch 64 quẻ — hỏi thời thế, nhận chỉ dẫn từ âm dương.',
  },
  {
    href: '/can-xuong',
    emoji: '⚖️',
    name: 'Cân Xương',
    desc: 'Luận cân nặng xương theo ngày sinh — luận mệnh dân gian.',
  },
  {
    href: '/thuoc-lo-ban',
    emoji: '📐',
    name: 'Thước Lỗ Ban',
    desc: 'Đo kích thước cát hung theo thước phong thủy truyền thống.',
  },
  {
    href: '/xem-ngay',
    emoji: '📅',
    name: 'Xem Ngày Tốt',
    desc: 'Chọn ngày đẹp cho cưới hỏi, khai trương, động thổ, nhập trạch… theo lịch vạn niên.',
  },
  {
    href: '/sao-han',
    emoji: '⭐',
    name: 'Xem Sao Hạn',
    desc: 'Tra sao chiếu mệnh (Cửu Diệu) theo tuổi và giới tính — tham khảo theo phong tục.',
  },
  {
    href: '/ngay-kieng-ky',
    emoji: '🗓️',
    name: 'Ngày Kiêng Kỵ',
    desc: 'Tra ngày Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật — ngày nên tránh việc lớn theo phong tục.',
  },
  {
    href: '/gio-hoang-dao',
    emoji: '🕐',
    name: 'Giờ Hoàng Đạo',
    desc: 'Tra giờ tốt (hoàng đạo) trong ngày — đổi theo từng ngày, kèm gợi ý giờ tốt kế tiếp.',
  },
  {
    href: '/dat-ten-ngu-hanh',
    emoji: '🌱',
    name: 'Đặt Tên Ngũ Hành',
    desc: 'Tra mệnh ngũ hành của bé theo ngày sinh + gợi ý tên hợp mệnh — gợi ý tham khảo.',
  },
  {
    href: '/sinh-con',
    emoji: '👶',
    name: 'Sinh Con Theo Năm',
    desc: 'Mệnh & con giáp của bé theo năm sinh + đối chiếu tuổi bố mẹ — tham khảo phong tục.',
  },
  {
    href: '/hop-tuoi',
    emoji: '💑',
    name: 'Hợp Tuổi',
    desc: 'Kiểm tra hợp tuổi vợ chồng, xây dựng, xuất hành theo tam hợp.',
  },
  {
    href: '/xem-tuoi-cuoi',
    emoji: '💍',
    name: 'Xem Tuổi Cưới',
    desc: 'Năm này có thuận để cưới không? Tính Kim Lâu, Tam Tai, xung năm theo năm sinh — minh bạch từng bước.',
  },
  {
    href: '/xem-tuoi-lam-nha',
    emoji: '🏠',
    name: 'Xem Tuổi Làm Nhà',
    desc: 'Năm này có được tuổi xây/sửa nhà không? Tính Kim Lâu, Hoang Ốc, Tam Tai — kèm cách kiểm tra người mượn tuổi.',
  },
  {
    href: '/khai-truong',
    emoji: '🎉',
    name: 'Xem Tuổi Khai Trương',
    desc: 'Năm này có hợp tuổi khai trương / mở hàng không? Tính Tam Tai, xung Thái Tuế theo tuổi chủ — minh bạch từng bước.',
  },
  {
    href: '/xong-dat',
    emoji: '🧧',
    name: 'Tuổi Xông Đất',
    desc: 'Gợi ý tuổi xông đất Tết Đinh Mùi 2027 theo tam hợp, lục hợp & ngũ hành — minh bạch, tham khảo.',
  },
  {
    href: '/huong-nha',
    emoji: '🧭',
    name: 'Xem Hướng Nhà',
    desc: 'Hướng nhà hợp tuổi theo Bát Trạch (cung phi): 4 hướng tốt – 4 hướng tránh cho cửa, giường, bếp.',
  },
  {
    href: '/xem-hop-nhom',
    emoji: '👨‍👩‍👧‍👦',
    name: 'Xem Hợp Nhóm',
    desc: 'Thêm 3–6 người (gia đình, nhóm bạn) — điểm hoà hợp chung, từng cặp và gợi ý phối hợp.',
  },
  {
    href: '/family-profiles',
    emoji: '👪',
    name: 'Hồ Sơ Gia Đình',
    desc: 'Lưu hồ sơ cả nhà một chỗ — hiểu tính cách, hợp khắc và cách phối hợp giữa các thành viên.',
  },
  {
    href: '/compatibility',
    emoji: '💞',
    name: 'Hợp Đôi',
    desc: 'Đo độ hợp giữa hai người — tính cách, cảm xúc và mẫu hình tương tác.',
  },
  {
    href: '/career-fit',
    emoji: '🧩',
    name: 'Nhóm Nghề',
    desc: 'Gợi ý nhóm ngành nghề hợp với thiên hướng của bạn — từ tính cách và lá số.',
  },
  {
    href: '/decision-simulator',
    emoji: '🔀',
    name: 'Mô Phỏng Quyết Định',
    desc: 'Đặt 2 lựa chọn cạnh nhau — đối chiếu theo lá số để thấy mỗi hướng nghiêng về điều gì.',
  },
  {
    href: '/timeline',
    emoji: '📈',
    name: 'Timeline Đại Vận',
    desc: 'Xem đại vận 10 năm vận hành thế nào theo dòng thời gian — các mốc chuyển vận lớn.',
  },
  {
    href: '/lich-van-nien',
    emoji: '📅',
    name: 'Lịch Vạn Niên',
    desc: 'Tra cứu ngày tốt xấu, giờ hoàng đạo, lịch âm dương đầy đủ.',
  },
  {
    href: '/xem-tuong',
    emoji: '🖐️',
    name: 'Xem Chỉ Tay & Tướng Mặt',
    desc: 'Tải ảnh lòng bàn tay hoặc khuôn mặt — AI phân tích xu hướng tính cách theo tướng số học.',
  },
  {
    href: '/so-sanh',
    emoji: '🪞',
    name: 'So Sánh Lăng Kính',
    desc: 'Đặt hai lăng kính cạnh nhau — MBTI vs Big Five, Tử Vi vs Bát Tự… thấy rõ mỗi hệ soi sáng điều gì.',
  },
  {
    href: '/hoi-dap',
    emoji: '💬',
    name: 'Hỏi Đáp',
    desc: 'Giải đáp ngắn gọn những thắc mắc thường gặp về tử vi, bát tự và các công cụ tâm lý.',
  },
  {
    href: '/tu-kiem',
    emoji: '🪞',
    name: 'Tự kiểm — Đừng tin mù',
    desc: 'Bài 1 phút: vì sao lời bói luôn thấy "đúng ghê" và cách không bị lừa.',
  },
] as const;

export default function CongCuPage() {
  return (
    <ToolPageShell
      eyebrow="Khám phá"
      title={
        <>
          Tất cả <GoldAccent>công cụ</GoldAccent>
        </>
      }
      description="Toàn bộ công cụ luận số, tâm lý học, và phong thủy tại hieu.asia — chọn một điểm bắt đầu, mọi con đường đều dẫn về chính mình."
      breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Công cụ' }]}
    >
      <CongCuExplorer tools={TOOLS} />
    </ToolPageShell>
  );
}
