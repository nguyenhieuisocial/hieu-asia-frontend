import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TrustStrip, PRICING_PILLARS, FEATURES_PILLARS } from './TrustStrip';

/**
 * Wave 60.42 — TrustStrip snapshots for /pricing and /features pillar sets.
 *
 * Wave 60.37 sub-agent A previously flagged `bg-card/30` as invisible in both
 * modes — visual regression here catches any reintroduction of that bug, plus
 * future palette tweaks that affect the gold value-text or border-gold/15
 * card chrome.
 */
const meta: Meta<typeof TrustStrip> = {
  title: 'Marketing/TrustStrip',
  component: TrustStrip,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof TrustStrip>;

export const PricingPillars: Story = {
  args: { pillars: PRICING_PILLARS },
  render: (args) => (
    <div className="p-8">
      <TrustStrip {...args} />
    </div>
  ),
};

export const FeaturesPillars: Story = {
  args: { pillars: FEATURES_PILLARS },
  render: (args) => (
    <div className="p-8">
      <TrustStrip {...args} />
    </div>
  ),
};

/**
 * Mobile viewport — pillars collapse to grid-cols-1 below sm (640px). Catch
 * any future spacing/typography drift on small screens.
 */
export const PricingMobile: Story = {
  args: { pillars: PRICING_PILLARS },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: (args) => (
    <div className="p-4">
      <TrustStrip {...args} />
    </div>
  ),
};
