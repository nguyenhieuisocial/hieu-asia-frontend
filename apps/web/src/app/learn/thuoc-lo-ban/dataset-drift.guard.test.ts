// Guard: bảng thước Lỗ Ban trong bài Học không được lệch khỏi bộ dữ liệu THẬT
// mà công cụ /thuoc-lo-ban chạy.
//
// LỖI GỐC: mọi bài Học khác đều `import` thẳng bảng số từ lib của công cụ, nên
// không thể lệch. Riêng thước Lỗ Ban thì KHÔNG có lib phía frontend — công cụ gọi
// API, dữ liệu nằm ở repo backend:
//   backend/infra/cloudflare/workers/api-gateway/src/tools/thuoc-lo-ban.ts
// nên 32 khối cung (4 thước × 8 cung) trong page.tsx phải chép tay. Chép đúng ở
// thời điểm viết, nhưng backend sửa một chữ trong `meaning` là bài Học nói khác
// công cụ mà không ai biết. Test này bắt đúng tình huống đó.
//
// Cách kiểm: mọi chuỗi name / sub / meaning trong bài phải xuất hiện NGUYÊN VĂN
// trong file backend. Không parse TS (dễ vỡ) — chỉ so khớp chuỗi, đủ để phát hiện
// mọi sửa đổi nội dung.
//
// Repo backend là repo ANH EM (không phải submodule) nên có thể vắng mặt trên máy
// CI: khi đó test tự bỏ qua thay vì đỏ giả. Nhưng nếu file bài Học đổi cấu trúc
// tới mức không rút được chuỗi nào, test ĐỎ — không im lặng pass.
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ARTICLE = join(process.cwd(), 'src/app/learn/thuoc-lo-ban/page.tsx');
const BACKEND = join(
  process.cwd(),
  '../../../backend/infra/cloudflare/workers/api-gateway/src/tools/thuoc-lo-ban.ts',
);

/** Chuỗi trong bài: tên cung, 4 ô con, và câu ý nghĩa. */
function articleStrings(src: string): { names: string[]; subs: string[]; meanings: string[] } {
  const names = [...src.matchAll(/\{ name: '([^']+)', fortune:/g)].map((m) => m[1]!);
  const subs = [...src.matchAll(/subs: \[([^\]]+)\]/g)].flatMap((m) =>
    [...m[1]!.matchAll(/'([^']+)'/g)].map((s) => s[1]!),
  );
  const meanings = [...src.matchAll(/\n\s*meaning: '([^']+)' \}/g)].map((m) => m[1]!);
  return { names, subs, meanings };
}

describe('bài Học thước Lỗ Ban không lệch khỏi dữ liệu backend', () => {
  const article = readFileSync(ARTICLE, 'utf8');
  const { names, subs, meanings } = articleStrings(article);

  it('rút được đủ 32 cung, 128 ô con và 32 câu ý nghĩa từ bài', () => {
    // Chốt số lượng để test không âm thầm pass khi regex hết khớp (đổi format bài).
    expect(names).toHaveLength(32);
    expect(subs).toHaveLength(128);
    expect(meanings).toHaveLength(32);
  });

  it('mọi chuỗi trong bài đều có nguyên văn trong file backend', () => {
    if (!existsSync(BACKEND)) {
      // Repo backend không có mặt (CI chỉ checkout frontend) — bỏ qua, không đỏ giả.
      expect(existsSync(ARTICLE)).toBe(true);
      return;
    }
    const backend = readFileSync(BACKEND, 'utf8');
    const missing = [...new Set([...names, ...subs, ...meanings])].filter(
      (s) => !backend.includes(s),
    );
    expect(missing, 'chuỗi có trong bài Học nhưng KHÔNG có trong backend → đã lệch').toEqual([]);
  });

  it('chiều dài 4 loại thước khớp backend', () => {
    if (!existsSync(BACKEND)) return;
    const backend = readFileSync(BACKEND, 'utf8');
    const lengths = [...article.matchAll(/\n\s*length: ([\d.]+),/g)].map((m) => m[1]!);
    expect(lengths).toHaveLength(4);
    expect(lengths.filter((l) => !backend.includes(l))).toEqual([]);
  });
});
