// Khoá hành vi escape của bộ render markdown cho /cam-nang/[slug].
//
// VÌ SAO CẦN: đây là chỗ DUY NHẤT còn lại đổ HTML thô vào trang từ nội dung
// KHÔNG do repo này kiểm soát — `pillar.content` lấy từ
// `${API_BASE}/content/public/pillars/…`, rồi nhúng bằng
// `dangerouslySetInnerHTML`. `script-src` của site vẫn còn `'unsafe-inline'`
// (xem chú thích trong next.config.ts) nên nếu bộ render này để lọt một thẻ
// hay một handler inline thì nó CHẠY.
//
// Hàm viết tay (cố ý — tránh kéo `marked`/`react-markdown` vào route RSC) và
// trước đó KHÔNG có test nào. Nó đang đúng: escape TRƯỚC rồi mới format, và chỉ
// nhận link `/…` hoặc `https://…`. Test này chốt lại đúng hai tính chất đó để
// một lần sửa "cho gọn" sau này không lặng lẽ mở lại lỗ.
import { describe, it, expect } from 'vitest';
import { renderMarkdown } from './pillar-markdown';

describe('renderMarkdown — chặn HTML lọt từ nội dung CMS', () => {
  it('không để lọt thẻ <script>', () => {
    const html = renderMarkdown('<script>alert(1)</script>');
    expect(html).not.toContain('<script');
    expect(html).toContain('&lt;script&gt;');
  });

  it('không để lọt handler inline trên thẻ tự chèn', () => {
    const html = renderMarkdown('<img src=x onerror=alert(1)>');
    expect(html).not.toContain('<img');
  });

  // Tính chất mạnh nhất của bộ render: MỌI href dựng ra đều nằm trong danh sách
  // cho phép. Chỉ kiểm "không chứa chuỗi javascript:" là kiểm hớ — chuỗi đó nằm
  // lại trong output dưới dạng CHỮ (link không được dựng) là chuyện bình thường
  // và vô hại; cái đáng chặn là nó thành `href`.
  it('mọi href dựng ra đều là link nội bộ hoặc https', () => {
    const html = renderMarkdown(
      [
        '[a](/tu-vi)',
        '[b](https://hieu.asia)',
        '[c](javascript:alert(1))',
        '[d](/x" onmouseover="alert(1))',
        '[e](data:text/html,<script>alert(1)</script>)',
      ].join('\n\n'),
    );
    const hrefs = [...html.matchAll(/<a\s[^>]*href="([^"]*)"/g)].map((m) => m[1]);
    expect(hrefs).toEqual(['/tu-vi', 'https://hieu.asia']);
  });

  it('không thẻ nào dựng ra mang thuộc tính on* (handler inline)', () => {
    const html = renderMarkdown('[x](/a" onmouseover="alert(1))\n\n<b onclick="alert(1)">z</b>');
    expect(html).not.toMatch(/<[a-z][^>]*\son\w+=/i);
  });
});

describe('renderMarkdown — markdown thường vẫn hiển thị đúng', () => {
  it('dựng heading, đậm, gạch đầu dòng', () => {
    const html = renderMarkdown('## Tiêu đề\n\n- **đậm** một chút');
    expect(html).toContain('<h2');
    expect(html).toContain('<li>');
    expect(html).toContain('<strong');
  });

  it('cho phép link nội bộ và https', () => {
    expect(renderMarkdown('[a](/tu-vi)')).toContain('href="/tu-vi"');
    expect(renderMarkdown('[b](https://hieu.asia)')).toContain('href="https://hieu.asia"');
  });
});
