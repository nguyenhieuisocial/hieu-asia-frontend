/**
 * LearnArticle — public entry point for the shared /learn editorial template.
 *
 * This is a thin SERVER wrapper around <LearnArticleView> (the interactive client
 * component that holds all the chrome: reading-progress bar, scroll-spy TOC,
 * sections, CTA, related lenses). Its only job is to give each section's
 * element-valued `heading` / `children` a stable `key` BEFORE they cross the
 * server → client boundary into the view.
 *
 * Why: the /learn pages are Server Components that pass `sections` — an array
 * whose items carry React elements — as a prop to the client view. React 19's
 * Flight serializer validates element arrays for keys, so unkeyed section bodies
 * logged a dev-only "Each child in a list should have a unique key prop" warning
 * on every /learn page (harmless in production, but noisy in the console). Keying
 * here, once, fixes it for all pages without touching any page or changing the UI.
 *
 * The public API (LearnArticleProps + the section/breadcrumb/lens/CTA types) is
 * unchanged and re-exported below, so callers keep importing from
 * '@/components/learn/LearnArticle'.
 */

import * as React from 'react';
import { LearnArticleView } from './LearnArticleView';
import type { LearnArticleProps, LearnSection } from './LearnArticleView';

export type {
  LearnSection,
  LearnBreadcrumbItem,
  LearnRelatedLens,
  LearnTryCta,
  LearnArticleProps,
} from './LearnArticleView';

/**
 * Give a section field a stable `key` when it is a React element. Strings,
 * numbers and null don't trigger the list-key warning, so they pass through
 * untouched.
 */
function withKey(node: React.ReactNode, key: string): React.ReactNode {
  return React.isValidElement(node) ? React.cloneElement(node, { key }) : node;
}

export function LearnArticle(props: LearnArticleProps) {
  const sections: LearnSection[] = props.sections.map((s) => ({
    ...s,
    heading: withKey(s.heading, `${s.id}-heading`),
    children: withKey(s.children, `${s.id}-body`),
  }));

  return <LearnArticleView {...props} sections={sections} />;
}
