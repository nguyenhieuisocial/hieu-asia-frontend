'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Button, Input, Label } from '@hieu-asia/ui';
import { ErrorBlock } from '@/components/admin/error-block';
import type { AdminRole, AdminUser } from './UsersList';

// Wave 60.18 — AuditLogDrawer only renders when a user clicks "Log" on a
// row. Lazy-import keeps the drawer (+ its react-query / sentry imports)
// out of the initial users-page bundle. SSR off because the drawer is
// purely an on-demand admin UI element.
const AuditLogDrawer = dynamic(
  () => import('@/components/admin/audit-drawer').then((m) => m.AuditLogDrawer),
  { ssr: false },
);

export interface UserFormPayload {
  email?: string;
  password?: string;
  role?: AdminRole;
}

export function UserFormModal({
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  mode: 'create' | 'edit';
  initial?: AdminUser;
  onClose: () => void;
  onSubmit: (payload: UserFormPayload) => Promise<void>;
}) {
  const [email, setEmail] = React.useState(initial?.email ?? '');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<AdminRole>(initial?.role ?? 'viewer');
  const [pending, setPending] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const isOwnerLocked = mode === 'edit' && initial?.role === 'owner';

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setErr(null);
    try {
      const payload: UserFormPayload = {};
      if (mode === 'create') {
        payload.email = email;
        payload.password = password;
        payload.role = role;
      } else {
        if (email !== initial!.email) payload.email = email;
        if (password) payload.password = password;
        if (role !== initial!.role) payload.role = role;
      }
      await onSubmit(payload);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-gold/20 bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading text-xl text-foreground">
          {mode === 'create' ? 'Thêm user admin' : 'Sửa user'}
        </h2>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@hieu.asia"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              Mật khẩu{' '}
              {mode === 'edit' && (
                <span className="text-muted-foreground">(để trống = giữ nguyên)</span>
              )}
            </Label>
            <Input
              id="password"
              type="password"
              required={mode === 'create'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'create' ? '••••••••' : 'Mật khẩu mới (tùy chọn)'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Vai trò</Label>
            <select
              id="role"
              value={role}
              disabled={isOwnerLocked}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="h-10 w-full rounded-md border border-gold/15 bg-card/60 px-3 text-sm text-foreground disabled:opacity-50"
            >
              <option value="viewer">Viewer — chỉ đọc</option>
              <option value="admin">Admin — CRUD users</option>
              <option value="owner">Owner — full quyền</option>
            </select>
            {isOwnerLocked && (
              <p className="text-xs text-muted-foreground">
                Owner role bị khóa (chống lock-out).
              </p>
            )}
          </div>
          {err && <ErrorBlock compact message={err} />}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? 'Đang lưu…' : mode === 'create' ? 'Tạo user' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ConfirmDeleteModal({
  user,
  onClose,
  onConfirm,
}: {
  user: AdminUser;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [pending, setPending] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async () => {
    setPending(true);
    setErr(null);
    try {
      await onConfirm();
    } catch (e) {
      setErr((e as Error).message);
      setPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-red-500/30 bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading text-xl text-foreground">Xóa user?</h2>
        <p className="mt-3 text-sm text-foreground/85">
          Bạn chắc chắn muốn xóa <b className="text-foreground">{user.email}</b>?
          User này sẽ không đăng nhập được nữa.
        </p>
        {err && (
          <div className="mt-3">
            <ErrorBlock compact message={err} />
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Hủy
          </Button>
          <Button
            size="sm"
            onClick={submit}
            disabled={pending}
            className="bg-red-500/90 text-foreground hover:bg-red-500"
          >
            {pending ? 'Đang xóa…' : 'Xóa'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function UserAuditDrawer({
  user,
  onClose,
}: {
  user: AdminUser | null;
  onClose: () => void;
}) {
  return (
    <AuditLogDrawer
      resourceId={user?.id ?? null}
      resourceLabel={user?.email}
      resourceType="user"
      open={!!user}
      onClose={onClose}
      limit={10}
    />
  );
}
