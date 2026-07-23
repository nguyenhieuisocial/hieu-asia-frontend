import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Bát Tự — Tám chữ định hình bạn — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Bát Tự',
    title: 'Bát Tự —',
    accent: 'Tám chữ',
    tagline:
      'Luận Tứ Trụ từ ngày giờ sinh: tính cách, điểm mạnh và chu kỳ vận hạn — diễn giải AI, đối chiếu cổ thư.',
  });
}
