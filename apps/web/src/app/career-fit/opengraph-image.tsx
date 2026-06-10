import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Career Fit — Nhóm công việc phù hợp — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Hướng nghiệp',
    title: 'Nhóm nghề',
    accent: 'phù hợp',
    tagline:
      'Khám phá nhóm công việc hợp với bạn dựa trên tính cách và lá số — gợi ý để tham khảo.',
  });
}
