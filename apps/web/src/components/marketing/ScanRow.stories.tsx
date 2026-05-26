import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sparkles, Calendar, Hash, Brain } from 'lucide-react';
import { ScanRow } from './ScanRow';

/**
 * Wave 60.66.Polish — ScanRow snapshots for Option E "Editorial Live"
 * scan-fast cards (vault 108 §5 + vault 109 §3 Phase 3).
 *
 * Guards: mobile horizontal-scroll-snap, desktop grid (3 vs 4 col), and the
 * line-clamp-2 body overflow guard. Icon pattern follows Wave 60.65.P0a —
 * pre-rendered JSX, not component reference.
 */
const meta: Meta<typeof ScanRow> = {
  title: 'Marketing/ScanRow',
  component: ScanRow,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof ScanRow>;

const fourItems = [
  {
    id: 'tuvi',
    icon: <Sparkles className="size-6 text-gold" strokeWidth={1.5} />,
    label: 'Tử Vi cung mệnh',
    body: 'Bản đồ sao thời điểm sinh — đọc ưu thế và bóng tối tự nhiên.',
    href: '/onboarding?intent=cung-menh',
  },
  {
    id: 'battu',
    icon: <Calendar className="size-6 text-gold" strokeWidth={1.5} />,
    label: 'Bát Tự ngũ hành',
    body: 'Tám chữ năm-tháng-ngày-giờ — cân bằng nguyên tố nội lực.',
    href: '/onboarding?intent=ngu-hanh',
  },
  {
    id: 'thanso',
    icon: <Hash className="size-6 text-gold" strokeWidth={1.5} />,
    label: 'Thần Số đường đời',
    body: 'Numerology phương Tây — mật mã hành trình từ ngày sinh.',
    href: '/onboarding?intent=than-so',
  },
  {
    id: 'mbti',
    icon: <Brain className="size-6 text-gold" strokeWidth={1.5} />,
    label: 'MBTI thiên hướng',
    body: '16 kiểu Myers-Briggs — ngôn ngữ cho thiên hướng nội tại.',
    href: '/onboarding?intent=mbti',
  },
];

/** Default: 4 items on warm-dark-100, full eyebrow + title. */
export const Default: Story = {
  args: {
    eyebrow: 'BỐN ỐNG KÍNH',
    title: (
      <>
        Một con người, <em className="italic text-gold-soft">soi</em> từ bốn góc.
      </>
    ),
    items: fourItems,
    bg: 'warm-dark-100',
  },
};

/** Three items — desktop renders 3-col grid (no 4-col break). */
export const ThreeItems: Story = {
  args: {
    eyebrow: 'BA HƯỚNG NHÌN',
    title: (
      <>
        Ba ống kính, một <em className="italic text-gold-soft">câu chuyện</em>.
      </>
    ),
    items: fourItems.slice(0, 3),
    bg: 'warm-dark-100',
  },
};

/** Minimal — no eyebrow, no title, just the cards for embedding inside larger flows. */
export const WithoutEyebrowTitle: Story = {
  args: {
    items: fourItems,
    bg: 'warm-dark-50',
  },
};

/** Long copy — confirms line-clamp-2 truncates without breaking card height. */
export const WithLongCopy: Story = {
  args: {
    eyebrow: 'CHI TIẾT',
    title: (
      <>
        Đọc kỹ trước khi <em className="italic text-gold-soft">quyết định</em>.
      </>
    ),
    items: fourItems.map((item) => ({
      ...item,
      body: 'Đây là một đoạn mô tả dài hơn bình thường để kiểm tra giới hạn line-clamp-2 — nội dung này phải bị cắt sau hai dòng để không phá vỡ chiều cao card và giữ được nhịp đọc tổng thể của section.',
    })),
    bg: 'warm-dark-100',
  },
};
