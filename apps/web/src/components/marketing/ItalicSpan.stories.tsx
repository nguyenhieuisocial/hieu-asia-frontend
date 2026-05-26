import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ItalicSpan } from './ItalicSpan';

/**
 * Wave 60.66.Polish — ItalicSpan standalone snapshots (Wave 60.56 P2.5 R4
 * primitive, originally only covered as a demo in Primitives.stories).
 *
 * Guards the gold-soft italic verb + optional gold-dot signature period
 * against palette drift. Inline story confirms the fragment-shape — no
 * wrapping div — slots correctly into body copy without disrupting flow.
 */
const meta: Meta<typeof ItalicSpan> = {
  title: 'Marketing/ItalicSpan',
  component: ItalicSpan,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof ItalicSpan>;

/** Default: italic gold-soft "hiểu" with gold-dot period — display heading usage. */
export const Default: Story = {
  render: (args) => (
    <div className="bg-warm-dark-50 p-12">
      <p className="font-sans text-display font-bold text-cream-50">
        Bạn đã <ItalicSpan {...args}>hiểu</ItalicSpan> chính mình chưa
      </p>
    </div>
  ),
  args: {
    children: 'hiểu',
    goldDotAfter: false,
  },
};

/** With different verb — "nhớ" + gold-dot, confirms verb-agnostic styling. */
export const WithDifferentVerb: Story = {
  render: (args) => (
    <div className="bg-warm-dark-50 p-12">
      <p className="font-sans text-display font-bold text-cream-50">
        Hãy <ItalicSpan {...args}>nhớ</ItalicSpan> rằng bạn vẫn là người quyết định
      </p>
    </div>
  ),
  args: {
    children: 'nhớ',
    goldDotAfter: true,
  },
};

/** Inline: embedded inside body paragraph, confirms fragment-shape preserves flow. */
export const Inline: Story = {
  render: (args) => (
    <div className="bg-warm-dark-50 p-12">
      <p className="max-w-prose font-sans text-lg leading-relaxed text-cream-300">
        Bốn ống kính giúp bạn{' '}
        <ItalicSpan {...args}>soi</ItalicSpan> chính mình từ nhiều góc — không tiên
        tri, không nhãn dán, chỉ một ngôn ngữ để bạn đối thoại với nội tâm.
      </p>
    </div>
  ),
  args: {
    children: 'soi',
  },
};
