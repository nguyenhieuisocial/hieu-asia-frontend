/**
 * PhotoDirection — 6 placeholder mockup mô tả phong cách ảnh.
 */

import * as React from 'react';
import { Moon, Hand, Mountain, Compass, ScrollText, Sparkles } from 'lucide-react';

const STYLES = [
  {
    Icon: Moon,
    title: 'Night sky · điện ảnh',
    description:
      'Bầu trời đêm sâu, nhiều sao li ti, lớp sương mờ vàng đồng. Góc rộng. Subject nhỏ, không gian lớn.',
    bgClass: 'from-purple-900 via-ink to-ink',
    accent: '#D4B25A',
  },
  {
    Icon: Hand,
    title: 'Bàn tay close-up',
    description:
      'Ánh sáng vàng ấm 3200K từ một phía. Đường chỉ tay rõ. Background bokeh tối. Macro 1:1.',
    bgClass: 'from-ink via-gold-900 to-ink',
    accent: '#B8923D',
  },
  {
    Icon: Mountain,
    title: 'Phong cảnh trầm',
    description:
      'Sương núi Sapa / Đà Lạt buổi sớm. Tông lạnh xanh-tím trầm + highlight vàng nhạt nơi mặt trời mọc.',
    bgClass: 'from-purple-900 via-jade-900 to-ink',
    accent: '#2D5F5A',
  },
  {
    Icon: Compass,
    title: 'Vật thể tâm linh',
    description:
      'La bàn đồng, đá thạch anh, lá bài. Đặt trên gỗ tối. Light source thấp, đổ shadow dài. Không over-styled.',
    bgClass: 'from-ink via-gold-800 to-ink',
    accent: '#917231',
  },
  {
    Icon: ScrollText,
    title: 'Tài liệu cổ',
    description:
      'Sách Hán Nôm, mực tàu, giấy dó. Texture rõ. Tông nâu kem. Crop chéo. Không sạch quá — giữ ngẫu nhiên.',
    bgClass: 'from-gold-900 via-ink to-purple-900',
    accent: '#E6CC8C',
  },
  {
    Icon: Sparkles,
    title: 'Portrait suy ngẫm',
    description:
      'Người Việt 25-45 tuổi, ánh nhìn trầm, không cười. Một bên mặt sáng, một bên tối. Không quá retouch.',
    bgClass: 'from-ink via-purple-900 to-ink',
    accent: '#3B2754',
  },
];

const RULES = [
  'Tông màu chủ đạo: đen than + vàng đồng. Tím trầm làm chiều sâu.',
  'Tránh: cosplay thầy bói, bùa chú rẻ tiền, prop màu rực rỡ.',
  'Light: tự nhiên, nhiệt độ 3200-4000K, single source.',
  'Subject: nhỏ trong khung. Để không gian thở.',
  'Post: không HDR mạnh, giữ shadow sâu, không lift đen.',
];

export function PhotoDirection() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STYLES.map(({ Icon, title, description, bgClass, accent }) => (
          <div
            key={title}
            className={`relative flex h-56 flex-col justify-end overflow-hidden rounded-lg border border-gold/15 bg-gradient-to-br p-4 ${bgClass}`}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 30% 20%, ${accent}40, transparent 50%)`,
              }}
              aria-hidden="true"
            />
            <Icon
              className="absolute right-4 top-4 h-6 w-6 text-cream/40"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div className="relative">
              <div
                className="font-heading text-sm font-semibold text-cream"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
              >
                {title}
              </div>
              <p
                className="mt-1 text-[11px] leading-relaxed text-cream/85"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
              >
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-gold/15 bg-card/40 p-5">
        <h4 className="font-heading text-sm font-semibold text-gold">
          Nguyên tắc bắt buộc
        </h4>
        <ul className="mt-3 space-y-1.5 text-sm text-foreground/80">
          {RULES.map((rule) => (
            <li key={rule} className="flex gap-2">
              <span className="text-gold">·</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
