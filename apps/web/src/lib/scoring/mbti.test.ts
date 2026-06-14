import { describe, it, expect } from 'vitest';
import { scoreMbti, QUESTIONS } from './mbti';

// Build an answer set by leaning every `pos` item to `posVal` and every `neg`
// item to `negVal` — so we can drive each axis deterministically.
function answersByToward(posVal: number, negVal: number): Record<string, number> {
  const a: Record<string, number> = {};
  for (const q of QUESTIONS) a[q.name] = q.toward === 'pos' ? posVal : negVal;
  return a;
}

describe('MBTI 24-item quiz', () => {
  it('has 24 items, balanced 6 per axis (3 pos + 3 neg)', () => {
    expect(QUESTIONS).toHaveLength(24);
    for (const axis of ['EI', 'SN', 'TF', 'JP'] as const) {
      const inAxis = QUESTIONS.filter((q) => q.axis === axis);
      expect(inAxis, axis).toHaveLength(6);
      expect(inAxis.filter((q) => q.toward === 'pos'), `${axis} pos`).toHaveLength(3);
      expect(inAxis.filter((q) => q.toward === 'neg'), `${axis} neg`).toHaveLength(3);
    }
  });

  it('unique question names', () => {
    const names = QUESTIONS.map((q) => q.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('agreeing with everything (all 5) is acquiescence-proof → every axis lands at 50', () => {
    const r = scoreMbti(answersByToward(5, 5));
    expect(r.total_items).toBe(24);
    expect(r.total_answered).toBe(24);
    for (const ax of Object.values(r.axes)) expect(ax.score).toBe(50);
    expect(r.type).toBe('ESTJ'); // ≥50 picks the positive pole on each axis
  });

  it('pos-high / neg-low → strong positive poles (E,S,T,J) at score 100', () => {
    const r = scoreMbti(answersByToward(5, 1));
    expect(r.type).toBe('ESTJ');
    for (const ax of Object.values(r.axes)) expect(ax.score).toBe(100);
  });

  it('pos-low / neg-high → opposite poles (I,N,F,P) at score 0', () => {
    const r = scoreMbti(answersByToward(1, 5));
    expect(r.type).toBe('INFP');
    for (const ax of Object.values(r.axes)) expect(ax.score).toBe(0);
  });

  it('is robust to missing answers (partial → unanswered axis defaults to 50)', () => {
    const r = scoreMbti({ mbti_ei_01: 5 });
    expect(r.total_answered).toBe(1);
    expect(r.type).toHaveLength(4);
  });
});
