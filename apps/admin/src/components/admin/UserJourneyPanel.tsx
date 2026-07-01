'use client';

// "Nguồn & hành trình" — per-user attribution + event timeline from PostHog
// (server-only HogQL via /api/admin/users/:id/journey). Surfaces, for a given
// user, where they came from + the steps they took, without opening PostHog.
// Anon users carry an `anon-<session_id>` distinct_id; the route handles both.
//
// Extracted from sessions/[id] so the customer-detail page (CDP) can reuse the
// exact same panel — the route + HogQL client + distinct_id are already in place.

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { UserRound } from 'lucide-react';

interface UserJourneySource {
  firstTouchSource: string | null;
  firstTouchMedium: string | null;
  firstTouchCampaign: string | null;
  initialReferringDomain: string | null;
  firstTouchAffiliate: string | null;
  lastTouchSource: string | null;
  lastTouchMedium: string | null;
  lastTouchCampaign: string | null;
}

interface UserJourneyEvent {
  event: string;
  timestamp: string;
  url: string | null;
}

interface UserDeviceProfile {
  browser: string | null;
  os: string | null;
  deviceType: string | null;
  country: string | null;
  city: string | null;
  totalEvents: number;
  activeDays: number;
  lastSeen: string | null;
}

interface UserEngagement {
  firstSeen: string | null;
  sessions: number;
  pageviews: number;
  toolsUsed: number;
  payments: number;
  revenue: number;
}

export interface UserJourneyResp {
  ok: boolean;
  configured: boolean;
  source: UserJourneySource | null;
  events: UserJourneyEvent[];
  profile: UserDeviceProfile | null;
  engagement: UserEngagement | null;
}

