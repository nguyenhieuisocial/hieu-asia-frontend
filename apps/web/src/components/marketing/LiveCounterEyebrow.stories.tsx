import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LiveCounterEyebrow } from './LiveCounterEyebrow';

/**
 * Wave 60.66.Polish — LiveCounterEyebrow snapshots for Option E "Editorial Live"
 * (vault 108 §5 Phase 1 static seed).
 *
 * Guards the vi-VN Intl.NumberFormat output (1243 → "1.243"), the
 * uppercase-period transform, and the optional rating segment. Phase 4 will
 * wire real PostHog API but the component contract stays pure — these stories
 * pin the visual shape.
 */
const meta: Meta<typeof LiveCounterEyebrow> = {
  title: 'Marketing/LiveCounterEyebrow',
  component: LiveCounterEyebrow,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof LiveCounterEyebrow>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-warm-dark-50 p-12">
    <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
      — {children}
    </p>
  </div>
);

/** Default: 1.243 báo cáo trong tuần · 4.8★ — the canonical hero eyebrow. */
export const Default: Story = {
  render: (args) => (
    <Frame>
      <LiveCounterEyebrow {...args} />
    </Frame>
  ),
  args: {
    count: 1243,
    period: 'trong tuần',
    rating: 4.8,
  },
};

/** Without rating — neutral seed for periods where founder can't defend the rating yet. */
export const WithoutRating: Story = {
  render: Default.render,
  args: {
    count: 1243,
    period: 'trong tuần',
  },
};

/** Large number — confirms vi-VN thousands separator at 5 digits (47.832). */
export const LargeNumber: Story = {
  render: Default.render,
  args: {
    count: 47832,
    period: 'tháng này',
    rating: 4.9,
  },
};

/** Small number — confirms no separator artefacts under 1000. */
export const SmallNumber: Story = {
  render: Default.render,
  args: {
    count: 47,
    period: 'hôm nay',
    rating: 5.0,
  },
};
