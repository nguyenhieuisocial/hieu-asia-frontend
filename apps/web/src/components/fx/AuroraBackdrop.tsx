import * as React from 'react';

/**
 * AuroraBackdrop — soft drifting "aurora" glow behind hero content.
 *
 * Pure CSS (blurred radial-gradient blobs + slow keyframe drift) → GPU-cheap,
 * no canvas, no RAF. Decorative: absolute inset-0, pointer-events-none,
 * aria-hidden. Honors prefers-reduced-motion (blobs hold still). Warm
 * ochre/gold tones so it reads on the light Paper base without muddying it.
 *
 * CSS lives in globals.css (`.aur*`) — NOT an inline `<style>`. React 19
 * relocates/dedupes inline `<style>` tags, so two AuroraBackdrop instances
 * (hero + MultiHero) injecting identical `<style>` caused a server/client
 * placement mismatch → hydration error #418. Class-only divs avoid that.
 * Opacity intensity is themed via `data-i` → the `--ao` custom property.
 */
export function AuroraBackdrop({
  className = '',
  intensity = 'subtle',
}: {
  className?: string;
  intensity?: 'subtle' | 'rich';
}): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={`aur ${className}`.trim()}
      data-i={intensity === 'rich' ? 'rich' : undefined}
    >
      <div className="aur-blob aur-a" />
      <div className="aur-blob aur-b" />
      <div className="aur-blob aur-c" />
      <div className="aur-blob aur-d" />
    </div>
  );
}
