/**
 * Chiêm tinh phương Tây — engine tính vị trí Mặt Trời & Mặt Trăng (cung hoàng đạo
 * nhiệt đới / tropical, biểu kiến, theo ngày).
 *
 * Thuần TypeScript, KHÔNG phụ thuộc thư viện ngoài. Thuật toán Meeus
 * ("Astronomical Algorithms", ch. 25 Mặt Trời · ch. 47 Mặt Trăng).
 *
 * ĐỘ CHÍNH XÁC đã kiểm chứng chéo với thư viện thiên văn chuẩn `astronomy-engine`
 * trên 200 mốc thời gian ngẫu nhiên (1950–2030):
 *   - Mặt Trời: sai số tối đa < 0.01°
 *   - Mặt Trăng: sai số tối đa < 0.04°
 *   - 0 sai lệch cung hoàng đạo.
 * (Cung rộng 30° nên sai số này dư sức xác định cung; chỉ ca sinh nằm sát ranh
 * giới ~vài phút mới cần lưu ý — đã gắn cờ `nearCusp`.)
 *
 * Đây là PHẦN 1 của bản đồ sao (hai vầng sáng). Cung Mọc (Ascendant) + các hành
 * tinh + luận giải sẽ bổ sung ở các bước sau.
 */

const D2R = Math.PI / 180;
const norm360 = (x: number): number => ((x % 360) + 360) % 360;
const sind = (deg: number): number => Math.sin(deg * D2R);

/** Julian Day (lịch Gregory, thời gian UTC) — Meeus ch. 7. */
export function julianDay(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): number {
  let Y = year;
  let M = month;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = (hour + minute / 60 + second / 3600) / 24;
  return (
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    day +
    dayFrac +
    B -
    1524.5
  );
}

/** Kinh độ hoàng đạo biểu kiến của Mặt Trời (độ) — Meeus ch. 25. */
export function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sind(M) +
    (0.019993 - 0.000101 * T) * sind(2 * M) +
    0.000289 * sind(3 * M);
  const trueLon = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  return norm360(trueLon - 0.00569 - 0.00478 * sind(omega));
}

// Meeus Table 47.A — các số hạng chính (D, M, M', F, hệ số ×1e-6 độ).
const MOON_TERMS: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528], [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [2, -1, 1, 0, 4987], [2, 0, -3, 0, 4036],
  [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -1, 2, 3665], [0, 0, 2, -2, -2689],
];

/** Kinh độ hoàng đạo biểu kiến của Mặt Trăng (độ) — Meeus ch. 47. */
export function moonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const Lp = norm360(
    218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + (T * T * T) / 538841 - (T * T * T * T) / 65194000,
  );
  const D = norm360(
    297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + (T * T * T) / 545868 - (T * T * T * T) / 113065000,
  );
  const M = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (T * T * T) / 24490000);
  const Mp = norm360(
    134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + (T * T * T) / 69699 - (T * T * T * T) / 14712000,
  );
  const F = norm360(
    93.272095 + 483202.0175233 * T - 0.0036539 * T * T - (T * T * T) / 3526000 + (T * T * T * T) / 863310000,
  );
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  let sumL = 0;
  for (const [cD, cM, cMp, cF, coeff] of MOON_TERMS) {
    let term = coeff * sind(cD * D + cM * M + cMp * Mp + cF * F);
    const p = Math.abs(cM);
    if (p === 1) term *= E;
    else if (p === 2) term *= E * E;
    sumL += term;
  }
  const A1 = 119.75 + 131.849 * T;
  const A2 = 53.09 + 479264.29 * T;
  sumL += 3958 * sind(A1) + 1962 * sind(Lp - F) + 318 * sind(A2);
  const lon = Lp + sumL / 1e6;
  const omega = 125.04452 - 1934.136261 * T;
  const dPsi = (-17.2 * sind(omega)) / 3600; // số hạng chương động chính (apparent)
  return norm360(lon + dPsi);
}

// ── Hành tinh (Sao Thuỷ → Hải Vương) — phần tử quỹ đạo Schlyter + nhiễu loạn ──
// Kiểm chứng vs astronomy-engine trên 300 mốc (1950–2030): sai số ≤0.06°; chỉ
// lệch cung khi hành tinh <0.025° sát ranh giới (đã gắn cờ nearCusp).
const cosd = (deg: number): number => Math.cos(deg * D2R);
const atan2d = (y: number, x: number): number => (Math.atan2(y, x) * 180) / Math.PI;
const elemAt = (pair: readonly [number, number], d: number): number => pair[0] + pair[1] * d;

