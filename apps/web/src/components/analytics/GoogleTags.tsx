"use client";

import * as React from "react";
import { initGoogleTags } from "@/lib/google-tags";

/**
 * Boots GTM + GA4 with Google Consent Mode v2 on every page load. The tags load
 * for all visitors but start with storage DENIED (see lib/google-tags); cookies
 * only switch on once the visitor grants consent via the CMP, which calls the
 * consent-update helpers from lib/consent.ts setConsent().
 *
 * Wave 65.05 — KHÔNG init ngay sau hydration nữa: gtm.js + GA4 tải cho MỌI
 * visitor đúng lúc luồng chính đang bận nhất (cạnh tranh TBT/INP đầu phiên —
 * finding P2 vòng 4). Hoãn tới tương tác đầu tiên HOẶC lúc rảnh (idle, trần
 * 3.5s) — cái nào tới trước. Thứ tự Consent Mode an toàn: push 'default' và
 * inject gtm.js đều nằm TRONG initGoogleTags nên hoãn cả cụm không đổi thứ
 * tự; CMP đổi consent sớm thì các helper update tự gọi initGoogleTags trước.
 *
 * Renders nothing.
 */
export function GoogleTags(): null {
  React.useEffect(() => {
    let done = false;
    const boot = (): void => {
      if (done) return;
      done = true;
      cleanup();
      initGoogleTags();
    };
    const EVENTS: readonly (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'scroll'];
    const hasRIC = typeof window.requestIdleCallback === 'function';
    const idleId = hasRIC
      ? window.requestIdleCallback(boot, { timeout: 3500 })
      : window.setTimeout(boot, 3500);
    const cleanup = (): void => {
      EVENTS.forEach((e) => window.removeEventListener(e, boot));
      if (hasRIC) window.cancelIdleCallback(idleId as number);
      else window.clearTimeout(idleId as number);
    };
    EVENTS.forEach((e) => window.addEventListener(e, boot, { once: true, passive: true }));
    return cleanup;
  }, []);
  return null;
}
