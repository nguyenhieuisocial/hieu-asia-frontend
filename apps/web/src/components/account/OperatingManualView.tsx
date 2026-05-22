'use client';

/**
 * Renders the Personal Operating Manual (POM).
 *
 * Two visual modes:
 *  - `embedded`: rendered inside the /account tab (no print bar, no header card).
 *  - `page` (default): full-page printable view used at /account/operating-manual.
 *
 * Print CSS lives next to the component (a `<style jsx global>` block) so the
 * `.pom-print-root` class controls the printable region — nav/footer outside
 * the root are hidden when printing.
 */

import * as React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Compass,
  Download,
  Link2,
  Printer,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import {
  buildOperatingManual,
  countManualInputs,
  serializeManualMarkdown,
  type OperatingManual,
  type ManualSection,
} from '@/lib/operating-manual';

export interface OperatingManualViewProps {
  /** When true, hides the action bar + adopts compact spacing for the /account tab. */
  embedded?: boolean;
}

export function OperatingManualView({ embedded = false }: OperatingManualViewProps) {
  const [hydrated, setHydrated] = React.useState(false);
  const [manual, setManual] = React.useState<OperatingManual | null>(null);
  const [inputs, setInputs] = React.useState<ReturnType<typeof countManualInputs> | null>(null);
  const [shareCopied, setShareCopied] = React.useState(false);

  React.useEffect(() => {
    setManual(buildOperatingManual());
    setInputs(countManualInputs());
    setHydrated(true);
  }, []);

  const handlePrint = React.useCallback(() => {
    if (typeof window !== 'undefined') window.print();
  }, []);

  const handleExportMarkdown = React.useCallback(() => {
    if (!manual) return;
    const md = serializeManualMarkdown(manual);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const fname = `so-tay-ca-nhan-${manual.generatedAt.slice(0, 10)}.md`;
    a.href = url;
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [manual]);

  /**
   * Share via hash-encoded payload — no server storage. The recipient opens
   * the same URL and the page decodes the manual from `#m=...`. Keeps things
   * fully offline; UTF-8-safe via TextEncoder + base64.
   */
  const handleShare = React.useCallback(async () => {
    if (!manual || typeof window === 'undefined') return;
    try {
      const json = JSON.stringify(manual);
      const bytes = new TextEncoder().encode(json);
      // Convert bytes → binary string → base64. Chunked to avoid call-stack blowups.
      let bin = '';
      const CHUNK = 0x8000;
      for (let i = 0; i < bytes.length; i += CHUNK) {
        bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
      }
      const b64 = btoa(bin)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      const url = `${window.location.origin}/account/operating-manual#m=${b64}`;
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2200);
    } catch {
      /* clipboard blocked — silently ignore */
    }
  }, [manual]);

  // SSR pre-hydrate placeholder.
  if (!hydrated) {
    return (
      <div className="space-y-6" aria-hidden="true">
        <div className="h-8 w-48 animate-pulse rounded bg-cream/10" />
        <div className="h-32 w-full animate-pulse rounded bg-cream/5" />
        <div className="h-32 w-full animate-pulse rounded bg-cream/5" />
      </div>
    );
  }

  // Empty state — not enough data to synthesize.
  if (!manual || !inputs) {
    return <EmptyState inputs={inputs} embedded={embedded} />;
  }

  return (
    <div className={embedded ? 'space-y-6' : 'space-y-8'}>
      {!embedded && <PrintCSS />}

      {!embedded && (
        <ActionBar
          onPrint={handlePrint}
          onExport={handleExportMarkdown}
          onShare={handleShare}
          shareCopied={shareCopied}
        />
      )}

      <article
        className={
          'pom-print-root mx-auto w-full ' +
          (embedded ? '' : 'max-w-3xl rounded-2xl border border-cream/10 bg-ink/40 p-6 sm:p-10')
        }
      >
        <ManualHeader manual={manual} embedded={embedded} />

        <div className={embedded ? 'mt-6 space-y-6' : 'mt-8 space-y-8'}>
          {manual.sections.map((s) => (
            <SectionBlock key={s.id} section={s} />
          ))}
        </div>

        {!embedded && (
          <footer className="mt-12 border-t border-cream/10 pt-6 text-xs leading-relaxed text-cream/55">
            Sổ tay này được tổng hợp từ dữ liệu chính bạn nhập trên hieu.asia.
            Không có AI sinh nội dung — đây là lời của bạn được sắp xếp lại.
            Dữ liệu lưu trên trình duyệt; xoá cache trình duyệt sẽ mất.
          </footer>
        )}
      </article>

      {embedded && (
        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <Button asChild={false} variant="outline">
            <Link href="/account/operating-manual">Mở trang đầy đủ →</Link>
          </Button>
          <Button asChild={false} variant="ghost" onClick={handleExportMarkdown}>
            <Download className="mr-1.5 h-4 w-4" aria-hidden /> Xuất Markdown
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function ManualHeader({
  manual,
  embedded,
}: {
  manual: OperatingManual;
  embedded: boolean;
}) {
  const id = manual.identity;
  return (
    <header className={embedded ? '' : 'border-b border-gold/15 pb-6'}>
      <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
        Sổ tay cá nhân
      </p>
      <h1
        className={
          'mt-2 font-heading font-bold leading-tight text-cream ' +
          (embedded ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl')
        }
      >
        {id.displayName ? (
          <>
            <span className="text-cream/70">Vận hành của</span>{' '}
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              {id.displayName}
            </span>
          </>
        ) : (
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            Vận hành của bạn
          </span>
        )}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-cream/65">
        {id.birthDate && <span>Sinh {formatDateVN(id.birthDate)}</span>}
        {id.birthTime && <span>· {id.birthTime}</span>}
        {id.birthPlace && <span>· {id.birthPlace}</span>}
        {id.chartHash && (
          <Link
            href="/methodology/tu-vi"
            className="font-mono text-[11px] uppercase tracking-wider text-gold/85 hover:underline"
            title="Mã lá số — bấm để xem phương pháp đối chiếu"
          >
            #{id.chartHash}
          </Link>
        )}
        <span className="text-cream/40">·</span>
        <span>
          {manual.filledCount}/{manual.totalCount} mục có dữ liệu
        </span>
      </div>
    </header>
  );
}

function SectionBlock({ section }: { section: ManualSection }) {
  const empty = section.lines.length === 0;

  return (
    <section aria-labelledby={`sec-${section.id}`}>
      <h2
        id={`sec-${section.id}`}
        className="font-heading text-lg font-semibold text-cream sm:text-xl"
      >
        {section.title}
      </h2>

      {empty ? (
        <p className="mt-2 text-sm text-cream/55">
          Cần thêm dữ liệu —{' '}
          {section.emptyHref ? (
            <Link
              href={section.emptyHref}
              className="text-gold underline-offset-4 hover:underline"
            >
              {section.emptyLabel ?? 'bổ sung'}
            </Link>
          ) : (
            <span>chưa có nguồn dữ liệu phù hợp</span>
          )}
          .
        </p>
      ) : section.kind === 'list' ? (
        <ul className="mt-3 space-y-2.5">
          {section.lines.map((ln, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-cream/85"
            >
              <span
                aria-hidden
                className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70"
              />
              <ProseLine text={ln} />
            </li>
          ))}
        </ul>
      ) : section.kind === 'quotes' ? (
        <ul className="mt-3 space-y-3">
          {section.lines.map((ln, i) => (
            <li
              key={i}
              className="border-l-2 border-gold/60 pl-3 text-sm italic leading-relaxed text-cream/90 sm:text-base"
            >
              {ln}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-cream/85 sm:text-base">
          {section.lines.map((ln, i) => (
            <p key={i}>
              <ProseLine text={ln} />
            </p>
          ))}
        </div>
      )}
    </section>
  );
}

/** Render inline **bold** markers inside a line. Lightweight; no full MD. */
function ProseLine({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-cream">
              {p.slice(2, -2)}
            </strong>
          );
        }
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </>
  );
}

function ActionBar({
  onPrint,
  onExport,
  onShare,
  shareCopied,
}: {
  onPrint: () => void;
  onExport: () => void;
  onShare: () => void;
  shareCopied: boolean;
}) {
  return (
    <div
      className={[
        // Mobile: sticky bottom; desktop: floating top-right inside the page.
        'sticky bottom-4 z-30 mx-auto flex w-fit flex-wrap items-center justify-center gap-2',
        'rounded-full border border-gold/30 bg-ink/85 px-2 py-2 shadow-lg backdrop-blur',
        'sm:fixed sm:right-6 sm:top-24 sm:bottom-auto sm:mx-0 sm:flex-col sm:items-stretch sm:gap-1.5 sm:rounded-2xl sm:px-2',
        'print:hidden',
      ].join(' ')}
      role="toolbar"
      aria-label="Hành động trên sổ tay"
    >
      <Button size="sm" variant="ghost" onClick={onPrint} className="gap-1.5">
        <Printer className="h-4 w-4" aria-hidden /> In ra giấy
      </Button>
      <Button size="sm" variant="ghost" onClick={onExport} className="gap-1.5">
        <Download className="h-4 w-4" aria-hidden /> Xuất Markdown
      </Button>
      <Button size="sm" variant="ghost" onClick={onShare} className="gap-1.5">
        <Link2 className="h-4 w-4" aria-hidden />
        {shareCopied ? 'Đã chép link' : 'Chia sẻ link'}
      </Button>
    </div>
  );
}

function EmptyState({
  inputs,
  embedded,
}: {
  inputs: ReturnType<typeof countManualInputs> | null;
  embedded: boolean;
}) {
  const checks: Array<{ done: boolean; label: string; href: string; hint?: string }> = inputs
    ? [
        {
          done: inputs.profileComplete,
          label: 'Lá số đã lưu (ngày sinh + giới tính)',
          href: '/account?tab=chart',
          hint: 'Vào tab "Lá số của tôi" để bổ sung',
        },
        {
          done: inputs.decisions >= 3,
          label: `3+ Decision Briefs (hiện ${inputs.decisions})`,
          href: '/decisions/new',
        },
        {
          done: inputs.weekly >= 1,
          label: `1+ Weekly Review (hiện ${inputs.weekly})`,
          href: '/weekly-review',
        },
      ]
    : [];

  const total = inputs?.total ?? 0;

  return (
    <div className={embedded ? 'space-y-5' : 'mx-auto max-w-2xl space-y-6 py-6'}>
      <div className="flex items-start gap-3">
        <BookOpen className="mt-1 h-6 w-6 shrink-0 text-gold/80" aria-hidden />
        <div>
          <h2
            className={
              'font-heading text-cream ' +
              (embedded ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl')
            }
          >
            Sổ tay cá nhân của bạn
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-cream/70">
            Khi bạn dùng đủ tính năng, hệ thống sẽ tổng hợp một trang giấy duy
            nhất — điểm mạnh, mẫu hình quyết định, nguyên tắc bạn đang vận hành
            theo. Không có AI sinh nội dung; chỉ là lời của bạn được sắp xếp lại.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Để tạo sổ tay, bạn cần:</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {checks.map((c, i) => (
              <li key={i} className="flex items-start gap-3">
                {c.done ? (
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-jade"
                    aria-hidden
                  />
                ) : (
                  <Circle
                    className="mt-0.5 h-5 w-5 shrink-0 text-cream/35"
                    aria-hidden
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={
                      'text-sm ' +
                      (c.done ? 'text-cream/65 line-through' : 'text-cream/90')
                    }
                  >
                    {c.label}
                  </p>
                  {!c.done && (
                    <Link
                      href={c.href}
                      className="text-xs text-gold underline-offset-4 hover:underline"
                    >
                      {c.hint ?? 'Bắt đầu →'}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center gap-3 rounded-md border border-cream/10 bg-ink/40 px-4 py-3">
            <Compass className="h-4 w-4 text-gold/80" aria-hidden />
            <p className="text-xs text-cream/70">
              Tiến độ tổng: <strong className="text-cream">{total}/3</strong> bản ghi
              (cần tối thiểu 3 để bắt đầu).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/** Print CSS — only applied on the full-page view. Scoped to .pom-print-root. */
const PRINT_CSS = `
@media print {
  /* Belt-and-suspenders: nav/footer markers from SiteNav/SiteFooter. */
  header[role='banner'],
  nav[aria-label='Chính'],
  footer[role='contentinfo'],
  .print\\:hidden {
    display: none !important;
  }
  /* Hide siblings of the print root so only the manual prints. */
  body > *:not(.pom-print-wrapper) {
    display: none !important;
  }
  .pom-print-wrapper {
    background: white !important;
  }
  .pom-print-root {
    max-width: none !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    background: white !important;
    color: #111 !important;
  }
  .pom-print-root * {
    color: #111 !important;
    background: transparent !important;
    border-color: #ccc !important;
  }
  .pom-print-root a {
    color: #444 !important;
    text-decoration: none !important;
  }
  .pom-print-root .bg-gold-gradient {
    background: none !important;
    -webkit-text-fill-color: #8a6a18 !important;
    color: #8a6a18 !important;
  }
  @page {
    margin: 18mm 14mm;
  }
}
`;

function PrintCSS() {
  return <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />;
}

// ---------------------------------------------------------------------------
// Helpers (local)
// ---------------------------------------------------------------------------

function formatDateVN(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}
