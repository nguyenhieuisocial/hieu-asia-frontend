# Wave 65 — Homepage Upgrade Plan: "Ngắn hơn, nhớ người dùng, nhanh hơn"

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. MUST follow `docs/homepage-motion-i18n-guardrails.md` + GitNexus impact trước mọi edit.

**Goal:** Nâng cấp homepage dựa trên review 8 vòng (74 findings sau dedup: 7 P1 · 43 P2 · 24 P3, 4 finding nặng nhất đã adversarial-verify CONFIRMED) + dữ liệu PostHog 30 ngày. Ba trục: (1) trang ngắn lại và không lặp thông điệp, (2) dữ liệu người dùng chảy xuyên suốt trang, (3) tải nhanh hơn ~0.5–0.9s LCP và TBT 650ms → <250ms.

**Architecture:** 7 sub-wave độc lập, ship được từng cái. 65.01–65.02 là quick-win không cần quyết định thiết kế (làm ngay). 65.03 (cắt section) và 65.04 (thống nhất design system) cần founder duyệt trước khi code. 65.05–65.07 là perf/a11y/dọn code chạy song song sau đó.

**Tech Stack:** Next.js 15 App Router + RSC, Tailwind 4 + `@hieu-asia/config/tailwind`, next/font (Be Vietnam Pro + Newsreader), PostHog, LazyMotion.

## Evidence base (không được quên khi thực thi)

Dữ liệu PostHog 30 ngày (đo 2026-07-31, entry `/`):
- 133 visitors/tháng vào qua homepage · bounce 31.7% · session ~7 phút → **traffic là nút thắt, không phải bounce**. Mọi thay đổi ưu tiên SEO + tốc độ + giữ chân, KHÔNG micro-CRO (không đủ mẫu để A/B).
- Scroll depth: 25%=7 users · 50%=3 · 75%=2 · 100%=1 → **nửa dưới trang gần như không ai thấy**; `pricing_cta_clicked` trên `/` = 0 trong 30 ngày.
- `$rageclick` 31 lần / 3 users, tập trung vào nhãn nhóm OracleBrain ("Trực giác 1 công cụ", "Tâm lý hiện đại 4 công cụ"…).
- StickyMobileCta: shown 139 · clicked 6 (CTR ~4%) · dismissed 3.
- form_started 45 → form_submitted 35 (78% completion — hero form đang tốt, GIỮ).

Đo production: TBT 650ms desktop / 1445 DOM nodes (comment page.tsx:441), HTML 793KB (243KB inline CSS), LCP−FCP ~0.9s do font preload = 0 (comment next.config.ts:31-39).

## Global Constraints

- KHÔNG đụng `<Suspense fallback={null}>` quanh các section (vault 172 — hydration chunking, đã đo). KHÔNG đổi sang next/dynamic.
- KHÔNG thêm scroll-reveal vào above-the-fold / LCP element (guardrail §5).
- Mọi animation mới phải gate `prefers-reduced-motion` (guardrail §2).
- KHÔNG dùng `<input type="time">` — luôn `Time24` từ `@hieu-asia/ui`.
- Copy mới: xưng "bạn/chúng tôi", chuẩn hoá "lăng kính" (không "ống kính"), "hoá" (không "hóa"), claim phải kiểm chứng được — không số liệu bịa.
- Title ≤60 ký tự, description ≤160 (seo-guard).
- Mỗi sub-wave: chạy `pnpm lint && pnpm types:check` + verify live sau deploy (F4 curl + screenshot) trước khi báo xong.

---

## Sub-wave 65.01 — Quick wins (S effort, không cần quyết định thiết kế) — LÀM TRƯỚC

### Task 1: Font preload cho LCP element  [P1 · verify CONFIRMED]
**Files:** Modify `apps/web/src/app/layout.tsx` (head), đọc `next.config.ts:31-39` để hiểu bối cảnh.
- [ ] Build production, lấy URL 2–3 file woff2 mà H1 thực dùng (Be Vietnam Pro 700 + 400, subset vietnamese + latin).
- [ ] Thêm `<link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href=...>` cho đúng các file đó trong `<head>` của layout.tsx (cạnh 2 preconnect hiện có).
- [ ] Verify: build lại, xem HTML có preload; đo PageSpeed/Lighthouse mobile — kỳ vọng LCP giảm 0.4–0.9s.
- [ ] Commit `perf(web): preload H1 woff2 fonts — close 0.9s LCP-FCP gap`.

