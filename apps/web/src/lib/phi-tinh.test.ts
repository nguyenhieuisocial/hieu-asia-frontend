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

describe('Bát vận — toàn bộ 24 sơn đối chiếu bảng cổ điển (人-kiểm)', () => {
  // Bảng tra 八运二十四山向飞星局 (《沈氏玄空学》 / lunarhook-sixrandom):
  //   旺山旺向: 未丑亥巳巽乾 · 上山下水: 戌辰申寅坤艮
  //   双星到山(=đáo tọa): 壬甲丁酉午辛 · 双星到向(=đáo hướng): 丙庚癸乙卯子
  const GROUND_TRUTH_VAN8: Record<string, string> = {
    Mùi: 'vuong-son-vuong-huong', Sửu: 'vuong-son-vuong-huong', Hợi: 'vuong-son-vuong-huong',
    Tỵ: 'vuong-son-vuong-huong', Tốn: 'vuong-son-vuong-huong', Càn: 'vuong-son-vuong-huong',
    Tuất: 'thuong-son-ha-thuy', Thìn: 'thuong-son-ha-thuy', Thân: 'thuong-son-ha-thuy',
    Dần: 'thuong-son-ha-thuy', Khôn: 'thuong-son-ha-thuy', Cấn: 'thuong-son-ha-thuy',
    Nhâm: 'song-tinh-dao-toa', Giáp: 'song-tinh-dao-toa', Đinh: 'song-tinh-dao-toa',
    Dậu: 'song-tinh-dao-toa', Ngọ: 'song-tinh-dao-toa', Tân: 'song-tinh-dao-toa',
    Bính: 'song-tinh-dao-huong', Canh: 'song-tinh-dao-huong', Quý: 'song-tinh-dao-huong',
    Ất: 'song-tinh-dao-huong', Mão: 'song-tinh-dao-huong', Tý: 'song-tinh-dao-huong',
  };
  for (const [sit, pattern] of Object.entries(GROUND_TRUTH_VAN8)) {
    it(`Bát vận tọa ${sit} → ${pattern}`, () => {
      expect(computeFlyingStarChart(8, sit).pattern).toBe(pattern);
    });
  }
});

describe('Bất biến phân bố cục theo 三元九运 (216 cục)', () => {
  const dist = (yun: number) => {
    const c: Record<string, number> = {};
    for (const m of MOUNTAINS) {
      const p = computeFlyingStarChart(yun, m.name).pattern;
      c[p] = (c[p] ?? 0) + 1;
    }
    return c;
  };

  it('Vận 2,3,4,6,7,8: mỗi vận chia đều 6/6/6/6 bốn cục', () => {
    for (const yun of [2, 3, 4, 6, 7, 8]) {
      expect(dist(yun)).toEqual({
        'vuong-son-vuong-huong': 6,
        'thuong-son-ha-thuy': 6,
        'song-tinh-dao-huong': 6,
        'song-tinh-dao-toa': 6,
      });
    }
  });

  it('Vận 1 & 9: KHÔNG có Vượng sơn Vượng hướng / Thượng sơn Hạ thủy (chỉ song tinh)', () => {
    // Sự thật cổ điển: "一运、九运没有旺山旺向之局" — engine sai sẽ rớt bẫy này.
    for (const yun of [1, 9]) {
      const d = dist(yun);
      expect(d['vuong-son-vuong-huong']).toBeUndefined();
      expect(d['thuong-son-ha-thuy']).toBeUndefined();
      expect(d['song-tinh-dao-huong']).toBe(12);
      expect(d['song-tinh-dao-toa']).toBe(12);
    }
  });

  it('Vận 5: toàn bộ 24 sơn là Ngũ vận (đặc biệt)', () => {
    expect(dist(5)).toEqual({ 'ngu-van': 24 });
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
