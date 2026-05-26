/**
 * hieu.asia design tokens — TypeScript constants.
 *
 * Wave 60 (2026-05-25) — mirrors `packages/config/tailwind-preset.ts` for
 * programmatic use cases where Tailwind utility classes don't apply:
 *   - Recharts theme objects (admin charts)
 *   - Inline SVG fill/stroke (Tử Vi chart visualisations)
 *   - PostHog/Plausible/Sentry brand colours in dashboards
 *   - PNG/PDF export generation (server-side OG images)
 *   - Any framework-agnostic colour math (oklch interpolation, alpha mix)
 *
 * Source-of-truth precedence:
 *   1. `packages/config/tailwind-preset.ts` (Tailwind utilities — what JSX uses)
 *   2. This file (raw TS constants — what programmatic code uses)
 *   3. `apps/<app>/src/app/globals.css` (CSS vars — what theme-adaptive
 *      shadcn/ui tokens use; defines `--background`, `--foreground` etc.
 *      that Tailwind preset re-exports as `bg-background`, `text-foreground`)
 *
 * Keep all 3 in sync. When changing colours: update preset + this file +
 * any globals.css mapping that touches the changed colour.
 *
 * Reference vault: 71 - Brand Kit, 72 - Visual Guideline, 90 - Frontend
 * Design Spec.
 */

// ============================================================================
// Colours
// ============================================================================

/**
 * Raw brand palette — never use these directly in JSX (use Tailwind classes
 * like `bg-ink`, `text-gold`). These are for programmatic / non-Tailwind
 * contexts only.
 */
export const colors = {
  // Background neutrals
  ink: {
    DEFAULT: '#0F0F12', // Đen than — primary dark background
    night: '#0B1326', // Xanh đêm — alt primary
    50: '#F2EDE3', // Kem ngà — light mode background (aliased as cream)
  },
  cream: '#F2EDE3',
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

  // ==========================================================================
  // Wave 60.56 — Option D "Warm-Dark Editorial" marketing palette extensions.
  // Founder-locked 2026-05-26. Used ONLY by marketing surfaces (landing /
  // pricing / features). In-app UI continues to use ink/cream/gold/purple/jade
  // above. See vault `105 - Marketing Redesign Plan` Section 4.
  // ==========================================================================

  /**
   * Warm-dark sepia scale — candlelight-feel dark backgrounds for editorial
   * marketing pages. Replaces `ink` (cold near-black) where Option D's warmer
   * mood is desired.
   */
  warmDark: {
    50: '#13110D', // body bg (candlelight feel)
    100: '#1B1714', // section layer 1
    200: '#221C18', // card surface
    300: '#2E2620', // elevated card / border default
    400: '#3A302A', // muted text on dark
    500: '#4A3F36', // border emphasis
  },

  /**
   * Cream scale — light-theme parity for warm-dark editorial. Existing top-
   * level `cream: '#F2EDE3'` token retained for back-compat (Wave 60 era);
   * this nested scale is the Wave 60.56 marketing source.
   */
  creamScale: {
    50: '#F5F0E6', // body bg light
    100: '#EFE7D6', // section layer 1 light
    300: '#C9BFB0', // body text on dark / muted text on light
    500: '#8A8275', // secondary text
  },

  /**
   * Gold extensions for Option D signature treatments — italic verb spans,
   * signature periods/dots, glow shadow. Layer atop existing `gold.*` scale.
   */
  goldSoft: '#D4B373', // italic verb span color, hover
  goldDot: '#E5C68A', // signature period/dot accent
  goldGlow: 'rgba(229,198,138,0.18)', // gold-dot glow shadow

  /**
   * Semantic refresh — lightened jade + purple for warm-dark contrast on
   * Option D surfaces (success badge, premium tier highlight). Original
   * `jade.DEFAULT` / `purple.DEFAULT` preserved for in-app UI.
   */
  jadeMarketing: '#5BA89F',
  purpleMarketing: '#8366A8',
} as const;

/**
 * Semantic colours for charts / Recharts series. Brand-aligned alternation:
 * gold → jade → purple → cream → ink for up-to-5-series charts.
 */
export const chartSeries = [
  colors.gold.DEFAULT,
  colors.jade.DEFAULT,
  colors.purple.DEFAULT,
  colors.gold[300],
  colors.jade[700],
] as const;

/**
 * Semantic state colours (success/warning/error/info). NOT in Tailwind preset
 * because Tailwind ships emerald-/red-/blue- defaults; this file maps them
 * to brand-tinted variants for chart accents only.
 */
export const states = {
  success: '#10B981', // emerald-500
  warning: colors.gold.DEFAULT, // re-use brand gold
  error: '#EF4444', // red-500
  info: colors.jade.DEFAULT,
} as const;

