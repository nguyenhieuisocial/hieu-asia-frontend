/**
 * StructuredChart — minimal renderer for the typed chart envelope that the
 * worker returns on /decisions/brief and /mentor/skills/decision (Wave 18).
 *
 * The shape mirrors `ChartContext` in the worker
 * (`backend/.../llm/output-validator-adapter.ts`):
 *   { palaces: string[]; mainStars: string[]; auxStars: string[]; transformations: string[] }
 *
 * This is NOT a faithful Tử Vi grid — it's a compact, accessible list of the
 * 12 palaces (or however many the chart supplies) plus the star pools that
 * were used to gate the LLM output. Rendered alongside the markdown-ish brief
 * so users can verify the LLM was looking at the right chart anchors.
 */

import { Sparkles } from 'lucide-react';

export interface StructuredChartProps {
  chart: {
    palaces: string[];
    mainStars: string[];
    auxStars: string[];
    transformations: string[];
  };
  className?: string;
}

export function StructuredChart({ chart, className }: StructuredChartProps) {
  const stars = [
    ...chart.mainStars,
    ...chart.auxStars,
    ...chart.transformations,
  ];
  // Hide entirely if there's nothing to show — the caller may pass an empty
  // chart when the brief was generated without a structured chart.
  if (chart.palaces.length === 0 && stars.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="structured-chart-heading"
      className={[
        'rounded-lg border border-gold/15 bg-ink/40 p-5',
        className ?? '',
      ].join(' ')}
    >
      <h2
        id="structured-chart-heading"
        className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.32em] text-gold/80"
      >
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Lá số tham chiếu
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-cream/60">
        Các cung và sao đã được dùng để đối chiếu nội dung dưới đây.
      </p>

      {chart.palaces.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-cream/60">
            12 cung ({chart.palaces.length})
          </p>
          <ul
            role="list"
            className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4"
          >
            {chart.palaces.map((p) => (
              <li
                key={p}
                className="rounded border border-cream/10 bg-ink/60 px-2.5 py-1.5 text-xs text-cream/85"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {chart.mainStars.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-cream/60">
            Chính tinh ({chart.mainStars.length})
          </p>
          <ul role="list" className="mt-2 flex flex-wrap gap-1.5">
            {chart.mainStars.map((s) => (
              <li
                key={s}
                className="inline-flex items-center rounded-full border border-gold/30 bg-gold/5 px-2.5 py-0.5 text-xs text-cream/90"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {chart.auxStars.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-cream/60">
            Phụ tinh ({chart.auxStars.length})
          </p>
          <ul role="list" className="mt-2 flex flex-wrap gap-1.5">
            {chart.auxStars.map((s) => (
              <li
                key={s}
                className="inline-flex items-center rounded-full border border-cream/15 bg-ink/60 px-2.5 py-0.5 text-xs text-cream/75"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {chart.transformations.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-cream/60">
            Tứ hoá ({chart.transformations.length})
          </p>
          <ul role="list" className="mt-2 flex flex-wrap gap-1.5">
            {chart.transformations.map((t) => (
              <li
                key={t}
                className="inline-flex items-center rounded-full border border-jade/30 bg-jade/5 px-2.5 py-0.5 text-xs text-cream/85"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
