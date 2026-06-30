'use client';

import * as React from 'react';
import { TOOLKIT_GROUPS } from '@/lib/catalog/tools';
import { ShimmerText } from '@/components/fx/ShimmerText';

/**
 * OracleBrain — the signature "night-sky" section: a living graph of the whole
 * toolkit converging on "BẠN" (you → deep self-understanding). This is the
 * product thesis made visible: dozens of tools (Eastern classics + modern
 * psychology + astrology + intuition) that the AI unifies into one picture.
 *
 * Deliberately a DARK band inside the light page → the gold stars actually glow
 * (they wash out on the light hero). Canvas-based, data-driven from the tools
 * catalog (no drift), interactive (hover a domain → its tools light up), and
 * perf/a11y safe (DPR capped, pauses offscreen, static under reduced-motion).
 */

// Up to 7 satellites per hub so the arc stays readable; the breadth is the point.
const HUBS = TOOLKIT_GROUPS.map((g) => ({
  label: g.label,
  tools: g.tools.slice(0, 7).map((t) => t.n),
  total: g.tools.length,
}));

export function OracleBrain(): React.JSX.Element {
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
    const GOLD = '224, 174, 98';
    let W = 0;
    let H = 0;
    let mx = -1;
    let my = -1;
    const stars: { x: number; y: number; z: number; t: number }[] = [];

    function build() {
      const rect = canvas!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas!.width = Math.max(1, Math.floor(W * DPR));
      canvas!.height = Math.max(1, Math.floor(H * DPR));
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      stars.length = 0;
      const n = Math.min(90, Math.round((W * H) / 16000));
      for (let i = 0; i < n; i++) {
        stars.push({ x: Math.random(), y: Math.random(), z: Math.random() * 0.7 + 0.3, t: Math.random() * Math.PI * 2 });
      }
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, W, H);
      const cx = W * 0.5;
      const cy = H * 0.5;
      const R = Math.min(W * 0.42, H * 0.4);

      // glow + starfield
      const g = ctx!.createRadialGradient(cx, cy, 6, cx, cy, R * 1.8);
      g.addColorStop(0, `rgba(${GOLD}, 0.07)`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!s) continue;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + s.t));
        ctx!.globalAlpha = tw * s.z * 0.55;
        ctx!.fillStyle = '#ECEAE3';
        ctx!.beginPath();
        ctx!.arc(s.x * W, s.y * H, s.z * 1.1, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      // hub positions on a ring; detect hover
      const hubs = HUBS.map((h, i) => {
        const a = -Math.PI / 2 + (i * (Math.PI * 2)) / HUBS.length;
        return { ...h, x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R * 0.86, a };
      });
      let hovered = -1;
      for (let i = 0; i < hubs.length; i++) {
        const h = hubs[i];
        if (h && mx >= 0 && Math.hypot(mx - h.x / W, my - h.y / H) < 0.12) hovered = i;
      }

      for (let i = 0; i < hubs.length; i++) {
        const h = hubs[i];
        if (!h) continue;
        const on = hovered === i || hovered === -1;
        const ea = hovered === i ? 0.9 : hovered === -1 ? 0.42 : 0.1;
        // edge hub -> center
        const grad = ctx!.createLinearGradient(h.x, h.y, cx, cy);
        grad.addColorStop(0, `rgba(${GOLD}, ${(ea * 0.5).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${GOLD}, ${ea.toFixed(3)})`);
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = hovered === i ? 2 : 1.1;
        ctx!.beginPath();
        ctx!.moveTo(h.x, h.y);
        ctx!.lineTo(cx, cy);
        ctx!.stroke();
        if (!reduce) {
          const pp = (t * 0.5 + i * 0.2) % 1;
          ctx!.fillStyle = `rgba(245,225,170, ${ea.toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(h.x + (cx - h.x) * pp, h.y + (cy - h.y) * pp, 1.7, 0, Math.PI * 2);
          ctx!.fill();
        }
        // satellites (tools)
        const m = h.tools.length;
        for (let k = 0; k < m; k++) {
          const sa = h.a + (k - (m - 1) / 2) * 0.3;
          const sr = R * 0.4;
          const sx = h.x + Math.cos(sa) * sr;
          const sy = h.y + Math.sin(sa) * sr * 0.88 + (reduce ? 0 : Math.sin(t + k + i) * 2);
          ctx!.strokeStyle = `rgba(${GOLD}, ${on ? 0.26 : 0.07})`;
          ctx!.lineWidth = 0.8;
          ctx!.beginPath();
          ctx!.moveTo(h.x, h.y);
          ctx!.lineTo(sx, sy);
          ctx!.stroke();
          ctx!.fillStyle = `rgba(${GOLD}, ${on ? 0.9 : 0.32})`;
          ctx!.beginPath();
          ctx!.arc(sx, sy, on ? 2.4 : 1.5, 0, Math.PI * 2);
          ctx!.fill();
          if (hovered === i) {
            ctx!.font = '500 10px system-ui, sans-serif';
            ctx!.textAlign = 'center';
            ctx!.fillStyle = 'rgba(236,234,227,0.92)';
            ctx!.fillText(h.tools[k] ?? '', sx, sy - 6);
          }
        }
        // hub node + label
        const hr = hovered === i ? 6 : 4.5;
        const hg = ctx!.createRadialGradient(h.x, h.y, 0, h.x, h.y, hr * 4);
        hg.addColorStop(0, `rgba(${GOLD}, ${on ? 0.5 : 0.22})`);
        hg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.fillStyle = hg;
        ctx!.beginPath();
        ctx!.arc(h.x, h.y, hr * 4, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = '#E0AE62';
        ctx!.beginPath();
        ctx!.arc(h.x, h.y, hr, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.font = '600 11.5px system-ui, sans-serif';
        ctx!.textAlign = 'center';
        ctx!.fillStyle = on ? '#F5F2EC' : 'rgba(232,228,216,0.55)';
        const ly = h.y < cy ? h.y - hr - 9 : h.y + hr + 17;
        ctx!.fillText(h.label, h.x, ly);
      }

      // center — BẠN
      const pr = 8 + (reduce ? 0 : Math.sin(t * 2) * 1.2);
      const cg = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 44);
      cg.addColorStop(0, 'rgba(245,225,170,0.5)');
      cg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx!.fillStyle = cg;
      ctx!.beginPath();
      ctx!.arc(cx, cy, 44, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = '#F5E1AA';
      ctx!.beginPath();
      ctx!.arc(cx, cy, pr, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.font = '700 15px system-ui, sans-serif';
      ctx!.textAlign = 'center';
      ctx!.fillStyle = '#F5F2EC';
      ctx!.fillText('BẠN', cx, cy - pr - 11);
      ctx!.font = 'italic 11px Georgia, serif';
      ctx!.fillStyle = '#E0AE62';
      ctx!.fillText('hiểu mình sâu', cx, cy + pr + 19);
    }

    build();
    if (reduce) {
      draw(0);
      const onResize = () => {
        build();
        draw(0);
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    let raf = 0;
    let t = 0;
    let visible = true;
    function loop() {
      t += 0.01;
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    }
    const io = new IntersectionObserver((e) => { visible = e[0]?.isIntersecting ?? true; }, { threshold: 0 });
    io.observe(canvas);
    const onMove = (e: MouseEvent) => {
      const r = canvas!.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
    };
    const onLeave = () => { mx = -1; my = -1; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    let rt = 0;
    const onResize = () => { window.clearTimeout(rt); rt = window.setTimeout(build, 150); };
    window.addEventListener('resize', onResize);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(rt);
    };
  }, []);

  return (
    <section
      aria-label="Bộ não Oracle — AI hợp nhất toàn bộ công cụ về bạn"
      style={{ background: '#14161A', position: 'relative', overflow: 'hidden' }}
      className="px-6 py-section"
    >
      <div className="mx-auto max-w-marketing text-center">
        <p className="font-mono text-editorial-mono uppercase tracking-[0.12em]" style={{ color: '#E0AE62' }}>
          Bộ não Oracle
        </p>
        <h2
          className="mx-auto mt-3 max-w-2xl text-editorial-h2 font-normal"
          style={{ color: '#F5F2EC' }}
        >
          Hàng chục công cụ — <ShimmerText>một bức tranh</ShimmerText> về bạn.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-editorial-caption" style={{ color: '#A8A6A0' }}>
          Cổ học Á Đông, tâm lý hiện đại, chiêm tinh, trực giác — AI nối tất cả lại để bạn hiểu
          mình sâu. Di chuột vào một nhóm để xem các công cụ.
        </p>
        <div className="mx-auto mt-6 w-full" style={{ maxWidth: 760, aspectRatio: '16 / 11' }}>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>
        <a
          href="/cong-cu"
          className="mt-4 inline-block font-mono text-editorial-mono uppercase tracking-[0.12em] underline underline-offset-4 transition-opacity hover:opacity-80"
          style={{ color: '#E0AE62' }}
        >
          Xem tất cả công cụ →
        </a>
      </div>
    </section>
  );
}
