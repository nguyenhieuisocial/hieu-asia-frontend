/**
 * SafetyBlock — rose-alert UI shown when the worker safety gate
 * declines to produce a brief (safe=false response). Displays the
 * worker's reply text plus optional follow-up suggestions.
 *
 * Extracted from /decisions/new monolith (Wave 60.58 T1.1).
 */

import { ShieldAlert } from 'lucide-react';

export type SafetyBlockData = {
  category: string;
  reply: string;
  followUps: string[];
};

export function SafetyBlock({ block }: { block: SafetyBlockData }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-rose-500/40 bg-rose-900/10 p-4"
    >
      <div className="flex items-start gap-3">
        <ShieldAlert
          className="mt-0.5 h-5 w-5 shrink-0 text-rose-300"
          aria-hidden="true"
        />
        <div className="space-y-2 text-sm leading-relaxed text-foreground/85">
          <p>{block.reply}</p>
          {block.followUps.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground">Gợi ý:</p>
              <ul className="ml-4 list-disc space-y-1 text-xs text-muted-foreground">
                {block.followUps.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
