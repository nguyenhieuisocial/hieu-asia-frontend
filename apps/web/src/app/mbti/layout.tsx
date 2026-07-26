import type { Metadata } from 'next';

/**
 * Wave 60.95.u P1 (vault 130 P1) — /mbti audience route metadata.
 *
 * Mirrors the OG/twitter/canonical pattern established in Wave 60.95.k
 * (commit 5b8b058) for audience surfaces: root-layout openGraph is replaced
 * (not merged) when a route declares its own openGraph block, so we re-declare
 * `images` here or social-card previews render blank.
 */
export const metadata: Metadata = {
  title: 'MBTI — 16 kiểu tâm trí',
  // ⚠️ MÔ TẢ NÀY KHÔNG RA TRANG: `page.tsx` có `generateMetadata` nên nó ĐÈ
  // toàn bộ metadata của layout. Muốn đổi mô tả /mbti thì sửa `MBTI_META_DESC`
  // trong `page.tsx`. Giữ ở đây làm mặc định cho route con nào không tự khai.
  // ⚠️ VÌ SAO CHỐT CANH KHÔNG BẮT ĐƯỢC: `seo-guard` chỉ đọc HTML TĨNH do
  // `next build` sinh ra. Trang này là trang công cụ (render phía client) nên
  // không có mặt trong tập đó ⇒ nó lọt lưới suốt nhiều đợt rà. Trang công cụ
  // khác cũng vậy — đừng kết luận "guard xanh = toàn site sạch".
  description:
    'MBTI: 16 kiểu tâm trí trên 4 trục E/I · N/S · T/F · J/P — ngôn ngữ tự nhận diện thiên hướng, không nhãn dán, không phán số phận.',
  alternates: { canonical: 'https://hieu.asia/mbti' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'MBTI — 16 kiểu tâm trí',
    description:
      '4 trục, 16 kiểu — một ngôn ngữ để gọi tên thiên hướng nội tại, không dán nhãn số phận.',
    url: 'https://hieu.asia/mbti',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — MBTI: 16 kiểu, 4 trục, một bản đồ tâm trí',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MBTI — 16 kiểu tâm trí',
    description:
      '4 trục, 16 kiểu — một ngôn ngữ để gọi tên thiên hướng nội tại, không dán nhãn số phận.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — MBTI: 16 kiểu, 4 trục, một bản đồ tâm trí',
      },
    ],
  },
};

export default function MbtiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
