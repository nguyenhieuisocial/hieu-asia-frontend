import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import {
  CongCuExplorer,
  type ExplorerCategory,
  type ExplorerTool,
  type FeaturedConfig,
} from '@/components/tools/CongCuExplorer';

// 2026-06-22 — Sắp xếp lại + thiết kế lại /cong-cu (workflow 3-hướng→chấm→tổng hợp).
// ~48 công cụ chia 7 NHÓM theo việc người dùng cần làm, có vùng "Bắt đầu ở đây"
// (lá số miễn phí + 5 lăng kính) và thanh nhảy-nhóm. Thẻ dùng BIẾN-THEME nên
// chạy đúng cả light (Giấy thấm) lẫn dark (Khoảng lặng) — sửa lỗi nền trắng-mờ cũ.

const CATEGORIES: ExplorerCategory[] = [
  {
    id: 'la-so',
    icon: '☯️',
    label: 'Lá số của bạn',
    blurb: 'Lập lá số miễn phí và luận mệnh chuyên sâu — Tử Vi, Bát Tự, nền tảng mệnh cục.',
  },
  {
    id: 'van-trinh',
    icon: '📈',
    label: 'Vận trình & thời gian',
    blurb: 'Đại vận, năm tháng, vận hôm nay — lá số nói gì về dòng thời gian của bạn.',
  },
  {
    id: 'hieu-ban-than',
    icon: '🧠',
    label: 'Hiểu bản thân',
    blurb: 'Trắc nghiệm tâm lý đo được — MBTI, Big Five, DISC, Enneagram, thần số — bạn là ai qua nhiều lăng kính.',
  },
  {
    id: 'chiem-tinh',
    icon: '🔭',
    label: 'Chiêm tinh & Tarot',
    blurb: 'Chiêm tinh phương Tây và Tarot — ngôn ngữ biểu tượng quen thuộc với người trẻ để hiểu mình và đặt câu hỏi sâu hơn.',
  },
  {
    id: 'ngay-gio',
    icon: '📅',
    label: 'Xem ngày – giờ',
    blurb: 'Lịch vạn niên, ngày tốt, giờ hoàng đạo, hướng xuất hành — chọn đúng thời điểm.',
  },
  {
    id: 'xem-tuoi',
    icon: '💍',
    label: 'Xem tuổi việc lớn',
    blurb: 'Cưới hỏi, làm nhà, khai trương, xông đất — kiểm tra tuổi trước khi quyết.',
  },
  {
    id: 'quan-he',
    icon: '💑',
    label: 'Quan hệ & gia đình',
    blurb: 'Hợp đôi, hợp nhóm, hồ sơ cả nhà, sinh con, đặt tên — khi cần soi nhiều người.',
  },
  {
    id: 'kham-pha',
    icon: '🪞',
    label: 'Khám phá & tự kiểm',
    blurb: 'So sánh các hệ, mô phỏng quyết định, bói toán cổ — và bài tự kiểm "đừng tin mù".',
  },
];

