'use client';

/**
 * SecDecision — SECTION 5 (đóng / CTA điềm tĩnh) cho /scroll-lab (hieu.asia).
 *
 * Nhịp: chấm Mệnh ochre "thở" nhẹ → tiêu đề lớn ink-reveal "Hiểu mình. Quyết định mình."
 * → hai thẻ "con đường" reveal so le → kết lắng, khoảng trắng rộng.
 *
 * RÀNG BUỘC tuân thủ:
 *   - transform / opacity ONLY cho motion (compositor-safe). Không WebGL/video/thư viện mới.
 *   - Không scroll-jacking. Reveal bám tiến trình cuộn qua IntersectionObserver của toolkit.
 *   - prefers-reduced-motion: reduce → trạng thái cuối tĩnh, đẹp, không phụ thuộc scroll/JS.
 *       Reveal tự lo phần fade. Chấm "thở" chỉ animate dưới @media (no-preference) → reduce = tĩnh.
 *   - LCP-safe: tiêu đề chính nằm trong DOM (Reveal không ẩn cứng trước mount / khi reduce).
 *   - Self-contained: chỉ import React + toolkit. SVG tự vẽ (không import lá số thật).
 *   - Mobile ≤880px: reflow 1 cột (thẻ xếp dọc), nhẹ.
 */

import * as React from 'react';
import { Reveal } from './_kit/scroll';

const INK = '#171411';
const OCHRE = '#A47532';
const PAPER = '#F3ECDD';
const SOFT = '#6B6358';

const SERIF = "'Newsreader', Georgia, 'Times New Roman', serif";
const BODY = "'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif";

/* Lớp scope cho keyframes "thở" — tránh đụng global. Animate scale+opacity (compositor-safe).
 * Chỉ chạy khi cho phép motion → prefers-reduced-motion:reduce giữ chấm ở trạng thái tĩnh cuối. */
const breath = `
.hieu-meta-dot { transform: scale(1); }
.hieu-meta-halo { opacity: .5; transform: scale(1); }
@media (prefers-reduced-motion: no-preference) {
  .hieu-meta-dot {
    animation: hieu-breath 4.2s ease-in-out infinite;
    will-change: transform, opacity;
  }
  .hieu-meta-halo {
    animation: hieu-halo 4.2s ease-in-out infinite;
    will-change: transform, opacity;
  }
}
@keyframes hieu-breath {
  0%, 100% { transform: scale(1);    opacity: 1; }
  50%      { transform: scale(1.18); opacity: .82; }
}
@keyframes hieu-halo {
  0%, 100% { transform: scale(1);   opacity: .45; }
  50%      { transform: scale(1.9); opacity: 0; }
}
`;

function PathCard(props: {
  kicker: string;
  title: string;
  desc: string;
  primary?: boolean;
}): React.JSX.Element {
  const { kicker, title, desc, primary = false } = props;
  return (
    <button
      type="button"
      style={{
        appearance: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '30px 30px 28px',
        borderRadius: 4,
        border: `1px solid ${primary ? OCHRE : 'rgba(23,20,17,0.14)'}`,
        background: primary ? 'rgba(164,117,50,0.06)' : 'transparent',
        color: INK,
        font: 'inherit',
        transition: 'transform .35s cubic-bezier(.22,.61,.36,1), border-color .35s, background .35s',
        willChange: 'transform',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = OCHRE;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = primary ? OCHRE : 'rgba(23,20,17,0.14)';
      }}
    >
      <span
        style={{
          fontFamily: BODY,
          fontSize: 12,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: OCHRE,
          fontWeight: 600,
        }}
      >
        {kicker}
      </span>
      <span style={{ fontFamily: SERIF, fontSize: 'clamp(22px, 3.4vw, 30px)', lineHeight: 1.15, fontWeight: 500 }}>
        {title}
      </span>
      <span style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.65, color: SOFT, maxWidth: '34ch' }}>
        {desc}
      </span>
      <span
        aria-hidden="true"
        style={{
          marginTop: 4,
          fontFamily: BODY,
          fontSize: 14,
          fontWeight: 600,
          color: primary ? OCHRE : INK,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {primary ? 'Bắt đầu' : 'Khám phá'}
        <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>
          &rarr;
        </span>
      </span>
    </button>
  );
}

