// UI overhaul (note 167 §B/§II/§U) — bộ đo "trước/sau" cho bundle-size trang.
// Chạy: node scripts/ui-metrics/capture-bundle-baseline.mjs [origin]
// Mặc định đo prod (https://hieu.asia). In JSON ra stdout — pipe vào _metrics/…json.
//
// Đo mỗi trang: HTML bytes · số JS chunk trong HTML + tổng bytes · tổng CSS bytes.
// KHÔNG cần deps (dùng fetch built-in của Node 18+). Dùng để so trước↔sau ở bước
// S20 (perf) — §II.3 yêu cầu S1 lưu mốc bundle-size, nếu không cổng S20 thiếu mốc.

const ORIGIN = process.argv[2] || 'https://hieu.asia';

/** 5 trang đại diện (khớp §B baseline): home · tool · pricing · catalog · 1 bài dài. */
const PAGES = ['/', '/la-so-bat-tu', '/pricing', '/cong-cu', '/cam-nang'];

const uniq = (arr) => [...new Set(arr)];
const kb = (bytes) => Math.round(bytes / 1024);

async function sizeOf(url) {
  const res = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
  const body = await res.arrayBuffer();
  return { ok: res.ok, status: res.status, bytes: body.byteLength, text: Buffer.from(body).toString('utf8') };
}

async function measurePage(path) {
  const html = await sizeOf(ORIGIN + path);
  if (!html.ok) return { path, error: `HTTP ${html.status}` };

  const jsHrefs = uniq([...html.text.matchAll(/\/_next\/static\/chunks\/[^"?]+\.js/g)].map((m) => m[0]));
  const cssHrefs = uniq([...html.text.matchAll(/\/_next\/static\/[^"?]+\.css/g)].map((m) => m[0]));

  let jsBytes = 0;
  for (const href of jsHrefs) {
    const chunk = await sizeOf(ORIGIN + href).catch(() => null);
    if (chunk?.ok) jsBytes += chunk.bytes;
  }
  let cssBytes = 0;
  for (const href of cssHrefs) {
    const chunk = await sizeOf(ORIGIN + href).catch(() => null);
    if (chunk?.ok) cssBytes += chunk.bytes;
  }

  return {
    path,
    htmlKB: kb(html.bytes),
    jsChunks: jsHrefs.length,
    jsKB: kb(jsBytes),
    cssFiles: cssHrefs.length,
    cssKB: kb(cssBytes),
    totalKB: kb(html.bytes + jsBytes + cssBytes),
  };
}

const pages = [];
for (const path of PAGES) {
  // tuần tự cho nhẹ máy chủ + số ổn định
  pages.push(await measurePage(path));
}

// capturedAt truyền từ ngoài (Date.now bị chặn trong vài sandbox) — không tự stamp.
process.stdout.write(JSON.stringify({ origin: ORIGIN, unit: 'KB (uncompressed)', pages }, null, 2) + '\n');
