import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BigNumberRow } from './BigNumberRow';

/**
 * Wave 60.66.P4 — BigNumberRow snapshots (Option E "Editorial Live" decorative
 * role #1 — 3-col big-number social proof + count-up reveal + risk-reversal).
 *
 * Four stories cover the prop matrix:
 *   - Default: home-page values (1.243 / 4,8★ / 14 ngày) + 14-day refund block
 *   - WithoutRiskReversal: numerals only, no refund copy
 *   - HighDecimal: 99,99% suffix + decimalPlaces 2 — edge case for fractional rendering
 *   - LargeNumbers: 1.250.000 + 4,9 + 30 — verifies vi-VN thousand separators scale
 */
const meta: Meta<typeof BigNumberRow> = {
  title: 'Marketing/BigNumberRow',
  component: BigNumberRow,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof BigNumberRow>;

export const Default: Story = {
  args: {
    eyebrow: 'MINH CHỨNG',
    title: (
      <>
        Người Việt{' '}
        <u className="underline decoration-gold decoration-2 underline-offset-[6px]">
          tin tưởng
        </u>{' '}
        hieu.asia<span className="text-gold-dot">.</span>
      </>
    ),
    numbers: [
      {
        value: 1243,
        caption: 'BÁO CÁO MỘT THÁNG QUA',
      },
      {
        value: 4.8,
        suffix: '★',
        caption: 'ĐÁNH GIÁ PREMIUM',
        decimalPlaces: 1,
      },
      {
        value: 14,
        suffix: ' NGÀY',
        caption: 'HOÀN TIỀN 100%',
      },
    ],
    riskReversal: {
      headline: 'Không hài lòng? Hoàn tiền trong 14 ngày.',
      body: 'Không cần lý do. Chuyển khoản trong 24h sau khi yêu cầu. Bạn vẫn giữ được PDF báo cáo đã tải.',
      cta: 'Xem chính sách hoàn tiền',
      href: '/pricing#refund',
    },
    bg: 'warm-dark-50',
  },
};

export const WithoutRiskReversal: Story = {
  args: {
    eyebrow: 'MINH CHỨNG',
    title: (
      <>
        Người Việt{' '}
        <u className="underline decoration-gold decoration-2 underline-offset-[6px]">
          tin tưởng
        </u>{' '}
        hieu.asia<span className="text-gold-dot">.</span>
      </>
    ),
    numbers: [
      {
        value: 1243,
        caption: 'BÁO CÁO MỘT THÁNG QUA',
      },
      {
        value: 4.8,
        suffix: '★',
        caption: 'ĐÁNH GIÁ PREMIUM',
        decimalPlaces: 1,
      },
      {
        value: 14,
        suffix: ' NGÀY',
        caption: 'HOÀN TIỀN 100%',
      },
    ],
    bg: 'warm-dark-50',
  },
};

export const HighDecimal: Story = {
  args: {
    eyebrow: 'CHẤT LƯỢNG',
    title: (
      <>
        Engine deterministic — <em className="italic text-gold-soft">tái tạo</em> được.
      </>
    ),
    numbers: [
      {
        value: 99.99,
        suffix: '%',
        caption: 'TÁI TẠO LÁ SỐ',
        decimalPlaces: 2,
      },
      {
        value: 0.05,
        suffix: 's',
        caption: 'THỜI GIAN LẬP CHART',
        decimalPlaces: 2,
      },
      {
        value: 12.5,
        suffix: ' KB',
        caption: 'BUNDLE DELTA',
        decimalPlaces: 1,
      },
    ],
    bg: 'warm-dark-100',
  },
};

export const LargeNumbers: Story = {
  args: {
    eyebrow: 'QUY MÔ',
    title: (
      <>
        Cộng đồng <em className="italic text-gold-soft">đang lớn</em> mỗi ngày.
      </>
    ),
    numbers: [
      {
        value: 1250000,
        prefix: '+',
        caption: 'LƯỢT LUẬN GIẢI',
      },
      {
        value: 4.9,
        suffix: '★',
        caption: 'ĐÁNH GIÁ TRUNG BÌNH',
        decimalPlaces: 1,
      },
      {
        value: 30,
        suffix: ' NGÀY',
        caption: 'DÙNG THỬ MIỄN PHÍ',
      },
    ],
    bg: 'warm-dark-50',
  },
};

/**
 * Wave 60.95.j P2-#17 — Tablet 768 VRT baseline.
 *
 * 3-col big-number grid is the most fragile layout at tablet break — verifies
 * column gutters, count-up digit cap-height alignment, and the refund-block
 * stacking under the numerals at iPad portrait width.
 */
export const Tablet768: Story = {
  ...Default,
  parameters: {
    ...Default.parameters,
    viewport: { value: 'tablet768' },
    chromatic: { viewports: [768] },
  },
};

/**
 * Wave 60.95.j P2-#17 — Tablet 1024 VRT baseline.
 *
 * Wide-tablet break — the numerals should retain their hero-sized weight
 * here (close to desktop typography), distinct from the compressed 768 stack.
 */
export const Tablet1024: Story = {
  ...Default,
  parameters: {
    ...Default.parameters,
    viewport: { value: 'tablet1024' },
    chromatic: { viewports: [1024] },
  },
};
