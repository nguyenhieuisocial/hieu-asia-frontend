import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Đặt tên con theo ngũ hành — tra mệnh & gợi ý tên — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Ngũ hành',
    title: 'Đặt tên con theo',
    accent: 'ngũ hành',
    tagline:
      'Tra mệnh ngũ hành của bé theo ngày sinh + gợi ý tên hợp mệnh. Gợi ý tham khảo theo phong tục, không bói toán.',
  });
}
