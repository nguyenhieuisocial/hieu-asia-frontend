import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Giờ hoàng đạo — tra giờ tốt trong ngày — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Lịch Vạn Niên',
    title: 'Giờ',
    accent: 'hoàng đạo',
    tagline:
      'Tra 6 giờ tốt trong ngày theo lịch pháp truyền thống — đổi theo từng ngày. Tham khảo, không bói toán.',
  });
}
