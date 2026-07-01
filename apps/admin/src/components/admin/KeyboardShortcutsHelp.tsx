'use client';

/**
 * Keyboard-shortcuts cheat-sheet (discoverable via "?" / Shift+/).
 *
 * A small, purely-additive dialog that lists the admin's real, already-wired
 * keyboard shortcuts. Opens when the operator presses "?" anywhere except while
 * typing in an input/textarea/contenteditable, so it never hijacks a keystroke
 * meant for a form field. Closing (Esc, backdrop, X) is handled by the shared
 * Dialog primitive.
 *
 * Every row here maps to a shortcut that ACTUALLY exists in the codebase — this
 * component only documents behavior, it does not add any new bindings:
 *   - ⌘K / Ctrl+K → command-palette.tsx (opens the palette)
 *   - "/"         → coupons/page.tsx + users/page.tsx (focus the search box)
 *   - ⌘/Ctrl+Enter → copilot/page.tsx (send the AI prompt)
 *   - Enter        → table/AdminTable.tsx (open the selected row)
 *   - Esc          → command-palette + dialogs (close)
 */

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@hieu-asia/ui';

/** One cheat-sheet row: the key(s) to press and what they do. */
type Shortcut = { keys: string[]; description: string };

/**
 * Real, implemented shortcuts only — do NOT add rows for behavior that isn't
 * wired up. `keys` renders as individual <kbd> chips.
 */
const SHORTCUTS: Shortcut[] = [
  { keys: ['⌘', 'K'], description: 'Mở bảng lệnh (Ctrl + K trên Windows)' },
  { keys: ['/'], description: 'Nhảy tới ô tìm kiếm (trang Coupons, Người dùng)' },
  { keys: ['⌘', '↵'], description: 'Gửi câu hỏi cho Trợ lý AI (Ctrl + Enter trên Windows)' },
  { keys: ['↵'], description: 'Mở dòng đang chọn trong bảng' },
  { keys: ['Esc'], description: 'Đóng bảng lệnh / hộp thoại' },
  { keys: ['?'], description: 'Mở bảng phím tắt này' },
];

/** True when the keystroke originated from a field the user is typing into. */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = React.useState(false);

  // Global "?" (Shift+/) toggle — ignored while typing so we never steal a "?"
  // meant for a text field.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '?') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      setOpen((prev) => !prev);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Phím tắt bàn phím</DialogTitle>
          <DialogDescription>
            Nhấn <kbd className="rounded border border-gold/20 px-1 font-mono text-[11px]">?</kbd> bất
            kỳ lúc nào để mở lại bảng này.
          </DialogDescription>
        </DialogHeader>

        <dl className="mt-1 divide-y divide-gold/10">
          {SHORTCUTS.map(({ keys, description }) => (
            <div
              key={description}
              className="flex items-center justify-between gap-4 py-2.5"
            >
              <dd className="min-w-0 flex-1 text-sm text-foreground/80">{description}</dd>
              <dt className="flex shrink-0 items-center gap-1">
                {keys.map((k, i) => (
                  <React.Fragment key={k}>
                    {i > 0 && (
                      <span className="text-[10px] text-muted-foreground">+</span>
                    )}
                    <kbd className="inline-flex min-w-[1.5rem] items-center justify-center rounded border border-gold/20 bg-background/60 px-1.5 py-0.5 font-mono text-[11px] text-foreground/90">
                      {k}
                    </kbd>
                  </React.Fragment>
                ))}
              </dt>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
