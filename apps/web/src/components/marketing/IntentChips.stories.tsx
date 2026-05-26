import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IntentChips } from './IntentChips';

/**
 * Wave 60.66.Polish — IntentChips snapshots for Option E "Editorial Live"
 * Perplexity-style chip row (vault 108 §5).
 *
 * Guards the rounded-pill border, hover gold-transition, and the glass-panel
 * wrap toggle. Mobile single-row story confirms wrap behaviour at <640px.
 */
const meta: Meta<typeof IntentChips> = {
  title: 'Marketing/IntentChips',
  component: IntentChips,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof IntentChips>;

const sixChips = [
  { slug: 'cung-menh', label: 'Cung mệnh' },
  { slug: 'dai-van', label: 'Đại vận' },
  { slug: 'ngu-hanh', label: 'Ngũ hành' },
  { slug: 'thien-huong', label: 'Thiên hướng nghề' },
  { slug: 'tinh-duyen', label: 'Tình duyên' },
  { slug: 'than-so', label: 'Thần số' },
];

/** Default: 6 chips inside a glass panel — the canonical hero-adjacent layout. */
export const Default: Story = {
  render: (args) => (
    <div className="bg-warm-dark-50 p-12">
      <IntentChips {...args} />
    </div>
  ),
  args: {
    chips: sixChips,
  },
};

/** No glass — raw chip row for embedding inside surfaces that already paint atmosphere. */
export const NoGlass: Story = {
  render: Default.render,
  args: {
    chips: sixChips,
    glass: false,
  },
};

/** With eyebrow — labelled chip row, e.g. above the hero CTA. */
export const WithEyebrow: Story = {
  render: Default.render,
  args: {
    chips: sixChips,
    eyebrow: 'BẠN MUỐN LUẬN GIẢI ĐIỀU GÌ',
  },
};

/** Mobile viewport — chips wrap into multiple rows on narrow screens. */
export const MobileSingleRow: Story = {
  render: Default.render,
  args: {
    chips: sixChips.slice(0, 4),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
