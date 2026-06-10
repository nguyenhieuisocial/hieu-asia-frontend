import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Xem tuổi cưới — tính Kim Lâu, Tam Tai theo năm sinh — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Cưới hỏi',
    title: 'Xem tuổi cưới',
    accent: 'Kim Lâu · Tam Tai',
    tagline:
      'Năm này có thuận để cưới không? Tính minh bạch từng bước theo năm sinh — tham khảo, không phán số mệnh.',
  });
}
