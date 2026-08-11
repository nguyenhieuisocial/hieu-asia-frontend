import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'hieu.asia — AI Human Analysis',
    short_name: 'hieu.asia',
    description: 'Tử Vi, MBTI, palm reading bằng AI - người bạn đồng hành để hiểu chính mình.',
    start_url: '/',
    display: 'standalone',
    // 10/08/2026 — chỉnh #0F0F12 → #0a0a0c cho khớp ĐÚNG màu nền của
    // `icon-maskable-512.png`. Không ảnh icon nào có kênh alpha, nên splash
    // (cả Android lẫn iOS) là "dán ô vuông icon lên background_color" — lệch
    // màu là hiện một ô vuông mờ giữa màn hình. Hai màu này đều gần như đen,
    // đổi qua lại mắt không phân biệt được; cái được là hết ô vuông.
    // Xem `src/lib/pwa/apple-splash-screens.ts` (SPLASH_BACKGROUND).
    //
    // 11/08/2026 — sửa TẬN GỐC bộ ảnh icon (icon-512/192, apple-icon,
    // icon-maskable-512/192, favicon.ico): nguồn gốc bị xuất trên canvas
    // TRẮNG đặc thay vì cắt sát/nền đúng màu, để lộ viền/góc trắng thật trên
    // màn hình chính khi cài app (thấy bằng mắt, không phải suy đoán). Đã
    // flood-fill vùng trắng liền-góc → #0a0a0c (giữ nguyên glyph vàng, không
    // đụng gì khác) rồi build lại 2 bản maskable từ nguồn sạch. Cùng bộ ảnh
    // dùng chung với apps/admin, apps/miniapp-telegram — đã sửa đồng bộ cả 3.
    background_color: '#0a0a0c',
    theme_color: '#B8923D',
    orientation: 'portrait',
    lang: 'vi',
    categories: ['lifestyle', 'productivity', 'education'],
    // 11/08/2026 — long-press icon trên Android / bấm-giữ trên desktop đã cài
    // giờ nhảy thẳng vào Tử Vi hôm nay, KHÔNG qua trang chủ trước. Trỏ đúng
    // route mà push notification hằng ngày đã dùng làm đích (xem `data.url`
    // mặc định trong `public/sw.js`, sự kiện 'push') — cùng một hành vi lõi,
    // chỉ khác lối vào. Không thêm mục nào khác: chưa có bằng chứng route thứ
    // hai đủ giá trị để chiếm chỗ trong menu rất hẹp này.
    shortcuts: [
      {
        name: 'Tử vi hôm nay',
        short_name: 'Hôm nay',
        url: '/tu-vi-hom-nay',
      },
    ],
    icons: [
      // Wave 57.4: static files. Previously '/icon' + '/apple-icon' were
      // Next.js ImageResponse code-gen routes (icon.tsx/apple-icon.tsx),
      // deleted in commit f945bed when founder-generated brand assets were
      // wired. Manifest now points at the static PNGs in /public/.
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      // Maskable variants — Android adaptive icons apply circular/squircle
      // mask via OS theme. Source has 20% safe-zone margin so edges don't get
      // cropped. Generated from the (now-fixed) icon-512.png via PIL (10%
      // padding each side onto a solid #0a0a0c canvas — see 11/08/2026 note
      // on `background_color` above for why "solid", not a blind paste).
      {
        src: '/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
