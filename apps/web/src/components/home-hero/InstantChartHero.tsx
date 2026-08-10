'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ShimmerText } from '@/components/fx/ShimmerText';
import { AuroraBackdrop } from '@/components/fx/AuroraBackdrop';
import { Time24 } from '@/components/Time24';
import { useScrollToResult } from '@/lib/use-scroll-to-result';
import { track } from '@/lib/analytics';
import { saveBirthDateTime } from '@/lib/birth-profile';

// BatTuChecker (engine Bát Tự + bảng 4 trụ + Nhật Chủ + đại vận + Thần Sát + nút
// PDF, ~716 LOC) CHỈ render sau khi khách bấm "Lập lá số" (state `revealed`).
// Import tĩnh khiến chunk nặng đó tải NGAY lúc vào trang dù chưa dùng → đội
// unused-JS + bootup-time của trang chủ (LCP/TBT mobile xấu). next/dynamic
// (ssr:false) nạp chunk lúc SUBMIT; KHÔNG đụng above-the-fold (LCP = H1/form) và
// KHÔNG đổi hành vi (vốn chỉ hiện sau submit, chưa từng SSR).
const BatTuChecker = dynamic(
  () => import('@/components/la-so-bat-tu/BatTuChecker').then((m) => m.BatTuChecker),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[280px] items-center justify-center rounded-2xl border border-border bg-card/40"
        role="status"
        aria-live="polite"
      >
        <span className="font-mono text-eyebrow uppercase text-muted-foreground">
          Đang lập lá số…
        </span>
      </div>
    ),
  },
);

/**
 * InstantChartHero — cửa trước thật của trang chủ (Phase 1).
 *
 * Thay cho teaser GIẢ (FreeReadingTeaser, blockquote chung chung "ví dụ minh
 * hoạ"): khách lạ nhập ngày–giờ–giới tính ngay above-the-fold → bấm là lá số
 * Bát Tự THẬT của họ hiện ra ngay bên dưới, tính 100% trong trình duyệt
 * (engine `lib/bazi.ts`, không đăng nhập, không gọi máy chủ). "Đây đúng là lá
 * số CỦA TÔI, tức thì và trung thực" — niềm tin TRƯỚC khi gặp form.
 *
 * Thiết kế: lời mời gọn, đẹp, không ngộp (chỉ input above-fold); toàn bộ bảng
 * lá số (4 trụ, Nhật Chủ, ngũ hành, đại vận, Thần Sát) + CTA trả phí mang theo
 * lá số do <BatTuChecker> đảm nhiệm, render ngay khi submit. Mobile-first 390px.
 *
 * Giữ moat trung thực: KHÔNG con số/sao/nhận xét bịa — con số là kết quả tính.
 */

