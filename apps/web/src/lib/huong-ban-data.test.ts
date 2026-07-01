/**
 * Kiểm thử cụm "Hướng bàn làm việc / bàn học" (/huong-ban-lam-viec).
 *
 * Grounding: deskDirections chỉ ÁP DỤNG computeHuongNha (đã verify ở huong-nha).
 * Bất biến cần khoá:
 *  - workDir LUÔN mang sao Sinh Khí; studyDir LUÔN mang sao Phục Vị (mỗi cung phi
 *    có đúng 1 hướng mỗi sao) → 2 gợi ý chính không bao giờ rỗng/sai.
 *  - good = 4 hướng tốt, bad = 4 hướng xấu, không trùng.
 */
import { describe, it, expect } from 'vitest';
import { deskDirections, DESK_USE, isValidBirthYear } from './huong-ban-data';

describe('deskDirections — biên', () => {
  it('trả null khi năm ngoài 1930–2026', () => {
    expect(deskDirections(1929, 'nam')).toBeNull();
    expect(deskDirections(2027, 'nu')).toBeNull();
    expect(deskDirections(Number.NaN, 'nam')).toBeNull();
    expect(isValidBirthYear(1990)).toBe(true);
  });
});

describe('deskDirections — bất biến toàn dải × 2 giới', () => {
  it('workDir=Sinh Khí, studyDir=Phục Vị; good/bad 4-4 không trùng', () => {
    for (let y = 1930; y <= 2026; y++) {
      for (const g of ['nam', 'nu'] as const) {
        const d = deskDirections(y, g);
        expect(d, `năm ${y} ${g}`).not.toBeNull();
        if (!d) continue;
        expect(d.workDir.star, `${y} ${g} work`).toBe('sinh_khi');
        expect(d.studyDir.star, `${y} ${g} study`).toBe('phuc_vi');
        expect(d.good.length, `${y} ${g} good`).toBe(4);
        expect(d.bad.length, `${y} ${g} bad`).toBe(4);
        expect(d.good.every((x) => x.good), `${y} ${g} good=tốt`).toBe(true);
        expect(d.bad.every((x) => !x.good), `${y} ${g} bad=xấu`).toBe(true);
        const dirs = new Set([...d.good, ...d.bad].map((x) => x.direction));
        expect(dirs.size, `${y} ${g} 8 hướng riêng biệt`).toBe(8);
        // workDir & studyDir phải nằm trong nhóm good.
        expect(d.good.map((x) => x.direction)).toContain(d.workDir.direction);
        expect(d.good.map((x) => x.direction)).toContain(d.studyDir.direction);
      }
    }
  });
});

describe('DESK_USE', () => {
  it('phủ đúng 4 sao tốt, không trùng', () => {
    const stars = DESK_USE.map((d) => d.star).sort();
    expect(stars).toEqual(['dien_nien', 'phuc_vi', 'sinh_khi', 'thien_y']);
    expect(DESK_USE.every((d) => d.name && d.use)).toBe(true);
  });
});
