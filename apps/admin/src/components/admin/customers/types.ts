/**
 * Shared types for /customers list + detail (Wave 60.71.T2.customers).
 */

export type CustomerPlan = 'free' | 'premium' | 'subscription' | 'lifetime';

export interface Customer {
  id: string;
  display_name?: string | null;
  email?: string | null;
  telegram_id?: string | null;
  /** Selected by handleCustomersList since day 1 but previously unmapped. */
  zalo_id?: string | null;
  avatar_url?: string | null;
  // Wave 54 (#269 follow-up): `lifetime` for the 4.99M one-time tier.
  plan?: CustomerPlan | null;
  created_at?: string | null;
  last_active?: string | null;
  sessions_count?: number | null;
}

export const PLAN_LABEL: Record<CustomerPlan, string> = {
  free: 'Miễn phí',
  premium: 'Premium',
  subscription: 'Subscription',
  lifetime: 'Lifetime',
};

export const PLAN_TONE: Record<CustomerPlan, string> = {
  free: 'bg-muted/40 text-muted-foreground border-border',
  premium: 'bg-gold/15 text-gold border-gold/30',
  subscription: 'bg-jade/15 text-foreground/85 border-jade/40',
  // Wave 54 — Lifetime uses purple to distinguish from time-bound subscription tones.
  lifetime: 'bg-purple/15 text-foreground/85 border-purple/40',
};

// Account-mutation row actions (edit-role / suspend / delete) and their
// confirm-dialog plumbing were removed — no backend mutation routes exist
// (/api/admin/customers/:id is read-only). Re-add RowAction / ConfirmState /
// ACTION_COPY here alongside the dialog once those endpoints land.
