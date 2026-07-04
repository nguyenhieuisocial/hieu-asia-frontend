'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  cn,
} from '@hieu-asia/ui';
import {
  Crown,
  Shield,
  Eye,
  Pencil,
  Trash2,
  Search,
  History,
  BookmarkPlus,
  MoreHorizontal,
} from 'lucide-react';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { EditableCell } from '@/components/admin/EditableCell';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import type { useBulkSelection } from '@/lib/bulk-action';
import type { useSavedFilters } from '@/lib/saved-filters';
import { fmtDateTime, fmtRelative } from '@/lib/format';

export type AdminRole = 'owner' | 'admin' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

export const ROLE_LABEL: Record<AdminRole, string> = {
  owner: 'Chủ sở hữu',
  admin: 'Quản trị',
  viewer: 'Chỉ đọc',
};

const ROLE_TONE: Record<AdminRole, string> = {
  owner: 'bg-gold/15 text-gold border-gold/30',
  admin: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
  viewer: 'bg-muted/40 text-muted-foreground border-border',
};

const ROLE_ICON: Record<AdminRole, React.ComponentType<{ className?: string }>> = {
  owner: Crown,
  admin: Shield,
  viewer: Eye,
};

const ROLE_FILTERS: Array<{ value: 'all' | AdminRole; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'owner', label: 'Chủ sở hữu' },
  { value: 'admin', label: 'Quản trị' },
  { value: 'viewer', label: 'Chỉ đọc' },
];

type BulkSelection = ReturnType<typeof useBulkSelection<AdminUser>>;
type SavedFilters = ReturnType<
  typeof useSavedFilters<{ search: string; roleFilter: 'all' | AdminRole }>
>;

export interface UsersListProps {
  users: AdminUser[];
  filtered: AdminUser[];
  selectable: AdminUser[];
  loading: boolean;
  error: string | null;
  search: string;
  roleFilter: 'all' | AdminRole;
  searchRef: React.RefObject<HTMLInputElement | null>;
  bulk: BulkSelection;
  presets: SavedFilters['presets'];
  onSearchChange: (v: string) => void;
  onRoleFilterChange: (v: 'all' | AdminRole) => void;
  onApplyPreset: (name: string) => void;
  onDeletePreset: (name: string) => void;
  onSavePreset: () => void;
  onRetry: () => void;
  onRoleInlineSave: (user: AdminUser, newRole: AdminRole) => Promise<void>;
  onOpenAudit: (user: AdminUser) => void;
  onOpenEdit: (user: AdminUser) => void;
  onOpenDelete: (user: AdminUser) => void;
}

