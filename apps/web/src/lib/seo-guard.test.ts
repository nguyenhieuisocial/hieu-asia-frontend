// Lưới an toàn cho chính cái lưới an toàn (cùng tinh thần với ui-guard.test.ts).
//
// `scripts/seo-guard.mjs` là thứ chặn lỗi meta SEO. Nếu luật của nó hỏng thì nó
// im lặng cho qua tất cả — hỏng kiểu tệ nhất: CI vẫn xanh nhưng không còn bảo
// vệ gì. Đúng kiểu hỏng đã xảy ra ngoài đời: `clampDescription` làm mọi phép
// kiểm "chỉ đo độ dài" báo xanh trong khi 133 trang đang cụt trên SERP.
//
// Test khoá cả hai chiều: BẮT đúng cái xấu, và KHÔNG bắt nhầm cái tốt.
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import {
  checkPage,
  checkJsonLd,
  parseJsonLd,
  applyAllowlist,
  matchesPattern,
  extractMeta,
  TITLE_MAX,
  DESCRIPTION_MAX,
  ALLOWLIST,
} from '../../scripts/seo-guard.mjs';

const ok = {
  url: '/x',
  title: 'Tiêu đề vừa đủ ngắn cho SERP',
  description: 'Một mô tả bình thường, dưới 160 ký tự, kết thúc bằng dấu chấm.',
};

describe('ngưỡng', () => {
  it('chốt đúng 60 / 160 — một nguồn duy nhất cho mọi agent', () => {
    // Đợt 2026-07-25 có agent dùng ~170 nên "sửa" xong vẫn hỏng. Khoá lại.
    expect(TITLE_MAX).toBe(60);
    expect(DESCRIPTION_MAX).toBe(160);
  });
});

