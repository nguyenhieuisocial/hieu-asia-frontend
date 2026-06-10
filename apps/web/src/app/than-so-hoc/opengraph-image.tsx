import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Thần Số Học miễn phí — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Thần Số Học',
    title: 'Thần',
    accent: 'Số Học',
    tagline:
      'Tính số chủ đạo, số linh hồn, số vận mệnh từ ngày sinh & tên — miễn phí, kết quả tức thì.',
  });
}
