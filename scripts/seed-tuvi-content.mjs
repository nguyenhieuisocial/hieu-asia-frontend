#!/usr/bin/env node
/**
 * seed-tuvi-content — đồng bộ nội dung Tử Vi từ CODE sang DB (`hieu_asia.tuvi_content`).
 *
 * VÌ SAO CẦN (đo 2026-07-25):
 *   Bảng `tuvi_content` + API worker (`/content/public/tuvi/...`) đã LIVE từ 29/05,
 *   nhưng nội dung trong đó **mỏng hơn code rất nhiều** vì đợt nâng cấp bách khoa
 *   tháng 7 chỉ sửa file code, không đẩy sang DB:
 *
 *              | DB (29/05)        | code (hôm nay)
 *     sao      | 24 mục · ~420 ký tự | **47 mục · ~2.860 ký tự**
 *     cung     | 12 mục · ~1.050    | 12 mục · ~2.660
 *
 *   ⇒ Nối `/tu-vi/*` vào DB TRƯỚC khi nạp sẽ **mất 23 trang sao** và làm nội dung
 *   còn lại mỏng đi 2,5–7 lần. Phải nạp trước, nối sau.
 *
 * ÁNH XẠ (khớp 1:1 schema có sẵn — KHÔNG đổi DDL):
 *   slug            -> cột `slug`   (khoá on-conflict)
 *   name            -> cột `title`
 *   các trường còn lại -> cột `data` (jsonb)
 *   thứ tự trong mảng  -> `sort_order`
 *
 * DÙNG:
 *   node scripts/seed-tuvi-content.mjs --check   # chỉ in số đếm, không sinh SQL
 *   node scripts/seed-tuvi-content.mjs           # in SQL upsert ra stdout
 *   node scripts/seed-tuvi-content.mjs | psql "$SUPABASE_DB_URL"
 *
 * Chạy qua CI: workflow `seed-tuvi-content.yml` (bấm tay, mặc định dry-run) —
 * secret `SUPABASE_DB_URL` nằm ở phía CI, không ai phải giữ khoá cục bộ.
 *
 * IDEMPOTENT: chạy bao nhiêu lần cũng cho cùng kết quả (upsert theo slug).
 * KHÔNG xoá dòng nào — mục nào có trong DB mà không có trong code thì giữ nguyên
 * (cố ý: tránh mất dữ liệu founder tự thêm sau này qua trang quản trị).
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'apps/web/src/lib/tuvi-content.ts');

/** esbuild đã là dependency của repo (next/vitest) — dùng để nạp file .ts. */
function loadEsbuild() {
  for (const p of ['esbuild', join(ROOT, 'node_modules/esbuild'), join(ROOT, 'apps/web/node_modules/esbuild')]) {
    try {
      return require(p);
    } catch {
      /* thử đường dẫn kế tiếp */
    }
  }
  throw new Error('không tìm thấy esbuild — chạy `pnpm install` trước');
}

function loadContent() {
  const esbuild = loadEsbuild();
  const js = esbuild.transformSync(readFileSync(SRC, 'utf8'), {
    loader: 'ts',
    format: 'cjs',
    target: 'node18',
  }).code;
  // Nạp module đã transpile. Đầu vào là file nguồn CỦA CHÍNH REPO (không phải dữ
  // liệu ngoài) nên không có bề mặt injection; đây là cách gọn nhất để dùng đúng
  // một nguồn sự thật thay vì chép nội dung ra chỗ thứ hai.
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', js)(mod, mod.exports, require);
  const { PALACES_CONTENT, ALL_STARS_CONTENT } = mod.exports;
  if (!Array.isArray(PALACES_CONTENT) || !Array.isArray(ALL_STARS_CONTENT)) {
    throw new Error('tuvi-content.ts không export PALACES_CONTENT / ALL_STARS_CONTENT');
  }
  return { PALACES_CONTENT, ALL_STARS_CONTENT };
}

function buildRows({ PALACES_CONTENT, ALL_STARS_CONTENT }) {
  const rows = [];
  PALACES_CONTENT.forEach(({ slug, name, ...data }, i) =>
    rows.push({ slug, kind: 'palace', title: name, data, sort_order: i + 1 }),
  );
  ALL_STARS_CONTENT.forEach(({ slug, name, ...data }, i) =>
    rows.push({ slug, kind: 'star', title: name, data, sort_order: i + 1 }),
  );

  const seen = new Set();
  for (const r of rows) {
    if (!r.slug || !r.title) throw new Error(`mục thiếu slug/name: ${JSON.stringify(r).slice(0, 80)}`);
    if (seen.has(r.slug)) throw new Error(`trùng slug: ${r.slug} (slug là khoá on-conflict)`);
    seen.add(r.slug);
  }
  return rows;
}

/** Dollar-quoting: văn bản tiếng Việt đầy dấu nháy đơn — escape tay là mời lỗi. */
const TAG = '$hieuseed$';
function lit(s) {
  if (String(s).includes(TAG)) throw new Error('nội dung chứa dấu ngăn cách SQL — đổi TAG');
  return `${TAG}${s}${TAG}`;
}

function toSql(rows, batch = 8) {
  const out = [
    '-- SINH TỰ ĐỘNG bởi scripts/seed-tuvi-content.mjs — ĐỪNG sửa tay.',
    '-- Nguồn sự thật: apps/web/src/lib/tuvi-content.ts',
    'begin;',
  ];
  for (let i = 0; i < rows.length; i += batch) {
    const values = rows
      .slice(i, i + batch)
      .map(
        (r) =>
          `  (${lit(r.slug)}, ${lit(r.kind)}, ${lit(r.title)}, ${lit(JSON.stringify(r.data))}::jsonb, ${r.sort_order}, now())`,
      )
      .join(',\n');
    out.push(
      'insert into hieu_asia.tuvi_content (slug, kind, title, data, sort_order, updated_at)',
      'values',
      values,
      'on conflict (slug) do update set',
      '  kind = excluded.kind,',
      '  title = excluded.title,',
      '  data = excluded.data,',
      '  sort_order = excluded.sort_order,',
      '  updated_at = now();',
      '',
    );
  }
  out.push('commit;');
  return out.join('\n');
}

const rows = buildRows(loadContent());
const palaces = rows.filter((r) => r.kind === 'palace').length;
const stars = rows.filter((r) => r.kind === 'star').length;
const avg = Math.round(rows.reduce((s, r) => s + JSON.stringify(r.data).length, 0) / rows.length);

if (process.argv.includes('--check')) {
  console.log(`cung=${palaces} sao=${stars} tổng=${rows.length} · data trung bình ${avg} ký tự`);
  process.exit(0);
}

process.stderr.write(`[seed-tuvi-content] cung=${palaces} sao=${stars} tổng=${rows.length} (data tb ${avg} ký tự)\n`);
process.stdout.write(toSql(rows));
