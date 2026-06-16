import { describe, it, expect } from 'vitest';
import { QUE_PAGES, TRIGRAMS, getQue } from './que-kinh-dich';

/**
 * Kiểm thử hồi quy — thư viện 64 quẻ Kinh Dịch (trình tự King Wen).
 *
 * Giá trị kỳ vọng được SUY RA ĐỘC LẬP từ luật cổ điển (không phải copy output
 * của engine), rồi đối chiếu engine khớp với luật đó:
 *  - 64 quẻ, id 1..64 liên tục.
 *  - binary 6-bit duy nhất (Set.size === 64).
 *  - tên King Wen các quẻ mốc (Thuần Càn/Khôn, Thái↔Bĩ, Ký Tế/Vị Tế).
 *  - tách quái: trên = binary[0:3], dưới = binary[3:6], tra qua TRIGRAMS.
 *  - slug dạng kebab-case.
 */

// Bảng 8 quái — SUY RA ĐỘC LẬP từ luật cổ điển (3 hào dưới→trên đọc trong chuỗi
// bit "trên→dưới" theo ký tự). 1 = dương (hào liền), 0 = âm (hào đứt).
const EXPECTED_TRIGRAMS: Record<string, { ten: string; tuong: string }> = {
  '111': { ten: 'Càn', tuong: 'Trời' },
  '000': { ten: 'Khôn', tuong: 'Đất' },
  '001': { ten: 'Chấn', tuong: 'Sấm' },
  '010': { ten: 'Khảm', tuong: 'Nước' },
  '100': { ten: 'Cấn', tuong: 'Núi' },
  '011': { ten: 'Đoài', tuong: 'Đầm' },
  '101': { ten: 'Ly', tuong: 'Lửa' },
  '110': { ten: 'Tốn', tuong: 'Gió' },
};

describe('que-kinh-dich › cấu trúc danh sách 64 quẻ', () => {
  it('có đúng 64 quẻ', () => {
    expect(QUE_PAGES).toHaveLength(64);
  });

  it('id chạy liên tục 1..64, không trùng không hụt', () => {
    const ids = QUE_PAGES.map((q) => q.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 64 }, (_, i) => i + 1));
    // không trùng
    expect(new Set(ids).size).toBe(64);
  });

  it('binary 6-bit duy nhất trên toàn bộ 64 quẻ (Set.size === 64)', () => {
    const bins = QUE_PAGES.map((q) => q.binary);
    expect(new Set(bins).size).toBe(64);
    // mỗi binary đúng 6 ký tự, chỉ gồm 0/1
    for (const q of QUE_PAGES) {
      expect(q.binary).toMatch(/^[01]{6}$/);
    }
  });

  it('binary phủ kín đủ 64 tổ hợp 6-bit (000000..111111)', () => {
    // 64 quẻ + 64 binary duy nhất + đều hợp lệ ⇒ phủ kín mọi tổ hợp.
    const all = new Set(Array.from({ length: 64 }, (_, n) => n.toString(2).padStart(6, '0')));
    const bins = new Set(QUE_PAGES.map((q) => q.binary));
    expect(bins).toEqual(all);
  });
});

describe('que-kinh-dich › tên King Wen các quẻ mốc', () => {
  const byId = (id: number) => QUE_PAGES.find((q) => q.id === id)!;

  it('#1 = Thuần Càn, sáu hào dương (111111)', () => {
    const q = byId(1);
    expect(q.nameVi).toBe('Thuần Càn');
    expect(q.binary).toBe('111111');
  });

  it('#2 = Thuần Khôn, sáu hào âm (000000)', () => {
    const q = byId(2);
    expect(q.nameVi).toBe('Thuần Khôn');
    expect(q.binary).toBe('000000');
  });

  it('#11 = Địa Thiên Thái', () => {
    expect(byId(11).nameVi).toBe('Địa Thiên Thái');
  });

  it('#12 = Thiên Địa Bĩ', () => {
    expect(byId(12).nameVi).toBe('Thiên Địa Bĩ');
  });

  it('Thái ↔ Bĩ là quẻ đảo nhau (binary đảo bit)', () => {
    const thai = byId(11).binary; // 000111
    const bi = byId(12).binary; // 111000
    expect(thai).toBe('000111');
    expect(bi).toBe('111000');
    // đảo từng bit của Thái ra Bĩ
    const flipped = thai.split('').map((c) => (c === '0' ? '1' : '0')).join('');
    expect(flipped).toBe(bi);
  });

  it('#63 = Thủy Hỏa Ký Tế (010101)', () => {
    const q = byId(63);
    expect(q.nameVi).toBe('Thủy Hỏa Ký Tế');
    expect(q.binary).toBe('010101');
  });

  it('#64 = Hỏa Thủy Vị Tế (101010)', () => {
    const q = byId(64);
    expect(q.nameVi).toBe('Hỏa Thủy Vị Tế');
    expect(q.binary).toBe('101010');
  });

  it('Ký Tế ↔ Vị Tế là quẻ đảo nhau (binary đảo bit)', () => {
    const kyTe = byId(63).binary;
    const viTe = byId(64).binary;
    const flipped = kyTe.split('').map((c) => (c === '0' ? '1' : '0')).join('');
    expect(flipped).toBe(viTe);
  });
});

