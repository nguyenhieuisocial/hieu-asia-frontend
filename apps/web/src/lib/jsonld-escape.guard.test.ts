// Guard: JSON-LD chỉ được phát qua MỘT nguồn duy nhất — <JsonLd>.
//
// LỖI GỐC: `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html:
// JSON.stringify(x) }} />` được copy-paste ra 78 chỗ trong 45 file. `JSON.stringify`
// KHÔNG escape `<`, `/` hay chuỗi `</script>` → giá trị JSON-LD nào chứa
// `</script>` sẽ đóng sớm thẻ script, phần sau trình duyệt đọc như HTML. `script-src`
// của site vẫn còn `'unsafe-inline'` (next.config.ts) nên script chèn vào CHẠY được.
//
// KHÔNG phải lo xa: `/tu-vi/[palace]` và `/tu-vi/sao/[star]` dựng JSON-LD từ
// `getPalace()` / `getStar()` — nội dung admin sửa được, đọc qua API; `/cam-nang/[slug]`
// lấy `pillar.topic` + trích đoạn `pillar.content` từ API nội dung. Cả ba đều là
// dữ liệu KHÔNG do repo này kiểm soát.
//
// Sửa ở nguồn (`serializeJsonLd`) là chưa đủ nếu vẫn còn chỗ nhúng thẳng — nên
// guard này chặn luôn việc quay lại pattern cũ. Thêm JSON-LD ở trang mới thì
// dùng `<JsonLd data={...} />`, đừng viết thẻ <script> tay.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SRC = join(process.cwd(), 'src');
/** Nơi DUY NHẤT được phép nhúng JSON-LD vào DOM. */
const ALLOWED = join('components', 'seo', 'JsonLd.tsx');

/**
 * Chỉ quét `.tsx`: thẻ <script> JSX chỉ tồn tại được ở file có JSX. Quét cả `.ts`
 * sẽ dính nhầm chuỗi HTML dùng làm dữ liệu mẫu trong test (`seo-guard.test.ts`)
 * và chính comment của file này.
 */
function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(full));
    else if (entry.name.endsWith('.tsx')) out.push(full);
  }
  return out;
}

/**
 * Bắt cặp `application/ld+json` + `dangerouslySetInnerHTML` trong CÙNG một thẻ.
 * Cửa sổ 300 ký tự đủ rộng cho JSX xuống dòng, đủ hẹp để không dính nhầm hai
 * thẻ khác nhau nằm gần nhau.
 */
function rawJsonLdEmitters(src: string): number {
  let count = 0;
  for (const m of src.matchAll(/application\/ld\+json/g)) {
    const window = src.slice(m.index, m.index + 300);
    if (window.includes('dangerouslySetInnerHTML')) count++;
  }
  return count;
}

describe('guard: nhúng JSON-LD', () => {
  it('không file nào ngoài JsonLd.tsx tự nhúng <script type="application/ld+json">', () => {
    const offenders = sourceFiles(SRC)
      .filter((f) => !relative(SRC, f).split(sep).join(sep).endsWith(ALLOWED))
      .filter((f) => rawJsonLdEmitters(readFileSync(f, 'utf8')) > 0)
      .map((f) => relative(SRC, f));

    expect(offenders, 'dùng <JsonLd data={...} /> thay cho thẻ <script> tự viết').toEqual([]);
  });

  it('JsonLd.tsx đi qua serializeJsonLd, không dùng thẳng JSON.stringify', () => {
    const src = readFileSync(join(SRC, ALLOWED), 'utf8');
    expect(src).toContain('serializeJsonLd(node)');
    expect(src).not.toMatch(/__html:\s*JSON\.stringify/);
  });
});
