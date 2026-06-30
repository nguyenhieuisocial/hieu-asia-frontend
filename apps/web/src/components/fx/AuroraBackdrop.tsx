'use client';

import * as React from 'react';

/**
 * AuroraBackdrop — soft drifting "aurora" glow behind hero content.
 *
 * Pure CSS (blurred radial-gradient blobs + slow keyframe drift) → GPU-cheap,
 * no canvas, no RAF. Decorative: absolute inset-0, pointer-events-none,
 * aria-hidden. Honors prefers-reduced-motion (blobs hold still). Warm
 * ochre/gold tones so it reads on the light Paper base without muddying it.
 */
export function AuroraBackdrop({
  className = '',
  intensity = 'subtle',
}: {
  className?: string;
  intensity?: 'subtle' | 'rich';
}): React.JSX.Element {
  const op = intensity === 'rich' ? 0.55 : 0.32;
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      <style>{`
        @keyframes auroraA { 0%,100%{transform:translate(-12%,-8%) scale(1)} 50%{transform:translate(8%,6%) scale(1.18)} }
        @keyframes auroraB { 0%,100%{transform:translate(10%,-6%) scale(1.1)} 50%{transform:translate(-6%,10%) scale(0.92)} }
        @keyframes auroraC { 0%,100%{transform:translate(-4%,10%) scale(0.95)} 50%{transform:translate(6%,-8%) scale(1.15)} }
        .aur-blob{position:absolute;border-radius:9999px;filter:blur(60px);will-change:transform;}
        .aur-a{top:-10%;left:8%;width:46%;height:60%;background:radial-gradient(circle,rgba(224,174,98,VAR) 0%,rgba(224,174,98,0) 70%);animation:auroraA 18s ease-in-out infinite;}
        .aur-b{top:6%;right:2%;width:42%;height:55%;background:radial-gradient(circle,rgba(164,117,50,VAR) 0%,rgba(164,117,50,0) 70%);animation:auroraB 22s ease-in-out infinite;}
        .aur-c{bottom:-14%;left:30%;width:50%;height:60%;background:radial-gradient(circle,rgba(212,162,97,VAR) 0%,rgba(212,162,97,0) 70%);animation:auroraC 26s ease-in-out infinite;}
        @media (prefers-reduced-motion: reduce){ .aur-a,.aur-b,.aur-c{animation:none;} }
      `.replace(/VAR/g, String(op))}</style>
      <div className="aur-blob aur-a" />
      <div className="aur-blob aur-b" />
      <div className="aur-blob aur-c" />
    </div>
  );
}
