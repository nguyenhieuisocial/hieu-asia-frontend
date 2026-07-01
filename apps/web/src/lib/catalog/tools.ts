// Single source of truth for the broader TOOL listings (beyond the flagship
// lenses in ./lenses). Plan A "no drift": the homepage ToolkitSection, the mobile
// nav drawer, and the footer quick-lookup column all read from here — change a
// tool once, it updates everywhere.
//
// Two curated views (different on purpose):
//  - QUICK_LOOKUP: the flat "tra cứu nhanh" list (nav drawer + footer), with tier.
//  - TOOLKIT_GROUPS: the homepage showcase, grouped by domain.

export type ToolTier = 'free' | 'premium';

export interface QuickTool {
  href: string;
  label: string;
  tier: ToolTier;
  /** drawer sub-group key (mobile nav grouping); footer ignores it */
  group?: 'co-hoc' | 'theo-mua' | 'tam-ly' | 'chiem-tinh' | 'xem-tuoi' | 'kham-pha';
}

/** Sub-group order + labels for the mobile drawer "Tra cứu nhanh" section. */
export const QUICK_GROUPS: { key: NonNullable<QuickTool['group']>; label: string }[] = [
  { key: 'co-hoc', label: 'Cổ học Á Đông' },
  { key: 'tam-ly', label: 'Tâm lý hiện đại' },
  { key: 'chiem-tinh', label: 'Chiêm tinh phương Tây' },
  { key: 'xem-tuoi', label: 'Xem tuổi việc lớn' },
  { key: 'theo-mua', label: 'Theo thời điểm' },
  { key: 'kham-pha', label: 'So sánh & đối chiếu' },
];
// (nhãn 'So sánh & đối chiếu' thay 'Khám phá' để khỏi trùng tên với nhóm
//  "Khám phá" riêng ở drawer; /hoi-dap nay chỉ ở "Khám phá" + footer, hết lặp.)

/** Flat quick-lookup list — shared by SiteNav (mobile drawer) + SiteFooter. */
export const QUICK_LOOKUP: QuickTool[] = [
  { href: '/tu-vi-2027', label: 'Tử Vi 2027', tier: 'free', group: 'theo-mua' },
  { href: '/tu-vi-2026', label: 'Tử Vi 2026', tier: 'free', group: 'theo-mua' },
  { href: '/tu-vi-hom-nay', label: 'Tử Vi hôm nay', tier: 'free', group: 'theo-mua' },
  { href: '/hop-tuoi', label: 'Hợp tuổi', tier: 'free', group: 'co-hoc' },
  { href: '/can-xuong', label: 'Cân Xương Đoán Số', tier: 'free', group: 'co-hoc' },
  { href: '/lich-van-nien', label: 'Lịch Vạn Niên', tier: 'free', group: 'theo-mua' },
  { href: '/xem-ngay', label: 'Xem ngày tốt', tier: 'free', group: 'theo-mua' },
  { href: '/sao-han', label: 'Xem sao hạn', tier: 'free', group: 'theo-mua' },
  { href: '/gio-hoang-dao', label: 'Giờ hoàng đạo', tier: 'free', group: 'theo-mua' },
  { href: '/thien-van', label: 'Lịch thiên văn', tier: 'free', group: 'theo-mua' },
  { href: '/ngay-kieng-ky', label: 'Ngày kiêng kỵ', tier: 'free', group: 'theo-mua' },
  { href: '/dat-ten-ngu-hanh', label: 'Đặt tên ngũ hành', tier: 'free', group: 'co-hoc' },
  { href: '/bat-tu', label: 'Bát Tự', tier: 'free', group: 'co-hoc' },
  { href: '/mbti', label: 'MBTI', tier: 'free', group: 'tam-ly' },
  { href: '/than-so-hoc', label: 'Thần số học', tier: 'free', group: 'co-hoc' },
  { href: '/thuoc-lo-ban', label: 'Thước Lỗ Ban', tier: 'free', group: 'co-hoc' },
  { href: '/tinh-menh-cuc', label: 'Tuổi mệnh cục', tier: 'free', group: 'co-hoc' },
  { href: '/ban-do-sao', label: 'Bản đồ sao', tier: 'free', group: 'chiem-tinh' },
  { href: '/cung-hoang-dao', label: 'Cung hoàng đạo', tier: 'free', group: 'chiem-tinh' },
  { href: '/tarot', label: 'Tarot', tier: 'free', group: 'chiem-tinh' },
  { href: '/dai-van-hien-tai', label: 'Đại vận hiện tại', tier: 'free', group: 'theo-mua' },
  { href: '/gieo-que', label: 'Gieo Quẻ Kinh Dịch', tier: 'free', group: 'co-hoc' },
  { href: '/big-five', label: 'Big Five (OCEAN)', tier: 'free', group: 'tam-ly' },
  { href: '/disc', label: 'Trắc nghiệm DiSC', tier: 'free', group: 'tam-ly' },
  { href: '/enneagram', label: 'Enneagram', tier: 'free', group: 'tam-ly' },
  { href: '/xem-tuong', label: 'Xem Chỉ Tay & Tướng Mặt', tier: 'free', group: 'co-hoc' },
  { href: '/xem-hop-nhom', label: 'Xem hợp nhóm / gia đình', tier: 'free', group: 'kham-pha' },
  { href: '/so-sanh', label: 'So sánh lăng kính', tier: 'free', group: 'kham-pha' },
  { href: '/xem-tuoi-cuoi', label: 'Xem tuổi cưới', tier: 'free', group: 'xem-tuoi' },
  { href: '/xem-tuoi-lam-nha', label: 'Xem tuổi làm nhà', tier: 'free', group: 'xem-tuoi' },
  { href: '/huong-nha', label: 'Xem hướng nhà', tier: 'free', group: 'xem-tuoi' },
  { href: '/khai-truong', label: 'Xem tuổi khai trương', tier: 'free', group: 'xem-tuoi' },
];

