import { describe, it, expect } from 'vitest';
import { buildConGiap2027, CON_GIAP_SLUGS, YEAR, YEAR_CANCHI, YEAR_CHI } from './con-giap-data';
import { getForecast2027 } from './tu-vi-2027-content';

describe('con-giap-data 2027 — năm Đinh Mùi', () => {
  it('năm 2027 = Đinh Mùi, chi Mùi', () => {
    expect(YEAR).toBe(2027);
    expect(YEAR_CANCHI.name).toBe('Đinh Mùi');
    expect(YEAR_CHI).toBe('Mùi');
  });

  it('quan hệ tuổi ↔ Thái Tuế Mùi đúng cho 12 tuổi', () => {
    expect(buildConGiap2027('hoi')!.relation).toBe('tam-hop');
    expect(buildConGiap2027('mao')!.relation).toBe('tam-hop');
    expect(buildConGiap2027('ngo')!.relation).toBe('luc-hop');
    const suu = buildConGiap2027('suu')!;
    expect(suu.relation).toBe('luc-xung');
    expect(suu.isXungThaiTue).toBe(true);
    expect(buildConGiap2027('ty')!.relation).toBe('luc-hai');
    const mui = buildConGiap2027('mui')!;
    expect(mui.relation).toBe('dong-tuoi');
    expect(mui.isNamTuoi).toBe(true);
    for (const s of ['dan', 'thin', 'ti', 'than', 'dau', 'tuat']) {
      expect(buildConGiap2027(s)!.relation).toBe('binh-hoa');
    }
  });

  it('Tam Tai năm Mùi 2027 rơi đúng nhóm Hợi–Mão–Mùi', () => {
    for (const s of ['hoi', 'mao', 'mui']) {
      expect(buildConGiap2027(s)!.isTamTai).toBe(true);
    }
    for (const s of ['ty', 'suu', 'dan', 'thin', 'ti', 'ngo', 'than', 'dau', 'tuat']) {
      expect(buildConGiap2027(s)!.isTamTai).toBe(false);
    }
  });

  it('mỗi tuổi có bảng sao hạn theo năm sinh (cohorts), sao có name + type', () => {
    for (const slug of CON_GIAP_SLUGS) {
      const d = buildConGiap2027(slug)!;
      expect(d.cohorts.length).toBeGreaterThan(0);
      const c = d.cohorts[0]!;
      expect(c.saoNam.name).toBeTruthy();
      expect(['tot', 'xau', 'trung']).toContain(c.saoNam.type);
      expect(c.saoNu.name).toBeTruthy();
    }
  });

  it('build đủ 12 con giáp, slug sai → null; SEO + giọng chống định mệnh', () => {
    expect(CON_GIAP_SLUGS).toHaveLength(12);
    for (const slug of CON_GIAP_SLUGS) {
      const d = buildConGiap2027(slug)!;
      expect(d).not.toBeNull();
      expect(d.seoTitle).toContain('2027');
      expect(d.seoTitle).toContain(d.z.ten);
      // verdict tham khảo, không phán "xui/tai ương"
      expect(d.verdictShort).not.toMatch(/xui|tai ương/i);
    }
    expect(buildConGiap2027('khong-co')).toBeNull();
  });

  it('có đủ văn vận-trình 4 mảng cho cả 12 con giáp', () => {
    for (const slug of CON_GIAP_SLUGS) {
      const f = getForecast2027(slug);
      expect(f, `forecast ${slug}`).toBeTruthy();
      expect(f!.tongQuan.length).toBeGreaterThan(40);
      expect(f!.suNghiep).toBeTruthy();
      expect(f!.taiLoc).toBeTruthy();
      expect(f!.tinhDuyen).toBeTruthy();
      expect(f!.sucKhoe).toBeTruthy();
      expect(f!.loiKhuyen).toBeTruthy();
      expect(f!.faq.length).toBeGreaterThanOrEqual(2);
    }
  });
});
