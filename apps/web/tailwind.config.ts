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
        // Wave 62.01 — editorial display serif per "Như giấy cũ" spec.
        // Newsreader Variable (300–800, normal+italic) replaces Instrument
        // Serif's role for hero / H1 / H2 / pull quote. VN diacritics outside
        // latin-ext fall back to Be Vietnam Pro (already loaded in root layout).
        // Use via `font-editorial-display` Tailwind class on Newsreader-led
        // surfaces. `font-marketing-display` kept transitional until 62.04
        // hero rewrite migrates BentoLens + MarketingHero + PullQuote.
        'editorial-display': [
          'var(--font-newsreader)',
          'var(--font-be-vietnam)',
          'Georgia',
          'serif',
        ],
      },
      fontSize: {
        // Wave 60.95.am — type scale REDESIGN per founder reference
        // (numerologycalculators.org typography pattern). Brought hero down
        // from 48-96px → 44-72px and section down from 34-48px → 30-40px for
        // a more measured editorial rhythm. Body-large added as standardized
        // lead paragraph size with 1.65 line-height (matches ref site).
        //
        // Scale at key widths:
        //   hero-display: 320px→44px · 768px→~58px · 1280px+→72px
        //   section-display: 320px→30px · 768px→~36px · 1280px+→40px
        //   body-large: 320px→17px · 1280px+→19px
        // h1 ergonomics: ~30 chars/line at lg, ~14 at sm (unchanged from prior).
        'hero-display': [
          'clamp(2.75rem, 5.5vw, 4.5rem)',
          { lineHeight: '1.08', letterSpacing: '-0.02em' },
        ],
        'section-display': [
          'clamp(30px, 3vw, 40px)',
          { lineHeight: '1.18', letterSpacing: '-0.01em' },
        ],
        'body-large': [
          'clamp(17px, 1.2vw, 19px)',
          { lineHeight: '1.65', letterSpacing: '0' },
        ],
        eyebrow: [
          '11px',
          { lineHeight: '1.4', letterSpacing: '0.12em' },
        ],
        'price-amount': ['40px', { lineHeight: '1.2' }],
        'tier-name': ['28px', { lineHeight: '1.3' }],
      },
      maxWidth: {
        // Wave 60.95.am — tighten marketing-tight to 1024px so body copy
        // hits ~65-75 chars per line (ideal measure per typography research).
        // Marketing 1280 kept for hero/full-bleed surfaces.
        marketing: '1200px',
        'marketing-tight': '1024px',
        'marketing-text': '640px',
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
