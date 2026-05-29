'use client';

/**
 * Wave 60.58 T1.3 — shared product tab navigation.
 *
 * Replaces ad-hoc hand-rolled `<nav role="tablist">` + parallel mobile
 * accordion duplicates across /reading/[id]/report (and forthcoming /account
 * Wave 60.59). One source of truth keeps active-state, keyboard a11y, and
 * editorial styling consistent.
 *
 * Responsive contract:
 *   - md+   → Radix Tabs horizontal (border-bottom underline, gold active)
 *   - <md   → Radix Accordion (collapsible, single-open by default)
 *
 * Each tab is rendered in BOTH the desktop tablist and the mobile accordion —
 * the `hidden md:block` / `md:hidden` toggles ensure only one set is visible
 * per viewport, so consumers only pass `tabs` once.
 *
 * Use `defaultActive` to seed initial selection (default: first tab id).
 *
 * Wave 64.x — optional controlled mode: pass `value` + `onValueChange` to
 * drive the active section externally (e.g. a floating table-of-contents).
 * Omitting them preserves the original uncontrolled behavior byte-for-byte.
 */

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@hieu-asia/ui';

export type ProductTab = {
  /** Stable identifier — used as Radix value + DOM key. */
  id: string;
  /** Visible tab label (vi-VN). */
  label: string;
  /** Optional leading icon (typically a 16px lucide icon). */
  icon?: React.ReactNode;
  /** Panel content rendered when this tab is active / accordion item is open. */
  content: React.ReactNode;
  /** Optional pill badge after the label (e.g. "MỚI", "BETA"). */
  badge?: string;
};

export type ProductTabsProps = {
  tabs: ProductTab[];
  /** Initial active tab id. Defaults to first tab. */
  defaultActive?: string;
  className?: string;
  /**
   * Controlled active tab id. When provided, ProductTabs becomes controlled
   * (both the desktop Tabs and the mobile Accordion follow `value`), enabling
   * external navigation such as a floating table-of-contents. Omit for the
   * existing uncontrolled behavior.
   */
  value?: string;
  /** Called with the new active id when controlled. */
  onValueChange?: (id: string) => void;
};

export function ProductTabs({
  tabs,
  defaultActive,
  className,
  value,
  onValueChange,
}: ProductTabsProps) {
  const active = defaultActive ?? tabs[0]?.id;
  const isControlled = value !== undefined;

  if (!tabs.length || !active) return null;

  // Tabs require exactly one active value; fall back to the first tab if a
  // controlled empty value comes through (e.g. the mobile accordion collapsed).
  const tabsRootProps = isControlled
    ? { value: value || active, onValueChange }
    : { defaultValue: active };
  // Accordion is collapsible, so an empty controlled value (all-closed) is fine.
  const accordionRootProps = isControlled
    ? { value: value ?? '', onValueChange }
    : { defaultValue: active };

  return (
    <div className={className}>
      {/* Desktop: horizontal tabs */}
      <div className="hidden md:block">
        <TabsPrimitive.Root {...tabsRootProps}>
          <TabsPrimitive.List
            className="mb-6 flex flex-wrap gap-1 border-b border-gold/15"
            aria-label="Mục báo cáo"
          >
            {tabs.map((tab) => (
              <TabsPrimitive.Trigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-3 font-sans text-sm font-medium text-muted-foreground transition-colors duration-200',
                  'hover:text-foreground',
                  'data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:text-gold',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span className="ml-1 rounded-pill bg-gold/20 px-2 py-0.5 text-xs text-gold">
                    {tab.badge}
                  </span>
                ) : null}
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>
          {tabs.map((tab) => (
            <TabsPrimitive.Content
              key={tab.id}
              value={tab.id}
              className="focus-visible:outline-none"
            >
              {tab.content}
            </TabsPrimitive.Content>
          ))}
        </TabsPrimitive.Root>
      </div>

      {/* Mobile: accordion (single-open, collapsible) */}
      <div className="md:hidden">
        <AccordionPrimitive.Root type="single" collapsible {...accordionRootProps}>
          {tabs.map((tab) => (
            <AccordionPrimitive.Item
              key={tab.id}
              value={tab.id}
              id={tab.id}
              className="scroll-mt-24 border-b border-gold/15"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger
                  className={cn(
                    'group flex w-full items-center justify-between py-4 font-sans text-sm font-medium text-foreground transition-colors duration-200',
                    'hover:text-gold',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
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
                  <ChevronDown
                    className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="pb-4">
                {tab.content}
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </div>
  );
}
