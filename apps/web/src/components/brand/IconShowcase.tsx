/**
 * IconShowcase — bộ icon thường dùng từ lucide-react, render với gold tint.
 */

import * as React from 'react';
import {
  Sparkles,
  Stars,
  Moon,
  Sun,
  Hand,
  HeartHandshake,
  ScrollText,
  Compass,
  Flame,
  Wind,
  Mountain,
  Droplet,
  TreePine,
  Hourglass,
  Lock,
  Unlock,
  Crown,
  Eye,
  Feather,
  Sigma,
  Target,
  Calendar,
  Clock,
  Gem,
} from 'lucide-react';

const ICONS = [
  { Icon: Sparkles, label: 'Sparkles', use: 'AI · highlight · premium' },
  { Icon: Stars, label: 'Stars', use: 'Tử Vi · chiêm tinh' },
  { Icon: Moon, label: 'Moon', use: 'Âm lịch · ban đêm' },
  { Icon: Sun, label: 'Sun', use: 'Dương lịch · ban ngày' },
  { Icon: Hand, label: 'Hand', use: 'Palm reading' },
  { Icon: HeartHandshake, label: 'HeartHandshake', use: 'Hợp tuổi · phối ngẫu' },
  { Icon: ScrollText, label: 'ScrollText', use: 'Báo cáo · lá số' },
  { Icon: Compass, label: 'Compass', use: 'Phong thuỷ · phương hướng' },
  { Icon: Flame, label: 'Flame', use: 'Hành Hoả' },
  { Icon: Wind, label: 'Wind', use: 'Hành Kim · khí' },
  { Icon: Mountain, label: 'Mountain', use: 'Hành Thổ' },
  { Icon: Droplet, label: 'Droplet', use: 'Hành Thuỷ' },
  { Icon: TreePine, label: 'TreePine', use: 'Hành Mộc' },
  { Icon: Hourglass, label: 'Hourglass', use: 'Đại vận · thời gian' },
  { Icon: Lock, label: 'Lock', use: 'Premium · khoá nội dung' },
  { Icon: Unlock, label: 'Unlock', use: 'Mở khoá thanh toán' },
  { Icon: Crown, label: 'Crown', use: 'Subscription · VIP' },
  { Icon: Eye, label: 'Eye', use: 'Trực giác · nhìn nhận' },
  { Icon: Feather, label: 'Feather', use: 'Lịch sử · viết tay' },
  { Icon: Sigma, label: 'Sigma', use: 'Thần số học · tính toán' },
  { Icon: Target, label: 'Target', use: 'Mục tiêu · hành động' },
  { Icon: Calendar, label: 'Calendar', use: 'Lịch vạn niên' },
  { Icon: Clock, label: 'Clock', use: 'Giờ sinh' },
  { Icon: Gem, label: 'Gem', use: 'Đá quý · phong thuỷ' },
];

export function IconShowcase() {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Stroke 1.5 · gold tint trên nền tối. Dùng từ <code className="rounded bg-gold/10 px-1 font-mono text-xs text-gold">lucide-react</code>.
        Không trộn icon set khác để giữ nhất quán đường nét.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {ICONS.map(({ Icon, label, use }) => (
          <div
            key={label}
            className="group flex flex-col items-start gap-2 rounded-lg border border-gold/15 bg-card/40 p-4 transition hover:border-gold/40"
          >
            <Icon
              className="h-7 w-7 text-gold transition group-hover:scale-110"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div className="text-xs font-medium text-foreground">{label}</div>
            <div className="text-[10px] text-muted-foreground">{use}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
