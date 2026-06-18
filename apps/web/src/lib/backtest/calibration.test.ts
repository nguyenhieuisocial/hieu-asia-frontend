import { describe, it, expect } from 'vitest';
import {
  signalBitmask,
  SIGNAL_BITS,
  ageBucket,
  eventRecency,
  baseRateBucket,
  buildCalibrationTuple,
  type CalibrationTuple,
} from './calibration';
import { controlCategory, governingPalaces, LEDGER_CELLS } from './palace-map';
import type { EventScore, SignalCode } from './scoring';
import type { LifeCategory } from './backtest-core';

function score(partial: Partial<EventScore>): EventScore {
  return {
    year: 2015,
    category: 'career',
    governingPalace: 'Quan Lộc',
    grade: 'STRONG',
    landingsOnGoverning: [],
    firedSignals: [],
    signalCodes: [],
    valence: 'positive',
    polarityMismatch: false,
    reason: '',
    ...partial,
  };
}

describe('signalBitmask', () => {
  it('is 0 for no signals', () => {
    expect(signalBitmask([])).toBe(0);
  });
  it('sets the right bit per code and ORs combinations', () => {
    expect(signalBitmask(['PRIMARY_TOA_THU'])).toBe(SIGNAL_BITS.PRIMARY_TOA_THU);
    expect(signalBitmask(['PRIMARY_TOA_THU', 'DAIVAN_GOVERNS'])).toBe(
      SIGNAL_BITS.PRIMARY_TOA_THU | SIGNAL_BITS.DAIVAN_GOVERNS,
    );
  });
  it('every code maps to a distinct power-of-two bit', () => {
    const bits = Object.values(SIGNAL_BITS);
    expect(new Set(bits).size).toBe(bits.length);
    for (const b of bits) expect(b & (b - 1)).toBe(0); // power of two
  });
});

describe('ageBucket', () => {
  it.each([
    [2000, 2018, '<20'],
    [2000, 2020, '20-29'],
    [2000, 2029, '20-29'],
    [1990, 2020, '30-39'],
    [1970, 2029, '50-59'],
    [1960, 2025, '60+'],
  ] as const)('birth %i, event %i → %s', (birth, event, expected) => {
    expect(ageBucket(birth, event)).toBe(expected);
  });
});

describe('eventRecency', () => {
  it.each([
    [2024, 2026, 'within_5y'],
    [2021, 2026, 'within_5y'],
    [2020, 2026, '5_15y'],
    [2011, 2026, '5_15y'],
    [2010, 2026, 'over_15y'],
  ] as const)('event %i, capture %i → %s', (event, capture, expected) => {
    expect(eventRecency(event, capture)).toBe(expected);
  });
});

describe('baseRateBucket', () => {
  it('clamps to 0..10 and rounds', () => {
    expect(baseRateBucket(-3)).toBe(0);
    expect(baseRateBucket(0)).toBe(0);
    expect(baseRateBucket(4)).toBe(4);
    expect(baseRateBucket(10)).toBe(10);
    expect(baseRateBucket(11)).toBe(10);
  });
});

describe('controlCategory — negative control always lands on a DIFFERENT palace', () => {
  const cats: LifeCategory[] = [
    'career',
    'wealth',
    'relationship',
    'health',
    'relocation',
    'childbirth',
    'study',
  ];
  it.each(cats)('%s → control palace differs from real palace', (cat) => {
    const realPalace = governingPalaces(cat)![0];
    const ctrl = controlCategory(cat);
    const ctrlPalace = governingPalaces(ctrl)![0];
    expect(ctrl).not.toBe(cat);
    expect(ctrlPalace).not.toBe(realPalace);
  });
  it.each(['parent', 'spouse', 'sibling', 'child', 'self', 'money'] as const)(
    'loss/%s → control palace (career=Quan Lộc) differs from the loss palace',
    (target) => {
      const lossPalace = governingPalaces('loss', target)![0];
      const ctrlPalace = governingPalaces(controlCategory('loss'))![0];
      expect(ctrlPalace).not.toBe(lossPalace);
    },
  );
});

