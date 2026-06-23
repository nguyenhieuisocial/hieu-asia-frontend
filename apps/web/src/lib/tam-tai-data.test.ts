/**
 * Kiểm thử cụm "Tam Tai".
 *
 * - Grounding: tamTaiChis + calendarYears phải KHỚP engine xem-tuoi-cuoi
 *   (checkTamTai / canChiOfYear) — không lệch.
 * - Slug an toàn: Tỵ = "ti" (KHÔNG phải "ty2"), đủ 12 con giáp.
 * - 4 nhóm Tam Hợp phủ đúng 12 con giáp, mỗi nhóm 3 thành viên.
 */
import { describe, it, expect } from 'vitest';
import {
  buildTamTai,
  listTamTai,
  listTamHopGroups,
  TAM_TAI_SLUGS,
  CALENDAR_FROM,
  CALENDAR_TO,
} from './tam-tai-data';
import { canChiOfYear, checkTamTai } from './xem-tuoi-cuoi';

describe('tam-tai-data — slug & cấu trúc', () => {
  it('đủ 12 con giáp, dùng slug "ti" cho Tỵ (không "ty2")', () => {
    expect(TAM_TAI_SLUGS).toHaveLength(12);
    expect(TAM_TAI_SLUGS).toContain('ti');
    expect(TAM_TAI_SLUGS).toContain('ty');
    expect(TAM_TAI_SLUGS).not.toContain('ty2');
    expect(new Set(TAM_TAI_SLUGS).size).toBe(12);
  });

  it('listTamTai trả 12 mục có con vật', () => {
    const list = listTamTai();
    expect(list).toHaveLength(12);
    const ti = list.find((z) => z.slug === 'ti');
    expect(ti?.ten).toBe('Tỵ');
    expect(ti?.animal).toBe('Rắn');
  });

  it('buildTamTai slug sai → null', () => {
    expect(buildTamTai('khong-co')).toBeNull();
    expect(buildTamTai('')).toBeNull();
  });
});

describe('tam-tai-data — đúng nhóm tam hợp', () => {
  it('tuổi Tý (nhóm Thân-Tý-Thìn) phạm Tam Tai vào Dần, Mão, Thìn', () => {
    const d = buildTamTai('ty')!;
    expect(d.tamTaiChis).toEqual(['Dần', 'Mão', 'Thìn']);
    expect(d.groupMembers.map((m) => m.ten)).toEqual(['Tý', 'Thìn', 'Thân']);
  });

  it('tuổi Tỵ (nhóm Tỵ-Dậu-Sửu) phạm Tam Tai vào Hợi, Tý, Sửu', () => {
    const d = buildTamTai('ti')!;
    expect(d.tamTaiChis).toEqual(['Hợi', 'Tý', 'Sửu']);
    expect(d.groupMembers.map((m) => m.ten).sort()).toEqual(['Dậu', 'Sửu', 'Tỵ']);
  });
});

describe('tam-tai-data — 4 nhóm phủ đủ 12 con giáp', () => {
  it('có đúng 4 nhóm, mỗi nhóm 3 thành viên, hợp lại đủ 12 (không trùng)', () => {
    const groups = listTamHopGroups();
    expect(groups).toHaveLength(4);
    const all: string[] = [];
    for (const g of groups) {
      expect(g.members).toHaveLength(3);
      expect(g.tamTaiChis).toHaveLength(3);
      all.push(...g.members.map((m) => m.ten));
    }
    expect(new Set(all).size).toBe(12);
  });
});

describe('tam-tai-data — calendarYears KHỚP engine', () => {
  it('mọi năm trả về đều thực sự là năm Tam Tai (địa chi năm ∈ tamTaiChis) và trong cửa sổ', () => {
    for (const z of listTamTai()) {
      const d = buildTamTai(z.slug)!;
      expect(d.calendarYears.length).toBeGreaterThan(0);
      for (const year of d.calendarYears) {
        expect(d.tamTaiChis).toContain(canChiOfYear(year).chi);
        expect(year).toBeGreaterThanOrEqual(CALENDAR_FROM);
        expect(year).toBeLessThanOrEqual(CALENDAR_TO);
      }
    }
  });

  it('checkTamTai engine xác nhận: sinh 2008 (Tý) phạm Tam Tai năm 2034 (Dần)', () => {
    expect(canChiOfYear(2008).chi).toBe('Tý');
    expect(canChiOfYear(2034).chi).toBe('Dần');
    expect(checkTamTai(2008, 2034).isTamTai).toBe(true);
    expect(buildTamTai('ty')!.calendarYears).toContain(2034);
  });

  it('năm KHÔNG Tam Tai thì không nằm trong danh sách', () => {
    // 2030 = Canh Tuất → Tuất không thuộc Dần/Mão/Thìn (Tam Tai của Tý)
    expect(canChiOfYear(2030).chi).toBe('Tuất');
    expect(buildTamTai('ty')!.calendarYears).not.toContain(2030);
  });
});
