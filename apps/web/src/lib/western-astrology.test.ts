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
import {
  julianDay,
  sunLongitude,
  moonLongitude,
  planetLongitude,
  plutoLongitude,
  computeChart,
  mcLongitude,
  meanNorthNodeLongitude,
  computeAspects,
  wholeSignHouses,
  houseOf,
} from './western-astrology';

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
    { key: 'pluto',   sign: 'Scorpio',   refLon: 226.031 },
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

// ── plutoLongitude (Schlyter, công thức riêng) ────────────────────────────────
//
// Diêm Vương dùng công thức nhiễu-loạn riêng (KHÔNG phải phần tử Kepler như 7 hành
// tinh kia). Giá trị chuẩn = astronomy-engine 2.1.19, frame ecliptic-of-date (true),
// khớp NASA JPL Horizons. Hai mốc ingress (2008→Ma Kết ~270°, 2024→Bảo Bình ~300°)
// là phép thử nhạy nhất vì nằm sát ranh giới cung.
describe('plutoLongitude — kiểm chứng vs astronomy-engine (1970–2030)', () => {
  const plutoCases: { y: number; mo: number; d: number; h: number; mi: number; refLon: number; sign: ZodiacEN }[] = [
    { y: 1970, mo: 1,  d: 1,  h: 0,  mi: 0, refLon: 177.393, sign: 'Virgo' },
    { y: 1980, mo: 6,  d: 15, h: 12, mi: 0, refLon: 199.019, sign: 'Libra' },
    { y: 1990, mo: 5,  d: 20, h: 12, mi: 0, refLon: 226.031, sign: 'Scorpio' },
    { y: 2000, mo: 1,  d: 1,  h: 12, mi: 0, refLon: 251.455, sign: 'Sagittarius' },
    { y: 2008, mo: 1,  d: 26, h: 0,  mi: 0, refLon: 269.997, sign: 'Sagittarius' },
    { y: 2015, mo: 7,  d: 1,  h: 0,  mi: 0, refLon: 284.403, sign: 'Capricorn' },
    { y: 2024, mo: 1,  d: 21, h: 0,  mi: 0, refLon: 299.998, sign: 'Capricorn' },
    { y: 2030, mo: 1,  d: 1,  h: 0,  mi: 0, refLon: 309.164, sign: 'Aquarius' },
  ];

  for (const c of plutoCases) {
    it(`${c.y}-${String(c.mo).padStart(2, '0')}-${String(c.d).padStart(2, '0')} → ${c.sign} (lon≈${c.refLon.toFixed(1)}°)`, () => {
      const jd = julianDay(c.y, c.mo, c.d, c.h, c.mi, 0);
      const lon = plutoLongitude(jd);
      const diff = Math.abs(lon - c.refLon);
      const normDiff = Math.min(diff, 360 - diff);
      expect(normDiff).toBeLessThan(0.5); // engine cam kết ≤0.013°; 0.5° đủ bắt regression
      expect(signName(lon)).toBe(c.sign);
    });
  }

  it('được tính trong computeChart (thiên thể thứ 8) và gán nhà khi có nơi sinh', () => {
    const chart = computeChart({
      year: 1990, month: 5, day: 20, hour: 12, minute: 0,
      tzOffsetMinutes: 0, latitude: 21.03, longitude: 105.85,
    });
    expect(chart.planets).toHaveLength(8);
    const pluto = chart.planets.find((p) => p.planet.key === 'pluto');
    expect(pluto).toBeDefined();
    expect(pluto!.position.sign.name).toBe('Bọ Cạp'); // Scorpio
    expect(typeof pluto!.position.house).toBe('number');
  });
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

  it('computeChart trả về đủ 8 hành tinh (Sao Thủy → Diêm Vương)', () => {
    const chart = computeChart({ year: 1990, month: 5, day: 20, hour: 12, minute: 0, tzOffsetMinutes: 0 });
    expect(chart.planets).toHaveLength(8);
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

// ── computeAspects: phân loại 5 góc Ptolemy trên cặp kinh độ dựng tay ──────────
//
// Nguồn quy tắc: Ptolemy "Tetrabiblos" Q.1 (5 góc lớn). Orb: ~8° nếu có
// luminary (Mặt Trời/Mặt Trăng), ~6° còn lại (thông lệ hiện đại).
// Các cặp dưới đây có giá trị góc TUYỆT ĐỐI nên kết quả là tất định, kiểm được bằng tay.

describe('computeAspects — phân loại trên cặp kinh độ dựng tay', () => {
  const lum = (name: string, longitude: number) => ({ name, longitude, luminary: true });
  const pl = (name: string, longitude: number) => ({ name, longitude, luminary: false });

  it('10° vs 130° = trine khít (orb 0, exactAngle 120)', () => {
    const a = computeAspects([pl('A', 10), pl('B', 130)]);
    expect(a).toHaveLength(1);
    expect(a[0]!.aspect).toBe('trine');
    expect(a[0]!.exactAngle).toBeCloseTo(120, 5);
    expect(a[0]!.orb).toBeCloseTo(0, 5);
  });

  it('10° vs 100° = square khít (orb 0, exactAngle 90)', () => {
    const a = computeAspects([pl('A', 10), pl('B', 100)]);
    expect(a).toHaveLength(1);
    expect(a[0]!.aspect).toBe('square');
    expect(a[0]!.exactAngle).toBeCloseTo(90, 5);
    expect(a[0]!.orb).toBeCloseTo(0, 5);
  });

  it('0° vs 5° = conjunction (orb 5)', () => {
    const a = computeAspects([pl('A', 0), pl('B', 5)]);
    expect(a[0]!.aspect).toBe('conjunction');
    expect(a[0]!.orb).toBeCloseTo(5, 5);
  });

  it('10° vs 190° = opposition (sep 180)', () => {
    const a = computeAspects([pl('A', 10), pl('B', 190)]);
    expect(a[0]!.aspect).toBe('opposition');
    expect(a[0]!.exactAngle).toBeCloseTo(180, 5);
  });

  it('10° vs 70° = sextile (sep 60, orb 0)', () => {
    const a = computeAspects([pl('A', 10), pl('B', 70)]);
    expect(a[0]!.aspect).toBe('sextile');
    expect(a[0]!.orb).toBeCloseTo(0, 5);
  });

  it('góc ôm wrap 0/360: 355° vs 5° = conjunction (sep 10, orb 10 > 8 → KHÔNG khi non-lum)', () => {
    // sep = 10°, vượt orb 6° (non-lum) và 8° (lum) cho conjunction → không có góc.
    expect(computeAspects([pl('A', 355), pl('B', 5)])).toHaveLength(0);
    // Nhưng 357° vs 5° (sep 8°) là conjunction nếu có luminary (orb 8 ≤ 8).
    const withLum = computeAspects([lum('Mặt Trời', 357), pl('B', 5)]);
    expect(withLum).toHaveLength(1);
    expect(withLum[0]!.aspect).toBe('conjunction');
    expect(withLum[0]!.orb).toBeCloseTo(8, 5);
  });

  it('orb luminary rộng hơn: 10° vs 78° (sep 68) → sextile CHỈ khi có luminary', () => {
    // orb với sextile = |68-60| = 8°. Non-lum (≤6°) loại; lum (≤8°) nhận.
    expect(computeAspects([pl('A', 10), pl('B', 78)])).toHaveLength(0);
    const withLum = computeAspects([lum('Mặt Trăng', 10), pl('B', 78)]);
    expect(withLum).toHaveLength(1);
    expect(withLum[0]!.aspect).toBe('sextile');
    expect(withLum[0]!.orb).toBeCloseTo(8, 5);
  });

  it('45° không là góc lớn nào → bỏ qua', () => {
    expect(computeAspects([pl('A', 0), pl('B', 45)])).toHaveLength(0);
  });

  it('mỗi cặp chỉ giữ MỘT góc (góc khít nhất)', () => {
    // 3 thiên thể → tối đa 3 cặp; mỗi cặp ≤ 1 góc.
    const out = computeAspects([pl('A', 0), pl('B', 120), pl('C', 240)]);
    // A-B trine, B-C trine, A-C trine (sep 120 mỗi cặp)
    expect(out).toHaveLength(3);
    expect(out.every((x) => x.aspect === 'trine')).toBe(true);
  });
});

// ── MC (Midheaven) + North Node: kiểm chứng vs astronomy-engine ────────────────
//
// NGUỒN THAM CHIẾU: astronomy-engine 2.1.19 (Python) — cùng họ thư viện chuẩn
// (NASA/JPL VSOP87-accuracy) đã dùng kiểm chứng phần Mặt Trời/Mặt Trăng/hành tinh.
// Chạy ngày 2026-06-17. Công thức:
//   GMST  = SiderealTime(t) × 15  (°)
//   RAMC  = GMST + kinh-độ-Đông   (°)
//   eps   = độ nghiêng hoàng đạo trung bình (Meeus ch. 22)
//   MC    = atan2( sin RAMC, cos RAMC · cos eps )           (Meeus, công thức kinh tuyến)
//   Node  = 125.0452 − 1934.136261·T   (Meeus 47.7, T = thế kỷ Julian từ J2000)
//
// CHÉO ĐỘC LẬP: gmst()/obliquity() của engine ta khớp astronomy-engine
//   GMST  lệch ~0.003–0.004°, eps khớp tới 5 chữ số thập phân
//   → MC lệch < 0.004° (cùng cung, cùng độ tới ~0.01°). North Node DÙNG CHÍNH
//     biểu thức Meeus 47.7 nên trùng khớp tuyệt đối với reference.
//
// Anchor A: 1990-05-20 12:00:00 UTC, TP.HCM (lat 10.82, lon 106.63 Đông)
//   astronomy-engine → MC = 163.19700° (Virgo 13.197°) · Node = 311.07178° (Aquarius 11.072°)
// Anchor B: 2000-01-01 00:00:00 UTC, Hà Nội (lat 21.03, lon 105.85 Đông)
//   astronomy-engine → MC = 207.79960° (Libra 27.800°) · Node = 125.07168° (Leo 5.072°)

describe('mcLongitude — kiểm chứng vs astronomy-engine 2.1.19', () => {
  it('Anchor A 1990-05-20 12:00 UTC, lon 106.63E → MC ≈ 163.197° (Virgo)', () => {
    const jd = julianDay(1990, 5, 20, 12, 0, 0);
    const mc = mcLongitude(jd, 106.63);
    const ref = 163.197;
    const diff = Math.abs(mc - ref);
    expect(Math.min(diff, 360 - diff)).toBeLessThan(0.01);
    expect(signName(mc)).toBe('Virgo');
  });

  it('Anchor B 2000-01-01 00:00 UTC, lon 105.85E → MC ≈ 207.800° (Libra)', () => {
    const jd = julianDay(2000, 1, 1, 0, 0, 0);
    const mc = mcLongitude(jd, 105.85);
    const ref = 207.7996;
    const diff = Math.abs(mc - ref);
    expect(Math.min(diff, 360 - diff)).toBeLessThan(0.01);
    expect(signName(mc)).toBe('Libra');
  });
});

describe('meanNorthNodeLongitude — kiểm chứng vs Meeus 47.7 / astronomy-engine', () => {
  it('Anchor A 1990-05-20 12:00 UTC → North Node ≈ 311.072° (Aquarius)', () => {
    const jd = julianDay(1990, 5, 20, 12, 0, 0);
    const node = meanNorthNodeLongitude(jd);
    const ref = 311.07178;
    const diff = Math.abs(node - ref);
    expect(Math.min(diff, 360 - diff)).toBeLessThan(0.001);
    expect(signName(node)).toBe('Aquarius');
  });

  it('Anchor B 2000-01-01 00:00 UTC → North Node ≈ 125.072° (Leo)', () => {
    const jd = julianDay(2000, 1, 1, 0, 0, 0);
    const node = meanNorthNodeLongitude(jd);
    const ref = 125.07168;
    const diff = Math.abs(node - ref);
    expect(Math.min(diff, 360 - diff)).toBeLessThan(0.001);
    expect(signName(node)).toBe('Leo');
  });

  it('North Node lùi dần theo thời gian (chuyển động nghịch ~19.3°/năm)', () => {
    const jd0 = julianDay(2000, 1, 1, 0, 0, 0);
    const jd1 = julianDay(2001, 1, 1, 0, 0, 0);
    // norm360 quanh wrap — so chênh lệch chuẩn hoá phải âm (lùi).
    let delta = meanNorthNodeLongitude(jd1) - meanNorthNodeLongitude(jd0);
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    expect(delta).toBeLessThan(0);
    expect(delta).toBeCloseTo(-19.34, 0); // ~19.34°/năm
  });
});

// ── Whole-Sign houses: gán nhà cho một cung Mọc đã biết ───────────────────────
//
// Quy tắc: Hellenistic Whole-Sign. Nhà 1 = nguyên cung chứa cung Mọc; nhà 2..12 là
// các cung kế tiếp theo thứ tự hoàng đạo. house(body) = ((idx_cung − idx_Mọc + 12) % 12) + 1.

describe('wholeSignHouses / houseOf — Ascendant đã biết', () => {
  it('Mọc ở Cancer (idx 3): nhà 1 = Cancer, nhà 2 = Leo, …, nhà 12 = Gemini', () => {
    // Dựng một Ascendant tối thiểu với cung = Cancer (idx 3) để kiểm quy tắc Whole-Sign.
    const ascCancer = { sign: { idx: 3 } } as never;
    const houses = wholeSignHouses(ascCancer);
    expect(houses).toHaveLength(12);
    expect(houses[0]!.house).toBe(1);
    expect(houses[0]!.sign.idx).toBe(3); // Cancer
    expect(houses[1]!.sign.idx).toBe(4); // Leo
    expect(houses[11]!.sign.idx).toBe(2); // Gemini (nhà 12)
  });

  it('houseOf: cùng cung Mọc → nhà 1; cung kế → nhà 2; cung đối → nhà 7', () => {
    const asc = { sign: { idx: 3 } } as never; // Cancer
    expect(houseOf({ sign: { idx: 3 } } as never, asc)).toBe(1); // Cancer
    expect(houseOf({ sign: { idx: 4 } } as never, asc)).toBe(2); // Leo
    expect(houseOf({ sign: { idx: 9 } } as never, asc)).toBe(7); // Capricorn (đối Cancer)
    expect(houseOf({ sign: { idx: 2 } } as never, asc)).toBe(12); // Gemini
  });
});

// ── computeChart: trường mới ADDITIVE — không phá vỡ output cũ ─────────────────

describe('computeChart — trường mới (additive)', () => {
  const withLoc = computeChart({
    year: 1990,
    month: 5,
    day: 20,
    hour: 12,
    minute: 0,
    tzOffsetMinutes: 420,
    latitude: 10.82,
    longitude: 106.63,
  });
  const noLoc = computeChart({ year: 1990, month: 5, day: 20, hour: 12, minute: 0, tzOffsetMinutes: 420 });

  it('nodes luôn có (kể cả khi KHÔNG có nơi sinh)', () => {
    expect(noLoc.nodes).toBeDefined();
    expect(noLoc.nodes!.south.longitude).toBeCloseTo(
      ((noLoc.nodes!.north.longitude + 180) % 360 + 360) % 360,
      5,
    );
  });

  it('angles/houses CHỈ có khi cung cấp nơi sinh', () => {
    expect(noLoc.angles).toBeUndefined();
    expect(noLoc.houses).toBeUndefined();
    expect(withLoc.angles).toBeDefined();
    expect(withLoc.houses).toHaveLength(12);
  });

  it('IC = MC + 180; DSC = Ascendant + 180', () => {
    const a = withLoc.angles!;
    const wrap = (x: number) => ((x % 360) + 360) % 360;
    expect(a.ic.longitude).toBeCloseTo(wrap(a.mc.longitude + 180), 5);
    expect(a.dsc.longitude).toBeCloseTo(wrap(withLoc.ascendant!.longitude + 180), 5);
  });

  it('nhà 1 = cung chứa Ascendant; mỗi thiên thể có house 1–12 khi có nơi sinh', () => {
    expect(withLoc.houses![0]!.sign.idx).toBe(withLoc.ascendant!.sign.idx);
    expect(withLoc.sun.house).toBeGreaterThanOrEqual(1);
    expect(withLoc.sun.house).toBeLessThanOrEqual(12);
    for (const p of withLoc.planets) {
      expect(p.position.house).toBeGreaterThanOrEqual(1);
      expect(p.position.house).toBeLessThanOrEqual(12);
      // house khớp công thức houseOf
      expect(p.position.house).toBe(houseOf(p.position, withLoc.ascendant!));
    }
    // KHÔNG có nơi sinh → không gán house
    expect(noLoc.sun.house).toBeUndefined();
  });

  it('aspects luôn được tính; mỗi mục có orb hợp lệ và 2 thiên thể khác nhau', () => {
    expect(Array.isArray(withLoc.aspects)).toBe(true);
    for (const asp of withLoc.aspects!) {
      expect(asp.bodyA).not.toBe(asp.bodyB);
      expect(asp.orb).toBeGreaterThanOrEqual(0);
      expect(asp.orb).toBeLessThanOrEqual(8);
      expect(asp.exactAngle).toBeGreaterThanOrEqual(0);
      expect(asp.exactAngle).toBeLessThanOrEqual(180);
    }
  });

  it('retrograde: mỗi hành tinh có cờ boolean', () => {
    for (const p of withLoc.planets) {
      expect(typeof p.retrograde).toBe('boolean');
    }
  });

  it('output CŨ vẫn nguyên: sun/moon/planets(8)/ascendant', () => {
    expect(withLoc.sun.sign.name).toBe('Kim Ngưu');
    expect(withLoc.moon.sign.name).toBe('Song Ngư');
    expect(withLoc.planets).toHaveLength(8);
    expect(withLoc.ascendant).toBeDefined();
  });
});
