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

/**
 * Wave 60.95.j P2-#17 — Tablet 768 VRT baseline.
 *
 * Verifies the 6-chip Perplexity-style row keeps a single rounded-pill row at
 * iPad portrait (chips should NOT wrap until ~640px). Glass panel border
 * stays crisp, hover gold-transition unaffected by viewport.
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
 * Wave 60.95.j P2-#17 — Tablet 1024 VRT baseline.
 *
 * Wide-tablet break — confirms the glass panel maxes out width and the chip
 * row remains centered within the editorial column.
 */
export const Tablet1024: Story = {
  ...Default,
  parameters: {
    ...Default.parameters,
    viewport: { value: 'tablet1024' },
    chromatic: { viewports: [1024] },
  },
};