// ============================================================================
// Typography
// ============================================================================

/**
 * Font family identifiers — these are CSS variable names defined in each
 * `apps/<app>/src/app/layout.tsx` via `next/font/google`. Use in style props
 * (e.g. SVG text fonts) or programmatic font loaders.
 */
export const fontFamilies = {
  sans: 'var(--font-be-vietnam), system-ui, sans-serif',
  heading: 'var(--font-outfit), var(--font-be-vietnam), system-ui, sans-serif',
  mono: 'var(--font-jetbrains-mono), ui-monospace, monospace',
} as const;

/**
 * Type scale (pixels). Match `text-{xs|sm|...|6xl}` Tailwind defaults +
 * `text-micro` (10px) and `text-mini` (11px) Wave 52 additions.
 */
export const fontSizes = {
  micro: 10, // uppercase mono tracking labels
  mini: 11, // helper / legal / metadata
  xs: 12,
  sm: 14,
  base: 16, // mobile body MUST be 16px (iOS auto-zoom prevention)
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
} as const;

/**
 * Brand voice constraint: line-heights. Use these for SVG / programmatic
 * text layout. Match Tailwind `leading-*` defaults.
 */
export const lineHeights = {
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 1.75,
} as const;

// ============================================================================
// Spacing (strict 8pt scale per vault 72 — NO 15/27/33 off-scale values)
// ============================================================================

/**
 * 8pt spacing scale in pixels. Use these for SVG margins, Recharts padding,
 * canvas layout calculations.
 */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

/**
 * Brand container max-widths (px). Per vault 72:
 * - landing: 1280 (wide hero/marketing)
 * - content: 1152 (default app shell)
 * - article: 720 (reading-flow content)
 * - form: 480 (centered forms)
 */
export const maxWidths = {
  landing: 1280,
  content: 1152,
  article: 720,
  form: 480,
} as const;

// ============================================================================
// Border radius
// ============================================================================

/**
 * Radius scale (px). NEVER `rounded-full` on cards per vault 72.
 */
export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999, // pills only — chips, badges, tag buttons
} as const;

// ============================================================================
// Motion
// ============================================================================

/**
 * Animation duration scale (ms). Match Tailwind `duration-*` defaults +
 * brand-specific "slow" for hero/reveal sequences.
 */
export const durations = {
  instant: 75,
  fast: 150,
  base: 200,
  slow: 300,
  slower: 500,
  hero: 800, // hero entry sequences (vault 90)
} as const;

/**
 * CSS easing functions — brand prefers `cubic-bezier(0.4, 0, 0.2, 1)`
 * (Material standard) for most interactions + ease-out for entries.
 */
export const easings = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  enter: 'cubic-bezier(0, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

// ============================================================================
// Breakpoints (px — match Tailwind defaults so JS media queries align)
// ============================================================================

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ============================================================================
// Shadows / elevation (Tailwind default scale, redeclared for SVG filters)
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  // Brand-tinted gold glow for hero CTAs (vault 90)
  goldGlow: '0 0 40px -8px rgb(184 146 61 / 0.45)',
  // Soft ink shadow for cards on cream backgrounds
  inkSoft: '0 2px 12px -2px rgb(15 15 18 / 0.06)',
} as const;

// ============================================================================
// Brand voice constants (string copy + forbidden phrases)
// ============================================================================

/**
 * Vault 72 §Voice — phrases NEVER to use anywhere in product copy. Linter
 * + admin compose UIs can reference this list to flag drafts.
 */
export const forbiddenPhrases = [
  'đảm bảo',
  'chắc chắn',
  '100%',
  'guaranteed',
  'definitely',
  // Định mệnh hoá language
  'số mệnh đã định',
  'không thể thay đổi',
  // Medical / legal / financial claims
  'chữa bệnh',
  'cam kết lợi nhuận',
  'tư vấn pháp lý',
] as const;

/**
 * Brand wordmark — always lowercase, never capitalize.
 */
export const wordmark = 'hieu.asia' as const;

/**
 * Brand tagline — primary copy used in hero / OG meta / footer.
 */
export const tagline = 'Hiểu mình. Quyết định mình.' as const;

// ============================================================================
// Default export — convenient bundle for consumers that prefer one import.
// ============================================================================

export const tokens = {
  colors,
  chartSeries,
  states,
  fontFamilies,
  fontSizes,
  lineHeights,
  spacing,
  maxWidths,
  radii,
  durations,
  easings,
  breakpoints,
  shadows,
  forbiddenPhrases,
  wordmark,
  tagline,
} as const;

export type Tokens = typeof tokens;
