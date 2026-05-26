import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

/**
 * Wave 60.42 — visual regression coverage for the Button bug pattern from
 * Wave 60.41 (default-variant disabled state rendered as a washed-out gold
 * ghost on cream — invisible against the light-mode background).
 *
 * Stories cover all 4 variants × default/disabled states so Chromatic
 * pixel-diffs catch any future regression on either light or dark theme.
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Tiếp tục',
  },
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const DefaultDisabled: Story = {
  args: { variant: 'default', disabled: true },
};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const OutlineDisabled: Story = {
  args: { variant: 'outline', disabled: true },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const GhostDisabled: Story = {
  args: { variant: 'ghost', disabled: true },
};

export const Link: Story = {
  args: { variant: 'link' },
};

export const LinkDisabled: Story = {
  args: { variant: 'link', disabled: true },
};

/**
 * Sanity check — render every variant side-by-side in both states so a single
 * Chromatic snapshot diff catches contrast regressions across the matrix.
 */
export const AllVariantsMatrix: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-6">
      <Button variant="default">Default</Button>
      <Button variant="default" disabled>
        Default disabled
      </Button>
      <Button variant="outline">Outline</Button>
      <Button variant="outline" disabled>
        Outline disabled
      </Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghost" disabled>
        Ghost disabled
      </Button>
      <Button variant="link">Link</Button>
      <Button variant="link" disabled>
        Link disabled
      </Button>
    </div>
  ),
};
