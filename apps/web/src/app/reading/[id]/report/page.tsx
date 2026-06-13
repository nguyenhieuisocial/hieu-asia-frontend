'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import {
  Button,
  Card,
  CardContent,
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@hieu-asia/ui';
import { MoreVertical, Share2, Download, MessageCircle } from 'lucide-react';
import {
  getReading,
  type ApiClientError,
  type Reading,
} from '@/lib/api-client';
import { CautionBanner } from '@/components/caution-banner';
import { ReportContextSummary } from '@/components/report-context-summary';
import { ResultDisclaimer } from '@/components/ResultDisclaimer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ReportSkeleton } from '@/components/skeletons/ReportSkeleton';
import { TuViChartSection } from '@/components/tuvi/TuViChartSection';
import { SectionFeedback } from '@/components/report/SectionFeedback';
import { ProductTabs, type ProductTab } from '@/components/product/ProductTabs';
import { ReportTOC } from '@/components/report/ReportTOC';
import { ReadingProgress } from '@/components/report/ReadingProgress';
import { PostReadingSurvey } from '@/components/feedback/PostReadingSurvey';
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
      {/* Wave UX — thanh tiến độ đọc (scroll-driven). Chỉ render khi báo cáo
          đã sẵn sàng (nhánh này), tránh hiển thị trên trạng thái lỗi/loading. */}
      <ReadingProgress />
      <header className="mb-6 flex items-center justify-between">
        <Link
          href="/account"
          className="text-sm text-muted-foreground hover:text-gold"
        >
          ← Tài khoản
        </Link>
        <span className="font-heading text-lg text-gold">hieu.asia</span>
      </header>

      <div className="space-y-6">
        {/* Wave 52.1 — per-report disclaimer at top of report (BUG-018). */}
        <ResultDisclaimer />

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

      {/*
        Wave 60.95.w — replaces deferred "5-user moderated UX test" (Vault
        130 P1) with PostHog Surveys. Lightweight 3-CTA toast arms 30s
        after report mount. Production-only by default (skipped in dev/
        preview to avoid spam). Supersedes the Wave 39 W-B <SurveyPrompt>
        mount at this location; the dashboard-driven `SurveyPrompt` is
        still used on /account for the NPS + Feature Request surveys.
      */}
      <PostReadingSurvey readingId={readingId} />
    </main>
  );
}

