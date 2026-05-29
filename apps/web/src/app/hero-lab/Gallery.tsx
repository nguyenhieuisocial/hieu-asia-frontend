'use client';

import * as React from 'react';
import { HeroLab } from './HeroLab';
import { VariantScrollTell } from './VariantScrollTell';
import { VariantAstrolabe3D } from './VariantAstrolabe3D';
import { VariantAmbientStars } from './VariantAmbientStars';

/**
 * Gallery — switcher nội bộ cho 4 concept hero trên /hero-lab.
 * Mỗi lần đổi tab → remount (key) để hiệu ứng vẽ chạy lại từ đầu.
 * Chỉ 1 biến thể được mount tại một thời điểm → không đụng CSS giữa các prefix.
 */

const TABS: { key: string; label: string; node: React.ComponentType }[] = [
  { key: 'p1', label: 'P1 · Lập lá số', node: HeroLab },
  { key: 'scroll', label: 'P2 · Scroll-telling', node: VariantScrollTell },
  { key: 'astro', label: '3D · Thiên bàn', node: VariantAstrolabe3D },
  { key: 'stars', label: 'Sao · Tinh vân', node: VariantAmbientStars },
];

export function Gallery() {
  const [i, setI] = React.useState(0);
  const Active = TABS[i]?.node ?? HeroLab;

  return (
    <div className="gl">
      <style>{GCSS}</style>

      <div className="gl-stage" key={i}>
        <Active />
      </div>

      <nav className="gl-switch" aria-label="Chọn biến thể hero">
        <span className="gl-brand" aria-hidden="true">HERO LAB</span>
        {TABS.map((t, k) => (
          <button
            key={t.key}
            type="button"
            className={`gl-tab${k === i ? ' gl-on' : ''}`}
            aria-pressed={k === i}
            onClick={() => setI(k)}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

const GCSS = `
.gl { position: relative; }
.gl-switch {
  position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
  z-index: 9999; display: flex; align-items: center; gap: 4px;
  background: rgba(243,236,221,.92); backdrop-filter: blur(8px);
  border: 1px solid rgba(23,20,17,.16); border-radius: 999px;
  padding: 5px 6px; box-shadow: 0 10px 28px -14px rgba(23,20,17,.55);
  max-width: calc(100vw - 20px); overflow-x: auto; -webkit-overflow-scrolling: touch;
}
.gl-brand {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .18em;
  color: #A47532; padding: 0 8px 0 6px; white-space: nowrap;
}
.gl-tab {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; white-space: nowrap;
  border: none; background: transparent; color: #6B6358;
  padding: 7px 13px; border-radius: 999px; cursor: pointer;
  transition: background .2s ease, color .2s ease;
}
.gl-tab:hover { color: #171411; }
.gl-on, .gl-on:hover { background: #171411; color: #F3ECDD; }
@media (max-width: 600px) {
  .gl-brand { display: none; }
  .gl-tab { font-size: 11px; padding: 7px 10px; }
}
`;
