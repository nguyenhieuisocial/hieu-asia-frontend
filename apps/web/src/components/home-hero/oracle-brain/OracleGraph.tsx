import * as React from 'react';
import type { Reveal } from './types';
import type { Hub } from './graph-layout';
import { LENS_ABOUT, DONG_IDX, TAY_IDX, STARS } from './graph-layout';
import { DongLensCard, TayLensCard } from './LensCards';

export function OracleGraph({
  hubs,
  hover,
  setHover,
  selected,
  setSelected,
  inView,
  reading,
  reveal,
  graphRef,
}: {
  hubs: Hub[];
  hover: number | null;
  setHover: (i: number | null) => void;
  selected: number | null;
  setSelected: (i: number | null) => void;
  inView: boolean;
  reading: boolean;
  reveal: Reveal | null;
  graphRef: React.RefObject<HTMLDivElement | null>;
}): React.JSX.Element {
  const isOn = (i: number) => hover === i || selected === i;
  const sel = selected !== null ? hubs[selected] : null;

  return (
    <div
      ref={graphRef}
      data-in={inView || undefined}
      data-sel={selected !== null || undefined}
      data-reading={reading || undefined}
      data-revealed={reveal ? true : undefined}
      data-lensopen={selected !== null || undefined}
      className="ob-graph"
      // role="group" (not "img"): this container holds the interactive lens-hub
      // buttons, and role="img" must not have focusable descendants (axe
      // nested-interactive). "group" labels the set of related controls. (T28)
      role="group"
      aria-label="Năm nhóm công cụ hội tụ về Bạn"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="ob-plx ob-plx-neb" aria-hidden="true">
        <div className="ob-plx-in ob-neb-glow" />
      </div>

      <svg className="ob-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {hubs.map((h, i) => (
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
        {hubs.map((h, i) =>
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

      <div className="ob-plx ob-plx-stars" aria-hidden="true">
        <div className="ob-plx-in">
          {STARS.map((s, i) => (
            <span
              key={i}
              className="ob-star"
              style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {hubs.map((h, i) => (
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

      {hubs.map((h, i) =>
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
          {reveal ? `${reveal.conVat} · mệnh ${reveal.dong.elementName}` : 'hiểu mình sâu'}
        </span>
      </div>

      {/* "Tâm điểm BẠN kể" — chạm 1 nhóm sao → ý nghĩa hiện NGAY GIỮA chòm sao
          (quanh BẠN), tuyệt đối trong khung .ob-graph nên KHÔNG đẩy layout. */}
      {sel && (
        <div
          className="ob-read"
          id="ob-read"
          role="region"
          aria-live="polite"
          aria-label={`Lăng kính ${sel.label}`}
        >
          <button
            type="button"
            className="ob-read-close"
            onClick={() => setSelected(null)}
            aria-label="Đóng"
          >
            ×
          </button>
          <div className="ob-read-body">
            {selected === DONG_IDX && reveal ? (
              <DongLensCard reveal={reveal} />
            ) : selected === TAY_IDX && reveal ? (
              <TayLensCard reveal={reveal} />
            ) : (
              <div className="ob-lens ob-lens-about">
                <span className="ob-lens-tag">{sel.label}</span>
                <p className="ob-lens-sub">{LENS_ABOUT[sel.label] ?? ''}</p>
                {!reveal && (
                  <p className="ob-read-cta">Nhập ngày sinh ở trên để soi lăng kính này.</p>
                )}
              </div>
            )}
            <div className="ob-read-tools">
              {sel.tools.map((t) => (
                <a key={t.n} href={t.href} draggable={false} className="ob-read-tool">
                  {t.n}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {hubs.map((h, i) => (
        <button
          key={h.label}
          type="button"
          aria-pressed={selected === i}
          aria-expanded={selected === i}
          aria-controls={selected === i ? 'ob-read' : undefined}
          className={`ob-hub${isOn(i) ? ' ob-hub-on' : ''}${selected === i ? ' ob-hub-sel' : ''}`}
          style={{ left: `${h.left}%`, top: `${h.top}%` }}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(i)}
          onBlur={() => setHover(null)}
          // Wave 65.02 — bấm LẠI cùng nhóm KHÔNG đóng panel nữa. PostHog đo
          // được 31 rageclick/30 ngày tập trung đúng các nút nhóm này: tap
          // nhanh 2-3 lần = mở/đóng/mở nhấp nháy, người dùng tưởng nút hỏng.
          // Đóng vẫn còn 3 đường: nút ×, phím Esc, chạm ngoài panel.
          onClick={() => setSelected(i)}
        >
          <span className="ob-hub-dot" aria-hidden="true" />
          <span className="ob-hub-label">{h.label}</span>
          <span className="ob-hub-count">{h.count} công cụ</span>
        </button>
      ))}
    </div>
  );
}