function ReportSections({ sections }: { sections: MarkdownSection[] }) {
  // Wave 60.58 T1.3 — ad-hoc tablist + parallel mobile accordion replaced
  // by shared <ProductTabs> (Radix Tabs desktop + Accordion mobile from a
  // single source of truth). Section ordering and per-section feedback are
  // preserved; ProductTabs handles active state, keyboard a11y, and the
  // responsive desktop/mobile branching.
  const tabs = React.useMemo<ProductTab[]>(
    () =>
      sections.map((s) => {
        const sectionId = `reading-${slugifySectionId(s.title)}`;
        return {
          id: sectionId,
          label: s.title,
          content: (
            <div className="space-y-4">
              <SectionBody content={s.body} />
              <SectionFeedback sectionId={sectionId} />
            </div>
          ),
        };
      }),
    [sections],
  );

  const [activeSection, setActiveSection] = React.useState(tabs[0]?.id ?? '');

  // Keep a valid active section if the report content changes under us.
  React.useEffect(() => {
    if (tabs.length && !tabs.some((t) => t.id === activeSection)) {
      setActiveSection(tabs[0]!.id);
    }
  }, [tabs, activeSection]);

  const tocItems = React.useMemo(
    () => tabs.map((t) => ({ id: t.id, label: t.label })),
    [tabs],
  );

  const handleSelect = React.useCallback((id: string) => {
    setActiveSection(id);
    // Defer the scroll until the accordion open/close + sheet close animations
    // have settled, otherwise the target's position shifts mid-scroll.
    window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 380);
  }, []);

  if (!sections.length) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Báo cáo trống — vui lòng thử tạo lại.
      </p>
    );
  }

  return (
    <>
      <ProductTabs
        tabs={tabs}
        value={activeSection}
        onValueChange={setActiveSection}
      />
      <ReportTOC
        items={tocItems}
        activeId={activeSection}
        onSelect={handleSelect}
      />
    </>
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
          // Cổ thư / phương pháp: dòng nghiêng "_Đối chiếu: …_" / "_Theo: …_"
          // (định dạng do reading-orchestrate yêu cầu AI ghi) → khối trích dẫn nổi bật.
          em: ({ children, ...props }) => {
            const text = React.Children.toArray(children)
              .map((c) => (typeof c === 'string' ? c : ''))
              .join('');
            const m = /^\s*(Đối chiếu|Theo)\s*:\s*([\s\S]+?)\s*$/.exec(text);
            if (m) {
              const classic = m[1] === 'Đối chiếu';
              return (
                <span className="mt-2 flex flex-col gap-0.5 border-l-2 border-gold/60 bg-gold/5 px-3 py-2 not-italic">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold/80">
                    {classic ? 'Đối chiếu cổ thư' : 'Phương pháp luận hieu.asia'}
                  </span>
                  <span className="italic text-foreground/75">{m[2]}</span>
                </span>
              );
            }
            return <em {...props}>{children}</em>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

type PdfState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'done'; url: string };

function ReportFooter({ readingId }: { readingId: string }) {
  const [copied, setCopied] = React.useState(false);
  const [pdfState, setPdfState] = React.useState<PdfState>({ status: 'idle' });

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const onExportPdf = async () => {
    if (pdfState.status === 'loading') return;

    // If we already have a URL from a previous successful call, open it.
    if (pdfState.status === 'done') {
      window.open(pdfState.url, '_blank', 'noopener');
      return;
    }

    setPdfState({ status: 'loading' });

    try {
      // Grab Supabase access token from the auth client (may be null for anon).
      let accessToken: string | null = null;
      try {
        const { getSupabaseAuth } = await import('@/lib/auth-client');
        const supabase = getSupabaseAuth();
        if (supabase) {
          const { data } = await supabase.auth.getSession();
          accessToken = data.session?.access_token ?? null;
        }
      } catch {
        /* auth client unavailable — proceed, worker will 401 */
      }

      const headers: Record<string, string> = {
        'content-type': 'application/json',
      };
      if (accessToken) {
        headers['authorization'] = `Bearer ${accessToken}`;
      }

      const res = await fetch(
        `/api/reading/${encodeURIComponent(readingId)}/export-pdf`,
        {
          method: 'POST',
          headers,
          cache: 'no-store',
        },
      );

      if (res.status === 402 || res.status === 403) {
        setPdfState({
          status: 'error',
          message: 'Mở khoá báo cáo trả phí để tải PDF chất lượng cao.',
        });
        return;
      }

      if (res.status === 401) {
        setPdfState({
          status: 'error',
          message: 'Vui lòng đăng nhập để tải PDF.',
        });
        return;
      }

      if (!res.ok) {
        let errMsg = 'Tạo PDF thất bại, vui lòng thử lại.';
        try {
          const body = (await res.json()) as { error?: string };
          if (body.error) errMsg = body.error;
        } catch {
          /* ignore parse error */
        }
        setPdfState({ status: 'error', message: errMsg });
        return;
      }

      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!data.ok || !data.url) {
        setPdfState({
          status: 'error',
          message: data.error ?? 'Không nhận được link PDF.',
        });
        return;
      }

      setPdfState({ status: 'done', url: data.url });
      track('pdf_exported', { reading_id: readingId });
      window.open(data.url, '_blank', 'noopener');
    } catch {
      setPdfState({
        status: 'error',
        message: 'Lỗi kết nối, vui lòng thử lại.',
      });
    }
  };

  const pdfLabel =
    pdfState.status === 'loading'
      ? 'Đang tạo PDF…'
      : pdfState.status === 'done'
        ? 'Mở PDF'
        : 'Tải PDF báo cáo';

  return (
    <div className="border-t border-gold/15 pt-6 print:hidden">
      {/* Error / upsell message */}
      {pdfState.status === 'error' && (
        <p className="mb-3 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-sm text-foreground/80">
          {pdfState.message}
        </p>
      )}

      {/* Mobile (<lg): collapse the 3 actions into a Material 3 bottom-sheet.
          Avoids the awkward wrap on <360 px screens where buttons collide. */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-center gap-2">
              <MoreVertical className="size-4" aria-hidden="true" />
              Tác vụ báo cáo
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="rounded-t-card-editorial"
          >
            <SheetTitle className="sr-only">Tác vụ báo cáo</SheetTitle>
            <div className="flex flex-col gap-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Button
                variant="ghost"
                onClick={onShare}
                className="h-14 justify-start gap-3 text-base"
              >
                <Share2 className="size-5" aria-hidden="true" />
                {copied ? 'Đã chép link' : 'Chia sẻ báo cáo'}
              </Button>
              <Button
                variant="ghost"
                onClick={onExportPdf}
                disabled={pdfState.status === 'loading'}
                className="h-14 justify-start gap-3 text-base"
              >
                <Download className="size-5" aria-hidden="true" />
                {pdfLabel}
              </Button>
              <Button asChild className="h-14 justify-start gap-3 text-base">
                <Link href={`/reading/${readingId}/mentor`}>
                  <MessageCircle className="size-5" aria-hidden="true" />
                  Chat với Mentor
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop (lg+): existing inline row. */}
      <div className="hidden lg:flex lg:items-center lg:justify-between">
        <Button
          variant="outline"
          onClick={onExportPdf}
          disabled={pdfState.status === 'loading'}
        >
          {pdfLabel}
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
    </div>
  );
}
