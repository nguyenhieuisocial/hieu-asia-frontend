'use client';

import * as React from 'react';
import { Reveal, Parallax } from './_kit/scroll';

/**
 * SecCung — Section 3 "Bản đồ 12 cung" (cách hoạt động), scroll-telling.
 *
 * Lá số 12 cung STICKY một bên; bên kia 5 đoạn cuộn qua, mỗi đoạn 1 cung.
 * Đoạn nào vào giữa viewport (IntersectionObserver) → cung tương ứng SÁNG ochre,
 * cung khác mờ; tâm lá số đổi tên cung. "Lướt tới đâu sáng cung tới đó".
 *
 * RÀNG BUỘC tuân thủ:
 *  - 'use client', tự vẽ SVG (không import la-so thật), self-contained.
 *  - transform/opacity ONLY cho motion; không scroll-jacking; cuộn tự nhiên.
 *  - prefers-reduced-motion: reduce → lá số tĩnh, MỌI cung rõ; đoạn liệt kê tĩnh,
 *    không phụ thuộc scroll/IO. SSR-safe: text trong DOM, không ẩn cứng.
 *  - TS strict + noUncheckedIndexedAccess: guard index mảng cẩn thận.
 */

const INK = '#171411';
const OCHRE = '#A47532';
const PAPER = '#F3ECDD';
const SOFT = '#6B6358';
const CHARCOAL = '#15110C';
const GOLD = '#D4A261';

/* ── Hình học lá số: tâm 200,200 · vòng ngoài r=180 · vòng trong r=95 ──
 * 12 wedge (annular sector), cung i = cung [-105+30i .. -75+30i]°.
 * lx/ly = điểm neo nhãn (bán kính giữa). Dữ liệu sinh sẵn, đã verify khớp
 * path cung Mệnh trong spec.
 */
const WEDGES: ReadonlyArray<{ d: string; lx: number; ly: number }> = [
  { d: 'M153.4 26.1 A180 180 0 0 1 246.6 26.1 L224.6 108.2 A95 95 0 0 0 175.4 108.2 Z', lx: 200.0, ly: 62.5 },
  { d: 'M246.6 26.1 A180 180 0 0 1 327.3 72.7 L267.2 132.8 A95 95 0 0 0 224.6 108.2 Z', lx: 268.8, ly: 80.9 },
  { d: 'M327.3 72.7 A180 180 0 0 1 373.9 153.4 L291.8 175.4 A95 95 0 0 0 267.2 132.8 Z', lx: 319.1, ly: 131.2 },
  { d: 'M373.9 153.4 A180 180 0 0 1 373.9 246.6 L291.8 224.6 A95 95 0 0 0 291.8 175.4 Z', lx: 337.5, ly: 200.0 },
  { d: 'M373.9 246.6 A180 180 0 0 1 327.3 327.3 L267.2 267.2 A95 95 0 0 0 291.8 224.6 Z', lx: 319.1, ly: 268.8 },
  { d: 'M327.3 327.3 A180 180 0 0 1 246.6 373.9 L224.6 291.8 A95 95 0 0 0 267.2 267.2 Z', lx: 268.8, ly: 319.1 },
  { d: 'M246.6 373.9 A180 180 0 0 1 153.4 373.9 L175.4 291.8 A95 95 0 0 0 224.6 291.8 Z', lx: 200.0, ly: 337.5 },
  { d: 'M153.4 373.9 A180 180 0 0 1 72.7 327.3 L132.8 267.2 A95 95 0 0 0 175.4 291.8 Z', lx: 131.3, ly: 319.1 },
  { d: 'M72.7 327.3 A180 180 0 0 1 26.1 246.6 L108.2 224.6 A95 95 0 0 0 132.8 267.2 Z', lx: 80.9, ly: 268.8 },
  { d: 'M26.1 246.6 A180 180 0 0 1 26.1 153.4 L108.2 175.4 A95 95 0 0 0 108.2 224.6 Z', lx: 62.5, ly: 200.0 },
  { d: 'M26.1 153.4 A180 180 0 0 1 72.7 72.7 L132.8 132.8 A95 95 0 0 0 108.2 175.4 Z', lx: 80.9, ly: 131.2 },
  { d: 'M72.7 72.7 A180 180 0 0 1 153.4 26.1 L175.4 108.2 A95 95 0 0 0 132.8 132.8 Z', lx: 131.2, ly: 80.9 },
];

