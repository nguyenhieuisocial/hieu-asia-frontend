import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PaintedCanvas } from './PaintedCanvas';

/**
 * Wave 60.66.Polish — PaintedCanvas snapshots for Option E "Editorial Live"
 * atmosphere layer (vault 108 §3).
 *
 * Guards the four-layer composition: base warm-dark-50, vertical fade,
 * radial gold-soft glow, and feTurbulence noise. Tone variants (soft / rich)
 * exercise the gold opacity matrix (8% vs 14%). Lotus watermark story
 * documents the future-reserved motif slot.
 */
const meta: Meta<typeof PaintedCanvas> = {
  title: 'Marketing/PaintedCanvas',
  component: PaintedCanvas,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof PaintedCanvas>;

/** Default: soft tone, no watermark — empty canvas to read the gradient. */
export const Default: Story = {
  render: (args) => (
    <PaintedCanvas {...args} className="min-h-[480px]">
      <div className="mx-auto max-w-marketing px-6 py-24 lg:px-12">
        <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
          — SOFT TONE
        </p>
      </div>
    </PaintedCanvas>
  ),
  args: {
    tone: 'soft',
    watermark: 'none',
  },
};

/** Rich tone — 14% gold radial for sections that want more warmth. */
export const RichTone: Story = {
  render: Default.render,
  args: {
    tone: 'rich',
    watermark: 'none',
  },
};

/** With lotus watermark — bottom-right decorative motif (Wave 60.56.R6 reserved). */
export const WithLotusWatermark: Story = {
  render: Default.render,
  args: {
    tone: 'soft',
    watermark: 'lotus',
  },
};

/** With child content — the canonical usage wrapping a hero-style heading. */
export const WithChildContent: Story = {
  render: (args) => (
    <PaintedCanvas {...args} className="min-h-[560px]">
      <div className="mx-auto max-w-marketing px-6 py-24 lg:px-12">
        <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
          — A.I · LUẬN GIẢI · 2026
        </p>
        <h1 className="mt-6 text-balance font-sans text-display font-bold tracking-tight text-cream-50">
          Hiểu mình.{' '}
          <em className="italic text-gold-soft">Quyết định</em> mình
          <span className="text-gold-dot">.</span>
        </h1>
        <p className="mt-6 max-w-prose font-sans text-lg leading-relaxed text-cream-300">
          Bốn ống kính — Tử Vi, Bát Tự, Thần Số, MBTI — đọc lên trong một
          khoảng lặng.
        </p>
      </div>
    </PaintedCanvas>
  ),
  args: {
    tone: 'rich',
    watermark: 'lotus',
  },
};
