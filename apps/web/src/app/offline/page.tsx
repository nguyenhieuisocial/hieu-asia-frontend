/**
 * /offline — trang dự phòng khi service worker không gọi được mạng.
 *
 * RÀNG BUỘC (đừng phá khi sửa sau):
 *  - Server component TĨNH, KHÔNG gọi API, KHÔNG đọc cookie/searchParams.
 *    Trang này được service worker precache lúc `install`; mọi thứ động sẽ bị
 *    đóng băng ở bản lúc cài rồi phục vụ sai về sau.
 *  - KHÔNG import component nặng / có 'use client'. Người dùng đang mất mạng,
 *    chunk JS chưa cache sẽ không tải được ⇒ trang trắng thay vì lời nhắn.
 *  - Chỉ dùng thẻ HTML thuần + token màu. Không `next/image` (cần optimizer).
 *
 * Điều hướng: dùng thẻ `<a>` chứ KHÔNG dùng `next/link` — Link điều hướng
 * client-side, mà router lúc offline không lấy được payload RSC nên bấm xong
 * không có gì xảy ra. `<a>` ép trình duyệt đi mạng thật, tức là "thử lại".
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Không có kết nối mạng',
  description: 'Thiết bị của bạn đang mất kết nối. Nội dung sẽ trở lại khi có mạng.',
  // Trang kỹ thuật, không có ý định tìm kiếm nào. follow:false luôn vì nó
  // không nằm trong luồng nội dung — khác các trang noindex khác của site.
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center text-foreground"
    >
      <div className="max-w-md">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Mất kết nối
        </p>

        <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">Chưa có mạng để tải trang này</h1>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Thiết bị của bạn đang ngoại tuyến. Kiểm tra lại Wi-Fi hoặc dữ liệu di động, rồi thử mở lại
          — những gì bạn đã lưu vẫn còn nguyên.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {/* `href=""` giải về CHÍNH URL hiện tại ⇒ bấm là tải lại đúng trang
              người dùng đang lỡ dở. Service worker phục vụ trang này TẠI địa
              chỉ bị lỗi (không chuyển hướng sang /offline), nên URL còn nguyên
              và đây mới là "thử lại" đúng nghĩa — trước đó nút này về trang
              chủ, tức là bỏ mất chỗ người ta đang muốn xem.
              KHÔNG dùng <Link>: lúc mất mạng router không lấy được payload RSC
              nên bấm xong không có gì xảy ra. */}
          <a
            href=""
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Thử lại
          </a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
              cùng lý do: phải là điều hướng thật của trình duyệt, không phải
              client-side routing. */}
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    </main>
  );
}
