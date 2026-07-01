/**
 * Centralized, typed JSON-LD builders for hieu.asia.
 *
 * Replaces copy-pasted inline schema across ~56 pages with one DRY source.
 * Builders return plain objects (no `@context` except where they are emitted as
 * a top-level node) so callers can compose them into a single `@graph`.
 *
 * Pure data — no React, no side effects. Render via `<JsonLd data={...} />`.
 */

import {
  BASE_URL,
  SITE_NAME,
  SITE_LOCALE,
  ORG_DESCRIPTION,
  LOGO_PATH,
  SOCIAL_LINKS,
  CONTACT_EMAIL,
  ORG_ID,
  WEBSITE_ID,
  abs,
} from './constants';

export type JsonLdNode = Record<string, unknown>;

/** Canonical Organization node (referenced elsewhere by `@id`). */
export function organization(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: abs(LOGO_PATH),
    },
    description: ORG_DESCRIPTION,
    // Expertise domains — helps AI search engines disambiguate hieu.asia as a
    // subject-matter entity (entity authority is a leading AI-citation signal).
    knowsAbout: [
      'Tử Vi Đẩu Số',
      'Bát Tự (Tứ Trụ)',
      'Tarot',
      'Thần số học',
      'Chiêm tinh học phương Tây',
      'Kinh Dịch',
      'Trắc nghiệm tính cách (MBTI, DISC, Big Five, Enneagram)',
    ],
    sameAs: SOCIAL_LINKS,
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_EMAIL,
      contactType: 'customer support',
      availableLanguage: ['vi', 'en'],
    },
  };
}

/** Canonical WebSite node. `SearchAction` omitted until a public search exists. */
export function website(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: BASE_URL,
    name: SITE_NAME,
    inLanguage: SITE_LOCALE,
    publisher: { '@id': ORG_ID },
  };
}

/**
 * Site-wide `@graph` (Organization + WebSite) for injection once at a layout
 * level. Emitted as a single top-level node with `@context`.
 */
export function siteGraph(): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@graph': [organization(), website()],
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Site-relative path or absolute URL. */
  url: string;
}

export function breadcrumb(items: BreadcrumbItem[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
}

export interface ArticleInput {
  headline: string;
  description?: string;
  /** Site-relative path or absolute URL of the canonical page. */
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  /** Optional named author; defaults to the Organization. */
  authorName?: string;
  /** Use 'TechArticle' for methodology/algorithm pages. */
  type?: 'Article' | 'TechArticle';
}

export function article(input: ArticleInput): JsonLdNode {
  const url = abs(input.url);
  return {
    '@context': 'https://schema.org',
    '@type': input.type ?? 'Article',
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: abs(input.image) } : { image: abs(LOGO_PATH) }),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified
      ? { dateModified: input.dateModified }
      : input.datePublished
        ? { dateModified: input.datePublished }
        : {}),
    inLanguage: SITE_LOCALE,
    author: input.authorName
      ? { '@type': 'Person', name: input.authorName }
      : { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export function faqPage(items: FaqItem[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export interface ItemListEntry {
  name: string;
  /** Site-relative hoặc tuyệt đối; sẽ được abs() chuẩn hoá. */
  url: string;
}

/**
 * ItemList cho các trang index bách khoa (vd 64 quẻ Kinh Dịch, 12 số chủ đạo
 * thần số, 12 giờ hoàng đạo). Báo cho AI search/Google đây là danh sách có cấu
 * trúc → dễ được trích khi user hỏi "có bao nhiêu...". Phát kèm webPage +
 * breadcrumb của trang hub.
 */
export function itemList(items: ItemListEntry[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: abs(item.url),
    })),
  };
}

export interface WebPageInput {
  name: string;
  description?: string;
  url: string;
}

export function webPage(input: WebPageInput): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    url: abs(input.url),
    inLanguage: SITE_LOCALE,
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export interface OfferInput {
  /** Nhãn bậc giá, khớp text hiển thị trên trang (chống cloaking). */
  name: string;
  /** Giá theo đồng VND (số nguyên). */
  priceVnd: number;
  /** Đường dẫn checkout/landing của bậc này (site-relative hoặc tuyệt đối). */
  url: string;
}

export interface ProductInput {
  name: string;
  description: string;
  /** URL trang bán chuẩn (canonical). */
  url: string;
  /** Mỗi bậc mua được → một Offer. */
  offers: OfferInput[];
  /** Ảnh đại diện; mặc định logo site. */
  image?: string;
}

/**
 * Product + Offer cho trang bán (vd /pricing). Mỗi bậc giá → một `Offer`
 * (price + priceCurrency VND) → Google/AI search đọc được bảng giá máy-đọc-được
 * (đủ điều kiện price rich result khi trang lên hạng) thay vì chỉ thấy chữ.
 * `offers` thoả điều kiện Product hợp lệ nên không cần review/rating.
 */
export function product(input: ProductInput): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    image: abs(input.image ?? LOGO_PATH),
    brand: { '@type': 'Brand', name: SITE_NAME },
    url: abs(input.url),
    offers: input.offers.map((o) => ({
      '@type': 'Offer',
      name: o.name,
      price: String(o.priceVnd),
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: abs(o.url),
    })),
  };
}
