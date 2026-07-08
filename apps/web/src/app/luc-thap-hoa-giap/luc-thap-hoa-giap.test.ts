import { describe, it, expect } from 'vitest';
import { yearProfile } from '../../lib/sinh-con';

// Lục Thập Hoa Giáp: 1984 = Giáp Tý (đầu vòng) → 60 năm phủ đủ 60 Can Chi.
describe('Lục Thập Hoa Giáp (link-bait #3)', () => {
  it('1984 = Giáp Tý (đầu vòng), 2043 = Quý Hợi (cuối vòng)', () => {
    expect(yearProfile(1984)?.canChi).toBe('Giáp Tý');
    expect(yearProfile(2043)?.canChi).toBe('Quý Hợi');
  });

  it('60 năm liên tiếp = 60 Can Chi PHÂN BIỆT (đủ vòng)', () => {
    const set = new Set<string>();
    for (let y = 1984; y < 1984 + 60; y++) set.add(yearProfile(y)!.canChi);
    expect(set.size).toBe(60);
  });

  it('lặp đúng mỗi 60 năm (1984 ≡ 2044 về Can Chi + nạp âm)', () => {
    expect(yearProfile(2044)?.canChi).toBe(yearProfile(1984)?.canChi);
    expect(yearProfile(2044)?.napAmName).toBe(yearProfile(1984)?.napAmName);
  });

  it('mỗi dòng có nạp âm không rỗng', () => {
    for (let y = 1984; y < 1984 + 60; y++) {
      expect(yearProfile(y)?.napAmName?.length ?? 0).toBeGreaterThan(0);
    }
  });
});
