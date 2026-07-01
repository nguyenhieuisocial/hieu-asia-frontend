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
  );
}
