'use client';

/**
 * Wave 60.62.T1.2 — admin-side ProductTabs.
 *
 * Mirror of /apps/web/src/components/product/ProductTabs.tsx (Wave 60.58 T1.3)
 * adapted for admin. Used by /affiliates to fold 8 sibling routes into a
 * single tabbed surface (per vault 107 §5.2).
 *
 * Built on shared @hieu-asia/ui Tabs + Accordion exports (which wrap Radix
 * primitives) so the admin app doesn't need its own Radix dependencies.
 *
 * Responsive contract:
 *   - md+   → Tabs horizontal (border-bottom underline, gold active)
 *   - <md   → Accordion (collapsible, single-open by default)
 *
 * URL-state contract: callers pass `value` + `onValueChange` so the active
 * tab stays in sync with `?tab=<id>`. That keeps 308 redirects from legacy
 * sub-routes (e.g. /affiliates/promoters → /affiliates?tab=promoters)
 * landing on the right tab without flicker.
 */

import * as React from 'react';
import {
  Tabs,
  TabsContent,
  Accordion,
  AccordionContent,
  AccordionItem,
  cn,
} from '@hieu-asia/ui';
// Radix Tabs primitives — re-exposed via shared `Tabs` (which is
// `TabsPrimitive.Root`). We need the raw List/Trigger for the underline
// visual that differs from the shared TabsList button style.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TabsRoot = Tabs as React.ComponentType<any>;

export type ProductTab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  badge?: string;
};

export type ProductTabsProps = {
  tabs: ProductTab[];
  /** Controlled active tab id. */
  value: string;
  /** Push to router for `?tab=…` sync. */
  onValueChange: (id: string) => void;
  className?: string;
};

export function ProductTabs({
  tabs,
  value,
  onValueChange,
  className,
}: ProductTabsProps) {
  if (!tabs.length) return null;

  return (
    <div className={className}>
      {/* Desktop: horizontal tabs with underline */}
      <div className="hidden md:block">
        <TabsRoot value={value} onValueChange={onValueChange}>
          {/* Custom List — bypass shared TabsList rounded-button styling. */}
          <div
            role="tablist"
            aria-label="Mục affiliate"
            className="mb-6 flex flex-wrap gap-1 border-b border-gold/15"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={value === tab.id}
                tabIndex={value === tab.id ? 0 : -1}
                onClick={() => onValueChange(tab.id)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-3 font-sans text-sm font-medium transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                  value === tab.id
                    ? 'border-b-2 border-gold text-gold'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span className="ml-1 rounded-pill bg-gold/20 px-2 py-0.5 text-xs text-gold">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="focus-visible:outline-none"
            >
              {tab.content}
            </TabsContent>
          ))}
        </TabsRoot>
      </div>

      {/* Mobile: accordion (single-open, collapsible) */}
      <div className="md:hidden">
        <Accordion
          type="single"
          collapsible
          value={value}
          onValueChange={(v: string) => v && onValueChange(v)}
        >
          {tabs.map((tab) => (
            <AccordionItem key={tab.id} value={tab.id}>
              {/* Inline Header+Trigger to keep icon next to label without
                  forcing the shared component's auto-chevron layout. */}
              <button
                type="button"
                onClick={() => onValueChange(tab.id)}
                className={cn(
                  'flex w-full items-center justify-between py-4 font-sans text-sm font-medium text-foreground transition-colors duration-200',
                  'hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                )}
              >
                <span className="inline-flex items-center gap-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge ? (
                    <span className="ml-1 rounded-pill bg-gold/20 px-2 py-0.5 text-xs text-gold">
                      {tab.badge}
                    </span>
                  ) : null}
                </span>
                <span aria-hidden="true" className="text-muted-foreground">
                  {value === tab.id ? '−' : '+'}
                </span>
              </button>
              <AccordionContent>{tab.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
