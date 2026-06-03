import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Trắc nghiệm Enneagram — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Enneagram',
    title: 'Trắc nghiệm',
    accent: 'Enneagram',
    tagline: '9 nhóm tính cách — khám phá động cơ cốt lõi, nỗi sợ nền tảng và hướng phát triển của bạn.',
  });
}
