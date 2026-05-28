import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TuViGlyph, BatTuGlyph, ThanSoGlyph, MbtiGlyph } from './DisciplineGlyphs';

/**
 * Wave 60.95.n P2 — Storybook coverage for the 4 custom discipline glyphs.
 * Chromatic visual regression baseline at default + tablet viewports per
 * the Wave 60.95.j P2-#17 (Sub-agent T) tablet VRT precedent.
 */

const meta: Meta = {
  title: 'Marketing/DisciplineGlyphs',
  parameters: {
    layout: 'centered',
    backgrounds: { value: 'dark' },
  },
};
export default meta;

type Story = StoryObj;

/**
 * Glyph row at the canonical BentoLens size (size-9 / 36px) in brand gold.
 * This matches the home `/` BentoLens row exactly so Chromatic diffs catch
 * any visual regression in either the SVG paths or the gold token.
 */
export const AtBentoLensSize: Story = {
  render: () => (
    <div className="flex items-center gap-12 bg-warm-dark-100 p-12 text-gold">
      <div className="flex flex-col items-center gap-3">
        <TuViGlyph className="size-9" />
        <span className="font-mono text-xs uppercase tracking-wider text-cream-300">Tử Vi</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <BatTuGlyph className="size-9" />
        <span className="font-mono text-xs uppercase tracking-wider text-cream-300">Bát Tự</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <ThanSoGlyph className="size-9" />
        <span className="font-mono text-xs uppercase tracking-wider text-cream-300">Thần Số</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <MbtiGlyph className="size-9" />
        <span className="font-mono text-xs uppercase tracking-wider text-cream-300">MBTI</span>
      </div>
    </div>
  ),
};

/**
 * Size scale — verify glyph readability at 12, 24, 48 px (vault 130 #20
 * spec calls for 3 sizes). 12px is hint-icon range; 24px is inline icon;
 * 48px is hero/legend.
 */
export const SizeScale: Story = {
  render: () => (
    <div className="flex flex-col gap-6 bg-warm-dark-100 p-12 text-gold">
      {([
        ['12px', 'text-[12px]'],
        ['24px', 'text-[24px]'],
        ['48px', 'text-[48px]'],
      ] as const).map(([label, sizeClass]) => (
        <div key={label} className="flex items-center gap-8">
          <span className="w-12 font-mono text-xs uppercase tracking-wider text-cream-500">{label}</span>
          <TuViGlyph className={sizeClass} />
          <BatTuGlyph className={sizeClass} />
          <ThanSoGlyph className={sizeClass} />
          <MbtiGlyph className={sizeClass} />
        </div>
      ))}
    </div>
  ),
};

export const Tablet768: Story = {
  ...AtBentoLensSize,
  parameters: {
    ...AtBentoLensSize.parameters,
    viewport: { value: 'tablet768' },
    chromatic: { viewports: [768] },
  },
};

export const Tablet1024: Story = {
  ...AtBentoLensSize,
  parameters: {
    ...AtBentoLensSize.parameters,
    viewport: { value: 'tablet1024' },
    chromatic: { viewports: [1024] },
  },
};
