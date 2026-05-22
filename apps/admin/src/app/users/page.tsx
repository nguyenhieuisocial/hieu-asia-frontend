'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  cn,
} from '@hieu-asia/ui';
import { Users, Crown, Shield, Eye, Plus, Pencil, Trash2, Search, Download, History, BookmarkPlus, Lock } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { EmptyState } from '@/components/admin/empty-state';
import { AuditLogDrawer } from '@/components/admin/audit-drawer';
import { exportToCSV, fmtCsvFilename } from '@/lib/csv-export';
import { useBulkSelection } from '@/lib/bulk-action';
import { useSavedFilters } from '@/lib/saved-filters';

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
  viewer: 'bg-muted/40 text-muted-foreground border-border',
};

const ROLE_ICON: Record<AdminRole, React.ComponentType<{ className?: string }>> = {
  owner: Crown,
  admin: Shield,
  viewer: Eye,
};

const ROLE_FILTERS: Array<{ value: 'all' | AdminRole; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'viewer', label: 'Viewer' },
];

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function fmtRelative(iso: string) {
  try {
    const t = new Date(iso).getTime();
    const diff = Date.now() - t;
    const d = Math.floor(diff / 86_400_000);
    if (d < 1) return 'hôm nay';
    if (d < 7) return `${d} ngày trước`;
    if (d < 30) return `${Math.floor(d / 7)} tuần trước`;
    if (d < 365) return `${Math.floor(d / 30)} tháng trước`;
    return `${Math.floor(d / 365)} năm trước`;
  } catch {
    return '';
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
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<'all' | AdminRole>('all');
  const [auditUser, setAuditUser] = React.useState<AdminUser | null>(null);
  const [bulkSuspendOpen, setBulkSuspendOpen] = React.useState(false);
  const [bulkPending, setBulkPending] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  // Saved filter presets (search + roleFilter) — persisted in localStorage
  // under `hieu-admin:filters:users:v1`.
  const { presets, savePreset, loadPreset, deletePreset } = useSavedFilters<{
    search: string;
    roleFilter: 'all' | AdminRole;
  }>('users', { search: '', roleFilter: 'all' });

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

  // `/` focuses search.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // KV is eventually consistent (~60s); a 1s wait after mutation usually gets us
  // the fresh value but isn't a hard guarantee.
  const refreshAfterMutation = React.useCallback(async () => {
    await new Promise((res) => setTimeout(res, 1000));
    await load();
  }, [load]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (q && !u.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [users, search, roleFilter]);

  // Bulk selection — owners are unselectable (cannot suspend owners).
  const selectable = React.useMemo(() => filtered.filter((u) => u.role !== 'owner'), [filtered]);
  const bulk = useBulkSelection(selectable, (u) => u.id);

  const onApplyPreset = React.useCallback(
    (name: string) => {
      const p = loadPreset(name);
      if (!p) return;
      setSearch(p.search);
      setRoleFilter(p.roleFilter);
    },
    [loadPreset],
  );

  const onSavePreset = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    const name = window.prompt('Tên bộ lọc?', 'Bộ lọc của tôi');
    if (!name || !name.trim()) return;
    savePreset(name, { search, roleFilter });
    showFlash('ok', `Đã lưu bộ lọc "${name.trim()}"`);
  }, [savePreset, search, roleFilter, showFlash]);

  // "Tạm khoá" = downgrade role to `viewer`. The KV-backed admin user schema
  // has no `status` column, so we model suspension as revoking write privs.
  // TODO(sprint-3): replace with server-side bulk endpoint `POST /admin/users/bulk`
  // that accepts `{ ids: string[], action: 'suspend' }` and writes one audit_log row.
  const runBulkSuspend = React.useCallback(async () => {
    setBulkPending(true);
    const ids = Array.from(bulk.selected);
    let ok = 0;
    let fail = 0;
    for (const id of ids) {
      try {
        const r = await fetch(`/api/admin/users/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'viewer' }),
        });
        const data = await r.json().catch(() => ({ ok: false }));
        if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
        ok += 1;
      } catch {
        fail += 1;
      }
    }
    setBulkPending(false);
    setBulkSuspendOpen(false);
    bulk.clear();
    showFlash(
      fail === 0 ? 'ok' : 'err',
      fail === 0
        ? `Đã tạm khoá ${ok} user (đổi role → viewer)`
        : `Tạm khoá: ${ok} OK · ${fail} lỗi`,
    );
    await refreshAfterMutation();
  }, [bulk, refreshAfterMutation, showFlash]);

  const ownerCount = users.filter((u) => u.role === 'owner').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const viewerCount = users.filter((u) => u.role === 'viewer').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Người dùng admin"
        description={
          <>
            Quản lý danh sách admin login (Cloudflare KV). Role <b className="text-gold">owner</b> không
            thể xóa. Mọi thay đổi ghi vào{' '}
            <code className="font-mono text-foreground/85">audit_log</code>.
          </>
        }
        icon={<Users className="h-5 w-5" />}
        badge={
          users.length > 0 ? (
            <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 font-mono text-[10px] text-gold">
              {users.length} user
            </span>
          ) : null
        }
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                exportToCSV(
                  filtered.map((u) => ({
                    id: u.id,
                    email: u.email,
                    role: u.role,
                    created_at: u.created_at,
                  })),
                  fmtCsvFilename('users'),
                  { id: 'ID', email: 'Email', role: 'Role', created_at: 'Tạo lúc' },
                )
              }
              disabled={filtered.length === 0}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Xuất CSV
            </Button>
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Thêm user
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Tổng admin"
          value={users.length}
          icon={<Users className="h-4 w-4" />}
          accent="gold"
          hint="tài khoản"
        />
        <KpiCard
          label="Owner"
          value={ownerCount}
          icon={<Crown className="h-4 w-4" />}
          accent="gold"
          hint="full quyền"
        />
        <KpiCard
          label="Admin"
          value={adminCount}
          icon={<Shield className="h-4 w-4" />}
          accent="purple"
          hint="CRUD users"
        />
        <KpiCard
          label="Viewer"
          value={viewerCount}
          icon={<Eye className="h-4 w-4" />}
          accent="jade"
          hint="chỉ đọc"
        />
      </div>

      {flash && (
        <div
          className={cn(
            'rounded-md border px-3 py-2 text-sm',
            flash.kind === 'ok'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/40 bg-red-500/10 text-red-300',
          )}
        >
          {flash.msg}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bộ lọc</CardTitle>
          <div className="mt-2 flex flex-col gap-3">
            <div className="relative max-w-sm">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                ref={searchRef}
                placeholder="Tìm email…   (phím /)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {ROLE_FILTERS.map((f) => {
                const active = roleFilter === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setRoleFilter(f.value)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      active
                        ? 'border-gold/60 bg-gold/15 text-gold'
                        : 'border-border bg-card/60 text-muted-foreground hover:border-gold/30 hover:text-foreground',
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
              <div className="ml-auto flex items-center gap-1.5">
                {presets.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) onApplyPreset(e.target.value);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="h-7 rounded-md border border-gold/20 bg-card/60 px-2 text-xs text-foreground focus:border-gold focus:outline-none"
                    aria-label="Chọn bộ lọc đã lưu"
                  >
                    <option value="" disabled>
                      Bộ lọc đã lưu…
                    </option>
                    {presets.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
                {presets.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (!e.target.value) return;
                      if (window.confirm(`Xoá bộ lọc "${e.target.value}"?`)) {
                        deletePreset(e.target.value);
                        showFlash('ok', `Đã xoá bộ lọc "${e.target.value}"`);
                      }
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="h-7 rounded-md border border-red-400/20 bg-card/60 px-2 text-xs text-red-300 focus:border-red-400 focus:outline-none"
                    aria-label="Xoá bộ lọc đã lưu"
                  >
                    <option value="" disabled>
                      Xoá…
                    </option>
                    {presets.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  type="button"
                  onClick={onSavePreset}
                  className="inline-flex h-7 items-center gap-1 rounded-md border border-gold/20 bg-card/60 px-2 text-xs text-foreground/85 hover:border-gold/50 hover:text-gold"
                  title="Lưu search + role hiện tại thành preset"
                >
                  <BookmarkPlus className="h-3 w-3" />
                  Lưu bộ lọc
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="mb-4 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          {loading ? (
            <div className="space-y-2 py-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-muted/30" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title={
                users.length === 0
                  ? 'Chưa có user admin'
                  : 'Không có user khớp bộ lọc'
              }
              description={
                users.length === 0
                  ? 'Click "Thêm user" để tạo tài khoản đầu tiên (vai trò Owner / Admin / Viewer).'
                  : 'Thử bỏ filter hoặc xóa search query.'
              }
              className="border-0 bg-transparent"
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gold/15 bg-card/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left">
                    <th className="w-10 px-3 py-3">
                      <input
                        type="checkbox"
                        checked={bulk.allSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = bulk.someSelected;
                        }}
                        onChange={bulk.toggleAll}
                        disabled={selectable.length === 0}
                        aria-label="Chọn tất cả user (trừ owner)"
                        className="h-4 w-4 cursor-pointer rounded border-gold/30 bg-card/60 text-gold accent-gold disabled:cursor-not-allowed disabled:opacity-30"
                      />
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-gold/80">
                      Email
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-gold/80" style={{ width: '120px' }}>
                      Role
                    </th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-gold/80" style={{ width: '180px' }}>
                      Tạo lúc
                    </th>
                    <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-gold/80" style={{ width: '200px' }}>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => {
                    const RoleIcon = ROLE_ICON[u.role];
                    const isOwner = u.role === 'owner';
                    const isSelected = bulk.isSelected(u.id);
                    return (
                      <tr
                        key={u.id}
                        className={cn(
                          'border-b border-gold/10 transition-colors last:border-0 hover:bg-gold/[0.03]',
                          isSelected && 'bg-gold/5',
                        )}
                      >
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isOwner}
                            onChange={() => bulk.toggle(u.id)}
                            aria-label={`Chọn ${u.email}`}
                            className="h-4 w-4 cursor-pointer rounded border-gold/30 bg-card/60 text-gold accent-gold disabled:cursor-not-allowed disabled:opacity-30"
                            title={isOwner ? 'Không thể chọn owner' : 'Chọn'}
                          />
                        </td>
                        <td className="px-4 py-3 text-foreground">{u.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-medium',
                              ROLE_TONE[u.role],
                            )}
                          >
                            <RoleIcon className="h-3 w-3" />
                            {ROLE_LABEL[u.role]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-mono text-xs text-foreground/85" title={u.created_at}>
                            {fmtDate(u.created_at)}
                          </div>
                          <div className="font-mono text-[10px] text-muted-foreground">
                            {fmtRelative(u.created_at)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setAuditUser(u)}
                              className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                              title="Xem audit log"
                            >
                              <History className="h-3 w-3" />
                              Log
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditing(u)}
                              className="inline-flex items-center gap-1 rounded border border-gold/30 px-2 py-1 text-xs text-gold hover:bg-gold/10"
                            >
                              <Pencil className="h-3 w-3" />
                              Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleting(u)}
                              disabled={u.role === 'owner'}
                              className="inline-flex items-center gap-1 rounded border border-red-500/30 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                              title={u.role === 'owner' ? 'Không thể xóa owner' : 'Xóa'}
                            >
                              <Trash2 className="h-3 w-3" />
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
            // Defensive: middleware used to 307-redirect API calls to /login,
            // which `fetch` follows transparently and returns HTML. `r.json()`
            // then threw "Unexpected token '<', \"<!DOCTYPE\"..." and the UI
            // stuck on "Đang lưu…". Fixed in middleware.ts (JSON 401 for /api/*),
            // but keep this guard so any other HTML leak (Vercel timeout page,
            // CF 5xx, etc.) surfaces a readable error instead of a parse crash.
            const ct = r.headers.get('content-type') ?? '';
            if (!ct.includes('application/json')) {
              if (r.status === 401 || r.redirected) {
                throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
              }
              throw new Error(`Lỗi server (HTTP ${r.status}). Thử lại sau.`);
            }
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

      {/* Floating bulk action bar */}
      {bulk.count > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:left-[calc(50%+8rem)]">
          <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-card/95 px-3 py-2 shadow-2xl backdrop-blur">
            <span className="px-2 font-mono text-xs text-gold">{bulk.count} đã chọn</span>
            <Button
              size="sm"
              onClick={() => setBulkSuspendOpen(true)}
              disabled={bulkPending}
              className="bg-amber-500/90 text-ink hover:bg-amber-500"
            >
              <Lock className="mr-1.5 h-3.5 w-3.5" />
              Tạm khoá {bulk.count} user
            </Button>
            <Button size="sm" variant="ghost" onClick={bulk.clear}>
              Bỏ chọn
            </Button>
          </div>
        </div>
      )}

      {bulkSuspendOpen && (
        <BulkSuspendConfirm
          count={bulk.count}
          pending={bulkPending}
          onClose={() => setBulkSuspendOpen(false)}
          onConfirm={runBulkSuspend}
        />
      )}

      <AuditLogDrawer
        resourceId={auditUser?.id ?? null}
        resourceLabel={auditUser?.email}
        resourceType="user"
        open={!!auditUser}
        onClose={() => setAuditUser(null)}
        limit={10}
      />
    </div>
  );
}

function BulkSuspendConfirm({
  count,
  pending,
  onClose,
  onConfirm,
}: {
  count: number;
  pending: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !pending) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, pending]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={pending ? undefined : onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-amber-500/30 bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading text-xl text-foreground">Tạm khoá {count} user?</h2>
        <p className="mt-3 text-sm text-foreground/85">
          Sẽ đổi role thành <b className="text-foreground">viewer</b> (chỉ đọc) cho{' '}
          <b className="text-foreground">{count} user</b>. User vẫn đăng nhập được nhưng không thao tác
          được. Owner không bị ảnh hưởng.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {count} request PATCH chạy tuần tự. Bulk endpoint server-side sẽ có ở Sprint 3.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={pending}>
            Hủy
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={pending}
            className="bg-amber-500/90 text-ink hover:bg-amber-500"
          >
            {pending ? 'Đang xử lý…' : `Tạm khoá ${count} user`}
          </Button>
        </div>
      </div>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
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
          {err && (
            <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {err}
            </p>
          )}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
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
          <p className="mt-3 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {err}
          </p>
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