const TOOLS: ExplorerTool[] = [
  // ── Lá số của bạn ───────────────────────────────────────────────
  { cat: 'la-so', href: '/la-so-tu-vi', emoji: '☯', name: 'Xem lá số Tử Vi', desc: 'Lập lá số Tử Vi miễn phí: 12 cung, 114 sao, độ sáng, cách cục — con số thật.' },
  { cat: 'la-so', href: '/la-so-bat-tu', emoji: '☯', name: 'Xem lá số Bát Tự', desc: 'Lập lá số Bát Tự (Tứ Trụ) miễn phí: 8 chữ, ngũ hành, Nhật Chủ, Thập Thần — tính theo tiết khí.' },
  // 2026-06-22: gỡ /tu-vi + /bat-tu khỏi catalog — chúng là trang GIỚI THIỆU/SEO
  // (không có bộ lập lá số), trùng cảm-giác với công cụ /la-so-tu-vi, /la-so-bat-tu.
  // Trang giới thiệu vẫn sống (SEO + nút "Lập lá số" dẫn sang công cụ thật).
  { cat: 'la-so', href: '/tinh-menh-cuc', emoji: '🧮', name: 'Tuổi mệnh cục', desc: 'Tính Mệnh và Cục từ ngày giờ sinh — nền tảng để lập lá số Tử Vi.' },
  { cat: 'la-so', href: '/ban-menh', emoji: '🪙', name: 'Ngũ hành bản mệnh', desc: 'Sinh năm nào mệnh gì: tra nạp âm, hành bản mệnh và màu hợp theo năm sinh.' },
  { cat: 'la-so', href: '/bang-chung', emoji: '✓', name: 'Bằng Chứng', desc: 'Kiểm chứng lá số bằng quá khứ thật của bạn — nhập sự kiện đã xảy ra, xem lá số có ghi dấu không. Không bói mù.' },

  // ── Vận trình & thời gian ───────────────────────────────────────
  { cat: 'van-trinh', href: '/dai-van-hien-tai', emoji: '🧭', name: 'Đại vận hiện tại', desc: 'Bạn đang ở đại vận (10 năm) nào — chủ đề lớn của giai đoạn hiện tại.' },
  { cat: 'van-trinh', href: '/timeline', emoji: '📈', name: 'Timeline Đại Vận', desc: 'Xem đại vận 10 năm vận hành thế nào theo dòng thời gian — các mốc chuyển vận lớn.' },
  { cat: 'van-trinh', href: '/tu-vi-nghe-nghiep', emoji: '💼', name: 'Tử Vi Nghề Nghiệp', desc: 'Lá số nói gì về sự nghiệp: hợp ngành nào, vai trò nào, điểm mạnh khi làm việc.' },
  { cat: 'van-trinh', href: '/tu-vi-tinh-yeu', emoji: '❤️', name: 'Tử Vi Tình Yêu', desc: 'Lá số về tình cảm: cách bạn gắn bó, thể hiện cảm xúc và mẫu xung đột thường gặp.' },
  { cat: 'van-trinh', href: '/tu-vi-tai-chinh', emoji: '💰', name: 'Tử Vi Tài Chính', desc: 'Lá số về tiền bạc: cách kiếm tiền, thói quen quản lý và điểm rủi ro cần lưu ý.' },
  { cat: 'van-trinh', href: '/tu-vi-hom-nay', emoji: '📅', name: 'Tử Vi hôm nay', desc: 'Vận trình hôm nay theo 12 con giáp — màu sắc, giờ tốt, điều nên/nên tránh.' },
  { cat: 'van-trinh', href: '/tu-vi-2026', emoji: '🐎', name: 'Tử Vi 2026', desc: 'Tử Vi năm Bính Ngọ 2026 cho 12 con giáp — công việc, tài lộc, tình cảm.' },
  { cat: 'van-trinh', href: '/tu-vi-2027', emoji: '🐐', name: 'Tử Vi 2027', desc: 'Tử Vi năm Đinh Mùi 2027 cho 12 con giáp — sao hạn, vận trình từng tuổi.' },
  { cat: 'van-trinh', href: '/sao-han', emoji: '⭐', name: 'Xem Sao Hạn', desc: 'Tra sao chiếu mệnh (Cửu Diệu) theo tuổi và giới tính — tham khảo theo phong tục.' },

  // ── Hiểu bản thân ───────────────────────────────────────────────
  { cat: 'hieu-ban-than', href: '/mbti', emoji: '🧠', name: 'MBTI', desc: '16 kiểu tâm trí trên 4 trục — bản đồ thiên hướng nội tại.' },
  { cat: 'hieu-ban-than', href: '/big-five', emoji: '📊', name: 'Big Five', desc: 'Mô hình 5 nhân tố: OCEAN — chuẩn mực tâm lý học hiện đại.' },
  { cat: 'hieu-ban-than', href: '/disc', emoji: '🎯', name: 'DISC', desc: 'Bốn phong cách hành vi: Dominance, Influence, Steadiness, Compliance.' },
  { cat: 'hieu-ban-than', href: '/enneagram', emoji: '🌀', name: 'Enneagram', desc: 'Chín nhóm tính cách — khám phá động cơ và nỗi sợ cốt lõi của bạn.' },
  { cat: 'hieu-ban-than', href: '/than-so-hoc', emoji: '🔢', name: 'Thần Số Học', desc: 'Numerology: con số cuộc đời, sứ mệnh, linh hồn.' },
  { cat: 'hieu-ban-than', href: '/xem-tuong', emoji: '🖐️', name: 'Xem Chỉ Tay & Tướng Mặt', desc: 'Tải ảnh lòng bàn tay hoặc khuôn mặt — AI phân tích xu hướng tính cách theo tướng số học.' },

  // ── Chiêm tinh & Tarot ──────────────────────────────────────────
  { cat: 'chiem-tinh', href: '/ban-do-sao', emoji: '🔭', name: 'Bản đồ sao', desc: 'Chiêm tinh phương Tây: cung Mặt Trời, Mặt Trăng & cung Mọc từ ngày giờ sinh — bản đồ sao cá nhân.' },
  { cat: 'chiem-tinh', href: '/cung-hoang-dao', emoji: '♌', name: 'Cung hoàng đạo', desc: '12 cung hoàng đạo: tra cung theo ngày sinh, tính cách, nguyên tố và cung hợp nhau.' },
  { cat: 'chiem-tinh', href: '/tarot', emoji: '🃏', name: 'Tarot', desc: '78 lá bài — ngôn ngữ biểu tượng để đặt câu hỏi sâu hơn.' },

  // ── Xem ngày – giờ ──────────────────────────────────────────────
  { cat: 'ngay-gio', href: '/lich-van-nien', emoji: '📅', name: 'Lịch Vạn Niên', desc: 'Tra cứu ngày tốt xấu, giờ hoàng đạo, lịch âm dương đầy đủ.' },
  { cat: 'ngay-gio', href: '/xem-ngay', emoji: '📅', name: 'Xem Ngày Tốt', desc: 'Chọn ngày đẹp cho cưới hỏi, khai trương, động thổ, nhập trạch… theo lịch vạn niên.' },
  { cat: 'ngay-gio', href: '/gio-hoang-dao', emoji: '🕐', name: 'Giờ Hoàng Đạo', desc: 'Tra giờ tốt (hoàng đạo) trong ngày — đổi theo từng ngày, kèm gợi ý giờ tốt kế tiếp.' },
  { cat: 'ngay-gio', href: '/xuat-hanh', emoji: '🧭', name: 'Hướng & Giờ Xuất Hành', desc: 'Tra hướng Hỷ Thần, Tài Thần và giờ hoàng đạo để xuất hành — tính theo Can-Chi từng ngày.' },
  { cat: 'ngay-gio', href: '/ngay-kieng-ky', emoji: '🗓️', name: 'Ngày Kiêng Kỵ', desc: 'Tra ngày Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật — ngày nên tránh việc lớn theo phong tục.' },
  { cat: 'ngay-gio', href: '/thien-van', emoji: '🌘', name: 'Lịch thiên văn', desc: 'Nhật thực, nguyệt thực và bốn điểm phân–chí 2026–2030 quan sát tại Việt Nam.' },

  // ── Xem tuổi việc lớn ───────────────────────────────────────────
  { cat: 'xem-tuoi', href: '/xem-tuoi-cuoi', emoji: '💍', name: 'Xem Tuổi Cưới', desc: 'Năm này có thuận để cưới không? Tính Kim Lâu, Tam Tai, xung năm theo năm sinh — minh bạch từng bước.' },
  { cat: 'xem-tuoi', href: '/xem-tuoi-lam-nha', emoji: '🏠', name: 'Xem Tuổi Làm Nhà', desc: 'Năm này có được tuổi xây/sửa nhà không? Tính Kim Lâu, Hoang Ốc, Tam Tai — kèm cách kiểm tra người mượn tuổi.' },
  { cat: 'xem-tuoi', href: '/khai-truong', emoji: '🎉', name: 'Xem Tuổi Khai Trương', desc: 'Năm này có hợp tuổi khai trương / mở hàng không? Tính Tam Tai, xung Thái Tuế theo tuổi chủ — minh bạch từng bước.' },
  { cat: 'xem-tuoi', href: '/xong-dat', emoji: '🧧', name: 'Tuổi Xông Đất', desc: 'Gợi ý tuổi xông đất Tết Đinh Mùi 2027 theo tam hợp, lục hợp & ngũ hành — minh bạch, tham khảo.' },
  { cat: 'xem-tuoi', href: '/hop-tuoi', emoji: '💑', name: 'Hợp Tuổi', desc: 'Kiểm tra hợp tuổi vợ chồng, xây dựng, xuất hành theo tam hợp.' },
  { cat: 'xem-tuoi', href: '/huong-nha', emoji: '🧭', name: 'Xem Hướng Nhà', desc: 'Hướng nhà hợp tuổi theo Bát Trạch (cung phi): 4 hướng tốt – 4 hướng tránh cho cửa, giường, bếp.' },
  { cat: 'xem-tuoi', href: '/thuoc-lo-ban', emoji: '📐', name: 'Thước Lỗ Ban', desc: 'Đo kích thước cát hung theo thước phong thủy truyền thống.' },

  // ── Quan hệ & gia đình ──────────────────────────────────────────
  { cat: 'quan-he', href: '/compatibility', emoji: '💞', name: 'Hợp Đôi', desc: 'Đo độ hợp giữa hai người — tính cách, cảm xúc và mẫu hình tương tác.' },
  { cat: 'quan-he', href: '/xem-hop-nhom', emoji: '👨‍👩‍👧‍👦', name: 'Xem Hợp Nhóm', desc: 'Thêm 3–6 người (gia đình, nhóm bạn) — điểm hoà hợp chung, từng cặp và gợi ý phối hợp.' },
  { cat: 'quan-he', href: '/family-profiles', emoji: '👪', name: 'Hồ Sơ Gia Đình', desc: 'Lưu hồ sơ cả nhà một chỗ — hiểu tính cách, hợp khắc và cách phối hợp giữa các thành viên.' },
  { cat: 'quan-he', href: '/sinh-con', emoji: '👶', name: 'Sinh Con Theo Năm', desc: 'Mệnh & con giáp của bé theo năm sinh + đối chiếu tuổi bố mẹ — tham khảo phong tục.' },
  { cat: 'quan-he', href: '/dat-ten-ngu-hanh', emoji: '🌱', name: 'Đặt Tên Ngũ Hành', desc: 'Tra mệnh ngũ hành của bé theo ngày sinh + gợi ý tên hợp mệnh — gợi ý tham khảo.' },

  // ── Khám phá & tự kiểm ──────────────────────────────────────────
  { cat: 'kham-pha', href: '/so-sanh', emoji: '🪞', name: 'So Sánh Lăng Kính', desc: 'Đặt hai lăng kính cạnh nhau — MBTI vs Big Five, Tử Vi vs Bát Tự… thấy rõ mỗi hệ soi sáng điều gì.' },
  { cat: 'kham-pha', href: '/decision-simulator', emoji: '🔀', name: 'Mô Phỏng Quyết Định', desc: 'Đặt 2 lựa chọn cạnh nhau — đối chiếu theo lá số để thấy mỗi hướng nghiêng về điều gì.' },
  { cat: 'kham-pha', href: '/career-fit', emoji: '🧩', name: 'Nhóm Nghề', desc: 'Gợi ý nhóm ngành nghề hợp với thiên hướng của bạn — từ tính cách và lá số.' },
  { cat: 'kham-pha', href: '/gieo-que', emoji: '🪬', name: 'Gieo Quẻ', desc: 'Kinh Dịch 64 quẻ — hỏi thời thế, nhận chỉ dẫn từ âm dương.' },
  { cat: 'kham-pha', href: '/can-xuong', emoji: '⚖️', name: 'Cân Xương', desc: 'Luận cân nặng xương theo ngày sinh — luận mệnh dân gian.' },
  { cat: 'kham-pha', href: '/hoi-dap', emoji: '💬', name: 'Hỏi Đáp', desc: 'Giải đáp ngắn gọn những thắc mắc thường gặp về tử vi, bát tự và các công cụ tâm lý.' },
  { cat: 'kham-pha', href: '/tu-kiem', emoji: '🪞', name: 'Tự kiểm — Đừng tin mù', desc: 'Bài 1 phút: vì sao lời bói luôn thấy "đúng ghê" và cách không bị lừa.' },
];

