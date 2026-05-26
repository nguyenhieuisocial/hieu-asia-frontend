import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SectionDivider } from './SectionDivider';

/**
 * Wave 60.66.P5 — SectionDivider snapshots (Option E "Editorial Live"
 * decorative role #3 — inter-section rule + lotus/glyph).
 *
 * Three stories cover the prop matrix:
 *   - LotusVariant: 8-point motif (default) on warm-dark-50
 *   - GlyphVariant: § Instrument Serif italic on warm-dark-50
 *   - BothInSequence: contextual demo embedding both variants
 */
const meta: Meta<typeof SectionDivider> = {
  title: 'Marketing/SectionDivider',
  component: SectionDivider,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof SectionDivider>;

export const LotusVariant: Story = {
  render: (args) => (
    <div className="bg-warm-dark-50 py-20">
      <SectionDivider {...args} />
    </div>
  ),
  args: { variant: 'lotus' },
};

export const GlyphVariant: Story = {
  render: (args) => (
    <div className="bg-warm-dark-50 py-20">
      <SectionDivider {...args} />
    </div>
  ),
  args: { variant: 'glyph' },
};

/** Contextual: both variants alternating between mock sections. */
export const BothInSequence: Story = {
  render: () => (
    <div className="bg-warm-dark-50">
      <section className="mx-auto max-w-marketing px-6 py-16 lg:px-12">
        <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
          — MINH CHỨNG
        </p>
        <h2 className="mt-4 text-balance font-sans text-section-display font-bold tracking-tight text-cream-50">
          Người Việt tin tưởng hieu.asia.
        </h2>
      </section>

      <SectionDivider variant="lotus" />

      <section className="mx-auto max-w-marketing px-6 py-16 lg:px-12">
        <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
          — TRIẾT LÝ
        </p>
        <h2 className="mt-4 text-balance font-sans text-section-display font-bold tracking-tight text-cream-50">
          Bạn vẫn là người quyết định.
        </h2>
      </section>

      <SectionDivider variant="glyph" />

      <section className="mx-auto max-w-marketing px-6 py-16 lg:px-12">
        <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
          — GÓI THÀNH VIÊN
        </p>
        <h2 className="mt-4 text-balance font-sans text-section-display font-bold tracking-tight text-cream-50">
          Đi sâu theo nhịp của bạn.
        </h2>
      </section>
    </div>
  ),
};
