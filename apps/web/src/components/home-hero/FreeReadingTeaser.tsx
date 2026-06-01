'use client';

import * as React from 'react';

/**
 * FreeReadingTeaser — value-before-ask: nhập ngày sinh → hiện một "lát cắt" ví dụ.
 * HONEST: nhãn "Ví dụ minh hoạ — chưa phải phân tích của bạn" đặt NỔI BẬT TRƯỚC blockquote.
 * Controlled input + disable nút tới khi nhập; reveal aria-hidden khi ẩn; CTA chính filled (AA).
 */
export function FreeReadingTeaser(): React.JSX.Element {
  const [dob, setDob] = React.useState('');
  const [shown, setShown] = React.useState(false);
  return (
    <section aria-label="Phân tích thử miễn phí" className="py-16 sm:py-20">
      <div className="mx-auto max-w-marketing-tight px-6 sm:px-8">
        <div className="rounded-xl border border-primary/20 bg-background p-6 sm:p-8">
          <p className="font-mono text-editorial-mono uppercase tracking-[0.16em] text-muted-foreground">
            PHÂN TÍCH THỬ · MIỄN PHÍ
          </p>
          <h2 className="mt-3 font-marketing-display text-2xl leading-tight text-foreground sm:text-3xl">
            Nhập ngày sinh, xem một lát cắt.
          </h2>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="frt-dob" className="sr-only">Ngày sinh</label>
            <input
              id="frt-dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="rounded-md border border-primary/30 bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShown(true)}
              disabled={!dob}
              className="rounded-md bg-[hsl(var(--primary-cta))] px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Phân tích →
            </button>
          </div>
          <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
            Chỉ dùng để tính toán · không lưu nếu bạn chưa đăng ký · không bán hay chia sẻ.
          </p>

          {/* When collapsed, `inert` removes the whole subtree from the focus
              order + a11y tree — otherwise the /onboarding link inside stays
              tabbable while visually hidden (axe aria-hidden-focus violation).
              inert supersedes aria-hidden here, so we drop aria-hidden to avoid
              the "aria-hidden contains focusable" rule firing on stale browsers. */}
          <div
            inert={!shown}
            className={`grid grid-cols-1 transition-all duration-500 ${
              shown ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Ví dụ minh hoạ — chưa phải phân tích của bạn
              </p>
              <blockquote className="border-l-2 border-primary/40 pl-4 font-editorial-display text-lg italic leading-relaxed text-foreground">
                “Bạn mạnh quyết đoán nhưng dễ chần chừ ở khúc rẽ lớn — vì cầu toàn, không phải thiếu
                lực. Khi phân vân: đặt deadline ngắn rồi điều chỉnh.”
              </blockquote>
              <a
                href="/onboarding"
                className="mt-5 block w-full rounded-md bg-[hsl(var(--primary-cta))] py-3 text-center font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Nhận phân tích của tôi →
              </a>
              <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Miễn phí · không cần thẻ
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
