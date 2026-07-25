#!/usr/bin/env node
/**
 * SEO metadata guard — vault 172.
 *
 * VÌ SAO CÓ FILE NÀY
 * Đợt SEO 2026-07-25 tìm ra ba lần hỏng, cả ba đều IM LẶNG — không có gì báo,
 * chỉ lộ khi có người tình cờ đo:
 *   1. 133 trang hiển thị mô tả cụt lửng trên SERP. `clampDescription` (#936)
 *      chặn được việc cắt gãy giữa chữ nhưng vẫn LẶNG LẼ cắt khi mẫu chữ quá
 *      dài — code trông "đã fix" trong khi Google vẫn thấy câu cụt.
 *   2. 79/79 trang của một cụm có <title> vượt ngưỡng, vì root layout nối thêm
 *      " · hieu.asia" (12 ký tự) mà không ai tính vào.
 *   3. Hai trang ĐÃ được rút chữ ở #942, có hẳn comment "SEO S7: rút gọn",
 *      mà vẫn vượt — vì #942 dùng mốc ~170 và đo chuỗi trong source thay vì đo
 *      <title> render ra. Sửa-mà-chưa-xong nguy hiểm hơn chưa-sửa.
 *
 * Nên guard này đo ĐÚNG THỨ GOOGLE THẤY: HTML tĩnh do `next build` sinh ra,
 * không đọc chuỗi trong source.
 *
 * DÙNG
 *   pnpm --filter web build && pnpm --filter web seo-guard
 *
 * Advisory theo thiết kế (giống ui-guard): chạy ở workflow riêng, chưa phải
 * required check. Muốn bắt buộc thì bật ở branch protection — đó là cài đặt
 * GitHub, không phải sửa file.
 *
 * Các hàm kiểm tra bên dưới là HÀM THUẦN (không I/O, không exit) để
 * `src/lib/seo-guard.test.ts` khoá được hành vi. Phần CLI ở cuối file chỉ chạy
 * khi file này được gọi trực tiếp.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { argv, exit } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

// ── Ngưỡng: MỘT nguồn duy nhất cho mọi agent ────────────────────────
// Trước đây mỗi đợt dùng một mốc khác nhau (~170 vs 160) nên có trang "đã sửa"
// mà vẫn hỏng. Từ nay chỉ có hai số này.
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;

/** Số trang tối thiểu phải đọc được. Dưới mức này = build lỗi/bị xoá, KHÔNG phải "site sạch". */
const MIN_PAGES = 200;

// ── Luật ────────────────────────────────────────────────────────────

/**
 * Kiểm một trang. Trả về mảng vi phạm (rỗng = đạt).
 * @param {{url: string, title: string|null, description: string|null}} page
 */
export function checkPage(page) {
  const out = [];
  const { title, description } = page;

  if (!title) {
    out.push({ rule: 'title-missing', detail: 'không có <title>' });
  } else if (title.length > TITLE_MAX) {
    out.push({
      rule: 'title-too-long',
      detail: `<title> ${title.length} ký tự (tối đa ${TITLE_MAX}) — "${title}"`,
    });
  }

  if (!description) {
    out.push({ rule: 'description-missing', detail: 'không có meta description' });
    return out;
  }
  if (description.length > DESCRIPTION_MAX) {
    out.push({
      rule: 'description-too-long',
      detail: `mô tả ${description.length} ký tự (tối đa ${DESCRIPTION_MAX})`,
    });
  }
  // Mô tả kết thúc bằng "…" nghĩa là clampDescription ĐÃ PHẢI CẮT — tức mẫu chữ
  // quá dài. Đây chính là lỗi làm 133 trang hiển thị câu cụt trên SERP mà không
  // ai biết: độ dài vẫn ≤160 nên mọi phép kiểm "chỉ đo độ dài" đều báo xanh.
  if (description.endsWith('…')) {
    out.push({
      rule: 'description-clamped',
      detail: `mô tả bị clampDescription cắt (kết thúc bằng "…") — rút mẫu chữ ngắn lại, đừng để clamp cắt`,
    });
  }
  return out;
}

/**
 * Khoá miễn trừ khớp URL không? Hỗ trợ 2 dạng:
 *   "/khai-truong"        → khớp đúng URL đó
 *   "/tarot/y-nghia/*"    → khớp mọi URL trong cụm (dùng cho route template)
 */
export function matchesPattern(pattern, url) {
  if (pattern.endsWith('/*')) return url.startsWith(pattern.slice(0, -1));
  return pattern === url;
}

/**
 * Lọc vi phạm qua danh sách miễn trừ.
 * @param {{url: string, rule: string, detail: string}[]} violations
 * @param {Record<string, {rules: string[], owner: string, note: string}>} allowlist
 */
