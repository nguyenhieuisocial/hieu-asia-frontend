import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Tử vi tháng theo con giáp — tra can chi từng tháng — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Theo tháng',
    title: 'Tử vi tháng —',
    accent: 'tính từ can chi',
    tagline:
      'Trụ tháng theo tiết khí, hợp xung với chi tuổi, và những ngày đáng chú ý trong tháng. Tham khảo phong tục, không phán số mệnh.',
  });
}
