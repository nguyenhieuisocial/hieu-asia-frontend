# Trang chủ "4 lăng kính → AI" — Staging trong /muc-lab — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development hoặc superpowers:executing-plans để thực thi task-by-task. Steps dùng checkbox (`- [ ]`).
> **Lưu ý frontend:** Đây là marketing page (layout/copy/motion), KHÔNG có unit test. "Test" = **Playwright device-emulation assertions + screenshot review** (harness đã dùng ở các commit trước). Mỗi phase: build → tsc/eslint sạch → Playwright verify → commit.

**Goal:** Dựng một trang chủ hoàn chỉnh (full flow) theo định vị "editorial decoder, không oracle" + mobile-first, **trong /muc-lab làm staging** (noindex, KHÔNG đụng production `page.tsx`), để duyệt trước khi đề xuất vào production.

**Architecture:** Một route mới `muc-lab/home` (server component, noindex) compose: hero editorial `MultiHero` (đã build) + các **section production tái sử dụng** (import, KHÔNG sửa) + **4 section mới** lấp lỗ (build leaf trong `muc-lab/home/sections/`). Mọi file mới đều là leaf → blast LOW, an toàn với sibling-owned `page.tsx`/`HeroV4` (wave-64).

**Tech Stack:** Next.js 15 RSC + React 19 + TS strict; Tailwind editorial tokens (`font-marketing-display`=Instrument Serif, `font-editorial-display`=Newsreader, ochre `#A47532`/giấy `#F3ECDD`/mực `#171411`); SVG/CSS thuần (no WebGL); Playwright (Chrome channel) cho verify.

---

## Decisions (locked)
1. **Hero** = editorial `MultiHero` "4 lăng kính" (retire `HeroCosmos` — research xác định star-field WebGL là anti-pattern). ✅
2. **Staging** = route `/muc-lab/home`, KHÔNG implement thẳng `app/page.tsx` (sibling-owned). ✅
3. **Pricing** trên homepage = **rút gọn** (1 dòng + link `/pricing`), bỏ bảng `PricingTierV2` đầy đủ khỏi flow chính. ✅

## File Structure

**Tạo mới (leaf, an toàn):**
- `src/app/muc-lab/home/page.tsx` — staging homepage (RSC, noindex), compose flow.
- `src/app/muc-lab/home/sections/NotOraclesStrip.tsx` — dải định vị "không đoán số".
- `src/app/muc-lab/home/sections/Methodology.tsx` — "show your work" synthesis (differentiator).
- `src/app/muc-lab/home/sections/FounderNote.tsx` — mini-bio founder.
- `src/app/muc-lab/home/sections/FreeReadingTeaser.tsx` — input ngày sinh → ví dụ mini-reading (client) + privacy.
- `src/app/muc-lab/home/sections/PricingLite.tsx` — pricing rút gọn + link.

**Tái sử dụng (import, KHÔNG sửa):**
- `./MultiHero` (muc-lab) — hero.
- `@/components/marketing/ScanRow` — pain/intent router.
- `@/components/home/HowToStart` — 3 bước.
- `@/components/marketing/SampleOutputShowcase` + `MentorSampleInteractive` — sample output/demo.
- `@/components/marketing/SocialProofQuiet` — social proof "im lặng".
- `@/components/home/FaqAccordion` — FAQ.
- `@/components/home/SiteFooter`, `@/components/marketing/StickyMobileCta`.

## Section order (staging compose, mobile-first)
1. `MultiHero` (hero) → 2. `NotOraclesStrip` → 3. `ScanRow` (pain/intent) → 4. `HowToStart` → 5. `Methodology` 🆕 → 6. `SampleOutputShowcase`+`MentorSampleInteractive` → 7. `FreeReadingTeaser` 🆕 → 8. `SocialProofQuiet`+`FounderNote` 🆕 → 9. `FaqAccordion` → 10. `PricingLite` 🆕 → 11. `SiteFooter` + `StickyMobileCta`.

---

## Verify harness (dùng lại mọi phase)
Dev server: `pnpm --filter web exec next dev --port 3457` (background). URL staging: `http://localhost:3457/muc-lab/home`.
Playwright script mẫu (`/tmp/stg-verify.js`, chạy `NODE_PATH="$(pwd)/node_modules" node ...`): newContext touch 390 + desktop 1280 → `goto` → assert `documentElement.scrollWidth - clientWidth === 0` (no overflow) + thứ tự section (so `getBoundingClientRect().top`) + `fullPage` screenshot → Read screenshot.

