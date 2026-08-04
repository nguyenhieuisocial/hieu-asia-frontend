'use client';

import * as React from 'react';
import { ShimmerText } from '@/components/fx/ShimmerText';
import { Marquee } from '@/components/fx/Marquee';
import { Time24 } from '@/components/Time24';
// Wave 65.02 — form "Soi thử" đọc hồ sơ ngày sinh dùng chung (khách vừa nhập ở
// InstantChartHero đầu trang) thay vì bắt gõ lại từ đầu (finding P1, 5/8 vòng).
import {
  readBirthProfile,
  birthProfileToDateTime,
  BIRTH_PROFILE_EVENT,
} from '@/lib/birth-profile';
import type { Reveal } from './oracle-brain/types';
import { ALL_TOOLS, HUBS } from './oracle-brain/graph-layout';
import { computeReveal } from './oracle-brain/compute-reveal';
import { OracleGraph } from './oracle-brain/OracleGraph';
import { BaziRevealPanel } from './oracle-brain/BaziRevealPanel';

/**
 * OracleBrain — the signature "night-sky" section: the whole toolkit (Eastern
 * classics + modern psychology + astrology + intuition) converging on "BẠN".
 *
 * HTML + SVG (NOT canvas) so the labels are real DOM text → Google Translate
 * can translate them, percentage layout never clips, and motion is calm CSS
 * (draw-in on view + breathe + twinkle), fully gated by prefers-reduced-motion.
 *
 * v3 — TAP TO FOCUS (mobile-first): chạm một nhóm → nhóm đó nổi bật + các nhóm
 * khác mờ đi; bảng chi tiết liệt kê TÊN công cụ thật hiện ra.
 *
 * v5 — SOI THỬ ĐA LĂNG KÍNH (demo sống): khách nhập NGÀY SINH → chòm sao "đọc"
 * (hội tụ) → phản chiếu MỘT LÁT CẮT THẬT qua NHIỀU LĂNG KÍNH:
 *  • Cổ học Á Đông (từ năm): can chi, con giáp, mệnh nạp âm, màu/nghề hợp
 *    — engine `buildBanMenh` (60 Giáp Tý, "chống bịa").
 *  • Chiêm tinh phương Tây (từ ngày/tháng): cung Mặt Trời — engine
 *    `sunSignFromDate` (vị trí Mặt Trời theo Meeus).
 * Tất cả TÍNH TRÊN MÁY KHÁCH, KHÔNG lưu; engine nạp động khi bấm (homepage nhẹ).
 * Đây là bản demo sống của lời hứa "AI nối các lăng kính về bạn". CTA → lập lá
 * số đầy đủ. Số chủ đạo (thần số) tính ở máy chủ nên KHÔNG đưa vào teaser để
 * tránh lệch với công cụ thật. Gated bởi prefers-reduced-motion.
 */

