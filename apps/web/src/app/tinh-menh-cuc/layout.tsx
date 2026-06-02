// layout.tsx re-exports metadata from page.tsx so we don't have to move it,
// and adds JSON-LD structured data that the server-component page.tsx can't
// do inline (the metadata export is already there and works; this just adds LD).

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Tính Mệnh Cục: cung Mệnh, cung Thân, cục, âm dương',
  description: 'Tra cứu miễn phí cung Mệnh, cung Thân, Cục (Mộc/Hỏa/Thổ/Kim/Thủy) và âm dương theo ngày–giờ sinh. Bước đầu để hiểu lá số Tử Vi.',
  url: 'https://hieu.asia/tinh-menh-cuc',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const TOOL_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Tính Mệnh Cục',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  url: 'https://hieu.asia/tinh-menh-cuc',
  inLanguage: 'vi-VN',
  description: 'Tra cứu cung Mệnh, cung Thân, Ngũ Hành Cục và âm dương theo ngày–giờ sinh — bước đầu để đọc lá số Tử Vi. Miễn phí, kết quả tức thì.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
  publisher: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Tính Mệnh Cục', item: 'https://hieu.asia/tinh-menh-cuc' },
  ],
};

export default function TinhMenhCucLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOL_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }} />
      {children}
    </>
  );
}
