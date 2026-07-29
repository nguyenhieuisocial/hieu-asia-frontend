// Chốt canh CHÍNH CÁI BỘ LỌC quyết định khi nào chốt SEO được chạy.
//
// VÌ SAO
// `seo-guard` tốn ~10 phút mỗi lần (phải build cả site), nên workflow chỉ chạy
// nó khi diff đụng một danh sách đường dẫn VIẾT TAY. Danh sách viết tay thì mục:
// thêm file mới nằm ngoài danh sách ⇒ guard **im lặng bỏ qua** ⇒ CI báo xanh y
// hệt như khi không có lỗi. Đúng dạng lỗi mà cả cụm guard này sinh ra để chặn,
// chỉ khác là nó nằm trong chính cơ chế kích hoạt.
//
// Đã xảy ra thật: danh sách cũ bỏ `components/` (trừ 2 file), trong khi
// `components/tools/ToolPageShell.tsx` dựng thẻ `<h1>` cho hàng chục trang công
// cụ — mà guard có luật canh `<h1>`. Sửa nhầm ở đó thì guard không chạy.
//
// Bài này rẻ (đọc file, vài mili-giây) và nằm trong cổng kiểm bắt buộc sẵn có,
// nên nó canh được cái đắt mà không tốn gì.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const WEB = process.cwd(); // apps/web
const REPO = join(WEB, '..', '..');
const WORKFLOW = join(REPO, '.github', 'workflows', 'seo-guard.yml');

/**
 * Khớp glob kiểu `case` của POSIX sh, nơi `*` khớp mọi thứ KỂ CẢ dấu `/`.
 *
 * Cố tình KHÔNG dựng `new RegExp()` từ biến: trong đợt này CodeQL đã bắt ba lần
 * lỗi tự viết escape thiếu. Tách theo `*` rồi dò tuần tự thì không có gì để
 * escape sai.
 */
function khopGlob(glob: string, duongDan: string): boolean {
  const phan = glob.split('*');
  if (phan.length === 1) return duongDan === glob;
  if (!duongDan.startsWith(phan[0]!)) return false;
  let i = phan[0]!.length;
  for (let k = 1; k < phan.length; k++) {
    const p = phan[k]!;
    if (k === phan.length - 1) {
      if (p === '') return true;
      return duongDan.endsWith(p) && duongDan.length >= i + p.length;
    }
    const j = duongDan.indexOf(p, i);
    if (j < 0) return false;
    i = j + p.length;
  }
  return true;
}

/** Rút các mẫu đường dẫn trong khối `case` của bước dò thay đổi. */
function mauTrongWorkflow(): string[] {
  const src = readFileSync(WORKFLOW, 'utf8');
  const mau: string[] = [];
  for (const dong of src.split('\n')) {
    const s = dong.trim();
    if (s.startsWith('#') || !s.includes(') RELEVANT=true')) continue;
    const truoc = s.slice(0, s.indexOf(') RELEVANT=true'));
    for (const m of truoc.split('|')) {
      const t = m.trim();
      if (t && t !== '*') mau.push(t);
    }
  }
  return mau;
}

/**
 * Mọi file .ts/.tsx trong `apps/web/src` VÀ trong `packages/<gói>/src`,
 * trả về đường dẫn tính từ gốc repo.
 *
 * Vì sao quét cả `packages/`: 247 file trong web import `@hieu-asia/ui`, nên
 * một component DÙNG CHUNG dựng `<h1>` sẽ đổi đúng thứ guard đo — y hệt ca
 * `ToolPageShell` trong khối chú thích đầu file, chỉ nằm xa hơn một tầng.
 *
 * Đo 2026-07-29: hiện **0 file** trong `packages/` mang dấu hiệu nào bên dưới
 * (`Logo.tsx` chỉ có `<title>` của SVG, không phải thẻ trang) ⇒ **cố ý KHÔNG**
 * thêm `packages/*` vào bộ lọc kích hoạt: làm vậy là bắt job 10 phút chạy thêm
 * cho lợi ích đang bằng 0. Thay vào đó mở rộng phạm vi bài test này — ngày ai
 * đó thêm `<h1>` / JSON-LD / metadata vào một gói dùng chung thì test đỏ ngay
 * và bắt họ khai đường dẫn, thay vì lọt im lặng. Rẻ bây giờ, bắt được về sau.
 */
