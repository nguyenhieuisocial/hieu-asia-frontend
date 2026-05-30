# HANDOFF — Đợt-1 Feedback Loop (wire SectionFeedback → Supabase)

**Trạng thái:** SPEC ONLY — chưa apply. Cần migration DB prod trước khi apply code.
**Worktree:** `hieu-frontend/ux-batch1`
**Ngày tạo:** 2026-05-30

---

## 1. Migration SQL

File: `backend/infra/supabase/migrations/0053_reading_feedback.sql`

Số thứ tự tiếp theo sau `0052_enforce_plan_expires_in_free_quota.sql`.
Ai apply: **backend repo** (người có quyền push `hieu.asia/backend`).

```sql
-- 0053 — Reading section feedback (Đợt-1 UX Feedback Loop).
--
-- Lưu rating per section từ SectionFeedback widget. User có thể
-- anonymous (user_id NULL) hoặc đã đăng nhập. reading_id là session
-- UUID từ /reading/[id] route. section_id là prop của SectionFeedback.
--
-- SECURITY:
--   RLS enabled + 2 policies:
--     1. anon/auth INSERT: cho phép ghi (user tự submit)
--     2. service_role SELECT: chỉ worker/admin đọc aggregate
--   KHÔNG cho phép anon SELECT trực tiếp (tránh lộ feedback người khác).

CREATE TABLE IF NOT EXISTS hieu_asia.reading_feedback (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id    text        NOT NULL,
  section_id    text        NOT NULL,
  rating        text        NOT NULL CHECK (rating IN ('accurate', 'partial', 'inaccurate')),
  adjust        text                 CHECK (adjust IN ('deeper', 'practical', 'softer', 'examples')),
  comment       text,
  user_id       uuid,
  submitted_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reading_feedback_reading_idx
  ON hieu_asia.reading_feedback (reading_id, section_id);

CREATE INDEX IF NOT EXISTS reading_feedback_submitted_idx
  ON hieu_asia.reading_feedback (submitted_at DESC);

ALTER TABLE hieu_asia.reading_feedback ENABLE ROW LEVEL SECURITY;

-- Cho phép browser client (anon key) INSERT — user submit feedback.
CREATE POLICY "feedback_insert_anon"
  ON hieu_asia.reading_feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- KHÔNG có SELECT policy cho anon/authenticated — chỉ service_role đọc.

COMMENT ON TABLE hieu_asia.reading_feedback IS
  'Đợt-1 UX feedback loop — per-section rating từ SectionFeedback widget. '
  'anon INSERT allowed; SELECT chỉ service_role (worker aggregate). '
  'user_id NULL = anonymous submit.';

COMMENT ON COLUMN hieu_asia.reading_feedback.reading_id IS
  'UUID của reading session (route param /reading/[id]).';
COMMENT ON COLUMN hieu_asia.reading_feedback.section_id IS
  'Prop sectionId của SectionFeedback — e.g. "tu-vi-menh", "bat-tu-ngay-sinh".';
COMMENT ON COLUMN hieu_asia.reading_feedback.rating IS
  'FeedbackRating: accurate | partial | inaccurate.';
COMMENT ON COLUMN hieu_asia.reading_feedback.adjust IS
  'FeedbackAdjust optional: deeper | practical | softer | examples.';
```

---

## 2. Code diff — wire SectionFeedback.handleSubmit

File: `apps/web/src/components/report/SectionFeedback.tsx`

### 2a. Thêm import (sau các import hiện có)

```diff
+import { getBrowserSupabase } from '@/lib/supabase-client';
+import { track } from '@/lib/analytics';
```

> `@/lib/analytics` là nơi export hàm `track` typed theo `event-taxonomy.ts`.
> Kiểm tra đường dẫn thực tế trong worktree nếu khác.

### 2b. Thêm prop `readingId` vào interface

```diff
 export interface SectionFeedbackProps {
   /** Unique per section. Used as the localStorage key suffix. */
   sectionId: string;
+  /** UUID của reading session từ route /reading/[id]. Cần để insert DB. */
+  readingId: string;
   /** Called after the payload is persisted to localStorage. */
   onSubmit?: (feedback: SectionFeedbackPayload) => void;
 }
```

### 2c. Cập nhật function signature

```diff
-export function SectionFeedback({ sectionId, onSubmit }: SectionFeedbackProps) {
+export function SectionFeedback({ sectionId, readingId, onSubmit }: SectionFeedbackProps) {
```

### 2d. Thay handleSubmit — thêm Supabase insert + analytics sau localStorage

```diff
   function handleSubmit() {
     if (!rating) return;
     const payload: SectionFeedbackPayload = {
       sectionId,
       rating,
       submittedAt: new Date().toISOString(),
       ...(adjust ? { adjust } : {}),
       ...(comment.trim() ? { comment: comment.trim() } : {}),
     };
     try {
       window.localStorage.setItem(storageKey, JSON.stringify(payload));
     } catch {
       // Storage may be full or disabled — still surface success state.
     }
+
+    // Persist to Supabase (best-effort, graceful no-op if client unavailable).
+    const supabase = getBrowserSupabase();
+    if (supabase) {
+      supabase
+        .from('reading_feedback')
+        .insert({
+          reading_id: readingId,
+          section_id: sectionId,
+          rating: payload.rating,
+          adjust: payload.adjust ?? null,
+          comment: payload.comment ?? null,
+        })
+        .then(({ error }) => {
+          if (error) {
+            // Non-blocking — user đã thấy success state; chỉ log dev.
+            if (process.env.NODE_ENV === 'development') {
+              console.warn('[SectionFeedback] supabase insert error:', error.message);
+            }
+          }
+        });
+    }
+
+    // Analytics event.
+    track('section_feedback_submitted', {
+      reading_id: readingId,
+      section_id: sectionId,
+      rating: payload.rating,
+      adjust: payload.adjust,
+    });
+
     setExisting(payload);
     setEditing(false);
     setJustSaved(true);
     setRating(null);
     setAdjust(undefined);
     setComment('');
     onSubmit?.(payload);
   }
```

