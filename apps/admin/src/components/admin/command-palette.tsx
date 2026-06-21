'use client';

/**
 * ⌘K command palette (v2.0 WS-3).
 *
 * Keyboard-driven launcher: opens on ⌘K (Mac) / Ctrl+K (Win/Linux), lets the
 * operator fuzzy-jump to ANY of the 33 admin pages (plus a couple of safe quick
 * actions) without reaching for the mouse. Pages come straight from the shared
 * `NAV_GROUPS` (lib/nav-config) so this list never drifts from the sidebar.
 *
 * Renders nothing until opened — no SSR/hydration weight beyond the keydown
 * listener. cmdk's Command.Dialog handles the focus trap, input autofocus and
 * fuzzy filtering for us.
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Bot, FolderTree, Home, CornerDownLeft } from 'lucide-react';
import { NAV_GROUPS } from '@/lib/nav-config';

/** Safe, already-existing routes surfaced as one-keystroke quick actions. */
const QUICK_ACTIONS: { href: string; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { href: '/', label: 'Cần chú ý (trang chủ)', Icon: Home },
  { href: '/copilot', label: 'Trợ lý AI', Icon: Bot },
  { href: '/site-structure', label: 'Mở Cấu trúc trang', Icon: FolderTree },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  // Global ⌘K / Ctrl+K toggle. preventDefault so the browser's built-in
  // shortcut (e.g. Chrome's location bar focus) doesn't also fire.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = React.useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Bảng lệnh"
      shouldFilter
      className="fixed inset-0 z-[100] flex items-start justify-center"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Đóng bảng lệnh"
        onClick={() => setOpen(false)}
        className="fixed inset-0 cursor-default bg-background/70 backdrop-blur-sm"
      />

      <div className="relative z-[101] mt-[12vh] w-[min(36rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gold/20 bg-card/95 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-gold/15 px-4">
          <Command.Input
            autoFocus
            placeholder="Tìm trang hoặc hành động…"
            className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden shrink-0 rounded border border-gold/20 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
            Không tìm thấy kết quả.
          </Command.Empty>

          <Command.Group
            heading="Hành động nhanh"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            {QUICK_ACTIONS.map(({ href, label, Icon }) => (
              <Command.Item
                key={`qa:${href}:${label}`}
                value={`hành động nhanh ${label}`}
                onSelect={() => go(href)}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 aria-selected:bg-gold/10 aria-selected:text-gold"
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </Command.Item>
            ))}
          </Command.Group>

          {NAV_GROUPS.map((group) => (
            <Command.Group
              key={group.id}
              heading={group.label}
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {group.items.map(({ href, label, Icon }) => (
                <Command.Item
                  key={`${group.id}:${href}`}
                  value={`${group.label} ${label} ${href}`}
                  onSelect={() => go(href)}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 aria-selected:bg-gold/10 aria-selected:text-gold"
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>

        <div className="flex items-center justify-end gap-2 border-t border-gold/15 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
          <span>để mở</span>
        </div>
      </div>
    </Command.Dialog>
  );
}