/* 24 tick ngoài, mỗi 15° — chi tiết trang trí cho cảm giác "thiên bàn". */
const TICKS: ReadonlyArray<{ x1: number; y1: number; x2: number; y2: number }> = [
  { x1: 200.0, y1: 14.0, x2: 200.0, y2: 4.0 },
  { x1: 248.1, y1: 20.3, x2: 250.7, y2: 10.7 },
  { x1: 293.0, y1: 38.9, x2: 298.0, y2: 30.3 },
  { x1: 331.5, y1: 68.5, x2: 338.6, y2: 61.4 },
  { x1: 361.1, y1: 107.0, x2: 369.7, y2: 102.0 },
  { x1: 379.7, y1: 151.9, x2: 389.3, y2: 149.3 },
  { x1: 386.0, y1: 200.0, x2: 396.0, y2: 200.0 },
  { x1: 379.7, y1: 248.1, x2: 389.3, y2: 250.7 },
  { x1: 361.1, y1: 293.0, x2: 369.7, y2: 298.0 },
  { x1: 331.5, y1: 331.5, x2: 338.6, y2: 338.6 },
  { x1: 293.0, y1: 361.1, x2: 298.0, y2: 369.7 },
  { x1: 248.1, y1: 379.7, x2: 250.7, y2: 389.3 },
  { x1: 200.0, y1: 386.0, x2: 200.0, y2: 396.0 },
  { x1: 151.9, y1: 379.7, x2: 149.3, y2: 389.3 },
  { x1: 107.0, y1: 361.1, x2: 102.0, y2: 369.7 },
  { x1: 68.5, y1: 331.5, x2: 61.4, y2: 338.6 },
  { x1: 38.9, y1: 293.0, x2: 30.3, y2: 298.0 },
  { x1: 20.3, y1: 248.1, x2: 10.7, y2: 250.7 },
  { x1: 14.0, y1: 200.0, x2: 4.0, y2: 200.0 },
  { x1: 20.3, y1: 151.9, x2: 10.7, y2: 149.3 },
  { x1: 38.9, y1: 107.0, x2: 30.3, y2: 102.0 },
  { x1: 68.5, y1: 68.5, x2: 61.4, y2: 61.4 },
  { x1: 107.0, y1: 38.9, x2: 102.0, y2: 30.3 },
  { x1: 151.9, y1: 20.3, x2: 149.3, y2: 10.7 },
];

/* Nhãn 12 cung (theo chiều wedge index). 5 cung kể chuyện được tô đậm. */
const CUNG_NAMES: ReadonlyArray<string> = [
  'Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc',
  'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ',
];

/* 5 đoạn kể chuyện. wedge = index cung trên lá số sẽ sáng (rải quanh vòng:
 * Mệnh 0 → Quan Lộc 4 → Tài Bạch 8 → Phu Thê 10 → Thiên Di 6 → trải đều, vòng dịch). */
