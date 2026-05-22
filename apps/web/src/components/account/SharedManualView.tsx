'use client';

/**
 * Read-only renderer for a manual decoded from a `#m=...` share link.
 * Trusts the payload shape (already shape-checked at the caller); renders
 * with a clear "shared by another user" banner.
 */

import * as React from 'react';
import Link from 'next/link';
import { Eye, Printer } from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import type { OperatingManual, ManualSection } from '@/lib/operating-manual';

export function SharedManualView({ manual }: { manual: OperatingManual }) {
  const handlePrint = React.useCallback(() => {
    if (typeof window !== 'undefined') window.print();
  }, []);

  const id = manual.identity;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-lg border border-jade/30 bg-jade/[0.06] p-4 print:hidden">
        <Eye className="mt-0.5 h-5 w-5 shrink-0 text-jade" aria-hidden />
        <div className="text-sm leading-relaxed text-foreground/85">
          <p>
            Bạn đang xem <strong className="font-semibold">sổ tay cá nhân được chia sẻ</strong>
            {id.displayName ? ` từ ${id.displayName}` : ''}. Đây là phiên bản
            chỉ đọc — nội dung không được lưu vào tài khoản của bạn.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Để tạo sổ tay của riêng bạn,{' '}
            <Link
              href="/account/operating-manual"
              className="text-gold underline-offset-4 hover:underline"
              onClick={(e) => {
                // Strip the hash so the view reloads in "own data" mode.
                if (typeof window !== 'undefined') {
                  e.preventDefault();
                  window.location.assign('/account/operating-manual');
                }
              }}
            >
              mở phiên bản của bạn
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <Button size="sm" variant="outline" onClick={handlePrint}>
          <Printer className="mr-1.5 h-4 w-4" aria-hidden /> In ra giấy
        </Button>
      </div>

      <article className="pom-print-root mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card/40 p-6 sm:p-10">
        <header className="border-b border-gold/15 pb-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Sổ tay cá nhân (chia sẻ)
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {id.displayName ? (
              <>
                <span className="text-muted-foreground">Vận hành của</span>{' '}
                <span className="bg-gold-gradient bg-clip-text text-transparent">
                  {id.displayName}
                </span>
              </>
            ) : (
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                Vận hành cá nhân
              </span>
            )}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {id.birthDate && <span>Sinh {formatDateVN(id.birthDate)}</span>}
            {id.chartHash && (
              <span className="font-mono text-[11px] uppercase tracking-wider text-gold/85">
                #{id.chartHash}
              </span>
            )}
            <span className="text-foreground/40">·</span>
            <span>
              {manual.filledCount}/{manual.totalCount} mục có dữ liệu
            </span>
          </div>
        </header>

        <div className="mt-8 space-y-8">
          {manual.sections.map((s) => (
            <SectionReadonly key={s.id} section={s} />
          ))}
        </div>

        <footer className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          Nội dung được mã hoá trong link chia sẻ — không lưu trên máy chủ
          hieu.asia.
        </footer>
      </article>
    </div>
  );
}

function SectionReadonly({ section }: { section: ManualSection }) {
  if (section.lines.length === 0) return null;
  return (
    <section>
      <h2 className="font-heading text-lg font-semibold text-foreground sm:text-xl">
        {section.title}
      </h2>
      {section.kind === 'quotes' ? (
        <ul className="mt-3 space-y-3">
          {section.lines.map((ln, i) => (
            <li
              key={i}
              className="border-l-2 border-gold/60 pl-3 text-sm italic leading-relaxed text-foreground/90 sm:text-base"
            >
              {ln}
            </li>
          ))}
        </ul>
      ) : section.kind === 'list' ? (
        <ul className="mt-3 space-y-2.5">
          {section.lines.map((ln, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85"
            >
              <span
                aria-hidden
                className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70"
              />
              <ProseLine text={ln} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/85 sm:text-base">
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

function ProseLine({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {p.slice(2, -2)}
            </strong>
          );
        }
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </>
  );
}

function formatDateVN(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}
