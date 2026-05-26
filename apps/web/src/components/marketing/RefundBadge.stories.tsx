import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RefundBadge } from './RefundBadge';

/**
 * Wave 60.66.Polish — RefundBadge standalone snapshots (Wave 60.56 P2.5 R3
 * trust signal, originally only covered as a demo in Primitives.stories).
 *
 * Guards the jade-tinted mono pill + dot leader against palette drift. Days
 * variants (7 / 14 / 30) confirm digit-count layout doesn't shift the dot.
 */
const meta: Meta<typeof RefundBadge> = {
  title: 'Marketing/RefundBadge',
  component: RefundBadge,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof RefundBadge>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-warm-dark-50 p-12">{children}</div>
);

/** Default: 14 days — the canonical refund window. */
export const Default: Story = {
  render: (args) => (
    <Frame>
      <RefundBadge {...args} />
    </Frame>
  ),
  args: {
    days: 14,
  },
};

/** 7 days — checkout micro-window for accessory products. */
export const SevenDays: Story = {
  render: Default.render,
  args: {
    days: 7,
  },
};

/** 30 days — pro tier extended guarantee. */
export const ThirtyDays: Story = {
  render: Default.render,
  args: {
    days: 30,
  },
};

/** Inline — embedded inside body copy, smaller visual weight via opacity. */
export const Inline: Story = {
  render: (args) => (
    <Frame>
      <p className="font-sans text-base text-cream-300">
        Mua một lần, dùng cả đời.{' '}
        <RefundBadge {...args} className="opacity-80" /> nếu chưa hài lòng.
      </p>
    </Frame>
  ),
  args: {
    days: 14,
  },
};
