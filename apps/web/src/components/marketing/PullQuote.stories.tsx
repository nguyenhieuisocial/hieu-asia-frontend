import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PullQuote } from './PullQuote';

/**
 * Wave 60.66.P5 — PullQuote snapshots (Option E "Editorial Live" decorative
 * role #2 — italic Instrument Serif body between sections).
 *
 * Four stories cover the prop matrix:
 *   - Default: short quote + attribution + warm-dark-50 (home rhythm)
 *   - LongQuote: multi-line italic body + attribution
 *   - WithoutAttribution: standalone quote, no mono line
 *   - DarkBackground: warm-dark-100 variant for tonal alternation
 */
const meta: Meta<typeof PullQuote> = {
  title: 'Marketing/PullQuote',
  component: PullQuote,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof PullQuote>;

export const Default: Story = {
  args: {
    children: (
      <>
        Trí tuệ phương Đông không phải lời tiên tri.{' '}
        Đó là <em className="text-gold-soft">khoảng lặng</em> để bạn nghe rõ chính mình.
      </>
    ),
    attribution: '— Triết lý hieu.asia',
  },
};

export const LongQuote: Story = {
  args: {
    children: (
      <>
        Tử Vi không tiên tri. MBTI không nhãn dán. Bát Tự không định mệnh.
        Đây là <em className="text-gold-soft">bốn ngôn ngữ</em> — bốn ống kính —
        để bạn nghe rõ hơn chính mình. Quyết định cuối cùng vẫn là của bạn.
      </>
    ),
    attribution: '— hieu.asia · 2026',
  },
};

export const WithoutAttribution: Story = {
  args: {
    children: (
      <>
        Bạn vẫn là <em className="text-gold-soft">người quyết định</em>.
      </>
    ),
  },
};

export const DarkBackground: Story = {
  args: {
    ...Default.args,
    bg: 'warm-dark-100',
  },
};
