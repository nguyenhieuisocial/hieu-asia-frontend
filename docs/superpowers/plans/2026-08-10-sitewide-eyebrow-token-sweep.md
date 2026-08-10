# Site-wide Eyebrow Token Sweep — Strategy (queued, not started)

> Discovery-only document. No code has been changed. Written per founder's explicit choice ("mở rộng thành dự án riêng, không làm ngay") after Wave 65 Task 14 ("Token sweep nhỏ") turned out to have far larger scope than originally estimated. Do not begin implementation without a fresh go-ahead — this doc exists so that go-ahead can turn into fast, safe execution instead of a cold start.

## Why this exists

Wave 65's homepage plan (`2026-08-01-wave-65-homepage-upgrade.md`, Task 14) assumed the "eyebrow" label inconsistency (hand-written `text-[12px]`/`text-[13px]` + `uppercase` + `tracking-[...]` instead of the single `text-eyebrow` token) was confined to the homepage — "5+ cách viết → 1 token." A 2026-08-10 audit (triggered by founder asking "done hết design chưa?") found the same pattern site-wide, at a scale that makes "just fix it now" the wrong call: touching 200+ files in one pass on a production site with 1,290 indexed pages is a real regression risk, not a quick cleanup.

## Exact numbers (measured 2026-08-10, `apps/web/src`)

| Bucket | Count | Files | Migration confidence |
|---|---|---|---|
| **Safe auto-migrate**: `font-mono` + `uppercase` + `text-[12px]` or `text-[13px]` + `tracking-[0.12em]` exactly | **419** | **192** | High — matches the `text-eyebrow` token's own definition (`12px`, `lineHeight: 1.4`, `letterSpacing: 0.12em`) byte-for-byte |
| **Needs manual review**: same shape but a *different* tracking value (`0.1em`, `0.14em`, `0.3em`, `0.32em`, `0.25em`, `0.15em`, `0.16em`, `0.2em`, `0.18em`, `0.08em`, `0.06em`) | 32 | 20 | Low — could be an intentional wider-tracked variant (e.g. hero eyebrows, badges), not a stray typo. Judge each case before touching. |

Top-10 directories by hit count (safe + review combined, `apps/web/src/`):

```
51  app/learn
22  app/methodology
19  components/account
17  components/home
16  components/tools
15  components/learn
14  components/la-so-bat-tu
12  components/marketing
10  app/xong-dat
 9  app/khai-truong (+ sample-report, sao-han, sinh-con, xem-tuoi-cuoi, xem-tuoi-lam-nha, home-hero — all 9)
```

Full per-file list is not reproduced here (200+ entries) — regenerate on demand with the script in "Discovery reproduction" below rather than trusting a stale copy pasted into this doc.

## The exact transform (safe bucket only)

The `text-eyebrow` Tailwind font-size token (`apps/web/tailwind.config.ts`) is defined as:

```ts
eyebrow: ['12px', { lineHeight: '1.4', letterSpacing: '0.12em' }],
```

This means `text-eyebrow` alone already carries font-size + line-height + letter-spacing — `tracking-[0.12em]` becomes redundant once `text-eyebrow` is applied. `font-mono` and `uppercase` are separate Tailwind axes (font-family, text-transform) not bundled into a `fontSize` entry, so they stay.

**Before (either 12px or 13px variant):**
```
font-mono text-[12px] uppercase tracking-[0.12em] ...other classes...
font-mono text-[13px] uppercase tracking-[0.12em] ...other classes...
```

**After:**
```
font-mono uppercase text-eyebrow ...other classes...
```

Three tokens removed (`text-[12px]`/`text-[13px]`, `tracking-[0.12em]`) replaced by one (`text-eyebrow`). Class order doesn't matter functionally but keep it visually close to the existing convention (`font-mono {size} uppercase {tracking}` → `font-mono uppercase text-eyebrow`) so diffs read cleanly.

**Visual delta:** for the 13px instances, this is a genuine 1px reduction (13px → 12px) — matches Task 14's original stated goal ("12px vs 13px → 1 token"), not a no-op. Screenshot diff before/after per batch (see Verification) to confirm this reads as intended, not as a regression.

## Batching strategy — do NOT do this in one PR

1,290 static pages, 192 files. One giant PR would be unreviewable and would make a single bad match impossible to isolate. Batch by top-level directory, roughly matching the table above, smallest/lowest-risk first:

- **Batch 1 (pilot, prove the transform + tooling)**: `components/home`, `components/home-hero`, `components/marketing` (~38 hits, 3 dirs, homepage-adjacent — matches the ORIGINAL Task 14 scope, so this batch alone closes the Wave 65 debt even if nothing else ships).
- **Batch 2**: `components/account`, `components/tools`, `components/learn`, `components/la-so-bat-tu`, `components/tuvi`, `components/ban-do-sao` (component-level, reused across many pages — verify each consuming page, not just the component in isolation).
- **Batch 3+**: `app/*` route-level files, grouped by feature area (e.g. `app/learn` alone is 51 hits — likely its own batch given size), smallest directories last (mop-up).

