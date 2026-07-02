/**
 * Detail-page-only types for /customers/[id] (Wave 60.71.T2.customers).
 *
 * Separate from `types.ts` because the list page does not need these heavy
 * shapes.
 */

export interface CustomerDetail {
  id: string;
  display_name?: string | null;
  email?: string | null;
  telegram_id?: string | null;
  zalo_id?: string | null;
  plan?: string | null;
  created_at?: string | null;
  last_active?: string | null;
  // Wave 60.2 additions — compliance + profile + affiliate.
  kyc_status?: string | null;
  locale?: string | null;
  country?: string | null;
  phone?: string | null;
  referral_code?: string | null;
  partner_id?: string | null;
  marketing_opt_in?: boolean | null;
  zalo_opt_in?: boolean | null;
  sms_anniversary_opt_in?: boolean | null;
  birth_year?: number | null;
  birth_month?: number | null;
  birth_day?: number | null;
  gender?: string | null;
  // Wave 63.6 — birth info lives per-reading in reading_sessions.state_json,
  // NOT on the users row (founder: "/customers chưa đầy đủ thông tin"). The
  // detail page enriches the customer from the latest session so the profile
  // surfaces birth date/place + what the customer actually asked about.
  birth_date?: string | null;
  birth_place?: string | null;
  primary_concern?: string | null;
  // Real users columns (returned via select=*) that were previously unread —
  // gap audit 2026-07-02. chart_data (migration 0036) carries onboarding birth
  // data + gender; the page flattens it into the flat fields above so
  // gender/birth show even for customers with no reading session.
  chart_data?: {
    full_name?: string | null;
    gender?: string | null;
    birth_year?: number | null;
    birth_month?: number | null;
    birth_day?: number | null;
    birth_hour?: number | null;
    birth_hour_unknown?: boolean | null;
  } | null;
  /** Consent toggles (migration 0036) — keys: email_tips, sms_anniversary,
   *  zalo_optin, meta_retargeting, google_retargeting, zalo_oa_broadcast. */
  consent_flags?: Record<string, boolean | null | undefined> | null;
  /** True = unsubscribed from email (migration 0037) — warn before contacting. */
  email_opted_out?: boolean | null;
  onboarding_completed_at?: string | null;
  plan_expires_at?: string | null;
  tier_updated_at?: string | null;
  /** buyer / affiliate / admin… (migration 0017). */
  app_role?: string | null;
  [extra: string]: unknown;
}

export interface SessionRow {
  session_id: string;
  updated_at?: string | null;
  state_json?: {
    topic?: string | null;
    status?: string | null;
    pipeline_status?: string | null;
    created_at?: string | null;
    birth_data?: {
      display_name?: string | null;
      primary_concern?: string | null;
      birth_date?: string | null;
      birth_time?: string | null;
      birth_place?: string | null;
    } | null;
  } | null;
  id?: string;
  topic?: string | null;
  created_at?: string | null;
  status?: string | null;
}

export interface TxnRow {
  id: string;
  type: string;
  amount?: number | null;
  created_at?: string | null;
}

export interface AuditRow {
  ts: string;
  action: string;
  detail?: string | null;
}

// One refund attributed to this customer (joined to the user via intent_id on
// the worker — refund records have no user_id). Status follows the worker's
// refund state machine: requested → approved → completed, or rejected.
export interface RefundRow {
  refund_id: string;
  intent_id?: string | null;
  amount_vnd?: number | null;
  status: string;
  reason?: string | null;
  requested_at?: string | null;
  completed_at?: string | null;
}

export interface CustomerDetailResponse {
  ok: boolean;
  customer?: CustomerDetail | null;
  sessions?: SessionRow[];
  transactions?: TxnRow[];
  refunds?: RefundRow[];
  audit_trail?: AuditRow[];
  identities?: Array<{
    anon_distinct_id?: string | null;
    telegram_id?: string | null;
    zalo_id?: string | null;
    link_source?: string | null;
    first_seen?: string | null;
    last_seen?: string | null;
  }>;
  /** Supabase Auth profile (auth.users) — name / last-login / provider / verified,
   *  which do NOT live on hieu_asia.users. Null for non-uuid ids or on failure. */
  auth_info?: {
    display_name?: string | null;
    last_sign_in_at?: string | null;
    created_at?: string | null;
    email_confirmed_at?: string | null;
    phone?: string | null;
    providers?: string[] | null;
  } | null;
  note?: string;
  error?: string;
}

export function hasComplianceField(c: CustomerDetail | null): boolean {
  if (!c) return false;
  return (
    c.kyc_status != null
    || c.locale != null
    || c.country != null
    || c.phone != null
    || c.referral_code != null
    || c.partner_id != null
    || c.marketing_opt_in != null
    || c.zalo_opt_in != null
    || c.sms_anniversary_opt_in != null
    || c.gender != null
    || c.birth_year != null
    // consent_flags/email_opted_out are the REAL DB columns (the flat opt-in
    // fields above never existed in DB) — without these the tab hid real data.
    || (c.consent_flags != null && Object.keys(c.consent_flags).length > 0)
    || c.email_opted_out != null
  );
}
