import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { OrnamentDivider } from './OrnamentDivider';

/**
 * Wave 60.66.Polish — OrnamentDivider snapshots (Wave 60.35 editorial section
 * separator).
 *
 * Guards the gold-rule + diamond-glyph composition against gradient-stop or
 * gold-opacity drift. Contextual story embeds the divider between two mock
 * sections to confirm vertical rhythm.
 */
const meta: Meta<typeof OrnamentDivider> = {
  title: 'Marketing/OrnamentDivider',
  component: OrnamentDivider,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof OrnamentDivider>;

/** Default: ◆ glyph between two gold gradient rules. */
export const Default: Story = {
  render: (args) => (
    <div className="bg-warm-dark-50 px-6 py-24">
      <OrnamentDivider {...args} />
    </div>
  ),
  args: {},
};

/**
 * Contextual: divider between two mock marketing sections — confirms the
 * editorial rhythm and vertical spacing inherited from caller margins.
 */
export const ContextualBetweenSections: Story = {
  render: () => (
    <div className="bg-warm-dark-50">
      <section className="mx-auto max-w-marketing px-6 py-24 lg:px-12">
        <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
          — TRIẾT LÝ
        </p>
        <h2 className="mt-6 text-balance font-sans text-section-display font-bold tracking-tight text-cream-50">
          Bạn vẫn là{' '}
          <em className="italic text-gold-soft">người quyết định</em>
          <span className="text-gold-dot">.</span>
        </h2>
        <p className="mt-6 max-w-prose font-sans text-lg leading-relaxed text-cream-300">
          Tử Vi không tiên tri. MBTI không nhãn dán. Bát Tự không định mệnh.
        </p>
      </section>

      <OrnamentDivider />

      <section className="mx-auto max-w-marketing px-6 py-24 lg:px-12">
        <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
          — PHƯƠNG PHÁP
        </p>
        <h2 className="mt-6 text-balance font-sans text-section-display font-bold tracking-tight text-cream-50">
          Bốn ống kính, một <em className="italic text-gold-soft">câu chuyện</em>.
        </h2>
        <p className="mt-6 max-w-prose font-sans text-lg leading-relaxed text-cream-300">
          Tử Vi cung mệnh, Bát Tự ngũ hành, Thần Số đường đời, MBTI thiên hướng.
        </p>
      </section>
    </div>
  ),
};
