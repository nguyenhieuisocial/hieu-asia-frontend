import { describe, it, expect } from 'vitest';
import { ZODIAC, relationOf, type RelationKind } from './hop-tuoi-pairs';

/**
 * Kiểm thử hồi quy — engine HỢP TUỔI (phân loại quan hệ 12 con giáp theo Can Chi).
 *
 * Các giá trị KỲ VỌNG dưới đây được suy ra ĐỘC LẬP từ luật cổ điển trên 12 Địa
 * Chi (KHÔNG sao chép output engine):
 *   Tý Sửu Dần Mão Thìn Tỵ Ngọ Mùi Thân Dậu Tuất Hợi
 *   slug:  ty suu dan mao thin ti  ngo mui than dau tuat hoi   (Tỵ = "ti")
 *
 * TAM HỢP (4 tam giác):  {Thân,Tý,Thìn} {Dần,Ngọ,Tuất} {Tỵ,Dậu,Sửu} {Hợi,Mão,Mùi}
 * LỤC HỢP (6 cặp):       Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
 * LỤC XUNG (6 cặp đối):  Tý-Ngọ, Sửu-Mùi, Dần-Thân, Mão-Dậu, Thìn-Tuất, Tỵ-Hợi
 * LỤC HẠI (6 cặp hại):   Tý-Mùi, Sửu-Ngọ, Dần-Tỵ, Mão-Thìn, Thân-Hợi, Dậu-Tuất
 */

// --- Tập kỳ vọng độc lập (suy từ luật, viết tay theo slug) -------------------

const EXPECTED_TAM_HOP_TRINES: ReadonlyArray<readonly [string, string, string]> = [
  ['than', 'ty', 'thin'],
  ['dan', 'ngo', 'tuat'],
  ['ti', 'dau', 'suu'],
  ['hoi', 'mao', 'mui'],
];

const EXPECTED_LUC_HOP: ReadonlyArray<readonly [string, string]> = [
  ['ty', 'suu'],
  ['dan', 'hoi'],
  ['mao', 'tuat'],
  ['thin', 'dau'],
  ['ti', 'than'],
  ['ngo', 'mui'],
];

const EXPECTED_LUC_XUNG: ReadonlyArray<readonly [string, string]> = [
  ['ty', 'ngo'],
  ['suu', 'mui'],
  ['dan', 'than'],
  ['mao', 'dau'],
  ['thin', 'tuat'],
  ['ti', 'hoi'],
];

const EXPECTED_LUC_HAI: ReadonlyArray<readonly [string, string]> = [
  ['ty', 'mui'],
  ['suu', 'ngo'],
  ['dan', 'ti'],
  ['mao', 'thin'],
  ['than', 'hoi'],
  ['dau', 'tuat'],
];

const ALL_SLUGS = [
  'ty', 'suu', 'dan', 'mao', 'thin', 'ti',
  'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi',
] as const;

const key = (a: string, b: string) => [a, b].sort().join('|');

/** Mở 4 tam giác thành 12 cặp (mỗi tam giác → 3 cặp). */
function tamHopPairKeys(): Set<string> {
  const s = new Set<string>();
  for (const [a, b, c] of EXPECTED_TAM_HOP_TRINES) {
    s.add(key(a, b));
    s.add(key(b, c));
    s.add(key(a, c));
  }
  return s;
}

// --- Sanity của chính bộ kỳ vọng (tự kiểm tra trước khi so engine) ----------

describe('hop-tuoi › bộ kỳ vọng độc lập tự nhất quán', () => {
  it('engine vẫn export đúng 12 con giáp với slug khớp Địa Chi', () => {
    expect(ZODIAC).toHaveLength(12);
    expect(ZODIAC.map((z) => z.slug)).toEqual([...ALL_SLUGS]);
  });

  it('4 tam giác Tam Hợp → đúng 12 cặp khác nhau', () => {
    expect(tamHopPairKeys().size).toBe(12);
  });

  it('Lục Hợp/Xung/Hại mỗi nhóm đúng 6 cặp, không trùng nội bộ', () => {
    expect(new Set(EXPECTED_LUC_HOP.map(([a, b]) => key(a, b))).size).toBe(6);
    expect(new Set(EXPECTED_LUC_XUNG.map(([a, b]) => key(a, b))).size).toBe(6);
    expect(new Set(EXPECTED_LUC_HAI.map(([a, b]) => key(a, b))).size).toBe(6);
  });

  it('Lục Xung đúng là cặp đối 6 ô (cách nhau 6 vị trí trên vòng 12 chi)', () => {
    const order = new Map<string, number>(ALL_SLUGS.map((s, i) => [s, i]));
    for (const [a, b] of EXPECTED_LUC_XUNG) {
      const d = Math.abs((order.get(a)! - order.get(b)! + 12) % 12);
      expect(d).toBe(6);
    }
  });
});

// --- Phân loại từng cặp cụ thể (engine khớp giá trị suy độc lập) -------------

