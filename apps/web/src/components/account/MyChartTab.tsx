'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  toast,
} from '@hieu-asia/ui';
import { safeJson } from '@/lib/safe-json';

const ONBOARDING_KEY = 'hieu:onboarding:v2';
const CHART_KEY = 'hieu:chart:profile:v1';

interface ChartProfile {
  full_name?: string;
  gender?: 'nam' | 'nữ' | 'khác' | 'không nói' | '';
  birth_date?: string; // YYYY-MM-DD solar
  birth_time?: string; // HH:MM
  birth_place?: string;
  birth_date_lunar?: string; // computed display
  latest_reading_id?: string;
  updated_at?: string;
}

const EMPTY: ChartProfile = {
  full_name: '',
  gender: '',
  birth_date: '',
  birth_time: '',
  birth_place: '',
  birth_date_lunar: '',
  latest_reading_id: '',
  updated_at: '',
};

function loadLocal(): ChartProfile {
  if (typeof window === 'undefined') return EMPTY;
  // First check our own key
  try {
    const raw = window.localStorage.getItem(CHART_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ChartProfile;
      if (parsed && typeof parsed === 'object') return { ...EMPTY, ...parsed };
    }
  } catch {
    /* ignore */
  }
  // Fallback: derive from onboarding v2
  try {
    const raw = window.localStorage.getItem(ONBOARDING_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return {
        ...EMPTY,
        full_name: (parsed.display_name as string) ?? '',
        gender: (parsed.gender as ChartProfile['gender']) ?? '',
        birth_date: (parsed.birth_date as string) ?? '',
        birth_time: (parsed.birth_time as string) ?? '',
        birth_place: (parsed.birth_place as string) ?? '',
      };
    }
  } catch {
    /* ignore */
  }
  return EMPTY;
}

function saveLocal(p: ChartProfile): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CHART_KEY, JSON.stringify(p));
  } catch {
    /* quota — best effort */
  }
}

function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export function MyChartTab() {
  const [profile, setProfile] = React.useState<ChartProfile>(EMPTY);
  const [editing, setEditing] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [draft, setDraft] = React.useState<ChartProfile>(EMPTY);

  React.useEffect(() => {
    // 1) Hydrate from localStorage immediately
    const local = loadLocal();
    setProfile(local);

    // 2) Fetch from API (stub now, worker later); merge if profile present
    fetch('/api/user/profile', { cache: 'no-store' })
      .then(async (r) => {
        const j = await safeJson<{ ok: boolean; profile: ChartProfile | null; updated_at: string | null }>(r);
        if (j.ok && j.data.profile) {
          const merged = { ...local, ...j.data.profile, updated_at: j.data.updated_at ?? local.updated_at };
          setProfile(merged);
          saveLocal(merged);
        }
      })
      .catch(() => {
        /* best-effort */
      });
  }, []);

  function startEdit() {
    setDraft(profile);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(EMPTY);
  }

  async function handleSave() {
    setPending(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const j = await safeJson<{ ok: boolean; profile: ChartProfile; updated_at: string }>(res);
      if (!j.ok) {
        toast.error('Lưu thất bại', { description: `HTTP ${j.status}` });
        return;
      }
      const next: ChartProfile = {
        ...draft,
        updated_at: j.data.updated_at ?? new Date().toISOString(),
      };
      setProfile(next);
      saveLocal(next);
      setEditing(false);
      toast.success('Đã lưu thông tin lá số');
    } catch (err) {
      toast.error('Lỗi mạng', { description: err instanceof Error ? err.message : String(err) });
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      role="tabpanel"
      id="panel-chart"
      aria-labelledby="tab-chart"
      className="space-y-6"
    >
      <div>
        <h2 className="font-heading text-2xl text-cream sm:text-3xl">Lá số của tôi</h2>
        <p className="mt-1 text-sm text-cream/65">
          Thông tin sinh trắc của bạn được lưu lại để không phải nhập lại mỗi lần.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Thông tin sinh</CardTitle>
              <CardDescription>
                Lá số được tính lần cuối: {formatDate(profile.updated_at)}
              </CardDescription>
            </div>
            {!editing && (
              <Button variant="outline" onClick={startEdit}>
                Sửa thông tin
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!editing ? (
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <Field label="Họ tên" value={profile.full_name} />
              <Field label="Giới tính" value={profile.gender} />
              <Field label="Ngày sinh (dương)" value={profile.birth_date} />
              <Field label="Giờ sinh" value={profile.birth_time} />
              <Field label="Nơi sinh" value={profile.birth_place} />
              <Field label="Ngày sinh (âm)" value={profile.birth_date_lunar || '— (sẽ tính khi lập lá số)'} />
            </dl>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Họ tên</Label>
                <Input
                  id="full_name"
                  value={draft.full_name ?? ''}
                  onChange={(e) => setDraft({ ...draft, full_name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gender">Giới tính</Label>
                <select
                  id="gender"
                  value={draft.gender ?? ''}
                  onChange={(e) =>
                    setDraft({ ...draft, gender: e.target.value as ChartProfile['gender'] })
                  }
                  className="flex h-10 w-full rounded-md border border-cream/20 bg-ink/60 px-3 py-2 text-sm text-cream"
                >
                  <option value="">— Chọn —</option>
                  <option value="nam">Nam</option>
                  <option value="nữ">Nữ</option>
                  <option value="khác">Khác</option>
                  <option value="không nói">Không nói</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="birth_date">Ngày sinh dương</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={draft.birth_date ?? ''}
                  onChange={(e) => setDraft({ ...draft, birth_date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="birth_time">Giờ sinh (HH:MM)</Label>
                <Input
                  id="birth_time"
                  type="time"
                  value={draft.birth_time ?? ''}
                  onChange={(e) => setDraft({ ...draft, birth_time: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="birth_place">Nơi sinh</Label>
                <Input
                  id="birth_place"
                  value={draft.birth_place ?? ''}
                  onChange={(e) => setDraft({ ...draft, birth_place: e.target.value })}
                  placeholder="Hà Nội"
                />
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button onClick={handleSave} disabled={pending}>
                  {pending ? 'Đang lưu…' : 'Lưu'}
                </Button>
                <Button variant="ghost" onClick={cancelEdit} disabled={pending}>
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Báo cáo lá số</CardTitle>
          <CardDescription>
            Truy cập báo cáo Tử Vi đầy đủ nhất bạn đã chạy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile.latest_reading_id ? (
            <Button asChild={false}>
              <Link href={`/reading/${profile.latest_reading_id}/report`}>
                Xem lá số đầy đủ
              </Link>
            </Button>
          ) : (
            <p className="text-sm text-cream/60">
              Bạn chưa có phiên đọc nào.{' '}
              <Link href="/onboarding/topic" className="text-gold hover:underline">
                Bắt đầu lập lá số →
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/70">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-cream/90">{value || '—'}</dd>
    </div>
  );
}
