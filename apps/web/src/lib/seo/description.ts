/**
 * Clamp a meta description to a max length WITHOUT cutting mid-word.
 *
 * Several templated pages used to build a description and then hard-cut it with
 * `.slice(0, 158)`, which left snippets ending mid-word (e.g. "…của giai đo") —
 * broken-looking in Google SERPs. This helper trims at the last word boundary
 * within the budget, drops a dangling separator/conjunction, and appends a real
 * ellipsis so the snippet always reads as a complete phrase.
 *
 * No content rewrite — same source text, just a clean cut.
 */
export function clampDescription(text: string, max = 160): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const budget = max - 1; // leave room for the ellipsis char
  const hardCut = t.slice(0, budget);
  const lastSpace = hardCut.lastIndexOf(' ');
  // Only fall back to a word boundary if it isn't chopping off too much; a very
  // early space (e.g. one long unbroken token) → keep the hard cut.
  const base = lastSpace > budget * 0.5 ? hardCut.slice(0, lastSpace) : hardCut;
  return base.replace(/[\s.,;:—–-]+$/, '') + '…';
}
