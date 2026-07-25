// Tiến độ học /learn — đọc/ghi phía client, nguồn dữ liệu là localStorage.
//
// Nguồn sự thật gốc là bảng "Bạn đã thật sự hiểu chưa?" (UnderstandingChecklist):
// nó đã lưu map tick vào `learn:understanding:<slug>` từ trước. Lớp này thêm một
// KHÓA TÓM TẮT `learn:summary:<slug>` = {done, total, ts} do checklist ghi mỗi
// lần mount/tick — để hub đọc tiến độ MỌI chủ đề mà không cần biết tổng số dòng
// checklist của từng bài (tổng nằm trong từng trang, hub không import được).
//
// Dữ liệu cũ (người đã tick trước khi có summary): fallback đếm map tick,
// total = 0 nghĩa là "không rõ tổng" — hub hiển thị dạng "đã tick n mục".
//
// Mọi hàm đọc/ghi storage đều guard `typeof window` + try/catch nuốt lỗi
// (private mode, quota...) — KHÔNG bao giờ được vỡ UI. Các hàm thuần (parse/
// state) tách riêng để test được trong vitest env node.

export interface TopicSummary {
  /** số khía cạnh đã tick "tự tin giải thích". */
  done: number;
  /** tổng số khía cạnh của bài; 0 = không rõ (dữ liệu cũ, suy từ map tick). */
  total: number;
  /** thời điểm ghi (Date.now()). */
  ts: number;
}

export type TopicState = 'none' | 'in-progress' | 'confident';

export interface LastVisited {
  slug: string;
  ts: number;
}

export const understandingKey = (slug: string) => `learn:understanding:${slug}`;
export const summaryKey = (slug: string) => `learn:summary:${slug}`;
export const LAST_VISITED_KEY = 'learn:last-visited';

/** Parse JSON của khóa summary; sai định dạng → null (không throw). */
export function parseSummary(raw: string | null): TopicSummary | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (typeof v !== 'object' || v === null) return null;
    const { done, total, ts } = v as Record<string, unknown>;
    if (typeof done !== 'number' || !Number.isFinite(done) || done < 0) return null;
    if (typeof total !== 'number' || !Number.isFinite(total) || total < 0) return null;
    const time = typeof ts === 'number' && Number.isFinite(ts) ? ts : 0;
    const d = Math.floor(done);
    const t = Math.floor(total);
    // Kẹp done ≤ total: writer hiện tại không bao giờ ghi vượt, nhưng dữ liệu bị
    // sửa tay trong localStorage sẽ khiến hub hiện "8/6" và thanh tiến độ tràn.
    return { done: t > 0 ? Math.min(d, t) : d, total: t, ts: time };
  } catch {
    return null;
  }
}

/**
 * Suy summary từ map tick cũ `learn:understanding:<slug>` (Record<string,
 * boolean>). Không rõ tổng số dòng → total = 0. Map rỗng/không tick gì → null
 * (coi như chưa học, khỏi phân biệt với "chưa từng mở").
 */
export function summaryFromChecklistRaw(raw: string | null): TopicSummary | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (typeof v !== 'object' || v === null || Array.isArray(v)) return null;
    const done = Object.values(v as Record<string, unknown>).filter((x) => x === true).length;
    return done > 0 ? { done, total: 0, ts: 0 } : null;
  } catch {
    return null;
  }
}

/** Trạng thái hiển thị của một chủ đề, suy từ summary. */
export function stateOf(s: TopicSummary | null): TopicState {
  if (!s || s.done <= 0) return 'none';
  if (s.total > 0 && s.done >= s.total) return 'confident';
  return 'in-progress';
}

/** Parse JSON khóa "bài học gần nhất". */
export function parseLastVisited(raw: string | null): LastVisited | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (typeof v !== 'object' || v === null) return null;
    const { slug, ts } = v as Record<string, unknown>;
    if (typeof slug !== 'string' || slug.length === 0) return null;
    return { slug, ts: typeof ts === 'number' && Number.isFinite(ts) ? ts : 0 };
  } catch {
    return null;
  }
}

// ── wrappers localStorage (chỉ gọi sau mount / trong event handler) ──

function readItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore: private mode / quota — tiến độ chỉ là tiện ích, không được vỡ UI */
  }
}

/** Tiến độ một chủ đề: ưu tiên khóa summary, fallback map tick cũ. */
export function readTopicSummary(slug: string): TopicSummary | null {
  return (
    parseSummary(readItem(summaryKey(slug))) ??
    summaryFromChecklistRaw(readItem(understandingKey(slug)))
  );
}

/** Checklist gọi mỗi lần mount/tick để hub đọc được tiến độ. */
export function writeTopicSummary(slug: string, done: number, total: number): void {
  const summary: TopicSummary = { done, total, ts: Date.now() };
  writeItem(summaryKey(slug), JSON.stringify(summary));
}

export function readLastVisited(): LastVisited | null {
  return parseLastVisited(readItem(LAST_VISITED_KEY));
}

export function writeLastVisited(slug: string): void {
  const v: LastVisited = { slug, ts: Date.now() };
  writeItem(LAST_VISITED_KEY, JSON.stringify(v));
}