### Task 2: MultiHero dark-mode contrast  [P1 · verify CONFIRMED]
**Files:** Modify `apps/web/src/components/home-hero/MultiHero.tsx:22-23` + `apps/web/src/app/globals.css` (block `.dark`).
- [ ] Thay hằng `OCHRE '#A47532'` / `OCHRE_DEEP '#7A5420'` bằng `hsl(var(--primary))` / CSS var có cặp giá trị dark.
- [ ] Thêm `.dark .fx-shimmer` gradient gold-night; kiểm border alpha `.mh-cta` trên nền tối.
- [ ] Verify: toggle dark mode, đo contrast `.mh-gift` ≥ 4.5:1. Commit.

### Task 3: Từ khoá vào H1/H2  [P1]
**Files:** Modify `apps/web/src/components/home-hero/InstantChartHero.tsx:121` (H1), `Methodology.tsx` hoặc `EngineProofShowcase.tsx` (1–2 H2).
- [ ] H1 → `Nhập ngày sinh — nhận lá số Bát Tự thật trong một phút.` (giữ nhịp câu cũ, thêm "lá số Bát Tự").
- [ ] Thêm "Tử Vi" tự nhiên vào 1 H2 (vd Methodology: `Năm lăng kính Tử Vi, Bát Tự… một bức tranh.` — chọn phương án đọc mượt nhất, không nhồi).
- [ ] Verify: curl production, grep H1/H2. Commit.

### Task 4: Sửa structured data drift  [P2 ×2]
**Files:** Modify `apps/web/src/app/page.tsx:103-134` (HOWTO_JSONLD), `:136-195` (SERVICES_JSONLD).
- [ ] HOWTO_JSONLD: bước 2 trỏ `#how` không tồn tại + mô tả section đã gỡ → viết lại 3 bước khớp trang hiện tại (hero form → xem lá số → hỏi Mentor), URL thật.
- [ ] SERVICES_JSONLD + FAQ_JSONLD: sinh từ `lib/catalog` (nguồn LENSES) thay vì hand-code — hàm build trong `lib/seo/jsonld.ts` để hết drift. FAQ markup lấy đúng wording bản hiển thị (strip JSX).
- [ ] Verify: Rich Results Test pass, diff nội dung markup vs UI = 0. Commit.

### Task 5: hreflang + internal link  [P2 ×2]
**Files:** Modify `apps/web/src/app/layout.tsx:176-180`, `apps/web/src/components/home-hero/MultiHero.tsx:109` (hoặc EngineProofShowcase).
- [ ] Bỏ `alternates.languages` cố định ở layout (đang trỏ mọi trang con về homepage); homepage tự khai trong page.tsx.
- [ ] Thêm 1 link body tới `/la-so-tu-vi` với anchor text "lá số Tử Vi" (vd trong đoạn "Quà mở đầu: lá số Tử Vi 12 cung…" của MultiHero — hiện là text thường).
- [ ] Verify + commit.

### Task 6: Chùm copy fix (gộp 1 commit)  [P2 ×6, P3 ×4]
**Files:** `page.tsx:670` (`Cho {bestFor}` → sửa template thành câu đúng ngữ pháp: `Hợp với bạn nếu {bestFor}` hoặc bỏ "Cho"), `page.tsx:744` (₫ trước/sau → chuẩn `1.990.000₫`; đồng bộ từ `PRICING` thay vì hard-code), `SiteNav.tsx:227` (CTA nav "Mở khóa lá số" → `Lập lá số miễn phí`), `InstantChartHero.tsx:230` (gloss jargon: "Nhật Chủ", "tiết khí" thêm 3–5 từ giải thích; "Hồi cứu giờ sinh (BTR)" → bỏ "(BTR)"), `page.tsx:338` (FAQ bỏ "Tier", "gói subscription" → "gói Standard miễn phí", "gói đang dùng"), `MultiHero.tsx:87` ("LÁ SỐ THẬT · KHÔNG BÓI MÙ" → `LÁ SỐ THẬT · KHÔNG PHÁN MỆNH`), `MentorSampleInteractive.tsx:66` (CTA "→ /onboarding" → text người: `Hỏi Mentor câu của bạn →`), `ScanRow` heading dấu chấm → `?`, "5 ống kính" trong bảng giá → "5 lăng kính", JSON-LD "cá nhân hóa" → "hoá".
- [ ] Sửa từng chỗ theo danh sách trên (grep lại toàn repo từng cụm để sửa tận gốc, không sửa lẻ).
- [ ] Verify: đọc lại trang live, chạy seo-guard. Commit `fix(web): copy drift sweep — grammar, currency, jargon, tone`.

