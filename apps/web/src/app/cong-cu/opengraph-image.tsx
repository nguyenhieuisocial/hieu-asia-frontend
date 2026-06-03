import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Tất cả công cụ — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Công cụ',
    title: 'Tất cả',
    accent: 'công cụ',
    tagline:
      'Tử Vi, Bát Tự, MBTI, Big Five, DISC, Xem tướng, Lịch vạn niên… tất cả trong một nơi.',
  });
}