describe('checkPage — bắt đúng cái xấu', () => {
  it('tiêu đề dài hơn 60', () => {
    const v = checkPage({ ...ok, title: 'x'.repeat(61) });
    expect(v.map((x: { rule: string }) => x.rule)).toContain('title-too-long');
  });

  it('mô tả dài hơn 160', () => {
    const v = checkPage({ ...ok, description: 'x'.repeat(161) });
    expect(v.map((x: { rule: string }) => x.rule)).toContain('description-too-long');
  });

  it('mô tả bị clamp cắt — dù độ dài VẪN đạt', () => {
    // Đây là ca quan trọng nhất. clampDescription cắt về ≤160 rồi thêm "…",
    // nên mọi phép kiểm chỉ-đo-độ-dài đều báo xanh trong khi trang đang hỏng.
    const clamped = 'Một mô tả bị cắt vì mẫu chữ quá dài…';
    expect(clamped.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    const v = checkPage({ ...ok, description: clamped });
    expect(v.map((x: { rule: string }) => x.rule)).toContain('description-clamped');
  });

  it('thiếu tiêu đề / thiếu mô tả', () => {
    expect(checkPage({ ...ok, title: null }).map((x: { rule: string }) => x.rule)).toContain(
      'title-missing',
    );
    expect(checkPage({ ...ok, description: null }).map((x: { rule: string }) => x.rule)).toContain(
      'description-missing',
    );
  });
});

describe('checkPage — luật <h1>', () => {
  // Lỗi thật đã sửa ở #953: `/affiliate/signup` là trang DUY NHẤT trong 978 trang
  // cho-index không có `<h1>` nào — tiêu đề nằm trong `CardTitle` nên render ra
  // `h3`. Không lỗi build, không test đỏ, không ai biết. Thêm luật lúc số vi phạm
  // đang bằng 0 nên nó không chặn việc của ai, chỉ giữ nguyên trạng thái tốt.
  it('bắt trang cho-index không có h1', () => {
    expect(checkPage({ ...ok, h1Count: 0 }).map((x: { rule: string }) => x.rule)).toContain('h1-missing');
  });

  it('bắt trang có nhiều hơn 1 h1', () => {
    expect(checkPage({ ...ok, h1Count: 2 }).map((x: { rule: string }) => x.rule)).toContain('h1-multiple');
  });

  it('đúng 1 h1 thì im lặng', () => {
    expect(checkPage({ ...ok, h1Count: 1 })).toEqual([]);
  });

  // Trang noindex KHÔNG bị soi: h1 thuần là tín hiệu tìm kiếm nên trang không cho
  // index chẳng có gì để mất. 25 trang riêng tư của site render nội dung phía
  // client trong <Suspense> ⇒ HTML tĩnh chỉ có khung, h1 xuất hiện sau khi tải
  // xong. Soi cả chúng thì luật sinh 25 báo động sai và sẽ bị tắt đi.
  it('KHÔNG soi h1 trên trang noindex', () => {
    expect(checkPage({ ...ok, h1Count: 0, noindex: true })).toEqual([]);
    expect(checkPage({ ...ok, h1Count: 3, noindex: true })).toEqual([]);
  });

  // Chống hỏng-im-lặng: nếu extractMeta thôi trả h1Count thì luật tự tắt mà CI
  // vẫn xanh. Test này khoá việc extractMeta LUÔN đo được.
  it('extractMeta luôn trả h1Count là số + đọc đúng cờ noindex', () => {
    const a = extractMeta('<title>t</title><h1>x</h1>');
    expect(a.h1Count).toBe(1);
    expect(a.noindex).toBe(false);
    const b = extractMeta('<meta name="robots" content="noindex, nofollow"/><h1>a</h1><h1 class="y">b</h1>');
    expect(b.h1Count).toBe(2);
    expect(b.noindex).toBe(true);
  });

  it('không khớp thẻ giả như <h1abc>', () => {
    expect(extractMeta('<h1abc>x</h1abc>').h1Count).toBe(0);
  });
});

describe('checkPage — không bắt nhầm cái tốt', () => {
  it('trang đạt chuẩn thì im lặng', () => {
    expect(checkPage(ok)).toEqual([]);
  });

  it('đúng ngay tại ngưỡng vẫn được coi là đạt', () => {
    expect(checkPage({ ...ok, title: 'x'.repeat(TITLE_MAX) })).toEqual([]);
    expect(checkPage({ ...ok, description: 'x'.repeat(DESCRIPTION_MAX) })).toEqual([]);
  });

  it('dấu "…" ở GIỮA câu không phải là bị cắt', () => {
    expect(checkPage({ ...ok, description: 'Nửa này… nửa kia, và câu vẫn trọn vẹn.' })).toEqual([]);
  });
});

describe('matchesPattern', () => {
  it('khớp đúng URL', () => {
    expect(matchesPattern('/khai-truong', '/khai-truong')).toBe(true);
    expect(matchesPattern('/khai-truong', '/khai-truong/1970')).toBe(false);
  });

  it('khớp cả cụm với hậu tố /*', () => {
    expect(matchesPattern('/tarot/y-nghia/*', '/tarot/y-nghia/king-of-cups')).toBe(true);
    expect(matchesPattern('/tarot/y-nghia/*', '/tarot/hom-nay')).toBe(false);
  });
});

describe('applyAllowlist', () => {
  const list = {
    '/owned': { rules: ['title-too-long'], owner: 'ai đó', note: '' },
    '/cum/*': { rules: ['description-clamped'], owner: 'ai đó', note: '' },
  };

  it('miễn trừ đúng luật đã khai, KHÔNG miễn luật khác trên cùng trang', () => {
    const { blocking, allowed } = applyAllowlist(
      [
        { url: '/owned', rule: 'title-too-long', detail: '' },
        { url: '/owned', rule: 'description-too-long', detail: '' },
      ],
      list,
    );
    expect(allowed).toHaveLength(1);
    expect(blocking).toHaveLength(1);
    expect(blocking[0]?.rule).toBe('description-too-long');
  });

  it('miễn trừ theo cụm', () => {
    const { blocking } = applyAllowlist(
      [{ url: '/cum/abc', rule: 'description-clamped', detail: '' }],
      list,
    );
    expect(blocking).toHaveLength(0);
  });

  it('báo mục miễn trừ đã hết vi phạm để còn xoá đi', () => {
    // Nếu không báo, mục thừa sẽ âm thầm tắt kiểm tra cho trang đó mãi mãi.
    const { stale } = applyAllowlist([], list);
    expect(stale).toHaveLength(2);
  });

  // Mẫu `/*` miễn trừ theo CỤM nên nó che luôn những trang trong cụm lẽ ra phải
  // bị canh. Thật ở repo này: `/tu-vi-thang/*` miễn `jsonld-missing` cho 78
  // trang tháng đã hết, nhưng che luôn 79 trang tháng đang sống — cụm đó mất
  // sạch JSON-LD thì guard vẫn im, và `stale` không cứu được vì mẫu vẫn "đang
  // được dùng" bởi 78 trang kia. `max` là chốt chặn cho đúng lỗ hổng này.
  describe('max — chặn mẫu /* che quá rộng', () => {
    const capped = {
      '/cum/*': { rules: ['jsonld-missing'], owner: 'ai đó', note: 'x', max: 2 },
    };
    const v = (n: number) =>
      Array.from({ length: n }, (_, i) => ({ url: `/cum/${i}`, rule: 'jsonld-missing', detail: '' }));

    it('đúng bằng giới hạn thì im lặng', () => {
      const { blocking } = applyAllowlist(v(2), capped);
      expect(blocking).toHaveLength(0);
    });

    it('vượt giới hạn thì BÁO ĐỎ, kèm số trang mới hỏng', () => {
      const { blocking } = applyAllowlist(v(5), capped);
      expect(blocking).toHaveLength(1);
      expect(blocking[0]?.rule).toBe('allowlist-overflow');
      expect(blocking[0]?.detail).toContain('3 trang MỚI hỏng');
    });

    it('mọi mẫu /* trong ALLOWLIST thật đều phải có max', () => {
      // Không có max thì mẫu tiền tố = một lỗ hổng im lặng chờ ngày dùng.
      const entries = Object.entries(ALLOWLIST) as [string, { max?: number }][];
      const prefixNoMax = entries
        .filter(([p, e]) => p.endsWith('/*') && typeof e.max !== 'number')
        .map(([p]) => p);
      expect(prefixNoMax).toEqual([]);
    });
  });
});

describe('extractMeta', () => {
  it('rút được title + description và giải mã thực thể HTML', () => {
    const html = `<html><head><title>A &amp; B</title><meta name="description" content="C &quot;D&quot;"/></head></html>`;
    expect(extractMeta(html)).toEqual({ title: 'A & B', description: 'C "D"', h1Count: 0, noindex: false });
  });

  it('trả null khi thiếu, không ném lỗi', () => {
    expect(extractMeta('<html></html>')).toEqual({ title: null, description: null, h1Count: 0, noindex: false });
  });
});

describe('ALLOWLIST', () => {
  it('mọi mục đều phải ghi CHỦ và LÝ DO — nếu không thì nó là chỗ giấu lỗi', () => {
    for (const [url, entry] of Object.entries(ALLOWLIST)) {
      expect(entry.rules.length, `${url} thiếu rules`).toBeGreaterThan(0);
      expect(entry.owner, `${url} thiếu owner`).toBeTruthy();
      expect(entry.note, `${url} thiếu note`).toBeTruthy();
    }
  });

  it('không có key trùng — JS lặng lẽ đè, mất luật mà không báo gì', () => {
    // Đã suýt dính đúng lỗi này khi viết ALLOWLIST: khai '/dashboard' hai lần
    // thì khai sau đè khai trước, một nửa số luật biến mất mà không có cảnh báo.
    // Object đã parse thì không phát hiện được nữa → phải soi mã nguồn.
    const src = readFileSync(
      new URL('../../scripts/seo-guard.mjs', import.meta.url),
      'utf8',
    );
    const body = src.slice(src.indexOf('export const ALLOWLIST'));
    const keys = [...body.matchAll(/^\s{2}'([^']+)':/gm)].map((m) => m[1]);
    const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
    expect(dupes, `key khai trùng: ${dupes.join(', ')}`).toEqual([]);
    expect(keys.length).toBeGreaterThan(5); // chốt: regex phải thật sự bắt được key
  });
});

describe('JSON-LD — dữ liệu có cấu trúc', () => {
  const ld = (obj: unknown) =>
    `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
  const crumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'A', item: 'https://x/a' },
      { '@type': 'ListItem', position: 2, name: 'B', item: 'https://x/b' },
    ],
  };
  const faq = {
    '@type': 'FAQPage',
    mainEntity: [{ '@type': 'Question', name: 'Q?', acceptedAnswer: { text: 'A' } }],
  };

  it('trang lành lặn thì im lặng', () => {
    expect(checkJsonLd(parseJsonLd(ld(crumb) + ld(faq)))).toEqual([]);
  });

  it('bắt khối JSON hỏng cú pháp', () => {
    const html = '<script type="application/ld+json">{ hỏng }</script>';
    expect(checkJsonLd(parseJsonLd(html)).map((v: { rule: string }) => v.rule)).toContain(
      'jsonld-invalid',
    );
  });

  it('bắt khai TRÙNG loại — đúng lỗi #936 phải sửa ở trang chủ', () => {
    const v = checkJsonLd(parseJsonLd(ld(crumb) + ld(crumb)));
    expect(v.map((x: { rule: string }) => x.rule)).toContain('jsonld-duplicate-type');
  });

  it('bắt FAQ rỗng và FAQ thiếu câu trả lời', () => {
    expect(
      checkJsonLd(parseJsonLd(ld({ '@type': 'FAQPage', mainEntity: [] }))).map(
        (x: { rule: string }) => x.rule,
      ),
    ).toContain('jsonld-faq-broken');
    expect(
      checkJsonLd(
        parseJsonLd(ld({ '@type': 'FAQPage', mainEntity: [{ name: 'Q?' }] })),
      ).map((x: { rule: string }) => x.rule),
    ).toContain('jsonld-faq-broken');
  });

  it('bắt breadcrumb sai thứ tự position', () => {
    const broken = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { position: 1, name: 'A', item: 'x' },
        { position: 3, name: 'B', item: 'y' },
      ],
    };
    expect(checkJsonLd(parseJsonLd(ld(broken))).map((x: { rule: string }) => x.rule)).toContain(
      'jsonld-breadcrumb-broken',
    );
  });

  it('bắt trang không có khối JSON-LD nào', () => {
    expect(checkJsonLd(parseJsonLd('<html></html>')).map((x: { rule: string }) => x.rule)).toEqual([
      'jsonld-missing',
    ]);
  });

  it('đọc được cả dạng @graph và mảng', () => {
    expect(parseJsonLd(ld({ '@graph': [crumb, faq] })).nodes).toHaveLength(2);
    expect(parseJsonLd(ld([crumb, faq])).nodes).toHaveLength(2);
  });
});
