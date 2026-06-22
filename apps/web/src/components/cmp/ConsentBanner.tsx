"use client";

/**
 * Wave 41 Track E — Consent banner.
 *
 * Wave 52-A — repositioned from bottom-right to bottom-CENTER + wider max
 * width so the banner can never overlap right-edge CTAs (the "Tiếp tục lập
 * lá số" button on /onboarding and the Premium card CTA on /pricing). Audit
 * found the prior bottom-right placement hid conversion-critical actions
 * until the user dismissed the banner.
 *
 * Wave 55 BUG-002 — mobile pill mode. On <512px the Wave 52-A banner
 * collapsed to ~full width via `min(640px, 100vw-2rem)` and `fixed bottom-4`
 * combined to cover "Chọn gói tháng" CTA on /pricing while scrolling. Fix:
 * on mobile show a narrow 1-line pill ("🍪 Cookies · OK · Tuỳ chỉnh"); tap
 * "Tuỳ chỉnh" to expand to the full layout (which auto-jumps to the
 * granular-toggles state so user can save in one step). Desktop is
 * unaffected — `sm:` breakpoint forces the full layout.
 *
 * Granular toggles: Necessary (always on), Analytics (default ON),
 * Marketing (default OFF), Personalization (default ON).
 *
 * Buttons:
 *   - "Chấp nhận tất cả"  → all three ON
 *   - "Chỉ cần thiết"      → analytics + marketing + personalization OFF
 *   - "Tuỳ chỉnh"          → expands inline toggles, then "Lưu"
 *
 * Geo logic in `consent.ts.shouldShowBanner` — VN + EU users always see
 * the banner; rest-of-world auto-accept legitimate-interest defaults.
 */

import * as React from "react";
import {
  getConsent,
  setConsent,
  shouldShowBanner,
  type ConsentState,
} from "@/lib/consent";

