import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Sinh con theo năm — đối chiếu tuổi bố mẹ & mệnh của bé — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Sinh con',
    title: 'Sinh con theo năm —',
    accent: 'hợp tuổi bố mẹ',
    tagline:
      'Mệnh & con giáp của bé theo năm sinh + đối chiếu tuổi bố mẹ theo Can Chi. Tham khảo phong tục, không phán định.',
  });
}
