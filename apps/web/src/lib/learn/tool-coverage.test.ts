// Guard cho bất biến "mỗi công cụ một bài Học của riêng nó, không dùng chung".
//
// Ba lỗi thật mà test này chặn:
//  1. Thêm công cụ mới rồi quên hẳn phần Học (36/63 công cụ từng ở tình trạng
//     này — mở công cụ ra không có đường nào dẫn tới bài giải thích).
//  2. Hai công cụ trỏ chung một bài (5 công cụ ngày–giờ từng cùng trỏ
//     /learn/trach-cat, nên bấm "Học" từ Lịch thiên văn lại ra bài chọn ngày cưới).
//  3. Trỏ tới bài chưa tồn tại → link 404.
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TOOL_REGISTRY } from '../site-registry';
import { PALACE_READINGS } from '../palace-readings';
import { LEARN_TOPICS } from './related';
import {
  TOOL_LEARN_MAP,
  EXEMPT_TOOLS,
  PENDING,
  SECONDARY_LEARN,
} from './tool-coverage';

const APP_DIR = join(process.cwd(), 'src/app');
const PALACE_SLUGS = new Set(PALACE_READINGS.map((p) => p.slug));

/**
 * Trang /learn có thật? Route tĩnh thì có page.tsx; riêng /learn/tu-vi/<cung> là
 * route động [cung] nên đối chiếu với PALACE_READINGS.
 */
function learnPageExists(href: string): boolean {
  const cung = href.match(/^\/learn\/tu-vi\/([a-z0-9-]+)$/);
  if (cung) return PALACE_SLUGS.has(cung[1]!);
  return existsSync(join(APP_DIR, href, 'page.tsx'));
}

/** Công cụ công khai = có mặt ở catalog /cong-cu hoặc ở marquee trang chủ. */
const PUBLIC_TOOLS = TOOL_REGISTRY.filter((e) => e.catalog || e.home).map((e) => e.href);

describe('tool-coverage — mọi công cụ đều có bài Học', () => {
  it('không công cụ công khai nào bị bỏ quên', () => {
    const exempt = new Set(EXEMPT_TOOLS);
    const missing = PUBLIC_TOOLS.filter((h) => !(h in TOOL_LEARN_MAP) && !exempt.has(h));
    expect(missing).toEqual([]);
  });

  it('không hai công cụ nào dùng chung một bài Học', () => {
    const owner = new Map<string, string>();
    const shared: string[] = [];
    for (const [tool, learn] of Object.entries(TOOL_LEARN_MAP)) {
      const prev = owner.get(learn);
      if (prev) shared.push(`${learn} bị dùng chung bởi ${prev} và ${tool}`);
      else owner.set(learn, tool);
    }
    expect(shared).toEqual([]);
  });

  it('mọi khoá trong bản đồ là công cụ có thật trong registry', () => {
    const known = new Set(TOOL_REGISTRY.map((e) => e.href));
    const unknown = Object.keys(TOOL_LEARN_MAP).filter((h) => !known.has(h));
    expect(unknown).toEqual([]);
  });
});

describe('tool-coverage — bài Học đã hứa thì phải có thật', () => {
  it('mọi đích ngoài PENDING đều là trang có thật', () => {
    const pending = new Set(PENDING);
    const dead = Object.entries(TOOL_LEARN_MAP)
      .filter(([, learn]) => !pending.has(learn) && !learnPageExists(learn))
      .map(([tool, learn]) => `${tool} → ${learn}`);
    expect(dead).toEqual([]);
  });

  it('mọi bài Học phụ ngoài PENDING đều là trang có thật', () => {
    const pending = new Set(PENDING);
    const dead = Object.entries(SECONDARY_LEARN)
      .flatMap(([tool, list]) => list.map((l) => [tool, l] as const))
      .filter(([, learn]) => !pending.has(learn) && !learnPageExists(learn))
      .map(([tool, learn]) => `${tool} → ${learn}`);
    expect(dead).toEqual([]);
  });

  it('PENDING chỉ chứa slug thật sự nằm trong bản đồ (không rác)', () => {
    const targets = new Set([
      ...Object.values(TOOL_LEARN_MAP),
      ...Object.values(SECONDARY_LEARN).flat(),
    ]);
    const stray = PENDING.filter((p) => !targets.has(p));
    expect(stray).toEqual([]);
  });

  it('PENDING không chứa trang đã viết xong (quên xoá khỏi danh sách chờ)', () => {
    const done = PENDING.filter((p) => learnPageExists(p));
    expect(done).toEqual([]);
  });
});

// Hub /learn liệt kê chủ đề bằng một mảng CLUSTERS nội bộ trong page.tsx (không
// export được vì Next chỉ cho page.tsx export default + metadata). Đọc thẳng mã
// nguồn là cách rẻ nhất để canh hai lỗi ĐÃ THẬT SỰ XẢY RA khi mở rộng khu Học:
// thêm chủ đề vào registry nhưng quên thẻ trên hub (trang thành mồ côi, không có
// lối vào), và cùng một chủ đề nằm ở hai cụm (thẻ hiện hai lần, itemList JSON-LD
// khai trùng).
describe('hub /learn hiển thị đúng mọi chủ đề', () => {
  const hubSource = readFileSync(join(process.cwd(), 'src/app/learn/page.tsx'), 'utf8');
  const hubSlugs = [...hubSource.matchAll(/href: '\/learn\/([a-z0-9-]+)'/g)].map((m) => m[1]!);

  it('không chủ đề nào bị lặp thẻ', () => {
    const dup = hubSlugs.filter((s, i) => hubSlugs.indexOf(s) !== i);
    expect([...new Set(dup)]).toEqual([]);
  });

  it('phủ đúng tập LEARN_TOPICS — không sót, không thừa', () => {
    const topics = LEARN_TOPICS.map((t) => t.slug);
    expect([...hubSlugs].sort()).toEqual([...topics].sort());
  });
});
