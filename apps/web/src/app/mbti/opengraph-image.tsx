import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'MBTI — 16 kiểu tâm trí — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · MBTI',
    title: 'MBTI —',
    accent: '16 kiểu',
    tagline:
      'Trắc nghiệm 16 kiểu tâm trí + diễn giải sâu: hiểu cách bạn nghĩ, quyết định và kết nối.',
  });
}