describe('hop-tuoi › relationOf phân loại đúng từng cặp tiêu biểu', () => {
  it('cùng tuổi → dong-tuoi', () => {
    expect(relationOf('ty', 'ty')).toBe('dong-tuoi');
    expect(relationOf('hoi', 'hoi')).toBe('dong-tuoi');
  });

  it('Tam Hợp: Thân-Tý-Thìn (3 cặp) → tam-hop', () => {
    expect(relationOf('than', 'ty')).toBe('tam-hop');
    expect(relationOf('ty', 'thin')).toBe('tam-hop');
    expect(relationOf('than', 'thin')).toBe('tam-hop');
  });

  it('Tam Hợp: Hợi-Mão-Mùi → tam-hop (cả thứ tự đảo)', () => {
    expect(relationOf('hoi', 'mao')).toBe('tam-hop');
    expect(relationOf('mao', 'hoi')).toBe('tam-hop');
    expect(relationOf('mui', 'hoi')).toBe('tam-hop');
  });

  it('Lục Hợp: Tý-Sửu, Tỵ-Thân, Ngọ-Mùi → luc-hop', () => {
    expect(relationOf('ty', 'suu')).toBe('luc-hop');
    expect(relationOf('ti', 'than')).toBe('luc-hop');
    expect(relationOf('mui', 'ngo')).toBe('luc-hop'); // đảo thứ tự
  });

  it('Lục Xung: Tý-Ngọ, Dần-Thân, Tỵ-Hợi → luc-xung', () => {
    expect(relationOf('ty', 'ngo')).toBe('luc-xung');
    expect(relationOf('dan', 'than')).toBe('luc-xung');
    expect(relationOf('hoi', 'ti')).toBe('luc-xung'); // đảo thứ tự
  });

  it('Lục Hại: Tý-Mùi, Mão-Thìn, Dậu-Tuất → luc-hai', () => {
    expect(relationOf('ty', 'mui')).toBe('luc-hai');
    expect(relationOf('mao', 'thin')).toBe('luc-hai');
    expect(relationOf('tuat', 'dau')).toBe('luc-hai'); // đảo thứ tự
  });

  it('Bình hoà: cặp không thuộc nhóm nào → binh-hoa (vd Tý-Dần, Sửu-Dần)', () => {
    expect(relationOf('ty', 'dan')).toBe('binh-hoa');
    expect(relationOf('suu', 'dan')).toBe('binh-hoa');
  });

  it('relationOf đối xứng theo thứ tự tham số', () => {
    for (const a of ALL_SLUGS) {
      for (const b of ALL_SLUGS) {
        expect(relationOf(a, b)).toBe(relationOf(b, a));
      }
    }
  });
});

// --- Engine khớp TOÀN BỘ tập kỳ vọng độc lập --------------------------------

describe('hop-tuoi › engine khớp toàn bộ luật cổ điển suy độc lập', () => {
  it('mọi cặp Tam Hợp suy độc lập → engine trả tam-hop', () => {
    for (const k of tamHopPairKeys()) {
      const [a, b] = k.split('|') as [string, string];
      expect(relationOf(a, b)).toBe('tam-hop');
    }
  });

  it('mọi cặp Lục Hợp suy độc lập → engine trả luc-hop', () => {
    for (const [a, b] of EXPECTED_LUC_HOP) {
      expect(relationOf(a, b)).toBe('luc-hop');
    }
  });

  it('mọi cặp Lục Xung suy độc lập → engine trả luc-xung', () => {
    for (const [a, b] of EXPECTED_LUC_XUNG) {
      expect(relationOf(a, b)).toBe('luc-xung');
    }
  });

  it('mọi cặp Lục Hại suy độc lập → engine trả luc-hai', () => {
    for (const [a, b] of EXPECTED_LUC_HAI) {
      expect(relationOf(a, b)).toBe('luc-hai');
    }
  });
});

// --- Loại trừ lẫn nhau + đếm tổng quát --------------------------------------

describe('hop-tuoi › các nhóm loại trừ lẫn nhau & đếm sane', () => {
  it('các tập luật KHÔNG giao nhau (1 cặp không vừa hợp vừa xung/hại)', () => {
    const tam = tamHopPairKeys();
    const hop = new Set(EXPECTED_LUC_HOP.map(([a, b]) => key(a, b)));
    const xung = new Set(EXPECTED_LUC_XUNG.map(([a, b]) => key(a, b)));
    const hai = new Set(EXPECTED_LUC_HAI.map(([a, b]) => key(a, b)));

    const union = new Set<string>([...tam, ...hop, ...xung, ...hai]);
    // 12 + 6 + 6 + 6 = 30 cặp, không trùng nhau ⇒ size đúng 30.
    expect(union.size).toBe(30);
  });

  it('quét toàn bộ 66 cặp khác tuổi: đếm theo loại đúng như luật', () => {
    const counts: Record<RelationKind, number> = {
      'tam-hop': 0,
      'luc-hop': 0,
      'luc-xung': 0,
      'luc-hai': 0,
      'dong-tuoi': 0,
      'binh-hoa': 0,
    };
    const seen = new Set<string>();
    for (const a of ALL_SLUGS) {
      for (const b of ALL_SLUGS) {
        if (a === b) continue;
        const k = key(a, b);
        if (seen.has(k)) continue;
        seen.add(k);
        counts[relationOf(a, b)] += 1;
      }
    }

    // C(12,2) = 66 cặp không trùng, không có cùng-tuổi.
    expect(seen.size).toBe(66);
    expect(counts['dong-tuoi']).toBe(0);
    expect(counts['tam-hop']).toBe(12);
    expect(counts['luc-hop']).toBe(6);
    expect(counts['luc-xung']).toBe(6);
    expect(counts['luc-hai']).toBe(6);
    // Còn lại bình hoà: 66 - 30 = 36.
    expect(counts['binh-hoa']).toBe(36);
    // Tổng kiểm tra.
    const total =
      counts['tam-hop'] +
      counts['luc-hop'] +
      counts['luc-xung'] +
      counts['luc-hai'] +
      counts['binh-hoa'];
    expect(total).toBe(66);
  });
});
