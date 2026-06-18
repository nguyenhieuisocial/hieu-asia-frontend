'use client';

/**
 * ResendEmailDrawer — slide-out detail for ONE Resend record, opened from a row
 * on /infra/resend. Lazily fetches GET /admin/infra/resend/:id (React Query
 * enabled only while open). The worker overloads the id: an email id returns
 * `email` + `timeline`; a domain id returns `domain` + `dns_records`. This drawer
 * renders whichever the envelope carries, so it doubles as the per-domain DNS
 * drill-down. Read-only — no actions.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@hieu-asia/ui';
import { getInfraResendDetail } from '@/lib/admin-api';
import { formatDateOrEmpty } from '@/lib/format-date';
import { ErrorBlock } from '@/components/admin/error-block';
import { InfraStatusPill } from '@/components/admin/infra/infra-panel';
import { dnsStatusTone, domainStatusTone } from './resend-status';

function eventTone(event: string): 'good' | 'bad' | 'warn' | 'neutral' {
  switch (event.toLowerCase()) {
    case 'delivered':
    case 'opened':
    case 'clicked':
      return 'good';
    case 'bounced':
    case 'complained':
    case 'failed':
      return 'bad';
    case 'delivery_delayed':
    case 'queued':
      return 'warn';
    default:
      return 'neutral';
  }
}

function StatLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1.5 last:border-0">
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="break-words text-right text-sm text-foreground">{value}</span>
    </div>
  );
}

export interface ResendEmailDrawerProps {
  /** Email id (or domain id) to drill into; null = closed. */
  recordId: string | null;
  open: boolean;
  onClose: () => void;
  /** Optional title hint from the clicked row (subject / domain name). */
  titleHint?: string | null;
}

export function ResendEmailDrawer({
  recordId,
  open,
  onClose,
  titleHint,
}: ResendEmailDrawerProps): React.ReactElement {
  const enabled = open && !!recordId;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['infra', 'resend', 'detail', recordId],
    queryFn: () => getInfraResendDetail(recordId!),
    enabled,
    staleTime: 30_000,
  });

  const success = data && data.ok ? data : undefined;
  const email = success && 'email' in success ? success.email : undefined;
  const timeline = success && 'timeline' in success ? success.timeline : [];
  const domain = success && 'domain' in success ? success.domain : undefined;
  const dnsRecords = success && 'dns_records' in success ? success.dns_records : [];
  const showError = isError || (data && data.ok === false);
  const errorMsg = data && data.ok === false ? data.error : undefined;

  const title = email?.subject ?? domain?.name ?? titleHint ?? 'Chi tiết';

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="pb-4">
          <SheetTitle className="break-words pr-6">{title}</SheetTitle>
          {email?.from && (
            <SheetDescription className="break-words font-mono text-xs">
              từ {email.from}
            </SheetDescription>
          )}
        </SheetHeader>

        {showError && (
          <ErrorBlock
            compact
            message={errorMsg ?? 'Không tải được chi tiết.'}
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="space-y-2 pt-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted/30" />
            ))}
          </div>
        )}

        {/* EMAIL view */}
        {email && !isLoading && (
          <div className="space-y-5">
            <div className="rounded-md border border-border bg-card/60 px-3 py-1">
              <StatLine label="Người nhận" value={email.to ?? '—'} />
              {email.last_event && (
                <StatLine
                  label="Trạng thái"
                  value={
                    <InfraStatusPill
                      label={email.last_event}
                      tone={eventTone(email.last_event)}
                    />
                  }
                />
              )}
              <StatLine label="Thời gian" value={formatDateOrEmpty(email.created_at)} />
            </div>

            {/* Delivery timeline */}
            {timeline.length > 0 && (
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Hành trình gửi
                </p>
                <ol className="space-y-1">
                  {timeline.map((t, i) => (
                    <li
                      key={`${t.event}-${i}`}
                      className="flex items-baseline justify-between gap-2 rounded border border-border/60 bg-card/60 px-2.5 py-1.5 text-[11px]"
                    >
                      <InfraStatusPill label={t.event} tone={eventTone(t.event)} />
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                        {t.at ? formatDateOrEmpty(t.at) : '—'}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Body preview */}
            {(email.text || email.html) && (
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Nội dung (xem trước)
                </p>
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border/60 bg-card/60 px-3 py-2 text-[11px] text-foreground/90">
                  {email.text ?? email.html}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* DOMAIN / DNS view (drill-down reuse) */}
        {domain && !isLoading && (
          <div className="space-y-5">
            <div className="rounded-md border border-border bg-card/60 px-3 py-1">
              {domain.status && (
                <StatLine
                  label="Xác minh"
                  value={
                    <InfraStatusPill
                      label={domain.status}
                      tone={domainStatusTone(domain.status)}
                    />
                  }
                />
              )}
              {domain.region && <StatLine label="Vùng" value={domain.region} />}
              <StatLine label="Tạo lúc" value={formatDateOrEmpty(domain.created_at)} />
            </div>

            {dnsRecords.length > 0 && (
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Bản ghi DNS ({dnsRecords.length})
                </p>
                <div className="space-y-1.5">
                  {dnsRecords.map((r, i) => (
                    <div
                      key={`${r.record ?? r.type ?? 'rec'}-${i}`}
                      className="rounded border border-border/60 bg-card/60 px-2.5 py-2 text-[11px]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-semibold text-foreground">
                          {r.record ?? r.type ?? '—'}
                          {r.type && r.record && (
                            <span className="ml-1 font-normal text-muted-foreground">
                              · {r.type}
                            </span>
                          )}
                        </span>
                        {r.status && (
                          <InfraStatusPill label={r.status} tone={dnsStatusTone(r.status)} />
                        )}
                      </div>
                      {r.name && (
                        <div className="mt-1 break-all font-mono text-[10px] text-muted-foreground">
                          <span className="text-foreground/70">name:</span> {r.name}
                        </div>
                      )}
                      {r.value && (
                        <div className="mt-0.5 break-all font-mono text-[10px] text-muted-foreground">
                          <span className="text-foreground/70">value:</span> {r.value}
                        </div>
                      )}
                      {r.priority != null && (
                        <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                          <span className="text-foreground/70">priority:</span> {r.priority}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
