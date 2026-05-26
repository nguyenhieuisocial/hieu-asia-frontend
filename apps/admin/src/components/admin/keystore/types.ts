/**
 * Shared types for /admin/keystore (Wave 60.81.A.v2 — vault 107 §5.6).
 *
 * Sibling to components/admin/customers/types.ts. Lives in its own folder so
 * row-action, dialogs, and badges share copy without leaking back into
 * admin-api.ts. ACTION_COPY mirrors customers/types.ts ConfirmState pattern.
 */

import type { VaultEntry } from '@/lib/keystore-api';

export type VaultRowAction = 'reveal' | 'rotate' | 'delete';

export interface VaultConfirmState {
  action: VaultRowAction;
  entry: VaultEntry;
}

export const VAULT_ACTION_COPY: Record<
  VaultRowAction,
  { title: string; description: string; cta: string; danger?: boolean }
> = {
  reveal: {
    title: 'Hiện plaintext token',
    description:
      'Hành động này sẽ ghi audit_log (action=keystore.reveal, admin, IP). Token chỉ hiển thị 30 giây.',
    cta: 'Xác nhận hiện',
  },
  rotate: {
    title: 'Xoay key',
    description:
      'Tạo key mới + làm hết hạn key cũ. Mọi service đang dùng key cũ sẽ fail cho đến khi cập nhật. Ghi audit_log.',
    cta: 'Xác nhận xoay',
  },
  delete: {
    title: 'Xoá key',
    description:
      'Xoá vĩnh viễn entry khỏi vault. Không thể hoàn tác. Ghi audit_log.',
    cta: 'Xoá vĩnh viễn',
    danger: true,
  },
};
