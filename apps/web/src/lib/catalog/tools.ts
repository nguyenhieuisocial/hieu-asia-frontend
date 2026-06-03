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
}

/** Flat quick-lookup list — shared by SiteNav (mobile drawer) + SiteFooter. */
export const QUICK_LOOKUP: QuickTool[] = [
  { href: '/tu-vi-2026', label: 'Tử Vi 2026', tier: 'free' },
  { href: '/tu-vi-hom-nay', label: 'Tử Vi hôm nay', tier: 'free' },
  { href: '/hop-tuoi', label: 'Hợp tuổi', tier: 'free' },
  { href: '/can-xuong', label: 'Cân Xương Đoán Số', tier: 'free' },
  { href: '/lich-van-nien', label: 'Lịch Vạn Niên', tier: 'free' },
  { href: '/xem-ngay', label: 'Xem ngày tốt', tier: 'free' },
  { href: '/bat-tu', label: 'Bát Tự', tier: 'free' },
  { href: '/mbti', label: 'MBTI', tier: 'free' },
  { href: '/than-so-hoc', label: 'Thần số học', tier: 'free' },
  { href: '/thuoc-lo-ban', label: 'Thước Lỗ Ban', tier: 'free' },
  { href: '/tinh-menh-cuc', label: 'Tuổi mệnh cục', tier: 'free' },
  { href: '/ban-do', label: 'Bản đồ sao', tier: 'premium' },
  { href: '/dai-van-hien-tai', label: 'Đại vận hiện tại', tier: 'free' },
  { href: '/gieo-que', label: 'Gieo Quẻ Kinh Dịch', tier: 'free' },
  { href: '/big-five', label: 'Big Five (OCEAN)', tier: 'free' },
  { href: '/disc', label: 'Trắc nghiệm DiSC', tier: 'free' },
  { href: '/enneagram', label: 'Enneagram', tier: 'free' },
  { href: '/xem-tuong', label: 'Xem Chỉ Tay & Tướng Mặt', tier: 'free' },
  { href: '/xem-hop-nhom', label: 'Xem hợp nhóm / gia đình', tier: 'free' },
  { href: '/so-sanh', label: 'So sánh lăng kính', tier: 'free' },
  { href: '/hoi-dap', label: 'Hỏi đáp', tier: 'free' },
];

export interface ToolChip {
  n: string; // short label
  href: string;
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
      { n: 'Tử Vi', href: '/tu-vi' },
      { n: 'Bát Tự', href: '/bat-tu' },
      { n: 'Xem Tướng', href: '/xem-tuong' },
      { n: 'Thần Số', href: '/than-so-hoc' },
      { n: 'Kinh Dịch', href: '/gieo-que' },
      { n: 'Cân Xương', href: '/can-xuong' },
      { n: 'Thước Lỗ Ban', href: '/thuoc-lo-ban' },
      { n: 'Hợp tuổi', href: '/hop-tuoi' },
      { n: 'Lịch vạn niên', href: '/lich-van-nien' },
      { n: 'Xem ngày tốt', href: '/xem-ngay' },
    ],
  },
  {
    label: 'Tâm lý hiện đại',
    tools: [
      { n: 'MBTI', href: '/mbti' },
      { n: 'Big Five', href: '/big-five' },
      { n: 'DISC', href: '/disc' },
      { n: 'Enneagram', href: '/enneagram' },
    ],
  },
  { label: 'Trực giác', tools: [{ n: 'Tarot', href: '/tarot' }] },
  {
    label: 'Khám phá & so sánh',
    tools: [
      { n: 'So sánh lăng kính', href: '/so-sanh' },
      { n: 'Hỏi đáp', href: '/hoi-dap' },
    ],
  },
];
