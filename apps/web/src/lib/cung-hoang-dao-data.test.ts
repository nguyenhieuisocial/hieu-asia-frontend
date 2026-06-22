/**
 * Kiểm thử cụm "Cung hoàng đạo".
 *
 * - sunSignFromDate phải khớp cung Mặt Trời cho các ngày NẰM GIỮA cung (tránh ca
 *   sát ranh giới — vốn lệch ±1 ngày tuỳ năm). Engine bên dưới (western-astrology)
 *   đã kiểm chứng <0.01° vs astronomy-engine; ở đây ta kiểm tích hợp + ánh xạ slug.
 * - buildCung phải trả dữ liệu nhất quán cho cả 12 cung (hợp tự nhiên 2, bổ trợ 3,
 *   cung đối = idx+6).
 */
import { describe, it, expect } from 'vitest';
import { buildCung, listCung, sunSignFromDate, CUNG_SLUGS } from './cung-hoang-dao-data';

describe('sunSignFromDate', () => {
  const cases: { date: [number, number, number]; sign: string; slug: string }[] = [
    { date: [1995, 4, 5], sign: 'Bạch Dương', slug: 'bach-duong' },
    { date: [1990, 5, 5], sign: 'Kim Ngưu', slug: 'kim-nguu' },
    { date: [1988, 6, 10], sign: 'Song Tử', slug: 'song-tu' },
    { date: [2010, 7, 1], sign: 'Cự Giải', slug: 'cu-giai' },
    { date: [1990, 8, 10], sign: 'Sư Tử', slug: 'su-tu' },
    { date: [1992, 9, 5], sign: 'Xử Nữ', slug: 'xu-nu' },
    { date: [2001, 10, 5], sign: 'Thiên Bình', slug: 'thien-binh' },
    { date: [2001, 11, 10], sign: 'Bọ Cạp', slug: 'bo-cap' },
    { date: [1999, 12, 5], sign: 'Nhân Mã', slug: 'nhan-ma' },
    { date: [2000, 1, 5], sign: 'Ma Kết', slug: 'ma-ket' },
    { date: [1996, 2, 5], sign: 'Bảo Bình', slug: 'bao-binh' },
    { date: [1993, 3, 5], sign: 'Song Ngư', slug: 'song-ngu' },
  ];

  for (const c of cases) {
    it(`${c.date.join('-')} → ${c.sign}`, () => {
      const r = sunSignFromDate(c.date[0], c.date[1], c.date[2]);
      expect(r.sign.name).toBe(c.sign);
      expect(r.slug).toBe(c.slug);
    });
  }
});

describe('buildCung', () => {
  it('trả null với slug không hợp lệ', () => {
    expect(buildCung('khong-ton-tai')).toBeNull();
  });

  it('mọi slug đều dựng được + cấu trúc nhất quán', () => {
    for (const slug of CUNG_SLUGS) {
      const d = buildCung(slug);
      expect(d).not.toBeNull();
      if (!d) continue;
      expect(d.slug).toBe(slug);
      // Hợp tự nhiên: 2 cung cùng nguyên tố (không gồm chính nó).
      expect(d.sameElement).toHaveLength(2);
      expect(d.sameElement.every((s) => s.slug !== slug)).toBe(true);
      // Bổ trợ: 2 cung nguyên tố bổ trợ (đã loại cung đối — opposition ≠ sextile).
      expect(d.support).toHaveLength(2);
      // Cung đối = idx + 6.
      expect(d.opposite.slug).toBe(CUNG_SLUGS[(d.idx + 6) % 12]);
      // Cung đối KHÔNG được nằm trong danh sách bổ trợ (không mâu thuẫn nhãn).
      expect(d.support.every((s) => s.slug !== d.opposite.slug)).toBe(true);
      // sameElement cũng không chứa cung đối (khác nguyên tố).
      expect(d.sameElement.every((s) => s.slug !== d.opposite.slug)).toBe(true);
      // FAQ + SEO đủ.
      expect(d.faqs.length).toBeGreaterThanOrEqual(4);
      expect(d.seoTitle).toContain(d.z.name);
      expect(d.seoDescription.length).toBeGreaterThan(50);
    }
  });

  it('cung đối đúng vài cặp tiêu biểu', () => {
    expect(buildCung('bach-duong')!.opposite.slug).toBe('thien-binh');
    expect(buildCung('su-tu')!.opposite.slug).toBe('bao-binh');
    expect(buildCung('kim-nguu')!.opposite.slug).toBe('bo-cap');
  });
});

describe('listCung', () => {
  it('có đủ 12 cung, slug khớp CUNG_SLUGS', () => {
    const list = listCung();
    expect(list).toHaveLength(12);
    expect(list.map((s) => s.slug)).toEqual([...CUNG_SLUGS]);
  });
});
