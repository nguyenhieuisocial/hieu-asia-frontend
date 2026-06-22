'use client';

import * as React from 'react';
import { BatTuChecker } from '@/components/la-so-bat-tu/BatTuChecker';

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

  // Khi đã hiện lá số mà người dùng đổi input → ẩn để họ bấm "Lập lại" cho khớp.
  const onChangeAny = React.useCallback(() => {
    if (revealed) setRevealed(false);
  }, [revealed]);

  const onSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      if (!date) return;
      setRevealed(true);
    },
    [date],
  );

  const effectiveTime = unknownTime ? '12:00' : time;

  return (
    <section
      aria-label="Lập lá số Bát Tự tức thì"
      className="relative overflow-hidden border-b border-border bg-background"
    >
      {/* glow trang trí — thuần thị giác, hợp tông giấy-kem + vàng */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-12%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-[-12%] h-[300px] w-[300px] rounded-full bg-purple/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-6 pt-8 pb-28 sm:pt-12 sm:pb-16">
        {/* Wave 65 — lời hứa thương hiệu lên đầu (page 1) theo yêu cầu founder;
            GIỮ nguyên H1 hành động + form ngay dưới (không phá mối nối chuyển đổi). */}
        <p className="font-marketing-display text-lg italic leading-tight text-primary/90 sm:text-xl">
          Hiểu mình. Quyết định mình.
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
          Lá số Bát Tự thật · tính ngay · miễn phí
        </p>
        <h1 className="mt-3 text-balance font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
          Nhập ngày sinh —{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            xem lá số của bạn
          </span>{' '}
          ngay.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/75 sm:text-base">
          Bốn trụ, Nhật Chủ, ngũ hành, đại vận — tính theo tiết khí, đúng chuẩn,{' '}
          <strong className="text-foreground/90">kiểm chứng được</strong>. Lập ngay trong trình
          duyệt, không cần đăng ký. Con số là thật; phần luận giải là để bạn tự hiểu mình, không
          bói toán.
        </p>

        {/* Lời mời gọn — above the fold, không ngộp dữ liệu trước khi khách hành động */}
        <form
          onSubmit={onSubmit}
          className="mt-7 rounded-2xl border border-gold/25 bg-card/60 p-5 backdrop-blur-sm sm:p-6"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label
                htmlFor="ich-date"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
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
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-gold"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="ich-time"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
              >
                Giờ sinh
              </label>
              <input
                id="ich-time"
                type="time"
                value={time}
                disabled={unknownTime}
                onChange={(e) => {
                  setTime(e.target.value);
                  onChangeAny();
                }}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-gold disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="ich-gender"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
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

          <button
            type="submit"
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-md bg-gold px-6 text-sm font-medium text-ink transition-colors hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:w-auto"
          >
            ✦ Lập lá số Bát Tự của tôi →
          </button>
          {touched && !date && (
            <p className="mt-2 text-xs text-destructive" role="alert">
              Hãy chọn ngày sinh dương lịch để lập lá số.
            </p>
          )}
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            Tính ngay trong trình duyệt · không lưu nếu bạn chưa đăng ký · không bán hay chia sẻ.
          </p>
        </form>

        {/* Lá số THẬT hiện ra ngay bên dưới khi submit — tái dùng nguyên engine
            + giao diện + CTA-mang-theo-lá-số của BatTuChecker (embedded mode:
            không ghi đè URL trang chủ). */}
        <div
          className={`grid grid-cols-1 transition-all duration-500 ${
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
