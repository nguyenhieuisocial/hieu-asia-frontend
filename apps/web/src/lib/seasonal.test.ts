import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { SEASONAL_PAGES, expiredSeasonalTarget } from './seasonal';

const APP_DIR = join(process.cwd(), 'src/app');

describe('seasonal pages (S10)', () => {
  it('does not redirect while still within its relevant year', () => {
    expect(expiredSeasonalTarget('/thang-co-hon-2026', new Date('2026-09-01T00:00:00Z'))).toBeNull();
    expect(expiredSeasonalTarget('/xuat-hanh-2027', new Date('2027-02-06T00:00:00Z'))).toBeNull();
  });

  it('redirects to its evergreen target once the year has passed', () => {
    expect(expiredSeasonalTarget('/thang-co-hon-2026', new Date('2027-03-01T00:00:00Z'))).toBe('/lich-van-nien');
    expect(expiredSeasonalTarget('/xuat-hanh-2027', new Date('2028-01-01T00:00:00Z'))).toBe('/xuat-hanh');
  });

  it('returns null for non-seasonal paths', () => {
    expect(expiredSeasonalTarget('/tu-vi', new Date('2030-01-01T00:00:00Z'))).toBeNull();
    expect(expiredSeasonalTarget('/tu-vi-2026', new Date('2030-01-01T00:00:00Z'))).toBeNull();
  });

  it('every seasonal page + its evergreen target are real, distinct routes', () => {
    for (const [path, s] of Object.entries(SEASONAL_PAGES)) {
      expect(existsSync(join(APP_DIR, path, 'page.tsx'))).toBe(true);
      expect(existsSync(join(APP_DIR, s.evergreen, 'page.tsx'))).toBe(true);
      expect(s.evergreen).not.toBe(path);
    }
  });
});
