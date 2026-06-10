import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Xem sao hạn — sao chiếu mệnh theo tuổi — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Lịch Vạn Niên',
    title: 'Xem',
    accent: 'sao hạn',
    tagline:
      'Tra sao chiếu mệnh (Cửu Diệu) theo tuổi và giới tính — La Hầu, Kế Đô, Thái Bạch, Thái Dương… Tham khảo theo phong tục, không bói toán.',
  });
}
