import type { Config } from 'tailwindcss';
import preset from '@hieu-asia/config/tailwind';

/**
 * Wave 60.56 — Option D "Warm-Dark Editorial" marketing extensions.
 * Founder-locked 2026-05-26. These tokens are marketing-surface only
 * (landing / pricing / features). In-app UI still uses the preset's
 * `ink`/`gold`/`purple`/`jade` palette. See vault `105 - Marketing
 * Redesign Plan` Section 4 + Option D v2 final spec for rationale.
 *
 * Tailwind merges `theme.extend` shallowly, so preset tokens are preserved
 * and these additions live alongside them (no overrides, no breakage).
 */
const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm-dark sepia editorial scale (candlelight body bg → border).
        'warm-dark': {
          50: '#13110D',
          100: '#1B1714',
          200: '#221C18',
          300: '#2E2620',
          400: '#3A302A',
          500: '#4A3F36',
        },
        // Cream scale — light-theme parity. Wave 60.56 P1.1 rename
        // (cream-scale → cream) per /ultrareview must-fix: components used
        // text-cream-{50,100,300,500} but JIT only generated text-cream-scale-*.
        // DEFAULT preserves preset's flat `cream: '#F2EDE3'` for back-compat
        // (existing utilities `text-cream`, `bg-cream` keep working).
        cream: {
          DEFAULT: '#F2EDE3',
          50: '#F5F0E6',
          100: '#EFE7D6',
          300: '#C9BFB0',
          500: '#8A8275',
        },
        // Gold extensions for Option D signature italic spans + period dots.
        'gold-soft': '#D4B373',
        'gold-dot': '#E5C68A',
        // Semantic refresh (lightened for warm-dark contrast).
        'jade-marketing': '#5BA89F',
        'purple-marketing': '#8366A8',
      },
      boxShadow: {
        // Gold-dot glow halo for signature periods.
        'gold-dot-glow': '0 0 16px rgba(229,198,138,0.18)',
      },
      fontFamily: {
        // Marketing-only display serif. Outfit/Be Vietnam Pro/JetBrains Mono
        // preset entries kept for in-app UI.
        'marketing-display': [
          'var(--font-marketing-display)',
          // VN fallback for chars outside Instrument Serif latin-ext subset
          // (Be Vietnam Pro already loaded in root layout).
          'var(--font-be-vietnam)',
          'Georgia',
          'serif',
        ],
      },
      fontSize: {
        'hero-display': [
          'clamp(40px, 8vw, 92px)',
          { lineHeight: '1.06', letterSpacing: '-0.02em' },
        ],
        'section-display': [
          'clamp(34px, 4vw, 48px)',
          { lineHeight: '1.15', letterSpacing: '-0.01em' },
        ],
        eyebrow: [
          '11px',
          { lineHeight: '1.4', letterSpacing: '0.12em' },
        ],
        'price-amount': ['44px', { lineHeight: '1.2' }],
        'tier-name': ['32px', { lineHeight: '1.3' }],
      },
      maxWidth: {
        marketing: '1280px',
        'marketing-tight': '980px',
        'marketing-text': '540px',
      },
      borderRadius: {
        pill: '9999px',
        'card-editorial': '20px',
      },
      transitionTimingFunction: {
        // Option D signature ease — soft entry, firm settle.
        editorial: 'cubic-bezier(0.165, 0.85, 0.45, 1)',
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
};

export default config;
