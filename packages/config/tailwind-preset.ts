import type { Config } from 'tailwindcss';

/**
 * Shared Tailwind preset for hieu.asia frontend.
 * Brand palette per [[90 - Frontend Design Spec]].
 *
 * Premium mood: đen than / vàng đồng / tím trầm — không mê tín rẻ tiền.
 */
const preset = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background neutrals
        ink: {
          DEFAULT: '#0F0F12', // Đen than — primary dark background
          night: '#0B1326', // Xanh đêm — alt primary
          50: '#F2EDE3', // Kem ngà — light mode background
        },
        // Accent gold (primary CTA, highlight)
        gold: {
          DEFAULT: '#B8923D',
          50: '#FBF6EC',
          100: '#F4E6C4',
          200: '#E6CC8C',
          300: '#D5B057',
          400: '#C49E46',
          500: '#B8923D',
          600: '#917231',
          700: '#6B5424',
          800: '#453616',
          900: '#1F1808',
        },
        // Accent purple (mystic depth)
        purple: {
          DEFAULT: '#3B2754',
          50: '#EFEAF5',
          500: '#3B2754',
          700: '#281A3A',
          900: '#160E20',
        },
        // Accent jade (calm, trust).
        // Wave 60.80.fix: added 300/400 light variants for dark-bg legibility
        // (Lighthouse color-contrast required >=4.5 for body / 3.0 for large
        // text; old jade.500 #2D5F5A failed 2.5-2.6 on warm-dark-* surfaces).
        jade: {
          DEFAULT: '#2D5F5A',
          50: '#E6F0EE',
          300: '#5BA89F',
          400: '#3F8782',
          500: '#2D5F5A',
          700: '#1F423F',
          900: '#0F2120',
        },
        // Semantic aliases for shadcn/ui tokens (mapped in app globals.css)
        cream: '#F2EDE3',
        // Theme-aware tokens — resolve via CSS vars defined in app globals.css.
        // Use these for theme-adaptive chrome (bg-card, text-foreground, etc.).
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
      },
      fontFamily: {
        // Wave 55 LCP #1 — dropped Inter from fallback chain (no longer imported
        // in layout.tsx). Be Vietnam Pro covers latin already; Inter rarely
        // rendered. Keeping `system-ui` as the real fallback.
        sans: ['var(--font-be-vietnam)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-outfit)', 'var(--font-be-vietnam)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      // Wave 52 follow-up (BUG-012/013): named tokens for the 2 sub-xs sizes
      // that audit flagged across 269 occurrences (123 files). These are
      // intentional design choices, not magic numbers:
      // - micro (10px): uppercase mono tracking labels ("CẨM NANG QUYẾT ĐỊNH BẰNG AI")
      // - mini  (11px): helper / legal / metadata text below body
      // Existing usage of `text-[10px]` / `text-[11px]` is left as-is to avoid
      // 123-file refactor + visual regression risk; new code should use these tokens.
      fontSize: {
        micro: ['10px', { lineHeight: '14px', letterSpacing: '0.06em' }],
        mini: ['11px', { lineHeight: '16px' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'gold-gradient':
          'linear-gradient(135deg, #B8923D 0%, #D5B057 50%, #B8923D 100%)',
        // Wave 38 — ink-radial uses CSS vars so it responds to light/dark mode.
        // Light: gold-tinted ellipse on near-white. Dark: gold-tinted on ink.
        // Drop opacity goes into the gradient stops via rgba on the gold accent;
        // background fills with the theme's --background.
        'ink-radial':
          'radial-gradient(ellipse at top, rgba(184,146,61,0.10) 0%, hsl(var(--background)) 60%)',
      },
      boxShadow: {
        // Wave 60.11 — replaces the last hand-rolled `shadow-[inset_2px_0_0_0_#B8923D]`
        // arbitrary utility in admin sidebar. A named shadow keeps the brand
        // gold hex inside the preset (single source of truth) so a future
        // gold palette tweak updates the rail too.
        'gold-rail': 'inset 2px 0 0 0 #B8923D',
      },
    },
  },
  plugins: [],
} satisfies Partial<Config>;

export default preset;