describe('que-kinh-dich › bảng 8 quái (TRIGRAMS)', () => {
  it('khớp bảng quái suy ra độc lập từ luật cổ điển', () => {
    expect(TRIGRAMS).toEqual(EXPECTED_TRIGRAMS);
  });
});

describe('que-kinh-dich › tách quái trên/dưới (upper=bits[0:3], lower=bits[3:6])', () => {
  // Helper suy ra độc lập: tra quái từ 3 bit.
  const trigram = (bits: string) => EXPECTED_TRIGRAMS[bits];

  it('#1 Thuần Càn = Càn (trên) / Càn (dưới)', () => {
    const q = QUE_PAGES.find((x) => x.id === 1)!;
    const upper = trigram(q.binary.slice(0, 3));
    const lower = trigram(q.binary.slice(3, 6));
    expect(upper.ten).toBe('Càn');
    expect(lower.ten).toBe('Càn');
  });

  it('#3 Thủy Lôi Truân = Khảm/Nước (trên) / Chấn/Sấm (dưới)', () => {
    const q = QUE_PAGES.find((x) => x.id === 3)!;
    expect(q.binary).toBe('010001');
    const upper = trigram(q.binary.slice(0, 3));
    const lower = trigram(q.binary.slice(3, 6));
    expect(upper.ten).toBe('Khảm');
    expect(upper.tuong).toBe('Nước');
    expect(lower.ten).toBe('Chấn');
    expect(lower.tuong).toBe('Sấm');
  });

  it('#4 Sơn Thủy Mông = Cấn/Núi (trên) / Khảm/Nước (dưới)', () => {
    const q = QUE_PAGES.find((x) => x.id === 4)!;
    expect(q.binary).toBe('100010');
    const upper = trigram(q.binary.slice(0, 3));
    const lower = trigram(q.binary.slice(3, 6));
    expect(upper.ten).toBe('Cấn');
    expect(upper.tuong).toBe('Núi');
    expect(lower.ten).toBe('Khảm');
    expect(lower.tuong).toBe('Nước');
  });

  it('nameVi của mọi quẻ khớp <tượng-trên> <tượng-dưới> suy từ binary', () => {
    // Luật cổ điển: tên kép = "<hình tượng quái trên> <hình tượng quái dưới>"
    // (vd 010001 → Nước/Thủy + Sấm/Lôi = "Thủy Lôi"). Hai quẻ Thuần thì cả hai
    // quái trùng tên (Thuần <tên quái>). Map tượng→âm Hán-Việt dùng trong tên quẻ.
    const elementHanViet: Record<string, string> = {
      'Trời': 'Thiên',
      'Đất': 'Địa',
      'Sấm': 'Lôi',
      'Nước': 'Thủy',
      'Núi': 'Sơn',
      'Đầm': 'Trạch',
      'Lửa': 'Hỏa',
      'Gió': 'Phong',
    };
    for (const q of QUE_PAGES) {
      const upper = trigram(q.binary.slice(0, 3));
      const lower = trigram(q.binary.slice(3, 6));
      if (upper.ten === lower.ten) {
        // quẻ Thuần (8 quẻ thuần quái): nameVi bắt đầu bằng "Thuần "
        expect(q.nameVi.startsWith('Thuần ')).toBe(true);
      } else {
        const expectedPrefix = `${elementHanViet[upper.tuong]} ${elementHanViet[lower.tuong]} `;
        expect(q.nameVi.startsWith(expectedPrefix)).toBe(true);
      }
    }
  });
});

describe('que-kinh-dich › slug', () => {
  it('mọi slug đều là kebab-case (a-z0-9 + dấu gạch nối)', () => {
    for (const q of QUE_PAGES) {
      expect(q.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it('slug duy nhất trên toàn bộ 64 quẻ', () => {
    const slugs = QUE_PAGES.map((q) => q.slug);
    expect(new Set(slugs).size).toBe(64);
  });

  it('vài slug mốc đúng dạng kebab', () => {
    const byId = (id: number) => QUE_PAGES.find((q) => q.id === id)!;
    expect(byId(1).slug).toBe('thuan-can');
    expect(byId(3).slug).toBe('thuy-loi-truan');
    expect(byId(4).slug).toBe('son-thuy-mong');
  });

  it('getQue(slug) trả đúng quẻ; slug lạ trả undefined', () => {
    expect(getQue('thuan-can')?.id).toBe(1);
    expect(getQue('thuy-hoa-ky-te')?.id).toBe(63);
    expect(getQue('khong-ton-tai')).toBeUndefined();
  });
});
