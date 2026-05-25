/**
 * Wave 41 Track B — Behavioural tracking.
 *
 * Wires browser events that PostHog autocapture doesn't cover natively:
 *   - scroll_depth (25/50/75/100 thresholds, once per page session)
 *   - page_dwell (fired on pagehide with duration_ms + max_scroll)
 *   - exit_intent (mouse-leave top of viewport on desktop; aggressive
 *     scroll-up-from-bottom heuristic on mobile)
 *   - form_started / form_abandoned / form_submitted (per <form> on page)
 *   - copy_event (copy/cut events, char-count only — no actual content)
 *
 * All events fire through `track()` so PostHog + Worker funnel both get
 * the payload. Mouse-movement coordinates are NEVER captured.
 *
 * Privacy guardrails:
 *   - copy_event excludes input[type=password] and input[type=email]
 *   - no clipboard text leaves the browser
 *   - dwell timer pauses on visibilitychange (hidden tab) to avoid inflating
 *     time-on-page for background tabs
 */

import { track } from "./analytics";

let _wired = false;

interface ScrollState {
  pathname: string;
  maxScrollPct: number;
  thresholdsFired: Set<number>;
}

interface DwellState {
  pathname: string;
  startMs: number;
  activeMs: number;
  lastResumeMs: number;
  visible: boolean;
  dwellFired: boolean;
}

interface FormState {
  startedAt: number;
  submitted: boolean;
  lastFocusField: string | null;
  formId: string;
}

const SCROLL_THRESHOLDS = [25, 50, 75, 100];

function getPathname(): string {
  try {
    return window.location.pathname;
  } catch {
    return "unknown";
  }
}

function computeScrollPct(): number {
  try {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop || 0;
    const viewport = window.innerHeight || doc.clientHeight || 1;
    const total = doc.scrollHeight || doc.offsetHeight || viewport;
    const denom = Math.max(1, total - viewport);
    const pct = Math.min(100, Math.round((scrollTop / denom) * 100));
    return isFinite(pct) ? pct : 0;
  } catch {
    return 0;
  }
}

function throttle<T extends (...args: never[]) => void>(fn: T, ms: number): T {
  let last = 0;
  let pending: number | null = null;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = ms - (now - last);
    if (remaining <= 0) {
      last = now;
      fn(...args);
    } else if (pending == null) {
      pending = window.setTimeout(() => {
        last = Date.now();
        pending = null;
        fn(...args);
      }, remaining);
    }
  }) as T;
}

function fieldIdentity(el: Element | null): string | null {
  if (!el) return null;
  const tag = el.tagName.toLowerCase();
  if (tag !== "input" && tag !== "textarea" && tag !== "select") return null;
  const name = (el as HTMLInputElement).name;
  const id = el.id;
  const type = (el as HTMLInputElement).type ?? "text";
  return name || id ? `${name || id}:${type}` : type;
}

function shouldSkipCopySource(el: Element | null): boolean {
  if (!el) return false;
  const input = el.closest("input, textarea");
  if (!input) return false;
  const type = (input as HTMLInputElement).type?.toLowerCase();
  if (type === "password") return true;
  if (type === "email") return true;
  // Defensive: if author marked the field with autocomplete="cc-number" or
  // a `data-sensitive` flag, don't measure either.
  if ((input as HTMLInputElement).autocomplete?.includes("cc-")) return true;
  if (input.getAttribute("data-sensitive") === "true") return true;
  return false;
}

function pageSection(el: Element | null): string {
  try {
    const section = el?.closest("section, article, main, [data-section]");
    if (!section) return "unknown";
    const id = section.id;
    const dataSection = section.getAttribute("data-section");
    return dataSection || id || section.tagName.toLowerCase();
  } catch {
    return "unknown";
  }
}

/**
 * Wire all behavioural listeners once for the lifetime of the page.
 *
 * Safe to call from a top-level provider's `useEffect(..., [])` — idempotent.
 * Re-mounts (e.g. HMR) re-wire because the module-level `_wired` flag
 * resets only on full page reload.
 */
