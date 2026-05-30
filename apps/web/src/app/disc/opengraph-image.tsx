import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Trắc nghiệm DiSC — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · DiSC',
    title: 'Trắc nghiệm',
    accent: 'DiSC',
    tagline: '4 phong cách hành vi D/i/S/C — hiểu cách bạn giao tiếp, làm việc và ra quyết định.',
  });
}
