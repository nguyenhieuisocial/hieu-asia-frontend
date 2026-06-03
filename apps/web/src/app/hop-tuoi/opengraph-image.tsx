import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Hợp tuổi cưới hỏi, làm ăn, sinh con — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Hợp tuổi',
    title: 'Hợp tuổi',
    accent: 'cưới · làm ăn',
    tagline:
      'Xem tuổi hợp cho cưới hỏi, làm ăn, sinh con — phân tích để tham khảo, không phán cứng.',
  });
}