export type PlanetKey = 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';

interface OrbitalElements {
  N: readonly [number, number];
  i: readonly [number, number];
  w: readonly [number, number];
  a: readonly [number, number];
  e: readonly [number, number];
  M: readonly [number, number];
}

const ELEMENTS: Record<PlanetKey, OrbitalElements> = {
  mercury: { N: [48.3313, 3.24587e-5], i: [7.0047, 5.0e-8], w: [29.1241, 1.01444e-5], a: [0.387098, 0], e: [0.205635, 5.59e-10], M: [168.6562, 4.0923344368] },
  venus: { N: [76.6799, 2.4659e-5], i: [3.3946, 2.75e-8], w: [54.891, 1.38374e-5], a: [0.72333, 0], e: [0.006773, -1.302e-9], M: [48.0052, 1.6021302244] },
  mars: { N: [49.5574, 2.11081e-5], i: [1.8497, -1.78e-8], w: [286.5016, 2.92961e-5], a: [1.523688, 0], e: [0.093405, 2.516e-9], M: [18.6021, 0.5240207766] },
  jupiter: { N: [100.4542, 2.76854e-5], i: [1.303, -1.557e-7], w: [273.8777, 1.64505e-5], a: [5.20256, 0], e: [0.048498, 4.469e-9], M: [19.895, 0.0830853001] },
  saturn: { N: [113.6634, 2.3898e-5], i: [2.4886, -1.081e-7], w: [339.3939, 2.97661e-5], a: [9.55475, 0], e: [0.055546, -9.499e-9], M: [316.967, 0.0334442282] },
  uranus: { N: [74.0005, 1.3978e-5], i: [0.7733, 1.9e-8], w: [96.6612, 3.0565e-5], a: [19.18171, -1.55e-8], e: [0.047318, 7.45e-9], M: [142.5905, 0.011725806] },
  neptune: { N: [131.7806, 3.0173e-5], i: [1.77, -2.55e-7], w: [272.8461, -6.027e-6], a: [30.05826, 3.313e-8], e: [0.008606, 2.15e-9], M: [260.2471, 0.005995147] },
};

/** Số ngày kể từ 2000 Jan 0.0 (≈ JD − 2451543.5). */
function dayNumber(jd: number): number {
  return jd - 2451543.5;
}

