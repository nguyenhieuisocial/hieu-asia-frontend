import Link from 'next/link';

export interface RelatedLink {
  href: string;
  label: string;
}

/**
 * Khối "Công cụ liên quan" dùng chung cho mọi trang công cụ — chuẩn hoá cross-link
 * + tự thêm link về hub /cong-cu để khép vòng khám phá (chống trang "mồ côi").
 */
export function RelatedTools({
  links,
  includeHub = true,
}: {
  links: RelatedLink[];
  includeHub?: boolean;
}) {
  const all = includeHub ? [...links, { href: '/cong-cu', label: 'Tất cả công cụ' }] : links;
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