export function InstantChartHero(): React.JSX.Element {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('12:00');
  const [unknownTime, setUnknownTime] = React.useState(false);
  const [gender, setGender] = React.useState<'M' | 'F'>('M');
  const [revealed, setRevealed] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const { resultRef, armScroll } = useScrollToResult(revealed);

  // Analytics (S11): trang chủ là bề mặt "giá trị đầu tiên" nhưng trước đây KHÔNG
  // bắn sự kiện nào → phễu đo MÙ đúng khúc quan trọng nhất (khách nhập ngày → ra
  // lá số ngay). Bắn form_started lúc khách chạm input lần đầu, và
  // form_submitted + tool_used lúc lá số hiện ra → phễu home→bắt-đầu→lá-số đo được.
  const startedRef = React.useRef(false);
  const startAtRef = React.useRef<number | null>(null);
  const markStarted = React.useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startAtRef.current = Date.now();
    track('form_started', { form_id: 'home-instant-hero', page: '/' });
  }, []);

  // Khi đã hiện lá số mà người dùng đổi input → ẩn để họ bấm "Lập lại" cho khớp.
  const onChangeAny = React.useCallback(() => {
    markStarted();
    if (revealed) setRevealed(false);
  }, [revealed, markStarted]);

  const onSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      if (!date) return;
      const startedAt = startAtRef.current;
      track('form_submitted', {
        form_id: 'home-instant-hero',
        page: '/',
        time_to_submit_ms: startedAt ? Date.now() - startedAt : null,
      });
      track('tool_used', { tool: 'home-instant-bat-tu', result: 'ok' });
      // PROFILE-CARRY — trang chủ là nơi khách nhập ngày sinh ĐẦU TIÊN. Ghi vào
      // hồ sơ dùng chung (chỉ trên máy) để mọi công cụ sau đó tự điền sẵn.
      saveBirthDateTime(date, unknownTime ? '12:00' : time, gender === 'F' ? 'nu' : 'nam');
      armScroll();
      setRevealed(true);
    },
    [date, time, unknownTime, gender, armScroll],
  );

  const effectiveTime = unknownTime ? '12:00' : time;

  return (
    <section
      aria-label="Lập lá số Bát Tự tức thì"
      className="relative overflow-hidden border-b border-border bg-background"
    >
      {/* glow trang trí — thuần thị giác, drift nhẹ (AuroraBackdrop), hợp tông giấy-kem + vàng */}
      <AuroraBackdrop />

      {/* Wave 65.02 — nén nhịp dọc MOBILE (pt-6/mt-2/mt-3/mt-5 + dời link hồi
          cứu giờ sinh xuống dưới nút): nút submit trước đây rơi dưới fold trên
          máy nhỏ (finding P2 vòng 8, ảnh fold.jpeg). Desktop (sm:) giữ nguyên. */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-6 pb-28 sm:pt-12 sm:pb-16">
        {/* Wave 65 — lời hứa thương hiệu lên đầu (page 1) theo yêu cầu founder;
            GIỮ nguyên H1 hành động + form ngay dưới (không phá mối nối chuyển đổi). */}
        <p
          className="hero-enter font-mono text-eyebrow uppercase text-gold/80"
          style={{ animationDelay: '150ms' }}
        >
          Lá số Bát Tự thật · tính ngay · miễn phí
        </p>
        {/* Wave 65.01 SEO — H1 mang từ khoá "lá số Bát Tự" (trước đây title tag
            nhắm "Tử Vi & Bát Tự AI" nhưng H1 + toàn bộ H2 không chứa từ khoá nào
            — finding P1 vòng 5). Shimmer GIỮ trên lời hứa cảm xúc, không đổi
            cấu trúc LCP (guardrail §5). */}
        <h1 className="mt-2 text-balance font-heading text-2xl font-bold leading-tight text-foreground sm:mt-3 sm:text-3xl lg:text-4xl">
          Nhập ngày sinh, xem lá số Bát Tự —{' '}
          <ShimmerText>hiểu mình rõ hơn</ShimmerText>{' '}
          trong một phút.
        </h1>
        <p
          className="hero-enter mt-3 max-w-xl text-sm leading-relaxed text-foreground/75 sm:mt-4 sm:text-base"
          style={{ animationDelay: '220ms' }}
        >
          Từ ngày và giờ sinh, hệ thống dựng lá số Bát Tự của bạn: Nhật Chủ (đại diện chính
          bạn), ngũ hành mạnh yếu, đại vận từng chặng 10 năm. Con số tính bằng thuật toán theo tiết khí,{' '}
          <strong className="text-foreground/90">không tra bảng sẵn</strong>. Phần luận giải giúp
          bạn hiểu mình và chọn thời điểm, không phán vận hạn.
        </p>

        {/* Lời mời gọn — above the fold, không ngộp dữ liệu trước khi khách hành động */}
        <form
          onSubmit={onSubmit}
          className="hero-enter mt-5 rounded-2xl border border-gold/25 bg-card/60 p-5 backdrop-blur-sm sm:mt-7 sm:p-6"
          style={{ animationDelay: '320ms' }}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label
                htmlFor="ich-date"
                className="block font-mono text-eyebrow uppercase text-muted-foreground"
              >
                Ngày sinh (dương lịch)
              </label>
              <input
                id="ich-date"
                type="date"
                min="1900-01-01"
                max={new Date().toISOString().slice(0, 10)}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  onChangeAny();
                }}
                required
                aria-invalid={touched && !date}
                aria-describedby={touched && !date ? 'ich-date-err' : undefined}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-gold"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="ich-time"
                className="block font-mono text-eyebrow uppercase text-muted-foreground"
              >
                Giờ sinh
              </label>
              <Time24
                id="ich-time"
                value={time}
                disabled={unknownTime}
                onChange={(v) => {
                  setTime(v);
                  onChangeAny();
                }}
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="ich-gender"
                className="block font-mono text-eyebrow uppercase text-muted-foreground"
              >
                Giới tính
              </label>
              <select
                id="ich-gender"
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value as 'M' | 'F');
                  onChangeAny();
                }}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                <option value="M">Nam</option>
                <option value="F">Nữ</option>
              </select>
            </div>
          </div>

          <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-foreground/75">
            <input
              type="checkbox"
              aria-label="Không nhớ giờ sinh — để 12:00"
              checked={unknownTime}
              onChange={(e) => {
                setUnknownTime(e.target.checked);
                onChangeAny();
              }}
              className="h-4 w-4 rounded border-input accent-gold"
            />
            <span>
              Không nhớ giờ sinh — để <strong>12:00</strong> (ba trụ năm/tháng/ngày vẫn đúng).
            </span>
          </label>

          {/* Wave 65.04 — CTA về MỘT recipe chuẩn (mẫu = PricingTierV2, đúng spec
              "Như giấy cũ"): rounded-[2px] paper corner + bg --primary-cta +
              nhãn font-editorial-display + text-primary-foreground (AA cả 2
              theme). Trước đây trang có 5 hình hài nút với 3 sắc gold. */}
          <button
            type="submit"
            className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-[2px] bg-[hsl(var(--primary-cta))] px-7 font-editorial-display text-base font-medium text-primary-foreground transition-all duration-300 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:mt-4 sm:w-auto"
          >
            ✦ Lập lá số Bát Tự của tôi →
          </button>
          {touched && !date && (
            <p id="ich-date-err" className="mt-2 text-xs text-destructive" role="alert">
              Hãy chọn ngày sinh dương lịch để lập lá số.
            </p>
          )}
          {/* Không biết giờ sinh → công cụ Hồi cứu giờ sinh. Trang chủ trước
              đây không có lối vào nào tới /tu-vi/rectify. Wave 65.02 — dời
              XUỐNG DƯỚI nút submit: là lối thoát phụ, không đáng chiếm chỗ
              trước hành động chính trên fold mobile. */}
          <p className="mt-2 text-xs text-foreground/70">
            <Link
              href="/tu-vi/rectify"
              className="text-gold underline underline-offset-4 hover:text-gold-400"
            >
              Không biết giờ sinh? → Tìm lại giờ sinh từ sự kiện đời bạn
            </Link>
          </p>
          <p className="mt-3 font-mono text-[13px] leading-relaxed text-muted-foreground">
            Tính ngay trên máy bạn · chưa đăng ký thì không lưu gì · không bán, không chia sẻ.
          </p>
        </form>

        {/* Lá số THẬT hiện ra ngay bên dưới khi submit — tái dùng nguyên engine
            + giao diện + CTA-mang-theo-lá-số của BatTuChecker (embedded mode:
            không ghi đè URL trang chủ). */}
        <div
          ref={resultRef}
          className={`scroll-mt-24 grid grid-cols-1 transition-all duration-500 ${
            revealed ? 'mt-8 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            {revealed && (
              <BatTuChecker
                key={`${date}|${effectiveTime}|${gender}`}
                embedded
                autoCast
                initialDate={date}
                initialTime={effectiveTime}
                initialGender={gender}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
