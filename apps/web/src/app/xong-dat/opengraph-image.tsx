import { toolOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { yearProfile } from '@/lib/sinh-con';
import { defaultTargetYear } from '@/lib/xong-dat';

// `alt` bắt buộc là hằng số cấp module (Next đọc tĩnh) nên KHÔNG được mang năm:
// nó sẽ kẹt lại đúng như hằng số vừa dẹp. Năm và can chi nằm trong ảnh — phần
// đó dựng lúc render bên dưới.
export const alt = 'Tuổi xông đất Tết — gợi ý theo tam hợp & ngũ hành — hieu.asia';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Ảnh cũng phải dựng lại theo ngày, nếu không năm bị nướng vào ảnh từ lúc build.
export const revalidate = 86400;

export default function Image() {
  const y = defaultTargetYear();
  return toolOgImage({
    eyebrow: `hieu.asia · Tết ${y}`,
    title: `Tuổi xông đất Tết ${yearProfile(y)!.canChi} —`,
    accent: 'gợi ý minh bạch',
    tagline:
      'Chấm theo tam hợp, lục hợp với chi năm & gia chủ và ngũ hành tương sinh. Tham khảo phong tục, không phán định.',
  });
}