describe('LEDGER_CELLS pre-registration', () => {
  it('marks study as NON-independent (shares Quan Lộc with career)', () => {
    const study = LEDGER_CELLS.find((c) => c.category === 'study')!;
    const career = LEDGER_CELLS.find((c) => c.category === 'career')!;
    expect(study.palace).toBe(career.palace);
    expect(study.independent).toBe(false);
    expect(career.independent).toBe(true);
  });
  it('every cell palace matches the locked governing map', () => {
    for (const cell of LEDGER_CELLS) {
      expect(governingPalaces(cell.category)![0]).toBe(cell.palace);
    }
  });
});

describe('buildCalibrationTuple', () => {
  const base = {
    realCategory: 'career' as LifeCategory,
    isControl: false,
    birthYear: 1990,
    eventYear: 2015,
    captureYear: 2026,
    baseRateHits: 4,
  };

  it('builds a real tuple with the verdict + buckets', () => {
    const codes: SignalCode[] = ['PRIMARY_TOA_THU', 'DAIVAN_GOVERNS'];
    const t = buildCalibrationTuple({ ...base, score: score({ signalCodes: codes }) })!;
    expect(t).toMatchObject({
      rulesetVersion: 'bc-ruleset-1',
      kind: 'backtest',
      category: 'career',
      lossTarget: null,
      governingPalace: 'Quan Lộc',
      grade: 'STRONG',
      signalBitmask: SIGNAL_BITS.PRIMARY_TOA_THU | SIGNAL_BITS.DAIVAN_GOVERNS,
      baseRateBucket: 4,
      ageBucket: '20-29',
      eventRecency: '5_15y', // 2026 − 2015 = 11 years
      isControl: false,
    });
  });

  it('returns null for an UNSCORABLE verdict (never persists noise)', () => {
    expect(buildCalibrationTuple({ ...base, score: score({ grade: 'UNSCORABLE', governingPalace: null }) })).toBeNull();
  });

  it('a control row keeps the REAL category but the control palace + control grade', () => {
    // control scored against health (Tật Ách) for a real career event
    const controlScore = score({ category: 'health', governingPalace: 'Tật Ách', grade: 'NONE', signalCodes: [] });
    const t = buildCalibrationTuple({ ...base, score: controlScore, isControl: true })!;
    expect(t.category).toBe('career'); // grouping key = REAL category
    expect(t.governingPalace).toBe('Tật Ách'); // but scored against the control palace
    expect(t.grade).toBe('NONE');
    expect(t.isControl).toBe(true);
  });

  // ── PRIVACY ALLOW-LIST: the serialized payload must carry NO personal data ──
  it('serialized tuple contains ONLY the allow-listed keys and no PII-shaped key', () => {
    const t = buildCalibrationTuple({ ...base, score: score({}) })!;
    const allowed = new Set<keyof CalibrationTuple>([
      'rulesetVersion',
      'kind',
      'category',
      'lossTarget',
      'governingPalace',
      'grade',
      'valence',
      'polarityMismatch',
      'signalBitmask',
      'baseRateBucket',
      'ageBucket',
      'eventRecency',
      'isControl',
    ]);
    const keys = Object.keys(t);
    for (const k of keys) expect(allowed.has(k as keyof CalibrationTuple)).toBe(true);

    const forbidden = ['birthYear', 'birthDate', 'birthHour', 'birthTime', 'year', 'eventYear', 'age', 'gender', 'note', 'displayName', 'birthPlace', 'name', 'chart'];
    for (const f of forbidden) expect(keys).not.toContain(f);

    const serialized = JSON.stringify(t);
    // no 4-digit year anywhere in the payload (raw years are the strongest quasi-id)
    expect(serialized).not.toMatch(/\b(19|20)\d{2}\b/);
  });
});
