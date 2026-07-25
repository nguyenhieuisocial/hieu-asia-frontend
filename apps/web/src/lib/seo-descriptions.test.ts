import { describe, it, expect } from 'vitest';
import { clampDescription } from './seo/description';
import {
  ALL_STARS_CONTENT,
  PALACES_CONTENT,
  starMetaDescription,
  palaceMetaDescription,
} from './tuvi-content';
import { ZODIAC, pairMetaDescription } from './hop-tuoi-pairs';

// Ngưỡng Google cắt mô tả ở SERP.
const MAX = 160;

/**
 * Vì sao có file test này.
 *
 * `clampDescription` (#936) chặn được việc cắt GÃY GIỮA CHỮ, nhưng nó không nói
 * cho ai biết là mẫu chữ đang quá dài — nó cứ lặng lẽ cắt. Kết quả: 133 trang
 * ra SERP với một câu cụt lửng kết thúc bằng "…", và ở cụm sao thì 47/47 trang
 * đều mất đúng phần từ khoá vì mẫu đặt đoạn bách khoa lên trước.
 *
 * Nên ngoài "không gãy chữ", còn cần một ràng buộc mạnh hơn: mẫu phải VỪA
 * ngưỡng ngay từ đầu, clamp chỉ là chốt chặn cuối và không bao giờ phải cắt.
 */
const expectFits = (label: string, text: string) => {
  expect(text.length, `${label} dài ${text.length} ký tự`).toBeLessThanOrEqual(MAX);
  expect(clampDescription(text, MAX), `${label} bị clamp cắt`).toBe(text);
  expect(text, `${label} kết thúc bằng dấu cắt`).not.toContain('…');
};

describe('meta description /tu-vi/sao/[star]', () => {
  it(`${ALL_STARS_CONTENT.length} sao: vừa ngưỡng, không cần cắt`, () => {
    for (const s of ALL_STARS_CONTENT) expectFits(`sao ${s.name}`, starMetaDescription(s));
  });

  it('mỗi sao một mô tả riêng', () => {
    const all = ALL_STARS_CONTENT.map(starMetaDescription);
    expect(new Set(all).size).toBe(all.length);
  });

  it('luôn giữ được cụm từ khoá cung — thứ trước đây bị cắt mất', () => {
    for (const s of ALL_STARS_CONTENT) {
      expect(starMetaDescription(s)).toContain('Mệnh, Quan Lộc, Tài Bạch');
    }
  });

  // `starEpithet` trả '' khi đoạn đầu của `archetype` quá dài — một cơ chế IM
  // LẶNG, đúng bằng cách `clampDescription` đã im lặng và làm hỏng 133 trang.
  // Nếu ai biên tập lại `archetype` khiến cả 47 sao rơi vào fallback, mọi
  // assertion độ dài ở trên VẪN xanh (mô tả ngắn đi thì luôn đạt) dù 47/47
  // trang mất phần phân biệt. Khoá đúng danh sách để việc đó thành báo động.
  it('chỉ đúng 3 sao được phép rơi vào mẫu rút gọn (không có biệt danh)', () => {
    const noEpithet = ALL_STARS_CONTENT.filter((s) => !starMetaDescription(s).includes(' — '));
    expect(noEpithet.map((s) => s.name)).toEqual([
      'Liêm Trinh',
      'Tham Lang',
      'Địa Không - Địa Kiếp',
    ]);
  });
});

describe('meta description /tu-vi/[palace]', () => {
  it(`${PALACES_CONTENT.length} cung: vừa ngưỡng, không cần cắt`, () => {
    for (const p of PALACES_CONTENT) expectFits(`cung ${p.name}`, palaceMetaDescription(p));
  });

  it('mỗi cung một mô tả riêng', () => {
    const all = PALACES_CONTENT.map(palaceMetaDescription);
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('meta description /hop-tuoi/tuoi/[cap]', () => {
  const pairs = ZODIAC.flatMap((a) => ZODIAC.map((b) => ({ a, b })));

  it(`${12 * 12} cặp tuổi: vừa ngưỡng, không cần cắt`, () => {
    for (const { a, b } of pairs) {
      expectFits(`${a.ten}–${b.ten}`, pairMetaDescription(a, b));
    }
  });

  it('mỗi cặp một mô tả riêng', () => {
    const all = pairs.map(({ a, b }) => pairMetaDescription(a, b));
    expect(new Set(all).size).toBe(all.length);
  });

  // Truy vấn mục tiêu của cụm này là "tuổi X hợp tuổi Y không". Nhưng 132/144
  // câu `summary` viết "Tý và Sửu" chứ không phải "tuổi Tý" — nên nếu câu nối
  // thêm mất đi thì mô tả mất luôn từ khoá, dù độ dài vẫn "đạt".
  it('luôn giữ đúng cụm từ khoá "tuổi X hợp tuổi Y"', () => {
    for (const { a, b } of pairs) {
      expect(pairMetaDescription(a, b)).toContain(`tuổi ${a.ten} hợp tuổi ${b.ten}`);
    }
  });

  it('không lặp lại cụm "Can Chi" hai lần trong một mô tả', () => {
    for (const { a, b } of pairs) {
      const d = pairMetaDescription(a, b);
      expect((d.match(/Can Chi/g) ?? []).length, `${a.ten}–${b.ten}: ${d}`).toBeLessThanOrEqual(1);
    }
  });
});
