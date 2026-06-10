import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Cân Xương Đoán Số — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Cân Xương',
    title: 'Cân Xương',
    accent: 'Đoán Số',
    tagline:
      'Tính trọng lượng xương theo ngày giờ sinh và luận giải — một góc nhìn dân gian để tham khảo.',
  });
}
