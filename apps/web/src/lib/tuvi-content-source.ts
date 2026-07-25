/**
 * Nguồn nội dung Tử Vi cho web: ĐỌC DB TRƯỚC, code làm DỰ PHÒNG.
 *
 * Bước 3/3 của CMS Tử Vi (bước 1 nạp DB từ code, bước 2 dựng màn hình sửa trong
 * admin). Sau bước này, founder sửa trong admin → web đổi, không cần deploy.
 *
 * ┌─ VÌ SAO KHÔNG "chuyển hẳn sang DB" ────────────────────────────────────────┐
 * │ Nội dung này là tài sản SEO chính (12 cung + 47 sao đã lên chỉ mục). Nếu   │
 * │ DB lỗi / API 502 / một trường bị xoá trắng khi sửa thì trang sẽ mỏng đi     │
 * │ hoặc trống — thiệt hại thật, khó phát hiện. Nên:                            │
 * │                                                                            │
 * │   kết quả = { ...bản trong CODE, ...các trường DB CÓ GIÁ TRỊ }              │
 * │                                                                            │
 * │ ⇒ Bảo đảm mạnh: **không bao giờ tệ hơn bản đang chạy**. DB chỉ có thể LÀM   │
 * │ TỐT HƠN (ghi đè trường founder vừa sửa), không thể làm rỗng.                │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * `generateStaticParams` của 2 trang vẫn lấy từ CODE (không phải từ đây): danh
 * sách route phải đầy đủ và ổn định lúc dựng, kể cả khi API sập.
 */
import {
  PALACES_CONTENT,
  ALL_STARS_CONTENT,
  type PalaceContent,
  type StarContent,
} from './tuvi-content';

/** ISR: web tự làm mới sau 5 phút → sửa trong admin hiện ra không cần deploy. */
export const TUVI_REVALIDATE_SECONDS = 300;

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://api.hieu.asia').replace(/\/+$/, '');

interface ApiRow {
  slug: string;
  title: string;
  data: Record<string, unknown> | null;
}

/** Rỗng = không ghi đè. Chuỗi trắng và mảng rỗng đều coi là rỗng. */
function hasValue(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.keys(v as object).length > 0;
  return true;
}

/** Chỉ giữ các khoá DB có giá trị → phần còn lại để bản code lấp. */
function overlay<T extends object>(base: T, row: ApiRow): T {
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row.data ?? {})) if (hasValue(v)) patch[k] = v;
  if (hasValue(row.title)) patch.name = row.title;
  return { ...base, ...patch } as T;
}

async function fetchRows(kind: 'palaces' | 'stars'): Promise<ApiRow[] | null> {
  try {
    const r = await fetch(`${API_BASE}/content/public/tuvi/${kind}`, {
      next: { revalidate: TUVI_REVALIDATE_SECONDS },
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { ok?: boolean; items?: ApiRow[] };
    return j.ok && Array.isArray(j.items) ? j.items : null;
  } catch {
    // Mạng lỗi / API sập → dùng bản code. KHÔNG throw: một trang nội dung
    // không được phép chết vì CMS.
    return null;
  }
}

/**
 * Trộn danh sách: giữ THỨ TỰ và ĐỘ PHỦ của bản code (SEO phụ thuộc vào đó),
 * chỉ ghi đè nội dung theo DB. Mục chỉ-có-trong-DB được thêm vào cuối.
 */
function merge<T extends { slug: string }>(codeList: readonly T[], rows: ApiRow[] | null): T[] {
  if (!rows || rows.length === 0) return [...codeList];
  const byslug = new Map(rows.map((r) => [r.slug, r]));
  const out = codeList.map((c) => {
    const row = byslug.get(c.slug);
    byslug.delete(c.slug);
    return row ? overlay(c, row) : c;
  });
  // Mục founder thêm sau này (chưa có trong code): chỉ nhận nếu có dữ liệu thật.
  for (const row of byslug.values()) {
    if (hasValue(row.title) && hasValue(row.data)) {
      out.push({ slug: row.slug, name: row.title, ...(row.data as object) } as unknown as T);
    }
  }
  return out;
}

export async function getPalaces(): Promise<PalaceContent[]> {
  return merge(PALACES_CONTENT, await fetchRows('palaces'));
}

export async function getStars(): Promise<StarContent[]> {
  return merge(ALL_STARS_CONTENT, await fetchRows('stars'));
}

export async function getPalace(slug: string): Promise<PalaceContent | undefined> {
  return (await getPalaces()).find((p) => p.slug === slug);
}

export async function getStar(slug: string): Promise<StarContent | undefined> {
  return (await getStars()).find((s) => s.slug === slug);
}
