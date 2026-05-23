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
  const [draft, setDraft] = React.useState<Pick<ConsentState, "analytics" | "marketing" | "personalization">>(
    {
      analytics: true,
      marketing: false,
      personalization: true,
    },
  );

  React.useEffect(() => {
    let cancelled = false;
    shouldShowBanner().then((show) => {
      if (cancelled) return;
      if (show) {
        const current = getConsent();
        setDraft({
          analytics: current.analytics,
          marketing: current.marketing,
          personalization: current.personalization,
        });
        setVisible(true);
      }
    });
    const onReopen = () => {
      const current = getConsent();
      setDraft({
        analytics: current.analytics,
        marketing: current.marketing,
        personalization: current.personalization,
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
      className="fixed bottom-4 left-1/2 z-50 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-gold/30 bg-card/95 p-5 text-sm text-foreground shadow-2xl backdrop-blur"
    >
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
