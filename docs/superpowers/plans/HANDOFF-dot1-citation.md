# HANDOFF Đợt-1 — Citation UI

**Mục tiêu:** Surface citation metadata (nguồn RAG corpus) trong báo cáo để tăng tin cậy và minh bạch. Component `CitationBar` đã tạo sẵn. Phần này spec các bước còn lại để wire đầu cuối.

---

## 1. Ba loại nhãn citation

| Tier | Similarity threshold | Nhãn hiển thị | Ý nghĩa |
|------|---------------------|----------------|---------|
| `classical` | >= 0.78 | Cổ thư | Trích dẫn trực tiếp từ cổ thư Tử Vi / Bát Tự với độ tương đồng cao |
| `methodology` | >= 0.55 | Phương pháp luận hieu.asia | Framework / cách diễn giải riêng của hieu.asia (corpus nội bộ) |
| `inference` | < 0.55 | AI suy luận | LLM dùng kiến thức tổng quan, không khớp mạnh với corpus — cần đọc phê phán hơn |

Logic nằm trong `CitationBar.tsx` — `getTier(similarity)`. Không cần thay đổi ở đây trừ khi tuning ngưỡng.

---

## 2. Persist citations — migration SQL

### 2a. Thêm cột `report_citations` vào bảng `readings`

```sql
-- Migration: add report_citations column
ALTER TABLE readings
  ADD COLUMN IF NOT EXISTS report_citations JSONB;

COMMENT ON COLUMN readings.report_citations IS
  'Array of CitationItem per section, keyed by section slug.
   Shape: { [sectionSlug: string]: { source: string; chapter: string | null; similarity: number }[] }
   Populated after synthesize node completes. NULL = graph predates citation feature.';
```

### 2b. Index để query (optional, only if admin needs to filter by source)

```sql
CREATE INDEX IF NOT EXISTS idx_readings_report_citations_gin
  ON readings USING GIN (report_citations);
```

### 2c. Shape của `report_citations`

```typescript
// Một entry per section slug (matching slugifySectionId từ report/page.tsx)
type ReportCitations = {
  [sectionSlug: string]: Array<{
    source: string;
    chapter: string | null;
    similarity: number;
  }>;
};
```

Ví dụ row:

```json
{
  "menh": [
    { "source": "Tử Vi Đẩu Số Toàn Thư", "chapter": "Quyển 1", "similarity": 0.83 },
    { "source": "hieu.asia methodology", "chapter": null, "similarity": 0.61 }
  ],
  "quan-loc": [
    { "source": "Bát Tự Cơ Bản", "chapter": null, "similarity": 0.47 }
  ]
}
```

---

## 3. Persist citations từ graph → Supabase

### 3a. Nơi thay đổi: `synthesize` node trong `tu-vi-graph.ts`

Sau khi `synthesis` hoàn thành, thu thập citations từ `state.palaces` và lưu vào `readings`.

```typescript
// Thêm sau dòng return { synthesis: ... } — HOẶC trong wrapper function gọi graph
// KHÔNG sửa GraphState vì citations là side-effect, không cần trong state

async function persistCitations(runId: string, palaces: PalaceAnalysis[]): Promise<void> {
  const supabase = getServiceRoleClient();
  const citationMap: Record<string, CitationItem[]> = {};

  for (const p of palaces) {
    if (!p.context?.length) continue;
    const slug = slugifySectionId(`cung ${p.palace}`); // dùng cùng logic với report page
    citationMap[slug] = p.context.map(c => ({
      source: c.source,
      chapter: c.chapter,
      similarity: c.similarity,
    }));
  }

  if (!Object.keys(citationMap).length) return;

  // runId ở đây là agent_runs.id; cần join sang readings hoặc lưu thẳng reading_id
  // Option A (nếu runId = reading_id): thẳng update readings
  // Option B (nếu runId = agent_runs.id): join agent_runs -> readings
  await supabase
    .from('readings')
    .update({ report_citations: citationMap })
    .eq('id', runId); // điều chỉnh field name nếu dùng Option B
}
```

**Blast radius của thay đổi này:** `tu-vi-graph.ts` là HIGH (xem mục 5). Implement trong function riêng, fire-and-forget (void, không await trong graph). Tương tự pattern `incrementCost`.

### 3b. Tương tự cho `bat-tu-graph.ts`

Nếu `bat-tu-graph.ts` có node `analyze_palace` với `context: CorpusChunk[]`, áp dụng cùng pattern. Kiểm tra trước khi sửa.

