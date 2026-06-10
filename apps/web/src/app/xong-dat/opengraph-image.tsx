import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Tuổi xông đất Tết 2027 (Đinh Mùi) — gợi ý theo tam hợp & ngũ hành — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Tết 2027',
    title: 'Tuổi xông đất Tết Đinh Mùi —',
    accent: 'gợi ý minh bạch',
    tagline:
      'Chấm theo tam hợp, lục hợp với chi năm & gia chủ và ngũ hành tương sinh. Tham khảo phong tục, không phán định.',
  });
}
