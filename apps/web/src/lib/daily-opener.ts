/**
 * Daily horoscope opener generator.
 *
 * Background: the upstream /api/daily/horoscope returns a `detailed_text` that
 * was identical across 12 zodiacs (e.g. "Ngày khá thuận, giữ năng lượng cho
 * việc quan trọng") — even when overall score was 4/10. That destroyed the
 * "engine deterministic + AI diễn giải" credibility.
 *
 * Fix: build a 12 zodiac × 4 score band matrix of short openers. The opener
 * combines two pieces:
 *   1. A 1-line zodiac character template (Tý "động", Mùi "tĩnh", …)
 *   2. A score-band suffix (8-10 thuận lợi rõ rệt, 1-3 cần thận trọng, …)
 *
 * Composition keeps copy ~50 chars — the existing `h.detailed_text` from the
 * backend is still appended below for the longer body.
 */

export type ScoreBand = 'excellent' | 'good' | 'neutral' | 'caution';

export function scoreBand(score: number): ScoreBand {
  if (score >= 8) return 'excellent';
  if (score >= 6) return 'good';
  if (score >= 4) return 'neutral';
  return 'caution';
}

/**
 * Per-zodiac character — 1 short Vietnamese clause that names the natural
 * tendency of the chi. Lower-case to compose with score-band suffix.
 */
const ZODIAC_CHARACTER: Record<string, string> = {
  ty: 'Tý nhanh trí, nhạy với cơ hội',
  suu: 'Sửu vững chí, hợp việc bền bỉ',
  dan: 'Dần quyết đoán, ưa dẫn đầu',
  mao: 'Mão mềm dẻo, khéo điều hoà',
  thin: 'Thìn nhiều khát vọng, dễ vươn xa',
  ti: 'Tỵ tinh tế, hợp việc đòi chiều sâu',
  ngo: 'Ngọ năng động, dễ bật khi có nhịp',
  mui: 'Mùi điềm tĩnh, hợp việc cần nhẫn',
  than: 'Thân linh hoạt, ứng biến nhanh',
  dau: 'Dậu kỷ luật, hợp việc cần chi tiết',
  tuat: 'Tuất trung thành, vững khi giữ người',
  hoi: 'Hợi chân thành, hợp việc cần thiện chí',
};

/**
 * Score-band suffix — 1 short Vietnamese clause connected by ", hôm nay".
 * Tone: warm, direct, no fortune-telling.
 */
const BAND_SUFFIX: Record<ScoreBand, string> = {
  excellent:
    'hôm nay là ngày thuận lợi rõ rệt — tận dụng các quyết định lớn, mạnh dạn đề xuất, mở rộng liên kết.',
  good:
    'hôm nay thuận với mức vừa — phù hợp duy trì, hoàn thành việc đang dở, ít thử nghiệm mới.',
  neutral:
    'hôm nay khá trung tính — giữ kế hoạch cũ, tránh khởi sự lớn, dành thời gian cho việc đã hẹn.',
  caution:
    'hôm nay cần thận trọng — tránh chốt quyết định quan trọng, ưu tiên nghỉ ngơi và rà soát lại.',
};

/**
 * Build an opener combining zodiac character + score-band suffix.
 *
 * @param zodiacKey - normalized zodiac slug (ty, suu, dan, …, ti, …)
 * @param score - overall score 0–10
 * @returns 1-sentence opener (~50–110 chars)
 */
export function getZodiacDailyOpener(zodiacKey: string, score: number): string {
  const band = scoreBand(score);
  // Fall back to a generic character if slug unknown (defensive).
  const character = ZODIAC_CHARACTER[zodiacKey] ?? 'Bạn';
  const suffix = BAND_SUFFIX[band];
  return `${character}, ${suffix}`;
}
