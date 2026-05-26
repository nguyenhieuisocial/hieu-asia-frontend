import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ItalicSpan } from './ItalicSpan';
import { RefundBadge } from './RefundBadge';

/**
 * Wave 60.56 P2.5 — Primitive snapshots for Option D marketing surfaces.
 *
 * Covers `<ItalicSpan>` (signature italic verb + optional gold-dot period)
 * and `<RefundBadge>` (jade trust signal). Visual regression here guards
 * the gold-soft/gold-dot palette and the jade refund pill from palette
 * drift in Phase 3 page assembly.
 */
const meta: Meta = {
  title: 'Marketing/Primitives',
};
export default meta;

export const ItalicSpanDemo: StoryObj = {
  render: () => (
    <div className="bg-warm-dark-50 p-12">
      <p className="font-marketing-display text-4xl text-cream-50">
        Hiểu mình. <ItalicSpan goldDotAfter>Quyết định</ItalicSpan> mình.
      </p>
    </div>
  ),
};

export const RefundBadgeDemo: StoryObj = {
  render: () => (
    <div className="bg-warm-dark-50 p-12">
      <RefundBadge days={30} />
    </div>
  ),
};
