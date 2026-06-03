import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Xem ngày tốt theo mục đích — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Lịch Vạn Niên',
    title: 'Xem ngày',
    accent: 'tốt',
    tagline:
      'Chọn ngày đẹp cho cưới hỏi, khai trương, động thổ, nhập trạch… — chấm điểm theo Hoàng đạo, trực ngày, sao tốt xấu. Tham khảo theo phong tục.',
  });
}
