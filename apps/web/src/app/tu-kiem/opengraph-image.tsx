import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Đừng tin mù — bài tự kiểm 1 phút | hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Không bói mù',
    title: 'Đừng tin',
    accent: 'mù',
    tagline: 'Vì sao lời bói luôn thấy "đúng ghê" — và cách không bị lừa. Bài tự kiểm 1 phút.',
  });
}