// Vùng "Bắt đầu ở đây": 2 lá số miễn phí (hero) + 3 lăng kính còn lại (flagship row).
// Các href này VẪN nằm trong nhóm gốc bên dưới — đây chỉ là lớp nâng-tầm.
const FEATURED: FeaturedConfig = {
  eyebrow: 'Miễn phí · Không cần tài khoản',
  heading: 'Bắt đầu ở đây',
  subcopy:
    'Chưa biết bắt đầu từ đâu? Lập lá số miễn phí trong 30 giây — đây là điểm xuất phát, mọi con đường đều dẫn về chính bạn.',
  free: [
    { href: '/la-so-tu-vi', emoji: '☯', name: 'Lá số Tử Vi', tagline: '12 cung · 114 sao · con số thật', cta: 'Lập miễn phí' },
    { href: '/la-so-bat-tu', emoji: '🔯', name: 'Lá số Bát Tự', tagline: '8 chữ · ngũ hành · Nhật Chủ', cta: 'Lập miễn phí' },
  ],
  lensesHeading: 'Lăng kính khác',
  lenses: ['/mbti', '/big-five', '/xem-tuong'],
};

// Panel "Bắt đầu miễn phí" lấp nửa-phải tiêu đề ở desktop (lg+). Chứa 2 lá số
// MIỄN PHÍ — hành động giá-trị-cao nhất — thay vì để trống. Ở mobile panel ẩn
// (CongCuExplorer hiện 2 thẻ này), nên không trùng lặp.
const commandPanel = (
  <aside className="rounded-2xl border border-gold/30 bg-card p-5 shadow-sm">
    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
      Bắt đầu miễn phí · 30 giây
    </p>
    <p className="mt-2 font-heading text-base leading-snug text-foreground">
      Lập lá số của bạn — con số thật, không bói mù.
    </p>
    <div className="mt-4 flex flex-col gap-3">
      {FEATURED.free.map((f) => (
        <Link
          key={f.href}
          href={f.href}
          className="group flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3 transition-colors hover:border-primary/50 hover:bg-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-card text-xl"
          >
            {f.emoji}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
              {f.name}
            </span>
            <span className="block truncate text-[12px] text-muted-foreground">
              {f.tagline}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-0.5"
          >
            <ArrowRight className="size-4" />
          </span>
        </Link>
      ))}
    </div>
    <div className="mt-4 border-t border-border pt-3">
      <p className="font-mono text-[11px] text-muted-foreground">
        {TOOLS.length} công cụ · {CATEGORIES.length} nhóm · không cần tài khoản
      </p>
    </div>
  </aside>
);

export default function CongCuPage() {
  return (
    <ToolPageShell
      eyebrow="Khám phá"
      title={
        <>
          Tất cả <GoldAccent>công cụ</GoldAccent>
        </>
      }
      description={`${TOOLS.length} công cụ luận số, tâm lý học và phong thủy — sắp theo việc bạn cần làm. Chưa biết bắt đầu từ đâu? Lập lá số miễn phí, rồi đi sâu theo từng nhu cầu. Tất cả đều minh bạch từng bước, không bói mù.`}
      breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Công cụ' }]}
      heroAside={commandPanel}
    >
      <CongCuExplorer tools={TOOLS} categories={CATEGORIES} featured={FEATURED} />
    </ToolPageShell>
  );
}
