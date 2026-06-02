import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const alt = 'Xem hợp nhóm & gia đình — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return toolOgImage({
    eyebrow: 'hieu.asia · Hoà hợp nhóm',
    title: 'Xem hợp cả nhóm',
    accent: 'gia đình',
    tagline: 'Thêm 3–6 người để xem điểm hoà hợp chung, từng cặp và gợi ý phối hợp — không dán nhãn hợp/khắc.',
  });
}
