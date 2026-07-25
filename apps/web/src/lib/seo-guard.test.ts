// Lưới an toàn cho chính cái lưới an toàn (cùng tinh thần với ui-guard.test.ts).
//
// `scripts/seo-guard.mjs` là thứ chặn lỗi meta SEO. Nếu luật của nó hỏng thì nó
// im lặng cho qua tất cả — hỏng kiểu tệ nhất: CI vẫn xanh nhưng không còn bảo
// vệ gì. Đúng kiểu hỏng đã xảy ra ngoài đời: `clampDescription` làm mọi phép
// kiểm "chỉ đo độ dài" báo xanh trong khi 133 trang đang cụt trên SERP.
//
// Test khoá cả hai chiều: BẮT đúng cái xấu, và KHÔNG bắt nhầm cái tốt.
import { describe, it, expect } from 'vitest';
import {
  checkPage,
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
});

describe('extractMeta', () => {
  it('rút được title + description và giải mã thực thể HTML', () => {
    const html = `<html><head><title>A &amp; B</title><meta name="description" content="C &quot;D&quot;"/></head></html>`;
    expect(extractMeta(html)).toEqual({ title: 'A & B', description: 'C "D"' });
  });

  it('trả null khi thiếu, không ném lỗi', () => {
    expect(extractMeta('<html></html>')).toEqual({ title: null, description: null });
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
});
