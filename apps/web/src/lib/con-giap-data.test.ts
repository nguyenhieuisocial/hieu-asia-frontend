/**
 * Kiểm thử cụm "12 Con Giáp".
 *
 * - CON_GIAP_SLUGS phải đủ 12, suy từ ZODIAC (không hand-list).
 * - buildConGiap dựng được cho mọi slug + null với slug rác.
 * - Mỗi con giáp có đúng 2 Tam Hợp + 1 Lục Xung; quan hệ Tam Hợp đối xứng.
 * - exampleYears >= 5 và chi của từng năm khớp tên con giáp (engine thật).
 */
import { describe, it, expect } from 'vitest';
import { buildConGiap, listConGiap, CON_GIAP_SLUGS } from './con-giap-data';
import { relationOf } from './hop-tuoi-pairs';
import { canChiOfYear } from './xem-tuoi-cuoi';

describe('CON_GIAP_SLUGS', () => {
  it('có đủ 12 con giáp', () => {
    expect(CON_GIAP_SLUGS).toHaveLength(12);
  });
});

describe('buildConGiap', () => {
  it('trả null với slug không hợp lệ', () => {
    expect(buildConGiap('khong-ton-tai')).toBeNull();
  });

  it('mọi slug đều dựng được + cấu trúc nhất quán', () => {
    for (const slug of CON_GIAP_SLUGS) {
      const d = buildConGiap(slug);
      expect(d).not.toBeNull();
      if (!d) continue;
      expect(d.z.slug).toBe(slug);

      // Tam Hợp: đúng 2 con giáp, không gồm chính nó, quan hệ đúng loại.
      expect(d.tamHop).toHaveLength(2);
      expect(d.tamHop.every((t) => t.slug !== slug)).toBe(true);
      expect(d.tamHop.every((t) => relationOf(slug, t.slug) === 'tam-hop')).toBe(true);

      // Lục Xung: đúng 1 con giáp, khác chính nó, quan hệ đúng loại.
      expect(d.tuHanhXung.slug).not.toBe(slug);
      expect(relationOf(slug, d.tuHanhXung.slug)).toBe('luc-xung');

      // 11 con giáp còn lại.
      expect(d.others).toHaveLength(11);
      expect(d.others.every((o) => o.slug !== slug)).toBe(true);

      // exampleYears >= 5 và chi từng năm khớp tên con giáp.
      expect(d.exampleYears.length).toBeGreaterThanOrEqual(5);
      for (const year of d.exampleYears) {
        expect(canChiOfYear(year).chi).toBe(d.z.ten);
      }

      // FAQ + SEO đủ.
      expect(d.faqs.length).toBeGreaterThanOrEqual(5);
      expect(d.seoTitle).toContain(d.z.ten);
      expect(d.seoDescription.length).toBeGreaterThan(50);
    }
  });

  it('mọi con giáp có hourMonth + pairNotes không rỗng', () => {
    for (const slug of CON_GIAP_SLUGS) {
      const d = buildConGiap(slug)!;
      expect(d.extra.hourMonth.trim().length).toBeGreaterThan(0);
      expect(d.extra.pairNotes.trim().length).toBeGreaterThan(0);
    }
  });

  it('quan hệ Tam Hợp đối xứng', () => {
    for (const slug of CON_GIAP_SLUGS) {
      const d = buildConGiap(slug)!;
      for (const t of d.tamHop) {
        const other = buildConGiap(t.slug)!;
        expect(other.tamHop.map((x) => x.slug)).toContain(slug);
      }
    }
  });

  it('vài cặp Tam Hợp / Lục Xung tiêu biểu', () => {
    // Thân – Tý – Thìn cùng nhóm Tam Hợp.
    expect(buildConGiap('ty')!.tamHop.map((t) => t.slug).sort()).toEqual(['than', 'thin']);
    // Tý – Ngọ Lục Xung.
    expect(buildConGiap('ty')!.tuHanhXung.slug).toBe('ngo');
    expect(buildConGiap('mao')!.tuHanhXung.slug).toBe('dau');
  });
});

describe('listConGiap', () => {
  it('có đủ 12 con giáp, slug khớp CON_GIAP_SLUGS', () => {
    const list = listConGiap();
    expect(list).toHaveLength(12);
    expect(list.map((z) => z.slug)).toEqual(CON_GIAP_SLUGS);
  });
});