### Task 7: A11y contrast nhanh  [P2 ×2]
**Files:** `globals.css:196` (focus ring `#b8923d` ~2.8:1 → đổi token đạt ≥3:1 cả 2 theme), `AstroTickerLive.tsx:138` (`--hanh-moc` cho text nhỏ → dùng biến thể đậm hơn đạt 4.5:1).
- [ ] Sửa + đo contrast + commit.

## Sub-wave 65.02 — Sửa friction ĐO ĐƯỢC bằng data (S–M effort)

### Task 8: OracleBrain rageclick + prefill  [P1 + data 31 rageclicks]
**Files:** Modify `apps/web/src/components/home-hero/OracleBrain.tsx` (form ~dòng 135, nhóm sao ~dòng 372).
- [ ] Nhãn nhóm sao ("Trực giác 1 công cụ"…) đang hút rage click: làm nhóm phản hồi NGAY khi chạm — active state rõ (scale + fill màu nhóm) + reveal panel lăng kính tương ứng, hoặc nếu nhóm không có hành vi thì bỏ affordance con trỏ/hover để không mời bấm.
- [ ] Prefill từ `readBirthProfile()` (store `hieu:birth-profile` mà InstantChartHero đã ghi): nếu đã có ngày sinh → auto-reveal "Lát cắt về bạn", form thu thành nút `Thử ngày khác`; copy đổi thành `Dùng ngày sinh bạn vừa nhập`.
- [ ] Verify: PostHog 2 tuần sau ship — rageclick về ~0; test 2 luồng (đã nhập / chưa nhập). Commit.

### Task 9: StickyMobileCta context-aware + layering  [P2 ×3]
**Files:** `StickyMobileCta.tsx:34,109,122`, `BackToTop.tsx:38`, `SiteFooter.tsx:72`.
- [ ] Ẩn sticky khi user đã submit form hero trong phiên (đọc cùng store/flag) — data: 139 shown / 6 clicked vì mời làm lại việc vừa xong.
- [ ] Khi ẩn (`translate-y-full`) thêm `inert`/`visibility:hidden` để thoát tab order.
- [ ] BackToTop: nâng `bottom` trên trang có sticky (hoặc gộp vào cùng dải) — hiện bị che chết.
- [ ] SiteFooter: thêm `padding-bottom` = chiều cao sticky + safe-area để dòng miễn trừ trách nhiệm không bị che vĩnh viễn.
- [ ] Verify mobile viewport 375px + keyboard tab. Commit.

### Task 10: Micro-fix funnel  [P2 ×4]
**Files:** `StartupPath.tsx:63` (đọc đúng store để tick bước 1 khi đã lập lá số), `AstroTickerLive.tsx:101` (placeholder `min-h` responsive khớp mobile — hết nhảy ~150-200px), `InstantChartHero.tsx:234` (mobile: nút submit lên trên fold — thu khoảng cách dọc form ở <640px), `page.tsx:700` (CTA Premium `KHUYÊN DÙNG` → trỏ thẳng `/checkout?tier=premium` thay vì hop `/pricing#premium` — giữ nguyên nếu checkout cần context; nếu giữ hop thì thêm `#premium` scroll-margin).
- [ ] Sửa 4 điểm + verify từng cái + commit riêng lẻ.

## Sub-wave 65.03 — Rút ngắn trang 20 → ~12 section  [P1 lớn nhất — CẦN FOUNDER DUYỆT danh sách cắt/gộp trước khi code]

Data: đa số khách dừng ở 25–50% trang; thông điệp "nhiều lăng kính → 1 bức tranh" lặp 4 lần (MultiHero ≈ Methodology; OracleBrain ≈ ToolkitSection — 2 cái sau đọc cùng nguồn `TOOLKIT_GROUPS`, trùng 100%); >50 link thoát giữa funnel trước khi thấy giá.

