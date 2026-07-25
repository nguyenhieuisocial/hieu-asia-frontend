// Layout schema guard — khoá lại lỗi đã sửa ở #939 / #941 / #945.
//
// LỖI GỐC: schema (JSON-LD) của MỘT trang cụ thể được đặt trong layout.tsx.
// Layout của Next.js bọc mọi route con, nên mọi trang con phát kèm luôn schema
// của trang cha → trang con có 2 WebPage (một trỏ sai url về trang cha) và 2
// BreadcrumbList (một bị cắt ngắn). Google thấy hai khai báo mâu thuẫn trên cùng
// một URL và không biết tin cái nào.
//
// Đợt tháng 7/2026 lỗi này đang có mặt ở ~163 trang thuộc 4 cụm (tarot,
// gieo-que, than-so-hoc, account) và KHÔNG có gì phát hiện: không lỗi build,
// không test đỏ. Chỉ lộ ra khi có người đọc JSON-LD trên trang thật.
//
// PHÂN BIỆT QUAN TRỌNG:
//   · JSON-LD của một trang  → thuộc page.tsx  (layout là SAI)
//   · robots / noindex       → thuộc layout    (chính sách theo nhánh route)
//   · siteGraph() ở layout gốc → ĐÚNG: Organization + WebSite là site-wide
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const APP_DIR = join(process.cwd(), 'src/app');

/** Các @type chỉ mô tả MỘT trang cụ thể → không được đặt ở layout dùng chung. */
const PAGE_SCOPED_TYPES = [
  'WebPage', 'BreadcrumbList', 'SoftwareApplication', 'Article', 'TechArticle',
  'Product', 'FAQPage', 'ItemList', 'Course', 'Service', 'HowTo',
];
/** Builder tương ứng trong lib/seo/jsonld — bắt cả cách khai qua builder. */
const PAGE_SCOPED_BUILDERS = ['webPage', 'breadcrumb', 'faqPage', 'article', 'product', 'itemList', 'course'];

const TYPE_RE = new RegExp(`['"]@type['"]\\s*:\\s*['"](${PAGE_SCOPED_TYPES.join('|')})['"]`);
const BUILDER_RE = new RegExp(`\\b(${PAGE_SCOPED_BUILDERS.join('|')})\\s*\\(`);

/**
 * Layout GỐC (src/app/layout.tsx) được miễn: nó phát siteGraph() = Organization
 * + WebSite, hai node site-wide đúng ra phải xuất hiện trên mọi trang.
 */
const ROOT_LAYOUT = join(APP_DIR, 'layout.tsx');

/**
 * NỢ ĐÃ BIẾT — layout là route LÁ (chưa có route con) nhưng vẫn giữ schema của
 * trang trong layout. Hiện KHÔNG gây trùng vì không có con để rớt xuống, nên cố
 * ý không sửa (tránh diff vô ích). Nhưng chúng là mầm: thêm một route con là
 * lỗi tái hiện ngay — và test "không rò rỉ" bên dưới sẽ bắt được.
 *
 * Danh sách này bị ĐÓNG BĂNG: thêm mới sẽ làm test đỏ. Khi sửa một mục, xoá nó
 * khỏi đây.
 */
const KNOWN_LEAF_DEBT = new Set<string>([
  '/big-five',
  '/can-xuong',
  '/disc',
  '/enneagram',
  '/thuoc-lo-ban',
  '/tinh-menh-cuc',
  '/tu-kiem',
  '/xem-tuong',
]);

interface LayoutInfo { route: string; file: string; childRoutes: string[] }

/** Mọi layout.tsx có phát schema của-một-trang, kèm danh sách route con của nó. */
function layoutsEmittingPageSchema(): LayoutInfo[] {
  const found: LayoutInfo[] = [];
  const walk = (dir: string, urlPath: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const n = entry.name;
        if (n.startsWith('@') || n.startsWith('_')) continue;
        // (group) không tạo segment URL; [param] vẫn là route con thật.
        walk(join(dir, n), n.startsWith('(') ? urlPath : `${urlPath}/${n}`);
      }
    }
    const file = join(dir, 'layout.tsx');
    if (!existsSync(file) || file === ROOT_LAYOUT) return;
    const src = readFileSync(file, 'utf8');
    if (!TYPE_RE.test(src) && !BUILDER_RE.test(src)) return;
    found.push({ route: urlPath || '/', file, childRoutes: childRoutesUnder(dir) });
  };
  walk(APP_DIR, '');
  return found;
}

/** Thư mục con nào (bất kỳ độ sâu) có page.tsx → route đó thừa hưởng layout này. */
function childRoutesUnder(dir: string): string[] {
  const out: string[] = [];
  const scan = (d: string, rel: string) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith('@') || entry.name.startsWith('_')) continue;
      const sub = join(d, entry.name);
      const subRel = `${rel}/${entry.name}`;
      if (existsSync(join(sub, 'page.tsx'))) out.push(subRel);
      scan(sub, subRel);
    }
  };
  scan(dir, '');
  return out;
}

describe('layout không được giữ schema của một trang', () => {
  it('không layout nào vừa phát schema-của-trang vừa có route con (rò rỉ xuống con)', () => {
    const leaking = layoutsEmittingPageSchema()
      .filter((l) => l.childRoutes.length > 0)
      .map((l) => `${l.route}  → rớt xuống ${l.childRoutes.length} route con: ${l.childRoutes.slice(0, 4).join(', ')}`);

    expect(
      leaking,
      'Schema của MỘT trang đang nằm trong layout có route con → mọi trang con sẽ ' +
        'phát kèm, sinh 2 WebPage + 2 BreadcrumbList trên cùng một URL.\n' +
        'Cách sửa: chuyển JSON-LD sang page.tsx của chính trang cha; layout chỉ giữ ' +
        'metadata (title/description/robots).\n' +
        'Tiền lệ: PR #939 (tarot, gieo-que), #941 (than-so-hoc).\n\n' +
        leaking.map((s) => `  ${s}`).join('\n'),
    ).toEqual([]);
  });

  it('không phát sinh layout-giữ-schema mới ngoài danh sách nợ đã biết', () => {
    const current = layoutsEmittingPageSchema().map((l) => l.route).sort();
    const unexpected = current.filter((r) => !KNOWN_LEAF_DEBT.has(r));
    const fixed = [...KNOWN_LEAF_DEBT].filter((r) => !current.includes(r)).sort();

    expect(
      unexpected,
      'Layout MỚI giữ schema của một trang. Đặt JSON-LD trong page.tsx thay vì ' +
        'layout.tsx — kể cả khi hiện chưa có route con, vì thêm con là lỗi tái hiện:\n' +
        unexpected.map((s) => `  ${s}`).join('\n'),
    ).toEqual([]);

    // Sửa xong một mục thì phải xoá khỏi KNOWN_LEAF_DEBT, để danh sách không nói dối.
    expect(
      fixed,
      'Các route này đã được sửa (không còn giữ schema ở layout) — xoá khỏi ' +
        'KNOWN_LEAF_DEBT trong file test này:\n' + fixed.map((s) => `  ${s}`).join('\n'),
    ).toEqual([]);
  });
});
