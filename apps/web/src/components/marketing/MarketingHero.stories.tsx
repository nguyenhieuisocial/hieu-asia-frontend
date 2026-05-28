import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MarketingHero } from './MarketingHero';

/**
 * Wave 60.56 P2.1 — MarketingHero snapshots for Option D "Warm-Dark Editorial".
 *
 * Three stories cover the full prop matrix:
 *   - Default: full chrome (eyebrow + italic-span title + subtitle + dual CTA + trust + ring + watermark)
 *   - NoOrnament: text-only variant for nested sections
 *   - MinimalCTA: single CTA without trust line (for above-the-fold variants)
 *
 * Visual regression guards against the Wave 60.55 R1 regression where four
 * pages had drifting hardcoded hero copy. Story fixtures are the single
 * source of truth for the visual reference.
 */
const meta: Meta<typeof MarketingHero> = {
  title: 'Marketing/MarketingHero',
  component: MarketingHero,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof MarketingHero>;

export const Default: Story = {
  args: {
    eyebrow: 'A.I · LUẬN GIẢI · 2026',
    title: (
      <>
        Hiểu mình.{' '}
        <em className="italic text-gold-soft">Quyết định</em> mình
        <span className="text-gold-dot drop-shadow-[0_0_16px_rgba(229,198,138,0.18)]">
          .
        </span>
      </>
    ),
    subtitle:
      'Bốn ống kính — Tử Vi, Bát Tự, Thần Số, MBTI — đọc lên trong một khoảng lặng. Không tiên tri. Không định mệnh hoá. Chỉ một ngôn ngữ để bạn đối thoại với chính mình.',
    primaryCta: { label: 'Bắt đầu luận giải', href: '/onboarding' },
    secondaryCta: { label: 'Xem phương pháp', href: '/methodology' },
    trustLine: '5 phút · miễn phí · không cần thẻ',
    ornament: 'gold-ring',
    watermark: 'Tử Vi',
  },
};

export const NoOrnament: Story = {
  args: {
    ...Default.args,
    ornament: 'none',
    watermark: undefined,
  },
};

export const MinimalCTA: Story = {
  args: {
    ...Default.args,
    secondaryCta: undefined,
    trustLine: undefined,
    ornament: 'none',
  },
};

/**
 * Wave 60.95.j P2-#17 — Tablet 768 (iPad portrait) VRT baseline.
 *
 * Composes the canonical Default render and pins the iframe to 768×1024 so
 * Chromatic snaps the hero at the iPad portrait break. Catches layout drift
 * in the headline lockup, dual-CTA stack, and gold-ring ornament at the
 * primary tablet width.
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
 * Wave 60.95.j P2-#17 — Tablet 1024 (iPad Pro portrait) VRT baseline.
 *
 * Wide-tablet / small-desktop break — guards the transition between mobile
 * stacked CTAs and the desktop side-by-side layout.
 */
export const Tablet1024: Story = {
  ...Default,
  parameters: {
    ...Default.parameters,
    viewport: { value: 'tablet1024' },
    chromatic: { viewports: [1024] },
  },
};
