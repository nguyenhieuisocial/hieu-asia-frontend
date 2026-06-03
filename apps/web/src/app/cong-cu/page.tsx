import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';

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
    href: '/hop-tuoi',
    emoji: '💑',
    name: 'Hợp Tuổi',
    desc: 'Kiểm tra hợp tuổi vợ chồng, xây dựng, xuất hành theo tam hợp.',
  },
  {
    href: '/xem-hop-nhom',
    emoji: '👨‍👩‍👧‍👦',
    name: 'Xem Hợp Nhóm',
    desc: 'Thêm 3–6 người (gia đình, nhóm bạn) — điểm hoà hợp chung, từng cặp và gợi ý phối hợp.',
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
      <ul
        role="list"
        className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {TOOLS.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 transition-all duration-200 hover:border-gold/40 hover:bg-gold/[0.06] hover:shadow-[0_0_28px_-8px_rgba(184,146,61,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              <span
                aria-hidden="true"
                className="text-2xl leading-none transition-transform duration-200 group-hover:scale-110"
              >
                {tool.emoji}
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-heading text-base font-semibold text-foreground group-hover:text-gold transition-colors duration-200">
                  {tool.name}
                </span>
                <span className="text-[13px] leading-relaxed text-muted-foreground">
                  {tool.desc}
                </span>
              </div>
              <span
                aria-hidden="true"
                className="mt-auto text-xs font-mono text-gold/40 transition-colors duration-200 group-hover:text-gold/70"
              >
                Khám phá →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </ToolPageShell>
  );
}
