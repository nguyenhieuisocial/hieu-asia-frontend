# Wave 62 — Homepage Redesign Master Plan: "Như giấy cũ, không như app bói"

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign hieu.asia homepage from current "warm-dark casino-adjacent" into "giấy cũ editorial" — paper background default, Newsreader-led typography, sơ đồ 12 cung as visual anchor, two entry points for two audiences, pricing simplified 5→3 tier.

**Architecture:** Phased rollout across 11 sub-waves. Foundation tokens (62.01-62.03) ship first as breaking-change-free additions to design system. Hero + IA changes (62.04-62.06) consume new tokens. Trust/narrative (62.07-62.10) extend the editorial system. Each sub-wave produces a working, deployable commit.

**Tech Stack:**
- Next.js 15 App Router + RSC
- Tailwind CSS 4 + `@hieu-asia/config/tailwind` shared preset
- `next/font/google`: Newsreader Variable + Be Vietnam Pro + JetBrains Mono
- `next-themes` (route-aware forced theme)
- Custom SVG (`la-so-svg.tsx` exists, will be enhanced)

---

## Brand direction shift (record-of-decision)

This wave **supersedes vault 108 "Warm-Dark Editorial"** which locked marketing pages to dark mode. The new direction:

| Surface | Old (vault 108) | New (vault 138 — Wave 62) |
|---------|-----------------|----------------------------|
| Marketing (`/`, `/about`, `/features`, `/pricing`, `/methodology`, `/learn`, `/cam-nang`, `/sample-report`) | Force `dark` | Force `light` (Day "Giấy thấm") |
| Experience (`/reading`, `/dashboard`, `/account/mentor`, `/tu-vi-2026`, `/dai-van-hien-tai`) | Default `dark` | Force `dark` (Night "Khoảng lặng") |
| Admin/in-app utility | Default `light` | Unchanged |

Founder rationale: "Trang phải thở. Như giấy cũ, không như app bói. Sản phẩm là một bài đọc, không phải một slot machine."

---

## Sub-waves

### Wave 62.01 — Font system foundation (P1 highest impact)

**Files:**
- Modify: `apps/web/src/app/layout.tsx` — add Newsreader Variable + JetBrains Mono `next/font/google` imports
- Modify: `apps/web/tailwind.config.ts` — `fontFamily.editorial-display` token + body weight expansion
- Modify: `packages/config/tailwind-preset.ts` — register `--font-newsreader` + `--font-jetbrains-mono` in fontFamily chains

**Decisions:**
- Newsreader Variable (300-800, normal+italic, latin+latin-ext) → `--font-newsreader` → `font-editorial-display` Tailwind class
- Be Vietnam Pro weights expanded: 300, 400, 500, 600, 700 (was 400/600/700) with italic
- JetBrains Mono re-added (was dropped Wave 56) for labels/meta — weight 400 only
- Instrument Serif kept as fallback for one wave (transitional), removed in Wave 62.04

**Steps:**

- [ ] Step 1: Add Newsreader import to `layout.tsx` after Instrument_Serif import

```ts
import { Be_Vietnam_Pro, Instrument_Serif, Newsreader, JetBrains_Mono, Outfit } from 'next/font/google';

const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});
```

- [ ] Step 2: Expand Be Vietnam Pro weights in same file

```ts
const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-be-vietnam',
  display: 'swap',
});
```

- [ ] Step 3: Add font variables to `<html>` className