export async function fetchUserJourney(userId: string): Promise<UserJourneyResp> {
  try {
    const r = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/journey`, {
      cache: 'no-store',
    });
    const data = await r.json();
    return data as UserJourneyResp;
  } catch {
    return { ok: false, configured: false, source: null, events: [], profile: null, engagement: null };
  }
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { dateStyle: 'medium' });
}

function fmtVnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

// Friendly Vietnamese labels for the PostHog events. Unknown events fall back to
// the raw name so future events still render.
const JOURNEY_EVENT_LABEL: Record<string, string> = {
  $pageview: 'Ghé trang',
  $pageleave: 'Rời trang',
  tool_used: 'Dùng công cụ',
  reading_session_created: 'Tạo lá số',
  report_viewed: 'Xem báo cáo',
  payment_completed: '💰 Thanh toán',
  payment_intent_created: 'Tạo lệnh thanh toán',
  result_shared: 'Chia sẻ kết quả',
  signup_completed: 'Đăng ký',
  signin_completed: 'Đăng nhập',
  user_identified: 'Nhận diện người dùng',
  pricing_cta_clicked: 'Bấm nút mua',
  sticky_cta_clicked: 'Bấm CTA dính',
  sticky_cta_shown: 'Hiện CTA dính',
  sticky_cta_dismissed: 'Đóng CTA dính',
  onboarding_intent_seed: 'Vào phễu mua',
  mentor_message_sent: 'Nhắn Mentor',
  survey_completed: 'Làm khảo sát',
  'survey sent': 'Nhận khảo sát',
  master_build_started: 'Dựng báo cáo lớn',
  master_pdf_downloaded: 'Tải PDF',
  daily_checkin: 'Điểm danh hằng ngày',
  feedback_submitted: 'Gửi phản hồi',
};

function journeyEventLabel(event: string): string {
  return JOURNEY_EVENT_LABEL[event] ?? event;
}

/** Path-only view of a $current_url (drops origin + query for compactness). */
function journeyPath(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

/** Compact "nguồn" string like "google / cpc / tet-2026", omitting blanks. */
function fmtTouch(
  source: string | null,
  medium: string | null,
  campaign: string | null,
): string | null {
  const parts = [source, medium, campaign].filter((p): p is string => !!p);
  return parts.length > 0 ? parts.join(' / ') : null;
}

export function UserJourneyPanel({ userId }: { userId: string }) {
  const journey = useQuery({
    queryKey: ['user-journey', userId],
    queryFn: () => fetchUserJourney(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });

  const data = journey.data;
  const source = data?.source ?? null;
  const events = data?.events ?? [];
  const profile = data?.profile ?? null;
  const engagement = data?.engagement ?? null;
  const firstTouch = source
    ? fmtTouch(source.firstTouchSource, source.firstTouchMedium, source.firstTouchCampaign)
    : null;
  const lastTouch = source
    ? fmtTouch(source.lastTouchSource, source.lastTouchMedium, source.lastTouchCampaign)
    : null;
  const hasSource =
    !!firstTouch ||
    !!lastTouch ||
    !!source?.initialReferringDomain ||
    !!source?.firstTouchAffiliate;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-gold/70" aria-hidden />
          Nguồn & hành trình
        </CardTitle>
        <CardDescription>
          Khách đến từ đâu + các bước họ đã làm (lấy từ PostHog cho người dùng này).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {journey.isLoading ? (
          <div className="space-y-2 py-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-muted/30" />
            ))}
          </div>
        ) : data && data.configured === false ? (
          <p className="text-xs italic text-muted-foreground">
            Cần <code className="font-mono text-gold/70">POSTHOG_PERSONAL_API_KEY</code> để xem hành trình.
          </p>
        ) : (
          <>
            {/* Tương tác — engagement snapshot (sessions / pageviews / tools /
                paid) từ PostHog, 365 ngày. Tóm tắt "khách này gắn bó tới đâu"
                ngay đầu panel, trước chi tiết thiết bị & hành trình. */}
            {engagement && (
              <div className="space-y-2">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tương tác (365 ngày)
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded-lg border border-border/60 bg-card/40 px-3 py-2">
                    <div className="text-lg font-semibold text-foreground">
                      {engagement.sessions.toLocaleString('vi-VN')}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Phiên</div>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-card/40 px-3 py-2">
                    <div className="text-lg font-semibold text-foreground">
                      {engagement.pageviews.toLocaleString('vi-VN')}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Lượt xem</div>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-card/40 px-3 py-2">
                    <div className="text-lg font-semibold text-foreground">
                      {engagement.toolsUsed.toLocaleString('vi-VN')}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Dùng công cụ</div>
                  </div>
                  <div
                    className={
                      'rounded-lg border px-3 py-2 ' +
                      (engagement.payments > 0
                        ? 'border-gold/40 bg-gold/10'
                        : 'border-border/60 bg-card/40')
                    }
                  >
                    <div
                      className={
                        'text-lg font-semibold ' +
                        (engagement.payments > 0 ? 'text-gold' : 'text-foreground')
                      }
                    >
                      {engagement.payments > 0 ? fmtVnd(engagement.revenue) : '—'}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {engagement.payments > 0 ? `Đã trả · ${engagement.payments} lần` : 'Chưa trả'}
                    </div>
                  </div>
                </div>
                {engagement.firstSeen && (
                  <p className="text-xs text-muted-foreground">
                    Lần đầu thấy:{' '}
                    <span className="font-mono text-foreground/80" title={engagement.firstSeen}>
                      {fmtDate(engagement.firstSeen)}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Thiết bị & vị trí — PostHog auto-props ($browser/$os/$device_type/$geoip_*).
                Lấp chỗ DB thiếu metadata cho phiên cũ / kênh không phải web. */}
            {profile && (
              <div className="space-y-2">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Thiết bị &amp; vị trí
                </h3>
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  {(profile.city || profile.country) && (
                    <div className="space-y-0.5">
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Vị trí</dt>
                      <dd className="font-mono text-foreground/90">
                        {[profile.city, profile.country].filter(Boolean).join(', ')}
                      </dd>
                    </div>
                  )}
                  {(profile.deviceType || profile.os || profile.browser) && (
                    <div className="space-y-0.5">
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Thiết bị</dt>
                      <dd className="font-mono text-foreground/90">
                        {[profile.deviceType, profile.os, profile.browser].filter(Boolean).join(' · ')}
                      </dd>
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Hoạt động 90 ngày
                    </dt>
                    <dd className="font-mono text-foreground/90">
                      {profile.totalEvents.toLocaleString('vi-VN')} sự kiện · {profile.activeDays} ngày
                    </dd>
                  </div>
                  {profile.lastSeen && (
                    <div className="space-y-0.5">
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Gần nhất</dt>
                      <dd className="font-mono text-foreground/90" title={profile.lastSeen}>
                        {fmtDateTime(profile.lastSeen)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Nguồn — đến từ đâu */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Đến từ đâu
              </h3>
              {hasSource ? (
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  {firstTouch && (
                    <div className="space-y-0.5">
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Lần đầu</dt>
                      <dd className="font-mono text-foreground/90">{firstTouch}</dd>
                    </div>
                  )}
                  {lastTouch && (
                    <div className="space-y-0.5">
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Gần nhất</dt>
                      <dd className="font-mono text-foreground/90">{lastTouch}</dd>
                    </div>
                  )}
                  {source?.initialReferringDomain && (
                    <div className="space-y-0.5">
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Trang giới thiệu
                      </dt>
                      <dd className="font-mono text-foreground/90">{source.initialReferringDomain}</dd>
                    </div>
                  )}
                  {source?.firstTouchAffiliate && (
                    <div className="space-y-0.5">
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Affiliate</dt>
                      <dd className="font-mono text-gold/90">{source.firstTouchAffiliate}</dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">Đến trực tiếp (không có nguồn theo dõi).</p>
              )}
            </div>

            {/* Hành trình — timeline các sự kiện */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Hành trình
              </h3>
              {events.length === 0 ? (
                <p className="text-sm italic text-muted-foreground">
                  Chưa có dữ liệu hành trình cho người này. (PostHog đã kết nối — sẽ hiện khi có sự kiện.)
                </p>
              ) : (
                <ol className="relative space-y-3 border-l border-gold/15 pl-4">
                  {events.map((e, i) => {
                    const path = journeyPath(e.url);
                    return (
                      <li key={`${e.timestamp}-${i}`} className="relative">
                        <span
                          className="absolute -left-[1.3125rem] top-1.5 h-2 w-2 rounded-full border border-gold/40 bg-gold/30"
                          aria-hidden
                        />
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="text-sm font-medium text-foreground/90">
                            {journeyEventLabel(e.event)}
                          </span>
                          {e.timestamp && (
                            <span className="font-mono text-[11px] text-muted-foreground" title={e.timestamp}>
                              {fmtDateTime(e.timestamp)}
                            </span>
                          )}
                        </div>
                        {path && (
                          <div
                            className="truncate font-mono text-[11px] text-muted-foreground"
                            title={e.url ?? undefined}
                          >
                            {path}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
