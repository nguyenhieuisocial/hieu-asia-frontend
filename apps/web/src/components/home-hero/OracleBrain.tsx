'use client';

import * as React from 'react';
import { TOOLKIT_GROUPS } from '@/lib/catalog/tools';
import { ShimmerText } from '@/components/fx/ShimmerText';
import { Marquee } from '@/components/fx/Marquee';
import type { BanMenhData } from '@/lib/ban-menh-data';
import { Time24 } from '@/components/Time24';
// Diễn giải Bát Tự đời thường (data tĩnh nhỏ, dùng chung — engine vẫn lazy-import).
import { CAN_PLAIN, TEN_GOD_PLAIN, NGU_HANH_PLAIN } from '@/lib/bat-tu-plain';

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

type Lens = {
  name: string;
  symbol: string;
  tagline: string;
  element: string;
  quality: string;
  rulingPlanet: string;
  strengths: string[];
  work: string;
  opposite: string;
};
type Bazi = {
  dayCan: string;
  dayEl: string;
  dayYang: boolean;
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  monthTenGod: string;
  hourPillar: string | null;
  strongest: string | null;
  missing: string[];
};
type Reveal = {
  dong: BanMenhData;
  conVat: string;
  /** Tính cách tuổi (con giáp) — engine con-giap-data, cùng nguồn trang /con-giap. */
  cg: { tagline: string; strengths: string[] } | null;
  /** Hướng tốt + 1 lời khuyên hành động theo hành bản mệnh (ngu-hanh-remedy). */
  huongTot: string[];
  loiKhuyen: string | null;
  tay: Lens | null;
  nearCusp: boolean;
  bazi: Bazi;
  /** true = sinh TRƯỚC Lập Xuân → đã quy về năm âm liền trước (chuẩn mệnh học). */
  lunarAdjusted: boolean;
};

const ALL_TOOLS = TOOLKIT_GROUPS.flatMap((g) => g.tools.map((t) => t.n));

const RADIUS = 33; // hub distance from center (% of box)
const SAT_R = 6.5; // satellite cluster radius around a hub (% of box)

const HUBS = TOOLKIT_GROUPS.map((g, i, arr) => {
  const a = ((-90 + (360 / arr.length) * i) * Math.PI) / 180;
  const left = 50 + Math.cos(a) * RADIUS;
  const top = 50 + Math.sin(a) * RADIUS;
  const nSat = Math.max(3, Math.min(5, Math.round(g.tools.length / 3)));
  const sats = Array.from({ length: nSat }, (_, k) => {
    const sa = a + (k - (nSat - 1) / 2) * 0.42;
    return { left: left + Math.cos(sa) * SAT_R, top: top + Math.sin(sa) * SAT_R };
  });
  return {
    label: g.label,
    count: g.tools.length,
    // Giữ cả href để tên công cụ trong lăng kính là LINK bấm được (cross-link).
    tools: g.tools.map((t) => ({ n: t.n, href: t.href })),
    left,
    top,
    sats,
  };
});

