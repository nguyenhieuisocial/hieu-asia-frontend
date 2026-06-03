import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Ngày kiêng kỵ — Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Lịch Vạn Niên',
    title: 'Ngày',
    accent: 'kiêng kỵ',
    tagline:
      'Tra ngày Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật theo âm lịch. Tham khảo theo phong tục, không bói toán.',
  });
}
