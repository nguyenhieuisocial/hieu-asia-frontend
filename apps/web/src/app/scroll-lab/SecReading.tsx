'use client';

import * as React from 'react';
import { Reveal, Parallax } from './_kit/scroll';

/**
 * SecReading — SECTION 4 "Bản giải mã bằng AI".
 *
 * Một thẻ luận giải như trích từ báo cáo thật: tiêu đề + vài dòng luận giải.
 * Khi cuộn vào, các dòng REVEAL lần lượt (stagger qua <Reveal delay>) như mực hiện dần;
 * 1 câu chốt được nhấn (ochre, italic). Trang trí: vài dấu/đường ochre parallax nhẹ.
 *
 * Cảm giác: rõ ràng, đáng tin, AI giải mã từ cổ học để người dùng tự quyết.
 *
 * RÀNG BUỘC:
 *   - transform/opacity ONLY cho motion (qua toolkit). KHÔNG thư viện mới, tự vẽ SVG.
 *   - reduced-motion: Reveal/Parallax tự về trạng thái cuối tĩnh — mọi dòng hiện sẵn.
 *   - LCP-safe: tiêu đề chính trong DOM, không ẩn cứng (Reveal chỉ ẩn sau mount khi cho phép motion).
 *   - Mobile ≤880px: reflow 1 cột, nhẹ.
 *   - File self-contained (chỉ import React + toolkit).
 */

const INK = '#171411';
const OCHRE = '#A47532';
const PAPER = '#F3ECDD';
const SOFT = '#6B6358';

const SERIF =
  "'Newsreader', Georgia, 'Times New Roman', serif";
const BODY =
  "'Be Vietnam Pro', ui-sans-serif, system-ui, -apple-system, sans-serif";
const MONO =
  "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace";

/* Mỗi dòng luận giải. `lead` = nhãn cung/khía cạnh (mono, ochre), `body` = luận giải. */
type Line = { lead: string; body: string };

const LINES: readonly Line[] = [
  {
    lead: 'Cung Mệnh',
    body: 'Bản đồ cho thấy một người hướng nội nhưng quyết đoán: bạn cân nhắc lâu, song khi đã chọn thì hiếm khi quay đầu.',
  },
  {
    lead: 'Cung Quan',
    body: 'Giai đoạn này thuận cho việc xây nền dài hạn hơn là tìm thành quả tức thì. Sự kiên nhẫn được đền đáp muộn, nhưng vững.',
  },
  {
    lead: 'Cung Tài',
    body: 'Dòng chảy tài chính ổn định, ít biến động lớn — điểm mạnh để bạn dám đặt một quyết định lớn mà không sợ mất gốc.',
  },
];

/* Câu chốt được nhấn (ochre, italic) — không phán số phận, trả quyền quyết định cho người đọc. */
const CLOSING =
  'Cổ học chỉ ra khuynh hướng — còn quyết định, vẫn là của bạn.';

