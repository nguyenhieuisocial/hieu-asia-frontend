import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Xem tuổi khai trương / mở hàng — tính Tam Tai, xung Thái Tuế theo năm sinh — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Khai trương',
    title: 'Xem tuổi khai trương',
    accent: 'Tam Tai · xung Thái Tuế',
    tagline:
      'Năm này có hợp tuổi mở hàng không? Tính minh bạch từng bước theo năm sinh chủ — tham khảo, không phán số mệnh.',
  });
}
