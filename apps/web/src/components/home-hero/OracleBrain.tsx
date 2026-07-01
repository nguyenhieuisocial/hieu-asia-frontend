'use client';

import * as React from 'react';
import { TOOLKIT_GROUPS } from '@/lib/catalog/tools';
import { ShimmerText } from '@/components/fx/ShimmerText';
import { Marquee } from '@/components/fx/Marquee';
import { buildBanMenh, type BanMenhData } from '@/lib/ban-menh-data';

/**
 * OracleBrain — the signature "night-sky" section: the whole toolkit (Eastern
 * classics + modern psychology + astrology + intuition) converging on "BẠN".
 *
 * HTML + SVG (NOT canvas) so the labels are real DOM text → Google Translate
 * can translate them, percentage layout never clips, and motion is calm CSS
 * (draw-in on view + breathe + twinkle), fully gated by prefers-reduced-motion.
 *
 * v2 — richer: each domain hub sprouts satellite tool-nodes (the "dozens of
 * tools" breadth) and reveals its tool count on hover; faint branch lines +
 * a converging data pulse make the "everything flows into you" thesis visible.
 *
 * v3 — TAP TO FOCUS (mobile-first): chạm/click một nhóm → nhóm đó nổi bật +
 * các nhóm khác mờ đi, và một bảng chi tiết liệt kê TÊN công cụ thật hiện ra.
 *
 * v4 — SOI THỬ (demo sống): khách nhập NĂM SINH → chòm sao "đọc" (hội tụ) → tâm
 * "BẠN" phản chiếu MỘT LÁT CẮT THẬT về họ (can chi, con giáp, mệnh nạp âm, màu
 * hợp — tính bằng engine `buildBanMenh`, deterministic, chạy client, KHÔNG lưu)
 * → CTA lập lá số đầy đủ. Biến hero từ "thực đơn" thành bản demo sống lời hứa
 * "AI nối tất cả lại để bạn hiểu mình". Gated bởi prefers-reduced-motion.
 */

const ALL_TOOLS = TOOLKIT_GROUPS.flatMap((g) => g.tools.map((t) => t.n));

const RADIUS = 33; // hub distance from center (% of box)
const SAT_R = 6.5; // satellite cluster radius around a hub (% of box)

const HUBS = TOOLKIT_GROUPS.map((g, i, arr) => {
  const a = ((-90 + (360 / arr.length) * i) * Math.PI) / 180;
  const left = 50 + Math.cos(a) * RADIUS;
  const top = 50 + Math.sin(a) * RADIUS;
  // more tools → more satellites (the breadth is the point), capped for clarity
  const nSat = Math.max(3, Math.min(5, Math.round(g.tools.length / 3)));
  const sats = Array.from({ length: nSat }, (_, k) => {
    const sa = a + (k - (nSat - 1) / 2) * 0.42;
    return { left: left + Math.cos(sa) * SAT_R, top: top + Math.sin(sa) * SAT_R };
  });
  return { label: g.label, count: g.tools.length, tools: g.tools.map((t) => t.n), left, top, sats };
});

// Deterministic starfield (SSR-stable).
const STARS = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 53 + 7) % 100,
  top: (i * 31 + 11) % 100,
  delay: (i % 6) * 0.5,
}));