function fileNguon(): string[] {
  const out: string[] = [];
  const di = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) {
        if (!/node_modules|\.next|dist/.test(e.name)) di(p);
      } else if (/\.tsx?$/.test(e.name)) {
        out.push(relative(REPO, p).split(sep).join('/'));
      }
    }
  };
  di(join(WEB, 'src'));
  const gocGoi = join(REPO, 'packages');
  for (const e of readdirSync(gocGoi, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const src = join(gocGoi, e.name, 'src');
    try {
      di(src);
    } catch {
      // gói không có thư mục `src` — bỏ qua, không phải lỗi
    }
  }
  return out;
}

// Những dấu hiệu cho thấy file có thể đổi ĐÚNG thứ mà seo-guard đo:
// thẻ <h1>, khối dữ liệu có cấu trúc, hoặc khai metadata của trang.
const DAU_HIEU = ['<h1', 'application/ld+json', 'export const metadata', 'generateMetadata'];

const MAU = mauTrongWorkflow();
const FILES = fileNguon();

describe('bộ lọc kích hoạt chốt SEO phải phủ hết file có thể làm nó đỏ', () => {
  it('đọc được workflow và cây nguồn', () => {
    // Không có chốt kiểm này thì một lần đọc hụt sẽ khiến bài dưới xanh suông.
    //
    // Cố ý KHÔNG chốt bằng SỐ LƯỢNG mẫu: bản đầu tôi đặt `> 5` theo danh sách
    // cũ, rồi chính lần gộp danh sách lại làm nó đỏ vì sai lý do. Chốt theo Ý
    // NGHĨA — mẫu rút ra phải thật sự khớp được một file có thật — mới không
    // vỡ khi danh sách được viết gọn lại.
    expect(MAU.length, 'không rút được mẫu nào từ workflow — khối case đã đổi cấu trúc?').toBeGreaterThanOrEqual(3);
    expect(
      MAU.some((m) => khopGlob(m, 'apps/web/src/app/page.tsx')),
      'không mẫu nào khớp nổi một trang có thật — cách rút mẫu hoặc cách khớp glob đã hỏng',
    ).toBe(true);
    expect(FILES.length, 'quá ít file nguồn — đang quét sai thư mục?').toBeGreaterThan(300);
  });

  it('mọi file dựng <h1> / dữ liệu có cấu trúc / metadata đều nằm trong bộ lọc', () => {
    const sot: string[] = [];
    let soUngVien = 0;
    for (const f of FILES) {
      if (/\.(test|spec|stories)\./.test(f)) continue; // không vào bản dựng
      const src = readFileSync(join(REPO, f), 'utf8');
      if (!DAU_HIEU.some((d) => src.includes(d))) continue;
      soUngVien++;
      if (!MAU.some((m) => khopGlob(m, f))) sot.push(f);
    }
    expect(soUngVien, 'không tìm được file ứng viên nào — dấu hiệu nhận biết đã lỗi thời?').toBeGreaterThan(50);
    expect(
      sot,
      `những file này đổi được kết quả của seo-guard nhưng KHÔNG kích hoạt nó ` +
        `⇒ sửa vào đây thì CI báo xanh mà lỗi vẫn vào main:\n  ${sot.join('\n  ')}\n` +
        `Cách sửa: thêm đường dẫn vào khối \`case\` trong .github/workflows/seo-guard.yml.`,
    ).toEqual([]);
  });
});
