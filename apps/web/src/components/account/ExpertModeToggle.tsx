'use client';

import * as React from 'react';
import { Switch } from '@hieu-asia/ui';
import { useExpertMode } from '@/hooks/use-expert-mode';

/**
 * Chế độ Chuyên gia toggle (roadmap §3.5).
 *
 * Renders a Switch labeled "Chế độ Chuyên gia". Wires `useExpertMode()`
 * so the choice persists across visits via localStorage. When a `?expert=…`
 * URL override is active the switch is disabled with a hint.
 */
export function ExpertModeToggle() {
  const { expertMode, setExpertMode, isUrlForced } = useExpertMode();
  const isHydrated = expertMode !== null;
  const checked = expertMode === true;

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card/40 p-4">
      <div className="min-w-0">
        <label
          htmlFor="expert-mode-toggle"
          className="block font-heading text-base text-foreground"
        >
          Chế độ Chuyên gia
        </label>
        <p className="mt-1 text-sm text-muted-foreground">
          Hiển thị thuật ngữ Tử Vi đầy đủ (cung, sao, đại vận, tiểu hạn).
          Khi tắt, ngôn ngữ đơn giản hơn.
        </p>
        {isUrlForced && (
          <p className="mt-2 text-[11px] text-gold/80">
            Đang bị ép bởi đường link (?expert) — bỏ tham số khỏi URL để dùng lại
            cài đặt cá nhân.
          </p>
        )}
      </div>
      <Switch
        id="expert-mode-toggle"
        checked={checked}
        disabled={!isHydrated || isUrlForced}
        onCheckedChange={setExpertMode}
        aria-label="Bật chế độ Chuyên gia"
      />
    </div>
  );
}