type Panel = {
  wedge: number;
  name: string;
  domain: string;
  heading: string;
  body: string;
};
const PANELS: ReadonlyArray<Panel> = [
  {
    wedge: 0,
    name: 'Mệnh',
    domain: 'Con người',
    heading: 'Cung Mệnh — bạn là ai',
    body:
      'Điểm khởi đầu của tấm bản đồ. Cung Mệnh phác bản tính cốt lõi: cách bạn phản ứng, điều khiến bạn bền bỉ, và những thiên hướng dễ dẫn lối. Hiểu Mệnh là hiểu cái nền mọi quyết định đứng lên trên đó.',
  },
  {
    wedge: 4,
    name: 'Quan Lộc',
    domain: 'Sự nghiệp',
    heading: 'Cung Quan Lộc — con đường công việc',
    body:
      'Nơi nói về sự nghiệp, vị thế và cách bạn tạo dấu ấn. Không phải lời tiên đoán chức danh, mà là kiểu môi trường khiến bạn toả sáng — và kiểu khiến bạn hao mòn. Một lăng kính để chọn việc, chứ không phải để chờ vận.',
  },
  {
    wedge: 8,
    name: 'Tài Bạch',
    domain: 'Tiền bạc',
    heading: 'Cung Tài Bạch — quan hệ với tiền',
    body:
      'Cách bạn kiếm, giữ và tiêu — thói quen tài chính ẩn dưới các con số. Cung Tài Bạch soi mối quan hệ của bạn với tiền bạc để bạn đặt ra nguyên tắc cho riêng mình, thay vì để cảm xúc dẫn dắt từng lựa chọn.',
  },
  {
    wedge: 10,
    name: 'Phu Thê',
    domain: 'Tình duyên',
    heading: 'Cung Phu Thê — chuyện đôi lứa',
    body:
      'Tình duyên và bạn đời: kiểu kết nối bạn tìm kiếm, điều bạn cần được thấu hiểu, những điểm dễ va chạm. Đọc Phu Thê không để biết "khi nào", mà để biết mình cần gì và trao đi điều gì trong một mối quan hệ.',
  },
  {
    wedge: 6,
    name: 'Thiên Di',
    domain: 'Cơ hội',
    heading: 'Cung Thiên Di — dịch chuyển & cơ hội',
    body:
      'Cung của di chuyển, môi trường mới và những cánh cửa mở ra khi bạn rời vùng quen thuộc. Thiên Di gợi ý khi nào nên đi, đi đâu thì hợp — để bạn chủ động đón cơ hội thay vì bị hoàn cảnh xô đẩy.',
  },
];

/* ── reduced-motion (SSR-safe, tự dò vì toolkit không export hook) ──
 * Server + render đầu trả false → tránh hydration mismatch; cập nhật sau mount.
 */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);
  return reduced;
}

