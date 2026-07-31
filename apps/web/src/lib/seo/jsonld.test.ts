// Escape JSON-LD TRƯỚC khi nhúng vào <script> — khoá lỗ XSS.
//
// LỖI GỐC: `JSON.stringify` không escape `<`, `/`, và đặc biệt không escape chuỗi
// `</script>`. Một giá trị JSON-LD chứa `</script>` sẽ ĐÓNG SỚM thẻ script; phần
// còn lại trình duyệt đọc như HTML thường. CSP của site vẫn còn `'unsafe-inline'`
// ở `script-src` (next.config.ts) nên script chèn thêm SẼ chạy.
//
// Đường vào thật, không lý thuyết: các trang lấy JSON-LD từ API/CMS từ xa —
// `/cam-nang/[slug]` truyền `pillar.topic` + trích đoạn `pillar.content`, và
// `/community/cases/[slug]` cùng dạng — nội dung đó KHÔNG do repo này kiểm soát.
//
// `<` là escape hợp lệ của JSON nên crawler (Google / AI search) vẫn parse
// ra đúng ký tự `<`; chỉ HTML parser là không còn thấy `</script>`.
import { describe, it, expect } from 'vitest';
import { serializeJsonLd } from './jsonld';
import { parseJsonLd } from '../../../scripts/seo-guard.mjs';

/** Payload thoát khỏi thẻ script nếu output không được escape. */
const BREAKOUT = '</script><script>alert(1)</script>';

describe('serializeJsonLd', () => {
  it('không để lọt chuỗi `</script>` thô ra output', () => {
    const out = serializeJsonLd({ '@type': 'Article', headline: BREAKOUT });
    expect(out).not.toContain('</script>');
  });

  it('vẫn là JSON hợp lệ và parse lại đúng giá trị gốc', () => {
    const node = { '@type': 'Article', headline: BREAKOUT };
    expect(JSON.parse(serializeJsonLd(node))).toEqual(node);
  });

  // Escape mà làm hỏng dữ liệu có cấu trúc thì tệ hơn không escape: SEO là tài
  // sản chính của site. Cho output đi qua ĐÚNG bộ đọc mà seo-guard dùng để chấm
  // trang thật (`scripts/seo-guard.mjs`), không chỉ `JSON.parse` suông.
  it('seo-guard vẫn đọc được node sau khi escape', () => {
    const node = { '@type': 'Article', headline: BREAKOUT };
    const html = `<script type="application/ld+json">${serializeJsonLd(node)}</script>`;
    const parsed = parseJsonLd(html);

    expect(parsed.invalid).toBe(0);
    expect(parsed.nodes).toEqual([node]);
  });
});
