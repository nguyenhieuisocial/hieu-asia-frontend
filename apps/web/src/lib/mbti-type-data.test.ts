import { describe, it, expect } from 'vitest';
import {
  MBTI_SLUGS,
  FUNCTION_GLOSS,
  FUNCTION_ROLES,
  listTypes,
  buildType,
} from './mbti-type-data';

// 16 slug MBTI chuẩn — khoá bằng test để không ai vô tình thêm/bớt/đổi.
const CANONICAL_SLUGS = [
  'intj', 'intp', 'entj', 'entp',
  'infj', 'infp', 'enfj', 'enfp',
  'istj', 'isfj', 'estj', 'esfj',
  'istp', 'isfp', 'estp', 'esfp',
] as const;

const EIGHT_FUNCTIONS = new Set(Object.keys(FUNCTION_GLOSS));

describe('mbti-type-data — 16 nhóm', () => {
  it('có đúng 16 slug MBTI chuẩn, không trùng', () => {
    expect(MBTI_SLUGS).toHaveLength(16);
    expect(new Set(MBTI_SLUGS).size).toBe(16);
    expect([...MBTI_SLUGS].sort()).toEqual([...CANONICAL_SLUGS].sort());
  });

  it('8 chức năng nhận thức đúng bộ Ni/Ne/Si/Se/Ti/Te/Fi/Fe', () => {
    expect([...EIGHT_FUNCTIONS].sort()).toEqual(
      ['Fe', 'Fi', 'Ne', 'Ni', 'Se', 'Si', 'Te', 'Ti'].sort(),
    );
    expect(FUNCTION_ROLES).toHaveLength(4);
  });

  it('listTypes trả về 16 tham chiếu, slug duy nhất', () => {
    const refs = listTypes();
    expect(refs).toHaveLength(16);
    expect(new Set(refs.map((r) => r.slug)).size).toBe(16);
  });

  it('mỗi nhóm: stack đúng 4 phần tử, đều thuộc 8 chức năng và không lặp', () => {
    for (const slug of MBTI_SLUGS) {
      const d = buildType(slug);
      expect(d, slug).not.toBeNull();
      expect(d!.stack, slug).toHaveLength(4);
      for (const fn of d!.stack) {
        expect(EIGHT_FUNCTIONS.has(fn), `${slug} · ${fn}`).toBe(true);
      }
      // 4 chức năng trong một chuỗi phải khác nhau.
      expect(new Set(d!.stack).size, `${slug} stack unique`).toBe(4);
      // stackDetail bám đúng stack + vai trò Trội→Ẩn.
      expect(d!.stackDetail.map((s) => s.fn), slug).toEqual(d!.stack);
    }
  });

  it('4 field bách khoa mới điền đủ, không rỗng cho cả 16 nhóm', () => {
    for (const slug of MBTI_SLUGS) {
      const d = buildType(slug)!;
      for (const field of ['atBest', 'underStress', 'commonConfusions', 'growthPath'] as const) {
        const v = d[field];
        expect(typeof v, `${slug}.${field}`).toBe('string');
        expect(v.trim().length, `${slug}.${field} non-empty`).toBeGreaterThan(0);
      }
    }
  });

  it('FAQ trang con: hiển thị = schema, hai câu cuối dùng chất liệu mới', () => {
    for (const slug of MBTI_SLUGS) {
      const d = buildType(slug)!;
      expect(d.faqs.length, slug).toBeGreaterThanOrEqual(8);
      for (const f of d.faqs) {
        expect(f.q.trim().length, `${slug} q`).toBeGreaterThan(0);
        expect(f.a.trim().length, `${slug} a`).toBeGreaterThan(0);
      }
      const last = d.faqs[d.faqs.length - 1]!;
      const secondLast = d.faqs[d.faqs.length - 2]!;
      expect(secondLast.a, `${slug} confusions faq`).toBe(d.commonConfusions);
      expect(last.a, `${slug} growth faq`).toBe(d.growthPath);
    }
  });

  it('buildType chấp nhận slug hoa/thường, trả null cho slug lạ', () => {
    expect(buildType('INTJ')?.code).toBe('INTJ');
    expect(buildType('intj')?.code).toBe('INTJ');
    expect(buildType('zzzz')).toBeNull();
    expect(buildType('')).toBeNull();
    expect(buildType('int')).toBeNull();
    expect(buildType('intjj')).toBeNull();
  });
});