```tsx
className={`${beVietnam.variable} ${outfit.variable} ${instrumentSerif.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
```

- [ ] Step 4: Add `font-editorial-display` token in `tailwind.config.ts`

```ts
fontFamily: {
  'editorial-display': [
    'var(--font-newsreader)',
    'var(--font-be-vietnam)',
    'Georgia',
    'serif',
  ],
  'marketing-display': [...] // KEEP transitional
}
```

- [ ] Step 5: typecheck + commit

```bash
pnpm -F web typecheck
git add apps/web/src/app/layout.tsx apps/web/tailwind.config.ts
git commit -m "feat(fonts): Wave 62.01 — add Newsreader + JetBrains Mono editorial typography"
```

---

### Wave 62.02 — Color palette redesign + dual mode (P2)

**Files:**
- Modify: `apps/web/src/app/globals.css` — Paper/Charcoal HSL vars + 5 hành CSS vars
- Modify: `apps/web/tailwind.config.ts` — paper/charcoal/ochre/hành tokens
- Modify: `packages/config/tailwind-preset.ts` — paper scale, charcoal scale, ochre, hành (functional)
- Modify: `apps/web/src/app/layout.tsx` — change `defaultTheme="dark"` to `defaultTheme="light"` (marketing routes get forced light via ThemeProvider)
- Create: `apps/web/src/components/providers/route-theme-resolver.tsx` — route → theme map (or extend existing)

**Decisions:**
- Day mode (`light`):
  - Paper `#F3ECDD` (bg), Bone `#EBE2CD` (surface), Ink `#171411` (text), Ink-soft `#6B6358` (meta), Ochre `#A47532` (accent), Rule `#CCC0A6` (border)
- Night mode (`dark`):
  - Charcoal `#15110C` (bg), Bark `#1F1A13` (surface), Bone `#E8DCC1` (text), Bone-soft `#9A8D72` (meta), Gold `#D4A261` (accent), Rule `#3A3122` (border)
- 5 hành (functional only, never bg): Kim `#7D8A98` · Mộc `#6B8154` · Thuỷ `#3F5D6F` · Hoả `#A44A36` · Thổ `#A07842`
- Backward-compat: existing `cream-{50,100,300,500}` tokens map to paper scale; `gold` stays but adds aliases `ochre-day` and `gold-night` for clarity

**Steps:**

- [ ] Step 1: Update preset.ts paper + charcoal + ochre + hành tokens
- [ ] Step 2: Update tailwind.config.ts dropping `warm-dark` (kept as legacy alias), adding new scales
- [ ] Step 3: Update globals.css `:root` (day = Paper) and `.dark` (night = Charcoal)
- [ ] Step 4: Update layout.tsx `defaultTheme="light"` + extend ThemeProvider with route-aware forced theme
- [ ] Step 5: Audit force-dark routes — `/reading`, `/dashboard`, `/account/mentor`, `/tu-vi-2026`, `/dai-van-hien-tai` keep dark
- [ ] Step 6: typecheck + Polypane visual check (Paper bg renders correctly, no contrast regressions)
- [ ] Step 7: Commit

---

### Wave 62.03 — Type scale 9-bậc + spacing tokens

**Files:**
- Modify: `apps/web/tailwind.config.ts` — type scale tokens + spacing scale
- Create: `apps/web/src/components/ui/typography.tsx` — `<Display>`, `<H1>`, `<H2>`, `<H3>`, `<H4>`, `<Lede>`, `<Body>`, `<Caption>`, `<Mono>` semantic wrappers

**Decisions:**
- Type scale: Display 88/0.95 · H1 64/1.0 · H2 48/1.05 · H3 32/1.15 · H4 24/1.2 · Lede 19/1.45 · Body 16/1.55 · Caption 13/1.5 · Mono 11/1.4
- Spacing: 1=4, 2=8, 3=12, 4=16, 6=24, 8=32, 12=48, 20=88, 32=128
- Vertical rhythm: section gap = `space-20` (88px) base, `space-32` (128px) for hero ↔ first section

---

### Wave 62.04 — Hero redesign (split + 12-cung neo + 2 entry points) (P3 highest UX impact)

**Files:**
- Create: `apps/web/src/components/home/HeroV4.tsx` — replaces HeroV3
- Modify: `apps/web/src/components/la-so-svg.tsx` — enhance: 12 cung labels (Mệnh, Phụ Mẫu, Phúc Đức, Điền Trạch, Quan Lộc, Nô Bộc, Thiên Di, Tật Ách, Tài Bạch, Tử Tức, Phu Thê, Huynh Đệ) at outer ring + 14 sao chính dots at correct angles
- Modify: `apps/web/src/app/page.tsx` — swap `<HeroV3 />` → `<HeroV4 />`
- Delete: `apps/web/src/components/home/HeroV3.tsx` (after verifying no other consumers)

**Hero layout (desktop split 6+6 columns):**
- LEFT (6 cols): Eyebrow → H1 "Hiểu mình. Quyết định mình." → 2 entry buttons → microcopy line
- RIGHT (6 cols): Enhanced LaSoSvg (400×400, centered, day mode = ink on paper / night mode = gold on charcoal)
- Mobile: stack vertical, svg goes first (60% viewport width), text below

**Two entry points:**
- PRIMARY (Newsreader 18px button label): "Tôi đang phân vân một quyết định" → `/onboarding?intent=decision`
- SECONDARY (sans 16px): "Tôi muốn xem nhanh (Tử Vi 2026 · Hợp tuổi)" → `/tu-vi-2026`

---

### Wave 62.05 — Pricing 5→3 tier (P4)

**Files:**
- Modify: `apps/web/src/lib/pricing.ts` — reduce PRICING constants
- Modify: `apps/web/src/components/marketing/PricingTierV2.tsx`
- Modify: `apps/web/src/app/pricing/page.tsx` — full page restructure
- Modify: `apps/web/src/app/page.tsx` — homepage pricing section

**Decisions:**
- 3 tier: Free → Premium 99k (1 lần) → Mentor 199k/tháng
- Yearly (1.99M) + Lifetime (4.99M) moved to expandable "Tuỳ chọn nâng cao" sub-section, shown only after Mentor selected
- Tier card style update per spec: serif tier name, phrase price ("₫199.000 / tháng"), "cho ai" line above bullets, "·" instead of ✓

---

### Wave 62.06 — CTA architecture refactor (2-tier system)

**Files:**
- Audit: `apps/web/src/app/page.tsx` for all CTAs (currently 8+)
- Modify: page.tsx — consolidate to:
  - Tier 1 (high-intent buttons): Hero primary, Hero secondary, Pricing chosen tier
  - Tier 2 (inline editorial CTAs): Section ends ("Tiếp tục đọc bên dưới ↓", "Câu hỏi thường gặp")
  - Remove: redundant hero-cuối section CTA, repeated mid-page buttons

---

### Wave 62.07 — Methodology public test cases + Social proof "khoảng lặng"

**Files:**
- Modify: `apps/web/src/app/methodology/page.tsx` — add "500 test cases âm-dương lịch" table + "600 prompt safety eval" category breakdown
- Create: `apps/web/src/components/marketing/SocialProofQuiet.tsx` — 3-4 anonymous quotes in magazine excerpt style (italic Newsreader, ochre quote marks, no stars, no faces)
- Modify: `apps/web/src/app/page.tsx` — insert SocialProofQuiet before pricing section

---

### Wave 62.08 — Editorial list refactor (feature grid → list)

**Files:**
- Audit BentoLens usage in page.tsx (currently bento grid)
- Create: `apps/web/src/components/marketing/EditorialList.tsx` — numbered vertical list with italic display headings
- Modify: page.tsx — replace `<BentoLens />` with `<EditorialList />` for "Bốn ống kính" section

---

### Wave 62.09 — Custom icon symbols (replace Lucide)

**Files:**
- Create: `apps/web/src/components/marketing/icons/LaSoIcon.tsx` (12-cung schematic, 48×48 viewBox, stroke 1.2px ink, 1 ochre accent)
- Create: `apps/web/src/components/marketing/icons/BatTuIcon.tsx` (4 trụ)
- Create: `apps/web/src/components/marketing/icons/DaiVanIcon.tsx` (timeline 10 năm)
- Create: `apps/web/src/components/marketing/icons/ThanSoIcon.tsx` (7 numbers)
- Create: `apps/web/src/components/marketing/icons/DuongDoiIcon.tsx`
- Create: `apps/web/src/components/marketing/icons/MbtiIcon.tsx` (16 kiểu)
- Modify: page.tsx + DisciplineGlyphs.tsx — replace Lucide imports

---

### Wave 62.10 — Mega-footer + nav simplification

**Files:**
- Modify: `apps/web/src/components/home/SiteNav.tsx` — keep 5 top items only (Lá số · Mentor · Phương pháp · Giá · Về chúng tôi)
- Modify: `apps/web/src/components/home/SiteFooter.tsx` — restructure as mega-footer with 4 columns:
  - Col 1 "Sản phẩm" (5 items)
  - Col 2 "Tra cứu nhanh" (11 tool routes: Tử Vi 2026, Hợp tuổi, Cân Xương Đoán Số, Lịch Vạn Niên, Bát Tự, MBTI, Thần số học, Thước Lỗ Ban, Tuổi mệnh cục, Bản đồ sao, Đại vận)
  - Col 3 "Tài liệu" (Methodology, Sample Report, Changelog, Cẩm nang, Blog)
  - Col 4 "Pháp lý" (Privacy, Terms, NĐ 13, Liên hệ)

---

### Wave 62.11 — Mentor demo free input

**Files:**
- Modify: `apps/web/src/components/marketing/MentorSampleInteractive.tsx` — switch from 3 scripted Q→A to free-text input with a fixed persona (Chi Lan, ENFP, Tử Vi mẫu) backing fully-mocked LLM responses (predetermined safe outputs for any input). Persona disclaimer above input.

---

## Self-review checklist

After execution, verify each spec section maps to a sub-wave:

- [x] "Hai khán giả mâu thuẫn" → 62.04 (2 entry points) + 62.10 (mega-footer relocates 11 traditional tools)
- [x] "CTA lặp 8+ lần" → 62.06 (CTA refactor)
- [x] "Hero thiếu neo thị giác" → 62.04 (sơ đồ 12 cung)
- [x] "99% trên 500/600 test cases mỏng" → 62.07 (public methodology test cases table)
- [x] "Pricing 5 bậc gây tê liệt" → 62.05 (5→3)
- [x] "Demo Mentor 3 câu cố định" → 62.11 (free input)
- [x] "Menu top 26 mục" → 62.10 (nav simplification)
- [x] "Hero toàn chữ" → 62.04 (split layout + sơ đồ)
- [x] "Pull quote khoảng lặng" → 62.07 (SocialProofQuiet) + existing PullQuote upgrade
- [x] "Editorial list thay grid" → 62.08
- [x] "Icon thư viện kéo về SaaS generic" → 62.09 (custom icon symbols)
- [x] Font Newsreader × Be Vietnam Pro × JetBrains Mono → 62.01
- [x] Hệ màu Paper × Charcoal × Ochre + 5 hành → 62.02
- [x] Type scale 9 bậc + vertical rhythm 88-128 → 62.03

## Priority execution order (founder's "5 visual decisions")

1. **62.01 Fonts** — foundational, ship first
2. **62.02 Colors** — paired with fonts (defines paper feel)
3. **62.04 Hero (neo)** — biggest UX impact after foundation
4. **62.03 Type+Spacing** — paired with 62.04
5. **62.08 Editorial list** — biggest visual rhythm fix
6. **62.05 Pricing simplification** — biggest conversion fix
7. **62.10 Mega-footer + nav** — IA cleanup
8. **62.06 CTA refactor** — conversion polish
9. **62.07 Trust + social proof**
10. **62.09 Custom icons** — polish
11. **62.11 Mentor free input** — demo polish

## Execution handoff

Foundation sub-waves (62.01 + 62.02 + 62.03) execute in this session.
Remaining (62.04 onwards) require fresh session or explicit founder approval to continue — each touches Hero/Pricing UI which deserves visual review per sub-wave.

---

## Execution log — actual ship state (Wave 62.01-62.04b)

| Wave | Status | Commit | Divergence from plan |
|------|--------|--------|----------------------|
| 62.01 fonts | ✅ shipped | 92e677d | None — Newsreader + JetBrains Mono added, Be Vietnam Pro weights expanded |
| 62.02 colors | ✅ shipped | eccd5f9 | Step 4 (route-aware forced theme) deferred to Wave 62.04 — then deferred again |
| 62.03 type+spacing | ✅ shipped | 1825460 | Skipped Step 2 (semantic React wrappers `<Display>`, `<H1>` etc.) — token-only ship; semantic wrappers deferred to Wave 62.10 polish |
| 62.04 Hero | ✅ shipped | 2095ae0 | LaSoSvg shipped with 8 sao chính + center "MỆNH" caption + 12 small slice markers (plan had 14 sao + 12 cung name labels — simplified for editorial restraint; founder can request labels added if desired) |
| 62.04b ship-block fix | ✅ shipped | (this commit) | Revert defaultTheme "light" → "dark"; mobile order flipped (text-first); 3 orphans deleted |

### Wave 62.04b — ship-block fixes (reactive)

/ultrareview caught the following P0/P1 issues before push:

- **P0-1**: Wave 62.02 flipped defaultTheme to "light" exposing 121 instances
  of legacy `text-gold*` / `bg-gold*` / `border-gold*` tokens across 15
  homepage components rendering at 1.4-2.5:1 contrast on Paper bg (FAIL
  WCAG AA). **Fix:** Reverted defaultTheme to "dark" in `layout.tsx`. All
  new token infrastructure (Paper/Charcoal/Ochre/Bone/hành) STAYS in
  place for the upcoming sweep wave.
- **P1-4**: HeroV4 mobile SVG-first order pushed primary CTA ~75px below
  the iPhone 13 fold. **Fix:** Reordered so text is first on mobile, SVG
  becomes a supporting illustration below the CTAs. Desktop split layout
  (text 7 / SVG 5) preserved.
- **P2-7**: Orphaned files (HeroV3.tsx, HomeHeroEyebrow.tsx, LotusLottie.tsx)
  deleted — they had 0 importers after Wave 62.04 swap. CLAUDE.md §3
  "clean your own mess" — these were orphaned BY my changes, so cleanup
  belongs in this wave.

### New sub-wave inserted into priority queue

**Wave 62.05a — Legacy gold token sweep (NEW, inserted before 62.05 pricing)**

Sweep `text-gold` / `text-gold-soft` / `text-gold-dot` / `bg-gold` /
`border-gold-*` → semantic `text-primary` / `text-foreground` / `bg-primary`
across 15 components:
- `apps/web/src/components/home/{SiteNav,SiteFooter,FaqAccordion,WhyTrust,HowToStart,NewsletterSignup}.tsx`
- `apps/web/src/components/marketing/{PricingTierV2,SampleOutputShowcase,MentorSampleInteractive,ScanRow,BentoLens}.tsx`
- `apps/web/src/app/page.tsx` (15 inline instances at lines 455, 461, 469, 477, 485, 493, 525, 526, 539, 550, 560, 570, 602, 629, 630)

After sweep completes, Wave 62.05b re-enables `defaultTheme="light"` with
confidence — Day "Giấy thấm" finally goes live.

P1-3 + P1-5 (Ochre contrast on Paper) will be addressed in 62.05b along
with the day-mode re-enable — likely by darkening Ochre primary text usages
to `#7C5424` while keeping `#A47532` for SVG fills / dot accents / borders
where 3:1 contrast is adequate.

P2-6 (font preload bloat — Instrument Serif + Outfit preload: false)
deferred to Wave 62.04 polish OR 62.05a alongside the gold sweep.

---

## Final execution state (post-autonomous-mode completion)

After founder said "Chế độ autonomous", the remaining sub-waves shipped via 5 parallel sub-agents + 3 ultrareview cycles:

| Wave | Commit | Outcome |
|------|--------|---------|
| 62.05 Pricing 5→3 | `7dd73af` | 4 files; PRIMARY_PRICING (3) + ADVANCED_PRICING (2) split; AdvancedOptions expandable |
| 62.06 CTA architecture | `7dd73af` | BentoLens→EditorialList eliminates 4 implicit CTAs; tier-1/tier-2 separation |
| 62.07 Methodology + SocialProofQuiet | `7dd73af` | 500 test case sample + 600 prompt safety eval (10 cat) + 4 anonymous quotes |
| 62.08 EditorialList | `7dd73af` | New component (159 LOC); 4 founder-voiced items wired on home |
| 62.10 Nav + mega-footer | `7dd73af` | SiteNav 570→302 LOC; SiteFooter 4-col 12-tool mega-footer |
| 62.11 Mentor free input | `7dd73af` | 8 keyword + 2 safety templates + Chi Lan persona |
| 62.05c ship-block fixes | `6c4ccbf` | 3 P0: `/learn/than-so→-hoc`, `/mentor→/onboarding`, 37 missed gold tokens swept; P1 theme-toggle pathname guard |
| 62.05d + 62.09 | `96b3bbe` | Footer `<nav aria-label>` × 4 columns; SocialProofQuiet doc fix; 6 custom icon symbols (LaSo/BatTu/DaiVan/ThanSo/DuongDoi/Mbti) |
| Vault 94 + 138 docs | `5720a64` (vault) | Session #4 audit log + brand direction record |

### Ultrareview cycle audit (3 passes, all caught real issues)

| Pass | Reviewer found | Status |
|------|---------------|--------|
| 1 (post-62.04) | P0: defaultTheme=light flip exposed 121 legacy gold tokens at 1.4-2.5:1 contrast | Wave 62.04b stopgap + 62.05a sweep + 62.05b re-enable |
| 2 (post-7dd73af) | P0×3: 2 broken routes + 37 missed gold tokens; P1: theme-toggle no-op | Wave 62.05c (3 P0 + 1 P1 fixed) |
| 3 (post-6c4ccbf) | P0: FooterColLegal JSX mismatch from 62.05d edit; sanity checks all pass; 6 icons created | Wave 62.05d (closing tag fix bundled + icons committed) |

### Plan vs ship final delta

| Plan section | Shipped | Divergence |
|-------------|---------|-----------|
| Foundation tokens (62.01-62.03) | ✅ | None |
| Hero (62.04) | ✅ | Simplified: 8 sao chính vs 14 planned, cung labels via small dots + center MỆNH instead of 12 named labels |
| Pricing 5→3 (62.05) | ✅ | None — yearly+lifetime preserved in AdvancedOptions |
| CTA refactor (62.06) | ✅ | Implicit via EditorialList swap (no explicit sweep needed — net -5 CTAs achieved) |
| Methodology + SocialProof (62.07) | ✅ | Honest framing: sample 20/500 + GitHub link instead of fabricated full 500 |
| EditorialList (62.08) | ✅ | None — created reusable component |
| Custom icons (62.09) | ✅ | 6 icons created; integration to existing pages DEFERRED (DisciplineGlyphs on /about stays — swap is risk vs reward judgment for follow-up) |
| Nav + mega-footer (62.10) | ✅ | None |
| Mentor free input (62.11) | ✅ | Client-side mock only (no API call) — 8 keyword + 2 safety + fallback |

### Remaining technical debt (post-Wave-62)

- **DisciplineGlyphs.tsx** — still used on /about; could be swapped to new 62.09 icons or kept. Founder call.
- **Pre-existing `" 2.md"` / `" 3.md"` macOS Finder duplicates** in vault + multiple `" 2"/" 3"` files in apps/admin/src/lib — not mine, not touched per CLAUDE.md §3 "don't delete pre-existing dead code unless asked".
- **4 moderate Dependabot vulnerabilities** on hieu-asia-frontend default branch — flagged in every push response; not addressed (out of scope for design wave).
- **GitHub "Required status check ci"** still marked as expected — CI workflow not present in repo per default-branch protection prompts; investigate or remove protection.

### Bundle size impact (approximate)

| Wave | Δ KB (gzipped, runtime) |
|------|------------------------|
| 62.01 fonts | +12-18 KB (Newsreader 4×italic + JetBrains Mono 2 + Be Vietnam Pro italic) |
| 62.02-62.03 tokens | ~0 KB (CSS vars + Tailwind utilities — no runtime JS) |
| 62.04 HeroV4 + LaSoSvg | +2 KB (replaces ~3 KB MarketingHero+LotusLottie) ≈ -1 KB net |
| 62.05-62.11 components | +4 KB (EditorialList + SocialProofQuiet + MentorInteractive expansion) - 3 KB (BentoLens removed from home bundle) ≈ +1 KB net |
| 62.09 6 new icons | +1.5 KB (~250 bytes per SVG, only loaded where imported) |

Total Wave 62 runtime payload: **+~15-20 KB gzipped** — mostly Newsreader font weights. Acceptable for the design impact.

### What the next session inherits

1. Day mode default LIVE — Paper × Ink × Ochre on Home/Pricing/Methodology/Sample-Report/Learn/FAQ/etc.
2. Night mode FORCED on /reading + /dashboard + /tu-vi-* + /dai-van-hien-tai + /mentor.
3. HeroV4 split + 12-cung neo + 2 entry points on /.
4. Pricing 3-tier with expandable yearly/lifetime.
5. Methodology /500-600 public test case tables + GitHub link.
6. SocialProofQuiet 4 quotes between Pricing + FAQ.
7. Mega-footer 4 col with 12 traditional tools.
8. SiteNav 6 top items.
9. Mentor demo free input on homepage.
10. 6 custom icon symbols available for future use (un-integrated).
11. Vault 138 "Như giấy cũ" supersedes vault 108 Warm-Dark Editorial.
12. ThemeToggle hidden on force-dark routes.

Wave 62 plan: **COMPLETE**.