export function SecDecision(): React.JSX.Element {
  return (
    <section
      aria-labelledby="sec-decision-title"
      style={{
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        background: PAPER,
        color: INK,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(120px, 20vh, 220px) 24px clamp(140px, 24vh, 260px)',
        overflow: 'hidden',
      }}
    >
      <style>{breath}</style>

      {/* Chấm Mệnh ochre "thở" — quầng halo lan ra + lõi đặc */}
      <Reveal as="div" y={0} amount={0.4}>
        <div
          aria-hidden="true"
          style={{
            position: 'relative',
            width: 60,
            height: 60,
            margin: '0 auto clamp(36px, 6vh, 64px)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <span
            className="hieu-meta-halo"
            style={{
              position: 'absolute',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: OCHRE,
              transformOrigin: 'center',
            }}
          />
          <span
            className="hieu-meta-dot"
            style={{
              position: 'relative',
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: OCHRE,
              transformOrigin: 'center',
              boxShadow: `0 0 0 5px rgba(164,117,50,0.16)`,
            }}
          />
        </div>
      </Reveal>

      {/* Tiêu đề lớn — ink-reveal khi vào. Hai vế trên hai dòng để nhịp lắng. */}
      <Reveal as="h2" y={34} delay={0.05} amount={0.35}>
        <span
          id="sec-decision-title"
          style={{
            display: 'block',
            fontFamily: SERIF,
            fontWeight: 500,
            color: INK,
            fontSize: 'clamp(40px, 8vw, 92px)',
            lineHeight: 1.04,
            letterSpacing: '-0.015em',
            margin: 0,
          }}
        >
          <span style={{ display: 'block' }}>Hiểu mình.</span>
          <span style={{ display: 'block', color: OCHRE }}>Quyết định mình.</span>
        </span>
      </Reveal>

      <Reveal as="p" y={26} delay={0.16} amount={0.4}>
        <span
          style={{
            display: 'block',
            fontFamily: BODY,
            fontSize: 'clamp(16px, 2.2vw, 19px)',
            lineHeight: 1.7,
            color: SOFT,
            maxWidth: '46ch',
            margin: 'clamp(24px, 4vh, 40px) auto 0',
          }}
        >
          Không phán xét, không bói toán. Chỉ là tấm bản đồ rõ ràng về chính bạn — phần còn lại,
          bạn tự quyết.
        </span>
      </Reveal>

      {/* Hai "con đường" — reveal so le qua delay lệch nhau. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(18px, 2.4vw, 26px)',
          width: '100%',
          maxWidth: 760,
          margin: 'clamp(56px, 9vh, 96px) auto 0',
        }}
      >
        <Reveal y={30} delay={0.04} amount={0.25}>
          <PathCard
            kicker="Lối thứ nhất"
            title="Xem luận giải của bạn"
            desc="Mở lá số của riêng bạn và đọc phần giải mã từng cung — viết để bạn hiểu, không để bạn sợ."
            primary
          />
        </Reveal>
        <Reveal y={30} delay={0.18} amount={0.25}>
          <PathCard
            kicker="Lối thứ hai"
            title="Tìm hiểu phương pháp"
            desc="Xem cách hieu.asia đọc một lá số: dữ liệu, cấu trúc và lằn ranh giữa quan sát và lựa chọn."
          />
        </Reveal>
      </div>

      {/* Kết lắng — một dòng nhỏ, khoảng trắng rộng phía dưới. */}
      <Reveal as="p" y={18} delay={0.1} amount={0.6}>
        <span
          style={{
            display: 'block',
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: SOFT,
            margin: 'clamp(64px, 11vh, 120px) auto 0',
          }}
        >
          hiểu mình, là khởi đầu của mọi quyết định.
        </span>
      </Reveal>
    </section>
  );
}
