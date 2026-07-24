/**
 * /maintenance — trang khách thấy khi cờ Edge Config `maintenance_mode` bật.
 *
 * Middleware rewrite MỌI đường dẫn về đây (giữ nguyên URL trên thanh địa chỉ),
 * nên trang này phải hoàn toàn TĨNH: không gọi DB, không gọi API, không phụ
 * thuộc thứ có thể đang sập — đó chính là lý do bật bảo trì.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đang bảo trì · hieu.asia',
  description: 'hieu.asia đang bảo trì ngắn. Bạn vui lòng quay lại sau ít phút.',
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground"
    >
      <div className="mx-auto max-w-lg text-center">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
          — Đang bảo trì
        </p>
        <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">
          hieu.asia tạm nghỉ ít phút
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Chúng tôi đang xử lý một sự cố kỹ thuật. Dữ liệu và lá số của bạn vẫn an toàn — không có
          gì bị mất. Bạn vui lòng tải lại trang sau khoảng 10 phút.
        </p>
        <p className="mt-8 text-xs text-muted-foreground">
          Cần gấp? Nhắn Telegram{' '}
          <a
            href="https://t.me/hieuasiabot"
            className="text-primary underline underline-offset-4"
            rel="noopener noreferrer"
          >
            @hieuasiabot
          </a>
          .
        </p>
      </div>
    </main>
  );
}
