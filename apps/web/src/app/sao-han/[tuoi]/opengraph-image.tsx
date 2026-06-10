import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Sao hạn theo tuổi (con giáp) — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Sao hạn',
    title: 'Sao hạn',
    accent: 'theo tuổi',
    tagline:
      'Sao chiếu mệnh năm nay cho từng con giáp — theo năm sinh, cả nam và nữ. Tham khảo theo phong tục, không bói toán.',
  });
}