---

## 4. Surface `CitationBar` trong report route

### 4a. Đọc `report_citations` từ Reading type

Kiểm tra `@hieu-asia/types/database.types` xem `report_citations` đã có sau migration chưa:
- Nếu chưa: chạy `supabase gen types` sau migration để regenerate.
- Thêm vào `Reading` interface trong `api-client` nếu cần.

### 4b. Truyền citations xuống `ReportSections`

Trong `report/page.tsx`, sau khi có `session.report_citations`, pass vào `ReportSections`:

```tsx
// Trong ReportContent, lấy citations từ session
const reportCitations = (session?.report_citations as ReportCitations | null) ?? null;

// Truyền xuống
<ReportSections sections={reportSections} citations={reportCitations} />
```

### 4c. Chèn `<CitationBar>` trong mỗi tab

Trong `ReportSections`, tại nơi build `content` cho mỗi `ProductTab`:

```tsx
import { CitationBar } from '@/components/report/CitationBar';

// Trong tab content builder:
const sectionSlug = slugifySectionId(s.title);
const sectionCitations = citations?.[sectionSlug] ?? [];

content: (
  <div className="space-y-4">
    <SectionBody content={s.body} />
    <CitationBar citations={sectionCitations} />
    <SectionFeedback sectionId={sectionId} />
  </div>
)
```

**Thứ tự render đề xuất:** `SectionBody` → `CitationBar` → `SectionFeedback`. CitationBar nằm giữa content và feedback widget để user đọc xong mới thấy nguồn trước khi đánh giá.

---

## 5. Blast radius — file shared + điểm rủi ro cao

### HIGH (cần coord + test kỹ trước merge)

| File | Lý do HIGH |
|------|-----------|
| `src/lib/reasoning/tu-vi-graph.ts` | 12 palace parallel nodes, cost telemetry, brand-voice retry. Bất kỳ thay đổi nào ảnh hưởng toàn bộ Tử Vi reading flow. |
| `src/lib/reasoning/bat-tu-graph.ts` | Tương tự — 8 trụ parallel. Chưa đọc file nhưng cấu trúc tương đồng theo naming convention. |

**Quy tắc phối hợp cho HIGH files:**
- Chỉ thêm function mới, không sửa existing nodes.
- `persistCitations` phải là fire-and-forget (void, không throw, không block synthesis return).
- Chạy smoke test full reading trước merge: kiểm tra cost telemetry vẫn đúng, synthesis vẫn trả về.
- Nếu có agent khác đang chạm hai file này → dùng `git fetch + detect_changes` trước (xem Memory: multi-agent concurrent).

### MEDIUM

| File | Lý do |
|------|-------|
| `src/app/reading/[id]/report/page.tsx` | Report page đang có nhiều feature waves. Chèn `<CitationBar>` chỉ cần thêm prop + import; không sửa logic parse/tab/scroll. |
| `@hieu-asia/types/database.types` | Auto-generated — chỉ regenerate sau migration, không sửa tay. |

### LOW / AN TOÀN

| File | Lý do |
|------|-------|
| `src/components/report/CitationBar.tsx` | File mới, zero dependency ngược. |
| `src/lib/reasoning/rag.ts` | Chỉ đọc `CorpusChunk` type — không thay đổi. |

---

## 6. Checklist triển khai

- [ ] **Migration:** chạy SQL migration (`ALTER TABLE readings ADD COLUMN report_citations JSONB`)
- [ ] **Regenerate types:** `pnpm supabase gen types` → commit `database.types.ts`
- [ ] **Update `Reading` type** trong `api-client` nếu cần thêm `report_citations`
- [ ] **`tu-vi-graph.ts`:** thêm `persistCitations` fire-and-forget sau synthesis (COORD required)
- [ ] **`bat-tu-graph.ts`:** kiểm tra structure + thêm tương tự nếu applicable (COORD required)
- [ ] **`report/page.tsx`:** pass `citations` prop xuống `ReportSections`
- [ ] **`ReportSections`:** chèn `<CitationBar citations={sectionCitations} />` mỗi section
- [ ] **Smoke test:** tạo một reading Tử Vi mới → xem `report_citations` trong DB → xem CitationBar render đúng nhãn
- [ ] **Edge case:** reading cũ (null citations) → CitationBar render null, không lỗi ✓ (đã xử lý trong component)