// Đợt 2 "chạm nhóm ra ý nghĩa": mô tả ngắn mỗi lăng kính (khớp NHÃN hub). Chỉ Cổ
// học + Chiêm tinh có kết quả tính được ở client — còn lại chỉ giới thiệu + dẫn
// tới công cụ (KHÔNG bịa kết quả, giữ đúng tinh thần teaser).
const LENS_ABOUT: Record<string, string> = {
  'Cổ học Á Đông': 'Từ ngày sinh: can chi, con giáp, mệnh nạp âm, màu & hướng nghề hợp.',
  'Tâm lý hiện đại': 'Tính cách qua MBTI, Big Five, DISC, Enneagram — cần làm bài trắc nghiệm ngắn.',
  'Chiêm tinh phương Tây': 'Cung hoàng đạo tính từ vị trí Mặt Trời lúc bạn sinh.',
  'Trực giác': 'Tarot — lăng kính trực giác; bạn rút bài để soi một câu hỏi.',
  'Khám phá & so sánh': 'So sánh nhiều lăng kính & hợp tuổi — ghép các mảnh thành bức tranh chung.',
};
const DONG_IDX = HUBS.findIndex((h) => h.label === 'Cổ học Á Đông');
const TAY_IDX = HUBS.findIndex((h) => h.label === 'Chiêm tinh phương Tây');

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

  // v5 — Soi thử đa lăng kính (demo sống)
  const [birthDate, setBirthDate] = React.useState('');
  const [birthTime, setBirthTime] = React.useState('');
  const [reveal, setReveal] = React.useState<Reveal | null>(null);
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
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    setErr(null);
    setReading(true);
    try {
      const [banMenh, cung, conGiap, baziMod, conGiapData, nguHanh] = await Promise.all([
        import('@/lib/ban-menh-data'),
        import('@/lib/cung-hoang-dao-data'),
        import('@/lib/con-giap-animal'),
        import('@/lib/bazi'),
        import('@/lib/con-giap-data'),
        import('@/lib/ngu-hanh-remedy'),
      ]);
      const hm = birthTime.match(/^(\d{1,2}):(\d{2})$/);
      const hour = hm ? Number(hm[1]) : 12;
      const hasTime = hm != null && hour >= 0 && hour <= 23;
      // Tính Bát Tự TRƯỚC — engine đã xử lý ranh giới LẬP XUÂN (meta.solarYearForPillar
      // = năm âm chuẩn mệnh học). Lăng kính Cổ học tra 60 Giáp Tý theo ĐÚNG năm này
      // → người sinh tháng 1–đầu tháng 2 (trước Lập Xuân) không còn bị gán nhầm
      // con giáp/can chi/mệnh, và 2 lăng kính Đông + Bát Tự luôn khớp nhau.
      const chart = baziMod.calculateBazi({
        birthSolarDate: birthDate,
        birthHour: hasTime ? hour : 12,
      });
      const lunarYear = chart.meta.solarYearForPillar;
      const dong = banMenh.buildBanMenh(lunarYear);
      if (!dong) {
        setReading(false);
        setErr('Năm sinh cần trong khoảng 1950–2026.');
        return;
      }
      // Tầng chiều sâu — TOÀN dữ liệu chuẩn từ engine sẵn có (không bịa):
      // tính cách tuổi (con-giap-data), hướng tốt + lời khuyên (ngu-hanh-remedy),
      // chi tiết cung (buildCung: chủ quản/điểm mạnh/công việc/cung đối).
      const cgd = conGiapData.buildConGiap(dong.zodiac.slug);
      const remedy = nguHanh.getNguHanhRemedy(dong.elementName);
      const sun = cung.sunSignFromDate(y, mo, d);
      const found = cung.listCung().find((c) => c.slug === sun.slug);
      const detail = cung.buildCung(sun.slug);
      const tay: Lens | null =
        found && detail
          ? {
              name: found.name,
              symbol: found.symbol,
              tagline: found.tagline,
              element: found.element,
              quality: found.quality,
              rulingPlanet: detail.extra.rulingPlanet,
              strengths: detail.extra.strengths.slice(0, 2),
              work: detail.extra.work,
              opposite: detail.opposite.name,
            }
          : null;
      const bazi: Bazi = {
        dayCan: chart.dayMaster.can,
        dayEl: chart.dayMaster.element,
        dayYang: chart.dayMaster.yang,
        yearPillar: `${chart.year.can} ${chart.year.chi}`,
        monthPillar: `${chart.month.can} ${chart.month.chi}`,
        dayPillar: `${chart.day.can} ${chart.day.chi}`,
        monthTenGod: chart.month.tenGod,
        hourPillar: hasTime ? `${chart.hour.can} ${chart.hour.chi}` : null,
        strongest: hasTime ? chart.strongest : null,
        missing: hasTime ? chart.missing : [],
      };
      const result: Reveal = {
        dong,
        conVat: conGiap.conVatOf(dong.zodiac.ten),
        cg: cgd ? { tagline: cgd.extra.tagline, strengths: cgd.extra.strengths.slice(0, 2) } : null,
        huongTot: remedy?.huongTot ?? [],
        loiKhuyen: remedy?.loiKhuyen?.[0] ?? null,
        tay,
        nearCusp: sun.nearCusp,
        bazi,
        lunarAdjusted: lunarYear !== y,
      };
      const show = (): void => {
        setReveal(result);
        setReading(false);
      };
      if (reducedRef.current) show();
      else timerRef.current = window.setTimeout(show, 700);
    } catch {
      setReading(false);
      setErr('Chưa soi được, thử lại nhé.');
    }
  };

  const resetReveal = (): void => {
    setReveal(null);
    setBirthDate('');
    setErr(null);
    setSelected(null);
  };

  const isOn = (i: number) => hover === i || selected === i;
  const sel = selected !== null ? HUBS[selected] : null;
  const hopColors = reveal
    ? Array.from(new Set([...reveal.dong.banMenhColors, ...reveal.dong.hopColors])).slice(0, 4)
    : [];

  // Đợt 2 — 1 nguồn cho lăng kính Cổ học & Chiêm tinh, dùng chung ở bảng tổng
  // ("Lát cắt về bạn") lẫn bảng chạm-từng-nhóm sao. Trả null khi chưa soi.
  const renderDongLens = (): React.JSX.Element | null =>
    reveal ? (
      <div className="ob-lens">
        <span className="ob-lens-tag">Cổ học Á Đông</span>
        <p className="ob-lens-line">
          <strong>
            Tuổi {reveal.dong.canChi} · con {reveal.conVat}
          </strong>{' '}
          — mệnh {reveal.dong.elementName} ({reveal.dong.napAmName}).
        </p>
        {reveal.cg && (
          <p className="ob-lens-sub">
            Tuổi {reveal.conVat}: {reveal.cg.tagline}
            {reveal.cg.strengths.length > 0 && (
              <> Nổi bật: {reveal.cg.strengths.join(' · ')}.</>
            )}
          </p>
        )}
        <p className="ob-lens-sub">
          {reveal.dong.sinhElementName} sinh {reveal.dong.elementName} (tương sinh) ·{' '}
          {reveal.dong.khacElementName} khắc {reveal.dong.elementName} (nên tiết chế).{' '}
          {hopColors.length > 0 && <>Hợp màu {hopColors.join(', ')}. </>}
          {reveal.dong.avoidColors.length > 0 && (
            <>Nên tiết chế màu {reveal.dong.avoidColors.join(', ')}. </>
          )}
          {reveal.dong.careers.length > 0 && (
            <>Hợp hướng nghề {reveal.dong.careers.slice(0, 2).join(', ')}.</>
          )}
        </p>
        {(reveal.huongTot.length > 0 || reveal.loiKhuyen) && (
          <p className="ob-lens-sub">
            {reveal.huongTot.length > 0 && <>Hướng tốt: {reveal.huongTot.join(', ')}. </>}
            {reveal.loiKhuyen && <>Gợi ý: {reveal.loiKhuyen}</>}
          </p>
        )}
        {reveal.lunarAdjusted && (
          <p className="ob-lens-sub">
            Bạn sinh trước Lập Xuân — tuổi âm tính theo năm {reveal.dong.year} (chuẩn mệnh
            học, khớp trụ năm Bát Tự).
          </p>
        )}
      </div>
    ) : null;

  const renderTayLens = (): React.JSX.Element | null =>
    reveal?.tay ? (
      <div className="ob-lens">
        <span className="ob-lens-tag">Chiêm tinh phương Tây</span>
        <p className="ob-lens-line">
          <strong>
            Cung {reveal.tay.name} {reveal.tay.symbol}
          </strong>
        </p>
        <p className="ob-lens-sub">
          Nhóm {reveal.tay.element} · {reveal.tay.quality} · chủ quản {reveal.tay.rulingPlanet}.{' '}
          {reveal.tay.tagline}
          {reveal.nearCusp && ' (sinh sát ranh giới cung — cần giờ sinh để chắc chắn).'}
        </p>
        {reveal.tay.strengths.length > 0 && (
          <p className="ob-lens-sub">
            Nổi bật: {reveal.tay.strengths.join(' · ')}. {reveal.tay.work}
          </p>
        )}
        <p className="ob-lens-sub">Cung đối: {reveal.tay.opposite} — vừa hút vừa thử thách.</p>
      </div>
    ) : null;

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
              Nhập ngày sinh (giờ sinh không bắt buộc) — để bộ não soi bạn qua nhiều lăng kính
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

        <div
          ref={graphRef}
          data-in={inView || undefined}
          data-sel={selected !== null || undefined}
          data-reading={reading || undefined}
          data-revealed={reveal ? true : undefined}
          data-lensopen={selected !== null || undefined}
          className="ob-graph"
          role="img"
          aria-label="Năm nhóm công cụ hội tụ về Bạn"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        >
          <div className="ob-plx ob-plx-neb" aria-hidden="true">
            <div className="ob-plx-in ob-neb-glow" />
          </div>

          <svg className="ob-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
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
                  renderDongLens()
                ) : selected === TAY_IDX && reveal ? (
                  renderTayLens()
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

          {HUBS.map((h, i) => (
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
              onClick={() => setSelected((s) => (s === i ? null : i))}
            >
              <span className="ob-hub-dot" aria-hidden="true" />
              <span className="ob-hub-label">{h.label}</span>
              <span className="ob-hub-count">{h.count} công cụ</span>
            </button>
          ))}
        </div>

        <p className="ob-tap-hint">Chạm mỗi nhóm sao để xem riêng lăng kính đó.</p>

        {/* v5 — Lát cắt THẬT qua nhiều lăng kính (tính trên máy; chưa lưu gì). */}
        {reveal && (
          <div className="ob-detail-wrap">
            <div className="ob-reveal" role="region" aria-live="polite" aria-label="Lát cắt về bạn">
              <div className="ob-reveal-head">
                <span className="ob-reveal-emoji" aria-hidden="true">
                  {reveal.dong.zodiac.emoji}
                </span>
                <span className="ob-reveal-heading">
                  <span className="ob-reveal-title">Lát cắt về bạn</span>
                  <span className="ob-reveal-menh">Nhiều lăng kính — một bức tranh</span>
                </span>
                <button
                  type="button"
                  className="ob-detail-close"
                  onClick={resetReveal}
                  aria-label="Thử ngày khác"
                >
                  ×
                </button>
              </div>

              {renderDongLens()}

              {renderTayLens()}

              <div className="ob-lens">
                <span className="ob-lens-tag">Bát Tự — Tứ Trụ</span>
                <p className="ob-lens-line">
                  <strong>
                    "Chất gốc" của bạn: {reveal.bazi.dayCan} — hình tượng{' '}
                    {CAN_PLAIN[reveal.bazi.dayCan]?.hinh ?? reveal.bazi.dayEl}
                  </strong>
                </p>
                {CAN_PLAIN[reveal.bazi.dayCan] && (
                  <p className="ob-lens-sub">{CAN_PLAIN[reveal.bazi.dayCan]!.blurb}</p>
                )}
                {TEN_GOD_PLAIN[reveal.bazi.monthTenGod] && (
                  <p className="ob-lens-sub">
                    Nền công việc & trưởng thành (trụ tháng {reveal.bazi.monthTenGod}):{' '}
                    {TEN_GOD_PLAIN[reveal.bazi.monthTenGod]}
                  </p>
                )}
                <p className="ob-lens-sub">
                  "Mã thời gian" của bạn — Tứ Trụ: năm {reveal.bazi.yearPillar} · tháng{' '}
                  {reveal.bazi.monthPillar} · ngày {reveal.bazi.dayPillar}
                  {reveal.bazi.hourPillar && <> · giờ {reveal.bazi.hourPillar}</>}.
                </p>
                <p className="ob-lens-sub">
                  {reveal.bazi.hourPillar ? (
                    <>
                      {reveal.bazi.strongest && (
                        <>
                          Trong bạn, chất {reveal.bazi.strongest} đang trội —{' '}
                          {NGU_HANH_PLAIN[reveal.bazi.strongest]?.vuong}.
                        </>
                      )}
                      {reveal.bazi.missing.length > 0 && (
                        <>
                          {' '}
                          Hơi thiếu chất {reveal.bazi.missing.join(', ')} —{' '}
                          {NGU_HANH_PLAIN[reveal.bazi.missing[0]!]?.thieu}.
                        </>
                      )}
                    </>
                  ) : (
                    <>Thêm giờ sinh (không bắt buộc) để xem chất nào đang trội / còn thiếu trong bạn.</>
                  )}
                </p>
              </div>

              <p className="ob-reveal-body">
                Đông, Tây, Bát Tự — vài lát cắt về bạn. Bức tranh đầy đủ (lá số Tử Vi, tâm lý,
                đại vận…) cần thêm giờ sinh chính xác.
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
                  Thử ngày khác
                </button>
              </div>
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