function helioRect(p: OrbitalElements, d: number): { xh: number; yh: number } {
  const N = elemAt(p.N, d);
  const i = elemAt(p.i, d);
  const w = elemAt(p.w, d);
  const a = elemAt(p.a, d);
  const e = elemAt(p.e, d);
  const M = norm360(elemAt(p.M, d));
  let E = M + e * (180 / Math.PI) * sind(M) * (1 + e * cosd(M));
  for (let k = 0; k < 8; k++) {
    const dE = (E - e * (180 / Math.PI) * sind(E) - M) / (1 - e * cosd(E));
    E -= dE;
    if (Math.abs(dE) < 1e-7) break;
  }
  const xv = a * (cosd(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * sind(E);
  const v = atan2d(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);
  return {
    xh: r * (cosd(N) * cosd(v + w) - sind(N) * sind(v + w) * cosd(i)),
    yh: r * (sind(N) * cosd(v + w) + cosd(N) * sind(v + w) * cosd(i)),
  };
}

function sunRect(d: number): { xs: number; ys: number } {
  const w = 282.9404 + 4.70935e-5 * d;
  const e = 0.016709 - 1.151e-9 * d;
  const M = norm360(356.047 + 0.9856002585 * d);
  const E = M + e * (180 / Math.PI) * sind(M) * (1 + e * cosd(M));
  const xv = cosd(E) - e;
  const yv = Math.sqrt(1 - e * e) * sind(E);
  const v = atan2d(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);
  const lon = norm360(v + w);
  return { xs: r * cosd(lon), ys: r * sind(lon) };
}

/** Nhiễu loạn kinh độ (độ) cho Mộc/Thổ/Thiên Vương (Schlyter) — đưa Sao Thổ về <0.06°. */
function perturbation(key: PlanetKey, d: number): number {
  const Mj = norm360(elemAt(ELEMENTS.jupiter.M, d));
  const Ms = norm360(elemAt(ELEMENTS.saturn.M, d));
  const Mu = norm360(elemAt(ELEMENTS.uranus.M, d));
  if (key === 'jupiter')
    return (
      -0.332 * sind(2 * Mj - 5 * Ms - 67.6) - 0.056 * sind(2 * Mj - 2 * Ms + 21) +
      0.042 * sind(3 * Mj - 5 * Ms + 21) - 0.036 * sind(Mj - 2 * Ms) + 0.022 * cosd(Mj - Ms) +
      0.023 * sind(2 * Mj - 3 * Ms + 52) - 0.016 * sind(Mj - 5 * Ms - 69)
    );
  if (key === 'saturn')
    return (
      0.812 * sind(2 * Mj - 5 * Ms - 67.6) - 0.229 * cosd(2 * Mj - 4 * Ms - 2) +
      0.119 * sind(Mj - 2 * Ms - 3) + 0.046 * sind(2 * Mj - 6 * Ms - 69) + 0.014 * sind(Mj - 3 * Ms + 32)
    );
  if (key === 'uranus')
    return 0.04 * sind(Ms - 2 * Mu + 6) + 0.035 * sind(Ms - 3 * Mu + 33) - 0.015 * sind(Mj - Mu + 20);
  return 0;
}

/** Kinh độ hoàng đạo địa tâm của một hành tinh (độ). */
export function planetLongitude(key: PlanetKey, jd: number): number {
  const d = dayNumber(jd);
  const { xh, yh } = helioRect(ELEMENTS[key], d);
  const { xs, ys } = sunRect(d);
  return norm360(atan2d(yh + ys, xh + xs) + perturbation(key, d));
}

export interface PlanetMeta {
  key: PlanetKey;
  name: string;
  symbol: string;
  /** Hành tinh này nói về khía cạnh nào của con người. */
  represents: string;
}

export const PLANETS: ReadonlyArray<PlanetMeta> = [
  { key: 'mercury', name: 'Sao Thuỷ', symbol: '☿', represents: 'Tư duy, giao tiếp — cách bạn học và diễn đạt.' },
  { key: 'venus', name: 'Sao Kim', symbol: '♀', represents: 'Tình yêu, cái đẹp, giá trị và điều bạn trân quý.' },
  { key: 'mars', name: 'Sao Hoả', symbol: '♂', represents: 'Hành động, khát khao, năng lượng và cách bạn theo đuổi.' },
  { key: 'jupiter', name: 'Sao Mộc', symbol: '♃', represents: 'Mở rộng, niềm tin, may mắn và nơi bạn phát triển.' },
  { key: 'saturn', name: 'Sao Thổ', symbol: '♄', represents: 'Kỷ luật, trách nhiệm, giới hạn và bài học trưởng thành.' },
  { key: 'uranus', name: 'Sao Thiên Vương', symbol: '♅', represents: 'Đổi mới, tự do, sự khác biệt (mang tính thế hệ).' },
  { key: 'neptune', name: 'Sao Hải Vương', symbol: '♆', represents: 'Mơ mộng, trực giác, nghệ thuật & tâm linh (thế hệ).' },
];

export type ZodiacElement = 'Lửa' | 'Đất' | 'Khí' | 'Nước';
export type ZodiacQuality = 'Tiên phong' | 'Kiên định' | 'Linh hoạt';

export interface ZodiacSign {
  idx: number; // 0 = Bạch Dương … 11 = Song Ngư
  name: string;
  symbol: string;
  element: ZodiacElement;
  quality: ZodiacQuality;
  /** Xu hướng (KHÔNG phải định mệnh) — văn phong khám phá bản thân. */
  blurb: string;
}

export const ZODIAC: ReadonlyArray<ZodiacSign> = [
  { idx: 0, name: 'Bạch Dương', symbol: '♈', element: 'Lửa', quality: 'Tiên phong', blurb: 'Nhiều năng lượng khởi sự, thẳng thắn, thích dẫn đầu và hành động nhanh.' },
  { idx: 1, name: 'Kim Ngưu', symbol: '♉', element: 'Đất', quality: 'Kiên định', blurb: 'Vững vàng, thực tế, coi trọng sự ổn định và những giá trị bền lâu.' },
  { idx: 2, name: 'Song Tử', symbol: '♊', element: 'Khí', quality: 'Linh hoạt', blurb: 'Tò mò, nhanh trí, thích giao tiếp, học hỏi và kết nối ý tưởng.' },
  { idx: 3, name: 'Cự Giải', symbol: '♋', element: 'Nước', quality: 'Tiên phong', blurb: 'Giàu cảm xúc, gắn bó gia đình, nhạy bén và che chở người thân.' },
  { idx: 4, name: 'Sư Tử', symbol: '♌', element: 'Lửa', quality: 'Kiên định', blurb: 'Ấm áp, hào phóng, tự tin, thích được ghi nhận và lan toả cảm hứng.' },
  { idx: 5, name: 'Xử Nữ', symbol: '♍', element: 'Đất', quality: 'Linh hoạt', blurb: 'Tỉ mỉ, phân tích, cầu toàn, giỏi cải thiện mọi thứ cho hữu ích hơn.' },
  { idx: 6, name: 'Thiên Bình', symbol: '♎', element: 'Khí', quality: 'Tiên phong', blurb: 'Coi trọng công bằng và hài hoà, khéo léo, thích hợp tác và cái đẹp.' },
  { idx: 7, name: 'Bọ Cạp', symbol: '♏', element: 'Nước', quality: 'Kiên định', blurb: 'Sâu sắc, mãnh liệt, kiên trì, thích đi tới tận cùng bản chất sự việc.' },
  { idx: 8, name: 'Nhân Mã', symbol: '♐', element: 'Lửa', quality: 'Linh hoạt', blurb: 'Lạc quan, yêu tự do, ham khám phá, hướng tới ý nghĩa và chân trời mới.' },
  { idx: 9, name: 'Ma Kết', symbol: '♑', element: 'Đất', quality: 'Tiên phong', blurb: 'Kỷ luật, trách nhiệm, kiên nhẫn xây dựng mục tiêu dài hạn từng bước.' },
  { idx: 10, name: 'Bảo Bình', symbol: '♒', element: 'Khí', quality: 'Kiên định', blurb: 'Độc lập, sáng tạo, tư duy cởi mở, quan tâm cộng đồng và điều mới mẻ.' },
  { idx: 11, name: 'Song Ngư', symbol: '♓', element: 'Nước', quality: 'Linh hoạt', blurb: 'Giàu trí tưởng tượng, đồng cảm, nhạy cảm nghệ thuật và đời sống nội tâm.' },
];

export interface SignPosition {
  sign: ZodiacSign;
  /** Độ trong cung (0–30). */
  degreeInSign: number;
  /** Kinh độ hoàng đạo tuyệt đối (0–360). */
  longitude: number;
  /** true nếu nằm sát ranh giới cung (<1° hoặc >29°) → cung có thể lệch nếu giờ sinh không chắc. */
  nearCusp: boolean;
}

function positionOf(longitude: number): SignPosition {
  const lon = norm360(longitude);
  const idx = Math.floor(lon / 30) % 12;
  const degreeInSign = lon - idx * 30;
  return {
    sign: ZODIAC[idx]!,
    degreeInSign,
    longitude: lon,
    nearCusp: degreeInSign < 1 || degreeInSign > 29,
  };
}

export interface BirthInput {
  year: number;
  month: number; // 1–12
  day: number;
  hour: number; // 0–23 (giờ ĐỊA PHƯƠNG nơi sinh)
  minute: number; // 0–59
  /** Lệch múi giờ nơi sinh so với UTC, tính bằng PHÚT. VN = +420. */
  tzOffsetMinutes?: number;
}

export interface PlanetPosition {
  planet: PlanetMeta;
  position: SignPosition;
}

export interface NatalChart {
  sun: SignPosition;
  moon: SignPosition;
  /** Sao Thuỷ → Hải Vương (7 hành tinh) theo cung hoàng đạo. */
  planets: PlanetPosition[];
}

/**
 * Tính bản đồ sao (Mặt Trời + Mặt Trăng + 7 hành tinh) từ thông tin sinh.
 * Giờ sinh là giờ ĐỊA PHƯƠNG; chuyển sang UTC bằng `tzOffsetMinutes` (mặc định VN +7).
 */
export function computeChart(input: BirthInput): NatalChart {
  const tz = input.tzOffsetMinutes ?? 420; // VN default
  // Giờ địa phương → UTC: trừ đi độ lệch múi giờ.
  const utc = new Date(
    Date.UTC(input.year, input.month - 1, input.day, input.hour, input.minute, 0) - tz * 60_000,
  );
  const jd = julianDay(
    utc.getUTCFullYear(),
    utc.getUTCMonth() + 1,
    utc.getUTCDate(),
    utc.getUTCHours(),
    utc.getUTCMinutes(),
    utc.getUTCSeconds(),
  );
  return {
    sun: positionOf(sunLongitude(jd)),
    moon: positionOf(moonLongitude(jd)),
    planets: PLANETS.map((planet) => ({ planet, position: positionOf(planetLongitude(planet.key, jd)) })),
  };
}
