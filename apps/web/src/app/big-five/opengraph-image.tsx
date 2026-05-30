import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Trắc nghiệm Big Five (OCEAN) — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Trắc nghiệm tính cách',
    title: 'Big Five',
    accent: '(OCEAN)',
    tagline: 'Trắc nghiệm 5 chiều tính cách có cơ sở khoa học vững nhất — kết quả tức thì, miễn phí.',
  });
}
