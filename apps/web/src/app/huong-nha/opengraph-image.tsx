import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Xem hướng nhà hợp tuổi — Bát Trạch theo cung phi — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Phong thủy',
    title: 'Xem hướng nhà',
    accent: 'hợp tuổi',
    tagline:
      'Cung phi + 4 hướng tốt / 4 hướng tránh theo Bát Trạch. Tính minh bạch, tham khảo theo phong tục — không phán giàu nghèo.',
  });
}