export function UsersList({
  users,
  filtered,
  selectable,
  loading,
  error,
  search,
  roleFilter,
  searchRef,
  bulk,
  presets,
  onSearchChange,
  onRoleFilterChange,
  onApplyPreset,
  onDeletePreset,
  onSavePreset,
  onRetry,
  onRoleInlineSave,
  onOpenAudit,
  onOpenEdit,
  onOpenDelete,
}: UsersListProps) {
  // Custom leading checkbox column (NOT AdminTable's onBulkSelect) so we keep
  // the external `bulk` state, the owner-exclusion (owner rows non-selectable),
  // and the indeterminate select-all header — none of which AdminTable's own
  // selection model expresses.
  const columns: AdminTableColumn<AdminUser>[] = [
    {
      id: 'select',
      className: 'w-10',
      header: (
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
      ),
      cell: (u) => (
        <input
          type="checkbox"
          checked={bulk.isSelected(u.id)}
          disabled={u.role === 'owner'}
          onChange={() => bulk.toggle(u.id)}
          aria-label={`Chọn ${u.email}`}
          className="h-4 w-4 cursor-pointer rounded border-gold/30 bg-card/60 text-gold accent-gold disabled:cursor-not-allowed disabled:opacity-30"
          title={u.role === 'owner' ? 'Không thể chọn owner' : 'Chọn'}
        />
      ),
    },
    {
      id: 'email',
      header: 'Email',
      cell: (u) => <span className="text-foreground">{u.email}</span>,
    },
    {
      id: 'role',
      header: 'Vai trò',
      width: '120px',
      cell: (u) => (
        // Wave 60.10 — inline-edit role (admin↔viewer only). Owner stays
        // modal-only because promote/demote-owner needs the confirmation flow.
        <EditableCell
          variant="select"
          value={u.role}
          disabled={u.role === 'owner'}
          disabledReason="Owner role chỉ đổi qua modal Sửa"
          ariaLabel="Role"
          breadcrumbTag="users.role"
          options={[
            { value: 'admin', label: ROLE_LABEL.admin },
            { value: 'viewer', label: ROLE_LABEL.viewer },
          ]}
          onSave={async (newRole) => {
            await onRoleInlineSave(u, newRole as AdminRole);
          }}
          display={(v) => {
            const Icon = ROLE_ICON[v as AdminRole];
            return (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-medium',
                  ROLE_TONE[v as AdminRole],
                )}
              >
                <Icon className="h-3 w-3" />
                {ROLE_LABEL[v as AdminRole]}
              </span>
            );
          }}
        />
      ),
    },
    {
      id: 'created',
      header: 'Tạo lúc',
      width: '180px',
      cell: (u) => (
        <>
          <div className="font-mono text-xs text-foreground/85" title={u.created_at}>
            {fmtDateTime(u.created_at)}
          </div>
          <div className="font-mono text-[10px] text-muted-foreground">
            {fmtRelative(u.created_at)}
          </div>
        </>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      width: '200px',
      className: 'text-right',
      cell: (u) => (
        // Wave 60.68 — DropdownMenu primitive replaces the 3-button inline row.
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Mở menu thao tác cho ${u.email}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded border border-gold/20 bg-card/60 text-muted-foreground hover:border-gold/50 hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[10rem]">
            <DropdownMenuItem onSelect={() => onOpenAudit(u)}>
              <History className="h-4 w-4 text-muted-foreground" />
              Xem audit log
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onOpenEdit(u)}>
              <Pencil className="h-4 w-4 text-gold" />
              Sửa user
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={u.role === 'owner'}
              onSelect={() => onOpenDelete(u)}
              className="text-red-700 dark:text-red-300 focus:bg-red-500/10 focus:text-red-700 dark:focus:text-red-200"
            >
              <Trash2 className="h-4 w-4" />
              {u.role === 'owner' ? 'Không thể xóa owner' : 'Xóa user'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
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
                  onClick={() => onRoleFilterChange(f.value)}
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
                      onDeletePreset(e.target.value);
                    }
                    e.target.value = '';
                  }}
                  defaultValue=""
                  className="h-7 rounded-md border border-red-400/20 bg-card/60 px-2 text-xs text-red-700 dark:text-red-300 focus:border-red-400 focus:outline-none"
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
          <div className="mb-4">
            <ErrorBlock compact message={error} onRetry={onRetry} />
          </div>
        )}
        {loading ? (
          <div className="space-y-2 py-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted/30" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={users.length === 0 ? 'Chưa có user admin' : 'Không có user khớp bộ lọc'}
            description={
              users.length === 0
                ? 'Click "Thêm user" để tạo tài khoản đầu tiên (vai trò Owner / Admin / Viewer).'
                : 'Thử bỏ filter hoặc xóa search query.'
            }
            className="border-0 bg-transparent"
          />
        ) : (
          <AdminTable
            rows={filtered}
            columns={columns}
            getRowId={(u) => u.id}
            rowClassName={(u) =>
              cn('hover:bg-gold/[0.03]', bulk.isSelected(u.id) && 'bg-gold/5')
            }
            caption="Danh sách user admin"
          />
        )}
      </CardContent>
    </Card>
  );
}
