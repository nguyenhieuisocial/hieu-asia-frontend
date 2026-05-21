'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn, toast } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import {
  ReportsSection,
  MentorSessionsSection,
  PlanSection,
  SettingsSection,
  type DashboardReport,
  type MentorSession,
  type PlanUsage,
  type SettingsState,
} from '@/components/dashboard-sections';
import { getOrCreateAnonUserId, listReadings } from '@hieu-asia/supabase';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { EmptyState } from '@/components/ui/EmptyState';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

// V1 mock: assume logged-in user. Real auth wired in Phase 2.
const MOCK_USER = { name: 'Anh Minh', email: 'minh@example.com' };

function formatVnDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function rowToReport(row: {
  session_id: string;
  state_json: { birth_data?: { primary_concern?: string | null; birth_place?: string }; status?: string };
  updated_at: string;
}): DashboardReport {
  const status: DashboardReport['status'] =
    row.state_json.status === 'completed' ? 'completed' :
    row.state_json.status === 'failed' ? 'failed' :
    'running';
  return {
    id: row.session_id,
    date: formatVnDate(row.updated_at),
    primary_concern:
      row.state_json.birth_data?.primary_concern ||
      `Báo cáo cho ${row.state_json.birth_data?.birth_place ?? '—'}`,
    status,
  };
}

const MOCK_SESSIONS: MentorSession[] = [
  {
    id: 's1',
    reading_id: 'demo-task-001',
    message_count: 12,
    last_message_preview:
      'Tôi gợi ý chia 7 ngày tới thành 3 giai đoạn: stabilize cash, talk to team…',
    last_active: '2 giờ trước',
  },
  {
    id: 's2',
    reading_id: 'demo-task-002',
    message_count: 5,
    last_message_preview: 'Trước khi mở chi nhánh mới, hãy kiểm tra 3 chỉ số…',
    last_active: '2 tháng trước',
  },
];

const MOCK_PLAN: PlanUsage = {
  plan_name: 'Gói Mentor Tháng',
  mentor_used: 17,
  mentor_limit: 60,
};

const MOCK_SETTINGS: SettingsState = {
  email_notifications: true,
  telegram_notifications: false,
  language: 'vi',
};

type SectionId = 'reports' | 'mentor' | 'plan' | 'settings';

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'reports', label: 'Báo cáo của tôi' },
  { id: 'mentor', label: 'Lịch sử Mentor' },
  { id: 'plan', label: 'Gói & Lượt dùng' },
  { id: 'settings', label: 'Cài đặt & Quyền riêng tư' },
];

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}

function DashboardContent() {
  const [active, setActive] = React.useState<SectionId>('reports');
  const [reports, setReports] = React.useState<DashboardReport[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const userId = getOrCreateAnonUserId();
    if (!userId) {
      setLoading(false);
      return;
    }
    listReadings(userId)
      .then((rows) => setReports(rows.map(rowToReport)))
      .catch((e) => {
        console.warn('listReadings failed:', e);
        setReports([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink text-cream">
        <SiteNav />
        <div className="pt-16">
          <DashboardSkeleton />
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden bg-ink-radial pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-[-10%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-3xl"
        />
        <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-cream/55">
            <Link href="/" className="hover:text-gold">Trang chủ</Link>
            <span className="mx-1.5">/</span>
            <span className="text-cream/70">Bảng điều khiển</span>
          </nav>
          <header className="mb-8 flex items-center gap-4">
            <div
              aria-hidden
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gradient-to-br from-gold/20 via-ink to-purple/20 font-heading text-lg text-gold"
            >
              {MOCK_USER.name.charAt(0)}
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/80">
                Chào,
              </p>
              <h1 className="mt-1 font-heading text-2xl text-cream sm:text-3xl">
                {MOCK_USER.name}
              </h1>
            </div>
          </header>

          <nav
          role="tablist"
          aria-label="Mục bảng điều khiển"
          className="mb-6 flex flex-wrap gap-2 border-b border-gold/15 pb-3"
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={active === s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active === s.id
                  ? 'bg-gold/15 text-gold'
                  : 'text-cream/70 hover:bg-gold/5 hover:text-cream',
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <section role="tabpanel">
          {active === 'reports' && (
            reports.length === 0 ? (
              <EmptyState
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
                  </svg>
                }
                title="Chưa có lá số nào"
                description="Mở khóa lá số đầu tiên — chỉ mất 5 phút."
                action={{ label: 'Mở khóa lá số', href: '/onboarding' }}
              />
            ) : (
              <ReportsSection items={reports} />
            )
          )}
          {active === 'mentor' && (
            <MentorSessionsSection sessions={MOCK_SESSIONS} />
          )}
          {active === 'plan' && <PlanSection usage={MOCK_PLAN} />}
          {active === 'settings' && (
            <SettingsSection
              initial={MOCK_SETTINGS}
              onExport={() => {
                toast.info('Xuất dữ liệu', {
                  description:
                    'Tính năng sẽ mở sau khi backend triển khai endpoint /v1/users/me/data.',
                });
              }}
              onDelete={async () => {
                toast.success('Đã ghi nhận yêu cầu xoá dữ liệu', {
                  description: 'Backend sẽ xử lý trong vòng 72 giờ.',
                });
              }}
            />
          )}
        </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
