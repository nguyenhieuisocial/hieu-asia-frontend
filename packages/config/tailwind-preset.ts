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
        // Accent jade (calm, trust)
        jade: {
          DEFAULT: '#2D5F5A',
          50: '#E6F0EE',
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
        sans: ['var(--font-be-vietnam)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-outfit)', 'var(--font-be-vietnam)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
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
    },
  },
  plugins: [],
} satisfies Partial<Config>;

export default preset;
