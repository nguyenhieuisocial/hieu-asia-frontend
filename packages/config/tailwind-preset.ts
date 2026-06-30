import type { Config } from 'tailwindcss';

/**
 * Shared Tailwind preset for hieu.asia frontend.
 * Brand palette per vault 138 — "Như giấy cũ, không như app bói" (Wave 62).
 *
 * Day mode "Giấy thấm" — Paper × Ink × Ochre.
 * Night mode "Khoảng lặng" — Charcoal × Bone × Gold (softened from harsh #B8923D
 * to #D4A261 for editorial calm on dark surfaces).
 *
 * Supersedes vault 108 "Warm-Dark Editorial" which locked marketing to dark.
 * Founder rationale: "Sản phẩm là một bài đọc, không phải slot machine."
 *
 * Legacy `cream/warm-dark/gold` scales kept as transitional aliases so the
 * site can ship incrementally without sweeping every utility class. Wave 62.04
 * (hero rewrite) starts the migration; Wave 62.10 finishes it.
 */
const preset = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background neutrals
        ink: {
          DEFAULT: '#0F0F12', // Đen than — primary dark background (legacy)
          night: '#0B1326', // Xanh đêm — alt primary
          50: '#F2EDE3', // Kem ngà — light mode background (legacy)
        },
        // Wave 62.02 — Paper × Ink × Ochre day-mode scale.
        // Paper (default bg), Bone (surface lift), Ink (text), Ink-soft (meta),
        // Rule (border). Use these as the canonical day-mode palette going
        // forward; cream/warm-dark/gold remain for back-compat.
        paper: {
          DEFAULT: '#F3ECDD', // Nền chính — Giấy thấm
          50: '#FAF6EC', // Highlight (above paper)
          100: '#F3ECDD', // Default paper (same as DEFAULT, semantic alias)
          200: '#EBE2CD', // Bone — surface lift on paper
          300: '#CCC0A6', // Rule — border on paper
          500: '#A39A86', // Ink-soft on paper background
          700: '#6B6358', // Ink-meta phụ đề
          900: '#171411', // Ink — text on paper
        },
        // Wave 62.02 — Charcoal × Bone × Gold night-mode scale.
        // Charcoal (default bg), Bark (surface lift), Bone (text), Bone-soft (meta),
        // Rule (border). Replaces warm-dark scale going forward.
        charcoal: {
          DEFAULT: '#15110C', // Nền chính — Khoảng lặng
          50: '#1F1A13', // Bark — surface lift on charcoal
          100: '#15110C', // Default charcoal (semantic alias)
          200: '#1B1714', // Mid surface
          300: '#3A3122', // Rule — border on charcoal
          500: '#9A8D72', // Bone-soft on charcoal background
          700: '#E8DCC1', // Bone — text on charcoal
        },
        // Wave 62.02 — Bone family for night-mode text/surface.
        // Direct hex aliases for the common cases — most surfaces just need
        // bone-DEFAULT (text on charcoal) and bone-soft (meta on charcoal).
        bone: {
          DEFAULT: '#E8DCC1', // Chữ chính on charcoal
          soft: '#9A8D72',
          rule: '#3A3122',
        },
        // Wave 62.02 — Ochre (day-mode accent) + softer Gold (night-mode accent).
        // Spec calls Ochre #A47532 the "single accent" on paper, while night
        // uses a softer Gold #D4A261 that doesn't burn against charcoal.
        // Original `gold` scale (centered on #B8923D) kept for back-compat;
        // surfaces migrating to vault 138 should reference `ochre` or
        // `gold-night` explicitly.
        ochre: {
          DEFAULT: '#A47532', // Day accent — single accent on paper
          50: '#F3E7D0',
          100: '#E2C792',
          300: '#C29053',
          500: '#A47532',
          700: '#73522A',
          900: '#3A2914',
        },
        'gold-night': '#D4A261', // Night accent — softer than #B8923D
        // Wave 62.02 — Five-element (ngũ hành) functional accents.
        // RULE: chip + accent + data viz only. NEVER use as background.
        // Founder spec: "5 hành chỉ dùng functional, không dùng cho hero".
        hanh: {
          kim: '#7D8A98', // Kim · METAL
          moc: '#6B8154', // Mộc · WOOD
          thuy: '#3F5D6F', // Thuỷ · WATER
          hoa: '#A44A36', // Hoả · FIRE
          tho: '#A07842', // Thổ · EARTH
        },
        // Accent gold (primary CTA, highlight) — LEGACY (use `ochre` for day,
        // `gold-night` for night going forward).
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
        // Wave 60.81.B/C — semantic WarnToken for admin status surfaces.
        // Brand-aligned amber (not generic Tailwind yellow): hue 38 sits
        // between gold.500 (#B8923D, hue 41) and a slightly warmer caution.
        // Use for "degraded but not failing": queue backlog, secrets partially
        // set, migration pending, service warn dot. 300 = on-dark-text
        // contrast >=4.5; 500 = fill / dot.
        warn: {
          DEFAULT: '#D4923A',
          300: '#E7B36B',
          500: '#D4923A',
          700: '#8F6224',
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
        // 2026-06-29 VN-FIX: heading led with Outfit, which has NO 'vietnamese'
        // Google Fonts subset (only latin/latin-ext). Every VN heading with
        // tone-stacked diacritics (ử, ệ, ộ, ấ, đ…) fell back per-glyph to Be
        // Vietnam Pro → mixed font in one title across ~897 `font-heading`
        // call-sites / 240 files. Founder-locked: headings use Be Vietnam Pro
        // (same family as body, full VN coverage; hierarchy via weight). Outfit
        // import dropped from all three app layouts (was the only consumer).
        heading: ['var(--font-be-vietnam)', 'system-ui', 'sans-serif'],
        // 2026-06-29 — JetBrains Mono removed (founder: "vẫn còn thấy JetBrains").
        // `font-mono` now resolves to Be Vietnam Pro so the ~812 label/eyebrow
        // call-sites read consistently with the rest of the site (no monospace
        // accent). Class name kept as `mono` to avoid sweeping 812 files; it is
        // now a legacy alias for the body font. ui-monospace fallback retained
        // only for any genuine code/tabular block that still wants it.
        mono: ['var(--font-be-vietnam)', 'system-ui', 'sans-serif'],
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
      // Wave 60.81.B — editorial easing curve, promoted from apps/web's
      // tailwind config (Wave 60.56) into the shared preset so admin can
      // adopt the same hover/transition feel. Soft entry, firm settle.
      // Use via `transition-all duration-300 ease-editorial` on cards,
      // badges, table rows, filter pills.
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.165, 0.85, 0.45, 1)',
      },
    },
  },
  plugins: [],
} satisfies Partial<Config>;

export default preset;