export interface ToolChip {
  n: string; // short label
  href: string;
  /** optional /learn explainer page for this tool (internal-link SEO) */
  learn?: string;
}
export interface ToolGroup {
  label: string;
  tools: ToolChip[];
}

/** Homepage ToolkitSection — grouped showcase. Xem Tướng added (was a gap). */
export const TOOLKIT_GROUPS: ToolGroup[] = [
  {
    label: 'Cổ học Á Đông',
    tools: [
      { n: 'Tử Vi', href: '/tu-vi', learn: '/learn/tu-vi' },
      { n: 'Bát Tự', href: '/bat-tu', learn: '/learn/bat-tu' },
      { n: 'Xem Tướng', href: '/xem-tuong', learn: '/learn/palm' },
      { n: 'Thần Số', href: '/than-so-hoc', learn: '/learn/than-so-hoc' },
      { n: 'Kinh Dịch', href: '/gieo-que', learn: '/learn/kinh-dich' },
      { n: 'Cân Xương', href: '/can-xuong' },
      { n: 'Thước Lỗ Ban', href: '/thuoc-lo-ban' },
      { n: 'Hợp tuổi', href: '/hop-tuoi', learn: '/learn/hop-tuoi' },
      { n: 'Lịch vạn niên', href: '/lich-van-nien' },
      { n: 'Xem ngày tốt', href: '/xem-ngay' },
      { n: 'Sao hạn', href: '/sao-han' },
      { n: 'Giờ hoàng đạo', href: '/gio-hoang-dao' },
      { n: 'Lịch thiên văn', href: '/thien-van' },
      { n: 'Ngày kiêng kỵ', href: '/ngay-kieng-ky' },
      { n: 'Đặt tên ngũ hành', href: '/dat-ten-ngu-hanh' },
    ],
  },
  {
    label: 'Tâm lý hiện đại',
    tools: [
      { n: 'MBTI', href: '/mbti', learn: '/learn/mbti' },
      { n: 'Big Five', href: '/big-five', learn: '/learn/big-five' },
      { n: 'DISC', href: '/disc', learn: '/learn/disc' },
      { n: 'Enneagram', href: '/enneagram', learn: '/learn/enneagram' },
    ],
  },
  {
    label: 'Chiêm tinh phương Tây',
    tools: [
      { n: 'Bản đồ sao', href: '/ban-do-sao', learn: '/learn/chiem-tinh' },
      { n: 'Cung hoàng đạo', href: '/cung-hoang-dao', learn: '/learn/chiem-tinh' },
    ],
  },
  { label: 'Trực giác', tools: [{ n: 'Tarot', href: '/tarot', learn: '/learn/tarot' }] },
  {
    label: 'Khám phá & so sánh',
    tools: [
      { n: 'So sánh lăng kính', href: '/so-sanh' },
      { n: 'Hỏi đáp', href: '/hoi-dap' },
    ],
  },
];
