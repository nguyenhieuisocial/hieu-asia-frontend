// T35 — lưới an toàn cho chính cái lưới an toàn.
//
// `scripts/ui-guard.mjs` là thứ chặn anti-pattern UI ở PR. Nếu regex của nó
// hỏng thì nó im lặng cho qua mọi thứ — hỏng kiểu tệ nhất: vẫn "xanh" nhưng
// không còn bảo vệ gì. Test này khoá lại cả hai chiều: BẮT đúng cái xấu và
// KHÔNG bắt nhầm cái tốt.
import { describe, it, expect } from 'vitest';
import {
  parseAddedLines,
  scanAddedLines,
  scanFileLevel,
  routeFromPagePath,
  scanOrphanPage,
} from '../../scripts/ui-guard.mjs';

const DIFF = [
  '--- a/apps/web/src/components/A.tsx',
  '+++ b/apps/web/src/components/A.tsx',
  '@@ -1,0 +1,2 @@',
  '+const a = 1;',
  '-const gone = 2;',
  '--- a/apps/web/src/styles.css',
  '+++ b/apps/web/src/styles.css',
  '@@ -1,0 +1,1 @@',
  '+.x { color: red }',
].join('\n');

describe('ui-guard — đọc diff', () => {
  it('chỉ lấy dòng THÊM của file ts/tsx/js/jsx', () => {
    expect(parseAddedLines(DIFF)).toEqual([
      { file: 'apps/web/src/components/A.tsx', text: 'const a = 1;' },
    ]);
  });

  it('diff rỗng → không có dòng nào', () => {
    expect(parseAddedLines('')).toEqual([]);
  });

  // Chính file này cố ý chứa các mẫu sai để thử guard. Không loại trừ file
  // kiểm thử thì guard sẽ báo lỗi lên chính nó và chặn mọi PR đụng vào nó.
  it('bỏ qua file .test.ts / .spec.tsx (fixture cố ý chứa mẫu sai)', () => {
    const diff = [
      '+++ b/apps/web/src/lib/ui-guard.test.ts',
      '+  expect(lines(\'<div className="text-black" />\')).toHaveLength(1);',
      '+++ b/apps/web/src/components/Foo.spec.tsx',
      '+  <div className="bg-white" />',
      '+++ b/apps/web/src/components/Foo.tsx',
      '+  <div className="text-black" />',
    ].join('\n');
    expect(parseAddedLines(diff)).toEqual([
      { file: 'apps/web/src/components/Foo.tsx', text: '  <div className="text-black" />' },
    ]);
  });
});

const lines = (text: string, file = 'apps/web/src/components/A.tsx') =>
  scanAddedLines([{ file, text }]);

describe('ui-guard — mẫu 1: input type="time"', () => {
  it('bắt input type="time" (phải dùng Time24)', () => {
    expect(lines('<input type="time" value={t} />')).toHaveLength(1);
  });

  it('không bắt input type="date"', () => {
    expect(lines('<input type="date" value={d} />')).toEqual([]);
  });
});

describe('ui-guard — mẫu 3: chữ nhỏ trên ô nhập', () => {
  it('bắt text-sm trên <input>', () => {
    expect(lines('<input className="h-11 text-sm" />')).toHaveLength(1);
  });

  it('bắt text-xs trên <select>', () => {
    expect(lines('<select className="text-xs" />')).toHaveLength(1);
  });

  it('không bắt text-sm trên thẻ thường', () => {
    expect(lines('<p className="text-sm">xin chào</p>')).toEqual([]);
  });
});

describe('ui-guard — mẫu 5: màu cứng phá dark-mode', () => {
  it('bắt bg-white trần', () => {
    expect(lines('<div className="bg-white p-4" />')).toHaveLength(1);
  });

  it('bắt text-black trần', () => {
    expect(lines('<div className="text-black" />')).toHaveLength(1);
  });

  it('không bắt khi đã có biến thể dark:', () => {
    expect(lines('<div className="dark:bg-white dark:text-black" />')).toEqual([]);
  });

  it('không bắt trong file QR / print / OG (cố ý nền trắng)', () => {
    expect(lines('<div className="bg-white" />', 'apps/web/src/components/QRDisplay.tsx')).toEqual([]);
    expect(lines('<div className="bg-white" />', 'apps/web/src/app/bang-chung/og/route.tsx')).toEqual([]);
  });
});

describe('ui-guard — mẫu 2 & 4: kiểm ở mức cả file', () => {
  const F = 'apps/web/src/components/Card.tsx';

  it('bắt group-hover: mới khi file không có group-focus-within', () => {
    expect(scanFileLevel(F, 'className="group-hover:opacity-100"', 'nội dung file')).toHaveLength(1);
  });

  it('không bắt khi file đã có group-focus-within', () => {
    expect(
      scanFileLevel(F, 'className="group-hover:opacity-100"', 'group-focus-within:opacity-100'),
    ).toEqual([]);
  });

  it('bắt fixed bottom- mới khi file không xử lý safe-area', () => {
    expect(scanFileLevel(F, 'className="fixed bottom-4"', 'nội dung file')).toHaveLength(1);
  });

  it('không bắt khi file đã dùng env(safe-area-inset-bottom)', () => {
    expect(
      scanFileLevel(F, 'className="fixed bottom-4"', 'bottom-[max(1rem,env(safe-area-inset-bottom))]'),
    ).toEqual([]);
  });
});

describe('ui-guard — mẫu 6: trang mồ côi', () => {
  const page = 'apps/web/src/app/planning/page.tsx';

  it('đổi đường dẫn file thành đường dẫn URL, bỏ nhóm route', () => {
    expect(routeFromPagePath(page)).toBe('/planning');
    expect(routeFromPagePath('apps/web/src/app/(marketing)/pricing/page.tsx')).toBe('/pricing');
    expect(routeFromPagePath('apps/web/src/app/page.tsx')).toBeNull();
  });

  it('bắt trang mới không có trong sitemap lẫn site-registry', () => {
    expect(scanOrphanPage(page, 'export default function P() {}', '', '')).toHaveLength(1);
  });

  it('không bắt khi đã khai báo trong sitemap', () => {
    expect(
      scanOrphanPage(page, 'export default function P() {}', `\${BASE_URL}/planning\`,`, ''),
    ).toEqual([]);
  });

  it('không bắt khi đã khai báo trong site-registry', () => {
    expect(
      scanOrphanPage(page, 'export default function P() {}', '', "href: '/planning',"),
    ).toEqual([]);
  });

  it('không bắt trang cố ý noindex (vd /maintenance)', () => {
    expect(
      scanOrphanPage(
        'apps/web/src/app/maintenance/page.tsx',
        'robots: { index: false, follow: false }',
        '',
        '',
      ),
    ).toEqual([]);
  });

  it('bỏ qua route động vì sitemap sinh từ danh sách dữ liệu', () => {
    expect(scanOrphanPage('apps/web/src/app/ban-menh/[year]/page.tsx', '', '', '')).toEqual([]);
  });
});
