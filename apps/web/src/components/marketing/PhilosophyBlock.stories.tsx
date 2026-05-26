import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PhilosophyBlock } from './PhilosophyBlock';

/**
 * Wave 60.56 P2.4 — PhilosophyBlock snapshots.
 *
 * Visual regression for the Raycast-style stance section. Catches drift in
 * eyebrow gold value, italic `<em>` colour binding to `text-gold-soft`, the
 * gold-dot signature period, and the cream-300 body / cream-500 citation
 * contrast on warm-dark backgrounds.
 */
const meta: Meta<typeof PhilosophyBlock> = {
  title: 'Marketing/PhilosophyBlock',
  component: PhilosophyBlock,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof PhilosophyBlock>;

/** Full stance — eyebrow + multi-paragraph body[] + citation, centered. */
export const Default: Story = {
  args: {
    eyebrow: 'TRIẾT LÝ',
    title: (
      <>
        Bạn vẫn là{' '}
        <em className="italic text-gold-soft">người quyết định</em>
        <span className="text-gold-dot">.</span>
      </>
    ),
    body: [
      'Tử Vi không tiên tri. MBTI không nhãn dán. Bát Tự không định mệnh.',
      'Đây chỉ là bốn ngôn ngữ — bốn ống kính — giúp bạn nhìn rõ hơn về chính mình. Quyết định cuối cùng luôn là của bạn.',
    ],
    citation: 'hieu.asia — 2026',
  },
};

/** Minimal stance — single-paragraph body, no eyebrow, no citation. */
export const ShortStance: Story = {
  args: {
    title: (
      <>
        Không có A.I nào hiểu bạn{' '}
        <em className="italic text-gold-soft">đủ</em> để thay bạn sống.
      </>
    ),
    body: 'Chúng tôi chỉ đứng cạnh bạn — như một ống kính đa hướng — để soi rõ cái bạn vốn đã có sẵn bên trong.',
  },
};

/** Left-aligned variant — for in-context use (e.g. inside /about narrative flow). */
export const LeftAligned: Story = {
  args: { ...Default.args, align: 'left' },
};