### Task 11: Đề xuất cắt/gộp (thứ tự ít rủi ro → nhiều)
**Files:** `page.tsx` (thứ tự section), các component liên quan.
- [ ] (a) Fold `NotOraclesStrip` (30 dòng, 1 câu định vị) vào cuối `MultiHero` — bỏ 1 section.
- [ ] (b) Gộp `PullQuote` + `MissionNote` thành 1 khối quote duy nhất (cùng vai "khoảng lặng triết lý") — bỏ 1 section.
- [ ] (c) Gộp `EngineProofShowcase` vào `SampleOutputShowcase` thành 1 section "Bằng chứng" chung disclaimer (lá số tính ra → báo cáo đọc được) — bỏ 1 section.
- [ ] (d) Chọn MỘT trong OracleBrain / ToolkitSection làm section "độ phủ công cụ" (khuyến nghị: giữ OracleBrain đã sửa ở Task 8 vì có tương tác + cảm giác "sống"; ToolkitSection ~30 chip dời xuống `/cong-cu` hoặc thu thành 1 hàng marquee link "Xem tất cả công cụ") — bỏ 1 section + gỡ ~30 link thoát giữa funnel.
- [ ] (e) `SocialProofQuiet`: 4 quote → 2 quote mạnh nhất (giảm 1/2 chiều cao, giữ anti-testimonial).
- [ ] (f) Thêm CTA chốt sau FAQ (trước newsletter): 1 dòng + 1 nút `Lập lá số miễn phí` — desktop hiện đang kết thúc không có CTA.
- [ ] Verify: đếm lại section ≤13; đo chiều cao mobile giảm ≥30%; scroll-depth PostHog sau 4 tuần (kỳ vọng 50%+ đạt pricing). Mỗi bước 1 commit riêng để rollback được.

## Sub-wave 65.04 — Thống nhất design system  [P1 ×2 — CẦN FOUNDER CHỐT 2 QUYẾT ĐỊNH]

Quyết định cần chốt: (1) heading grammar duy nhất = `font-editorial-display` (Newsreader) cho MỌI marketing section? (2) radius chữ ký = 2px "paper corner" hay rounded-md?

### Task 12: Heading grammar  [P1 · verify CONFIRMED]
**Files:** `ScanRow.tsx:88`, `SampleOutputShowcase.tsx:171`, `MentorSampleInteractive.tsx:608`, `PricingTierV2.tsx:184`, `FaqAccordion.tsx`, `NewsletterSignup.tsx` — 6 file đang dùng sans-bold.
- [ ] Migrate 6 heading sang hệ editorial (`font-editorial-display text-editorial-h2`), giữ InstantChartHero H1 sans theo spec hero.
- [ ] Verify bằng screenshot từng section 2 theme. Commit theo file.

### Task 13: CTA recipe duy nhất  [P1]
**Files:** Create `packages/ui/src/marketing-cta.tsx` (hoặc globals utility `.btn-marketing-primary`); modify 5 điểm CTA: `InstantChartHero` (bg-gold legacy), `MultiHero` (outline ①②), `SampleOutputShowcase` (rounded-full), `PricingTierV2` (rounded-[2px]), `StickyMobileCta` (bg-gold pill).
- [ ] 1 recipe: surface `--primary-cta`, 1 radius (theo quyết định founder), 1 font label; secondary = outline cùng radius.
- [ ] Verify: grep `bg-gold` trong marketing = 0. Commit.

### Task 14: Token sweep nhỏ
**Files:** eyebrow/mono 12px vs 13px (5+ cách viết → 1 token `text-eyebrow`), 3 bậc nền muted /20/30/40 → 2 bậc, spacing `py-section` dùng thật, ShimmerText 6 → 2 chỗ (hero + 1 điểm nhấn).
- [ ] Sweep + screenshot + commit.

## Sub-wave 65.05 — Hiệu năng sâu (sau khi trang đã ngắn lại)

### Task 15: Bundle khách-lạ  [P2 ×4]
**Files:** `lib/posthog.ts:18` (+call sites), `providers/lazy-motion-provider.tsx:3`, `lib/google-tags.ts:110`, `SiteFooter.tsx:1`, `SampleOutputShowcase`, `InfographicBatTu`.
- [ ] posthog-js + supabase-js: dynamic import sau interaction/idle (~90–100KB gzip khỏi First Load).
- [ ] LazyMotion: `loadFeatures` async thay vì import tĩnh domAnimation (~15–20KB).
- [ ] GTM/GA4: delay tới `requestIdleCallback` + first interaction (consent-gated giữ nguyên).
- [ ] Bỏ `'use client'` ở 3 component tĩnh (SiteFooter 270 dòng render mọi trang).
- [ ] Verify: build size diff, Lighthouse TBT. Commit từng mục.

### Task 16: Gộp scroll-reveal 5 → 1  [P2 · 3 vòng cùng phát hiện]
**Files:** `RevealOnScroll.tsx` (giữ làm chuẩn — đã chống fling-miss), `PullQuote.tsx:62`, `SampleOutputShowcase`, +2 cơ chế còn lại; `fx/ScrollProgress.tsx` (setState mỗi frame → rAF throttle + transform trực tiếp).
- [ ] Thay 4 cơ chế lệch bằng RevealOnScroll (2 cái đang giữ bug blank-section opacity-0 đã chẩn đoán trong guardrails).
- [ ] Verify: cuộn nhanh không còn section trắng; CPU profile giảm listener. Commit.

