// Sitemap coverage guard — chặn việc sitemap âm thầm lệch khỏi thực tế.
//
// app/sitemap.ts liệt kê route tĩnh BẰNG TAY. Mỗi lần thêm một trang mới mà quên
// khai ở đó, trang biến mất khỏi sitemap và không ai biết — không có lỗi build,
// không có test đỏ. Đợt quét 975 URL trên production (tháng 7/2026) tìm ra 7 ca
// như vậy, gồm cả /mentor là trang được liên kết nội bộ nhiều thứ 2 toàn site.
//
// Test này khoá lại cả hai chiều, đúng loại lỗi Google Search Console báo:
//   1. Route tĩnh CHO INDEX phải có trong sitemap  → nếu thiếu: Google mất tín
//      hiệu ưu tiên crawl (bản chất 7 ca kể trên).
//   2. Route tĩnh đặt NOINDEX không được có trong sitemap → nếu có: GSC báo
//      "Submitted URL marked noindex" (tín hiệu tự đánh nhau).
//
// Chỉ xét route TĨNH (không có [param]): route động sinh từ dữ liệu, đã có
// generator riêng trong sitemap.ts nên không thuộc phạm vi kiểm ở đây.
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import sitemap from './sitemap';
import { GET as robotsGET } from './robots.txt/route';

const APP_DIR = join(process.cwd(), 'src/app');
const BASE_URL = 'https://hieu.asia';

/**
 * Route tĩnh CHO INDEX nhưng CỐ Ý không đưa vào sitemap.
 * Giữ rỗng. Chỉ thêm khi có lý do thật, kèm comment giải thích — mỗi dòng ở đây
 * là một trang Google sẽ khó tìm hơn.
 */
const INTENTIONALLY_ABSENT = new Set<string>([
  // Chỉ chuyển hướng: /dashboard trả 307 → /account. Không có nội dung riêng nên
  // đưa vào sitemap là gửi Google một URL chỉ để nó bị redirect.
  '/dashboard',
]);

/** Đọc `robots.index: false` trong một file metadata (page.tsx / layout.tsx). */
function declaresNoindex(file: string): boolean {
  if (!existsSync(file)) return false;
  return /robots:\s*\{[^}]*index:\s*false/.test(readFileSync(file, 'utf8'));
}

/** Liệt kê mọi route tĩnh có page.tsx, bỏ qua route động và thư mục đặc biệt. */
function listStaticRoutes(): string[] {
  const routes: string[] = [];
  const walk = (dir: string, urlPath: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const n = entry.name;
        // [param] = route động (ngoài phạm vi) · (group) = route group, không tạo
        // segment URL · _private / @parallel = không phải route công khai.
        if (n.startsWith('[') || n.startsWith('_') || n.startsWith('@')) continue;
        walk(join(dir, n), n.startsWith('(') ? urlPath : `${urlPath}/${n}`);
      } else if (entry.name === 'page.tsx') {
        routes.push(urlPath || '/');
      }
    }
  };
  walk(APP_DIR, '');
  return routes;
}

/** Route bị noindex nếu chính nó, hoặc BẤT KỲ layout tổ tiên nào, khai noindex. */
function isNoindex(route: string): boolean {
  let dir = APP_DIR;
  if (declaresNoindex(join(dir, 'layout.tsx'))) return true;
  for (const seg of route === '/' ? [] : route.slice(1).split('/')) {
    dir = join(dir, seg);
    if (declaresNoindex(join(dir, 'layout.tsx'))) return true;
  }
  return declaresNoindex(join(dir, 'page.tsx'));
}

describe('sitemap coverage', () => {
  it('mọi route tĩnh cho-index đều có trong sitemap', async () => {
    const entries = await sitemap();
    const inSitemap = new Set(
      entries.map((e) => new URL(e.url).pathname.replace(/\/$/, '') || '/'),
    );

    const missing = listStaticRoutes()
      .filter((r) => !isNoindex(r))
      .filter((r) => !inSitemap.has(r))
      .filter((r) => !INTENTIONALLY_ABSENT.has(r));

    // Thông báo chỉ rõ phải làm gì, để người sau không phải đọc lại test này.
    expect(
      missing,
      `Thiếu trong sitemap. Thêm vào app/sitemap.ts, HOẶC đặt robots.index:false ` +
        `nếu trang không nhắm tìm kiếm, HOẶC khai vào INTENTIONALLY_ABSENT kèm lý do:\n` +
        missing.map((r) => `  ${BASE_URL}${r}`).join('\n'),
    ).toEqual([]);
  });

  it('không có route noindex nào bị liệt kê trong sitemap', async () => {
    const entries = await sitemap();
    const staticRoutes = new Set(listStaticRoutes());

    const conflicting = [...new Set(entries.map((e) => new URL(e.url).pathname.replace(/\/$/, '') || '/'))]
      // chỉ xét route tĩnh — path động không map 1-1 sang file để đọc metadata
      .filter((p) => staticRoutes.has(p))
      .filter((p) => isNoindex(p));

    expect(
      conflicting,
      `Route đặt noindex nhưng vẫn nằm trong sitemap → Google Search Console sẽ ` +
        `báo "Submitted URL marked noindex". Bỏ khỏi app/sitemap.ts:\n` +
        conflicting.map((r) => `  ${BASE_URL}${r}`).join('\n'),
    ).toEqual([]);
  });
});

