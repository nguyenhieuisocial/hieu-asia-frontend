import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Thước Lỗ Ban online — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Thước Lỗ Ban',
    title: 'Thước',
    accent: 'Lỗ Ban',
    tagline:
      'Tra cung tốt – xấu theo kích thước (cm) cho cửa, bàn thờ, nội thất — nhập số là có ngay.',
  });
}
