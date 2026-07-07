import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import {
  CongCuExplorer,
  type ExplorerCategory,
  type FeaturedConfig,
} from '@/components/tools/CongCuExplorer';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, itemList, webPage } from '@/lib/seo/jsonld';
import { CATALOG_TOOLS } from '@/lib/site-registry';

// 2026-06-22 — Sắp xếp lại + thiết kế lại /cong-cu (workflow 3-hướng→chấm→tổng hợp).
// 53 công cụ chia 7 NHÓM theo việc người dùng cần làm, có vùng "Bắt đầu ở đây"
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
    blurb: 'So sánh các hệ, mô phỏng quyết định, luận mệnh cổ học — và bài tự kiểm "đừng tin mù".',
  },
];


// Vùng "Bắt đầu ở đây": 2 lá số miễn phí (hero) + 3 lăng kính còn lại (flagship row).
// Các href này VẪN nằm trong nhóm gốc bên dưới — đây chỉ là lớp nâng-tầm.
const FEATURED: FeaturedConfig = {
  eyebrow: 'Miễn phí · Không cần tài khoản',
  heading: 'Bắt đầu ở đây',
  subcopy:
    'Chưa biết bắt đầu từ đâu? Lập lá số miễn phí trong 30 giây — đây là điểm xuất phát, mọi con đường đều dẫn về chính bạn.',
  free: [
    { href: '/la-so-tu-vi', emoji: '☯', name: 'Lá số Tử Vi', tagline: '12 cung · 121 sao · con số thật', cta: 'Lập miễn phí' },
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
    <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-primary">
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
      <p className="font-mono text-[13px] text-muted-foreground">
        {CATALOG_TOOLS.length} công cụ · {CATEGORIES.length} nhóm · không cần tài khoản
      </p>
    </div>
  </aside>
);

export default function CongCuPage() {
  // 2026-06-23: thêm dữ-liệu-cấu-trúc cho trang danh-mục — ItemList 53 công cụ
  // + breadcrumb + webPage → Google/AI hiểu đây là bộ sưu tập có cấu trúc, index
  // tốt các link công cụ (liên-kết-nội-bộ = nút-thắt traffic).
  const JSONLD = [
    webPage({
      name: 'Tất cả công cụ — hieu.asia',
      description: 'Bộ công cụ luận số, tâm lý học và phong thủy — sắp theo việc bạn cần làm.',
      url: '/cong-cu',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Công cụ', url: '/cong-cu' },
    ]),
    itemList(CATALOG_TOOLS.map((t) => ({ name: t.name, url: t.href }))),
  ];
  return (
    <>
      <JsonLd data={JSONLD} />
      <ToolPageShell
      eyebrow="Khám phá"
      title={
        <>
          Tất cả <GoldAccent>công cụ</GoldAccent>
        </>
      }
      description={`${CATALOG_TOOLS.length} công cụ luận số, tâm lý học và phong thủy — sắp theo việc bạn cần làm. Chưa biết bắt đầu từ đâu? Lập lá số miễn phí, rồi đi sâu theo từng nhu cầu. Tất cả đều minh bạch từng bước, không bói mù.`}
      breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Công cụ' }]}
      heroAside={commandPanel}
    >
      <CongCuExplorer tools={CATALOG_TOOLS} categories={CATEGORIES} featured={FEATURED} />
      </ToolPageShell>
    </>
  );
}
