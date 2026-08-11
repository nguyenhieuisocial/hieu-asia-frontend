'use client';

import * as React from 'react';
import Link from 'next/link';
import { LensConstellation } from './FourLens';
import { AuroraBackdrop } from '@/components/fx/AuroraBackdrop';
import { LENSES } from '@/lib/catalog/lenses';

/**
 * MultiHero — hero "Năm lăng kính (Tử Vi · Bát Tự · MBTI · Big Five · Xem Tướng) → AI hợp nhất một bức tranh".
 * MOBILE-FIRST: base CSS = điện thoại; desktop là `@media (min-width:880px)` enhancement.
 * Thứ tự mobile: bối cảnh (eyebrow → headline → deck) → lăng kính tương tác → CTA chính.
 * Hội tụ → xoay vài "ví dụ" nhận định AI (biến lời hứa thành cụ thể, giọng phân tích, không bói).
 * Editorial giấy-mực-ochre, SVG/CSS thuần, prefers-reduced-motion-safe (SSR = hội tụ tĩnh).
 */

// 2026-06-22: chuyển 3 màu CẤU TRÚC sang biến theme để hero render đúng cả
// light lẫn dark. Dark: tự đổi sang Charcoal/Bone.
// Wave 65.01 — OCHRE/OCHRE_DEEP hết hard-code hex: trỏ biến --mh-* khai
// trong CSS bên dưới thay vì hex trực tiếp.
//
// 11/08/2026 — Giai đoạn 2 design refresh: --mh-* ở dưới đang giữ hex CŨ,
// lệch khỏi token thật hiện dùng toàn site (globals.css tự ghi chú dòng
// --ochre-rgb: "khớp --primary hiện dùng, KHÔNG phải #A47532 trưng bày" —
// đúng #A47532 là giá trị CŨ mà file này còn giữ). Cập nhật theo đúng
// --ochre-rgb đã đo: light #89612A (137,97,42 · 4,69:1 trên Paper — bản cũ
// #A47532 chỉ 3,45:1, DƯỚI ngưỡng AA chữ nhỏ 4,5:1, là lỗi tương phản thật);
// dark #D4A261 (212,162,97 · 8,18:1 trên Charcoal). Một giá trị đạt AA cả hai
// cỡ chữ nên OCHRE/OCHRE_DEEP giờ trỏ CÙNG một hex mỗi theme (không còn cần
// bậc "deep" riêng để bù chữ nhỏ như trước).
const INK = 'hsl(var(--foreground))';
const OCHRE = 'var(--mh-ochre)';
const OCHRE_DEEP = 'var(--mh-ochre-deep)'; // 11/08/2026 — cùng giá trị với OCHRE (xem chú thích trên): token hiện dùng đã đạt AA cho cả chữ lớn lẫn chữ nhỏ, giữ tên/biến riêng để không phải sửa 12+ chỗ dùng, phòng khi cần tách lại sau này
const PAPER = 'hsl(var(--background))';
const SOFT = 'hsl(var(--muted-foreground))';

// Flagship lenses từ catalog (lib/catalog/lenses) — 1 nguồn sự thật, hết drift.
const SYSTEMS = LENSES.map((l) => ({ n: l.name, r: l.role, full: l.full }));
const LENS_N = SYSTEMS.length;
const WORDS = ['chính mình', 'đời mình', 'con đường phía trước', 'bước tiếp theo'];
const SAMPLES = [
  'Hợp quyết nhanh, nhưng nên hoãn việc lớn khi đang mệt.',
  'Mạnh ở tầm nhìn xa; điểm cần giữ là kiên nhẫn với chi tiết.',
  'Xu hướng: cần đủ dữ kiện mới quyết, dễ trì hoãn khi áp lực — đặt mốc cứng sẽ giúp.',
];