export function applyAllowlist(violations, allowlist) {
  const blocking = [];
  const allowed = [];
  /** pattern::rule đã thực sự dùng tới — để phát hiện mục thừa. */
  const used = new Set();

  for (const v of violations) {
    let hit = null;
    for (const [pattern, entry] of Object.entries(allowlist)) {
      if (entry.rules.includes(v.rule) && matchesPattern(pattern, v.url)) {
        hit = pattern;
        break;
      }
    }
    if (hit) {
      allowed.push(v);
      used.add(`${hit}::${v.rule}`);
    } else {
      blocking.push(v);
    }
  }

  // Mục miễn trừ nào không còn vi phạm nữa = đã có người sửa → nên xoá, kẻo nó
  // âm thầm tắt kiểm tra cho trang đó và lần hỏng sau không ai bắt được.
  const stale = [];
  for (const [pattern, entry] of Object.entries(allowlist)) {
    for (const rule of entry.rules) {
      if (!used.has(`${pattern}::${rule}`)) stale.push({ url: pattern, rule });
    }
  }
  return { blocking, allowed, stale };
}

/** Rút <title> / meta description từ HTML. */
export function extractMeta(html) {
  const dec = (s) =>
    s
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;|&#39;/g, "'");
  const t = /<title>([^<]*)<\/title>/.exec(html);
  const d = /<meta name="description" content="([^"]*)"/.exec(html);
  return {
    title: t ? dec(t[1]) : null,
    description: d ? dec(d[1]) : null,
  };
}

// ── Danh sách miễn trừ ──────────────────────────────────────────────
// Đây KHÔNG phải chỗ giấu lỗi — nó là HÀNG CHỜ CÓ CHỦ. Mỗi mục ghi rõ ai lo và
// vì sao chưa sửa. Sửa xong thì XOÁ mục đó đi (guard sẽ nhắc nếu quên).
// Nguồn: vault 172 §4e.
//
// ⚠️ Danh sách này ứng với trạng thái SAU KHI #940, #944, #949 gộp. Nếu guard
// vào main trước ba PR đó thì nó sẽ báo đỏ đúng những trang ba PR kia đang sửa
// — đó là hành vi đúng, không phải lỗi guard. Guard nên gộp SAU CÙNG.
export const ALLOWLIST = {
  '/learn': {
    rules: ['description-too-long'],
    owner: 'agent /learn (PR #937)',
    note: 'mô tả 199 ký tự — cụm /learn đang có PR mở, để agent đó xử cùng đợt',
  },
  '/learn/*': {
    rules: ['description-too-long'],
    owner: 'agent /learn (PR #937)',
    note: 'bat-tu 192 · palm 218 · phong-thuy 232 · tu-vi 165. Cùng chủ với trên.',
  },
  '/tarot/y-nghia/*': {
    rules: ['description-clamped'],
    owner: 'Agent-2 (cụm tarot + gieo-que)',
    note: 'Ví dụ sống của cái bẫy ở đầu file: bản build trước 11 trang này mô tả 161–171 ký tự (quá dài); nay đã bọc clampDescription nên độ dài "đạt" — nhưng chữ vẫn nguyên độ dài cũ nên clamp phải cắt, và người dùng thấy câu cụt trên SERP. Bọc clamp KHÔNG phải là sửa; phải rút chữ.',
  },
  '/huong-ban-lam-viec': {
    rules: ['title-too-long', 'description-too-long'],
    owner: 'agent SEO sweep (cụm Bản mệnh + Phong thuỷ)',
    note: 'tiêu đề 62 · mô tả 176',
  },
  '/khai-truong': {
    rules: ['title-too-long', 'description-clamped'],
    owner: 'agent SEO sweep (cụm Bản mệnh + Phong thuỷ)',
    note: 'tiêu đề 63 · mô tả bị clamp cắt',
  },
  '/': {
    rules: ['description-too-long'],
    owner: 'founder / agent SEO sweep',
    note: 'trang chủ, mô tả 188 ký tự — không agent nào được tự sửa app/page.tsx',
  },
  // 5 trang dưới đây KHÔNG tự khai tiêu đề nên thừa hưởng tiêu đề MẶC ĐỊNH của
  // site trong `app/layout.tsx` — mà chuỗi đó dài 61 ký tự, TỰ NÓ đã vượt.
  // Sửa 1 dòng ở root là hết cả 5. Nhưng câu hỏi thật là: /auth/callback,
  // /connect-telegram, /dashboard là luồng riêng tư — có nên cho index không?
  '/affiliate/poster': {
    rules: ['title-too-long'],
    owner: 'agent SEO sweep (app/layout.tsx)',
    note: 'dùng tiêu đề mặc định của site (61 ký tự)',
  },
  '/auth/callback': {
    rules: ['title-too-long'],
    owner: 'agent SEO sweep (app/layout.tsx)',
    note: 'dùng tiêu đề mặc định; nên cân nhắc noindex thay vì rút tiêu đề',
  },
  '/connect-telegram': {
    rules: ['title-too-long'],
    owner: 'agent SEO sweep (app/layout.tsx)',
    note: 'dùng tiêu đề mặc định; nên cân nhắc noindex thay vì rút tiêu đề',
  },
  '/dashboard': {
    rules: ['title-too-long'],
    owner: 'agent SEO sweep (app/layout.tsx)',
    note: 'dùng tiêu đề mặc định; đã chặn ở robots.txt nhưng vẫn render tiêu đề đó',
  },
  '/onboarding-wizard': {
    rules: ['title-too-long'],
    owner: 'agent SEO sweep (app/layout.tsx)',
    note: 'dùng tiêu đề mặc định của site',
  },
};

