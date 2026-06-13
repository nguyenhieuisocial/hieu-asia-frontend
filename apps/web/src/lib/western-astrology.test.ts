/**
 * Kiểm thử hồi quy cho engine chiêm tinh phương Tây.
 *
 * Nguồn tham chiếu: astronomy-engine (NASA/JPL VSOP87 accuracy) — cross-check
 * độc lập chạy ngày 2026-06-14 trên 8 mốc thời gian (1964–2010).
 *
 * Giá trị chuẩn (lon°) lấy từ astronomy-engine và khớp với:
 *   - NASA JPL Horizons ephemeris (Mặt Trời ±0.01°)
 *   - Meeus "Astronomical Algorithms" 2nd ed. (ch. 25 / 47)
 *
 * Ngưỡng sai số cho phép: ±1° (engine cam kết <0.06°; ngưỡng 1° đủ bắt
 * regression nhưng không false-positive với sai số giờ sinh bình thường).
 * Riêng cung (sign): không có sai số — lệch cung là fail ngay.
 */

import { describe, it, expect } from 'vitest';
import { julianDay, sunLongitude, moonLongitude, planetLongitude, computeChart } from './western-astrology';

// ── Helpers ──────────────────────────────────────────────────────────────────

const ZODIAC_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;
type ZodiacEN = typeof ZODIAC_EN[number];

/** Kinh độ → chỉ số cung (0–11). */
function signIdx(lon: number): number {
  return Math.floor(((lon % 360) + 360) % 360 / 30) % 12;
}

/** Kinh độ → tên cung tiếng Anh. */
function signName(lon: number): ZodiacEN {
  return ZODIAC_EN[signIdx(lon)]!;
}

/** Kinh độ trong cung (0–30). */
function degInSign(lon: number): number {
  return ((lon % 360) + 360) % 360 - signIdx(lon) * 30;
}

// ── Mốc tham chiếu đã kiểm chứng ──────────────────────────────────────────
//
// Tất cả dùng UTC noon (12:00:00 UTC) để loại bỏ ảnh hưởng múi giờ.
// Giá trị chuẩn (refLon) = astronomy-engine output, khớp NASA Horizons.
//
// Cú pháp: { label, year, month, day, refSunLon, refMoonLon }
// refSunLon / refMoonLon là kinh độ tuyệt đối (°) theo astronomy-engine.

interface Case {
  label: string;
  year: number;
  month: number;
  day: number;
  refSunLon: number;   // astronomy-engine (°)
  refMoonLon: number;  // astronomy-engine (°)
}

const REF_CASES: Case[] = [
  // 1964-07-04: Sun Cancer ~12.5°, Moon Taurus ~3.7°
  { label: '1964-07-04', year: 1964, month: 7, day: 4,   refSunLon: 102.521, refMoonLon: 33.693 },
  // 1975-12-22: Sun Capricorn ~0.0° (sát điểm chí đông — edge case quan trọng)
  { label: '1975-12-22', year: 1975, month: 12, day: 22, refSunLon: 270.016, refMoonLon: 139.199 },
  // 1985-03-21: Sun Aries ~0.8° (sát điểm xuân phân — edge case quan trọng)
  { label: '1985-03-21', year: 1985, month: 3,  day: 21, refSunLon: 0.824,   refMoonLon: 0.829 },
  // 1988-09-23: Sun Libra ~0.7° (sát điểm thu phân — edge case quan trọng)
  { label: '1988-09-23', year: 1988, month: 9,  day: 23, refSunLon: 180.679, refMoonLon: 328.228 },
  // 1990-05-20: Sun Taurus ~29.2° (sát ranh giới cung Taurus/Gemini)
  { label: '1990-05-20', year: 1990, month: 5,  day: 20, refSunLon: 59.219,  refMoonLon: 3.251 },
  // 1995-11-22: Sun Scorpio ~29.7° (sát ranh giới cung Scorpio/Sagittarius)
  { label: '1995-11-22', year: 1995, month: 11, day: 22, refSunLon: 239.710, refMoonLon: 237.554 },
  // 2000-06-22: Sun Cancer ~1.4°, Moon Pisces ~2.1°
  { label: '2000-06-22', year: 2000, month: 6,  day: 22, refSunLon: 91.365,  refMoonLon: 332.089 },
  // 2010-01-15: Sun Capricorn ~25.2°, Moon Capricorn ~27.4° (2 hành tinh cùng cung)
  { label: '2010-01-15', year: 2010, month: 1,  day: 15, refSunLon: 295.233, refMoonLon: 297.397 },
];

// ── julianDay ────────────────────────────────────────────────────────────────