/**
 * robots.txt CHẶN trang mà sitemap lại NỘP cho Google — kiểu hỏng nặng nhất
 * trong SEO và im lặng nhất.
 *
 * Hai file này đều sửa TAY và KHÔNG có gì ràng buộc nhau: `robots.txt/route.ts`
 * giữ danh sách `DISALLOW`, `sitemap.ts` giữ danh sách URL. Thêm một dòng chặn
 * hơi rộng tay (ví dụ `/tu-vi` thay vì `/tu-vi/`) là giết sạch một cụm trăm
 * trang — trang vẫn chạy, vẫn có nội dung, chỉ là Google không được phép vào.
 * Search Console báo "Submitted URL blocked by robots.txt", nhưng phải có người
 * mở GSC ra xem mới biết.
 *
 * Đo 2026-07-25 trên production: 978 URL sitemap, 16 dòng Disallow, 0 xung đột.
 * Đáng chú ý `/reading` (trang sản phẩm, vừa được kéo hết mồ côi ở #954) KHÔNG
 * bị `Disallow: /reading/` chặn vì robots khớp theo TIỀN TỐ — `/reading` không
 * bắt đầu bằng `/reading/`. Quy tắc này chính xác nhưng mong manh: bỏ dấu `/`
 * cuối là trang sản phẩm biến mất khỏi Google.
 *
 * Đọc trên ĐẦU RA render (`GET()`), không đọc mảng trong source — cùng kỷ luật
 * với seo-guard: đo đúng thứ Google thấy.
 */
describe('robots.txt không được chặn trang đã nộp vào sitemap', () => {
  const BLANK_LINE = /\r?\n\s*\r?\n/;
  const WILDCARD_UA = /^User-Agent:\s*\*/m;

  async function disallowForWildcard(): Promise<string[]> {
    const body = await robotsGET().text();
    // Nhóm đầu tiên là `User-Agent: *`; các nhóm cách nhau bằng dòng trống.
    const group = body.split(BLANK_LINE).find((g) => WILDCARD_UA.test(g));
    expect(group, 'robots.txt không còn nhóm "User-Agent: *" — kiểm tra lại route').toBeTruthy();
    return (group ?? '')
      .split('\n')
      .filter((l) => l.toLowerCase().startsWith('disallow:'))
      .map((l) => l.slice(l.indexOf(':') + 1).trim())
      .filter(Boolean);
  }

  it('không URL nào trong sitemap khớp một dòng Disallow', async () => {
    const disallow = await disallowForWildcard();
    // Chốt kiểm tra: đọc được 0 dòng chặn nghĩa là parse hỏng, KHÔNG phải "sạch".
    expect(
      disallow.length,
      'không đọc được dòng Disallow nào — parse hỏng, đừng kết luận là sạch',
    ).toBeGreaterThan(0);

    const entries = await sitemap();
    expect(entries.length, 'sitemap rỗng — đừng kết luận là sạch').toBeGreaterThan(100);

    const blocked = entries
      .map((e) => e.url.replace(BASE_URL, '') || '/')
      .flatMap((path) => {
        const hit = disallow.find((d) => path.startsWith(d));
        return hit ? [`${path}  <- bị chặn bởi "Disallow: ${hit}"`] : [];
      });

    expect(
      blocked,
      'Trang vừa nộp cho Google (sitemap) vừa bị robots.txt chặn -> Search Console ' +
        'báo "Submitted URL blocked by robots.txt" và trang KHÔNG BAO GIỜ được index. ' +
        'Sửa: bỏ URL khỏi app/sitemap.ts, HOẶC thu hẹp dòng Disallow trong ' +
        'app/robots.txt/route.ts (thường là thiếu dấu "/" cuối): ' +
        blocked.join(' | '),
    ).toEqual([]);
  });

  it('robots.txt vẫn khai Sitemap: và cho phép crawl gốc', async () => {
    const body = await robotsGET().text();
    expect(body, 'thiếu dòng "Sitemap:" — Google phải tự dò tìm').toContain(
      `Sitemap: ${BASE_URL}/sitemap.xml`,
    );
    const group = body.split(BLANK_LINE).find((g) => WILDCARD_UA.test(g)) ?? '';
    expect(group, 'thiếu "Allow: /" cho User-Agent: *').toMatch(/^Allow:\s*\/$/m);
    expect(group, 'CÓ "Disallow: /" trong nhóm User-Agent: * -> chặn TOÀN BỘ site').not.toMatch(
      /^Disallow:\s*\/$/m,
    );
  });
});
