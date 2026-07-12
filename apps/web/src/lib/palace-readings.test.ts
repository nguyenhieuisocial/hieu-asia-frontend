/**
 * Kiểm thử dữ liệu khung luận 12 cung (/learn/tu-vi/cung-*).
 *
 * - Đúng 12 entry, slug duy nhất, khớp format cung-*.
 * - Tập slug === tập slug của PALACES_CONTENT (tuvi-content.ts) — hai file
 *   mô tả cùng 12 cung, không được lệch nhau.
 * - Mọi field bách khoa mới (coreQuestion / readingGuide / commonMisreads /
 *   trioNote) non-empty; framework >= 5 bước; decisionQuestions >= 6 câu;
 *   commonMisreads >= 2 mục.
 * - trioNote phải nhắc đủ 4 cung trong bảng trigon của tuvi-content.ts —
 *   bảng đó đã khoá bằng tuvi-content.test.ts, nên đây là chốt chặn để
 *   nội dung chữ không bịa tam phương tứ chính.
 */
import { describe, it, expect } from 'vitest';
import { PALACE_READINGS, findPalaceReading } from './palace-readings';
import { PALACES_CONTENT } from './tuvi-content';

describe('PALACE_READINGS', () => {
  it('có đúng 12 cung', () => {
    expect(PALACE_READINGS).toHaveLength(12);
  });

  it('slug duy nhất + đúng format cung-*', () => {
    const slugs = PALACE_READINGS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(12);
    for (const slug of slugs) {
      expect(slug).toMatch(/^cung-[a-z-]{2,20}$/);
    }
  });

  it('tập slug khớp PALACES_CONTENT trong tuvi-content.ts', () => {
    const readingSlugs = new Set(PALACE_READINGS.map((p) => p.slug));
    const contentSlugs = new Set(PALACES_CONTENT.map((p) => p.slug));
    expect(readingSlugs).toEqual(contentSlugs);
  });

  it('mọi entry đủ field, field mới non-empty, đủ số mục', () => {
    for (const p of PALACE_READINGS) {
      const label = `Cung ${p.name}`;

      // Field cũ vẫn đầy đặn.
      expect(p.name.trim().length, label).toBeGreaterThan(0);
      expect(p.fullName, label).toContain(p.name);
      expect(p.domain.trim().length, label).toBeGreaterThan(0);
      expect(p.governs.trim().length, label).toBeGreaterThan(200);
      expect(p.keyStars.length, label).toBeGreaterThanOrEqual(3);
      for (const s of p.keyStars) {
        expect(s.name.trim().length, `${label} — keyStar`).toBeGreaterThan(0);
        expect(s.signal.trim().length, `${label} — ${s.name}`).toBeGreaterThan(0);
      }
      expect(p.framework.length, label).toBeGreaterThanOrEqual(5);
      expect(p.framework.every((f) => f.trim().length > 0), label).toBe(true);
      expect(p.decisionQuestions.length, label).toBeGreaterThanOrEqual(6);
      expect(p.decisionQuestions.every((q) => q.trim().length > 0), label).toBe(true);

      // Field bách khoa mới.
      expect(p.coreQuestion.trim().length, label).toBeGreaterThan(0);
      expect(p.readingGuide.trim().length, label).toBeGreaterThan(300);
      expect(p.commonMisreads.length, label).toBeGreaterThanOrEqual(2);
      expect(p.commonMisreads.every((m) => m.trim().length > 0), label).toBe(true);
      expect(p.trioNote.trim().length, label).toBeGreaterThan(0);
    }
  });

  it('trioNote nhắc đủ 4 cung theo bảng trigon đã khoá trong tuvi-content.ts', () => {
    for (const p of PALACE_READINGS) {
      const content = PALACES_CONTENT.find((c) => c.slug === p.slug);
      expect(content, `Thiếu PALACES_CONTENT cho ${p.slug}`).toBeDefined();
      if (!content) continue;
      for (const palaceName of content.trigon) {
        expect(
          p.trioNote,
          `trioNote cung ${p.name} phải nhắc "${palaceName}"`,
        ).toContain(palaceName);
      }
    }
  });
});

describe('findPalaceReading', () => {
  it('tìm đúng theo slug', () => {
    expect(findPalaceReading('cung-menh')?.name).toBe('Mệnh');
    expect(findPalaceReading('cung-phu-the')?.name).toBe('Phu Thê');
  });

  it('trả undefined với slug rác', () => {
    expect(findPalaceReading('khong-ton-tai')).toBeUndefined();
    expect(findPalaceReading('')).toBeUndefined();
  });
});
