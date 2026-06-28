/**
 * Kiểm thử engine Huyền Không Phi Tinh.
 *
 * Mỏ neo độ chính xác: tái lập các cục KINH ĐIỂN đã được công nhận rộng rãi —
 * "Bát vận Sửu sơn Mùi hướng = Vượng sơn Vượng hướng (旺山旺向)" là một trong những
 * lá số mẫu nổi tiếng nhất; nếu engine ra đúng cục này (sơn tinh đương vận tới tọa,
 * hướng tinh đương vận tới hướng) thì thuật toán + bảng âm-dương 24 sơn là đúng.
 */
import { describe, it, expect } from 'vitest';
import {
  computeFlyingStarChart,
  flyPlate,
  facingOf,
  MOUNTAINS,
  yunOfYear,
} from './phi-tinh';

describe('flyPlate — phi bố Lạc Thư', () => {
  it('Bát vận nhập trung phi thuận → địa bàn đúng', () => {
    // grid: [Tốn, Ly, Khôn, Chấn, Trung, Đoài, Cấn, Khảm, Càn]
    expect(flyPlate(8, true)).toEqual([7, 3, 5, 6, 8, 1, 2, 4, 9]);
  });
  it('phi thuận rồi phi nghịch cùng tâm → trung cung giữ nguyên', () => {
    expect(flyPlate(5, true)[4]).toBe(5);
    expect(flyPlate(5, false)[4]).toBe(5);
  });
});

describe('facingOf — hướng là đối cung của tọa (+180°)', () => {
  it('Tý (Bắc) → Ngọ (Nam)', () => {
    expect(facingOf(MOUNTAINS.find((m) => m.name === 'Tý')!).name).toBe('Ngọ');
  });
  it('Sửu → Mùi', () => {
    expect(facingOf(MOUNTAINS.find((m) => m.name === 'Sửu')!).name).toBe('Mùi');
  });
});

describe('computeFlyingStarChart — cục kinh điển (mỏ neo chính xác)', () => {
  it('Bát vận Sửu sơn Mùi hướng = Vượng sơn Vượng hướng (旺山旺向)', () => {
    const c = computeFlyingStarChart(8, 'Sửu');
    expect(c.facing.name).toBe('Mùi');
    expect(c.pattern).toBe('vuong-son-vuong-huong');
    // sơn tinh đương vận (8) tới cung tọa (Cấn/grid6); hướng tinh (8) tới cung hướng (Khôn/grid2)
    expect(c.sonPlate[6]).toBe(8);
    expect(c.huongPlate[2]).toBe(8);
    // toàn bàn (regression — tính theo thuật toán đã kiểm chứng)
    expect(c.vanPlate).toEqual([7, 3, 5, 6, 8, 1, 2, 4, 9]);
    expect(c.sonPlate).toEqual([3, 7, 5, 4, 2, 9, 8, 6, 1]);
    expect(c.huongPlate).toEqual([6, 1, 8, 7, 5, 3, 2, 9, 4]);
    expect(c.sonForward).toBe(false);
    expect(c.huongForward).toBe(false);
  });

  it('Bát vận Mùi sơn Sửu hướng = Vượng sơn Vượng hướng (đối cục)', () => {
    const c = computeFlyingStarChart(8, 'Mùi');
    expect(c.facing.name).toBe('Sửu');
    expect(c.pattern).toBe('vuong-son-vuong-huong');
  });

  it('Bát vận Tý sơn Ngọ hướng = Song tinh đáo hướng (雙星到向)', () => {
    const c = computeFlyingStarChart(8, 'Tý');
    expect(c.facing.name).toBe('Ngọ');
    expect(c.pattern).toBe('song-tinh-dao-huong');
    // cả sơn tinh lẫn hướng tinh đương vận (8) đều tới cung hướng (Ly/grid1)
    expect(c.sonPlate[1]).toBe(8);
    expect(c.huongPlate[1]).toBe(8);
  });

  it('mỗi cung có đủ 3 sao 1..9; bàn vận = phi thuận từ số vận', () => {
    const c = computeFlyingStarChart(9, 'Càn');
    expect(c.palaces).toHaveLength(9);
    for (const p of c.palaces) {
      for (const s of [p.van, p.son, p.huong]) expect(s).toBeGreaterThanOrEqual(1);
      for (const s of [p.van, p.son, p.huong]) expect(s).toBeLessThanOrEqual(9);
    }
    expect(c.vanPlate[4]).toBe(9); // Cửu vận → 9 nhập trung
  });
});

describe('yunOfYear — nguyên vận theo năm', () => {
  it('2004–2023 = Bát vận; 2024–2043 = Cửu vận', () => {
    expect(yunOfYear(2004)).toBe(8);
    expect(yunOfYear(2023)).toBe(8);
    expect(yunOfYear(2024)).toBe(9);
    expect(yunOfYear(2043)).toBe(9);
    expect(yunOfYear(1984)).toBe(7);
  });
});
