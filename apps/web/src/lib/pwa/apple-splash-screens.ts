/**
 * Danh sách màn hình khởi động (splash) cho iOS — NGUỒN DUY NHẤT.
 *
 * VÌ SAO PHẢI LIỆT KÊ TAY: Android tự dựng splash từ `background_color` + icon
 * trong manifest. iOS thì KHÔNG — Safari không đọc phần đó của manifest, nên
 * thiếu `apple-touch-startup-image` là mở app thấy màn TRẮNG (~1s) rồi mới có
 * nội dung. Cách duy nhất là khai sẵn một ảnh cho từng cỡ màn hình, kèm media
 * query khớp đúng thiết bị. Kiểm lại 10/08/2026: iOS 17/18 vẫn vậy.
 *
 * ⚠️ DANH SÁCH NÀY SẼ CŨ. Mỗi đời iPhone mới ra là thêm một cỡ; thiết bị không
 * khớp dòng nào thì đơn giản là không có splash (quay về màn trắng như trước —
 * KHÔNG vỡ gì). Thêm máy mới = thêm ĐÚNG MỘT DÒNG ở đây rồi chạy lại
 * `pnpm --filter web gen:splash`; component và script đều đọc từ đây.
 *
 * Chỉ khai CHÂN DUNG: manifest đã chốt `orientation: portrait` nên app không
 * xoay ngang, khai landscape là sinh gấp đôi ảnh cho thứ không bao giờ hiện.
 *
 * Số đo là CSS pixel (`device-width`/`device-height`) + tỉ lệ điểm ảnh; ảnh
 * thật có kích thước = css × dpr.
 */

export type AppleSplashScreen = {
  /** device-width theo CSS pixel */
  readonly width: number;
  /** device-height theo CSS pixel */
  readonly height: number;
  /** -webkit-device-pixel-ratio */
  readonly dpr: number;
  /** Máy nào dùng cỡ này — để người sau biết có còn cần giữ không. */
  readonly may: string;
};

export const APPLE_SPLASH_SCREENS: readonly AppleSplashScreen[] = [
  // ── iPhone ──
  { width: 375, height: 667, dpr: 2, may: 'iPhone SE (2/3), 8' },
  { width: 414, height: 736, dpr: 3, may: 'iPhone 8 Plus' },
  { width: 375, height: 812, dpr: 3, may: 'iPhone X, XS, 11 Pro, 12 mini, 13 mini' },
  { width: 414, height: 896, dpr: 2, may: 'iPhone XR, 11' },
  { width: 414, height: 896, dpr: 3, may: 'iPhone XS Max, 11 Pro Max' },
  { width: 390, height: 844, dpr: 3, may: 'iPhone 12, 12 Pro, 13, 13 Pro, 14' },
  { width: 428, height: 926, dpr: 3, may: 'iPhone 12 Pro Max, 13 Pro Max, 14 Plus' },
  { width: 393, height: 852, dpr: 3, may: 'iPhone 14 Pro, 15, 15 Pro, 16' },
  { width: 430, height: 932, dpr: 3, may: 'iPhone 14 Pro Max, 15 Plus, 15 Pro Max, 16 Plus' },
  { width: 402, height: 874, dpr: 3, may: 'iPhone 16 Pro' },
  { width: 440, height: 956, dpr: 3, may: 'iPhone 16 Pro Max' },

  // ── iPad ── (ít người dùng hơn nhưng cùng một chi phí: một dòng + một ảnh)
  { width: 768, height: 1024, dpr: 2, may: 'iPad 9.7", iPad mini (cũ), iPad Air (cũ)' },
  { width: 744, height: 1133, dpr: 2, may: 'iPad mini 6' },
  { width: 810, height: 1080, dpr: 2, may: 'iPad 10.2"' },
  { width: 820, height: 1180, dpr: 2, may: 'iPad Air 10.9"' },
  { width: 834, height: 1112, dpr: 2, may: 'iPad Pro 10.5"' },
  { width: 834, height: 1194, dpr: 2, may: 'iPad Pro 11"' },
  { width: 1024, height: 1366, dpr: 2, may: 'iPad Pro 12.9"' },
];

/**
 * Ảnh logo dùng để dựng splash.
 *
 * ⚠️ PHẢI là bản `maskable`, KHÔNG phải `icon-512.png`. Bản thường có nền
 * TRẮNG đặc (đã đo: góc = #fefdff, ảnh 3 kênh, không có alpha) nên ghép lên
 * nền tối sẽ hiện một Ô VUÔNG TRẮNG giữa màn hình. Bản maskable có nền
 * #0a0a0c trùng với nền splash nên ghép vào là liền mạch.
 */
export const SPLASH_LOGO_SOURCE = 'icon-maskable-512.png';

/**
 * Màu nền splash — PHẢI trùng đúng màu nền của `SPLASH_LOGO_SOURCE`.
 *
 * Không có ảnh logo nào ở đây trong suốt cả (cả ba PNG icon đều 3 kênh, không
 * alpha), nên "ghép logo lên nền" thực chất là dán một ô vuông đặc. Chỉ khi
 * hai màu trùng KHÍT thì ô vuông mới vô hình. Script sinh ảnh có chốt kiểm:
 * lệch màu là dừng, không sinh ra ảnh hỏng trong im lặng.
 *
 * Đây cũng là `background_color` của manifest (đã chỉnh cho khớp 10/08/2026 —
 * trước đó manifest ghi #0F0F12, lệch với icon nên splash Android cũng dính
 * đúng lỗi ô vuông mờ này).
 */
export const SPLASH_BACKGROUND = '#0a0a0c';

/**
 * Cạnh ô logo, tính theo cạnh NGẮN của màn hình.
 *
 * 0.40 chứ không phải 0.32 vì bản maskable đã tự chừa ~20% safe-zone mỗi bên —
 * phần logo NHÌN THẤY chỉ chiếm ~80% ô, nên 0.40 × 0.8 ≈ 0.32 cạnh ngắn, đúng
 * cỡ mong muốn.
 */
export const SPLASH_LOGO_RATIO = 0.4;

/** Tên file ảnh cho một cỡ. Script sinh ảnh và component khai link cùng dùng hàm này. */
export function tenFileSplash({ width, height, dpr }: AppleSplashScreen): string {
  return `apple-splash-${width}x${height}@${dpr}x.png`;
}

/** Media query để iOS chọn đúng ảnh cho máy đang chạy. */
export function mediaQuerySplash({ width, height, dpr }: AppleSplashScreen): string {
  return (
    `(device-width: ${width}px) and (device-height: ${height}px) ` +
    `and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: portrait)`
  );
}
