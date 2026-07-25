// Internal link guard — chặn link nội bộ trỏ tới route không tồn tại.
//
// VÌ SAO
// Gõ nhầm một đường dẫn (`/tu-vi-thangg/...`, hoặc đổi tên thư mục route mà quên
// sửa chỗ link tới) KHÔNG làm build đỏ, KHÔNG làm test đỏ. Nó chỉ lộ ra khi có
// người bấm vào và thấy 404 — hoặc khi Google crawl phải và tiêu crawl budget
// vào trang chết. Đây là dạng lỗi im lặng, cùng họ với những lỗi mà
// `sitemap.guard.test.ts` và `seo-guard` sinh ra để chặn.
//
// Đo tại 2026-07-25: 861 file, 279 route, **144 href tĩnh + 38 tiền tố href ghép
// động → 0 link gãy**. Thêm test lúc chỉ số đang sạch là rẻ nhất: nó không chặn
// việc của ai, chỉ giữ nguyên trạng thái tốt sẵn có.
//
// VÌ SAO ĐO KIỂU NÀY TIN ĐƯỢC
// Trong cùng đợt, một phép đo "trang mồ côi" (đếm link TRỎ TỚI mỗi trang) đã cho
// kết quả sai và phải rút lại, vì regex bỏ sót link → trang có link vẫn bị báo là
// mồ côi. Ở đây bất đối xứng ngược lại: regex bỏ sót một href thì test chỉ **kiểm
// ít hơn**, chứ không thể tạo báo động giả. Nên phép đo này an toàn còn phép đo
// kia thì không. (Chi tiết: vault 172 §4b.)
//
// PHẠM VI: chỉ href là chuỗi TĨNH, và phần TĨNH của href ghép động
// (`href={`/cụm/${slug}`}` → kiểm `/cụm/`). Không thể kiểm giá trị runtime của
// `${slug}` — phần đó thuộc `generateStaticParams` của từng route.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SRC = join(process.cwd(), 'src');
const APP = join(SRC, 'app');

/** Mọi route của app router, đã bỏ route group `(nhóm)`. */
function routePaths(): string[] {
  const out: string[] = [];
  const walk = (dir: string, rel: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p, rel ? `${rel}/${e.name}` : e.name);
      else if (/^(page|route)\.tsx?$/.test(e.name)) out.push(rel);
    }
  };
  walk(APP, '');
  return [
    ...new Set(
      out.map((t) => {
        const segs = t.split('/').filter((s) => s && !/^\(.*\)$/.test(s));
        return `/${segs.join('/')}`;
      }),
    ),
  ];
}

/** Thoát MỌI ký tự đặc biệt của regex, không chỉ vài ký tự đoán trước. */
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Route → regex khớp URL thật (`[slug]` → một đoạn, `[...all]` → nhiều đoạn). */
function routeMatchers(routes: string[]): RegExp[] {
  return routes.map((r) => {
    const body = r
      .split('/')
      .filter(Boolean)
      .map((seg) => {
        if (/^\[\.\.\..+\]$/.test(seg)) return '.+';
        if (/^\[.+\]$/.test(seg)) return '[^/]+';
        return escapeRe(seg);
      })
      .join('/');
    return new RegExp(`^/${body}/?$`);
  });
}

function sourceFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        if (!/node_modules|\.next/.test(e.name)) walk(p);
      } else if (/\.tsx?$/.test(e.name) && !/\.(test|spec)\./.test(e.name)) {
        out.push(p);
      }
    }
  };
  walk(SRC);
  return out;
}

const rel = (f: string) => relative(SRC, f).split(sep).join('/');

const ROUTES = routePaths();
const MATCHERS = routeMatchers(ROUTES);
const FILES = sourceFiles();

// Chốt kiểm tra: một test đọc phải 0 file vẫn "xanh" thì trông y hệt như site
// sạch. Bài học vault 172 §6 — đã dính đúng lỗi này một lần trong đợt.
describe('điều kiện đo', () => {
  it('đọc được đủ route và đủ file source', () => {
    expect(ROUTES.length, 'route quá ít — đang đọc sai thư mục?').toBeGreaterThan(100);
    expect(FILES.length, 'file source quá ít — đang đọc sai thư mục?').toBeGreaterThan(300);
  });
});

describe('link nội bộ không được trỏ tới route không tồn tại', () => {
  it('href là chuỗi tĩnh đều khớp một route', () => {
    const bad: string[] = [];
    let count = 0;
    for (const f of FILES) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/href=(?:"|'|\{")(\/[a-z0-9\-/]*)(?:[#?][^"'`]*)?(?:"|'|"\})/gi)) {
        const href = (m[1] ?? '').replace(/\/$/, '') || '/';
        count++;
        if (!MATCHERS.some((r) => r.test(href))) bad.push(`${href}  (trong ${rel(f)})`);
      }
    }
    expect(count, 'không rút được href nào — regex hỏng, test đang không bảo vệ gì').toBeGreaterThan(50);
    expect(bad, `link trỏ tới route không tồn tại:\n  ${bad.join('\n  ')}`).toEqual([]);
  });

  it('phần tĩnh của href ghép động đều thuộc một cụm route có thật', () => {
    // `href={`/cụm/${slug}`}` — không kiểm được `${slug}`, nhưng gõ nhầm TÊN CỤM
    // là làm gãy toàn bộ link của cụm đó cùng lúc, nên riêng phần này đáng canh.
    const bad: string[] = [];
    let count = 0;
    for (const f of FILES) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/href=\{`(\/[a-z0-9\-/]*)\$\{/gi)) {
        const prefix = (m[1] ?? '').replace(/\/$/, '');
        count++;
        const ok = ROUTES.some((r) => r === prefix || r.startsWith(`${prefix}/`));
        if (!ok) bad.push(`${prefix}/…  (trong ${rel(f)})`);
      }
    }
    expect(count, 'không rút được href ghép động nào — regex hỏng').toBeGreaterThan(5);
    expect(bad, `tiền tố không thuộc cụm route nào:\n  ${bad.join('\n  ')}`).toEqual([]);
  });
});
