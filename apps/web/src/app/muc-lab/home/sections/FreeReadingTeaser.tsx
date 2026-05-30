'use client';

import * as React from 'react';

/**
 * FreeReadingTeaser — value-before-ask (kiểu Chani/The Pattern): nhập ngày sinh → hiện
 * một "lát cắt" ví dụ NGAY trên trang trước khi yêu cầu đăng ký. Privacy line cạnh input.
 * HONEST: kết quả gắn nhãn "ví dụ minh hoạ — chưa phải phân tích của bạn" (chưa nối AI thật,
 * không giả cá nhân hoá). Reveal mượt bằng grid-rows trick (no LLM cost).
 */
export function FreeReadingTeaser(): React.JSX.Element {
  const [shown, setShown] = React.useState(false);
  return (
    <section aria-label="Soi thử miễn phí" className="py-16 sm:py-20">
      <div className="mx-auto max-w-marketing-tight px-6 sm:px-8">
        <div className="rounded-xl border border-primary/20 bg-background p-6 sm:p-8">
          <p className="font-mono text-editorial-mono uppercase tracking-[0.16em] text-muted-foreground">
            SOI THỬ · MIỄN PHÍ
          </p>
          <h2 className="mt-3 font-marketing-display text-2xl leading-tight text-foreground sm:text-3xl">
            Nhập ngày sinh, xem một lát cắt.
          </h2>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="date"
              aria-label="Ngày sinh"
              className="rounded-md border border-primary/30 bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShown(true)}
              className="rounded-md bg-primary px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
            >
              Soi thử →
            </button>
          </div>
          <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
            🔒 Chỉ dùng để tính toán · không lưu nếu bạn chưa đăng ký · không bán hay chia sẻ.
          </p>

          <div
            className={`grid grid-cols-1 transition-all duration-500 ${
              shown ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <blockquote className="border-l-2 border-primary/40 pl-4 font-editorial-display text-lg italic leading-relaxed text-foreground">
                “Bạn mạnh quyết đoán nhưng dễ chần chừ ở khúc rẽ lớn — vì cầu toàn, không phải thiếu
                lực. Khi phân vân: đặt deadline ngắn rồi điều chỉnh.”
                <footer className="mt-2 font-mono text-[11px] not-italic uppercase tracking-[0.1em] text-muted-foreground">
                  ví dụ minh hoạ — chưa phải phân tích của bạn
                </footer>
              </blockquote>
              <a
                href="/onboarding"
                className="mt-4 block font-mono text-sm text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Nhận phân tích đầy đủ →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