export function OracleBrain(): React.JSX.Element {
  const [hover, setHover] = React.useState<number | null>(null);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [inView, setInView] = React.useState(false);
  const graphRef = React.useRef<HTMLDivElement | null>(null);

  // v5 — Soi thử đa lăng kính (demo sống)
  const [birthDate, setBirthDate] = React.useState('');
  const [birthTime, setBirthTime] = React.useState('');
  const [reveal, setReveal] = React.useState<Reveal | null>(null);
  const [reading, setReading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const reducedRef = React.useRef(false);
  const timerRef = React.useRef<number | null>(null);
  // Wave 65.02 — prefill từ hồ sơ dùng chung. `prefilled` đổi label mời;
  // `obTouched` chặn event ghi đè khi khách đã tự gõ vào form NÀY.
  const [prefilled, setPrefilled] = React.useState(false);
  const obTouchedRef = React.useRef(false);
  const revealRef = React.useRef<HTMLDivElement | null>(null);

  // Wave 65.05b a11y — sau khi "Soi thử" reveal, dời focus vào khối kết quả
  // (form đã unmount cùng nút submit đang giữ focus) để keyboard/screen-reader
  // đọc tiếp được ngay từ "Lát cắt về bạn".
  React.useEffect(() => {
    if (reveal) revealRef.current?.focus();
  }, [reveal]);

  React.useEffect(() => {
    const apply = (): void => {
      if (obTouchedRef.current) return;
      const dt = birthProfileToDateTime(readBirthProfile());
      if (!dt) return;
      setBirthDate(dt.date);
      setBirthTime(dt.time);
      setPrefilled(true);
    };
    apply(); // khách quay lại (hồ sơ đã lưu từ phiên trước)
    // khách MỚI: nhập ở InstantChartHero phía trên → saveBirthDateTime bắn event
    window.addEventListener(BIRTH_PROFILE_EVENT, apply);
    return () => window.removeEventListener(BIRTH_PROFILE_EVENT, apply);
  }, []);

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

  // QUYẾT ĐỊNH KIẾN TRÚC (sau 3 vòng vá bug "bấm là nền di chuyển"): BỎ HẲN
  // parallax-theo-con-trỏ. Mọi biến thể (CSS transition, JS lerp, freeze, hub-hold)
  // đều còn "quãng lướt" đang chạy đúng lúc tay người dùng tiến tới bấm → không
  // thể vừa đuổi-theo-con-trỏ vừa bất động khi tương tác. "Chiều sâu vũ trụ" giữ
  // lại qua ambient drift thuần CSS (.ob-plx-in, chậm 17-26s, không dính con trỏ,
  // pause khi mở lăng kính) — đẹp mà KHÔNG BAO GIỜ nhúc nhích lúc bấm.

  // 3 đường tắt lăng kính ĐỘC LẬP: nút ×, phím Esc, bấm bất kỳ đâu ngoài phần nội
  // dung (trừ nút nhóm sao — để toggle/chuyển nhóm vẫn hoạt động như cũ).
  React.useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setSelected(null);
    };
    const onDown = (e: PointerEvent): void => {
      const t = e.target as Element | null;
      if (!t || typeof t.closest !== 'function') return;
      if (t.closest('.ob-hub') || t.closest('.ob-read-body')) return;
      setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [selected]);

  const onSoi = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const m = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) {
      setErr('Chọn ngày sinh dương lịch của bạn.');
      return;
    }
    setErr(null);
    setReading(true);
    const outcome = await computeReveal({ birthDate, birthTime });
    if ('error' in outcome) {
      setReading(false);
      setErr(outcome.error);
      return;
    }
    const { result } = outcome;
    const show = (): void => {
      setReveal(result);
      setReading(false);
    };
    if (reducedRef.current) show();
    else timerRef.current = window.setTimeout(show, 700);
  };

  const resetReveal = (): void => {
    setReveal(null);
    setBirthDate('');
    setErr(null);
    setSelected(null);
  };

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

        {/* v5 — Lời mời chính: nhập ngày sinh, "bộ não" soi qua nhiều lăng kính. */}
        {!reveal && (
          <form className="ob-soi" onSubmit={onSoi}>
            <label htmlFor="ob-dob" className="ob-soi-label">
              {/* Review N-2 — copy trung tính: prefill có thể tới từ hồ sơ đã
                  lưu phiên trước, không chỉ "vừa nhập ở đầu trang". */}
              {prefilled
                ? 'Dùng ngày sinh đã lưu của bạn — bấm Soi thử, hoặc thử ngày khác'
                : 'Nhập ngày sinh (giờ sinh không bắt buộc) — để bộ não soi bạn qua nhiều lăng kính'}
            </label>
            <div className="ob-soi-row">
              <input
                id="ob-dob"
                className="ob-soi-input ob-soi-date"
                type="date"
                min="1950-01-01"
                max="2026-12-31"
                value={birthDate}
                onChange={(e) => {
                  obTouchedRef.current = true;
                  setBirthDate(e.target.value);
                  if (err) setErr(null);
                }}
                aria-describedby={err ? 'ob-dob-err' : 'ob-dob-note'}
                aria-invalid={err ? true : undefined}
              />
              <Time24
                id="ob-tob"
                value={birthTime}
                onChange={(v) => {
                  obTouchedRef.current = true;
                  setBirthTime(v);
                  if (err) setErr(null);
                }}
                inputClassName="ob-time-field"
                aria-label="Giờ sinh (không bắt buộc)"
              />
              <button type="submit" className="ob-soi-btn" disabled={reading}>
                {reading ? 'Đang đọc…' : 'Soi thử'}
              </button>
            </div>
            {err ? (
              <span id="ob-dob-err" className="ob-soi-err" role="alert">
                {err}
              </span>
            ) : (
              <span id="ob-dob-note" className="ob-soi-note">
                Cổ học Á Đông · chiêm tinh phương Tây · Bát Tự · tính ngay trên máy, không lưu
              </span>
            )}
          </form>
        )}

        <OracleGraph
          hubs={HUBS}
          hover={hover}
          setHover={setHover}
          selected={selected}
          setSelected={setSelected}
          inView={inView}
          reading={reading}
          reveal={reveal}
          graphRef={graphRef}
        />

        <p className="ob-tap-hint">Chạm mỗi nhóm sao để xem riêng lăng kính đó.</p>

        {/* v5 — Lát cắt THẬT qua nhiều lăng kính (tính trên máy; chưa lưu gì).
            Wave 65.05b a11y — live-region MOUNT SẴN từ đầu (div rỗng, không
            style → không chiếm chỗ), nội dung đổ vào SAU khi soi: screen reader
            chỉ announce thay đổi trong live-region đã tồn tại; mount cùng lúc
            với nội dung thì không được đọc. */}
        <div aria-live="polite">
          {reveal && (
            <BaziRevealPanel reveal={reveal} revealRef={revealRef} onReset={resetReveal} />
          )}
        </div>

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
