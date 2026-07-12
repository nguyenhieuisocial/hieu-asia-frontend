/**
 * Kiểm thử dữ liệu trang chi tiết 9 nhóm Enneagram.
 *
 * - TYPE_EXTRA đủ 9 key (1–9), mỗi entry có đủ 4 field và không rỗng.
 * - buildType dựng được mọi slug + null với slug rác.
 * - KHOÁ NHẤT QUÁN với engine chấm điểm (lib/scoring/enneagram.ts): cánh (wing)
 *   phải khớp WINGS, mũi tên phát triển/áp lực phải khớp INTEGRATION/DISINTEGRATION.
 *   Đây là bảng chân lý — nội dung không được lệch khỏi cái engine thật dùng.
 */
import { describe, it, expect } from 'vitest';
import {
  buildType,
  listTypes,
  TYPE_EXTRA,
  ENNEAGRAM_SLUGS,
} from './enneagram-type-data';
import {
  WINGS,
  INTEGRATION,
  DISINTEGRATION,
  ENNEAGRAM_TYPE_ORDER,
  type EnneagramType,
} from './scoring/enneagram';

const EXTRA_FIELDS = [
  'deepProfile',
  'subtypeNotes',
  'misidentifications',
  'growthPractices',
] as const;

describe('TYPE_EXTRA', () => {
  it('có đủ 9 nhóm (key 1–9)', () => {
    const keys = Object.keys(TYPE_EXTRA)
      .map(Number)
      .sort((a, b) => a - b);
    expect(keys).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('mỗi nhóm có đủ 4 field và không rỗng', () => {
    for (const t of ENNEAGRAM_TYPE_ORDER) {
      const e = TYPE_EXTRA[t];
      expect(e, `nhóm ${t}`).toBeTruthy();
      for (const f of EXTRA_FIELDS) {
        expect(typeof e[f], `nhóm ${t} · ${f}`).toBe('string');
        expect(e[f].trim().length, `nhóm ${t} · ${f}`).toBeGreaterThan(0);
      }
    }
  });

  it('độ dài từng field nằm trong khoảng đã đặc tả (đủ sâu, không lan man)', () => {
    for (const t of ENNEAGRAM_TYPE_ORDER) {
      const e = TYPE_EXTRA[t];
      // deepProfile: chân dung sâu ~80–120 từ → tối thiểu 60 từ.
      expect(e.deepProfile.split(/\s+/).length, `deepProfile nhóm ${t}`).toBeGreaterThanOrEqual(60);
      // subtypeNotes: có nhắc cả ba bản năng (sp/so/sx).
      expect(e.subtypeNotes, `subtypeNotes nhóm ${t}`).toContain('sp');
      expect(e.subtypeNotes, `subtypeNotes nhóm ${t}`).toContain('so');
      expect(e.subtypeNotes, `subtypeNotes nhóm ${t}`).toContain('sx');
      // misidentifications: nêu ít nhất một nhóm khác để phân biệt.
      expect(e.misidentifications, `misidentifications nhóm ${t}`).toMatch(/nhóm \d/);
    }
  });
});

describe('buildType', () => {
  it('trả null với slug không hợp lệ', () => {
    expect(buildType('khong-ton-tai')).toBeNull();
    expect(buildType('0')).toBeNull();
    expect(buildType('10')).toBeNull();
  });

  it('dựng được mọi slug + gắn đủ 4 field TYPE_EXTRA', () => {
    for (const slug of ENNEAGRAM_SLUGS) {
      const d = buildType(slug);
      expect(d, `slug ${slug}`).not.toBeNull();
      if (!d) continue;
      expect(String(d.n)).toBe(slug);
      for (const f of EXTRA_FIELDS) {
        expect(d[f], `${slug} · ${f}`).toBe(TYPE_EXTRA[d.n][f]);
        expect((d[f] as string).length, `${slug} · ${f}`).toBeGreaterThan(0);
      }
    }
  });

  it('cánh (wing) khớp WINGS của engine chấm điểm', () => {
    for (const slug of ENNEAGRAM_SLUGS) {
      const d = buildType(slug)!;
      const [l, r] = WINGS[d.n as EnneagramType];
      expect(d.wingLeft.n, `wingLeft nhóm ${d.n}`).toBe(l);
      expect(d.wingRight.n, `wingRight nhóm ${d.n}`).toBe(r);
    }
  });

  it('mũi tên phát triển/áp lực khớp INTEGRATION/DISINTEGRATION của engine', () => {
    for (const slug of ENNEAGRAM_SLUGS) {
      const d = buildType(slug)!;
      expect(d.growthArrow.n, `growthArrow nhóm ${d.n}`).toBe(INTEGRATION[d.n as EnneagramType]);
      expect(d.stressArrow.n, `stressArrow nhóm ${d.n}`).toBe(DISINTEGRATION[d.n as EnneagramType]);
    }
  });

  it('centerMates đúng 2 nhóm cùng trung tâm, others đúng 8 nhóm còn lại', () => {
    for (const slug of ENNEAGRAM_SLUGS) {
      const d = buildType(slug)!;
      expect(d.centerMates).toHaveLength(2);
      expect(d.centerMates.every((t) => t.n !== d.n)).toBe(true);
      expect(d.others).toHaveLength(8);
      expect(d.others.every((t) => t.n !== d.n)).toBe(true);
    }
  });
});

describe('listTypes', () => {
  it('đủ 9 nhóm, slug khớp ENNEAGRAM_SLUGS', () => {
    const list = listTypes();
    expect(list).toHaveLength(9);
    expect(list.map((t) => t.slug)).toEqual([...ENNEAGRAM_SLUGS]);
  });
});
