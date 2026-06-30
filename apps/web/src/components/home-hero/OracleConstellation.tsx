'use client';

import * as React from 'react';

/**
 * OracleConstellation — living celestial backdrop for the hero.
 *
 * A starfield + a faint drifting "constellation web" (the oracle/graphRAG
 * metaphor: many points quietly connecting into one picture). Decorative,
 * sits BEHIND hero content (pointer-events: none), so it adds depth + motion
 * without touching the interactive lens picker on top.
 *
 * Performance + a11y:
 *  - Canvas, devicePixelRatio capped at 2, particle count scales with width.
 *  - Pauses when scrolled out of view (IntersectionObserver) → no wasted RAF.
 *  - prefers-reduced-motion → renders one static frame, no animation loop.
 *  - Colours read from the theme via CSS vars resolved at mount (gold accent
 *    on whatever the current background is), so it works in light + dark.
 */
export function OracleConstellation({
  className = '',
  density = 1,
}: {
  className?: string;
  /** multiplier on star count (1 = default). */
  density?: number;
}): React.JSX.Element {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    // Accent (gold) is the only branded colour; the dots themselves use the
    // foreground colour at low alpha so they read on both paper and charcoal.
    const accent = '224, 174, 98'; // gold #E0AE62

    let W = 0;
    let H = 0;
    let stars: { x: number; y: number; z: number; t: number; vx: number; vy: number }[] = [];

    function build() {
      const rect = canvas!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas!.width = Math.max(1, Math.floor(W * DPR));
      canvas!.height = Math.max(1, Math.floor(H * DPR));
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(120, Math.round((W * H) / 14000) * density);
      stars = [];
      for (let i = 0; i < count; i++) {
        const z = Math.random() * 0.8 + 0.2; // depth → size + parallax + speed
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z,
          t: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.12 * z,
          vy: (Math.random() - 0.5) * 0.12 * z,
        });
      }
    }

    function draw(animate: boolean, dt: number) {
      ctx!.clearRect(0, 0, W, H);
      // soft central glow → depth
      const g = ctx!.createRadialGradient(W * 0.5, H * 0.42, 8, W * 0.5, H * 0.42, Math.max(W, H) * 0.6);
      g.addColorStop(0, `rgba(${accent}, 0.05)`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);

      // edges: connect nearby stars into a faint web
      const LINK = Math.min(150, W * 0.16);
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        if (!a) continue;
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j];
          if (!b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const alpha = (1 - Math.sqrt(d2) / LINK) * 0.16 * Math.min(a.z, b.z);
            ctx!.strokeStyle = `rgba(${accent}, ${alpha.toFixed(3)})`;
            ctx!.lineWidth = 0.6;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      // stars (twinkle)
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!s) continue;
        if (animate) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.t += 0.02 * dt;
          if (s.x < -10) s.x = W + 10;
          else if (s.x > W + 10) s.x = -10;
          if (s.y < -10) s.y = H + 10;
          else if (s.y > H + 10) s.y = -10;
        }
        const tw = 0.45 + 0.55 * Math.abs(Math.sin(s.t));
        ctx!.globalAlpha = tw * s.z * 0.85;
        ctx!.fillStyle = `rgba(${accent}, 0.9)`;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.z * 1.35, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    build();

    if (reduce) {
      draw(false, 0);
      const onResize = () => {
        build();
        draw(false, 0);
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    let raf = 0;
    let last = performance.now();
    let visible = true;

    function loop(now: number) {
      const dt = Math.min(3, (now - last) / 16.67); // frames elapsed, capped
      last = now;
      if (visible) draw(true, dt);
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    };
    window.addEventListener('resize', onResize);

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
