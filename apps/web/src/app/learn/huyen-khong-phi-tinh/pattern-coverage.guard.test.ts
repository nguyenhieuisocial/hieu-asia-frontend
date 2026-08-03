// Guard: bảng "phân bố cách cục" trong bài /learn/huyen-khong-phi-tinh chỉ hiển
// thị 5 cách cục, và bài KHẲNG ĐỊNH bằng chữ rằng vận 2,3,4,6,7,8 chia đều 6–6–6–6.
//
// Cả hai điều đó chỉ đúng vì engine hiện KHÔNG BAO GIỜ trả về `thong-thuong` cho
// bất kỳ cục nào trong 9 vận × 24 sơn = 216 cục. Đó là một giả định về dữ liệu, và
// giả định không được canh thì sớm muộn cũng sai: đổi engine một dòng là các hàng
// trong bảng lặng lẽ không cộng đủ 24 (cột thiếu bị bỏ ngoài `PATTERN_ORDER`), còn
// câu "6–6–6–6" thành sai mà không có gì báo.
//
// Test này khoá đúng hai giả định đó. Đỏ ở đây = phải sửa bài, không phải sửa test.
import { describe, it, expect } from 'vitest';
import { computeFlyingStarChart, mountainNames } from '@/lib/phi-tinh';

const YUN = [1, 2, 3, 4, 5, 6, 7, 8, 9];

describe('giả định dữ liệu mà bài Huyền Không Phi Tinh dựa vào', () => {
  const charts = YUN.flatMap((yun) =>
    mountainNames().map((m) => ({ yun, chart: computeFlyingStarChart(yun, m) })),
  );

  it('quét đủ 216 cục (9 vận × 24 sơn)', () => {
    expect(charts).toHaveLength(216);
  });

  it('không cục nào rơi vào `thong-thuong` — bảng trong bài mới phủ hết 24 sơn', () => {
    const stray = charts
      .filter(({ chart }) => chart.pattern === 'thong-thuong')
      .map(({ yun, chart }) => `vận ${yun} · ${chart.sitting.name}`);
    expect(stray, 'xuất hiện cách cục bài chưa có cột → bảng sẽ thiếu sơn').toEqual([]);
  });

  it('6 vận 2,3,4,6,7,8 chia đều 6–6–6–6 đúng như bài viết', () => {
    for (const yun of [2, 3, 4, 6, 7, 8]) {
      const counts = new Map<string, number>();
      for (const { chart } of charts.filter((c) => c.yun === yun))
        counts.set(chart.pattern, (counts.get(chart.pattern) ?? 0) + 1);
      expect([...counts.values()].sort(), `vận ${yun}`).toEqual([6, 6, 6, 6]);
    }
  });
});
