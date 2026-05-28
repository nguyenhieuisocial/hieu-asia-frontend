import type { Preview } from '@storybook/nextjs-vite';
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
 *
 * Wave 60.95.j P2-#17 — Tablet (768/1024) VRT baselines.
 *
 * Storybook 10 ships the viewport addon inside the `storybook` package itself
 * (no separate `@storybook/addon-viewport` install needed). We register five
 * named viewports below; stories opt in via `parameters.viewport.value`
 * (per-story) or by adding a sibling story export (e.g. `Tablet768`) that
 * spreads `Default` and overrides viewport + `chromatic.viewports`.
 *
 *   mobile320   320×568   iPhone SE 1st gen — narrowest target
 *   mobile375   375×667   iPhone 8 — modal/sheet baseline
 *   tablet768   768×1024  iPad portrait — primary tablet break
 *   tablet1024  1024×1366 iPad Pro portrait — wide-tablet/small-desktop break
 *   desktop1280 1280×800  MacBook 13" — default editorial layout
 *
 * The viewport is NOT changed at the global level — every existing story keeps
 * its current responsive (full-bleed) render so Chromatic baselines stay
 * stable. New `Tablet768` / `Tablet1024` story exports opt-in per surface.
 */
const customViewports = {
  mobile320: {
    name: 'Mobile 320 (iPhone SE 1st gen)',
    styles: { width: '320px', height: '568px' },
    type: 'mobile' as const,
  },
  mobile375: {
    name: 'Mobile 375 (iPhone 8)',
    styles: { width: '375px', height: '667px' },
    type: 'mobile' as const,
  },
  tablet768: {
    name: 'Tablet 768 (iPad portrait)',
    styles: { width: '768px', height: '1024px' },
    type: 'tablet' as const,
  },
  tablet1024: {
    name: 'Tablet 1024 (iPad Pro portrait)',
    styles: { width: '1024px', height: '1366px' },
    type: 'tablet' as const,
  },
  desktop1280: {
    name: 'Desktop 1280 (MacBook 13")',
    styles: { width: '1280px', height: '800px' },
    type: 'desktop' as const,
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        light: { name: 'light', value: 'hsl(36 30% 92%)' },
        dark: { name: 'dark', value: 'hsl(240 8% 6%)' }
      }
    },
    viewport: {
      options: customViewports,
    },
    layout: 'centered',
  },

  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
  ],

  initialGlobals: {
    backgrounds: {
      value: 'light'
    }
  }
};

export default preview;
