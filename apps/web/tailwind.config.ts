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
        // C-Hybrid 2026-06-30 — was warm-dark sepia; now cool-neutral dark scale
        // (matches charcoal). Keeps legacy `warm-dark-*` class names working.
        'warm-dark': {
          50: '#141517',
          100: '#17181A',
          200: '#1E1F22',
          300: '#26282C',
          400: '#2E3034',
          500: '#34363A',
        },
        // C-Hybrid 2026-06-30 — cream scale now neutral off-white (was warm cream).
        // Legacy `cream-*` class names keep working, just cooler/cleaner.
        cream: {
          DEFAULT: '#F5F2EC',
          50: '#FAF9F6',
          100: '#F0EDE6',
          300: '#D8D4CC',
          500: '#8A8782',
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
        // Wave 62.01 — editorial display serif per "Như giấy cũ" spec.
        // Newsreader Variable (300–800, normal+italic) replaces Instrument
        // Serif's role for hero / H1 / H2 / pull quote. VN diacritics outside
        // latin-ext fall back to Be Vietnam Pro (already loaded in root layout).
        // Use via `font-editorial-display` Tailwind class on Newsreader-led
        // surfaces.
        //
        // `font-marketing-display` (token cũ) đã bị GỠ: sau VN-FIX 2026-06-22
        // nó trỏ về đúng cùng một stack với `editorial-display`, nên hai tên
        // cho một thứ chỉ gây lệch. Mọi chỗ dùng đã đổi sang
        // `font-editorial-display` (không đổi hiển thị); luật ESLint
        // `no-legacy-font-class` chặn tên cũ quay lại.
        'editorial-display': [
          'var(--font-newsreader)',
          'var(--font-be-vietnam)',
          // Han chars → self-hosted Noto Serif SC subset (unicode-range gated).
          'Noto Serif SC Han',
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
          '12px',
          { lineHeight: '1.4', letterSpacing: '0.12em' },
        ],
        'price-amount': ['40px', { lineHeight: '1.2' }],
        'tier-name': ['28px', { lineHeight: '1.3' }],

        // Wave 62.03 — 9-bậc editorial type scale per "Như giấy cũ" spec.
        // Use these for new editorial surfaces; legacy hero/section-display
        // kept for back-compat. Naming reflects semantic role, not size.
        //
        // bậc · size · line-height · letter-spacing · usage
        //   1 · 88px · 1.1  · -0.02em · "Display" — Hero only (Hiểu mình.) [VN-fix: was 0.95]
        //   2 · 64px · 1.1  · -0.02em · "H1" — Section opener [VN-fix: was 1.0]
        //   3 · 48px · 1.15 · -0.02em · "H2" — Block heading [VN-fix: was 1.05]
        //   4 · 32px · 1.15 · -0.01em · "H3" — Sub-block (alias section-display)
        //   5 · 24px · 1.2  ·  0      · "H4" — Card / pricing tier name
        //   6 · 19px · 1.45 ·  0      · "Lede" — Sub-deck paragraph
        //   7 · 16px · 1.55 ·  0      · "Body" — Default (use text-base)
        //   8 · 13px · 1.5  ·  0.02em · "Caption" — Meta / helper
        //   9 · 12px · 1.4  ·  0.12em · "Mono" — Label (alias eyebrow) [T-FONT 2026-07-06: 11→12px, quyết founder nâng nhãn ≤11px]
        //
        // Display fluid via clamp on smaller breakpoints to prevent overflow
        // on mobile. Body + Mono are intentionally fixed (don't fluid-shrink
        // legibility-critical sizes).
        'editorial-display': [
          'clamp(3rem, 6vw, 5.5rem)', // 48→88px
          // VN-FIX 2026-06-29: 0.95 → 1.1. 0.95 is a Latin-display value; VN's
          // two-level diacritic stack (Hiểu / Quyết / định) clips/collides on
          // wrap (esp. mobile) below ~1.1.
          { lineHeight: '1.1', letterSpacing: '-0.02em' },
        ],
        'editorial-h1': [
          'clamp(2.5rem, 4.5vw, 4rem)', // 40→64px
          // VN-FIX 2026-06-29: 1.0 → 1.1 (wrapping VN headings need leading room).
          { lineHeight: '1.1', letterSpacing: '-0.02em' },
        ],
        'editorial-h2': [
          'clamp(2rem, 3.5vw, 3rem)', // 32→48px
          // VN-FIX 2026-06-29: 1.05 → 1.15. editorial-h2 is the most-used
          // wrapping heading token (marketing + tool sections); 1.05 clipped
          // VN diacritics on wrapped multi-word titles.
          { lineHeight: '1.15', letterSpacing: '-0.02em' },
        ],
        'editorial-h3': [
          'clamp(1.625rem, 2.5vw, 2rem)', // 26→32px
          { lineHeight: '1.15', letterSpacing: '-0.01em' },
        ],
        'editorial-h4': [
          '1.5rem', // 24px
          { lineHeight: '1.2', letterSpacing: '0' },
        ],
        'editorial-lede': [
          'clamp(1.0625rem, 1.4vw, 1.1875rem)', // 17→19px (alias body-large)
          { lineHeight: '1.45', letterSpacing: '0' },
        ],
        'editorial-caption': [
          '13px',
          { lineHeight: '1.5', letterSpacing: '0.02em' },
        ],
        'editorial-mono': [
          '12px',
          { lineHeight: '1.4', letterSpacing: '0.12em' },
        ],
      },
      // Wave 62.03 — semantic spacing tokens for vertical rhythm.
      // Spec: "Trang phải thở" — section gap 88px base, hero ↔ first
      // section 128px. Use `py-section`, `mt-hero`, `gap-block` etc.
      // These supplement Tailwind defaults (1=4px, 2=8px, ..., 32=128px).
      // The named tokens make intent explicit at the call site:
      //   - card     = 32px  (card internal padding)
      //   - block    = 48px  (block heading → body)
      //   - section  = 88px  (section vertical baseline)
      //   - hero     = 128px (hero ↔ next section)
      spacing: {
        card: '2rem',     // 32
        block: '3rem',    // 48
        section: '5.5rem', // 88
        hero: '8rem',     // 128
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