/* ── Lá số sticky. active = wedge index đang sáng (null → mọi cung rõ, dùng cho reduced-motion). ── */
function LaSo(props: { active: number | null }): React.JSX.Element {
  const { active } = props;
  const allClear = active === null;
  // Tên hiển thị ở tâm (guard index có thể undefined do noUncheckedIndexedAccess).
  const centerName = allClear ? 'Bản đồ' : (CUNG_NAMES[active] ?? '');
  // Domain tương ứng (chỉ với 5 cung kể chuyện) để in dưới tâm.
  const centerDomain = allClear
    ? '12 cung'
    : (PANELS.find((p) => p.wedge === active)?.domain ?? '');

  return (
    <svg
      viewBox="0 0 400 400"
      width="100%"
      height="100%"
      role="img"
      aria-label={
        allClear
          ? 'Lá số 12 cung — toàn bộ các cung'
          : `Lá số 12 cung, đang làm nổi bật cung ${centerName}`
      }
      style={{ display: 'block', maxWidth: 520, margin: '0 auto', overflow: 'visible' }}
    >
      {/* nền tròn mờ tạo chiều sâu */}
      <circle cx={200} cy={200} r={188} fill="none" stroke={SOFT} strokeOpacity={0.25} strokeWidth={1} />

      {/* tick ngoài */}
      <g stroke={OCHRE} strokeOpacity={allClear ? 0.5 : 0.35} strokeWidth={1.2} strokeLinecap="round">
        {TICKS.map((t, i) => (
          <line key={`tk-${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
        ))}
      </g>

      {/* 12 wedge */}
      {WEDGES.map((w, i) => {
        const isActive = !allClear && i === active;
        // Cung không active khi đang có active → mờ đi. allClear → mọi cung rõ.
        const dim = !allClear && !isActive;
        const fill = isActive ? OCHRE : PAPER;
        const fillOpacity = isActive ? 0.92 : dim ? 0.04 : 0.14;
        const stroke = isActive ? GOLD : OCHRE;
        const strokeOpacity = isActive ? 1 : dim ? 0.18 : 0.5;
        const name = CUNG_NAMES[i] ?? '';
        const w0 = WEDGES[i];
        if (!w0) return null; // guard (không xảy ra, thoả noUncheckedIndexedAccess)
        return (
          <g key={`wd-${i}`}>
            <path
              d={w.d}
              fill={fill}
              fillOpacity={fillOpacity}
              stroke={stroke}
              strokeOpacity={strokeOpacity}
              strokeWidth={isActive ? 1.6 : 1}
              style={{
                transition: 'fill .55s ease, fill-opacity .55s ease, stroke-opacity .55s ease',
              }}
            />
            <text
              x={w0.lx}
              y={w0.ly}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isActive ? 12.5 : 11}
              fontFamily="'Be Vietnam Pro', system-ui, sans-serif"
              fontWeight={isActive ? 700 : 500}
              fill={isActive ? INK : SOFT}
              fillOpacity={dim ? 0.4 : 1}
              style={{ transition: 'fill .55s ease, fill-opacity .55s ease', letterSpacing: '.02em' }}
            >
              {name}
            </text>
          </g>
        );
      })}

      {/* vòng trong + tâm: tên cung hiện hành */}
      <circle cx={200} cy={200} r={95} fill={PAPER} fillOpacity={0.9} stroke={OCHRE} strokeOpacity={0.4} strokeWidth={1} />
      <text
        x={200}
        y={188}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fill={SOFT}
        letterSpacing="0.18em"
      >
        {centerDomain.toUpperCase()}
      </text>
      <text
        x={200}
        y={212}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={30}
        fontFamily="'Newsreader', Georgia, serif"
        fontWeight={600}
        fill={INK}
        style={{ transition: 'fill .4s ease' }}
      >
        {centerName}
      </text>
    </svg>
  );
}

export function SecCung(): React.JSX.Element {
  const reduced = useReducedMotion();
  // active wedge index. reduced-motion / SSR đầu → null (mọi cung rõ, không phụ thuộc scroll).
  const [active, setActive] = React.useState<number | null>(0);

  // Refs cho 5 panel để IntersectionObserver theo dõi đoạn nào vào giữa viewport.
  const panelRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  React.useEffect(() => {
    if (reduced) {
      setActive(null); // lá số tĩnh: mọi cung rõ
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setActive(0); // fallback: ít nhất sáng cung đầu, không kẹt
      return;
    }
    // Dải kích hoạt: band hẹp quanh GIỮA viewport (top 45% / bottom 45% → còn ~10% giữa).
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const idxAttr = e.target.getAttribute('data-cung-idx');
          if (idxAttr === null) continue;
          const idx = Number.parseInt(idxAttr, 10);
          const panel = PANELS[idx];
          if (panel) setActive(panel.wedge);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    for (const el of panelRefs.current) {
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section
      style={{
        background: PAPER,
        color: INK,
        position: 'relative',
        width: '100%',
        // dải màu đêm mảnh ở mép trên tạo nhịp chuyển sang section nền charcoal kế tiếp
        ['--ink' as string]: INK,
      }}
    >
      {/* Đầu section: tiêu đề lớn serif */}
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: 'clamp(72px, 12vh, 140px) clamp(20px, 5vw, 64px) clamp(8px, 3vh, 40px)',
        }}
      >
        <Reveal>
          <p
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 13,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: OCHRE,
              margin: '0 0 18px',
            }}
          >
            03 — Cách hoạt động
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontWeight: 600,
              fontSize: 'clamp(2.1rem, 5.6vw, 4.2rem)',
              lineHeight: 1.04,
              letterSpacing: '-0.01em',
              margin: '0 0 22px',
              maxWidth: 18 * 60,
            }}
          >
            Bản đồ 12 cung
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p
            style={{
              fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
              fontSize: 'clamp(1rem, 2.1vw, 1.22rem)',
              lineHeight: 1.65,
              color: SOFT,
              maxWidth: 620,
              margin: 0,
            }}
          >
            Lá số chia đời sống thành mười hai cung. Lướt xuống — tới cung nào, cung ấy sáng
            lên. Không phán xét, chỉ soi rõ từng vùng để bạn tự đọc mình.
          </p>
        </Reveal>
      </div>

      {/* Thân scroll-telling: lá số sticky trái + 5 đoạn cuộn phải.
          Mobile (≤880px) reflow 1 cột: lá số sticky top, đoạn xếp dọc dưới. */}
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 64px) clamp(72px, 12vh, 140px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 'clamp(24px, 5vw, 72px)',
          alignItems: 'start',
        }}
        className="seccung-grid"
      >
        {/* Cột lá số (sticky) */}
        <div
          className="seccung-chart"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(8px, 3vh, 40px) 0',
          }}
        >
          <Parallax speed={0.12}>
            <LaSo active={active} />
          </Parallax>
        </div>

        {/* Cột đoạn kể chuyện */}
        <div className="seccung-panels">
          {PANELS.map((p, i) => {
            const isLit = !reduced && active === p.wedge;
            return (
              <div
                key={p.name}
                data-cung-idx={i}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                style={{
                  // Mỗi đoạn cao gần 1 viewport để IO bắt "vào giữa" mượt;
                  // reduced-motion: auto, liệt kê tĩnh sát nhau.
                  minHeight: reduced ? 'auto' : '78vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: reduced ? '28px 0' : '6vh 0',
                  borderTop: i === 0 ? 'none' : `1px solid ${SOFT}22`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: 12,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: isLit ? OCHRE : SOFT,
                    opacity: reduced ? 1 : isLit ? 1 : 0.55,
                    transition: 'color .5s ease, opacity .5s ease',
                    marginBottom: 12,
                  }}
                >
                  Cung {String(i + 1).padStart(2, '0')} · {p.domain}
                </span>
                <h3
                  style={{
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontWeight: 600,
                    fontSize: 'clamp(1.6rem, 3.6vw, 2.6rem)',
                    lineHeight: 1.12,
                    letterSpacing: '-0.01em',
                    margin: '0 0 16px',
                    color: INK,
                    // chỉ chữ "sống dậy" nhẹ khi active (transform-only, compositor-safe)
                    transform: reduced ? undefined : isLit ? 'translateX(0)' : 'translateX(-4px)',
                    opacity: reduced ? 1 : isLit ? 1 : 0.62,
                    transition: 'opacity .5s ease, transform .5s ease',
                  }}
                >
                  {p.heading}
                </h3>
                <p
                  style={{
                    fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
                    fontSize: 'clamp(1rem, 2vw, 1.16rem)',
                    lineHeight: 1.7,
                    color: SOFT,
                    maxWidth: 460,
                    margin: 0,
                    opacity: reduced ? 1 : isLit ? 1 : 0.62,
                    transition: 'opacity .5s ease',
                  }}
                >
                  {p.body}
                </p>
                {/* gạch ochre nhỏ làm "kim chỉ" cho đoạn đang sáng */}
                <span
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    marginTop: 22,
                    height: 2,
                    width: 64,
                    background: OCHRE,
                    transformOrigin: '0 50%',
                    transform: reduced ? 'scaleX(1)' : isLit ? 'scaleX(1)' : 'scaleX(0.18)',
                    opacity: reduced ? 0.7 : isLit ? 1 : 0.3,
                    transition: 'transform .5s ease, opacity .5s ease',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* dải đêm mảnh tạo nhịp chuyển — thuần CSS, không phụ thuộc JS/scroll */}
      <div aria-hidden="true" style={{ height: 1, background: CHARCOAL, opacity: 0.18 }} />

      {/* Mobile reflow 1 cột: bỏ sticky để lá số + đoạn xếp dọc tự nhiên, nhẹ. */}
      <style>{`
        @media (max-width: 880px) {
          .seccung-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          .seccung-chart {
            position: sticky !important;
            top: 0 !important;
            height: 56vh !important;
            background: ${PAPER};
            z-index: 1;
            padding: 12px 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
