import Link from 'next/link';
import { RELATED_TOOLS, type RelatedLink } from '@/lib/related-tools';

export type { RelatedLink };

/**
 * Khối "Công cụ liên quan" dùng chung cho mọi trang công cụ — chuẩn hoá cross-link
 * + tự thêm link về hub /cong-cu để khép vòng khám phá (chống trang "mồ côi").
 *
 * Dùng `links` để truyền trực tiếp, HOẶC `current` (route của trang) để tra sổ
 * đăng ký RELATED_TOOLS. Tự ẩn nếu không có link nào.
 */
export function RelatedTools({
  links,
  current,
  includeHub = true,
}: {
  links?: RelatedLink[];
  current?: string;
  includeHub?: boolean;
}) {
  const base = links ?? (current ? RELATED_TOOLS[current] : undefined) ?? [];
  if (base.length === 0) return null;
  const all = includeHub ? [...base, { href: '/cong-cu', label: 'Tất cả công cụ' }] : base;
  return (
    <nav aria-label="Công cụ liên quan" className="text-sm text-muted-foreground">
      Xem thêm:{' '}
      {all.map((l, i) => (
        <span key={l.href}>
          {i > 0 ? ' · ' : ''}
          <Link href={l.href} className="text-gold hover:underline">
            {l.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
