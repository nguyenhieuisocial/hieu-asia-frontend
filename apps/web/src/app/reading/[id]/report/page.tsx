'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { Button, Card, CardContent, cn } from '@hieu-asia/ui';
import {
  getReading,
  type ApiClientError,
  type Reading,
} from '@/lib/api-client';
import { CautionBanner } from '@/components/caution-banner';
import { ReportContextSummary } from '@/components/report-context-summary';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ReportSkeleton } from '@/components/skeletons/ReportSkeleton';
import { TuViChartSection } from '@/components/tuvi/TuViChartSection';
import { SectionFeedback } from '@/components/report/SectionFeedback';
import { track } from '@/lib/analytics';

/** Slugify Vietnamese section title for a stable, URL-safe sectionId. */
function slugifySectionId(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Parsed H2 section of the report markdown. */
interface MarkdownSection {
  title: string;
  body: string;
  isCaution: boolean;
}

/**
 * Split a Markdown blob into sections keyed by H2 headings.
 *
 * The backend report contract guarantees 9 `## ` headings; we tolerate
 * extra/missing sections gracefully and skip any preamble before the first H2.
 */
function parseMarkdownSections(markdown: string): MarkdownSection[] {
  if (!markdown) return [];
  const lines = markdown.split(/\r?\n/);
  const sections: MarkdownSection[] = [];
  let current: MarkdownSection | null = null;

  for (const line of lines) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match && match[1]) {
      if (current) sections.push(current);
      const title = match[1].trim();
      current = {
        title,
        body: '',
        isCaution: /cảnh báo|caution/i.test(title),
      };
      continue;
    }
    if (current) {
      current.body += (current.body ? '\n' : '') + line;
    }
  }
  if (current) sections.push(current);
  return sections.map((s) => ({ ...s, body: s.body.trim() }));
}

/** Extract caution bullets from a section body (handles `-`, `*`, `•`, `1.`). */
function extractCautionBullets(body: string): string[] {
  if (!body) return [];
  return body
    .split(/\r?\n+/)
    .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter(Boolean);
}

export default function ReportPage() {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<ReportSkeleton />}>
        <ReportContent />
      </React.Suspense>
    </ErrorBoundary>
  );
}

function ReportContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const readingId = params?.id ?? '';

  const query = useQuery<Reading | null, ApiClientError>({
    queryKey: ['reading', readingId],
    queryFn: () => getReading(readingId),
    enabled: !!readingId,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const session = query.data;
  const state = session?.state;
  const markdown = session?.report?.markdown ?? '';

  React.useEffect(() => {
    if (!state) return;
    if (state !== 'report_ready' && !state.startsWith('error_at_')) {
      router.replace(`/reading/${readingId}/processing`);
    }
  }, [state, readingId, router]);

  const reportTrackedRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (state === 'report_ready' && markdown && reportTrackedRef.current !== readingId) {
      reportTrackedRef.current = readingId;
      track('report_viewed', { reading_id: readingId, section_count: markdown.match(/^##\s+/gm)?.length ?? 0 });
    }
  }, [state, markdown, readingId]);

  const sections = React.useMemo(
    () => parseMarkdownSections(markdown),
    [markdown],
  );
  const cautionSection = sections.find((s) => s.isCaution);
  const reportSections = sections.filter((s) => !s.isCaution);
  const cautionFlags = cautionSection
    ? extractCautionBullets(cautionSection.body)
    : [];

  if (query.isLoading) return <ReportSkeleton />;

  // Not ready yet (e.g. still pending) or fetch error.
  if (!markdown || state !== 'report_ready') {
    const errMessage =
      query.error?.message ??
      (state && state.startsWith('error_at_')
        ? `Phân tích thất bại ở bước "${state.replace('error_at_', '')}".`
        : 'Báo cáo chưa sẵn sàng, vui lòng đợi…');
    return (
      <main className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <Card>
          <CardContent className="space-y-4 p-8">
            <p className="font-heading text-lg text-foreground">
              Chưa có báo cáo để hiển thị
            </p>
            <p className="text-sm text-muted-foreground">{errMessage}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => query.refetch()}>Thử lại</Button>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/reading/${readingId}/processing`)
                }
              >
                Xem tiến trình
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-gold"
        >
          ← Bảng điều khiển
        </Link>
        <span className="font-heading text-lg text-gold">hieu.asia</span>
      </header>

      <div className="space-y-6">
        <ReportContextSummary
          displayName={(session?.inputs?.display_name as string) ?? 'Bạn'}
          role={(session?.inputs?.role as string) ?? 'Người dùng'}
          primaryConcern={
            (session?.inputs?.primary_concern as string) ??
            'Báo cáo cá nhân hóa'
          }
          generatedAt={new Date().toLocaleDateString('vi-VN')}
        />

        {/* Interactive 12-cung chart — fetches deterministic structure from
            the Tử Vi engine before the AI narrative below. Skips silently if
            inputs aren't sufficient. */}
        <TuViChartSection
          birthDate={(session?.inputs?.birth_date as string | null | undefined) ?? null}
          birthTime={(session?.inputs?.birth_time as string | null | undefined) ?? null}
          gender={(session?.inputs?.gender as string | null | undefined) ?? null}
        />

        <CautionBanner flags={cautionFlags} />

        <ReportSections sections={reportSections} />

        <ReportFooter readingId={readingId} />
      </div>
    </main>
  );
}

function ReportSections({ sections }: { sections: MarkdownSection[] }) {
  const [active, setActive] = React.useState<string | null>(
    sections[0]?.title ?? null,
  );

  if (!sections.length) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Báo cáo trống — vui lòng thử tạo lại.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <nav
        role="tablist"
        aria-label="Mục báo cáo"
        className="hidden flex-wrap gap-2 border-b border-gold/15 pb-3 md:flex"
      >
        {sections.map((s) => (
          <button
            key={s.title}
            role="tab"
            aria-selected={active === s.title}
            onClick={() => setActive(s.title)}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active === s.title
                ? 'bg-gold/15 text-gold'
                : 'text-muted-foreground hover:bg-gold/5 hover:text-foreground',
            )}
          >
            {s.title}
          </button>
        ))}
      </nav>

      <div className="space-y-3 md:hidden">
        {sections.map((s) => {
          const open = active === s.title;
          return (
            <div
              key={s.title}
              className="rounded-md border border-gold/15 bg-card/40"
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setActive(open ? null : s.title)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span
                  className={cn(
                    'text-sm font-medium',
                    open ? 'text-gold' : 'text-foreground/80',
                  )}
                >
                  {s.title}
                </span>
                <span aria-hidden className="text-gold/60">
                  {open ? '▾' : '▸'}
                </span>
              </button>
              {open && (
                <div className="border-t border-gold/10 p-4">
                  <SectionBody content={s.body} />
                  <SectionFeedback sectionId={`reading-${slugifySectionId(s.title)}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden md:block" role="tabpanel">
        {active && (
          <ActiveDesktopSection
            section={sections.find((s) => s.title === active)}
          />
        )}
      </div>
    </div>
  );
}

function ActiveDesktopSection({ section }: { section: MarkdownSection | undefined }) {
  if (!section) return null;
  return (
    <div className="space-y-4">
      <SectionBody content={section.body} />
      <SectionFeedback sectionId={`reading-${slugifySectionId(section.title)}`} />
    </div>
  );
}

function SectionBody({ content }: { content: string }) {
  return (
    <article className="markdown-report space-y-3 text-sm leading-relaxed text-foreground/90">
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => (
            <h2
              className="mt-4 font-heading text-xl text-gold"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h3
              className="mt-3 font-heading text-lg text-foreground"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h4
              className="mt-3 font-heading text-base text-foreground"
              {...props}
            />
          ),
          p: ({ ...props }) => <p className="leading-relaxed" {...props} />,
          ul: ({ ...props }) => (
            <ul className="ml-5 list-disc space-y-1" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="ml-5 list-decimal space-y-1" {...props} />
          ),
          strong: ({ ...props }) => (
            <strong className="text-gold" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

function ReportFooter({ readingId }: { readingId: string }) {
  const [copied, setCopied] = React.useState(false);

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col gap-3 border-t border-gold/15 pt-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
      <Button variant="outline" onClick={() => window.print()}>
        Tải PDF báo cáo
      </Button>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onShare}>
          {copied ? 'Đã chép link' : 'Chia sẻ'}
        </Button>
        <Button asChild={false}>
          <Link href={`/reading/${readingId}/mentor`}>
            Bắt đầu chat với Mentor →
          </Link>
        </Button>
      </div>
    </div>
  );
}