Each batch = its own worktree + branch + PR, same discipline as SEO đợt 2 (small clustered commits, not one squash-everything commit).

## Per-batch verification (mandatory, same bar as every other PR this session)

1. Regex-based mechanical replace (see reproduction script) — **never hand-edit 190 files**, script it, then spot-check a random 10% sample by eye against the source diff.
2. `tsc --noEmit` + `pnpm lint` + `pnpm build` clean.
3. `node scripts/seo-guard.mjs` — 0 new violations (1px text size change won't trip title/description rules, but confirms nothing else broke incidentally).
4. GitNexus `detect_changes` — expect risk **low** (pure className swap, no logic), but actually read the affected-file list per batch; don't rubber-stamp.
5. Screenshot 2–3 representative pages per batch (light + dark mode) via the real Cent Browser session — confirm the label reads as a clean 1px-smaller/consistent eyebrow, not a layout shift or truncation.
6. Merge-poll to MERGED (not just "auto-merge enabled") before starting the next batch.

## Cạm bẫy đã gặp thật ở đợt 1 (đọc trước khi chạy đợt sau)

`ui-guard.mjs` (note 167 §C.6) chặn PR khi một **dòng vừa thay đổi** chứa
`group-hover:` mà **cả file** không có `group-focus-within:`. Codemod ghi lại
nguyên dòng class, nên mọi nhãn eyebrow nằm chung dòng với `group-hover:` đều
bị tính là "group-hover mới" dù logic không đổi. Đợt 1 dính 2 file
(`StartupPath`, `TrustBand`).

Cách xử lý đúng: **thêm bản tương đương cho bàn phím**, không né guard. Ở cả 2
chỗ, phần tử mang class `group` chính là thẻ `<Link>` nên `:focus-within` khớp
ngay khi thẻ được focus:

```
group-hover:text-foreground        → + group-focus-within:text-foreground
group-hover:translate-x-0.5        → + group-focus-within:translate-x-0.5
```

**23 file** trong 399 chỗ còn lại có `group-hover:` mà thiếu
`group-focus-within:` — không phải tất cả sẽ bị chặn (chỉ khi hai thứ nằm chung
dòng), nên đừng sửa trước hàng loạt. Quy trình: chạy codemod → `node
apps/web/scripts/ui-guard.mjs origin/main` **tại máy** → chỉ sửa đúng file bị
báo → commit riêng khoản a11y đó tách khỏi commit đổi token.

Lưu ý: ui-guard đọc nội dung file từ git chứ không đọc thư mục làm việc — phải
commit rồi mới chạy lại guard, sửa xong mà chưa commit thì vẫn báo đỏ.

Ngoài ra 6 chỗ có `sm:text-xs` đứng cạnh nhãn eyebrow. Không cần đụng: từ 640px
trở lên `text-xs` vẫn ghi đè cỡ chữ đúng như trước, chỉ khác ở chỗ giờ nó thành
thừa. Gỡ là chuyện dọn riêng, không thuộc phạm vi quét token.

## The 32 "needs review" instances — handle separately, do not sweep with the rest

These use a tracking value other than `0.12em` on an otherwise eyebrow-shaped label. Before touching any of them: read the surrounding component to judge whether the wider/narrower tracking is a deliberate accent (e.g. a hero eyebrow meant to read louder than a body-adjacent tag) or genuinely a copy-paste drift. Do this as its own small pass *after* the 419 safe ones ship and the tooling/verification rhythm is proven — don't block Batch 1 on it.

## Discovery reproduction (rerun before starting, numbers may have shifted)

```js
// Run via ctx_execute(language:"javascript") or plain node — read-only, no writes.
const { execSync } = require('child_process');
const root = "apps/web/src"; // run from repo root
const raw = execSync(`grep -rln "font-mono" "${root}" --include="*.tsx"`, { maxBuffer: 1024*1024*20 })
  .toString().trim().split('\n').filter(Boolean);
const fs = require('fs');
let safe = [], review = [];
for (const file of raw) {
  const content = fs.readFileSync(file, 'utf8');
  const re = /className=(?:\{`|["'`])([^"'`]*font-mono[^"'`]*)/g;
  let m;
  while ((m = re.exec(content))) {
    const cls = m[1];
    if (/uppercase/.test(cls) && /text-\[1[23]px\]/.test(cls)) {
      (/ tracking-\[0\.12em\]/.test(cls) ? safe : review).push(file);
    }
  }
}
console.log('safe:', safe.length, 'review:', review.length);
```

## Cross-link

[[94 - Master Infrastructure Reference]] · originating gap: `2026-08-01-wave-65-homepage-upgrade.md` Task 14 · sibling precedent for "big sweep needs its own plan": SEO đợt 2 (120-page batch, split for safety per founder decision)

---

## Đợt 2 — các biến thể regex đợt 1 không thấy (2026-08-10)

Regex khám phá ban đầu chỉ khớp đúng công thức `font-mono … text-[12|13px] …
uppercase … tracking-[0.12em]` → 419 chỗ. Rà lại bằng cách **gom nhóm theo chữ
ký** (font-family × cỡ chữ × tracking × hoa/thường) thay vì khớp một công thức
cứng, phát hiện thêm **275 nhãn eyebrow viết tay lệch chuẩn** — tổng nợ thật
gấp ~1.6 lần con số ban đầu. Nợ có sẵn, không phải do đợt 1 sinh ra.

### Đã xử lý (252/275 + 8 chỗ dọn thêm)

| Nhóm | Số chỗ | Cách xử lý |
|---|---|---|
| Đã khai `font-mono`, lệch tracking (`widest`/`wider`/`wide`/`0.08`–`0.16em`), cỡ 11/12/13px hoặc `text-xs` | 164 / 99 file | → `text-eyebrow`, xoá `tracking-*` |
| Không khai `font-mono`, còn lại giống trên | 88 / 51 file | → `text-eyebrow`, xoá `tracking-*` |
| `text-eyebrow` còn dính `sm:text-xs` (sót từ đợt 1) | 8 | → xoá variant chết |

### ⚠️ `font-mono` KHÔNG phải monospace trong repo này

Từ 2026-06-29, `mono` trong `packages/config/tailwind-preset.ts` được trỏ về
`var(--font-be-vietnam)` — JetBrains Mono đã gỡ, tên class giữ lại **chỉ để
khỏi phải sửa 812 call-site**. Hệ quả:

- **Không được** thêm `font-mono` vào nhãn mới với niềm tin là "đổi sang mặt
  chữ mono" — nó là no-op về font-family.
- Bản nháp đầu của đợt 2 đã thêm `font-mono` vào 88 chỗ rồi **bỏ đi**, vì như
  vậy chỉ nhân thêm call-site cho một alias đang muốn khai tử.
- Cần fixed-width thật (mã, khoá, token) → dùng `font-code`.

### ⚠️ `sm:text-xs` đứng cạnh `text-eyebrow` là rác

`text-xs` khai lại `line-height: 1rem`, đè `1.4` của token ⇒ nhãn cao dòng
khác nhau giữa mobile và desktop. Cỡ chữ và tracking thì không đổi. Regex
khám phá của đợt 1 không chặn variant dạng `sm:text-xs` (chỉ chặn
`sm:text-[13px]`) nên để lọt 8 chỗ — đợt 2 đã dọn.

### Miễn trừ có chủ đích — KHÔNG migrate (23 chỗ)

| Nhóm | Lý do giữ |
|---|---|
| `tracking-[0.18em]` trở lên (0.18 / 0.2 / 0.25 / 0.3 / 0.32em) | Giãn chữ rộng **cố ý** ở trang thương hiệu (`app/brand/page.tsx`, `components/brand/TypographyShowcase.tsx`) và vài nhãn display. Ép về 0.12em là phá chủ ý thiết kế. |
| Cỡ ≤ 10px (7/8/9/10px) | Micro-label, không phải eyebrow — kéo lên 12px sẽ vỡ layout. |
| Không `uppercase` (6 chỗ) | Chữ thường ⇒ không thuộc định nghĩa eyebrow. |
| 4 chỗ `app/learn/disc/page.tsx` | Có `sm:text-xs` **và** base 11px — variant đang làm việc thật (11→12px), cần mắt người. |

### Cần nhìn mắt thường sau khi lên production

- `app/learn/xong-dat/page.tsx` — hằng `TAG` là chip bo tròn có padding, đổi
  11px→12px và 0.1em→0.12em nên mỗi chip rộng thêm ~10%. Kiểm tra hàng chip
  không bị xuống dòng xấu.
- `app/en/page.tsx` — một câu 87 ký tự đang bị style như eyebrow (chữ hoa nhỏ,
  giãn chữ). Không phải lỗi do sweep (nó đã viết hoa từ trước) nhưng là **mùi
  thiết kế có sẵn**: câu dài không nên mặc áo eyebrow. Ghi lại để xử lý ở pha
  copy, không sửa trong sweep token.

### Bài học đưa vào quy trình

Khi sweep token, **đừng khám phá bằng một regex khớp công thức cứng** — nó chỉ
tìm thấy đúng cái mình đã tưởng tượng ra. Cách đúng: liệt kê mọi tổ hợp class
theo trục (family × size × tracking × case), xếp theo tần suất, rồi mới quyết
nhóm nào migrate / nhóm nào miễn trừ. Chênh lệch giữa hai cách làm: 419 → 694.