describe('julianDay', () => {
  it('J2000.0 epoch: 2000-01-01.5 = JD 2451545.0', () => {
    // Meeus ch.7: J2000.0 = 2451545.0
    expect(julianDay(2000, 1, 1, 12, 0, 0)).toBeCloseTo(2451545.0, 5);
  });

  it('1990-05-20 12:00 UTC → JD 2448032.0 (astronomy-engine verified)', () => {
    expect(julianDay(1990, 5, 20, 12, 0, 0)).toBeCloseTo(2448032.0, 5);
  });

  it('tháng ≤ 2 chuyển sang năm trước đúng (2000-02-28)', () => {
    // 2000-02-28 12:00 = JD 2451603.0 (từ Meeus)
    expect(julianDay(2000, 2, 28, 12, 0, 0)).toBeCloseTo(2451603.0, 5);
  });
});

// ── sunLongitude: kinh độ ────────────────────────────────────────────────────

describe('sunLongitude — kinh độ (±1°)', () => {
  for (const c of REF_CASES) {
    it(`${c.label}: lon=${c.refSunLon.toFixed(3)}° → sai số <1°`, () => {
      const jd = julianDay(c.year, c.month, c.day, 12, 0, 0);
      const lon = sunLongitude(jd);
      const diff = Math.abs(lon - c.refSunLon);
      // Xử lý wrap-around gần 0°/360°
      const normDiff = Math.min(diff, 360 - diff);
      expect(normDiff).toBeLessThan(1);
    });
  }
});

// ── sunLongitude: cung ────────────────────────────────────────────────────────

describe('sunLongitude — cung hoàng đạo (không sai cung)', () => {
  const signCases: { label: string; year: number; month: number; day: number; expectedSign: ZodiacEN }[] = [
    { label: '1964-07-04', year: 1964, month: 7,  day: 4,  expectedSign: 'Cancer' },
    { label: '1975-12-22', year: 1975, month: 12, day: 22, expectedSign: 'Capricorn' },
    { label: '1985-03-21', year: 1985, month: 3,  day: 21, expectedSign: 'Aries' },
    { label: '1988-09-23', year: 1988, month: 9,  day: 23, expectedSign: 'Libra' },
    { label: '1990-05-20', year: 1990, month: 5,  day: 20, expectedSign: 'Taurus' },
    { label: '1995-11-22', year: 1995, month: 11, day: 22, expectedSign: 'Scorpio' },
    { label: '2000-06-22', year: 2000, month: 6,  day: 22, expectedSign: 'Cancer' },
    { label: '2010-01-15', year: 2010, month: 1,  day: 15, expectedSign: 'Capricorn' },
  ];

  for (const c of signCases) {
    it(`${c.label}: Sun ∈ ${c.expectedSign}`, () => {
      const jd = julianDay(c.year, c.month, c.day, 12, 0, 0);
      expect(signName(sunLongitude(jd))).toBe(c.expectedSign);
    });
  }
});

// ── moonLongitude: kinh độ ───────────────────────────────────────────────────

describe('moonLongitude — kinh độ (±1°)', () => {
  for (const c of REF_CASES) {
    it(`${c.label}: lon=${c.refMoonLon.toFixed(3)}°`, () => {
      const jd = julianDay(c.year, c.month, c.day, 12, 0, 0);
      const lon = moonLongitude(jd);
      const diff = Math.abs(lon - c.refMoonLon);
      const normDiff = Math.min(diff, 360 - diff);
      expect(normDiff).toBeLessThan(1);
    });
  }
});

// ── moonLongitude: cung ───────────────────────────────────────────────────────

describe('moonLongitude — cung hoàng đạo', () => {
  const moonSignCases: { label: string; year: number; month: number; day: number; expectedSign: ZodiacEN }[] = [
    { label: '1964-07-04', year: 1964, month: 7,  day: 4,  expectedSign: 'Taurus' },
    { label: '1975-12-22', year: 1975, month: 12, day: 22, expectedSign: 'Leo' },
    { label: '1985-03-21', year: 1985, month: 3,  day: 21, expectedSign: 'Aries' },
    { label: '1988-09-23', year: 1988, month: 9,  day: 23, expectedSign: 'Aquarius' },
    { label: '1990-05-20', year: 1990, month: 5,  day: 20, expectedSign: 'Aries' },
    { label: '1995-11-22', year: 1995, month: 11, day: 22, expectedSign: 'Scorpio' },
    { label: '2000-06-22', year: 2000, month: 6,  day: 22, expectedSign: 'Pisces' },
    { label: '2010-01-15', year: 2010, month: 1,  day: 15, expectedSign: 'Capricorn' },
  ];

  for (const c of moonSignCases) {
    it(`${c.label}: Moon ∈ ${c.expectedSign}`, () => {
      const jd = julianDay(c.year, c.month, c.day, 12, 0, 0);
      expect(signName(moonLongitude(jd))).toBe(c.expectedSign);
    });
  }
});

// ── planetLongitude ──────────────────────────────────────────────────────────
//
// Nguồn: astronomy-engine, 1990-05-20 12:00 UTC.
// Sai số cho phép ±1° (engine cam kết <0.06°).