const reduceMotion = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function MultiHero(): React.JSX.Element {
  const [autoActive, setAutoActive] = React.useState(LENS_N); // 0..N-1 soi 1 hệ; N = hội tụ
  const [hover, setHover] = React.useState<number | null>(null);
  const [wordIdx, setWordIdx] = React.useState(0);
  const [sample, setSample] = React.useState(0);
  const hoverRef = React.useRef<number | null>(null);
  React.useEffect(() => { hoverRef.current = hover; }, [hover]);

  // Ba bộ đếm giờ này mỗi nhịp bắt React vẽ lại cây con ~287 thẻ. Trước đây
  // chúng chạy NGAY lúc mount, tức rơi đúng vào cửa sổ hydrate — cộng thêm 2-3
  // lần render dài vào lúc luồng chính đang bận nhất (trang chủ đo được TBT
  // 650ms so với 50ms của /pricing). Hoãn 3 giây: người xem vẫn thấy chữ xoay
  // gần như ngay lập tức, nhưng nó không còn tranh luồng lúc tải.
  React.useEffect(() => {
    if (reduceMotion()) return;
    let a = 0, w = 0, s = 0;
    const start = window.setTimeout(() => {
      a = window.setInterval(() => { if (hoverRef.current == null) setAutoActive((x) => (x + 1) % (LENS_N + 1)); }, 2400);
      // Wave 65.05b a11y — word-rotation trong <h1> dừng HẲN sau 2 vòng đầy đủ
      // (8 lần đổi, kết thúc đúng ở từ đầu tiên): chữ nhấp nháy vô hạn ngay
      // cạnh headline gây khó đọc/mất tập trung (WCAG 2.2.2 hướng tới). Đếm
      // số lần đổi rồi clearInterval khi đạt; reduce-motion check giữ nguyên.
      let wTicks = 0;
      w = window.setInterval(() => {
        setWordIdx((x) => (x + 1) % WORDS.length);
        wTicks += 1;
        if (wTicks >= WORDS.length * 2) window.clearInterval(w);
      }, 3400);
      s = window.setInterval(() => setSample((x) => (x + 1) % SAMPLES.length), 3600);
    }, 3000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(a); window.clearInterval(w); window.clearInterval(s);
    };
  }, []);

  const active = hover != null ? hover : autoActive;
  const sys = active >= 0 && active < LENS_N ? SYSTEMS[active] : null;
  const soi = sys ? (
    hover != null
      ? <><b className="mh-soi-n">{sys.n}</b> <span className="mh-soi-r">· {sys.full}</span></>
      : <><span className="mh-soi-k">đang soi ·</span> <b className="mh-soi-n">{sys.n}</b> <span className="mh-soi-r">→ {sys.r}</span></>
  ) : (
    <><span className="mh-soi-k">ví dụ ·</span> <span className="mh-soi-q">“{SAMPLES[sample] ?? SAMPLES[0]}”</span></>
  );

  return (
    <section className="mh" aria-label="Giới thiệu hieu.asia" style={{ background: PAPER, color: INK, position: 'relative' }}>
      <style>{CSS}</style>
      <div className="mh-grain" aria-hidden="true" />
      <AuroraBackdrop className="z-0" />


      <div className="mh-wrap">
        <div className="mh-copy">
          {/* Wave 65.01 — "KHÔNG BÓI MÙ" lệch tông editorial (rủi ro đọc thành
              miệt thị người xem bói) → "KHÔNG PHÁN MỆNH" giữ đúng lập trường
              mà điềm tĩnh hơn (finding P2 vòng 1). */}
          <p className="mh-eyebrow"><span className="mh-livedot" aria-hidden="true" />LÁ SỐ THẬT · KHÔNG PHÁN MỆNH</p>
          <h2 className="mh-h1">
            <span className="mh-line mh-l1">Hiểu mình rõ hơn,</span>
            <span className="mh-line mh-l2">rồi quyết định cho{' '}
              <span className="mh-rot-slot">
                {WORDS.map((w, i) => (
                  <span key={w} aria-hidden={i !== wordIdx} className={`mh-rot${i === wordIdx ? ' mh-rot-on' : ''}`}>
                    {w}
                  </span>
                ))}
              </span>
            </span>
          </h2>
          {/* Founder 04/08 — "trang ngắn gọn hơn, ít text hơn": rút 3 câu còn 2,
              gộp mệnh đề "tính thật" + "đọc đúng" (trùng ý), GIỮ đủ 3 luận điểm
              gốc (5 hệ · tính thật/trung thực · không hù dọa) — không mất claim. */}
          <p className="mh-deck">Năm hệ soi cùng một người: Tử Vi, Bát Tự, MBTI, Big Five, Xem Tướng — tính thật từ ngày giờ sinh, đọc đúng những gì lá số ghi, kể cả chỗ chưa khớp. Không hù dọa, không bán giải hạn.</p>
        </div>

        {/* mobile-first: CTA TRƯỚC la bàn → user bấm được ngay màn 1 (above-fold).
            Desktop grid-template-areas ("copy vis" / "act vis") đặt lại vị trí nên không đổi. */}
        <div className="mh-act">
          {/* Khung "quà" — reciprocity THẬT: lá số đầy đủ (114 sao, tính thật) là
              quà giữ được, KHÔNG phải teaser. Cố ý KHÔNG hứa "luận giải sâu miễn
              phí" (phần đó trả phí) → trung thực, không over-claim. */}
          {/* Wave 65.01 SEO — "lá số Tử Vi 12 cung" thành link body đầu tiên tới
              /la-so-tu-vi (trang bán chính trước đây chỉ được link từ nav/footer,
              body homepage 0 link — finding P2 vòng 5). Anchor text = đúng cụm
              từ khoá tự nhiên. */}
          <p className="mh-gift"><span className="mh-gift-mk" aria-hidden="true">✦</span> Quà mở đầu: <Link className="mh-gift-link" href="/la-so-tu-vi"><strong>lá số Tử Vi 12 cung, 14 chính tinh</strong></Link>, miễn phí, của bạn để giữ.</p>
          <div className="mh-cta-row">
            <a className="mh-cta mh-cta-primary" href="/onboarding?intent=decision"><span className="mh-cta-num">①</span>Lập lá số miễn phí</a>
            <Link className="mh-cta mh-cta-ghost" href="/tu-vi-2026"><span className="mh-cta-num">②</span>Xem Tử Vi 2026<span className="mh-cta-sub">&amp; hợp tuổi của tôi</span></Link>
          </div>
          <p className="mh-micro">MIỄN PHÍ · KHÔNG CẦN THẺ · LÁ SỐ DỰNG TRONG 30 GIÂY</p>
        </div>

        <div className="mh-vis">
          <LensConstellation active={active} onHover={setHover} onPick={(i) => setHover((h) => (h === i ? null : i))} />
          <p className="mh-soi"><span key={`${active}-${hover != null}-${sample}`} className="mh-soi-in">{soi}</span></p>
          <p className="mh-hint">{hover != null ? 'chạm lại để tiếp tục' : 'chạm một lăng kính để xem từng hệ'}</p>
        </div>
      </div>

    </section>
  );
}

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const CSS = `
.mh { font-family: var(--font-newsreader), Georgia, serif; overflow-x: hidden; }
/* Wave 65.01 — cặp giá trị theme cho gold brand của hero (light giữ NGUYÊN hex
 * cũ; dark = night gold, xem chú thích cạnh const OCHRE phía trên).
 * --mh-gold-rgb nuôi các border/glow rgba; --mh-cta-rgb nuôi nền CTA primary. */
.mh { --mh-ochre: #89612A; --mh-ochre-deep: #89612A; --mh-gold-rgb: 137,97,42; --mh-cta-rgb: 137,97,42; }
.dark .mh { --mh-ochre: #D4A261; --mh-ochre-deep: #D4A261; --mh-gold-rgb: 212,162,97; --mh-cta-rgb: 212,162,97; }
.mh-grain { position: absolute; inset: 0; pointer-events: none; z-index: 0; opacity: .05; mix-blend-mode: multiply; background-image: ${NOISE}; }

/* ===== BASE = MOBILE ===== */
.mh-wrap { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 38px 22px 16px; display: flex; flex-direction: column; gap: 24px; }

.mh-eyebrow { display: flex; align-items: center; font-family: var(--font-be-vietnam), system-ui, sans-serif; letter-spacing: .16em; font-size: 11px; color: ${SOFT}; margin: 0; }
.mh-livedot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${OCHRE}; margin-right: 9px; flex: none; }
.mh-h1 { font-size: clamp(2.3rem, 10vw, 3rem); line-height: 1.12; margin: .42em 0 .34em; font-weight: 400; letter-spacing: -.028em; }
.mh-line { display: block; }
.mh-l2 { color: ${OCHRE}; font-style: italic; }
.mh-rot-slot { display: inline-grid; vertical-align: bottom; }
.mh-rot { grid-area: 1 / 1; display: inline-block; opacity: 0; transform: translateY(0.28em); background-image: linear-gradient(${OCHRE}, ${OCHRE}); background-repeat: no-repeat; background-position: 0 96%; background-size: 100% 2px; }
.mh-rot-on { opacity: 1; transform: translateY(0); }
.mh-deck { font-size: .9rem; line-height: 1.5; color: ${INK}; opacity: .76; margin: 0; max-width: 32em; }

.mh-vis { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.mh-soi { margin: 0; text-align: center; min-height: 4.5em; max-width: 32em; display: flex; align-items: center; justify-content: center; font-family: var(--font-be-vietnam), system-ui, sans-serif; font-size: 12.5px; letter-spacing: .01em; line-height: 1.5; }
.mh-soi-in { display: inline-block; }
.mh-soi-k { color: ${SOFT}; }
.mh-soi-n { color: ${OCHRE_DEEP}; font-weight: 500; font-family: var(--font-newsreader), Georgia, serif; font-size: 1.15em; font-style: italic; }
.mh-soi-r { color: ${SOFT}; }
.mh-soi-q { color: ${INK}; opacity: .92; font-family: var(--font-newsreader), Georgia, serif; font-size: 1.12em; font-style: italic; }
.mh-hint { margin: 0; font-family: var(--font-be-vietnam), system-ui, sans-serif; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: ${SOFT}; opacity: .78; } /* T-TAP — was 10.5px */

.mh-act { display: flex; flex-direction: column; gap: 14px; }
.mh-cta-row { display: flex; flex-direction: column; gap: 10px; }
/* Wave 65.04 — radius 3px → 2px: đồng bộ "paper corner" chữ ký với recipe CTA chuẩn. */
.mh-cta { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; border-radius: 2px; padding: 15px 22px; font-size: 1.02rem; text-decoration: none; }
.mh-cta::before { content: ''; position: absolute; left: 50%; top: 50%; width: 8px; height: 8px; border-radius: 50%; background: radial-gradient(circle, hsl(var(--foreground) / .4), hsl(var(--foreground) / 0) 70%); transform: translate(-50%,-50%) scale(0); transition: transform .55s cubic-bezier(.2,.7,.2,1); }
.mh-cta-primary { background: rgba(var(--mh-cta-rgb),.10); color: ${INK}; border: 1px solid rgba(var(--mh-gold-rgb),.45); box-shadow: 0 6px 20px -6px rgba(var(--mh-gold-rgb),.45), 0 0 0 1px rgba(var(--mh-gold-rgb),.30); }
.mh-cta-ghost { border: 1px solid rgba(var(--mh-gold-rgb),.35); color: ${INK}; }
.mh-cta-ghost::before { background: radial-gradient(circle, rgba(var(--mh-gold-rgb),.5), rgba(var(--mh-gold-rgb),0) 70%); }
.mh-cta > * { position: relative; z-index: 1; }
.mh-cta-num { font-family: var(--font-be-vietnam), system-ui, sans-serif; margin-right: .6em; opacity: .85; }
.mh-cta-sub { font-family: var(--font-be-vietnam), system-ui, sans-serif; font-size: 12px; opacity: .68; margin-left: .5em; } /* T-TAP — was 11px */
.mh-micro { font-family: var(--font-be-vietnam), system-ui, sans-serif; font-size: 12px; letter-spacing: .14em; color: ${SOFT}; margin: 0; text-align: center; } /* T-TAP — was 11px */
.mh-gift { font-family: var(--font-newsreader), Georgia, serif; font-size: .94rem; line-height: 1.4; color: ${OCHRE_DEEP}; margin: 0; text-align: center; font-style: italic; }
.mh-gift strong { font-weight: 600; font-style: normal; }
.mh-gift-link { color: inherit; text-decoration: underline; text-decoration-color: rgba(var(--mh-gold-rgb),.5); text-underline-offset: .2em; }
.mh-gift-link:hover { text-decoration-color: rgba(var(--mh-gold-rgb),.9); }
.mh-gift-mk { color: ${OCHRE}; font-style: normal; margin-right: .2em; }

.mh-l1, .mh-l2 { opacity: 1; }
@media (prefers-reduced-motion: no-preference) {
  .mh-l1 { clip-path: inset(0 100% 0 0); animation: mhInk .85s cubic-bezier(.2,.7,.2,1) .15s both; }
  .mh-l2 { clip-path: inset(0 100% 0 0); animation: mhInk .9s cubic-bezier(.2,.7,.2,1) .45s both; }
  .mh-rot { transition: opacity .5s cubic-bezier(.2,.7,.2,1), transform .5s cubic-bezier(.2,.7,.2,1); }
  .mh-eyebrow { animation: mhFade .8s ease both; }
  .mh-deck { animation: mhFade 1s ease .85s both; }
  .mh-act { animation: mhFade 1s ease 1.05s both; }
  .mh-livedot { animation: mhPulse 1.8s ease-in-out 1.4s infinite; }
  .mh-soi-in { animation: mhFadeUp .5s ease both; }
}
@keyframes mhInk { to { clip-path: inset(0 0 0 0); } }
@keyframes mhRollIn { from { opacity: 0; transform: translateY(.5em); } to { opacity: 1; transform: translateY(0); } }
@keyframes mhRollOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-.45em); } }
@keyframes mhFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes mhFadeUp { from { opacity: 0; transform: translateY(.35em); } to { opacity: 1; transform: translateY(0); } }
@keyframes mhPulse { 0%,100% { opacity: .35; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.15); } }

/* ===== DESKTOP enhancement ===== */
@media (min-width: 880px) {
  .mh-wrap { display: grid; grid-template-columns: 1.05fr .95fr; grid-template-areas: "copy vis" "act vis"; column-gap: 48px; row-gap: 18px; align-items: center; padding: 76px 56px 24px; }
  .mh-copy { grid-area: copy; align-self: end; }
  .mh-vis { grid-area: vis; }
  .mh-act { grid-area: act; align-self: start; }
  .mh-h1 { font-size: clamp(2.75rem, 5vw, 4.25rem); line-height: 1.02; }
  .mh-deck { font-size: .96rem; max-width: 30em; }
  .mh-soi { min-height: 3em; }
  .mh-cta-row { flex-direction: row; flex-wrap: wrap; }
  .mh-cta { justify-content: flex-start; }
  .mh-micro { text-align: left; }
  .mh-gift { text-align: left; }
}

@media (hover: hover) {
  .mh-cta:hover::before { transform: translate(-50%,-50%) scale(34); }
}
`;