export function OracleBrain(): React.JSX.Element {
  const [hover, setHover] = React.useState<number | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [inView, setInView] = React.useState(false);
  const graphRef = React.useRef<HTMLDivElement | null>(null);

  // v4 — Soi thử (demo sống)
  const [year, setYear] = React.useState('');
  const [reveal, setReveal] = React.useState<BanMenhData | null>(null);
  const [reading, setReading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const reducedRef = React.useRef(false);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    try {
      reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      /* ignore */
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  React.useEffect(() => {
    const el = graphRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onSoi = (e: React.FormEvent): void => {
    e.preventDefault();
    const data = buildBanMenh(parseInt(year, 10));
    if (!data) {
      setErr('Nhập năm sinh dương lịch từ 1950 đến 2026.');
      return;
    }
    setErr(null);
    if (reducedRef.current) {
      setReveal(data);
      return;
    }
    setReading(true);
    timerRef.current = window.setTimeout(() => {
      setReveal(data);
      setReading(false);
    }, 950);
  };

  const resetReveal = (): void => {
    setReveal(null);
    setYear('');
    setErr(null);
  };

  // Highlight = đang hover HOẶC đã chọn (click/tap).
  const isOn = (i: number) => hover === i || selected === i;
  const sel = selected !== null ? HUBS[selected] : null;
  const hopColors = reveal
    ? Array.from(new Set([...reveal.banMenhColors, ...reveal.hopColors])).slice(0, 4)
    : [];

  return (
    <section
      aria-label="Bộ não Oracle — AI hợp nhất toàn bộ công cụ về bạn"
      className="ob-section px-6 py-section"
    >
      <div className="mx-auto max-w-marketing text-center">
        <p className="ob-eyebrow font-mono text-editorial-mono uppercase tracking-[0.12em]">
          Bộ não Oracle
        </p>
        <h2 className="ob-title mx-auto mt-3 max-w-2xl text-editorial-h2 font-normal">
          Hàng chục công cụ — <ShimmerText>một bức tranh</ShimmerText> về bạn.
        </h2>
        <p className="ob-sub mx-auto mt-3 max-w-xl text-editorial-caption">
          Cổ học Á Đông, tâm lý hiện đại, chiêm tinh, trực giác — AI nối tất cả lại để bạn hiểu
          mình sâu.
        </p>

        {/* v4 — Lời mời chính: nhập năm sinh, "bộ não" soi thử một lát cắt THẬT. */}
        {!reveal && (
          <form className="ob-soi" onSubmit={onSoi}>
            <label htmlFor="ob-year" className="ob-soi-label">
              Nhập năm sinh — để bộ não soi thử một lát cắt về bạn
            </label>
            <div className="ob-soi-row">
              <input
                id="ob-year"
                className="ob-soi-input"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="VD 1990"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value.replace(/\D/g, '').slice(0, 4));
                  if (err) setErr(null);
                }}
                aria-describedby={err ? 'ob-year-err' : 'ob-year-note'}
                aria-invalid={err ? true : undefined}
              />
              <button type="submit" className="ob-soi-btn" disabled={reading}>
                {reading ? 'Đang đọc…' : 'Soi thử'}
              </button>
            </div>
            {err ? (
              <span id="ob-year-err" className="ob-soi-err" role="alert">
                {err}
              </span>
            ) : (
              <span id="ob-year-note" className="ob-soi-note">
                Chỉ tính từ năm sinh · không lưu gì · hoặc chạm một nhóm bên dưới
              </span>
            )}
          </form>
        )}

        <div
          ref={graphRef}
          data-in={inView || undefined}
          data-sel={selected !== null || undefined}
          data-reading={reading || undefined}
          data-revealed={reveal ? true : undefined}
          className="ob-graph"
          role="img"
          aria-label="Năm nhóm công cụ hội tụ về Bạn"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        >
          <svg className="ob-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {/* main lines: hub → center (first → nth-of-type stagger works) */}
            {HUBS.map((h, i) => (
              <line
                key={`l${i}`}
                x1="50"
                y1="50"
                x2={h.left}
                y2={h.top}
                pathLength={1}
                vectorEffect="non-scaling-stroke"
                className={`ob-line${isOn(i) ? ' ob-line-on' : ''}`}
              />
            ))}
            {/* faint branch lines: hub → its satellites */}
            {HUBS.map((h, i) =>
              h.sats.map((s, k) => (
                <line
                  key={`b${i}-${k}`}
                  x1={h.left}
                  y1={h.top}
                  x2={s.left}
                  y2={s.top}
                  vectorEffect="non-scaling-stroke"
                  className={`ob-branch${isOn(i) ? ' ob-branch-on' : ''}`}
                />
              )),
            )}
          </svg>

          {STARS.map((s, i) => (
            <span
              key={i}
              className="ob-star"
              style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}
              aria-hidden="true"
            />
          ))}

          {/* converging data pulses (one per hub, travels hub → center) */}
          {HUBS.map((h, i) => (
            <span
              key={`p${i}`}
              className="ob-pulse"
              aria-hidden="true"
              style={
                {
                  '--sx': `${h.left}%`,
                  '--sy': `${h.top}%`,
                  animationDelay: `${i * 0.6}s`,
                } as React.CSSProperties
              }
            />
          ))}

          {/* satellite tool-nodes */}
          {HUBS.map((h, i) =>
            h.sats.map((s, k) => (
              <span
                key={`s${i}-${k}`}
                className={`ob-sat${isOn(i) ? ' ob-sat-on' : ''}`}
                style={{ left: `${s.left}%`, top: `${s.top}%` }}
                aria-hidden="true"
              />
            )),
          )}

          <div className="ob-center" style={{ left: '50%', top: '50%' }}>
            <span className="ob-center-glow" aria-hidden="true" />
            <span className="ob-center-dot" aria-hidden="true" />
            <span className="ob-center-label">BẠN</span>
            <span className="ob-center-sub">
              {reveal ? `${reveal.zodiac.ten} · mệnh ${reveal.elementName}` : 'hiểu mình sâu'}
            </span>
          </div>

          {HUBS.map((h, i) => (
            <button
              key={h.label}
              type="button"
              aria-pressed={selected === i}
              className={`ob-hub${isOn(i) ? ' ob-hub-on' : ''}${selected === i ? ' ob-hub-sel' : ''}`}
              style={{ left: `${h.left}%`, top: `${h.top}%` }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              onClick={() => setSelected((s) => (s === i ? null : i))}
            >
              <span className="ob-hub-dot" aria-hidden="true" />
              <span className="ob-hub-label">{h.label}</span>
              <span className="ob-hub-count">{h.count} công cụ</span>
            </button>
          ))}
        </div>

        {/* v4 — Lát cắt THẬT về khách (tính từ năm sinh; chưa lưu gì). */}
        {reveal && (
          <div className="ob-detail-wrap">
            <div className="ob-reveal" role="region" aria-live="polite" aria-label="Lát cắt về bạn">
              <div className="ob-reveal-head">
                <span className="ob-reveal-emoji" aria-hidden="true">
                  {reveal.zodiac.emoji}
                </span>
                <span className="ob-reveal-heading">
                  <span className="ob-reveal-title">
                    Tuổi {reveal.canChi} · con {reveal.zodiac.ten}
                  </span>
                  <span className="ob-reveal-menh">
                    Mệnh {reveal.elementName} — {reveal.napAmName}
                  </span>
                </span>
                <button
                  type="button"
                  className="ob-detail-close"
                  onClick={resetReveal}
                  aria-label="Thử năm khác"
                >
                  ×
                </button>
              </div>
              <p className="ob-reveal-body">
                {hopColors.length > 0 && <>Hợp màu {hopColors.join(', ')}. </>}
                {reveal.careers.length > 0 && <>Hợp hướng nghề {reveal.careers.slice(0, 2).join(', ')}. </>}
                Đây mới là một lát cắt từ năm sinh — bức tranh đầy đủ cần ngày, giờ sinh.
              </p>
              <div className="ob-reveal-actions">
                <a
                  href="/onboarding?intent=self"
                  draggable={false}
                  className="ob-reveal-cta font-mono text-editorial-mono uppercase tracking-[0.12em]"
                >
                  Xem bức tranh đầy đủ →
                </a>
                <button type="button" className="ob-reveal-again" onClick={resetReveal}>
                  Thử năm khác
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bảng chi tiết — hiện khi chạm/chọn một nhóm. Tên công cụ là DOM text
            (dịch được). Chạm "×" hoặc chạm lại nhóm để thu về. */}
        {sel && (
          <div className="ob-detail-wrap">
            <div className="ob-detail" role="region" aria-label={`Công cụ nhóm ${sel.label}`}>
              <div className="ob-detail-head">
                <span className="ob-detail-title">{sel.label}</span>
                <span className="ob-detail-count">{sel.count} công cụ</span>
                <button
                  type="button"
                  className="ob-detail-close"
                  onClick={() => setSelected(null)}
                  aria-label="Đóng chi tiết"
                >
                  ×
                </button>
              </div>
              <div className="ob-detail-tools">
                {sel.tools.map((t) => (
                  <span key={t} className="ob-detail-tool">
                    {t}
                  </span>
                ))}
              </div>
              <a
                href="/cong-cu"
                draggable={false}
                className="ob-detail-link font-mono text-editorial-mono uppercase tracking-[0.12em] underline underline-offset-4"
              >
                Khám phá nhóm này →
              </a>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Marquee speed={34}>
            {ALL_TOOLS.map((t) => (
              <span key={t} className="ob-tool font-mono text-editorial-mono uppercase tracking-[0.12em]">
                {t}
              </span>
            ))}
          </Marquee>
        </div>
        <div className="mt-6 text-center">
          <a
            href="/cong-cu"
            className="ob-link inline-block whitespace-nowrap font-mono text-editorial-mono uppercase tracking-[0.12em] underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            Xem tất cả công cụ →
          </a>
        </div>
      </div>
    </section>
  );
}