describe('planetLongitude — 1990-05-20 UTC noon', () => {
  const jd1990 = julianDay(1990, 5, 20, 12, 0, 0);

  const planetCases: { key: Parameters<typeof planetLongitude>[0]; sign: ZodiacEN; refLon: number }[] = [
    { key: 'mercury', sign: 'Taurus',    refLon: 38.367 },
    { key: 'venus',   sign: 'Aries',     refLon: 18.545 },
    { key: 'mars',    sign: 'Pisces',    refLon: 352.044 },
    { key: 'jupiter', sign: 'Cancer',    refLon: 100.507 },
    { key: 'saturn',  sign: 'Capricorn', refLon: 295.142 },
    { key: 'uranus',  sign: 'Capricorn', refLon: 279.045 },
    { key: 'neptune', sign: 'Capricorn', refLon: 284.270 },
  ];

  for (const c of planetCases) {
    it(`${c.key} ∈ ${c.sign} (lon≈${c.refLon.toFixed(1)}°)`, () => {
      const lon = planetLongitude(c.key, jd1990);
      const diff = Math.abs(lon - c.refLon);
      const normDiff = Math.min(diff, 360 - diff);
      expect(normDiff).toBeLessThan(1);
      expect(signName(lon)).toBe(c.sign);
    });
  }
});

// ── computeChart (integration) ───────────────────────────────────────────────

describe('computeChart — tích hợp end-to-end', () => {
  it('1990-05-20 VN noon (UTC+7): Sun Taurus, Moon Pisces', () => {
    // 12:00 VN = 05:00 UTC. Mặt Trăng di chuyển ~0.5°/h → ở 05:00 UTC vẫn
    // là Song Ngư 29.1° (chưa vào Bạch Dương — ranh giới ≈ 07:30 UTC hôm đó).
    // Kiểm chứng: astronomy-engine cho 1990-05-20T05:00Z = Moon Pisces 29.10°.
    const chart = computeChart({ year: 1990, month: 5, day: 20, hour: 12, minute: 0, tzOffsetMinutes: 420 });
    expect(chart.sun.sign.name).toBe('Kim Ngưu');  // Taurus
    expect(chart.moon.sign.name).toBe('Song Ngư'); // Pisces (29.1° — nearCusp)
    expect(chart.moon.nearCusp).toBe(true); // <1° từ ranh giới Aries
  });

  it('2000-06-22 UTC noon: Sun Cancer, Moon Pisces', () => {
    const chart = computeChart({ year: 2000, month: 6, day: 22, hour: 12, minute: 0, tzOffsetMinutes: 0 });
    expect(chart.sun.sign.name).toBe('Cự Giải');   // Cancer
    expect(chart.moon.sign.name).toBe('Song Ngư'); // Pisces
  });

  it('computeChart trả về đủ 7 hành tinh', () => {
    const chart = computeChart({ year: 1990, month: 5, day: 20, hour: 12, minute: 0, tzOffsetMinutes: 0 });
    expect(chart.planets).toHaveLength(7);
  });

  it('ascendant chỉ có khi cung cấp lat/lon', () => {
    const noAsc = computeChart({ year: 1990, month: 5, day: 20, hour: 12, minute: 0 });
    expect(noAsc.ascendant).toBeUndefined();

    const withAsc = computeChart({ year: 1990, month: 5, day: 20, hour: 12, minute: 0, latitude: 10.8, longitude: 106.7 });
    expect(withAsc.ascendant).toBeDefined();
  });

  it('nearCusp: Sun 1985-03-21 ≈ 0.8° Aries → nearCusp = true (sát ranh giới)', () => {
    const chart = computeChart({ year: 1985, month: 3, day: 21, hour: 12, minute: 0, tzOffsetMinutes: 0 });
    expect(chart.sun.nearCusp).toBe(true);
  });

  it('nearCusp: Sun 1964-07-04 ≈ 12.5° Cancer → nearCusp = false (giữa cung)', () => {
    const chart = computeChart({ year: 1964, month: 7, day: 4, hour: 12, minute: 0, tzOffsetMinutes: 0 });
    expect(chart.sun.nearCusp).toBe(false);
  });
});

// ── Sanity: degreeInSign ─────────────────────────────────────────────────────

describe('degreeInSign helper — sanity check', () => {
  it('0° → Aries 0°', () => {
    expect(signName(0)).toBe('Aries');
    expect(degInSign(0)).toBeCloseTo(0, 5);
  });
  it('359.9° → Pisces 29.9°', () => {
    expect(signName(359.9)).toBe('Pisces');
    expect(degInSign(359.9)).toBeCloseTo(29.9, 1);
  });
  it('90° → Cancer 0°', () => {
    expect(signName(90)).toBe('Cancer');
    expect(degInSign(90)).toBeCloseTo(0, 5);
  });
  it('180° → Libra 0°', () => {
    expect(signName(180)).toBe('Libra');
    expect(degInSign(180)).toBeCloseTo(0, 5);
  });
  it('270° → Capricorn 0°', () => {
    expect(signName(270)).toBe('Capricorn');
    expect(degInSign(270)).toBeCloseTo(0, 5);
  });
});