export function wireBehaviorTracking(): void {
  if (typeof window === "undefined") return;
  if (_wired) return;
  _wired = true;

  // ── Scroll depth ─────────────────────────────────────────────────────────
  let scroll: ScrollState = {
    pathname: getPathname(),
    maxScrollPct: 0,
    thresholdsFired: new Set(),
  };

  function resetForPath(): void {
    const path = getPathname();
    if (path !== scroll.pathname) {
      scroll = { pathname: path, maxScrollPct: 0, thresholdsFired: new Set() };
    }
  }

  const onScroll = throttle(() => {
    resetForPath();
    const pct = computeScrollPct();
    if (pct > scroll.maxScrollPct) scroll.maxScrollPct = pct;
    for (const t of SCROLL_THRESHOLDS) {
      if (pct >= t && !scroll.thresholdsFired.has(t)) {
        scroll.thresholdsFired.add(t);
        track("scroll_depth", { depth_pct: t, page: scroll.pathname });
      }
    }
  }, 250);
  window.addEventListener("scroll", onScroll, { passive: true });

  // ── Dwell time ───────────────────────────────────────────────────────────
  const dwell: DwellState = {
    pathname: getPathname(),
    startMs: Date.now(),
    activeMs: 0,
    lastResumeMs: Date.now(),
    visible: !document.hidden,
    dwellFired: false,
  };

  function pauseDwell(): void {
    if (dwell.visible) {
      dwell.activeMs += Date.now() - dwell.lastResumeMs;
      dwell.visible = false;
    }
  }
  function resumeDwell(): void {
    if (!dwell.visible) {
      dwell.lastResumeMs = Date.now();
      dwell.visible = true;
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseDwell();
    else resumeDwell();
  });

  function fireDwell(reason: "pagehide" | "beforeunload"): void {
    if (dwell.dwellFired) return;
    dwell.dwellFired = true;
    pauseDwell();
    track("page_dwell", {
      page: dwell.pathname,
      duration_ms: dwell.activeMs,
      total_elapsed_ms: Date.now() - dwell.startMs,
      max_scroll: scroll.maxScrollPct,
      reason,
    });
  }
  window.addEventListener("pagehide", () => fireDwell("pagehide"));
  // Some browsers (older Safari) fire `beforeunload` but not `pagehide`.
  window.addEventListener("beforeunload", () => fireDwell("beforeunload"));

  // ── Exit intent ──────────────────────────────────────────────────────────
  // Desktop: mouse leaves viewport from the top.
  let exitFiredThisPath = false;
  const onMouseOut = (e: MouseEvent) => {
    // Re-arm when path changes (SPA nav).
    if (getPathname() !== scroll.pathname) {
      exitFiredThisPath = false;
    }
    if (exitFiredThisPath) return;
    // No related target → cursor genuinely left the document.
    if (e.relatedTarget == null && e.clientY <= 10) {
      exitFiredThisPath = true;
      track("exit_intent", { page: getPathname(), trigger: "mouse_leave_top" });
    }
  };
  document.addEventListener("mouseout", onMouseOut);

  // Mobile: detect rapid upward scroll from near the bottom — a weak signal
  // that the user is reaching for the URL bar / back button.
  let lastTouchY: number | null = null;
  let lastTouchTime = 0;
  const onTouchMove = (e: TouchEvent) => {
    if (exitFiredThisPath) return;
    const t = e.touches[0];
    if (!t) return;
    const now = Date.now();
    const dy = lastTouchY != null ? t.clientY - lastTouchY : 0;
    const dt = now - lastTouchTime;
    lastTouchY = t.clientY;
    lastTouchTime = now;
    // Heuristic: > 60px upward in < 80ms while in bottom third of viewport.
    if (dy > 60 && dt < 80 && t.clientY > window.innerHeight * 0.66) {
      exitFiredThisPath = true;
      track("exit_intent", { page: getPathname(), trigger: "mobile_swipe_up" });
    }
  };
  window.addEventListener("touchmove", onTouchMove, { passive: true });

  // ── Form lifecycle ───────────────────────────────────────────────────────
  const formStates = new WeakMap<HTMLFormElement, FormState>();
  let formCounter = 0;

  function getOrInitFormState(form: HTMLFormElement): FormState {
    let s = formStates.get(form);
    if (!s) {
      formCounter += 1;
      const id =
        form.id ||
        form.getAttribute("data-form-id") ||
        form.getAttribute("name") ||
        `form_${formCounter}`;
      s = {
        startedAt: 0,
        submitted: false,
        lastFocusField: null,
        formId: id,
      };
      formStates.set(form, s);
    }
    return s;
  }

  document.addEventListener(
    "focusin",
    (e) => {
      // Guard: synthetic focusin can fire with target === document/window
      // (esp. Android Chrome 148+). Document has no .closest() method, so
      // unguarded cast caused HIEU-ASIA-WORKER-9 TypeError.
      const t = e.target;
      if (!(t instanceof Element)) return;
      const form = t.closest("form") as HTMLFormElement | null;
      if (!form) return;
      const s = getOrInitFormState(form);
      const field = fieldIdentity(t as HTMLElement);
      if (field) s.lastFocusField = field;
      if (s.startedAt === 0) {
        s.startedAt = Date.now();
        track("form_started", { form_id: s.formId, page: getPathname() });
      }
    },
    true,
  );

  document.addEventListener("submit", (e) => {
    const form = e.target as HTMLFormElement | null;
    if (!form || form.tagName !== "FORM") return;
    const s = getOrInitFormState(form);
    s.submitted = true;
    track("form_submitted", {
      form_id: s.formId,
      page: getPathname(),
      time_to_submit_ms: s.startedAt ? Date.now() - s.startedAt : null,
    });
  });

  function fireFormAbandonments(): void {
    document.querySelectorAll("form").forEach((form) => {
      const s = formStates.get(form as HTMLFormElement);
      if (!s || s.submitted || s.startedAt === 0) return;
      // Set submitted=true to dedupe across pagehide + beforeunload.
      s.submitted = true;
      track("form_abandoned", {
        form_id: s.formId,
        page: getPathname(),
        last_field: s.lastFocusField,
        time_open_ms: Date.now() - s.startedAt,
      });
    });
  }
  window.addEventListener("pagehide", fireFormAbandonments);

  // ── Copy / cut ───────────────────────────────────────────────────────────
  function onCopy(e: ClipboardEvent): void {
    try {
      const active = document.activeElement;
      if (shouldSkipCopySource(active)) return;
      const sel = window.getSelection();
      const charCount = sel ? sel.toString().length : 0;
      if (charCount === 0) return;
      track("copy_event", {
        char_count: charCount,
        page_section: pageSection(active),
        page: getPathname(),
        type: e.type, // "copy" | "cut"
      });
    } catch {
      /* ignore */
    }
  }
  document.addEventListener("copy", onCopy);
  document.addEventListener("cut", onCopy);
}
