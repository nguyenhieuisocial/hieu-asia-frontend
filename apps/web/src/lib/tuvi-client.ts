/**
 * Tử Vi v2 chart client — fetches structured 12-cung chart from the worker
 * via a Next.js proxy route. The worker engine (iztro-backed) returns 114
 * stars per chart along with palace metadata.
 *
 * Why a wrapper:
 *   - Single shape contract used by the interactive chart + Mentor evidence.
 *   - Lets us cache by birth-key in localStorage for instant re-renders.
 *   - Normalizes hour input (0–23) regardless of upstream timeIndex (0–12).
 */

const API_BASE = process.env.NEXT_PUBLIC_HIEU_API_URL ?? 'https://api.hieu.asia';

export interface TuViStar {
  name: string;
  type: string;
  scope: string;
  brightness?: string;
  mutagen?: string;
}

export interface TuViDecadal {
  range: number[]; // [start_age, end_age]
  heavenlyStem: string;
  earthlyBranch: string;
}

export interface TuViPalace {
  index: number;
  name: string;
  isBodyPalace: boolean;
  isOriginalPalace: boolean;
  heavenlyStem: string;
  earthlyBranch: string;
  majorStars: TuViStar[];
  minorStars: TuViStar[];
  adjectiveStars: TuViStar[];
  changsheng12?: string;
  boshi12?: string;
  jiangqian12?: string;
  suiqian12?: string;
  decadal?: TuViDecadal;
  ages?: number[];
}

export interface TuViChartMeta {
  solarDate: string;
  lunarDate: string;
  chineseDate: string;
  time: string;
  timeRange: string;
  sign: string;
  zodiac: string;
  earthlyBranchOfSoulPalace: string;
  earthlyBranchOfBodyPalace: string;
  soul: string;
  body: string;
  fiveElementsClass: string;
  gender: string;
  language: string;
}

export interface TuViChart {
  meta: TuViChartMeta;
  palaces: TuViPalace[];
}

export interface CastChartInput {
  /** Format YYYY-MM-DD (solar date). */
  birthSolarDate: string;
  /** 0–23, wall-clock hour at birth place. */
  birthHour: number;
  gender: 'male' | 'female';
  language?: 'vi-VN' | 'en-US' | 'zh-CN';
}

const CACHE_PREFIX = 'hieu.tuvi.v2.';

function cacheKey(input: CastChartInput): string {
  return (
    CACHE_PREFIX +
    [input.birthSolarDate, input.birthHour, input.gender, input.language ?? 'vi-VN'].join(':')
  );
}

/**
 * POST /tools/tuvi-v2 — fetch a chart.
 * Cached in localStorage by birth-key; chart is deterministic per input.
 */
export async function castTuViChart(input: CastChartInput): Promise<TuViChart> {
  if (typeof window !== 'undefined') {
    const cached = window.localStorage.getItem(cacheKey(input));
    if (cached) {
      try {
        return JSON.parse(cached) as TuViChart;
      } catch {
        /* fall through to refetch */
      }
    }
  }

  const res = await fetch(`${API_BASE}/tools/tuvi-v2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      birthSolarDate: input.birthSolarDate,
      birthHour: input.birthHour,
      gender: input.gender === 'female' ? 'F' : 'M',
      language: input.language ?? 'vi-VN',
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Tử Vi chart fetch failed (HTTP ${res.status}): ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as { ok: boolean; chart?: TuViChart; error?: string };
  if (!data.ok || !data.chart) {
    throw new Error(data.error ?? 'Tử Vi chart fetch failed');
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(cacheKey(input), JSON.stringify(data.chart));
    } catch {
      /* quota — ignore */
    }
  }
  return data.chart;
}

/**
 * Looks up a palace by its Vietnamese name.
 * Returns null if not found (defensive — the engine may rename in future).
 */
export function findPalaceByName(chart: TuViChart, name: string): TuViPalace | null {
  const target = name.toLowerCase().normalize('NFC');
  return (
    chart.palaces.find((p) => p.name.toLowerCase().normalize('NFC') === target) ?? null
  );
}

/**
 * Tam phương tứ chính — given a palace index (0=Mệnh by iztro convention),
 * returns the indexes of its three other "trigon" palaces.
 *
 * In Tử Vi, tam phương tứ chính = Mệnh + cung đối diện (hợp) + 2 cung tam hợp.
 * The opposite palace is +6 mod 12; the two trigon palaces are +4 and +8 mod 12.
 */
export function tamPhuongTuChinh(centerIndex: number): number[] {
  return [
    centerIndex,
    (centerIndex + 4) % 12,
    (centerIndex + 6) % 12,
    (centerIndex + 8) % 12,
  ];
}
