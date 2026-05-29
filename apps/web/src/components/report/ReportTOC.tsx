'use client';

/**
 * ReportTOC — floating "jump to section" control for the report page on mobile.
 *
 * The report renders its 9 sections through <ProductTabs>, which on mobile is a
 * single-open accordion. Without a table of contents, finding a section means
 * scrolling the whole page. This floating button opens a bottom Sheet listing
 * every section; tapping one drives ProductTabs' controlled `value` (opening
 * that accordion item) and smooth-scrolls it into view.
 *
 * Mobile-only (`md:hidden`) — desktop already shows the full horizontal tablist.
 * Bottom-LEFT placement avoids the bottom-right sticky CTA / action sheet.
 */

import * as React from 'react';
import { Button, Sheet, SheetContent, SheetTrigger, SheetTitle, cn } from '@hieu-asia/ui';
import { List, Check } from 'lucide-react';

export interface ReportTOCItem {
  id: string;
  label: string;
}

export function ReportTOC({
  items,
  activeId,
  onSelect,
}: {
  items: ReportTOCItem[];
  activeId?: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  if (items.length < 2) return null;

  const handleSelect = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <div className="md:hidden print:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            aria-label="Mở mục lục báo cáo"
            className="fixed bottom-24 left-4 z-40 gap-2 rounded-card-editorial border-gold/30 bg-card/95 shadow-sm backdrop-blur"
          >
            <List className="size-4" aria-hidden="true" />
            Mục lục
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-card-editorial">
          <SheetTitle className="mb-2 font-heading text-base text-foreground">
            Mục lục báo cáo
          </SheetTitle>
          <nav
            aria-label="Mục lục báo cáo"
            className="flex flex-col gap-1 overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))] [max-height:60vh]"
          >
            {items.map((item, i) => {
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-md px-3 py-3 text-left text-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                    isActive
                      ? 'bg-gold/10 font-medium text-gold'
                      : 'text-foreground hover:bg-muted/60',
                  )}
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="w-5 shrink-0 font-mono text-xs text-muted-foreground"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {isActive ? (
                    <Check className="size-4 shrink-0 text-gold" aria-hidden="true" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
