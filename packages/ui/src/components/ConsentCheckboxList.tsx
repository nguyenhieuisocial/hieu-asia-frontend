'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

/**
 * Custom domain component per [[90 - Frontend Design Spec]] §Onboarding.
 *
 * Explicit per-purpose consent checkboxes (no hidden lawyer-speak).
 * Maps to backend `ConsentPayload.purposes` after `accepted: true`.
 */

export interface ConsentItem {
  id: string;
  /** Label hiển thị (Vietnamese). */
  label: string;
  /** Mô tả mục đích xử lý — phải minh bạch. */
  purpose?: string;
  /** Khoá để giữ luôn checked (vd: terms_of_service, privacy). */
  required?: boolean;
  /** Default-checked state. */
  defaultChecked?: boolean;
}

export interface ConsentCheckboxListProps {
  items: ConsentItem[];
  /** Called with map of id → checked when any item changes. */
  onChange?: (state: Record<string, boolean>) => void;
  className?: string;
}

export function ConsentCheckboxList({ items, onChange, className }: ConsentCheckboxListProps) {
  const [state, setState] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((it) => [it.id, Boolean(it.defaultChecked || it.required)])),
  );

  const handle = (id: string, checked: boolean) => {
    const next = { ...state, [id]: checked };
    setState(next);
    onChange?.(next);
  };

  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item) => (
        <li key={item.id} className="rounded-md border border-gold/15 bg-ink/40 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-gold disabled:opacity-50"
              checked={state[item.id] ?? false}
              disabled={item.required}
              onChange={(e) => handle(item.id, e.target.checked)}
            />
            <span className="flex-1">
              <span className="block font-medium text-cream">
                {item.label}
                {item.required && <span className="ml-1 text-gold">*</span>}
              </span>
              {item.purpose && (
                <span className="mt-1 block text-sm text-cream/60">{item.purpose}</span>
              )}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
