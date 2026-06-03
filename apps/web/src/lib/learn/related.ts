// Related-lens cards for the /learn editorial template.
//
// The home flagship catalog (lib/catalog/lenses.ts) only holds the 5 flagship
// lenses and points some hrefs at the TOOL (e.g. /mbti) rather than the /learn
// page. For the learn footer we want every learn topic to cross-link to the
// OTHER learn topics, so this is a small learn-scoped registry keyed by slug.
// Kept separate from the flagship catalog to avoid changing its href contract.

import type { LearnRelatedLens } from '@/components/learn/LearnArticle';

interface LearnTopic extends LearnRelatedLens {
  slug: string;
}

const LEARN_TOPICS: readonly LearnTopic[] = [
  { slug: 'tu-vi', eyebrow: 'ĐÔNG PHƯƠNG', name: 'Tử Vi', href: '/learn/tu-vi' },
  { slug: 'bat-tu', eyebrow: 'NGŨ HÀNH', name: 'Bát Tự', href: '/learn/bat-tu' },
  { slug: 'mbti', eyebrow: 'TÂM LÝ HỌC', name: 'MBTI', href: '/learn/mbti' },
  { slug: 'big-five', eyebrow: 'OCEAN', name: 'Big Five', href: '/learn/big-five' },
  { slug: 'than-so-hoc', eyebrow: 'PYTHAGORAS', name: 'Thần Số Học', href: '/learn/than-so-hoc' },
  { slug: 'palm', eyebrow: 'XEM TƯỚNG', name: 'Xem chỉ tay', href: '/learn/palm' },
];

/**
 * Cards for every learn topic except `currentSlug`, capped at `limit`
 * (default 4 — matches the 4-up grid in LearnArticle).
 */
export function relatedLearnLenses(
  currentSlug: string,
  limit = 4,
): LearnRelatedLens[] {
  return LEARN_TOPICS.filter((t) => t.slug !== currentSlug)
    .slice(0, limit)
    .map(({ eyebrow, name, href }) => ({ eyebrow, name, href }));
}
