/**
 * Event taxonomy — the canonical list of every analytics event we fire,
 * keyed by name with a TypeScript schema for its properties.
 *
 * Stay disciplined: if a component needs to fire a new event, add it here
 * first, then call `track(name, props)` from `analytics.ts`. PostHog,
 * Plausible, and the Worker funnel all receive the same payload.
 *
 * Pillars
 * -------
 *   funnel      — onboarding/conversion steps (legacy events)
 *   reading     — Tử Vi / Bát Tự / MBTI / palm session lifecycle
 *   mentor      — chat with the AI mentor
 *   commerce    — pricing/checkout/payment
 *   engagement  — CTA, share, download, error displays
 *   auth        — signup/login/identification
 *   experiment  — feature flag evaluation
 *   performance — Web Vitals snapshot
 */

export type ReadingMethod = "tu-vi" | "bat-tu" | "mbti" | "palm";
export type ShareNetwork = "facebook" | "tiktok" | "zalo" | "twitter" | "copy_link";
export type AuthMethod = "magic_link" | "oauth" | "telegram";
export type MembershipTier = "free" | "standard" | "premium" | "lifetime";

export interface EventPropertyMap {
  // ── Funnel (already wired) ──────────────────────────────────────
  consent_given: { source?: string };
  palm_uploaded: { backend?: "r2" | "supabase"; file_size?: number };
  survey_completed: { question_count?: number; duration_seconds?: number };
  report_viewed: { reading_id?: string; method?: ReadingMethod };
  mentor_message_sent: {
    session_id?: string;
    role?: "user" | "assistant";
    char_count?: number;
  };
  payment_intent_created: { tier?: MembershipTier; amount_vnd?: number };
  payment_completed: {
    tier?: MembershipTier;
    amount_vnd?: number;
    method?: string;
  };
  affiliate_link_clicked: { affiliate_code?: string; target?: string };
  daily_horoscope_subscribed: { channel?: "email" | "telegram" | "push" };
  tool_used: { tool: string; result?: "ok" | "error" };

  // ── Reading lifecycle ───────────────────────────────────────────
  reading_started: {
    method: ReadingMethod;
    has_birth_data: boolean;
  };
  reading_completed: {
    method: ReadingMethod;
    duration_seconds: number;
    sections_viewed: string[];
  };
  reading_abandoned: {
    method: ReadingMethod;
    last_step: string;
  };

  // ── Mentor ──────────────────────────────────────────────────────
  mentor_chat_message_sent: {
    session_id: string;
    role: "user" | "assistant";
    char_count: number;
    has_attachment: boolean;
  };
  mentor_chat_session_started: { session_id: string };
  mentor_chat_quick_prompt_used: { prompt_id: string };

  // ── Commerce ────────────────────────────────────────────────────
  pricing_page_viewed: { tier_viewed: string[] };
  pricing_tier_clicked: { tier: MembershipTier };
  payment_failed: {
    tier?: MembershipTier;
    reason?: string;
    provider?: string;
  };
  pdf_download_clicked: { reading_id: string };

  // ── Engagement ──────────────────────────────────────────────────
  cta_clicked: { cta_id: string; page: string; position?: number };
  share_clicked: { network: ShareNetwork; surface?: string };
  error_displayed: {
    error_type: string;
    error_message_hash?: string;
    page: string;
  };

  // ── Auth ────────────────────────────────────────────────────────
  signup_started: { method: AuthMethod };
  signup_completed: { method: AuthMethod };
  signin_started: { method: AuthMethod };
  signin_completed: { method: AuthMethod };
  user_identified: { user_id: string; new_user: boolean };

  // ── Experiments ─────────────────────────────────────────────────
  feature_flag_evaluated: { flag_key: string; variant: string | boolean };

  // ── Performance ─────────────────────────────────────────────────
  $web_vitals: {
    metric: "LCP" | "FID" | "CLS" | "INP" | "TTFB" | "FCP";
    value: number;
    rating?: "good" | "needs-improvement" | "poor";
    page: string;
  };
}

export type EventName = keyof EventPropertyMap;

/**
 * Helper: typed event payload tuple. Allows compile-time prop validation
 * when callers spread the result through `track(...args)` — optional sugar.
 */
export type EventPayload<K extends EventName> = [K, EventPropertyMap[K]];
