import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sparkles, Calendar, Hash, Brain } from 'lucide-react';
import { BentoLens } from './BentoLens';

/**
 * Wave 60.56 P2.5 — BentoLens snapshots for Option D 4-lens grid.
 *
 * Matches visual reference `/tmp/wave-60-56-option-d/feature-bento-v2.png` —
 * 2×2 bento with Tử Vi (recommended/gold border), Bát Tự, Thần Số, MBTI.
 */
const meta: Meta<typeof BentoLens> = {
  title: 'Marketing/BentoLens',
  component: BentoLens,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof BentoLens>;

export const Default: Story = {
  args: {
    eyebrow: 'BỐN ỐNG KÍNH',
    title: (
      <>
        Một con người, <em className="italic text-gold-soft">soi</em> từ bốn góc.
      </>
    ),
    lenses: [
      {
        id: 'tuvi',
        name: 'TỬ VI',
        subname: 'CUNG MỆNH',
        icon: Sparkles,
        action: 'Đọc',
        title: 'cung mệnh',
        body: 'Bản đồ sao thời điểm sinh — không phải lời tiên tri, mà là bản đồ ưu thế và bóng tối tự nhiên.',
        watermark: 'Tử Vi',
        recommended: true,
      },
      {
        id: 'battu',
        name: 'BÁT TỰ',
        subname: 'NGŨ HÀNH',
        icon: Calendar,
        action: 'Cân',
        title: 'ngũ hành',
        body: 'Tám chữ năm-tháng-ngày-giờ — đo nội lực và cân bằng nguyên tố của một con người.',
        watermark: 'Bát Tự',
      },
      {
        id: 'thanso',
        name: 'THẦN SỐ',
        subname: 'NUMEROLOGY',
        icon: Hash,
        action: 'Đếm',
        title: 'con số đời',
        body: 'Numerology phương Tây — đường đời, ngày sinh, tên gọi cộng dồn thành mật mã hành trình.',
        watermark: 'Thần Số',
      },
      {
        id: 'mbti',
        name: 'MBTI',
        subname: 'TÂM LÝ HỌC',
        icon: Brain,
        action: 'Gọi tên',
        title: 'tâm trí',
        body: '16 kiểu Myers-Briggs — không nhãn dán, mà là ngôn ngữ để nhận diện thiên hướng nội tại.',
        watermark: 'MBTI',
      },
    ],
  },
};

/**
 * Mobile viewport — bento collapses to grid-cols-1. Catches any spacing
 * or watermark drift on narrow screens.
 */
export const Mobile: Story = {
  args: Default.args,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
