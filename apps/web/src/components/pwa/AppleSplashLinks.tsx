/**
 * Khai `apple-touch-startup-image` cho iOS — bỏ màn trắng lúc mở app đã cài.
 *
 * Là server component, chỉ trả về thẻ `<link>`; Next tự nâng chúng lên `<head>`.
 * Không dùng Metadata API vì API đó không có trường cho startup image.
 *
 * Danh sách máy nằm ở `@/lib/pwa/apple-splash-screens` — thêm/bớt ở đó, ảnh
 * sinh bằng `pnpm --filter web gen:splash`. Máy không khớp dòng nào thì không
 * có splash, tức quay về đúng hành vi cũ (màn trắng) chứ không vỡ gì.
 */

import {
  APPLE_SPLASH_SCREENS,
  duongDanSplash,
  mediaQuerySplash,
  tenFileSplash,
} from '@/lib/pwa/apple-splash-screens';

export function AppleSplashLinks() {
  return (
    <>
      {APPLE_SPLASH_SCREENS.map((man) => (
        <link
          key={tenFileSplash(man)}
          rel="apple-touch-startup-image"
          media={mediaQuerySplash(man)}
          href={duongDanSplash(man)}
        />
      ))}
    </>
  );
}
