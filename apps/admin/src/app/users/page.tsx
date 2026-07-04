'use client';

import * as React from 'react';
import { Button, cn } from '@hieu-asia/ui';
import { Users, Crown, Shield, Eye, Plus, Download } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { exportToCSV, fmtCsvFilename } from '@/lib/csv-export';
import { useBulkSelection } from '@/lib/bulk-action';
import { useSavedFilters } from '@/lib/saved-filters';
import { trackAdminMutation } from '@/lib/admin-breadcrumb';
import {
  UsersList,
  ROLE_LABEL,
  type AdminRole,
  type AdminUser,
} from '@/components/admin/users/UsersList';
import {
  UserFormModal,
  ConfirmDeleteModal,
  UserAuditDrawer,
} from '@/components/admin/users/UserDialogs';
import { BulkBar, BulkSuspendConfirm } from '@/components/admin/users/BulkBar';

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

  const onDeletePreset = React.useCallback(
    (name: string) => {
      deletePreset(name);
      showFlash('ok', `Đã xoá bộ lọc "${name}"`);
    },
    [deletePreset, showFlash],
  );

  const onSavePreset = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    const name = window.prompt('Tên bộ lọc?', 'Bộ lọc của tôi');
    if (!name || !name.trim()) return;
    savePreset(name, { search, roleFilter });
    showFlash('ok', `Đã lưu bộ lọc "${name.trim()}"`);
  }, [savePreset, search, roleFilter, showFlash]);

  const onRoleInlineSave = React.useCallback(
    async (u: AdminUser, role: AdminRole) => {
      const r = await fetch(`/api/admin/users/${u.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
      // Optimistic local update + flash; full refresh happens via existing
      // mutation refresh path on next user action (avoids extra fetch per cell).
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role } : x)));
      showFlash('ok', `${u.email} → ${ROLE_LABEL[role]}`);
    },
    [showFlash],
  );

  // "Tạm khoá" = downgrade role to `viewer`. The KV-backed admin user schema
  // has no `status` column, so we model suspension as revoking write privs.
  // TODO(sprint-3): replace with server-side bulk endpoint `POST /admin/users/bulk`
  // that accepts `{ ids: string[], action: 'suspend' }` and writes one audit_log row.
  const runBulkSuspend = React.useCallback(async () => {
    setBulkPending(true);
    const ids = Array.from(bulk.selected);
    const t0 = Date.now();
    // Wave 60.14/60.16 — Sentry breadcrumb via shared helper. PII-safe.
    trackAdminMutation('users.bulk-suspend', 'attempt', { count: ids.length });
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
    trackAdminMutation(
      'users.bulk-suspend',
      'result',
      { ok, fail, duration_ms: Date.now() - t0 },
      fail > 0 ? 'warning' : 'info',
    );
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
          label="Chủ sở hữu"
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
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300',
          )}
        >
          {flash.msg}
        </div>
      )}

      <UsersList
        users={users}
        filtered={filtered}
        selectable={selectable}
        loading={loading}
        error={error}
        search={search}
        roleFilter={roleFilter}
        searchRef={searchRef}
        bulk={bulk}
        presets={presets}
        onSearchChange={setSearch}
        onRoleFilterChange={setRoleFilter}
        onApplyPreset={onApplyPreset}
        onDeletePreset={onDeletePreset}
        onSavePreset={onSavePreset}
        onRetry={load}
        onRoleInlineSave={onRoleInlineSave}
        onOpenAudit={setAuditUser}
        onOpenEdit={setEditing}
        onOpenDelete={setDeleting}
      />

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
            // Wave 60.14 — Sentry breadcrumb for destructive admin action.
            // PII-safe: no email in breadcrumb data; only outcome tag.
            const t0 = Date.now();
            try {
              const r = await fetch(`/api/admin/users/${deleting.id}`, { method: 'DELETE' });
              const data = await r.json();
              if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
              trackAdminMutation('users.delete', 'success', { duration_ms: Date.now() - t0 });
              setDeleting(null);
              showFlash('ok', `Đã xóa ${deleting.email}`);
              await refreshAfterMutation();
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Xóa thất bại';
              trackAdminMutation('users.delete', 'failure', {
                duration_ms: Date.now() - t0,
                error: msg.slice(0, 200),
              });
              throw err; // re-throw so ConfirmDeleteModal still surfaces the error
            }
          }}
        />
      )}

      <BulkBar
        count={bulk.count}
        pending={bulkPending}
        onSuspend={() => setBulkSuspendOpen(true)}
        onClear={bulk.clear}
      />

      {bulkSuspendOpen && (
        <BulkSuspendConfirm
          count={bulk.count}
          pending={bulkPending}
          onClose={() => setBulkSuspendOpen(false)}
          onConfirm={runBulkSuspend}
        />
      )}

      <UserAuditDrawer user={auditUser} onClose={() => setAuditUser(null)} />
    </div>
  );
}