### Task 17: OracleBrain giảm cân  [P3-L nhưng nợ lớn nhất]
**Files:** `OracleBrain.tsx` (793 dòng client monolith) → tách phần tĩnh (heading, khung) thành RSC, phần tương tác thành island nhỏ; 415 dòng `.ob-*` trong globals.css → CSS module/scoped.
- [ ] Tách + đo DOM/TBT trước-sau. Commit.

## Sub-wave 65.06 — A11y + mobile polish

### Task 18: WCAG lớp tương tác  [P2 ×3, P3 ×5]
**Files:** `MultiHero.tsx:54` (word-rotation cần pause ≥ hoặc dừng sau N vòng + dừng khi reduced-motion — hiện DOM chứa cả 4 từ: render 1 từ, xoay bằng JS, cũng fix luôn hidden-text SEO), Marquee công cụ (nút pause), `MentorSampleInteractive.tsx:686` + NewsletterSignup + OracleBrain (focus move + `aria-live` mount TRƯỚC khi nội dung đổi), tap targets <44px (link "Xem các gói", "học", nút đóng overlay 34px), mobile drawer `100vh` → `100dvh`, `StartupPath` mobile 2 cột → 1 cột, pricing mobile đưa card KHUYÊN DÙNG lên đầu stack, Time24 aria-label khớp label nhìn thấy, bỏ `user-select:none` phủ kết quả OracleBrain.
- [ ] Sửa theo cụm, mỗi cụm 1 commit + verify keyboard/VoiceOver mô phỏng.

## Sub-wave 65.07 — Dọn code (không đổi UI)

### Task 19: Dead code + comment  [P2 ×2]
**Files:** Xoá 7 component chết ~800 dòng (`HeroV4`, `WhyTrust`, `HowToStart`, `IntentChips`, `LiveCounterEyebrow`, `HeroBadgeScroll`, `BigNumberRow` — GitNexus impact xác nhận 0 consumer trước khi xoá; HeroV4 đang được comment page.tsx nhắc là "stays available" → cập nhật comment), dọn comment Wave sai sự thật trong `page.tsx` (~40% file), chốt quy tắc sở hữu 3 thư mục `home/` · `home-hero/` · `marketing/` (đề xuất: gộp `home-hero/` vào `home/`, `marketing/` chỉ giữ component dùng ≥2 trang).
- [ ] GitNexus `impact` từng symbol → xoá → `detect_changes` → commit.

---

## Priority execution order

1. **65.01** Quick wins (1–2 ngày, hiệu quả LCP + SEO ngay)
2. **65.02** Friction data-backed (rageclick, sticky, prefill)
3. **65.03** Cắt trang ← *founder duyệt danh sách (a)–(f) trước*
4. **65.04** Design system ← *founder chốt 2 quyết định (heading + radius)*
5. **65.05** Perf sâu (sau khi trang ngắn — đỡ tối ưu thứ sắp xoá)
6. **65.06** A11y + mobile polish
7. **65.07** Dọn code

## Success metrics (đo lại sau 4 tuần)

| Metric | Hiện tại | Mục tiêu |
|---|---|---|
| LCP mobile (PageSpeed) | ~FCP+0.9s | −0.5–0.9s |
| TBT desktop | 650ms | <250ms |
| Số section homepage | 19+2 strip | ≤13 |
| Scroll đạt pricing (PostHog) | ~2/10 user | ≥5/10 |
| `pricing_cta_clicked` trên `/` /30d | 0 | >0 (theo dõi, không target cứng — traffic nhỏ) |
| Rageclick OracleBrain /30d | 31 | ~0 |
| First Load JS shared | ~1.3MB unc. | −110–120KB gzip |

## Những gì review XÁC NHẬN LÀM ĐÚNG — không được phá

1. InstantChartHero "value before ask" (form completion 78%) — giữ bằng mọi giá.
2. Kỷ luật trung thực: không số liệu bịa, không testimonial giả, JSON-LD từ chối fake rating.
3. `<Suspense>` hydration chunking (vault 172), FAQ native `<details>`, SSR đầy đủ nội dung.
4. Hệ token màu 2 theme + motion discipline + tap-target 44px system.
5. Nav 6 mục + mega-footer (Wave 62.10), pricing 3 bậc (62.05).
