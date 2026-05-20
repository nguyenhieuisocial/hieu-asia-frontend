'use client';

import * as React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';

type AdminRole = 'owner' | 'admin' | 'viewer';

interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

const ROLE_LABEL: Record<AdminRole, string> = {
  owner: 'Chủ sở hữu',
  admin: 'Quản trị',
  viewer: 'Chỉ đọc',
};

const ROLE_TONE: Record<AdminRole, string> = {
  owner: 'bg-gold/15 text-gold border-gold/30',
  admin: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  viewer: 'bg-cream/10 text-cream/70 border-cream/20',
};

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [flash, setFlash] = React.useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);
  const [editing, setEditing] = React.useState<AdminUser | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<AdminUser | null>(null);

  const showFlash = React.useCallback((kind: 'ok' | 'err', msg: string) => {
    setFlash({ kind, msg });
    setTimeout(() => setFlash(null), 4000);
  }, []);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = await r.json();
      if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
      setUsers(data.users);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  // KV is eventually consistent (~60s); a 1s wait after mutation usually gets us
  // the fresh value but isn't a hard guarantee.
  const refreshAfterMutation = React.useCallback(async () => {
    await new Promise((res) => setTimeout(res, 1000));
    await load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-cream">Người dùng admin</h1>
          <p className="mt-1 text-sm text-cream/65">
            Quản lý danh sách admin login (lưu trong Cloudflare KV). Role <b className="text-gold">owner</b> không thể xóa.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="shrink-0">+ Thêm user</Button>
      </div>

      {flash && (
        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            flash.kind === 'ok'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/40 bg-red-500/10 text-red-300'
          }`}
        >
          {flash.msg}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Danh sách</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="mb-4 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          {loading ? (
            <p className="py-8 text-center text-sm text-cream/55">Đang tải…</p>
          ) : users.length === 0 ? (
            <p className="py-8 text-center text-sm text-cream/55">Chưa có user.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left text-xs uppercase tracking-wider text-cream/55">
                    <th className="pb-2 pr-4 font-medium">Email</th>
                    <th className="pb-2 pr-4 font-medium">Role</th>
                    <th className="pb-2 pr-4 font-medium">Tạo lúc</th>
                    <th className="pb-2 text-right font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gold/5 last:border-0">
                      <td className="py-3 pr-4 text-cream">{u.email}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${ROLE_TONE[u.role]}`}
                        >
                          {ROLE_LABEL[u.role]}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs text-cream/70">{fmtDate(u.created_at)}</td>
                      <td className="py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => setEditing(u)}
                            className="rounded border border-gold/30 px-2 py-1 text-xs text-gold hover:bg-gold/10"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => setDeleting(u)}
                            disabled={u.role === 'owner'}
                            className="rounded border border-red-500/30 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                            title={u.role === 'owner' ? 'Không thể xóa owner' : 'Xóa'}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {creating && (
        <UserFormModal
          mode="create"
          onClose={() => setCreating(false)}
          onSubmit={async (payload) => {
            const r = await fetch('/api/admin/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            const data = await r.json();
            if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
            setCreating(false);
            showFlash('ok', `Đã tạo user ${payload.email}`);
            await refreshAfterMutation();
          }}
        />
      )}

      {editing && (
        <UserFormModal
          mode="edit"
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={async (payload) => {
            const r = await fetch(`/api/admin/users/${editing.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            const data = await r.json();
            if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
            setEditing(null);
            showFlash('ok', `Đã cập nhật ${payload.email ?? editing.email}`);
            await refreshAfterMutation();
          }}
        />
      )}

      {deleting && (
        <ConfirmDeleteModal
          user={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            const r = await fetch(`/api/admin/users/${deleting.id}`, { method: 'DELETE' });
            const data = await r.json();
            if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
            setDeleting(null);
            showFlash('ok', `Đã xóa ${deleting.email}`);
            await refreshAfterMutation();
          }}
        />
      )}
    </div>
  );
}

interface UserFormPayload {
  email?: string;
  password?: string;
  role?: AdminRole;
}

function UserFormModal({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-lg border border-gold/20 bg-ink p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading text-xl text-cream">
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              Mật khẩu {mode === 'edit' && <span className="text-cream/50">(để trống = giữ nguyên)</span>}
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
              className="h-10 w-full rounded-md border border-gold/15 bg-ink/40 px-3 text-sm text-cream disabled:opacity-50"
            >
              <option value="viewer">Viewer — chỉ đọc</option>
              <option value="admin">Admin — CRUD users</option>
              <option value="owner">Owner — full quyền</option>
            </select>
            {isOwnerLocked && (
              <p className="text-xs text-cream/50">Owner role bị khóa (chống lock-out).</p>
            )}
          </div>
          {err && (
            <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {err}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-cream/20 px-4 py-2 text-sm text-cream/75 hover:bg-cream/5"
            >
              Hủy
            </button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Đang lưu…' : mode === 'create' ? 'Tạo user' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-lg border border-red-500/30 bg-ink p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading text-xl text-cream">Xóa user?</h2>
        <p className="mt-3 text-sm text-cream/75">
          Bạn chắc chắn muốn xóa <b className="text-cream">{user.email}</b>?
          User này sẽ không đăng nhập được nữa.
        </p>
        {err && (
          <p className="mt-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {err}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded border border-cream/20 px-4 py-2 text-sm text-cream/75 hover:bg-cream/5"
          >
            Hủy
          </button>
          <button
            onClick={submit}
            disabled={pending}
            className="rounded border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 disabled:opacity-50"
          >
            {pending ? 'Đang xóa…' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
}