---

## Task 0: Scaffold staging route

**Files:**
- Create: `src/app/muc-lab/home/page.tsx`

- [ ] **Step 1: Tạo page tối thiểu (chỉ hero + marker)**

```tsx
import type { Metadata } from 'next';
import { MultiHero } from '../MultiHero';

export const metadata: Metadata = {
  title: 'Trang chủ (staging) — 4 lăng kính',
  robots: { index: false, follow: false },
};

export default function MucLabHomePage() {
  return (
    <>
      <MultiHero />
      <div id="stg-end" style={{ height: 1 }} />
    </>
  );
}
```

- [ ] **Step 2: Start dev server + verify 200**

Run: `pnpm --filter web exec next dev --port 3457` (bg) → `curl -s -o /dev/null -w "%{http_code}" http://localhost:3457/muc-lab/home`
Expected: `200`, HTML chứa eyebrow "BỐN LĂNG KÍNH".

- [ ] **Step 3: tsc + eslint**

Run: `pnpm --filter web exec tsc --noEmit` + `eslint src/app/muc-lab --ext .ts,.tsx`
Expected: 0 error.

- [ ] **Step 4: Commit**

`git add src/app/muc-lab/home && git commit -m "feat(muc-lab): scaffold staging homepage route /muc-lab/home"`

---

## Task 1: Compose section production tái sử dụng (đúng thứ tự)

**Files:** Modify `src/app/muc-lab/home/page.tsx`

- [ ] **Step 1: Import + xếp các section sẵn có theo order (chưa có 4 section mới)**

```tsx
import { MultiHero } from '../MultiHero';
import { ScanRow } from '@/components/marketing/ScanRow';
import { HowToStart } from '@/components/home/HowToStart';
import { SampleOutputShowcase } from '@/components/marketing/SampleOutputShowcase';
import { MentorSampleInteractive } from '@/components/marketing/MentorSampleInteractive';
import { SocialProofQuiet } from '@/components/marketing/SocialProofQuiet';
import { FaqAccordion } from '@/components/home/FaqAccordion';
import { SiteFooter } from '@/components/home/SiteFooter';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
// (kiểm tra named vs default export thực tế của từng file trước khi import)
```
Compose trong return theo order ở trên (chừa chỗ comment cho 4 section mới sẽ chèn ở Task 2-5).

- [ ] **Step 2: Verify** — Playwright 390+1280: no horizontal overflow; screenshot full page; xác nhận các section render xếp dọc hợp lý. tsc/eslint sạch.
- [ ] **Step 3: Commit** — `feat(muc-lab): compose reused sections into staging homepage`.

> ⚠️ Kiểm tra export shape thật của mỗi component (named/default, props bắt buộc). Nếu component yêu cầu props (vd items), truyền dữ liệu tối thiểu hợp lệ. Nếu một component là client/nặng, vẫn import bình thường (RSC compose được).

---

## Task 2: NotOraclesStrip 🆕 (định vị "không đoán số")

**Files:** Create `src/app/muc-lab/home/sections/NotOraclesStrip.tsx`; Modify `home/page.tsx` (chèn sau `MultiHero`).

- [ ] **Step 1: Build leaf component**

Copy thật (editorial, mono labels):
- Câu chính: **"Không đoán số. Không 'vận hạn'. hieu.asia giải mã bối cảnh từ bốn lăng kính để bạn tự quyết."**
- 3 micro-pill: `KHÔNG BÓI TOÁN` · `AI GIẢI MÃ RÕ RÀNG` · `QUYẾT ĐỊNH LÀ CỦA BẠN`

