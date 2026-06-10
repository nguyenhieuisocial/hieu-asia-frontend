import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Xem tuổi làm nhà — tính Kim Lâu, Hoang Ốc, Tam Tai theo năm sinh — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Làm nhà',
    title: 'Xem tuổi làm nhà',
    accent: 'Kim Lâu · Hoang Ốc · Tam Tai',
    tagline:
      'Năm này có được tuổi khởi công không? Tính minh bạch từng bước theo năm sinh — tham khảo, không phán số mệnh.',
  });
}