export function SecReading(): React.JSX.Element {
  return (
    <section
      aria-labelledby="sec-reading-title"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        background: PAPER,
        color: INK,
        fontFamily: BODY,
        // Padding rộng theo chiều dọc để section có nhịp thở điện ảnh, trầm.
        padding: 'clamp(96px, 16vh, 200px) clamp(20px, 6vw, 80px)',
        // Vân giấy rất mờ bằng gradient (không ảnh) — tạo chiều sâu "giấy–mực".
        backgroundImage:
          'radial-gradient(120% 90% at 50% 0%, rgba(164,117,50,0.05) 0%, rgba(164,117,50,0) 55%)',
      }}
    >
      {/* ── Trang trí ochre parallax (aria-hidden, pointer-none) ── */}
      <ReadingDecor />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 760,
          margin: '0 auto',
        }}
      >
        {/* Nhãn section — mác báo cáo */}
        <Reveal y={16}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: OCHRE,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
            }}
          >
            <span
              aria-hidden="true"
              style={{ width: 28, height: 1, background: OCHRE, opacity: 0.7 }}
            />
            Bản giải mã bằng AI
          </div>
        </Reveal>

        {/* ── Thẻ luận giải (như trích từ báo cáo thật) ── */}
        <Reveal y={28} delay={0.05}>
          <article
            style={{
              position: 'relative',
              background: '#FBF7EC',
              border: `1px solid ${hexA(OCHRE, 0.22)}`,
              borderRadius: 4,
              // Bóng rất mềm — như tờ giấy đặt trên mặt bàn.
              boxShadow:
                '0 1px 0 rgba(23,20,17,0.02), 0 24px 60px -36px rgba(23,20,17,0.35)',
              padding: 'clamp(28px, 5vw, 56px)',
            }}
          >
            {/* Vạch ochre dọc bên trái như dấu trích dẫn báo cáo */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                top: 'clamp(28px, 5vw, 56px)',
                bottom: 'clamp(28px, 5vw, 56px)',
                width: 3,
                background: `linear-gradient(${OCHRE}, ${hexA(OCHRE, 0)})`,
                borderRadius: 3,
              }}
            />

            {/* Tiêu đề thẻ — LCP-safe (Reveal chỉ ẩn sau mount + cho phép motion) */}
            <Reveal as="h2" y={20}>
              <span
                id="sec-reading-title"
                style={{
                  display: 'block',
                  fontFamily: SERIF,
                  fontWeight: 500,
                  fontSize: 'clamp(28px, 4.4vw, 46px)',
                  lineHeight: 1.12,
                  letterSpacing: '-0.01em',
                  margin: 0,
                }}
              >
                Bản đồ của bạn, đọc rõ từng nét
              </span>
            </Reveal>

            {/* Meta dòng nhỏ — mã báo cáo giả lập tạo cảm giác "thật, đáng tin" */}
            <Reveal y={14} delay={0.08}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 12.5,
                  color: SOFT,
                  marginTop: 14,
                  marginBottom: 'clamp(24px, 3.4vw, 36px)',
                }}
              >
                Mã giải mã · HA-12CUNG · độ tin cậy cao
              </div>
            </Reveal>

            {/* Các dòng luận giải — REVEAL lần lượt như mực hiện dần (stagger) */}
            <div role="list">
              {LINES.map((line, i) => (
                <Reveal
                  key={line.lead}
                  y={22}
                  // Stagger: mỗi dòng trễ thêm để "mực" hiện dần từ trên xuống.
                  delay={0.12 + i * 0.14}
                >
                  <p
                    role="listitem"
                    style={{
                      margin: 0,
                      marginBottom: i === LINES.length - 1 ? 0 : 22,
                      fontSize: 'clamp(16px, 1.9vw, 19px)',
                      lineHeight: 1.7,
                      color: INK,
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontFamily: MONO,
                        fontSize: 12,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: OCHRE,
                        marginBottom: 6,
                      }}
                    >
                      {line.lead}
                    </span>
                    {line.body}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Đường kẻ mảnh ngăn cách trước câu chốt */}
            <Reveal y={10} delay={0.12 + LINES.length * 0.14}>
              <hr
                style={{
                  border: 0,
                  height: 1,
                  background: hexA(INK, 0.1),
                  margin: 'clamp(26px, 3.4vw, 38px) 0',
                }}
              />
            </Reveal>

            {/* Câu chốt được NHẤN — ochre, italic, serif lớn hơn */}
            <Reveal y={24} delay={0.2 + LINES.length * 0.14}>
              <p
                style={{
                  margin: 0,
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontWeight: 500,
                  fontSize: 'clamp(20px, 2.8vw, 28px)',
                  lineHeight: 1.4,
                  color: OCHRE,
                  position: 'relative',
                  paddingLeft: 28,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    fontFamily: SERIF,
                    fontSize: '1.6em',
                    lineHeight: 1,
                    color: hexA(OCHRE, 0.55),
                  }}
                >
                  &ldquo;
                </span>
                {CLOSING}
              </p>
            </Reveal>
          </article>
        </Reveal>

        {/* Ghi chú chân thẻ — củng cố lập trường thương hiệu (KHÔNG bói toán) */}
        <Reveal y={14} delay={0.08}>
          <p
            style={{
              fontFamily: BODY,
              fontSize: 14,
              lineHeight: 1.6,
              color: SOFT,
              textAlign: 'center',
              marginTop: 'clamp(28px, 4vw, 44px)',
              marginBottom: 0,
            }}
          >
            AI giải mã từ cổ học, trình bày rõ ràng — để bạn hiểu mình và tự quyết.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Trang trí ochre parallax ─────────────────────────
 * Vài dấu/đường ochre dịch nhẹ theo cuộn (Parallax). Toàn bộ aria-hidden,
 * pointer-events:none. Tự vẽ SVG (KHÔNG import la-so thật / vùng cấm sibling).
 * reduced-motion: Parallax tự bỏ transform → đứng yên, vẫn đẹp.
 */
function ReadingDecor(): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Cung tròn mảnh trên-phải — gợi lá số, dịch chậm ngược chiều cuộn */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(24px, 8vh, 96px)',
          right: 'clamp(-60px, -4vw, -20px)',
          width: 'clamp(160px, 26vw, 320px)',
          opacity: 0.5,
        }}
      >
        <Parallax speed={0.18} axis="y">
          <svg
            viewBox="0 0 200 200"
            width="100%"
            height="100%"
            fill="none"
            role="presentation"
          >
            {/* hai cung đồng tâm + vài tick — trích vi mô của lá số, không phải lá số thật */}
            <path
              d="M20 100 A80 80 0 0 1 180 100"
              stroke={OCHRE}
              strokeWidth="1"
              opacity="0.6"
            />
            <path
              d="M40 100 A60 60 0 0 1 160 100"
              stroke={OCHRE}
              strokeWidth="1"
              opacity="0.35"
            />
            {[20, 50, 80, 110, 140, 170].map((x) => (
              <line
                key={x}
                x1={x}
                y1="96"
                x2={x}
                y2="104"
                stroke={OCHRE}
                strokeWidth="1"
                opacity="0.4"
              />
            ))}
          </svg>
        </Parallax>
      </div>

      {/* Dấu cộng/giao điểm nhỏ dưới-trái — nhịp trang trí, dịch nhẹ */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(40px, 10vh, 120px)',
          left: 'clamp(16px, 5vw, 72px)',
          width: 40,
          height: 40,
          opacity: 0.4,
        }}
      >
        <Parallax speed={0.32} axis="y">
          <svg viewBox="0 0 40 40" width="40" height="40" role="presentation">
            <line x1="20" y1="6" x2="20" y2="34" stroke={OCHRE} strokeWidth="1" />
            <line x1="6" y1="20" x2="34" y2="20" stroke={OCHRE} strokeWidth="1" />
          </svg>
        </Parallax>
      </div>

      {/* Đường ochre dọc mảnh bên phải — bám tiến trình, tạo chiều sâu trầm */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 'clamp(20px, 7vw, 110px)',
          width: 1,
        }}
      >
        <Parallax speed={0.12} axis="y">
          <div
            style={{
              width: 1,
              height: '60vh',
              background: `linear-gradient(${hexA(OCHRE, 0)}, ${hexA(
                OCHRE,
                0.28,
              )}, ${hexA(OCHRE, 0)})`,
            }}
          />
        </Parallax>
      </div>
    </div>
  );
}

/* hex + alpha → rgba(); chỉ nhận #RRGGBB. Tránh phụ thuộc CSS color-mix (Safari cũ). */
function hexA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