```tsx
export function NotOraclesStrip(): React.JSX.Element {
  const PILLS = ['Không bói toán', 'AI giải mã rõ ràng', 'Quyết định là của bạn'];
  return (
    <section className="nos" aria-label="Định vị">
      <style>{`
        .nos { max-width: 1180px; margin: 0 auto; padding: 8px 22px 28px; }
        @media (min-width:880px){ .nos{ padding: 8px 56px 36px; } }
        .nos-line { font-family:'Newsreader',Georgia,serif; font-size:clamp(1.15rem,4.5vw,1.5rem); line-height:1.4; color:#171411; max-width:30em; margin:0; }
        .nos-line b { color:#A47532; font-style:italic; font-weight:500; }
        .nos-pills { display:flex; flex-wrap:wrap; gap:8px; margin-top:14px; }
        .nos-pill { font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:#6B6358; border:1px solid rgba(164,117,50,.3); border-radius:999px; padding:5px 11px; }
      `}</style>
      <p className="nos-line">Không đoán số. Không “vận hạn”. hieu.asia <b>giải mã bối cảnh</b> từ bốn lăng kính để <b>bạn tự quyết</b>.</p>
      <div className="nos-pills">{PILLS.map((p) => <span key={p} className="nos-pill">{p}</span>)}</div>
    </section>
  );
}
```
(thêm `import * as React from 'react';`)

- [ ] **Step 2: Chèn vào page** sau `<MultiHero/>`.
- [ ] **Step 3: Verify** Playwright (no overflow, strip nằm ngay dưới hero) + tsc/eslint. **Step 4: Commit.**

---

## Task 3: Methodology 🆕 ("show your work" — differentiator)

**Files:** Create `src/app/muc-lab/home/sections/Methodology.tsx`; chèn sau `HowToStart`.

- [ ] **Step 1: Build** — section editorial, KHÔNG icon sparkle. Headline + 4 hàng hệ (tên · đóng góp · con số) → 1 dòng synthesis.

Copy thật:
- Headline: **"Bốn lăng kính, một bức tranh"**; dòng dẫn: "Mỗi hệ nhìn bạn từ một phía. AI đọc cả bốn rồi hợp thành một khuyến nghị bạn dùng được."
- 4 hàng:
  - **Tử Vi** — lá số 12 cung, hơn 360 yếu tố → *bản đồ ưu thế & thời vận*.
  - **Bát Tự** — Tứ Trụ can-chi, ngũ hành → *nhịp thịnh–suy theo thời gian*.
  - **Thần Số** — con số đường đời → *động lực gốc & bài học*.
  - **MBTI** — 16 kiểu → *cách bạn tiếp nhận & ra quyết định*.
- Dòng chốt: **"→ AI hợp nhất bốn lớp thành một lời khuyên thực tế, có thể hành động — không phải lời tiên tri."**

Layout: mobile = stack dọc 4 hàng (số/tên trái, mô tả phải); desktop (`min-width:880`) = grid 2×2 hoặc list rộng. Dùng `font-marketing-display`/serif cho tên hệ, mono cho con số. (Tùy chọn: nhúng `FourLens` thu nhỏ ở trạng thái hội tụ làm minh hoạ — chỉ thêm nếu không phình; verify perf.)

- [ ] **Step 2: Verify** (no overflow 390/1280, đọc được, 4 hàng rõ) + tsc/eslint. **Step 3: Commit.**

---

## Task 4: FreeReadingTeaser 🆕 (value-before-ask + privacy)

**Files:** Create `src/app/muc-lab/home/sections/FreeReadingTeaser.tsx` (`'use client'`); chèn sau sample output.

- [ ] **Step 1: Build client component** — input ngày sinh (date) → bấm "Soi thử" → hiện 2-3 câu **ví dụ minh hoạ** (canned, vì chưa nối AI thật) **nhãn rõ "ví dụ"** + privacy line cạnh input. CTA sau: "Đăng ký để nhận phân tích đầy đủ".

Yêu cầu honesty: kết quả phải gắn nhãn **"ví dụ minh hoạ — chưa phải phân tích của bạn"** (không giả cá nhân hoá lừa). Privacy: **"Chỉ dùng để tính toán · không lưu nếu bạn chưa đăng ký · không bán/chia sẻ."**

Skeleton:
```tsx
'use client';
import * as React from 'react';
export function FreeReadingTeaser(): React.JSX.Element {
  const [shown, setShown] = React.useState(false);
  return (
    <section className="frt"> {/* style: editorial card, ochre border */}
      {/* <input type="date" aria-label="Ngày sinh"/> + nút "Soi thử" → setShown(true) */}
      {/* privacy line ngay dưới input */}
      {/* {shown && <blockquote> “ví dụ minh hoạ …” <small>ví dụ — chưa phải phân tích của bạn</small></blockquote>} */}
      {/* CTA: "Đăng ký để nhận phân tích đầy đủ →" */}
    </section>
  );
}
```
Câu ví dụ (1): "Bạn mạnh quyết đoán nhưng dễ chần chừ ở khúc rẽ lớn — vì cầu toàn. Khi phân vân, đặt deadline ngắn rồi điều chỉnh."

- [ ] **Step 2: Verify TƯƠNG TÁC bằng Playwright** (touch 390): fill date → tap "Soi thử" → assert blockquote xuất hiện + có nhãn "ví dụ" + privacy line hiển thị + no layout jump (reserve chỗ). tsc/eslint. **Step 3: Commit.**

---

## Task 5: FounderNote 🆕 + PricingLite 🆕

**Files:** Create `sections/FounderNote.tsx`, `sections/PricingLite.tsx`; chèn FounderNote cạnh `SocialProofQuiet`, PricingLite trước footer.

- [ ] **Step 1: FounderNote** — layout: ảnh tròn nhỏ + 2-3 câu. ⚠️ **CẦN CONTENT THẬT từ founder** (tên, ảnh, lý do làm, credential kép cổ-học+tech). Build structure + dùng placeholder text rõ ràng `{/* TODO: bio thật */}` + ảnh placeholder; **không bịa người thật**. Đánh dấu là chỗ chờ content.
- [ ] **Step 2: PricingLite** — 1 dòng: **"Miễn phí để bắt đầu · không cần thẻ. Nâng cấp khi bạn muốn đi sâu hơn."** + link `Xem các gói →` tới `/pricing`. KHÔNG bảng đầy đủ.
- [ ] **Step 3: Verify** + tsc/eslint. **Step 4: Commit.**

---

## Task 6: Mobile-first full-page sweep + fix

**Files:** Modify bất kỳ section nào lỗi.

- [ ] **Step 1: Playwright sweep** 360/390/768/1280 (touch cho ≤768): assert (a) **no horizontal overflow** mọi width; (b) **thứ tự section** đúng (top tăng dần theo list); (c) **không layout-jump** ở các phần tử động (hero word, FreeReadingTeaser, soi); (d) tap target ≥44px; (e) `StickyMobileCta` xuất hiện sau khi cuộn qua hero, không che content; (f) `prefers-reduced-motion` → trạng thái tĩnh hợp lý. Full-page screenshot mỗi width → Read review.
- [ ] **Step 2: Fix** mọi lệch (ưu tiên: overflow, jump, sticky che nội dung, contrast `SOFT` < AA).
- [ ] **Step 3: tsc/eslint + Commit** `fix(muc-lab): mobile-first full-page polish for staging homepage`.

---

## Self-Review (checklist)
- **Spec coverage:** hero editorial ✓(Task0/1) · không-oracle strip ✓(T2) · methodology/show-your-work ✓(T3) · sample output (reuse) ✓(T1) · value-before-ask + privacy ✓(T4) · founder ✓(T5) · social proof (reuse) ✓ · FAQ (reuse) ✓ · pricing rút gọn ✓(T5) · sticky mobile (reuse) ✓ · mobile-first sweep ✓(T6).
- **Còn chờ content thật:** FAQ câu "khác gì thầy bói"/privacy/accuracy (copy có sẵn ở research Agent D — sẽ áp khi chỉnh FaqAccordion, NHƯNG FaqAccordion là sibling-owned → KHÔNG sửa trong staging; thay vào đó để bản FAQ mới override bằng prop `items` nếu component nhận, hoặc note đề xuất). Founder bio + ảnh.
- **Không placeholder ẩn:** mọi section mới có copy thật; chỗ duy nhất chờ = FounderNote (đánh dấu TODO rõ) + nối AI thật cho teaser (đang dùng "ví dụ" có nhãn).
- **Coordination:** chỉ tạo file leaf trong `muc-lab/home/**`; KHÔNG sửa component production (reuse-only). An toàn sibling.

## Execution Handoff
Hai cách thực thi:
1. **Subagent-Driven (recommended)** — mỗi Task một subagent tươi, review giữa các task.
2. **Inline** — chạy tuần tự trong session này, checkpoint review theo phase.
