import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';

// Brand tokens + Tailwind layer. This is the same stylesheet the production
// Next.js app loads in `app/layout.tsx`, so stories render with the exact
// CSS vars (--background light cream / dark ink, --gold, --foreground, …).
import '../src/app/globals.css';

/**
 * Wave 60.42 — Visual regression baseline.
 *
 * Two backgrounds map to the brand's light/dark CSS vars:
 *   light → --background: 36 30% 92% (kem ngà #F2EDE3)
 *   dark  → --background: 240 8% 6%  (đen than #0F0F12)
 *
 * Theme switcher toggles `.dark` on <html>, which flips every `dark:` Tailwind
 * variant and the `:root` vs `.dark` token block in globals.css.
 */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'hsl(36 30% 92%)' },
        { name: 'dark', value: 'hsl(240 8% 6%)' },
      ],
    },
    layout: 'centered',
  },
  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