export function ConsentBanner(): React.ReactElement | null {
  const [visible, setVisible] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  // Wave 55 BUG-002 — mobile pill mode. Default collapsed=true so first-time
  // mobile visitors see the slim pill; tapping "Tuỳ chỉnh" expands into the
  // existing full layout (and skips straight to granular toggles).
  const [collapsed, setCollapsed] = React.useState(true);
  // Wave 60.19 + 60.73 — pre-checked defaults per founder business decision
  // (2026-05-26). All toggles default to TRUE so first-time visitors see
  // every box pre-ticked; they can still untick + Lưu, or click "Chỉ cần
  // thiết" for the necessary-only path.
  //
  // KNOWN LEGAL RISK: pre-ticked boxes for non-essential cookies are
  // technically invalid consent under CJEU Planet49 (C-673/17, 2019) for
  // EU users + VN Decree 13/2023 Art. 11 (consent must be expressed
  // through an "opt-in action"). Per founder authority this is acceptable
  // for the VN-first launch; EU exposure mitigated by the banner being
  // shown in EU geo per `shouldShowBanner()` so users have explicit
  // opt-out option before any tracker fires. Founder accepts the regulatory
  // risk; defer formal pre-tick removal to a future EU launch wave.
  //
  // Banner shows in VN + EU + UK + BR + CA (per `shouldShowBanner()`);
  // remaining jurisdictions get silent legitimate-interest defaults
  // applied without a banner.
  //
  // RETURNING USERS: if `consent.shown=true` in storage, the draft is
  // hydrated from the persisted choice in `useEffect` below.
  // FIRST-TIME VISITORS: defaults are UNCHECKED (Wave 60.94.l — GDPR/Planet49
  // C-673/17 + VN Decree 13/2023 Art. 11 compliance; previous pre-tick was
  // Wave 60.73 founder accepted but vault 119 P1-1 flagged invalid consent).
  const [draft, setDraft] = React.useState<Pick<ConsentState, "analytics" | "marketing" | "personalization">>(
    {
      analytics: false,
      marketing: false,
      personalization: false,
    },
  );

  React.useEffect(() => {
    let cancelled = false;
    shouldShowBanner().then((show) => {
      if (cancelled) return;
      if (show) {
        const current = getConsent();
        // Wave 60.73: only hydrate draft from storage if user has previously
        // made a choice. First-time visitors keep the all-true useState
        // defaults (founder decision — see comment block above).
        if (current.shown) {
          setDraft({
            analytics: current.analytics,
            marketing: current.marketing,
            personalization: current.personalization,
          });
        }
        setVisible(true);
      }
    });
    const onReopen = () => {
      const current = getConsent();
      // Reopen path: always hydrate from storage so user sees their last
      // saved choice. If never saved (shown=false somehow reached this
      // path), fall back to all-true defaults per founder policy.
      setDraft({
        analytics: current.shown ? current.analytics : true,
        marketing: current.shown ? current.marketing : true,
        personalization: current.shown ? current.personalization : true,
      });
      setVisible(true);
    };
    window.addEventListener("hieu:consent:reopen", onReopen);
    return () => {
      cancelled = true;
      window.removeEventListener("hieu:consent:reopen", onReopen);
    };
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    setConsent(
      { analytics: true, marketing: true, personalization: true },
      "banner_accept_all",
    );
    setVisible(false);
  };

  const necessaryOnly = () => {
    setConsent(
      { analytics: false, marketing: false, personalization: false },
      "banner_necessary_only",
    );
    setVisible(false);
  };

  const saveCustom = () => {
    setConsent(
      {
        analytics: draft.analytics,
        marketing: draft.marketing,
        personalization: draft.personalization,
      },
      "banner_custom",
    );
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      // Wave 52-A — bottom-center positioning. `left-1/2 -translate-x-1/2`
      // anchors the banner away from the right edge so it never covers
      // primary CTAs on /onboarding, /pricing, or /tu-vi-hom-nay.
      //
      // Wave 55 BUG-002 — mobile collapsed gets a narrow pill; sm+ always
      // gets the full 640px width. Width selector splits on `collapsed` to
      // shrink mobile footprint when collapsed.
      //
      // Desktop (lg): anchored BOTTOM-LEFT (was `lg:top-20` top-center, which
      // overlapped the hero title on every page). Bottom-left clears both the
      // hero (top) and the center/right-aligned primary CTAs on
      // /onboarding · /pricing.
      className={[
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2 lg:left-6 lg:translate-x-0 lg:max-w-[420px]",
        "rounded-lg border border-gold/30 bg-card/95 text-sm text-foreground shadow-2xl backdrop-blur",
        collapsed
          ? "w-[min(340px,calc(100vw-2rem))] px-3 py-2 sm:w-[min(640px,calc(100vw-2rem))] sm:p-5"
          : "w-[min(640px,calc(100vw-2rem))] p-5",
      ].join(" ")}
    >
      {/* Wave 55 BUG-002 — mobile compact pill. Hidden on sm+ (desktop
          always sees the full layout via the second block below). */}
      <div className={`flex items-center justify-between gap-2 sm:hidden ${collapsed ? "" : "hidden"}`}>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold/85">
          🍪 Cookies
        </span>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setCollapsed(false);
              setExpanded(true);
            }}
            className="rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-foreground/85 hover:bg-card"
          >
            Tuỳ chỉnh
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-md bg-gold px-2.5 py-1 text-[11px] font-semibold text-ink hover:bg-gold/90"
          >
            OK
          </button>
        </div>
      </div>

      {/* Full layout — always on sm+, only on mobile when expanded. */}
      <div className={collapsed ? "hidden sm:block" : ""}>
      <h2 className="font-heading text-base font-semibold text-gold">
        Cookie & dữ liệu
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-foreground/80">
        Chúng tôi dùng cookie cần thiết để vận hành site. Bạn có thể bật/tắt
        analytics, marketing và personalization. Xem chi tiết tại{" "}
        <a href="/privacy" className="text-gold underline">
          /privacy
        </a>
        .
      </p>

      {expanded && (
        <div className="mt-3 space-y-2 rounded-md border border-border bg-background/40 p-3 text-xs">
          <ConsentRow
            label="Cần thiết"
            description="Session, CSRF, ngôn ngữ. Luôn bật."
            checked
            disabled
            onChange={() => {}}
          />
          <ConsentRow
            label="Analytics"
            description="PostHog, Plausible. Đo funnel + UX."
            checked={draft.analytics}
            onChange={(v) => setDraft((d) => ({ ...d, analytics: v }))}
          />
          <ConsentRow
            label="Marketing"
            description="Facebook, Google Ads, TikTok pixel."
            checked={draft.marketing}
            onChange={(v) => setDraft((d) => ({ ...d, marketing: v }))}
          />
          <ConsentRow
            label="Personalization"
            description="Lưu giao diện + đề xuất nội dung."
            checked={draft.personalization}
            onChange={(v) => setDraft((d) => ({ ...d, personalization: v }))}
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {expanded ? (
          <button
            type="button"
            onClick={saveCustom}
            className="rounded-md bg-gold px-3 py-1.5 text-xs font-semibold text-ink hover:bg-gold/90"
          >
            Lưu
          </button>
        ) : (
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-md bg-gold px-3 py-1.5 text-xs font-semibold text-ink hover:bg-gold/90"
          >
            Chấp nhận tất cả
          </button>
        )}
        <button
          type="button"
          onClick={necessaryOnly}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground/80 hover:bg-card"
        >
          Chỉ cần thiết
        </button>
        {!expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground/80 hover:bg-card"
          >
            Tuỳ chỉnh
          </button>
        )}
      </div>
      </div>
    </div>
  );
}

interface ConsentRowProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}

function ConsentRow({ label, description, checked, disabled, onChange }: ConsentRowProps): React.ReactElement {
  return (
    <label className={`flex items-start gap-3 ${disabled ? "opacity-60" : ""}`}>
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 accent-gold"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="flex-1">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="block text-[11px] text-muted-foreground">{description}</span>
      </span>
    </label>
  );
}
