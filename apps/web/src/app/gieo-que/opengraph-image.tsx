import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Gieo Quẻ Kinh Dịch — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Kinh Dịch',
    title: 'Gieo Quẻ',
    accent: 'Kinh Dịch',
    tagline: 'Bốc quẻ hỏi việc theo phép 3 đồng xu — quẻ chính, quẻ biến và lời gợi mở để bạn tự quyết.',
  });
}