// ── CLI ─────────────────────────────────────────────────────────────

function collectHtml(dir) {
  const out = [];
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) out.push(p);
    }
  };
  walk(dir);
  return out;
}

function main() {
  // Neo vào vị trí của chính file này, KHÔNG theo thư mục đang chạy — để
  // `pnpm --filter web seo-guard` (cwd = apps/web) và `node apps/web/scripts/
  // seo-guard.mjs` (cwd = gốc repo) đều ra cùng một đường dẫn.
  const here = dirname(fileURLToPath(import.meta.url));
  const appDir = argv[2] ?? resolve(here, '..', '.next', 'server', 'app');

  let files;
  try {
    files = collectHtml(appDir);
  } catch {
    console.error(`seo-guard: không đọc được "${appDir}".`);
    console.error('Chạy `pnpm --filter web build` trước rồi mới chạy guard.');
    console.error('LƯU Ý: `next dev` XOÁ kết quả của `next build` trong .next/.');
    exit(2);
  }

  // Chốt kiểm tra — bài học vault 172 §6: một script phân tích đọc 0 file mà
  // vẫn chạy trót lọt sẽ báo "không có vấn đề gì", y hệt như khi site thật sự
  // sạch. Thà dừng lại còn hơn báo xanh giả.
  if (files.length < MIN_PAGES) {
    console.error(
      `seo-guard: chỉ thấy ${files.length} trang HTML (cần tối thiểu ${MIN_PAGES}).`,
    );
    console.error('Build hỏng hoặc .next đã bị xoá — DỪNG, không kết luận gì.');
    exit(2);
  }

  const violations = [];
  for (const f of files) {
    const rel = relative(appDir, f).split(sep).join('/').replace(/\.html$/, '');
    const url = rel === 'index' ? '/' : `/${rel}`;
    const { title, description } = extractMeta(readFileSync(f, 'utf8'));
    for (const v of checkPage({ url, title, description })) violations.push({ url, ...v });
  }

  const { blocking, allowed, stale } = applyAllowlist(violations, ALLOWLIST);

  console.log(`seo-guard: đã kiểm ${files.length} trang tĩnh.`);
  console.log(`  ngưỡng: tiêu đề ≤${TITLE_MAX} · mô tả ≤${DESCRIPTION_MAX} · clamp không được cắt`);
  console.log(`  vi phạm mới: ${blocking.length} · miễn trừ (có chủ): ${allowed.length}`);

  if (stale.length) {
    console.log('');
    console.log(`⚠️  ${stale.length} mục miễn trừ ĐÃ HẾT vi phạm — xoá khỏi ALLOWLIST:`);
    for (const s of stale) console.log(`     ${s.url}  [${s.rule}]`);
    console.log('     (để lại thì trang đó không còn được kiểm, lần hỏng sau không ai bắt)');
  }

  if (!blocking.length) {
    console.log('\n✅ Không có vi phạm mới.');
    exit(0);
  }

  console.log('');
  console.log(`❌ ${blocking.length} vi phạm SEO mới:\n`);
  const byUrl = new Map();
  for (const v of blocking) {
    if (!byUrl.has(v.url)) byUrl.set(v.url, []);
    byUrl.get(v.url).push(v);
  }
  for (const [url, vs] of byUrl) {
    console.log(`  ${url}`);
    for (const v of vs) console.log(`     [${v.rule}] ${v.detail}`);
  }
  console.log('');
  console.log('Cách sửa (vault 172 §2, §3):');
  console.log('  · tiêu đề dài: dùng `title: { absolute: … }` để chặn hậu tố');
  console.log('    " · hieu.asia" (12 ký tự) mà root layout tự nối vào — thường');
  console.log('    không cần cắt chữ nào.');
  console.log('  · mô tả dài / bị clamp cắt: dồn từ khoá lên ĐẦU và chọn trường');
  console.log('    NGẮN cho phần biến, đừng nhét cả đoạn bách khoa vào.');
  console.log('  · nếu trang thuộc cụm agent khác: thêm vào ALLOWLIST kèm chủ + lý do.');
  exit(1);
}

if (import.meta.url === pathToFileURL(argv[1] ?? '').href) main();
