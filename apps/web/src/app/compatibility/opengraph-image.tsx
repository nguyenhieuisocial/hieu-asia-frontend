import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Hợp đôi 2 lá số — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Hợp đôi',
    title: 'Hợp đôi',
    accent: '2 lá số',
    tagline:
      'Vùng giao tiếp, điểm mạnh và cách điều chỉnh của hai người — không dán nhãn hợp/khắc.',
  });
}
