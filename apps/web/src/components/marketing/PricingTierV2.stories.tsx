import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PricingTierV2, type PricingTierV2Tier } from './PricingTierV2';

/**
 * Wave 60.56 P2.3 — PricingTierV2 snapshots for Option D "Warm-Dark Editorial".
 *
 * Three stories cover the prop matrix:
 *   - Default: 3 tiers (Khởi đầu / Đối thoại / Đồng hành), monthly view
 *   - YearlyDefault: same data, opens on yearly toggle + 20% savings caption
 *   - TwoTiers: simplified 2-tier mode (free + premium, no mentor)
 *
 * Visual regression guards against Wave 60.55 R1 finding: 5-tier Stripe-template
 * row caused decision paralysis. Story fixtures are the single source of truth.
 */
const meta: Meta<typeof PricingTierV2> = {
  title: 'Marketing/PricingTierV2',
  component: PricingTierV2,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof PricingTierV2>;

const defaultTiers: PricingTierV2Tier[] = [
  {
    id: 'free',
    name: 'MIỄN PHÍ',
    nameDisplay: 'Khởi đầu',
    description: 'Một lát cắt đầu — đủ để cảm nhận giọng nói.',
    priceMonthly: 0,
    features: [
      '1 ống kính / tháng',
      'Luận giải tóm tắt',
      'Lưu 30 ngày gần nhất',
    ],
    ctaLabel: 'Bắt đầu miễn phí',
    ctaHref: '/onboarding',
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    nameDisplay: 'Đối thoại',
    description: 'Bốn ống kính đầy đủ — đi sâu, đi đều, đi dài.',
    priceMonthly: 199000,
    priceYearly: 1990000,
    yearlyDiscount: 'Tiết kiệm 20%',
    features: [
      '4 ống kính, không giới hạn',
      'Luận giải sâu, có ngữ cảnh',
      'Nhật ký nội tâm có A.I phản chiếu',
      'Xuất PDF chia sẻ',
    ],
    ctaLabel: 'Chọn Premium',
    ctaHref: '/checkout/premium',
    primary: true,
    recommended: true,
    refundDays: 30,
  },
  {
    id: 'mentor',
    name: 'MENTOR',
    nameDisplay: 'Đồng hành',
    description: 'Premium + một cuộc hẹn 1-1 với chuyên gia mỗi quý.',
    priceMonthly: 499000,
    features: [
      'Toàn bộ tính năng Premium',
      '1 buổi 1-1 video / quý (60 phút)',
      'Ưu tiên hỗ trợ trong 4 giờ',
      'Bản luận giải năm dạng sách in',
    ],
    ctaLabel: 'Chọn Mentor',
    ctaHref: '/checkout/mentor',
  },
];

export const Default: Story = {
  args: {
    eyebrow: 'GÓI THÀNH VIÊN',
    title: (
      <>
        Đi <em className="italic text-gold-soft">sâu</em> theo nhịp của bạn.
      </>
    ),
    tiers: defaultTiers,
  },
};

export const YearlyDefault: Story = {
  args: {
    ...Default.args,
    defaultPeriod: 'yearly',
  },
};

export const TwoTiers: Story = {
  args: {
    ...Default.args,
    tiers: defaultTiers.slice(0, 2),
  },
};