### 2e. Schema của Supabase insert

Bảng `hieu_asia.reading_feedback` — nhưng khi gọi PostgREST qua anon key, client Supabase mặc định trỏ vào schema `public`. Cần **một trong hai**:

**Cách A (đơn giản hơn):** Tạo view public hoặc set schema trong Supabase client.

Hiện tại `getBrowserSupabase()` dùng options mặc định → schema = `public`. Có 2 lựa chọn:

- **Cách A:** Thêm `schema: 'hieu_asia'` vào `createClient` trong `supabase-client.ts` — nhưng đây là shared client dùng cho Realtime, cần review tác động.
- **Cách B (khuyến nghị, không đụng shared client):** Gọi `.schema('hieu_asia')` per-query:

```diff
-      supabase
-        .from('reading_feedback')
+      supabase
+        .schema('hieu_asia')
+        .from('reading_feedback')
```

> **Cách B an toàn hơn** vì không thay đổi schema mặc định của client dùng cho Realtime subscriptions.

---

## 3. Event mới — event-taxonomy.ts

File: `apps/web/src/lib/event-taxonomy.ts`

Thêm vào pillar `// ── Engagement ──` (sau `post_reading_feedback`):

```diff
   post_reading_feedback: {
     rating: "positive" | "unclear" | "detail";
     survey_id: string;
     reading_id: string;
     comment?: string;
   };
+
+  /**
+   * Đợt-1 UX Feedback Loop — fires khi user submit SectionFeedback widget
+   * (rating + optional adjust/comment per report section). Lưu cả Supabase
+   * lẫn PostHog để cross-reference aggregate vs session-level.
+   */
+  section_feedback_submitted: {
+    reading_id: string;
+    section_id: string;
+    rating: "accurate" | "partial" | "inaccurate";
+    adjust?: "deeper" | "practical" | "softer" | "examples";
+  };
```

---

## 4. Coordination

### 4a. Ai apply migration

- **Repo:** `hieu.asia/backend` (không phải worktree frontend này).
- **File cần tạo:** `infra/supabase/migrations/0053_reading_feedback.sql`
- **Apply:** Chạy `supabase db push` hoặc dùng Supabase MCP `apply_migration` vào project prod.
- **Verify:** Kiểm tra table tồn tại trong Supabase Studio + RLS policies đúng (anon INSERT, không có SELECT).

### 4b. Files frontend bị đụng

| File | Loại thay đổi | Ghi chú |
|------|--------------|---------|
| `apps/web/src/components/report/SectionFeedback.tsx` | Edit | Thêm prop `readingId`, import, Supabase insert, analytics call |
| `apps/web/src/lib/event-taxonomy.ts` | Edit | Thêm event `section_feedback_submitted` |
| `apps/web/src/lib/supabase-client.ts` | **KHÔNG đụng** | Dùng như hiện có, gọi `.schema('hieu_asia')` per-query |

### 4c. File shared với report route

- Các route `apps/web/src/app/reading/[id]/report/page.tsx` (hoặc tương tự) cần **pass `readingId` xuống SectionFeedback** khi render.
- Pattern: `<SectionFeedback sectionId="..." readingId={params.id} />`
- Cần review tất cả nơi dùng `<SectionFeedback` để thêm prop mới (TypeScript sẽ báo compile error nếu thiếu — dùng làm checklist).

### 4d. Dependency order

```
1. Backend: tạo + apply migration 0053 vào prod
2. Frontend: add event to event-taxonomy.ts
3. Frontend: wire SectionFeedback.tsx (import + prop + handleSubmit)
4. Frontend: update tất cả call sites thêm readingId prop
5. Deploy frontend
```

Bước 1 phải xong trước bước 5. Bước 2-4 có thể làm song song, nhưng bước 5 chỉ deploy sau khi bảng đã tồn tại trên prod (insert sẽ 400 nếu bảng chưa có, nhưng graceful no-op — không crash UI).

### 4e. Rollback

Không cần rollback phức tạp — code path Supabase insert là best-effort (`.then()` không được await, lỗi chỉ log dev). Nếu migration bị rollback, insert sẽ fail silently, localStorage vẫn hoạt động, UX không ảnh hưởng.

---

## 5. Checklist trước deploy

- [ ] Migration 0053 đã apply prod, table `hieu_asia.reading_feedback` visible trong Studio
- [ ] RLS policy `feedback_insert_anon`: anon INSERT = allowed, anon SELECT = blocked
- [ ] `section_feedback_submitted` có trong `event-taxonomy.ts`
- [ ] `SectionFeedback` nhận prop `readingId` — TypeScript build clean (0 errors)
- [ ] Tất cả call sites đã pass `readingId`
- [ ] Test thủ công: submit 1 feedback → kiểm tra row trong Studio + PostHog event
