/**
 * Shared types for /customers list + detail (Wave 60.71.T2.customers).
 */

export type CustomerPlan = 'free' | 'premium' | 'subscription' | 'lifetime';

export interface Customer {
  id: string;
  display_name?: string | null;
  email?: string | null;
  telegram_id?: string | null;
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

export type RowAction = 'edit-role' | 'suspend' | 'delete';

export interface ConfirmState {
  action: RowAction;
  customer: Customer;
}

export const ACTION_COPY: Record<
  RowAction,
  { title: string; description: string; cta: string; danger?: boolean }
> = {
  'edit-role': {
    title: 'Đổi role khách hàng',
    description:
      'Hành động này cập nhật bảng users. Sẽ ghi audit_log trước khi áp dụng.',
    cta: 'Mở form đổi role',
  },
  suspend: {
    title: 'Tạm khoá tài khoản',
    description:
      'Khách hàng sẽ không đăng nhập được cho đến khi mở lại. Sẽ ghi audit_log.',
    cta: 'Xác nhận tạm khoá',
  },
  delete: {
    title: 'Xoá khách hàng',
    description:
      'Hành động này xoá vĩnh viễn user và mọi reading_session liên kết. Không thể hoàn tác.',
    cta: 'Xoá vĩnh viễn',
    danger: true,
  },
};
