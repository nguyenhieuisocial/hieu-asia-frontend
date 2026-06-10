import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'So sánh lăng kính — MBTI, Big Five, Tử Vi, Bát Tự — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · So sánh',
    title: 'So sánh',
    accent: 'lăng kính',
    tagline:
      'Đặt hai hệ cạnh nhau — MBTI vs Big Five, Tử Vi vs Bát Tự… Thấy rõ mỗi lăng kính soi sáng điều gì và nên chọn cái nào.',
  });
}
